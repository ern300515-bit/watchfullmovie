//app/streaming/[provider]/page.jsx

import Link from "next/link";
import { ArrowLeft, ArrowRight, Film, ShieldCheck } from "lucide-react";
import { getMoviesByWatchProvider } from "../../../lib/api";

import {
    STREAMING_PROVIDERS,
    STREAMING_PROVIDER_SLUGS,
    getStreamingProvider,
} from "../../../lib/streamingProviders";

import ProviderMovieGrid from "../../../components/streaming/ProviderMovieGrid";

export const revalidate = 86400;
export const dynamicParams = false;

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://watchfullmovie.netlify.app";

const WATCH_REGION = (
    process.env.TMDB_REGION ||
    "US"
)
    .trim()
    .toUpperCase();

export async function generateStaticParams() {
    return STREAMING_PROVIDER_SLUGS.map((slug) => ({
        provider: slug,
    }));
}

export async function generateMetadata({ params }) {
    const { provider: providerSlug } = await params;

    const provider = getStreamingProvider(providerSlug);

    if (!provider) {
        return {
            title: "Streaming Provider | WatchFullMovie",
            description:
                "Explore legal movie streaming availability with WatchFullMovie.",
        };
    }

    const title = `Movies on ${provider.name} | WatchFullMovie`;

    const description = provider.description
        ? `${provider.description} Find movie availability and legal streaming options on WatchFullMovie.`
        : `Explore movies available through ${provider.name} and find legal streaming options on WatchFullMovie.`;

    return {
        title,
        description,

        keywords: [
            `${provider.name} movies`,
            `movies on ${provider.name}`,
            `watch movies on ${provider.name}`,
            "stream movies legally",
            "legal streaming",
            "movie streaming",
        ],

        alternates: {
            canonical: `${SITE_URL}/streaming/${provider.slug}`,
        },

        openGraph: {
            title,
            description,
            url: `${SITE_URL}/streaming/${provider.slug}`,
            siteName: "WatchFullMovie",

            images: [
                {
                    url:
                        "https://live.staticflickr.com/65535/55545099591_ee728497d6_b.jpg",
                    width: 1024,
                    height: 576,
                    alt: `${provider.name} movies on WatchFullMovie`,
                },
            ],

            locale: "en_US",
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            site: "@WatchStream123",
            creator: "@WatchStream123",
            title,
            description,

            images: [
                "https://live.staticflickr.com/65535/55545099591_ee728497d6_b.jpg",
            ],
        },
    };
}

export default async function StreamingProviderPage({
    params,
}) {
    const { provider: providerSlug } = await params;

    const provider = getStreamingProvider(providerSlug);

    if (!provider) {
        return (
            <main className="min-h-screen bg-gray-950 text-white">
                <div className="container mx-auto px-4 py-20">
                    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-800 bg-gray-900/70 p-8 text-center">
                        <h1 className="text-2xl font-bold">
                            Streaming Provider Not Found
                        </h1>

                        <p className="mt-3 text-gray-400">
                            The requested streaming provider could not be
                            found.
                        </p>

                        <Link
                            href="/streaming"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700"
                        >
                            <ArrowLeft size={16} />
                            Back to Streaming
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    let movies = [];
    let totalPages = 0;
    let totalResults = 0;

    try {
        const data = await getMoviesByWatchProvider(
            provider.providerId,
            1,
            WATCH_REGION
        );

        movies = data?.results || [];
        totalPages = data?.total_pages || 0;
        totalResults = data?.total_results || 0;
    } catch (error) {
        console.error(
            `Error fetching movies for ${provider.name}:`,
            error
        );
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <div className="container mx-auto px-4 py-10">

                {/* HEADER */}
                <section className="rounded-3xl border border-gray-800 bg-gray-900/80 p-8 md:p-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                        <div>
                            <Link
                                href="/streaming"
                                className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-cyan-300"
                            >
                                <ArrowLeft size={16} />
                                All Streaming Services
                            </Link>

                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-800">
                                    <Film
                                        size={25}
                                        className="text-cyan-400"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold md:text-4xl">
                                        {provider.name}
                                    </h1>

                                    {provider.description && (
                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                                            {provider.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-800 bg-gray-950/70 px-3 py-1.5 text-xs font-semibold text-gray-400">
                            <ShieldCheck size={14} />
                            Region: {WATCH_REGION}
                        </div>
                    </div>

                    <p className="mt-6 max-w-3xl text-sm leading-6 text-gray-500">
                        Movie availability is based on the selected region and
                        can change over time. WatchFullMovie is a discovery
                        platform and does not host copyrighted movie streams.
                    </p>
                </section>

                {/* MOVIES */}
                <section className="mt-10">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Movies on {provider.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Browse movie availability for region{" "}
                                {WATCH_REGION}.
                            </p>
                        </div>

                        {totalPages > 0 && (
                            <span className="text-sm text-gray-500">
                                Page 1 of {totalPages}
                            </span>
                        )}
                    </div>

                    {movies.length === 0 ? (
                        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-10 text-center">
                            <Film
                                size={36}
                                className="mx-auto text-gray-600"
                            />

                            <h3 className="mt-4 text-lg font-semibold">
                                No movies found
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                No movie availability was returned for this
                                provider in {WATCH_REGION}.
                            </p>

                            <Link
                                href="/streaming"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700"
                            >
                                Browse Other Services
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <ProviderMovieGrid
                            initialMovies={movies}
                            initialPage={1}
                            totalPages={totalPages}
                            totalResults={totalResults}
                            providerSlug={provider.slug}
                            region={WATCH_REGION}
                        />
                    )}
                </section>

                {/* OTHER PROVIDERS */}
                <section className="mt-14">
                    <h2 className="mb-5 text-xl font-bold">
                        Explore Other Streaming Services
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {Object.values(STREAMING_PROVIDERS)
                            .filter(
                                (item) =>
                                    item.slug !== provider.slug
                            )
                            .map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/streaming/${item.slug}`}
                                    className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-cyan-500/50 hover:text-cyan-300"
                                >
                                    {item.name}
                                </Link>
                            ))}
                    </div>
                </section>
            </div>
        </main>
    );
}