const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      status: "ok",
      service: "reflex-api",
      database: "connected",
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error(error);

    res.status(503).json({
      status: "error",
      service: "reflex-api",
      database: "disconnected"
    });
  }
});

module.exports = router;
