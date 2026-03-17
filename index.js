const express = require('express');
const { createPayment, getPayments } = require('./src/payment');

const app = express();
app.use(express.json());

app.post('/payments', async (req, res) => {
  const { amount, currency = 'usd' } = req.body;
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  const payment = await createPayment({ amount, currency });
  res.status(201).json(payment);
});

app.get('/payments', (req, res) => {
  res.json(getPayments());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
