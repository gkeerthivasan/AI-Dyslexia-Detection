const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['omission', 'substitution', 'insertion', 'mispronunciation'],
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  expectedWord: String,
  spokenWord: String
});

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Reading Session'
  },
  textContent: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    default: ''
  },
  wpm: {
    type: Number,
    default: 0,
    min: 0
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  errors: [errorSchema],
  readPosition: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  wordCount: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
sessionSchema.index({ userId: 1, createdAt: -1 });

// Method to calculate session statistics
sessionSchema.methods.calculateStats = function() {
  const words = this.textContent.split(/\s+/).filter(word => word.length > 0);
  this.wordCount = words.length;
  
  if (this.transcript && this.duration > 0) {
    const transcriptWords = this.transcript.split(/\s+/).filter(word => word.length > 0);
    this.wpm = Math.round((transcriptWords.length / this.duration) * 60);
  }
  
  const totalWords = this.wordCount;
  const errorCount = this.errors.length;
  this.accuracy = totalWords > 0 ? Math.round(((totalWords - errorCount) / totalWords) * 100) : 0;
};

module.exports = mongoose.model('Session', sessionSchema);
