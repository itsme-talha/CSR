const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendNotification = async (userId, title, message) => {
    try {
        await prisma.notification.create({
            data: { userId, title, message }
        });
    } catch (error) {
        console.error("Notification save karte waqt error:", error);
    }
};

module.exports = { sendNotification };