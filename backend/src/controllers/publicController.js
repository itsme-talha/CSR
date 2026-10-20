const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sirf Active campaigns fetch karna public website ke liye
const getPublicCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { deadline: 'asc' },
            // Public ko beneficiary ka sensitive data nahi bhejenge, isliye sirf basic details
        });
        res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        console.error("Error fetching public campaigns:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching campaigns' });
    }
};
const getPublicCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await prisma.campaign.findUnique({
            where: { id: id }
        });

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        console.error("Error fetching single campaign:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching campaign details' });
    }
};

// Module exports mein getPublicCampaignById ko add karna mat bhoolna
module.exports = { getPublicCampaigns, getPublicCampaignById };