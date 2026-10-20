import { install as installFlat, isSupported as flatSupported } from '../src/modules/es.array.unscopables.flat.js';
import { install as installFlatMap, isSupported as flatMapSupported } from '../src/modules/es.array.unscopables.flat-map.js';

/**
 * test262-derived conformance suite for the Array @@unscopables islands.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/Array/prototype/Symbol.unscopables/
 *
 * `with (array) { flat }` must reach the outer binding, not
 * Array.prototype.flat. That only works if `flat` is listed as true on
 * Array.prototype[@@unscopables]. The methods themselves are covered by
 * array-flat.test.ts / array-flat-map.test.ts; this is only the table.
 *
 * The spec requires the table to be a null-prototype object, so a stray
 * Object.prototype key cannot accidentally read as unscopable — asserted
 * below, because `Object.create(null)` vs `{}` is invisible until someone
 * adds a property named after an Array method to Object.prototype.
 *
 * Both islands no-op without a Symbol to key off, and report supported in
 * that case rather than failing.
 */
describe('Array.prototype[@@unscopables] — test262 conformance', () => {
  const table = (): any => (Array.prototype as any)[Symbol.unscopables];

  it('lists flat as unscopable', () => {
    installFlat();
    expect(table().flat).toBe(true);
    expect(flatSupported()).toBe(true);
  });

  it('lists flatMap as unscopable', () => {
    installFlatMap();
    expect(table().flatMap).toBe(true);
    expect(flatMapSupported()).toBe(true);
  });

  it('shares one table between the two islands', () => {
    installFlat();
    installFlatMap();
    // both entries on the SAME object -- installing the second must not
    // replace the table and drop the first
    expect(table().flat).toBe(true);
    expect(table().flatMap).toBe(true);
  });

  it('is a null-prototype object', () => {
    installFlat();
    expect(Object.getPrototypeOf(table())).toBe(null);
  });

  it('is configurable and non-enumerable on Array.prototype', () => {
    installFlat();
    const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, Symbol.unscopables)!;
    expect(descriptor).toBeDefined();
    expect(descriptor.enumerable).toBe(false);
    expect(descriptor.configurable).toBe(true);
  });

  /*
   * The behaviour the table exists for. `with` is sloppy-mode only, so this is
   * built through Function rather than written inline -- the test file itself
   * is a module and therefore strict.
   */
  it('makes `with (array) { flat }` reach the outer binding', () => {
    installFlat();
    installFlatMap();
    const probe = Function(
      'arr',
      'var flat = "outer", flatMap = "outerMap";' +
        'with (arr) { return [flat, flatMap]; }',
    );
    expect(probe([1, 2])).toEqual(['outer', 'outerMap']);
  });

  it('install is idempotent', () => {
    installFlat();
    installFlat();
    expect(table().flat).toBe(true);
  });
});
