const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const confirmationRoutes = require("./routes/confirmation.routes");
const deliveryRoutes = require("./routes/delivery.routes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/health", healthRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/deliveries", confirmationRoutes);

module.exports = app;