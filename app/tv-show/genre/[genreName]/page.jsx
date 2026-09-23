import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getTvSeriesByGenre, getTvSeriesGenres } from '../../../../lib/api';
import TvSeriesList from '../../../../components/TvSeriesList';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 43200;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://watchfullmovie.netlify.app';

// ============================================================
// DEDUPLICATED GENRES FETCH (React Cache)
// ============================================================
const getCachedTvSeriesGenres = cache(async () => {
  return await getTvSeriesGenres();
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
// NORMALIZE URL
// ============================================================
const normalizeUrlSlug = (slug) => {
  if (!slug) return '';

  let value = String(slug);

  try {
    value = decodeURIComponent(value);
  } catch {
    // gunakan nilai asli jika encoding tidak valid
  }

  return createGenreSlug(value);
};

// ============================================================
// LEGACY / SPECIAL MATCH
// ============================================================
const getSlugVariants = (value) => {
  const slug = normalizeUrlSlug(value);
  if (!slug) return [];

  const variants = new Set();
  variants.add(slug);
  variants.add(slug.replace(/-and-/g, '-'));

  return [...variants];
};

// ============================================================
// FIND GENRE
// ============================================================
const findTvGenreBySlug = (genres, requestedSlug) => {
  if (!Array.isArray(genres)) {
    return null;
  }

  const requestedVariants = getSlugVariants(requestedSlug);

  // MATCH NORMAL
  for (const genre of genres) {
    const genreSlug = createGenreSlug(genre.name);
    if (requestedVariants.includes(genreSlug)) {
      return genre;
    }
  }

  // MATCH KHUSUS "&"
  for (const genre of genres) {
    if (!genre?.name?.includes('&')) continue;

    const normalSlug = createGenreSlug(genre.name);
    const legacySlug = normalSlug.replace(/-and-/g, '-');

    if (
      requestedVariants.includes(normalSlug) ||
      requestedVariants.includes(legacySlug)
    ) {
      return genre;
    }
  }

  return null;
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
  const genres = await getCachedTvSeriesGenres();
  const genre = findTvGenreBySlug(genres, genreName);

  const title = genre?.name || 'Unknown';
  const canonicalSlug = genre
    ? createGenreSlug(genre.name)
    : normalizeUrlSlug(genreName);

  const pageUrl = `${SITE_URL}/tv-show/genre/${canonicalSlug}`;
  const imageUrl =
    'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg';

  // Wording aman dari pemicu Google Policy/AdSense flag
  const metaDescription = `Explore top-rated ${title} TV series, overview, trailers, and streaming details on WatchFullMovie.`;

  return {
    title: `WatchFullMovie - ${title} TV Series`,
    description: metaDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
        canonical: pageUrl,
    },

    openGraph: {
      title: `WatchFullMovie - ${title} TV Series`,
      description: metaDescription,
      url: pageUrl,
      siteName: 'WatchFullMovie',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} genre TV series poster`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `WatchFullMovie - ${title} TV Series`,
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
export default async function TvSeriesByGenrePage({ params }) {
  const { genreName } = await params;

  // GET GENRES (Cached)
  const genres = await getCachedTvSeriesGenres();

  // FIND GENRE
  const genre = findTvGenreBySlug(genres, genreName);

  // INVALID GENRE
  if (!genre?.id) {
    notFound();
  }

  // GET SERIES
  const seriesData = await getTvSeriesByGenre(genre.id);
  const series = seriesData?.results || [];

  // JSON-LD
  const canonicalSlug = createGenreSlug(genre.name);
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
        name: 'TV Shows',
        item: `${SITE_URL}/tv-show/popular`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${genre.name} TV Series`,
        item: `${SITE_URL}/tv-show/genre/${canonicalSlug}`,
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
          {genre.name} TV Series
        </h1>

        {series && series.length > 0 ? (
          <TvSeriesList series={series} showInlineAd={true} />
        ) : (
          <p className="text-center text-white">
            No TV series available in this genre.
          </p>
        )}
      </div>
    </>
  );
}