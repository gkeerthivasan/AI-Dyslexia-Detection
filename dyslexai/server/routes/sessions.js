const express = require('express');
const {
  getUserSessions,
  getSession,
  createSession,
  updateSession,
  updateSessionPosition,
  deleteSession
} = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// GET /api/sessions - Get all sessions for user
router.get('/', getUserSessions);

// GET /api/sessions/:id - Get single session
router.get('/:id', getSession);

// POST /api/sessions - Create new session
router.post('/', createSession);

// PUT /api/sessions/:id - Update session
router.put('/:id', updateSession);

// PATCH /api/sessions/:id/position - Update read position
router.patch('/:id/position', updateSessionPosition);

// DELETE /api/sessions/:id - Delete session
router.delete('/:id', deleteSession);

module.exports = router;
