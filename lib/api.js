// api.js
//
// TMDB API SERVER-SIDE CLIENT
// ============================================================
// MASTER CONFIGURATION
//
// Authentication priority:
// 1. TMDB_ACCESS_TOKEN  -> recommended
// 2. TMDB_API_KEY       -> fallback
//
// IMPORTANT:
// - NEVER use NEXT_PUBLIC_TMDB_API_KEY for secrets.
// - NEVER hardcode TMDB credentials in this file.
// - TMDB_ACCESS_TOKEN and TMDB_API_KEY must remain server-side.
// ============================================================

const API_URL =
  process.env.NEXT_PUBLIC_TMDB_API_URL ||
  'https://api.themoviedb.org/3';

const API_KEY = process.env.TMDB_API_KEY;
const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

const DEFAULT_LANGUAGE =
  process.env.TMDB_LANGUAGE || 'en-US';

const DEFAULT_REGION =
  process.env.TMDB_REGION || 'US';

const MAX_PAGE = 500;

// ============================================================
// VALIDATION HELPERS
// ============================================================

function normalizePage(page = 1) {
  const parsed = Number(page);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(
    Math.max(Math.floor(parsed), 1),
    MAX_PAGE
  );
}

function normalizeId(id, name = 'ID') {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${name}: ${id}`);
  }

  return parsed;
}

function normalizeString(value, fallback = '') {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
}

function normalizeDate(date, name = 'date') {
  const value = normalizeString(date);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid ${name}: ${date}`);
  }

  return value;
}

function normalizeYear(year) {
  const parsed = Number(year);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1870 ||
    parsed > 2100
  ) {
    throw new Error(`Invalid year: ${year}`);
  }

  return parsed;
}

