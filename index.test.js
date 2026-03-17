const { isOdd, double } = require('./index');

test('isOdd returns true for odd numbers', () => {
  expect(isOdd(1)).toBe(true);
  expect(isOdd(3)).toBe(true);
  expect(isOdd(7)).toBe(true);
});

test('isOdd returns false for even numbers', () => {
  expect(isOdd(2)).toBe(false);
  expect(isOdd(4)).toBe(false);
  expect(isOdd(0)).toBe(false);
});

test('double returns n*2', () => {
  expect(double(2)).toBe(4);
  expect(double(3)).toBe(6);
  expect(double(0)).toBe(0);
  expect(double(-1)).toBe(-2);
});
