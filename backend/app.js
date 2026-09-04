
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const confirmationRoutes = require("./routes/confirmation.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const healthRoutes = require("./routes/health.routes");

const { errorHandler, notFound } = require("./middleware/Errorhandler");

const app = express();

// Allow frontend running on port 3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check
app.use("/api/health", healthRoutes);

// Delivery routes
app.use("/api/deliveries", deliveryRoutes);

// Delivery confirmation route
app.use("/api/deliveries", confirmationRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
