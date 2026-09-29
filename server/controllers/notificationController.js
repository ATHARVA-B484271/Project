const db = require('../config/memoryDb');

const getNotifications = async (req, res) => {
  try {
    const notifications = (await db.findNotifications({ userId: req.user._id })).slice(0, 20);
    const unreadCount = await db.countUnreadNotifications(req.user._id);
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications.' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await db.markAllNotificationsRead(req.user._id);
    res.json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications.' });
  }
};

module.exports = { getNotifications, markAllRead };
