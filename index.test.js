const { sign } = require('./index');

test('sign returns 1 for positive', () => expect(sign(5)).toBe(1));
test('sign returns -1 for negative', () => expect(sign(-3)).toBe(-1));
test('sign returns 0 for zero', () => expect(sign(0)).toBe(0));
