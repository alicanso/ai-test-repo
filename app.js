const express = require('express');
const app = express();

app.use(express.json());

app.post('/calculate', (req, res) => {
  const { operation, a, b } = req.body;

  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a and b must be numbers' });
  }

  const ops = { add: a + b, subtract: a - b, multiply: a * b };

  if (operation === 'divide') {
    if (b === 0) return res.status(400).json({ error: 'Division by zero' });
    return res.json({ result: a / b });
  }

  if (!(operation in ops)) {
    return res.status(400).json({ error: `Unknown operation: ${operation}` });
  }

  res.json({ result: ops[operation] });
});

module.exports = app;
