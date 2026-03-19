const multer = require('multer');
const pdfParse = require('pdf-parse');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Upload and parse PDF
const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.'
      });
    }

    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    
    const extractedText = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: 'No text could be extracted from the PDF.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'PDF uploaded and parsed successfully.',
      data: {
        text: extractedText,
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata
      }
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    
    if (error.message.includes('Only PDF files are allowed')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 10MB limit.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error processing PDF file.'
    });
  }
};

// Parse plain text (for paste functionality)
const parseText = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Text content is required.'
      });
    }
    
    const cleanedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    if (!cleanedText) {
      return res.status(400).json({
        success: false,
        message: 'Text content cannot be empty.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Text processed successfully.',
      data: {
        text: cleanedText,
        wordCount: cleanedText.split(/\s+/).filter(w => w).length
      }
    });
  } catch (error) {
    console.error('Text parse error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing text content.'
    });
  }
};

module.exports = {
  uploadPDF,
  parseText,
  upload
};
