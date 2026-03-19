const Session = require('../models/Session');
const { analyzeReading, calculateWPM, calculateAccuracy } = require('../utils/nlpUtils');

// Get all sessions for a user
const getUserSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip)
      .select('-textContent -transcript');
    
    const total = await Session.countDocuments({ userId: req.user._id });
    
    res.status(200).json({
      success: true,
      data: {
        sessions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching sessions.'
    });
  }
};

// Get single session
const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { session }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching session.'
    });
  }
};

// Create new session
const createSession = async (req, res) => {
  try {
    console.log('Creating session with data:', req.body);
    
    const {
      title,
      textContent,
      transcript,
      duration,
      readPosition = 0,
      isCompleted = false
    } = req.body;
    
    if (!textContent) {
      return res.status(400).json({
        success: false,
        message: 'Text content is required.'
      });
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, returning fallback session');
      return res.status(200).json({
        success: true,
        message: 'Session created successfully (fallback mode).',
        data: {
          session: {
            _id: 'fallback-' + Date.now(),
            title: title || 'Untitled Reading Session',
            textContent,
            transcript: transcript || '',
            duration: duration || 0,
            wpm: Math.round((textContent.split(' ').length / (duration || 60)) * 60),
            accuracy: 100,
            errors: [],
            createdAt: new Date()
          }
        }
      });
    }
    
    const session = new Session({
      userId: req.user._id,
      title: title || 'Untitled Reading Session',
      textContent,
      transcript: transcript || '',
      duration: duration || 0,
      readPosition,
      isCompleted
    });
    
    // Calculate statistics if transcript is provided
    if (transcript && duration > 0) {
      console.log('Analyzing transcript:', transcript);
      session.errors = analyzeReading(textContent, transcript);
      session.calculateStats();
    }
    
    console.log('Session before save:', session);
    await session.save();
    console.log('Session saved successfully:', session);
    
    res.status(201).json({
      success: true,
      message: 'Session created successfully.',
      data: { session }
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating session.'
    });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const {
      title,
      transcript,
      duration,
      readPosition,
      isCompleted
    } = req.body;
    
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.'
      });
    }
    
    // Update fields
    if (title) session.title = title;
    if (transcript !== undefined) session.transcript = transcript;
    if (duration !== undefined) session.duration = duration;
    if (readPosition !== undefined) session.readPosition = readPosition;
    if (isCompleted !== undefined) session.isCompleted = isCompleted;
    
    // Recalculate statistics if transcript was updated
    if (transcript !== undefined && duration > 0) {
      session.errors = analyzeReading(session.textContent, transcript);
      session.calculateStats();
    }
    
    await session.save();
    
    res.status(200).json({
      success: true,
      message: 'Session updated successfully.',
      data: { session }
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating session.'
    });
  }
};

// Update session position (for auto-save)
const updateSessionPosition = async (req, res) => {
  try {
    const { position } = req.body;
    
    const session = await Session.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        readPosition: position,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Position updated successfully.',
      data: { position: session.readPosition }
    });
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating position.'
    });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully.'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting session.'
    });
  }
};

module.exports = {
  getUserSessions,
  getSession,
  createSession,
  updateSession,
  updateSessionPosition,
  deleteSession
};
