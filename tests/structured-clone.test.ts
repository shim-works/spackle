import { structuredClone as structuredClonePolyfill } from '../src/modules/web.structured-clone.js';

/**
 * Conformance suite for the structuredClone polyfill (delegates to
 * @ungap/structured-clone).
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
});
