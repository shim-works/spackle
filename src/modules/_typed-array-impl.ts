/**
 * Spec: https://tc39.es/ecma262/#sec-properties-of-the-%typedarrayprototype%-object
 * Ported from: the prior implementation (typed-array.ts + is-typed-array-supported.ts
 * for the method implementations, plus the installation loop from
 * load-language.ts's typed-array block, which has no dedicated helper file
 * of its own -- it's inline in the mount).
 *
 * Shared by every es.typed-array.* module id: core-js-compat splits typed
 * arrays into ~30 ids (one per method, one per concrete flavor), but
 * the prior implementation treats the whole method suite as atomic across all 9
 * concrete typed array types -- either Chrome 38 / Safari 7 has all of it
 * (via Uint8Array as the stand-in probe) or none of it. So there's one
 * shared install here, and each es.typed-array.*.ts file just re-exports it.
 *
 * TWO independent gates live in this file, and that distinction matters:
 *
 *  1. The ES2015-era method suite, gated atomically on isSupported(). Either
 *     the engine has all of it (Chrome ~45+ / Safari 10+) or none of it.
 *  2. The ES2023 additions plus the from/of statics, gated separately on
 *     isModernSupported(). An engine can perfectly well have the whole ES2015
 *     suite and none of these, so folding them into gate 1 would mean they
 *     never install anywhere they're actually needed.
 *
 * Still NOT covered: es.typed-array.subarray (original typed-array spec,
 * always native in range).
 */

// %TypedArray% method suite — checked via Uint8Array as the stand-in. These
// either all exist (Chrome ~45+ / Safari 10+) or none do (Chrome 38 / Safari 7),
// so presence checks are enough. Catch: toString/toLocaleString are inherited
// from Object.prototype pre-ES2015, so a bare typeof would lie — compare identity
// against Object.prototype's instead.
export const isSupported = (): boolean => {
  try {
    if (typeof Uint8Array === "undefined") {
      return false;
    }

    const prototype = Uint8Array.prototype as any;

    return (
      typeof prototype.find === "function" &&
      typeof prototype.findIndex === "function" &&
      typeof prototype.includes === "function" &&
      typeof prototype.at === "function" &&
      typeof prototype.every === "function" &&
      typeof prototype.some === "function" &&
      typeof prototype.forEach === "function" &&
      typeof prototype.map === "function" &&
      typeof prototype.filter === "function" &&
      typeof prototype.indexOf === "function" &&
      typeof prototype.lastIndexOf === "function" &&
      typeof prototype.join === "function" &&
      typeof prototype.reduce === "function" &&
      typeof prototype.reduceRight === "function" &&
      typeof prototype.reverse === "function" &&
      typeof prototype.slice === "function" &&
      typeof prototype.sort === "function" &&
      typeof prototype.copyWithin === "function" &&
      typeof prototype.fill === "function" &&
      typeof prototype.keys === "function" &&
      typeof prototype.values === "function" &&
      typeof prototype.entries === "function" &&
      prototype.toString !== Object.prototype.toString &&
      prototype.toLocaleString !== Object.prototype.toLocaleString
    );
  } catch {
    return false;
  }
};

export const isTypedArraySupported = isSupported;

// ToIntegerOrInfinity, minus the Infinity bookkeeping (callers clamp anyway).
const toInt = (value: any): number => {
  const n = +value;
  if (n !== n) return 0; // NaN
  return n >= 0 ? Math.floor(n) : Math.ceil(n);
};

// Resolve a relative start/end index against a length (negative counts back).
const relativeIndex = (
  value: any,
  length: number,
  fallback: number,
): number => {
  if (value === undefined) return fallback;
  const n = toInt(value);
  return n < 0 ? Math.max(length + n, 0) : Math.min(n, length);
};

const assertCallable = (fn: any): void => {
  if (typeof fn !== "function") {
    throw new TypeError(fn + " is not a function");
  }
};

