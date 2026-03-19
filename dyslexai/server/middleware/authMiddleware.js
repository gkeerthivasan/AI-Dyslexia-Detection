const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle demo user
    if (decoded.userId === 'demo-user-id') {
      req.user = 'demo-user-id';
      return next();
    }
    
    // Try database user
    try {
      if (mongoose.connection.readyState === 1) { // Connected
        const user = await User.findById(decoded.userId).select('-passwordHash');
        
        if (!user) {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid token. User not found.' 
          });
        }

        req.user = user;
        next();
      } else {
        return res.status(500).json({ 
          success: false, 
          message: 'Database not available for authentication.' 
        });
      }
    } catch (dbError) {
      console.error('Database auth error:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error during authentication.' 
      });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication.' 
    });
  }
};

module.exports = authMiddleware;
