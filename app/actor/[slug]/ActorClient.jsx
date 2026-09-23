// app/actor/[slug]/ActorClient.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaFilm,
  FaTv,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import NativeAd from "../../../components/ads/NativeAd";

/*
 * ---------------------------------------------------------
 * HELPER UTILITIES & SUB-COMPONENTS
 * ---------------------------------------------------------
 */

// ✅ KHUSUS HALAMAN ACTOR: format slug = judul-tahun-id
//    Contoh: mofuku-shimai-jukujo-shibireaji-2009-12345

const createMediaSlug = (item) => {
  if (!item) return "";

  const rawTitle = item.title || item.name || "";
  const date = item.release_date || item.first_air_date || "";
  const year = /^\d{4}/.test(String(date))
    ? String(date).substring(0, 4)
    : "";

  let baseSlug = String(rawTitle)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // Fallback jika judul non-Latin
  if (!baseSlug) {
    return String(item.id); // Format 1: pure ID
  }

  const parts = [baseSlug];
  if (year) parts.push(year);
  if (item.id) parts.push(item.id);

  return parts.filter(Boolean).join("-");
};

// Reusable Skeleton Grid for Loading State
const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-slate-800 rounded-lg overflow-hidden animate-pulse"
      >
        <div className="aspect-[2/3] bg-slate-700" />
        <div className="p-3">
          <div className="h-4 bg-slate-700 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Unified Media Card (Handles both Movies & TV Shows)
const MediaCard = ({ item, mediaType }) => {
  if (!item?.id) return null;

  const title = item.title || item.name || "Untitled";
  const slug = createMediaSlug(item);
  if (!slug) return null;

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  const href =
    mediaType === "movie" ? `/movie/${slug}` : `/tv-show/${slug}`;
  const FallbackIcon = mediaType === "movie" ? FaFilm : FaTv;

  return (
    <Link
  href={href}
  prefetch={false}
  className="group bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02]"
>
      <div className="relative aspect-[2/3] bg-slate-700">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FallbackIcon className="text-4xl text-gray-500" />
          </div>
        )}

        {item.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {Number(item.vote_average).toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-orange-400">
          {title}
        </h3>

        {item.character && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
            {item.character}
          </p>
        )}
      </div>
    </Link>
  );
};

/*
 * ---------------------------------------------------------
 * MAIN ACTOR CLIENT COMPONENT
 * ---------------------------------------------------------
 */

export default function ActorClient({ personId, initialPerson }) {
  const person = initialPerson || null;

  const [movieCredits, setMovieCredits] = useState(null);
  const [tvCredits, setTvCredits] = useState(null);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [creditsError, setCreditsError] = useState(null);

  useEffect(() => {
    if (!personId) {
      setLoadingCredits(false);
      return;
    }

    const controller = new AbortController();

    const fetchCredits = async () => {
      try {
        setLoadingCredits(true);
        setCreditsError(null);

        const response = await fetch(
          `/api/person/${personId}/credits`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Credits request failed: ${response.status}`
          );
        }

        const data = await response.json();
        setMovieCredits(data?.movieCredits || null);
        setTvCredits(data?.tvCredits || null);
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Error fetching actor credits:", error);
        setCreditsError("Unable to load filmography.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCredits(false);
        }
      }
    };

    fetchCredits();

    return () => {
      controller.abort();
    };
  }, [personId]);

  if (!person) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Actor not found.</p>
      </div>
    );
  }

  const name = person.name || "Unknown Actor";
  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : null;

  const movies = Array.isArray(movieCredits?.cast)
    ? movieCredits.cast
    : [];
  const tvShows = Array.isArray(tvCredits?.cast)
    ? tvCredits.cast
    : [];

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* BACK NAVIGATION */}
        <div className="mb-6">
          <Link
            href="/actors"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors"
          >
            <FaArrowLeft />
            Back to Actors
          </Link>
        </div>

        {/* ACTOR HEADER */}
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 mb-10">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-56 flex-shrink-0 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="224px"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-6xl text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {name}
              </h1>

              {person.known_for_department && (
                <p className="text-orange-400 font-medium mb-6">
                  {person.known_for_department}
                </p>
              )}

              {person.biography && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Biography
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {person.biography}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {person.birthday && (
                  <div>
                    <span className="text-gray-500">Born</span>
                    <p className="text-gray-200">
                      {person.birthday}
                    </p>
                  </div>
                )}
                {person.place_of_birth && (
                  <div>
                    <span className="text-gray-500">
                      Birthplace
                    </span>
                    <p className="text-gray-200">
                      {person.place_of_birth}
                    </p>
                  </div>
                )}
                {person.deathday && (
                  <div>
                    <span className="text-gray-500">Died</span>
                    <p className="text-gray-200">
                      {person.deathday}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NATIVE AD */}
        <div className="w-full mb-10">
          <NativeAd />
        </div>

        {/* MOVIES SECTION */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FaFilm className="text-orange-400 text-xl" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Movies
            </h2>
            <span className="text-gray-500 text-sm">
              ({movies.length})
            </span>
          </div>

          {loadingCredits ? (
            <SkeletonGrid count={6} />
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie, idx) => (
                <MediaCard
                  key={movie.credit_id || `${movie.id}-${idx}`}
                  item={movie}
                  mediaType="movie"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              No movie credits available.
            </p>
          )}
        </section>

        {/* TV SHOWS SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FaTv className="text-orange-400 text-xl" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              TV Shows
            </h2>
            <span className="text-gray-500 text-sm">
              ({tvShows.length})
            </span>
          </div>

          {loadingCredits ? (
            <SkeletonGrid count={6} />
          ) : tvShows.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tvShows.map((show, idx) => (
                <MediaCard
                  key={show.credit_id || `${show.id}-${idx}`}
                  item={show}
                  mediaType="tv"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              No TV credits available.
            </p>
          )}
        </section>

        {creditsError && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {creditsError}
          </div>
        )}
      </div>
    </div>
  );
}