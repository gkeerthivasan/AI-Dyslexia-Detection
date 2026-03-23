const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs (increased from 5)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
