"use client";

import Link from "next/link";
import { useState } from "react";
import { FaStar, FaImage } from "react-icons/fa";
import { createSlug } from "../lib/api"; // ✅ IMPORT from api

// ------------------------------------------------------------
// TMDB POSTER URL
// ------------------------------------------------------------

const getPosterUrl = (posterPath) => {
  if (!posterPath) return null;
  const value = String(posterPath).trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `https://image.tmdb.org/t/p/w500${value}`;
  return `https://image.tmdb.org/t/p/w500/${value}`;
};

const FALLBACK_IMAGE =
  "https://placehold.co/500x750/1e293b/94a3b8?text=No+Image";

export default function MediaCard({ mediaItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!mediaItem) return null;

  // Tentukan tipe
  const isMovie =
    mediaItem.media_type === "movie" ||
    (mediaItem.media_type !== "tv" && mediaItem.title != null && mediaItem.name == null);

  const title = mediaItem.title || mediaItem.name || "Untitled";
  const mediaType = isMovie ? "Movie" : "TV Series";
  const mediaTypeSlug = isMovie ? "movie" : "tv-show";

  // Tanggal
  const date = isMovie ? mediaItem.release_date : mediaItem.first_air_date;

  // Slug menggunakan fungsi dari api
  const mediaSlug = createSlug(title, date);
  const linkHref = mediaSlug ? `/${mediaTypeSlug}/${mediaSlug}` : null;

  // Poster
  const imageUrl = getPosterUrl(mediaItem.poster_path);
  const finalImageUrl = imageUrl && !imageError ? imageUrl : FALLBACK_IMAGE;

  // Overview
  const overview = typeof mediaItem.overview === "string" ? mediaItem.overview.trim() : "";

  // Year
  let year = "N/A";
  if (mediaItem.release_date) {
    const y = String(mediaItem.release_date).substring(0, 4);
    if (/^\d{4}$/.test(y)) year = y;
  } else if (mediaItem.first_air_date) {
    const y = String(mediaItem.first_air_date).substring(0, 4);
    if (/^\d{4}$/.test(y)) year = y;
  }

  // Rating
  const rating =
    typeof mediaItem.vote_average === "number" &&
    Number.isFinite(mediaItem.vote_average) &&
    mediaItem.vote_average > 0
      ? mediaItem.vote_average.toFixed(1)
      : null;

  const imageAlt = `${title} ${mediaType} poster`;

  // Render card
  const CardContent = () => (
    <div className="relative w-full aspect-[2/3] bg-gray-800 overflow-hidden">
      {imageUrl && !imageError ? (
        <img
          src={finalImageUrl}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
          <FaImage className="text-4xl text-slate-600 mb-3" aria-hidden="true" />
          <span className="text-xs text-slate-500">No Image</span>
        </div>
      )}

      {/* Badge media type */}
      <div className="absolute top-2 left-2 z-10">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-sm shadow-sm border ${
          isMovie
            ? "bg-blue-500/20 text-blue-300 border-blue-400/20"
            : "bg-purple-500/20 text-purple-300 border-purple-400/20"
        }`}>
          {mediaType}
        </span>
      </div>

      {rating && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm shadow-sm border border-amber-400/15">
          <FaStar className="text-amber-400 text-[10px]" aria-hidden="true" />
          {rating}
        </div>
      )}

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 z-20 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!isHovered}
      >
        {overview ? (
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-4">{overview}</p>
        ) : (
          <p className="text-gray-500 text-xs italic">No synopsis available</p>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {linkHref ? (
        <Link href={linkHref} aria-label={`View details for ${title}`} className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent />
        </Link>
      ) : (
        <div className="block rounded-lg overflow-hidden shadow-lg">
          <CardContent />
        </div>
      )}

      <div className="mt-2 text-center px-1">
        <h3 className="text-white text-sm font-semibold truncate" title={title}>
          {title}
        </h3>
        <p className="text-gray-400 text-xs">{year}</p>
      </div>
    </div>
  );
}