"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaVideo, FaChevronDown, FaChevronRight, FaBars, FaTimes, FaUser, FaCalendar, FaStar, FaPencilAlt } from 'react-icons/fa';
import SearchBar from '../SearchBar';
import { useEffect, useRef, useState } from 'react';

const dropdownItemClass = "block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-red-800 hover:text-white transition-colors duration-200";
const subDropdownTriggerClass = "flex justify-between items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-blue-700 cursor-pointer text-left";

const createSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

const DropdownMenu = ({ title, categories, genres, genrePathPrefix }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
      setIsCategoryOpen(false);
      setIsGenresOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold py-2">
        {title} <FaChevronDown className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-slate-800 dark:bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
          <div className="py-1">
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className={subDropdownTriggerClass}>
                Category <FaChevronRight className="text-xs text-gray-400" />
              </button>
              
              {isCategoryOpen && (
                <div className="absolute top-0 left-full w-48 bg-slate-800 dark:bg-gray-800 border border-gray-700 rounded-md shadow-lg z-30 ml-0">
                  <div className="py-1">
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className={dropdownItemClass}
                        onClick={() => { setIsOpen(false); setIsCategoryOpen(false); }}
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {genres.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setIsGenresOpen(true)}
                onMouseLeave={() => setIsGenresOpen(false)}
              >
                <button className={subDropdownTriggerClass}>
                  Genre <FaChevronRight className="text-xs text-gray-400" />
                </button>
                
                {isGenresOpen && (
                  <div className="absolute top-0 left-full w-48 bg-slate-800 dark:bg-gray-800 border border-gray-700 rounded-md shadow-lg z-30 ml-0">
                    <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
                      {genres.map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/${genrePathPrefix}/genre/${createSlug(genre.name)}`}
                          className={dropdownItemClass}
                          onClick={() => { setIsOpen(false); setIsGenresOpen(false); }}
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentYear, setCurrentYear] = useState(null);
  const [recentYears, setRecentYears] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genres');
        if (!response.ok) {
          throw new Error(`Failed to fetch genres: ${response.status}`);
        }
        const data = await response.json();
        setMovieGenres(data.movieGenres || []);
        setTvGenres(data.tvGenres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setMovieGenres([]);
        setTvGenres([]);
      }
    };
    fetchGenres();
  }, []);

  // Hitung tahun dan recentYears hanya di client
  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
    setRecentYears(Array.from({ length: 5 }, (_, i) => year - i));
  }, []);

  const handleSearchSubmit = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setIsMobileMenuOpen(false);
  };

  const decades = ['2020s', '2010s', '2000s', '1990s', '1980s'];

  return (
    <nav className="bg-gradient-to-b from-purple-900/50 to-slate-900 py-3 p-3 sticky top-0 z-50 shadow-lg transition-colors duration-300">
      <div className="w-full px-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center text-2xl font-bold transition-colors duration-200 group">
            <FaVideo className="text-white mr-1 group-hover:text-yellow-200 transition-colors" />
            <span className="rainbow-text hover:text-white transition-colors">
              WatchFullMovie
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu
              title="Movies"
              categories={[
                { href: "/movie/category/popular", label: "Popular" },
                { href: "/movie/category/now_playing", label: "Now Playing" },
                { href: "/movie/category/upcoming", label: "Upcoming" },
                { href: "/movie/category/top_rated", label: "Top Rated" },
              ]}
              genres={movieGenres}
              genrePathPrefix="movie"
            />

            <DropdownMenu
              title="Tv Series"
              categories={[
                { href: "/tv-show/category/popular", label: "Popular" },
                { href: "/tv-show/category/airing_today", label: "Airing Today" },
                { href: "/tv-show/category/on_the_air", label: "On The Air" },
                { href: "/tv-show/category/top_rated", label: "Top Rated" },
              ]}
              genres={tvGenres}
              genrePathPrefix="tv-show"
            />

            <Link href="/actors" className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold">
              <FaUser className="mr-1" /> Actors
            </Link>
            
            <Link
              href="/streaming"
              className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold"
            >
              <FaVideo className="mr-1" /> Streaming
            </Link>

            <Link href="/top-rated" className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold">
              <FaStar className="mr-0" /> Top Rated
            </Link>
            
            <Link href="/blog" className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold">
              <FaPencilAlt className="mr-1" /> Blog
            </Link>

            <div className="relative group">
              <button className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold">
                <FaCalendar className="mr-1" /> Archives <FaChevronDown className="ml-0" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <div className="px-4 py-1 text-xs text-gray-400 border-b border-gray-700">By Year</div>
                  {recentYears.map(year => (
                    <Link key={year} href={`/movie/year/${year}`} className={dropdownItemClass}>
                      {year}
                    </Link>
                  ))}
                  <div className="px-4 py-1 text-xs text-gray-400 border-b border-gray-700 mt-2">By Decade</div>
                  {decades.map(decade => (
                    <Link key={decade} href={`/movie/decade/${decade.toLowerCase()}`} className={dropdownItemClass}>
                      {decade}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-0">
          <div className="w-42 md:w-50 lg:w-64 hidden md:block -mr-0">
            <SearchBar />
          </div>
          <button
            className="md:hidden text-white p-2 rounded-md bg-slate-800 dark:bg-gray-700 hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 dark:bg-gray-800 p-4 mt-3 rounded-lg">
          <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearchSubmit}
            />
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              href="/actors"
              className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaUser className="mr-1" /> Actors
            </Link>
            <Link
              href="/streaming"
              className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaVideo className="mr-1" /> Streaming
            </Link>
            <Link href="/top-rated" className="text-white font-bold hover:text-green-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Top Rated
            </Link>

            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">Archives</h3>
              <div className="grid grid-cols-3 gap-2 pl-2">
                {recentYears.map(year => (
                  <Link key={year} href={`/movie/year/${year}`} className="text-xs text-gray-300 hover:text-white transition-colors text-center py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    {year}
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 pl-2 mt-2">
                {decades.map(decade => (
                  <Link key={decade} href={`/movie/decade/${decade.toLowerCase()}`} className="text-xs text-gray-300 hover:text-white transition-colors text-center py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    {decade}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">Movies</h3>
              <div className="flex flex-col space-y-2 pl-4">
                <Link href="/movie/category/popular" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Popular</Link>
                <Link href="/movie/category/now_playing" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Now Playing</Link>
                <Link href="/movie/category/upcoming" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Upcoming</Link>
                <Link href="/movie/category/top_rated" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Top Rated</Link>
                <div className="pt-2">
                  <h4 className="text-gray-400 text-sm font-bold mb-1">Genres</h4>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {movieGenres.map((genre) => (
                      <Link key={genre.id} href={`/movie/genre/${createSlug(genre.name)}`} className="text-xs text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">TV Series</h3>
              <div className="flex flex-col space-y-2 pl-4">
                <Link href="/tv-show/category/popular" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Popular</Link>
                <Link href="/tv-show/category/airing_today" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Airing Today</Link>
                <Link href="/tv-show/category/on_the_air" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>On The Air</Link>
                <Link href="/tv-show/category/top_rated" className="text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Top Rated</Link>
                <div className="pt-2">
                  <h4 className="text-gray-400 text-sm font-bold mb-1">Genres</h4>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {tvGenres.map((genre) => (
                      <Link key={genre.id} href={`/tv-show/genre/${createSlug(genre.name)}`} className="text-xs text-gray-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .rainbow-text {
          font-size: 1.8rem;
          background-image: linear-gradient(
            to right,
            #ff0000, #ff8000, #ffff00, #80ff00, 
            #00ff00, #00ff80, #00ffff, #0080ff, 
            #0000ff, #8000ff, #ff00ff, #ff0080
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 300% 300%;
          animation: rainbow 4s ease infinite;
        }

        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef4444;
        }
      `}</style>
    </nav>
  );
}