// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: process.env.PGHOST,
  name: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
};

const db = new Pool(dbParams);

db.connect()
  .then(() => console.log('Connected to Postgres server'))
  .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = db;