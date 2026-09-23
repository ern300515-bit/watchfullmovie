// app/actors/ActorsClient.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSearch,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

import NativeAd from "../../components/ads/NativeAd";

/*
 * ---------------------------------------------------------
 * ACTOR SLUG
 * ---------------------------------------------------------
 */

const createActorSlug = (name, id) => {
  const slugName = String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slugName || "unknown-actor"}-${id}`;
};

/*
 * ---------------------------------------------------------
 * MEDIA SLUG
 * ---------------------------------------------------------
 */

const createMediaSlug = (item) => {
  if (!item) {
    return "";
  }

  const title = item.title || item.name;

  if (!title) {
    return "";
  }

  const baseSlug = String(title)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const date =
    item.release_date ||
    item.first_air_date ||
    "";

  const year =
    /^\d{4}/.test(String(date))
      ? String(date).substring(0, 4)
      : "";

  return year
    ? `${baseSlug}-${year}`
    : baseSlug;
};

/*
 * ---------------------------------------------------------
 * API HELPERS
 * ---------------------------------------------------------
 *
 * IMPORTANT:
 * Jangan import lib/api.js di Client Component.
 *
 * Semua TMDB request dilakukan melalui:
 *
 * /api/people
 * /api/person/[id]/credits
 *
 * sehingga API credential tetap berada di server.
 */

async function fetchPeople({
  query = "",
  page = 1,
  signal,
} = {}) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("query", query.trim());
  }

  params.set("page", String(page));

  const response = await fetch(
    `/api/people?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(
      `People API request failed: ${response.status}`
    );
  }

  return response.json();
}

/*
 * ---------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------
 */

