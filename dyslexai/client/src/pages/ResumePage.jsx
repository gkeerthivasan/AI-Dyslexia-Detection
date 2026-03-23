import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionsAPI } from '../utils/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Clock, Target, Play, BookOpen } from 'lucide-react';

const ResumePage = () => {
  const { getReadingStyles } = useAccessibility();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample reading content for demo purposes
  const sampleReadingContent = [
    {
      title: "The Little Fox",
      content: "Once upon a time, there was a little fox who loved to explore the forest. Every morning, the fox would wake up early and venture into the woods, looking for new adventures and friends to meet.",
      difficulty: "Easy",
      estimatedTime: "3 minutes"
    },
    {
      title: "Space Journey",
      content: "The spaceship soared through the vast emptiness of space, its engines humming quietly as it traveled toward distant stars. The astronauts inside watched in wonder as planets and asteroids passed by their windows.",
      difficulty: "Medium", 
      estimatedTime: "5 minutes"
    },
    {
      title: "Ocean Discovery",
      content: "Deep beneath the ocean waves, a world of incredible beauty waited to be discovered. Colorful fish swam through coral reefs while giant whales migrated across the blue waters, creating a symphony of marine life.",
      difficulty: "Easy",
      estimatedTime: "4 minutes"
    }
  ];

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await sessionsAPI.getSessions({ limit: 10 });
        setSessions(response.data?.sessions || []);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your sessions...</p>
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
      <div className="max-w-4xl mx-auto">
        <h1 
          className="text-3xl font-bold mb-8"
          style={{ 
            fontFamily: getReadingStyles().fontFamily,
            fontSize: `${parseInt(getReadingStyles().fontSize) * 1.5}px`,
            color: getReadingStyles().color
          }}
        >
          Resume Reading
        </h1>
        
        {sessions.length === 0 ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-card p-8">
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 
                  className="text-2xl font-semibold mb-4"
                  style={{ 
                    fontFamily: getReadingStyles().fontFamily,
                    fontSize: `${parseInt(getReadingStyles().fontSize) * 1.25}px`,
                    color: getReadingStyles().color
                  }}
                >
                  No Previous Sessions
                </h2>
                <p 
                  className="mb-8"
                  style={{ 
                    fontFamily: getReadingStyles().fontFamily,
                    fontSize: getReadingStyles().fontSize,
                    lineHeight: getReadingStyles().lineHeight,
                    color: getReadingStyles().color
                  }}
                >
                  Start your first reading session to see your progress here, or try one of our sample readings below.
                </p>
                <Link to="/read" className="btn btn-primary">
                  Start New Reading Session
                </Link>
              </div>
            </div>

            {/* Sample Reading Content */}
            <div>
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ 
                  fontFamily: getReadingStyles().fontFamily,
                  fontSize: `${parseInt(getReadingStyles().fontSize) * 1.25}px`,
                  color: getReadingStyles().color
                }}
              >
                Try These Sample Readings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleReadingContent.map((content, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        content.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {content.difficulty}
                      </span>
                    </div>
                    <h3 
                      className="font-semibold mb-3"
                      style={{ 
                        fontFamily: getReadingStyles().fontFamily,
                        fontSize: getReadingStyles().fontSize,
                        color: getReadingStyles().color
                      }}
                    >
                      {content.title}
                    </h3>
                    <p 
                      className="text-sm mb-4 line-clamp-3"
                      style={{ 
                        fontFamily: getReadingStyles().fontFamily,
                        fontSize: `${parseInt(getReadingStyles().fontSize) * 0.875}px`,
                        lineHeight: getReadingStyles().lineHeight,
                        color: getReadingStyles().color
                      }}
                    >
                      {content.content}
                    </p>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span 
                        className="text-gray-500"
                        style={{ 
                          fontFamily: getReadingStyles().fontFamily,
                          fontSize: `${parseInt(getReadingStyles().fontSize) * 0.75}px`
                        }}
                      >
                        📖 {content.estimatedTime}
                      </span>
                      <span 
                        className="text-gray-500"
                        style={{ 
                          fontFamily: getReadingStyles().fontFamily,
                          fontSize: `${parseInt(getReadingStyles().fontSize) * 0.75}px`
                        }}
                      >
                        ⏱️ {content.estimatedTime}
                      </span>
                    </div>
                    <Link 
                      to="/read" 
                      state={{ 
                        sampleContent: content.content,
                        sampleTitle: content.title
                      }}
                      className="btn btn-primary w-full flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Reading
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Your Recent Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <div key={session._id} className="bg-white rounded-xl shadow-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{session.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600 mb-1">
                        <Target className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{session.accuracy}%</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{session.wpm} WPM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Duration</span>
                      <span>{Math.floor(session.duration / 60)}m {session.duration % 60}s</span>
                    </div>
                    {session.errors && session.errors.length > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Errors</span>
                        <span className="text-red-600">{session.errors.length}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to="/read" 
                    state={{ sessionData: session }}
                    className="btn btn-primary w-full flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue Session
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;
