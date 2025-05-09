import React from "react";
import { WeatherProvider } from "./context/weatherContext.jsx";
import Home from "./pages/Home";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <WeatherProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-[#41545d] via-[#334348] to-[#3f5964] flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-5xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-500">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-7 tracking-tight drop-shadow-md text-white">
            🌎 SkyCast Weather
          </h1>
          <Home />
        </div>
      </div>
    </WeatherProvider>
  );
}

export default App;