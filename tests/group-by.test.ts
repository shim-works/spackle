import { mapGroupBy } from '../src/modules/es.map.group-by.js';
import { objectGroupBy } from '../src/modules/es.object.group-by.js';

/**
 * test262-derived conformance suite for the Object.groupBy / Map.groupBy
 * polyfills.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Object/groupBy/ and
 * test/built-ins/Map/groupBy/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Object/groupBy
 */
describe('Object.groupBy / Map.groupBy — test262 conformance', () => {
  const items = [1, 2, 3, 4, 5];
  const parity = (n: number) => (n % 2 === 0 ? 'even' : 'odd');

  describe('Object.groupBy', () => {
    it('groups by the callback key', () => {
      const grouped = objectGroupBy(items, parity);
      expect(grouped.odd).toEqual([1, 3, 5]);
      expect(grouped.even).toEqual([2, 4]);
    });

    it('returns a null-prototype object', () => {
      const grouped = objectGroupBy([1], () => 'k');
      expect(Object.getPrototypeOf(grouped)).toBe(null);
    });

    it('passes (value, index) to the callback', () => {
      const seen: any[] = [];
      objectGroupBy(['a', 'b'], (v: any, i: number) => {
        seen.push([v, i]);
        return 'k';
      });
      expect(seen).toEqual([
        ['a', 0],
        ['b', 1],
      ]);
    });

    it('coerces keys to property keys', () => {
      const grouped = objectGroupBy([1, 2], (n: number) => n);
      expect(grouped['1']).toEqual([1]);
      expect(grouped['2']).toEqual([2]);
    });

    it('drains arbitrary iterables (Set input)', () => {
      const grouped = objectGroupBy(new Set([1, 2]), parity);
      expect(grouped.odd).toEqual([1]);
      expect(grouped.even).toEqual([2]);
    });

    it('throws TypeError on non-iterable items or non-callable callback', () => {
      expect(() => objectGroupBy(null as any, parity)).toThrow(TypeError);
      expect(() => objectGroupBy([1], 'nope' as any)).toThrow(TypeError);
    });

    it('matches native', () => {
      const native = (Object as any).groupBy;
      if (typeof native !== 'function') return;
      expect(objectGroupBy(items, parity)).toEqual(native(items, parity));
    });
  });

  describe('Map.groupBy', () => {
    it('groups into a Map keyed by the raw callback value', () => {
      const grouped = mapGroupBy(items, parity);
      expect(grouped instanceof Map).toBe(true);
      expect(grouped.get('odd')).toEqual([1, 3, 5]);
      expect(grouped.get('even')).toEqual([2, 4]);
    });

    it('keeps object keys by identity (no ToPropertyKey coercion)', () => {
      const keyObj = {};
      const grouped = mapGroupBy([1, 2], () => keyObj);
      expect(grouped.get(keyObj)).toEqual([1, 2]);
      expect(grouped.size).toBe(1);
    });

    it('normalizes -0 keys to +0 (SameValueZero)', () => {
      const grouped = mapGroupBy([1], () => -0);
      expect(grouped.get(0)).toEqual([1]);
    });

    it('throws TypeError on non-iterable items or non-callable callback', () => {
      expect(() => mapGroupBy(undefined as any, parity)).toThrow(TypeError);
      expect(() => mapGroupBy([1], 42 as any)).toThrow(TypeError);
    });

    it('matches native', () => {
      const native = (Map as any).groupBy;
      if (typeof native !== 'function') return;
      const ours = mapGroupBy(items, parity);
      const theirs = native(items, parity);
      expect(ours.get('odd')).toEqual(theirs.get('odd'));
      expect(ours.get('even')).toEqual(theirs.get('even'));
    });
  });
});
