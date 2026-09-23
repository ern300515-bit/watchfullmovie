// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchfullmovie.netlify.app'
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    rules: [
      // Global rules for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Block API and admin
          '/api/',
          '/admin/',
          '/private/',
          // Next.js internal files
          '/_next/static/',
          '/_next/data/',
          '/node_modules/',
          // ✅ Pages that should not be indexed (already have noindex, but prevent crawling)
          '/search',
          '/people',
          '/movie/*/stream',
          '/tv-show/*/stream',
          // Block common tracking parameters
          '/*?*utm_',
          '/*?*fbclid=',
          '/*?*gclid=',
          '/*?*ref=',
        ],
      },
      
      // Googlebot specific rules (more permissive)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/search',
          '/people',
          '/movie/*/stream',
          '/tv-show/*/stream',
          // Allow Google to crawl pagination/sort for better indexing
          // '/*?*sort=',  // Allow sorted pages
          // '/*?*page=',  // Allow pagination
          '/*?*filter=', // Block filters to avoid duplicates
        ],
        crawlDelay: isProduction ? 0.5 : 1,
      },
      
      // Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/search',
          '/people',
          '/movie/*/stream',
          '/tv-show/*/stream',
        ],
        crawlDelay: isProduction ? 0.5 : 1,
      },
      
      // Block SEO spam bots
      {
        userAgent: [
          'AhrefsBot',
          'SEMrushBot', 
          'MJ12bot',
          'DotBot',
          'MauiBot',
          'PetalBot',
          'Bytespider', // TikTok bot
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // host: baseUrl, // Opsional, Google tidak menggunakan directive ini
  }
}