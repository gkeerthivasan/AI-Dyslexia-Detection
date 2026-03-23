import React, { useState, useEffect } from 'react';
import { exercisesAPI } from '../utils/api';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAccessibility } from '../context/AccessibilityContext';
import { BookOpen, Brain, Zap, Type, Eye, Timer, Award, Target, Mic, MicOff } from 'lucide-react';

const ExercisePage = () => {
  const { getReadingStyles } = useAccessibility();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        console.log('Loading exercises...');
        const response = await exercisesAPI.getExercises();
        console.log('Exercises response:', response);
        setExercises(response.data?.exercises || []);
        console.log('Exercises set:', response.data?.exercises || []);
      } catch (error) {
        console.error('Failed to load exercises:', error);
        // Set fallback exercises if API fails
        setExercises([
          {
            _id: 'fallback-1',
            exerciseId: 'word-recognition-1',
            title: 'Basic Word Recognition',
            description: 'Practice recognizing and reading common sight words',
            difficulty: 'easy',
            exerciseType: 'word-recognition',
            content: ['the', 'and', 'is', 'it', 'in'],
            instructions: 'Read each word aloud clearly.',
            timeLimit: 180
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, []);

  const getExerciseIcon = (type) => {
    switch (type) {
      case 'word-recognition':
        return <BookOpen className="w-8 h-8" />;
      case 'comprehension':
        return <Brain className="w-8 h-8" />;
      case 'fluency':
        return <Zap className="w-8 h-8" />;
      case 'phonics':
        return <Type className="w-8 h-8" />;
      case 'sentence-reading':
        return <Eye className="w-8 h-8" />;
      default:
        return <Target className="w-8 h-8" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading exercises...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="container mx-auto px-4 py-8"
      style={{ backgroundColor: getReadingStyles().backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 
          className="text-3xl font-bold mb-8"
          style={{ 
            fontFamily: getReadingStyles().fontFamily,
            fontSize: `${parseInt(getReadingStyles().fontSize) * 1.5}px`,
            color: getReadingStyles().color
          }}
        >
          Reading Exercises
        </h1>
        
        {!selectedExercise ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div key={exercise._id} className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => {
                     console.log('Exercise clicked:', exercise);
                     setSelectedExercise(exercise);
                   }}>
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg text-primary-600 mr-4">
                    {getExerciseIcon(exercise.exerciseType)}
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-semibold text-gray-800"
                      style={{ 
                        fontFamily: getReadingStyles().fontFamily,
                        fontSize: getReadingStyles().fontSize,
                        color: getReadingStyles().color
                      }}
                    >
                      {exercise.title}
                    </h3>
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}
                      style={{ 
                        fontFamily: getReadingStyles().fontFamily,
                        fontSize: `${parseInt(getReadingStyles().fontSize) * 0.75}px`
                      }}
                    >
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
                
                <p 
                  className="text-gray-600 mb-4"
                  style={{ 
                    fontFamily: getReadingStyles().fontFamily,
                    fontSize: getReadingStyles().fontSize,
                    lineHeight: getReadingStyles().lineHeight,
                    letterSpacing: getReadingStyles().letterSpacing,
                    color: getReadingStyles().color
                  }}
                >
                  {exercise.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Timer className="w-4 h-4 mr-1" />
                  <span>{formatDuration(exercise.timeLimit || 300)}</span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Award className="w-4 h-4 mr-1" />
                    <span>{exercise.scoring?.correct || 10} points</span>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    Start Exercise
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ExerciseDetail 
            exercise={selectedExercise} 
            onBack={() => setSelectedExercise(null)} 
            getDifficultyColor={getDifficultyColor}
            formatDuration={formatDuration}
          />
        )}
      </div>
    </div>
  );
};

const ExerciseDetail = ({ exercise, onBack, getDifficultyColor, formatDuration }) => {
  console.log('ExerciseDetail rendered with exercise:', exercise);
  
  // Speech recognition hook
  const { isListening, transcript, isSupported, error: speechError, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speechMatch, setSpeechMatch] = useState(null);

  const handleStart = () => {
    setIsStarted(true);
    // Start listening for speech recognition
    if (isSupported) {
      resetTranscript();
      startListening();
    }
  };

  // Handle speech recognition transcript
  useEffect(() => {
    if (transcript && isStarted && isListening) {
      const currentWord = exercise.content[currentIndex];
      const normalizedTranscript = transcript.toLowerCase().trim();
      const normalizedWord = currentWord.toLowerCase().trim();
      
      // Handle first word specially - be more lenient
      const isFirstWord = currentIndex === 0;
      
      console.log(`Exercise comparing: "${normalizedTranscript}" vs "${normalizedWord}"`);
      console.log('Is first word:', isFirstWord);
      
      // Check if the spoken word matches the target word
      if (normalizedTranscript === normalizedWord) {
        setSpeechMatch(true);
        console.log('Exercise word matched!');
        // Auto-advance after correct match
        setTimeout(() => {
          handleAnswer('correct');
          setSpeechMatch(null);
          resetTranscript();
        }, 1000);
      } else if (isFirstWord && normalizedTranscript.includes(normalizedWord)) {
        // For first word, be more lenient - accept if it contains the word
        setSpeechMatch(true);
        console.log('Exercise first word partially matched - accepting');
        setTimeout(() => {
          handleAnswer('correct');
          setSpeechMatch(null);
          resetTranscript();
        }, 1000);
      } else if (normalizedTranscript.length > 0) {
        setSpeechMatch(false);
        console.log('Exercise word mismatched');
      }
    }
  }, [transcript, isStarted, isListening, currentIndex, exercise.content]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);

    if (currentIndex < (exercise.content.length - 1)) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const renderExerciseContent = () => {
    switch (exercise.exerciseType) {
      case 'word-recognition':
        return (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {exercise.content[currentIndex]}
              </h2>
              <p className="text-gray-600">Read this word aloud clearly</p>
            </div>
            
            {/* Speech Recognition Status */}
            <div className="mb-6">
              {!isSupported ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">Speech recognition is not supported in your browser. Please use Chrome or Edge.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {speechError && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-600">Microphone error: {speechError}</p>
                    </div>
                  )}
                  
                  {speechMatch === true && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-600 font-semibold">✓ Correct! Moving to next word...</p>
                    </div>
                  )}
                  
                  {speechMatch === false && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-600">Not quite right. Try again!</p>
                    </div>
                  )}
                  
                  {/* Transcript Display */}
                  {transcript && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-600">You said: "{transcript}"</p>
                    </div>
                  )}
                  
                  {/* Microphone Button */}
                  <button
                    onClick={handleMicToggle}
                    className={`mic-button ${isListening ? 'recording' : ''}`}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    {isListening ? 'Listening...' : 'Click microphone to start'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Manual Controls */}
            <div className="space-x-4 mt-6">
              <button onClick={() => handleAnswer('correct')} className="btn btn-success">
                Correct ✓
              </button>
              <button onClick={() => handleAnswer('incorrect')} className="btn btn-secondary">
                Skip →
              </button>
            </div>
          </div>
        );

      case 'sentence-reading':
        return (
          <div className="text-center">
            <div className="mb-8">
              <p className="text-2xl text-gray-800 leading-relaxed">
                {exercise.content[currentIndex]}
              </p>
              <p className="text-gray-600 mt-4">Read this sentence at a comfortable pace</p>
            </div>
            
            {/* Speech Recognition Status */}
            <div className="mb-6">
              {!isSupported ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">Speech recognition is not supported in your browser. Please use Chrome or Edge.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {speechError && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-600">Microphone error: {speechError}</p>
                    </div>
                  )}
                  
                  {/* Transcript Display */}
                  {transcript && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-600">You said: "{transcript}"</p>
                    </div>
                  )}
                  
                  {/* Microphone Button */}
                  <button
                    onClick={handleMicToggle}
                    className={`mic-button ${isListening ? 'recording' : ''}`}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    {isListening ? 'Listening...' : 'Click microphone to start reading'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-x-4">
              <button onClick={() => handleAnswer('correct')} className="btn btn-success">
                Completed ✓
              </button>
              <button onClick={() => handleAnswer('incorrect')} className="btn btn-secondary">
                Skip →
              </button>
            </div>
          </div>
        );

      case 'comprehension':
        const passage = exercise.content[0];
        const currentQuestion = passage.questions[currentIndex];
        return (
          <div>
            <div className="mb-8">
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-800 leading-relaxed">{passage.passage}</p>
              </div>
              {currentQuestion && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Question {currentIndex + 1}: {currentQuestion.question}
                  </h3>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index === currentQuestion.correct)}
                        className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'phonics':
        return (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {exercise.content[currentIndex]}
              </h2>
              <p className="text-gray-600">Focus on the short vowel sound in this word</p>
            </div>
            
            {/* Speech Recognition Status */}
            <div className="mb-6">
              {!isSupported ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">Speech recognition is not supported in your browser. Please use Chrome or Edge.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {speechError && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-600">Microphone error: {speechError}</p>
                    </div>
                  )}
                  
                  {speechMatch === true && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-600 font-semibold">✓ Correct! Moving to next word...</p>
                    </div>
                  )}
                  
                  {speechMatch === false && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-600">Not quite right. Try again!</p>
                    </div>
                  )}
                  
                  {/* Transcript Display */}
                  {transcript && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-600">You said: "{transcript}"</p>
                    </div>
                  )}
                  
                  {/* Microphone Button */}
                  <button
                    onClick={handleMicToggle}
                    className={`mic-button ${isListening ? 'recording' : ''}`}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    {isListening ? 'Listening...' : 'Click microphone to start'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-x-4">
              <button onClick={() => handleAnswer('correct')} className="btn btn-success">
                Correct ✓
              </button>
              <button onClick={() => handleAnswer('incorrect')} className="btn btn-secondary">
                Skip →
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-gray-600">Exercise content loading...</p>
          </div>
        );
    }
  };

  if (isCompleted) {
    const correctAnswers = answers.filter(a => a === 'correct').length;
    const totalQuestions = exercise.content.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-card p-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Exercise Completed!</h2>
            <p className="text-gray-600">Great job on completing this exercise</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary-600">{score}%</p>
              <p className="text-gray-600">Score</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</p>
              <p className="text-gray-600">Correct Answers</p>
            </div>
          </div>
          
          <div className="space-x-4">
            <button onClick={onBack} className="btn btn-secondary">
              Back to Exercises
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-card p-8">
          <button onClick={onBack} className="mb-4 text-primary-600 hover:text-primary-700">
            ← Back to Exercises
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{exercise.title}</h2>
          <p className="text-gray-600 mb-6">{exercise.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-800">{exercise.instructions}</p>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <Timer className="w-4 h-4 mr-1" />
              <span>{formatDuration(exercise.timeLimit || 300)}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>
          
          <button onClick={handleStart} className="btn btn-primary w-full">
            Start Exercise
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-card p-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-primary-600 hover:text-primary-700">
            ← Back to Exercises
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Progress: {currentIndex + 1}/{exercise.content.length}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / exercise.content.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {renderExerciseContent()}
      </div>
    </div>
  );
};

export default ExercisePage;
