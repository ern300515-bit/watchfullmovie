// app/not-found.js
import Link from 'next/link';
import Image from 'next/image';
import { getPopularMovies } from '../lib/api';

export const metadata = {
  title: 'Page Not Found - WatchFullMovie',
  description: 'Oops! The page you are looking for does not exist. Return to WatchFullMovie homepage and discover thousands of movies and TV series.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function NotFound() {
  let popularMovies = [];
  try {
    const data = await getPopularMovies(1);
    popularMovies = data.results?.slice(0, 6) || [];
  } catch (error) {
    console.error('Failed to fetch popular movies for 404 page:', error);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-8">
          <svg
            className="w-32 h-32 mx-auto text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            🏠 Back to Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
          >
            🔍 Search Movies
          </Link>
        </div>

        {popularMovies.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-left">
              You might like these:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {popularMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-800 hover:scale-105 transition-transform">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16.67vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-400 truncate group-hover:text-white transition-colors">
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}