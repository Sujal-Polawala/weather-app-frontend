import React, { useEffect, useState } from "react";
import { FaTimes, FaThermometerHalf, FaWind, FaTint, FaSun, FaMoon } from "react-icons/fa";
import { WiHumidity, WiStrongWind, WiThermometer } from "react-icons/wi";
import toast from "react-hot-toast";
// import { getClothingSuggestion } from "../api/weatherApi";

const WeatherDisplay = ({ weather, error, onClose, fromHistory }) => {
  if (error && !fromHistory) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 text-center">
          <p className="text-red-300 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="bg-gray-500/20 backdrop-blur-lg border border-gray-500/30 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-lg font-medium">No weather data available</p>
        </div>
      </div>
    );
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
    <div className="relative w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-1 sm:px-0">
      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-blue-100/90 via-white/90 to-purple-100/90 backdrop-blur-2xl border border-blue-200 p-4 sm:p-8 rounded-3xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl w-full">
        {fromHistory && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 focus:outline-none hover:cursor-pointer p-2 rounded-full"
              aria-label="Close weather display"
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}

        {/* Location Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <span className="text-6xl sm:text-7xl md:text-8xl drop-shadow-lg">
              {getWeatherIcon(weather.description)}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-gray-800 drop-shadow-lg mb-2">
            {weather.city}
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl">
            {weather.state ? `${weather.state}, ` : ""}{weather.country}
          </p>
        </div>

        {/* Main Weather Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Temperature Section */}
          <div className="text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-2">
              {weather.temperature}°C
            </div>
            <p className="text-gray-700 text-lg">
              Feels like {weather.feels_like}°C
            </p>
            <p className="text-gray-800 text-xl font-medium mt-2">
              {weather.description}
            </p>
          </div>

          {/* Weather Details */}
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-3">
                  <WiThermometer className="text-2xl text-orange-300" />
                  <span className="font-medium">Temperature Range</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Min: {weather.temp_min}°C</div>
                  <div className="text-sm text-gray-600">Max: {weather.temp_max}°C</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-3">
                  <WiStrongWind className="text-2xl text-blue-300" />
                  <span className="font-medium">Wind</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{weather.wind_speed} m/s</div>
                  <div className="text-sm text-gray-600">{weather.wind_deg}°</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-3">
                  <WiHumidity className="text-2xl text-cyan-300" />
                  <span className="font-medium">Humidity</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{weather.humidity}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sun Timings */}
        <div className="bg-gradient-to-r from-yellow-200/60 to-orange-200/60 backdrop-blur-lg border border-yellow-200 rounded-2xl p-6 shadow">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="flex flex-col items-center">
              <FaSun className="text-3xl text-yellow-400 mb-2" />
              <span className="text-gray-700 text-sm font-medium">Sunrise</span>
              <span className="text-gray-800 text-lg font-semibold">
                {new Date(weather.sunrise * 1000).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <FaMoon className="text-3xl text-blue-400 mb-2" />
              <span className="text-gray-700 text-sm font-medium">Sunset</span>
              <span className="text-gray-800 text-lg font-semibold">
                {new Date(weather.sunset * 1000).toLocaleTimeString()}
              </span>
            </div>
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