function normalizeRating(rating) {
  const parsed = Number(rating);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid rating: ${rating}`);
  }

  return Math.min(Math.max(parsed, 0), 10);
}

function normalizeSortBy(
  sortBy,
  fallback = 'popularity.desc'
) {
  const value = normalizeString(sortBy, fallback);

  const allowed = new Set([
    'popularity.asc',
    'popularity.desc',

    'vote_average.asc',
    'vote_average.desc',

    'vote_count.asc',
    'vote_count.desc',

    'primary_release_date.asc',
    'primary_release_date.desc',

    'revenue.asc',
    'revenue.desc',

    'original_title.asc',
    'original_title.desc',
  ]);

  return allowed.has(value)
    ? value
    : fallback;
}

function normalizeLanguage(language) {
  const value = normalizeString(
    language,
    DEFAULT_LANGUAGE
  );

  if (
    !/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(value)
  ) {
    throw new Error(
      `Invalid language: ${language}`
    );
  }

  return value;
}

function normalizeRegion(region) {
  const value = normalizeString(
    region,
    DEFAULT_REGION
  ).toUpperCase();

  if (!/^[A-Z]{2}$/.test(value)) {
    throw new Error(
      `Invalid region: ${region}`
    );
  }

  return value;
}

function normalizeCsv(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(',');
  }

  return normalizeString(value);
}

// ============================================================
// URL BUILDER
// ============================================================

function buildUrl(path, params = {}) {
  const cleanPath = path.startsWith('/')
    ? path
    : `/${path}`;

  const url = new URL(
    `${API_URL}${cleanPath}`
  );

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        url.searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  // ----------------------------------------------------------
  // Authentication
  //
  // Prefer Bearer token.
  // API key is fallback only.
  // ----------------------------------------------------------

  if (!ACCESS_TOKEN && API_KEY) {
    url.searchParams.set(
      'api_key',
      API_KEY
    );
  }

  // ----------------------------------------------------------
  // Default language
  //
  // Only add if caller did not provide language.
  // ----------------------------------------------------------

  if (
    !Object.prototype.hasOwnProperty.call(
      params,
      'language'
    ) &&
    DEFAULT_LANGUAGE
  ) {
    url.searchParams.set(
      'language',
      DEFAULT_LANGUAGE
    );
  }

  return url.toString();
}

// ============================================================
// FETCH CORE
// ============================================================

async function fetchApi(
  path,
  {
    params = {},
    cache = 'force-cache',
    revalidate,
    signal,
  } = {}
) {
  if (!API_URL) {
    throw new Error(
      'TMDB API URL is not configured.'
    );
  }

  if (!ACCESS_TOKEN && !API_KEY) {
    throw new Error(
      'TMDB credentials are not configured. ' +
      'Set TMDB_ACCESS_TOKEN or TMDB_API_KEY.'
    );
  }

  const url = buildUrl(
    path,
    params
  );

  const headers = {
    Accept: 'application/json',
  };

  // ----------------------------------------------------------
  // Prefer TMDB Read Access Token
  // ----------------------------------------------------------

  if (ACCESS_TOKEN) {
    headers.Authorization =
      `Bearer ${ACCESS_TOKEN}`;
  }

  const fetchOptions = {
    method: 'GET',
    headers,
    signal,
  };

  // ----------------------------------------------------------
  // Next.js caching
  // ----------------------------------------------------------

  if (revalidate !== undefined) {
    fetchOptions.next = {
      revalidate,
    };
  } else {
    fetchOptions.cache = cache;
  }

  let response;

  try {
    response = await fetch(
      url,
      fetchOptions
    );
  } catch (error) {
    console.error(
      'TMDB network error:',
      error
    );

    throw new Error(
      'Unable to connect to TMDB API.'
    );
  }

  if (!response.ok) {
    let errorMessage =
      `TMDB API Error: ${response.status} ${response.statusText}`;

    try {
      const errorData =
        await response.json();

      if (
        errorData?.status_message
      ) {
        errorMessage =
          `TMDB API Error: ${errorData.status_message}`;
      }
    } catch {
      // Response body is not JSON.
    }

    if (response.status === 401) {
      errorMessage =
        'TMDB authentication failed. ' +
        'Check TMDB_ACCESS_TOKEN or TMDB_API_KEY.';
    }

    if (response.status === 404) {
      errorMessage =
        'TMDB resource not found.';
    }

    if (response.status === 429) {
      errorMessage =
        'TMDB rate limit reached. ' +
        'Please try again shortly.';
    }

    throw new Error(
      errorMessage
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(
      'TMDB returned an invalid JSON response.'
    );
  }
}

// ============================================================
// MOVIE
// ============================================================

export async function getMovieById(movieId) {
  try {
    return await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}`
    );
  } catch (error) {
    console.error(
      `Error fetching movie ${movieId}:`,
      error.message
    );

    return null;
  }
}

export async function getMovieVideos(movieId) {
  try {
    const data = await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/videos`
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching movie videos ${movieId}:`,
      error.message
    );

    return [];
  }
}

export async function getMovieCredits(movieId) {
  try {
    return await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/credits`
    );
  } catch (error) {
    console.error(
      `Error fetching movie credits ${movieId}:`,
      error.message
    );

    return null;
  }
}

export async function getMovieReviews(movieId) {
  try {
    const data = await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/reviews`
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching movie reviews ${movieId}:`,
      error.message
    );

    return [];
  }
}

export async function getSimilarMovies(movieId) {
  try {
    const data = await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/similar`
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching similar movies ${movieId}:`,
      error.message
    );

    return [];
  }
}

export async function getMovieRecommendations(
  movieId,
  page = 1
) {
  try {
    const data = await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/recommendations`,
      {
        params: {
          page: normalizePage(page),
        },
      }
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching movie recommendations ${movieId}:`,
      error.message
    );

    return [];
  }
}

export async function getMovieImages(movieId) {
  try {
    return await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/images`
    );
  } catch (error) {
    console.error(
      `Error fetching movie images ${movieId}:`,
      error.message
    );

    return null;
  }
}

