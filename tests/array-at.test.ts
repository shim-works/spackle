import { arrayAt } from '../src/modules/es.array.at.js';


/**
 * test262-derived conformance suite for the Array.prototype.at polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/at/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/at
 */
describe('Array.prototype.at — test262 conformance', () => {
  it('returns the element at a positive index', () => {
    expect(arrayAt.call([1, 2, 3], 0)).toBe(1);
    expect(arrayAt.call([1, 2, 3], 2)).toBe(3);
  });

  it('counts from the end for a negative index', () => {
    expect(arrayAt.call([1, 2, 3], -1)).toBe(3);
    expect(arrayAt.call([1, 2, 3], -3)).toBe(1);
  });

  it('returns undefined when out of range', () => {
    expect(arrayAt.call([1, 2, 3], 5)).toBeUndefined();
    expect(arrayAt.call([1, 2, 3], -5)).toBeUndefined();
  });

  it('coerces the index via ToInteger (fractional truncated)', () => {
    expect(arrayAt.call([1, 2, 3], 1.9)).toBe(2);
    expect(arrayAt.call([1, 2, 3], -1.9)).toBe(3);
  });

  it('treats a missing / NaN index as 0', () => {
    expect(arrayAt.call([1, 2, 3], undefined as any)).toBe(1);
    expect(arrayAt.call([1, 2, 3], NaN)).toBe(1);
  });

  it('throws TypeError on null/undefined this', () => {
    expect(() => arrayAt.call(null as any, 0)).toThrow(TypeError);
  });

  it('works on array-likes via .call', () => {
    expect(arrayAt.call({ 0: 'a', 1: 'b', length: 2 } as any, -1)).toBe('b');
  });

  it('matches native + timing', () => {
    const arr = [10, 20, 30, 40];
    const native = (Array.prototype as any).at;
    const nativeResult = native.call(arr, -2);
    const specResult = arrayAt.call(arr, -2);
    expect(specResult).toBe(nativeResult);
  });
});
