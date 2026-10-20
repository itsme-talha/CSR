const express = require('express');
const { setupProfile, submitRequest, getMyRequests, submitAccountDetails } = require('../controllers/beneficiaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/profile', protect, authorize('BENEFICIARY'), setupProfile);
router.post('/requests', protect, authorize('BENEFICIARY'), submitRequest);
router.get('/my-requests', protect, authorize('BENEFICIARY'), getMyRequests);
router.put('/requests/:id/account-details', protect, authorize('BENEFICIARY'), submitAccountDetails);
console.log("✅ Beneficiary Routes Naye Wale Load Ho Gaye Hain!");

module.exports = router;