const { Pool } = require('pg');
require('dotenv').config()


// Configure your database connection
const pool = new Pool({
  user: process.env.USER,
  host:process.env.HOST,
  database:process.env.DB,
  password:process.env.PASS,
  port:process.env.PORTE,
  ssl:true,
});

module.exports = { pool };
