//app/streaming/page.jsx
import Link from 'next/link';
import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react";
import {
  STREAMING_PROVIDERS,
} from '../../lib/streamingProviders';

import ProviderLogo from '../../components/streaming/ProviderLogo';
import NativeAd from '../../components/ads/NativeAd';


export const revalidate = 86400;

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://watchfullmovie.netlify.app";

export const metadata = {
    title: "Streaming Movies & TV Shows | WatchFullMovie",
    description:
        "Discover where to watch movies and TV shows legally. Explore streaming services, free legal streaming options, subscriptions, rentals, and purchases with WatchFullMovie.",
    keywords: [
        "streaming movies",
        "streaming TV shows",
        "watch free movies legally",
        "watch free TV shows legally",
        "stream free legally",
        "free legal streaming",
        "where to watch movies",
        "where to watch TV shows",
        "legal streaming guide",
        "movie streaming services",
        "TV streaming services",
    ],
    alternates: {
        canonical: `${SITE_URL}/streaming`,
    },
    openGraph: {
        title: "Streaming Movies & TV Shows | WatchFullMovie",
        description:
            "Find legal streaming options for movies and TV shows, including free, ad-supported, subscription, rental, and purchase options.",
        url: `${SITE_URL}/streaming`,
        siteName: "WatchFullMovie",
        images: [
            {
                url:
                    "https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg",
                width: 1024,
                height: 576,
                alt: "WatchFullMovie streaming movies and TV shows",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        site: "@WatchStream123",
        creator: "@WatchStream123",
        title: "Streaming Movies & TV Shows | WatchFullMovie",
        description:
            "Find legal streaming options for movies and TV shows, including free and ad-supported options.",
        images: [
            "https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg",
        ],
    },
};

export default function StreamingPage() {
    const providers = Object.values(STREAMING_PROVIDERS);

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <div className="container mx-auto px-4 py-10">
                {/* HERO */}
                <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/80 p-8 md:p-12">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-4xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                            <ShieldCheck size={15} />
                            Legal Streaming Discovery
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Streaming Movies & TV Shows
                        </h1>

                        <p className="mt-5 max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
                            Discover where movies and TV shows are available
                            legally. WatchFullMovie helps you find free legal
                            streaming, ad-supported viewing, subscriptions,
                            rentals, and purchases across supported services.
                        </p>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
                            Availability can vary by title, country, and time.
                            WatchFullMovie does not host or provide copyrighted
                            movie or TV video streams.
                        </p>
                    </div>
                </section>

                {/* AD */}
                <div className="my-8">
                    <NativeAd />
                </div>

                {/* PROVIDERS */}
                <section>
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Streaming Services
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Browse supported platforms and explore their
                                movie availability.
                            </p>
                        </div>

                        <div className="text-sm text-gray-500">
                            {providers.length} services
                        </div>
                    </div>

                    {providers.length === 0 ? (
                        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-8 text-center">
                            <p className="text-gray-400">
                                No streaming services are currently available.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {providers.map((provider) => (
                                <Link
                                    key={provider.slug}
                                    href={`/streaming/${provider.slug}`}
                                    className="group rounded-2xl border border-gray-800 bg-gray-900/70 p-5 transition-all duration-200 hover:border-cyan-500/50 hover:bg-gray-800/80"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-800">
                                            <ProviderLogo
                                                provider={provider}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-white group-hover:text-cyan-300">
                                                {provider.name}
                                            </h3>

                                            {provider.description && (
                                                <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-400">
                                                    {provider.description}
                                                </p>
                                            )}
                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="mt-1 flex-shrink-0 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* SEO / LEGAL STREAMING */}
                <section className="mt-14 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <PlayCircle
                            size={24}
                            className="mt-1 flex-shrink-0 text-cyan-400"
                        />

                        <div>
                            <h2 className="text-2xl font-bold">
                                Find Free & Legal Streaming Options
                            </h2>

                            <p className="mt-4 leading-7 text-gray-400">
                                Looking for where to watch a movie or TV show?
                                WatchFullMovie helps you discover legitimate
                                streaming options instead of hosting video
                                files. When a title has free or
                                ad-supported availability in the selected
                                region, those options can be highlighted as
                                free legal streaming choices.
                            </p>

                            <p className="mt-4 leading-7 text-gray-400">
                                Other titles may be available through a
                                subscription, rental, or purchase. Availability
                                is title- and region-dependent, so always check
                                the current availability shown for the title
                                you want to watch.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/movie/category/popular"
                                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
                                >
                                    Popular Movies
                                </Link>

                                <Link
                                    href="/movie/category/now_playing"
                                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
                                >
                                    Now Playing
                                </Link>

                                <Link
                                    href="/movie/category/upcoming"
                                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
                                >
                                    Upcoming Movies
                                </Link>

                                <Link
                                    href="/tv-show/category/popular"
                                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
                                >
                                    Popular TV Shows
                                </Link>

                                <Link
                                    href="/actors"
                                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
                                >
                                    Actors
                                </Link>

                                <Link
                                    href="/blog"
                                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
                                >
                                    Movie & TV Guide
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
