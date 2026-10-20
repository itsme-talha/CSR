const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createDonation = async (donorId, donationData) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id: donationData.campaignId }
    });

    if (!campaign || campaign.status !== 'ACTIVE') {
        throw new Error('Yeh campaign abhi active nahi hai.');
    }

    return await prisma.donation.create({
        data: {
            donorId,
            campaignId: donationData.campaignId,
            amount: donationData.amount,
            receiptUrl: donationData.receiptUrl, 
            status: 'PENDING_VERIFICATION' // Admin verify karega[cite: 9]
        }
    });
};

const getDonorHistory = async (donorId) => {
    return await prisma.donation.findMany({
        where: { donorId },
        include: { campaign: true }, // Campaign ki details bhi sath fetch hongi[cite: 9]
        orderBy: { donatedAt: 'desc' }
    });
};

module.exports = { createDonation, getDonorHistory };