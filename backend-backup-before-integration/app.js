const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // or wherever your auth routes live

// 1. Initialize app FIRST
const app = express();

// 2. Standard Middleware
app.use(cors());
app.use(express.json());

// 3. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 4. Mount API Routes
app.use('/api/auth', authRoutes);

// 5. Export app for server.js
module.exports = app;
