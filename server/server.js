import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('inventory.db');

app.use(cors());
app.use(express.json());

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS stockReceived (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id TEXT NOT NULL,
    itemName TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    amt DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stockIssued (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stockReceived_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    user TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stockReceived_id) REFERENCES stockReceived(id)
  );

  CREATE VIEW IF NOT EXISTS stockBalance AS
  SELECT 
    sr.id,
    sr.itemName,
    sr.qty as received_qty,
    COALESCE(SUM(si.qty), 0) as issued_qty,
    (sr.qty - COALESCE(SUM(si.qty), 0)) as balance_qty,
    sr.price,
    sr.amt
  FROM stockReceived sr
  LEFT JOIN stockIssued si ON sr.id = si.stockReceived_id
  GROUP BY sr.id;
`);

// Routes for stock received
app.post('/api/stock/receive', (req, res) => {
  const { bill_id, itemName, qty, price } = req.body;
  const amt = qty * price;
  
  const stmt = db.prepare(
    'INSERT INTO stockReceived (bill_id, itemName, qty, price, amt) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(bill_id, itemName, qty, price, amt);
  res.json({ id: result.lastInsertRowid });
});

app.get('/api/stock/received', (req, res) => {
  const stocks = db.prepare('SELECT * FROM stockReceived ORDER BY created_at DESC').all();
  res.json(stocks);
});

// Routes for stock issued
app.post('/api/stock/issue', (req, res) => {
  const { stockReceived_id, qty, user } = req.body;
  
  const stmt = db.prepare(
    'INSERT INTO stockIssued (stockReceived_id, qty, user) VALUES (?, ?, ?)'
  );
  const result = stmt.run(stockReceived_id, qty, user);
  res.json({ id: result.lastInsertRowid });
});

app.get('/api/stock/issued', (req, res) => {
  const issues = db.prepare('SELECT * FROM stockIssued ORDER BY created_at DESC').all();
  res.json(issues);
});

// Route for stock balance
app.get('/api/stock/balance', (req, res) => {
  const balance = db.prepare('SELECT * FROM stockBalance').all();
  res.json(balance);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});