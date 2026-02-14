import React from "react";
import { FaUmbrella, FaSun, FaSnowflake, FaWind, FaCloud, FaCloudRain, FaSparkles } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const AIWeatherSuggestion = ({ weather }) => {
  if (!weather) return null;

  const { temperature, description, wind_speed, humidity } = weather;
  const desc = description.toLowerCase();

  // Rule-based AI suggestions
  const getSuggestion = () => {
    const suggestions = [];

    // Temperature-based suggestions
    if (temperature >= 30) {
      suggestions.push({
        icon: <FaSun className="w-5 h-5 text-orange-500" />,
        text: "It's hot today ☀️ — stay hydrated and seek shade!",
        color: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200",
      });
    } else if (temperature >= 20) {
      suggestions.push({
        icon: <FaSun className="w-5 h-5 text-yellow-500" />,
        text: "Perfect weather ☀️ — great for outdoor activities!",
        color: "from-yellow-50 to-orange-50",
        borderColor: "border-yellow-200",
      });
    } else if (temperature >= 10) {
      suggestions.push({
        icon: <FaCloud className="w-5 h-5 text-blue-400" />,
        text: "Mild weather 🌤️ — comfortable for most activities.",
        color: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-200",
      });
    } else if (temperature >= 0) {
      suggestions.push({
        icon: <FaWind className="w-5 h-5 text-gray-500" />,
        text: "Cool weather 🧥 — wear a light jacket.",
        color: "from-gray-50 to-blue-50",
        borderColor: "border-gray-200",
      });
    } else {
      suggestions.push({
        icon: <FaSnowflake className="w-5 h-5 text-blue-300" />,
        text: "Cold weather ❄️ — bundle up and stay warm!",
        color: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-200",
      });
    }

    // Weather condition-based suggestions
    if (desc.includes("rain") || desc.includes("drizzle")) {
      suggestions.push({
        icon: <FaUmbrella className="w-5 h-5 text-blue-500" />,
        text: "Rain expected 🌧️ — carry an umbrella!",
        color: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-300",
      });
    }

    if (desc.includes("snow")) {
      suggestions.push({
        icon: <FaSnowflake className="w-5 h-5 text-blue-400" />,
        text: "Snow expected ❄️ — drive carefully!",
        color: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-300",
      });
    }

    if (desc.includes("storm") || desc.includes("thunder")) {
      suggestions.push({
        icon: <FaCloudRain className="w-5 h-5 text-purple-500" />,
        text: "Storm warning ⛈️ — stay indoors if possible!",
        color: "from-purple-50 to-indigo-50",
        borderColor: "border-purple-300",
      });
    }

    if (wind_speed > 10) {
      suggestions.push({
        icon: <FaWind className="w-5 h-5 text-gray-600" />,
        text: "Windy conditions 💨 — be cautious outdoors!",
        color: "from-gray-50 to-slate-50",
        borderColor: "border-gray-300",
      });
    }

    if (humidity > 80) {
      suggestions.push({
        icon: <FaCloud className="w-5 h-5 text-gray-500" />,
        text: "High humidity 💧 — it may feel warmer than it is.",
        color: "from-gray-50 to-blue-50",
        borderColor: "border-gray-200",
      });
    }

    // Return the most relevant suggestion (first one)
    return suggestions[0] || {
      icon: <HiSparkles className="w-5 h-5 text-purple-500" />,
      text: "Enjoy the weather! 🌤️",
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    };
  };

  const suggestion = getSuggestion();

  return (
    <div
      className={`bg-gradient-to-br ${suggestion.color} border ${suggestion.borderColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <div className="bg-white/80 p-2.5 rounded-xl shadow-sm">
            {suggestion.icon}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <HiSparkles className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              AI Weather Suggestion
            </h3>
          </div>
          <p className="text-base text-gray-800 font-medium leading-relaxed">
            {suggestion.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIWeatherSuggestion;

