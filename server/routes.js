import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const routes = (db, SECRET_KEY) => {
  const router = express.Router();

  // User signup
  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [id] = await db('users').insert({ username, password: hashedPassword });
      res.json({ id });
    } catch (error) {
      console.log(error);
      
      res.status(400).json({ error: 'Username already exists' });
    }
  });

  // User login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db('users').where({ username }).first();

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
  router.post('/stock/receive', authenticateToken, async (req, res) => {
    const { bill_id, itemName, qty, price, received_Date } = req.body;
    const amt = qty * price;

    const [id] = await db('stockReceived').insert({ bill_id, itemName, qty, price, amt, received_Date });
    res.json({ id });
  });

  router.put('/stock/receive/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { bill_id, itemName, qty, price, received_Date } = req.body;
    const amt = qty * price;

    const changes = await db('stockReceived').where({ id }).update({ bill_id, itemName, qty, price, amt, received_Date });
    res.json({ changes });
  });

  router.delete('/stock/receive/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const changes = await db('stockReceived').where({ id }).del();
    res.json({ changes });
  });

  router.get('/stock/received', authenticateToken, async (req, res) => {
    const stocks = await db('stockReceived').orderBy('created_at', 'desc');
    res.json(stocks);
  });

  // Routes for stock issued
  router.post('/stock/issue', authenticateToken, async (req, res) => {
    const { stockReceived_id, qty, user, issued_Date } = req.body;

    const [id] = await db('stockIssued').insert({ stockReceived_id, qty, user, issued_Date });
    res.json({ id });
  });

  router.put('/stock/issue/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { stockReceived_id, qty, user, issued_Date } = req.body;

    const changes = await db('stockIssued').where({ id }).update({ stockReceived_id, qty, user, issued_Date });
    res.json({ changes });
  });

  router.delete('/stock/issue/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const changes = await db('stockIssued').where({ id }).del();
    res.json({ changes });
  });

  router.get('/stock/issued', authenticateToken, async (req, res) => {
    const issues = await db('stockIssued').orderBy('created_at', 'desc');
    res.json(issues);
  });

  // Route for stock balance
  router.get('/stock/balance', authenticateToken, async (req, res) => {
    const balance = await db.select('*').from('stockBalance')
    res.json(balance);
  });

  return router;
};

export default routes;
