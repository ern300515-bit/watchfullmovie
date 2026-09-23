
import { NextResponse } from "next/server";

import { getMoviesByWatchProvider } from "../../../../lib/api";
import { getStreamingProvider } from "../../../../lib/streamingProviders";

const DEFAULT_REGION = (
  process.env.TMDB_REGION || "US"
).trim().toUpperCase();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const providerSlug = searchParams.get("provider");
    const page = Number(searchParams.get("page")) || 1;
    const region = (
      searchParams.get("region") || DEFAULT_REGION
    )
      .trim()
      .toUpperCase();

    const provider = getStreamingProvider(providerSlug);

    if (!provider) {
      return NextResponse.json(
        {
          error: "Streaming provider not found.",
        },
        { status: 404 }
      );
    }

    if (page < 1) {
      return NextResponse.json(
        {
          error: "Invalid page.",
        },
        { status: 400 }
      );
    }

    const data = await getMoviesByWatchProvider(
      provider.providerId,
      page,
      region
    );

    return NextResponse.json({
      provider: {
        slug: provider.slug,
        name: provider.name,
      },

      results: Array.isArray(data?.results)
        ? data.results
        : [],

      page,

      total_pages:
        Number(data?.total_pages) || 0,

      total_results:
        Number(data?.total_results) || 0,
    });
  } catch (error) {
    console.error(
      "Streaming provider API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch streaming provider movies.",
      },
      { status: 500 }
    );
  }
}