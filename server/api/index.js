// Vercel Serverless Entry Point — wraps the full Express app
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS — wide open for deployment
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/assignments', require('../routes/assignmentRoutes'));
app.use('/api/submissions', require('../routes/submissionRoutes'));
app.use('/api/notifications', require('../routes/notificationRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Assignment Management API is running on Vercel',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Assignment Management API', docs: '/api/health' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// DB connection — cached across warm Vercel invocations
let isReady = false;

const initApp = async () => {
  if (isReady) return;
  const connectDB = require('../config/db');
  const seedDemoData = require('../utils/seed');
  await connectDB();
  await seedDemoData();
  isReady = true;
};

module.exports = async (req, res) => {
  try {
    await initApp();
  } catch (e) {
    console.error('DB init error:', e.message);
  }
  return app(req, res);
};
