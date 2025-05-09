import { useEffect, useState } from "react";
import {
  fetchWeatherHistory,
  deleteWeatherHistoryItem,
  updateWeatherHistoryItem,
} from "../api/weatherApi.jsx";

const useWeatherHistory = () => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await fetchWeatherHistory();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
    setLoadingHistory(false);
  };

  const deleteHistoryItem = async (id) => {
    try {
      await deleteWeatherHistoryItem(id);
      await fetchHistory();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateHistoryItem = async (id, newCity) => {
    try {
      await updateWeatherHistoryItem(id, newCity);
      await fetchHistory();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    setHistory,
    fetchHistory,
    deleteHistoryItem,
    updateHistoryItem,
    loadingHistory,
  };
};

export default useWeatherHistory;
