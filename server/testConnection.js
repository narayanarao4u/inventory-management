import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mssql',
  connection: {
    host: "10.34.130.254",
    user: "sa",
    password: "bsnl@123",
    database: process.env.DB_NAME,
    port: 1433 // default SQL Server port
  }
});

db.raw('SELECT ')
  .then(() => {
    console.log('SQL Server connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.error('SQL Server connection failed:', err);
    process.exit(1);
  });