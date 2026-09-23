import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  FaPlayCircle,
  FaUserCircle,
  FaStar,
} from 'react-icons/fa';

import {
  getTvSeriesById,
  getTvSeriesVideos,
  getTvSeriesCredits,
  getTvSeriesReviews,
  searchMoviesAndTv,
  getSimilarTvSeries,
  getTvSeriesByCategory,
  getTvSeriesByGenre,
  getTvSeriesGenres,
  createSlug,
} from '../../../lib/api';

import TvSeriesList from '../../../components/TvSeriesList';
import NativeAd from '../../../components/ads/NativeAd';

export const revalidate = 43200;
export const dynamicParams = true;

const CATEGORIES = ['popular', 'top_rated', 'on_the_air', 'airing_today'];

// ============================================
// UTILITY
// ============================================

const createGenreSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// ============================================
// RESOLVE TV SHOW
// ============================================
//
// Mendukung 3 format slug:
//
//  1. Pure ID          → /tv-show/12345
//  2. judul-tahun-id   → /tv-show/reacher-2022-108978   (khusus dari halaman actor)
//  3. judul-tahun      → /tv-show/reacher-2022          (dari halaman lain)
//
// ============================================

const resolveTvShowBySlug = cache(async (slug) => {
  const genres = await getTvSeriesGenres();
  const genreSlugMap = new Map(
    genres.map((genre) => [
      createGenreSlug(genre.name),
      { id: genre.id, name: genre.name },
    ])
  );

  const processedSlug = createGenreSlug(slug);

  // Skip genre & category
  if (genreSlugMap.has(processedSlug) || CATEGORIES.includes(slug)) {
    return null;
  }

  const slugParts = slug.split('-');
  const lastSeg = slugParts[slugParts.length - 1];

  // ---------------------------------------------------------
  // FORMAT 1: Pure numeric ID
  //   Contoh: /tv-show/108978
  // ---------------------------------------------------------
  if (slugParts.length === 1 && /^\d+$/.test(slug)) {
    try {
      const tv = await getTvSeriesById(parseInt(slug, 10));
      if (tv) return tv;
    } catch (err) {
      console.warn(
        'resolveTvShowBySlug FORMAT 1 gagal:',
        slug,
        err?.message
      );
    }
  }

  // ---------------------------------------------------------
  // FORMAT 2: judul-tahun-id atau judul-id
  //   Contoh:
  //     - reacher-2022-108978   (judul + tahun + id)
  //     - reacher-108978        (judul + id)
  //     - 2022-108978           (tahun + id, judul kosong)
  //
  //   Deteksi: segmen terakhir angka >= 5 digit.
  // ---------------------------------------------------------
  if (/^\d+$/.test(lastSeg) && lastSeg.length >= 5) {
    const id = parseInt(lastSeg, 10);
    try {
      const tv = await getTvSeriesById(id);
      if (tv) return tv;
    } catch (err) {
      console.warn(
        'resolveTvShowBySlug FORMAT 2 gagal getTvSeriesById:',
        id,
        err?.message
      );
    }
    // Jika gagal, jangan return null — lanjut ke fallback pencarian judul
  }

  // ---------------------------------------------------------
  // FORMAT 3: judul-tahun → cari berdasarkan judul via TMDB search
  //   Contoh: /tv-show/reacher-2022
  // ---------------------------------------------------------
  const lastPart = slugParts[slugParts.length - 1];
  const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;

  // Buang segmen ID (jika ada) sebelum mencari judul
  let titleParts = slugParts;
  if (
    titleParts.length >= 2 &&
    /^\d+$/.test(titleParts[titleParts.length - 1]) &&
    titleParts[titleParts.length - 1].length >= 5
  ) {
    // Buang segmen ID di akhir
    titleParts = titleParts.slice(0, -1);
  }

  // Buang tahun di akhir (jika ada)
  if (/^\d{4}$/.test(titleParts[titleParts.length - 1])) {
    titleParts = titleParts.slice(0, -1);
  }

  const titleSlug = titleParts.join('-');
  const searchQuery = titleSlug.replace(/-/g, ' ').trim();

  if (!searchQuery) {
    return null;
  }

  const searchResults = await searchMoviesAndTv(searchQuery);

  // ---------------------------------------------------------
  // Cocokkan hasil pencarian dengan 3 strategi
  // ---------------------------------------------------------

  // Strategi A: exact match dengan slug lengkap
  let found = searchResults.find((item) => {
    if (item.media_type !== 'tv') return false;
    const itemSlug = createSlug(item.name, item.first_air_date);
    return itemSlug === slug;
  });

  // Strategi B: cocokkan tanpa tahun
  if (!found) {
    found = searchResults.find((item) => {
      if (item.media_type !== 'tv') return false;
      const itemSlugNoYear = createSlug(item.name, null);
      return itemSlugNoYear === titleSlug;
    });
  }

  // Strategi C: normalisasi (abaikan tanda baca & aksen)
  if (!found) {
    const normalizedSlug = titleSlug.replace(/-/g, '').toLowerCase();
    found = searchResults.find((item) => {
      if (item.media_type !== 'tv') return false;
      const normalizedName = item.name
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      return normalizedName === normalizedSlug;
    });
  }

  // Strategi D (fallback terakhir): ambil TV show pertama dari hasil pencarian
  if (!found) {
    found = searchResults.find((item) => item.media_type === 'tv');
  }

  // ---------------------------------------------------------
  // Jika ketemu, ambil detail lengkap via getTvSeriesById
  // ---------------------------------------------------------
  if (found) {
    try {
      return await getTvSeriesById(found.id);
    } catch (err) {
      console.warn(
        'resolveTvShowBySlug gagal getTvSeriesById hasil pencarian:',
        found.id,
        err?.message
      );
      return null;
    }
  }

  return null;
});

