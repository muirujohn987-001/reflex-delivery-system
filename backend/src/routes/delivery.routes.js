const express = require("express");

const {
  getDeliveries,
  getDelivery,
  createDelivery,
  assignRider,
  updateStatus,
} = require("../controllers/delivery.controller");

const router = express.Router();

router.get("/", getDeliveries);

router.post("/", createDelivery);

router.get("/:id", getDelivery);

router.post("/:id/assign", assignRider);

router.patch("/:id/status", updateStatus);

module.exports = router;