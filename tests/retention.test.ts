import { Map as MapPolyfill } from '../src/modules/es.map.js';
import { Set as SetPolyfill } from '../src/modules/es.set.js';

/**
 * Object-graph retention checks.
 *
 * These polyfills run for the lifetime of a page on engines with weak
 * collectors, so an object holding a reference it no longer needs is a real
 * leak rather than a style nit. See DESIGN.md for the principle and the
 * remaining known offenders.
 *
 * What's asserted here is the observable proxy for "the collection is
 * releasable": a done iterator must not still point at it. We can't force a GC
 * from the test, so the reference itself is the thing checked.
 */
describe('retention', () => {
  describe('Map iterator releases its collection when exhausted', () => {
    it('drops _self once done', () => {
      const map = new (MapPolyfill as any)();
      map.set('a', 1);
      map.set('b', 2);

      const it = map.entries();
      expect(it._self).toBe(map);

      expect(it.next().done).toBe(false);
      expect(it.next().done).toBe(false);
      // still holding it right up until the terminal step
      expect(it._self).toBe(map);

      expect(it.next().done).toBe(true);
      expect(it._self).toBe(null);
    });

    it('an empty Map releases on the very first next()', () => {
      const map = new (MapPolyfill as any)();
      const it = map.keys();
      expect(it.next().done).toBe(true);
      expect(it._self).toBe(null);
    });

    it('stays done and does not throw when next() is called again', () => {
      const map = new (MapPolyfill as any)();
      map.set('a', 1);
      const it = map.values();
      it.next();
      expect(it.next()).toEqual({ value: undefined, done: true });
      // the guard matters: _self is null now, so re-reading it would throw
      expect(it.next()).toEqual({ value: undefined, done: true });
      expect(it._self).toBe(null);
    });
  });

  describe('Set iterator releases its collection when exhausted', () => {
    it('drops _self once done', () => {
      const set = new (SetPolyfill as any)();
      set.add('a');
      set.add('b');

      const it = set.values();
      expect(it._self).toBe(set);

      expect(it.next().done).toBe(false);
      expect(it.next().done).toBe(false);
      expect(it.next().done).toBe(true);
      expect(it._self).toBe(null);
    });

    it('stays done and does not throw when next() is called again', () => {
      const set = new (SetPolyfill as any)();
      set.add('a');
      const it = set.entries();
      it.next();
      expect(it.next()).toEqual({ value: undefined, done: true });
      expect(it.next()).toEqual({ value: undefined, done: true });
      expect(it._self).toBe(null);
    });
  });

  describe('iteration still works end to end after the release change', () => {
    it('for-of style manual drain yields every Map entry', () => {
      const map = new (MapPolyfill as any)();
      map.set('a', 1);
      map.set('b', 2);
      map.set('c', 3);

      const seen: any[] = [];
      const it = map.entries();
      let step = it.next();
      while (!step.done) {
        seen.push(step.value);
        step = it.next();
      }
      expect(seen).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('two independent iterators over one Set do not interfere', () => {
      const set = new (SetPolyfill as any)();
      set.add(1);
      set.add(2);

      const first = set.values();
      const second = set.values();

      expect(first.next().value).toBe(1);
      expect(second.next().value).toBe(1);
      first.next();
      expect(first.next().done).toBe(true);
      expect(first._self).toBe(null);
      // exhausting one must not release the other's reference
      expect(second._self).toBe(set);
      expect(second.next().value).toBe(2);
    });
  });
});
