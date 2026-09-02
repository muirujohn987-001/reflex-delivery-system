const express = require('express');

const {
  createDelivery,
  getDelivery,
  getAllDeliveries,
  getOpenDeliveries,
  getAvailableRiders,
  getDeliveryHistory
} = require('../controllers/deliveryController');

const router = express.Router();

router.post('/', createDelivery);

router.get('/', getAllDeliveries);

router.get('/open', getOpenDeliveries);

router.get('/riders', getAvailableRiders);

router.get('/:id', getDelivery);

router.get('/:id/history', getDeliveryHistory);

module.exports = router;
