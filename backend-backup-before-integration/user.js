const { randomUUID } = require('crypto');
const pool = require('../config/db'); // John's pg Pool connection (see backend/src/config/db.js)

/**
 * Repository layer = SQL only, no business rules (per the layered
 * architecture in the docs). Every query is parameterized ($1, $2, ...)
 * so user input can never be concatenated into SQL.
 */

async function createUser({ name, email, phone, passwordHash, role }) {
  const id = randomUUID();
  const { rows } = await pool.query(
    `INSERT INTO users (id, name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, phone, role, created_at`,
    [id, name, email, phone || null, passwordHash, role]
  );
  return rows[0]; // note: password_hash is deliberately not in RETURNING
}

/**
 * Includes password_hash — this is the ONE place in the codebase allowed
 * to read it, because login needs it to compare against. Never pass this
 * row straight out of a controller.
 */
async function findByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone, password_hash, role, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { createUser, findByEmail, findById };