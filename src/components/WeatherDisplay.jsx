import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { getClothingSuggestion } from "../api/weatherApi";

const WeatherDisplay = ({ weather, error, onClose, fromHistory }) => {
  if (error && !fromHistory) {
    return <p className="text-center text-red-500 mt-4 text-sm">{error}</p>;
  }

  if (!weather) {
    return (
      <p className="text-center text-gray-400 mt-4 text-sm">
        No weather data available
      </p>
    );
  }

  const [suggestion, setSuggestion] = useState("");

  const getWeatherAlerts = (temp, description) => {
    const alerts = [];

    if (temp >= 38) alerts.push("🥵 Heat Alert: Stay hydrated!");
    if (temp <= 5) alerts.push("🥶 Cold Alert: Bundle up!");
    if (description.toLowerCase().includes("storm"))
      alerts.push("⚠️ Storm Warning: Stay indoors!");
    if (description.toLowerCase().includes("rain"))
      alerts.push("🌧️ Rain Alert: Carry an umbrella!");
    if (description.toLowerCase().includes("snow"))
      alerts.push("❄️ Snow Alert: Drive safely!");

    return alerts;
  };

  const alerts = getWeatherAlerts(weather.temperature, weather.description);
  const shownAlerts = new Set();

  useEffect(() => {
    alerts.forEach((msg) => {
      if (!shownAlerts.has(msg)) {
        shownAlerts.add(msg);
        toast.custom(
          (t) => (
            <div
              className={`relative flex items-start gap-3 text-white bg-gray-800 p-3 rounded-lg shadow-lg w-full sm:w-[300px] ${
                t.visible ? "animate-enter" : "animate-leave"
              }`}
            >
              <div className="text-red-400 text-xl">🚨</div>
              <div className="flex-1 text-sm">{msg}</div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-red-500 transition hover:cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
          ),
          { duration: 5000 }
        );
      }
    });
  }, [weather]);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (weather?.temperature && weather?.description) {
        const response = await getClothingSuggestion(
          weather.temperature,
          weather.description
        );
        setSuggestion(response);
      }
    };
    fetchSuggestion();
  }, [weather]);

  return (
    <div className="relative w-full max-w-screen-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-white/20 backdrop-blur-2xl border border-white/30 p-4 sm:p-6 rounded-2xl shadow-xl mt-6 text-white text-center transition duration-300 hover:scale-[1.02]">
      {fromHistory && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-red-500 transition focus:outline-none hover:cursor-pointer"
            aria-label="Close weather display"
          >
            <FaTimes size={20} />
          </button>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide drop-shadow-md">
        📍 {weather.city}, {weather.state ? `${weather.state}, ` : ""}
        {weather.country}
      </h2>

      <div className="mt-4 space-y-1 text-sm sm:text-base md:text-lg">
        <p>
          🌡️ <span className="font-semibold">{weather.temperature}°C</span>{" "}
          (Feels like {weather.feels_like}°C)
        </p>
        <p>🌤️ {weather.description}</p>
        <p>
          🌬️ Wind: {weather.wind_speed} m/s, {weather.wind_deg}°
        </p>
        <p>
          💧 Humidity: {weather.humidity}% | ⬇️ Min: {weather.temp_min}°C | ⬆️
          Max: {weather.temp_max}°C
        </p>
        <p>
          🌅 Sunrise: {new Date(weather.sunrise * 1000).toLocaleTimeString()} |
          🌇 Sunset: {new Date(weather.sunset * 1000).toLocaleTimeString()}
        </p>
      </div>

      {suggestion && (
        <div className="mt-6 bg-white/10 border border-white/20 p-3 sm:p-4 rounded-lg shadow-md">
          <p className="text-base sm:text-lg font-semibold text-white">
            🧠 Suggestion:
          </p>
          <p className="text-lg sm:text-xl font-bold italic mt-1">
            {suggestion}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
/* <h2 className="text-3xl font-bold">
        {weather.city}, {weather.country}
      </h2>
      <hr className="my-4 border-gray-500" />

      <h3 className="text-xl font-semibold">🌡️ Temperature</h3>
      <p className="text-lg mt-2">
        <span className="font-semibold">{weather.temperature}°C</span> (Feels
        like {weather.feels_like}°C)
      </p>

      <h3 className="text-xl font-semibold mt-4">🌤️ Weather Condition</h3>
      <p className="text-lg">{weather.description}</p>

      <h3 className="text-xl font-semibold mt-4">🌬️ Wind</h3>
      <p className="text-md">
        Speed: {weather.wind_speed} m/s, Direction: {weather.wind_deg}°
      </p>

      <h3 className="text-xl font-semibold mt-4">💧 Atmospheric Details</h3>
      <p className="text-md">Humidity: {weather.humidity}%</p>
      <p className="text-md">Pressure: {weather.pressure} hPa</p>
      <p className="text-md">Visibility: {weather.visibility / 1000} km</p>

      <h3 className="text-xl font-semibold mt-4">🌅 Sun Timings</h3>
      <p className="text-md">
        Sunrise: {new Date(weather.sunrise * 1000).toLocaleTimeString()} |
        Sunset: {new Date(weather.sunset * 1000).toLocaleTimeString()}
      </p> */
