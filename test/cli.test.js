const { test } = require('node:test');
const assert = require('node:assert/strict');
const { runCLI } = require('../src/cli');

test('--version returns version string', () => {
  const result = runCLI(['--version']);
  assert.match(result.output, /\d+\.\d+\.\d+/);
  assert.equal(result.exitCode, 0);
});

test('-v returns version string', () => {
  const result = runCLI(['-v']);
  assert.match(result.output, /\d+\.\d+\.\d+/);
  assert.equal(result.exitCode, 0);
});

test('--help returns help text', () => {
  const result = runCLI(['--help']);
  assert.match(result.output, /Usage/i);
  assert.equal(result.exitCode, 0);
});

test('-h returns help text', () => {
  const result = runCLI(['-h']);
  assert.match(result.output, /Usage/i);
  assert.equal(result.exitCode, 0);
});

test('echo prints the message', () => {
  const result = runCLI(['echo', 'hello world']);
  assert.equal(result.output, 'hello world');
  assert.equal(result.exitCode, 0);
});

test('echo with no args returns error', () => {
  const result = runCLI(['echo']);
  assert.match(result.output, /error/i);
  assert.equal(result.exitCode, 1);
});

test('greet with name', () => {
  const result = runCLI(['greet', 'Alice']);
  assert.match(result.output, /Alice/);
  assert.equal(result.exitCode, 0);
});

test('greet with no name uses default', () => {
  const result = runCLI(['greet']);
  assert.match(result.output, /Hello/i);
  assert.equal(result.exitCode, 0);
});

test('calc addition', () => {
  const result = runCLI(['calc', '3', '+', '4']);
  assert.equal(result.output, '7');
  assert.equal(result.exitCode, 0);
});

test('calc subtraction', () => {
  const result = runCLI(['calc', '10', '-', '3']);
  assert.equal(result.output, '7');
  assert.equal(result.exitCode, 0);
});

test('calc multiplication', () => {
  const result = runCLI(['calc', '3', '*', '4']);
  assert.equal(result.output, '12');
  assert.equal(result.exitCode, 0);
});

test('calc division', () => {
  const result = runCLI(['calc', '10', '/', '2']);
  assert.equal(result.output, '5');
  assert.equal(result.exitCode, 0);
});

test('calc division by zero returns error', () => {
  const result = runCLI(['calc', '10', '/', '0']);
  assert.match(result.output, /error/i);
  assert.equal(result.exitCode, 1);
});

test('calc with wrong arg count returns error', () => {
  const result = runCLI(['calc', '10']);
  assert.match(result.output, /error/i);
  assert.equal(result.exitCode, 1);
});

test('calc with unknown operator returns error', () => {
  const result = runCLI(['calc', '3', '%', '4']);
  assert.match(result.output, /error/i);
  assert.equal(result.exitCode, 1);
});

test('unknown command returns error', () => {
  const result = runCLI(['foobar']);
  assert.match(result.output, /error/i);
  assert.equal(result.exitCode, 1);
});

test('no args returns help text', () => {
  const result = runCLI([]);
  assert.match(result.output, /Usage/i);
  assert.equal(result.exitCode, 0);
});
