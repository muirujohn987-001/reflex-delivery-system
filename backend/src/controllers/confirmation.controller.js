const confirmationService = require('../services/confirmation.service');
const pool = require('../config/db');

async function confirmDelivery(req, res) {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({
        error: 'qrToken is required'
      });
    }

    const result = await confirmationService.confirmDelivery(
      pool,
      req.params.id,
      req.user.id,
      qrToken
    );

    res.json({
      message: 'Delivery confirmed successfully',
      ...result
    });
  } catch (error) {
    console.error(error);

    const messages = {
      DELIVERY_NOT_FOUND: 'Delivery not found',
      RIDER_NOT_ASSIGNED: 'Rider is not assigned to this delivery',
      INVALID_STATUS: 'Delivery must be PICKED_UP before confirmation',
      ALREADY_DELIVERED: 'Delivery has already been delivered',
      INVALID_QR_TOKEN: 'Invalid QR token'
    };

    res.status(400).json({
      error: messages[error.message] || 'Failed to confirm delivery'
    });
  }
}

module.exports = {
  confirmDelivery
};
