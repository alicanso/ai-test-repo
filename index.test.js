const { power } = require('./index');

test('power(2, 3) returns 8', () => {
  expect(power(2, 3)).toBe(8);
});

test('power(5, 0) returns 1', () => {
  expect(power(5, 0)).toBe(1);
});

test('power(3, 2) returns 9', () => {
  expect(power(3, 2)).toBe(9);
});
