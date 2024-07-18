import React, { useState, useRef } from 'react';

const SpeechToText = () => {
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleListen = () => {
    if (!recognitionRef.current) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setFinalText((prevText) => prevText + finalTranscript);
        setInterimText(interimTranscript);
      };

      recognitionRef.current = recognition;
    }

    recognitionRef.current.start();
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleClear = () => {
    setFinalText('');
    setInterimText('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Speech to Text Converter</h1>
        <div className="flex justify-center mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-700"
            onClick={handleListen}
            disabled={isListening}
          >
            Start Recording
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2 hover:bg-red-700"
            onClick={handleStop}
            disabled={!isListening}
          >
            Stop Recording
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
            onClick={handleClear}
          >
            Clear Text
          </button>
        </div>
        <div className="p-4 border rounded-lg min-h-[200px] bg-gray-50 overflow-y-auto">
          <p className="text-gray-800 whitespace-pre-wrap">
            {finalText + interimText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
