const express = require('express');
const router = express.Router();
const { getNotifications, markAllRead } = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getNotifications);
router.put('/read-all', authenticateUser, markAllRead);

module.exports = router;
