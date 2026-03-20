const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
});

pool.on('error', (err) => {
  process.exit(-1);
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query
};
