import { React, useState, useEffect, useRef } from "react";
import { fetchWeather, saveWeatherHistory } from "../api/weatherApi.jsx";
import { getCitySuggestions } from "../api/locationApi.jsx";
import { FaSearch } from "react-icons/fa";
import VoiceSearchButton from "./VoiceSearchButton.jsx";
import toast from "react-hot-toast";

const WeatherForm = ({
  setWeather,
  setHistory,
  fetchHistory,
  setError,
  setLoading,
  history,
}) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const formRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim().length > 1) {
        getCitySuggestions(city).then(setSuggestions).catch(console.error);
        console.log(city);
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [city]);

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (city.trim() === "") {
      toast.error("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      const rawData = await fetchWeather(city);
      if (!rawData || !rawData.city) {
        setError("City not found. Please try again.");
        setWeather(null);
        return;
      }

      const data = {
        city: rawData.city,
        country: rawData.country,
        temperature: rawData.temperature,
        feels_like: rawData.feels_like,
        temp_min: rawData.temp_min,
        temp_max: rawData.temp_max,
        description: rawData.description,
        wind_speed: rawData.wind_speed,
        wind_deg: rawData.wind_deg,
        humidity: rawData.humidity,
        sunrise: rawData.sunrise,
        sunset: rawData.sunset,
      };

      setWeather(data);
      setError(null);

      // Prepare the new history entry
      const newEntry = {
        city: data.city,
        temperature: data.temperature,
        description: data.description,
        timestamp: new Date().toISOString(),
      };

      // Check for existing city in history
      const existingIndex = history.findIndex(
        (entry) => entry.city.toLowerCase() === newEntry.city.toLowerCase()
      );

      if (existingIndex !== -1) {
        // Update existing entry in the frontend
        const updatedHistory = [...history];
        updatedHistory[existingIndex] = newEntry;
        setHistory(updatedHistory);
      } else {
        // Add new entry to history
        setHistory((prev) => [...prev, newEntry]);
      }

      // Save or update in DB
      await saveWeatherHistory(newEntry); // Make sure your backend handles update if city exists

      // Re-fetch latest history from DB
      await fetchHistory();
    } catch (error) {
      setError("City Not Found");
      setWeather(null);
    }

    setCity("");
    setSuggestions([]);
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsFocused(false);
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="weather-form-container relative flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl transition-all z-10"
    >
      <div className="w-full relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full bg-transparent border-b-2 border-white/40 text-white text-lg p-3 rounded-xl placeholder-white outline-none focus:border-white"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 md:scale-135 scale-120">
          <VoiceSearchButton onResult={(spokenCity) => setCity(spokenCity)} />
        </div>
        {isFocused && (suggestions.length > 0 || history.length > 0) && (
          <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {suggestions.map((sugg, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(sugg)}
                className="px-4 py-3 hover:bg-blue-100 hover:text-blue-800 cursor-pointer text-base border-b border-gray-100 last:border-b-0 transition"
              >
                <span className="block font-semibold">
                  {sugg.split(",")[0]}
                </span>
                <span className="text-sm text-gray-500">
                  {sugg.split(",")[1]}
                </span>
              </div>
            ))}
            {city.trim().length > 1 && history.length > 0 && (
              <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 font-semibold border-t">
                Recently Searched
              </div>
            )}
            {history.map((item, idx) => (
              <div
                key={`h-${idx}`}
                onClick={() => handleSuggestionClick(item.city)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
              >
                {item.city}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        title="Search"
        className="px-6 py-3 flex items-center justify-center bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:cursor-pointer"
      >
        <FaSearch className="inline mr-2" />
        Search
      </button>
    </form>
  );
};

export default WeatherForm;
