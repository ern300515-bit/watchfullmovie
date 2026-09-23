// app/movie/year/[year]/YearArchiveClient.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaCalendar,
  FaFilm,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
} from "react-icons/fa";

import MediaCard from "../../../../components/MediaCard";
import NativeAd from "../../../../components/ads/NativeAd";

export default function YearArchiveClient({
  year,
  initialMovies,
  genres,
}) {
  const safeMovies = useMemo(
    () => (Array.isArray(initialMovies) ? initialMovies : []),
    [initialMovies]
  );

  const safeGenres = useMemo(
    () => (Array.isArray(genres) ? genres : []),
    [genres]
  );

  const numericYear = Number(year);
  const safeYear = Number.isFinite(numericYear)
    ? numericYear
    : new Date().getFullYear();

  const [movies] = useState(safeMovies);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentYear, setCurrentYear] = useState(null); // <-- State baru

  const itemsPerPage = 20;

  // Set currentYear setelah mount
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Hitung years hanya jika currentYear tersedia
  const years = useMemo(() => {
    if (currentYear === null) return [];
    return Array.from(
      { length: Math.max(1, currentYear - 1899) },
      (_, i) => currentYear - i
    );
  }, [currentYear]);

  const currentYearIndex = years.findIndex((y) => y === safeYear);
  const safeYearIndex = currentYearIndex >= 0 ? currentYearIndex : 0;

  useEffect(() => {
    let filtered = [...movies];
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) => {
        if (!Array.isArray(movie?.genre_ids)) return false;
        return selectedGenres.some((genreId) =>
          movie.genre_ids.includes(genreId)
        );
      });
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return Number(b?.vote_average || 0) - Number(a?.vote_average || 0);
        case "title":
          return String(a?.title || "").localeCompare(String(b?.title || ""));
        case "release":
          return new Date(b?.release_date || 0) - new Date(a?.release_date || 0);
        case "popularity":
        default:
          return Number(b?.popularity || 0) - Number(a?.popularity || 0);
      }
    });
    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [movies, selectedGenres, sortBy]);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / itemsPerPage)
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const getDisplayedMovies = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMovies.slice(startIndex, endIndex);
  };

  const Pagination = () => (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        type="button"
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage <= 1}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        <FaArrowLeft />
        Previous
      </button>
      <span className="text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        Next
        <FaArrowRight />
      </button>
    </div>
  );

  const MovieCard = ({ movie }) => {
    if (!movie) return null;
    const movieTitle = movie.title || "Untitled Movie";
    const movieYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : null;

    return (
      <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 group">
        <Link href={`/movie/${movie.id}`}>
          <div className="relative aspect-[2/3] bg-gray-700">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movieTitle}
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
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded">
              <div className="flex items-center gap-1 text-white text-sm">
                <FaStar className="text-yellow-400" />
                <span>
                  {typeof movie.vote_average === "number"
                    ? movie.vote_average.toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
              {movieTitle}
            </h3>
            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
              <span>{movieYear || "N/A"}</span>
              <span>{Number(movie.vote_count || 0).toLocaleString()} votes</span>
            </div>
            {movie.overview && (
              <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                {movie.overview}
              </p>
            )}
            {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {movie.genre_ids.slice(0, 3).map((genreId) => {
                  const genre = safeGenres.find((g) => g?.id === genreId);
                  return genre ? (
                    <span
                      key={genre.id}
                      className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs"
                    >
                      {genre.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  };

  const displayedMovies = getDisplayedMovies();

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <FaCalendar className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {safeYear} Movies
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Explore {movies.length.toLocaleString()} movies released in {safeYear}
          </p>
        </div>

        {/* Year Navigation - hanya render jika currentYear sudah ada */}
        {currentYear !== null && years.length > 0 && (
          <div className="flex items-center justify-between mb-8">
            {safeYearIndex > 0 ? (
              <Link
                href={`/movie/year/${years[safeYearIndex - 1]}`}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <FaArrowLeft />
                {years[safeYearIndex - 1]}
              </Link>
            ) : (
              <div />
            )}

            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-4 bg-slate-800 px-6 py-3 rounded-lg">
                {years
                  .slice(
                    Math.max(0, safeYearIndex - 2),
                    Math.min(years.length, safeYearIndex + 3)
                  )
                  .map((y) => (
                    <Link
                      key={y}
                      href={`/movie/year/${y}`}
                      className={`px-3 py-1 rounded transition-colors ${
                        y === safeYear
                          ? "bg-orange-600 text-white"
                          : "text-gray-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {y}
                    </Link>
                  ))}
              </div>
            </div>

            {safeYearIndex < years.length - 1 ? (
              <Link
                href={`/movie/year/${years[safeYearIndex + 1]}`}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                {years[safeYearIndex + 1]}
                <FaArrowRight />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaFilter className="text-orange-400" />
                Filter by Genre
              </h3>
              <div className="flex flex-wrap gap-2">
                {safeGenres.slice(0, 10).map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedGenres.includes(genre.id)
                        ? "bg-orange-600 text-white"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-64">
              <h3 className="text-white font-semibold mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-orange-500 focus:outline-none"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title A-Z</option>
                <option value="release">Release Date</option>
              </select>
            </div>

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

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {filteredMovies.length.toLocaleString()} Movies Found
            </h2>
            {selectedGenres.length > 0 && (
              <p className="text-gray-400 text-sm">
                Filtered by {selectedGenres.length} genre
                {selectedGenres.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Results */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-6">
              {selectedGenres.length > 0
                ? "Try adjusting your genre filters"
                : `No movies available for ${safeYear}`}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {displayedMovies.map((movie, index) => {
                if (!movie || !movie.id) return null;
                return (
                  <React.Fragment key={movie.id}>
                    <MediaCard mediaItem={movie} />
                    {index === 5 && displayedMovies.length > 6 && (
                      <div className="col-span-full w-full flex justify-center my-4 md:my-6">
                        <NativeAd
                          containerId={`native-year-${safeYear}`}
                          className="w-full"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {totalPages > 1 && <Pagination />}
          </>
        )}

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Explore More Movie Archives
            </h3>
            <p className="text-gray-400 mb-6">
              Discover movies from different decades and time periods.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/movie/decade/2020s"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                2020s Movies
              </Link>
              <Link
                href="/movie/decade/2010s"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                2010s Movies
              </Link>
              <Link
                href="/movie/popular"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Popular Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}