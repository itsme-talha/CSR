const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyDonationReceipt = async (donationId, status, transactionReference) => {
    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) throw new Error('Donation record nahi mila');

    const updatedDonation = await prisma.donation.update({
        where: { id: donationId },
        data: { 
            status, 
            transactionReference: transactionReference || null 
        }
    });

    // Agar admin payment approve kar de, toh campaign ka total amount update karein
    if (status === 'VERIFIED') {
        await prisma.campaign.update({
            where: { id: donation.campaignId },
            data: { collectedAmount: { increment: donation.amount } }
        });
    }
    return updatedDonation;
};

const getDashboardStats = async () => {
    const totalUsers = await prisma.user.count();
    const activeCampaigns = await prisma.campaign.count({ where: { status: 'ACTIVE' } });
    
    // Total verified donations ka sum calculate karna
    const totalDonations = await prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: 'VERIFIED' }
    });

    return {
        totalUsers,
        activeCampaigns,
        totalCollected: totalDonations._sum.amount || 0
    };
};

module.exports = { verifyDonationReceipt, getDashboardStats };