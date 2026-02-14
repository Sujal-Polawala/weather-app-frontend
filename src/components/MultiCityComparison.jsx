import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePlus, HiOutlineX, HiOutlineRefresh, HiOutlineSearch, HiOutlineCheck, HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { fetchWeather, fetchWeatherHistory, saveWeatherHistory } from '../api/weatherApi';
import { getCitySuggestions } from '../api/locationApi';
import VoiceSearchButton from './VoiceSearchButton';
import toast from 'react-hot-toast';

const MultiCityComparison = ({ isInModal = false, onCityAdded = null }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [existingCities, setExistingCities] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const formRef = useRef(null);

  // Fetch existing cities from database
  useEffect(() => {
    const loadExistingCities = async () => {
      setLoadingExisting(true);
      try {
        const history = await fetchWeatherHistory();
        setExistingCities(history || []);
        // Trigger loaded animation after a short delay
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error('Failed to load existing cities:', error);
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExistingCities();
  }, []);

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

    if (cities.length >= 4) {
      toast.error('Maximum 4 cities allowed for comparison');
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
      
      // Save to database if not already there
      const isAlreadyInDB = existingCities.some(city => 
        city.city.toLowerCase() === weatherData.city.toLowerCase()
      );
      
      if (!isAlreadyInDB) {
        try {
          await saveWeatherHistory(weatherData);
          setExistingCities([...existingCities, weatherData]);
          // Notify parent component to refresh history
          if (onCityAdded) {
            onCityAdded(weatherData);
          }
        } catch (dbError) {
          console.error('Failed to save to database:', dbError);
        }
      }
      
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
    setIsComparing(false); // Reset comparison when removing cities
    toast.success(`${cityName} removed from comparison`);
  };

  const startComparison = () => {
    if (cities.length < 2) {
      toast.error('Please add at least 2 cities to compare');
      return;
    }
    setIsComparing(true);
    toast.success(`Comparing ${cities.length} cities`);
  };

  const resetComparison = () => {
    setIsComparing(false);
  };

  const addExistingCity = async (existingCity) => {
    if (cities.length >= 4) {
      toast.error('Maximum 4 cities allowed for comparison');
      return;
    }

    if (cities.some(city => city.city.toLowerCase() === existingCity.city.toLowerCase())) {
      toast.error('City already added to comparison');
      return;
    }

    setLoading(true);
    try {
      // Fetch fresh weather data for the existing city
      const cityQuery = existingCity.city && existingCity.country 
        ? `${existingCity.city},${existingCity.country}` 
        : existingCity.city;
      const weatherData = await fetchWeather(cityQuery);
      setCities([...cities, weatherData]);
      toast.success(`${weatherData.city} added to comparison`);
    } catch (error) {
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
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

  const containerClass = isInModal ? 'w-full mx-auto p-4 sm:p-6' : 'w-full max-w-7xl mx-auto p-6';
  const wrapperCardClass = isInModal
    ? 'bg-transparent p-0'
    : 'bg-white/70 backdrop-blur-2xl border border-slate-200/60 rounded-2xl shadow-sm p-6';

  return (
    <div className={containerClass}>
      <div className={wrapperCardClass}>
        {!isInModal && (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">City Comparison</h2>
            <p className="text-sm text-slate-500">Compare weather across multiple cities</p>
          </div>
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
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base p-3 pl-10 pr-28 rounded-xl placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && !loading && newCity.trim() && addCity()}
              />
              <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <VoiceSearchButton 
                  onResult={handleVoiceResult}
                  isMobile={false}
                />
                
                <button
                  onClick={() => addCity()}
                  disabled={loading || !newCity.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:cursor-pointer disabled:hover:bg-slate-900"
                >
                  <HiOutlinePlus size={16} />
                  Add
                </button>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && isFocused && (
              <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors duration-200 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl border-b border-slate-100 last:border-b-0 hover:cursor-pointer text-sm"
                  >
                    <span className="text-base">{getSuggestionIcon(suggestion)}</span>
                    <span className="text-slate-800 font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Existing Cities from Database */}
        {existingCities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center uppercase tracking-wide">
              Quick Add from History
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {loadingExisting ? (
                <div className="col-span-full text-center text-gray-500 flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  Loading cities...
                </div>
              ) : (
                existingCities.map((city, index) => {
                  const isAlreadyAdded = cities.some(c => c.city.toLowerCase() === city.city.toLowerCase());
                  return (
                    <button
                      key={index}
                      onClick={() => !isAlreadyAdded && addExistingCity(city)}
                      disabled={isAlreadyAdded || loading}
                      className={`p-3 rounded-lg border transition-all duration-200 text-center hover:scale-105 ${
                        isAlreadyAdded
                          ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-700 hover:cursor-pointer'
                      }`}
                      title={isAlreadyAdded ? 'Already added' : `Add ${city.city} to comparison`}
                    >
                      <div className="text-lg mb-1">{getWeatherIcon(city.description || 'clear')}</div>
                      <div className="text-xs font-medium truncate">{city.city}</div>
                      <div className="text-xs text-gray-500">{Math.round(city.temperature)}°C</div>
                      {isAlreadyAdded && (
                        <HiOutlineCheck className="mx-auto mt-1 text-green-600" size={14} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Cities Selection/Comparison */}
        {cities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No cities added yet
            </h3>
            <p className="text-slate-500 text-sm">
              Add at least 2 cities above to start comparing weather data
            </p>
          </div>
        ) : (
          <>
            {/* Selection Mode - Show selected cities */}
            {!isComparing && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Selected Cities ({cities.length}/4)
                  </h3>
                  {cities.length >= 2 && !isComparing && (
                    <button
                      onClick={startComparison}
                      disabled={cities.length < 2}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:cursor-pointer"
                    >
                      <HiOutlineSwitchHorizontal size={16} />
                      Compare
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl">{getWeatherIcon(city.description)}</div>
                        <button
                          onClick={() => removeCity(city.city)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
                          title="Remove city"
                        >
                          <HiOutlineX size={14} />
                        </button>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm truncate mb-1">{city.city}</h4>
                      <p className="text-slate-500 text-xs mb-2">{city.country}</p>
                      <div className={`text-lg font-bold ${getTemperatureColor(city.temperature)} mt-1`}>
                        {Math.round(city.temperature)}°C
                      </div>
                    </div>
                  ))}
                </div>
                
                {cities.length < 2 && (
                  <div className="text-center mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-700 text-sm">
                      Add {2 - cities.length} more cit{cities.length === 0 ? 'ies' : 'y'} to start comparison
                    </p>
                  </div>
                )}
                
                {cities.length >= 4 && (
                  <div className="text-center mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-blue-700 text-sm">
                      Maximum 4 cities reached. Remove a city to add another.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Comparison Mode - Show detailed comparison */}
            {isComparing && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Weather Comparison ({cities.length} cities)
                  </h3>
                  <button
                    onClick={resetComparison}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:cursor-pointer"
                  >
                    Back
                  </button>
                </div>
                
                <div className={`grid gap-6 ${getGridClasses()}`}>
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {city.city}
                          </h3>
                          {city.country && (
                            <p className="text-slate-500 text-xs mt-0.5">{city.country}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => refreshCity(city.city)}
                            disabled={loading}
                            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
                            title="Refresh weather"
                          >
                            <HiOutlineRefresh size={14} className={loading ? 'animate-spin' : ''} />
                          </button>
                          <button
                            onClick={() => removeCity(city.city)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200 hover:cursor-pointer"
                            title="Remove city"
                          >
                            <HiOutlineX size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Weather Icon and Temperature */}
                      <div className="text-center mb-5">
                        <div className="text-5xl mb-3">{getWeatherIcon(city.description)}</div>
                        <div className={`text-3xl font-bold ${getTemperatureColor(city.temperature)}`}>
                          {Math.round(city.temperature)}°
                        </div>
                        <p className="text-slate-600 text-sm mt-1 capitalize">{city.description}</p>
                      </div>

                      {/* Weather Details */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-xs uppercase tracking-wide">Feels like</span>
                          <span className="font-semibold text-slate-900">
                            {Math.round(city.feels_like)}°C
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-xs uppercase tracking-wide">Humidity</span>
                          <span className="font-semibold text-slate-900">{city.humidity}%</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-xs uppercase tracking-wide">Wind</span>
                          <span className="font-semibold text-slate-900">{city.wind_speed} km/h</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                          <span className="text-slate-600 text-xs uppercase tracking-wide">Min/Max</span>
                          <span className="font-semibold text-slate-900">
                            {Math.round(city.temp_min)}° / {Math.round(city.temp_max)}°
                          </span>
                        </div>

                        {/* Sun Timings */}
                        <div className="pt-3 mt-3 border-t border-slate-200">
                          <div className="grid grid-cols-2 gap-3 text-center">
                            <div>
                              <div className="text-lg mb-1">🌅</div>
                              <div className="text-slate-600 text-xs mb-1">Sunrise</div>
                              <div className="font-semibold text-slate-900 text-sm">
                                {formatTime(city.sunrise)}
                              </div>
                            </div>
                            <div>
                              <div className="text-lg mb-1">🌇</div>
                              <div className="text-slate-600 text-xs mb-1">Sunset</div>
                              <div className="font-semibold text-slate-900 text-sm">
                                {formatTime(city.sunset)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Summary Stats - Only show in comparison mode */}
        {stats && isComparing && (
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-slate-900 mb-5 text-center">
              Comparison Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-600">
                  {stats.hottest.temp}°C
                </div>
                <p className="text-slate-600 text-xs uppercase tracking-wide mt-1">Hottest</p>
                <p className="text-slate-800 font-medium text-xs mt-1">
                  {stats.hottest.cities.join(', ')}
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-600">
                  {stats.coldest.temp}°C
                </div>
                <p className="text-slate-600 text-xs uppercase tracking-wide mt-1">Coldest</p>
                <p className="text-slate-800 font-medium text-xs mt-1">
                  {stats.coldest.cities.join(', ')}
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-slate-900">
                  {stats.average.temp}°C
                </div>
                <p className="text-slate-600 text-xs uppercase tracking-wide mt-1">Average</p>
                <p className="text-slate-800 font-medium text-xs mt-1">{cities.length} cities</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-600">
                  {stats.humidity.max}%
                </div>
                <p className="text-slate-600 text-xs uppercase tracking-wide mt-1">Max Humidity</p>
                <p className="text-slate-800 font-medium text-xs mt-1">
                  {stats.humidity.cities.join(', ')}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-slate-900">
                  {stats.average.humidity}%
                </div>
                <p className="text-slate-600 text-xs uppercase tracking-wide mt-1">Avg Humidity</p>
                <p className="text-slate-800 font-medium text-xs mt-1">{cities.length} cities</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-orange-600">
                  {stats.wind.max} km/h
                </div>
                <p className="text-slate-600 text-xs uppercase tracking-wide mt-1">Windiest</p>
                <p className="text-slate-800 font-medium text-xs mt-1">
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