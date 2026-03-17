const request = require('supertest');
const app = require('./app');

describe('POST /calculate', () => {
  test('adds two numbers', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'add', a: 3, b: 4 });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(7);
  });

  test('subtracts two numbers', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'subtract', a: 10, b: 3 });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(7);
  });

  test('multiplies two numbers', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'multiply', a: 3, b: 4 });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(12);
  });

  test('divides two numbers', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'divide', a: 10, b: 2 });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('returns 400 on division by zero', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'divide', a: 5, b: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 on unknown operation', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'modulo', a: 5, b: 2 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 when a is not a number', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'add', a: 'foo', b: 2 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 when b is not a number', async () => {
    const res = await request(app).post('/calculate').send({ operation: 'add', a: 2, b: 'bar' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
