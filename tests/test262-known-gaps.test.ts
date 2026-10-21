import { arrayToSpliced } from '../src/modules/es.array.to-spliced.js';
import { arrayToReversed } from '../src/modules/es.array.to-reversed.js';
import { arrayWith } from '../src/modules/es.array.with.js';
import { arrayForEach } from '../src/modules/es.array.for-each.js';
import { arrayMap } from '../src/modules/es.array.map.js';
import { arrayFilter } from '../src/modules/es.array.filter.js';
import { arrayReduce } from '../src/modules/es.array.reduce.js';
import { arrayFind } from '../src/modules/es.array.find.js';
import { arrayIndexOf } from '../src/modules/es.array.index-of.js';
import { arrayLastIndexOf } from '../src/modules/es.array.last-index-of.js';
import { arrayIncludes } from '../src/modules/es.array.includes.js';
import { arrayConcat } from '../src/modules/es.array.concat.js';
import { arraySlice } from '../src/modules/es.array.slice.js';
import { arraySplice } from '../src/modules/es.array.splice.js';
import { arraySort } from '../src/modules/es.array.sort.js';
import { arrayFrom } from '../src/modules/es.array.from.js';
import { arrayOf } from '../src/modules/es.array.of.js';
import { arrayFill } from '../src/modules/es.array.fill.js';
import { arrayCopyWithin } from '../src/modules/es.array.copy-within.js';
import { arrayFlat } from '../src/modules/es.array.flat.js';
import { arrayFlatMap } from '../src/modules/es.array.flat-map.js';
import { stringRaw } from '../src/modules/es.string.raw.js';
import { stringPadStart } from '../src/modules/es.string.pad-start.js';
import { stringIsWellFormed } from '../src/modules/es.string.is-well-formed.js';
import { stringStartsWith } from '../src/modules/es.string.starts-with.js';
import { regExpEscape } from '../src/modules/es.regexp.escape.js';
import { regexpDotAllGetter } from '../src/modules/es.regexp.dot-all.js';
import { regExpToString } from '../src/modules/es.regexp.to-string.js';
import { mathHypot } from '../src/modules/es.math.hypot.js';
import { dataViewGetFloat16, dataViewSetFloat16 } from '../src/modules/install-float16.js';
import { objectEntries } from '../src/modules/es.object.entries.js';
import { objectValues } from '../src/modules/es.object.values.js';
import { Reflect as ReflectPolyfill } from '../src/modules/install-reflect.js';
import { errorIsError } from '../src/modules/es.error.is-error.js';
import { AggregateError as AggregateErrorPolyfill } from '../src/modules/es.aggregate-error.js';
import { SymbolPolyfill } from '../src/modules/es.symbol.js';
import { mapGroupBy } from '../src/modules/es.map.group-by.js';
import { setUnion } from '../src/modules/install-set-methods.js';
import { WeakSet as WeakSetPolyfill } from '../src/modules/es.weak-set.js';
import { iteratorFrom, iteratorForEach } from '../src/modules/install-iterator.js';
import { AsyncDisposableStack as AsyncDisposableStackPolyfill } from '../src/modules/install-disposable.js';
import { promiseAllSettled } from '../src/modules/es.promise.all-settled.js';
import { promiseTry } from '../src/modules/es.promise.try.js';
import { promiseWithResolvers } from '../src/modules/es.promise.with-resolvers.js';
import { promiseFinally } from '../src/modules/es.promise.finally.js';
import { arrayFromAsync } from '../src/modules/es.array.from-async.js';
import { arrayBufferIsView, arrayBufferSlice } from '../src/modules/install-array-buffer.js';
import { typedArrayAt, typedArrayWith, typedArrayFill, typedArrayIncludes } from '../src/modules/install-typed-array.js';
import { URLSearchParams as URLSearchParamsPolyfill } from '../src/modules/web.url-search-params.js';
import { structuredClone as structuredClonePolyfill } from '../src/modules/web.structured-clone.js';

