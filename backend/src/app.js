const express = require("express");
const confirmationRoutes = require("./routes/confirmation.routes");

const app = express();

app.use(express.json());

app.use("/api", confirmationRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Reflex backend is running"
    });
});

module.exports = app;