export async function getMovieExternalIds(
  movieId
) {
  try {
    return await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/external_ids`
    );
  } catch (error) {
    console.error(
      `Error fetching movie external IDs ${movieId}:`,
      error.message
    );

    return null;
  }
}

export async function getMovieWatchProviders(
  movieId
) {
  try {
    const data = await fetchApi(
      `/movie/${normalizeId(
        movieId,
        'movie ID'
      )}/watch/providers`
    );

    return data?.results || {};
  } catch (error) {
    console.error(
      `Error fetching movie watch providers ${movieId}:`,
      error.message
    );

    return {};
  }
}

// ============================================================
// TV
// ============================================================

export async function getTvSeriesById(tvId) {
  try {
    return await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}`
    );
  } catch (error) {
    console.error(
      `Error fetching TV series ${tvId}:`,
      error.message
    );

    return null;
  }
}

export async function getTvSeriesVideos(tvId) {
  try {
    const data = await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/videos`
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching TV videos ${tvId}:`,
      error.message
    );

    return [];
  }
}

export async function getTvSeriesCredits(tvId) {
  try {
    return await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/credits`
    );
  } catch (error) {
    console.error(
      `Error fetching TV credits ${tvId}:`,
      error.message
    );

    return null;
  }
}

export async function getTvSeriesReviews(tvId) {
  try {
    const data = await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/reviews`
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching TV reviews ${tvId}:`,
      error.message
    );

    return [];
  }
}

export async function getSimilarTvSeries(tvId) {
  try {
    const data = await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/similar`
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching similar TV ${tvId}:`,
      error.message
    );

    return [];
  }
}

export async function getTvSeriesRecommendations(
  tvId,
  page = 1
) {
  try {
    const data = await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/recommendations`,
      {
        params: {
          page: normalizePage(page),
        },
      }
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching TV recommendations ${tvId}:`,
      error.message
    );

    return [];
  }
}

export async function getTvSeriesImages(tvId) {
  try {
    return await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/images`
    );
  } catch (error) {
    console.error(
      `Error fetching TV images ${tvId}:`,
      error.message
    );

    return null;
  }
}

export async function getTvSeriesExternalIds(
  tvId
) {
  try {
    return await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/external_ids`
    );
  } catch (error) {
    console.error(
      `Error fetching TV external IDs ${tvId}:`,
      error.message
    );

    return null;
  }
}

export async function getTvSeriesWatchProviders(
  tvId
) {
  try {
    const data = await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/watch/providers`
    );

    return data?.results || {};
  } catch (error) {
    console.error(
      `Error fetching TV watch providers ${tvId}:`,
      error.message
    );

    return {};
  }
}

// ============================================================
// SEARCH
// ============================================================

export async function searchMoviesAndTv(
  query,
  page = 1
) {
  const value = normalizeString(query);

  if (!value) {
    return [];
  }

  try {
    const data = await fetchApi(
      '/search/multi',
      {
        params: {
          query: value,
          page: normalizePage(page),
        },
        revalidate: 3600,
      }
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error searching "${value}":`,
      error.message
    );

    return [];
  }
}

export async function getMovieByTitle(title) {
  const value =
    normalizeString(title);

  if (!value) {
    return null;
  }

  try {
    const data = await fetchApi(
      '/search/movie',
      {
        params: {
          query: value,
        },
        revalidate: 86400,
      }
    );

    return data?.results?.length
      ? data.results
      : null;
  } catch (error) {
    console.error(
      `Error searching movie "${value}":`,
      error.message
    );

    return null;
  }
}

export async function getTvSeriesByTitle(title) {
  const value =
    normalizeString(title);

  if (!value) {
    return null;
  }

  try {
    const data = await fetchApi(
      '/search/tv',
      {
        params: {
          query: value,
        },
        revalidate: 86400,
      }
    );

    return data?.results?.length
      ? data.results
      : null;
  } catch (error) {
    console.error(
      `Error searching TV "${value}":`,
      error.message
    );

    return null;
  }
}

export async function searchPeople(
  query,
  page = 1
) {
  const value =
    normalizeString(query);

  if (!value) {
    return [];
  }

  try {
    const data = await fetchApi(
      '/search/person',
      {
        params: {
          query: value,
          page: normalizePage(page),
        },
        cache: 'no-store',
      }
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error searching people "${value}":`,
      error.message
    );

    return [];
  }
}

