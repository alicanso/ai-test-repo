const { floor } = require('./index');

test('floor rounds down positive decimal', () => {
  expect(floor(4.7)).toBe(4);
});

test('floor rounds down negative decimal', () => {
  expect(floor(-2.3)).toBe(-3);
});

test('floor returns integer unchanged', () => {
  expect(floor(5)).toBe(5);
});
