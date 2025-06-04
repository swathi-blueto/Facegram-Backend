import {
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
  } from "../services/notificationService.js";
  

  export const fetchNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await getUserNotifications(userId);
    
    
    const formattedData = data.map(notification => {
      if (notification.type === 'message') {
        return {
          ...notification,
          body: notification.message || 'New message'
        };
      }
      return notification;
    });

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  

export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id; // Get from authenticated user
    
    if (!notificationId || !userId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const data = await markNotificationAsRead(notificationId, userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: err.message });
  }
};
  
  
  export const deleteNotif = async (req, res) => {
    try {
      const notificationId = req.params.id;
      const userId = req.user.id;
      await deleteNotification(notificationId, userId);
      res.json({ message: "Notification deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  