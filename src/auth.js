const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUser } = require('./userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-use-env-var-in-production';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '1h';

async function register(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  if (findUser(username)) {
    return { success: false, error: 'Username already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  createUser(username, hashedPassword);
  return { success: true };
}

async function login(username, password) {
  const user = findUser(username);

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { success: false, error: 'Invalid credentials' };
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  return { success: true, token };
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, username: decoded.username };
  } catch {
    return { valid: false, error: 'Invalid token' };
  }
}

module.exports = { register, login, verifyToken };
