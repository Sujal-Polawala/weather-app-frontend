import React, { useState } from "react";
import Select from "react-select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import { FaChartLine, FaTemperatureHigh, FaWind } from "react-icons/fa";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-lg p-3 rounded-xl shadow-lg border border-slate-200 text-sm min-w-[140px]">
        <div className="font-bold text-slate-900 mb-2">{entry.city}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-700">
            <span>🌡️</span>
            <span>Temp: <b className="text-slate-900">{entry.temperature}°C</b></span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span>💨</span>
            <span>Wind: <b className="text-slate-900">{entry.wind_speed} km/h</b></span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#475569" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 2px #cbd5e1" : "none",
    borderRadius: "0.75rem",
    minHeight: 40,
    fontSize: 14,
    cursor: "pointer",
    "&:hover": {
      borderColor: "#475569",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    backgroundColor: "#fff",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    fontSize: 14,
    zIndex: 50,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#475569"
      : state.isFocused
      ? "#f1f5f9"
      : "#fff",
    color: state.isSelected ? "#fff" : "#334155",
    fontWeight: state.isSelected ? 600 : 500,
    cursor: "pointer",
    padding: "8px 16px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#334155",
    fontWeight: 600,
  }),
};

const WeatherTrends = ({ history }) => {
  const [selectedCity, setSelectedCity] = useState("All");

  if (!history || history.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-2xl border border-slate-200/60 rounded-2xl p-8 text-center">
        <FaChartLine className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500 text-sm">No weather history available</p>
        <p className="text-slate-400 text-xs mt-1">Search for cities to see trends</p>
      </div>
    );
  }

  const cityOptions = Array.from(new Set(history.map((h) => h.city)));
  const cityOptionsList = [
    { value: "All", label: "All Cities" },
    ...cityOptions.map((city) => ({ value: city, label: city })),
  ];

  const formattedData = [...history]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      city: entry.city,
      temperature: entry.temperature,
      wind_speed: entry.wind_speed || 0,
      label: `${entry.city}`,
    }));

  const filteredData =
    selectedCity === "All"
      ? formattedData
      : formattedData.filter((d) => d.city === selectedCity);

  const avgTemp =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, d) => sum + d.temperature, 0) /
          filteredData.length
        ).toFixed(1)
      : 0;

  // Calculate trend indicators
  const getTrendData = () => {
    if (filteredData.length < 2) return null;
    
    const temps = filteredData.map(d => d.temperature);
    const firstHalf = temps.slice(0, Math.floor(temps.length / 2));
    const secondHalf = temps.slice(Math.floor(temps.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return {
      trend: secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable',
      change: Math.abs(secondAvg - firstAvg).toFixed(1)
    };
  };

  const trendData = getTrendData();

  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-slate-200/60 rounded-2xl shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <FaChartLine className="text-slate-600" />
            Weather Trends
            {selectedCity !== "All" && (
              <span className="text-slate-500 font-normal text-base">– {selectedCity}</span>
            )}
          </h2>
          {trendData && (
            <p className="text-xs text-slate-500 mt-1">
              {trendData.trend === 'up' && '📈'} 
              {trendData.trend === 'down' && '📉'} 
              {trendData.trend === 'stable' && '➡️'} 
              {' '}Temperature {trendData.trend === 'up' ? 'increasing' : trendData.trend === 'down' ? 'decreasing' : 'stable'} by {trendData.change}°C
            </p>
          )}
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={cityOptionsList.find((opt) => opt.value === selectedCity)}
            onChange={(opt) => setSelectedCity(opt.value)}
            options={cityOptionsList}
            styles={customSelectStyles}
            isSearchable
            menuPlacement="auto"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaTemperatureHigh className="text-orange-500 text-sm" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Avg Temperature</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgTemp}°C</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaWind className="text-blue-500 text-sm" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Data Points</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{filteredData.length}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cities Tracked</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{cityOptions.length}</div>
        </div>
      </div>

      {/* Chart */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(value) => value.length > 8 ? value.slice(0, 8) + '…' : value}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#475569"
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#475569', stroke: '#fff', strokeWidth: 1 }}
                  activeDot={{ r: 5 }}
                />
                <Bar
                  dataKey="wind_speed"
                  name="Wind Speed (km/h)"
                  fill="#94a3b8"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">No data available for selected city</p>
        </div>
      )}
    </div>
  );
};

export default WeatherTrends;
