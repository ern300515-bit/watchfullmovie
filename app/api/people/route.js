// app/api/people/route.js

import { NextResponse } from 'next/server';
import {
  getPopularPeople,
  searchPeople,
} from '../../../lib/api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query')?.trim() || '';
    const pageParam = Number(searchParams.get('page') || 1);

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? Math.min(pageParam, 500)
        : 1;

    if (query) {
      const results = await searchPeople(query, page);

      return NextResponse.json(
        {
          results: Array.isArray(results) ? results : [],
          total_pages: 1,
          total_results: Array.isArray(results)
            ? results.length
            : 0,
        },
        {
          status: 200,
          headers: {
            'Cache-Control':
              'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    const data = await getPopularPeople(page);

    return NextResponse.json(
      {
        results: Array.isArray(data?.results)
          ? data.results
          : [],
        total_pages: Number(data?.total_pages) || 1,
        total_results: Number(data?.total_results) || 0,
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error(
      '❌ /api/people error:',
      error?.message || error
    );

    return NextResponse.json(
      {
        results: [],
        total_pages: 0,
        total_results: 0,
        error: 'Unable to fetch people data.',
      },
      {
        status: 500,
      }
    );
  }
}