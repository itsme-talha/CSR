const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware'); // Aapka correct auth middleware
const multer = require('multer');
const path = require('path');

// Image/Document Upload Configuration (Same as adminRoutes)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Nayi chat file ka naam
        cb(null, `chat_doc_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Routes
router.get('/:requestId', protect, messageController.getMessages);
router.post('/', protect, upload.single('document'), messageController.sendMessage);

module.exports = router;