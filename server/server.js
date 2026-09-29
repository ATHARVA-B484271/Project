const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDemoData = require('./utils/seed');

dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Assignment Management API is running cleanly' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDemoData();
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Assignment Management Server is running on port ${PORT}`);
    console.log(`   API Endpoint: http://localhost:${PORT}/api`);
    console.log(`==================================================`);
  });
};

startServer();
