//lib/StreamingProviders.js

export const STREAMING_PROVIDERS = {
  /*
   * ============================================================
   * FREE LEGAL STREAMING
   * ============================================================
   */

  tubi: {
    slug: "tubi",
    name: "Tubi",
    providerId: 73,
    icon: "tubi",
    type: "movie",

    category: "free",
    isFree: true,

    // TMDB/JustWatch monetization types
    monetizationTypes: ["free", "ads"],

    title: "Free Movies on Tubi",
    description:
      "Discover movies currently available on Tubi. Browse free legal movies and free-with-ads streaming options available in your region.",
    keywords:
      "Tubi movies, free movies on Tubi, watch free movies legally, Tubi free movies, free streaming movies",

    badge: "Free Legal",
  },

  "pluto-tv": {
    slug: "pluto-tv",
    name: "Pluto TV",
    providerId: 300,
    icon: "plutotv",
    type: "movie",

    category: "free",
    isFree: true,

    monetizationTypes: ["free", "ads"],

    title: "Free Movies on Pluto TV",
    description:
      "Discover movies currently available on Pluto TV. Browse free legal movies and free-with-ads streaming options available in your region.",
    keywords:
      "Pluto TV movies, free movies on Pluto TV, Pluto TV free movies, watch free movies legally, free streaming movies",

    badge: "Free Legal",
  },

  plex: {
    slug: "plex",
    name: "Plex",
    providerId: 538,
    icon: "plex",
    type: "movie",

    category: "free",
    isFree: true,

    monetizationTypes: ["free", "ads"],

    title: "Free Movies on Plex",
    description:
      "Discover movies currently available on Plex. Browse free legal movies and free-with-ads streaming options available in your region.",
    keywords:
      "Plex movies, free movies on Plex, Plex free movies, watch free movies legally, free streaming movies",

    badge: "Free Legal",
  },

  "roku-channel": {
    slug: "roku-channel",
    name: "The Roku Channel",
    providerId: 207,
    icon: "rokuchannel",
    type: "movie",

    category: "free",
    isFree: true,

    monetizationTypes: ["free", "ads"],

    title: "Free Movies on The Roku Channel",
    description:
      "Discover movies currently available on The Roku Channel. Browse free legal movies and free-with-ads streaming options available in your region.",
    keywords:
      "Roku Channel movies, free movies on Roku Channel, Roku free movies, watch free movies legally, free streaming movies",

    badge: "Free Legal",
  },

  freevee: {
    slug: "freevee",
    name: "Freevee",
    providerId: 613,
    icon: "freevee",
    type: "movie",

    category: "free",
    isFree: true,

    monetizationTypes: ["free", "ads"],

    title: "Free Movies on Freevee",
    description:
      "Discover movies currently available on Freevee. Browse free legal movies and free-with-ads streaming options available in your region.",
    keywords:
      "Freevee movies, free movies on Freevee, Freevee free movies, watch free movies legally, free streaming movies",

    badge: "Free Legal",
  },

  crackle: {
    slug: "crackle",
    name: "Crackle",
    providerId: 12,
    icon: "crackle",
    type: "movie",

    category: "free",
    isFree: true,

    monetizationTypes: ["free", "ads"],

    title: "Free Movies on Crackle",
    description:
      "Discover movies currently available on Crackle. Browse free legal movies and free-with-ads streaming options available in your region.",
    keywords:
      "Crackle movies, free movies on Crackle, Crackle free movies, watch free movies legally, free streaming movies",

    badge: "Free Legal",
  },

  "xumo-play": {
    slug: "xumo-play",
    name: "Xumo Play",
    providerId: 1963,
    icon: "xumo",
    type: "movie",

    category: "free",
    isFree: true,

    monetizationTypes: ["free", "ads"],

    title: "Free Movies on Xumo Play",
    description:
      "Discover movies currently available on Xumo Play. Browse free legal movies and free-with-ads streaming options available in your region.",
    keywords:
      "Xumo Play movies, free movies on Xumo Play, Xumo free movies, watch free movies legally, free streaming movies",

    badge: "Free Legal",
  },

  /*
   * ============================================================
   * SUBSCRIPTION STREAMING
   * ============================================================
   */

  netflix: {
    slug: "netflix",
    name: "Netflix",
    providerId: 8,
    icon: "netflix",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Netflix Movies",
    description:
      "Discover movies available on Netflix. Browse popular, highly rated, and trending movies available to stream on Netflix.",
    keywords:
      "Netflix movies, movies on Netflix, Netflix streaming movies, watch Netflix movies",
  },

  "amazon-prime-video": {
    slug: "amazon-prime-video",
    name: "Amazon Prime Video",
    providerId: 119,
    icon: "amazonprime",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Amazon Prime Video Movies",
    description:
      "Discover movies available on Amazon Prime Video. Browse popular and highly rated movies available to stream on Prime Video.",
    keywords:
      "Amazon Prime Video movies, Prime Video movies, movies on Prime Video",
  },

  "disney-plus": {
    slug: "disney-plus",
    name: "Disney Plus",
    providerId: 337,
    icon: "disneyplus",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Disney Plus Movies",
    description:
      "Discover movies available on Disney Plus. Explore popular and highly rated movies available to stream on Disney Plus.",
    keywords:
      "Disney Plus movies, movies on Disney Plus, Disney streaming movies",
  },

  hulu: {
    slug: "hulu",
    name: "Hulu",
    providerId: 15,
    icon: "hulu",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Hulu Movies",
    description:
      "Discover movies available on Hulu. Browse popular and highly rated movies available to stream on Hulu.",
    keywords:
      "Hulu movies, movies on Hulu, Hulu streaming movies",
  },

  max: {
    slug: "max",
    name: "Max",
    providerId: 1899,
    icon: "max",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Max Movies",
    description:
      "Discover movies available on Max. Browse popular, trending, and highly rated movies available to stream on Max.",
    keywords:
      "Max movies, movies on Max, Max streaming movies",
  },

  "apple-tv-plus": {
    slug: "apple-tv-plus",
    name: "Apple TV Plus",
    providerId: 350,
    icon: "appletv",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Apple TV Plus Movies",
    description:
      "Discover movies available on Apple TV Plus. Browse popular and highly rated movies available to stream on Apple TV Plus.",
    keywords:
      "Apple TV Plus movies, Apple TV movies, movies on Apple TV Plus",
  },

  "paramount-plus": {
    slug: "paramount-plus",
    name: "Paramount Plus",
    providerId: 531,
    icon: "paramountplus",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Paramount Plus Movies",
    description:
      "Discover movies available on Paramount Plus. Browse popular and highly rated movies available to stream on Paramount Plus.",
    keywords:
      "Paramount Plus movies, movies on Paramount Plus, Paramount streaming movies",
  },

  peacock: {
    slug: "peacock",
    name: "Peacock",
    providerId: 386,
    icon: "peacock",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Peacock Movies",
    description:
      "Discover movies available on Peacock. Browse popular and highly rated movies available to stream on Peacock.",
    keywords:
      "Peacock movies, movies on Peacock, Peacock streaming movies",
  },

  crunchyroll: {
    slug: "crunchyroll",
    name: "Crunchyroll",
    providerId: 283,
    icon: "crunchyroll",
    type: "movie",

    category: "subscription",
    isFree: false,

    monetizationTypes: ["flatrate"],

    title: "Crunchyroll Movies",
    description:
      "Discover movies available on Crunchyroll. Explore anime movies available to stream on Crunchyroll.",
    keywords:
      "Crunchyroll movies, anime movies on Crunchyroll, Crunchyroll streaming",
  },

  /*
   * ============================================================
   * OTHER / DIGITAL PLATFORM
   * ============================================================
   */

  youtube: {
    slug: "youtube",
    name: "YouTube",
    providerId: 192,
    icon: "youtube",
    type: "movie",

    category: "other",
    isFree: false,

    monetizationTypes: ["flatrate", "rent", "buy"],

    title: "YouTube Movies",
    description:
      "Discover movies available on YouTube. Browse movies available for streaming, rental, or purchase on YouTube.",
    keywords:
      "YouTube movies, movies on YouTube, YouTube streaming movies",
  },
};

export const STREAMING_PROVIDER_SLUGS =
  Object.keys(STREAMING_PROVIDERS);

export function getStreamingProvider(slug) {
  return STREAMING_PROVIDERS[slug] || null;
}

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

/**
 * Get all free legal streaming providers.
 */
export function getFreeStreamingProviders() {
  return Object.values(STREAMING_PROVIDERS).filter(
    (provider) => provider.isFree === true
  );
}

/**
 * Get all subscription providers.
 */
export function getSubscriptionStreamingProviders() {
  return Object.values(STREAMING_PROVIDERS).filter(
    (provider) => provider.category === "subscription"
  );
}

/**
 * Get providers grouped by category.
 */
export function getStreamingProvidersByCategory() {
  return {
    free: getFreeStreamingProviders(),
    subscription: getSubscriptionStreamingProviders(),
    other: Object.values(STREAMING_PROVIDERS).filter(
      (provider) => provider.category === "other"
    ),
  };
}