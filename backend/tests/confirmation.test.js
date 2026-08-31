const request = require("supertest");

const app = require("../src/app");
const confirmationService = require("../src/services/confirmation.service");

// Mock the confirmation service so tests do not use the real database
jest.mock("../src/services/confirmation.service");

describe("POST /api/deliveries/:id/confirm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("confirms a delivery successfully", async () => {
        confirmationService.confirmDelivery.mockResolvedValue({
            deliveryId: "delivery-123",
            status: "DELIVERED",
          confirmation: {
    id: "confirmation-123",
    delivery_id: "delivery-123",
    confirmed_by: "rider-123",
    confirmation_type: "QR"
}
        });

        const response = await request(app)
            .post("/api/deliveries/delivery-123/confirm")
            .send({
                riderId: "rider-123",
                rawToken: "test-qr-token"
            });

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
            "Delivery confirmed successfully"
        );

        expect(response.body.data.status).toBe("DELIVERED");

        expect(confirmationService.confirmDelivery).toHaveBeenCalledWith(
            expect.anything(),
            "delivery-123",
            "rider-123",
            "test-qr-token"
        );
    });

    test("returns 400 when riderId or rawToken is missing", async () => {
        const response = await request(app)
            .post("/api/deliveries/delivery-123/confirm")
            .send({
                riderId: "rider-123"
            });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
    "riderId and rawToken are required"
);

        expect(
            confirmationService.confirmDelivery
        ).not.toHaveBeenCalled();
    });

    test("returns 404 when delivery is not found", async () => {
        confirmationService.confirmDelivery.mockRejectedValue(
            new Error("DELIVERY_NOT_FOUND")
        );

        const response = await request(app)
            .post("/api/deliveries/missing-delivery/confirm")
            .send({
                riderId: "rider-123",
                rawToken: "test-qr-token"
            });

        expect(response.status).toBe(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Delivery not found");
    });

    test("returns 403 when rider is not assigned", async () => {
        confirmationService.confirmDelivery.mockRejectedValue(
            new Error("RIDER_NOT_ASSIGNED")
        );

        const response = await request(app)
            .post("/api/deliveries/delivery-123/confirm")
            .send({
                riderId: "wrong-rider",
                rawToken: "test-qr-token"
            });

        expect(response.status).toBe(403);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Rider is not assigned to this delivery"
        );
    });

    test("returns 409 when delivery is already delivered", async () => {
        confirmationService.confirmDelivery.mockRejectedValue(
            new Error("ALREADY_DELIVERED")
        );

        const response = await request(app)
            .post("/api/deliveries/delivery-123/confirm")
            .send({
                riderId: "rider-123",
                rawToken: "test-qr-token"
            });

        expect(response.status).toBe(409);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Delivery has already been confirmed"
        );
    });

    test("returns 401 when QR token is invalid", async () => {
        confirmationService.confirmDelivery.mockRejectedValue(
            new Error("INVALID_QR_TOKEN")
        );

        const response = await request(app)
            .post("/api/deliveries/delivery-123/confirm")
            .send({
                riderId: "rider-123",
                rawToken: "wrong-qr-token"
            });

        expect(response.status).toBe(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid QR token");
    });
});
