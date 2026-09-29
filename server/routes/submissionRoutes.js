const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  reviewSubmission,
  getSubmissions,
  getSubmissionById,
  getSubmissionHistory,
  getSubmissionsByStudentId,
} = require('../controllers/submissionController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

// Student submission endpoints
router.post('/', authenticateUser, authorizeRole('student'), submitAssignment);
router.post('/:assignmentId/versions', authenticateUser, authorizeRole('student'), submitAssignment);

// Admin review endpoint
router.put('/:id/review', authenticateUser, authorizeRole('admin'), reviewSubmission);

// General submission fetch endpoints
router.get('/', authenticateUser, authorizeRole('admin'), getSubmissions);
router.get('/assignment/:assignmentId/history', authenticateUser, getSubmissionHistory);
router.get('/student/:studentId', authenticateUser, authorizeRole('student'), getSubmissionsByStudentId);
router.get('/:id', authenticateUser, getSubmissionById);

module.exports = router;
