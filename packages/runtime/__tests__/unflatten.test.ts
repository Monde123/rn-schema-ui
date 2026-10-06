import { needsUnflatten, unflatten } from '../src/unflatten';

describe('unflatten', () => {
  it('imbrique les clés pointées', () => {
    expect(unflatten({ 'a.b': 1, c: 2 })).toEqual({ a: { b: 1 }, c: 2 });
  });
  it('needsUnflatten', () => {
    expect(needsUnflatten({ a: 1 })).toBe(false);
    expect(needsUnflatten({ 'a.b': 1 })).toBe(true);
  });
});
