import { React, useState } from "react";
import WeatherForm from "../components/weatherForm.jsx";
import WeatherDisplay from "../components/WeatherDisplay.jsx";
import History from "../components/history/History.jsx";
import useWeatherHistory from "../hook/useWeatherHistory.jsx";
import WeatherSkeleton from "../skeleton/weatherSkeleton.jsx";
import HistorySkeleton from "../skeleton/HistorySkeleton.jsx";
import WeatherTrends from "../stats/WeatherTrends.jsx";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { history, setHistory, fetchHistory, loadingHistory } =
    useWeatherHistory();

  // const getBackgroundClass = (weather) => {
  //   if (!weather || !weather.description) {
  //     return {
  //       bg: "bg-gradient-to-br from-[#41545d] via-[#334348] to-[#3f5964]",
  //       // bg: "bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]",
  //       text: "text-white",
  //     };
  //   }

  //   const condition = weather.description.toLowerCase();

  //   if (condition.includes("clear") || condition.includes("sunny")) {
  //     return {
  //       bg: "bg-gradient-to-br from-yellow-100 via-yellow-300 to-orange-200",
  //       text: "text-black",
  //     };
  //   } else if (condition.includes("cloud")) {
  //     return {
  //       bg: "bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400",
  //       text: "text-black",
  //     };
  //   } else if (condition.includes("rain")) {
  //     return {
  //       bg: "bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500",
  //       text: "text-black",
  //     };
  //   } else if (condition.includes("snow")) {
  //     return {
  //       bg: "bg-gradient-to-br from-white via-sky-100 to-blue-100",
  //       text: "text-black",
  //     };
  //   } else if (condition.includes("storm") || condition.includes("thunder")) {
  //     return {
  //       bg: "bg-gradient-to-br from-indigo-900 via-gray-900 to-black",
  //       text: "text-white",
  //     };
  //   } else {
  //     return {
  //       bg: "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900",
  //       text: "text-white",
  //     };
  //   }
  // };

  const handleHistoryItemClick = async (historyItem) => {
    setFromHistory(true);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setWeather(historyItem);
      setError(null);
    } catch (err) {
      setError("Failed to load data.");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setWeather(null);
    setFromHistory(false);
  };

  // const { bg, text } = getBackgroundClass(weather);

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            🌤️ Weather App
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto">
            Get real-time weather information for any city around the world
          </p>
        </div> */}

        {/* Search Form */}
        <div className="mb-12">
          <WeatherForm
            setWeather={setWeather}
            setHistory={setHistory}
            setError={setError}
            fetchHistory={fetchHistory}
            setLoading={setLoading}
            history={history}
          />
        </div>

        {/* Weather Display */}
        {loading ? (
          <div className="mb-12">
            <WeatherSkeleton />
          </div>
        ) : weather || error ? (
          <div className="mb-12">
            <WeatherDisplay
              weather={weather}
              onClose={handleClose}
              fromHistory={fromHistory}
              error={error}
            />
          </div>
        ) : null}

        {/* History Section */}
        <div className="mb-12">
          {loadingHistory ? (
            <HistorySkeleton />
          ) : (
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">
              <History
                history={history}
                setHistory={setHistory}
                setWeather={setWeather}
                fetchHistory={fetchHistory}
                onHistoryItemClick={handleHistoryItemClick}
              />
            </div>
          )}
        </div>

        {/* Weather Trends */}
        {history.length > 0 && (
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">
            <WeatherTrends history={history} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