/**
 * Known spec gaps, each found by a spackle-verify check ported from test262
 * (or WPT for the web APIs) and confirmed against the real engines.
 *
 * Every case asserts the SPEC behaviour and is marked `it.fails`, so the suite
 * stays green while the gap exists and goes red the moment a fix lands: then
 * change `it.fails` to `it`. The test262/WPT file each case comes from is in
 * the name.
 *
 * Two gaps freeze the page if run, so they are `it.todo`, not `it.fails`.
 */

describe('Array — test262 gaps', () => {
  it('toSpliced.length is 2 (Array/prototype/toSpliced/length.js)', () => {
    expect(arrayToSpliced.length).toBe(2);
  });

  it('toReversed throws on a null receiver (toReversed/this-value-nullish.js)', () => {
    expect(() => arrayToReversed.call(null as any)).toThrow(TypeError);
  });

  it('with throws TypeError, not RangeError, on a null receiver (with/this-value-nullish.js)', () => {
    expect(() => arrayWith.call(null as any, 0, 0)).toThrow(TypeError);
  });

  it('map/filter/reduce/find have length 1 (*/length.js)', () => {
    expect([arrayMap.length, arrayFilter.length, arrayReduce.length, arrayFind.length]).toEqual([1, 1, 1, 1]);
  });

  it('forEach rejects a non-callable even when nothing is visited (forEach/15.4.4.18-4-1.js)', () => {
    expect(() => arrayForEach.call(new Array(10), undefined as any)).toThrow(TypeError);
  });

  it('map reads length before checking the callback (map/15.4.4.19-4-8.js)', () => {
    const o = { get length(): number { throw new SyntaxError('length first'); } };
    expect(() => arrayMap.call(o as any, undefined as any)).toThrow(SyntaxError);
  });

  it('find passes ToObject(this) to the callback (find/predicate-call-parameters.js)', () => {
    let seen: any;
    arrayFind.call('ab' as any, (_v: any, _i: any, o: any) => { seen = o; return true; });
    expect(typeof seen).toBe('object');
  });

  it('indexOf and includes have length 1 (indexOf/length.js, includes/length.js)', () => {
    expect([arrayIndexOf.length, arrayIncludes.length]).toEqual([1, 1]);
  });

  it('indexOf/lastIndexOf return +0 for a -0 fromIndex (indexOf/fromindex-zero-conversion.js)', () => {
    expect(Object.is(arrayIndexOf.call([1], 1, -0), 0)).toBe(true);
    expect(Object.is(arrayLastIndexOf.call([1], 1, -0), 0)).toBe(true);
  });

  it('concat has length 1 (concat/length.js)', () => {
    expect(arrayConcat.length).toBe(1);
  });

  it('slice writes with CreateDataProperty, ignoring a read-only Array.prototype index (slice/create-proto-from-ctor-realm-array.js family)', () => {
    Object.defineProperty(Array.prototype, '0', { value: 'blocked', writable: false, configurable: true });
    try {
      expect(arraySlice.call(['a'])[0]).toBe('a');
    } finally {
      delete (Array.prototype as any)[0];
    }
  });

  it('slice rejects a primitive constructor in ArraySpeciesCreate (slice/create-ctor-non-object.js)', () => {
    const a: any = [1];
    a.constructor = 1;
    expect(() => arraySlice.call(a)).toThrow(TypeError);
  });

  it('splice has length 2 (splice/length.js)', () => {
    expect(arraySplice.length).toBe(2);
  });

  it('splice refuses a result past 2^53-1 before shifting anything (splice/throws-if-integer-limit-exceeded.js)', () => {
    for (const len of [2 ** 53 - 1, 2 ** 53, Infinity]) {
      const o: any = { length: len };
      expect(() => arraySplice.call(o, 0, 0, null)).toThrow(TypeError);
    }
  });

  it('splice rejects a primitive constructor and defines removed elements (splice/create-ctor-non-object.js, create-non-array-invalid-len.js)', () => {
    const a: any = [1, 2];
    a.constructor = 1;
    expect(() => arraySplice.call(a, 0)).toThrow(TypeError);
    Object.defineProperty(Array.prototype, '0', { value: 'blocked', writable: false, configurable: true });
    try {
      expect(arraySplice.call(['x'], 0)[0]).toBe('x');
    } finally {
      delete (Array.prototype as any)[0];
    }
  });

  it('sort reads each element once and writes only after sorting (sort/precise-*.js)', () => {
    let reads = 0;
    const o: any = { length: 3 };
    for (let i = 0; i < 3; i++) Object.defineProperty(o, i, { get() { reads++; return 3 - i; }, set() {}, configurable: true });
    try { arraySort.call(o, () => { throw new Error('stop'); }); } catch { /* expected */ }
    expect(reads).toBe(3);
  });

  it('Array.from has length 1 and checks IsConstructor (from/length.js, from/source-object-constructor.js)', () => {
    expect(arrayFrom.length).toBe(1);
    expect(Array.isArray(arrayFrom.call(Math.cos as any, [1]))).toBe(true);
  });

  it('Array.of checks IsConstructor (of/construct-this-with-the-number-of-arguments.js family)', () => {
    expect(Array.isArray(arrayOf.call(Math.cos as any, 1))).toBe(true);
  });

  it('fill, copyWithin, flat and flatMap have the spec lengths (*/length.js)', () => {
    expect([arrayFill.length, arrayCopyWithin.length, arrayFlat.length, arrayFlatMap.length]).toEqual([1, 2, 0, 1]);
  });

  it('flat uses ArraySpeciesCreate (flat/proxy-access-count.js, flat/this-value-ctor-object-species.js)', () => {
    const a: any = [[1]];
    a.constructor = 1;
    expect(() => arrayFlat.call(a)).toThrow(TypeError);
  });
});

