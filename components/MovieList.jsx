import MediaCard from "./MediaCard";
import NativeAd from "./ads/NativeAd";

export default function MovieList({ movies }) {
  if (!Array.isArray(movies) || movies.length === 0) {
    return <p className="text-center text-gray-400">No Movies Found.</p>;
  }

  // ✅ FILTER: hanya item dengan id, title, dan (poster atau overview)
  const validMovies = movies.filter(
    (item) =>
      item?.id &&
      item?.title &&
      (item.poster_path || item.overview)
  );

  if (validMovies.length === 0) {
    return <p className="text-center text-gray-400">No valid movies to display.</p>;
  }

  const firstSix = validMovies.slice(0, 6);
  const remainingMovies = validMovies.slice(6);

  return (
    <>
      {/* First 6 Movies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {firstSix.map((item) => (
          <MediaCard key={item.id} mediaItem={item} />
        ))}
      </div>

      {/* Native Ad */}
      {remainingMovies.length > 0 && (
        <div className="w-full flex justify-center my-8">
          <NativeAd />
        </div>
      )}

      {/* Remaining Movies */}
      {remainingMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {remainingMovies.map((item) => (
            <MediaCard key={item.id} mediaItem={item} />
          ))}
        </div>
      )}
    </>
  );
}