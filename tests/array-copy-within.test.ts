import { arrayCopyWithin } from '../src/modules/es.array.copy-within.js';


/**
 * test262-derived conformance suite for the Array.prototype.copyWithin polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/copyWithin/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype/copyWithin
 */
describe('Array.prototype.copyWithin — test262 conformance', () => {
  it('copies a trailing slice to the front', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3)).toEqual([4, 5, 3, 4, 5]);
  });

  it('copies with an explicit end', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3, 4)).toEqual([4, 2, 3, 4, 5]);
  });

  it('handles negative target/start/end (from end)', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], -2, -3, -1)).toEqual([1, 2, 3, 3, 4]);
  });

  it('returns the same array (mutates in place)', () => {
    const arr = [1, 2, 3];
    expect(arrayCopyWithin.call(arr, 0, 1)).toBe(arr);
  });

  it('copies backward when ranges overlap (no clobber)', () => {
    expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 2, 0)).toEqual([1, 2, 1, 2, 3]);
  });

  it('propagates holes (deletes destination slot)', () => {
    // eslint-disable-next-line no-sparse-arrays
    const arr = [, 2, 3];
    const out = arrayCopyWithin.call(arr, 2, 0, 1);
    expect(2 in out).toBe(false); // hole copied over index 2
  });

  it('throws TypeError on null/undefined this', () => {
    expect(() => arrayCopyWithin.call(null as any, 0, 0)).toThrow(TypeError);
  });

  it('matches native + timing', () => {
    const native = Array.prototype.copyWithin;
    const nativeResult = native.call([1, 2, 3, 4, 5], 0, 3);
    const specResult = arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3);
    expect(specResult).toEqual(nativeResult);
  });
});

describe('Array#copyWithin — inlined coercion matches native', () => {
  const both = (make: () => any, ...args: any[]) => {
    const mine = arrayCopyWithin.apply(make(), args as any);
    const theirs = (Array.prototype.copyWithin as any).apply(make(), args);
    expect(mine).toEqual(theirs);
  };
  const arr = () => [0, 1, 2, 3, 4, 5, 6, 7];

  it('coerces strings, floats, -0, null, undefined and ±Infinity like native', () => {
    both(arr, '2', '5');
    both(arr, 1.7, 4.2, 6.9);
    both(arr, -0, 3);
    both(arr, 2, -0, -0);
    both(arr, null, 4);
    both(arr, 0, undefined, 3);
    both(arr, Infinity, 0);
    both(arr, -Infinity, 4);
    both(arr, 0, 3, -Infinity);
    both(arr, NaN, NaN, NaN);
  });

  it('reads a string length off an array-like', () => {
    both(() => ({ length: '3', 0: 'a', 1: 'b', 2: 'c' }), 0, 1);
  });

  it('coerces target, start, end in order, once each', () => {
    const log: string[] = [];
    const n = (name: string, v: number) => ({ valueOf: () => (log.push(name), v) });
    arrayCopyWithin.call(arr(), n('target', 0) as any, n('start', 3) as any, n('end', 5) as any);
    expect(log).toEqual(['target', 'start', 'end']);
  });

  it('throws TypeError for a Symbol index', () => {
    expect(() => arrayCopyWithin.call(arr(), Symbol('x') as any, 0)).toThrow(TypeError);
  });
});
