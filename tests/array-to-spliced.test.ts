import { arrayToSpliced } from '../src/modules/es.array.to-spliced.js';


/**
 * test262-derived conformance suite for the Array.prototype.toSpliced polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/toSpliced/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/toSpliced
 *
 * toSpliced is ES2023 (Chrome 110 / Safari 16) — far above the floor, so the
 * polyfill always installs; the probe is purely defensive.
 *
 * The non-mutating splice: remove skipCount at start, insert items there.
 *
 *   - returns a new array, original untouched
 *   - removes + inserts at the resolved start
 *   - negative start counts from the end, clamped to 0
 *   - start beyond length clamps to length (pure append)
 *   - absent skipCount removes the rest of the array from start
 *   - skipCount clamped to [0, length - start]
 *   - holes in retained ranges materialize as undefined (dense output)
 *   - generic via .call on an array-like
 */
describe('Array.prototype.toSpliced — test262 conformance', () => {
  describe('remove + insert', () => {
    it('removes a chunk and inserts replacements', () => {
      expect(arrayToSpliced.call([1, 2, 3, 4], 1, 2, 'a', 'b')).toEqual([
        1, 'a', 'b', 4,
      ]);
    });

    it('pure insertion with skipCount 0', () => {
      expect(arrayToSpliced.call([1, 2], 1, 0, 9)).toEqual([1, 9, 2]);
    });

    it('pure removal with no insert items', () => {
      expect(arrayToSpliced.call([1, 2, 3], 0, 1)).toEqual([2, 3]);
    });

    it('returns a copy when nothing changes', () => {
      const arr = [1, 2, 3];
      const out = arrayToSpliced.call(arr, 1, 0);
      expect(out).toEqual([1, 2, 3]);
      expect(out).not.toBe(arr);
    });
  });

  describe('start resolution', () => {
    it('counts a negative start from the end', () => {
      expect(arrayToSpliced.call([1, 2, 3, 4], -2, 1, 'x')).toEqual([1, 2, 'x', 4]);
    });

    it('clamps a very negative start to 0', () => {
      expect(arrayToSpliced.call([1, 2, 3], -99, 1, 'x')).toEqual(['x', 2, 3]);
    });

    it('clamps a start beyond length to length (append)', () => {
      expect(arrayToSpliced.call([1, 2], 99, 0, 'x')).toEqual([1, 2, 'x']);
    });
  });

  describe('skipCount resolution', () => {
    it('removes the rest of the array when skipCount is absent', () => {
      expect(arrayToSpliced.call([1, 2, 3, 4], 1)).toEqual([1]);
    });

    it('removes nothing when called with no args', () => {
      expect(arrayToSpliced.call([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('clamps skipCount to the remaining length', () => {
      expect(arrayToSpliced.call([1, 2, 3], 1, 99)).toEqual([1]);
    });

    it('treats a negative skipCount as 0', () => {
      expect(arrayToSpliced.call([1, 2, 3], 1, -5, 'x')).toEqual([1, 'x', 2, 3]);
    });
  });

  describe('non-mutating + holes', () => {
    it('does not mutate the original', () => {
      const arr = [1, 2, 3];
      arrayToSpliced.call(arr, 1, 1, 'x');
      expect(arr).toEqual([1, 2, 3]);
    });

    it('materializes holes in retained ranges as undefined', () => {
      // eslint-disable-next-line no-sparse-arrays
      const out = arrayToSpliced.call([1, , 3], 0, 0);
      expect(out).toEqual([1, undefined, 3]);
      expect(1 in out).toBe(true);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('floors a fractional length', () => {
      const arrayLike = { 0: 1, 1: 2, 2: 99, length: 2.9 };
      expect(arrayToSpliced.call(arrayLike as any, 0, 0)).toEqual([1, 2]);
    });
  });

  describe('generic application', () => {
    it('works on a string-keyed array-like via .call', () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };
      expect(arrayToSpliced.call(arrayLike as any, 1, 1, 'x')).toEqual([1, 'x', 3]);
    });
  });

  describe('parity vs native', () => {
    it('matches native on a remove+insert', () => {
      const arr = [1, 2, 3, 4, 5];
      const native = (Array.prototype as any).toSpliced;
      const nativeResult = native.call(arr, 1, 2, 'a', 'b');
      const specResult = arrayToSpliced.call(arr, 1, 2, 'a', 'b');
      expect(specResult).toEqual(nativeResult);
    });
  });
});
