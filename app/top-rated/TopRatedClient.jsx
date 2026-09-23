
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaStar,
  FaFilm,
  FaTv,
  FaFire,
  FaCalendar,
  FaArrowRight,
  FaArrowLeft,
  FaFilter,
} from "react-icons/fa";
import NativeAd from "../../components/ads/NativeAd";
import { createSlug as createMediaSlug } from "../../lib/api";

// ============================================================
// FALLBACK MOVIES
// ============================================================

const fallbackMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    vote_average: 9.3,
    vote_count: 2500000,
    release_date: "1994-09-23",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre_names: ["Drama"],
    popularity: 100.5,
  },
  {
    id: 2,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    vote_average: 9.2,
    vote_count: 1800000,
    release_date: "1972-03-24",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre_names: ["Crime", "Drama"],
    popularity: 95.2,
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
    vote_count: 2600000,
    release_date: "2008-07-18",
    overview:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre_names: ["Action", "Crime", "Drama"],
    popularity: 120.8,
  },
];

// ============================================================
// FALLBACK TV
// ============================================================

const fallbackTV = [
  {
    id: 1,
    name: "Breaking Bad",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    vote_average: 9.5,
    vote_count: 1700000,
    first_air_date: "2008-01-20",
    overview:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    genre_names: ["Crime", "Drama", "Thriller"],
    popularity: 150.3,
  },
  {
    id: 2,
    name: "Planet Earth II",
    poster_path: "/6ZlfY4bF1edK5m6VSBaMouYRp2Y.jpg",
    vote_average: 9.4,
    vote_count: 150000,
    first_air_date: "2016-11-06",
    overview:
      "Wildlife documentary series with David Attenborough, beginning with a look at the remote islands which offer sanctuary to some of the planet's rarest creatures.",
    genre_names: ["Documentary"],
    popularity: 88.7,
  },
  {
    id: 3,
    name: "Game of Thrones",
    poster_path: "/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
    vote_average: 9.3,
    vote_count: 2200000,
    first_air_date: "2011-04-17",
    overview:
      "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    genre_names: ["Action", "Adventure", "Drama"],
    popularity: 180.5,
  },
];

// ============================================================
// CANONICAL MEDIA SLUG
// ============================================================
//
// IMPORTANT:
// Top Rated uses the canonical FilmVista format:
//
// Movie:
// /movie/judul-tahun
//
// TV:
// /tv-show/judul-tahun
//
// The special Actor format:
//
// /tv-show/judul-tahun-id
//
// remains handled by ActorClient.jsx and is NOT changed here.
// ============================================================

const getMediaSlug = (item) => {
  if (!item || typeof item !== "object") {
    return "";
  }

  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;

  if (!title) {
    return "";
  }

  try {
    return createMediaSlug(title, date);
  } catch (error) {
    console.error("❌ Failed to create media slug:", error);
    return "";
  }
};

// ============================================================
// COMPONENT
// ============================================================

