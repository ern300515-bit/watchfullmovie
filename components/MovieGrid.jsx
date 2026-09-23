// components/MovieGrid.jsx
import Link from 'next/link';
import Image from 'next/image';
import { createSlug } from '../lib/api';

export default function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => {
        const slug = createSlug(
          movie.title,
          movie.release_date
        );

        const href = `/movie/${slug}`;

        return (
          <Link key={movie.id} href={href}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://placehold.co/500x750/1f2937/d1d5db?text=No+Image'
                  }
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="mt-2 text-sm font-semibold text-white truncate">
                {movie.title}
              </h3>

              {movie.release_date && (
                <p className="text-xs text-gray-400">
                  ({movie.release_date.substring(0, 4)})
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}