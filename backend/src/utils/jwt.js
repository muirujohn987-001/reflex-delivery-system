
const jwt = require('jsonwebtoken');

// Read from process.env INSIDE each function, not once at the top of the
// file. If we cached it in a top-level const, whichever module happens to
// require() this file first would freeze in whatever JWT_SECRET existed
// at that moment — including "undefined" if dotenv hadn't run yet. Reading
// it lazily means load order never matters.
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set — add it to backend/.env before starting the server.');
  }
  return secret;
}

function signAccessToken(payload) {
  // Keep the payload minimal and non-sensitive: it is base64, not encrypted,
  // so anything in here is readable by whoever holds the token.
  const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
  return jwt.sign(payload, getSecret(), { expiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, getSecret()); // throws if invalid/expired
}

module.exports = { signAccessToken, verifyAccessToken };