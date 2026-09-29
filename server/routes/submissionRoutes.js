const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getSubmissions,
  getSubmissionById,
  getSubmissionsByAssignmentId,
  getSubmissionsByStudentId,
} = require('../controllers/submissionController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, authorizeRole('student'), submitAssignment);
router.get('/', authenticateUser, authorizeRole('admin'), getSubmissions);
router.get('/assignment/:assignmentId', authenticateUser, authorizeRole('admin'), getSubmissionsByAssignmentId);
router.get('/student/:studentId', authenticateUser, authorizeRole('student'), getSubmissionsByStudentId);
router.get('/:id', authenticateUser, getSubmissionById);

module.exports = router;
