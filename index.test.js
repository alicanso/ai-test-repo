const assert = require('assert');
const { round } = require('./index');

assert.strictEqual(round(4.4), 4);
assert.strictEqual(round(4.5), 5);
assert.strictEqual(round(-1.5), -1);
assert.strictEqual(round(0), 0);

console.log('All tests passed');