// ============================================
// generateStaticParams (TIDAK DIUBAH)
// ============================================

export async function generateStaticParams() {
  try {
    const popularTv = await getTvSeriesByCategory('popular');
    return (popularTv || [])
      .slice(0, 20)
      .map((show) => {
        const slug = createSlug(show.name, show.first_air_date);
        return slug ? { slug } : null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error(
      'Gagal generate static params untuk TV show:',
      error
    );
    return [];
  }
}

// ============================================
// generateMetadata (TIDAK DIUBAH)
// ============================================

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const genres = await getTvSeriesGenres();
  const genreSlugMap = new Map(
    genres.map((genre) => [
      createGenreSlug(genre.name),
      { id: genre.id, name: genre.name },
    ])
  );
  const processedSlug = createGenreSlug(slug);

  // Genre
  if (genreSlugMap.has(processedSlug)) {
    const genre = genreSlugMap.get(processedSlug);
    return {
      title: `WatchFullMovie - ${genre.name} TV Series`,
      description: `Explore ${genre.name.toLowerCase()} TV series on WatchFullMovie and discover legal streaming options, including free services when available in your region.`,
      keywords: [
        `${genre.name.toLowerCase()} TV series`,
        `watch ${genre.name.toLowerCase()} TV shows free`,
        'watch free TV shows legally',
        'stream free legally',
        'legal streaming guide',
        'where to watch TV shows',
      ],
      robots: { index: true, follow: true },
    };
  }

  // Category
  if (CATEGORIES.includes(slug)) {
    const categoryName = slug
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return {
      title: `WatchFullMovie - ${categoryName} TV Series`,
      description: `Explore ${categoryName.toLowerCase()} TV series on WatchFullMovie and find legal streaming options, trailers, cast information, and availability.`,
      keywords: [
        `${categoryName.toLowerCase()} TV series`,
        'watch free TV shows legally',
        'stream free legally',
        'legal streaming',
        'TV streaming guide',
        'where to watch TV shows',
      ],
      robots: { index: true, follow: true },
    };
  }

  // TV detail
  const tvShowData = await resolveTvShowBySlug(slug);
  if (!tvShowData) {
    return {
      title: 'TV Series Not Found - WatchFullMovie',
      description:
        'The requested TV series could not be found on WatchFullMovie.',
      robots: { index: false, follow: true },
    };
  }

  const year = tvShowData.first_air_date?.substring(0, 4) || 'N/A';
  const title = `${tvShowData.name} (${year}) - WatchFullMovie`;
  const description =
    tvShowData.overview?.slice(0, 155) ||
    `Explore ${tvShowData.name}, including cast, ratings, trailers, and legal streaming options on WatchFullMovie.`;

  const officialSlug = createSlug(
    tvShowData.name,
    tvShowData.first_air_date
  );
  const canonicalUrl = `https://watchfullmovie.netlify.app/tv-show/${officialSlug}`;

  const ogImage = tvShowData.backdrop_path
    ? {
        url: `https://image.tmdb.org/t/p/w1280${tvShowData.backdrop_path}`,
        width: 1200,
        height: 630,
        alt: `${tvShowData.name} TV series backdrop`,
      }
    : tvShowData.poster_path
    ? {
        url: `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}`,
        width: 500,
        height: 750,
        alt: `${tvShowData.name} TV series poster`,
      }
    : {
        url: `https://placehold.co/1200x630/1f2937/d1d5db?text=${encodeURIComponent(
          tvShowData.name
        )}`,
        width: 1200,
        height: 630,
        alt: tvShowData.name,
      };

  return {
    title,
    description,
    keywords: [
      tvShowData.name,
      `${tvShowData.name} where to watch`,
      `${tvShowData.name} streaming`,
      `${tvShowData.name} watch free`,
      `${tvShowData.name} watch free legally`,
      'watch free TV shows legally',
      'stream free legally',
      'free legal streaming',
      'legal streaming guide',
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'WatchFullMovie',
      images: [ogImage],
      type: 'video.tv_show',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title,
      description,
      images: [ogImage.url],
    },
  };
}

// ============================================
// MAIN COMPONENT (TIDAK DIUBAH)
// ============================================

export default async function TvShowPage({ params }) {
  const { slug } = await params;

  const genres = await getTvSeriesGenres();
  const genreSlugMap = new Map(
    genres.map((genre) => [
      createGenreSlug(genre.name),
      { id: genre.id, name: genre.name },
    ])
  );
  const processedSlug = createGenreSlug(slug);

  // GENRE
  if (genreSlugMap.has(processedSlug)) {
    const genre = genreSlugMap.get(processedSlug);
    const series = await getTvSeriesByGenre(genre.id);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {genre.name} TV Series
        </h1>
        {series && series.length > 0 ? (
          <TvSeriesList series={series} />
        ) : (
          <p className="text-center text-white">
            There are no TV series in this genre.
          </p>
        )}
      </div>
    );
  }

  // CATEGORY
  if (CATEGORIES.includes(slug)) {
    const series = await getTvSeriesByCategory(slug);
    const title = slug
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {title} TV Series
        </h1>
        {series && series.length > 0 ? (
          <TvSeriesList series={series} />
        ) : (
          <p className="text-center text-white">
            There are no TV series in this category.
          </p>
        )}
      </div>
    );
  }

  // DETAIL
  const tvShowData = await resolveTvShowBySlug(slug);
  if (!tvShowData) {
    notFound();
  }

  const [videos, credits, reviews, similarTvSeries] = await Promise.all([
    getTvSeriesVideos(tvShowData.id),
    getTvSeriesCredits(tvShowData.id),
    getTvSeriesReviews(tvShowData.id),
    getSimilarTvSeries(tvShowData.id),
  ]);

  const backdropUrl = tvShowData.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${tvShowData.backdrop_path}`
    : null;
  const posterUrl = tvShowData.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}`
    : null;
  const cast = credits?.cast?.slice(0, 10) || [];
  const crew =
    credits?.crew
      ?.filter((member) =>
        ['Creator', 'Director', 'Writer', 'Screenplay'].includes(member.job)
      )
      .slice(0, 5) || [];
  const userReviews = reviews?.slice(0, 5) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tvShowData.name,
    description:
      tvShowData.overview ||
      'TV series information and legal streaming availability.',
    image:
      posterUrl ||
      'https://placehold.co/500x750/1f2937/d1d5db?text=No+Image',
    datePublished: tvShowData.first_air_date,
    creator: crew.filter((c) => c.job === 'Creator').map((c) => c.name),
    actor: cast.map((a) => a.name),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tvShowData.vote_average?.toFixed(1) || '0',
      ratingCount: tvShowData.vote_count || 0,
      bestRating: '10',
      worstRating: '0',
    },
    numberOfSeasons: tvShowData.number_of_seasons || 0,
    numberOfEpisodes: tvShowData.number_of_episodes || 0,
    genre: tvShowData.genres?.map((g) => g.name) || [],
    url: `https://watchfullmovie.netlify.app/tv-show/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-900 text-white pb-8">
        {backdropUrl && (
          <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
            <img
              src={backdropUrl}
              alt={`${tvShowData.name} TV series backdrop`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          </div>
        )}

        <div className="p-4 sm:p-8 md:p-12 relative -mt-32 md:-mt-48 z-10">
          <div className="flex flex-col md:flex-row items-start md:space-x-8">
            <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
              <img
                src={
                  posterUrl ||
                  'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available'
                }
                alt={`${tvShowData.name} poster`}
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-2">
                {tvShowData.name}
              </h1>
              {tvShowData.tagline && (
                <p className="text-gray-300 text-lg sm:text-xl mb-4 italic">
                  {tvShowData.tagline}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="flex items-center bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white">
                  <FaStar
                    className="text-yellow-400 mr-1"
                    aria-hidden="true"
                  />
                  {tvShowData.vote_average?.toFixed(1) || '0.0'} / 10
                </span>
                <span className="text-gray-400 text-sm">
                  {tvShowData.first_air_date?.substring(0, 4)}
                </span>
                <span className="text-gray-400 text-sm">
                  {tvShowData.number_of_seasons
                    ? `${tvShowData.number_of_seasons} Seasons`
                    : 'N/A'}
                </span>
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-2">Synopsis</h2>
              <p className="text-gray-300 text-justify mb-6">
                {tvShowData.overview || 'Synopsis not available.'}
              </p>
              <NativeAd />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400 mb-6 mt-6">
                <p>
                  <strong>Genre:</strong>{' '}
                  {tvShowData.genres?.map((genre) => genre.name).join(', ')}
                </p>
                <p>
                  <strong>Status:</strong> {tvShowData.status}
                </p>
                <p>
                  <strong>Creator:</strong>{' '}
                  {crew.find((member) => member.job === 'Creator')?.name ||
                    'N/A'}
                </p>
                {tvShowData.homepage && (
                  <p>
                    <strong>Website:</strong>{' '}
                    <a
                      href={tvShowData.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Official Website
                    </a>
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                WatchFullMovie helps you discover where to watch TV shows
                legally. Free streaming availability may vary by title and
                region.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 md:px-12">
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Main Cast
            </h2>
            {cast.length > 0 ? (
              <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex-shrink-0 w-24 text-center"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-600">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                          alt={`${actor.name} profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <FaUserCircle
                            className="text-4xl text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-white truncate">
                      {actor.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Cast information not available.
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              User Reviews
            </h2>
            {userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <p className="font-semibold text-white">
                      {review.author}
                    </p>
                    <p className="text-sm text-gray-300 mt-1 text-justify line-clamp-5">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No reviews for this TV show yet.
              </p>
            )}
          </div>

          {similarTvSeries?.length > 0 && (
            <div className="mt-8 border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">
                Similar TV Series
              </h2>
              <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
                {similarTvSeries.slice(0, 10).map((item) => {
                  const itemSlug = createSlug(
                    item.name,
                    item.first_air_date
                  );
                  const itemUrl = `/tv-show/${itemSlug}`;
                  const posterSrc = item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : 'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available';
                  return (
                    <Link
                      key={item.id}
                      href={itemUrl}
                      aria-label={`View details for ${item.name}`}
                      className="flex-shrink-0 w-32 md:w-48 text-center group"
                    >
                      <div className="relative w-full h-auto rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 shadow-lg">
                        <img
                          src={posterSrc}
                          alt={`${item.name} poster`}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <h3 className="text-xs md:text-sm font-semibold text-white truncate mb-1">
                            {item.name}
                          </h3>
                          {item.first_air_date && (
                            <span className="text-[10px] md:text-xs text-gray-400">
                              ({item.first_air_date.substring(0, 4)})
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href={`/tv-show/${slug}/stream`}
              aria-label={`View legal streaming options for ${tvShowData.name}`}
            >
              <span className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
                <FaPlayCircle className="text-2xl" aria-hidden="true" />
                View Legal Streaming Options & Trailer
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
              Find legal streaming services, trailers, and free viewing
              options when available in your region.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}