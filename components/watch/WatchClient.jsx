//app/components/watch/WatchClient.jsx
"use client";

import { useState } from "react";

import {
    PlayCircleIcon,
} from "lucide-react";

import NativeAd from "../ads/NativeAd";
import WhereToWatch from "./WhereToWatch";
import MediaCard from "../MediaCard";

const POSTER_IMAGE_URL =
    "https://image.tmdb.org/t/p/w500";

const BACKDROP_IMAGE_URL =
    "https://image.tmdb.org/t/p/w1280";

export default function WatchClient({
    mediaType,
    id,
    initialDetails,
    initialSimilarMedia,
    trailerKey,
    initialWatchProviders,
    watchRegion = "US",
}) {
    const initialResults =
        initialSimilarMedia?.results ||
        initialSimilarMedia ||
        [];

    const initialTotalPages =
        initialSimilarMedia?.total_pages ||
        0;

    const [similarMedia, setSimilarMedia] =
        useState(initialResults);

    const [page, setPage] =
        useState(1);

    const [isLoading, setIsLoading] =
        useState(false);

    const [hasMore, setHasMore] =
        useState(
            initialTotalPages > 1 ||
            (
                initialTotalPages === 0 &&
                initialResults.length > 0
            )
        );

    if (!initialDetails) {
        return (
            <div className="min-h-screen bg-gray-950 py-20 text-center text-white">
                Error: Details not found.
            </div>
        );
    }

    const loadMoreSimilar = async () => {
        if (
            isLoading ||
            !hasMore
        ) {
            return;
        }

        setIsLoading(true);

        const nextPage =
            page + 1;

        try {
            let result;

            if (mediaType === "tv") {
                const res =
                    await fetch(
                        `/api/similar-tv?tvId=${encodeURIComponent(
                            id
                        )}&page=${nextPage}`
                    );

                if (!res.ok) {
                    throw new Error(
                        "Failed to fetch similar TV"
                    );
                }

                const data =
                    await res.json();

                result = {
                    results:
                        data.results || [],
                    total_pages:
                        data.total_pages || 0,
                };
            } else {
                const res =
                    await fetch(
                        `/api/similar-movie?page=${nextPage}`
                    );

                if (!res.ok) {
                    throw new Error(
                        "Failed to fetch discovery movies"
                    );
                }

                const data =
                    await res.json();

                result = {
                    results:
                        data.results || [],
                    total_pages:
                        data.total_pages || 0,
                };
            }

            if (
                result.results &&
                result.results.length > 0
            ) {
                setSimilarMedia(
                    (prev) => [
                        ...prev,
                        ...result.results,
                    ]
                );

                setPage(nextPage);

                if (
                    result.total_pages > 0
                ) {
                    setHasMore(
                        nextPage <
                            result.total_pages
                    );
                } else {
                    setHasMore(
                        result.results.length > 0
                    );
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(
                "Error loading more:",
                error
            );
        } finally {
            setIsLoading(false);
        }
    };

    const title =
        initialDetails.title ||
        initialDetails.name ||
        "Untitled";

    const backdropUrl =
        initialDetails.backdrop_path
            ? `${BACKDROP_IMAGE_URL}${initialDetails.backdrop_path}`
            : null;

    const posterUrl =
        initialDetails.poster_path
            ? `${POSTER_IMAGE_URL}${initialDetails.poster_path}`
            : null;

    const trailerEmbedUrl =
        trailerKey
            ? `https://www.youtube.com/embed/${encodeURIComponent(
                  trailerKey
              )}`
            : null;

    return (
        <main className="min-h-screen bg-gray-950 font-inter text-white">
            <div className="container relative z-10 mx-auto px-4 py-8">
                {backdropUrl && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                    >
                        <img
                            src={backdropUrl}
                            alt=""
                            className="absolute h-full w-full object-cover opacity-30"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
                    </div>
                )}

                <div className="relative z-10">
                    <div className="mb-8 flex flex-col items-start md:flex-row md:space-x-8">
                        {posterUrl && (
                            <div className="mb-6 w-full flex-shrink-0 md:mb-0 md:w-1/3">
                                <img
                                    src={posterUrl}
                                    alt={`${title} poster`}
                                    width={500}
                                    height={750}
                                    className="h-auto w-full rounded-xl shadow-2xl"
                                />
                            </div>
                        )}

                        <div className="flex-1">
                            <h1 className="mb-2 text-3xl font-bold">
                                {title}
                            </h1>

                            <p className="mb-4 text-sm text-gray-400">
                                {mediaType === "movie"
                                    ? "Movie"
                                    : "TV Series"}

                                {" • "}

                                {(
                                    initialDetails.release_date ||
                                    initialDetails.first_air_date
                                )
                                    ? new Date(
                                          initialDetails.release_date ||
                                              initialDetails.first_air_date
                                      ).getFullYear()
                                    : "N/A"}
                            </p>

                            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-gray-900 shadow-2xl">
                                {trailerEmbedUrl ? (
                                    <iframe
                                        src={trailerEmbedUrl}
                                        title={`${title} official trailer`}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        className="absolute left-0 top-0 h-full w-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
                                        <PlayCircleIcon
                                            size={64}
                                            aria-hidden="true"
                                            className="mb-4 text-gray-600"
                                        />

                                        <p className="text-lg">
                                            No trailer available
                                        </p>
                                    </div>
                                )}
                            </div>

                            <WhereToWatch
                                watchProviders={
                                    initialWatchProviders
                                }
                                watchRegion={
                                    watchRegion
                                }
                                title={title}
                            />
                        </div>
                    </div>

                    <section className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold">
                            You Might Also Like
                        </h2>

                        {similarMedia.length > 0 ? (
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {similarMedia
                                    .slice(0, 6)
                                    .map((media) => (
                                        <MediaCard
                                            key={`top-${media.id}`}
                                            mediaItem={media}
                                        />
                                    ))}

                                <div className="col-span-2 w-full sm:col-span-3 md:col-span-4 lg:col-span-6">
                                    <NativeAd />
                                </div>

                                {similarMedia
                                    .slice(6)
                                    .map((media) => (
                                        <MediaCard
                                            key={`rest-${media.id}`}
                                            mediaItem={media}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-8 text-center">
                                <p className="text-gray-400">
                                    No additional titles are available right
                                    now.
                                </p>
                            </div>
                        )}

                        {hasMore && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={
                                        loadMoreSimilar
                                    }
                                    disabled={
                                        isLoading
                                    }
                                    className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-700"
                                >
                                    {isLoading
                                        ? "Loading..."
                                        : "Load More"}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}