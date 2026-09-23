import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_API_URL =
  process.env.NEXT_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3';

async function fetchTMDB(path) {
  if (!TMDB_API_KEY && !TMDB_ACCESS_TOKEN) {
    throw new Error(
      'TMDB credentials are not configured. Set TMDB_ACCESS_TOKEN or TMDB_API_KEY.'
    );
  }

  const headers = {
    accept: 'application/json',
  };

  let url = `${TMDB_API_URL}${path}?language=en-US`;

  if (TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${TMDB_ACCESS_TOKEN}`;
  } else {
    url += `&api_key=${TMDB_API_KEY}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function GET() {
  try {
    const [movieData, tvData] = await Promise.all([
      fetchTMDB('/genre/movie/list'),
      fetchTMDB('/genre/tv/list'),
    ]);

    return NextResponse.json(
      {
        movieGenres: movieData?.genres || [],
        tvGenres: tvData?.genres || [],
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error) {
    console.error('Genres API error:', error);

    return NextResponse.json(
      {
        movieGenres: [],
        tvGenres: [],
        error: 'Failed to fetch genres',
      },
      { status: 500 }
    );
  }
}