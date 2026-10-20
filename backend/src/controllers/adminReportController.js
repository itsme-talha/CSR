const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendNotification } = require('../utils/notificationHelper');
const { NOTIFICATIONS } = require('../utils/messages');

// 1. Saari Donations Fetch Karna (Aapka purana working code)
const getPendingDonations = async (req, res) => {
    try {
        const donations = await prisma.donation.findMany({
            orderBy: { donatedAt: 'desc' },
            include: {
                campaign: {
                    select: { title: true }
                }
            }
        });
        res.status(200).json({ success: true, data: donations });
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching donations' });
    }
};
const approveDonation = async (req, res) => {
    try {
        const { id } = req.params;
        let { status } = req.body; 

        if (status === 'APPROVED' || status === 'approved') status = 'VERIFIED';

        const existingDonation = await prisma.donation.findUnique({ where: { id } });
        if (!existingDonation) return res.status(404).json({ success: false, message: 'Donation not found' });
        if (existingDonation.status === status) return res.status(200).json({ success: true, message: `Status is already ${status}` });

        const donation = await prisma.donation.update({ where: { id }, data: { status } });

        if (status === 'VERIFIED' && existingDonation.status !== 'VERIFIED') {
            // Campaign mein funds add karein aur uska data fetch karein
            const updatedCampaign = await prisma.campaign.update({
                where: { id: donation.campaignId },
                data: { collectedAmount: { increment: donation.amount } },
                include: { request: { include: { beneficiary: true } } } // Beneficiary ki ID nikalne ke liye
            });

            // 1. Donor ko alert: Donation verify ho gayi
            await sendNotification(existingDonation.donorId, "Donation Verified", "Aapki donation successfully verify ho gayi hai.");

            // 2. Agar Campaign ka Target poora ho gaya hai!
            if (updatedCampaign.collectedAmount >= updatedCampaign.targetAmount) {
                
                // Beneficiary ko Alert bhejain
                await sendNotification(
                    updatedCampaign.request.beneficiary.userId, 
                    "Target Reached!", 
                    `Mubarak ho! Aapki campaign "${updatedCampaign.title}" ke funds mukammal ho gaye hain.`
                );

                // Is campaign ke tamaam Donors ko Alert bhejain
                const uniqueDonors = await prisma.donation.findMany({
                    where: { campaignId: updatedCampaign.id, status: 'VERIFIED' },
                    select: { donorId: true },
                    distinct: ['donorId']
                });

                for (const d of uniqueDonors) {
                    await sendNotification(d.donorId, "Campaign Successful", `Aapne jis campaign "${updatedCampaign.title}" mein madad ki thi, uske funds mukammal ho gaye hain!`);
                }
            }
        } else if (status === 'REJECTED' && existingDonation.status === 'VERIFIED') {
            await prisma.campaign.update({
                where: { id: donation.campaignId },
                data: { collectedAmount: { decrement: donation.amount } }
            });
        }

        res.status(200).json({ success: true, message: `Updated to ${status}`, data: donation });
    } catch (error) {
        console.error("Error verifying donation:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 3. Admin Dashboard ke liye Master Stats (Dono codes ka Mix)
const getSystemStats = async (req, res) => {
    try {
        // Counts
        const totalUsers = await prisma.user.count({ where: { role: 'DONOR' } });
        const totalBeneficiaries = await prisma.user.count({ where: { role: 'BENEFICIARY' } });
        const activeCampaigns = await prisma.campaign.count({ where: { status: 'ACTIVE' } });
        const pendingRequests = await prisma.assistanceRequest.count({ where: { status: 'PENDING' } });
        const pendingDonations = await prisma.donation.count({ where: { status: 'PENDING_VERIFICATION' } });

        // Total Funds Raised
        const campaigns = await prisma.campaign.findMany({ select: { collectedAmount: true } });
        const totalFundsRaised = campaigns.reduce((sum, camp) => sum + (camp.collectedAmount || 0), 0);

        // Category-wise Demand (Charts ke liye naya logic)
        const categoryStats = await prisma.assistanceRequest.groupBy({
            by: ['category'],
            _count: { category: true }
        });

        res.status(200).json({ 
            success: true, 
            data: {
                totalDonors: totalUsers,
                totalBeneficiaries,
                activeCampaigns,
                pendingRequests,
                pendingDonations,
                totalFundsRaised,
                categoryStats
            } 
        });
    } catch (error) {
        console.error("Error fetching system stats:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching stats' });
    }
};

module.exports = { getPendingDonations, approveDonation, getSystemStats };