const express = require("express");
const { confirmDeliveryController } = require("../controllers/confirmation.controller");

const router = express.Router();

// POST /api/deliveries/:id/confirm
router.post("/:id/confirm", confirmDeliveryController);

module.exports = router;