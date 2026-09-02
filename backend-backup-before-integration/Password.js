const bcrypt = require('bcrypt');

// 12 rounds is a common balance for 2026 hardware: slow enough to resist
// offline cracking, fast enough not to make login feel slow.
const SALT_ROUNDS = 12;

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

module.exports = { hashPassword, comparePassword };