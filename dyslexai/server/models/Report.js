const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  avgWpm: {
    type: Number,
    default: 0,
    min: 0
  },
  avgAccuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  totalReadingTime: {
    type: Number,
    default: 0
  },
  errorBreakdown: {
    omission: { type: Number, default: 0 },
    substitution: { type: Number, default: 0 },
    insertion: { type: Number, default: 0 },
    mispronunciation: { type: Number, default: 0 }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'low'
  },
  recommendations: [{
    type: String
  }],
  exerciseStats: {
    totalCompleted: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    strongAreas: [String],
    weakAreas: [String]
  },
  performanceTrends: {
    wpmTrend: [{
      date: Date,
      value: Number
    }],
    accuracyTrend: [{
      date: Date,
      value: Number
    }]
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to calculate risk level based on performance
reportSchema.methods.calculateRiskLevel = function() {
  const accuracy = this.avgAccuracy;
  const wpm = this.avgWpm;
  const errorRate = 100 - accuracy;
  
  if (accuracy >= 85 && wpm >= 150) {
    this.riskLevel = 'low';
  } else if (accuracy >= 70 && wpm >= 100) {
    this.riskLevel = 'moderate';
  } else {
    this.riskLevel = 'high';
  }
};

// Method to generate personalized recommendations
reportSchema.methods.generateRecommendations = function() {
  const recommendations = [];
  const accuracy = this.avgAccuracy;
  const wpm = this.avgWpm;
  const errors = this.errorBreakdown;
  
  if (accuracy < 70) {
    recommendations.push('Focus on accuracy first. Try reading slower and pointing at each word.');
  }
  
  if (wpm < 100) {
    recommendations.push('Practice with shorter texts to build reading speed gradually.');
  }
  
  if (errors.omission > 20) {
    recommendations.push('You frequently skip words. Try using a ruler or finger to track your reading.');
  }
  
  if (errors.substitution > 15) {
    recommendations.push('Work on phonetic awareness with word family exercises.');
  }
  
  if (errors.mispronunciation > 25) {
    recommendations.push('Practice reading aloud with audio books to improve pronunciation.');
  }
  
  if (this.exerciseStats.weakAreas.length > 0) {
    recommendations.push(`Focus on improving: ${this.exerciseStats.weakAreas.join(', ')}.`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great progress! Keep practicing regularly to maintain your skills.');
  }
  
  this.recommendations = recommendations;
};

module.exports = mongoose.model('Report', reportSchema);
