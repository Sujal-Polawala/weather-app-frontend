import { React, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import WeatherForm from "../components/weatherForm.jsx";
import WeatherDisplay from "../components/WeatherDisplay.jsx";
import WeatherForecast from "../components/WeatherForecast.jsx";
import History from "../components/history/History.jsx";
import useWeatherHistory from "../hook/useWeatherHistory.jsx";
import WeatherSkeleton from "../skeleton/weatherSkeleton.jsx";
import HistorySkeleton from "../skeleton/HistorySkeleton.jsx";
import WeatherTrends from "../stats/WeatherTrends.jsx";
import AIWeatherSuggestion from "../components/AIWeatherSuggestion.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { fetchWeather } from "../api/weatherApi.jsx";

const Home = forwardRef((props, ref) => {
  const [weather, setWeather] = useState(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingWeatherCity, setPendingWeatherCity] = useState("");

  const { history, setHistory, fetchHistory, loadingHistory } =
    useWeatherHistory();

  // Expose refreshHistory method to parent component
  useImperativeHandle(ref, () => ({
    refreshHistory: () => {
      fetchHistory();
    }
  }));

  const updateHistoryOrder = (clickedCity) => {
    const reordered = [
      clickedCity,
      ...history.filter(
        (item) =>
          item.city.toLowerCase() !== clickedCity.city.toLowerCase() ||
          item.country?.toLowerCase() !== clickedCity.country?.toLowerCase()
      ),
    ];
    setHistory(reordered);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(reordered));
  };

  const handleHistoryItemClick = async (historyItem) => {
    setFromHistory(true);
    setLoading(true);
    try {
      const cityQuery =
        historyItem.city && historyItem.country
          ? `${historyItem.city},${historyItem.country}`
          : historyItem.city;

      // Always fetch the latest data
      const weatherData = await fetchWeather(cityQuery);

      setWeather(weatherData);
      setError(null);

      updateHistoryOrder(historyItem);
    } catch (err) {
      setError("Failed to load today's weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch weather for updated city after history changes
  useEffect(() => {
    if (pendingWeatherCity) {
      const updatedItem = history.find(
        (entry) => entry.city && entry.city.toLowerCase() === pendingWeatherCity.toLowerCase()
      );
      if (updatedItem) {
        handleHistoryItemClick(updatedItem);
        setPendingWeatherCity("");
      }
    }
  }, [pendingWeatherCity, history]);

  const handleClose = () => {
    setWeather(null);
    setFromHistory(false);
  };

  // const { bg, text } = getBackgroundClass(weather);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Search Form */}
      <WeatherForm
        setWeather={setWeather}
        setHistory={setHistory}
        setError={setError}
        fetchHistory={fetchHistory}
        setLoading={setLoading}
        history={history}
      />

      {/* Empty State */}
      {/* {!loading && !weather && !error && (
        <EmptyState />
      )} */}

      {/* Weather Display */}
      {loading ? (
        <WeatherSkeleton />
      ) : weather || error ? (
        <div className="space-y-6">
          <WeatherDisplay
            weather={weather}
            onClose={handleClose}
            fromHistory={fromHistory}
            error={error}
          />
          
          {/* AI Weather Suggestions */}
          {weather && !error && (
            <AIWeatherSuggestion weather={weather} />
          )}

          {/* 5-Day Forecast */}
          {weather && !error && (
            <WeatherForecast 
              city={weather.city} 
              country={weather.country} 
            />
          )}
        </div>
      ) : null}

      {/* History Section */}
      {loadingHistory ? (
        <HistorySkeleton />
      ) : (
        <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-xl p-6 sm:p-8">
          <History
            history={history}
            setHistory={setHistory}
            setWeather={setWeather}
            fetchHistory={fetchHistory}
            onHistoryItemClick={handleHistoryItemClick}
            setPendingWeatherCity={setPendingWeatherCity}
          />
        </div>
      )}

      {/* Weather Trends */}
      {history.length > 0 && (
        <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-xl p-6 sm:p-8">
          <WeatherTrends history={history} />
        </div>
      )}
    </div>
  );
});

export default Home;
