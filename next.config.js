/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ============================================================
  // IMAGES
  // ============================================================
  images: {
    // Jika Anda mengalami masalah dengan gambar dari TMDB, setel ke true
    // Namun jika ingin optimasi gambar, setel ke false (default)
    unoptimized: true, // Ubah ke true jika ada error gambar

    formats: ['image/webp'], // Dukung WebP untuk performa lebih baik

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        pathname: '/**',
      },
      // Tambahkan domain lain jika diperlukan
      // {
      //   protocol: 'https',
      //   hostname: 'unsplash.com',
      //   pathname: '/**',
      // },
    ],
  },

  // ============================================================
  // PERFORMANCE & SECURITY
  // ============================================================
  compress: true, // Aktifkan kompresi gzip
  poweredByHeader: false, // Sembunyikan header X-Powered-By
  productionBrowserSourceMaps: false, // Nonaktifkan source map di production

  // ============================================================
  // EXPERIMENTAL
  // ============================================================
  experimental: {
    optimizeCss: false, // Optimasi CSS (gunakan dengan hati-hati)
    // turbopack: true, // Tidak perlu, karena sudah default di Next.js 16
  },

  // ============================================================
  // HEADERS (Caching)
  // ============================================================
  async headers() {
    return [
      // Asset statis (cache 1 tahun)
      {
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Halaman movie (cache 1 jam, stale-while-revalidate 1 hari)
      {
        source: '/movie/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/tv-show/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      // Sitemap & robots (cache 1 hari)
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=43200' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=43200' },
        ],
      },
      // API routes (no-cache)
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },

  // ============================================================
  // REDIRECTS
  // ============================================================
  async redirects() {
    return [
      {
        source: '/people',
        destination: '/actors',
        permanent: true,
      },
      // Tambahkan redirect populer lainnya
      {
        source: '/movies',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tv',
        destination: '/',
        permanent: true,
      },
      // Redirect /movie/category/popular → /movie/category/popular (sudah ada)
      // Jika ada yang lain, tambahkan di sini
    ];
  },

  // ============================================================
  // TRAILING SLASH (Opsional)
  // ============================================================
  trailingSlash: false, // Biarkan false untuk URL tanpa slash di akhir
};

module.exports = nextConfig;