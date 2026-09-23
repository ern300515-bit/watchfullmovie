// app/rss/page.jsx

import RSSClient from './RSSClient';

// Static page configuration
export const dynamic = 'force-static';
export const revalidate = false;

// Metadata
export const metadata = {
  title: 'RSS Feeds - WatchFullMovie',
  description:
    'Subscribe to WatchFullMovie RSS feeds for the latest movie releases, TV shows, popular content, upcoming titles, and site updates.',
  keywords:
    'WatchFullMovie RSS, RSS feeds, movie RSS, TV show RSS, movie updates, TV show updates, upcoming movies, upcoming TV shows',
};

// Main Server Component
export default function RSSPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        RSS Feeds
      </h1>

      {/* RSS Information */}
      <div className="bg-slate-800 p-6 rounded-lg text-gray-300 mb-8 text-justify">
        <h2 className="text-xl font-semibold text-white mb-4">
          What are RSS Feeds?
        </h2>

        <p className="mb-4">
          RSS (Really Simple Syndication) feeds allow you to stay updated
          with the latest content from WatchFullMovie without having to visit
          the website manually. Subscribe using your favorite RSS reader
          and receive updates whenever new catalogue content or site
          information becomes available.
        </p>

        <h3 className="font-semibold text-white mb-2">
          How to Use RSS Feeds
        </h3>

        <ol className="list-decimal pl-6 space-y-2 text-justify">
          <li>Choose an RSS feed from the list below.</li>
          <li>Copy the feed URL.</li>
          <li>Paste the URL into your preferred RSS reader.</li>
          <li>Receive automatic updates when new content is published.</li>
        </ol>
      </div>

      {/* RSS Feed List */}
      <RSSClient />

      {/* Recommended RSS Readers */}
      <div className="mt-8 bg-slate-800 p-6 rounded-lg text-gray-300 text-justify">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recommended RSS Readers
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-2">
              Desktop & Web Applications
            </h3>

            <ul className="list-disc pl-6 space-y-1">
              <li>Feedly</li>
              <li>Inoreader</li>
              <li>NewsBlur</li>
              <li>The Old Reader</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              Browser Extensions
            </h3>

            <ul className="list-disc pl-6 space-y-1">
              <li>RSS Feed Reader</li>
              <li>Feeder</li>
              <li>Brief</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="mt-6 bg-slate-800 p-6 rounded-lg text-gray-300 text-justify">
        <h2 className="text-xl font-semibold text-white mb-4">
          Need Help?
        </h2>

        <p>
          If you need assistance with WatchFullMovie RSS feeds or have questions
          about using them, please visit our{' '}
          <a
            href="/contact"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Contact page
          </a>
          .
        </p>
      </div>
    </div>
  );
}