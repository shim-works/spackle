import { arrayFill } from '../src/modules/es.array.fill.js';


/**
 * test262-derived conformance suite for the Array.prototype.fill polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/fill/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/fill
 *
 * fill semantics are stable since ES2015 (no later revisions). Targets lack it
 * entirely (Chrome < 45 / Safari < 7.1), so the polyfill always installs there.
 *
 *   - mutates and returns the same array (this)
 *   - the fill value is held by reference (objects: same instance in every slot)
 *   - start/end coerced via ToInteger: NaN -> 0, fractions truncated toward
 *     zero, negatives count from the end and clamp to 0, +/-Infinity handled
 *   - end defaults to length; an end past length clamps to length
 *   - length coerced via ToLength: negative/NaN length -> no-op (no scan/hang)
 *   - holes are filled with real entries
 *   - generic: works on array-likes via .call
 */
describe('Array.prototype.fill — test262 conformance', () => {
  describe('return value & mutation', () => {
    it('returns the same array (mutates in place)', () => {
      const arr = [1, 2, 3];
      expect(arrayFill.call(arr, 0)).toBe(arr);
    });

    it('fills the entire array when no start/end', () => {
      expect(arrayFill.call([1, 2, 3], 7)).toEqual([7, 7, 7]);
    });

    it('holds the fill value by reference (same object in every slot)', () => {
      const obj = {};
      const out = arrayFill.call(new Array(2), obj as any);
      expect(out[0]).toBe(obj);
      expect(out[1]).toBe(obj);
    });
  });

  describe('start (ToInteger)', () => {
    it('fills from a positive start', () => {
      expect(arrayFill.call([1, 2, 3, 4], 0, 2)).toEqual([1, 2, 0, 0]);
    });

    it('counts a negative start from the end', () => {
      expect(arrayFill.call([1, 2, 3, 4], 0, -2)).toEqual([1, 2, 0, 0]);
    });

    it('clamps a large negative start to 0', () => {
      expect(arrayFill.call([1, 2, 3], 0, -100)).toEqual([0, 0, 0]);
    });

    it('treats a NaN start as 0', () => {
      expect(arrayFill.call([1, 2, 3], 0, NaN)).toEqual([0, 0, 0]);
    });

    it('truncates a fractional start toward zero', () => {
      expect(arrayFill.call([1, 2, 3, 4], 0, 1.9)).toEqual([1, 0, 0, 0]);
    });

    it('fills nothing when start is +Infinity (>= length)', () => {
      expect(arrayFill.call([1, 2, 3], 0, Infinity)).toEqual([1, 2, 3]);
    });

    it('fills everything when start is -Infinity', () => {
      expect(arrayFill.call([1, 2, 3], 0, -Infinity)).toEqual([0, 0, 0]);
    });

    it('does nothing when start beyond length', () => {
      expect(arrayFill.call([1, 2, 3], 9, 10)).toEqual([1, 2, 3]);
    });
  });

  describe('end (ToInteger)', () => {
    it('defaults end to length', () => {
      expect(arrayFill.call([1, 2, 3], 0, 1)).toEqual([1, 0, 0]);
    });

    it('fills between start and end', () => {
      expect(arrayFill.call([1, 2, 3, 4, 5], 9, 1, 3)).toEqual([1, 9, 9, 4, 5]);
    });

    it('counts a negative end from the end', () => {
      expect(arrayFill.call([1, 2, 3, 4], 0, 1, -1)).toEqual([1, 0, 0, 4]);
    });

    it('clamps an end past length to length', () => {
      expect(arrayFill.call([1, 2, 3], 0, 0, 100)).toEqual([0, 0, 0]);
    });

    it('treats a NaN end as 0 (fills nothing)', () => {
      expect(arrayFill.call([1, 2, 3], 0, 0, NaN)).toEqual([1, 2, 3]);
    });

    it('truncates a fractional end toward zero', () => {
      expect(arrayFill.call([1, 2, 3, 4], 0, 0, 2.9)).toEqual([0, 0, 3, 4]);
    });

    it('fills to the end when end is +Infinity', () => {
      expect(arrayFill.call([1, 2, 3], 0, 0, Infinity)).toEqual([0, 0, 0]);
    });

    it('fills nothing when end is -Infinity', () => {
      expect(arrayFill.call([1, 2, 3], 0, 0, -Infinity)).toEqual([1, 2, 3]);
    });

    it('does nothing when start > end', () => {
      expect(arrayFill.call([1, 2, 3, 4], 0, 3, 1)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('length coercion (ToLength)', () => {
    it('is a no-op on an empty array', () => {
      expect(arrayFill.call([], 1)).toEqual([]);
    });

    it('treats a negative length as a no-op (no scan, no hang)', () => {
      const arrayLike: any = { length: -1, 0: 'x' };
      const out = arrayFill.call(arrayLike, 'y');
      expect(out).toBe(arrayLike);
      expect(out[0]).toBe('x');
    });

    it('treats a NaN length as a no-op', () => {
      const arrayLike: any = { length: NaN, 0: 'x' };
      arrayFill.call(arrayLike, 'y');
      expect(arrayLike[0]).toBe('x');
    });
  });

  describe('holes', () => {
    it('fills holes with real entries', () => {
      const out = arrayFill.call(new Array(3), 1 as any);
      expect(out).toEqual([1, 1, 1]);
      expect(0 in out).toBe(true);
      expect(2 in out).toBe(true);
    });
  });

  describe('generic application (array-likes)', () => {
    it('fills a string-keyed array-like via .call', () => {
      const arrayLike: any = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
      arrayFill.call(arrayLike, 'z', 1);
      expect(arrayLike).toEqual({ 0: 'a', 1: 'z', 2: 'z', length: 3 });
    });
  });

  describe('parity vs native', () => {
    it('matches native filling a range', () => {
      const native = Array.prototype.fill;
      const nativeResult = native.call([1, 2, 3, 4, 5], 0, 1, 4);
      const specResult = arrayFill.call([1, 2, 3, 4, 5], 0, 1, 4);
      expect(specResult).toEqual(nativeResult);
    });
  });
});
