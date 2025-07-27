import React from "react";

const WeatherSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-br from-blue-100/70 via-white/70 to-purple-100/70 border border-blue-200 p-6 sm:p-8 rounded-3xl shadow-2xl mt-6 w-full max-w-3xl mx-auto">
    
    {/* Header: Icon + Location */}
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="h-20 w-20 bg-white/40 rounded-full"></div>
      </div>
      <div className="h-6 sm:h-7 bg-white/40 rounded w-2/5 mx-auto mb-2"></div>
      <div className="h-5 bg-white/30 rounded w-1/3 mx-auto"></div>
    </div>

    {/* Weather Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Temperature */}
      <div className="text-center space-y-4">
        <div className="h-14 sm:h-16 bg-white/40 rounded w-1/2 mx-auto"></div>
        <div className="h-5 bg-white/30 rounded w-2/3 mx-auto"></div>
        <div className="h-6 bg-white/30 rounded w-1/2 mx-auto"></div>
      </div>

      {/* Detail Cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-lg border border-blue-200 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-white/40 rounded-full"></div>
                <div className="h-4 bg-white/40 rounded w-28"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-white/30 rounded w-16 ml-auto"></div>
                <div className="h-4 bg-white/30 rounded w-12 ml-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Sun Timings */}
    <div className="bg-gradient-to-r from-yellow-200/60 to-orange-200/60 backdrop-blur-lg border border-yellow-200 rounded-2xl p-6 shadow">
      <div className="grid grid-cols-2 gap-6 text-center">
        {[1, 2].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 bg-white/40 rounded-full mb-2"></div>
            <div className="h-4 bg-white/40 rounded w-16"></div>
            <div className="h-5 bg-white/30 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WeatherSkeleton;
