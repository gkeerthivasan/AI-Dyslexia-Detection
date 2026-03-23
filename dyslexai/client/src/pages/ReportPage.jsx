import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const ReportPage = () => {
  const { getReadingStyles } = useAccessibility();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = {
    week: {
      totalWords: 1250,
      readingTime: 180, // minutes
      accuracy: 85,
      sessions: 7,
      improvement: 12
    },
    month: {
      totalWords: 5000,
      readingTime: 720, // minutes
      accuracy: 88,
      sessions: 28,
      improvement: 25
    },
    all: {
      totalWords: 15000,
      readingTime: 2160, // minutes
      accuracy: 90,
      sessions: 84,
      improvement: 35
    }
  };

  const currentStats = stats[selectedPeriod];

  const recentSessions = [
    { date: '2024-03-19', words: 180, accuracy: 92, duration: 25, wpm: 45 },
    { date: '2024-03-18', words: 150, accuracy: 88, duration: 20, wpm: 42 },
    { date: '2024-03-17', words: 200, accuracy: 85, duration: 30, wpm: 38 },
    { date: '2024-03-16', words: 120, accuracy: 90, duration: 18, wpm: 40 },
    { date: '2024-03-15', words: 175, accuracy: 87, duration: 22, wpm: 41 }
  ];

  // Progress data for visualization
  const progressData = {
    week: [
      { day: 'Mon', accuracy: 75, wpm: 35, words: 120 },
      { day: 'Tue', accuracy: 78, wpm: 37, words: 135 },
      { day: 'Wed', accuracy: 82, wpm: 38, words: 150 },
      { day: 'Thu', accuracy: 85, wpm: 40, words: 140 },
      { day: 'Fri', accuracy: 88, wpm: 42, words: 160 },
      { day: 'Sat', accuracy: 90, wpm: 44, words: 180 },
      { day: 'Sun', accuracy: 92, wpm: 45, words: 175 }
    ],
    month: [
      { week: 'Week 1', accuracy: 70, wpm: 32, words: 800 },
      { week: 'Week 2', accuracy: 75, wpm: 35, words: 950 },
      { week: 'Week 3', accuracy: 82, wpm: 38, words: 1100 },
      { week: 'Week 4', accuracy: 88, wpm: 42, words: 1250 }
    ],
    all: [
      { month: 'Jan', accuracy: 65, wpm: 28, words: 2800 },
      { month: 'Feb', accuracy: 72, wpm: 32, words: 3200 },
      { month: 'Mar', accuracy: 78, wpm: 36, words: 3500 },
      { month: 'Apr', accuracy: 82, wpm: 38, words: 3800 },
      { month: 'May', accuracy: 85, wpm: 40, words: 4100 },
      { month: 'Jun', accuracy: 90, wpm: 42, words: 4400 }
    ]
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (accuracy) => {
    if (accuracy >= 90) return 'bg-green-100';
    if (accuracy >= 80) return 'bg-yellow-100';
    return 'bg-red-100';
  };

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
          Reading Reports
        </h1>
        
        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700">Performance Overview</h2>
            <div className="flex gap-2">
              {['week', 'month', 'all'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Words</h3>
              <span className="text-2xl">📖</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentStats.totalWords.toLocaleString()}</div>
            <div className="text-sm text-green-600">+{currentStats.improvement}% from last period</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Reading Time</h3>
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{Math.floor(currentStats.readingTime / 60)}h {currentStats.readingTime % 60}m</div>
            <div className="text-sm text-gray-600">Total practice time</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Accuracy</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className={`text-2xl font-bold ${getAccuracyColor(currentStats.accuracy)}`}>
              {currentStats.accuracy}%
            </div>
            <div className="text-sm text-gray-600">Word recognition rate</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Sessions</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentStats.sessions}</div>
            <div className="text-sm text-gray-600">Completed sessions</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Sessions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Words Read</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Accuracy</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{session.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{session.words}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccuracyBgColor(session.accuracy)} ${getAccuracyColor(session.accuracy)}`}>
                        {session.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">{session.duration} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ 
              fontFamily: getReadingStyles().fontFamily,
              fontSize: `${parseInt(getReadingStyles().fontSize) * 1.25}px`,
              color: getReadingStyles().color
            }}
          >
            Progress Over Time
          </h2>
          
          {/* Progress Visualization */}
          <div className="space-y-6">
            {/* Accuracy Progress Bar Chart */}
            <div>
              <h3 
                className="text-lg font-medium mb-4"
                style={{ 
                  fontFamily: getReadingStyles().fontFamily,
                  fontSize: `${parseInt(getReadingStyles().fontSize) * 1.125}px`,
                  color: getReadingStyles().color
                }}
              >
                🎯 Accuracy Progress
              </h3>
              <div className="space-y-3">
                {progressData[selectedPeriod].map((data, index) => {
                  const label = selectedPeriod === 'week' ? data.day : 
                               selectedPeriod === 'month' ? data.week : data.month;
                  const accuracy = data.accuracy;
                  const improvement = index > 0 ? accuracy - progressData[selectedPeriod][index - 1].accuracy : 0;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div 
                        className="w-16 text-sm font-medium"
                        style={{ 
                          fontFamily: getReadingStyles().fontFamily,
                          fontSize: `${parseInt(getReadingStyles().fontSize) * 0.875}px`,
                          color: getReadingStyles().color
                        }}
                      >
                        {label}
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-6">
                            <div 
                              className={`h-6 rounded-full transition-all duration-500 ${
                                accuracy >= 90 ? 'bg-green-500' : 
                                accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${accuracy}%` }}
                            >
                              <span 
                                className="text-xs text-white font-medium px-2"
                                style={{ 
                                  fontFamily: getReadingStyles().fontFamily,
                                  fontSize: `${parseInt(getReadingStyles().fontSize) * 0.75}px`
                                }}
                              >
                                {accuracy}%
                              </span>
                            </div>
                          </div>
                          {improvement > 0 && (
                            <div className="absolute -top-2 right-0 text-xs text-green-600 font-medium">
                              +{improvement}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WPM Progress Line Chart */}
            <div>
              <h3 
                className="text-lg font-medium mb-4"
                style={{ 
                  fontFamily: getReadingStyles().fontFamily,
                  fontSize: `${parseInt(getReadingStyles().fontSize) * 1.125}px`,
                  color: getReadingStyles().color
                }}
              >
                ⚡ Reading Speed (WPM)
              </h3>
              <div className="relative h-32 bg-gray-50 rounded-lg p-4">
                <div className="relative h-full flex items-end justify-between space-x-2">
                  {progressData[selectedPeriod].map((data, index) => {
                    const maxWPM = Math.max(...progressData[selectedPeriod].map(d => d.wpm));
                    const height = (data.wpm / maxWPM) * 100;
                    const label = selectedPeriod === 'week' ? data.day.charAt(0) : 
                                 selectedPeriod === 'month' ? `W${index + 1}` : data.month.charAt(0);
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                             style={{ height: `${height}%` }}>
                          <div className="text-xs text-white font-medium pt-1">
                            {data.wpm}
                          </div>
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{ 
                            fontFamily: getReadingStyles().fontFamily,
                            fontSize: `${parseInt(getReadingStyles().fontSize) * 0.75}px`,
                            color: getReadingStyles().color
                          }}
                        >
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 
                className="font-medium mb-3"
                style={{ 
                  fontFamily: getReadingStyles().fontFamily,
                  fontSize: getReadingStyles().fontSize,
                  color: getReadingStyles().color
                }}
              >
                📊 Key Insights:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div 
                    className="flex items-center text-sm"
                    style={{ 
                      fontFamily: getReadingStyles().fontFamily,
                      fontSize: `${parseInt(getReadingStyles().fontSize) * 0.875}px`,
                      color: getReadingStyles().color
                    }}
                  >
                    <span className="text-green-600 mr-2">✓</span>
                    Reading accuracy improved by {currentStats.improvement}% this period
                  </div>
                  <div 
                    className="flex items-center text-sm"
                    style={{ 
                      fontFamily: getReadingStyles().fontFamily,
                      fontSize: `${parseInt(getReadingStyles().fontSize) * 0.875}px`,
                      color: getReadingStyles().color
                    }}
                  >
                    <span className="text-green-600 mr-2">✓</span>
                    Average WPM increased from {progressData[selectedPeriod][0].wpm} to {progressData[selectedPeriod][progressData[selectedPeriod].length - 1].wpm}
                  </div>
                </div>
                <div className="space-y-2">
                  <div 
                    className="flex items-center text-sm"
                    style={{ 
                      fontFamily: getReadingStyles().fontFamily,
                      fontSize: `${parseInt(getReadingStyles().fontSize) * 0.875}px`,
                      color: getReadingStyles().color
                    }}
                  >
                    <span className="text-blue-600 mr-2">ℹ️</span>
                    Average session duration: {Math.round(currentStats.readingTime / currentStats.sessions)} minutes
                  </div>
                  <div 
                    className="flex items-center text-sm"
                    style={{ 
                      fontFamily: getReadingStyles().fontFamily,
                      fontSize: `${parseInt(getReadingStyles().fontSize) * 0.875}px`,
                      color: getReadingStyles().color
                    }}
                  >
                    <span className="text-blue-600 mr-2">ℹ️</span>
                    Total words read: {currentStats.totalWords.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
