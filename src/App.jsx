import React from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <WeatherProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 bg-gradient-to-tr from-blue-400 via-purple-300 to-cyan-200 animate-gradient-x">
        <div className="w-full max-w-5xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-500">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-10 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl flex flex-col items-center gap-2">
            <span className="inline-block text-5xl sm:text-7xl mb-2">🌦️</span>
            <span>SkyCast: <span className="font-black">Weather App</span></span>
          </h1>
          <Home />
        </div>
      </div>
    </WeatherProvider>
  );
}

export default App;