import { arrayIndexOf } from '../src/modules/es.array.index-of.js';
import { arrayLastIndexOf } from '../src/modules/es.array.last-index-of.js';
import { arrayReduce } from '../src/modules/es.array.reduce.js';
import { arrayReduceRight } from '../src/modules/es.array.reduce-right.js';


/**
 * test262-derived conformance suite for the plain-ES5 Array method islands.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/{reduce,reduceRight,indexOf,lastIndexOf}/
 *
 * ES5 — universal in range; the islands exist for core-js parity (the babel
 * intercept ships them), so the gates should never fire on the floor.
 */
describe('Array ES5 methods — test262 conformance', () => {
  describe('arrayReduce', () => {
    it('reduces left to right with an initial value', () => {
      expect(arrayReduce.call([1, 2, 3], (acc: number, v: number) => acc + v, 10)).toBe(16);
    });

    it('uses the first element as the seed when no initial value', () => {
      const seen: number[] = [];
      const out = arrayReduce.call([1, 2, 3], (acc: number, v: number, i: number) => {
        seen.push(i);
        return acc + v;
      });
      expect(out).toBe(6);
      expect(seen).toEqual([1, 2]);
    });

    it('skips holes, including when seeding', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(arrayReduce.call([, 2, , 4], (acc: number, v: number) => acc + v)).toBe(6);
    });

    it('throws TypeError on an empty array with no initial value', () => {
      expect(() => arrayReduce.call([], (acc: any) => acc)).toThrow(TypeError);
    });

    it('accepts undefined as an explicit initial value', () => {
      expect(arrayReduce.call([], (acc: any) => acc, undefined)).toBeUndefined();
    });

    it('throws on a non-callable callback', () => {
      expect(() => arrayReduce.call([1], 'nope' as any)).toThrow(TypeError);
    });

    it('matches native', () => {
      const source = [3, 1, 4, 1, 5];
      const reducer = (acc: number, v: number) => acc * 2 + v;
      expect(arrayReduce.call(source, reducer, 0)).toBe(source.reduce(reducer, 0));
      expect(arrayReduce.call(source, reducer)).toBe(source.reduce(reducer));
    });
  });

  describe('arrayReduceRight', () => {
    it('reduces right to left', () => {
      expect(arrayReduceRight.call(['a', 'b', 'c'], (acc: string, v: string) => acc + v)).toBe(
        'cba'
      );
    });

    it('throws TypeError on an empty array with no initial value', () => {
      expect(() => arrayReduceRight.call([], (acc: any) => acc)).toThrow(TypeError);
    });

    it('skips holes when seeding from the right', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(arrayReduceRight.call([1, , 3, , ], (acc: number, v: number) => acc + v)).toBe(4);
    });

    it('matches native', () => {
      const source = [3, 1, 4];
      const reducer = (acc: number, v: number) => acc * 2 + v;
      expect(arrayReduceRight.call(source, reducer, 0)).toBe(source.reduceRight(reducer, 0));
    });
  });

  describe('arrayIndexOf', () => {
    it('finds by strict equality', () => {
      expect(arrayIndexOf.call([1, '1', 2], '1')).toBe(1);
    });

    it('returns -1 for NaN (strict equality never matches)', () => {
      expect(arrayIndexOf.call([NaN], NaN)).toBe(-1);
    });

    it('honors a positive and negative fromIndex', () => {
      expect(arrayIndexOf.call([1, 2, 1], 1, 1)).toBe(2);
      expect(arrayIndexOf.call([1, 2, 1], 1, -1)).toBe(2);
    });

    it('returns -1 when fromIndex is past the end', () => {
      expect(arrayIndexOf.call([1, 2], 1, 5)).toBe(-1);
    });

    it('skips holes', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(arrayIndexOf.call([, undefined], undefined)).toBe(1);
    });

    it('matches native across fromIndex combos', () => {
      const source = [1, 2, 3, 2, 1];
      const combos: [any, any][] = [
        [2, undefined],
        [2, 2],
        [1, -2],
        [9, undefined],
        [1, 2.9],
      ];
      for (const [search, from] of combos) {
        expect(arrayIndexOf.call(source, search, from)).toBe(source.indexOf(search, from));
      }
    });
  });

  describe('arrayLastIndexOf', () => {
    it('finds the last match', () => {
      expect(arrayLastIndexOf.call([1, 2, 1], 1)).toBe(2);
    });

    it('honors a positive and negative fromIndex', () => {
      expect(arrayLastIndexOf.call([1, 2, 1], 1, 1)).toBe(0);
      expect(arrayLastIndexOf.call([1, 2, 1], 1, -2)).toBe(0);
    });

    it('returns -1 when the backwards search finds nothing', () => {
      expect(arrayLastIndexOf.call([1, 2], 3)).toBe(-1);
      expect(arrayLastIndexOf.call([1, 2], 2, -5)).toBe(-1);
    });

    it('matches native across fromIndex combos', () => {
      const source = [1, 2, 3, 2, 1];
      const combos: [any, any][] = [
        [2, undefined],
        [2, 2],
        [1, -2],
        [9, undefined],
        [2, 2.9],
      ];
      for (const [search, from] of combos) {
        const mine =
          from === undefined
            ? arrayLastIndexOf.call(source, search)
            : (arrayLastIndexOf as any).call(source, search, from);
        const theirs =
          from === undefined
            ? source.lastIndexOf(search)
            : source.lastIndexOf(search, from);
        expect(mine).toBe(theirs);
      }
    });
  });
});
