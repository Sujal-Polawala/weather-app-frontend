import React, { useState } from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import CompareModal from "./components/CompareModal";

function App() {
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-purple-300 to-cyan-200 animate-gradient-x">
        <div className="flex items-center justify-center px-4 sm:px-6 py-10">
          <div className="w-full max-w-5xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-500">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-10 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl flex flex-col items-center gap-2">
              <span className="inline-block text-5xl sm:text-7xl mb-2">🌦️</span>
              <span>SkyCast: <span className="font-black">Weather App</span></span>
            </h1>

            {/* Main Content */}
            <Home />
          </div>
        </div>

        {/* Floating Compare Button */}
        <button
          onClick={() => setIsCompareOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          title="Compare Cities"
        >
          <HiOutlineSwitchHorizontal size={20} />
          Compare Cities
        </button>

        <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
        
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