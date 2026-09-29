const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');

// Helper to validate URL if provided
const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

// @desc Submit Assignment (Creates new version if resubmitting)
// @route POST /api/submissions
// @route POST /api/submissions/:assignmentId/versions
// @access Private (Student only)
const submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId || req.body.assignmentId;
    const { response, submissionLink } = req.body;

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

    // Find all existing submission versions for this student + assignment
    const existingVersions = await Submission.find({
      assignmentId,
      studentId: req.user._id,
    }).sort({ version: -1 });

    if (existingVersions.length > 0) {
      const latestVersion = existingVersions[0];
      if (latestVersion.reviewStatus === 'ACCEPTED') {
        return res.status(400).json({
          message: 'This assignment has already been ACCEPTED by your professor. No further updates allowed.',
        });
      }
    }

    // Calculate version number: nextVersion = highest existing version + 1
    const nextVersion = existingVersions.length > 0 ? existingVersions[0].version + 1 : 1;

    // SERVER TIMESTAMP DEADLINE COMPARISON LOGIC
    const submittedAt = new Date();
    const deadlineDate = new Date(assignment.deadline);

    // Exact comparison: IF submittedAt <= deadlineDate -> ON_TIME, ELSE -> LATE
    const status = submittedAt.getTime() <= deadlineDate.getTime() ? 'ON_TIME' : 'LATE';

    // CREATE A BRAND NEW VERSION RECORD (Never overwrite previous versions)
    const newSubmission = await Submission.create({
      assignmentId,
      studentId: req.user._id,
      version: nextVersion,
      response: response ? response.trim() : '',
      submissionLink: submissionLink ? submissionLink.trim() : '',
      submittedAt,
      status,
      reviewStatus: 'PENDING',
      marks: null,
      feedback: '',
    });

    const populatedSubmission = await Submission.findById(newSubmission._id)
      .populate('assignmentId', 'title description deadline maxMarks')
      .populate('studentId', 'name email studentId department academicYear');

    res.status(201).json({
      message: status === 'ON_TIME' ? `Version ${nextVersion} submitted ON TIME!` : `Version ${nextVersion} submitted LATE.`,
      submission: populatedSubmission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error processing submission.' });
  }
};

// @desc Review Submission (Admin)
// @route PUT /api/submissions/:id/review
// @access Private (Admin only)
const reviewSubmission = async (req, res) => {
  try {
    const { marks, status, feedback } = req.body;

    if (!status || !['ACCEPTED', 'NEEDS_CHANGES'].includes(status)) {
      return res.status(400).json({ message: 'Valid review status (ACCEPTED or NEEDS_CHANGES) is required.' });
    }

    const submission = await Submission.findById(req.params.id).populate('assignmentId');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    const maxMarks = submission.assignmentId.maxMarks || 10;
    const numericMarks = Number(marks);

    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > maxMarks) {
      return res.status(400).json({ message: `Marks must be a valid number between 0 and ${maxMarks}.` });
    }

    submission.reviewStatus = status;
    submission.marks = numericMarks;
    submission.feedback = feedback ? feedback.trim() : '';
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user._id;

    await submission.save();

    // Create Notification for student
    await Notification.create({
      userId: submission.studentId,
      title: `Assignment Review: ${submission.assignmentId.title}`,
      message: `Your Version ${submission.version} submission was reviewed by your professor. Status: ${
        status === 'ACCEPTED' ? 'ACCEPTED' : 'NEEDS CHANGES'
      }. Marks: ${numericMarks}/${maxMarks}.`,
      type: status === 'ACCEPTED' ? 'success' : 'warning',
    });

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('assignmentId', 'title description deadline maxMarks')
      .populate('studentId', 'name email studentId department academicYear')
      .populate('reviewedBy', 'name email adminId');

    res.json({
      message: 'Submission reviewed successfully.',
      submission: populatedSubmission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error reviewing submission.' });
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
        select: 'title description deadline createdBy maxMarks',
      })
      .populate('studentId', 'name email studentId department academicYear')
      .sort({ submittedAt: -1 });

    // Filter to only submissions for assignments created by logged-in admin
    const adminSubmissions = submissions.filter(
      (sub) => sub.assignmentId && sub.assignmentId.createdBy.toString() === req.user._id.toString()
    );

    // Calculate Summary Stats
    const pendingCount = adminSubmissions.filter((s) => s.reviewStatus === 'PENDING').length;
    const needsChangesCount = adminSubmissions.filter((s) => s.reviewStatus === 'NEEDS_CHANGES').length;
    const acceptedCount = adminSubmissions.filter((s) => s.reviewStatus === 'ACCEPTED').length;

    res.json({
      submissions: adminSubmissions,
      stats: {
        totalSubmissions: adminSubmissions.length,
        pendingCount,
        needsChangesCount,
        acceptedCount,
      },
    });
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
      .populate('assignmentId', 'title description deadline createdBy maxMarks')
      .populate('studentId', 'name email studentId department academicYear')
      .populate('reviewedBy', 'name email adminId');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Verify authorization
    if (
      req.user.role === 'student' &&
      submission.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this submission.' });
    }

    // Check count of total versions for this student + assignment
    const previousVersionsCount = await Submission.countDocuments({
      assignmentId: submission.assignmentId._id,
      studentId: submission.studentId._id,
    });

    res.json({
      submission,
      totalVersions: previousVersionsCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving submission.' });
  }
};

// @desc Get Submission History for Assignment (Student or Admin)
// @route GET /api/submissions/assignment/:assignmentId/history
// @access Private
const getSubmissionHistory = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.query.studentId || req.user._id;

    // Verify permission if student
    if (req.user.role === 'student' && studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this history.' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    const versions = await Submission.find({ assignmentId, studentId })
      .populate('reviewedBy', 'name email adminId')
      .sort({ version: -1 });

    res.json({
      assignment: {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        maxMarks: assignment.maxMarks || 10,
      },
      history: versions,
      latestVersion: versions.length > 0 ? versions[0] : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving submission history.' });
  }
};

// @desc Get Submissions by Student ID (Student)
// @route GET /api/submissions/student/:studentId
// @access Private (Student only)
const getSubmissionsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user._id.toString() !== studentId && req.user.studentId !== studentId) {
      return res.status(403).json({ message: 'Not authorized to view these submissions.' });
    }

    // Fetch all submissions by student
    const allSubmissions = await Submission.find({ studentId: req.user._id })
      .populate('assignmentId', 'title description deadline maxMarks')
      .sort({ submittedAt: -1 });

    // Group by assignment to highlight the latest version per assignment
    const latestByAssignment = {};
    allSubmissions.forEach((sub) => {
      const assignId = sub.assignmentId?._id?.toString() || sub.assignmentId?.toString();
      if (!latestByAssignment[assignId] || sub.version > latestByAssignment[assignId].version) {
        latestByAssignment[assignId] = sub;
      }
    });

    const latestSubmissions = Object.values(latestByAssignment);

    res.json({
      submissions: latestSubmissions,
      allHistory: allSubmissions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving student submissions.' });
  }
};

module.exports = {
  submitAssignment,
  reviewSubmission,
  getSubmissions,
  getSubmissionById,
  getSubmissionHistory,
  getSubmissionsByStudentId,
};
