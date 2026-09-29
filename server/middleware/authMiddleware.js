const jwt = require('jsonwebtoken');
const db = require('../config/memoryDb');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_assignment_system_2026';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return res.status(401).json({ message: 'Authentication required. Please log in.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.findUser({ _id: decoded.userId });
    if (!user) return res.status(401).json({ message: 'User account not found.' });

    req.user = { ...user, _id: user._id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires role: [${roles.join(', ')}].` });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
