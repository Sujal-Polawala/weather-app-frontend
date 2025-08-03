import React, { useState } from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import MultiCityComparison from "./components/MultiCityComparison";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-purple-300 to-cyan-200 animate-gradient-x">
        {/* Navigation */}
        <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
          <div className="max-w-7xl mx-auto flex justify-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentView === 'home'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🌤️ Weather App
            </button>
            <button
              onClick={() => setCurrentView('comparison')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentView === 'comparison'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🌍 Multi-City Comparison
            </button>
          </div>
        </nav>

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
          <MultiCityComparison />
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