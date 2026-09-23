// app/actor/[slug]/page.jsx

import { notFound } from "next/navigation";

import {
  getPersonById,
} from "../../../lib/api";

import ActorClient from "./ActorClient";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

/*
 * ---------------------------------------------------------
 * ACTOR SLUG
 * ---------------------------------------------------------
 */

const createActorSlug = (
  name,
  id
) => {
  const slugName = String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      "");

  return `${slugName || "unknown-actor"}-${id}`;
};

/*
 * ---------------------------------------------------------
 * STATIC PARAMS
 * ---------------------------------------------------------
 */

export async function generateStaticParams() {
  try {
    const API_KEY =
      process.env.TMDB_API_KEY;

    const ACCESS_TOKEN =
      process.env.TMDB_ACCESS_TOKEN;

    const API_URL =
      process.env.NEXT_PUBLIC_TMDB_API_URL ||
      "https://api.themoviedb.org/3";

    const url =
      new URL(
        `${API_URL}/person/popular`
      );

    url.searchParams.set(
      "page",
      "1"
    );

    if (
      !ACCESS_TOKEN &&
      API_KEY
    ) {
      url.searchParams.set(
        "api_key",
        API_KEY
      );
    }

    const response =
      await fetch(
        url.toString(),
        {
          headers: {
            Accept:
              "application/json",

            ...(ACCESS_TOKEN
              ? {
                  Authorization:
                    `Bearer ${ACCESS_TOKEN}`,
                }
              : {}),
          },

          next: {
            revalidate: 86400,
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status}`
      );
    }

    const data =
      await response.json();

    return (
      Array.isArray(
        data?.results
      )
        ? data.results
        : []
    )
      .slice(0, 10)
      .map(
        (person) => ({
          slug:
            createActorSlug(
              person.name,
              person.id
            ),
        })
      );
  } catch (error) {
    console.error(
      "❌ generateStaticParams actor failed:",
      error?.message ||
        error
    );

    return [
      {
        slug: "tom-hanks-500",
      },
      {
        slug:
          "leonardo-dicaprio-6193",
      },
      {
        slug: "brad-pitt-287",
      },
      {
        slug:
          "meryl-streep-5064",
      },
      {
        slug:
          "robert-de-niro-380",
      },
    ];
  }
}

/*
 * ---------------------------------------------------------
 * METADATA
 * ---------------------------------------------------------
 */

export async function generateMetadata({
  params,
}) {
  const { slug } =
    await params;

  const id =
    slug
      .split("-")
      .pop();

  try {
    const person =
      await getPersonById(id);

    if (!person) {
      return {
        title:
          "Actor Not Found - WatchFullMovie",
        robots: {
          index: false,
        },
      };
    }

    const name =
      person.name ||
      "Unknown Actor";

    const description =
      person.biography
        ?.slice(0, 160) ||
      `Learn about ${name}, their filmography, biography, and more.`;

    const imageUrl =
      person.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : "https://live.staticflickr.com/65535/55544457962_50bb420cd5_b.jpg";

    const canonical =
      `https://watchfullmovie.netlify.app/actor/${slug}`;

    return {
      title:
        `${name} - Actor, Movies & TV Shows - WatchFullMovie`,

      description,

      robots: {
        index: true,
        follow: true,
      },

      alternates: {
        canonical,
      },

      openGraph: {
        title:
          `${name} - WatchFullMovie`,

        description,

        url: canonical,

        siteName:
          "WatchFullMovie",

        images: [
          {
            url: imageUrl,
            width: 500,
            height: 750,
            alt: name,
          },
        ],

        locale: "en_US",

        type: "profile",
      },

      twitter: {
        card:
          "summary_large_image",

        title:
          `${name} - WatchFullMovie`,

        description,

        images: [
          imageUrl,
        ],
      },
    };
  } catch (error) {
    console.error(
      "Error generating metadata for actor:",
      error
    );

    return {
      title:
        "Actor - WatchFullMovie",

      robots: {
        index: false,
      },
    };
  }
}

/*
 * ---------------------------------------------------------
 * PAGE
 * ---------------------------------------------------------
 */

export default async function ActorPage({
  params,
}) {
  const { slug } =
    await params;

  const id =
    slug
      .split("-")
      .pop();

  let person = null;

  try {
    person =
      await getPersonById(id);
  } catch (error) {
    console.error(
      "Error fetching actor:",
      error
    );
  }

  if (!person) {
    notFound();
  }

  /*
   * JSON-LD
   */

  const jsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "Person",

    name:
      person.name ||
      undefined,

    description:
      person.biography ||
      undefined,

    image:
      person.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : undefined,

    birthDate:
      person.birthday ||
      undefined,

    deathDate:
      person.deathday ||
      undefined,

    birthPlace:
      person.place_of_birth ||
      undefined,

    jobTitle:
      person.known_for_department ||
      undefined,

    url:
      `https://watchfullmovie.netlify.app/actor/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              jsonLd
            ),
        }}
      />

      <ActorClient
        personId={id}
        initialPerson={
          person
        }
      />
    </>
  );
}