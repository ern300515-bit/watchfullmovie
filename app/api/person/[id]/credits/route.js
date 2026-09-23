// app/api/person/[id]/credits/route.js

import { NextResponse } from 'next/server';
import {
  getPersonMovieCredits,
  getPersonTvCredits,
} from '../../../../../lib/api';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const personId = Number(id);

    if (
      !Number.isInteger(personId) ||
      personId <= 0
    ) {
      return NextResponse.json(
        {
          error: 'Invalid person ID.',
          movieCredits: null,
          tvCredits: null,
        },
        {
          status: 400,
        }
      );
    }

    const [movieCredits, tvCredits] =
      await Promise.all([
        getPersonMovieCredits(personId),
        getPersonTvCredits(personId),
      ]);

    return NextResponse.json(
      {
        movieCredits: movieCredits || null,
        tvCredits: tvCredits || null,
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
    console.error(
      '❌ /api/person/[id]/credits error:',
      error?.message || error
    );

    return NextResponse.json(
      {
        movieCredits: null,
        tvCredits: null,
        error: 'Unable to fetch person credits.',
      },
      {
        status: 500,
      }
    );
  }
}