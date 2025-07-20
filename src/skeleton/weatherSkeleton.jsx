import React from "react";

const WeatherSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-br from-blue-100/60 via-white/60 to-purple-100/60 border border-blue-200 p-6 sm:p-8 rounded-3xl shadow-2xl mt-6 w-full max-w-3xl mx-auto">
    {/* Icon and City */}
    <div className="flex flex-col items-center mb-8">
      <div className="h-20 w-20 sm:h-24 sm:w-24 bg-white/40 rounded-full mb-4"></div>
      <div className="h-7 bg-white/40 rounded w-2/3 mb-2"></div>
      <div className="h-5 bg-white/30 rounded w-1/3 mb-1"></div>
    </div>
    {/* Main Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="space-y-4">
        <div className="h-10 bg-white/40 rounded w-3/4 mx-auto"></div>
        <div className="h-5 bg-white/30 rounded w-1/2 mx-auto"></div>
        <div className="h-6 bg-white/30 rounded w-2/3 mx-auto"></div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-white/40 rounded w-2/3 mx-auto"></div>
        <div className="h-5 bg-white/30 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-white/30 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
    {/* Details Section */}
    <div className="grid grid-cols-2 gap-6 text-center mb-8">
      <div>
        <div className="h-6 w-6 bg-white/40 rounded-full mx-auto mb-2"></div>
        <div className="h-4 bg-white/30 rounded w-2/3 mx-auto"></div>
      </div>
      <div>
        <div className="h-6 w-6 bg-white/40 rounded-full mx-auto mb-2"></div>
        <div className="h-4 bg-white/30 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
    {/* Bottom Bar */}
    <div className="h-4 bg-white/30 rounded w-1/2 mx-auto"></div>
  </div>
);

export default WeatherSkeleton;