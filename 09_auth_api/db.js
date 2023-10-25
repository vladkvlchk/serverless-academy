const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sls-academy",
  password: "root",
  port: "5433",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
