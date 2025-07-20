import React from "react";

const FavoriteCities = ({ favorites, onClick, onRemove }) => {
  const getSuggestionIcon = (city) => {
    const icons = ["☀️", "🌧️", "⛈️", "❄️", "🌫️", "☁️"];
    return icons[city.charCodeAt(0) % icons.length];
  };

  return (
    <div className="mb-6">
      <h2 className="lg:text-2xl text-xl font-semibold mb-3">⭐ Favorite Cities</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600">No favorites yet.</p>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav, idx) => (
            <div
              key={fav.city + idx}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-3 py-3 bg-gradient-to-br from-blue-100/90 via-white/90 to-purple-100/90 border border-blue-200 rounded-2xl shadow hover:bg-blue-200/80 transition-all cursor-pointer border-transparent hover:border-blue-400 group min-h-[56px] w-full"
            >
              <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
                <span className="text-2xl sm:text-3xl select-none flex-shrink-0">
                  {getSuggestionIcon(fav.city)}
                </span>
                <div className="flex-1 min-w-0" onClick={() => {
                  onClick(fav);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  <span className="block font-semibold text-base sm:text-lg text-gray-800 break-words group-hover:text-blue-700">
                    {fav.city}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 break-words">
                    {fav.description} - {fav.temperature}°C
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemove(fav.city)}
                className="text-red-400 hover:text-red-600 text-sm sm:text-base hover:cursor-pointer ml-auto"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteCities;
