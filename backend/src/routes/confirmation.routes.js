const express = require('express');

const { authenticate } = require('../middleware/Auth');
const { requireRole } = require('../middleware/Role');
const { confirmDelivery } = require('../controllers/confirmation.controller');

const router = express.Router();

router.post(
  '/:id/confirm',
  authenticate,
  requireRole('RIDER'),
  confirmDelivery
);

module.exports = router;
