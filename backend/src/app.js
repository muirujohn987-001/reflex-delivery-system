const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const confirmationRoutes = require('./routes/confirmation.routes');

const { notFound, errorHandler } = require('./middleware/Errorhandler');

const app = express();

app.use(cors());
app.use(express.json());

// Health
app.use('/health', healthRoutes);

// Authentication
app.use('/api/auth', authRoutes);

// Deliveries
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/deliveries', confirmationRoutes);

// 404 handler
app.use(notFound);

// Global error handler — MUST be LAST
app.use(errorHandler);

module.exports = app;
