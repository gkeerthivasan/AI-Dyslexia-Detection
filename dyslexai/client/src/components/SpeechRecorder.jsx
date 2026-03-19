import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

const SpeechRecorder = ({ 
  onTranscript = null, 
  onRecordingStart = null, 
  onRecordingStop = null,
  maxDuration = 300, // 5 minutes
  className = '' 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      setError('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
      setDuration(0);
      finalTranscriptRef.current = '';
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      
      if (onRecordingStart) onRecordingStart();
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      const currentTranscript = finalTranscriptRef.current + interimTranscript;
      setTranscript(currentTranscript);
      
      if (onTranscript) {
        onTranscript(currentTranscript, event.results[i].isFinal);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'An error occurred during speech recognition.';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone is not available. Please check your permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission was denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not allowed.';
          break;
      }
      
      setError(errorMessage);
      stopRecording();
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (onRecordingStop) {
        onRecordingStop(finalTranscriptRef.current.trim());
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onTranscript, onRecordingStart, onRecordingStop, maxDuration]);

  const startRecording = () => {
    if (!recognitionRef.current || !isSupported) return;
    
    try {
      setTranscript('');
      finalTranscriptRef.current = '';
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  };

  const togglePause = () => {
    if (!recognitionRef.current) return;
    
    if (isPaused) {
      recognitionRef.current.start();
      setIsPaused(false);
    } else {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="text-danger-600 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Recording Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`mic-button ${isRecording ? 'recording' : ''} focus:outline-none`}
        disabled={!isSupported}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {/* Status and Duration */}
      <div className="text-center space-y-2">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {isRecording ? (
            isPaused ? 'Recording Paused' : 'Recording...'
          ) : (
            'Click to start recording'
          )}
        </div>
        
        {isRecording && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {formatTime(duration)} / {formatTime(maxDuration)}
            </span>
            
            <button
              onClick={togglePause}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-danger-600 text-sm text-center max-w-md">
          {error}
        </div>
      )}

      {/* Live Transcript */}
      {transcript && (
        <div className="w-full max-w-2xl">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Live Transcript:
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {transcript}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;
