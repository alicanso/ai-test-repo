const { sqrt } = require('./index');

test('sqrt(4) returns 2', () => {
  expect(sqrt(4)).toBe(2);
});

test('sqrt(9) returns 3', () => {
  expect(sqrt(9)).toBe(3);
});

test('sqrt(0) returns 0', () => {
  expect(sqrt(0)).toBe(0);
});