// Shared by join / toString / toLocaleString. Typed arrays have no holes, so
// every element is a number — plain concat, one string built incrementally.
const joinInternal = (ta: any, separator: string, locale: boolean): string => {
  let out = "";
  for (let i = 0; i < ta.length; i++) {
    if (i > 0) out += separator;
    out += locale ? ta[i].toLocaleString() : ta[i];
  }
  return out;
};

export const typedArrayFind = function (
  this: any,
  predicate: Function,
  thisArg?: any,
) {
  for (let i = 0; i < this.length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
};

export const typedArrayFindIndex = function (
  this: any,
  predicate: Function,
  thisArg?: any,
) {
  assertCallable(predicate);
  for (let i = 0; i < this.length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return i;
    }
  }
  return -1;
};

export const typedArrayIncludes = function (
  this: any,
  searchElement: any,
  fromIndex?: number,
) {
  let n = fromIndex !== undefined ? Number(fromIndex) : 0;
  if (n !== n) n = 0;
  n = n >= 0 ? Math.floor(n) : Math.ceil(n);
  for (
    let i = Math.max(n >= 0 ? n : this.length + n, 0);
    i < this.length;
    i++
  ) {
    const el = this[i];
    if (
      el === searchElement ||
      (el !== el && searchElement !== searchElement)
    ) {
      return true;
    }
  }
  return false;
};

export const typedArrayAt = function (this: any, index: number) {
  let i = index | 0 || 0;
  if (i < 0) {
    i += this.length;
  }
  if (i < 0 || i >= this.length) {
    return undefined;
  }
  return this[i];
};

export const typedArrayEvery = function (
  this: any,
  predicate: Function,
  thisArg?: any,
) {
  assertCallable(predicate);
  for (let i = 0; i < this.length; i++) {
    if (!predicate.call(thisArg, this[i], i, this)) {
      return false;
    }
  }
  return true;
};

export const typedArraySome = function (
  this: any,
  predicate: Function,
  thisArg?: any,
) {
  assertCallable(predicate);
  for (let i = 0; i < this.length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return true;
    }
  }
  return false;
};

export const typedArrayForEach = function (
  this: any,
  callback: Function,
  thisArg?: any,
) {
  assertCallable(callback);
  for (let i = 0; i < this.length; i++) {
    callback.call(thisArg, this[i], i, this);
  }
  return undefined;
};

export const typedArrayMap = function (
  this: any,
  callback: Function,
  thisArg?: any,
) {
  assertCallable(callback);
  const out = new this.constructor(this.length);
  for (let i = 0; i < this.length; i++) {
    // assignment coerces per element type, matching spec store semantics
    out[i] = callback.call(thisArg, this[i], i, this);
  }
  return out;
};

export const typedArrayFilter = function (
  this: any,
  predicate: Function,
  thisArg?: any,
) {
  assertCallable(predicate);
  // One temp plain array — kept count is unknowable without running the
  // predicate twice, which the spec forbids.
  const kept = [];
  for (let i = 0; i < this.length; i++) {
    const el = this[i];
    if (predicate.call(thisArg, el, i, this)) {
      kept.push(el);
    }
  }
  const out = new this.constructor(kept.length);
  for (let i = 0; i < kept.length; i++) {
    out[i] = kept[i];
  }
  return out;
};

