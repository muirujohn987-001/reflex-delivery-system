const pool = require("../config/db");
const { generateQRToken } = require("../services/qr.service");

async function getDeliveries(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        rider_id,
        current_status,
        qr_token_hash,
        created_at,
        updated_at
      FROM deliveries
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Get deliveries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch deliveries",
    });
  }
}

async function getDelivery(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        rider_id,
        current_status,
        qr_token_hash,
        created_at,
        updated_at
      FROM deliveries
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get delivery error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery",
    });
  }
}

async function createDelivery(req, res) {
  try {
    const {
      customerName,
      customerPhone,
      address,
      item,
    } = req.body;

    if (!customerName || !customerPhone || !address || !item) {
      return res.status(400).json({
        success: false,
        message:
          "customerName, customerPhone, address and item are required",
      });
    }

    // Generate the secure QR token.
    const { rawToken, tokenHash } = generateQRToken();

    const result = await pool.query(
      `
      INSERT INTO deliveries (
        current_status,
        qr_token_hash
      )
      VALUES ($1, $2)
      RETURNING
        id,
        rider_id,
        current_status,
        created_at,
        updated_at
      `,
      ["CREATED", tokenHash]
    );

    const delivery = result.rows[0];

    res.status(201).json({
      success: true,
      delivery: {
        ...delivery,

        // These fields are returned to the frontend.
        // The current database schema does not have columns
        // for them, so we do not try to insert them into PostgreSQL.
        customerName,
        customerPhone,
        address,
        item,
      },

      // Needed later to generate/display the customer's QR code.
      rawToken,
    });
  } catch (error) {
    console.error("Create delivery error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create delivery",
    });
  }
}

async function assignRider(req, res) {
  try {
    const { id } = req.params;
    const { riderId } = req.body;

    if (!riderId) {
      return res.status(400).json({
        success: false,
        message: "riderId is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE deliveries
      SET
        rider_id = $1,
        current_status = 'ASSIGNED',
        updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        rider_id,
        current_status,
        created_at,
        updated_at
      `,
      [riderId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.json({
      success: true,
      delivery: result.rows[0],
    });
  } catch (error) {
    console.error("Assign rider error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to assign rider",
    });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
  "CREATED",
  "ASSIGNED",
  "PICKED_UP",
  "DELIVERED",
];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const result = await pool.query(
      `
      UPDATE deliveries
      SET
        current_status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        rider_id,
        current_status,
        created_at,
        updated_at
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.json({
      success: true,
      delivery: result.rows[0],
    });
  } catch (error) {
    console.error("Update status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
    });
  }
}

module.exports = {
  getDeliveries,
  getDelivery,
  createDelivery,
  assignRider,
  updateStatus,
};