import React from "react";
import formatDate from "../../utils/formatDate.jsx";
import { FaClock, FaTrash, FaEdit } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { toast } from "react-toastify";

const getSuggestionIcon = (city) => {
  const icons = ["☀️", "🌧️", "⛈️", "❄️", "🌫️", "☁️"];
  return icons[city.charCodeAt(0) % icons.length];
};

const HistoryItem = ({
  item,
  onClick,
  isFavorite,
  toggleFavorite,
  editingItem,
  setEditingItem,
  updatedCity,
  setUpdatedCity,
  onDelete,
  onUpdate,
}) => {
  const handleCancel = (e) => {
    e.stopPropagation(); // prevent triggering parent click
    setEditingItem(null);
    setUpdatedCity("");
    toast.info("Edit canceled");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 py-3 bg-gradient-to-br from-blue-100/90 via-white/90 to-purple-100/90 border border-blue-200 rounded-2xl shadow hover:bg-purple-100/80 transition-all cursor-pointer border-transparent hover:border-purple-400 group min-h-[56px] w-full">
      <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
        <span className="text-2xl sm:text-3xl select-none flex-shrink-0">
          {getSuggestionIcon(item.city)}
        </span>
        <div className="flex-1 min-w-0" onClick={(e) => {
          if (editingItem !== item._id) onClick(e);
        }}>
          {editingItem === item._id ? (
            <input
              type="text"
              value={updatedCity}
              onChange={(e) => setUpdatedCity(e.target.value)}
              className="bg-gray-800 text-white border border-gray-500 px-3 py-2 rounded w-full text-sm sm:text-base"
              placeholder="Update city name"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="block font-semibold text-base sm:text-lg text-gray-800 break-words group-hover:text-purple-700">
                {item.city} <span className="text-xs sm:text-base font-normal">- {item.temperature}°C</span>
              </span>
              <span className="text-xs sm:text-sm text-gray-500 break-words">
                {item.description}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-between">
        <div className="flex items-center text-gray-400 text-xs sm:text-sm gap-1">
          <FaClock className="mr-1" />
          <span>{formatDate(item.timestamp)}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <button
            title="Toggle Favorite"
            onClick={toggleFavorite}
            className="text-yellow-400 text-lg sm:text-xl hover:text-yellow-600 hover:cursor-pointer"
          >
            {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
          </button>
          {editingItem === item._id ? (
            <>
              <button
                title="Save Changes"
                onClick={() => {
                  onUpdate(item._id);
                }}
                className="text-green-500 hover:text-green-300 text-sm font-medium hover:cursor-pointer"
              >
                Save
              </button>
              <button
                title="Cancel Edit"
                onClick={handleCancel}
                className="text-red-400 hover:text-red-600 text-sm font-medium hover:cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              title="Edit City"
              onClick={() => {
                setEditingItem(item._id);
                setUpdatedCity(item.city);
              }}
              className="text-yellow-500 hover:text-yellow-600 text-lg sm:text-xl hover:cursor-pointer"
            >
              <FaEdit />
            </button>
          )}
          <button
            title="Delete City"
            onClick={() => onDelete(item._id)}
            className="text-red-500 hover:text-red-700 text-lg sm:text-xl hover:cursor-pointer"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;