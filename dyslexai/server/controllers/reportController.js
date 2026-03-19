const Report = require('../models/Report');
const Session = require('../models/Session');
const ExerciseResult = require('../models/ExerciseResult');

// Generate comprehensive report
const generateReport = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let sessions = [];
    let exerciseResults = [];
    
    // Try to get real data, fallback to empty arrays
    try {
      if (mongoose.connection.readyState === 1) { // Connected
        sessions = await Session.find({ userId })
          .sort({ createdAt: -1 })
          .limit(50);
        
        exerciseResults = await ExerciseResult.find({ userId })
          .sort({ createdAt: -1 })
          .limit(100);
      }
    } catch (dbError) {
      console.warn('Database error in report generation, using fallback data:', dbError.message);
      // Use empty arrays as fallback
    }
    
    // Calculate statistics
    const totalSessions = sessions.length;
    const avgWpm = sessions.length > 0 
      ? Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length)
      : 0;
    const avgAccuracy = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
      : 0;
    const totalReadingTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Calculate error breakdown
    const errorBreakdown = {
      omission: 0,
      substitution: 0,
      insertion: 0,
      mispronunciation: 0
    };
    
    sessions.forEach(session => {
      session.errors.forEach(error => {
        errorBreakdown[error.type] = (errorBreakdown[error.type] || 0) + 1;
      });
    });
    
    // Calculate performance trends
    const performanceTrends = {
      wpmTrend: sessions.slice(0, 10).reverse().map(s => ({
        date: s.createdAt,
        value: s.wpm
      })),
      accuracyTrend: sessions.slice(0, 10).reverse().map(s => ({
        date: s.createdAt,
        value: s.accuracy
      }))
    };
    
    // Calculate exercise statistics
    const exerciseStats = {
      totalCompleted: exerciseResults.length,
      avgScore: exerciseResults.length > 0
        ? Math.round(exerciseResults.reduce((sum, r) => sum + r.score, 0) / exerciseResults.length)
        : 0,
      strongAreas: [],
      weakAreas: []
    };
    
    // Analyze exercise performance by type
    const typeStats = {};
    exerciseResults.forEach(result => {
      if (!typeStats[result.exerciseType]) {
        typeStats[result.exerciseType] = [];
      }
      typeStats[result.exerciseType].push(result.score);
    });
    
    Object.keys(typeStats).forEach(type => {
      const avgScore = typeStats[type].reduce((sum, score) => sum + score, 0) / typeStats[type].length;
      if (avgScore >= 80) {
        exerciseStats.strongAreas.push(type.replace('_', ' '));
      } else if (avgScore < 60) {
        exerciseStats.weakAreas.push(type.replace('_', ' '));
      }
    });
    
    // Create or update report
    let report = await Report.findOne({ userId });
    
    if (!report) {
      report = new Report({ userId });
    }
    
    // Update report data
    report.avgWpm = avgWpm;
    report.avgAccuracy = avgAccuracy;
    report.totalSessions = totalSessions;
    report.totalReadingTime = totalReadingTime;
    report.errorBreakdown = errorBreakdown;
    report.performanceTrends = performanceTrends;
    report.exerciseStats = exerciseStats;
    
    // Calculate risk level and generate recommendations
    report.calculateRiskLevel();
    report.generateRecommendations();
    
    await report.save();
    
    res.status(200).json({
      success: true,
      message: 'Report generated successfully.',
      data: { report }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating report.'
    });
  }
};

// Get existing report
const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ userId: req.user._id });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'No report found. Please generate a report first.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching report.'
    });
  }
};

// Get summary statistics for dashboard
const getSummaryStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get recent sessions for stats
    const recentSessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get exercise stats
    const exerciseStats = await ExerciseResult.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalCompleted: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ]);
    
    const stats = {
      totalSessions: recentSessions.length,
      avgWpm: recentSessions.length > 0
        ? Math.round(recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length)
        : 0,
      avgAccuracy: recentSessions.length > 0
        ? Math.round(recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length)
        : 0,
      exercisesCompleted: exerciseStats[0]?.totalCompleted || 0,
      avgExerciseScore: exerciseStats[0]?.avgScore ? Math.round(exerciseStats[0].avgScore) : 0
    };
    
    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get summary stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching summary statistics.'
    });
  }
};

module.exports = {
  generateReport,
  getReport,
  getSummaryStats
};
