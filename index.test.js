const assert = require('assert');
const { greet } = require('./index');

assert.strictEqual(greet('world'), 'hello world');
console.log('All tests passed.');
