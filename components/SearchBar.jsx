'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    if (onSearch) {
      onSearch(trimmedQuery);
      return;
    }

    router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center space-x-2 w-full max-w-sm"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Movie or TV Series"
        aria-label="Search for a movie or TV series"
        className="flex-grow p-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
      />

      <button
        type="submit"
        aria-label="Search"
        className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <FaSearch aria-hidden="true" />
      </button>
    </form>
  );
}