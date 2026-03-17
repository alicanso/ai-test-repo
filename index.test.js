const { max } = require('./index');

test('max returns the larger of two numbers', () => {
  expect(max(3, 5)).toBe(5);
  expect(max(10, 2)).toBe(10);
  expect(max(-1, -3)).toBe(-1);
  expect(max(4, 4)).toBe(4);
});
