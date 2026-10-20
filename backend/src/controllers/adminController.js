const adminService = require('../services/adminService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendNotification } = require('../utils/notificationHelper');

const verifyRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminReason } = req.body; // Frontend se adminReason bhi aayega

        // 1. VALIDATION: Status lazmi hona chahiye
        if (!status) {
            return res.status(400).json({ success: false, message: 'Status provide karna zaroori hai' });
        }

        // 2. VALIDATION: Reject, Approve, ya More Info ke liye description lazmi hai
        if ((status === 'REJECTED' || status === 'APPROVED' || status === 'MORE_INFORMATION_REQUIRED') && !adminReason) {
            return res.status(400).json({ 
                success: false, 
                message: `${status} karne ke liye reason/description likhna lazmi hai.` 
            });
        }

        // Database mein Status aur Reason update karna
        const updatedRequest = await prisma.assistanceRequest.update({
            where: { id },
            data: { 
                status,
                ...(adminReason && { adminReason }) // Agar reason aya hai toh save karega
            }
        });

        // Notification aur Campaign ka logic
        const requestRecord = await prisma.assistanceRequest.findUnique({
            where: { id },
            include: { beneficiary: true }
        });

        if (requestRecord) {
            const beneficiaryUserId = requestRecord.beneficiary.userId;

            if (status === 'REJECTED') {
                await prisma.campaign.updateMany({
                    where: { requestId: id },
                    data: { status: 'CLOSED' }
                });
                await sendNotification(
                    beneficiaryUserId, 
                    "Request Rejected", 
                    `Aapki application reject ho gayi hai. Reason: ${adminReason}`
                );
            } else if (status === 'APPROVED') {
                await prisma.campaign.updateMany({
                    where: { requestId: id },
                    data: { status: 'ACTIVE' }
                });
                await sendNotification(
                    beneficiaryUserId, 
                    "Request Approved", 
                    `Mubarak ho! Aapki request approve ho gayi hai. Admin Notes: ${adminReason}`
                );
            } else if (status === 'MORE_INFORMATION_REQUIRED') {
                // Agar Admin ko mazeed documents chahiyein toh usko alert jayega
                await sendNotification(
                    beneficiaryUserId, 
                    "Action Required", 
                    `Admin ne aapki application par mazeed documents maange hain. Reason: ${adminReason}`
                );
            }
        }

        res.status(200).json({
            success: true,
            message: `Request status successfully '${status}' mein update ho gaya hai.`,
            data: updatedRequest
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
const launchCampaign = async (req, res) => {
    try {
        const { requestId, title, description, targetAmount, deadline } = req.body;

        if (!requestId || !title || !description || !targetAmount || !deadline) {
            return res.status(400).json({ success: false, message: 'Tamam fields required hain' });
        }

        const campaign = await adminService.createCampaign(req.body);
        
        // NAYA CODE: Jab Campaign launch ho toh sab Donors ko Alert bhejein
        const allDonors = await prisma.user.findMany({ where: { role: 'DONOR' } });
        for (const donor of allDonors) {
            await sendNotification(
                donor.id, 
                "New Campaign Launched", 
                `Ek student ko aapki madad ki zaroorat hai. Nayi campaign "${title}" start hui hai.`
            );
        }

        res.status(201).json({
            success: true,
            message: 'Nayi charity campaign successfully live ho gayi hai',
            data: campaign
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const requests = await prisma.assistanceRequest.findMany({
            include: { 
                beneficiary: true,
                documents: true,
                campaign: true
            },
            orderBy: { submittedAt: 'desc' }
        });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching requests' });
    }
};

const getRequestDocuments = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.assistanceRequest.findUnique({
            where: { id },
            select: { beneficiaryId: true }
        });

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const documents = await prisma.document.findMany({
            where: { beneficiaryId: request.beneficiaryId }
        });

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ success: false, message: 'Server error in fetching documents' });
    }
};

const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            include: { 
                request: {
                    include: { beneficiary: true }
                } 
            },
            orderBy: { deadline: 'asc' }
        });
        res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching campaigns' });
    }
};

const toggleCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        
        let disbursementProof = undefined;
        if (req.file) {
            disbursementProof = `/uploads/${req.file.filename}`;
        }

        const campaign = await prisma.campaign.update({
            where: { id },
            data: { 
                status,
                ...(disbursementProof && { disbursementProof }) 
            },
            include: { request: { include: { beneficiary: true } } }
        });

        // NAYA CODE: Agar status COMPLETED hai aur Receipt aayi hai, toh Beneficiary ko batayen
        if (status === 'COMPLETED' && disbursementProof) {
            const beneficiaryUserId = campaign.request.beneficiary.userId;
            await sendNotification(
                beneficiaryUserId, 
                "Funds Transferred", 
                `Aapke funds transfer kar diye gaye hain. Apne dashboard mein receipt check karein.`
            );
        }

        res.status(200).json({ success: true, message: `Campaign is now ${status}`, data: campaign });
    } catch (error) {
        console.error("Error updating campaign status:", error);
        res.status(500).json({ success: false, message: 'Server error while updating campaign' });
    }
};
// === UPDATED FUNCTION: Fetch complete Beneficiary profile data ===
const getAllBeneficiaries = async (req, res) => {
    try {
        // User table se beneficiaries ko fetch karein aur sath unki profile include karein
        const beneficiaries = await prisma.user.findMany({
            where: { 
                role: 'BENEFICIARY' 
            },
            include: {
                // Error ke mutabiq relation ka sahi naam 'beneficiaryProfile' hai
                beneficiaryProfile: true 
            }
        });

        // Frontend table ki zaroorat ke mutabiq data format karein
        const formattedData = beneficiaries.map(b => {
            // Profile data extract kar rahe hain 'beneficiaryProfile' se
            const profile = b.beneficiaryProfile || {};

            return {
                id: b.id,
                name: b.name || 'Unknown',
                email: b.email || 'No Email',
                // Database column names ke hisaab se fallback logic
                regNo: profile.registrationNumber || profile.regNo || 'N/A', 
                department: profile.department || 'N/A',
                semester: profile.currentSemester || profile.semester || 'N/A',
                cgpa: profile.currentCGPA || profile.cgpa || 'N/A',
                cnic: profile.cnicNumber || profile.cnic || 'N/A',
                guardianName: profile.guardianName || 'N/A',
                status: profile.isVerified ? 'Verified' : 'Pending',
            };
        });

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching beneficiaries' });
    }
};
module.exports = { 
    verifyRequest, 
    launchCampaign, 
    getPendingRequests, 
    getRequestDocuments,
    getAllCampaigns, 
    toggleCampaignStatus,
    getAllBeneficiaries
};