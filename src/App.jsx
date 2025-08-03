import React, { useState } from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import MultiCityComparison from "./components/MultiCityComparison";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { HiOutlineViewGrid, HiOutlineHome } from "react-icons/hi";

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-purple-300 to-cyan-200 animate-gradient-x relative">
        {/* Floating Navigation */}
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-2 shadow-2xl">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('home')}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  currentView === 'home'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/30 text-white hover:bg-white/40'
                }`}
                title="Weather App"
              >
                <HiOutlineHome size={20} />
                <span className="hidden sm:inline text-sm font-medium">Weather</span>
              </button>
              <button
                onClick={() => setCurrentView('comparison')}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  currentView === 'comparison'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/30 text-white hover:bg-white/40'
                }`}
                title="Multi-City Comparison"
              >
                <HiOutlineViewGrid size={20} />
                <span className="hidden sm:inline text-sm font-medium">Compare</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentView === 'home' ? (
          <div className="flex items-center justify-center px-4 sm:px-6 py-10">
            <div className="w-full max-w-5xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-500">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-10 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl flex flex-col items-center gap-2">
                <span className="inline-block text-5xl sm:text-7xl mb-2">🌦️</span>
                <span>SkyCast: <span className="font-black">Weather App</span></span>
              </h1>
              <Home />
            </div>
          </div>
        ) : (
          <div className="pt-20 px-4 sm:px-6">
            <MultiCityComparison />
          </div>
        )}
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      </div>
    </WeatherProvider>
  );
}

export default App;