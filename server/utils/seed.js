const db = require('../config/memoryDb');

const seedDemoData = async () => {
  try {
    if (db.seeded || (await db.countUsers()) > 0) {
      console.log('[Seed] Already seeded. Skipping.');
      return;
    }
    db.seeded = true;
    console.log('[Seed] Seeding demo accounts & assignments...');

    const admin = await db.createUser({
      name: 'Prof. Alan Turing', email: 'admin@example.com', password: 'admin123',
      role: 'admin', adminId: 'ADM-2026-01', department: 'Computer Science & Engineering',
    });

    const student = await db.createUser({
      name: 'Atharva Belurkar', email: 'student@example.com', password: 'student123',
      role: 'student', studentId: 'STU-2026001', department: 'Computer Science & Engineering', academicYear: '4th Year',
    });

    const now = new Date();
    const future1 = new Date(now.getTime() + 7 * 86400000);
    const future2 = new Date(now.getTime() + 14 * 86400000);
    const past = new Date(now.getTime() - 2 * 86400000);

    const a1 = await db.createAssignment({ title: 'Database Management: Relational Normalization', description: 'Explain 1NF, 2NF, 3NF and BCNF with real-world examples. Provide SQL schemas.', deadline: future1, maxMarks: 10, createdBy: admin._id });
    const a2 = await db.createAssignment({ title: 'Web Engineering: RESTful API Security & JWT', description: 'Design a role-based access control system using JWT in Node.js Express.', deadline: future2, maxMarks: 20, createdBy: admin._id });
    const a3 = await db.createAssignment({ title: 'Data Structures Lab: Binary Search Trees & Graph Traversals', description: 'Implement BFS and DFS in C++/Java. Measure time complexities on benchmark datasets.', deadline: past, maxMarks: 10, createdBy: admin._id });

    // Version 1 — needs changes
    await db.createSubmission({ assignmentId: a3._id, studentId: student._id, version: 1, response: 'Implemented BFS. DFS had stack overflow on large graphs.', submissionLink: 'https://github.com/demo/ds-lab-v1', submittedAt: new Date(past.getTime() - 43200000), status: 'ON_TIME', reviewStatus: 'NEEDS_CHANGES', marks: 5, feedback: 'Fix the recursion stack overflow in DFS and resubmit.', reviewedAt: new Date(past.getTime() - 28800000), reviewedBy: admin._id });

    // Version 2 — accepted
    await db.createSubmission({ assignmentId: a3._id, studentId: student._id, version: 2, response: 'Fixed DFS using explicit iterative stack. Added benchmark for 10k nodes.', submissionLink: 'https://github.com/demo/ds-lab-v2', submittedAt: new Date(past.getTime() - 7200000), status: 'ON_TIME', reviewStatus: 'ACCEPTED', marks: 9, feedback: 'Excellent improvement! Stack overflow resolved and benchmarking is thorough.', reviewedAt: new Date(past.getTime() - 3600000), reviewedBy: admin._id });

    // Pending submission for a1
    await db.createSubmission({ assignmentId: a1._id, studentId: student._id, version: 1, response: 'Normalization reduces redundancy. 1NF removes duplicates, 2NF removes partial deps, 3NF removes transitive deps.', submissionLink: 'https://github.com/demo/dbms-normalization', submittedAt: new Date(now.getTime() - 10800000), status: 'ON_TIME', reviewStatus: 'PENDING', marks: null, feedback: '' });

    await db.createNotification({ userId: student._id, title: 'Assignment Review: Data Structures Lab', message: 'Version 2 was reviewed. Status: ACCEPTED ✅. Marks: 9/10.', type: 'success' });

    console.log('[Seed] Done! Admin: admin@example.com / admin123 | Student: student@example.com / student123');
  } catch (err) {
    console.error('[Seed] Error:', err.message);
  }
};

module.exports = seedDemoData;
