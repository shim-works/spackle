import { objectToString } from '../src/modules/es.object.to-string.js';


/**
 * test262-derived conformance suite for the Object.prototype.toString island.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Object/prototype/toString/
 *
 * ES2015 — installed only alongside the Symbol island; it layers
 * Symbol.toStringTag dispatch over the captured native toString.
 *
 *   - null/undefined get their own tags without boxing
 *   - a string Symbol.toStringTag wins; non-string tags fall through
 *   - everything else defers to the native (built-in tags intact)
 */
describe('Object.prototype.toString island — test262 conformance', () => {
  it('tags null and undefined', () => {
    expect(objectToString.call(null)).toBe('[object Null]');
    expect(objectToString.call(undefined)).toBe('[object Undefined]');
  });

  it('defers to native for built-ins', () => {
    expect(objectToString.call([])).toBe('[object Array]');
    expect(objectToString.call({})).toBe('[object Object]');
    expect(objectToString.call(new Date())).toBe('[object Date]');
    expect(objectToString.call(/x/)).toBe('[object RegExp]');
  });

  it('honors a string Symbol.toStringTag', () => {
    const tagged = { [Symbol.toStringTag]: 'Custom' };
    expect(objectToString.call(tagged)).toBe('[object Custom]');
  });

  it('ignores a non-string Symbol.toStringTag', () => {
    const tagged = { [Symbol.toStringTag]: 42 as any };
    expect(objectToString.call(tagged)).toBe('[object Object]');
  });

  it('matches native across a spread of values', () => {
    const samples: any[] = [null, undefined, [], {}, 'a', 1, true, /x/, new Date(), Math, JSON];
    for (const sample of samples) {
      expect(objectToString.call(sample)).toBe(Object.prototype.toString.call(sample));
    }
  });
});
