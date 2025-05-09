import React from "react";

const FavoriteCities = ({ favorites, onClick, onRemove }) => {
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
              className="flex justify-between items-center bg-white/10 p-2 rounded hover:bg-white/20 transition-all cursor-pointer"
            >
              <div onClick={() => onClick(fav)}>
                <p className="text-lg font-semibold">{fav.city}</p>
                <p className="text-sm text-gray-600">{fav.description} - {fav.temperature}°C</p>
              </div>
              <button
                onClick={() => onRemove(fav.city)}
                className="text-red-400 hover:text-red-600 text-sm hover:cursor-pointer"
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
