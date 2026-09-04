const { hashToken } = require("./qr.service");

async function confirmDelivery(pool, deliveryId, riderId, rawToken) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Get and lock the delivery
        const deliveryResult = await client.query(
            `
            SELECT
                id,
                rider_id,
                current_status,
                qr_token_hash
            FROM deliveries
            WHERE id = $1
            FOR UPDATE
            `,
            [deliveryId]
        );

        if (deliveryResult.rows.length === 0) {
            throw new Error("DELIVERY_NOT_FOUND");
        }

        const delivery = deliveryResult.rows[0];

        // 2. Verify the rider
        if (String(delivery.rider_id) !== String(riderId)) {
            throw new Error("RIDER_NOT_ASSIGNED");
        }

        // 3. Delivery must be PICKED_UP
        if (delivery.current_status !== "PICKED_UP") {
            if (delivery.current_status === "DELIVERED") {
                throw new Error("ALREADY_DELIVERED");
            }

            throw new Error("INVALID_STATUS");
        }

        // 4. Hash the submitted QR token
        const submittedHash = hashToken(rawToken);

        // 5. Compare hashes
        if (submittedHash !== delivery.qr_token_hash) {
            throw new Error("INVALID_QR_TOKEN");
        }

        // 6. Create confirmation
   const confirmationResult = await client.query(
    `
    INSERT INTO confirmations
        (delivery_id, rider_id, confirmed_by, confirmation_type)
    VALUES ($1, $2, $2, 'QR')
    RETURNING
        id,
        delivery_id,
        rider_id,
        confirmed_by,
        confirmation_type,
        confirmed_at
    `,
    [deliveryId, riderId]
);

        // 7. Mark delivery as DELIVERED
       await client.query(
    `
    INSERT INTO status_updates
        (delivery_id, status, changed_by)
    VALUES ($1, 'DELIVERED', $2)
    `,
    [deliveryId, riderId]
);

        // 8. Record status history
        await client.query(
            `
            INSERT INTO status_updates
                (delivery_id, status, changed_by)
            VALUES ($1, 'DELIVERED', $2)
            `,
            [deliveryId, riderId]
        );

        // 9. Commit everything
        await client.query("COMMIT");

        return {
            deliveryId,
            status: "DELIVERED",
            confirmation: confirmationResult.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}

module.exports = {
    confirmDelivery
};