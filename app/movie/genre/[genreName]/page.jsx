import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getMoviesByGenre, getMovieGenres } from '../../../../lib/api';
import MovieList from '../../../../components/MovieList';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 43200; // 12 jam

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://watchfullmovie.netlify.app';

// ============================================================
// DEDUPLICATED GENRES FETCH (React Cache)
// ============================================================
const getCachedMovieGenres = cache(async () => {
  return await getMovieGenres();
});

// ============================================================
// GENRE SLUG
// ============================================================
const createGenreSlug = (name) => {
  if (!name) return '';

  return String(name)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ============================================================
// STATIC PARAMS
// ============================================================
export async function generateStaticParams() {
  return [];
}

// ============================================================
// METADATA (Google Policy Compliant)
// ============================================================
export async function generateMetadata({ params }) {
  const { genreName } = await params;
  const genres = await getCachedMovieGenres();
  const slug = createGenreSlug(genreName);

  const genre = genres.find(
    (item) => createGenreSlug(item.name) === slug
  );

  const title = genre?.name || 'Movies';
  const pageUrl = `${SITE_URL}/movie/genre/${slug}`;
  const imageUrl =
    'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg';

  // Wording ramah SEO & aman dari pemicu Google Policy/AdSense
  const metaDescription = `Explore top-rated ${title} movies, overview, ratings, trailers, and streaming info on WatchFullMovie.`;

  return {
    title: `WatchFullMovie - ${title} Movies`,
    description: metaDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
        canonical: pageUrl,
    },

    openGraph: {
      title: `WatchFullMovie - ${title} Movies`,
      description: metaDescription,
      url: pageUrl,
      siteName: 'WatchFullMovie',

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} genre movie poster`,
        },
      ],

      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `WatchFullMovie - ${title} Movies`,
      description: metaDescription,
      images: [imageUrl],
    },

    other: {
      'fb:app_id': '61550804323530',
    },
  };
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default async function MoviesByGenrePage({ params }) {
  const { genreName } = await params;

  // GET GENRES (Cached)
  const genres = await getCachedMovieGenres();
  const slug = createGenreSlug(genreName);

  // FIND GENRE
  const genre = genres.find(
    (item) => createGenreSlug(item.name) === slug
  );

  if (!genre?.id) {
    notFound();
  }

  const genreId = genre.id;
  const genreTitle = genre.name;

  // GET MOVIES
  const movieData = await getMoviesByGenre(genreId, 1);
  const movies = Array.isArray(movieData?.results) ? movieData.results : [];

  // JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Movies',
        item: `${SITE_URL}/movie/popular`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${genreTitle} Movies`,
        item: `${SITE_URL}/movie/genre/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {genreTitle} Movies
        </h1>

        {movies.length > 0 ? (
          <MovieList movies={movies} showInlineAd={true} />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-white">
              No movies available in this genre.
            </p>

            <p className="text-gray-400 mt-2">
              No movies were returned by TMDB for this genre.
            </p>
          </div>
        )}
      </div>
    </>
  );
}