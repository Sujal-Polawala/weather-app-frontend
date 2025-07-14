import axios from "axios";
import { API_BASE, API_BASE_URL } from "../config/apiConfig";

export const saveWeatherHistory = async (entry) => {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  
  if (!response.ok) {
    throw new Error("Failed to save weather history.");
  }
  
  return response.json();
};

// Add a new weather history entry
export const fetchWeatherHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`);
  console.log(response.data);
  return response.data;
};

// Delete a weather history entry by ID
export const deleteWeatherHistoryItem = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/history/${id}`);
  } catch (error) {
    console.error("Error deleting history item:", error);
    throw new Error("Failed to delete history item");
  }
};

// Update a weather history entry by ID
export const updateWeatherHistoryItem = async (id, updatedCity) => {
  try {
    // Update the city name in the database
    const response = await axios.put(`${API_BASE_URL}/history/${id}`, { city: updatedCity });
    
    return response.data;
  } catch (error) {
    console.error("Error updating history item:", error);
    throw new Error("Failed to update history item");
  }
};  

export const getClothingSuggestion = async (temp, desc) => {
  try {
    const res = await axios.post(`${API_BASE}/suggest`, {
      temp,
      desc,
    });
    return res.data.suggestion;
  } catch (err) {
    console.error("AI Suggestion Error:", err);
    return "Unable to get suggestion.";
  }
};

// Fetch weather data for a given city
export const fetchWeather = async (city) => {
  try {
    console.log("API CALL:", `${API_BASE_URL}/${city}`);
    const response = await axios.get(`${API_BASE_URL}/${city}`);
    console.log("API RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.error("API ERROR:", error);
    if (error.response && error.response.status === 404) {
      throw new Error("City not found");
    }
    throw new Error("Failed to fetch weather data");
  }
};