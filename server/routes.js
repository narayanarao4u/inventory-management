import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const routes = (db, SECRET_KEY) => {
  const router = express.Router();

  // User signup
  router.post('/signup', async (req, res) => {
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
  router.post('/login', async (req, res) => {
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
  router.post('/stock/receive', authenticateToken, (req, res) => {
    const { bill_id, itemName, qty, price, received_Date } = req.body;
    const amt = qty * price;
    
    const stmt = db.prepare(
      'INSERT INTO stockReceived (bill_id, itemName, qty, price, amt, received_Date) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(bill_id, itemName, qty, price, amt, received_Date);
    res.json({ id: result.lastInsertRowid });
  });

  router.put('/stock/receive/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { bill_id, itemName, qty, price, received_Date } = req.body;
    const amt = qty * price;
    
    const stmt = db.prepare(
      'UPDATE stockReceived SET bill_id = ?, itemName = ?, qty = ?, price = ?, amt = ?, received_Date = ? WHERE id = ?'
    );
    const result = stmt.run(bill_id, itemName, qty, price, amt, received_Date, id);
    res.json({ changes: result.changes });
  });

  router.delete('/stock/receive/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM stockReceived WHERE id = ?');
    const result = stmt.run(id);
    res.json({ changes: result.changes });
  });

  router.get('/stock/received', authenticateToken, (req, res) => {
    const stocks = db.prepare('SELECT * FROM stockReceived ORDER BY created_at DESC').all();
    res.json(stocks);
  });

  // Routes for stock issued
  router.post('/stock/issue', authenticateToken, (req, res) => {
    const { stockReceived_id, qty, user, issued_Date } = req.body;
    
    const stmt = db.prepare(
      'INSERT INTO stockIssued (stockReceived_id, qty, user, issued_Date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(stockReceived_id, qty, user, issued_Date);
    res.json({ id: result.lastInsertRowid });
  });

  router.put('/stock/issue/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { stockReceived_id, qty, user, issued_Date } = req.body;
    
    const stmt = db.prepare(
      'UPDATE stockIssued SET stockReceived_id = ?, qty = ?, user = ?, issued_Date = ? WHERE id = ?'
    );
    const result = stmt.run(stockReceived_id, qty, user, issued_Date, id);
    res.json({ changes: result.changes });
  });

  router.delete('/stock/issue/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM stockIssued WHERE id = ?');
    const result = stmt.run(id);
    res.json({ changes: result.changes });
  });

  router.get('/stock/issued', authenticateToken, (req, res) => {
    const issues = db.prepare('SELECT * FROM stockIssued ORDER BY created_at DESC').all();
    res.json(issues);
  });

  // Route for stock balance
  router.get('/stock/balance', authenticateToken, (req, res) => {
    const balance = db.prepare('SELECT * FROM stockBalance').all();
    res.json(balance);
  });

  return router;
};

export default routes;
