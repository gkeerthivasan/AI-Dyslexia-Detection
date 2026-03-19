import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { reportsAPI, sessionsAPI } from '../utils/api';
import { BookOpen, PlayCircle, Brain, BarChart3, TrendingUp, Clock, Target, Award } from 'lucide-react';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

const HomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    exercisesCompleted: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load real stats from reports API
        const response = await reportsAPI.getSummary();
        console.log('API Response:', response); // Debug log
        setStats(response.data?.stats || {
          totalSessions: 0,
          avgWpm: 0,
          avgAccuracy: 0,
          exercisesCompleted: 0,
        });
        
        // Load recent sessions
        const sessionsResponse = await sessionsAPI.getSessions({ limit: 5 });
        setRecentSessions(sessionsResponse.data?.sessions || []);
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Set default stats on error
        setStats({
          totalSessions: 0,
          avgWpm: 0,
          avgAccuracy: 0,
          exercisesCompleted: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const featureCards = [
    {
      icon: BookOpen,
      title: 'Read Content',
      description: 'Upload PDF or paste text and read aloud for analysis',
      route: '/read',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: PlayCircle,
      title: 'Resume Session',
      description: 'Continue from where you left off',
      route: '/resume',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Brain,
      title: 'Practice Exercises',
      description: 'Short exercises to train and assess your reading',
      route: '/exercises',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: BarChart3,
      title: 'My Report',
      description: 'View your personalised dyslexia analysis report',
      route: '/report',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const statCards = [
    {
      icon: Clock,
      label: 'Total Sessions',
      value: stats.totalSessions,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Average WPM',
      value: `${stats.avgWpm}`,
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: Target,
      label: 'Average Accuracy',
      value: `${stats.avgAccuracy}%`,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Award,
      label: 'Exercises Completed',
      value: stats.exercisesCompleted,
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <AccessibilityToolbar />
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className="text-lg opacity-90">
                    Ready to continue your reading journey today?
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="card p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {featureCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={index}
                    to={card.route}
                    className="card p-6 group cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {session.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {session.wpm} WPM
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.accuracy}% Accuracy
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No reading sessions yet. Start your first session to see your progress!
                  </p>
                  <Link
                    to="/read"
                    className="btn btn-primary"
                  >
                    Start Reading
                  </Link>
                </div>
              )}
            </div>

            {/* Motivational Section */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  Keep practicing! Every session brings improvement.
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
