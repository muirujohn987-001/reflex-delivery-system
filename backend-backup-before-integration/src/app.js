const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);

module.exports = app;

// 1. Import your routes
//const authRoutes = require('./routes/auth'); // adjust path if needed


// 3. Core middleware
app.use(cors());
app.use(express.json());


app.use("/health", healthRoutes);

// 4. Health check endpoint (for John's foundation test)
//app.get('/health', (req, res) => {
  //res.status(200).json({ status: 'OK' });
//});

// 5. Mount API routes
//app.use('/api/auth', authRoutes);

// 6. Export app so server.js can start it
module.exports = app;
