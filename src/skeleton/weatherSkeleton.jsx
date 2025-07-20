import React from "react";

const WeatherSkeleton = () => {
  return (
    <div className="animate-pulse bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 p-6 sm:p-8 rounded-3xl shadow-2xl mt-6 w-full max-w-xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white/40 rounded-full mb-4"></div>
        <div className="h-6 bg-white/40 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-white/30 rounded w-1/3 mb-1"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <div className="h-6 bg-white/40 rounded w-3/4"></div>
          <div className="h-4 bg-white/30 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          <div className="h-5 bg-white/40 rounded w-2/3"></div>
          <div className="h-4 bg-white/30 rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-4 bg-white/30 rounded w-1/2 mx-auto"></div>
    </div>
  );
};

export default WeatherSkeleton;