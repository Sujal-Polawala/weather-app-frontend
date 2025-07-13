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
              className="flex items-center gap-4 px-4 py-3 bg-gradient-to-br from-blue-100/90 via-white/90 to-purple-100/90 border border-blue-200 rounded-2xl shadow hover:bg-blue-200/80 transition-all cursor-pointer border-transparent hover:border-blue-400 group"
              style={{ minHeight: 56 }}
            >
              <span className="text-2xl select-none">
                {getSuggestionIcon(fav.city)}
              </span>
              <div className="flex-1 min-w-0" onClick={() => onClick(fav)}>
                <span className="block font-semibold text-base text-gray-800 truncate group-hover:text-blue-700">
                  {fav.city}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {fav.description} - {fav.temperature}°C
                </span>
              </div>
              <button
                onClick={() => onRemove(fav.city)}
                className="text-red-400 hover:text-red-600 text-sm hover:cursor-pointer ml-auto"
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
