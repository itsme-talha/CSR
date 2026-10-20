const donationService = require('../services/donationService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const submitDonation = async (req, res) => {
    try {
        const { campaignId, amount, paymentMethod, transactionId } = req.body;

        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Payment receipt image is required' 
            });
        }

        const receiptUrl = `/uploads/${req.file.filename}`;

        const donation = await prisma.donation.create({
            data: {
                campaignId: campaignId,
                donorId: req.user.id, 
                amount: Number(amount),
                // Yahan transactionId ki jagah transactionReference use karna hai
                transactionReference: `${paymentMethod} - ${transactionId}`, 
                receiptUrl: receiptUrl,
                
            }
        });
        
        res.status(201).json({
            success: true,
            message: 'Donation receipt successfully upload ho gayi hai. Admin verification ka wait karein.',
            data: donation
        });
    } catch (error) {
        console.error("Donation creation error:", error);
        res.status(500).json({ success: false, message: 'Server error while creating donation' });
    }
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
if (admin) {
    await sendNotification(
        admin.id,
        "New Donation Received",
        `Ek donor ne nayi donation submit ki hai jo verification ke liye pending hai.`
    );
}
};

// Donor ki apni donations fetch karne ka function
const getMyDonations = async (req, res) => {
    try {
        const history = await prisma.donation.findMany({
            where: { donorId: req.user.id },
            orderBy: { donatedAt: 'desc' }, // Sab se nayi donation upar aayegi
            include: {
                campaign: {
                    select: { title: true }
                }
            }
        });
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        console.error("Error fetching donor history:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching history' });
    }
};

module.exports = { submitDonation, getMyDonations }; // Ensure getMyDonations is exported