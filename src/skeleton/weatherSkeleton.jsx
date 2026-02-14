import React from "react";

const WeatherSkeleton = () => (
  <div className="w-full space-y-4">
    {/* Main Weather Card Skeleton */}
    <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Side - Gradient Background */}
        <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-6 sm:p-8 lg:p-10">
          <div className="space-y-6">
            <div className="skeleton-shimmer h-8 w-3/4 rounded-lg"></div>
            <div className="skeleton-shimmer h-4 w-1/2 rounded"></div>
            <div className="flex items-center gap-4 mt-8">
              <div className="skeleton-shimmer h-16 w-16 rounded-2xl"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-5 w-2/3 rounded"></div>
                <div className="skeleton-shimmer h-4 w-1/2 rounded"></div>
              </div>
            </div>
            <div className="skeleton-shimmer h-20 w-3/4 rounded-xl mt-6"></div>
          </div>
        </div>

        {/* Right Side - White Background */}
        <div className="p-6 sm:p-8 lg:p-10 bg-white">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="skeleton-shimmer h-6 w-6 rounded-lg mb-2"></div>
                <div className="skeleton-shimmer h-3 w-16 rounded mb-2"></div>
                <div className="skeleton-shimmer h-6 w-12 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="skeleton-shimmer h-5 w-5 rounded-lg mb-2"></div>
                <div className="skeleton-shimmer h-3 w-12 rounded mb-2"></div>
                <div className="skeleton-shimmer h-5 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default WeatherSkeleton;
