// app/movie/year/[year]/page.jsx
import { notFound } from 'next/navigation';
import { getMoviesByYear, getMovieGenres } from '../../../../lib/api';
import YearArchiveClient from './YearArchiveClient';

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 86400; // 1 hari

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);
  return years.map(year => ({ year: year.toString() }));
}

export async function generateMetadata({ params }) {
  const { year } = await params;
  const currentYear = new Date().getFullYear();
  const isValidYear = year >= 1900 && year <= currentYear;

  if (!isValidYear) {
    return {
      title: 'Invalid Year - WatchFullMovie',
      description: 'The requested year is not valid.',
      robots: { index: false, follow: true },
    };
  }

  const pageUrl = `https://watchfullmovie.netlify.app/movie/year/${year}`;
  const imageUrl = 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg';

  return {
    title: `Movies from ${year} - WatchFullMovie`,
    description: `Explore the best movies released in ${year}. Watch trailers, get streaming info, and discover where to watch.`,
    robots: { index: true, follow: true },
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `Movies from ${year} - WatchFullMovie`,
      description: `Explore the best movies released in ${year}. Watch trailers, get streaming info, and discover where to watch.`,
      url: pageUrl,
      siteName: 'WatchFullMovie',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `Movies from ${year}` }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `Movies from ${year} - WatchFullMovie`,
      description: `Explore the best movies released in ${year}. Watch trailers, get streaming info, and discover where to watch.`,
      images: [imageUrl],
    },
  };
}

export default async function YearArchivePage({ params }) {
  const { year } = await params;
  const currentYear = new Date().getFullYear();
  const numericYear = Number(year);

  const isValidYear =
    Number.isInteger(numericYear) &&
    numericYear >= 1900 &&
    numericYear <= currentYear;

  if (!isValidYear) {
    notFound();
  }

  let movies = [];
  let genres = [];

  try {
    const [moviesData, genresData] = await Promise.all([
      getMoviesByYear(numericYear, 1),
      getMovieGenres(),
    ]);

    // getMoviesByYear() mengembalikan object pagination
    movies = Array.isArray(moviesData?.results)
      ? moviesData.results
      : [];

    genres = Array.isArray(genresData)
      ? genresData
      : [];
  } catch (error) {
    console.error(
      `Error fetching data for year ${numericYear}:`,
      error instanceof Error ? error.message : error
    );
  }

  return (
    <YearArchiveClient
      year={numericYear}
      initialMovies={movies}
      genres={genres}
    />
  );
}