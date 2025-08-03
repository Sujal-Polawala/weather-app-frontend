import React, { useState, useEffect } from 'react';
import { HiOutlineSun, HiOutlineMoon, HiOutlineCloud, HiOutlineCloudRain, HiOutlineSnowflake } from 'react-icons/hi';

const ThemeSwitcher = ({ weather, onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('auto');
  const [isNight, setIsNight] = useState(false);

  // Check if it's night time
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const isNightTime = hour < 6 || hour >= 18;
      setIsNight(isNightTime);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Auto theme based on time and weather
  useEffect(() => {
    if (currentTheme === 'auto' && weather) {
      let theme = 'day';
      
      // Time-based theme
      if (isNight) {
        theme = 'night';
      }
      
      // Weather-based theme
      const description = weather.description.toLowerCase();
      if (description.includes('rain') || description.includes('storm')) {
        theme += '-rainy';
      } else if (description.includes('cloud')) {
        theme += '-cloudy';
      } else if (description.includes('snow')) {
        theme += '-snowy';
      } else if (description.includes('clear') || description.includes('sun')) {
        theme += '-clear';
      }

      onThemeChange(theme);
    }
  }, [currentTheme, weather, isNight, onThemeChange]);

  const themes = [
    {
      id: 'auto',
      name: 'Auto',
      description: 'Based on time & weather',
      icon: <HiOutlineSun className="text-yellow-500" />,
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'day-clear',
      name: 'Day - Clear',
      description: 'Bright sunny day',
      icon: <HiOutlineSun className="text-yellow-500" />,
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'day-cloudy',
      name: 'Day - Cloudy',
      description: 'Overcast day',
      icon: <HiOutlineCloud className="text-gray-500" />,
      gradient: 'from-gray-400 to-blue-400'
    },
    {
      id: 'day-rainy',
      name: 'Day - Rainy',
      description: 'Wet and gloomy',
      icon: <HiOutlineCloudRain className="text-blue-500" />,
      gradient: 'from-blue-600 to-gray-600'
    },
    {
      id: 'night-clear',
      name: 'Night - Clear',
      description: 'Starry night',
      icon: <HiOutlineMoon className="text-blue-300" />,
      gradient: 'from-blue-900 to-purple-900'
    },
    {
      id: 'night-cloudy',
      name: 'Night - Cloudy',
      description: 'Dark overcast',
      icon: <HiOutlineCloud className="text-gray-400" />,
      gradient: 'from-gray-800 to-blue-800'
    },
    {
      id: 'night-rainy',
      name: 'Night - Rainy',
      description: 'Stormy night',
      icon: <HiOutlineCloudRain className="text-blue-400" />,
      gradient: 'from-gray-900 to-blue-900'
    },
    {
      id: 'snowy',
      name: 'Snowy',
      description: 'Winter wonderland',
      icon: <HiOutlineSnowflake className="text-blue-200" />,
      gradient: 'from-blue-200 to-white'
    }
  ];

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    if (themeId !== 'auto') {
      onThemeChange(themeId);
    }
  };

  const getCurrentThemeInfo = () => {
    if (currentTheme === 'auto') {
      const hour = new Date().getHours();
      const isNightTime = hour < 6 || hour >= 18;
      const timeTheme = isNightTime ? 'night' : 'day';
      
      if (weather) {
        const description = weather.description.toLowerCase();
        if (description.includes('rain') || description.includes('storm')) {
          return `${timeTheme}-rainy`;
        } else if (description.includes('cloud')) {
          return `${timeTheme}-cloudy`;
        } else if (description.includes('snow')) {
          return 'snowy';
        } else {
          return `${timeTheme}-clear`;
        }
      }
      return `${timeTheme}-clear`;
    }
    return currentTheme;
  };

  const currentThemeInfo = themes.find(t => t.id === getCurrentThemeInfo()) || themes[0];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🌈 Dynamic Theme Switcher
        </h2>

        {/* Current Theme Display */}
        <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Current Theme</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">
                {currentThemeInfo.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {currentThemeInfo.name}
                </h4>
                <p className="text-gray-600">
                  {currentThemeInfo.description}
                </p>
              </div>
            </div>
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentThemeInfo.gradient} shadow-lg`}></div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`bg-white/80 backdrop-blur-lg border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                currentTheme === theme.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">
                  {theme.icon}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {theme.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {theme.description}
                </p>
                <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${theme.gradient} shadow-md`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Theme Preview */}
        <div className="mt-8 bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Theme Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${currentThemeInfo.gradient} text-white`}>
              <h4 className="font-semibold mb-2">Primary Background</h4>
              <p className="text-sm opacity-90">Main app background with gradient</p>
            </div>
            <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Card Background</h4>
              <p className="text-sm text-gray-600">Component cards and modals</p>
            </div>
            <div className="bg-gray-800/90 backdrop-blur-lg border border-gray-700 rounded-xl p-4 text-white">
              <h4 className="font-semibold mb-2">Dark Elements</h4>
              <p className="text-sm opacity-90">Buttons and interactive elements</p>
            </div>
          </div>
        </div>

        {/* Time and Weather Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Time:</span>
                <span className="font-semibold text-gray-800">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Day/Night:</span>
                <span className="font-semibold text-gray-800">
                  {isNight ? 'Night' : 'Day'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Theme Mode:</span>
                <span className="font-semibold text-gray-800">
                  {currentTheme === 'auto' ? 'Auto' : 'Manual'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Information</h3>
            {weather ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {weather.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-semibold text-gray-800">
                    {Math.round(weather.temperature)}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-semibold text-gray-800">
                    {weather.humidity}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No weather data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher; 