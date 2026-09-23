"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import MovieList from "../../components/MovieList";

const MAX_PAGES = 5;

// ============================================================
// KOMPONEN UTAMA (dibungkus Suspense)
// ============================================================

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

// ============================================================
// KONTEN PENCARIAN
// ============================================================

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // FETCH DATA SAAT QUERY BERUBAH
  // ----------------------------------------------------------

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setPage(1);
      setHasMore(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      setMovies([]);
      setPage(1);
      setHasMore(false);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&page=1`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        const results = data?.results || [];

        setMovies(results);
        setHasMore(results.length > 0 && 1 < MAX_PAGES);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Search error:", err);
        setError("Unable to load search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [query]);

  // ----------------------------------------------------------
  // LOAD MORE
  // ----------------------------------------------------------

  const handleLoadMore = async () => {
    if (isLoading || !query || page >= MAX_PAGES) {
      setHasMore(false);
      return;
    }

    const nextPage = page + 1;
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&page=${nextPage}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error(`Search failed: ${response.status}`);

      const data = await response.json();
      const newResults = data?.results || [];

      setMovies((prev) => [...prev, ...newResults]);
      setPage(nextPage);
      setHasMore(newResults.length > 0 && nextPage < MAX_PAGES);
    } catch (err) {
      console.error("Load more error:", err);
      setError("Unable to load more results.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------
  // SEO
  // ----------------------------------------------------------

  const pageTitle = query
    ? `Search Results for "${query}" - WatchFullMovie`
    : "Search Movies - WatchFullMovie";

  const pageDescription = query
    ? `Find movies and TV shows matching "${query}" on WatchFullMovie.`
    : "Search for your favorite movies and TV shows on WatchFullMovie.";

  const canonicalUrl = `https://watchfullmovie.netlify.app/search`;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  if (!query) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href={canonicalUrl} />
        </Head>

        <div className="flex flex-col items-center justify-center min-h-screen text-white p-8 bg-slate-900">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Movies</h1>
          <p className="text-lg text-gray-400 text-center mb-8">
            Please enter the name of the movie you want to search for in the search box.
          </p>
          <Link href="/" className="text-blue-400 hover:text-blue-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <main className="min-h-screen p-8 bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Search Results for &quot;{query}&quot;
        </h1>

        {isLoading && movies.length === 0 && (
          <p className="text-center text-gray-400 mb-8">Searching...</p>
        )}

        {!isLoading && movies.length > 0 && (
          <p className="text-center text-gray-400 mb-8">
            Found {movies.length} results.
          </p>
        )}

        {error && <div className="text-center text-red-400 mb-8">{error}</div>}

        {!isLoading && !error && movies.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No Movies Found.</p>
            <p className="mt-2 text-sm">Try searching with a different title.</p>
          </div>
        )}

        {movies.length > 0 && <MovieList movies={movies} />}

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {!hasMore && movies.length > 0 && page >= MAX_PAGES && (
          <p className="text-center text-gray-500 mt-8">
            Showing the first {MAX_PAGES} pages of results.
          </p>
        )}
      </main>
    </>
  );
}