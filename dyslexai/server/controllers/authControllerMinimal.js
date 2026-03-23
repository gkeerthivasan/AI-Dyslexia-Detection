const mongoose = require('mongoose');
const validator = require('validator');

// Minimal register without JWT
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

    // Return success without database operations
    res.status(201).json({
      success: true,
      message: 'User registered successfully (test mode).',
      data: {
        user: {
          id: 'test-user-id',
          name: name,
          email: email,
          age: age,
          hasDyslexia: hasDyslexia
        },
        token: 'test-token-12345'
      }
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message
    });
  }
};

// Minimal login without JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Demo user check
    if (email === 'demo@dyslexai.com' && password === 'demo123') {
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
          token: 'demo-token-12345'
        }
      });
    }

    // For any other credentials, return error
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};
