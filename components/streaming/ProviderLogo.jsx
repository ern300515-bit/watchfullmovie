//components/streaming/ProviderLogo.jsx

import {
  siNetflix,
  siAppletv,
  siParamountplus,
  siMax,
  siCrunchyroll,
  siYoutube,
} from "simple-icons";

const ICONS = {
  netflix: siNetflix,
  "apple-tv-plus": siAppletv,
  "paramount-plus": siParamountplus,
  max: siMax,
  crunchyroll: siCrunchyroll,
  youtube: siYoutube,
};

const FALLBACKS = {
  "amazon-prime-video": {
    short: "P",
    label: "prime video",
  },
  "disney-plus": {
    short: "D+",
    label: "Disney+",
  },
  hulu: {
    short: "h",
    label: "hulu",
  },
  peacock: {
    short: "P",
    label: "peacock",
  },
  tubi: {
    short: "T",
    label: "Tubi",
  },
  "pluto-tv": {
    short: "P",
    label: "Pluto TV",
  },
  plex: {
    short: "P",
    label: "Plex",
  },
  "roku-channel": {
    short: "R",
    label: "Roku Channel",
  },
  freevee: {
    short: "F",
    label: "Freevee",
  },
  crackle: {
    short: "C",
    label: "Crackle",
  },
  "xumo-play": {
    short: "X",
    label: "Xumo Play",
  },
};

function getLogoUrl(logoPath) {
  if (!logoPath) {
    return null;
  }

  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    return logoPath;
  }

  return `https://image.tmdb.org/t/p/w92${logoPath}`;
}

export default function ProviderLogo({
  provider,
  slug: slugProp,
  size = 52,
}) {
  /*
   * Support both:
   *
   * <ProviderLogo slug="netflix" />
   *
   * and:
   *
   * <ProviderLogo provider={provider} />
   */

  const slug =
    provider?.slug ||
    provider?.provider_slug ||
    slugProp ||
    null;

  const providerName =
    provider?.name ||
    provider?.provider_name ||
    provider?.providerName ||
    null;

  const logoPath =
    provider?.logo_path ||
    provider?.logoPath ||
    provider?.logo ||
    null;

  const logoUrl = getLogoUrl(logoPath);

  /*
   * ============================================================
   * 1. TMDB PROVIDER LOGO
   * ============================================================
   *
   * This is preferred for providers such as:
   *
   * Tubi
   * Pluto TV
   * Plex
   * Roku Channel
   * Freevee
   * Crackle
   * Xumo Play
   */

  if (logoUrl) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white shadow-inner"
        style={{
          width: size,
          height: size,
        }}
        aria-label={providerName || slug || "Streaming provider"}
      >
        <img
          src={logoUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  /*
   * ============================================================
   * 2. SIMPLE ICONS
   * ============================================================
   */

  const icon = slug ? ICONS[slug] : null;

  if (icon) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-inner"
        style={{
          width: size,
          height: size,
        }}
        aria-label={providerName || icon.title}
      >
        <svg
          role="img"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={size * 0.52}
          height={size * 0.52}
          fill="currentColor"
        >
          <path d={icon.path} />
        </svg>
      </div>
    );
  }

  /*
   * ============================================================
   * 3. TEXT FALLBACK
   * ============================================================
   */

  const fallback =
    (slug && FALLBACKS[slug]) ||
    {
      short:
        providerName?.trim()?.charAt(0)?.toUpperCase() || "?",
      label: providerName || "Streaming",
    };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
      style={{
        width: size,
        height: size,
      }}
      aria-label={fallback.label}
    >
      <span className="text-sm font-black leading-none">
        {fallback.short}
      </span>

      <span className="mt-1 max-w-[90%] truncate text-[7px] font-semibold uppercase tracking-tight opacity-60">
        {fallback.label}
      </span>
    </div>
  );
}