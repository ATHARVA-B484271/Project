const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
} = require('../controllers/assignmentController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, authorizeRole('admin'), createAssignment);
router.get('/', authenticateUser, getAssignments);
router.get('/:id', authenticateUser, getAssignmentById);
router.delete('/:id', authenticateUser, authorizeRole('admin'), deleteAssignment);

module.exports = router;