export async function searchKeywords(
  query,
  page = 1
) {
  const value =
    normalizeString(query);

  if (!value) {
    return [];
  }

  try {
    const data = await fetchApi(
      '/search/keyword',
      {
        params: {
          query: value,
          page: normalizePage(page),
        },
        cache: 'no-store',
      }
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error searching keywords "${value}":`,
      error.message
    );

    return [];
  }
}

export async function searchProductionCompanies(
  query,
  page = 1
) {
  const value =
    normalizeString(query);

  if (!value) {
    return [];
  }

  try {
    const data = await fetchApi(
      '/search/company',
      {
        params: {
          query: value,
          page: normalizePage(page),
        },
        cache: 'no-store',
      }
    );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error searching companies "${value}":`,
      error.message
    );

    return [];
  }
}

// ============================================================
// GENRES
// ============================================================

export async function getMovieGenres() {
  try {
    const data =
      await fetchApi(
        '/genre/movie/list'
      );

    return data?.genres || [];
  } catch (error) {
    console.error(
      'Error fetching movie genres:',
      error.message
    );

    return [];
  }
}

export async function getTvSeriesGenres() {
  try {
    const data =
      await fetchApi(
        '/genre/tv/list'
      );

    return data?.genres || [];
  } catch (error) {
    console.error(
      'Error fetching TV genres:',
      error.message
    );

    return [];
  }
}

// ============================================================
// DISCOVER HELPERS
// ============================================================

