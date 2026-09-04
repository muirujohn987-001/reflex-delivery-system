const express = require('express');

const {
  createDelivery,
  getDelivery,
  getAllDeliveries,
  getOpenDeliveries,
  getAvailableRiders,
  getDeliveryHistory,
  assignDelivery,
  updateDeliveryStatus,
  cancelDelivery
} = require('../controllers/deliveryController');

const { authenticate } = require('../middleware/Auth');
const { requireRole } = require('../middleware/Role');

const router = express.Router();

// Create delivery
router.post(
  '/',
  authenticate,
  requireRole('RETAILER'),
  createDelivery
);

// View deliveries
router.get(
  '/',
  authenticate,
  getAllDeliveries
);

router.get(
  '/open',
  authenticate,
  requireRole('DISPATCHER'),
  getOpenDeliveries
);

router.get(
  '/riders',
  authenticate,
  requireRole('DISPATCHER'),
  getAvailableRiders
);

router.get(
  '/:id',
  authenticate,
  getDelivery
);

router.get(
  '/:id/history',
  authenticate,
  getDeliveryHistory
);

// Dispatcher assigns rider
router.post(
  '/:id/assign',
  authenticate,
  requireRole('DISPATCHER'),
  assignDelivery
);

// Rider updates status
router.post(
  '/:id/status',
  authenticate,
  requireRole('RIDER'),
  updateDeliveryStatus
);

// Retailer/dispatcher can cancel
router.post(
  '/:id/cancel',
  authenticate,
  requireRole('RETAILER', 'DISPATCHER'),
  cancelDelivery
);

module.exports = router;
