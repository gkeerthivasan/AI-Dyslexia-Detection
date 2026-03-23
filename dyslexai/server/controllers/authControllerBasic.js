const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Basic register without password hashing (for testing only)
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

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected.'
      });
    }

    // Create a simple user document directly in MongoDB
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Create user document directly
    const userDoc = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Plain text for testing only
      age: age ? parseInt(age) : undefined,
      hasDyslexia: hasDyslexia || false,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    const result = await usersCollection.insertOne(userDoc);
    
    // Generate token
    const token = generateToken(result.insertedId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: {
          id: result.insertedId,
          name: userDoc.name,
          email: userDoc.email,
          age: userDoc.age,
          hasDyslexia: userDoc.hasDyslexia
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Demo user
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

    // Database login using direct collection access
    if (mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      
      const user = await usersCollection.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Plain text comparison for testing only
      if (user.passwordHash !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Update last login
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
      );

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
        message: 'Database not available.'
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
