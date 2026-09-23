import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';

        const API_KEY = process.env.TMDB_API_KEY;

        if (!API_KEY) {
            console.error('TMDB_API_KEY is not configured');

            return NextResponse.json(
                { error: 'TMDB API key is not configured' },
                { status: 500 }
            );
        }

        const keywordId = 267122;

        const url =
            `https://api.themoviedb.org/3/keyword/${keywordId}/movies` +
            `?api_key=${encodeURIComponent(API_KEY)}` +
            `&page=${encodeURIComponent(page)}`;

        const response = await fetch(url, {
            next: {
                revalidate: 86400,
            },
        });

        if (!response.ok) {
            console.error(
                `TMDB keyword movies request failed: ${response.status}`
            );

            return NextResponse.json(
                { error: 'Failed to fetch similar movies' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Similar movie API error:', error);

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}