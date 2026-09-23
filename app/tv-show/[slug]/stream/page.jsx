
// app/tv-show/[slug]/stream/page.jsx

import { cache } from "react";
import { notFound } from "next/navigation";

import {
    createSlug,
    getTvSeriesById,
    getTvSeriesVideos,
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

const getSimilarTvSeriesWithFallback = async (
    tvId,
    genreIds = []
) => {
    const API_KEY =
        process.env.TMDB_API_KEY;

    if (!API_KEY || !tvId) {
        return [];
    }

    const baseUrl =
        "https://api.themoviedb.org/3";

    const KEYWORD_SEX = 267122;

    try {
        const keywordParams =
            new URLSearchParams({
                api_key: API_KEY,
                with_keywords:
                    String(KEYWORD_SEX),
                sort_by:
                    "popularity.desc",
                page: "1",
            });

        const keywordUrl =
            `${baseUrl}/discover/tv?${keywordParams.toString()}`;

        const keywordResponse =
            await fetch(keywordUrl, {
                next: {
                    revalidate: 86400,
                },
            });

        if (keywordResponse.ok) {
            const data =
                await keywordResponse.json();

            const filtered =
                (data.results || []).filter(
                    (item) =>
                        item.id !== tvId
                );

            if (filtered.length > 0) {
                return filtered;
            }
        }

        if (
            genreIds &&
            genreIds.length > 0
        ) {
            const genreParams =
                new URLSearchParams({
                    api_key: API_KEY,
                    with_genres:
                        genreIds.join(","),
                    sort_by:
                        "popularity.desc",
                    page: "1",
                });

            const genreUrl =
                `${baseUrl}/discover/tv?${genreParams.toString()}`;

            const genreResponse =
                await fetch(genreUrl, {
                    next: {
                        revalidate: 86400,
                    },
                });

            if (genreResponse.ok) {
                const data =
                    await genreResponse.json();

                const filtered =
                    (data.results || []).filter(
                        (item) =>
                            item.id !== tvId
                    );

                if (
                    filtered.length > 0
                ) {
                    return filtered;
                }
            }
        }

        return [];
    } catch (error) {
        console.error(
            "Error fetching similar TV series:",
            error
        );

        return [];
    }
};

const getTvWatchProviders = async (
    tvId
) => {
    const API_KEY =
        process.env.TMDB_API_KEY;

    if (!API_KEY || !tvId) {
        return null;
    }

    const url =
        `https://api.themoviedb.org/3/tv/${tvId}/watch/providers?api_key=${API_KEY}`;

    try {
        const response =
            await fetch(url, {
                next: {
                    revalidate: 21600,
                },
            });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch TV watch providers: ${response.status}`
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
            "Error fetching TV watch providers:",
            error
        );

        return null;
    }
};

// ============================================
// RESOLVE TV SHOW BY SLUG
// ============================================
//
// Mendukung:
//
// 1. Pure ID
//    /tv-show/108978/stream
//
// 2. judul-tahun-id
//    /tv-show/reacher-2022-108978/stream
//
//    Khusus halaman Actor.
//
// 3. judul-tahun
//    /tv-show/reacher-2022/stream
//
// 4. judul-id
//    /tv-show/reacher-108978/stream
//
// ============================================

const findTvFromSlug = cache(
    async (slug) => {
        if (
            !slug ||
            typeof slug !== "string"
        ) {
            return null;
        }

        const slugParts =
            slug.split("-");

        // ========================================
        // FORMAT 1:
        // PURE NUMERIC ID
        // ========================================

        if (
            slugParts.length === 1 &&
            /^\d+$/.test(slug)
        ) {
            try {
                const tv =
                    await getTvSeriesById(
                        parseInt(slug, 10)
                    );

                if (tv) {
                    return tv;
                }
            } catch (err) {
                console.warn(
                    "findTvFromSlug FORMAT 1 gagal:",
                    slug,
                    err?.message
                );
            }
        }

        // ========================================
        // FORMAT 2:
        // JUDUL-TAHUN-ID
        //
        // Contoh:
        // reacher-2022-108978
        //
        // ID terakhir >= 5 digit dianggap
        // sebagai TMDB TV ID.
        // ========================================

        const lastSeg =
            slugParts[
                slugParts.length - 1
            ];

        if (
            /^\d+$/.test(lastSeg) &&
            lastSeg.length >= 5
        ) {
            const id =
                parseInt(lastSeg, 10);

            try {
                const tv =
                    await getTvSeriesById(id);

                if (tv) {
                    return tv;
                }
            } catch (err) {
                console.warn(
                    "findTvFromSlug FORMAT 2 gagal getTvSeriesById:",
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
        // FORMAT 4:
        // JUDUL-ID
        //
        // Buang ID terakhir terlebih dahulu
        // jika ada.
        // ========================================

        let titleParts =
            slugParts;

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
                        "tv"
                    ) {
                        return false;
                    }

                    if (!item.name) {
                        return false;
                    }

                    const itemSlug =
                        createSlug(
                            item.name,
                            item.first_air_date
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
                            "tv"
                        ) {
                            return false;
                        }

                        if (!item.name) {
                            return false;
                        }

                        const itemSlugNoYear =
                            createSlug(
                                item.name,
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
                            "tv"
                        ) {
                            return false;
                        }

                        if (!item.name) {
                            return false;
                        }

                        const normalizedName =
                            item.name
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
                            normalizedName ===
                            normalizedSlug
                        );
                    }
                );
        }

        // ========================================
        // STRATEGY D:
        // FALLBACK TV PERTAMA
        // ========================================

        if (!found) {
            found =
                searchResults.find(
                    (item) =>
                        item.media_type ===
                        "tv"
                );
        }

        // ========================================
        // AMBIL DETAIL LENGKAP
        // ========================================

        if (found) {
            try {
                return await getTvSeriesById(
                    found.id
                );
            } catch (err) {
                console.warn(
                    "findTvFromSlug gagal getTvSeriesById hasil pencarian:",
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

    let tvTitle = "TV Series";
    let tvData = null;

    let ogImage =
        "https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg";

    try {
        const tv =
            await findTvFromSlug(slug);

        if (tv) {
            tvTitle =
                tv.name;

            tvData =
                tv;

            if (tv.backdrop_path) {
                ogImage =
                    `${TMDB_IMAGE_BASE}/w1280${tv.backdrop_path}`;
            } else if (
                tv.poster_path
            ) {
                ogImage =
                    `${TMDB_IMAGE_BASE}/w500${tv.poster_path}`;
            }
        }
    } catch (error) {
        console.error(
            "Error fetching TV series for metadata:",
            error
        );
    }

    const canonical =
        `${process.env.NEXT_PUBLIC_SITE_URL || "https://watchfullmovie.netlify.app"}/tv-show/${slug}/stream`;

    return {
        title:
            `Where to Watch ${tvTitle} - Legal Streaming Options | WatchFullMovie`,

        description:
            `Find legal streaming options for ${tvTitle}, including free or ad-supported availability when offered in the selected region.`,

        robots: {
            index: false,
            follow: true,
        },

        alternates: {
            canonical,
        },

        openGraph: {
            title:
                `Where to Watch ${tvTitle} - Legal Streaming Options | WatchFullMovie`,

            description:
                `Find where to watch ${tvTitle} legally, including free and ad-supported options when available.`,

            url: canonical,

            siteName: "WatchFullMovie",

            images: [
                {
                    url: ogImage,
                    width:
                        tvData?.backdrop_path
                            ? 1280
                            : 500,
                    height:
                        tvData?.backdrop_path
                            ? 720
                            : 750,
                    alt:
                        `${tvTitle} trailer and streaming information`,
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
                `Where to Watch ${tvTitle} | WatchFullMovie`,

            description:
                `Find legal streaming options for ${tvTitle}.`,

            images: [ogImage],
        },
    };
}

export default async function StreamPage({
    params,
}) {
    const { slug } = await params;

    const tvDetails =
        await findTvFromSlug(slug);

    if (!tvDetails) {
        notFound();
    }

    const genreIds =
        tvDetails.genres?.map(
            (genre) => genre.id
        ) || [];

    const [
        videos,
        similarMedia,
        watchProviders,
    ] = await Promise.all([
        getTvSeriesVideos(
            tvDetails.id
        ),

        getSimilarTvSeriesWithFallback(
            tvDetails.id,
            genreIds
        ),

        getTvWatchProviders(
            tvDetails.id
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
            mediaType="tv"
            id={tvDetails.id}
            initialDetails={tvDetails}
            initialSimilarMedia={
                similarMedia
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

