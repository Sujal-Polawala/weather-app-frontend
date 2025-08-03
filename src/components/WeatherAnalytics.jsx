import React, { useState, useEffect } from 'react';
import { HiOutlineChartBar, HiOutlineDownload, HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineFire, HiOutlineSnowflake } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

const WeatherAnalytics = ({ history }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');

  // Generate analytics data from history
  useEffect(() => {
    if (history && history.length > 0) {
      const data = generateAnalyticsData();
      setAnalyticsData(data);
    }
  }, [history]);

  const generateAnalyticsData = () => {
    const now = new Date();
    const weekAgo = subDays(now, 7);
    
    // Filter history for the selected time range
    const filteredHistory = history.filter(item => {
      const itemDate = new Date(item.timestamp || Date.now());
      if (timeRange === 'week') {
        return itemDate >= weekAgo;
      } else if (timeRange === 'month') {
        return itemDate >= subDays(now, 30);
      }
      return true; // All time
    });

    // Temperature trends
    const temperatureData = filteredHistory.map(item => ({
      date: format(new Date(item.timestamp || Date.now()), 'MMM dd'),
      temperature: Math.round(item.temperature || 0),
      city: item.city
    }));

    // City frequency
    const cityFrequency = {};
    filteredHistory.forEach(item => {
      cityFrequency[item.city] = (cityFrequency[item.city] || 0) + 1;
    });

    const cityData = Object.entries(cityFrequency).map(([city, count]) => ({
      name: city,
      value: count
    }));

    // Weather conditions
    const conditionFrequency = {};
    filteredHistory.forEach(item => {
      const condition = item.description?.toLowerCase() || 'unknown';
      conditionFrequency[condition] = (conditionFrequency[condition] || 0) + 1;
    });

    const conditionData = Object.entries(conditionFrequency).map(([condition, count]) => ({
      name: condition,
      value: count
    }));

    // Temperature statistics
    const temperatures = filteredHistory.map(item => item.temperature).filter(Boolean);
    const avgTemp = temperatures.length > 0 ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 0;
    const maxTemp = Math.max(...temperatures, 0);
    const minTemp = Math.min(...temperatures, 100);

    // Most searched cities
    const topCities = Object.entries(cityFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({ city, searches: count }));

    return {
      temperatureData,
      cityData,
      conditionData,
      statistics: {
        totalSearches: filteredHistory.length,
        averageTemperature: Math.round(avgTemp),
        maxTemperature: Math.round(maxTemp),
        minTemperature: Math.round(minTemp),
        uniqueCities: Object.keys(cityFrequency).length
      },
      topCities
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const exportData = (format) => {
    if (!analyticsData) return;

    let data = '';
    if (format === 'csv') {
      // CSV format
      data = 'City,Temperature,Description,Timestamp\n';
      history.forEach(item => {
        data += `${item.city},${item.temperature},${item.description},${new Date(item.timestamp || Date.now()).toISOString()}\n`;
      });
    } else {
      // JSON format
      data = JSON.stringify(history, null, 2);
    }

    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-analytics-${timeRange}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!analyticsData) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No analytics data available
            </h3>
            <p className="text-gray-500">
              Search for some cities to see analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📊 Weather Analytics
        </h2>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'trends'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 hover:text-gray-800'
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab('cities')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'cities'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 hover:text-gray-800'
              }`}
            >
              Cities
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/80 backdrop-blur-lg border-2 border-blue-200 text-gray-800 px-4 py-2 rounded-lg outline-none focus:border-blue-400 focus:bg-white/90 transition-all duration-300"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={() => exportData('csv')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <HiOutlineDownload size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Searches</p>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.statistics.totalSearches}</p>
                  </div>
                  <HiOutlineChartBar className="text-blue-500 text-3xl" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Temperature</p>
                    <p className="text-2xl font-bold text-gray-800">{analyticsData.statistics.averageTemperature}°C</p>
                  </div>
                  <HiOutlineTrendingUp className="text-green-500 text-3xl" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Max Temperature</p>
                    <p className="text-2xl font-bold text-red-600">{analyticsData.statistics.maxTemperature}°C</p>
                  </div>
                  <HiOutlineFire className="text-red-500 text-3xl" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Min Temperature</p>
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.statistics.minTemperature}°C</p>
                  </div>
                  <HiOutlineSnowflake className="text-blue-500 text-3xl" />
                </div>
              </div>
            </div>

            {/* Weather Conditions Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Weather Conditions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.conditionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.conditionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top Searched Cities</h3>
                <div className="space-y-4">
                  {analyticsData.topCities.map((city, index) => (
                    <div key={city.city} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-800">{city.city}</span>
                      </div>
                      <span className="text-gray-600">{city.searches} searches</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div>
            <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Temperature Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Temperature"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'cities' && (
          <div>
            <div className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">City Search Frequency</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAnalytics; 