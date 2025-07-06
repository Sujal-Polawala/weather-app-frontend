import { React, useState, useEffect, useRef } from "react";
import { fetchWeather, saveWeatherHistory } from "../api/weatherApi.jsx";
import { getCitySuggestions } from "../api/locationApi.jsx";
import { FaSearch, FaMapMarkerAlt, FaMicrophone } from "react-icons/fa";
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
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim().length > 1) {
        getCitySuggestions(city).then(setSuggestions).catch(console.error);
        console.log(city);
      } else {
        setSuggestions([]);
      }
    }, 300);

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

      const newEntry = {
        city: data.city,
        temperature: data.temperature,
        description: data.description,
        timestamp: new Date().toISOString(),
      };

      const existingIndex = history.findIndex(
        (entry) => entry.city.toLowerCase() === newEntry.city.toLowerCase()
      );

      if (existingIndex !== -1) {
        const updatedHistory = [...history];
        updatedHistory[existingIndex] = newEntry;
        setHistory(updatedHistory);
      } else {
        setHistory((prev) => [...prev, newEntry]);
      }

      await saveWeatherHistory(newEntry);
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
    <div className="w-full max-w-4xl mx-auto">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl"
      >
        {/* Search Input Container */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
            <FaMapMarkerAlt size={20} />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            className="w-full bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white text-xl p-4 pl-12 pr-20 rounded-2xl placeholder-white/60 outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <VoiceSearchButton onResult={(spokenCity) => setCity(spokenCity)} />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 backdrop-blur-lg border border-white/30 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex items-center justify-center gap-3"
        >
          <FaSearch size={18} />
          Search Weather
        </button>

        {/* Suggestions Dropdown */}
        {isFocused && (suggestions.length > 0 || history.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-4 z-50 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
            {suggestions.map((sugg, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(sugg)}
                className="px-6 py-4 hover:bg-white/20 hover:text-white cursor-pointer text-white border-b border-white/10 last:border-b-0 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-white/60" size={16} />
                  <div>
                    <span className="block font-semibold text-lg">
                      {sugg.split(",")[0]}
                    </span>
                    <span className="text-sm text-white/70">
                      {sugg.split(",").slice(1).join(",")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {city.trim().length > 1 && history.length > 0 && (
              <div className="bg-white/10 px-6 py-3 text-sm text-white/80 font-semibold border-t border-white/10">
                🔍 Recently Searched
              </div>
            )}
            
            {history.map((item, idx) => (
              <div
                key={`h-${idx}`}
                onClick={() => handleSuggestionClick(item.city)}
                className="px-6 py-3 hover:bg-white/20 cursor-pointer text-white border-b border-white/10 last:border-b-0 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-white/60" size={14} />
                  <span className="font-medium">{item.city}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default WeatherForm;
