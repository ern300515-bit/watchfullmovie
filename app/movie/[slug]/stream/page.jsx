
// app/movie/[slug]/stream/page.jsx

import { cache } from "react";
import { notFound } from "next/navigation";

import {
    createSlug,
    getMovieById,
    getMovieVideos,
    searchMoviesAndTv,
} from "../../../../lib/api";

import WatchClient from "../../../../components/watch/WatchClient";

export const dynamic = "force-dynamic";

const TMDB_IMAGE_BASE =
    "https://image.tmdb.org/t/p";

const WATCH_REGION = (
    process.env.TMDB_REGION ||
    "US"
)
    .trim()
    .toUpperCase();

const getEroticMovies = async (page = 1) => {
    const API_KEY =
        process.env.TMDB_API_KEY;

    if (!API_KEY) {
        console.error(
            "TMDB_API_KEY is missing."
        );

        return {
            results: [],
            total_pages: 0,
        };
    }

    const params = new URLSearchParams({
        api_key: API_KEY,
        with_keywords: "267122",
        include_adult: "true",
        sort_by: "popularity.desc",
        page: String(page),
    });

    const url =
        `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;

    try {
        const response = await fetch(url, {
            next: {
                revalidate: 86400,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch discovery movies: ${response.status}`
            );
        }

        const data =
            await response.json();

        return {
            results: data.results || [],
            total_pages:
                data.total_pages || 0,
        };
    } catch (error) {
        console.error(
            "Error fetching discovery movies:",
            error
        );

        return {
            results: [],
            total_pages: 0,
        };
    }
};

