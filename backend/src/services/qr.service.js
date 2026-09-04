const crypto = require("crypto");
const QRCode = require("qrcode");

function generateRawToken() {
    return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}

async function generateQRCode(token) {
    return QRCode.toDataURL(token);
}

function generateQRToken() {
    const rawToken = generateRawToken();

    return {
        rawToken,
        tokenHash: hashToken(rawToken)
    };
}

module.exports = {
    generateRawToken,
    hashToken,
    generateQRCode,
    generateQRToken
};