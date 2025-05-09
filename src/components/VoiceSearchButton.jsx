import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const VoiceSearchButton = ({ onResult }) => {
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
  className={`w-8 h-8 flex items-center hover:cursor-pointer justify-center rounded-full transition-all
    ${isListening ? "bg-red-600" : "bg-purple-600 hover:bg-purple-700"}`}
>
  {!isListening ? (
    <FaMicrophone className="text-white text-sm" />
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