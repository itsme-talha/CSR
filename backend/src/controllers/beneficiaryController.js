const beneficiaryService = require('../services/beneficiaryService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendNotification } = require('../utils/notificationHelper');

const setupProfile = async (req, res) => {
    try {
        // req.user.id authMiddleware se aayega
        const profile = await beneficiaryService.createProfile(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Beneficiary profile successfully complete ho gayi',
            data: profile
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const submitRequest = async (req, res) => {
    try {
        const request = await beneficiaryService.createAssistanceRequest(req.user.id, req.body);
        
        // Admin ko notification bhejne ka logic YAHAN hona chahiye
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (admin) {
            await sendNotification(
                admin.id, 
                "New Request Received", 
                "Ek beneficiary ne nayi assistance request submit ki hai. Review ke liye pending hai."
            );
        }

        res.status(201).json({
            success: true,
            message: 'Assistance request successfully submit ho gayi, Admin review ka wait karein',
            data: request
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Beneficiary ki apni requests fetch karne ka function
const getMyRequests = async (req, res) => {
    try {
        const profile = await prisma.beneficiaryProfile.findUnique({
            where: { userId: req.user.id } 
        });

        if (!profile) {
            return res.status(200).json({ success: true, data: [] });
        }

        const requests = await prisma.assistanceRequest.findMany({
            where: { beneficiaryId: profile.id },
            orderBy: { submittedAt: 'desc' },
            include: { campaign: true } // YEH LINE NAYI ADD KI HAI: Taake raised amount ka pata chal sake
        });

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching requests' });
    }
};
// Beneficiary ki taraf se Bank Account details submit karna
const submitAccountDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountDetails } = req.body;

        if (!accountDetails) {
            return res.status(400).json({ success: false, message: 'Account details required hain.' });
        }

        const updatedRequest = await prisma.assistanceRequest.update({
            where: { id },
            data: { accountDetails }
        });
        res.status(200).json({ success: true, message: 'Aapki account details Admin ko bhej di gayi hain.', data: updatedRequest });
    } catch (error) {
        console.error("Error submitting account details:", error);
        res.status(500).json({ success: false, message: 'Server error while submitting account details.' });
    }
};

module.exports = { setupProfile, submitRequest, getMyRequests, submitAccountDetails };