import { NextResponse } from "next/server";
import { searchMoviesAndTv } from "../../../lib/api.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query")?.trim() || "";
    const pageValue = searchParams.get("page") || "1";

    if (!query) {
      return NextResponse.json(
        {
          results: [],
          total_pages: 0,
          total_results: 0,
        },
        {
          status: 200,
        }
      );
    }

    const parsedPage = Number(pageValue);

    const page =
      Number.isInteger(parsedPage) && parsedPage > 0
        ? Math.min(parsedPage, 500)
        : 1;

    const results = await searchMoviesAndTv(
      query,
      page
    );

    return NextResponse.json(
      {
        results: Array.isArray(results)
          ? results
          : [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error(
      "Search API route error:",
      error
    );

    return NextResponse.json(
      {
        results: [],
        error:
          "Unable to process search request.",
      },
      {
        status: 500,
      }
    );
  }
}