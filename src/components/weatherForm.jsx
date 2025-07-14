import { React, useState, useEffect, useRef } from "react";
import { fetchWeather, saveWeatherHistory } from "../api/weatherApi.jsx";
import { getCitySuggestions } from "../api/locationApi.jsx";
import { FaSearch, FaMapMarkerAlt, FaMicrophone } from "react-icons/fa";
import { HiOutlineSearch, HiOutlineMicrophone } from "react-icons/hi";
import VoiceSearchButton from "./VoiceSearchButton.jsx";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

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
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [city]);

  const handleSuggestionClick = (suggestion) => {
    // Extract city and country
    const [cityName, country] = suggestion.split(',').map(s => s.trim());
    const selectedCity = country ? `${cityName},${country}` : cityName;
    console.log("Dropdown clicked:", selectedCity);
    setCity(selectedCity);
    setSuggestions([]);
    handleSubmit({ preventDefault: () => {} }, selectedCity);
  };

  const handleSubmit = async (e, overrideCity) => {
    e.preventDefault();

    const cityToFetch = overrideCity !== undefined ? overrideCity : city;
    if (cityToFetch.trim() === "") {
      toast.error("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching weather for:", cityToFetch);
      const rawData = await fetchWeather(cityToFetch);
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

      setWeather({ ...data, fromHistory: overrideCity !== undefined });
      setError(null);

      const newEntry = {
        city: data.city,
        country: data.country,
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

  // Helper to get a weather icon (simulate for suggestions)
  const getSuggestionIcon = (city) => {
    // For demo, randomize or use first letter
    const icons = ["☀️", "🌧️", "⛈️", "❄️", "🌫️", "☁️"];
    return icons[city.charCodeAt(0) % icons.length];
  };

  // Portal component for suggestions dropdown
  const SuggestionsDropdown = ({ anchorRef, children, visible }) => {
    const [style, setStyle] = useState({});

    useEffect(() => {
      if (anchorRef.current && visible) {
        const rect = anchorRef.current.getBoundingClientRect();
        setStyle({
          position: "absolute",
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 9999,
        });
      }
    }, [anchorRef, visible]);

    if (!visible) return null;
    return createPortal(
      <div style={style} className="z-[9999]">
        {children}
      </div>,
      document.body
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 p-4 sm:p-8 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl w-full"
      >
        {/* Search Input Container */}
        <div className="w-full relative mb-6 flex flex-row items-center gap-2">
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
          {/* On small screens, show search icon button before voice icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-row gap-2 items-center">
            <button
              type="submit"
              className="flex sm:hidden items-center justify-center rounded-full p-2 shadow-lg border border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-400/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gradient-to-br from-blue-400 via-purple-400 to-cyan-400"
              tabIndex={-1}
              style={{ boxShadow: '0 4px 16px 0 rgba(80, 80, 200, 0.15)' }}
            >
              <HiOutlineSearch size={26} className="text-white drop-shadow" />
            </button>
            <VoiceSearchButton onResult={(spokenCity) => setCity(spokenCity)} icon={<HiOutlineMicrophone className="text-purple-600 text-xl" />} />
          </div>
        </div>
        {/* Search Button */}
        <button
          type="submit"
          className="hidden sm:flex w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 backdrop-blur-lg border border-white/30 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 items-center justify-center gap-3 hover:cursor-pointer"
        >
          <HiOutlineSearch size={22} className="text-white drop-shadow" />
          <span>Search Weather</span>
        </button>
        {/* Suggestions Dropdown rendered via Portal */}
        <SuggestionsDropdown anchorRef={formRef} visible={isFocused && (suggestions.length > 0 || history.length > 0)}>
          <div
            className="bg-gradient-to-br from-blue-100/90 via-white/90 to-purple-100/90 border border-blue-200 rounded-3xl shadow-2xl max-h-80 overflow-y-auto p-2 space-y-2 backdrop-blur-xl"
          >
            {/* Suggestions */}
            {suggestions.map((sugg, idx) => {
              const cityName = sugg.split(",")[0];
              const country = sugg.split(",").slice(1).join(",").trim();
              return (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(sugg)}
                  className="flex items-center gap-4 px-4 py-3 bg-white/80 rounded-2xl shadow hover:bg-blue-200/80 transition-all cursor-pointer border border-transparent hover:border-blue-400 group"
                  style={{ minHeight: 56 }}
                >
                  <span className="text-2xl select-none">
                    {getSuggestionIcon(cityName)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold text-base text-gray-800 truncate group-hover:text-blue-700">
                      {cityName}
                    </span>
                    {country && (
                      <span className="text-xs text-gray-500 truncate">
                        {country}
                      </span>
                    )}
                  </div>
                  <span className="ml-auto text-blue-400 font-bold text-xs uppercase tracking-wide group-hover:text-blue-700">
                    Suggestion
                  </span>
                </div>
              );
            })}

            {/* Recently Searched */}
            {history.length > 0 && (
              <div className="px-4 py-2 text-xs text-gray-500 font-semibold sticky top-0 z-10 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-t-2xl border-b border-blue-100">
                Recently Searched
              </div>
            )}

            {history.map((item, idx) => {
              const cityCountry = item.country ? `${item.city},${item.country}` : item.city;
              return (
                <div
                  key={`h-${idx}`}
                  onClick={() => handleSuggestionClick(cityCountry)}
                  className="flex items-center gap-4 px-4 py-2 bg-white/70 rounded-2xl shadow hover:bg-purple-100/80 transition-all cursor-pointer border border-transparent hover:border-purple-400 group"
                  style={{ minHeight: 48 }}
                >
                  <span className="text-xl select-none">
                    {getSuggestionIcon(item.city)}
                  </span>
                  <span className="font-medium text-sm text-gray-700 truncate group-hover:text-purple-700">
                    {item.city}
                    {item.country && (
                      <span className="text-xs text-gray-500 ml-1">({item.country})</span>
                    )}
                  </span>
                  <span className="ml-auto text-purple-400 font-bold text-xs uppercase tracking-wide group-hover:text-purple-700">
                    History
                  </span>
                </div>
              );
            })}
          </div>
        </SuggestionsDropdown>
      </form>
    </div>
  );
};

export default WeatherForm;
