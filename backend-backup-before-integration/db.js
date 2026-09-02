/**
 * REFERENCE ONLY — not part of Ben's deliverable.
 *
 * Per the team guide, John owns the PostgreSQL connection setup
 * (backend/src/config/db.js). This file exists only so that
 * user.repository.js has something to `require('../config/db')` against
 * if you run/test this folder before John's real file is merged in.
 *
 * If John's db.js already exists in the repo, DELETE this file and let
 * user.repository.js import his instead — do not maintain two versions.
 */
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'reflex',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

module.exports = pool;