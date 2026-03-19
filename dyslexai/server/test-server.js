require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple middleware
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DyslexAI Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple auth endpoint for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo user check
  if (email === 'demo@dyslexai.com' && password === 'demo123') {
    const token = 'demo-jwt-token-12345';
    const user = {
      id: 'demo-user-id',
      name: 'Demo User',
      email: 'demo@dyslexai.com',
      age: 25,
      hasDyslexia: true
    };
    
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { user, token }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }
});

// Profile endpoint - validates token and returns user
app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided or invalid format'
    });
  }
  
  const token = authHeader.substring(7);
  
  // Check if it's our demo token
  if (token === 'demo-jwt-token-12345') {
    const user = {
      id: 'demo-user-id',
      name: 'Demo User',
      email: 'demo@dyslexai.com',
      age: 25,
      hasDyslexia: true
    };
    
    res.status(200).json({
      success: true,
      data: { user }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Mock endpoints for other APIs to prevent 404 errors
app.get('/api/sessions', (req, res) => {
  res.status(200).json({
    success: true,
    data: { sessions: [] }
  });
});

app.get('/api/exercises', (req, res) => {
  res.status(200).json({
    success: true,
    data: { exercises: [] }
  });
});

app.get('/api/reports/summary', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalSessions: 7,
        avgWpm: 85,
        avgAccuracy: 92,
        exercisesCompleted: 12
      },
      summary: {
        totalReadingTime: 180,
        improvementRate: 15,
        streakDays: 3
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👤 Demo login: demo@dyslexai.com / demo123`);
  console.log(`🔑 Token validation enabled`);
});
