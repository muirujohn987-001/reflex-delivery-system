const {
    generateRawToken,
    hashToken
} = require("../src/services/qr.service");

describe("QR Token Service", () => {

    test("generates a token", () => {
        const token = generateRawToken();

        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
        expect(token.length).toBe(64);
    });

    test("generates the same hash for the same token", () => {
        const token = generateRawToken();

        const hash1 = hashToken(token);
        const hash2 = hashToken(token);

        expect(hash1).toBe(hash2);
        expect(hash1.length).toBe(64);
    });

    test("different tokens produce different hashes", () => {
        const token1 = generateRawToken();
        const token2 = generateRawToken();

        expect(hashToken(token1)).not.toBe(hashToken(token2));
    });

});