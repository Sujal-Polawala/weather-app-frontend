import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePlus, HiOutlineX, HiOutlineRefresh, HiOutlineSearch } from 'react-icons/hi';
import { fetchWeather } from '../api/weatherApi';
import { getCitySuggestions } from '../api/locationApi';
import VoiceSearchButton from './VoiceSearchButton';
import toast from 'react-hot-toast';

const MultiCityComparison = ({ isInModal = false }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef(null);

  // City suggestions effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (newCity.trim().length > 1) {
        getCitySuggestions(newCity).then(setSuggestions).catch(console.error);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [newCity]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addCity = async (cityName = null) => {
    const cityToAdd = cityName || newCity;
    if (!cityToAdd.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    if (cities.some(city => city.city.toLowerCase() === cityToAdd.toLowerCase())) {
      toast.error('City already added to comparison');
      return;
    }

    setLoading(true);
    try {
      const weatherData = await fetchWeather(cityToAdd);
      setCities([...cities, weatherData]);
      setNewCity('');
      setSuggestions([]);
      toast.success(`${weatherData.city} added to comparison`);
    } catch (error) {
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const [cityName, country] = suggestion.split(',').map(s => s.trim());
    const selectedCity = country ? `${cityName},${country}` : cityName;
    setNewCity(selectedCity);
    setSuggestions([]);
    addCity(selectedCity);
  };

  const handleVoiceResult = (spokenText) => {
    setNewCity(spokenText);
    setTimeout(() => {
      addCity(spokenText);
    }, 1000);
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

  const getSuggestionIcon = (city) => {
    const cityLower = city.toLowerCase();
    if (cityLower.includes("new york") || cityLower.includes("london") || cityLower.includes("tokyo")) {
      return "🏙️";
    } else if (cityLower.includes("paris") || cityLower.includes("rome") || cityLower.includes("madrid")) {
      return "🏛️";
    } else if (cityLower.includes("beach") || cityLower.includes("miami") || cityLower.includes("bali")) {
      return "🏖️";
    } else {
      return "🏘️";
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Enhanced comparison logic
  const getComparisonStats = () => {
    if (cities.length < 2) return null;

    const temperatures = cities.map(c => c.temperature);
    const humidities = cities.map(c => c.humidity);
    const windSpeeds = cities.map(c => c.wind_speed);

    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    const maxHumidity = Math.max(...humidities);
    const minHumidity = Math.min(...humidities);
    const avgHumidity = humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length;
    const maxWind = Math.max(...windSpeeds);
    const avgWind = windSpeeds.reduce((sum, wind) => sum + wind, 0) / windSpeeds.length;

    // Handle same temperatures
    const hottestCities = cities.filter(c => c.temperature === maxTemp);
    const coldestCities = cities.filter(c => c.temperature === minTemp);
    const mostHumidCities = cities.filter(c => c.humidity === maxHumidity);
    const leastHumidCities = cities.filter(c => c.humidity === minHumidity);
    const windiestCities = cities.filter(c => c.wind_speed === maxWind);

    return {
      hottest: {
        temp: Math.round(maxTemp),
        cities: hottestCities.map(c => c.city)
      },
      coldest: {
        temp: Math.round(minTemp),
        cities: coldestCities.map(c => c.city)
      },
      average: {
        temp: Math.round(avgTemp),
        humidity: Math.round(avgHumidity),
        wind: Math.round(avgWind * 10) / 10
      },
      humidity: {
        max: Math.round(maxHumidity),
        min: Math.round(minHumidity),
        cities: mostHumidCities.map(c => c.city)
      },
      wind: {
        max: Math.round(maxWind * 10) / 10,
        cities: windiestCities.map(c => c.city)
      }
    };
  };

  const stats = getComparisonStats();

  // Dynamic grid classes based on number of cities
  const getGridClasses = () => {
    if (cities.length === 0) return '';
    if (cities.length === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (cities.length === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
    if (cities.length === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  const containerClass = isInModal ? 'w-full mx-auto p-2 sm:p-4' : 'w-full max-w-7xl mx-auto p-6';
  const wrapperCardClass = isInModal
    ? 'bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-6'
    : 'bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8';

  return (
    <div className={containerClass}>
      <div className={wrapperCardClass}>
        {!isInModal && (
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🌍 Multi-City Weather Comparison
          </h2>
        )}

        {/* Enhanced Add City Form */}
        <div className="mb-8" ref={formRef}>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Enter city name to compare..."
                className="w-full bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 text-lg p-4 pl-12 pr-32 rounded-2xl placeholder-gray-500 outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && addCity()}
              />
              <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <VoiceSearchButton 
                  onResult={handleVoiceResult}
                  isMobile={false}
                />
                
                <button
                  onClick={() => addCity()}
                  disabled={loading || !newCity.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:cursor-pointer"
                >
                  <HiOutlinePlus size={20} />
                  Add
                </button>
              </div>
            </div>

            {/* Improved Suggestions Dropdown */}
            {suggestions.length > 0 && isFocused && (
              <div className="mt-2 bg-white/95 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-lg">{getSuggestionIcon(suggestion)}</span>
                    <span className="text-gray-800 font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
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
          <div className={`grid gap-6 ${getGridClasses()}`}>
            {cities.map((city, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
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

                {/* Enhanced Weather Details */}
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

                  {/* Sun Timings */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-center">
                        <div className="text-yellow-500">🌅</div>
                        <div className="text-gray-600">Sunrise</div>
                        <div className="font-semibold text-gray-800">
                          {formatTime(city.sunrise)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-500">🌇</div>
                        <div className="text-gray-600">Sunset</div>
                        <div className="font-semibold text-gray-800">
                          {formatTime(city.sunset)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Summary Stats */}
        {stats && (
          <div className="mt-8 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              📊 Comparison Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.hottest.temp}°C
                </div>
                <p className="text-gray-600 text-sm">Hottest</p>
                <p className="text-gray-800 font-medium text-sm">
                  {stats.hottest.cities.join(', ')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.coldest.temp}°C
                </div>
                <p className="text-gray-600 text-sm">Coldest</p>
                <p className="text-gray-800 font-medium text-sm">
                  {stats.coldest.cities.join(', ')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.average.temp}°C
                </div>
                <p className="text-gray-600 text-sm">Average Temp</p>
                <p className="text-gray-800 font-medium text-sm">{cities.length} cities</p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.humidity.max}%
                </div>
                <p className="text-gray-600 text-sm">Highest Humidity</p>
                <p className="text-gray-800 font-medium text-sm">
                  {stats.humidity.cities.join(', ')}
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {stats.average.humidity}%
                </div>
                <p className="text-gray-600 text-sm">Average Humidity</p>
                <p className="text-gray-800 font-medium text-sm">{cities.length} cities</p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.wind.max} km/h
                </div>
                <p className="text-gray-600 text-sm">Windiest</p>
                <p className="text-gray-800 font-medium text-sm">
                  {stats.wind.cities.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiCityComparison; 