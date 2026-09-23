import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  FaPlayCircle,
  FaUserCircle,
  FaStar,
} from 'react-icons/fa';

import {
  getMovieById,
  getMovieCredits,
  getMovieReviews,
  searchMoviesAndTv,
  getSimilarMovies,
  getMoviesByCategory,
  getMovieGenres,
  createSlug,
} from '../../../lib/api';

import MovieList from '../../../components/MovieList';
import NativeAd from '../../../components/ads/NativeAd';

export const revalidate = 43200; // 12 hours
export const dynamicParams = true;

const CATEGORIES = ['now_playing', 'popular', 'top_rated', 'upcoming'];

// ============================================
// AMBIL FILM BERDASARKAN GENRE
// ============================================

const getMoviesByGenre = async (genreId) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const url =
    `https://api.themoviedb.org/3/discover/movie` +
    `?api_key=${API_KEY}` +
    `&with_genres=${genreId}` +
    `&sort_by=popularity.desc`;
  try {
    const res = await fetch(url, { next: { revalidate: 43200 } });
    if (!res.ok) throw new Error('Failed to fetch movies by genre');
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};

// ============================================
// RESOLVE MOVIE BY SLUG
// ============================================
//
// Mendukung 3 format slug:
//
//  1. Pure ID          → /movie/12345
//  2. judul-tahun-id   → /movie/mofuku-shimai-2009-12345   (khusus dari halaman actor)
//  3. judul-tahun      → /movie/mofuku-shimai-2009         (dari halaman lain)
//
// ============================================

const resolveMovieBySlug = cache(async (slug) => {
  if (CATEGORIES.includes(slug) || slug.match(/^genre-(\d+)$/)) {
    return null;
  }

  const parts = slug.split('-');

  // FORMAT 1: Pure numeric ID
  if (parts.length === 1 && /^\d+$/.test(slug)) {
    return await getMovieById(parseInt(slug, 10));
  }

  // FORMAT 2: Ekstrak ID dari segmen terakhir (fleksibel)
  const lastSeg = parts[parts.length - 1];
  if (/^\d+$/.test(lastSeg) && lastSeg.length >= 5) {
    const id = parseInt(lastSeg, 10);
    try {
      const movie = await getMovieById(id);
      if (movie) return movie;
    } catch (err) {
      console.warn(
        'resolveMovieBySlug: gagal getMovieById',
        id,
        err?.message
      );
    }
  }

  // FORMAT 3: judul-tahun → cari via search
  const last = parts[parts.length - 1];
  const year = /^\d{4}$/.test(last) ? last : null;
  const titleSlug = year ? parts.slice(0, -1).join('-') : slug;

  const searchResults = await searchMoviesAndTv(
    titleSlug.replace(/-/g, ' ')
  );

  let found = searchResults.find((item) => {
    if (item.media_type !== 'movie') return false;
    const itemSlug = createSlug(item.title, item.release_date);
    return itemSlug === slug;
  });

  if (!found) {
    found = searchResults.find((item) => {
      if (item.media_type !== 'movie') return false;
      const itemSlugNoYear = createSlug(item.title, null);
      return itemSlugNoYear === titleSlug;
    });
  }

  if (!found) {
    const normalizedSlug = titleSlug.replace(/-/g, '').toLowerCase();
    found = searchResults.find((item) => {
      if (item.media_type !== 'movie') return false;
      const normalizedTitle = item.title
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      return normalizedTitle === normalizedSlug;
    });
  }

  if (!found) {
    const results = await searchMoviesAndTv(
      titleSlug.replace(/-/g, ' ')
    );
    found = results.find((item) => item.media_type === 'movie');
  }

  return found ? await getMovieById(found.id) : null;
});

// ============================================
// generateStaticParams (TIDAK DIUBAH)
// ============================================

