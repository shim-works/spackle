import { arrayToReversed } from '../src/modules/es.array.to-reversed.js';
import { arrayToSorted } from '../src/modules/es.array.to-sorted.js';
import { arrayToSpliced } from '../src/modules/es.array.to-spliced.js';
import { arrayWith } from '../src/modules/es.array.with.js';


/**
 * test262-derived conformance suite for the ES2023 "change Array by copy"
 * methods: Array.prototype.toReversed / toSorted / toSpliced / with.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/{toReversed,toSorted,toSpliced,with}/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype
 *
 * Each method returns a new dense array and must leave the receiver untouched;
 * the non-mutation invariant is asserted alongside native parity.
 */

// The methods are designed as prototype methods (use `this`); call via .call so
// they can be tested without installing onto Array.prototype.
const toReversed = <T>(arr: T[]): T[] => (arrayToReversed as any).call(arr);
const toSorted = <T>(arr: T[], cmp?: (a: T, b: T) => number): T[] =>
  (arrayToSorted as any).call(arr, cmp);
const toSpliced = <T>(arr: T[], ...args: any[]): T[] =>
  (arrayToSpliced as any).apply(arr, args);
const withAt = <T>(arr: T[], index: number, value: T): T[] =>
  (arrayWith as any).call(arr, index, value);

describe('Array by copy (ES2023) — test262 conformance', () => {
  describe('toReversed', () => {
    it('returns a reversed copy without mutating the original', () => {
      const source = [1, 2, 3, 4];
      const result = toReversed(source);
      expect(result).toEqual([4, 3, 2, 1]);
      expect(source).toEqual([1, 2, 3, 4]);
      expect(result).not.toBe(source);
    });

    it('materializes holes as undefined (dense output)', () => {
      const sparse = [1, , 3] as any[];
      expect(toReversed(sparse)).toEqual([3, undefined, 1]);
    });

    it('matches native', () => {
      const source = ['a', 'b', 'c'];
      expect(toReversed(source)).toEqual((source as any).toReversed());
    });
  });

  describe('toSorted', () => {
    it('returns a sorted copy without mutating the original', () => {
      const source = [3, 1, 2];
      const result = toSorted(source);
      expect(result).toEqual([1, 2, 3]);
      expect(source).toEqual([3, 1, 2]);
    });

    it('honors a comparator', () => {
      expect(toSorted([3, 1, 2], (a, b) => b - a)).toEqual([3, 2, 1]);
    });

    it('default sort is lexicographic, like native', () => {
      const source = [10, 1, 2];
      expect(toSorted(source)).toEqual((source as any).toSorted());
    });

    it('throws TypeError for a non-callable comparator', () => {
      expect(() => toSorted([1, 2], 'nope' as any)).toThrow(TypeError);
    });
  });

  describe('toSpliced', () => {
    it('removes and inserts without mutating the original', () => {
      const source = [1, 2, 3, 4];
      const result = toSpliced(source, 1, 2, 'a', 'b');
      expect(result).toEqual([1, 'a', 'b', 4]);
      expect(source).toEqual([1, 2, 3, 4]);
    });

    it('with one arg removes through the end', () => {
      expect(toSpliced([1, 2, 3, 4], 2)).toEqual([1, 2]);
    });

    it('clamps a negative start', () => {
      const source = [1, 2, 3, 4];
      expect(toSpliced(source, -2, 1, 'x')).toEqual((source as any).toSpliced(-2, 1, 'x'));
    });

    it('no args returns a full copy', () => {
      const source = [1, 2, 3];
      const result = toSpliced(source);
      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(source);
    });
  });

  describe('with', () => {
    it('replaces one index without mutating the original', () => {
      const source = [1, 2, 3];
      const result = withAt(source, 1, 9);
      expect(result).toEqual([1, 9, 3]);
      expect(source).toEqual([1, 2, 3]);
    });

    it('accepts a negative index from the end', () => {
      expect(withAt([1, 2, 3], -1, 9)).toEqual([1, 2, 9]);
    });

    it('throws RangeError out of range', () => {
      expect(() => withAt([1, 2, 3], 5, 0)).toThrow(RangeError);
      expect(() => withAt([1, 2, 3], -5, 0)).toThrow(RangeError);
    });

    it('matches native', () => {
      const source = [1, 2, 3];
      expect(withAt(source, 0, 7)).toEqual((source as any).with(0, 7));
    });
  });
});