export default function RankingsClient({
  initialTopMovies,
  initialTopTv,
  initialTrendingMovies,
  initialTrendingTv,
  fallback = false,
}) {
  const [activeCategory, setActiveCategory] = useState("movies");
  const [activeTimeframe, setActiveTimeframe] = useState("all-time");

  const [movies, setMovies] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTvSeries, setTrendingTvSeries] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  const itemsPerPage = 20;

  // ==========================================================
  // CURRENT YEAR
  // ==========================================================

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // ==========================================================
  // INITIAL DATA
  // ==========================================================

  useEffect(() => {
    const safeInitialTopMovies = Array.isArray(initialTopMovies)
      ? initialTopMovies
      : [];

    const safeInitialTopTv = Array.isArray(initialTopTv)
      ? initialTopTv
      : [];

    const safeInitialTrendingMovies = Array.isArray(initialTrendingMovies)
      ? initialTrendingMovies
      : [];

    const safeInitialTrendingTv = Array.isArray(initialTrendingTv)
      ? initialTrendingTv
      : [];

    const useFallback =
      fallback ||
      (
        safeInitialTopMovies.length === 0 &&
        safeInitialTopTv.length === 0 &&
        safeInitialTrendingMovies.length === 0 &&
        safeInitialTrendingTv.length === 0
      );

    if (useFallback) {
      setMovies(fallbackMovies);
      setTvSeries(fallbackTV);
      setTrendingMovies(fallbackMovies.slice(0, 2));
      setTrendingTvSeries(fallbackTV.slice(0, 2));

      if (fallback) {
        setError(
          "Using demo data. Some data may not be up to date."
        );
      }
    } else {
      setMovies(safeInitialTopMovies);
      setTvSeries(safeInitialTopTv);
      setTrendingMovies(safeInitialTrendingMovies);
      setTrendingTvSeries(safeInitialTrendingTv);

      setError(null);
    }

    setCurrentPage(1);
  }, [
    initialTopMovies,
    initialTopTv,
    initialTrendingMovies,
    initialTrendingTv,
    fallback,
  ]);

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categories = [
    {
      id: "movies",
      name: "Top Movies",
      icon: FaFilm,
    },
    {
      id: "tv",
      name: "Top TV Series",
      icon: FaTv,
    },
    {
      id: "trending",
      name: "Trending Now",
      icon: FaFire,
    },
  ];

  const timeframes = [
    {
      id: "all-time",
      name: "All Time",
    },
    {
      id: "today",
      name: "Today",
    },
    {
      id: "this-week",
      name: "This Week",
    },
  ];

  // ==========================================================
  // CURRENT DATA
  // ==========================================================

  const getCurrentData = () => {
    switch (activeCategory) {
      case "movies":
        return movies;

      case "tv":
        return tvSeries;

      case "trending":
        if (activeTimeframe === "today") {
          const combined = [
            ...trendingMovies,
            ...trendingTvSeries,
          ];

          return combined.sort(
            (a, b) =>
              (b.popularity || 0) -
              (a.popularity || 0)
          );
        }

        if (activeTimeframe === "this-week") {
          const combined = [
            ...movies.slice(0, 10),
            ...tvSeries.slice(0, 10),
          ];

          return combined.sort(
            (a, b) =>
              (b.vote_average || 0) -
              (a.vote_average || 0)
          );
        }

        return [
          ...movies,
          ...tvSeries,
        ].sort(
          (a, b) =>
            (b.vote_average || 0) -
            (a.vote_average || 0)
        );

      default:
        return movies;
    }
  };

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const getDisplayedData = () => {
    const data = getCurrentData();

    const startIndex =
      (currentPage - 1) *
      itemsPerPage;

    const endIndex =
      startIndex +
      itemsPerPage;

    return data.slice(
      startIndex,
      endIndex
    );
  };

  const currentData = getCurrentData();

  const displayedData =
    getDisplayedData();

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        currentData.length /
          itemsPerPage
      )
    );

  // ==========================================================
  // PAGINATION COMPONENT
  // ==========================================================

  const Pagination = () => (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.max(1, prev - 1)
          )
        }
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        <FaArrowLeft />
        Previous
      </button>

      <span className="text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(
              totalPages,
              prev + 1
            )
          )
        }
        disabled={
          currentPage === totalPages
        }
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        Next
        <FaArrowRight />
      </button>
    </div>
  );

  // ==========================================================
  // RANK BADGE
  // ==========================================================

  const RankBadge = ({ rank }) => (
    <div
      className={`
        w-10 h-10 rounded-full
        flex items-center justify-center
        font-bold text-white
        ${
          rank <= 3
            ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"
            : rank <= 10
              ? "bg-gradient-to-br from-purple-500 to-pink-500"
              : "bg-slate-700"
        }
      `}
    >
      {rank}
    </div>
  );

  // ==========================================================
  // MEDIA CARD
  // ==========================================================

  const MediaCard = ({ item, rank }) => {
    if (!item || typeof item !== "object") {
      return null;
    }

    const isTV = Boolean(
      item.name ||
      activeCategory === "tv" ||
      item.media_type === "tv"
    );

    const title =
      item.title ||
      item.name ||
      "";

    const date =
      item.release_date ||
      item.first_air_date ||
      "";

    const slug =
      getMediaSlug(item);

    const isTVShow = isTV;

    // ========================================================
    // IMPORTANT:
    // Never render a Link when title/slug is invalid.
    //
    // This prevents malformed URLs such as:
    // /tv-show/
    // /tv-show/-1998
    // /tv-show/-1993
    // ========================================================

    if (!title || !slug) {
      console.warn(
        "⚠️ Skipping media item with invalid slug:",
        {
          id: item.id,
          title,
          date,
          media_type: item.media_type,
          item,
        }
      );

      return null;
    }

    const detailHref = isTVShow
      ? `/tv-show/${slug}`
      : `/movie/${slug}`;

    const browseHref = isTVShow
      ? "/tv-show/category/popular"
      : "/movie/popular";

    return (
      <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-all duration-300 hover:shadow-xl group">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-4">
            <RankBadge rank={rank} />

            <div className="relative aspect-[2/3] w-24 rounded-lg overflow-hidden">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={title}
                  width={96}
                  height={144}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <FaFilm className="text-2xl text-gray-500" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <Link
                  href={detailHref}
                  className="text-xl font-bold text-white hover:text-orange-400 transition-colors line-clamp-2 group-hover:underline"
                >
                  {title}
                </Link>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  {date && (
                    <div className="flex items-center gap-1">
                      <FaCalendar className="text-xs" />

                      <span>
                        {new Date(
                          date
                        ).getFullYear()}
                      </span>
                    </div>
                  )}

                  <span className="px-2 py-1 bg-slate-700 rounded text-xs uppercase">
                    {isTVShow
                      ? "TV Series"
                      : "Movie"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg">
                <FaStar className="text-yellow-400" />

                <span className="font-bold text-white">
                  {item.vote_average
                    ? item.vote_average.toFixed(1)
                    : "N/A"}
                </span>

                <span className="text-gray-400 text-sm">
                  (
                  {item.vote_count?.toLocaleString() ||
                    "0"}
                  )
                </span>
              </div>
            </div>

            {item.overview && (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {item.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {Array.isArray(
                item.genre_names
              ) &&
                item.genre_names.length >
                  0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.genre_names
                      .slice(0, 3)
                      .map(
                        (
                          genre,
                          index
                        ) => (
                          <span
                            key={`${genre}-${index}`}
                            className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs"
                          >
                            {genre}
                          </span>
                        )
                      )}
                  </div>
                )}

              {item.popularity &&
                activeCategory ===
                  "trending" && (
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <FaFire className="text-orange-400" />

                    <span>
                      Popularity:{" "}
                      {item.popularity.toFixed(
                        0
                      )}
                    </span>
                  </div>
                )}
            </div>

            <div className="flex gap-3 mt-4">
              <Link
                href={detailHref}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
              >
                View Details
              </Link>

              <Link
                href={browseHref}
                className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                Browse{" "}
                {isTVShow
                  ? "TV Series"
                  : "Movies"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================
  // LOADING SKELETON
  // ==========================================================

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-800 rounded-xl p-6 animate-pulse"
        >
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full" />

              <div className="w-24 h-36 bg-gray-700 rounded-lg" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-700 rounded w-3/4" />

              <div className="h-4 bg-gray-700 rounded w-1/2" />

              <div className="h-16 bg-gray-700 rounded" />

              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded w-20" />
                <div className="h-6 bg-gray-700 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  const EmptyState = () => (
    <div className="text-center py-12">
      <FaStar className="text-6xl text-gray-600 mx-auto mb-4" />

      <h3 className="text-xl text-white mb-2">
        No top-rated available
      </h3>

      <p className="text-gray-400 mb-6">
        {activeCategory ===
        "trending"
          ? "No trending content found for the selected timeframe."
          : "Unable to load top-rated data."}
      </p>
    </div>
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
              <FaStar className="text-2xl text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Top Rated
            </h1>
          </div>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the highest rated and most popular movies and TV series based on user ratings and reviews.
          </p>

          {error && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg max-w-2xl mx-auto">
              <p className="text-yellow-200">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* NATIVE AD */}
        <div className="w-full mb-8">
          <NativeAd />
        </div>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {categories.map(
            (category) => {
              const IconComponent =
                category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(
                      category.id
                    );
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeCategory ===
                    category.id
                      ? "bg-orange-600 text-white shadow-lg"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  <IconComponent />
                  {category.name}
                </button>
              );
            }
          )}
        </div>

        {/* TIMEFRAME FILTER */}
        {activeCategory ===
          "trending" && (
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800 rounded-lg p-1 flex">
              {timeframes.map(
                (timeframe) => (
                  <button
                    key={
                      timeframe.id
                    }
                    onClick={() => {
                      setActiveTimeframe(
                        timeframe.id
                      );
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTimeframe ===
                      timeframe.id
                        ? "bg-orange-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {timeframe.name}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* STATS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {currentData.length.toLocaleString()}
            </div>

            <div className="text-gray-400">
              Total Items
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {currentData.length >
              0
                ? Math.max(
                    ...currentData.map(
                      (item) =>
                        item.vote_average ||
                        0
                    )
                  ).toFixed(1)
                : "0.0"}
            </div>

            <div className="text-gray-400">
              Highest Rating
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {currentYear ??
                "----"}
            </div>

            <div className="text-gray-400">
              Latest Content
            </div>
          </div>
        </div>

        {/* RANKINGS LIST */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {
                categories.find(
                  (cat) =>
                    cat.id ===
                    activeCategory
                )?.name
              }

              {activeCategory ===
                "trending" &&
                ` - ${
                  timeframes.find(
                    (tf) =>
                      tf.id ===
                      activeTimeframe
                  )?.name
                }`}
            </h2>

            <div className="flex items-center gap-2 text-gray-400">
              <FaFilter className="text-orange-400" />

              <span>
                Showing{" "}
                {Math.min(
                  displayedData.length,
                  itemsPerPage
                )}{" "}
                of{" "}
                {currentData.length}
              </span>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : displayedData.length ===
            0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="space-y-4">
                {displayedData.map(
                  (
                    item,
                    index
                  ) => (
                    <MediaCard
                      key={`${item.id}-${item.media_type || activeCategory}-${index}`}
                      item={item}
                      rank={
                        (currentPage -
                          1) *
                          itemsPerPage +
                        index +
                        1
                      }
                    />
                  )
                )}
              </div>

              {totalPages > 1 && (
                <Pagination />
              )}
            </>
          )}
        </div>

        {/* ADDITIONAL SECTIONS */}
        {!loading &&
          displayedData.length >
            0 && (
            <div className="grid md:grid-cols-2 gap-8 mt-12">

              {/* POPULAR GENRES */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaFilm className="text-orange-400" />
                  Popular Genres
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      name: "Action",
                      count: "1,234 movies",
                      color:
                        "bg-red-500/20 text-red-300",
                    },
                    {
                      name: "Drama",
                      count: "987 movies",
                      color:
                        "bg-blue-500/20 text-blue-300",
                    },
                    {
                      name: "Comedy",
                      count: "856 movies",
                      color:
                        "bg-yellow-500/20 text-yellow-300",
                    },
                    {
                      name: "Thriller",
                      count: "743 movies",
                      color:
                        "bg-purple-500/20 text-purple-300",
                    },
                    {
                      name: "Science Fiction",
                      count: "654 movies",
                      color:
                        "bg-green-500/20 text-green-300",
                    },
                  ].map(
                    (genre) => (
                      <div
                        key={
                          genre.name
                        }
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              genre.color.split(
                                " "
                              )[0]
                            }`}
                          />

                          <span className="text-white font-medium">
                            {
                              genre.name
                            }
                          </span>
                        </div>

                        <span className="text-gray-400 text-sm">
                          {
                            genre.count
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* EXPLORE MORE */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaStar className="text-orange-400" />
                  Explore More
                </h3>

                <div className="space-y-3">

                  {/* MOVIES */}
                  <Link
                    href="/movie/popular"
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FaFilm className="text-orange-400" />

                      <span className="text-white font-medium">
                        Popular Movies
                      </span>
                    </div>

                    <FaArrowRight className="text-gray-400 group-hover:text-white transition-colors" />
                  </Link>

                  {/* TV */}
                  <Link
                    href="/tv-show/category/popular"
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FaTv className="text-blue-400" />

                      <span className="text-white font-medium">
                        Popular TV Series
                      </span>
                    </div>

                    <FaArrowRight className="text-gray-400 group-hover:text-white transition-colors" />
                  </Link>

                  {/* ACTORS */}
                  <Link
                    href="/actors"
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FaStar className="text-yellow-400" />

                      <span className="text-white font-medium">
                        Top Actors
                      </span>
                    </div>

                    <FaArrowRight className="text-gray-400 group-hover:text-white transition-colors" />
                  </Link>

                </div>
              </div>
            </div>
          )}

        {/* CALL TO ACTION */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-900/30 to-purple-900/30 rounded-xl p-8">

            <h3 className="text-2xl font-bold text-white mb-4">
              Discover More Great Content
            </h3>

            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Explore our extensive collection of movies and TV series across all genres and time periods.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              {/* MOVIE TOP RATED */}
              <Link
                href="/movie/top_rated"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Browse All Movies
              </Link>

              {/* TV TOP RATED */}
              <Link
                href="/tv-show/category/top_rated"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse All TV Series
              </Link>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
