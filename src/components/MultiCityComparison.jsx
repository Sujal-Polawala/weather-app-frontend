import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePlus, HiOutlineX, HiOutlineRefresh, HiOutlineSearch, HiOutlineMicrophone } from 'react-icons/hi';
import { fetchWeather } from '../api/weatherApi';
import { getCitySuggestions } from '../api/locationApi';
import toast from 'react-hot-toast';

const MultiCityComparison = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleVoiceSearch = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setIsListening(false);
      setIsProcessing(true);
      setNewCity(spokenText);
      
      setTimeout(() => {
        addCity(spokenText);
        setIsProcessing(false);
      }, 1000);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setIsProcessing(false);
      toast.error('Voice recognition failed');
    };

    recognition.onend = () => {
      setIsListening(false);
    };
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

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🌍 Multi-City Weather Comparison
        </h2>

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
                <button
                  onClick={handleVoiceSearch}
                  disabled={isListening || isProcessing}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isListening || isProcessing
                      ? 'bg-purple-200 text-purple-600'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  } ${isListening ? 'animate-pulse' : ''} ${isProcessing ? 'animate-spin' : ''}`}
                  title="Voice search"
                >
                  <HiOutlineMicrophone size={20} />
                </button>
                
                <button
                  onClick={() => addCity()}
                  disabled={loading || !newCity.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <HiOutlinePlus size={20} />
                  Add
                </button>
              </div>
            </div>

            {/* Enhanced Suggestions Dropdown */}
            {suggestions.length > 0 && isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        {cities.length > 1 && (
          <div className="mt-8 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              📊 Comparison Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(Math.max(...cities.map(c => c.humidity)))}%
                </div>
                <p className="text-gray-600 text-sm">Highest Humidity</p>
                <p className="text-gray-800 font-medium">
                  {cities.find(c => c.humidity === Math.max(...cities.map(c => c.humidity)))?.city}
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