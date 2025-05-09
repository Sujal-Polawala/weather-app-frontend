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
      await new Promise((resolve) => setTimeout(resolve, 800)); // fake delay
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
    <div className={`min-h-screen w-full px-4 py-8 sm:px-10 sm:py-14 flex flex-col items-center transition-all duration-700 rounded-3xl ease-in-out`}>
      <div className="w-full max-w-4xl space-y-8">
        <WeatherForm
          setWeather={setWeather}
          setHistory={setHistory}
          setError={setError}
          fetchHistory={fetchHistory}
          setLoading={setLoading}
          history={history}
        />

        {loading ? (
          <WeatherSkeleton />
        ) : weather || error ? (
          <div className="mt-6 transition-all duration-300 ease-in-out p-6 rounded-xl shadow-lg backdrop-blur-md bg-white/30">
            <WeatherDisplay
              weather={weather}
              onClose={handleClose}
              fromHistory={fromHistory}
              error={error}
            />
          </div>
        ) : null}

        <div className="mt-6">
          {loadingHistory ? (
            <HistorySkeleton />
          ) : (
            <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
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

        <div className="mt-6 p-4 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
          {history.length > 0 && <WeatherTrends history={history} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
