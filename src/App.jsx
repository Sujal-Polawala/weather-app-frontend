import React, { useState, useEffect } from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import MultiCityComparison from "./components/MultiCityComparison";
import WeatherMap from "./components/WeatherMap";
import WeatherForecast from "./components/WeatherForecast";
import WeatherAlerts from "./components/WeatherAlerts";
import WeatherAnalytics from "./components/WeatherAnalytics";
import ThemeSwitcher from "./components/ThemeSwitcher";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Navigation from "./components/Navigation";
import "./index.css";
import { Toaster } from "react-hot-toast";
import "./i18n/index.js";
import { useTranslation } from "react-i18next";

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const [history, setHistory] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('auto');
  const { t } = useTranslation();

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }, [history]);

  const handleWeatherSelect = (weather) => {
    setCurrentWeather(weather);
    setCurrentCity(weather.city);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'comparison':
        return <MultiCityComparison />;
      case 'map':
        return <WeatherMap onWeatherSelect={handleWeatherSelect} />;
      case 'forecast':
        return <WeatherForecast city={currentCity} currentWeather={currentWeather} />;
      case 'alerts':
        return <WeatherAlerts currentWeather={currentWeather} city={currentCity} />;
      case 'analytics':
        return <WeatherAnalytics history={history} />;
      case 'theme':
        return <ThemeSwitcher weather={currentWeather} onThemeChange={handleThemeChange} />;
      case 'language':
        return <LanguageSwitcher />;
      default:
        return <Home />;
    }
  };

  return (
    <WeatherProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      
      {/* Navigation */}
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-500 ${
        activeSection === 'home' 
          ? 'lg:ml-80' 
          : 'lg:ml-80'
      }`}>
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 bg-gradient-to-tr from-blue-400 via-purple-300 to-cyan-200 animate-gradient-x">
          <div className="w-full max-w-7xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-500">
            {activeSection === 'home' && (
              <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-10 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl flex flex-col items-center gap-2">
                <span className="inline-block text-5xl sm:text-7xl mb-2">🌦️</span>
                <span>{t('app.title')}</span>
              </h1>
            )}
            {renderSection()}
          </div>
        </div>
      </div>
    </WeatherProvider>
  );
}

export default App;