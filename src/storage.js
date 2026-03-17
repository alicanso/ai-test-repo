const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = this._load();
  }

  _load() {
    if (fs.existsSync(this.filePath)) {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }
    return {};
  }

  _save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  _collection(name) {
    if (!this.data[name]) this.data[name] = [];
    return this.data[name];
  }

  create(collection, record) {
    const id = crypto.randomUUID();
    const entry = { id, ...record };
    this._collection(collection).push(entry);
    this._save();
    return entry;
  }

  read(collection, id) {
    return this._collection(collection).find((r) => r.id === id) || null;
  }

  readAll(collection) {
    return [...this._collection(collection)];
  }

  update(collection, id, changes) {
    const col = this._collection(collection);
    const index = col.findIndex((r) => r.id === id);
    if (index === -1) return null;
    col[index] = { ...col[index], ...changes, id };
    this._save();
    return col[index];
  }

  delete(collection, id) {
    const col = this._collection(collection);
    const index = col.findIndex((r) => r.id === id);
    if (index === -1) return false;
    col.splice(index, 1);
    this._save();
    return true;
  }
}

module.exports = DataStore;