export async function generateStaticParams() {
  try {
    const popularMovies = await getMoviesByCategory('popular');
    return (popularMovies || [])
      .slice(0, 20)
      .map((movie) => {
        const slug = createSlug(movie.title, movie.release_date);
        return slug ? { slug } : null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Gagal generate static params untuk movie:', error);
    return [];
  }
}

// ============================================
// generateMetadata (tidak diubah)
// ============================================

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (CATEGORIES.includes(slug)) {
    const categoryName = slug.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    return {
      title: `WatchFullMovie - ${categoryName} Movies`,
      description: `Explore ${categoryName.toLowerCase()} movies on WatchFullMovie and discover where to watch them legally, including free streaming options when available.`,
      keywords: [
        `${categoryName.toLowerCase()} movies`,
        'watch free movies legally',
        'legal streaming',
        'where to watch movies',
        'free legal streaming',
        'movie streaming guide',
      ],
      robots: { index: true, follow: true },
    };
  }

  const genreMatch = slug.match(/^genre-(\d+)$/);
  if (genreMatch) {
    const genreId = genreMatch[1];
    const genres = await getMovieGenres();
    const genreName = genres.find((g) => g.id == genreId)?.name || 'Unknown';
    return {
      title: `WatchFullMovie - ${genreName} Movies`,
      description: `Discover ${genreName.toLowerCase()} movies on WatchFullMovie and find legal streaming options, including free-to-watch services when available in your region.`,
      keywords: [
        `${genreName.toLowerCase()} movies`,
        `watch ${genreName.toLowerCase()} movies free`,
        'watch free movies legally',
        'legal streaming guide',
        'where to watch movies',
      ],
      robots: { index: true, follow: true },
    };
  }

  const movieData = await resolveMovieBySlug(slug);
  if (!movieData) {
    return {
      title: 'Movie Not Found - WatchFullMovie',
      description: 'The requested movie could not be found on WatchFullMovie.',
      robots: { index: false, follow: true },
    };
  }

  const year = movieData.release_date?.substring(0, 4) || 'N/A';
  const title = `${movieData.title} (${year}) - WatchFullMovie`;
  const description = movieData.overview?.slice(0, 155) ||
    `Explore ${movieData.title}, including cast, ratings, trailers, and legal streaming options on WatchFullMovie.`;
  const officialSlug = createSlug(movieData.title, movieData.release_date);
  const canonicalUrl = `https://watchfullmovie.netlify.app/movie/${officialSlug}`;

  const ogImage = movieData.backdrop_path
    ? { url: `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`, width: 1200, height: 630, alt: `${movieData.title} movie backdrop` }
    : movieData.poster_path
    ? { url: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`, width: 500, height: 750, alt: `${movieData.title} movie poster` }
    : { url: `https://placehold.co/1200x630/1f2937/d1d5db?text=${encodeURIComponent(movieData.title)}`, width: 1200, height: 630, alt: movieData.title };

  return {
    title,
    description,
    keywords: [
      movieData.title,
      `${movieData.title} where to watch`,
      `${movieData.title} streaming`,
      `${movieData.title} watch free`,
      `${movieData.title} watch free legally`,
      'watch free movies legally',
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
      type: 'video.movie',
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
// MAIN COMPONENT (SEMUA IMAGE DIGANTI DENGAN <img>)
// ============================================

export default async function MoviePage({ params }) {
  const { slug } = await params;

  // CATEGORY
  if (CATEGORIES.includes(slug)) {
    const movies = await getMoviesByCategory(slug);
    const title = slug.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">{title} Movies</h1>
        {movies && movies.length > 0 ? <MovieList movies={movies} /> : <p className="text-center text-white">There are no movies in this category.</p>}
      </div>
    );
  }

  // GENRE
  const genreMatch = slug.match(/^genre-(\d+)$/);
  if (genreMatch) {
    const genreId = genreMatch[1];
    const genres = await getMovieGenres();
    const genreName = genres.find((g) => g.id == genreId)?.name || 'Unknown';
    const moviesByGenre = await getMoviesByGenre(genreId);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">{genreName} Movies</h1>
        {moviesByGenre && moviesByGenre.length > 0 ? <MovieList movies={moviesByGenre} /> : <p className="text-center text-white">There are no movies in this genre.</p>}
      </div>
    );
  }

  // MOVIE DETAIL
  const movieData = await resolveMovieBySlug(slug);
  if (!movieData) {
    notFound();
  }

  const [credits, reviews, similarMovies] = await Promise.all([
    getMovieCredits(movieData.id),
    getMovieReviews(movieData.id),
    getSimilarMovies(movieData.id),
  ]);

  const backdropUrl = movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null;
  const posterUrl = movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null;
  const cast = credits?.cast?.slice(0, 10) || [];
  const crew = credits?.crew?.filter((member) => ['Director', 'Writer', 'Screenplay'].includes(member.job)).slice(0, 5) || [];
  const userReviews = reviews?.slice(0, 5) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movieData.title,
    description: movieData.overview || 'Movie information and legal streaming availability.',
    image: posterUrl || 'https://placehold.co/500x750/1f2937/d1d5db?text=No+Image',
    datePublished: movieData.release_date,
    director: crew.filter((c) => c.job === 'Director').map((d) => d.name),
    actor: cast.map((a) => a.name),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movieData.vote_average?.toFixed(1) || '0',
      ratingCount: movieData.vote_count || 0,
      bestRating: '10',
      worstRating: '0',
    },
    duration: movieData.runtime ? `PT${Math.floor(movieData.runtime / 60)}H${movieData.runtime % 60}M` : undefined,
    genre: movieData.genres?.map((g) => g.name) || [],
    url: `https://watchfullmovie.netlify.app/movie/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-slate-900 text-white pb-8">
        {/* BACKDROP - menggunakan <img> */}
        {backdropUrl && (
          <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
            <img
              src={backdropUrl}
              alt={`${movieData.title} movie backdrop`}
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          </div>
        )}

        {/* MAIN INFO */}
        <div className="p-4 sm:p-8 md:p-12 relative -mt-32 md:-mt-48 z-10">
          <div className="flex flex-col md:flex-row items-start md:space-x-8">
            <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
              <img
                src={posterUrl || 'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available'}
                alt={`${movieData.title} poster`}
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-2">{movieData.title}</h1>
              {movieData.tagline && <p className="text-gray-300 text-lg sm:text-xl mb-4 italic">{movieData.tagline}</p>}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="flex items-center bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white">
                  <FaStar className="text-yellow-400 mr-1" aria-hidden="true" />
                  {movieData.vote_average?.toFixed(1) || '0.0'} / 10
                </span>
                <span className="text-gray-400 text-sm">{movieData.release_date?.substring(0, 4)}</span>
                <span className="text-gray-400 text-sm">{movieData.runtime ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : 'N/A'}</span>
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-2">Synopsis</h2>
              <p className="text-gray-300 text-justify mb-6">{movieData.overview || 'Synopsis not available.'}</p>
              <NativeAd />
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6 mt-6">
                <div>
                  <p><strong>Genre:</strong> {movieData.genres?.map((g) => g.name).join(', ')}</p>
                  <p><strong>Status:</strong> {movieData.status}</p>
                </div>
                <div>
                  <p><strong>Director:</strong> {crew.find((member) => member.job === 'Director')?.name || 'N/A'}</p>
                  {movieData.homepage && (
                    <p><strong>Website:</strong> <a href={movieData.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Official Website</a></p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">WatchFullMovie helps you discover where to watch movies legally. Free streaming availability may vary by title and region.</p>
            </div>
          </div>
        </div>

        {/* CAST, REVIEWS, SIMILAR */}
        <div className="p-4 sm:p-8 md:p-12">
          {/* CAST */}
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Main Cast</h2>
            {cast.length > 0 ? (
              <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
                {cast.map((actor) => (
                  <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-600">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                          alt={`${actor.name} profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <FaUserCircle className="text-4xl text-gray-400" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">Cast information not available.</p>}
          </div>

          {/* REVIEWS */}
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">User Reviews</h2>
            {userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <p className="font-semibold text-white">{review.author}</p>
                    <p className="text-sm text-gray-300 mt-1 text-justify">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">No reviews for this movie yet.</p>}
          </div>

          {/* SIMILAR MOVIES */}
          {similarMovies?.length > 0 && (
            <div className="mt-8 border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Similar Movies</h2>
              <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
                {similarMovies.slice(0, 10).map((item) => {
                  const itemSlug = createSlug(item.title, item.release_date);
                  const itemUrl = `/movie/${itemSlug}`;
                  const posterSrc = item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : 'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available';
                  return (
                    <Link key={item.id} href={itemUrl} aria-label={`View details for ${item.title}`} className="flex-shrink-0 w-32 md:w-48 text-center group">
                      <div className="relative w-full h-auto rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 shadow-lg">
                        <img
                          src={posterSrc}
                          alt={`${item.title} poster`}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-xs md:text-sm font-semibold text-white truncate mb-1">{item.title}</h3>
                          {item.release_date && <span className="text-[10px] md:text-xs text-gray-400">({item.release_date.substring(0, 4)})</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* STREAMING ACTION */}
          <div className="mt-12 text-center">
            <Link href={`/movie/${slug}/stream`} aria-label={`View legal streaming options for ${movieData.title}`}>
              <span className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
                <FaPlayCircle className="text-2xl" aria-hidden="true" />
                View Legal Streaming Options
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">Find available legal streaming services, including free options when available in your region.</p>
          </div>
        </div>
      </div>
    </>
  );
}