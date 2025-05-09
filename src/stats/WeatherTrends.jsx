import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// 🔹 Custom Tooltip Component (unchanged)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg text-sm text-gray-700">
        <p>
          <strong>{entry.city}</strong> – {label}
        </p>
        <p>🌡️ Temp: {entry.temperature}°C</p>
        <p>💨 Wind: {entry.wind_speed} km/h</p>
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

const WeatherTrends = ({ history }) => {
  const [selectedCity, setSelectedCity] = useState("All");

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

  const cityOptions = Array.from(new Set(history.map((h) => h.city)));

  const avgTemp =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, d) => sum + d.temperature, 0) /
          filteredData.length
        ).toFixed(2)
      : 0;

  return (
    <div className="w-full mt-10 p-4 bg-white/10 rounded-2xl text-current">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-2 sm:mb-0">
          📊 Weather Trends {selectedCity !== "All" && `– ${selectedCity}`}
        </h2>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="text-black rounded-md p-2 bg-white shadow-sm outline-none hover:cursor-pointer"
        >
          <option value="All">All Cities</option>
          {cityOptions.map((city, idx) => (
            <option key={idx} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Responsive scrollable container */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ccc" />
              <XAxis
                dataKey="label"
                stroke="#000000"
                interval={0}
                angle={0}
                textAnchor="end"
              />
              <YAxis stroke="#000000" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={(props) => (
                  <CustomLegend {...props} avgTemp={avgTemp} />
                )}
              />
              <Bar
                dataKey="temperature"
                name="Temperature (°C)"
                fill="#3b82f6"
                barSize={30}
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="wind_speed"
                name="Wind Speed (km/h)"
                fill="#facc15"
                barSize={30}
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              {filteredData.length > 0 && (
                <ReferenceLine
                  y={parseFloat(avgTemp)}
                  stroke="#97ffab"
                  strokeDasharray="3 3"
                  label={{
                    value: `Avg Temp: ${avgTemp}°C`,
                    position: "top",
                    fill: "#97ffab",
                    fontSize: 12,
                  }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeatherTrends;