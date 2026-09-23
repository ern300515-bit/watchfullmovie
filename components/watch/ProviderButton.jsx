//app/components/watch/ProviderButton.jsx

"use client";

const TYPE_LABELS = {
  free: "Free",
  ads: "Free with Ads",
  flatrate: "Subscription",
  rent: "Rent",
  buy: "Buy",
};

function getProviderTypeLabel(type) {
  return TYPE_LABELS[type] || "Availability";
}

export default function ProviderButton({
  provider,
  watchLink,
  isFree = false,
}) {
  if (!provider || !watchLink) {
    return null;
  }

  const providerName =
    provider.provider_name ||
    provider.providerName ||
    provider.name ||
    "Streaming provider";

  const providerLogo =
    provider.logo_path ||
    provider.logoPath ||
    provider.logo ||
    null;

  const providerType = provider.type || provider.monetization_type || "";
  const typeLabel = getProviderTypeLabel(providerType);

  return (
    <a
      href={watchLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Check ${providerName} availability`}
      title={`Check ${providerName} availability`}
      className={`group flex min-h-[64px] items-center gap-3 rounded-xl border p-3 transition ${
        isFree
          ? "border-emerald-400/20 bg-zinc-950/60 hover:border-emerald-400/40 hover:bg-zinc-900"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        {providerLogo ? (
          <img
            src={`https://image.tmdb.org/t/p/w92${providerLogo}`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-[10px] font-bold text-zinc-500">
            TV
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white transition group-hover:text-zinc-200">
          {providerName}
        </div>

        <div
          className={`mt-0.5 text-[11px] ${
            isFree ? "text-emerald-300" : "text-zinc-500"
          }`}
        >
          {isFree ? "Legal free option" : typeLabel}
        </div>
      </div>

      <div className="shrink-0 text-[11px] font-medium text-zinc-500 transition group-hover:text-zinc-300">
        Check
      </div>
    </a>
  );
}