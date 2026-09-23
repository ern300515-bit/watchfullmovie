// app/movie/category/[category]/page.jsx
import { notFound } from 'next/navigation';
import { getMoviesByCategory } from '../../../../lib/api';
import MovieList from '../../../../components/MovieList';
import NativeAd from '../../../../components/ads/NativeAd';
export const dynamic = 'force-static';
export const revalidate = 86400;

const VALID_CATEGORIES = ['popular', 'now_playing', 'upcoming', 'top_rated'];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const title = category.replace(/_/g, ' ').toUpperCase();
  const pageUrl = `https://watchfullmovie.netlify.app/movie/category/${category}`;
  const imageUrl = 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg';

  return {
    title: `${title} Movies - WatchFullMovie`,
    description: `Explore details, trailers, and streaming options for the best ${title} movies on WatchFullMovie`,
    robots: { index: true, follow: true },
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
      title: `${title} Movies - WatchFullMovie`,
      description: `Explore details, trailers, and streaming options for the best ${title} movies on WatchFullMovie`,
      url: pageUrl,
      siteName: 'WatchFullMovie',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Movies on WatchFullMovie`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `${title} Movies - WatchFullMovie`,
      description: `Explore details, trailers, and streaming options for the best ${title} movies on WatchFullMovie`,
      images: [imageUrl],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const movies = await getMoviesByCategory(category);
  const title = category.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
        {title} Movies
      </h1>
      {movies && movies.length > 0 ? (
  <MovieList movies={movies} />
) : (
  <p className="text-center text-white">
    No movies in this category.
  </p>
)}
    </div>
  );
}