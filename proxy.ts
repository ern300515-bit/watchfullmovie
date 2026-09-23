// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Redirect /person/:id → /actor/:slug
  const personMatch = path.match(/^\/person\/(\d+)$/);

  if (personMatch) {
    const id = personMatch[1];

    try {
      const API_KEY = process.env.TMDB_API_KEY;

      if (!API_KEY) {
        console.error('TMDB_API_KEY is not configured');
        url.pathname = '/actors';
        return NextResponse.redirect(url, 301);
      }

      const res = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`,
        {
          next: {
            revalidate: 86400,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const name = data.name;

        if (name) {
          const slugName = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

          const slug = `${slugName}-${id}`;

          url.pathname = `/actor/${slug}`;

          return NextResponse.redirect(url, 301);
        }
      }
    } catch (error) {
      console.error('Redirect error:', error);
    }

    // Jika gagal mendapatkan data actor
    url.pathname = '/actors';

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/people', '/person/:id*'],
};

