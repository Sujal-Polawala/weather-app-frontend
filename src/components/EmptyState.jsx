import React from "react";

const EmptyState = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/70 backdrop-blur-2xl border border-slate-200/60 rounded-2xl shadow-sm p-12 sm:p-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-5 rounded-2xl">
              <span className="text-4xl">🌤️</span>
            </div>
          </div>
        </div>
        
        <p className="text-slate-500 text-sm sm:text-base font-medium mb-2">
          Real-time weather insights
        </p>
        <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
          Search for a city above to get started
        </p>
      </div>
    </div>
  );
};

export default EmptyState;

