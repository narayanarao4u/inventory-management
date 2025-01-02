import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const db = new Database('inventory.db');
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stockReceived (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id TEXT NOT NULL,
    itemName TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    amt DECIMAL(10,2) NOT NULL,
    received_Date DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stockIssued (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stockReceived_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    user TEXT NOT NULL,
    issued_Date DATETIME NOT NULL,
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

// User signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run(username, hashedPassword);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Invalid username or password' });
  }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes for stock received
app.post('/api/stock/receive', authenticateToken, (req, res) => {
  const { bill_id, itemName, qty, price, received_Date } = req.body;
  const amt = qty * price;
  
  const stmt = db.prepare(
    'INSERT INTO stockReceived (bill_id, itemName, qty, price, amt, received_Date) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(bill_id, itemName, qty, price, amt, received_Date);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/stock/receive/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { bill_id, itemName, qty, price, received_Date } = req.body;
  const amt = qty * price;
  
  const stmt = db.prepare(
    'UPDATE stockReceived SET bill_id = ?, itemName = ?, qty = ?, price = ?, amt = ?, received_Date = ? WHERE id = ?'
  );
  const result = stmt.run(bill_id, itemName, qty, price, amt, received_Date, id);
  res.json({ changes: result.changes });
});

app.delete('/api/stock/receive/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  const stmt = db.prepare('DELETE FROM stockReceived WHERE id = ?');
  const result = stmt.run(id);
  res.json({ changes: result.changes });
});

app.get('/api/stock/received', authenticateToken, (req, res) => {
  const stocks = db.prepare('SELECT * FROM stockReceived ORDER BY created_at DESC').all();
  res.json(stocks);
});

// Routes for stock issued
app.post('/api/stock/issue', authenticateToken, (req, res) => {
  const { stockReceived_id, qty, user, issued_Date } = req.body;
  
  const stmt = db.prepare(
    'INSERT INTO stockIssued (stockReceived_id, qty, user, issued_Date) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(stockReceived_id, qty, user, issued_Date);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/stock/issue/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { stockReceived_id, qty, user, issued_Date } = req.body;
  
  const stmt = db.prepare(
    'UPDATE stockIssued SET stockReceived_id = ?, qty = ?, user = ?, issued_Date = ? WHERE id = ?'
  );
  const result = stmt.run(stockReceived_id, qty, user, issued_Date, id);
  res.json({ changes: result.changes });
});

app.delete('/api/stock/issue/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  const stmt = db.prepare('DELETE FROM stockIssued WHERE id = ?');
  const result = stmt.run(id);
  res.json({ changes: result.changes });
});

app.get('/api/stock/issued', authenticateToken, (req, res) => {
  const issues = db.prepare('SELECT * FROM stockIssued ORDER BY created_at DESC').all();
  res.json(issues);
});

// Route for stock balance
app.get('/api/stock/balance', authenticateToken, (req, res) => {
  const balance = db.prepare('SELECT * FROM stockBalance').all();
  res.json(balance);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});