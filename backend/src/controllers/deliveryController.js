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

module.exports = {
  createDelivery,
  getDelivery,
  getAllDeliveries,
  getOpenDeliveries,
  getAvailableRiders,
  getDeliveryHistory
};
