const express = require('express');
const router = express.Router();
const {
  adminRegister,
  adminLogin,
  studentRegister,
  studentLogin,
  getMe,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);

router.post('/student/register', studentRegister);
router.post('/student/login', studentLogin);

router.get('/me', authenticateUser, getMe);

module.exports = router;
