import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi';
import { WiDaySunny, WiRain, WiCloud, WiSnow, WiThunderstorm, WiFog, WiStrongWind, WiHumidity } from 'react-icons/wi';
import { fetchForecast } from '../api/weatherApi';
import FiveDaySkeleton from '../skeleton/fiveDaySkeleton';

const WeatherForecast = ({ city, country }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) fetchForecastData();
  }, [city]);

  const fetchForecastData = async () => {
    setLoading(true);
    setError(null);
    try {
      const cityQuery = city && country ? `${city},${country}` : city;
      const data = await fetchForecast(cityQuery);
      setForecast(data);
    } catch (err) {
      setError("Failed to load forecast data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <WiDaySunny className="text-yellow-400 text-4xl" />,
      '01n': <WiDaySunny className="text-gray-400 text-4xl" />,
      '02d': <WiCloud className="text-gray-400 text-4xl" />,
      '02n': <WiCloud className="text-gray-400 text-4xl" />,
      '03d': <WiCloud className="text-gray-500 text-4xl" />,
      '04d': <WiCloud className="text-gray-600 text-4xl" />,
      '09d': <WiRain className="text-blue-400 text-4xl" />,
      '10d': <WiRain className="text-blue-500 text-4xl" />,
      '11d': <WiThunderstorm className="text-purple-600 text-4xl" />,
      '13d': <WiSnow className="text-blue-200 text-4xl" />,
      '50d': <WiFog className="text-gray-400 text-4xl" />
    };
    return iconMap[iconCode] || <WiDaySunny className="text-yellow-400 text-4xl" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  if (loading) {
    return (
      <FiveDaySkeleton />
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-lg border border-red-200 rounded-2xl p-6 shadow-lg">
        <p className="text-red-600 text-center py-4">{error}</p>
      </div>
    );
  }

  if (!forecast?.forecasts) return null;

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-xl">
            <HiOutlineCalendar className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">5-Day Forecast</h3>
            <p className="text-xs text-gray-500">{forecast.city}, {forecast.country}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.forecasts.map((day, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                {formatDate(day.date)}
              </p>
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.icon)}
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">
                {day.max_temp}° <span className="text-gray-500 text-lg">/ {day.min_temp}°</span>
              </p>
              <p className="text-xs text-gray-600 capitalize mb-3">{day.description}</p>
              <div className="flex justify-around mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                <span className="flex items-center gap-1"><WiHumidity className="text-cyan-500" /> {day.humidity}%</span>
                <span className="flex items-center gap-1"><WiStrongWind className="text-blue-500" /> {day.wind_speed} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={fetchForecastData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 hover:cursor-pointer"
        >
          <HiOutlineArrowRight size={16} />
          Refresh Forecast
        </button>
      </div>
    </div>
  );
};

export default WeatherForecast;
