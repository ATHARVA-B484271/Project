const db = require('../config/memoryDb');

const isValidUrl = (u) => { try { const p = new URL(u).protocol; return p === 'http:' || p === 'https:'; } catch { return false; } };

// ─── Submit / Resubmit ────────────────────────────────────────────────
const submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId || req.body.assignmentId;
    const { response, submissionLink } = req.body;

    if (!assignmentId) return res.status(400).json({ message: 'Assignment ID is required.' });
    if (!response && !submissionLink) return res.status(400).json({ message: 'Provide a text response or submission link.' });
    if (submissionLink && submissionLink.trim() && !isValidUrl(submissionLink))
      return res.status(400).json({ message: 'Provide a valid URL (http:// or https://).' });

    const assignment = await db.findAssignment(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });

    const existingVersions = (await db.findSubmissions({ assignmentId, studentId: req.user._id }))
      .sort((a, b) => b.version - a.version);

    if (existingVersions.length > 0 && existingVersions[0].reviewStatus === 'ACCEPTED')
      return res.status(400).json({ message: 'This assignment is already ACCEPTED. No further submissions allowed.' });

    const nextVersion = existingVersions.length > 0 ? existingVersions[0].version + 1 : 1;
    const submittedAt = new Date();
    const status = submittedAt <= new Date(assignment.deadline) ? 'ON_TIME' : 'LATE';

    const submission = await db.createSubmission({
      assignmentId, studentId: req.user._id,
      version: nextVersion, response: response ? response.trim() : '',
      submissionLink: submissionLink ? submissionLink.trim() : '',
      submittedAt, status, reviewStatus: 'PENDING', marks: null, feedback: '',
    });

    const student = await db.findUser({ _id: req.user._id });
    res.status(201).json({
      message: status === 'ON_TIME' ? `Version ${nextVersion} submitted ON TIME!` : `Version ${nextVersion} submitted LATE.`,
      submission: { ...submission, assignmentId: assignment, studentId: student },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error processing submission.' });
  }
};

// ─── Review Submission (Admin) ────────────────────────────────────────
const reviewSubmission = async (req, res) => {
  try {
    const { marks, status, feedback } = req.body;
    if (!status || !['ACCEPTED', 'NEEDS_CHANGES'].includes(status))
      return res.status(400).json({ message: 'Valid status (ACCEPTED or NEEDS_CHANGES) is required.' });

    const submission = await db.findSubmission(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    const assignment = await db.findAssignment(submission.assignmentId);
    const maxMarks = assignment ? (assignment.maxMarks || 100) : 100;
    const numericMarks = Number(marks);

    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > maxMarks)
      return res.status(400).json({ message: `Marks must be between 0 and ${maxMarks}.` });

    const updated = await db.updateSubmission(req.params.id, {
      reviewStatus: status, marks: numericMarks,
      feedback: feedback ? feedback.trim() : '',
      reviewedAt: new Date(), reviewedBy: req.user._id,
    });

    await db.createNotification({
      userId: submission.studentId,
      title: `Assignment Review: ${assignment ? assignment.title : 'Assignment'}`,
      message: `Your Version ${submission.version} was reviewed. Status: ${status === 'ACCEPTED' ? 'ACCEPTED ✅' : 'NEEDS CHANGES 🔄'}. Marks: ${numericMarks}/${maxMarks}.`,
      type: status === 'ACCEPTED' ? 'success' : 'warning',
    });

    const student = await db.findUser({ _id: submission.studentId });
    res.json({
      message: 'Submission reviewed successfully.',
      submission: { ...updated, assignmentId: assignment, studentId: student },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error reviewing submission.' });
  }
};

// ─── Get All Submissions (Admin) ──────────────────────────────────────
const getSubmissions = async (req, res) => {
  try {
    const allSubs = await db.findSubmissions();
    const adminAssignments = await db.findAssignments({ createdBy: req.user._id });
    const adminAssignmentIds = new Set(adminAssignments.map(a => a._id));

    const enriched = await Promise.all(
      allSubs.filter(s => adminAssignmentIds.has(s.assignmentId)).map(async s => {
        const assignment = await db.findAssignment(s.assignmentId);
        const student = await db.findUser({ _id: s.studentId });
        return { ...s, assignmentId: assignment, studentId: student };
      })
    );

    res.json({
      submissions: enriched,
      stats: {
        totalSubmissions: enriched.length,
        pendingCount: enriched.filter(s => s.reviewStatus === 'PENDING').length,
        needsChangesCount: enriched.filter(s => s.reviewStatus === 'NEEDS_CHANGES').length,
        acceptedCount: enriched.filter(s => s.reviewStatus === 'ACCEPTED').length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving submissions.' });
  }
};

// ─── Get Submission by ID ─────────────────────────────────────────────
const getSubmissionById = async (req, res) => {
  try {
    const submission = await db.findSubmission(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    if (req.user.role === 'student' && submission.studentId !== req.user._id)
      return res.status(403).json({ message: 'Not authorized.' });

    const assignment = await db.findAssignment(submission.assignmentId);
    const student = await db.findUser({ _id: submission.studentId });
    const reviewer = submission.reviewedBy ? await db.findUser({ _id: submission.reviewedBy }) : null;

    const allVersions = await db.findSubmissions({ assignmentId: submission.assignmentId, studentId: submission.studentId });

    res.json({
      submission: { ...submission, assignmentId: assignment, studentId: student, reviewedBy: reviewer },
      totalVersions: allVersions.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving submission.' });
  }
};

// ─── Get Submission History ───────────────────────────────────────────
const getSubmissionHistory = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.query.studentId || req.user._id;

    if (req.user.role === 'student' && studentId !== req.user._id)
      return res.status(403).json({ message: 'Not authorized.' });

    const assignment = await db.findAssignment(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });

    const versions = (await db.findSubmissions({ assignmentId, studentId })).sort((a, b) => b.version - a.version);

    res.json({
      assignment: { id: assignment._id, title: assignment.title, description: assignment.description, deadline: assignment.deadline, maxMarks: assignment.maxMarks || 100 },
      history: versions,
      latestVersion: versions.length > 0 ? versions[0] : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving history.' });
  }
};

// ─── Get Student's Submissions ────────────────────────────────────────
const getSubmissionsByStudentId = async (req, res) => {
  try {
    const allSubs = await db.findSubmissions({ studentId: req.user._id });
    const enriched = await Promise.all(allSubs.map(async s => {
      const assignment = await db.findAssignment(s.assignmentId);
      return { ...s, assignmentId: assignment };
    }));

    // Latest version per assignment
    const latestByAssignment = {};
    enriched.forEach(s => {
      const key = s.assignmentId?._id || s.assignmentId;
      if (!latestByAssignment[key] || s.version > latestByAssignment[key].version)
        latestByAssignment[key] = s;
    });

    res.json({ submissions: Object.values(latestByAssignment), allHistory: enriched });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving student submissions.' });
  }
};

module.exports = { submitAssignment, reviewSubmission, getSubmissions, getSubmissionById, getSubmissionHistory, getSubmissionsByStudentId };
