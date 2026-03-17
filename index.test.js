const assert = require('assert');
const { clamp } = require('./index');

assert.strictEqual(clamp(5, 1, 10), 5, 'value within range');
assert.strictEqual(clamp(0, 1, 10), 1, 'value below min');
assert.strictEqual(clamp(15, 1, 10), 10, 'value above max');
assert.strictEqual(clamp(1, 1, 10), 1, 'value equals min');
assert.strictEqual(clamp(10, 1, 10), 10, 'value equals max');

console.log('All tests passed');
