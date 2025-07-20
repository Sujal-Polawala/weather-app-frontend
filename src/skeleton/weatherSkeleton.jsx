import React from "react";

const WeatherSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 p-6 rounded-3xl shadow-2xl mt-6 w-full max-w-xl mx-auto flex items-center h-40">
    {/* Left: Icon Circle */}
    <div className="h-20 w-20 bg-white/40 rounded-full mr-8 flex-shrink-0"></div>
    {/* Right: Stacked Lines */}
    <div className="flex-1 space-y-4">
      <div className="h-7 bg-white/40 rounded w-2/3"></div>
      <div className="h-5 bg-white/30 rounded w-1/3"></div>
      <div className="h-6 bg-white/30 rounded w-1/2"></div>
      <div className="h-4 bg-white/30 rounded w-1/4"></div>
      <div className="h-4 bg-white/20 rounded w-1/3"></div>
    </div>
  </div>
);

export default WeatherSkeleton;
