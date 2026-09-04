const pool = require('../config/db');
const { generateQRToken } = require('../services/qr.service');

async function createDelivery({
  retailerId,
  customerName,
  customerPhone,
  deliveryAddress,
  itemDescription
}) {
  const { rawToken, tokenHash } = generateQRToken();

  const { rows } = await pool.query(
    `INSERT INTO deliveries
      (
        retailer_id,
        customer_name,
        customer_phone,
        delivery_address,
        item_description,
        current_status,
        qr_token_hash
      )
     VALUES ($1, $2, $3, $4, $5, 'REQUESTED', $6)
     RETURNING *`,
    [
      retailerId,
      customerName,
      customerPhone,
      deliveryAddress,
      itemDescription,
      tokenHash
    ]
  );

  return {
    ...rows[0],
    qr_token: rawToken
  };
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
    `SELECT * FROM deliveries
     WHERE id = $1`,
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

async function findRider(riderId) {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone
     FROM users
     WHERE id = $1
       AND role = 'RIDER'
       AND is_active = TRUE`,
    [riderId]
  );

  return rows[0] || null;
}

async function assignDelivery(deliveryId, dispatcherId, riderId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE deliveries
       SET rider_id = $1,
           current_status = 'ASSIGNED',
           updated_at = NOW()
       WHERE id = $2
         AND current_status = 'REQUESTED'
       RETURNING *`,
      [riderId, deliveryId]
    );

    const delivery = rows[0];

    if (!delivery) {
      throw new Error(
        'Delivery not found or is no longer in REQUESTED status'
      );
    }

    await client.query(
      `INSERT INTO assignments
       (delivery_id, dispatcher_id, rider_id)
       VALUES ($1, $2, $3)`,
      [deliveryId, dispatcherId, riderId]
    );

    await client.query(
      `INSERT INTO status_updates
       (delivery_id, updated_by, status, note)
       VALUES ($1, $2, 'ASSIGNED', $3)`,
      [
        deliveryId,
        dispatcherId,
        `Assigned to rider ${riderId}`
      ]
    );

    await client.query('COMMIT');

    return delivery;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateStatus(deliveryId, userId, status, note) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE deliveries
       SET current_status = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, deliveryId]
    );

    const delivery = rows[0];

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    await client.query(
      `INSERT INTO status_updates
       (delivery_id, updated_by, status, note)
       VALUES ($1, $2, $3, $4)`,
      [
        deliveryId,
        userId,
        status,
        note || null
      ]
    );

    await client.query('COMMIT');

    return delivery;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
  getHistory,
  findRider,
  assignDelivery,
  updateStatus
};
