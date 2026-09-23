// app/actors/page.jsx

import { getPopularPeople } from "../../lib/api";
import ActorsClient from "./ActorsClient";

export const dynamic = "force-static";
export const revalidate = 86400;


/*
 * ---------------------------------------------------------
 * FALLBACK PEOPLE
 * ---------------------------------------------------------
 *
 * Digunakan hanya jika TMDB gagal.
 */

const FALLBACK_PEOPLE = [
  {
    id: 500,
    name: "Tom Hanks",
    known_for_department: "Acting",
    profile_path:
      "/xndWFsBlClOJFRbhSt0rE6ebK6J.jpg",
  },

  {
    id: 6193,
    name: "Leonardo DiCaprio",
    known_for_department: "Acting",
    profile_path:
      "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
  },

  {
    id: 287,
    name: "Brad Pitt",
    known_for_department: "Acting",
    profile_path:
      "/kc3M04MkXjfe7R11mHw9bXspHmP.jpg",
  },

  {
    id: 5064,
    name: "Meryl Streep",
    known_for_department: "Acting",
    profile_path:
      "/qWjE4AKadYyFQZJ2MP8ZQxI6LSS.jpg",
  },

  {
    id: 380,
    name: "Robert De Niro",
    known_for_department: "Acting",
    profile_path:
      "/8Bgdfv1oN9Mw0YuMHP6fw8KzDkc.jpg",
  },
];


/*
 * ---------------------------------------------------------
 * METADATA
 * ---------------------------------------------------------
 */

export async function generateMetadata() {
  return {
    title:
      "Actors & Celebrities - WatchFullMovie",

    description:
      "Discover your favorite actors, actresses, directors, and crew members from movies and TV series.",

    robots: {
      index: false,
      follow: true,
    },

    alternates: {
      canonical:
        "https://watchfullmovie.netlify.app/actors",
    },
  };
}


/*
 * ---------------------------------------------------------
 * PAGE
 * ---------------------------------------------------------
 */

export default async function ActorsPage() {
  let initialPeople = [];
  let totalPages = 1;

  try {
    const data = await getPopularPeople(1);

    /*
     * getPopularPeople() dari api.js
     * mengembalikan ARRAY.
     */

    if (Array.isArray(data)) {
      initialPeople = data;
    }

    /*
     * Support jika suatu saat API helper
     * dikembalikan dalam format object.
     */

    else if (Array.isArray(data?.results)) {
      initialPeople = data.results;

      totalPages =
        Number(data.total_pages) || 1;
    }
  } catch (error) {
    console.error(
      "Error fetching popular people:",
      error
    );
  }


  /*
   * Jika TMDB gagal / kosong.
   */

  if (
    !Array.isArray(initialPeople) ||
    initialPeople.length === 0
  ) {
    initialPeople = FALLBACK_PEOPLE;
  }


  return (
    <ActorsClient
      initialPeople={initialPeople}
      totalPages={totalPages}
    />
  );
}