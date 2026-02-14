import React, { useState, useRef } from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { FaCloud } from "react-icons/fa";
import CompareModal from "./components/CompareModal";

function App() {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const homeRef = useRef(null);

  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
        {/* Modern Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo and App Name */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur-sm opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 rounded-xl shadow-lg">
                    <FaCloud className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    SkyCast
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Weather Forecast</p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 hover:cursor-pointer"
                  title="Compare Cities"
                >
                  <HiOutlineSwitchHorizontal size={18} />
                  <span>Compare</span>
                </button>
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="sm:hidden p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 hover:cursor-pointer"
                  title="Compare Cities"
                >
                  <HiOutlineSwitchHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Home ref={homeRef} />
        </main>

        <CompareModal 
          isOpen={isCompareOpen} 
          onClose={() => setIsCompareOpen(false)}
          onCityAdded={(newCity) => {
            // Trigger history refresh in Home component
            if (homeRef.current && homeRef.current.refreshHistory) {
              homeRef.current.refreshHistory();
            }
          }}
        />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
              style: {
                border: "1px solid rgba(16, 185, 129, 0.3)",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              style: {
                border: "1px solid rgba(239, 68, 68, 0.3)",
              },
            },
          }}
        />
      </div>
    </WeatherProvider>
  );
}

export default App;