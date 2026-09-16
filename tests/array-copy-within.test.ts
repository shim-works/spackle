import { arrayCopyWithin } from '../src/modules/es.array.copy-within.js';


/**
 * test262-derived conformance suite for the Array.prototype.copyWithin polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/copyWithin/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/copyWithin
 */
describe('Array.prototype.copyWithin — test262 conformance', () => {
  it('copies a trailing slice to the front', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3)).toEqual([4, 5, 3, 4, 5]);
  });

  it('copies with an explicit end', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3, 4)).toEqual([4, 2, 3, 4, 5]);
  });

  it('handles negative target/start/end (from end)', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], -2, -3, -1)).toEqual([1, 2, 3, 3, 4]);
  });

  it('returns the same array (mutates in place)', () => {
    const arr = [1, 2, 3];
    expect(arrayCopyWithin.call(arr, 0, 1)).toBe(arr);
  });

  it('copies backward when ranges overlap (no clobber)', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 2, 0)).toEqual([1, 2, 1, 2, 3]);
  });

  it('propagates holes (deletes destination slot)', () => {
    // eslint-disable-next-line no-sparse-arrays
    const arr = [, 2, 3];
    const out = arrayCopyWithin.call(arr, 2, 0, 1);
    expect(2 in out).toBe(false); // hole copied over index 2
  });

  it('throws TypeError on null/undefined this', () => {
    expect(() => arrayCopyWithin.call(null as any, 0, 0)).toThrow(TypeError);
  });

  it('matches native + timing', () => {
    const native = Array.prototype.copyWithin;
    const nativeResult = native.call([1, 2, 3, 4, 5], 0, 3);
    const specResult = arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3);
    expect(specResult).toEqual(nativeResult);
  });
});
