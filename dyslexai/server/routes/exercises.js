const express = require('express');
const {
  getExercises,
  getExercise,
  saveExerciseResult,
  getUserExerciseResults,
  getExerciseStats
} = require('../controllers/exerciseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// GET /api/exercises - Get all exercises
router.get('/', getExercises);

// GET /api/exercises/:id - Get single exercise
router.get('/:id', getExercise);

// POST /api/exercises/result - Save exercise result
router.post('/result', saveExerciseResult);

// GET /api/exercises/results - Get user's exercise results
router.get('/results', getUserExerciseResults);

// GET /api/exercises/stats - Get exercise statistics
router.get('/stats', getExerciseStats);

module.exports = router;
