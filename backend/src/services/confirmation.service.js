const { hashToken } = require('./qr.service');

async function confirmDelivery(pool, deliveryId, riderId, rawToken) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const deliveryResult = await client.query(
      `SELECT id, rider_id, current_status, qr_token_hash
       FROM deliveries
       WHERE id = $1
       FOR UPDATE`,
      [deliveryId]
    );

    if (deliveryResult.rows.length === 0) {
      throw new Error('DELIVERY_NOT_FOUND');
    }

    const delivery = deliveryResult.rows[0];

    if (String(delivery.rider_id) !== String(riderId)) {
      throw new Error('RIDER_NOT_ASSIGNED');
    }

    if (delivery.current_status !== 'PICKED_UP') {
      if (delivery.current_status === 'DELIVERED') {
        throw new Error('ALREADY_DELIVERED');
      }

      throw new Error('INVALID_STATUS');
    }

    const submittedHash = hashToken(rawToken);

    if (submittedHash !== delivery.qr_token_hash) {
      throw new Error('INVALID_QR_TOKEN');
    }

    const confirmationResult = await client.query(
      `INSERT INTO confirmations
        (delivery_id, confirmed_by, confirmation_type)
       VALUES ($1, $2, 'QR')
       RETURNING id, delivery_id, confirmed_by,
                 confirmation_type, proof_url, confirmed_at`,
      [deliveryId, riderId]
    );

    await client.query(
      `UPDATE deliveries
       SET current_status = 'DELIVERED',
           updated_at = NOW()
       WHERE id = $1`,
      [deliveryId]
    );

    await client.query(
      `INSERT INTO status_updates
        (delivery_id, status, updated_by)
       VALUES ($1, 'DELIVERED', $2)`,
      [deliveryId, riderId]
    );

    await client.query('COMMIT');

    return {
      deliveryId,
      status: 'DELIVERED',
      confirmation: confirmationResult.rows[0]
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  confirmDelivery
};
