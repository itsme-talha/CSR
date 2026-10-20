const campaignService = require('../services/campaignService');

const getAllActiveCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignService.getActiveCampaigns();
        res.status(200).json({
            success: true,
            data: campaigns
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getSingleCampaign = async (req, res) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.id);
        res.status(200).json({
            success: true,
            data: campaign
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

module.exports = { getAllActiveCampaigns, getSingleCampaign };