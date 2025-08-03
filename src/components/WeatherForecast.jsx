import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineSun, HiOutlineCloud, HiOutlineCloudRain } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, addHours, addDays, parseISO } from 'date-fns';

const WeatherForecast = ({ city, currentWeather }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hourly');

  // Mock forecast data - in real app, this would come from API
  const generateMockForecast = () => {
    const hourly = [];
    const daily = [];
    
    // Generate 24 hours of data
    for (let i = 0; i < 24; i++) {
      const time = addHours(new Date(), i);
      hourly.push({
        time: format(time, 'HH:mm'),
        temperature: Math.round(currentWeather.temperature + (Math.random() - 0.5) * 10),
        humidity: Math.round(currentWeather.humidity + (Math.random() - 0.5) * 20),
        windSpeed: Math.round(currentWeather.windSpeed + (Math.random() - 0.5) * 10),
        description: ['Clear', 'Cloudy', 'Rainy', 'Sunny'][Math.floor(Math.random() * 4)]
      });
    }

    // Generate 7 days of data
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      daily.push({
        date: format(date, 'EEE'),
        day: format(date, 'MMM dd'),
        high: Math.round(currentWeather.temperature + 5 + Math.random() * 10),
        low: Math.round(currentWeather.temperature - 5 - Math.random() * 10),
        humidity: Math.round(currentWeather.humidity + (Math.random() - 0.5) * 20),
        windSpeed: Math.round(currentWeather.windSpeed + (Math.random() - 0.5) * 10),
        description: ['Clear', 'Cloudy', 'Rainy', 'Sunny', 'Partly Cloudy'][Math.floor(Math.random() * 5)]
      });
    }

    return { hourly, daily };
  };

  useEffect(() => {
    if (city && currentWeather) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setForecastData(generateMockForecast());
        setLoading(false);
      }, 1000);
    }
  }, [city, currentWeather]);

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return <HiOutlineCloudRain className="text-blue-500" />;
    if (desc.includes('cloud')) return <HiOutlineCloud className="text-gray-500" />;
    if (desc.includes('sun') || desc.includes('clear')) return <HiOutlineSun className="text-yellow-500" />;
    return <HiOutlineSun className="text-yellow-500" />;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">Temperature: {payload[0].value}°C</p>
          <p className="text-green-600">Humidity: {payload[1]?.value}%</p>
          <p className="text-purple-600">Wind: {payload[2]?.value} km/h</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/40 rounded w-1/3 mx-auto mb-6"></div>
            <div className="h-64 bg-white/40 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill().map((_, i) => (
                <div key={i} className="h-32 bg-white/40 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!forecastData) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📅 Weather Forecast for {city}
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('hourly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'hourly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <HiOutlineClock className="inline mr-2" />
              Hourly Forecast
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'daily'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <HiOutlineCalendar className="inline mr-2" />
              7-Day Forecast
            </button>
          </div>
        </div>

        {activeTab === 'hourly' && (
          <div>
            {/* Hourly Chart */}
            <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Temperature & Humidity Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={forecastData.hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Temperature"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Humidity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {forecastData.hourly.slice(0, 12).map((hour, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {hour.time}
                  </div>
                  <div className="text-2xl mb-2">
                    {getWeatherIcon(hour.description)}
                  </div>
                  <div className="text-xl font-bold text-gray-800 mb-1">
                    {hour.temperature}°C
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {hour.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    💨 {hour.windSpeed} km/h
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'daily' && (
          <div>
            {/* Daily Chart */}
            <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">7-Day Temperature Range</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="High"
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Low"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {forecastData.daily.map((day, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {day.date}
                    </div>
                    <div className="text-sm text-gray-600">
                      {day.day}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">
                      {getWeatherIcon(day.description)}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {day.description}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">High</span>
                      <span className="font-bold text-red-600">{day.high}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Low</span>
                      <span className="font-bold text-blue-600">{day.low}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Humidity</span>
                      <span className="font-semibold text-gray-800">{day.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Wind</span>
                      <span className="font-semibold text-gray-800">{day.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherForecast; 