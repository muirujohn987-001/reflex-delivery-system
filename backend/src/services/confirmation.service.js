
const { hashToken } = require("./qr.service");

async function confirmDelivery(pool, deliveryId, riderId, rawToken) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Get the delivery and lock it during confirmation
        const deliveryResult = await client.query(
            `
            SELECT id, rider_id, current_status, qr_token_hash
            FROM deliveries
            WHERE id = $1
            FOR UPDATE
            `,
            [deliveryId]
        );

        // Delivery does not exist
        if (deliveryResult.rows.length === 0) {
            throw new Error("DELIVERY_NOT_FOUND");
        }

        const delivery = deliveryResult.rows[0];

        // 2. Make sure this rider is assigned to the delivery
      if (String(delivery.rider_id) !== String(riderId)) {
    throw new Error("RIDER_NOT_ASSIGNED");
}
        // 3. Delivery must be PICKED_UP before confirmation
        if (delivery.current_status !== "PICKED_UP") {
            if (delivery.current_status === "DELIVERED") {
                throw new Error("ALREADY_DELIVERED");
            }

            throw new Error("INVALID_STATUS");
        }

        // 4. Hash the raw QR token submitted by the rider
        const submittedHash = hashToken(rawToken);

        // 5. Compare submitted QR hash with stored hash
        if (submittedHash !== delivery.qr_token_hash) {
            throw new Error("INVALID_QR_TOKEN");
        }

        // 6. Create the confirmation record
        const confirmationResult = await client.query(
            `
            INSERT INTO confirmations
                (delivery_id, confirmed_by, confirmation_type)
            VALUES ($1, $2, 'QR')
            RETURNING
                id,
                delivery_id,
                confirmed_by,
                confirmation_type,
                proof_url,
                confirmed_at
            `,
            [deliveryId, riderId]
        );

        // 7. Change delivery status to DELIVERED
        await client.query(
            `
            UPDATE deliveries
            SET current_status = 'DELIVERED',
                updated_at = NOW()
            WHERE id = $1
            `,
            [deliveryId]
        );

        // 8. Record the status change in status history
        await client.query(
            `
            INSERT INTO status_updates
                (delivery_id, status, updated_by)
            VALUES ($1, 'DELIVERED', $2)
            `,
            [deliveryId, riderId]
        );

        // 9. Commit everything together
        await client.query("COMMIT");

        return {
            deliveryId,
            status: "DELIVERED",
            confirmation: confirmationResult.rows[0]
        };

    } catch (error) {
        // Roll back all database changes if anything fails
        await client.query("ROLLBACK");
        throw error;

    } finally {
        // Always release the database connection
        client.release();
    }
}

module.exports = {
    confirmDelivery
};

