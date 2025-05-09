import React, { useState, useEffect } from "react";
import FavoriteCities from "./FavoriteCities";
import HistoryItem from "./HistoryItem";
import {
  deleteWeatherHistoryItem,
  updateWeatherHistoryItem,
} from "../../api/weatherApi.jsx";
import { toast } from "react-toastify";
import ConfirmModel from "../../Confirmation/ConfirmationModel.jsx";

const History = ({ history, setHistory, fetchHistory, onHistoryItemClick, setWeather }) => {
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
      toast.info(`${item.city} removed from favorites`);
    } else {
      updated = [...favorites, item];
      toast.success(`${item.city} added to favorites`);
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
      // 🔁 Clear selected weather if it was the deleted item
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
      <div className="mt-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg text-white w-full">
        <FavoriteCities
          favorites={favorites}
          onClick={onHistoryItemClick}
          onRemove={removeFavorite}
        />

        <h2 className="lg:text-3xl font-bold mb-4 text-lg">
          🔍 Search History
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-400">No search history yet.</p>
        ) : (
          <>
            {visibleHistory.map((item, index) => (
              <HistoryItem
                key={item._id || index}
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
            ))}

            {history.length > 5 && (
              <button
                className="mt-4 w-full text-center text-blue-400 hover:underline hover:cursor-pointer"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "View Less" : "View More"}
              </button>
            )}
          </>
        )}
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
