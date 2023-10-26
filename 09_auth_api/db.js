const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "sls-academy",
  password: process.env.DB_PASSWORD || "root",
  port: process.env.DB_PORT || "5433",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