export const typedArrayIndexOf = function (
  this: any,
  searchElement: any,
  fromIndex?: any,
) {
  const len = this.length;
  let n = fromIndex !== undefined ? toInt(fromIndex) : 0;
  if (n >= len) return -1;
  for (let i = Math.max(n >= 0 ? n : len + n, 0); i < len; i++) {
    // strict equality: NaN never matches, -0 === +0
    if (this[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

export const typedArrayLastIndexOf = function (
  this: any,
  searchElement: any,
  fromIndex?: any,
) {
  const len = this.length;
  let k = arguments.length > 1 ? toInt(fromIndex) : len - 1;
  k = k >= 0 ? Math.min(k, len - 1) : len + k;
  for (let i = k; i >= 0; i--) {
    if (this[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

export const typedArrayJoin = function (this: any, separator?: any) {
  const sep = separator === undefined ? "," : String(separator);
  return joinInternal(this, sep, false);
};

export const typedArrayToString = function (this: any) {
  return joinInternal(this, ",", false);
};

export const typedArrayToLocaleString = function (this: any) {
  return joinInternal(this, ",", true);
};

export const typedArrayReduce = function (
  this: any,
  callback: Function,
  initialValue?: any,
) {
  assertCallable(callback);
  const len = this.length;
  let acc;
  let i = 0;
  if (arguments.length > 1) {
    acc = initialValue;
  } else {
    if (len === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    acc = this[0];
    i = 1;
  }
  for (; i < len; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

export const typedArrayReduceRight = function (
  this: any,
  callback: Function,
  initialValue?: any,
) {
  assertCallable(callback);
  const len = this.length;
  let acc;
  let i = len - 1;
  if (arguments.length > 1) {
    acc = initialValue;
  } else {
    if (len === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    acc = this[len - 1];
    i = len - 2;
  }
  for (; i >= 0; i--) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

export const typedArrayReverse = function (this: any) {
  const len = this.length;
  for (let i = 0, j = len - 1; i < j; i++, j--) {
    const tmp = this[i];
    this[i] = this[j];
    this[j] = tmp;
  }
  return this;
};

export const typedArraySlice = function (this: any, start?: any, end?: any) {
  const len = this.length;
  const from = relativeIndex(start, len, 0);
  const to = relativeIndex(end, len, len);
  const count = Math.max(to - from, 0);
  const out = new this.constructor(count);
  for (let i = 0; i < count; i++) {
    out[i] = this[from + i];
  }
  return out;
};

// %TypedArray%.sort default comparator: numeric ascending, NaN sorts last,
// -0 sorts before +0.
const defaultSortCompare = (x: number, y: number): number => {
  if (x !== x) return y !== y ? 0 : 1;
  if (y !== y) return -1;
  if (x < y) return -1;
  if (x > y) return 1;
  if (x === 0 && y === 0) {
    if (1 / x < 0 && 1 / y > 0) return -1;
    if (1 / x > 0 && 1 / y < 0) return 1;
  }
  return 0;
};

export const typedArraySort = function (this: any, compareFn?: any) {
  if (compareFn !== undefined && typeof compareFn !== "function") {
    throw new TypeError(
      "The comparison function must be either a function or undefined",
    );
  }
  const len = this.length;
  // Sort a plain-array copy with the engine's Array sort, write back in place.
  // One temp array; avoids hand-rolling a sort in ES5.
  const tmp = [];
  for (let i = 0; i < len; i++) {
    tmp.push(this[i]);
  }
  tmp.sort(compareFn !== undefined ? compareFn : defaultSortCompare);
  for (let i = 0; i < len; i++) {
    this[i] = tmp[i];
  }
  return this;
};

export const typedArrayCopyWithin = function (
  this: any,
  target: any,
  start: any,
  end?: any,
) {
  const len = this.length;
  let to = relativeIndex(target, len, 0);
  let from = relativeIndex(start, len, 0);
  const final = relativeIndex(end, len, len);
  let count = Math.min(final - from, len - to);
  if (from < to && to < from + count) {
    // overlapping forward copy would clobber the source — copy backwards
    from += count - 1;
    to += count - 1;
    while (count > 0) {
      this[to] = this[from];
      to--;
      from--;
      count--;
    }
  } else {
    while (count > 0) {
      this[to] = this[from];
      to++;
      from++;
      count--;
    }
  }
  return this;
};

export const typedArrayFill = function (
  this: any,
  value: any,
  start?: any,
  end?: any,
) {
  const len = this.length;
  const from = relativeIndex(start, len, 0);
  const to = relativeIndex(end, len, len);
  for (let i = from; i < to; i++) {
    // assignment coerces per element type
    this[i] = value;
  }
  return this;
};

// kind: 0 = keys, 1 = values, 2 = entries
const createTypedArrayIterator = (ta: any, kind: number): any => {
  let i = 0;
  const iterator: any = {
    next: function () {
      if (i >= ta.length) {
        return { value: undefined, done: true };
      }
      const index = i++;
      if (kind === 0) return { value: index, done: false };
      if (kind === 1) return { value: ta[index], done: false };
      return { value: [index, ta[index]], done: false };
    },
  };
  if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
    Object.defineProperty(iterator, (Symbol as any).iterator, {
      value: function () {
        return this;
      },
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  return iterator;
};

export const typedArrayKeys = function (this: any) {
  return createTypedArrayIterator(this, 0);
};

export const typedArrayValues = function (this: any) {
  return createTypedArrayIterator(this, 1);
};

export const typedArrayEntries = function (this: any) {
  return createTypedArrayIterator(this, 2);
};

// Installation loop — ported from load-language.ts's typed-array mount
// block (no dedicated helper file of its own there; it's inline).
if (!isSupported()) {
  const typedArrayTypes = [
    typeof Uint8Array !== "undefined" ? Uint8Array : null,
    typeof Int8Array !== "undefined" ? Int8Array : null,
    typeof Uint16Array !== "undefined" ? Uint16Array : null,
    typeof Int16Array !== "undefined" ? Int16Array : null,
    typeof Uint32Array !== "undefined" ? Uint32Array : null,
    typeof Int32Array !== "undefined" ? Int32Array : null,
    typeof Float32Array !== "undefined" ? Float32Array : null,
    typeof Float64Array !== "undefined" ? Float64Array : null,
    typeof Uint8ClampedArray !== "undefined" ? Uint8ClampedArray : null,
  ];
  // One [name, fn] table shared across all nine concrete types.
  const typedArrayMethods: [string, Function][] = [
    ["find", typedArrayFind],
    ["findIndex", typedArrayFindIndex],
    ["includes", typedArrayIncludes],
    ["at", typedArrayAt],
    ["every", typedArrayEvery],
    ["some", typedArraySome],
    ["forEach", typedArrayForEach],
    ["map", typedArrayMap],
    ["filter", typedArrayFilter],
    ["indexOf", typedArrayIndexOf],
    ["lastIndexOf", typedArrayLastIndexOf],
    ["join", typedArrayJoin],
    ["reduce", typedArrayReduce],
    ["reduceRight", typedArrayReduceRight],
    ["reverse", typedArrayReverse],
    ["slice", typedArraySlice],
    ["sort", typedArraySort],
    ["copyWithin", typedArrayCopyWithin],
    ["fill", typedArrayFill],
    ["keys", typedArrayKeys],
    ["values", typedArrayValues],
    ["entries", typedArrayEntries],
  ];
  for (let i = 0; i < typedArrayTypes.length; i++) {
    const TypedArray = typedArrayTypes[i];
    if (!TypedArray) continue;
    const proto = TypedArray.prototype as any;
    for (let m = 0; m < typedArrayMethods.length; m++) {
      const name = typedArrayMethods[m][0];
      if (!proto[name]) {
        Object.defineProperty(typedArrayMethods[m][1], "name", {
          value: name,
          configurable: true,
        });
        Object.defineProperty(proto, name, {
          value: typedArrayMethods[m][1],
          writable: true,
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(proto[name] as any, "__polyfilled", {
          value: true,
        });
      }
    }
    // toString / toLocaleString inherit from Object.prototype pre-ES2015, so
    // a bare !proto.x check would never fire — compare identity instead.
    if (proto.toString === Object.prototype.toString) {
      Object.defineProperty(proto, "toString", {
        value: typedArrayToString,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      Object.defineProperty(proto.toString, "name", {
        value: "toString",
        configurable: true,
      });
      Object.defineProperty(proto.toString as any, "__polyfilled", {
        value: true,
      });
    }
    if (proto.toLocaleString === Object.prototype.toLocaleString) {
      Object.defineProperty(proto, "toLocaleString", {
        value: typedArrayToLocaleString,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      Object.defineProperty(proto.toLocaleString, "name", {
        value: "toLocaleString",
        configurable: true,
      });
      Object.defineProperty(proto.toLocaleString as any, "__polyfilled", {
        value: true,
      });
    }
    // for...of support — wire Symbol.iterator to values when a Symbol exists
    // (native, or installed earlier in this run).
    if (
      typeof Symbol !== "undefined" &&
      (Symbol as any).iterator &&
      !proto[(Symbol as any).iterator]
    ) {
      Object.defineProperty(proto, (Symbol as any).iterator, {
        value: proto.values,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      Object.defineProperty(
        proto[(Symbol as any).iterator] as any,
        "__polyfilled",
        { value: true },
      );
    }
  }
}

// ---------------------------------------------------------------------------
// ES2023 additions + the from/of statics — gate 2 (see the header).
//
// Deliberately NOT folded into isSupported() above: an engine can have the
// entire ES2015 suite and still lack every one of these, and the atomic gate
// would report "supported" and install nothing.
// ---------------------------------------------------------------------------

export const isModernSupported = (): boolean => {
  try {
    if (typeof Uint8Array === "undefined") {
      return false;
    }
    const prototype = Uint8Array.prototype as any;
    if (
      typeof prototype.findLast !== "function" ||
      typeof prototype.findLastIndex !== "function" ||
      typeof prototype.toReversed !== "function" ||
      typeof prototype.toSorted !== "function" ||
      typeof prototype.with !== "function" ||
      typeof (Uint8Array as any).from !== "function" ||
      typeof (Uint8Array as any).of !== "function"
    ) {
      return false;
    }
    // set() has existed since the original typed-array spec, so its presence
    // says nothing. Probe the behaviour instead: a source that doesn't fit must
    // throw RangeError rather than silently truncating.
    try {
      new Uint8Array(2).set([1, 2, 3] as any);
      return false;
    } catch {
      // good -- that's the throw we wanted
    }
    return true;
  } catch {
    return false;
  }
};

export const isTypedArrayModernSupported = isModernSupported;

export const typedArrayFindLast = function (
  this: any,
  predicate: any,
  thisArg?: any,
) {
  if (typeof predicate !== "function") {
    throw new TypeError("predicate is not a function");
  }
  for (let i = this.length - 1; i >= 0; i--) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
};

export const typedArrayFindLastIndex = function (
  this: any,
  predicate: any,
  thisArg?: any,
) {
  if (typeof predicate !== "function") {
    throw new TypeError("predicate is not a function");
  }
  for (let i = this.length - 1; i >= 0; i--) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return i;
    }
  }
  return -1;
};

export const typedArrayToReversed = function (this: any) {
  const len = this.length;
  const out = new this.constructor(len);
  for (let i = 0; i < len; i++) {
    out[i] = this[len - i - 1];
  }
  return out;
};

export const typedArrayToSorted = function (this: any, compareFn?: any) {
  if (compareFn !== undefined && typeof compareFn !== "function") {
    throw new TypeError(
      "The comparison function must be either a function or undefined",
    );
  }
  const len = this.length;
  const out = new this.constructor(len);
  for (let i = 0; i < len; i++) {
    out[i] = this[i];
  }
  // reuse the in-place sort, which already carries the spec's default
  // numeric-ascending comparator and NaN handling
  return typedArraySort.call(out, compareFn);
};

export const typedArrayWith = function (this: any, index: any, value: any) {
  const len = this.length;
  const relative = toInt(index);
  const actual = relative < 0 ? len + relative : relative;
  if (actual < 0 || actual >= len) {
    throw new RangeError("Invalid index");
  }
  const out = new this.constructor(len);
  for (let i = 0; i < len; i++) {
    out[i] = i === actual ? value : this[i];
  }
  return out;
};

export const typedArraySet = function (this: any, source: any, offset?: any) {
  const targetOffset = offset === undefined ? 0 : toInt(offset);
  if (targetOffset < 0) {
    throw new RangeError("offset is out of bounds");
  }
  const src = Object(source);
  const srcLength = src.length >>> 0;
  if (srcLength + targetOffset > this.length) {
    throw new RangeError("offset is out of bounds");
  }
  for (let i = 0; i < srcLength; i++) {
    this[targetOffset + i] = src[i];
  }
};

// Statics. `this` is the concrete constructor being called on.
export const typedArrayOf = function (this: any) {
  const len = arguments.length;
  const out = new this(len);
  for (let i = 0; i < len; i++) {
    out[i] = arguments[i];
  }
  return out;
};

export const typedArrayFrom = function (
  this: any,
  source: any,
  mapFn?: any,
  thisArg?: any,
) {
  if (mapFn !== undefined && typeof mapFn !== "function") {
    throw new TypeError("mapfn is not a function");
  }
  const src = Object(source);
  const items: any[] = [];
  const iteratorKey =
    typeof Symbol !== "undefined" && (Symbol as any).iterator
      ? (Symbol as any).iterator
      : undefined;
  if (iteratorKey && typeof src[iteratorKey] === "function") {
    const iterator = src[iteratorKey]();
    let step = iterator.next();
    while (!step.done) {
      items.push(step.value);
      step = iterator.next();
    }
  } else {
    const len = src.length >>> 0;
    for (let i = 0; i < len; i++) {
      items.push(src[i]);
    }
  }
  const out = new this(items.length);
  for (let i = 0; i < items.length; i++) {
    out[i] = mapFn ? mapFn.call(thisArg, items[i], i) : items[i];
  }
  return out;
};

if (!isModernSupported()) {
  const modernTypes = [
    typeof Uint8Array !== "undefined" ? Uint8Array : null,
    typeof Int8Array !== "undefined" ? Int8Array : null,
    typeof Uint16Array !== "undefined" ? Uint16Array : null,
    typeof Int16Array !== "undefined" ? Int16Array : null,
    typeof Uint32Array !== "undefined" ? Uint32Array : null,
    typeof Int32Array !== "undefined" ? Int32Array : null,
    typeof Float32Array !== "undefined" ? Float32Array : null,
    typeof Float64Array !== "undefined" ? Float64Array : null,
    typeof Uint8ClampedArray !== "undefined" ? Uint8ClampedArray : null,
  ];
  const modernMethods: [string, Function][] = [
    ["findLast", typedArrayFindLast],
    ["findLastIndex", typedArrayFindLastIndex],
    ["toReversed", typedArrayToReversed],
    ["toSorted", typedArrayToSorted],
    ["with", typedArrayWith],
  ];
  const modernStatics: [string, Function][] = [
    ["from", typedArrayFrom],
    ["of", typedArrayOf],
  ];
  // set() is special: unlike everything else here it already exists, so the
  // per-name presence check would skip it. Replace it only when the behavioural
  // probe above said the native one is wrong.
  const setIsBroken = (function () {
    try {
      if (typeof Uint8Array === "undefined") return false;
      new Uint8Array(2).set([1, 2, 3] as any);
      return true;
    } catch {
      return false;
    }
  })();

  for (let i = 0; i < modernTypes.length; i++) {
    const TypedArray = modernTypes[i] as any;
    if (!TypedArray) continue;
    const proto = TypedArray.prototype as any;
    for (let m = 0; m < modernMethods.length; m++) {
      const name = modernMethods[m][0];
      if (!proto[name]) {
        Object.defineProperty(modernMethods[m][1], "name", {
          value: name,
          configurable: true,
        });
        Object.defineProperty(proto, name, {
          value: modernMethods[m][1],
          writable: true,
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(proto[name] as any, "__polyfilled", {
          value: true,
        });
      }
    }
    if (setIsBroken) {
      Object.defineProperty(proto, "set", {
        value: typedArraySet,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      Object.defineProperty(proto.set, "name", {
        value: "set",
        configurable: true,
      });
      Object.defineProperty(proto.set as any, "__polyfilled", { value: true });
    }
    for (let s = 0; s < modernStatics.length; s++) {
      const name = modernStatics[s][0];
      if (!TypedArray[name]) {
        Object.defineProperty(modernStatics[s][1], "name", {
          value: name,
          configurable: true,
        });
        Object.defineProperty(TypedArray, name, {
          value: modernStatics[s][1],
          writable: true,
          enumerable: false,
          configurable: true,
        });
        Object.defineProperty(TypedArray[name] as any, "__polyfilled", {
          value: true,
        });
      }
    }
  }
}
