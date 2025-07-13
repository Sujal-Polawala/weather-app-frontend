import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const StatBox = ({ label, value, unit }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-full sm:w-1/3 text-center text-white shadow-md"
  >
    <div className="text-sm text-gray-300">{label}</div>
    <motion.div
      key={value}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="text-3xl font-bold text-blue-400"
    >
      {value} {unit}
    </motion.div>
  </motion.div>
);

const WeatherStats = ({ history }) => {
  const last7 = history.slice(-7);
  if (last7.length === 0) return null;

  const avg = (key) =>
    (last7.reduce((sum, h) => sum + h[key], 0) / last7.length).toFixed(1);

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8 w-full">
      <StatBox label="Avg Temp (°C)" value={avg("temperature")} unit="°C" />
      <StatBox label="Avg Wind Speed" value={avg("wind_speed")} unit="km/h" />
      <StatBox label="Entries" value={last7.length} unit="/ 7" />
    </div>
  );
};

export default WeatherStats;