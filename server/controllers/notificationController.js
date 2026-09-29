const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications.' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications.' });
  }
};

module.exports = {
  getNotifications,
  markAllRead,
};
