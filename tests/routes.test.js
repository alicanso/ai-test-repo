const request = require('supertest');
const app = require('../src/app');
const { clearUsers } = require('../src/userStore');

beforeEach(() => {
  clearUsers();
});

describe('POST /register', () => {
  test('registers a new user', async () => {
    const res = await request(app).post('/register').send({ username: 'alice', password: 'pass123' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
  });

  test('returns 409 on duplicate username', async () => {
    await request(app).post('/register').send({ username: 'alice', password: 'pass123' });
    const res = await request(app).post('/register').send({ username: 'alice', password: 'other' });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test('returns 400 on missing fields', async () => {
    const res = await request(app).post('/register').send({ username: 'alice' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /login', () => {
  beforeEach(async () => {
    await request(app).post('/register').send({ username: 'alice', password: 'pass123' });
  });

  test('returns token on valid credentials', async () => {
    const res = await request(app).post('/login').send({ username: 'alice', password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.token).toBe('string');
  });

  test('returns 401 on invalid credentials', async () => {
    const res = await request(app).post('/login').send({ username: 'alice', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /profile', () => {
  let token;

  beforeEach(async () => {
    await request(app).post('/register').send({ username: 'alice', password: 'pass123' });
    const res = await request(app).post('/login').send({ username: 'alice', password: 'pass123' });
    token = res.body.token;
  });

  test('returns profile for authenticated user', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('alice');
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/profile');
    expect(res.status).toBe(401);
  });

  test('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });
});
