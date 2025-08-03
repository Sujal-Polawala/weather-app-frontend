import React, { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineX, HiOutlineRefresh } from 'react-icons/hi';
import { fetchWeather } from '../api/weatherApi';
import toast from 'react-hot-toast';

const MultiCityComparison = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCity, setNewCity] = useState('');

  const addCity = async () => {
    if (!newCity.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    if (cities.some(city => city.city.toLowerCase() === newCity.toLowerCase())) {
      toast.error('City already added');
      return;
    }

    setLoading(true);
    try {
      const weatherData = await fetchWeather(newCity);
      setCities([...cities, weatherData]);
      setNewCity('');
      toast.success(`${weatherData.city} added to comparison`);
    } catch (error) {
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (cityName) => {
    setCities(cities.filter(city => city.city !== cityName));
    toast.success(`${cityName} removed from comparison`);
  };

  const refreshCity = async (cityName) => {
    setLoading(true);
    try {
      const weatherData = await fetchWeather(cityName);
      setCities(cities.map(city => 
        city.city === cityName ? weatherData : city
      ));
      toast.success(`${cityName} weather updated`);
    } catch (error) {
      toast.error('Failed to refresh weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('storm')) return '⛈️';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 30) return 'text-red-600';
    if (temp >= 20) return 'text-orange-600';
    if (temp >= 10) return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🌍 Multi-City Weather Comparison
        </h2>

        {/* Add City Form */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 text-lg p-3 rounded-xl placeholder-gray-500 outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && addCity()}
            />
            <button
              onClick={addCity}
              disabled={loading || !newCity.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <HiOutlinePlus size={20} />
              Add City
            </button>
          </div>
        </div>

        {/* Cities Grid */}
        {cities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No cities added yet
            </h3>
            <p className="text-gray-500">
              Add cities above to start comparing weather data
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {city.city}
                    </h3>
                    {city.country && (
                      <p className="text-gray-600 text-sm">{city.country}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => refreshCity(city.city)}
                      disabled={loading}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-300 disabled:opacity-50"
                      title="Refresh weather"
                    >
                      <HiOutlineRefresh size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                      onClick={() => removeCity(city.city)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
                      title="Remove city"
                    >
                      <HiOutlineX size={16} />
                    </button>
                  </div>
                </div>

                {/* Weather Icon and Temperature */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getWeatherIcon(city.description)}</div>
                  <div className={`text-3xl font-bold ${getTemperatureColor(city.temperature)}`}>
                    {Math.round(city.temperature)}°C
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{city.description}</p>
                </div>

                {/* Weather Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Feels like</span>
                    <span className="font-semibold text-gray-800">
                      {Math.round(city.feels_like)}°C
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Humidity</span>
                    <span className="font-semibold text-gray-800">{city.humidity}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Wind Speed</span>
                    <span className="font-semibold text-gray-800">{city.wind_speed} km/h</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Min/Max</span>
                    <span className="font-semibold text-gray-800">
                      {Math.round(city.temp_min)}° / {Math.round(city.temp_max)}°
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {cities.length > 1 && (
          <div className="mt-8 bg-white/60 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              📊 Comparison Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               <div className="text-center">
                   <div className="text-2xl font-bold text-red-600">
                     {Math.round(Math.max(...cities.map(c => c.temperature)))}°C
                   </div>
                   <p className="text-gray-600 text-sm">Hottest</p>
                   <p className="text-gray-800 font-medium">
                     {cities.find(c => c.temperature === Math.max(...cities.map(c => c.temperature)))?.city}
                   </p>
                 </div>
                 
                 <div className="text-center">
                   <div className="text-2xl font-bold text-blue-600">
                     {Math.round(Math.min(...cities.map(c => c.temperature)))}°C
                   </div>
                   <p className="text-gray-600 text-sm">Coldest</p>
                   <p className="text-gray-800 font-medium">
                     {cities.find(c => c.temperature === Math.min(...cities.map(c => c.temperature)))?.city}
                   </p>
                 </div>
                 
                 <div className="text-center">
                   <div className="text-2xl font-bold text-green-600">
                     {Math.round(cities.reduce((sum, c) => sum + c.temperature, 0) / cities.length)}°C
                   </div>
                   <p className="text-gray-600 text-sm">Average</p>
                   <p className="text-gray-800 font-medium">{cities.length} cities</p>
                 </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiCityComparison; 