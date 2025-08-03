import React, { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineX, HiOutlineRefresh } from 'react-icons/hi';
import { fetchWeather } from '../api/weatherApi';
import toast from 'react-hot-toast';

const MultiCityComparison = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);

  const addCity = async () => {
    if (!newCity.trim()) return;
    
    setLoading(true);
    try {
      const weatherData = await fetchWeather(newCity.trim());
      const cityData = {
        id: Date.now(),
        name: newCity.trim(),
        weather: weatherData
      };
      
      setCities(prev => [...prev, cityData]);
      setNewCity('');
      toast.success(`${newCity.trim()} added to comparison`);
    } catch (error) {
      toast.error(`Failed to fetch weather for ${newCity.trim()}`);
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (id) => {
    setCities(prev => prev.filter(city => city.id !== id));
    toast.success('City removed from comparison');
  };

  const refreshCity = async (city) => {
    try {
      const weatherData = await fetchWeather(city.name);
      setCities(prev => prev.map(c => 
        c.id === city.id ? { ...c, weather: weatherData } : c
      ));
      toast.success(`${city.name} weather updated`);
    } catch (error) {
      toast.error(`Failed to refresh ${city.name}`);
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
          🌍 Multi-City Weather Comparison
        </h2>
        
        {/* Add City Input */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 p-4 rounded-2xl placeholder-gray-500 outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300"
            onKeyPress={(e) => e.key === 'Enter' && addCity()}
          />
          <button
            onClick={addCity}
            disabled={loading || !newCity.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <HiOutlinePlus size={20} />
            Add City
          </button>
        </div>

        {/* Cities Grid */}
        {cities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div
                key={city.id}
                className="bg-gradient-to-br from-white/80 to-blue-50/80 border border-blue-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{city.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {city.weather.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => refreshCity(city)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Refresh weather"
                    >
                      <HiOutlineRefresh size={16} />
                    </button>
                    <button
                      onClick={() => removeCity(city.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remove city"
                    >
                      <HiOutlineX size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">
                    {getWeatherIcon(city.weather.description)}
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {Math.round(city.weather.temperature)}°C
                  </div>
                  <div className="text-gray-600 capitalize">
                    {city.weather.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-500">Humidity</div>
                    <div className="font-semibold text-gray-800">
                      {city.weather.humidity}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500">Wind Speed</div>
                    <div className="font-semibold text-gray-800">
                      {city.weather.windSpeed} km/h
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500">Pressure</div>
                    <div className="font-semibold text-gray-800">
                      {city.weather.pressure} hPa
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500">Visibility</div>
                    <div className="font-semibold text-gray-800">
                      {city.weather.visibility} km
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No cities added yet
            </h3>
            <p className="text-gray-500">
              Add cities above to start comparing weather conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiCityComparison; 