const getMovieWatchProviders = async (
    movieId
) => {
    const API_KEY =
        process.env.TMDB_API_KEY;

    if (!API_KEY || !movieId) {
        return null;
    }

    const url =
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            next: {
                revalidate: 21600,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch watch providers: ${response.status}`
            );
        }

        const data =
            await response.json();

        const regionData =
            data?.results?.[WATCH_REGION] ||
            null;

        if (!regionData) {
            return null;
        }

        return {
            region: WATCH_REGION,
            link: regionData.link || null,
            flatrate:
                regionData.flatrate || [],
            free:
                regionData.free || [],
            ads:
                regionData.ads || [],
            rent:
                regionData.rent || [],
            buy:
                regionData.buy || [],
        };
    } catch (error) {
        console.error(
            "Error fetching movie watch providers:",
            error
        );

        return null;
    }
};

// ============================================
// RESOLVE MOVIE BY SLUG
// ============================================
//
// Mendukung:
//
// 1. Pure ID
//    /movie/12345/stream
//
// 2. judul-tahun-id
//    /movie/mofuku-shimai-2009-12345/stream
//
//    Format ini digunakan oleh halaman Actor.
//
// 3. judul-tahun
//    /movie/mofuku-shimai-2009/stream
//
// ============================================

const findMovieFromSlug = cache(
    async (slug) => {
        if (
            !slug ||
            typeof slug !== "string"
        ) {
            return null;
        }

        const parts =
            slug.split("-");

        // ========================================
        // FORMAT 1: PURE NUMERIC ID
        // ========================================

        if (
            parts.length === 1 &&
            /^\d+$/.test(slug)
        ) {
            try {
                const movie =
                    await getMovieById(
                        parseInt(slug, 10)
                    );

                return movie || null;
            } catch (err) {
                console.warn(
                    "findMovieFromSlug FORMAT 1 gagal:",
                    slug,
                    err?.message
                );

                return null;
            }
        }

        // ========================================
        // FORMAT 2:
        // JUDUL-TAHUN-ID
        //
        // Contoh:
        // mofuku-shimai-2009-12345
        //
        // ID terakhir >= 5 digit dianggap
        // sebagai TMDB movie ID.
        // ========================================

        const lastSeg =
            parts[parts.length - 1];

        if (
            /^\d+$/.test(lastSeg) &&
            lastSeg.length >= 5
        ) {
            const id =
                parseInt(lastSeg, 10);

            try {
                const movie =
                    await getMovieById(id);

                if (movie) {
                    return movie;
                }
            } catch (err) {
                console.warn(
                    "findMovieFromSlug FORMAT 2 gagal getMovieById:",
                    id,
                    err?.message
                );
            }

            // Jika ID gagal ditemukan,
            // lanjut ke fallback pencarian judul.
        }

        // ========================================
        // FORMAT 3:
        // JUDUL-TAHUN
        //
        // Atau fallback:
        // JUDUL-ID
        // ========================================

        let titleParts = parts;

        // Buang ID terakhir jika ada.
        if (
            titleParts.length >= 2 &&
            /^\d+$/.test(
                titleParts[
                    titleParts.length - 1
                ]
            ) &&
            titleParts[
                titleParts.length - 1
            ].length >= 5
        ) {
            titleParts =
                titleParts.slice(0, -1);
        }

        // Buang tahun terakhir jika ada.
        if (
            titleParts.length > 0 &&
            /^\d{4}$/.test(
                titleParts[
                    titleParts.length - 1
                ]
            )
        ) {
            titleParts =
                titleParts.slice(0, -1);
        }

        const titleSlug =
            titleParts.join("-");

        const searchQuery =
            titleSlug
                .replace(/-/g, " ")
                .trim();

        if (!searchQuery) {
            return null;
        }

        const searchResults =
            await searchMoviesAndTv(
                searchQuery
            );

        if (
            !Array.isArray(
                searchResults
            ) ||
            searchResults.length === 0
        ) {
            return null;
        }

        // ========================================
        // STRATEGY A:
        // EXACT CANONICAL SLUG
        // ========================================

        let found =
            searchResults.find(
                (item) => {
                    if (
                        item.media_type !==
                        "movie"
                    ) {
                        return false;
                    }

                    if (!item.title) {
                        return false;
                    }

                    const itemSlug =
                        createSlug(
                            item.title,
                            item.release_date
                        );

                    return (
                        itemSlug === slug
                    );
                }
            );

        // ========================================
        // STRATEGY B:
        // COCOKKAN TANPA TAHUN
        // ========================================

        if (!found) {
            found =
                searchResults.find(
                    (item) => {
                        if (
                            item.media_type !==
                            "movie"
                        ) {
                            return false;
                        }

                        if (!item.title) {
                            return false;
                        }

                        const itemSlugNoYear =
                            createSlug(
                                item.title,
                                null
                            );

                        return (
                            itemSlugNoYear ===
                            titleSlug
                        );
                    }
                );
        }

        // ========================================
        // STRATEGY C:
        // NORMALISASI
        // ========================================

        if (!found) {
            const normalizedSlug =
                titleSlug
                    .replace(/-/g, "")
                    .toLowerCase();

            found =
                searchResults.find(
                    (item) => {
                        if (
                            item.media_type !==
                            "movie"
                        ) {
                            return false;
                        }

                        if (!item.title) {
                            return false;
                        }

                        const normalizedTitle =
                            item.title
                                .normalize("NFKD")
                                .replace(
                                    /[\u0300-\u036f]/g,
                                    ""
                                )
                                .toLowerCase()
                                .replace(
                                    /[^a-z0-9]/g,
                                    ""
                                );

                        return (
                            normalizedTitle ===
                            normalizedSlug
                        );
                    }
                );
        }

        // ========================================
        // STRATEGY D:
        // FALLBACK MOVIE PERTAMA
        // ========================================

        if (!found) {
            found =
                searchResults.find(
                    (item) =>
                        item.media_type ===
                        "movie"
                );
        }

        // ========================================
        // AMBIL DETAIL LENGKAP
        // ========================================

        if (found) {
            try {
                return await getMovieById(
                    found.id
                );
            } catch (err) {
                console.warn(
                    "findMovieFromSlug gagal getMovieById hasil pencarian:",
                    found.id,
                    err?.message
                );

                return null;
            }
        }

        return null;
    }
);

export async function generateMetadata({
    params,
}) {
    const { slug } = await params;

    let movieTitle = "Movie";
    let movieData = null;

    let ogImage =
        "https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg";

    try {
        const movie =
            await findMovieFromSlug(slug);

        if (movie) {
            movieTitle =
                movie.title;

            movieData =
                movie;

            if (movie.backdrop_path) {
                ogImage =
                    `${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}`;
            } else if (
                movie.poster_path
            ) {
                ogImage =
                    `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`;
            }
        }
    } catch (error) {
        console.error(
            "Error fetching movie for metadata:",
            error
        );
    }

    const canonical =
        `${process.env.NEXT_PUBLIC_SITE_URL || "https://watchfullmovie.netlify.app"}/movie/${slug}/stream`;

    return {
        title:
            `Where to Watch ${movieTitle} - Legal Streaming Options | WatchFullMovie`,

        description:
            `Find legal streaming options for ${movieTitle}, including free or ad-supported availability when offered in the selected region, plus subscription, rental, and purchase options.`,

        robots: {
            index: false,
            follow: true,
        },

        alternates: {
            canonical,
        },

        openGraph: {
            title:
                `Where to Watch ${movieTitle} - Legal Streaming Options | WatchFullMovie`,

            description:
                `Find where to watch ${movieTitle} legally, including free and ad-supported options when available.`,

            url: canonical,

            siteName: "WatchFullMovie",

            images: [
                {
                    url: ogImage,
                    width:
                        movieData?.backdrop_path
                            ? 1280
                            : 500,
                    height:
                        movieData?.backdrop_path
                            ? 720
                            : 750,
                    alt:
                        `${movieTitle} trailer and streaming information`,
                },
            ],

            locale: "en_US",
            type: "video.other",
        },

        twitter: {
            card: "summary_large_image",
            site: "@WatchStream123",
            creator: "@WatchStream123",

            title:
                `Where to Watch ${movieTitle} | WatchFullMovie`,

            description:
                `Find legal streaming options for ${movieTitle}.`,

            images: [ogImage],
        },
    };
}

export default async function StreamPage({
    params,
}) {
    const { slug } = await params;

    const movieDetails =
        await findMovieFromSlug(slug);

    if (!movieDetails) {
        notFound();
    }

    const [
        videos,
        discoveryMovies,
        watchProviders,
    ] = await Promise.all([
        getMovieVideos(
            movieDetails.id
        ),

        getEroticMovies(1),

        getMovieWatchProviders(
            movieDetails.id
        ),
    ]);

    const trailer =
        videos?.find(
            (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.official
        ) ||
        videos?.find(
            (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer"
        );

    const trailerKey =
        trailer?.key || null;

    return (
        <WatchClient
            mediaType="movie"
            id={movieDetails.id}
            initialDetails={movieDetails}
            initialSimilarMedia={
                discoveryMovies
            }
            trailerKey={trailerKey}
            initialWatchProviders={
                watchProviders
            }
            watchRegion={
                WATCH_REGION
            }
        />
    );
}

