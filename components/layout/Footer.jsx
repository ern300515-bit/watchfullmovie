// components/Footer.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  FaVideo,
  FaRss,
  FaHeart,
  FaShieldAlt,
  FaFileContract,
  FaGavel,
} from 'react-icons/fa';

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="border-t border-gray-800 bg-slate-950 text-gray-400"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =====================================================
            FOOTER MAIN
        ====================================================== */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

          {/* BRAND */}
          <div className="max-w-md">
            <a
              href="/"
              className="inline-flex items-center gap-3 text-2xl font-bold text-white transition-colors hover:text-blue-400"
              aria-label="WatchFullMovie Home"
            >
              <FaVideo
                className="text-blue-500"
                aria-hidden="true"
              />

              <span>WatchFullMovie</span>
            </a>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Discover movies, TV shows, genres, actors, ratings,
              and streaming information in one place.
            </p>
          </div>

          {/* NAVIGATION */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm"
          >
            <a
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </a>

            <a
              href="/actors"
              className="transition-colors hover:text-white"
            >
              Actors
            </a>

            <a
              href="/blog"
              className="transition-colors hover:text-white"
            >
              Blog
            </a>

            <a
              href="/top-rated"
              className="transition-colors hover:text-white"
            >
              Top Rated
            </a>

            <a
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* =====================================================
            DIVIDER
        ====================================================== */}
        <div className="my-8 border-t border-gray-800" />

        {/* =====================================================
            LEGAL + RSS
        ====================================================== */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">

            <a
              href="/privacy-policy"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <FaShieldAlt
                className="text-green-400"
                aria-hidden="true"
              />
              Privacy Policy
            </a>

            <a
              href="/terms-of-service"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <FaFileContract
                className="text-yellow-400"
                aria-hidden="true"
              />
              Terms of Service
            </a>
			
            <a
              href="/dmca"
              className="inline-flex items-center gap-2 transition-colors hover:text-indigo-300"
            >
              <FaGavel
                className="text-indigo-400"
                aria-hidden="true"
              />
              DMCA
            </a>

            <a
              href="/rss"
              className="inline-flex items-center gap-2 transition-colors hover:text-orange-400"
            >
              <FaRss
                className="text-orange-400"
                aria-hidden="true"
              />
              RSS Feed
            </a>

          </div>

          <p className="text-sm text-gray-500">
            © {year ?? '2026'} WatchFullMovie. All rights reserved.
          </p>
        </div>

        {/* =====================================================
            TECHNOLOGY / DISCLAIMER
        ====================================================== */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center">

          <p className="text-xs text-gray-500">
            Movie and TV information powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-400 hover:text-blue-400"
            >
              TMDB
            </a>
            {' '}and built with{' '}
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-400 hover:text-blue-400"
            >
              Next.js
            </a>
            .
          </p>

          <p className="mx-auto mt-3 max-w-3xl text-xs leading-5 text-gray-600">
            WatchFullMovie provides movie and TV information for informational
            and discovery purposes. WatchFullMovie does not host or store
            movies, TV shows, or video content on its servers.
          </p>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
            Made with
            <FaHeart
              className="text-red-500"
              aria-hidden="true"
            />
            for movie enthusiasts.
          </p>

        </div>
      </div>
    </footer>
  );
}