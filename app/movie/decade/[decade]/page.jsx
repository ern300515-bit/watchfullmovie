// app/movie/decade/[decade]/page.jsx
import { notFound } from 'next/navigation';
import { getMoviesByDecade, getMovieGenres } from '../../../../lib/api';
import DecadeArchiveClient from './DecadeArchiveClient';

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 86400; // 1 hari

const decades = [
  { id: '2020s', name: '2020s', start: 2020, end: 2029 },
  { id: '2010s', name: '2010s', start: 2010, end: 2019 },
  { id: '2000s', name: '2000s', start: 2000, end: 2009 },
  { id: '1990s', name: '1990s', start: 1990, end: 1999 },
  { id: '1980s', name: '1980s', start: 1980, end: 1989 },
  { id: '1970s', name: '1970s', start: 1970, end: 1979 },
  { id: '1960s', name: '1960s', start: 1960, end: 1969 },
  { id: '1950s', name: '1950s', start: 1950, end: 1959 },
];

export async function generateMetadata({ params }) {
  const { decade } = await params;
  const currentDecade = decades.find(d => d.id === decade);

  if (!currentDecade) {
    return {
      title: 'Decade Not Found - WatchFullMovie',
      robots: { index: false, follow: true },
    };
  }

  const pageUrl = `https://watchfullmovie.netlify.app/movie/decade/${decade}`;
  const imageUrl = 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg';

  return {
    title: `${currentDecade.name} Movies - WatchFullMovie`,
    description: `Explore the best movies from the ${currentDecade.name} (${currentDecade.start}-${currentDecade.end}). Watch trailers, get streaming info, and discover where to watch.`,
    robots: { index: true, follow: true },
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${currentDecade.name} Movies - WatchFullMovie`,
      description: `Explore the best movies from the ${currentDecade.name} (${currentDecade.start}-${currentDecade.end}). Watch trailers, get streaming info, and discover where to watch.`,
      url: pageUrl,
      siteName: 'WatchFullMovie',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${currentDecade.name} Movies` }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `${currentDecade.name} Movies - WatchFullMovie`,
      description: `Explore the best movies from the ${currentDecade.name} (${currentDecade.start}-${currentDecade.end}).`,
      images: [imageUrl],
    },
  };
}

export default async function DecadeArchivePage({ params }) {
  const { decade } = await params;

  const currentDecade = decades.find(
    item => item.id === decade
  );

  if (!currentDecade) {
    notFound();
  }

  let movies = [];
  let genres = [];

  try {
    const [moviesData, genresData] = await Promise.all([
      getMoviesByDecade(decade, 1),
      getMovieGenres(),
    ]);

    // getMoviesByDecade() mengembalikan object pagination
    movies = Array.isArray(moviesData?.results)
      ? moviesData.results
      : [];

    genres = Array.isArray(genresData)
      ? genresData
      : [];
  } catch (error) {
    console.error(
      `Error fetching data for decade ${decade}:`,
      error instanceof Error ? error.message : error
    );
  }

  return (
    <DecadeArchiveClient
      decade={decade}
      initialMovies={movies}
      genres={genres}
      decades={decades}
    />
  );
}