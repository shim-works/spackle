import { arrayMap } from '../src/modules/es.array.map.js';
import { arrayFilter } from '../src/modules/es.array.filter.js';
import { arrayFlat } from '../src/modules/es.array.flat.js';
import { arrayFlatMap } from '../src/modules/es.array.flat-map.js';
import { arrayConcat } from '../src/modules/es.array.concat.js';
import { arraySlice } from '../src/modules/es.array.slice.js';
import { arrayFrom } from '../src/modules/es.array.from.js';
import { arrayOf } from '../src/modules/es.array.of.js';
import { arrayToReversed } from '../src/modules/es.array.to-reversed.js';
import { objectEntries } from '../src/modules/es.object.entries.js';
import { objectValues } from '../src/modules/es.object.values.js';

/**
 * The results are written with a plain assignment when that is the same as
 * CreateDataPropertyOrThrow. With a setter on Array.prototype at the index,
 * it is not: the islands must take the defineProperty path and never run it.
 */
describe('CreateDataPropertyOrThrow guard', () => {
  const cases: Array<[string, () => any[]]> = [
    ['map', () => arrayMap.call(['x'], (v: any) => v)],
    ['filter', () => arrayFilter.call(['x'], () => true)],
    ['flat', () => arrayFlat.call([['x']])],
    ['flatMap', () => arrayFlatMap.call(['x'], (v: any) => [v])],
    ['concat', () => arrayConcat.call(['x'])],
    ['slice', () => arraySlice.call(['x'])],
    ['Array.from', () => arrayFrom.call(Array, ['x'])],
    ['Array.from(iterable)', () => arrayFrom.call(Array, new Set(['x']))],
    ['Array.of', () => arrayOf.call(Array, 'x')],
    ['toReversed', () => arrayToReversed.call(['x'])],
    ['Object.entries', () => objectEntries({ k: 'x' }).map((e: any) => e[1])],
    ['Object.values', () => objectValues({ k: 'x' })],
  ];

  for (const [name, run] of cases) {
    it(`${name}: never runs a setter on Array.prototype[0], and still writes the value`, () => {
      let fired = 0;
      Object.defineProperty(Array.prototype, '0', { set() { fired++; }, get() { return 'proto'; }, configurable: true });
      try {
        const result = run();
        expect(fired).toBe(0);
        expect(Object.getOwnPropertyDescriptor(result, '0')!.value).toBe('x');
      } finally {
        delete (Array.prototype as any)[0];
      }
    });
  }
});
