import express from 'express';
import cors from 'cors';
import knex from 'knex';
import { initializeDatabase } from './database.js';
import routes from './routes.js';

const app = express();
const db = knex({
  client: 'mssql',
  connection: {
    host: '10.34.130.254',
    user: 'sa',
    password: 'bsnl@123',
    database: 'inventory'
  }
});
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());

// initializeDatabase(db);

app.use('/api', routes(db, SECRET_KEY));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});