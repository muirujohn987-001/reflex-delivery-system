const pool = require("../db");
const { confirmDelivery } = require("../services/confirmation.service");

async function confirmDeliveryController(req, res) {
    try {
        const deliveryId = req.params.id;
        const { riderId, rawToken } = req.body;

      if (!deliveryId || !riderId || !rawToken) {
    return res.status(400).json({
        success: false,
        message: "riderId and rawToken are required"
    });
}
        const result = await confirmDelivery(
            pool,
            deliveryId,
            riderId,
            rawToken
        );

        return res.status(200).json({
            success: true,
            message: "Delivery confirmed successfully",
            data: result
        });

    } catch (error) {
        switch (error.message) {
            case "DELIVERY_NOT_FOUND":
                return res.status(404).json({
                    success: false,
                    message: "Delivery not found"
                });

            case "RIDER_NOT_ASSIGNED":
                return res.status(403).json({
                    success: false,
                    message: "Rider is not assigned to this delivery"
                });

            case "ALREADY_DELIVERED":
                return res.status(409).json({
                    success: false,
                    message: "Delivery has already been confirmed"
                });

            case "INVALID_STATUS":
                return res.status(409).json({
                    success: false,
                    message: "Delivery cannot be confirmed in its current status"
                });

            case "INVALID_QR_TOKEN":
                return res.status(401).json({
                    success: false,
                    message: "Invalid QR token"
                });

            default:
                console.error("Confirmation error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to confirm delivery"
                });
        }
    }
}

module.exports = {
    confirmDeliveryController
};