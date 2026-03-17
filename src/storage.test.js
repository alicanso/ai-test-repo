const fs = require('fs');
const path = require('path');
const DataStore = require('./storage');

const TEST_FILE = path.join(__dirname, 'test-data.json');

describe('DataStore', () => {
  let store;

  beforeEach(() => {
    if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
    store = new DataStore(TEST_FILE);
  });

  afterEach(() => {
    if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
  });

  describe('create', () => {
    it('creates a record and returns it with an id', () => {
      const record = store.create('users', { name: 'Alice', email: 'alice@example.com' });
      expect(record.id).toBeDefined();
      expect(record.name).toBe('Alice');
      expect(record.email).toBe('alice@example.com');
    });

    it('assigns unique ids to each record', () => {
      const r1 = store.create('users', { name: 'Alice' });
      const r2 = store.create('users', { name: 'Bob' });
      expect(r1.id).not.toBe(r2.id);
    });

    it('persists data to disk', () => {
      store.create('users', { name: 'Alice' });
      expect(fs.existsSync(TEST_FILE)).toBe(true);
      const raw = JSON.parse(fs.readFileSync(TEST_FILE, 'utf8'));
      expect(raw.users).toHaveLength(1);
    });
  });

  describe('read', () => {
    it('reads a record by id', () => {
      const created = store.create('users', { name: 'Alice' });
      const found = store.read('users', created.id);
      expect(found).toEqual(created);
    });

    it('returns null for a missing id', () => {
      const found = store.read('users', 'nonexistent');
      expect(found).toBeNull();
    });
  });

  describe('readAll', () => {
    it('returns all records in a collection', () => {
      store.create('users', { name: 'Alice' });
      store.create('users', { name: 'Bob' });
      const all = store.readAll('users');
      expect(all).toHaveLength(2);
    });

    it('returns empty array for unknown collection', () => {
      const all = store.readAll('unknown');
      expect(all).toEqual([]);
    });
  });

  describe('update', () => {
    it('updates an existing record', () => {
      const created = store.create('users', { name: 'Alice' });
      const updated = store.update('users', created.id, { name: 'Alicia' });
      expect(updated.name).toBe('Alicia');
      expect(updated.id).toBe(created.id);
    });

    it('returns null when updating a non-existent record', () => {
      const result = store.update('users', 'nonexistent', { name: 'X' });
      expect(result).toBeNull();
    });

    it('persists update to disk', () => {
      const created = store.create('users', { name: 'Alice' });
      store.update('users', created.id, { name: 'Alicia' });
      const store2 = new DataStore(TEST_FILE);
      const found = store2.read('users', created.id);
      expect(found.name).toBe('Alicia');
    });
  });

  describe('delete', () => {
    it('deletes an existing record and returns true', () => {
      const created = store.create('users', { name: 'Alice' });
      const result = store.delete('users', created.id);
      expect(result).toBe(true);
      expect(store.read('users', created.id)).toBeNull();
    });

    it('returns false for a non-existent record', () => {
      const result = store.delete('users', 'nonexistent');
      expect(result).toBe(false);
    });

    it('persists deletion to disk', () => {
      const created = store.create('users', { name: 'Alice' });
      store.delete('users', created.id);
      const store2 = new DataStore(TEST_FILE);
      expect(store2.read('users', created.id)).toBeNull();
    });
  });

  describe('multiple collections', () => {
    it('supports independent collections', () => {
      store.create('users', { name: 'Alice' });
      store.create('posts', { title: 'Hello' });
      expect(store.readAll('users')).toHaveLength(1);
      expect(store.readAll('posts')).toHaveLength(1);
    });
  });

  describe('data persistence across instances', () => {
    it('loads existing data on init', () => {
      store.create('users', { name: 'Alice' });
      const store2 = new DataStore(TEST_FILE);
      expect(store2.readAll('users')).toHaveLength(1);
    });
  });
});
