// app/page.jsx
import React from 'react';
import Link from 'next/link';
import {
  FaFire,
  FaStar,
  FaTv,
  FaFilm,
  FaUser,
  FaQuestionCircle,
  FaSearch,
  FaCalendarAlt,
  FaVideo,
} from 'react-icons/fa';
import MediaCard from '../components/MediaCard';
import NativeAd from '../components/ads/NativeAd';

export const revalidate = 86400;
export const dynamic = 'force-static';

export const metadata = {
  title: 'WatchFullMovie | Watch Free Movies & TV Shows Legally',
  description:
    'Discover where to watch free movies and TV shows legally. Find free legal streaming options on trusted services such as Tubi, Pluto TV, Plex, and other supported platforms.',

  keywords:
    'watch free movies, watch free TV shows, stream free legally, free legal streaming, free movies online legally, free TV shows online legally, where to watch free movies, where to watch free TV shows, legal streaming guide, Tubi, Pluto TV, Plex, movie recommendations, TV show recommendations',

  openGraph: {
    title: 'WatchFullMovie | Watch Free Movies & TV Shows Legally',
    description:
      'Discover where to watch movies and TV shows free legally. Explore free legal streaming options, trending titles, movie recommendations, TV series, and trusted streaming services.',

    // URL FINAL - TIDAK DIUBAH
    url: 'https://watchfullmovie.netlify.app',

    siteName: 'WatchFullMovie',

    images: [
      {
        // OG IMAGE FINAL - TIDAK DIUBAH
        url: 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg',
        width: 1200,
        height: 630,
        alt: 'WatchFullMovie - Watch Free Movies & TV Shows Legally',
      },
    ],

    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    // TWITTER FINAL - TIDAK DIUBAH
    site: '@watchstream123',
    creator: '@watchstream123',

    title: 'WatchFullMovie | Watch Free Movies & TV Shows Legally',
    description:
      'Find where to watch free movies and TV shows legally on trusted streaming platforms.',

    // TWITTER IMAGE FINAL - TIDAK DIUBAH
    images: [
      'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg',
    ],
  },
};

