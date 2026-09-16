import { arrayFindLastIndex } from '../src/modules/es.array.find-last-index.js';


/**
 * test262-derived conformance suite for the Array.prototype.findLastIndex polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/findLastIndex/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/findLastIndex
 */
describe('Array.prototype.findLastIndex — test262 conformance', () => {
  it('returns the index of the LAST matching element', () => {
    expect(arrayFindLastIndex.call([1, 2, 3, 4], (v) => v % 2 === 1)).toBe(2);
  });

  it('returns -1 when nothing matches', () => {
    expect(arrayFindLastIndex.call([2, 4], (v) => v % 2 === 1)).toBe(-1);
  });

  it('returns -1 for an empty array', () => {
    expect(arrayFindLastIndex.call([], () => true)).toBe(-1);
  });

  it('calls predicate with (value, index, array) DESCENDING', () => {
    const arr = ['a', 'b', 'c'];
    const seen: number[] = [];
    arrayFindLastIndex.call(arr, (_v, i) => {
      seen.push(i);
      return false;
    });
    expect(seen).toEqual([2, 1, 0]);
  });

  it('honors thisArg', () => {
    const ctx = { max: 3 };
    const out = arrayFindLastIndex.call(
      [1, 2, 3, 4],
      function (this: typeof ctx, v: number) {
        return v <= this.max;
      },
      ctx,
    );
    expect(out).toBe(2);
  });

  it('throws TypeError when predicate is not callable', () => {
    expect(() => arrayFindLastIndex.call([1, 2], 5 as any)).toThrow(TypeError);
  });

  it('matches native + timing', () => {
    const arr = [1, 2, 3, 4, 5];
    const native = (Array.prototype as any).findLastIndex;
    const pred = (v: number) => v < 4;
    const nativeResult = native.call(arr, pred);
    const specResult = arrayFindLastIndex.call(arr, pred);
    expect(specResult).toBe(nativeResult);
  });
});
