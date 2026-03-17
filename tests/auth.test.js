const { register, login, verifyToken } = require('../src/auth');
const { clearUsers } = require('../src/userStore');

beforeEach(() => {
  clearUsers();
});

describe('register', () => {
  test('registers a new user successfully', async () => {
    const result = await register('alice', 'password123');
    expect(result).toEqual({ success: true });
  });

  test('rejects duplicate username', async () => {
    await register('alice', 'password123');
    const result = await register('alice', 'otherpass');
    expect(result).toEqual({ success: false, error: 'Username already exists' });
  });

  test('rejects empty username', async () => {
    const result = await register('', 'password123');
    expect(result).toEqual({ success: false, error: 'Username and password are required' });
  });

  test('rejects empty password', async () => {
    const result = await register('alice', '');
    expect(result).toEqual({ success: false, error: 'Username and password are required' });
  });

  test('does not store plain-text password', async () => {
    await register('alice', 'password123');
    const { findUser } = require('../src/userStore');
    const user = findUser('alice');
    expect(user.password).not.toBe('password123');
  });
});

describe('login', () => {
  beforeEach(async () => {
    await register('alice', 'password123');
  });

  test('returns token on valid credentials', async () => {
    const result = await login('alice', 'password123');
    expect(result.success).toBe(true);
    expect(typeof result.token).toBe('string');
  });

  test('rejects wrong password', async () => {
    const result = await login('alice', 'wrongpass');
    expect(result).toEqual({ success: false, error: 'Invalid credentials' });
  });

  test('rejects non-existent user', async () => {
    const result = await login('nobody', 'password123');
    expect(result).toEqual({ success: false, error: 'Invalid credentials' });
  });
});

describe('verifyToken', () => {
  test('returns user info for valid token', async () => {
    await register('alice', 'password123');
    const { token } = await login('alice', 'password123');
    const result = verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.username).toBe('alice');
  });

  test('rejects invalid token', () => {
    const result = verifyToken('not-a-valid-token');
    expect(result).toEqual({ valid: false, error: 'Invalid token' });
  });

  test('rejects tampered token', () => {
    const result = verifyToken('eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFsaWNlIn0.tampered');
    expect(result).toEqual({ valid: false, error: 'Invalid token' });
  });
});
