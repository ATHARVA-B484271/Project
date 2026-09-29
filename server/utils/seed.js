const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const seedDemoData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('[Seed] Seeding default demo accounts and assignments...');

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
      createdBy: admin._id,
    });

    const assign2 = await Assignment.create({
      title: 'Web Engineering Project: RESTful API Security & JWT Integration',
      description: 'Design and implement a role-based access control system using JWT authentication and password hashing in Node.js Express.',
      deadline: futureDate2,
      createdBy: admin._id,
    });

    const assign3 = await Assignment.create({
      title: 'Data Structures Lab 1: Binary Search Trees & Graph Traversals',
      description: 'Implement BFS and DFS algorithms in C++/Java. Measure traversal time complexities on benchmark datasets.',
      deadline: pastDate,
      createdBy: admin._id,
    });

    // Create sample past submission for student (ON_TIME)
    await Submission.create({
      assignmentId: assign3._id,
      studentId: student._id,
      response: 'Implemented BFS & DFS algorithms using adjacency list representation. Execution time for 10,000 nodes was 4.2ms.',
      submissionLink: 'https://github.com/atharva/ds-lab-traversals',
      submittedAt: new Date(pastDate.getTime() - 5 * 60 * 60 * 1000), // submitted 5 hours before past deadline
      status: 'ON_TIME',
    });

    console.log('[Seed] Demo data successfully seeded!');
    console.log('       Admin Email: admin@example.com | Password: admin123');
    console.log('       Student Email: student@example.com | Password: student123');
  } catch (error) {
    console.error('[Seed] Error seeding demo data:', error.message);
  }
};

module.exports = seedDemoData;