const genres = [
  {
    name: 'Action',
    link: '/movie/genre/action',
    color: 'text-orange-300',
  },
  {
    name: 'Adventure',
    link: '/movie/genre/adventure',
    color: 'text-blue-300',
  },
  {
    name: 'Sci-Fi',
    link: '/movie/genre/science-fiction',
    color: 'text-purple-300',
  },
  {
    name: 'Anime',
    link: '/movie/genre/animation',
    color: 'text-pink-300',
  },
  {
    name: 'Crime',
    link: '/movie/genre/crime',
    color: 'text-yellow-300',
  },
  {
    name: 'Horror',
    link: '/movie/genre/horror',
    color: 'text-red-300',
  },
  {
    name: 'Comedy',
    link: '/movie/genre/comedy',
    color: 'text-green-300',
  },
  {
    name: 'Romance',
    link: '/movie/genre/romance',
    color: 'text-pink-400',
  },
  {
    name: 'Thriller',
    link: '/movie/genre/thriller',
    color: 'text-indigo-300',
  },
  {
    name: 'Mystery',
    link: '/movie/genre/mystery',
    color: 'text-gray-300',
  },
  {
    name: 'War',
    link: '/movie/genre/war',
    color: 'text-amber-300',
  },
  {
    name: 'Fantasy',
    link: '/movie/genre/fantasy',
    color: 'text-teal-300',
  },
];

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function getTrendingDaily() {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US&page=1`,
      {
        next: { revalidate: 86400 },
      }
    );

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }
}

const Breadcrumb = () => (
  <nav
    className="container mx-auto px-4 py-2"
    aria-label="Breadcrumb"
  >
    <ol className="flex items-center space-x-2 text-sm text-gray-400">
      <li>
        <Link
          href="/"
          className="hover:text-white transition-colors"
        >
          <span>Home</span>
        </Link>
      </li>

      <li className="flex items-center">
        <span className="mx-2">/</span>
      </li>

      <li
        className="text-white"
        aria-current="page"
      >
        <span>Free Legal Streaming Guide</span>
      </li>
    </ol>
  </nav>
);

export default async function HomePage() {
  let trendingContent = [];
  let movieCount = 0;
  let tvCount = 0;

  try {
    const trendingData = await getTrendingDaily();

    trendingContent = trendingData
      .filter((item) => item.poster_path)
      .slice(0, 20);

    movieCount = trendingContent.filter(
      (item) => item.media_type === 'movie' || item.title
    ).length;

    tvCount = trendingContent.filter(
      (item) => item.media_type === 'tv' || item.name
    ).length;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://watchfullmovie.netlify.app/#website',
        url: 'https://watchfullmovie.netlify.app/',
        name: 'WatchFullMovie',

        description:
          'Discover where to watch free movies and TV shows legally on trusted streaming platforms.',

        potentialAction: [
          {
            '@type': 'SearchAction',
            target:
              'https://watchfullmovie.netlify.app/search?q={search_term_string}',
            'query-input':
              'required name=search_term_string',
          },
        ],

        inLanguage: 'en-US',
      },

      {
        '@type': 'WebPage',
        '@id': 'https://watchfullmovie.netlify.app/#webpage',
        url: 'https://watchfullmovie.netlify.app/',

        name:
          'WatchFullMovie | Watch Free Movies & TV Shows Legally',

        description:
          'Find where to watch movies and TV shows free legally. Explore free legal streaming options and trusted streaming services.',

        isPartOf: {
          '@id': 'https://watchfullmovie.netlify.app/#website',
        },

        about:
          'Free legal movie and TV show streaming discovery',

        primaryImageOfPage: {
          '@type': 'ImageObject',

          url: 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg',

          width: 1200,
          height: 630,
        },

        datePublished: '2026-01-01',
        dateModified: new Date()
          .toISOString()
          .split('T')[0],

        breadcrumb: {
          '@id':
            'https://watchfullmovie.netlify.app/#breadcrumb',
        },
      },

      {
        '@type': 'BreadcrumbList',
        '@id':
          'https://watchfullmovie.netlify.app/#breadcrumb',

        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item:
              'https://watchfullmovie.netlify.app/',
          },
        ],
      },

      {
        '@type': 'FAQPage',

        mainEntity: [
          {
            '@type': 'Question',

            name:
              'Can I watch free movies legally on WatchFullMovie?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'Yes. WatchFullMovie helps you discover movies and TV shows that may be available to watch free legally through supported ad-supported and other legitimate streaming services. Availability can vary by title and location.',
            },
          },

          {
            '@type': 'Question',

            name:
              'Can I stream free TV shows legally?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'Yes. WatchFullMovie provides information about legal free streaming options for selected TV shows through supported streaming services. Availability depends on the title, provider, and region.',
            },
          },

          {
            '@type': 'Question',

            name:
              'Which services offer free legal streaming?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'Depending on the title and region, free legal streaming options may include trusted ad-supported services such as Tubi, Pluto TV, Plex, and other legitimate providers.',
            },
          },

          {
            '@type': 'Question',

            name:
              'Does WatchFullMovie host movies or TV shows?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'No. WatchFullMovie is a movie and TV discovery platform. We provide information about where titles may be available and direct users to legitimate streaming providers rather than hosting copyrighted video content.',
            },
          },

          {
            '@type': 'Question',

            name:
              'How often is WatchFullMovie updated?',

            acceptedAnswer: {
              '@type': 'Answer',

              text:
                'WatchFullMovie updates trending movie and TV information daily. Streaming availability can change by title, provider, and region.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup),
        }}
      />

      <Breadcrumb />

      {/* HERO SECTION */}
      <section
        className="relative bg-gradient-to-r from-purple-900/80 to-slate-900 py-2 lg:py-4"
        itemScope
        itemType="https://schema.org/WPHeader"
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 text-center relative z-10">

          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 text-white"
            itemProp="headline"
          >
            Watch Free Movies & TV Shows Legally
          </h1>

          <p
            className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto"
            itemProp="description"
          >
            Discover where to watch free movies and TV shows legally.
            Find legitimate streaming options on trusted services and
            explore what's trending today.
          </p>

          {/* SEO / TOPICAL KEYWORDS */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">

            <span className="bg-slate-800/50 text-gray-300 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaVideo className="text-[10px] md:text-xs" />
              watch free legally
            </span>

            <span className="bg-slate-800/50 text-gray-300 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaSearch className="text-[10px] md:text-xs" />
              free legal streaming
            </span>

            <span className="bg-slate-800/50 text-gray-300 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaCalendarAlt className="text-[10px] md:text-xs" />
              new releases 2026
            </span>

            <span className="bg-slate-800/50 text-gray-300 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaStar className="text-[10px] md:text-xs" />
              top rated movies
            </span>

            <span className="bg-slate-800/50 text-gray-300 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaTv className="text-[10px] md:text-xs" />
              stream free legally
            </span>

          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        {/* TRENDING CONTENT */}
        <section className="mb-16">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">

            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaFire className="text-red-500 text-2xl" />

              Trending Movies & TV Shows

              <span className="text-sm bg-blue-800 text-white px-2 py-1 rounded-full">
                Daily Updates
              </span>
            </h2>

            <div className="text-sm text-gray-400">
              <span className="text-blue-300">
                {movieCount} Movies
              </span>

              {' • '}

              <span className="text-purple-300 ml-2">
                {tvCount} TV Shows
              </span>
            </div>

          </div>

          {trendingContent.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-8">

                {trendingContent.map((item) => (
                  <MediaCard
                    key={`${item.id}-${item.media_type}`}
                    mediaItem={item}
                  />
                ))}

              </div>

              {/* NATIVE AD */}
              <div className="w-full mb-8">
                <NativeAd />
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl mb-8">

                <h3 className="text-xl font-semibold mb-4 text-center text-orange-300">
                  Today's Trending Stats
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">
                      {trendingContent.length}
                    </div>

                    <div className="text-gray-300 text-sm">
                      Total Trending Items
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-300">
                      {movieCount}
                    </div>

                    <div className="text-gray-300 text-sm">
                      Trending Movies
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-300">
                      {tvCount}
                    </div>

                    <div className="text-gray-300 text-sm">
                      Trending TV Shows
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">

              <FaFire className="text-4xl text-gray-600 mx-auto mb-4" />

              <p className="text-gray-400">
                No trending content available at the moment.
                Check back soon!
              </p>

            </div>
          )}
        </section>

        {/* ABOUT SECTION */}
        <section className="mb-16 bg-slate-800/50 p-6 md:p-8 rounded-xl">

          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-300">
            Watch Free Movies & TV Shows Legally with WatchFullMovie
          </h2>

          <div className="space-y-6 text-gray-300">

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">
              What is WatchFullMovie?
            </h3>

            <p>
              WatchFullMovie is a movie and TV show discovery platform
              designed to help you find what to watch and where to
              watch it legally. Explore trending titles, movie
              recommendations, TV series, genres, actors, and
              streaming availability.
            </p>

            <p>
              Looking to <strong>watch free movies</strong> or
              <strong> watch free TV shows legally</strong>?
              WatchFullMovie helps you discover legitimate free streaming
              options when they are available, including
              ad-supported services and other authorized platforms.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">
              Stream Free Legally
            </h3>

            <p>
              Some movies and TV shows may be available to
              <strong> stream free legally</strong> through supported
              services such as Tubi, Pluto TV, Plex, and other
              legitimate providers. Availability can vary depending
              on the title and your region.
            </p>

            <p>
              WatchFullMovie does not host copyrighted movies or TV
              episodes. Instead, our goal is to help viewers discover
              legitimate ways to watch and stream content online.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">
              Daily Trending Updates
            </h3>

            <p>
              Our system tracks daily popularity trends and movie and
              TV information to help you discover what audiences are
              watching today. Streaming availability may change as
              providers update their catalogs.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">
              Popular Genres
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

              {genres.map((genre, index) => (
                <Link
                  key={index}
                  href={genre.link}
                  className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-600/50 transition flex flex-col items-center justify-center"
                >
                  <div className={`font-semibold ${genre.color}`}>
                    {genre.name}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    Browse {genre.name} Movies →
                  </div>
                </Link>
              ))}

            </div>

            {/* FAQ */}
            <div className="bg-slate-900/50 p-6 rounded-lg mt-8">

              <h3 className="text-xl md:text-2xl font-semibold text-orange-300 mb-4 flex items-center gap-2">
                <FaQuestionCircle />
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">

                <div className="faq-item">

                  <h4 className="font-semibold text-blue-300 mb-2">
                    Can I watch free movies legally?
                  </h4>

                  <p className="text-gray-300">
                    Yes. Some movies are available to watch free
                    legally through authorized ad-supported or other
                    legitimate streaming services. Availability
                    depends on the title and region.
                  </p>

                </div>

                <div className="faq-item">

                  <h4 className="font-semibold text-blue-300 mb-2">
                    Can I stream free TV shows legally?
                  </h4>

                  <p className="text-gray-300">
                    Yes. WatchFullMovie helps you discover TV shows that
                    may have free legal streaming options on supported
                    services.
                  </p>

                </div>

                <div className="faq-item">

                  <h4 className="font-semibold text-blue-300 mb-2">
                    Where can I find free legal streaming?
                  </h4>

                  <p className="text-gray-300">
                    Depending on the title and region, legitimate
                    options may include services such as Tubi,
                    Pluto TV, Plex, and other authorized providers.
                  </p>

                </div>

                <div className="faq-item">

                  <h4 className="font-semibold text-blue-300 mb-2">
                    Does WatchFullMovie host movies?
                  </h4>

                  <p className="text-gray-300">
                    No. WatchFullMovie is a discovery and streaming
                    information platform. We help users find
                    legitimate places to watch content rather than
                    hosting copyrighted video files.
                  </p>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="text-center py-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-slate-700">

          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Find Something to Watch Free
          </h2>

          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover trending movies and TV shows and find
            legitimate streaming options, including free legal
            services when available.
          </p>

          <div className="flex flex-wrap justify-center gap-4">

            {/* FIXED ROUTE */}
            <Link
              href="/movie/category/popular"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaFilm />
              Browse Movies
            </Link>

            {/* FIXED ROUTE */}
            <Link
              href="/tv-show/category/popular"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaTv />
              Browse TV Series
            </Link>

            <Link
              href="/actors"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaUser />
              Discover Actors
            </Link>

          </div>
        </section>

      </div>
    </div>
  );
}
