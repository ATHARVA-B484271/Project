const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc Create Assignment
// @route POST /api/assignments
// @access Private (Admin only)
const createAssignment = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: 'Title, description, and deadline are required.' });
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: 'Invalid deadline date format.' });
    }

    // Deadline validation check (must not be in the past when creating)
    if (deadlineDate <= new Date()) {
      return res.status(400).json({ message: 'Deadline date must be in the future.' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      deadline: deadlineDate,
      createdBy: req.user._id,
    });

    const populatedAssignment = await Assignment.findById(assignment._id).populate('createdBy', 'name email adminId department');

    res.status(201).json({
      message: 'Assignment created successfully.',
      assignment: populatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error creating assignment.' });
  }
};

// @desc Get All Assignments
// @route GET /api/assignments
// @access Private
const getAssignments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      // Admin sees assignments created by them
      query = { createdBy: req.user._id };
    }

    const assignments = await Assignment.find(query)
      .populate('createdBy', 'name email adminId department')
      .sort({ createdAt: -1 });

    // Fetch submission stats or individual student submission state
    const currentTime = new Date();

    if (req.user.role === 'admin') {
      const enrichedAssignments = await Promise.all(
        assignments.map(async (assignment) => {
          const submissionCount = await Submission.countDocuments({ assignmentId: assignment._id });
          const isClosed = currentTime > new Date(assignment.deadline);
          return {
            ...assignment.toObject(),
            submissionCount,
            status: isClosed ? 'CLOSED' : 'ACTIVE',
          };
        })
      );
      return res.json({ assignments: enrichedAssignments });
    }

    // Student role
    const enrichedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId: req.user._id,
        });

        const isClosed = currentTime > new Date(assignment.deadline);
        return {
          ...assignment.toObject(),
          status: isClosed ? 'CLOSED' : 'ACTIVE',
          submissionStatus: submission ? submission.status : 'NOT_SUBMITTED',
          submittedAt: submission ? submission.submittedAt : null,
          submissionId: submission ? submission._id : null,
        };
      })
    );

    res.json({ assignments: enrichedAssignments });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving assignments.' });
  }
};

// @desc Get Single Assignment
// @route GET /api/assignments/:id
// @access Private
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('createdBy', 'name email adminId department');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    const currentTime = new Date();
    const isClosed = currentTime > new Date(assignment.deadline);

    let submissionInfo = null;

    if (req.user.role === 'student') {
      const submission = await Submission.findOne({
        assignmentId: assignment._id,
        studentId: req.user._id,
      });

      if (submission) {
        submissionInfo = {
          id: submission._id,
          response: submission.response,
          submissionLink: submission.submissionLink,
          submittedAt: submission.submittedAt,
          status: submission.status,
        };
      }
    }

    res.json({
      assignment: {
        ...assignment.toObject(),
        status: isClosed ? 'CLOSED' : 'ACTIVE',
      },
      submission: submissionInfo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving assignment.' });
  }
};

// @desc Delete Assignment
// @route DELETE /api/assignments/:id
// @access Private (Admin only)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this assignment.' });
    }

    await Assignment.findByIdAndDelete(req.params.id);
    // Also delete associated submissions
    await Submission.deleteMany({ assignmentId: req.params.id });

    res.json({ message: 'Assignment and associated submissions deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting assignment.' });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
};
