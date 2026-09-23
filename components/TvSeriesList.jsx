import MediaCard from "./MediaCard";
import NativeAd from "./ads/NativeAd";

export default function TvSeriesList({ series }) {
  if (!Array.isArray(series) || series.length === 0) {
    return <p className="text-center text-gray-400">No TV Series Found.</p>;
  }

  // ✅ FILTER: hanya item dengan id, name, dan (poster atau overview)
  const validSeries = series.filter(
    (item) =>
      item?.id &&
      item?.name &&
      (item.poster_path || item.overview)
  );

  if (validSeries.length === 0) {
    return <p className="text-center text-gray-400">No valid TV series to display.</p>;
  }

  const firstSix = validSeries.slice(0, 6);
  const remainingSeries = validSeries.slice(6);

  return (
    <>
      {/* First 6 TV Series */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {firstSix.map((item) => (
          <MediaCard key={item.id} mediaItem={item} />
        ))}
      </div>

      {/* Native Ad */}
      {remainingSeries.length > 0 && (
        <div className="w-full flex justify-center my-8">
          <NativeAd />
        </div>
      )}

      {/* Remaining TV Series */}
      {remainingSeries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {remainingSeries.map((item) => (
            <MediaCard key={item.id} mediaItem={item} />
          ))}
        </div>
      )}
    </>
  );
}