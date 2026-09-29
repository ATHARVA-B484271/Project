const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');

const seedDemoData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('[Seed] Seeding default demo accounts and assignments for Level 2...');

    // Create Admin
    const admin = await User.create({
      name: 'Prof. Alan Turing',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      adminId: 'ADM-2026-01',
      department: 'Computer Science & Engineering',
    });

    // Create Student
    const student = await User.create({
      name: 'Atharva Belurkar',
      email: 'student@example.com',
      password: 'student123',
      role: 'student',
      studentId: 'STU-2026001',
      department: 'Computer Science & Engineering',
      academicYear: '4th Year',
    });

    // Dates
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
    const futureDate2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days
    const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // -2 days

    // Create Sample Assignments
    const assign1 = await Assignment.create({
      title: 'Database Management Assignment 1: Relational Normalization',
      description: 'Explain 1NF, 2NF, 3NF and BCNF with real-world database table examples. Provide SQL schema definitions for each form.',
      deadline: futureDate1,
      maxMarks: 10,
      createdBy: admin._id,
    });

    const assign2 = await Assignment.create({
      title: 'Web Engineering Project: RESTful API Security & JWT Integration',
      description: 'Design and implement a role-based access control system using JWT authentication and password hashing in Node.js Express.',
      deadline: futureDate2,
      maxMarks: 20,
      createdBy: admin._id,
    });

    const assign3 = await Assignment.create({
      title: 'Data Structures Lab 1: Binary Search Trees & Graph Traversals',
      description: 'Implement BFS and DFS algorithms in C++/Java. Measure traversal time complexities on benchmark datasets.',
      deadline: pastDate,
      maxMarks: 10,
      createdBy: admin._id,
    });

    // Create sample submissions with Version 1 and Version 2 history
    // Version 1 of assign3 (NEEDS_CHANGES)
    await Submission.create({
      assignmentId: assign3._id,
      studentId: student._id,
      version: 1,
      response: 'Implemented basic BFS traversal algorithm. DFS function had stack overflow bug on graphs exceeding 1,000 nodes.',
      submissionLink: 'https://github.com/atharva/ds-lab-v1',
      submittedAt: new Date(pastDate.getTime() - 12 * 60 * 60 * 1000),
      status: 'ON_TIME',
      reviewStatus: 'NEEDS_CHANGES',
      marks: 5,
      feedback: 'Good initial effort on BFS. Please fix the recursion stack overflow in DFS and submit Version 2.',
      reviewedAt: new Date(pastDate.getTime() - 8 * 60 * 60 * 1000),
      reviewedBy: admin._id,
    });

    // Version 2 of assign3 (ACCEPTED)
    await Submission.create({
      assignmentId: assign3._id,
      studentId: student._id,
      version: 2,
      response: 'Fixed recursion stack overflow in DFS by utilizing explicit iterative stack data structure. Added benchmark report for 10,000 nodes.',
      submissionLink: 'https://github.com/atharva/ds-lab-v2-final',
      submittedAt: new Date(pastDate.getTime() - 2 * 60 * 60 * 1000),
      status: 'ON_TIME',
      reviewStatus: 'ACCEPTED',
      marks: 9,
      feedback: 'Excellent improvement! Stack overflow resolved cleanly and benchmarking table is thorough.',
      reviewedAt: new Date(pastDate.getTime() - 1 * 60 * 60 * 1000),
      reviewedBy: admin._id,
    });

    // Version 1 of assign1 (PENDING)
    await Submission.create({
      assignmentId: assign1._id,
      studentId: student._id,
      version: 1,
      response: 'Normalization reduces data redundancy and improves data integrity. 1NF eliminates duplicate columns, 2NF removes partial dependency, and 3NF removes transitive dependency.',
      submissionLink: 'https://github.com/atharva/dbms-normalization-doc',
      submittedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      status: 'ON_TIME',
      reviewStatus: 'PENDING',
      marks: null,
      feedback: '',
    });

    // Create initial notification for student
    await Notification.create({
      userId: student._id,
      title: 'Assignment Review Update: Data Structures Lab 1',
      message: 'Your Version 2 submission was reviewed by Prof. Alan Turing. Status: ACCEPTED. Marks: 9/10.',
      type: 'success',
      isRead: false,
    });

    console.log('[Seed] Level 2 Demo data successfully seeded!');
    console.log('       Admin Email: admin@example.com | Password: admin123');
    console.log('       Student Email: student@example.com | Password: student123');
  } catch (error) {
    console.error('[Seed] Error seeding demo data:', error.message);
  }
};

module.exports = seedDemoData;
