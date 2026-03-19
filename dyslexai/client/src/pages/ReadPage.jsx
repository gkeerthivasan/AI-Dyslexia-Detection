import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { sessionsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ReadPage = () => {
  const { user } = useAuth();
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. This is a sample text for reading practice.');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [fullTranscript, setFullTranscript] = useState(''); // Track full transcript
  
  const { isListening, transcript, isSupported, error: speechError, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const words = text.split(' ');
  const currentWord = words[currentWordIndex] || ''; // Safety check for undefined
  const isCompleted = isReading && currentWordIndex >= words.length - 1; // Only completed if actually started reading

  useEffect(() => {
    if (transcript && isReading) {
      // Clean and normalize the spoken word
      const cleanSpokenWord = transcript.toLowerCase()
        .replace(/[.,!?;:'"]/g, '') // Remove punctuation
        .trim();
      
      // Clean and normalize the current word
      const cleanCurrentWord = currentWord.toLowerCase()
        .replace(/[.,!?;:'"]/g, '') // Remove punctuation
        .trim();
      
      console.log(`Comparing: "${cleanSpokenWord}" vs "${cleanCurrentWord}"`);
      console.log('Current word index:', currentWordIndex);
      console.log('Current word:', currentWord);
      console.log('Words array:', words);
      
      // Check if the spoken word matches the current word
      if (cleanSpokenWord === cleanCurrentWord) {
        console.log('Word matched!');
        setCurrentWordIndex(prev => Math.min(prev + 1, words.length - 1));
        setErrors(prev => prev.filter(error => error.index !== currentWordIndex));
        // Add to full transcript
        setFullTranscript(prev => prev ? `${prev} ${currentWord}` : currentWord);
        resetTranscript();
      } else if (cleanSpokenWord && cleanSpokenWord !== cleanCurrentWord) {
        // Add error if word doesn't match
        console.log('Word mismatched');
        setErrors(prev => [...prev.filter(error => error.index !== currentWordIndex), { 
          index: currentWordIndex, 
          word: currentWord,
          spoken: transcript 
        }]);
      }
    }
  }, [transcript, currentWord, isReading, words.length, currentWordIndex, resetTranscript]);

  // Handle completion
  useEffect(() => {
    console.log('Completion check:', { isCompleted, isReading, currentWordIndex, wordsLength: words.length });
    if (isCompleted && isReading) {
      console.log('Triggering session save...');
      handleSaveSession();
      setIsReading(false);
      stopListening();
      // You could show a completion message here
      setTimeout(() => {
        alert('🎉 Congratulations! You have completed the reading practice!');
      }, 500);
    }
  }, [isCompleted, isReading, stopListening]);

  const handleSaveSession = async () => {
    if (!sessionStartTime) return;
    
    try {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000); // in seconds
      const accuracy = Math.round(((words.length - errors.length) / words.length) * 100);
      const wpm = Math.round((words.length / duration) * 60); // words per minute
      
      const sessionData = {
        title: 'Reading Practice Session',
        textContent: text,
        transcript: fullTranscript || '', // Include accumulated full transcript
        duration,
        wpm,
        accuracy,
        isCompleted: true,
        completedAt: new Date().toISOString()
      };
      
      console.log('Sending session data:', sessionData);
      await sessionsAPI.createSession(sessionData);
      console.log('Session saved successfully!');
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleStartReading = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    
    // Reset states for new reading session
    setCurrentWordIndex(0);
    setErrors([]);
    setSessionStartTime(Date.now());
    setIsReading(true);
    setFullTranscript(''); // Reset transcript
    resetTranscript();
    startListening();
  };

  const handleStopReading = () => {
    setIsReading(false);
    stopListening();
  };

  const handleWordClick = (index) => {
    setCurrentWordIndex(index);
  };

  const handleRetryWord = () => {
    setErrors(prev => prev.filter(error => error.index !== currentWordIndex));
    resetTranscript();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Reading Practice</h1>
        
        {/* Reading Controls */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Reading Session</h2>
            <div className="flex gap-4">
              {!isReading ? (
                <button
                  onClick={handleStartReading}
                  className="btn btn-primary"
                >
                  Start Reading
                </button>
              ) : (
                <button
                  onClick={handleStopReading}
                  className="btn btn-danger"
                >
                  Stop Reading
                </button>
              )}
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {currentWordIndex + 1} / {words.length}</span>
              <span>{Math.round((currentWordIndex + 1) / words.length * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill"
                style={{ width: `${(currentWordIndex + 1) / words.length * 100}%` }}
              />
            </div>
          </div>

          {/* Speech Recognition Status */}
          {isReading && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm mb-2">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-gray-600">
                  {isListening ? 'Listening...' : 'Not listening'}
                </span>
              </div>
              
              {/* Speech Recognition Error */}
              {speechError && (
                <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
                  ⚠️ {speechError}
                  <button 
                    onClick={handleRetryWord}
                    className="ml-2 text-red-600 underline text-xs"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* Current Transcript */}
              {transcript && (
                <div className="text-blue-600 text-sm mt-2">
                  Heard: "{transcript}"
                </div>
              )}
            </div>
          )}

          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-yellow-800 text-sm">
                ⚠️ Speech recognition is not supported in your browser. Please use Chrome or Edge for the best experience.
              </div>
            </div>
          )}
        </div>

        {/* Reading Text */}
        <div className="bg-white rounded-xl shadow-card p-8 mb-8">
          <div className="reading-text text-lg leading-relaxed">
            {words.map((word, index) => (
              <span
                key={index}
                onClick={() => handleWordClick(index)}
                className={`inline-block px-2 py-1 mx-1 rounded cursor-pointer transition-all duration-200 ${
                  index === currentWordIndex
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : errors.some(error => error.index === index)
                    ? 'bg-red-100 text-red-700 word-error'
                    : 'hover:bg-gray-100'
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Current Word Display */}
        {isReading && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Word:</h3>
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {currentWord}
            </div>
            {transcript && (
              <div className="text-sm text-gray-600">
                You said: <span className="font-medium">{transcript}</span>
              </div>
            )}
          </div>
        )}

        {/* Errors Summary */}
        {errors.length > 0 && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Reading Errors ({errors.length})</h3>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-medium text-red-700">Expected:</span>
                    <span className="ml-2">{error.word}</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-600">You said:</span>
                    <span className="ml-2">{error.spoken}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadPage;
