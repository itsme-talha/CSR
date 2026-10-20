const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getActiveCampaigns = async () => {
    return await prisma.campaign.findMany({
        where: { status: 'ACTIVE' },
        orderBy: [
            { urgencyTag: 'desc' }, // URGENT pehle aayega
            { deadline: 'asc' }     // Jiski aakhri tareekh qareeb ho wo pehle aayega
        ]
    });
};

const getCampaignById = async (id) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id }
    });
    
    if (!campaign) {
        throw new Error('Campaign nahi mili');
    }
    
    return campaign;
};

module.exports = { getActiveCampaigns, getCampaignById };