const deliveryRepository = require('../repositories/delivery');

async function createDelivery({
  retailerId,
  customerName,
  customerPhone,
  deliveryAddress,
  itemDescription
}) {
  const delivery = await deliveryRepository.createDelivery({
    retailerId,
    customerName,
    customerPhone,
    deliveryAddress,
    itemDescription
  });

  await deliveryRepository.createInitialStatus(
    delivery.id,
    retailerId
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

module.exports = {
  createDelivery,
  getDelivery,
  getAllDeliveries,
  getRetailerDeliveries,
  getRiderDeliveries,
  getOpenDeliveries,
  getAvailableRiders,
  getDeliveryHistory
};
