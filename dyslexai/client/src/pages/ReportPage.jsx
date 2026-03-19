import React, { useState } from 'react';

const ReportPage = () => {
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
    { date: '2024-03-19', words: 180, accuracy: 92, duration: 25 },
    { date: '2024-03-18', words: 150, accuracy: 88, duration: 20 },
    { date: '2024-03-17', words: 200, accuracy: 85, duration: 30 },
    { date: '2024-03-16', words: 120, accuracy: 90, duration: 18 },
    { date: '2024-03-15', words: 175, accuracy: 87, duration: 22 }
  ];

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Reading Reports</h1>
        
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

        {/* Progress Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Progress Over Time</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Progress Chart</h3>
            <p className="text-gray-600 mb-4">
              Visual representation of your reading progress over time would be displayed here.
            </p>
            <div className="bg-white rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-700 mb-2">Key Insights:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Reading accuracy has improved by {currentStats.improvement}% this period</li>
                <li>• Average session duration: {Math.round(currentStats.readingTime / currentStats.sessions)} minutes</li>
                <li>• Most productive reading time: Evening sessions</li>
                <li>• Areas for improvement: Complex word recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
