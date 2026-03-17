const { createPayment, getPayments } = require('./payment');

// Mock stripe
jest.mock('stripe', () => {
  return jest.fn(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret_abc',
        amount: 1000,
        currency: 'usd',
        status: 'requires_payment_method',
      }),
    },
  }));
});

// Use in-memory DB for tests
jest.mock('./db', () => {
  const Database = require('better-sqlite3');
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stripe_payment_intent_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
});

describe('createPayment', () => {
  beforeEach(() => {
    const db = require('./db');
    db.prepare('DELETE FROM payments').run();
  });

  test('creates a Stripe PaymentIntent and returns client_secret', async () => {
    const result = await createPayment({ amount: 1000, currency: 'usd' });
    expect(result.client_secret).toBe('pi_test_123_secret_abc');
  });

  test('saves payment record to database', async () => {
    await createPayment({ amount: 1000, currency: 'usd' });
    const db = require('./db');
    const row = db.prepare('SELECT * FROM payments WHERE stripe_payment_intent_id = ?').get('pi_test_123');
    expect(row).toBeTruthy();
    expect(row.amount).toBe(1000);
    expect(row.currency).toBe('usd');
    expect(row.status).toBe('requires_payment_method');
  });

  test('returns payment intent id', async () => {
    const result = await createPayment({ amount: 2000, currency: 'usd' });
    expect(result.payment_intent_id).toBe('pi_test_123');
  });
});

describe('getPayments', () => {
  beforeEach(() => {
    const db = require('./db');
    db.prepare('DELETE FROM payments').run();
  });

  test('returns all payments from database', async () => {
    await createPayment({ amount: 1000, currency: 'usd' });
    const payments = getPayments();
    expect(payments).toHaveLength(1);
    expect(payments[0].stripe_payment_intent_id).toBe('pi_test_123');
  });

  test('returns empty array when no payments', () => {
    const payments = getPayments();
    expect(payments).toHaveLength(0);
  });
});
