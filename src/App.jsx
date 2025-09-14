import React, { useState, useRef } from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import CompareModal from "./components/CompareModal";

function App() {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const homeRef = useRef(null);

  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-purple-300 to-cyan-200 animate-gradient-x">
        <div className="flex items-center justify-center px-4 sm:px-6 py-10">
          <div className="w-full max-w-5xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-500">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl flex flex-col items-center gap-2">
              <span className="inline-block text-5xl sm:text-7xl mb-2">🌦️</span>
              <span>SkyCast: <span className="font-black">Weather App</span></span>
            </h1>

            {/* Header actions (like before) */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-1 shadow-lg">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="px-6 py-3 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 hover:cursor-pointer flex items-center gap-2"
                  title="Compare Cities"
                >
                  <HiOutlineArrowsExpand size={20} />
                  Compare Cities
                </button>
              </div>
            </div>

            {/* Main Content */}
            <Home ref={homeRef} />
          </div>
        </div>

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