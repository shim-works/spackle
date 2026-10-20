import { describe, expect, it, vi } from 'vitest';
import { arrayPush } from '../src/modules/es.array.push.js';
import { regexpTest } from '../src/modules/es.regexp.test.js';
import { isSupported as typedArraySupported, isModernSupported } from '../src/modules/_typed-array-impl.js';
import { stringPadStart } from '../src/modules/es.string.pad-start.js';
import { stringPadEnd } from '../src/modules/es.string.pad-end.js';
import { iteratorConcat } from '../src/modules/_iterator-impl.js';
import { mathSumPrecise } from '../src/modules/es.math.sum-precise.js';
import { Map as MapPolyfill } from '../src/modules/es.map.js';
import { Set as SetPolyfill } from '../src/modules/es.set.js';
import { URLSearchParams as USP } from '../src/modules/web.url-search-params.js';
import { NumberPolyfill } from '../src/modules/es.number.constructor.js';
import { structuredClone } from '../src/modules/web.structured-clone.js';
import { wrapErrorConstructor } from '../src/modules/es.error.cause.js';

/**
 * One case per rule break fixed in the GC / rule audit: the polyfill must
 * keep its behaviour while dropping the garbage, the leak or the leaked
 * internals.
 */
describe('rule breaks — GC and look-native fixes', () => {
  it('push: no descriptor per call, still throws on a non-writable length', () => {
    const spy = vi.spyOn(Object, 'getOwnPropertyDescriptor');
    try {
      const a: any[] = [1];
      expect(arrayPush.call(a, 2, 3)).toBe(3);
      expect(a).toEqual([1, 2, 3]);
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
    const locked = Object.defineProperty([], 'length', { writable: false });
    expect(() => arrayPush.call(locked)).toThrow(TypeError);
  });

  it('regexp test: built-in exec skips the match array, a user exec is still honoured', () => {
    // Spying on RegExp.prototype.exec would itself make exec "user-supplied",
    // so the fast path is checked by outcome, including lastIndex on /g.
    expect(regexpTest.call(/b/, 'abc')).toBe(true);
    expect(regexpTest.call(/z/, 'abc')).toBe(false);
    const global = /b/g;
    expect(regexpTest.call(global, 'abcb')).toBe(true);
    expect(global.lastIndex).toBe(2);
    const custom: any = /zzz/;
    custom.exec = () => [];
    expect(regexpTest.call(custom, 'abc')).toBe(true);
  });

  it('sticky emulation: a miss stops at lastIndex, a hit keeps the caller groups', async () => {
    const RealRegExp = globalThis.RegExp;
    const FakeRegExp: any = function (source?: any, flags?: any) {
      if (typeof flags === 'string' && flags.indexOf('y') !== -1) throw new SyntaxError('no y');
      return new RealRegExp(source, flags);
    };
    FakeRegExp.prototype = RealRegExp.prototype;
    (globalThis as any).RegExp = FakeRegExp;
    vi.resetModules();
    try {
      const { RegExpPolyfill, isRegExpStickySupported } = await import('../src/modules/es.regexp.constructor.js');
      expect(isRegExpStickySupported()).toBe(false); // the fake took effect
      const re = new (RegExpPolyfill as any)('(a)(b)?', 'y');
      const hit = re.exec('ab');
      expect(hit.length).toBe(3); // no trailing fallback group
      expect(hit[1]).toBe('a');
      expect(re.lastIndex).toBe(2);

      const miss = new (RegExpPolyfill as any)('a', 'y');
      expect(miss.exec('ba')).toBe(null); // a later 'a' must not count
      expect(miss.lastIndex).toBe(0);
    } finally {
      (globalThis as any).RegExp = RealRegExp;
      vi.resetModules();
    }
  });

  it('typed arrays: a missing at() fails only the modern gate, not the ES2015 suite', () => {
    const proto: any = Uint8Array.prototype;
    const owner = Object.getPrototypeOf(proto);
    const saved = Object.getOwnPropertyDescriptor(owner, 'at');
    delete owner.at;
    try {
      expect(typedArraySupported()).toBe(true);
      expect(isModernSupported()).toBe(false);
    } finally {
      if (saved) Object.defineProperty(owner, 'at', saved);
    }
  });

  it('padStart/padEnd: doubling fill gives the exact result', () => {
    expect(stringPadStart.call('x', 8, 'abc')).toBe('abcabcax');
    expect(stringPadEnd.call('x', 8, 'abc')).toBe('xabcabca');
    expect(stringPadStart.call('x', 10001, 'ab').length).toBe(10001);
  });

  it('Iterator.concat: return() releases everything and stays done', () => {
    const it: any = (iteratorConcat as any)([1, 2], [3]);
    expect(it.next().value).toBe(1);
    it.return();
    expect(it.next().done).toBe(true);
  });

  it('sumPrecise: shared accumulators reset per call, sticky bit still rounds', () => {
    expect(mathSumPrecise([0.1, 0.2])).toBe(0.30000000000000004);
    expect(mathSumPrecise([1e308, 1e308, -1e308])).toBe(1e308);
    // 2^53 + 1 is a tie (ties-to-even -> 2^53); any bit below breaks the tie up
    expect(mathSumPrecise([9007199254740992, 1])).toBe(9007199254740992);
    expect(mathSumPrecise([9007199254740992, 1, Math.pow(2, -60)])).toBe(9007199254740994);
    expect(mathSumPrecise([1, 2])).toBe(3); // nothing left over from the calls above
  });

  it('sumPrecise: re-entry from inside an iterator does not corrupt the outer sum', () => {
    const inner: number[] = [];
    const outer = {
      [Symbol.iterator]() {
        let i = 0;
        return {
          next() {
            inner.push(mathSumPrecise([100, 200]));
            return i < 3 ? { value: ++i, done: false } : { value: undefined, done: true };
          },
        };
      },
    };
    expect(mathSumPrecise(outer as any)).toBe(6);
    expect(inner).toEqual([300, 300, 300, 300]);
  });

  it('Map / Set / URLSearchParams: internals stay out of JSON and Object.keys', () => {
    const m = new (MapPolyfill as any)([[1, 2]]);
    expect(JSON.stringify(m)).toBe('{}');
    expect(Object.keys(m)).toEqual([]);
    expect(Object.keys(new (SetPolyfill as any)([1]))).toEqual([]);
    const p = new (USP as any)('a=1');
    expect(Object.keys(p)).toEqual([]);
    p.delete('a'); // reassigns _pairs internally
    expect(Object.keys(p)).toEqual([]);
  });

  it('Number polyfill: statics keep the native descriptors', () => {
    const d: any = Object.getOwnPropertyDescriptor(NumberPolyfill, 'MAX_VALUE');
    expect(d.enumerable).toBe(false);
    expect(d.writable).toBe(false);
    expect(Object.keys(NumberPolyfill)).toEqual([]);
  });

  it('structuredClone: does not read the global Map at call time', () => {
    const w: any = window;
    const saved = w.Map;
    w.Map = undefined;
    try {
      const a: any = { x: {} };
      a.self = a;
      const copy = structuredClone(a);
      expect(copy.self).toBe(copy);
      expect(copy.x).not.toBe(a.x);
    } finally {
      w.Map = saved;
    }
  });

  it('Error wrapper: statics forward to the native, constructor names the wrapper', () => {
    const Native: any = function (this: any, message?: any) {
      this.message = message;
    };
    Native.prototype = Object.create(Error.prototype);
    Native.stackTraceLimit = 10;
    const Wrapped = wrapErrorConstructor(Native);
    Wrapped.stackTraceLimit = 50;
    expect(Native.stackTraceLimit).toBe(50);
    Native.stackTraceLimit = 7;
    expect(Wrapped.stackTraceLimit).toBe(7);
    expect(new Wrapped('x').constructor).toBe(Wrapped);
  });
});

describe('rule breaks — install-time fixes', () => {
  it('Promise swap strips promise-polyfill any/allSettled so the gates decide', async () => {
    const w: any = window;
    const native = w.Promise;
    vi.resetModules();
    try {
      const { install } = await import('../src/modules/es.promise.js');
      install();
      expect(w.Promise).not.toBe(native);
      expect(w.Promise.any).toBeUndefined();
      expect(w.Promise.allSettled).toBeUndefined();
    } finally {
      w.Promise = native;
      vi.resetModules();
    }
  });

  it('DOMException: keeps a non-constructible native interface and its constants', async () => {
    const w: any = window;
    const saved = w.DOMException;
    const Fake: any = function () {
      throw new TypeError('Illegal constructor');
    };
    Fake.prototype = Object.create(Error.prototype);
    Fake.SYNTAX_ERR = 12;
    w.DOMException = Fake;
    vi.resetModules();
    try {
      const { install, isSupported } = await import('../src/modules/_dom-exception-impl.js');
      expect(isSupported()).toBe(false); // the fake took effect
      install();
      const e = new w.DOMException('m', 'SyntaxError');
      expect(e instanceof Fake).toBe(true);
      expect(e.code).toBe(12);
      expect(w.DOMException.SYNTAX_ERR).toBe(12);
    } finally {
      w.DOMException = saved;
      vi.resetModules();
    }
  });
});
