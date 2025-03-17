import express from 'express';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';
import { initializeDatabase } from './database.js';
import routes from './routes.js';

dotenv.config();

const app = express();
const db = knex({
  client: 'mssql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

// initializeDatabase(db);

app.use('/api', routes(db, SECRET_KEY));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});