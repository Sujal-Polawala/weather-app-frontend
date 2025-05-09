import React from "react";

const WeatherSkeleton = () => {
  return (
    <div className="animate-pulse bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg mt-6 text-white w-full max-w-xl">
      <div className="h-6 bg-gray-500/40 rounded w-3/4 mb-4"></div>
      <div className="h-5 bg-gray-500/40 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-500/40 rounded w-2/3 mb-3"></div>
      <div className="h-4 bg-gray-500/40 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-500/40 rounded w-2/5"></div>
    </div>
  );
};

export default WeatherSkeleton;