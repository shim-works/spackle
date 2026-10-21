import { structuredClone } from '../src/modules/web.structured-clone.js';
import { arrayValues } from '../src/modules/es.array.iterator.js';
import { Map as MapPolyfill } from '../src/modules/es.map.js';
import { Set as SetPolyfill } from '../src/modules/es.set.js';
import { URLSearchParams as USP } from '../src/modules/web.url-search-params.js';
import { stringMatchAll } from '../src/modules/es.string.match-all.js';
import { stringRepeat } from '../src/modules/es.string.repeat.js';
import { objectFromEntries } from '../src/modules/es.object.from-entries.js';
import { objectSetPrototypeOf } from '../src/modules/es.object.set-prototype-of.js';
import { promiseFinally } from '../src/modules/es.promise.finally.js';
import { stringStartsWith } from '../src/modules/es.string.starts-with.js';
import { stringEndsWith } from '../src/modules/es.string.ends-with.js';
import { stringIncludes } from '../src/modules/es.string.includes.js';
import { stringTrim } from '../src/modules/es.string.trim.js';
import { stringTrimStart } from '../src/modules/es.string.trim-start.js';
import { arrayFrom } from '../src/modules/es.array.from.js';
import { iteratorMap } from '../src/modules/install-iterator.js';
import { setIsSupersetOf } from '../src/modules/install-set-methods.js';
import { typedArrayAt, typedArrayFind } from '../src/modules/install-typed-array.js';

/**
 * One block per row of the spec-fix plan. Each case names the spec rule it
 * holds the polyfill to, so a regression reads as "broke step X", not "test 7".
 */

describe('structuredClone — HTML StructuredSerializeInternal, Error branch', () => {
  it('a name outside the seven native errors comes back as plain Error, never a global lookup', () => {
    const e: any = new Error('https://example.invalid/x');
    e.name = 'Audio';
    const copy: any = structuredClone(e);
    expect(copy instanceof Error).toBe(true);
    expect(Object.prototype.toString.call(copy)).toBe('[object Error]');
    expect(copy.name).toBe('Error');
    expect(copy.message).toBe('https://example.invalid/x');
  });

  it('keeps the native error type, with name inherited rather than own', () => {
    const copy: any = structuredClone(new TypeError('t'));
    expect(copy instanceof TypeError).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(copy, 'name')).toBe(false);
  });

  it('carries no other own properties', () => {
    const e: any = new RangeError('r');
    e.extra = 1;
    expect('extra' in (structuredClone(e) as any)).toBe(false);
  });

  it('a DOMException comes back as a DOMException with name and message', () => {
    const copy: any = structuredClone(new DOMException('gone', 'AbortError'));
    expect(copy instanceof DOMException).toBe(true);
    expect(copy.name).toBe('AbortError');
    expect(copy.message).toBe('gone');
  });
});

describe('array iterator — %ArrayIteratorPrototype%.next reads length every step', () => {
  it('sees elements pushed during iteration', () => {
    const a = [1];
    const it: any = arrayValues.call(a);
    expect(it.next().value).toBe(1);
    a.push(2);
    expect(it.next()).toEqual({ value: 2, done: false });
    expect(it.next().done).toBe(true);
  });
});

describe('Map / Set — ~empty~ slots, iteration survives deletion', () => {
  it('Map.forEach deleting each key visits every entry', () => {
    const m = new (MapPolyfill as any)([[1, 1], [2, 2], [3, 3]]);
    const seen: number[] = [];
    m.forEach((_v: any, k: number) => {
      seen.push(k);
      m.delete(k);
    });
    expect(seen).toEqual([1, 2, 3]);
    expect(m.size).toBe(0);
  });

  it('Map iterator skips deleted entries and visits entries added later', () => {
    const m = new (MapPolyfill as any)([['a', 1], ['b', 2], ['c', 3]]);
    const it = m.keys();
    expect(it.next().value).toBe('a');
    m.delete('b');
    m.set('d', 4);
    expect(it.next().value).toBe('c');
    expect(it.next().value).toBe('d');
    expect(it.next().done).toBe(true);
  });

  it('a paused iterator resumes in place across a compaction', () => {
    const m = new (MapPolyfill as any)();
    for (let i = 0; i < 100; i++) m.set(i, i);
    const it = m.keys();
    for (let i = 0; i < 10; i++) it.next();
    // delete enough to trigger compaction (holes > live and > 16)
    for (let i = 0; i < 60; i++) m.delete(i);
    expect(it.next().value).toBe(60);
    expect(m.size).toBe(40);
  });

  it('clear() mid-iteration: the iterator sees only what is added afterwards', () => {
    const m = new (MapPolyfill as any)([[1, 1], [2, 2]]);
    const it = m.keys();
    it.next();
    m.clear();
    m.set(9, 9);
    expect(it.next().value).toBe(9);
    expect(it.next().done).toBe(true);
  });

  it('a churned map that is never emptied stays bounded', () => {
    const m = new (MapPolyfill as any)([['keep', 1]]);
    for (let i = 0; i < 10000; i++) {
      m.set(i, i);
      m.delete(i);
    }
    expect(m.size).toBe(1);
    expect((m as any)._keys.length).toBeLessThan(40);
  });

  it('Set.forEach deleting during iteration visits every value', () => {
    const s = new (SetPolyfill as any)([1, 2, 3]);
    const seen: number[] = [];
    s.forEach((v: number) => {
      seen.push(v);
      s.delete(v);
    });
    expect(seen).toEqual([1, 2, 3]);
  });

  it('forEach rejects a non-callable callback', () => {
    expect(() => new (MapPolyfill as any)().forEach(null)).toThrow(TypeError);
    expect(() => new (SetPolyfill as any)().forEach(null)).toThrow(TypeError);
  });
});

