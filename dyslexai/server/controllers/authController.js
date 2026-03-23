const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const validator = require('validator');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, age, hasDyslexia } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by pre-save middleware
      age: age ? parseInt(age) : undefined,
      hasDyslexia: hasDyslexia || false
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: user.toProfileJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Check for demo user first (fallback for database issues)
    if (email === 'demo@dyslexai.com' && password === 'demo123') {
      // Generate token for demo user
      const token = generateToken('demo-user-id');
      
      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: 'demo-user-id',
            name: 'Demo User',
            email: 'demo@dyslexai.com',
            age: 25,
            hasDyslexia: true
          },
          token
        }
      });
    }

    // Try database login if not demo user
    try {
      if (mongoose.connection.readyState === 1) { // Connected
        // Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
          });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
          });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
          success: true,
          message: 'Login successful.',
          data: {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              age: user.age,
              hasDyslexia: user.hasDyslexia
            },
            token
          }
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Database not available. Please try again later.'
        });
      }
    } catch (dbError) {
      console.error('Database login error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error during login. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    // Handle demo user
    if (req.user === 'demo-user-id') {
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: 'demo-user-id',
            name: 'Demo User',
            email: 'demo@dyslexai.com',
            age: 25,
            hasDyslexia: true
          }
        }
      });
    }

    // Try database user
    try {
      if (mongoose.connection.readyState === 1) { // Connected
        const user = await User.findById(req.user);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found.'
          });
        }
        
        res.status(200).json({
          success: true,
          data: {
            user: user.toProfileJSON()
          }
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Database not available.'
        });
      }
    } catch (dbError) {
      console.error('Database profile error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error fetching profile.'
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
