// Vercel Serverless Entry Point
// Uses in-memory DB — no MongoDB required
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/assignments', require('../routes/assignmentRoutes'));
app.use('/api/submissions', require('../routes/submissionRoutes'));
app.use('/api/notifications', require('../routes/notificationRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Assignment Management API is running', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Assignment Management API', status: 'OK', endpoints: ['/api/health', '/api/auth', '/api/assignments', '/api/submissions', '/api/notifications'] });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Seed demo data once
let seeded = false;
const ensureSeeded = async () => {
  if (seeded) return;
  seeded = true;
  try {
    const seedDemoData = require('../utils/seed');
    await seedDemoData();
  } catch (e) {
    console.error('Seed error:', e.message);
  }
};

module.exports = async (req, res) => {
  await ensureSeeded();
  return app(req, res);
};
