const { abs } = require('./index');

test('abs returns positive number unchanged', () => {
  expect(abs(5)).toBe(5);
});

test('abs returns absolute value of negative number', () => {
  expect(abs(-3)).toBe(3);
});

test('abs returns 0 for 0', () => {
  expect(abs(0)).toBe(0);
});
