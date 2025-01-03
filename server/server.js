import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { initializeDatabase } from './database.js';
import routes from './routes.js';

const app = express();
const db = new Database('inventory.db');
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());

initializeDatabase(db);

app.use('/api', routes(db, SECRET_KEY));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});