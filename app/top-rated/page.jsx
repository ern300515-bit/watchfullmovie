// app/top-rated/page.jsx
import { getTopRatedMovies, getTopRatedTvSeries, getTrendingMoviesDaily, getTrendingTvSeriesDaily } from '../../lib/api';
import TopRatedClient from './TopRatedClient';

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 86400;

// ✅ Data fallback (jika API gagal)
const FALLBACK_MOVIES = [
  { id: 1, title: 'The Shawshank Redemption', poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', vote_average: 9.3, vote_count: 2500000, release_date: '1994-09-23', overview: 'Two imprisoned men bond...', genre_names: ['Drama'], popularity: 100.5 },
  { id: 2, title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', vote_average: 9.2, vote_count: 1800000, release_date: '1972-03-24', overview: 'The aging patriarch...', genre_names: ['Crime', 'Drama'], popularity: 95.2 },
  { id: 3, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', vote_average: 9.0, vote_count: 2600000, release_date: '2008-07-18', overview: 'When the menace known as the Joker...', genre_names: ['Action', 'Crime', 'Drama'], popularity: 120.8 },
];

const FALLBACK_TV = [
  { id: 1, name: 'Breaking Bad', poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', vote_average: 9.5, vote_count: 1700000, first_air_date: '2008-01-20', overview: 'A high school chemistry teacher...', genre_names: ['Crime', 'Drama', 'Thriller'], popularity: 150.3 },
  { id: 2, name: 'Planet Earth II', poster_path: '/6ZlfY4bF1edK5m6VSBaMouYRp2Y.jpg', vote_average: 9.4, vote_count: 150000, first_air_date: '2016-11-06', overview: 'Wildlife documentary series...', genre_names: ['Documentary'], popularity: 88.7 },
  { id: 3, name: 'Game of Thrones', poster_path: '/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg', vote_average: 9.3, vote_count: 2200000, first_air_date: '2011-04-17', overview: 'Nine noble families fight...', genre_names: ['Action', 'Adventure', 'Drama'], popularity: 180.5 },
];

export async function generateMetadata() {
  return {
    title: 'Top Rated Movies & TV Shows - WatchFullMovie',
    description: 'Discover the highest rated and most popular movies and TV series based on user ratings and reviews. Find the best content to watch.',
    openGraph: {
      title: 'Top Rated Movies & TV Shows - WatchFullMovie',
      description: 'Discover the highest rated and most popular movies and TV series based on user ratings and reviews. Find the best content to watch.',
      url: 'https://watchfullmovie.netlify.app/top-rated',
      siteName: 'WatchFullMovie',
      images: [{ url: 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg', width: 1200, height: 630, alt: 'Top Rated - WatchFullMovie' }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',      
      creator: '@WatchStream123',   
      title: 'Top Rated Movies & TV Shows - WatchFullMovie',
      description: 'Discover the highest rated and most popular movies and TV series based on user ratings and reviews.',
      images: ['https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg'],
    },
    alternates: { canonical: 'https://watchfullmovie.netlify.app/top-rated' },
    robots: { index: true, follow: true },
  };
}

export default async function RankingsPage() {
  let topMovies = FALLBACK_MOVIES;
  let topTv = FALLBACK_TV;
  let trendingMovies = FALLBACK_MOVIES.slice(0, 2);
  let trendingTv = FALLBACK_TV.slice(0, 2);

  try {
    const [movies, tv, trendingMov, trendingTvData] = await Promise.all([
      getTopRatedMovies(1),
      getTopRatedTvSeries(1),
      getTrendingMoviesDaily(1),
      getTrendingTvSeriesDaily(1),
    ]);

    topMovies = Array.isArray(movies) ? movies : (movies?.results || FALLBACK_MOVIES);
    topTv = Array.isArray(tv) ? tv : (tv?.results || FALLBACK_TV);
    trendingMovies = Array.isArray(trendingMov) ? trendingMov : (trendingMov?.results || FALLBACK_MOVIES.slice(0, 2));
    trendingTv = Array.isArray(trendingTvData) ? trendingTvData : (trendingTvData?.results || FALLBACK_TV.slice(0, 2));
  } catch (error) {
    console.error('❌ Error fetching top-rated data:', error);
  }

  return (
    <TopRatedClient
      initialTopMovies={topMovies}
      initialTopTv={topTv}
      initialTrendingMovies={trendingMovies}
      initialTrendingTv={trendingTv}
      fallback={false}
    />
  );
}