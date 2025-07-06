import React, { useState, useEffect } from "react";
import FavoriteCities from "./FavoriteCities";
import HistoryItem from "./HistoryItem";
import {
  deleteWeatherHistoryItem,
  updateWeatherHistoryItem,
} from "../../api/weatherApi.jsx";
import { toast } from "react-toastify";
import ConfirmModel from "../../Confirmation/ConfirmationModel.jsx";
import { FaHistory, FaHeart, FaTrash, FaEdit } from "react-icons/fa";

const History = ({
  history,
  setHistory,
  fetchHistory,
  onHistoryItemClick,
  setWeather,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [updatedCity, setUpdatedCity] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const visibleHistory = showAll ? history : history.slice(0, 5);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const saveFavorites = (updatedFavorites) => {
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const toggleFavorite = (item) => {
    const exists = favorites.find((fav) => fav.city === item.city);
    let updated;

    if (exists) {
      updated = favorites.filter((fav) => fav.city !== item.city);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-red-500/90 to-pink-500/90 backdrop-blur-xl text-white max-w-xs w-full rounded-2xl shadow-2xl p-4 mx-auto border border-red-400/30`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">
              ❤️ {item.city} removed from favorites
            </p>
            <button onClick={() => toast.dismiss(t.id)} className="text-white/80 hover:text-white">
              ✖
            </button>
          </div>
        </div>
      ));
    } else {
      updated = [...favorites, item];
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-xl text-white max-w-xs w-full rounded-2xl shadow-2xl p-4 mx-auto border border-green-400/30`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">
              💖 {item.city} added to favorites
            </p>
            <button onClick={() => toast.dismiss(t.id)} className="text-white/80 hover:text-white">
              ✖
            </button>
          </div>
        </div>
      ));
    }

    saveFavorites(updated);
  };

  const isFavorite = (cityName) =>
    favorites.some((fav) => fav.city === cityName);

  const removeFavorite = (cityName) => {
    const updated = favorites.filter((fav) => fav.city !== cityName);
    saveFavorites(updated);
    toast.info(`${cityName} removed from favorites`);
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    try {
      await deleteWeatherHistoryItem(itemToDelete._id);
      toast.success(`"${itemToDelete.city}" removed from history`);
      if (itemToDelete.city) {
        setWeather(null);
      }
      fetchHistory();
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Failed to delete the history item");
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateWeatherHistoryItem(id, updatedCity);
      toast.success(`City updated to "${updatedCity}"`);
      setEditingItem(null);
      setUpdatedCity("");
      fetchHistory();
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Failed to update city");
    }
  };

  return (
    <>
      <div className="text-white">
        {/* Favorites Section */}
        <div className="mb-8">
          <FavoriteCities
            favorites={favorites}
            onClick={onHistoryItemClick}
            onRemove={removeFavorite}
          />
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <FaHistory className="text-2xl text-white/80" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Search History
            </h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
                <p className="text-white/60 text-lg">No search history yet.</p>
                <p className="text-white/40 text-sm mt-2">Start searching for weather to see your history here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleHistory.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
                >
                  <HistoryItem
                    item={item}
                    onClick={() => onHistoryItemClick(item)}
                    isFavorite={isFavorite(item.city)}
                    toggleFavorite={() => toggleFavorite(item)}
                    editingItem={editingItem}
                    setEditingItem={setEditingItem}
                    updatedCity={updatedCity}
                    setUpdatedCity={setUpdatedCity}
                    onDelete={() => confirmDelete(item)}
                    onUpdate={handleUpdate}
                  />
                </div>
              ))}

              {history.length > 5 && (
                <div className="text-center pt-4">
                  <button
                    className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 backdrop-blur-lg border border-white/30 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:cursor-pointer"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "View Less" : "View More"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModel
        show={showModal}
        title="Delete Confirmation"
        message={`Are you sure you want to delete "${itemToDelete?.city}" from your history?`}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
};

export default History;
