import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi';
import { fetchForecast } from '../api/weatherApi';

const WeatherForecast = ({ city, country }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) {
      fetchForecastData();
    }
  }, [city]);

  const fetchForecastData = async () => {
    setLoading(true);
    setError(null);
    try {
      const cityQuery = city && country ? `${city},${country}` : city;
      const data = await fetchForecast(cityQuery);
      setForecast(data);
    } catch (err) {
      setError('Failed to load forecast data');
      console.error('Forecast error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 30) return 'text-red-600';
    if (temp >= 20) return 'text-orange-600';
    if (temp >= 10) return 'text-yellow-600';
    return 'text-blue-600';
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
      <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <HiOutlineCalendar className="text-blue-600 text-xl" />
          <h3 className="text-xl font-bold text-gray-800">5-Day Forecast</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-lg border border-red-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <HiOutlineCalendar className="text-red-600 text-xl" />
          <h3 className="text-xl font-bold text-gray-800">5-Day Forecast</h3>
        </div>
        <p className="text-red-600 text-center py-4">{error}</p>
      </div>
    );
  }

  if (!forecast || !forecast.forecasts) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineCalendar className="text-blue-600 text-xl" />
          <h3 className="text-xl font-bold text-gray-800">5-Day Forecast</h3>
        </div>
        <div className="text-sm text-gray-600">
          {forecast.city}, {forecast.country}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.forecasts.map((day, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-50/50 to-white/50 border border-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                {formatDate(day.date)}
              </div>
              
              <div className="text-3xl mb-2">
                {getWeatherIcon(day.icon)}
              </div>
              
              <div className="mb-2">
                <span className={`text-lg font-bold ${getTemperatureColor(day.max_temp)}`}>
                  {day.max_temp}°
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  / {day.min_temp}°
                </span>
              </div>
              
              <div className="text-xs text-gray-600 mb-2 capitalize">
                {day.description}
              </div>
              
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>💧</span>
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>💨</span>
                  <span>{day.wind_speed} km/h</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={fetchForecastData}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mx-auto transition-colors duration-200"
        >
          <HiOutlineArrowRight size={14} />
          Refresh Forecast
        </button>
      </div>
    </div>
  );
};

export default WeatherForecast;
