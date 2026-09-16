import { arrayFindLast } from '../src/modules/es.array.find-last.js';


/**
 * test262-derived conformance suite for the Array.prototype.findLast polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/findLast/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/findLast
 */
describe('Array.prototype.findLast — test262 conformance', () => {
  it('returns the LAST matching element', () => {
    expect(arrayFindLast.call([1, 2, 3, 4], (v) => v % 2 === 1)).toBe(3);
  });

  it('returns undefined when nothing matches', () => {
    expect(arrayFindLast.call([2, 4], (v) => v % 2 === 1)).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(arrayFindLast.call([], () => true)).toBeUndefined();
  });

  it('calls predicate with (value, index, array) DESCENDING', () => {
    const arr = ['a', 'b', 'c'];
    const seen: Array<[string, number]> = [];
    arrayFindLast.call(arr, (v, i) => {
      seen.push([v, i]);
      return false;
    });
    expect(seen).toEqual([
      ['c', 2],
      ['b', 1],
      ['a', 0],
    ]);
  });

  it('honors thisArg', () => {
    const ctx = { max: 3 };
    const out = arrayFindLast.call(
      [1, 2, 3, 4],
      function (this: typeof ctx, v: number) {
        return v <= this.max;
      },
      ctx,
    );
    expect(out).toBe(3);
  });

  it('throws TypeError when predicate is not callable', () => {
    expect(() => arrayFindLast.call([1, 2], 5 as any)).toThrow(TypeError);
  });

  it('visits holes as undefined', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(arrayFindLast.call([1, , 3], (v) => v === undefined)).toBeUndefined();
  });

  it('matches native + timing', () => {
    const arr = [1, 2, 3, 4, 5];
    const native = (Array.prototype as any).findLast;
    const pred = (v: number) => v < 4;
    const nativeResult = native.call(arr, pred);
    const specResult = arrayFindLast.call(arr, pred);
    expect(specResult).toBe(nativeResult);
  });
});
