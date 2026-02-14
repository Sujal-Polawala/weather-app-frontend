import React, { useEffect, useState } from "react";
import { FaTimes, FaThermometerHalf, FaWind, FaTint, FaSun, FaMoon } from "react-icons/fa";
import { WiHumidity, WiStrongWind, WiThermometer } from "react-icons/wi";
import toast from "react-hot-toast";
// import { getClothingSuggestion } from "../api/weatherApi";

const WeatherDisplay = ({ weather, error, onClose, fromHistory }) => {
  if (error && !fromHistory) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-red-200 rounded-3xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <span className="text-4xl">⚠️</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Weather</h3>
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  // const [suggestion, setSuggestion] = useState("");

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
              className={`relative flex items-start gap-3 text-white bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl 
        w-[90vw] max-w-sm sm:max-w-md md:max-w-lg border border-red-400/30
        ${t.visible ? "animate-enter" : "animate-leave"}`}
            >
              <div className="text-white text-xl">🚨</div>
              <div className="flex-1 text-sm sm:text-base break-words font-medium">
                {msg}
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-white/80 hover:text-white transition hover:cursor-pointer"
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

  // useEffect(() => {
  //   const fetchSuggestion = async () => {
  //     if (weather?.temperature && weather?.description) {
  //       const response = await getClothingSuggestion(
  //         weather.temperature,
  //         weather.description
  //       );
  //       setSuggestion(response);
  //     }
  //   };
  //   fetchSuggestion();
  // }, [weather]);

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("storm")) return "⛈️";
    if (desc.includes("fog") || desc.includes("mist")) return "🌫️";
    return "🌤️";
  };

  return (
    <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-1 sm:px-0 space-y-6">
      {/* Hero Weather Card */}
      <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>

        {fromHistory && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-lg border border-white/30 text-white hover:bg-white/30 transition-all duration-300 focus:outline-none hover:cursor-pointer p-2 rounded-full"
              aria-label="Close weather display"
            >
              <FaTimes size={18} />
            </button>
          </div>
        )}

        <div className="relative p-6 sm:p-8 md:p-10">
          {/* Location Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <span className="text-7xl sm:text-8xl md:text-9xl drop-shadow-2xl filter drop-shadow-lg">
                {getWeatherIcon(weather.description)}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg mb-3">
              {weather.city}
            </h2>
            {weather.isCurrentLocation && (
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg border border-white/30">
                  📍 {weather.fromHistory ? 'Current Location (from history)' : 'Current Location'}
                </span>
              </div>
            )}
            <p className="text-white/90 text-lg sm:text-xl font-medium">
              {weather.state ? `${weather.state}, ` : ""}{weather.country}
            </p>
          </div>

          {/* Main Temperature Display */}
          <div className="text-center mb-8">
            <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white mb-3 drop-shadow-lg">
              {weather.temperature}°
            </div>
            <p className="text-white/90 text-xl sm:text-2xl font-medium mb-2">
              {weather.description}
            </p>
            <p className="text-white/80 text-lg">
              Feels like {weather.feels_like}°C
            </p>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center text-center">
            <WiThermometer className="text-4xl text-orange-500 mb-2" />
            <span className="text-xs text-gray-600 font-medium mb-1 uppercase tracking-wide">Min / Max</span>
            <div className="text-lg font-bold text-gray-800">
              <span className="text-orange-600">{weather.temp_max}°</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-blue-600">{weather.temp_min}°</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center text-center">
            <WiStrongWind className="text-4xl text-blue-500 mb-2" />
            <span className="text-xs text-gray-600 font-medium mb-1 uppercase tracking-wide">Wind Speed</span>
            <div className="text-lg font-bold text-gray-800">{weather.wind_speed} m/s</div>
            <div className="text-xs text-gray-500 mt-1">{weather.wind_deg}°</div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center text-center">
            <WiHumidity className="text-4xl text-cyan-500 mb-2" />
            <span className="text-xs text-gray-600 font-medium mb-1 uppercase tracking-wide">Humidity</span>
            <div className="text-lg font-bold text-gray-800">{weather.humidity}%</div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center text-center">
            <FaTint className="text-4xl text-indigo-500 mb-2" />
            <span className="text-xs text-gray-600 font-medium mb-1 uppercase tracking-wide">Pressure</span>
            <div className="text-lg font-bold text-gray-800">{weather.pressure || 'N/A'} hPa</div>
          </div>
        </div>
      </div>

      {/* Sun Timings */}
      <div className="bg-gradient-to-r from-yellow-100 via-orange-50 to-yellow-100 backdrop-blur-lg border border-yellow-200 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="flex flex-col items-center">
            <FaSun className="text-4xl text-yellow-500 mb-3" />
            <span className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Sunrise</span>
            <span className="text-gray-800 text-xl font-bold">
              {new Date(weather.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <FaMoon className="text-4xl text-indigo-500 mb-3" />
            <span className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Sunset</span>
            <span className="text-gray-800 text-xl font-bold">
              {new Date(weather.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
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