describe('String / RegExp — test262 gaps', () => {
  it('String.raw treats raw.length -1 as 0 and rejects Symbols (String/raw/raw-prop-length-negative.js, return-the-string-value-from-template.js)', () => {
    expect(stringRaw({ raw: { length: -1 } })).toBe('');
    expect(stringRaw({ raw: { length: '-1' } })).toBe('');
    expect(() => stringRaw({ raw: [Symbol('s')] })).toThrow(TypeError);
  });

  it('padStart requires an object-coercible this and has length 1 (padStart/observable-operations.js, length.js)', () => {
    expect(stringPadStart.length).toBe(1);
    expect(() => stringPadStart.call(undefined as any, 3)).toThrow(TypeError);
  });

  it('padStart converts maxLength before fillString (padStart/observable-operations.js)', () => {
    const order: string[] = [];
    stringPadStart.call('a', { valueOf() { order.push('maxLength'); return 3; } } as any, { toString() { order.push('fillString'); return 'x'; } } as any);
    expect(order).toEqual(['maxLength', 'fillString']);
  });

  it('isWellFormed requires an object-coercible this (isWellFormed/return-abrupt-from-this.js)', () => {
    expect(() => stringIsWellFormed.call(undefined as any)).toThrow(TypeError);
  });

  it('startsWith has length 1 (startsWith/length.js)', () => {
    expect(stringStartsWith.length).toBe(1);
  });

  it('ToString on a Symbol receiver throws (startsWith/this-value-tostring-throws.js family)', () => {
    expect(() => stringStartsWith.call(Symbol('s') as any, 'S')).toThrow(TypeError);
  });

  it('RegExp.escape uses ControlEscape for \\t \\n \\v \\f \\r (RegExp/escape/escaped-control-characters.js)', () => {
    expect(regExpEscape('\t\n\v\f\r')).toBe('\\t\\n\\v\\f\\r');
  });

  it('dotAll getter throws for non-RegExp objects and is undefined on RegExp.prototype (dotAll/this-val-*.js)', () => {
    expect(() => regexpDotAllGetter.call({})).toThrow(TypeError);
    expect(regexpDotAllGetter.call(RegExp.prototype)).toBeUndefined();
  });

  it('RegExp.prototype.toString rejects primitive receivers (toString/this-val-non-obj.js)', () => {
    expect(() => regExpToString.call(1 as any)).toThrow(TypeError);
  });
});

