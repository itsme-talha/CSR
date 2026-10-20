const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendNotification } = require('../utils/notificationHelper');

// 1. Kisi ek request ke tamam messages fetch karna
const getMessages = async (req, res) => {
    try {
        const { requestId } = req.params;

        const messages = await prisma.requestMessage.findMany({
            where: { requestId },
            include: {
                sender: { select: { name: true, role: true } } // Sender ka naam aur role chahiye
            },
            orderBy: { createdAt: 'asc' } // Purane messages pehle, naye baad mein
        });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching messages.' });
    }
};

// 2. Naya message ya file send karna
const sendMessage = async (req, res) => {
    try {
        const { requestId, message } = req.body;
        const senderId = req.user.id; // Auth middleware se aayega

        if (!requestId || !message) {
            return res.status(400).json({ success: false, message: 'Request ID aur message text zaroori hai.' });
        }

        // Agar koi document/image attach ki gayi hai
        let fileUrl = null;
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const newMessage = await prisma.requestMessage.create({
            data: {
                requestId,
                senderId,
                message,
                ...(fileUrl && { fileUrl })
            },
            include: {
                sender: { select: { name: true, role: true } }
            }
        });

        // Notification System: Agar Admin ne message bheja hai toh Beneficiary ko alert jaye, aur vice versa
        const requestRecord = await prisma.assistanceRequest.findUnique({
            where: { id: requestId },
            include: { beneficiary: { select: { userId: true } } }
        });

        if (requestRecord) {
            if (req.user.role === 'ADMIN') {
                await sendNotification(
                    requestRecord.beneficiary.userId,
                    "New Message from Admin",
                    "Admin ne aapki application par ek message bheja hai."
                );
            } else if (req.user.role === 'BENEFICIARY') {
                // Admin ko alert bhej sakte hain
                const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
                if (admin) {
                    await sendNotification(admin.id, "New Document/Message", "Beneficiary ne requested document bhej diya hai.");
                }
            }
        }

        res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: 'Server error while sending message.' });
    }
};

module.exports = { getMessages, sendMessage };