const express = require('express');
const { uploadPDF, parseText, upload } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// POST /api/upload/pdf - Upload and parse PDF
router.post('/pdf', upload.single('pdf'), uploadPDF);

// POST /api/upload/text - Parse plain text
router.post('/text', parseText);

module.exports = router;
