// app/sitemap.js

import { getAllPosts } from '../lib/blog';
import { STREAMING_PROVIDERS } from '../lib/streamingProviders';

const BASE_URL = 'https://watchfullmovie.netlify.app';

export default async function sitemap() {
  console.log('🎬 Generating dynamic sitemap for WatchFullMovie...');

  try {
    const [staticUrls, dynamicUrls] = await Promise.all([
      getStaticUrls(),
      getDynamicUrls()
    ]);

    const allUrls = [...staticUrls, ...dynamicUrls];

    console.log(`✅ Sitemap generated: ${allUrls.length} URLs total`);
    console.log(
      `📊 Breakdown: ${staticUrls.length} static, ${dynamicUrls.length} dynamic`
    );

    return allUrls;

  } catch (error) {
    console.error(
      '❌ Sitemap generation error, using fallback:',
      error.message
    );

    return getStaticUrls();
  }
}


// ============================================
// 1. STATIC PAGES
// ============================================
async function getStaticUrls() {
  const now = new Date();

  return [
    // 🏠 Home
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    },

    // 📜 Legal & Lainnya
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3
    },
    {
      url: `${BASE_URL}/dmca`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1
    },
    {
      url: `${BASE_URL}/rss`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.5
    },
    {
      url: `${BASE_URL}/actors`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${BASE_URL}/top-rated`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7
    },

    // ✍️ Blog
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7
    },

    // 📺 Streaming Providers
    ...generateStreamingUrls(),

    // 🗓️ Archive
    ...generateArchiveUrls(),

    // 🎬 Categories
    ...generateCategoryUrls()
  ];
}


// ============================================
// 1A. STREAMING PROVIDERS
// ============================================
function generateStreamingUrls() {
  const now = new Date();

  const urls = [
    // Main streaming directory
    {
      url: `${BASE_URL}/streaming`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8
    }
  ];

  // Individual provider pages
  if (Array.isArray(STREAMING_PROVIDERS)) {
    STREAMING_PROVIDERS.forEach(provider => {
      if (!provider?.slug) return;

      urls.push({
        url: `${BASE_URL}/streaming/${provider.slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8
      });
    });
  }

  return urls;
}


// ============================================
// 1B. CATEGORY URLS
// ============================================
function generateCategoryUrls() {
  const now = new Date();

  const movieCategories = [
    'popular',
    'now_playing',
    'upcoming',
    'top_rated'
  ];

  const tvCategories = [
    'popular',
    'airing_today',
    'on_the_air',
    'top_rated'
  ];

  const movieCategoryUrls = movieCategories.map(category => ({
    url: `${BASE_URL}/movie/category/${category}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7
  }));

  const tvCategoryUrls = tvCategories.map(category => ({
    url: `${BASE_URL}/tv-show/category/${category}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7
  }));

  return [
    ...movieCategoryUrls,
    ...tvCategoryUrls
  ];
}


