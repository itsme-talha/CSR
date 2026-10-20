const express = require('express');
const multer = require('multer');
const path = require('path');
const { approveDonation, getSystemStats, getPendingDonations } = require('../controllers/adminReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Yahan getAllBeneficiaries ko import mein add kiya gaya hai
const { 
    verifyRequest, 
    launchCampaign, 
    getPendingRequests, 
    getRequestDocuments, 
    getAllCampaigns, 
    toggleCampaignStatus,
    getAllBeneficiaries 
} = require('../controllers/adminController');

const router = express.Router();

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `proof_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// === BENEFICIARIES ROUTE (Naya) ===
router.get('/beneficiaries', protect, authorize('ADMIN'), getAllBeneficiaries);

// === Requests & Campaigns Routes ===
router.get('/requests', protect, authorize('ADMIN'), getPendingRequests); 
router.get('/requests/:id/documents', protect, authorize('ADMIN'), getRequestDocuments);
router.put('/requests/:id/verify', protect, authorize('ADMIN'), verifyRequest);
router.post('/campaigns', protect, authorize('ADMIN'), launchCampaign);

// === DONATIONS ROUTES ===
router.get('/donations', protect, authorize('ADMIN'), getPendingDonations);
router.put('/donations/:id/verify', protect, authorize('ADMIN'), approveDonation);

// === Dashboard & Others ===
router.get('/dashboard-stats', protect, authorize('ADMIN'), getSystemStats);
router.get('/campaigns', protect, authorize('ADMIN'), getAllCampaigns);
router.put('/campaigns/:id/status', protect, authorize('ADMIN'), upload.single('proof'), toggleCampaignStatus);
router.put('/campaigns/:id/close', protect, authorize('ADMIN'), upload.single('proof'), toggleCampaignStatus);

module.exports = router;