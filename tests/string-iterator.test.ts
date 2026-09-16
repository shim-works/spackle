import { stringIterator } from '../src/modules/es.string.iterator.js';


/**
 * test262-derived conformance suite for the String.prototype[Symbol.iterator]
 * polyfill.
 *
 * Cases hand-ported from tc39/test262 —
 * test/built-ins/String/prototype/Symbol.iterator/
 * https://github.com/tc39/test262/tree/main/test/built-ins/String/prototype/Symbol.iterator
 *
 * ES2015 (Chrome 38 / Safari 9) — Safari 7/8 on the floor lack Symbol entirely,
 * so this installs alongside the Symbol island there.
 *
 *   - yields one code point at a time, keeping surrogate pairs together
 *   - a lone surrogate yields as a single unit
 *   - done: true with value undefined at the end, and stays done
 *   - the iterator is itself iterable (Symbol.iterator returns itself)
 *   - throws TypeError on null/undefined this
 */
describe('String.prototype[Symbol.iterator] — test262 conformance', () => {
  const drain = (s: string): string[] => {
    const iterator = stringIterator.call(s);
    const out: string[] = [];
    let step = iterator.next();
    while (!step.done) {
      out.push(step.value);
      step = iterator.next();
    }
    return out;
  };

  describe('basic', () => {
    it('yields BMP characters one by one', () => {
      expect(drain('abc')).toEqual(['a', 'b', 'c']);
    });

    it('yields nothing for the empty string', () => {
      expect(drain('')).toEqual([]);
    });

    it('coerces a non-string this via ToString', () => {
      expect(drain(123 as any)).toEqual(['1', '2', '3']);
    });
  });

  describe('surrogate pairs', () => {
    it('keeps an emoji (U+1F600) together', () => {
      expect(drain('a😀b')).toEqual(['a', '😀', 'b']);
    });

    it('keeps consecutive astral code points apart from each other', () => {
      expect(drain('😀😁')).toEqual(['😀', '😁']);
    });

    it('yields a lone lead surrogate as a single unit', () => {
      expect(drain('a\uD83Db')).toEqual(['a', '\uD83D', 'b']);
    });

    it('yields a lone trail surrogate as a single unit', () => {
      expect(drain('a\uDE00b')).toEqual(['a', '\uDE00', 'b']);
    });

    it('yields a trailing lead surrogate at end of string as itself', () => {
      expect(drain('ab\uD83D')).toEqual(['a', 'b', '\uD83D']);
    });
  });

  describe('protocol', () => {
    it('is done with value undefined at the end, and stays done', () => {
      const iterator = stringIterator.call('x');
      expect(iterator.next()).toEqual({ value: 'x', done: false });
      expect(iterator.next()).toEqual({ value: undefined, done: true });
      expect(iterator.next()).toEqual({ value: undefined, done: true });
    });

    it('is itself iterable', () => {
      const iterator = stringIterator.call('hi');
      expect(iterator[Symbol.iterator]()).toBe(iterator);
    });

    it('throws TypeError on null/undefined this', () => {
      expect(() => stringIterator.call(null)).toThrow(TypeError);
      expect(() => stringIterator.call(undefined)).toThrow(TypeError);
    });
  });

  describe('parity vs native', () => {
    it('matches native iteration order and chunking', () => {
      const input = 'x😀\uD83Dy';
      const native: string[] = [];
      const nativeIterator = (input as any)[Symbol.iterator]();
      let step = nativeIterator.next();
      while (!step.done) {
        native.push(step.value);
        step = nativeIterator.next();
      }
      const polyfilled = drain(input);
      expect(polyfilled).toEqual(native);
    });
  });
});
