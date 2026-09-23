//app/components/watch/WhereToWatch.jsx

"use client";

import { ExternalLink, Tv } from "lucide-react";
import ProviderButton from "./ProviderButton";

const FREE_PROVIDER_PRIORITY = [
  "Tubi",
  "Pluto TV",
  "Plex",
  "Amazon Freevee",
  "Freevee",
  "The Roku Channel",
  "Roku Channel",
  "Crackle",
  "Xumo Play",
  "Kanopy",
  "Hoopla",
];

const GROUP_ORDER = [
  {
    key: "free",
    title: "Free",
    description: "Watch free legally",
    className: "free",
  },
  {
    key: "ads",
    title: "Free with Ads",
    description: "Free legal streaming with ads",
    className: "ads",
  },
  {
    key: "flatrate",
    title: "Subscription",
    description: "Available with a streaming subscription",
    className: "subscription",
  },
  {
    key: "rent",
    title: "Rent",
    description: "Available to rent",
    className: "rent",
  },
  {
    key: "buy",
    title: "Buy",
    description: "Available to purchase",
    className: "buy",
  },
];

function getProviderName(provider) {
  return (
    provider?.provider_name ||
    provider?.providerName ||
    provider?.name ||
    ""
  ).trim();
}

function sortFreeProviders(providers = []) {
  return [...providers].sort((a, b) => {
    const aName = getProviderName(a);
    const bName = getProviderName(b);

    const aIndex = FREE_PROVIDER_PRIORITY.findIndex(
      (name) => name.toLowerCase() === aName.toLowerCase()
    );

    const bIndex = FREE_PROVIDER_PRIORITY.findIndex(
      (name) => name.toLowerCase() === bName.toLowerCase()
    );

    const normalizedA = aIndex === -1 ? 999 : aIndex;
    const normalizedB = bIndex === -1 ? 999 : bIndex;

    if (normalizedA !== normalizedB) {
      return normalizedA - normalizedB;
    }

    return aName.localeCompare(bName);
  });
}

function sortProviders(providers = [], prioritizeFree = false) {
  if (!prioritizeFree) {
    return [...providers].sort((a, b) =>
      getProviderName(a).localeCompare(getProviderName(b))
    );
  }

  return sortFreeProviders(providers);
}

function ProviderGroup({
  title,
  description,
  providers,
  watchLink,
  isFree = false,
  className = "",
}) {
  if (!providers?.length) {
    return null;
  }

  const sortedProviders = sortProviders(providers, isFree);

  return (
    <section
      className={`space-y-3 ${className}`}
      aria-labelledby={`watch-group-${title
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h3
            id={`watch-group-${title
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="text-sm font-bold text-white"
          >
            {title}
          </h3>

          {isFree && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              Legal Free
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProviders.map((provider) => (
          <ProviderButton
            key={`${getProviderName(provider)}-${provider?.provider_id || provider?.providerId || "provider"}`}
            provider={provider}
            watchLink={watchLink}
            isFree={isFree}
          />
        ))}
      </div>
    </section>
  );
}

export default function WhereToWatch({
  watchProviders,
  watchRegion = "US",
  title = "",
}) {
  const region = String(watchRegion || "US").trim().toUpperCase();

  const fallbackLink =
    watchProviders?.link ||
    `https://www.justwatch.com/${region.toLowerCase()}/search?q=${encodeURIComponent(
      title || ""
    )}`;

  const providers = watchProviders || {};

  const freeProviders = providers.free || [];
  const adsProviders = providers.ads || [];
  const subscriptionProviders = providers.flatrate || [];
  const rentProviders = providers.rent || [];
  const buyProviders = providers.buy || [];

  const hasProviders =
    freeProviders.length > 0 ||
    adsProviders.length > 0 ||
    subscriptionProviders.length > 0 ||
    rentProviders.length > 0 ||
    buyProviders.length > 0;

  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
          <Tv size={20} className="text-zinc-300" />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white">
            Where to Watch
          </h2>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Find legal streaming options for this title. Free services are
            shown first whenever they are available in your region.
          </p>

          <div className="mt-2 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
            Region: {region}
          </div>
        </div>
      </div>

      {!hasProviders ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-sm text-zinc-400">
            No streaming availability was found for this title in the{" "}
            <span className="font-medium text-zinc-200">{region}</span>{" "}
            region.
          </p>

          <a
            href={fallbackLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Check Availability
            <ExternalLink size={14} />
          </a>
        </div>
      ) : (
        <div className="space-y-7">
          <ProviderGroup
            title={GROUP_ORDER[0].title}
            description={GROUP_ORDER[0].description}
            providers={freeProviders}
            watchLink={fallbackLink}
            isFree
            className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.035] p-4"
          />

          <ProviderGroup
            title={GROUP_ORDER[1].title}
            description={GROUP_ORDER[1].description}
            providers={adsProviders}
            watchLink={fallbackLink}
            isFree
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
          />

          <ProviderGroup
            title={GROUP_ORDER[2].title}
            description={GROUP_ORDER[2].description}
            providers={subscriptionProviders}
            watchLink={fallbackLink}
          />

          <ProviderGroup
            title={GROUP_ORDER[3].title}
            description={GROUP_ORDER[3].description}
            providers={rentProviders}
            watchLink={fallbackLink}
          />

          <ProviderGroup
            title={GROUP_ORDER[4].title}
            description={GROUP_ORDER[4].description}
            providers={buyProviders}
            watchLink={fallbackLink}
          />
        </div>
      )}

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <p className="text-[11px] leading-5 text-zinc-500">
          Availability and provider information may vary by country and can
          change over time. ScreenNest does not host or provide copyrighted
          video streams. Streaming availability is provided for discovery
          purposes and links may lead to JustWatch or the relevant legal
          service.
        </p>

        <p className="mt-2 text-[11px] text-zinc-600">
          Streaming availability data provided by JustWatch via The Movie
          Database (TMDB).
        </p>
      </div>
    </section>
  );
}