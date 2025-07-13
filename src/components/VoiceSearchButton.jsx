import React, { useState } from "react";
import { HiOutlineMicrophone } from "react-icons/hi";

const VoiceSearchButton = ({ onResult, icon }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      onResult(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <button
      type="button"
      onClick={handleVoiceSearch}
      title="Speak"
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-lg border border-purple-200 bg-white/40 backdrop-blur hover:bg-purple-100/60 hover:scale-105 hover:shadow-xl hover:cursor-pointer`}
    >
      {!isListening ? (
        icon ? icon : <HiOutlineMicrophone className="text-purple-600 text-xl" />
      ) : (
        <div className="flex gap-[1px]">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`bar bar-${i + 1}`} />
          ))}
        </div>
      )}
    </button>
  );
};

export default VoiceSearchButton;