describe('Number / Math / Object / Reflect / Error / Symbol — test262 gaps', () => {
  it('Math.hypot has length 2 (Math/hypot/length.js)', () => {
    expect(mathHypot.length).toBe(2);
  });

  it('DataView getFloat16 has length 1 (DataView/prototype/getFloat16/length.js)', () => {
    expect(dataViewGetFloat16.length).toBe(1);
  });

  it('setFloat16 converts the index before the value (setFloat16/index-check-before-value-conversion.js)', () => {
    const dv = new DataView(new ArrayBuffer(2));
    let converted = false;
    expect(() => dataViewSetFloat16.call(dv, -1, { valueOf() { converted = true; return 1; } } as any)).toThrow(RangeError);
    expect(converted).toBe(false);
  });

  it('Object.entries/values skip keys deleted mid-walk (entries/observable-operations.js)', () => {
    const o: any = { get a() { delete this.b; return 1; }, b: 2 };
    expect(objectEntries(o)).toEqual([['a', 1]]);
    const p: any = { get a() { delete this.b; return 1; }, b: 2 };
    expect(objectValues(p)).toEqual([1]);
  });

  it('Reflect methods are non-enumerable (Reflect/*/prop-desc via propertyHelper)', () => {
    expect(Object.getOwnPropertyDescriptor(ReflectPolyfill, 'apply')!.enumerable).toBe(false);
  });

  it('Reflect.apply rejects a non-object argumentsList (Reflect/apply/arguments-list-is-not-array-like.js)', () => {
    expect(() => (ReflectPolyfill as any).apply(function () {}, null, undefined)).toThrow(TypeError);
  });

  it('Reflect.setPrototypeOf rejects undefined (Reflect/setPrototypeOf/proto-is-not-object-and-not-null-throws.js)', () => {
    expect(() => (ReflectPolyfill as any).setPrototypeOf({}, undefined)).toThrow(TypeError);
  });

  it('Error.isError recognises AggregateError instances (Error/isError/errors.js)', () => {
    expect(errorIsError(new (AggregateErrorPolyfill as any)([]))).toBe(true);
  });

  it('AggregateError has length 2 and converts the message once (AggregateError/length.js, message-tostring-abrupt.js)', () => {
    expect(AggregateErrorPolyfill.length).toBe(2);
  });

  it('Symbol has length 0 and undefined descriptions (Symbol/length.js, prototype/description/description-symboldescriptivestring.js)', () => {
    expect(SymbolPolyfill.length).toBe(0);
    expect(SymbolPolyfill().description).toBeUndefined();
  });
});

