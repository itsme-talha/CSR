const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const saveDocumentRecord = async (userId, documentData) => {
    // User ki beneficiary profile fetch karein
    const profile = await prisma.beneficiaryProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Document upload karne ke liye profile hona zaroori hai');

    return await prisma.document.create({
        data: {
            beneficiaryId: profile.id,
            requestId: documentData.requestId || null, // Agar kisi specific request se linked ho
            docType: documentData.docType, // e.g., 'CNIC', 'STUDENT_CARD'
            fileUrl: documentData.fileUrl,
            fileName: documentData.fileName
        }
    });
};

module.exports = { saveDocumentRecord };