import React, { useState } from "react";
import { HiOutlineMicrophone } from "react-icons/hi";

const VoiceSearchButton = ({ onResult, icon }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setIsListening(false);
      setIsProcessing(true);
      onResult(spokenText);
      
      // Reset processing state after a delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <button
      type="button"
      onClick={handleVoiceSearch}
      disabled={isListening || isProcessing}
      title="Speak"
      className={`flex items-center justify-center rounded-2xl transition-all shadow-lg border border-purple-200 bg-white/40 backdrop-blur hover:bg-purple-100/60 hover:scale-105 hover:shadow-xl hover:shadow-purple-400/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'animate-pulse' : ''} ${isProcessing ? 'animate-spin' : ''} px-4 py-3`}
    >
      {!isListening && !isProcessing ? (
        icon ? icon : <HiOutlineMicrophone className="text-purple-600 text-lg transition-all duration-300" />
      ) : isListening ? (
        <div className="flex gap-[1px]">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`bar bar-${i + 1}`} />
          ))}
        </div>
      ) : (
        <HiOutlineMicrophone className="text-purple-600 text-lg animate-spin" />
      )}
    </button>
  );
};

export default VoiceSearchButton;