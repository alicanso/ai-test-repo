const { min } = require('./index');

test('min returns the smaller of two numbers', () => {
  expect(min(2, 5)).toBe(2);
  expect(min(5, 2)).toBe(2);
  expect(min(-1, 0)).toBe(-1);
  expect(min(3, 3)).toBe(3);
});
