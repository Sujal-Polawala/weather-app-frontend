import React, { useState, useEffect } from 'react';
import { HiOutlineMapPin, HiOutlineInformationCircle } from 'react-icons/hi';
import { fetchWeather } from '../api/weatherApi';
import toast from 'react-hot-toast';

const WeatherMap = ({ onWeatherSelect }) => {
  const [weatherMarkers, setWeatherMarkers] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample major cities with coordinates
  const majorCities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, x: 20, y: 30 },
    { name: 'London', lat: 51.5074, lng: -0.1278, x: 50, y: 25 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, x: 85, y: 35 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, x: 52, y: 28 },
    { name: 'Moscow', lat: 55.7558, lng: 37.6176, x: 65, y: 20 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, x: 85, y: 70 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, x: 70, y: 45 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, x: 75, y: 50 },
    { name: 'Beijing', lat: 39.9042, lng: 116.4074, x: 80, y: 30 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, x: 25, y: 65 }
  ];

  const handleCityClick = async (city) => {
    setLoading(true);
    try {
      const weatherData = await fetchWeather(city.name);
      const marker = {
        id: Date.now(),
        position: [city.lat, city.lng],
        city: city.name,
        weather: weatherData
      };
      
      setWeatherMarkers(prev => [...prev, marker]);
      toast.success(`Weather fetched for ${city.name}`);
    } catch (error) {
      toast.error(`Failed to fetch weather for ${city.name}`);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('sun') || desc.includes('clear')) return '☀️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🗺️ Interactive Weather Map
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 text-center mb-4">
            Click on a city marker or use the quick city buttons to view weather information
          </p>
          
          {/* Quick City Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {majorCities.slice(0, 6).map((city) => (
              <button
                key={city.name}
                onClick={() => handleCityClick(city)}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* SVG World Map */}
        <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">World Weather Map</h3>
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden">
            {/* Simple SVG World Map */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)' }}
            >
              {/* Simplified continents */}
              <path
                d="M 10 30 Q 15 25 20 30 Q 25 35 30 30 Q 35 25 40 30 Q 45 35 50 30 Q 55 25 60 30 Q 65 35 70 30 Q 75 25 80 30 Q 85 35 90 30"
                fill="#4ade80"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              <path
                d="M 15 50 Q 25 45 35 50 Q 45 55 55 50 Q 65 45 75 50 Q 85 55 90 50"
                fill="#4ade80"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              <path
                d="M 20 70 Q 30 65 40 70 Q 50 75 60 70 Q 70 65 80 70"
                fill="#4ade80"
                stroke="#22c55e"
                strokeWidth="0.5"
              />
              
              {/* City Markers */}
              {majorCities.map((city) => (
                <g key={city.name}>
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="1.5"
                    fill="#3b82f6"
                    stroke="#1d4ed8"
                    strokeWidth="0.3"
                    className="cursor-pointer hover:r-2 transition-all duration-300"
                    onClick={() => handleCityClick(city)}
                  />
                  <text
                    x={city.x + 2}
                    y={city.y}
                    fontSize="2"
                    fill="#1e40af"
                    className="pointer-events-none"
                  >
                    {city.name}
                  </text>
                </g>
              ))}
              
              {/* Weather Markers */}
              {weatherMarkers.map((marker) => {
                const city = majorCities.find(c => c.name === marker.city);
                if (!city) return null;
                
                return (
                  <g key={marker.id}>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="2"
                      fill="#ef4444"
                      stroke="#dc2626"
                      strokeWidth="0.5"
                      className="animate-pulse"
                    />
                    <text
                      x={city.x + 2}
                      y={city.y - 2}
                      fontSize="2.5"
                      fill="#dc2626"
                      className="pointer-events-none"
                    >
                      {getWeatherIcon(marker.weather.description)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Weather Details */}
        {selectedWeather && (
          <div className="mt-6 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              <HiOutlineInformationCircle className="inline mr-2" />
              Selected Weather Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {getWeatherIcon(selectedWeather.description)}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(selectedWeather.temperature)}°C
                </div>
                <div className="text-gray-600 capitalize">
                  {selectedWeather.description}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-semibold">{selectedWeather.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind Speed:</span>
                  <span className="font-semibold">{selectedWeather.windSpeed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pressure:</span>
                  <span className="font-semibold">{selectedWeather.pressure} hPa</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility:</span>
                  <span className="font-semibold">{selectedWeather.visibility} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">{selectedWeather.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-semibold">{selectedWeather.city}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Markers List */}
        {weatherMarkers.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weather Markers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="bg-gradient-to-br from-white/80 to-blue-50/80 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{marker.city}</h4>
                    <div className="text-2xl">
                      {getWeatherIcon(marker.weather.description)}
                    </div>
                  </div>
                  <div className="text-center mb-3">
                    <div className="text-xl font-bold text-gray-800">
                      {Math.round(marker.weather.temperature)}°C
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {marker.weather.description}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-gray-500">Humidity</div>
                      <div className="font-semibold">{marker.weather.humidity}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500">Wind</div>
                      <div className="font-semibold">{marker.weather.windSpeed} km/h</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedWeather(marker.weather);
                      if (onWeatherSelect) onWeatherSelect(marker.weather);
                    }}
                    className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap; 