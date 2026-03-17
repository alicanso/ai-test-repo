const Stripe = require('stripe');
const db = require('./db');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createPayment({ amount, currency }) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  });

  db.prepare(`
    INSERT INTO payments (stripe_payment_intent_id, amount, currency, status)
    VALUES (?, ?, ?, ?)
  `).run(paymentIntent.id, paymentIntent.amount, paymentIntent.currency, paymentIntent.status);

  return {
    payment_intent_id: paymentIntent.id,
    client_secret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
  };
}

function getPayments() {
  return db.prepare('SELECT * FROM payments ORDER BY created_at DESC').all();
}

module.exports = { createPayment, getPayments };