describe('URLSearchParams — WHATWG application/x-www-form-urlencoded', () => {
  it('a % not followed by two hex digits stays literal instead of throwing', () => {
    expect(new (USP as any)('q=100%').get('q')).toBe('100%');
    expect(new (USP as any)('q=%zz').get('q')).toBe('%zz');
  });

  it('invalid UTF-8 bytes decode to U+FFFD', () => {
    expect(new (USP as any)('q=%FF').get('q')).toBe('�');
    expect(new (USP as any)('q=%C3%28').get('q')).toBe('�(');
  });

  it('valid input still decodes normally', () => {
    expect(new (USP as any)('q=%C3%A9+x').get('q')).toBe('é x');
  });

  it('copies another instance', () => {
    expect(new (USP as any)(new (USP as any)('a=1&b=2')).toString()).toBe('a=1&b=2');
  });

  it('accepts any iterable of pairs', () => {
    const pairs = new Map([['a', '1']]);
    expect(new (USP as any)(pairs).toString()).toBe('a=1');
  });
});

describe('String.prototype.matchAll — lazy, flags and lastIndex preserved', () => {
  it('keeps the s flag', () => {
    expect([...stringMatchAll.call('a\nb', new RegExp('a.b', 'gs'))].length).toBe(1);
  });

  it('starts at lastIndex and leaves the caller regex untouched', () => {
    const r = /a/g;
    r.lastIndex = 2;
    expect([...stringMatchAll.call('aaaa', r)].length).toBe(2);
    expect(r.lastIndex).toBe(2);
  });

  it('is lazy: exec runs only when next() is called', () => {
    let calls = 0;
    const r: any = /a/g;
    const MyRegExp: any = function (this: any, src: any, flags: any) {
      const inner = new RegExp(src, flags);
      (inner as any).exec = function (s: string) {
        calls++;
        return RegExp.prototype.exec.call(this, s);
      };
      return inner;
    };
    r.constructor = { [Symbol.species]: MyRegExp };
    const it = stringMatchAll.call('aaa', r);
    expect(calls).toBe(0);
    it.next();
    expect(calls).toBe(1);
  });

  it('still rejects a non-global regex', () => {
    expect(() => stringMatchAll.call('a', /a/)).toThrow(TypeError);
  });
});

describe('String.prototype.repeat — ToIntegerOrInfinity before the range check', () => {
  it('repeat(-0.5) is the empty string', () => {
    expect(stringRepeat.call('a', -0.5)).toBe('');
    expect(() => stringRepeat.call('a', -1)).toThrow(RangeError);
  });
});

describe('Object.fromEntries — CreateDataPropertyOrThrow over any iterable', () => {
  it('__proto__ becomes an own key, the prototype is untouched', () => {
    const o: any = objectFromEntries([['__proto__', { x: 1 }]]);
    expect(Object.getPrototypeOf(o)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(o, '__proto__')).toBe(true);
  });

  it('reads Map entries and Set pairs through the iterator', () => {
    expect(objectFromEntries(new Map([['a', 1]]))).toEqual({ a: 1 });
    expect(objectFromEntries(new Set([['b', 2]]))).toEqual({ b: 2 });
  });

  it('a non-object entry is a TypeError and closes the iterator', () => {
    let closed = false;
    const iterable: any = {
      [Symbol.iterator]() {
        return {
          next: () => ({ value: 1, done: false }),
          return: () => {
            closed = true;
            return {};
          },
        };
      },
    };
    expect(() => objectFromEntries(iterable)).toThrow(TypeError);
    expect(closed).toBe(true);
  });

  it('null is a TypeError', () => {
    expect(() => objectFromEntries(null)).toThrow(TypeError);
  });
});