// ============================================
// 1C. ARCHIVE URLS
// ============================================
function generateArchiveUrls() {
  const now = new Date();
  const currentYear = new Date().getFullYear();

  const recentYears = Array.from(
    { length: 5 },
    (_, i) => currentYear - i
  );

  const decades = [
    '2020s',
    '2010s',
    '2000s',
    '1990s',
    '1980s'
  ];

  const yearUrls = recentYears.map(year => ({
    url: `${BASE_URL}/movie/year/${year}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  const decadeUrls = decades.map(decade => ({
    url: `${BASE_URL}/movie/decade/${decade.toLowerCase()}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  return [
    ...yearUrls,
    ...decadeUrls
  ];
}


// ============================================
// 2. DYNAMIC PAGES
// ============================================
async function getDynamicUrls() {
  try {
    console.log('🔄 Fetching dynamic content for sitemap...');

    const [
      movies,
      tvShows,
      genres,
      blogPosts
    ] = await Promise.all([
      fetchPopularContent('movie'),
      fetchPopularContent('tv'),
      fetchGenres(),
      fetchBlogPosts()
    ]);

    // Fallback safety
    const safeMovies = Array.isArray(movies)
      ? movies
      : [];

    const safeTvShows = Array.isArray(tvShows)
      ? tvShows
      : [];

    const safeGenres =
      genres && typeof genres === 'object'
        ? genres
        : {
            movie: [],
            tv: []
          };

    const safeBlogPosts = Array.isArray(blogPosts)
      ? blogPosts
      : [];

    const dynamicUrls = [
      // 🎬 Movie Detail Pages
      ...safeMovies
        .map(item => generateContentUrl(item, 'movie'))
        .filter(Boolean),

      // 📺 TV Show Detail Pages
      ...safeTvShows
        .map(item => generateContentUrl(item, 'tv-show'))
        .filter(Boolean),

      // 🎭 Genre Pages
      ...generateGenreUrls(safeGenres),

      // ✍️ Blog Posts
      ...generateBlogUrls(safeBlogPosts)
    ];

    const totalGenres =
      (safeGenres.movie?.length || 0) +
      (safeGenres.tv?.length || 0);

    console.log(
      `🎯 Generated: ${safeMovies.length} movies, ` +
      `${safeTvShows.length} TV shows, ` +
      `${totalGenres} genres, ` +
      `${safeBlogPosts.length} blog posts`
    );

    return dynamicUrls;

  } catch (error) {
    console.error(
      '⚠️ Dynamic content fetch failed:',
      error.message
    );

    return [];
  }
}


// ============================================
// BLOG POSTS
// ============================================
async function fetchBlogPosts() {
  try {
    const posts = getAllPosts();
    return posts;

  } catch (error) {
    console.warn(
      '⚠️ Failed to fetch blog posts for sitemap:',
      error.message
    );

    return [];
  }
}


function generateBlogUrls(posts) {
  const now = new Date();

  return posts
    .filter(post => post?.slug)
    .map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.frontmatter?.date
        ? new Date(post.frontmatter.date)
        : now,
      changeFrequency: 'weekly',
      priority: 0.6
    }));
}


// ============================================
// GENRE URLS
// ============================================
function generateGenreUrls(genres) {
  const now = new Date();
  const urls = [];

  // Movie genres
  if (Array.isArray(genres.movie)) {
    genres.movie.forEach(genre => {
      if (!genre?.name) return;

      const slug = createSlug(genre.name);

      if (!slug) return;

      urls.push({
        url: `${BASE_URL}/movie/genre/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6
      });
    });
  }

  // TV genres
  if (Array.isArray(genres.tv)) {
    genres.tv.forEach(genre => {
      if (!genre?.name) return;

      const slug = createSlug(genre.name);

      if (!slug) return;

      urls.push({
        url: `${BASE_URL}/tv-show/genre/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6
      });
    });
  }

  return urls;
}


