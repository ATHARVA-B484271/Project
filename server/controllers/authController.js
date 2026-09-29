const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_assignment_system_2026',
    { expiresIn: '7d' }
  );
};

// @desc Admin Registration
// @route POST /api/auth/admin/register
const adminRegister = async (req, res) => {
  try {
    const { name, email, adminId, department, password, confirmPassword } = req.body;

    if (!name || !email || !adminId || !department || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check unique email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Check unique adminId
    const existingAdminId = await User.findOne({ adminId });
    if (existingAdminId) {
      return res.status(400).json({ message: 'An admin with this Admin ID already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      adminId,
      department,
      password,
      role: 'admin',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Admin registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminId: user.adminId,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// @desc Admin Login
// @route POST /api/auth/admin/login
const adminLogin = async (req, res) => {
  try {
    const { emailOrAdminId, password } = req.body;

    if (!emailOrAdminId || !password) {
      return res.status(400).json({ message: 'Please provide Email/Admin ID and password.' });
    }

    const query = emailOrAdminId.includes('@')
      ? { email: emailOrAdminId.toLowerCase() }
      : { adminId: emailOrAdminId };

    const user = await User.findOne(query);

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin credentials or account does not exist.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email/ID or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Admin logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminId: user.adminId,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// @desc Student Registration
// @route POST /api/auth/student/register
const studentRegister = async (req, res) => {
  try {
    const { name, email, studentId, department, academicYear, password, confirmPassword } = req.body;

    if (!name || !email || !studentId || !department || !academicYear || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const existingStudentId = await User.findOne({ studentId });
    if (existingStudentId) {
      return res.status(400).json({ message: 'A student with this Student ID / Roll Number already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      studentId,
      department,
      academicYear,
      password,
      role: 'student',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Student registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        academicYear: user.academicYear,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// @desc Student Login
// @route POST /api/auth/student/login
const studentLogin = async (req, res) => {
  try {
    const { emailOrStudentId, password } = req.body;

    if (!emailOrStudentId || !password) {
      return res.status(400).json({ message: 'Please provide Email/Student ID and password.' });
    }

    const query = emailOrStudentId.includes('@')
      ? { email: emailOrStudentId.toLowerCase() }
      : { studentId: emailOrStudentId };

    const user = await User.findOne(query);

    if (!user || user.role !== 'student') {
      return res.status(401).json({ message: 'Invalid student credentials or account does not exist.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email/ID or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Student logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        academicYear: user.academicYear,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// @desc Get Current User
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminId: user.adminId,
        studentId: user.studentId,
        department: user.department,
        academicYear: user.academicYear,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  studentRegister,
  studentLogin,
  getMe,
};
