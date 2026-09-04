const deliveryService = require('../services/deliveryService');

async function createDelivery(req, res) {
  try {
    const {
      retailerId,
      customerName,
      customerPhone,
      deliveryAddress,
      itemDescription
    } = req.body;

    if (
      !retailerId ||
      !customerName ||
      !customerPhone ||
      !deliveryAddress ||
      !itemDescription
    ) {
      return res.status(400).json({
        error: 'All delivery fields are required'
      });
    }

    const delivery = await deliveryService.createDelivery({
      retailerId,
      customerName,
      customerPhone,
      deliveryAddress,
      itemDescription
    });

    res.status(201).json({
      message: 'Delivery created successfully',
      delivery
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to create delivery'
    });
  }
}

async function getDelivery(req, res) {
  try {
    const delivery = await deliveryService.getDelivery(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found'
      });
    }

    res.json(delivery);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch delivery'
    });
  }
}

async function getAllDeliveries(req, res) {
  try {
    const deliveries = await deliveryService.getAllDeliveries();
    res.json(deliveries);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch deliveries'
    });
  }
}

async function getOpenDeliveries(req, res) {
  try {
    const deliveries = await deliveryService.getOpenDeliveries();
    res.json(deliveries);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch open deliveries'
    });
  }
}

async function getAvailableRiders(req, res) {
  try {
    const riders = await deliveryService.getAvailableRiders();
    res.json(riders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch riders'
    });
  }
}

async function getDeliveryHistory(req, res) {
  try {
    const history = await deliveryService.getDeliveryHistory(
      req.params.id
    );

    res.json(history);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch delivery history'
    });
  }
}

async function assignDelivery(req, res) {
  try {
    const { riderId } = req.body;

    if (!riderId) {
      return res.status(400).json({
        error: 'riderId is required'
      });
    }

    const delivery = await deliveryService.assignDelivery(
      req.params.id,
      req.user.id,
      riderId
    );

    res.json({
      message: 'Delivery assigned successfully',
      delivery
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message
    });
  }
}

async function updateDeliveryStatus(req, res) {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'status is required'
      });
    }

    const delivery = await deliveryService.updateStatus(
      req.params.id,
      req.user.id,
      status,
      note
    );

    res.json({
      message: 'Delivery status updated successfully',
      delivery
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message
    });
  }
}

async function cancelDelivery(req, res) {
  try {
    const { note } = req.body;

    const delivery = await deliveryService.cancelDelivery(
      req.params.id,
      req.user.id,
      note
    );

    res.json({
      message: 'Delivery cancelled successfully',
      delivery
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message
    });
  }
}

module.exports = {
  createDelivery,
  getDelivery,
  getAllDeliveries,
  getOpenDeliveries,
  getAvailableRiders,
  getDeliveryHistory,
  assignDelivery,
  updateDeliveryStatus,
  cancelDelivery
};
