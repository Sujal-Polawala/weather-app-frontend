import React from "react";
import { FaCloudSun, FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const EmptyState = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-xl p-8 sm:p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-full">
              <FaCloudSun className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Welcome to SkyCast
        </h3>
        <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-md mx-auto">
          Search for any city to get real-time weather information, forecasts, and AI-powered suggestions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
            <FaSearch className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Search City</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
            <FaMapMarkerAlt className="w-6 h-6 text-purple-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Use Location</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-xl">
            <FaCloudSun className="w-6 h-6 text-cyan-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Get Forecast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

