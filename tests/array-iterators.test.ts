import { arrayEntries, arrayKeys, arrayValues, install as installArrayIterator } from '../src/modules/es.array.iterator.js';

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

// Chrome 41 shape: native @@iterator, keys and entries, but no values.
describe('install() over a native @@iterator with no values (core-js iterator-define)', () => {
  const AP: any = Array.prototype;
  const ITER = Symbol.iterator;
  const TAG = Symbol.toStringTag;
  const nativeIter = AP[ITER];
  const nativeProto = Object.getPrototypeOf([][ITER]());
  let saved: { values: PropertyDescriptor; iter: PropertyDescriptor; tag: PropertyDescriptor | undefined };

  beforeEach(() => {
    saved = {
      values: Object.getOwnPropertyDescriptor(AP, 'values')!,
      iter: Object.getOwnPropertyDescriptor(AP, ITER)!,
      tag: Object.getOwnPropertyDescriptor(nativeProto, TAG),
    };
  });
  afterEach(() => {
    Object.defineProperty(AP, 'values', saved.values);
    Object.defineProperty(AP, ITER, saved.iter);
    if (saved.tag) Object.defineProperty(nativeProto, TAG, saved.tag);
  });

  it('uses the native @@iterator as values when it is already named values', () => {
    delete AP.values;
    installArrayIterator();
    expect(AP.values).toBe(nativeIter);
    expect(AP[ITER]).toBe(AP.values);
  });

  it('wraps a misnamed native @@iterator, so values and @@iterator are one function on the native prototype', () => {
    delete AP.values;
    Object.defineProperty(AP, ITER, { value: function notValues(this: any) { return nativeIter.call(this); }, writable: true, configurable: true });
    installArrayIterator();
    expect(AP.values.name).toBe('values');
    expect(AP[ITER]).toBe(AP.values);
    expect(Object.getPrototypeOf(AP.values.call([1]))).toBe(nativeProto);
    expect(Object.getPrototypeOf(AP.values.call({ length: 2 }))).toBe(nativeProto);
  });

  it('tags the native %ArrayIteratorPrototype% when the engine left it untagged', () => {
    delete nativeProto[TAG];
    installArrayIterator();
    const d = Object.getOwnPropertyDescriptor(nativeProto, TAG)!;
    expect(d.value).toBe('Array Iterator');
    expect([d.writable, d.enumerable, d.configurable]).toEqual([false, false, true]);
  });
});
