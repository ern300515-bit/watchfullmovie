// app/movie/decade/[decade]/DecadeArchiveClient.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFilter,
  FaFilm,
  FaStar,
  FaHistory,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import MediaCard from "../../../../components/MediaCard";
import NativeAd from "../../../../components/ads/NativeAd";

export default function DecadeArchiveClient({
  decade,
  initialMovies = [],
  genres = [],
}) {
  /*
   * ============================================================
   * SAFE DATA NORMALIZATION
   * ============================================================
   *
   * Prevent runtime errors when server/API returns:
   * undefined, null, object, or malformed data.
   */

  const safeMovies = useMemo(() => {
    return Array.isArray(initialMovies) ? initialMovies : [];
  }, [initialMovies]);

  const safeGenres = useMemo(() => {
    return Array.isArray(genres) ? genres : [];
  }, [genres]);

  const safeDecade =
    typeof decade === "string" ? decade.toLowerCase().trim() : "";

  const [movies] = useState(safeMovies);
  const [filteredMovies, setFilteredMovies] = useState(safeMovies);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  /*
   * ============================================================
   * DECADE DEFINITIONS
   * ============================================================
   */

  const decades = useMemo(
    () => [
      {
        id: "2020s",
        name: "2020s",
        start: 2020,
        end: 2029,
        color: "from-blue-500 to-purple-600",
      },
      {
        id: "2010s",
        name: "2010s",
        start: 2010,
        end: 2019,
        color: "from-green-500 to-blue-600",
      },
      {
        id: "2000s",
        name: "2000s",
        start: 2000,
        end: 2009,
        color: "from-yellow-500 to-orange-600",
      },
      {
        id: "1990s",
        name: "1990s",
        start: 1990,
        end: 1999,
        color: "from-red-500 to-pink-600",
      },
      {
        id: "1980s",
        name: "1980s",
        start: 1980,
        end: 1989,
        color: "from-purple-500 to-indigo-600",
      },
      {
        id: "1970s",
        name: "1970s",
        start: 1970,
        end: 1979,
        color: "from-orange-500 to-red-600",
      },
      {
        id: "1960s",
        name: "1960s",
        start: 1960,
        end: 1969,
        color: "from-teal-500 to-green-600",
      },
      {
        id: "1950s",
        name: "1950s",
        start: 1950,
        end: 1959,
        color: "from-indigo-500 to-purple-600",
      },
    ],
    []
  );

  /*
   * IMPORTANT:
   * currentDecade can be undefined if URL is invalid.
   * Use a safe fallback so the page never crashes.
   */

  const currentDecade = useMemo(() => {
    return (
      decades.find((item) => item.id === safeDecade) || {
        id: safeDecade || "unknown",
        name: safeDecade
          ? safeDecade.replace(/s$/i, "") + "s"
          : "Movie Archive",
        start: "",
        end: "",
        color: "from-blue-500 to-purple-600",
      }
    );
  }, [decades, safeDecade]);

  /*
   * ============================================================
   * FILTER & SORT
   * ============================================================
   */

  useEffect(() => {
    let filtered = [...safeMovies];

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) => {
        const movieGenreIds = Array.isArray(movie?.genre_ids)
          ? movie.genre_ids
          : [];

        return selectedGenres.some((genreId) =>
          movieGenreIds.includes(genreId)
        );
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (
            Number(b?.vote_average || 0) -
            Number(a?.vote_average || 0)
          );

        case "title":
          return String(a?.title || "").localeCompare(
            String(b?.title || "")
          );

        case "release":
          return (
            new Date(b?.release_date || 0).getTime() -
            new Date(a?.release_date || 0).getTime()
          );

        case "popularity":
        default:
          return (
            Number(b?.popularity || 0) -
            Number(a?.popularity || 0)
          );
      }
    });

    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [safeMovies, selectedGenres, sortBy]);

  /*
   * ============================================================
   * GENRE FILTER
   * ============================================================
   */

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy("popularity");
  };

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  const getDisplayedMovies = () => {
    const startIndex =
      (safeCurrentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    return filteredMovies.slice(startIndex, endIndex);
  };

  /*
   * ============================================================
   * PAGINATION COMPONENT
   * ============================================================
   */

  const Pagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    return (
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.max(1, prev - 1)
            )
          }
          disabled={safeCurrentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
        >
          <FaArrowLeft />
          Previous
        </button>

        <span className="text-gray-300">
          Page {safeCurrentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(totalPages, prev + 1)
            )
          }
          disabled={safeCurrentPage >= totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
        >
          Next
          <FaArrowRight />
        </button>
      </div>
    );
  };

  /*
   * ============================================================
   * MOVIE CARD
   * ============================================================
   *
   * Kept here for compatibility/reference.
   * Main grid currently uses MediaCard, matching your existing UI.
   */

  const MovieCard = ({ movie }) => {
    if (!movie) {
      return null;
    }

    const movieId = movie.id;

    const title =
      movie.title ||
      movie.name ||
      "Untitled Movie";

    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "N/A";

    return (
      <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <Link href={`/movie/${movieId}`}>
          <div className="relative aspect-[2/3] bg-gray-700">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-600">
                <FaFilm className="text-4xl text-gray-400" />
              </div>
            )}

            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded">
              <div className="flex items-center gap-1 text-white text-sm">
                <FaStar className="text-yellow-400" />

                <span>
                  {typeof movie.vote_average === "number"
                    ? movie.vote_average.toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded">
              <span className="text-white text-sm">
                {releaseYear}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
              {title}
            </h3>

            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
              <span>
                {Number(movie.vote_count || 0).toLocaleString()}{" "}
                votes
              </span>

              <span>
                Rating:{" "}
                {typeof movie.vote_average === "number"
                  ? movie.vote_average.toFixed(1)
                  : "N/A"}
              </span>
            </div>

            {movie.overview && (
              <p className="text-gray-300 text-sm line-clamp-3">
                {movie.overview}
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  };

  /*
   * ============================================================
   * LOADING SKELETON
   * ============================================================
   */

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-800 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="aspect-[2/3] bg-gray-700" />

          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-700 rounded" />
            <div className="h-3 bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  /*
   * ============================================================
   * DECADE STATS
   * ============================================================
   */

  const DecadeStats = () => {
    const movieCount = safeMovies.length;

    const averageRating =
      movieCount > 0
        ? safeMovies.reduce(
            (acc, movie) =>
              acc + Number(movie?.vote_average || 0),
            0
          ) / movieCount
        : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Movies */}
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {movieCount.toLocaleString()}
          </div>

          <div className="text-gray-400">
            Total Movies
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {averageRating.toFixed(1)}
          </div>

          <div className="text-gray-400">
            Average Rating
          </div>
        </div>

        {/* Decade Range */}
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {currentDecade.start !== "" &&
            currentDecade.end !== ""
              ? `${currentDecade.start}-${currentDecade.end}`
              : "—"}
          </div>

          <div className="text-gray-400">
            Decade Range
          </div>
        </div>
      </div>
    );
  };

  /*
   * ============================================================
   * DISPLAY DATA
   * ============================================================
   */

  const movieCount = safeMovies.length;
  const filteredCount = filteredMovies.length;
  const displayedMovies = getDisplayedMovies();

  const decadeName = currentDecade?.name || "Movie Archive";

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className={`p-3 bg-gradient-to-br ${
                currentDecade?.color ||
                "from-blue-500 to-purple-600"
              } rounded-full`}
            >
              <FaHistory className="text-2xl text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {decadeName} Movies
            </h1>
          </div>

          <p className="text-gray-400 text-lg">
            Relive the cinema of the {decadeName} —{" "}
            {movieCount.toLocaleString()} movies
            {currentDecade.start !== "" &&
            currentDecade.end !== ""
              ? ` from ${currentDecade.start} to ${currentDecade.end}`
              : ""}
          </p>
        </div>

        {/* ======================================================
            DECADE NAVIGATION
        ====================================================== */}

        <div className="flex overflow-x-auto gap-2 mb-8 pb-4">
          {decades.map((dec) => (
            <Link
              key={dec.id}
              href={`/movie/decade/${dec.id}`}
              className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all ${
                dec.id === safeDecade
                  ? `bg-gradient-to-r ${dec.color} text-white shadow-lg`
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {dec.name}
            </Link>
          ))}
        </div>

        {/* ======================================================
            DECADE STATS
        ====================================================== */}

        <DecadeStats />

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Genres */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaFilter className="text-orange-400" />
                Filter by Genre
              </h3>

              {safeGenres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {safeGenres
                    .slice(0, 8)
                    .map((genre) => (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() =>
                          toggleGenre(genre.id)
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedGenres.includes(
                            genre.id
                          )
                            ? "bg-orange-600 text-white"
                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Genre filters are currently unavailable.
                </p>
              )}
            </div>

            {/* Sort */}
            <div className="lg:w-64">
              <h3 className="text-white font-semibold mb-3">
                Sort By
              </h3>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-orange-500 focus:outline-none"
              >
                <option value="popularity">
                  Most Popular
                </option>

                <option value="rating">
                  Highest Rated
                </option>

                <option value="title">
                  Title A-Z
                </option>

                <option value="release">
                  Release Date
                </option>
              </select>
            </div>

            {/* Clear */}
            <div className="lg:w-auto flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================
            RESULTS HEADER
        ====================================================== */}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {filteredCount.toLocaleString()} Movies Found
            </h2>

            <p className="text-gray-400 text-sm">
              {currentDecade.start !== "" &&
              currentDecade.end !== ""
                ? `${currentDecade.start} - ${currentDecade.end}`
                : "Movie archive"}
              {selectedGenres.length > 0 &&
                ` • Filtered by ${selectedGenres.length} genre${
                  selectedGenres.length !== 1
                    ? "s"
                    : ""
                }`}
            </p>
          </div>

          {filteredCount > 0 && (
            <div className="text-gray-400 text-sm">
              Page {safeCurrentPage} of{" "}
              {totalPages}
            </div>
          )}
        </div>

        {/* ======================================================
            NO RESULTS
        ====================================================== */}

        {filteredCount === 0 ? (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-600 mx-auto mb-4" />

            <h3 className="text-xl text-white mb-2">
              No movies found
            </h3>

            <p className="text-gray-400 mb-6">
              {selectedGenres.length > 0
                ? "Try adjusting your genre filters"
                : `No movies available for the ${decadeName}`}
            </p>

            {selectedGenres.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ==================================================
                MOVIE GRID
            ================================================== */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {displayedMovies.map(
                (movie, index) => {
                  if (!movie) {
                    return null;
                  }

                  return (
                    <React.Fragment
                      key={
                        movie.id ??
                        `movie-${index}`
                      }
                    >
                      <MediaCard
                        mediaItem={movie}
                      />

                      {/* Native Ad after movie #6 */}
                      {index === 5 &&
                        displayedMovies.length >
                          6 && (
                          <div className="col-span-full flex justify-center my-4 md:my-6">
                            <NativeAd
                              containerId={`container-native-decade-${safeDecade}`}
                              scriptSrc="//fundingfashioned.com/3c8dd364b31abdcec1fbe88116c9ac96/invoke.js"
                              className="w-full"
                              fallbackHeight={250}
                            />
                          </div>
                        )}
                    </React.Fragment>
                  );
                }
              )}
            </div>

            {/* ==================================================
                PAGINATION
            ================================================== */}

            <Pagination />
          </>
        )}

        {/* ======================================================
            QUICK LINKS
        ====================================================== */}

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8">

            <h3 className="text-2xl font-bold text-white mb-4">
              Explore More Movie Archives
            </h3>

            <p className="text-gray-400 mb-6">
              Discover movies from different time
              periods and categories.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              <Link
                href="/movie/year/2024"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                2024 Movies
              </Link>

              <Link
                href="/movie/popular"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Popular Movies
              </Link>

              <Link
                href="/movie/category/top_rated"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Top Rated
              </Link>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}