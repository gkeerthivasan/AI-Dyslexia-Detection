const express = require('express');
const {
  generateReport,
  getReport,
  getSummaryStats
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// GET /api/reports/summary - Get summary statistics for dashboard
router.get('/summary', getSummaryStats);

// GET /api/reports/full - Get full report
router.get('/full', getReport);

// POST /api/reports/generate - Generate new report
router.post('/generate', generateReport);

module.exports = router;
