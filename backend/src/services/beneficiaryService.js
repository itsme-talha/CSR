const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProfile = async (userId, profileData) => {
    try {
        // Check if profile already exists for this user
        const existingProfile = await prisma.beneficiaryProfile.findUnique({
            where: { userId }
        });
        
        if (existingProfile) {
            throw new Error('Beneficiary profile pehle hi ban chuki hai');
        }

        // Create new profile
        return await prisma.beneficiaryProfile.create({
            data: {
                userId,
                ...profileData
            }
        });
    } catch (error) {
        // Prisma ka Unique Constraint Error (P2002) catch karna
        if (error.code === 'P2002' && error.meta?.target?.includes('cnicNumber')) {
            throw new Error('Yeh CNIC pehle se kisi aur account par registered hai. Barae meherbani theek CNIC darj karein.');
        }
        throw error;
    }
};
const createAssistanceRequest = async (userId, requestData) => {
    // User ki beneficiary profile dhundein
    const profile = await prisma.beneficiaryProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Request submit karne se pehle apni profile complete karein');

    // Request create karein
    return await prisma.assistanceRequest.create({
        data: {
            beneficiaryId: profile.id,
            category: requestData.category, // TUITION, HOSTEL, MEDICAL, ya TRANSPORT
            requestedAmount: requestData.requestedAmount,
            description: requestData.description
        }
    });
};

module.exports = { createProfile, createAssistanceRequest };