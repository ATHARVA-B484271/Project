const db = require('../config/memoryDb');

// ─── Create Assignment (Admin only) ─────────────────────────────────────
const createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, maxMarks } = req.body;
    if (!title || !description || !deadline)
      return res.status(400).json({ message: 'Title, description and deadline are required.' });

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime()))
      return res.status(400).json({ message: 'Invalid deadline date.' });

    const assignment = await db.createAssignment({
      title: title.trim(),
      description: description.trim(),
      deadline: deadlineDate,
      maxMarks: maxMarks ? Number(maxMarks) : 100,
      createdBy: req.user.userId,
    });

    res.status(201).json({ message: 'Assignment created successfully.', assignment });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating assignment.' });
  }
};

// ─── Get All Assignments ────────────────────────────────────────────────
const getAssignments = async (req, res) => {
  try {
    const assignments = await db.findAssignments();

    // Enrich with submission counts
    const enriched = await Promise.all(assignments.map(async (a) => {
      const subs = await db.findSubmissions({ assignmentId: a._id });
      const uniqueStudents = new Set(subs.map(s => s.studentId)).size;
      return { ...a, submissionCount: uniqueStudents };
    }));

    res.json({ assignments: enriched });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching assignments.' });
  }
};

// ─── Get Single Assignment ──────────────────────────────────────────────
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await db.findAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });

    const subs = await db.findSubmissions({ assignmentId: assignment._id });

    // Enrich submissions with student info
    const enrichedSubs = await Promise.all(subs.map(async (s) => {
      const student = await db.findUser({ _id: s.studentId });
      return { ...s, student: student ? { id: student._id, name: student.name, email: student.email, studentId: student.studentId } : null };
    }));

    res.json({ assignment: { ...assignment, submissions: enrichedSubs } });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching assignment.' });
  }
};

// ─── Delete Assignment (Admin only) ────────────────────────────────────
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await db.findAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });
    await db.deleteAssignment(req.params.id);
    res.json({ message: 'Assignment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting assignment.' });
  }
};

module.exports = { createAssignment, getAssignments, getAssignmentById, deleteAssignment };
