import { arrayEntries, arrayKeys, arrayValues } from '../src/modules/es.array.iterator.js';

/**
 * test262-derived conformance suite for the Array.prototype.keys / values /
 * entries polyfills.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/Array/prototype/{keys,values,entries}/
 * https://github.com/tc39/test262/tree/main/test/built-ins/Array/prototype
 *
 * Note: these iterators capture length once at call time (the TV runtime never
 * mutates a collection mid-iteration); native array iterators re-read length on
 * each step. Documented deviation, out of scope for the runtime.
 */
const drain = (it: any): any[] => {
  const out: any[] = [];
  let step = it.next();
  while (!step.done) {
    out.push(step.value);
    step = it.next();
  }
  return out;
};

describe('Array.prototype.keys/values/entries — test262 conformance', () => {
  it('keys() yields indices', () => {
    expect(drain(arrayKeys.call(['a', 'b', 'c']))).toEqual([0, 1, 2]);
  });

  it('values() yields elements', () => {
    expect(drain(arrayValues.call(['a', 'b', 'c']))).toEqual(['a', 'b', 'c']);
  });

  it('entries() yields [index, element] pairs', () => {
    expect(drain(arrayEntries.call(['a', 'b']))).toEqual([
      [0, 'a'],
      [1, 'b'],
    ]);
  });

  it('reports done after exhaustion', () => {
    const it = arrayKeys.call([1]);
    expect(it.next()).toEqual({ value: 0, done: false });
    expect(it.next()).toEqual({ value: undefined, done: true });
    expect(it.next()).toEqual({ value: undefined, done: true });
  });

  it('values() visits holes as undefined', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(drain(arrayValues.call([1, , 3]))).toEqual([1, undefined, 3]);
  });

  it('is self-iterable via Symbol.iterator', () => {
    const it = arrayValues.call(['x', 'y']);
    expect(typeof it[Symbol.iterator]).toBe('function');
    expect(it[Symbol.iterator]()).toBe(it);
    // for..of consumes it
    expect(Array.from(it)).toEqual(['x', 'y']);
  });

  it('works on array-likes via .call', () => {
    expect(drain(arrayValues.call({ 0: 'a', 1: 'b', length: 2 } as any))).toEqual([
      'a',
      'b',
    ]);
  });
});
