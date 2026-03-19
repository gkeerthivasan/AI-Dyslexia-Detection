import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log('Speech recognition started');
      };
      
      recognitionInstance.onresult = (event) => {
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
        
        if (finalTranscript) {
          setTranscript(finalTranscript.trim());
          console.log('Final transcript:', finalTranscript.trim());
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
        
        // Handle specific errors
        switch (event.error) {
          case 'no-speech':
            setError('No speech was detected. Please try again.');
            break;
          case 'audio-capture':
            setError('No microphone was found. Please ensure a microphone is connected.');
            break;
          case 'not-allowed':
            setError('Microphone permission was denied. Please allow microphone access.');
            break;
          case 'network':
            setError('Network error occurred. Please check your internet connection.');
            break;
          default:
            setError(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };
      
      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported || !recognition) {
      setError('Speech recognition is not available');
      return;
    }
    
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setTranscript('');
      setError(null);
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      
      if (error.name === 'NotAllowedError') {
        setError('Microphone permission was denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        setError('No microphone found. Please ensure a microphone is connected.');
      } else {
        setError('Failed to start speech recognition. Please try again.');
      }
    }
  }, [recognition, isSupported]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};