describe('Object.setPrototypeOf — the real [[SetPrototypeOf]]', () => {
  it('works on a null-prototype object', () => {
    const proto = { hello: 1 };
    const o = objectSetPrototypeOf(Object.create(null), proto);
    expect(Object.getPrototypeOf(o)).toBe(proto);
    expect(Object.prototype.hasOwnProperty.call(o, '__proto__')).toBe(false);
  });

  it('a non-extensible target with a new prototype is a TypeError', () => {
    expect(() => objectSetPrototypeOf(Object.preventExtensions({}), {})).toThrow(TypeError);
  });
});

describe('Promise.prototype.finally — non-callables pass straight through', () => {
  it('resolves with the original value when given no callback', async () => {
    await expect(promiseFinally.call(Promise.resolve(1), undefined as any)).resolves.toBe(1);
  });

  it('rejects with the original reason when given no callback', async () => {
    await expect(promiseFinally.call(Promise.reject(2), 5 as any)).rejects.toBe(2);
  });

  it('a callable still runs and keeps the value', async () => {
    let ran = false;
    await expect(promiseFinally.call(Promise.resolve(3), () => { ran = true; })).resolves.toBe(3);
    expect(ran).toBe(true);
  });
});

describe('String methods — RequireObjectCoercible, ToString(this), IsRegExp', () => {
  it('accept a non-string receiver', () => {
    expect(stringStartsWith.call(12345 as any, '12')).toBe(true);
    expect(stringEndsWith.call(12345 as any, '45')).toBe(true);
    expect(stringIncludes.call(12345 as any, '23')).toBe(true);
    expect(stringTrim.call(12 as any)).toBe('12');
    expect(stringTrimStart.call(12 as any)).toBe('12');
  });

  it('reject null and undefined receivers', () => {
    expect(() => stringStartsWith.call(null as any, 'a')).toThrow(TypeError);
    expect(() => stringIncludes.call(undefined as any, 'a')).toThrow(TypeError);
  });

  it('IsRegExp honours @@match both ways', () => {
    const notARegex: any = /a/;
    notARegex[Symbol.match] = false;
    expect(stringIncludes.call('/a/', notARegex)).toBe(true);
    const regexLike: any = { [Symbol.match]: true };
    expect(() => stringStartsWith.call('a', regexLike)).toThrow(TypeError);
  });
});

describe('IteratorClose — only for errors from our side', () => {
  it('Array.from does not call return() when next() itself throws', () => {
    let closed = false;
    const iterable: any = {
      [Symbol.iterator]() {
        return {
          next: () => {
            throw new Error('broken');
          },
          return: () => {
            closed = true;
            return {};
          },
        };
      },
    };
    expect(() => arrayFrom.call(Array, iterable)).toThrow('broken');
    expect(closed).toBe(false);
  });

  it('Array.from still closes when the map function throws', () => {
    let closed = false;
    const iterable: any = {
      [Symbol.iterator]() {
        return {
          next: () => ({ value: 1, done: false }),
          return: () => {
            closed = true;
            return {};
          },
        };
      },
    };
    expect(() =>
      arrayFrom.call(Array, iterable, () => {
        throw new Error('map');
      }),
    ).toThrow('map');
    expect(closed).toBe(true);
  });

  it('a helper does not close its source when the source next() throws', () => {
    let closed = false;
    const source: any = {
      next: () => {
        throw new Error('source');
      },
      return: () => {
        closed = true;
        return {};
      },
    };
    const helper: any = iteratorMap.call(source, (x: any) => x);
    expect(() => helper.next()).toThrow('source');
    expect(closed).toBe(false);
  });

  it('isSupersetOf closes the other iterator when it stops early', () => {
    let closed = false;
    const other = {
      size: 1,
      has: () => true,
      keys() {
        return {
          next: () => ({ value: 'missing', done: false }),
          return: () => {
            closed = true;
            return {};
          },
        };
      },
    };
    expect(setIsSupersetOf.call(new Set([1]), other)).toBe(false);
    expect(closed).toBe(true);
  });
});

describe('typed arrays — at() and find() argument handling', () => {
  it('at() uses ToIntegerOrInfinity, not ToInt32', () => {
    const ta = new Uint8Array([7, 8]);
    expect(typedArrayAt.call(ta, 4294967296)).toBe(undefined);
    expect(typedArrayAt.call(ta, -1)).toBe(8);
    expect(typedArrayAt.call(ta, 1.9)).toBe(8);
  });

  it('find() rejects a non-callable predicate even when empty', () => {
    expect(() => typedArrayFind.call(new Uint8Array(0), undefined as any)).toThrow(TypeError);
  });
});
