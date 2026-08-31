const express = require("express");
const {
    confirmDeliveryController
} = require("../controllers/confirmation.controller");

const router = express.Router();

router.post("/deliveries/:id/confirm", confirmDeliveryController);

module.exports = router;