export default function ActorsClient({
  initialPeople,
  totalPages: initialTotalPages,
}) {
  const safeInitialPeople = Array.isArray(initialPeople)
    ? initialPeople
    : [];

  const safeInitialTotalPages =
    Number.isInteger(Number(initialTotalPages)) &&
    Number(initialTotalPages) > 0
      ? Number(initialTotalPages)
      : 1;

  const [people, setPeople] = useState(
    safeInitialPeople
  );

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [isSearching, setIsSearching] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(safeInitialTotalPages);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  /*
   * -------------------------------------------------------
   * POPULAR PEOPLE
   * -------------------------------------------------------
   */

  const fetchPopularPeople = async (
    page = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPeople({
        page,
      });

      const results = Array.isArray(
        data?.results
      )
        ? data.results
        : [];

      setPeople(results);

      setTotalPages(
        Number(data?.total_pages) || 1
      );
    } catch (err) {
      console.error(
        "Error fetching popular people:",
        err
      );

      setError(
        "Failed to load actors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * -------------------------------------------------------
   * PAGE CHANGE
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (
      currentPage > 1 &&
      !isSearching
    ) {
      fetchPopularPeople(currentPage);
    }
  }, [currentPage, isSearching]);

  /*
   * -------------------------------------------------------
   * SEARCH
   * -------------------------------------------------------
   */

  const handleSearch = async (e) => {
    e.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      clearSearch();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      const data = await fetchPeople({
        query,
        page: 1,
      });

      setSearchResults(
        Array.isArray(data?.results)
          ? data.results
          : []
      );
    } catch (err) {
      console.error(
        "Error searching people:",
        err
      );

      setSearchResults([]);

      setError(
        "Search failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * -------------------------------------------------------
   * CLEAR SEARCH
   * -------------------------------------------------------
   */

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setCurrentPage(1);

    setPeople(
      safeInitialPeople
    );

    setTotalPages(
      safeInitialTotalPages
    );

    setError(null);
  };

  /*
   * -------------------------------------------------------
   * DISPLAY DATA
   * -------------------------------------------------------
   */

  const displayedPeople =
    isSearching
      ? searchResults
      : people;

  /*
   * -------------------------------------------------------
   * PERSON CARD
   * -------------------------------------------------------
   */

  const PersonCard = ({
    person,
  }) => {
    if (!person?.id) {
      return null;
    }

    const slug =
      createActorSlug(
        person.name,
        person.id
      );

    const posterUrl =
      person.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : null;

    const popularity =
      Number(person.popularity) || 0;

    return (
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700 hover:border-orange-400/50 group">

        <Link
          href={`/actor/${slug}`}
          className="block"
        >
          <div className="relative aspect-[2/3] bg-gray-700">

            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={
                  person.name ||
                  "Actor"
                }
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-600">
                <FaUser className="text-4xl text-gray-400" />
              </div>
            )}

            {/* Hover overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

              <h3 className="text-white text-sm font-bold line-clamp-2">
                {person.name ||
                  "Unknown Actor"}
              </h3>

              {person.known_for_department && (
                <p className="text-gray-300 text-xs">
                  {
                    person.known_for_department
                  }
                </p>
              )}

              {popularity > 0 && (
                <div className="flex items-center gap-1 text-xs text-yellow-400 mt-1">
                  <FaStar className="text-[10px]" />

                  <span>
                    {popularity.toFixed(
                      0
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Popular badge */}

            {popularity > 50 && (
              <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                🔥 Popular
              </div>
            )}
          </div>

          {/* Actor information */}

          <div className="p-3 text-center">

            <h3 className="text-white text-sm font-semibold truncate group-hover:text-orange-400 transition-colors">
              {person.name ||
                "Unknown"}
            </h3>

            {person.known_for_department && (
              <p className="text-gray-400 text-xs">
                {
                  person.known_for_department
                }
              </p>
            )}
          </div>
        </Link>

        {/* Known For */}

        {Array.isArray(
          person.known_for
        ) &&
          person.known_for.length >
            0 && (
            <div className="px-3 pb-3 flex flex-wrap gap-1 justify-center">

              {person.known_for
                .slice(0, 3)
                .map(
                  (
                    work,
                    index
                  ) => {
                    if (!work) {
                      return null;
                    }

                    const mediaSlug =
                      createMediaSlug(
                        work
                      );

                    if (!mediaSlug) {
                      return null;
                    }

                    const mediaType =
                      work.media_type ===
                      "tv"
                        ? "tv-show"
                        : "movie";

                    const title =
                      work.title ||
                      work.name ||
                      "";

                    if (!title) {
                      return null;
                    }

                    return (
                      <Link
                        key={`${work.id || "work"}-${index}`}
                        href={`/${mediaType}/${mediaSlug}`}
                        className="text-[10px] bg-slate-700 hover:bg-orange-500/20 text-gray-300 hover:text-orange-300 px-2 py-0.5 rounded-full transition-colors truncate max-w-[80px]"
                      >
                        {title}
                      </Link>
                    );
                  }
                )}

            </div>
          )}
      </div>
    );
  };

  /*
   * -------------------------------------------------------
   * PAGINATION
   * -------------------------------------------------------
   */

  const Pagination = () => (
    <div className="flex justify-center items-center space-x-4 mt-8">

      <button
        type="button"
        onClick={() =>
          setCurrentPage(
            (prev) =>
              Math.max(
                1,
                prev - 1
              )
          )
        }
        disabled={
          currentPage === 1 ||
          loading
        }
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        <FaArrowLeft />

        Previous
      </button>

      <span className="text-gray-300">
        Page {currentPage} of{" "}
        {totalPages}
      </span>

      <button
        type="button"
        onClick={() =>
          setCurrentPage(
            (prev) =>
              Math.min(
                totalPages,
                prev + 1
              )
          )
        }
        disabled={
          currentPage >=
            totalPages ||
          loading
        }
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        Next

        <FaArrowRight />
      </button>
    </div>
  );

  /*
   * -------------------------------------------------------
   * EMPTY INITIAL STATE
   * -------------------------------------------------------
   */

  if (
    !loading &&
    !isSearching &&
    displayedPeople.length === 0 &&
    !error
  ) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">

        <div className="container mx-auto px-4">

          <div className="text-center py-12">

            <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />

            <h3 className="text-xl text-white mb-2">
              No actors found
            </h3>

            <p className="text-gray-400 mb-4">
              Unable to load popular actors
            </p>

            <button
              type="button"
              onClick={() =>
                fetchPopularPeople(1)
              }
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * MAIN RENDER
   * -------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-slate-900 py-8">

      <div className="container mx-auto px-4">

        {/* HEADER */}

        <div className="text-center mb-8">

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Actors & Celebrities
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover your favorite actors,
            directors, and crew members
            from the world of cinema and
            television.
          </p>

        </div>

        {/* SEARCH */}

        <div className="max-w-2xl mx-auto mb-8">

          <form
            onSubmit={handleSearch}
            className="relative"
          >
            <div className="flex gap-2">

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search actors, directors, crew..."
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <FaSearch />

                Search
              </button>

            </div>
          </form>

          {isSearching && (
            <div className="mt-4 flex items-center justify-between">

              <p className="text-gray-400">
                {searchResults.length}{" "}
                results for "
                {searchQuery}"
              </p>

              <button
                type="button"
                onClick={
                  clearSearch
                }
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                Clear search
              </button>

            </div>
          )}

        </div>

        {/* NATIVE AD */}

        <div className="w-full mb-8">
          <NativeAd />
        </div>

        {/* RESULTS */}

        <div className="mb-8">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-white">
              {isSearching
                ? "Search Results"
                : "Popular Actors"}
            </h2>

            {!isSearching && (
              <div className="flex items-center gap-2 text-gray-400">

                <FaUser className="text-orange-400" />

                <span>
                  Page{" "}
                  {currentPage}
                </span>

              </div>
            )}

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">

              {Array.from({
                length: 12,
              }).map(
                (_, index) => (
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
                )
              )}

            </div>

          ) : error ? (

            /* ERROR */

            <div className="text-center py-12">

              <p className="text-red-400 mb-4">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  if (isSearching) {
                    handleSearch(
                      new Event(
                        "submit"
                      )
                    );
                  } else {
                    fetchPopularPeople(
                      currentPage
                    );
                  }
                }}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>

            </div>

          ) : displayedPeople.length ===
            0 ? (

            /* NO RESULTS */

            <div className="text-center py-12">

              <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />

              <h3 className="text-xl text-white mb-2">
                No actors found
              </h3>

              <p className="text-gray-400 mb-4">
                {isSearching
                  ? "Try adjusting your search terms"
                  : "Unable to load popular actors"}
              </p>

              {!isSearching && (
                <button
                  type="button"
                  onClick={() =>
                    fetchPopularPeople(
                      1
                    )
                  }
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Try Again
                </button>
              )}

            </div>

          ) : (

            /* PEOPLE GRID */

            <>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">

                {displayedPeople.map(
                  (person) => (
                    <PersonCard
                      key={
                        person.id
                      }
                      person={
                        person
                      }
                    />
                  )
                )}

              </div>

              {!isSearching &&
                totalPages > 1 && (
                  <Pagination />
                )}

            </>

          )}

        </div>

      </div>

    </div>
  );
}