// ============================================
// CONTENT URL
// ============================================
function generateContentUrl(item, type) {
  const title =
    type === 'movie'
      ? item?.title
      : item?.name;

  const date =
    type === 'movie'
      ? item?.release_date
      : item?.first_air_date;

  const slug = createSlug(title, date);

  if (!slug) return null;

  return {
    url: `${BASE_URL}/${type}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  };
}


// ============================================
// SLUG GENERATOR
// ============================================
function createSlug(name, dateString = '') {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  if (
    dateString &&
    typeof dateString === 'string'
  ) {
    const year = dateString.substring(0, 4);

    if (
      year &&
      year.length === 4 &&
      !isNaN(parseInt(year, 10))
    ) {
      return `${baseSlug}-${year}`;
    }
  }

  return baseSlug;
}


// ============================================
// TMDB - POPULAR CONTENT
// ============================================
async function fetchPopularContent(type) {
  try {
    const TMDB_API_KEY =
      process.env.TMDB_API_KEY;

    const TMDB_ACCESS_TOKEN =
      process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

    const TMDB_API_URL =
      'https://api.themoviedb.org/3';

    if (!TMDB_API_KEY) {
      console.warn(
        '⚠️ TMDB API key not found, using sample data'
      );

      return generateSampleContent(type);
    }

    const endpoint =
      type === 'movie'
        ? 'movie/popular'
        : 'tv/popular';

    const headers = {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const url =
      `${TMDB_API_URL}/${endpoint}` +
      `?api_key=${TMDB_API_KEY}` +
      `&language=en-US&page=1`;

    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 3600
      }
    });

    if (!response.ok) {
      throw new Error(
        `${type} fetch failed: ${response.status}`
      );
    }

    const data = await response.json();

    return data.results?.slice(0, 50) || [];

  } catch (error) {
    console.error(
      `Error fetching ${type}:`,
      error.message
    );

    return generateSampleContent(type);
  }
}


// ============================================
// TMDB - GENRES
// ============================================
async function fetchGenres() {
  try {
    const TMDB_API_KEY =
      process.env.TMDB_API_KEY;

    const TMDB_ACCESS_TOKEN =
      process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

    const TMDB_API_URL =
      'https://api.themoviedb.org/3';

    if (!TMDB_API_KEY) {
      console.warn(
        '⚠️ TMDB API key not found, using sample genres'
      );

      return getSampleGenres();
    }

    const headers = {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const [movieRes, tvRes] =
      await Promise.all([
        fetch(
          `${TMDB_API_URL}/genre/movie/list` +
          `?api_key=${TMDB_API_KEY}` +
          `&language=en`,
          {
            headers,
            next: {
              revalidate: 86400
            }
          }
        ),

        fetch(
          `${TMDB_API_URL}/genre/tv/list` +
          `?api_key=${TMDB_API_KEY}` +
          `&language=en`,
          {
            headers,
            next: {
              revalidate: 86400
            }
          }
        )
      ]);

    if (!movieRes.ok || !tvRes.ok) {
      throw new Error(
        `Genres fetch failed: ` +
        `${movieRes.status}, ${tvRes.status}`
      );
    }

    const movieData =
      await movieRes.json();

    const tvData =
      await tvRes.json();

    return {
      movie: movieData.genres || [],
      tv: tvData.genres || []
    };

  } catch (error) {
    console.error(
      'Error fetching genres:',
      error.message
    );

    return getSampleGenres();
  }
}


// ============================================
// FALLBACK DATA
// ============================================
function generateSampleContent(type) {
  const sampleData =
    type === 'movie'
      ? sampleMovies
      : sampleTvShows;

  return sampleData.slice(0, 20);
}


function getSampleGenres() {
  return {
    movie: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' },
      { id: 27, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Science Fiction' },
      { id: 10770, name: 'TV Movie' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'War' },
      { id: 37, name: 'Western' }
    ],

    tv: [
      { id: 10759, name: 'Action & Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 10762, name: 'Kids' },
      { id: 9648, name: 'Mystery' },
      { id: 10763, name: 'News' },
      { id: 10764, name: 'Reality' },
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 10766, name: 'Soap' },
      { id: 10767, name: 'Talk' },
      { id: 10768, name: 'War & Politics' },
      { id: 37, name: 'Western' }
    ]
  };
}


// ============================================
// SAMPLE MOVIES
// ============================================
const sampleMovies = [
  {
    id: 1,
    title: 'The Matrix',
    release_date: '1999-03-31'
  },
  {
    id: 2,
    title: 'Inception',
    release_date: '2010-07-16'
  },
  {
    id: 3,
    title: 'Parasite',
    release_date: '2019-05-30'
  },
  {
    id: 4,
    title: 'The Dark Knight',
    release_date: '2008-07-18'
  },
  {
    id: 5,
    title: 'Avengers: Endgame',
    release_date: '2019-04-26'
  },
  {
    id: 6,
    title: 'Pulp Fiction',
    release_date: '1994-10-14'
  },
  {
    id: 7,
    title: 'Forrest Gump',
    release_date: '1994-07-06'
  },
  {
    id: 8,
    title: 'The Shawshank Redemption',
    release_date: '1994-09-23'
  },
  {
    id: 9,
    title: 'Spirited Away',
    release_date: '2001-07-20'
  },
  {
    id: 10,
    title: 'Interstellar',
    release_date: '2014-11-07'
  }
];


// ============================================
// SAMPLE TV SHOWS
// ============================================
const sampleTvShows = [
  {
    id: 1,
    name: 'Breaking Bad',
    first_air_date: '2008-01-20'
  },
  {
    id: 2,
    name: 'Game of Thrones',
    first_air_date: '2011-04-17'
  },
  {
    id: 3,
    name: 'Stranger Things',
    first_air_date: '2016-07-15'
  },
  {
    id: 4,
    name: 'The Crown',
    first_air_date: '2016-11-04'
  },
  {
    id: 5,
    name: 'Friends',
    first_air_date: '1994-09-22'
  },
  {
    id: 6,
    name: 'The Office',
    first_air_date: '2005-03-24'
  },
  {
    id: 7,
    name: 'Sherlock',
    first_air_date: '2010-07-25'
  },
  {
    id: 8,
    name: 'The Mandalorian',
    first_air_date: '2019-11-12'
  },
  {
    id: 9,
    name: 'Chernobyl',
    first_air_date: '2019-05-06'
  },
  {
    id: 10,
    name: 'Money Heist',
    first_air_date: '2017-05-02'
  }
];