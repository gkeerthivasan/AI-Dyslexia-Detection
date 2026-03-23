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

// Simple register user with more debugging
const register = async (req, res) => {
  try {
    console.log('=== Registration Request ===');
    console.log('Request body:', req.body);
    
    const { name, email, password, confirmPassword, age, hasDyslexia } = req.body;

    // Basic validation
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

    console.log('Validation passed');

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected');
      return res.status(500).json({
        success: false,
        message: 'Database not connected.'
      });
    }

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    console.log('No existing user found');

    // Create new user with minimal fields first
    console.log('Creating new user...');
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by pre-save middleware
      age: age ? parseInt(age) : undefined,
      hasDyslexia: hasDyslexia || false
    });

    console.log('User object created, saving...');
    await user.save();
    console.log('User saved successfully');

    // Generate token
    console.log('Generating token...');
    const token = generateToken(user._id);
    console.log('Token generated');

    // Return success response
    console.log('Sending success response');
    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
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

    console.log('=== Registration Complete ===');

  } catch (error) {
    console.error('=== Registration Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error object:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login function (same as before)
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

    // Check for demo user first
    if (email === 'demo@dyslexai.com' && password === 'demo123') {
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

    // Database login
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      user.lastLogin = new Date();
      await user.save();

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

module.exports = {
  register,
  login
};
