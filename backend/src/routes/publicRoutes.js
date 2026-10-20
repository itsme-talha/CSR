const express = require('express');
const { getPublicCampaigns, getPublicCampaignById } = require('../controllers/publicController');

const router = express.Router();

// Public route (Yahan protect ya authorize middleware nahi laga)
router.get('/campaigns', getPublicCampaigns);
router.get('/campaigns/:id', getPublicCampaignById);

module.exports = router;