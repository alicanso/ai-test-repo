const { ceil } = require('./index');

test('ceil returns Math.ceil of a positive decimal', () => {
  expect(ceil(4.1)).toBe(5);
});

test('ceil returns Math.ceil of a negative decimal', () => {
  expect(ceil(-4.9)).toBe(-4);
});

test('ceil returns same value for integer', () => {
  expect(ceil(3)).toBe(3);
});
