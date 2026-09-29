const jwt = require('jsonwebtoken');
const db = require('../config/memoryDb');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_assignment_system_2026';

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ─── Admin Register ─────────────────────────────────────────────────────
const adminRegister = async (req, res) => {
  try {
    const { name, email, adminId, department, password, confirmPassword } = req.body;
    if (!name || !email || !adminId || !department || !password || !confirmPassword)
      return res.status(400).json({ message: 'All required fields must be filled.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });

    if (await db.findUser({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'An account with this email already exists.' });
    if (await db.findUser({ adminId }))
      return res.status(400).json({ message: 'An admin with this Admin ID already exists.' });

    const user = await db.createUser({ name, email: email.toLowerCase(), adminId, department, password, role: 'admin' });
    const token = generateToken(user);
    res.status(201).json({ message: 'Admin registered successfully.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, adminId: user.adminId, department: user.department } });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// ─── Admin Login ────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { emailOrAdminId, password } = req.body;
    if (!emailOrAdminId || !password)
      return res.status(400).json({ message: 'Please provide Email/Admin ID and password.' });

    const query = emailOrAdminId.includes('@') ? { email: emailOrAdminId.toLowerCase() } : { adminId: emailOrAdminId };
    const user = await db.findUser(query);

    if (!user || user.role !== 'admin')
      return res.status(401).json({ message: 'Invalid admin credentials or account does not exist.' });

    const isMatch = await db.comparePassword(user, password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email/ID or password.' });

    const token = generateToken(user);
    res.json({ message: 'Admin logged in successfully.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, adminId: user.adminId, department: user.department } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// ─── Student Register ────────────────────────────────────────────────────
const studentRegister = async (req, res) => {
  try {
    const { name, email, studentId, department, academicYear, password, confirmPassword } = req.body;
    if (!name || !email || !studentId || !department || !academicYear || !password || !confirmPassword)
      return res.status(400).json({ message: 'All required fields must be filled.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });

    if (await db.findUser({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'An account with this email already exists.' });
    if (await db.findUser({ studentId }))
      return res.status(400).json({ message: 'A student with this Student ID already exists.' });

    const user = await db.createUser({ name, email: email.toLowerCase(), studentId, department, academicYear, password, role: 'student' });
    const token = generateToken(user);
    res.status(201).json({ message: 'Student registered successfully.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId, department: user.department, academicYear: user.academicYear } });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// ─── Student Login ───────────────────────────────────────────────────────
const studentLogin = async (req, res) => {
  try {
    const { emailOrStudentId, password } = req.body;
    if (!emailOrStudentId || !password)
      return res.status(400).json({ message: 'Please provide Email/Student ID and password.' });

    const query = emailOrStudentId.includes('@') ? { email: emailOrStudentId.toLowerCase() } : { studentId: emailOrStudentId };
    const user = await db.findUser(query);

    if (!user || user.role !== 'student')
      return res.status(401).json({ message: 'Invalid student credentials or account does not exist.' });

    const isMatch = await db.comparePassword(user, password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email/ID or password.' });

    const token = generateToken(user);
    res.json({ message: 'Student logged in successfully.', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId, department: user.department, academicYear: user.academicYear } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// ─── Get Me ──────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await db.findUser({ _id: req.user.userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, adminId: user.adminId, studentId: user.studentId, department: user.department, academicYear: user.academicYear } });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { adminRegister, adminLogin, studentRegister, studentLogin, getMe };
