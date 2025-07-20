import React, { useState } from "react";
import Select from "react-select";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

// 🔹 Custom Tooltip Component (modern look)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div className="bg-white/90 p-4 rounded-xl shadow-xl text-base text-gray-800 min-w-[140px] border border-blue-200">
        <div className="font-bold text-blue-600 mb-1">{entry.city}</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🌡️</span>
          <span>Temp: <b>{entry.temperature}°C</b></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💨</span>
          <span>Wind: <b>{entry.wind_speed} km/h</b></span>
        </div>
      </div>
    );
  }
  return null;
};

// 🔹 Custom Legend to include Avg Temp
const CustomLegend = ({ payload, avgTemp }) => {
  return (
    <ul className="flex flex-wrap space-x-4 text-sm text-gray-700">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center space-x-1">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
      <li className="flex items-center space-x-1">
        <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
        <span className="text-gray-700 text-sm">
          Avg Temp: {avgTemp}°C
        </span>
      </li>
    </ul>
  );
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#6366f1" : "#e0e7ef",
    boxShadow: state.isFocused ? "0 0 0 2px #a5b4fc" : "none",
    borderRadius: "0.75rem", // rounded-xl
    minHeight: 44,
    fontSize: 16,
    paddingLeft: 4,
    paddingRight: 4,
    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    backgroundColor: "#fff",
    boxShadow: "0 8px 32px 0 rgba(80,80,200,0.10)",
    maxHeight: 200,
    overflowY: "auto",
    fontSize: 16,
    zIndex: 50,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#6366f1"
      : state.isFocused
      ? "#e0e7ff"
      : "#fff",
    color: state.isSelected ? "#fff" : "#334155",
    fontWeight: state.isSelected ? 700 : 500,
    cursor: "pointer",
    padding: "10px 16px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#334155",
    fontWeight: 600,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#6366f1" : "#64748b",
    "&:hover": { color: "#6366f1" },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  input: (provided) => ({
    ...provided,
    color: "#334155",
    fontWeight: 600,
  }),
};

const WeatherTrends = ({ history }) => {
  const [selectedCity, setSelectedCity] = useState("All");

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
      // icon: entry.icon, // Uncomment if you have weather icon info
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
      ).toFixed(2)
      : 0;

  return (
    <div className="bg-gradient-to-br from-blue-100/90 via-white/90 to-purple-100/90 border border-blue-200 rounded-2xl shadow p-4 sm:p-6 mb-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-xl font-bold mb-2 sm:mb-0">
          📊 Weather Trends {selectedCity !== "All" && `– ${selectedCity}`}
        </h2>
        <div className="w-60">
          <Select
            value={cityOptionsList.find((opt) => opt.value === selectedCity)}
            onChange={(opt) => setSelectedCity(opt.value)}
            options={cityOptionsList}
            styles={customStyles}
            isSearchable
            menuPlacement="auto"
            menuPosition="fixed"
            className="w-60"
          />
        </div>
      </div>

      {/* 🔹 Responsive scrollable container */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[700px] sm:min-w-full">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={filteredData} margin={{ top: 30, right: 30, left: 0, bottom: 40 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                interval={0}
                angle={40}
                textAnchor="start"
                height={60}
                tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }}
                tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '…' : value}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#e0e7ff', opacity: 0.2 }} />
              <Legend
                content={(props) => (
                  <CustomLegend {...props} avgTemp={avgTemp} />
                )}
              />
              <ReferenceLine
                y={parseFloat(avgTemp)}
                stroke="#22d3ee"
                strokeDasharray="3 3"
                label={{
                  value: `Avg Temp: ${avgTemp}°C`,
                  position: "top",
                  fill: "#22d3ee",
                  fontSize: 13,
                }}
              />
              {/* Temperature as smooth line with area gradient */}
              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#tempGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              {/* Wind speed as bars */}
              <Bar
                dataKey="wind_speed"
                name="Wind Speed (km/h)"
                fill="#facc15"
                barSize={22}
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              {/* Optional: Weather icons above each city label (if you have icon info)
              <XAxis ... tick={({ x, y, payload }) => (
                <g>
                  <image x={x-10} y={y-30} width={20} height={20} xlinkHref={getIconUrl(payload.value)} />
                  <text ...>{payload.value}</text>
                </g>
              )} />
              */}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeatherTrends;