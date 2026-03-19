const mongoose = require('mongoose');

const exerciseResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: String,
    required: true
  },
  exerciseType: {
    type: String,
    enum: ['word_recognition', 'phonics_drill', 'sentence_reading', 'comprehension_quiz', 'speed_reading'],
    required: true
  },
  exerciseTitle: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  errors: [{
    type: String
  }],
  timeTaken: {
    type: Number,
    required: true
  },
  maxTime: {
    type: Number,
    default: 300
  },
  attempts: {
    type: Number,
    default: 1
  },
  isCompleted: {
    type: Boolean,
    default: true
  },
  feedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
exerciseResultSchema.index({ userId: 1, exerciseType: 1, createdAt: -1 });
exerciseResultSchema.index({ userId: 1, createdAt: -1 });

// Method to determine performance level
exerciseResultSchema.methods.getPerformanceLevel = function() {
  if (this.score >= 80) return 'excellent';
  if (this.score >= 60) return 'good';
  if (this.score >= 40) return 'needs_improvement';
  return 'poor';
};

module.exports = mongoose.model('ExerciseResult', exerciseResultSchema);
