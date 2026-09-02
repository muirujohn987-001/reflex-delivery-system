const pool = require('../config/db');

/**
 * Repository layer: SQL only.
 */

async function createUser({ name, email, phone, passwordHash, role }) {
  const { rows } = await pool.query(
    `INSERT INTO users
      (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role, created_at`,
    [name, email, phone || null, passwordHash, role]
  );

  return rows[0];
}

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

module.exports = {
  createUser,
  findByEmail,
  findById
};
