// frontend/src/hooks/useSpeechRecognition.js
import { useState, useEffect, useRef } from 'react';

// This will hold the browser's SpeechRecognition instance
let recognition = null;
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!recognition) return;

    // This event fires when the microphone picks up a result
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    // This event fires when the listening session ends
    recognition.onend = () => {
      setIsListening(false);
    };

    // This event handles errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    }

  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript(''); // Clear previous transcript
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition // A boolean to check if the browser supports this feature
  };
};