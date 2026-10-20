const express = require('express');
const router = express.Router();
const { getMyNotifications, markAllAsRead } = require('../controllers/notificationController');

// Ise apne actual middleware path se replace karein
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes secure kar diye gaye hain
router.get('/', protect, getMyNotifications);
router.post('/mark-read', protect, markAllAsRead);

module.exports = router;