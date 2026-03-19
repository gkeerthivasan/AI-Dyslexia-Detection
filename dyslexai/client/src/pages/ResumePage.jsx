import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionsAPI } from '../utils/api';
import { Clock, Target, Play, BookOpen } from 'lucide-react';

const ResumePage = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Resume Reading</h1>
        
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-8">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Previous Sessions</h2>
              <p className="text-gray-600 mb-8">
                Start your first reading session to see your progress here.
              </p>
              <Link to="/read" className="btn btn-primary">
                Start Reading
              </Link>
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
