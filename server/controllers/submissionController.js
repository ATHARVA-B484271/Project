const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// Helper to validate URL if provided
const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

// @desc Submit Assignment
// @route POST /api/submissions
// @access Private (Student only)
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, response, submissionLink } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required.' });
    }

    if (!response && !submissionLink) {
      return res.status(400).json({ message: 'Please provide either a text response or a submission link.' });
    }

    if (submissionLink && submissionLink.trim() !== '' && !isValidUrl(submissionLink)) {
      return res.status(400).json({ message: 'Please provide a valid submission URL starting with http:// or https://' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // SERVER TIMESTAMP DEADLINE COMPARISON LOGIC
    const submittedAt = new Date();
    const deadlineDate = new Date(assignment.deadline);

    // Exact comparison: IF submittedAt <= deadlineDate -> ON_TIME, ELSE -> LATE
    const status = submittedAt.getTime() <= deadlineDate.getTime() ? 'ON_TIME' : 'LATE';

    // Upsert submission (if already submitted, update submission)
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId: req.user._id,
    });

    let submission;
    if (existingSubmission) {
      existingSubmission.response = response || existingSubmission.response;
      existingSubmission.submissionLink = submissionLink || existingSubmission.submissionLink;
      existingSubmission.submittedAt = submittedAt;
      existingSubmission.status = status;
      submission = await existingSubmission.save();
    } else {
      submission = await Submission.create({
        assignmentId,
        studentId: req.user._id,
        response,
        submissionLink,
        submittedAt,
        status,
      });
    }

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('assignmentId', 'title description deadline')
      .populate('studentId', 'name email studentId department academicYear');

    res.status(200).json({
      message: status === 'ON_TIME' ? 'Assignment submitted ON TIME!' : 'Assignment submitted LATE.',
      submission: populatedSubmission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error processing submission.' });
  }
};

// @desc Get All Submissions (Admin)
// @route GET /api/submissions
// @access Private (Admin only)
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate({
        path: 'assignmentId',
        select: 'title description deadline createdBy',
      })
      .populate('studentId', 'name email studentId department academicYear')
      .sort({ submittedAt: -1 });

    // Filter to only submissions for assignments created by logged-in admin
    const adminSubmissions = submissions.filter(
      (sub) => sub.assignmentId && sub.assignmentId.createdBy.toString() === req.user._id.toString()
    );

    res.json({ submissions: adminSubmissions });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving submissions.' });
  }
};

// @desc Get Submission by ID
// @route GET /api/submissions/:id
// @access Private
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('assignmentId', 'title description deadline createdBy')
      .populate('studentId', 'name email studentId department academicYear');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Verify ownership/role permission
    if (
      req.user.role === 'student' &&
      submission.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this submission.' });
    }

    res.json({ submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving submission.' });
  }
};

// @desc Get Submissions by Assignment ID (Admin)
// @route GET /api/submissions/assignment/:assignmentId
// @access Private (Admin only)
const getSubmissionsByAssignmentId = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view submissions for this assignment.' });
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email studentId department academicYear')
      .sort({ submittedAt: -1 });

    res.json({
      assignment: {
        id: assignment._id,
        title: assignment.title,
        deadline: assignment.deadline,
      },
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving assignment submissions.' });
  }
};

// @desc Get My Submissions (Student)
// @route GET /api/submissions/student/:studentId
// @access Private (Student only)
const getSubmissionsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify student is fetching their own submissions
    if (req.user._id.toString() !== studentId && req.user.studentId !== studentId) {
      return res.status(403).json({ message: 'Not authorized to view these submissions.' });
    }

    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('assignmentId', 'title description deadline')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving student submissions.' });
  }
};

module.exports = {
  submitAssignment,
  getSubmissions,
  getSubmissionById,
  getSubmissionsByAssignmentId,
  getSubmissionsByStudentId,
};
