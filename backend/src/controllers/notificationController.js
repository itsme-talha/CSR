const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Ab role ki zaroorat nahi, sirf logged-in user ki apni notifications fetch hongi
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const formattedNotifications = notifications.map(n => ({
      id: n.id,
      text: n.message || n.title, 
      time: n.createdAt, 
      isRead: n.isRead || false
    }));

    res.status(200).json(formattedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error fetching notifications" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await prisma.notification.updateMany({
      where: { 
        userId: userId, 
        isRead: false 
      },
      data: { isRead: true }
    });

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ success: false, message: "Server error updating notifications" });
  }
};

module.exports = { getMyNotifications, markAllAsRead };