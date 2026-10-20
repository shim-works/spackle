import { describe, expect, it } from 'vitest';
import { install as installArrayIterator, arrayEntries, arrayKeys, arrayValues } from '../src/modules/es.array.iterator.js';
import { stringIterator } from '../src/modules/es.string.iterator.js';
import { stringMatchAll } from '../src/modules/es.string.match-all.js';
import { typedArrayValues } from '../src/modules/_typed-array-impl.js';
import { domCollectionValues } from '../src/modules/web.dom-collections.iterator.js';
import { install as installIteratorImpl } from '../src/modules/_iterator-impl.js';

/**
 * The iterator-helper reach: every iterator has to inherit from
 * %IteratorPrototype%, which is where map/filter/take live.
 *
 * Node has none of the engines this matters on, so they are faked. Breaking the
 * real %ArrayIteratorPrototype% chain for the length of a test is the honest
 * reproduction of Chrome 38, which simply has no %IteratorPrototype% at all.
 */

// The prototype a factory gives its iterators, which is what the splice pass
// re-points. An object literal per call would have only Object.prototype here,
// and Object.prototype must never be re-parented.
const sharesOnePrototype = (make: () => any): any => {
  const first = make();
  const second = make();
  const proto = Object.getPrototypeOf(first);

  expect(Object.getPrototypeOf(second)).toBe(proto);
  expect(proto).not.toBe(Object.prototype);
  // next lives on the prototype, not on each instance
  expect(Object.prototype.hasOwnProperty.call(proto, 'next')).toBe(true);
  expect(Object.prototype.hasOwnProperty.call(first, 'next')).toBe(false);
  return proto;
};

// %ArrayIteratorPrototype% — ONE level up from the iterator. Its parent is
// %IteratorPrototype%, and that parent link is what the splice repairs.
const arrayIteratorPrototype = (): any =>
  Object.getPrototypeOf(([] as any)[Symbol.iterator]());

describe('shim iterators share one prototype', () => {
  it('array keys / values / entries — all three, and the same one', () => {
    const proto = sharesOnePrototype(() => arrayValues.call([1, 2]));
    expect(Object.getPrototypeOf(arrayKeys.call([1, 2]))).toBe(proto);
    expect(Object.getPrototypeOf(arrayEntries.call([1, 2]))).toBe(proto);
  });

  it('string', () => {
    sharesOnePrototype(() => stringIterator.call('ab'));
  });

  it('typed array', () => {
    sharesOnePrototype(() => typedArrayValues.call(new Uint8Array([1, 2])));
  });

  it('DOM collection', () => {
    const collection: any = { length: 1, 0: 'x' };
    sharesOnePrototype(() => domCollectionValues.call(collection));
  });

  it('matchAll', () => {
    sharesOnePrototype(() => stringMatchAll.call('aa', /a/g));
  });

  it('still iterate correctly with state in instance fields', () => {
    expect(Array.prototype.slice.call({ length: 0 })).toEqual([]);
    const it = arrayEntries.call(['a', 'b']);
    expect(it.next()).toEqual({ value: [0, 'a'], done: false });
    expect(it.next()).toEqual({ value: [1, 'b'], done: false });
    expect(it.next()).toEqual({ value: undefined, done: true });
    // exhausted stays exhausted, and the source is released
    expect(it.next()).toEqual({ value: undefined, done: true });
    expect(it._object).toBe(null);

    const chars = stringIterator.call('a\u{1F600}b');
    expect(chars.next().value).toBe('a');
    expect(chars.next().value).toBe('\u{1F600}');
    expect(chars.next().value).toBe('b');
    expect(chars.next().done).toBe(true);
  });
});

describe('the splice pass', () => {
  it('re-points a one-link-short chain at %IteratorPrototype%', () => {
    const arrayIterProto = arrayIteratorPrototype();
    const iteratorProto = Object.getPrototypeOf(arrayIterProto);

    // Chrome 38 in one line: no %IteratorPrototype% above the array iterator.
    Object.setPrototypeOf(arrayIterProto, Object.prototype);
    try {
      expect(([] as any)[Symbol.iterator]().map).toBeUndefined();

      installIteratorImpl();

      expect(Object.getPrototypeOf(arrayIterProto)).toBe(iteratorProto);
      expect(typeof ([] as any)[Symbol.iterator]().map).toBe('function');
    } finally {
      Object.setPrototypeOf(arrayIterProto, iteratorProto);
    }
  });

  it('reaches spackle\'s own shim iterators — the Chrome 45-65 case', () => {
    // Chrome 45-65 has a real %IteratorPrototype%, but Array.prototype.values
    // landed in Chrome 66, so values() is spackle's and inherits nothing.
    const native = Array.prototype.values;
    delete (Array.prototype as any).values;
    try {
      installArrayIterator();
      expect((Array.prototype.values as any).__polyfilled).toBe(true);

      installIteratorImpl();

      const iterator: any = ([1, 2] as any).values();
      expect(typeof iterator.map).toBe('function');
      expect(iterator.map((value: number) => value * 2).toArray()).toEqual([2, 4]);
    } finally {
      Object.defineProperty(Array.prototype, 'values', {
        value: native,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  });

  it('never re-parents Object.prototype', () => {
    const objectProtoParent = Object.getPrototypeOf(Object.prototype);

    installIteratorImpl();

    expect(Object.getPrototypeOf(Object.prototype)).toBe(objectProtoParent);
    expect((Object.prototype as any).map).toBeUndefined();
    expect((Object.prototype as any).filter).toBeUndefined();
    expect((Object.prototype as any).toArray).toBeUndefined();
    expect(({} as any).map).toBeUndefined();
  });
});

// The synthesis path — where the engine has no %IteratorPrototype% at all —
// needs the module re-evaluated with the chain already broken, so it lives in
// iterator-prototype-synthesis.test.ts, which the browser bundle skips.