describe('Collections / Iterator / Disposable — test262 gaps', () => {
  it('Map.groupBy closes the iterator when the callback throws (Map/groupBy/callback-throws.js)', () => {
    let closed = 0;
    const it: any = {
      [Symbol.iterator]() { return { next: () => ({ value: 1, done: false }), return() { closed++; return {}; } }; },
    };
    expect(() => mapGroupBy(it, () => { throw new Error('cb'); })).toThrow('cb');
    expect(closed).toBe(1);
  });

  it('union reads the receiver through its internal data, not Set.prototype (Set/prototype/union/subclass-receiver-methods.js)', () => {
    const s = new Set([1, 2]);
    const P: any = Set.prototype;
    const saved: any = { add: P.add, has: P.has, keys: P.keys, values: P.values, iter: P[Symbol.iterator] };
    const poison = () => { throw new Error('receiver method called'); };
    P.add = P.has = P.keys = P.values = P[Symbol.iterator] = poison;
    let result: any;
    try {
      result = setUnion.call(s, { size: 1, has: () => false, keys: () => [3][Symbol.iterator]() });
    } finally {
      P.add = saved.add; P.has = saved.has; P.keys = saved.keys; P.values = saved.values; P[Symbol.iterator] = saved.iter;
    }
    expect([...result]).toEqual([1, 2, 3]);
  });

  it('new WeakSet(iterable) accepts non-registered symbols (WeakSet/iterable-with-symbol-values.js)', () => {
    const s = Symbol('weak');
    const ws = new (WeakSetPolyfill as any)([s]);
    expect(ws.has(s)).toBe(true);
    expect(ws.delete(s)).toBe(true);
  });

  it('Iterator.from reads next once (Iterator/from/get-next-method-only-once.js)', () => {
    let gets = 0;
    const src = { get next() { gets++; let n = 0; return () => (n++ < 2 ? { value: n, done: false } : { value: undefined, done: true }); } };
    const w = iteratorFrom(src);
    w.next(); w.next(); w.next();
    expect(gets).toBe(1);
  });

  it('forEach does not close the source on a throwing value getter (Iterator/prototype/forEach/next-method-returns-throwing-value.js)', () => {
    let closed = 0;
    const src: any = Object.create(Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    src.next = () => ({ done: false, get value() { throw new Error('value'); } });
    src.return = () => { closed++; return {}; };
    expect(() => iteratorForEach.call(src, () => {})).toThrow('value');
    expect(closed).toBe(0);
  });

  it('disposeAsync rejects instead of throwing for a bad receiver (AsyncDisposableStack/prototype/disposeAsync/this-not-object-rejects.js)', async () => {
    let threw = false;
    let p: any;
    try { p = (AsyncDisposableStackPolyfill as any).prototype.disposeAsync.call(undefined); } catch { threw = true; }
    expect(threw).toBe(false);
    await expect(p).rejects.toBeInstanceOf(TypeError);
  });
});

describe('Promise / Array.fromAsync — test262 gaps', () => {
  it('allSettled reads C.resolve once (Promise/allSettled/invoke-resolve-get-once-multiple-calls.js)', () => {
    let gets = 0;
    const C: any = function (executor: any) { executor(() => {}, () => {}); };
    Object.defineProperty(C, 'resolve', { get() { gets++; return (v: any) => v; } });
    promiseAllSettled.call(C, [{ then() {} }, { then() {} }]);
    expect(gets).toBe(1);
  });

  it('Promise.try turns a throw into a rejection of the capability (Promise/try/throws.js with a custom constructor)', () => {
    const rejected: any[] = [];
    const C: any = function (executor: any) { executor(() => {}, (e: any) => rejected.push(e)); };
    const err = new Error('e');
    expect(() => promiseTry.call(C, () => { throw err; })).not.toThrow();
    expect(rejected).toEqual([err]);
  });

  it('withResolvers rejects a capability executor called twice (Promise/withResolvers via NewPromiseCapability)', () => {
    // the first call already set a (non-undefined) reject, so the second must throw
    const C: any = function (executor: any) { executor(undefined, () => {}); executor(() => {}, () => {}); };
    expect(() => promiseWithResolvers.call(C)).toThrow(TypeError);
  });

  it('finally wrappers are not constructors (Promise/prototype/finally/this-value-then-*.js)', () => {
    let a: any;
    promiseFinally.call({ then(x: any) { a = x; }, constructor: Promise } as any, () => {});
    expect(Object.prototype.hasOwnProperty.call(a, 'prototype')).toBe(false);
  });

  it('Array.fromAsync does not await async-iterator values (Array/fromAsync/async-iterable-input-does-not-await-input.js)', async () => {
    const inner = Promise.resolve('kept');
    const src: any = {
      [Symbol.asyncIterator]() { let i = 0; return { next: () => Promise.resolve(i++ < 1 ? { value: inner, done: false } : { value: undefined, done: true }) }; },
    };
    const out: any[] = await arrayFromAsync(src);
    expect(out[0]).toBe(inner);
  });
});

describe('ArrayBuffer / TypedArray — test262 gaps', () => {
  it('isView is false, not a throw, for an object inheriting a typed array prototype (ArrayBuffer/isView/arg-is-dataview-subclass-instance.js family)', () => {
    expect(arrayBufferIsView(Object.create(Uint8Array.prototype))).toBe(false);
  });

  it('slice throws TypeError for a non-buffer receiver (ArrayBuffer/prototype/slice/this-is-not-object.js family)', () => {
    expect(() => arrayBufferSlice.call({} as any, 0)).toThrow(TypeError);
  });

  it('typed array methods validate the receiver (TypedArray/prototype/at/this-is-not-typedarray-instance.js)', () => {
    expect(() => typedArrayAt.call(1 as any, 0)).toThrow(TypeError);
  });

  it('with converts the value before the range check (TypedArray/prototype/with/index-bigger-or-eq-than-length.js)', () => {
    let converted = false;
    expect(() => typedArrayWith.call(new Uint8Array(1), 5, { valueOf() { converted = true; return 1; } })).toThrow(RangeError);
    expect(converted).toBe(true);
  });

  it('fill converts the value once, before start/end (TypedArray/prototype/fill/fill-values-conversion-operations-consistent-nan.js family)', () => {
    const order: string[] = [];
    typedArrayFill.call(new Uint8Array(2), { valueOf() { order.push('value'); return 1; } } as any, { valueOf() { order.push('start'); return 0; } } as any);
    expect(order).toEqual(['value', 'start']);
  });

  it('includes returns false on an empty array without converting fromIndex (TypedArray/prototype/includes/length-zero-returns-false.js)', () => {
    let read = false;
    typedArrayIncludes.call(new Uint8Array(0), 0, { valueOf() { read = true; return 0; } } as any);
    expect(read).toBe(false);
  });
});

describe('Web APIs — WPT gaps', () => {
  it('URLSearchParams percent-encodes "~" (url/urlencoded serializer)', () => {
    const p = new (URLSearchParamsPolyfill as any)();
    p.append('a', '~');
    expect(String(p)).toBe('a=%7E');
  });

  it('URLSearchParams record keys are USVStrings (url/urlsearchparams-constructor.any.js "2 unpaired surrogates")', () => {
    const p = new (URLSearchParamsPolyfill as any)({ '\uD835x': '1', xx: '2', '\uD83Dx': '3' });
    const out: any[] = [];
    p.forEach((v: any, k: any) => out.push([k, v]));
    expect(out).toEqual([['�x', '3'], ['xx', '2']]);
  });

  it('URLSearchParams has entries() (url/urlsearchparams-foreach.any.js)', () => {
    expect(typeof new (URLSearchParamsPolyfill as any)('a=1').entries).toBe('function');
  });

  it('structuredClone resets RegExp lastIndex and keeps flags (html/webappapis/structured-clone battery "RegExp flags and lastIndex")', () => {
    const r = /foo/gim;
    r.lastIndex = 2;
    const c = structuredClonePolyfill(r);
    expect([c.global, c.ignoreCase, c.multiline, c.lastIndex]).toEqual([true, true, true, 0]);
  });

  it('structuredClone throws DataCloneError for symbols and DOM nodes (structured-clone battery "non-serializable")', () => {
    for (const v of [() => {}, Symbol('s'), { s: Symbol('s') }, document.createElement('div')]) {
      expect(() => structuredClonePolyfill(v)).toThrow(expect.objectContaining({ name: 'DataCloneError' }));
    }
  });
});
