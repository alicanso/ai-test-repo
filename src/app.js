const express = require('express');
const { register, login, verifyToken } = require('./auth');

const app = express();
app.use(express.json());

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);
  const result = verifyToken(token);

  if (!result.valid) {
    return res.status(401).json({ success: false, error: result.error });
  }

  req.user = { username: result.username };
  next();
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body || {};
  const result = await register(username, password);

  if (!result.success) {
    const status = result.error === 'Username already exists' ? 409 : 400;
    return res.status(status).json(result);
  }

  res.status(201).json(result);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  const result = await login(username, password);

  if (!result.success) {
    return res.status(401).json(result);
  }

  res.status(200).json(result);
});

app.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ username: req.user.username });
});

module.exports = app;
