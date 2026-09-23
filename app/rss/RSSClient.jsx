// app/rss/RSSClient.jsx

'use client';

import { useState, useEffect } from 'react';

const RSS_FEEDS = [
  {
    title: 'Latest Movies',
    description:
      'Get updates on the latest movies added to the WatchFullMovie catalogue.',
    url: '/rss/latest-movies.xml',
    category: 'Movies',
  },
  {
    title: 'New TV Shows',
    description:
      'Stay updated with newly added TV shows and series information.',
    url: '/rss/new-tv-shows.xml',
    category: 'TV Shows',
  },
  {
    title: 'Popular Content',
    description:
      'Discover popular movies and TV shows based on catalogue popularity and ratings.',
    url: '/rss/popular.xml',
    category: 'Popular',
  },
  {
    title: 'Upcoming Releases',
    description:
      'Get updates about upcoming movie and TV show releases.',
    url: '/rss/upcoming.xml',
    category: 'Upcoming',
  },
  {
    title: 'News & Updates',
    description:
      'Follow the latest WatchFullMovie news, announcements, and site updates.',
    url: '/rss/news.xml',
    category: 'News',
  },
];

export default function RSSClient() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copyError, setCopyError] = useState(null);
  const [origin, setOrigin] = useState('');

  // Set origin hanya setelah mount → menghindari hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const getAbsoluteUrl = (path) => {
    // Sebelum mount (server render & render pertama di client), tampilkan path saja.
    // Setelah mount, tampilkan URL absolute.
    if (!origin) return path;
    return new URL(path, origin).toString();
  };

  const copyToClipboard = async (path, index) => {
    const absoluteUrl = getAbsoluteUrl(path);

    setCopyError(null);

    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard API is not available.');
      }

      await navigator.clipboard.writeText(absoluteUrl);

      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy RSS URL:', error);
      setCopyError(index);
    }
  };

  return (
    <div className="grid gap-6">
      {RSS_FEEDS.map((feed, index) => {
        const absoluteUrl = getAbsoluteUrl(feed.url);

        return (
          <div
            key={feed.url}
            className="bg-slate-800 p-6 rounded-lg"
          >
            <div className="flex justify-between items-start gap-4 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {feed.title}
                </h3>

                <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                  {feed.category}
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(feed.url, index)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors whitespace-nowrap"
                aria-label={`Copy ${feed.title} RSS feed URL`}
              >
                {copiedIndex === index ? 'Copied!' : 'Copy URL'}
              </button>
            </div>

            <p className="text-gray-300 mb-4 text-justify">
              {feed.description}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <code className="bg-slate-700 px-3 py-2 rounded text-sm text-blue-300 break-all flex-1 min-w-0">
                {absoluteUrl}
              </code>

              <a
                href={feed.url}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${feed.title} RSS feed`}
              >
                View Feed
              </a>
            </div>

            {copyError === index && (
              <p className="text-red-400 text-sm mt-3">
                Unable to copy the RSS URL. Please copy it manually.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}