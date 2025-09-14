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
    <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineCalendar className="text-blue-600 text-xl" />
          <h3 className="text-xl font-bold text-gray-800">5-Day Forecast</h3>
        </div>
        <div className="text-sm text-gray-600">
          {forecast.city}, {forecast.country}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.forecasts.map((day, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4 hover:shadow-md hover:scale-105 transition"
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {formatDate(day.date)}
              </p>
              {getWeatherIcon(day.icon)}
              <p className="text-lg font-bold text-gray-900 mt-2">
                {day.max_temp}° <span className="text-gray-500">/ {day.min_temp}°</span>
              </p>
              <p className="text-xs text-gray-600 capitalize">{day.description}</p>
              <div className="flex justify-around mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><WiHumidity /> {day.humidity}%</span>
                <span className="flex items-center gap-1"><WiStrongWind /> {day.wind_speed} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={fetchForecastData}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mx-auto hover:cursor-pointer"
        >
          <HiOutlineArrowRight size={14} />
          Refresh Forecast
        </button>
      </div>
    </div>
  );
};

export default WeatherForecast;
