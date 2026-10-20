const express = require('express');
const { getAllActiveCampaigns, getSingleCampaign } = require('../controllers/campaignController');

const router = express.Router();

router.get('/', getAllActiveCampaigns);
router.get('/:id', getSingleCampaign);

module.exports = router;