const pool = require('../config/db');

async function createDelivery({
  retailerId,
  customerName,
  customerPhone,
  deliveryAddress,
  itemDescription
}) {
  const { rows } = await pool.query(
    `INSERT INTO deliveries
      (
        retailer_id,
        customer_name,
        customer_phone,
        delivery_address,
        item_description,
        current_status
      )
     VALUES ($1, $2, $3, $4, $5, 'REQUESTED')
     RETURNING *`,
    [
      retailerId,
      customerName,
      customerPhone,
      deliveryAddress,
      itemDescription
    ]
  );

  return rows[0];
}

async function createInitialStatus(deliveryId, userId) {
  await pool.query(
    `INSERT INTO status_updates
      (delivery_id, updated_by, status)
     VALUES ($1, $2, 'REQUESTED')`,
    [deliveryId, userId]
  );
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM deliveries WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
}

async function findAll() {
  const { rows } = await pool.query(
    `SELECT * FROM deliveries
     ORDER BY created_at DESC`
  );

  return rows;
}

async function findByRetailer(retailerId) {
  const { rows } = await pool.query(
    `SELECT * FROM deliveries
     WHERE retailer_id = $1
     ORDER BY created_at DESC`,
    [retailerId]
  );

  return rows;
}

async function findByRider(riderId) {
  const { rows } = await pool.query(
    `SELECT * FROM deliveries
     WHERE rider_id = $1
     ORDER BY created_at DESC`,
    [riderId]
  );

  return rows;
}

async function findOpen() {
  const { rows } = await pool.query(
    `SELECT * FROM deliveries
     WHERE current_status = 'REQUESTED'
     ORDER BY created_at ASC`
  );

  return rows;
}

async function findAvailableRiders() {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone
     FROM users
     WHERE role = 'RIDER'
       AND is_active = TRUE
     ORDER BY name`
  );

  return rows;
}

async function getHistory(deliveryId) {
  const { rows } = await pool.query(
    `SELECT
       su.id,
       su.status,
       su.note,
       su.created_at,
       su.updated_by,
       u.name AS updated_by_name,
       u.role AS updated_by_role
     FROM status_updates su
     JOIN users u ON u.id = su.updated_by
     WHERE su.delivery_id = $1
     ORDER BY su.created_at ASC`,
    [deliveryId]
  );

  return rows;
}

module.exports = {
  pool,
  createDelivery,
  createInitialStatus,
  findById,
  findAll,
  findByRetailer,
  findByRider,
  findOpen,
  findAvailableRiders,
  getHistory
};
