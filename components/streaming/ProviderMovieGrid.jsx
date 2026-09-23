"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";

import NativeAd from "../ads/NativeAd";

function createMovieSlug(movie) {
const title = movie?.title || "";

const year = movie?.release_date
? movie.release_date.substring(0, 4)
: "";

const titleSlug = title
.toLowerCase()
.trim()
.replace(/&/g, "and")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");

if (!titleSlug) {
return movie?.id ? String(movie.id) : "";
}

return year ? `${titleSlug}-${year}` : titleSlug;
}

function MovieCard({ movie }) {
const slug = createMovieSlug(movie);

if (!slug) {
return null;
}

return (
<Link
href={`/movie/${slug}`}
className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900/70 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/50"
> <div className="aspect-[2/3] overflow-hidden bg-gray-900">
{movie.poster_path ? (
<img
src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
alt={`${movie.title || "Movie"} poster`}
loading="lazy"
className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
/>
) : ( <div className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-600">
No poster </div>
)} </div>

  <div className="p-3">
    <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-cyan-300">
      {movie.title}
    </h3>

    {movie.release_date && (
      <p className="mt-1 text-xs text-gray-500">
        {movie.release_date.substring(0, 4)}
      </p>
    )}
  </div>
</Link>

);
}

function MovieGrid({ movies }) {
return ( <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
{movies.map((movie) => ( <MovieCard
       key={movie.id}
       movie={movie}
     />
))} </div>
);
}

export default function ProviderMovieGrid({
initialMovies = [],
initialPage = 1,
totalPages = 0,
totalResults = 0,
providerSlug,
region,
}) {
const [movies, setMovies] = useState(initialMovies);
const [currentPage, setCurrentPage] = useState(initialPage);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const hasMore = currentPage < totalPages;

const firstMovies = movies.slice(0, 6);
const remainingMovies = movies.slice(6);

async function handleLoadMore() {
if (loading || !hasMore) {
return;
}

const nextPage = currentPage + 1;

setLoading(true);
setError("");

try {
  const params = new URLSearchParams();

  params.set("provider", providerSlug);
  params.set("page", String(nextPage));
  params.set("region", region);

  const response = await fetch(
    `/api/streaming/provider?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load more movies.");
  }

  const data = await response.json();

  const newMovies = Array.isArray(data?.results)
    ? data.results
    : [];

  setMovies((previousMovies) => {
    const existingIds = new Set(
      previousMovies.map((movie) => movie.id)
    );

    const uniqueMovies = newMovies.filter(
      (movie) =>
        movie?.id &&
        !existingIds.has(movie.id)
    );

    return [...previousMovies, ...uniqueMovies];
  });

  setCurrentPage(nextPage);
} catch (err) {
  console.error(
    "Load more provider movies error:",
    err
  );

  setError(
    "Unable to load more movies. Please try again."
  );
} finally {
  setLoading(false);
}

}

return ( <div>
{/* POSTERS 1–6 */}
{firstMovies.length > 0 && ( <MovieGrid movies={firstMovies} />
)}

  {/* NATIVE AD — ROW 2 */}
  {movies.length >= 6 && (
    <div className="my-8 w-full">
      <NativeAd />
    </div>
  )}

  {/* POSTERS 7–DST */}
  {remainingMovies.length > 0 && (
    <MovieGrid movies={remainingMovies} />
  )}

  {/* LOAD MORE ERROR */}
  {error && (
    <div className="mt-6 text-center">
      <p className="mb-3 text-sm text-red-400">
        {error}
      </p>

      <button
        type="button"
        onClick={handleLoadMore}
        disabled={loading}
        className="rounded-lg border border-gray-700 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-cyan-500/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Try Again
      </button>
    </div>
  )}

  {/* LOAD MORE */}
  {hasMore && !error && (
    <div className="mt-10 flex flex-col items-center">
      <button
        type="button"
        onClick={handleLoadMore}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-6 py-3 text-sm font-semibold text-gray-200 shadow-sm transition-all duration-200 hover:border-cyan-500/50 hover:bg-gray-800 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Loading Movies...
          </>
        ) : (
          <>
            <Plus size={18} />
            Load More Movies
          </>
        )}
      </button>

      <p className="mt-3 text-xs text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  )}

  {/* END */}
  {!hasMore && movies.length > 0 && (
    <p className="mt-10 text-center text-xs text-gray-600">
      You have reached the end of the available
      movies for this provider.
    </p>
  )}
</div>
);
}
