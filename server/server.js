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
    host: "10.34.130.254",
    user: "sa",
    password: "bsnl@123",
    database: "inventory",
   
    options: {
      encrypt: true, // Use SSL/TLS encryption
      trustServerCertificate: true, // Bypass certificate validation
     
    },
    

  }
});
const SECRET_KEY = "your_secret_key"; // Replace with your actual secret key;


app.use(cors());
app.use(express.json());

// initializeDatabase(db);

app.use('/api', routes(db, SECRET_KEY));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});