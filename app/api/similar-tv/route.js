// app/api/similar-tv/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tvId = searchParams.get('tvId');
  const page = parseInt(searchParams.get('page'), 10) || 1;
  const keywordId = 267122; // "sex"

  if (!tvId) {
    return NextResponse.json(
      { error: 'tvId is required' },
      { status: 400 }
    );
  }

  const API_KEY = process.env.TMDB_API_KEY;
  const baseUrl = 'https://api.themoviedb.org/3';

  if (!API_KEY) {
    console.error('TMDB_API_KEY is not configured');

    return NextResponse.json(
      { error: 'TMDB API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const url =
      `${baseUrl}/discover/tv` +
      `?api_key=${encodeURIComponent(API_KEY)}` +
      `&with_keywords=${keywordId}` +
      `&sort_by=popularity.desc` +
      `&page=${page}`;

    const res = await fetch(url, {
      next: {
        revalidate: 86400,
      },
    });

    if (!res.ok) {
      throw new Error(`TMDb API error: ${res.status}`);
    }

    const data = await res.json();

    // Filter out the current TV series
    const filtered = (data.results || []).filter(
      (item) => item.id !== parseInt(tvId, 10)
    );

    return NextResponse.json({
      results: filtered,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (error) {
    console.error('Error in /api/similar-tv:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}