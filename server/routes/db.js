const { Pool } = require('pg');
require('dotenv').config()


// Configure your database connection
const pool = new Pool({
//   user: process.env.USER,
//   host:process.env.HOST,
//   database:process.env.DB,
//   password:process.env.PASS,
//   port:process.env.PORT,

  user:'noton',
  host:'dpg-ck49vt42kpls73cp5e3g-a.oregon-postgres.render.com',
  database:'crypto_kj27',
  password:'2XQOyPiVZlUbz4oK02mkexZT0XJFooRQ',
  port:'5432',
  ssl:true,
});

module.exports = { pool };
