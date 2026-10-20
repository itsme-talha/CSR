const express = require('express');
const { uploadDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// 'document' field name hai jo frontend se form-data mein aayega
router.post('/upload', protect, authorize('BENEFICIARY'), upload.single('document'), uploadDocument);

module.exports = router;