async function discoverMovies(
  params = {}
) {
  try {
    const data =
      await fetchApi(
        '/discover/movie',
        {
          params: {
            ...params,
            include_adult: false,
            include_video: false,
          },
          cache: 'no-store',
        }
      );

    return {
      results: Array.isArray(
        data?.results
      )
        ? data.results
        : [],

      total_pages:
        Number(data?.total_pages) || 1,

      total_results:
        Number(data?.total_results) || 0,
    };
  } catch (error) {
    console.error(
      'Error discovering movies:',
      error.message
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

async function discoverTv(
  params = {}
) {
  try {
    const data =
      await fetchApi(
        '/discover/tv',
        {
          params: {
            ...params,
            include_adult: false,
            include_null_first_air_dates:
              false,
          },
          cache: 'no-store',
        }
      );

    return {
      results: Array.isArray(
        data?.results
      )
        ? data.results
        : [],

      total_pages:
        Number(data?.total_pages) || 1,

      total_results:
        Number(data?.total_results) || 0,
    };
  } catch (error) {
    console.error(
      'Error discovering TV:',
      error.message
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

// ============================================================
// CATEGORY
// ============================================================

const MOVIE_CATEGORIES =
  new Set([
    'popular',
    'now_playing',
    'top_rated',
    'upcoming',
  ]);

const TV_CATEGORIES =
  new Set([
    'popular',
    'airing_today',
    'on_the_air',
    'top_rated',
  ]);

export async function getMoviesByCategory(
  category,
  page = 1
) {
  const value =
    normalizeString(
      category
    ).toLowerCase();

  if (
    !MOVIE_CATEGORIES.has(value)
  ) {
    console.error(
      `Invalid movie category: ${category}`
    );

    return [];
  }

  try {
    const data =
      await fetchApi(
        `/movie/${value}`,
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching ${value} movies:`,
      error.message
    );

    return [];
  }
}

export async function getTvSeriesByCategory(
  category,
  page = 1
) {
  const value =
    normalizeString(
      category
    ).toLowerCase();

  if (
    !TV_CATEGORIES.has(value)
  ) {
    console.error(
      `Invalid TV category: ${category}`
    );

    return [];
  }

  try {
    const data =
      await fetchApi(
        `/tv/${value}`,
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      `Error fetching ${value} TV series:`,
      error.message
    );

    return [];
  }
}

// ============================================================
// GENRE
// ============================================================

export async function getMoviesByGenre(
  genreId,
  page = 1
) {
  return discoverMovies({
    with_genres: normalizeId(
      genreId,
      'genre ID'
    ),
    page: normalizePage(page),
  });
}

export async function getTvSeriesByGenre(
  genreId,
  page = 1
) {
  return discoverTv({
    with_genres: normalizeId(
      genreId,
      'genre ID'
    ),
    page: normalizePage(page),
  });
}

// ============================================================
// YEAR / DECADE
// ============================================================

export async function getMoviesByYear(
  year,
  page = 1
) {
  return discoverMovies({
    primary_release_year:
      normalizeYear(year),

    page: normalizePage(page),
  });
}

export async function getMoviesByDecade(
  decade,
  page = 1
) {
  const decadeMap = {
    '2020s': [2020, 2029],
    '2010s': [2010, 2019],
    '2000s': [2000, 2009],
    '1990s': [1990, 1999],
    '1980s': [1980, 1989],
    '1970s': [1970, 1979],
    '1960s': [1960, 1969],
    '1950s': [1950, 1959],
    '1940s': [1940, 1949],
    '1930s': [1930, 1939],
    '1920s': [1920, 1929],
  };

  const [
    startYear,
    endYear,
  ] =
    decadeMap[decade] ||
    decadeMap['2020s'];

  return discoverMovies({
    'primary_release_date.gte':
      `${startYear}-01-01`,

    'primary_release_date.lte':
      `${endYear}-12-31`,

    page: normalizePage(page),
  });
}

// ============================================================
// DATE
// ============================================================

export async function getMoviesByReleaseDate(
  startDate,
  endDate,
  page = 1
) {
  return discoverMovies({
    'primary_release_date.gte':
      normalizeDate(
        startDate,
        'start date'
      ),

    'primary_release_date.lte':
      normalizeDate(
        endDate,
        'end date'
      ),

    page: normalizePage(page),
  });
}

export async function getTvSeriesByFirstAirDate(
  startDate,
  endDate,
  page = 1
) {
  return discoverTv({
    'first_air_date.gte':
      normalizeDate(
        startDate,
        'start date'
      ),

    'first_air_date.lte':
      normalizeDate(
        endDate,
        'end date'
      ),

    page: normalizePage(page),
  });
}

// ============================================================
// RATING
// ============================================================

export async function getMoviesByRating(
  minRating = 7.0,
  page = 1
) {
  return discoverMovies({
    'vote_average.gte':
      normalizeRating(minRating),

    'vote_count.gte': 100,

    page: normalizePage(page),
  });
}

// ============================================================
// LANGUAGE / COUNTRY
// ============================================================

export async function getMoviesByLanguage(
  language = 'en',
  page = 1
) {
  return discoverMovies({
    with_original_language:
      normalizeLanguage(language),

    page: normalizePage(page),
  });
}

export async function getMoviesByCountry(
  countryCode = 'US',
  page = 1
) {
  return discoverMovies({
    with_origin_country:
      normalizeRegion(countryCode),

    page: normalizePage(page),
  });
}

// ============================================================
// KEYWORDS
// ============================================================

export async function getMoviesByKeywords(
  keywordIds,
  page = 1
) {
  const keywords =
    normalizeCsv(keywordIds);

  if (!keywords) {
    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  return discoverMovies({
    with_keywords: keywords,
    page: normalizePage(page),
  });
}

// ============================================================
// ADVANCED SEARCH
// ============================================================

export async function getAdvancedMovieSearch(
  params = {}
) {
  const {
    genres = '',
    year = '',
    rating = '',
    keywords = '',
    companies = '',
    sortBy = 'popularity.desc',
    page = 1,
  } = params;

  const discoverParams = {
    sort_by:
      normalizeSortBy(sortBy),

    page:
      normalizePage(page),
  };

  if (genres) {
    discoverParams.with_genres =
      normalizeCsv(genres);
  }

  if (year) {
    discoverParams.primary_release_year =
      normalizeYear(year);
  }

  if (rating !== '') {
    discoverParams[
      'vote_average.gte'
    ] = normalizeRating(rating);
  }

  if (keywords) {
    discoverParams.with_keywords =
      normalizeCsv(keywords);
  }

  if (companies) {
    discoverParams.with_companies =
      normalizeCsv(companies);
  }

  return discoverMovies(
    discoverParams
  );
}

export async function getAdvancedTvSearch(
  params = {}
) {
  const {
    genres = '',
    year = '',
    rating = '',
    networks = '',
    sortBy = 'popularity.desc',
    page = 1,
  } = params;

  const discoverParams = {
    sort_by:
      normalizeSortBy(sortBy),

    page:
      normalizePage(page),
  };

  if (genres) {
    discoverParams.with_genres =
      normalizeCsv(genres);
  }

  if (year) {
    discoverParams.first_air_date_year =
      normalizeYear(year);
  }

  if (rating !== '') {
    discoverParams[
      'vote_average.gte'
    ] = normalizeRating(rating);
  }

  if (networks) {
    discoverParams.with_networks =
      normalizeCsv(networks);
  }

  return discoverTv(
    discoverParams
  );
}

// ============================================================
// TRENDING
// ============================================================

export async function getTrendingMoviesDaily() {
  try {
    const data =
      await fetchApi(
        '/trending/movie/day',
        {
          revalidate: 3600,
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching daily trending movies:',
      error.message
    );

    return [];
  }
}

export async function getTrendingTvSeriesDaily() {
  try {
    const data =
      await fetchApi(
        '/trending/tv/day',
        {
          revalidate: 3600,
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching daily trending TV:',
      error.message
    );

    return [];
  }
}

export async function getTrendingMoviesWeekly() {
  try {
    const data =
      await fetchApi(
        '/trending/movie/week',
        {
          revalidate: 3600,
        }
      );

    return {
      results:
        data?.results || [],

      total_pages:
        data?.total_pages || 1,

      total_results:
        data?.total_results || 0,
    };
  } catch (error) {
    console.error(
      'Error fetching weekly trending movies:',
      error.message
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

export async function getTrendingTvSeriesWeekly() {
  try {
    const data =
      await fetchApi(
        '/trending/tv/week',
        {
          revalidate: 3600,
        }
      );

    return {
      results:
        data?.results || [],

      total_pages:
        data?.total_pages || 1,

      total_results:
        data?.total_results || 0,
    };
  } catch (error) {
    console.error(
      'Error fetching weekly trending TV:',
      error.message
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

// ============================================================
// POPULAR / TOP RATED / NOW PLAYING
// ============================================================

export async function getPopularMovies(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/movie/popular',
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return {
      results:
        data?.results || [],

      total_pages:
        data?.total_pages || 1,

      total_results:
        data?.total_results || 0,
    };
  } catch (error) {
    console.error(
      'Error fetching popular movies:',
      error.message
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

export async function getPopularTvSeries(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/tv/popular',
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return {
      results:
        data?.results || [],

      total_pages:
        data?.total_pages || 1,

      total_results:
        data?.total_results || 0,
    };
  } catch (error) {
    console.error(
      'Error fetching popular TV series:',
      error.message
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

export async function getTopRatedMovies(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/movie/top_rated',
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching top rated movies:',
      error.message
    );

    return [];
  }
}

export async function getTopRatedTvSeries(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/tv/top_rated',
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching top rated TV:',
      error.message
    );

    return [];
  }
}

export async function getNowPlayingMovies(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/movie/now_playing',
        {
          params: {
            page: normalizePage(page),
            region: DEFAULT_REGION,
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching now playing movies:',
      error.message
    );

    return [];
  }
}

export async function getUpcomingMovies(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/movie/upcoming',
        {
          params: {
            page: normalizePage(page),
            region: DEFAULT_REGION,
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching upcoming movies:',
      error.message
    );

    return [];
  }
}

export async function getOnTheAirTvSeries(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/tv/on_the_air',
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching on-the-air TV:',
      error.message
    );

    return [];
  }
}

export async function getAiringTodayTvSeries(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/tv/airing_today',
        {
          params: {
            page: normalizePage(page),
            timezone: 'UTC',
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching airing today TV:',
      error.message
    );

    return [];
  }
}

// ============================================================
// PEOPLE
// ============================================================

export async function getPersonById(
  personId
) {
  try {
    return await fetchApi(
      `/person/${normalizeId(
        personId,
        'person ID'
      )}`
    );
  } catch (error) {
    console.error(
      `Error fetching person ${personId}:`,
      error.message
    );

    return null;
  }
}

export async function getPersonMovieCredits(
  personId
) {
  try {
    return await fetchApi(
      `/person/${normalizeId(
        personId,
        'person ID'
      )}/movie_credits`
    );
  } catch (error) {
    console.error(
      `Error fetching person movie credits ${personId}:`,
      error.message
    );

    return null;
  }
}

export async function getPersonTvCredits(
  personId
) {
  try {
    return await fetchApi(
      `/person/${normalizeId(
        personId,
        'person ID'
      )}/tv_credits`
    );
  } catch (error) {
    console.error(
      `Error fetching person TV credits ${personId}:`,
      error.message
    );

    return null;
  }
}

export async function getPopularPeople(
  page = 1
) {
  try {
    const data =
      await fetchApi(
        '/person/popular',
        {
          params: {
            page: normalizePage(page),
          },
        }
      );

    return data?.results || [];
  } catch (error) {
    console.error(
      'Error fetching popular people:',
      error.message
    );

    return [];
  }
}

export async function getPersonImages(
  personId
) {
  try {
    return await fetchApi(
      `/person/${normalizeId(
        personId,
        'person ID'
      )}/images`
    );
  } catch (error) {
    console.error(
      `Error fetching person images ${personId}:`,
      error.message
    );

    return null;
  }
}

export async function getPersonExternalIds(
  personId
) {
  try {
    return await fetchApi(
      `/person/${normalizeId(
        personId,
        'person ID'
      )}/external_ids`
    );
  } catch (error) {
    console.error(
      `Error fetching person external IDs ${personId}:`,
      error.message
    );

    return null;
  }
}

// ============================================================
// PRODUCTION / COLLECTION
// ============================================================

export async function getMoviesByProductionCompany(
  companyId,
  page = 1
) {
  return discoverMovies({
    with_companies:
      normalizeId(
        companyId,
        'company ID'
      ),

    page: normalizePage(page),
  });
}

export async function getCollectionById(
  collectionId
) {
  try {
    return await fetchApi(
      `/collection/${normalizeId(
        collectionId,
        'collection ID'
      )}`
    );
  } catch (error) {
    console.error(
      `Error fetching collection ${collectionId}:`,
      error.message
    );

    return null;
  }
}

export async function getProductionCompany(
  companyId
) {
  try {
    return await fetchApi(
      `/company/${normalizeId(
        companyId,
        'company ID'
      )}`
    );
  } catch (error) {
    console.error(
      `Error fetching production company ${companyId}:`,
      error.message
    );

    return null;
  }
}

// ============================================================
// WATCH PROVIDERS
// ============================================================

export async function getMoviesByWatchProvider(
  providerId,
  page = 1,
  region = DEFAULT_REGION
) {
  try {
    const data = await fetchApi(
      '/discover/movie',
      {
        params: {
          with_watch_providers: normalizeId(
            providerId,
            'provider ID'
          ),

          watch_region:
            normalizeRegion(region),

          page: normalizePage(page),

          include_adult: false,

          include_video: false,
        },

        revalidate: 86400,
      }
    );

    return {
      results: Array.isArray(data?.results)
        ? data.results
        : [],

      total_pages:
        Number(data?.total_pages) || 1,

      total_results:
        Number(data?.total_results) || 0,
    };
  } catch (error) {
    console.error(
      'Error fetching movies by watch provider:',
      error.message
    );

    return {
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

// ============================================================
// TV SEASONS / EPISODES
// ============================================================

export async function getTvSeriesEpisodeDetails(
  tvId,
  seasonNumber,
  episodeNumber
) {
  try {
    return await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/season/${normalizeId(
        seasonNumber,
        'season number'
      )}/episode/${normalizeId(
        episodeNumber,
        'episode number'
      )}`
    );
  } catch (error) {
    console.error(
      `Error fetching S${seasonNumber}E${episodeNumber}:`,
      error.message
    );

    return null;
  }
}

export async function getTvSeriesSeasonDetails(
  tvId,
  seasonNumber
) {
  try {
    return await fetchApi(
      `/tv/${normalizeId(
        tvId,
        'TV ID'
      )}/season/${normalizeId(
        seasonNumber,
        'season number'
      )}`
    );
  } catch (error) {
    console.error(
      `Error fetching season ${seasonNumber}:`,
      error.message
    );

    return null;
  }
}

// ============================================================
// SLUG
// ============================================================

export const createSlug = (
  title,
  dateString
) => {
  if (!title) {
    return '';
  }

  const normalizedTitle =
    String(title)
      .normalize('NFKD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );

  const baseSlug =
    normalizedTitle
      .toLowerCase()
      .replace(
        /[^a-z0-9\s-]/g,
        ''
      )
      .replace(
        /\s+/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      )
      .replace(
        /^-|-$/g,
        ''
      );

  if (!dateString) {
    return baseSlug;
  }

  const yearMatch =
    String(dateString).match(
      /^\d{4}/
    );

  return yearMatch
    ? `${baseSlug}-${yearMatch[0]}`
    : baseSlug;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

const apiFunctions = {
  // Movie
  getMovieById,
  getMovieVideos,
  getMovieCredits,
  getMovieReviews,
  getSimilarMovies,
  getMovieRecommendations,
  getMovieImages,
  getMovieExternalIds,
  getMovieWatchProviders,

  // TV
  getTvSeriesById,
  getTvSeriesVideos,
  getTvSeriesCredits,
  getTvSeriesReviews,
  getSimilarTvSeries,
  getTvSeriesRecommendations,
  getTvSeriesImages,
  getTvSeriesExternalIds,
  getTvSeriesWatchProviders,

  // Search
  searchMoviesAndTv,
  getMovieByTitle,
  getTvSeriesByTitle,
  searchPeople,
  searchKeywords,
  searchProductionCompanies,

  // Categories
  getMoviesByCategory,
  getTvSeriesByCategory,

  // Genres
  getMovieGenres,
  getTvSeriesGenres,
  getMoviesByGenre,
  getTvSeriesByGenre,

  // Trending
  getTrendingMoviesDaily,
  getTrendingTvSeriesDaily,
  getTrendingMoviesWeekly,
  getTrendingTvSeriesWeekly,

  // Year / Decade
  getMoviesByYear,
  getMoviesByDecade,

  // Dates
  getMoviesByReleaseDate,
  getTvSeriesByFirstAirDate,

  // Rating
  getMoviesByRating,

  // Language / Country
  getMoviesByLanguage,
  getMoviesByCountry,

  // Keywords
  getMoviesByKeywords,

  // Advanced search
  getAdvancedMovieSearch,
  getAdvancedTvSearch,

  // Popular / Top Rated
  getPopularMovies,
  getPopularTvSeries,
  getTopRatedMovies,
  getTopRatedTvSeries,

  // Release status
  getNowPlayingMovies,
  getUpcomingMovies,
  getOnTheAirTvSeries,
  getAiringTodayTvSeries,

  // People
  getPersonById,
  getPersonMovieCredits,
  getPersonTvCredits,
  getPopularPeople,
  getPersonImages,
  getPersonExternalIds,

  // Production
  getMoviesByProductionCompany,
  getProductionCompany,

  // Collection
  getCollectionById,

  // Watch providers
  getMoviesByWatchProvider,

  // TV seasons / episodes
  getTvSeriesEpisodeDetails,
  getTvSeriesSeasonDetails,

  // Utilities
  createSlug,
};

export default apiFunctions;