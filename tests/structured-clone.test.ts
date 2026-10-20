import { structuredClone as structuredClonePolyfill } from '../src/modules/web.structured-clone.js';

/**
 * Conformance suite for the structuredClone polyfill.
 *
 * WPT reference — html/infrastructure/safe-passing-of-structured-data/
 * https://github.com/web-platform-tests/wpt/tree/master/html/infrastructure/safe-passing-of-structured-data
 */
describe('structuredClone — polyfill', () => {
  it('deep-clones nested objects (new references)', () => {
    const source = { a: 1, nested: { b: 2 } };
    const copy = structuredClonePolyfill(source);
    expect(copy).toEqual(source);
    expect(copy).not.toBe(source);
    expect(copy.nested).not.toBe(source.nested);
  });

  it('clones arrays', () => {
    const source = [1, [2, 3], { x: 4 }];
    const copy = structuredClonePolyfill(source);
    expect(copy).toEqual(source);
    expect(copy[1]).not.toBe(source[1]);
  });

  it('preserves Date, RegExp, Map, Set types', () => {
    const source = {
      d: new Date(1000),
      r: /abc/gi,
      m: new Map([['k', 'v']]),
      s: new Set([1, 2]),
    };
    const copy = structuredClonePolyfill(source);
    expect(copy.d).toBeInstanceOf(Date);
    expect(copy.d.getTime()).toBe(1000);
    expect(copy.r).toBeInstanceOf(RegExp);
    expect(copy.r.source).toBe('abc');
    expect(copy.m).toBeInstanceOf(Map);
    expect(copy.m.get('k')).toBe('v');
    expect(copy.s).toBeInstanceOf(Set);
    expect(copy.s.has(2)).toBe(true);
  });

  it('handles circular references', () => {
    const source: any = { name: 'loop' };
    source.self = source;
    const copy = structuredClonePolyfill(source);
    expect(copy.name).toBe('loop');
    expect(copy.self).toBe(copy); // cycle rewired to the clone, not the original
  });

  it('clones typed arrays', () => {
    const source = new Uint8Array([1, 2, 3]);
    const copy = structuredClonePolyfill(source);
    expect(Array.from(copy)).toEqual([1, 2, 3]);
    expect(copy).not.toBe(source);
  });

  describe('parity vs native', () => {

    it('matches native deep-cloning a JSON-safe object', () => {
      const source = { a: 1, nested: { b: 2, c: [3, 4] } };
      const nativeResult = structuredClone(source);
      const specResult = structuredClonePolyfill(source);
      expect(specResult).toEqual(nativeResult);
    });
  });

  // Map and Set cloning must not depend on native @@toStringTag support.
  describe('collections on legacy engines', () => {
    it('a Map survives as a Map, with its contents', () => {
      const copy = structuredClonePolyfill({ map: new Map([['k', 'v']]) });
      expect(copy.map instanceof Map).toBe(true);
      expect(copy.map.get('k')).toBe('v');
    });

    it('a Set survives as a Set', () => {
      const copy = structuredClonePolyfill({ set: new Set(['s']) });
      expect(copy.set instanceof Set).toBe(true);
      expect(copy.set.has('s')).toBe(true);
    });

    it('Date and RegExp still come through untouched', () => {
      const copy = structuredClonePolyfill({ when: new Date(0), re: /x/g, map: new Map() });
      expect(copy.when instanceof Date).toBe(true);
      expect(copy.when.getTime()).toBe(0);
      expect(copy.re instanceof RegExp).toBe(true);
      expect(copy.re.source).toBe('x');
    });

    it('clones collections nested inside collections', () => {
      const inner = new Map([['deep', 1]]);
      const copy = structuredClonePolyfill({ outer: new Map([['inner', inner]]) });
      const got = copy.outer.get('inner');
      expect(got instanceof Map).toBe(true);
      expect(got.get('deep')).toBe(1);
      expect(got).not.toBe(inner);
    });

    it('clones a Map used as a top-level value', () => {
      const copy = structuredClonePolyfill(new Map([['k', 'v']]));
      expect(copy instanceof Map).toBe(true);
      expect(copy.get('k')).toBe('v');
    });

    it('keeps cycles finite and preserves shared references', () => {
      const cyclic: any = { name: 'root' };
      cyclic.self = cyclic;
      cyclic.map = new Map([['back', cyclic]]);

      const copy = structuredClonePolyfill(cyclic);
      expect(copy.self).toBe(copy);
      expect(copy.map instanceof Map).toBe(true);
      expect(copy.map.get('back')).toBe(copy);
    });

    it('shares one clone between two references to the same Map', () => {
      const shared = new Map([['n', 1]]);
      const copy = structuredClonePolyfill({ a: shared, b: shared });
      expect(copy.a instanceof Map).toBe(true);
      expect(copy.a).toBe(copy.b);
    });

    it('leaves ordinary payloads identical to the plain delegation', () => {
      const source = { a: 1, nested: { b: [2, 3] } };
      expect(structuredClonePolyfill(source)).toEqual(structuredClone(source));
    });
  });

  /*
   * Exercise the public entry point, which uses the same direct clone path.
   */
  describe('the gate', () => {
    it('clones collections through the same direct path', () => {
      const copy = structuredClonePolyfill({ map: new Map([['k', 'v']]) });
      expect(copy.map instanceof Map).toBe(true);
      expect(copy.map.get('k')).toBe('v');
    });
  });
});
