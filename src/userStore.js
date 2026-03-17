const users = new Map();

function createUser(username, hashedPassword) {
  users.set(username, { username, password: hashedPassword });
}

function findUser(username) {
  return users.get(username) || null;
}

function clearUsers() {
  users.clear();
}

module.exports = { createUser, findUser, clearUsers };
