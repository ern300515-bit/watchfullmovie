// app/tv-show/category/[category]/page.jsx
import { notFound } from 'next/navigation';
import { getTvSeriesByCategory } from '../../../../lib/api';
import TvSeriesList from '../../../../components/TvSeriesList';

export const dynamic = 'force-static';
export const revalidate = 86400;

const VALID_CATEGORIES = ['popular', 'airing_today', 'on_the_air', 'top_rated'];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const title = category.replace(/_/g, ' ').toUpperCase();
  const pageUrl = `https://watchfullmovie.netlify.app/tv-show/category/${category}`;
  const imageUrl = 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg';

  return {
    title: `${title} TV Series - WatchFullMovie`,
    description: `Explore details, trailers, and streaming options for the best ${title} TV series on WatchFullMovie`,
    robots: { index: true, follow: true },
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
      title: `${title} TV Series - WatchFullMovie`,
      description: `Explore details, trailers, and streaming options for the best ${title} TV series on WatchFullMovie`,
      url: pageUrl,
      siteName: 'WatchFullMovie',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} TV Series on WatchFullMovie`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `${title} TV Series - WatchFullMovie`,
      description: `Explore details, trailers, and streaming options for the best ${title} TV series on WatchFullMovie`,
      images: [imageUrl],
    },
  };
}

export default async function TvCategoryPage({ params }) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const series = await getTvSeriesByCategory(category);
  const title = category.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
        {title} TV Series
      </h1>
      {series && series.length > 0 ? (
        <TvSeriesList series={series} showInlineAd={true} />
      ) : (
        <p className="text-center text-white">No TV series in this category.</p>
      )}
    </div>
  );
}