const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateRequestStatus = async (requestId, status) => {
    // Request ka status update karna (e.g., PENDING se APPROVED ya REJECTED)
    return await prisma.assistanceRequest.update({
        where: { id: requestId },
        data: { status }
    });
};

const createCampaign = async (campaignData) => {
    // Check karna ke request exist karti hai aur APPROVED hai ya nahi
    const request = await prisma.assistanceRequest.findUnique({
        where: { id: campaignData.requestId }
    });

    if (!request || request.status !== 'APPROVED') {
        throw new Error('Campaign sirf approved requests ke liye banayi ja sakti hai');
    }

    // Nayi campaign database mein save karna
    return await prisma.campaign.create({
        data: {
            requestId: campaignData.requestId,
            title: campaignData.title,
            description: campaignData.description,
            targetAmount: campaignData.targetAmount,
            deadline: new Date(campaignData.deadline),
            urgencyTag: campaignData.urgencyTag || 'NORMAL',
            status: 'ACTIVE'
        }
    });
};

module.exports = { updateRequestStatus, createCampaign };