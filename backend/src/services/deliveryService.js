const deliveryRepository = require('../repositories/delivery');

const ALLOWED_TRANSITIONS = {
  REQUESTED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

async function createDelivery(data) {
  const delivery = await deliveryRepository.createDelivery(data);

  await deliveryRepository.createInitialStatus(
    delivery.id,
    data.retailerId
  );

  return delivery;
}

async function getDelivery(id) {
  return deliveryRepository.findById(id);
}

async function getAllDeliveries() {
  return deliveryRepository.findAll();
}

async function getRetailerDeliveries(retailerId) {
  return deliveryRepository.findByRetailer(retailerId);
}

async function getRiderDeliveries(riderId) {
  return deliveryRepository.findByRider(riderId);
}

async function getOpenDeliveries() {
  return deliveryRepository.findOpen();
}

async function getAvailableRiders() {
  return deliveryRepository.findAvailableRiders();
}

async function getDeliveryHistory(deliveryId) {
  return deliveryRepository.getHistory(deliveryId);
}

async function assignDelivery(deliveryId, dispatcherId, riderId) {
  const delivery = await deliveryRepository.findById(deliveryId);

  if (!delivery) {
    throw new Error('Delivery not found');
  }

  if (delivery.current_status !== 'REQUESTED') {
    throw new Error(
      `Cannot assign delivery in ${delivery.current_status} status`
    );
  }

  const rider = await deliveryRepository.findRider(riderId);

  if (!rider) {
    throw new Error('Rider not found or inactive');
  }

  const updatedDelivery = await deliveryRepository.assignDelivery(
    deliveryId,
    dispatcherId,
    riderId
  );

  return updatedDelivery;
}

async function updateStatus(deliveryId, userId, newStatus, note) {
  const delivery = await deliveryRepository.findById(deliveryId);

  if (!delivery) {
    throw new Error('Delivery not found');
  }

  const allowed = ALLOWED_TRANSITIONS[delivery.current_status] || [];

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${delivery.current_status} → ${newStatus}`
    );
  }

  return deliveryRepository.updateStatus(
    deliveryId,
    userId,
    newStatus,
    note
  );
}

async function cancelDelivery(deliveryId, userId, note) {
  return updateStatus(
    deliveryId,
    userId,
    'CANCELLED',
    note || 'Delivery cancelled'
  );
}

module.exports = {
  createDelivery,
  getDelivery,
  getAllDeliveries,
  getRetailerDeliveries,
  getRiderDeliveries,
  getOpenDeliveries,
  getAvailableRiders,
  getDeliveryHistory,
  assignDelivery,
  updateStatus,
  cancelDelivery
};
