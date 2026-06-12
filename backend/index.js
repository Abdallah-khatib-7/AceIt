const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/cv', require('./src/routes/cv'));
app.use('/api/interview', require('./src/routes/interview'));
app.use('/api/quiz', require('./src/routes/quiz'));
app.use('/api/reports', require('./src/routes/reports'));
app.use('/api/roadmap', require('./src/routes/roadmap'));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AceIt is Running Perfectly',
    status: 'ok',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AceIt server running on port ${PORT}`);
});