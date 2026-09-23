// app/layout.jsx
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdBanner from '../components/ads/AdBanner';
import SocialBanner from '../components/ads/SocialBanner';

export const metadata = {
  metadataBase: new URL('https://watchfullmovie.netlify.app'),
  alternates: {
    canonical: '/',
  },

  title: 'WatchFullMovie - Watch Free Movies & TV Shows Legally',
  description:
    'Discover where to watch free movies and TV shows legally. Find free legal streaming options, including Tubi, Pluto TV, Plex, and other trusted streaming services, plus movie and TV recommendations.',

  keywords:
    'watch free movies, watch free TV shows, stream free legally, free legal streaming, free movies online legally, free TV series legally, where to watch free, legal streaming services, Tubi, Pluto TV, Plex, movie database, TV show recommendations',

  openGraph: {
    title: 'WatchFullMovie - Watch Free Movies & TV Shows Legally',
    description:
      'Find where to watch movies and TV shows free legally. Discover free legal streaming options on trusted platforms and explore movies, TV series, actors, and streaming information.',

    // URL DIJAGA SAMA - JANGAN DIUBAH
    url: 'https://watchfullmovie.netlify.app',

    siteName: 'WatchFullMovie',
    images: [
      {
        // URL GAMBAR DIJAGA SAMA - JANGAN DIUBAH
        url: 'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg',
        width: 1200,
        height: 630,
        alt: 'WatchFullMovie - Watch Free Movies and TV Shows Legally',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    // TWITTER SITE DIJAGA SAMA - JANGAN DIUBAH
    site: '@WatchStream123',

    // TWITTER CREATOR DIJAGA SAMA - JANGAN DIUBAH
    creator: '@WatchStream123',

    title: 'WatchFullMovie - Watch Free Movies & TV Shows Legally',
    description:
      'Discover where to watch free movies and TV shows legally on trusted streaming platforms.',

    // URL GAMBAR DIJAGA SAMA - JANGAN DIUBAH
    images: [
      'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg',
    ],
  },

  other: {
    // FACEBOOK APP ID DIJAGA SAMA - JANGAN DIUBAH
    'fb:app_id': '61550804323530',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="r5-183PmH_UaC-9wWG4BOQ3mCjOljM0JM13bA4NYWS0" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'WatchFullMovie',

              // URL DIJAGA SAMA - JANGAN DIUBAH
              url: 'https://watchfullmovie.netlify.app',

              potentialAction: {
                '@type': 'SearchAction',
                target:
                  'https://watchfullmovie.netlify.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },

              description:
                'Discover where to watch free movies and TV shows legally, including free legal streaming options on trusted streaming platforms.',

              keywords:
                'watch free movies, watch free TV shows, stream free legally, free legal streaming, where to watch free',
            }),
          }}
        />

        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'WatchFullMovie',

              // URL DIJAGA SAMA - JANGAN DIUBAH
              url: 'https://watchfullmovie.netlify.app',

              // LOGO URL DIJAGA SAMA - JANGAN DIUBAH
              logo:
                'https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg',

              description:
                'Legal streaming discovery guide for finding movies and TV shows available to watch free on supported streaming services.',

              sameAs: [
                // TWITTER DIJAGA SAMA - JANGAN DIUBAH
                'https://twitter.com/watchstream123',

                // FACEBOOK DIJAGA SAMA - JANGAN DIUBAH
                'https://www.facebook.com/61550804323530',
              ],
            }),
          }}
        />
      </head>

      <body>
        <div className="flex flex-col min-h-screen bg-slate-900">
          <header className="w-full max-w-7xl mx-auto px-4 py-4 sticky top-0 z-50 bg-slate-900 shadow-lg">
            <Navbar />
          </header>

          {/* HEADER BANNER 728x90 (Hanya Desktop & Tablet) */}
          <div className="w-full bg-slate-900 py-2 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 flex justify-center">
              <AdBanner
                adId="728x90_header"
                scriptKey="7e07002dbb3adb80f991e172b7c307d7"
                height={90}
                width={728}
                className="rounded-lg overflow-hidden shadow-lg"
              />
            </div>
          </div>

          {/* BANNER 320x50 (Hanya HP / Mobile) */}
          <div className="w-full bg-slate-900 py-2 block md:hidden">
            <div className="flex justify-center">
              <AdBanner
                adId="320x50_mobile_header"
                scriptKey="bb8b92d3f379384f457ceeb1da7bcaff"
                height={50}
                width={320}
                className="rounded overflow-hidden shadow"
              />
            </div>
          </div>

          <main className="w-full max-w-7xl mx-auto px-4 py-8 mt-2">
            {children}
          </main>

          <footer className="w-full max-w-7xl mx-auto px-4 py-8">
            <Footer />
          </footer>

          {/* SOCIAL BANNER (Dimuat otomatis di background) */}
          <SocialBanner
            scriptSrc="https://fundingfashioned.com/84/0f/a7/840fa7001aeddabd882d1fe486a15285.js"
          />
        </div>
      </body>
    </html>
  );
}
