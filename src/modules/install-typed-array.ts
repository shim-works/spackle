// ids: es.typed-array.at, es.typed-array.copy-within, es.typed-array.every,
//   es.typed-array.fill, es.typed-array.filter, es.typed-array.find, es.typed-array.find-index,
//   es.typed-array.find-last, es.typed-array.find-last-index, es.typed-array.float32-array,
//   es.typed-array.float64-array, es.typed-array.for-each, es.typed-array.from,
//   es.typed-array.includes, es.typed-array.index-of, es.typed-array.int16-array,
//   es.typed-array.int32-array, es.typed-array.int8-array, es.typed-array.iterator,
//   es.typed-array.join, es.typed-array.last-index-of, es.typed-array.map, es.typed-array.of,
//   es.typed-array.reduce, es.typed-array.reduce-right, es.typed-array.reverse,
//   es.typed-array.set, es.typed-array.slice, es.typed-array.some, es.typed-array.sort,
//   es.typed-array.to-locale-string, es.typed-array.to-reversed, es.typed-array.to-sorted,
//   es.typed-array.to-string, es.typed-array.uint16-array, es.typed-array.uint32-array,
//   es.typed-array.uint8-array, es.typed-array.uint8-clamped-array, es.typed-array.with
/**
 /**
  * Spec: https://tc39.es/ecma262/#sec-properties-of-the-%typedarrayprototype%-object
  *
  * One shared install for every es.typed-array.* id, with two gates:
  *  1. The ES2015 method suite, atomic on isSupported() (Chrome ~45+ / Safari 10+).
  *  2. The ES2023 additions and from/of statics, on isModernSupported(); an engine
  *     can have all of gate 1 and none of these.
  */

// %TypedArray% suite, probed via Uint8Array. toString/toLocaleString inherit
// from Object.prototype pre-ES2015, so compare identity, not typeof.
export const isSupported = (): boolean => {
  try {
    if (typeof Uint8Array === "undefined") {
      return false;
    }

    const prototype = Uint8Array.prototype as any;

    const allPresent =
      typeof prototype.find === "function" &&
      typeof prototype.findIndex === "function" &&
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
      prototype.toLocaleString !== Object.prototype.toLocaleString;

    if (!allPresent) {
      return false;
    }

    /*
     * Presence isn't enough: on Chrome 41 `new Int32Array([1,2,3]).map(...)` returns
     * undefined. Run a few methods and check the answers.
     */
    const sample = new Int32Array([1, 2, 3]);

    const mapped: any = (sample as any).map(function (v: number) {
      return v * 2;
    });
    if (!mapped || mapped.length !== 3 || mapped[0] !== 2 || mapped[2] !== 6) {
      return false;
    }

    const filtered: any = (sample as any).filter(function (v: number) {
      return v > 1;
    });
    if (!filtered || filtered.length !== 2 || filtered[0] !== 2) {
      return false;
    }

    if (
      (sample as any).find(function (v: number) {
        return v > 1;
      }) !== 2
    ) {
      return false;
    }

    if (
      (sample as any).reduce(function (a: number, b: number) {
        return a + b;
      }, 0) !== 6
    ) {
      return false;
    }

    if ((sample as any).slice(1).length !== 2) {
      return false;
    }
    if ((sample as any).join('-') !== '1-2-3') {
      return false;
    }
    if ((sample as any).indexOf(3) !== 2) {
      return false;
    }

    // keys/values/entries must hand back a real iterator, not a stub
    const iter: any = (sample as any).values();
    if (!iter || typeof iter.next !== 'function' || iter.next().value !== 1) {
      return false;
    }

    let seen = 0;
    (sample as any).forEach(function () {
      seen++;
    });
    return seen === 3;
  } catch {
    return false;
  }
};

/*
 * Shared spec machinery for this island (WET: no imports across islands).
 * Native probes are captured at load, before any user code can patch them.
 */
// The engine's own: install-polyfills.ts imports this island ahead of
// es.object.to-string, whose patch holds a try/catch old V8 won't optimise.
// Host typed arrays carry their class string natively, so no tag read needed.
const objectToString = Object.prototype.toString;
const hasOwn = Object.prototype.hasOwnProperty;
const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');
const getterOf = (owner: any, key: any): any => {
  try {
    const desc = owner && Object.getOwnPropertyDescriptor(owner, key);
    return desc && typeof desc.get === 'function' ? desc.get : undefined;
  } catch (e) {
    return undefined;
  }
};
const TA_NAMES = ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'Float16Array'];
const globalObject: any = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {});
// the intrinsic constructors by [[TypedArrayName]]
const intrinsicByName: any = {};
// [[TypedArrayName]] by class string, for ES5 engines: one lookup, where
// slicing the tag apart cost two new strings per validate().
const nameByTag: any = Object.create(null);
// Safari 7.1-8's typed array constructors are callable objects: typeof 'object'.
for (let i = 0; i < TA_NAMES.length; i++) {
  const C = globalObject[TA_NAMES[i]];
  if (C !== null && (typeof C === 'function' || typeof C === 'object') && C.prototype) {
    intrinsicByName[TA_NAMES[i]] = C;
    nameByTag['[object ' + TA_NAMES[i] + ']'] = TA_NAMES[i];
  }
}
const typedArrayProto: any =
  typeof Int8Array !== 'undefined' && Object.getPrototypeOf(Int8Array.prototype) !== Object.prototype
    ? Object.getPrototypeOf(Int8Array.prototype)
    : undefined;
const tagKey: any = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;
const nativeTagGetter: any = typedArrayProto && tagKey ? getterOf(typedArrayProto, tagKey) : undefined;
const nativeLengthGetter: any = typedArrayProto ? getterOf(typedArrayProto, 'length') : undefined;
const nativeBufferGetter: any = typedArrayProto ? getterOf(typedArrayProto, 'buffer') : undefined;
const detachedGetter: any = typeof ArrayBuffer !== 'undefined' ? getterOf(ArrayBuffer.prototype, 'detached') : undefined;

// [[TypedArrayName]], or undefined for anything that is not a typed array.
const typedArrayName = (O: any): string | undefined => {
  if (!isObject(O)) return undefined;
  if (nativeTagGetter) return nativeTagGetter.call(O);
  // ES5 engines: typed arrays are host objects with a class string
  return nameByTag[objectToString.call(O)];
};
const lengthOf = (O: any): number => (nativeLengthGetter ? nativeLengthGetter.call(O) : O.length);
const bufferOf = (O: any): any => (nativeBufferGetter ? nativeBufferGetter.call(O) : O.buffer);
const isDetached = (O: any): boolean => !!(detachedGetter && detachedGetter.call(bufferOf(O)));

// ValidateTypedArray: a typed array whose buffer is not detached; returns its length.
// Every method enters through here, so its helpers are inlined: one call, not six.
const validate = (O: any, method: string): number => {
  // inlined: typedArrayName(O), isObject(O)
  const name =
    O === null || (typeof O !== 'object' && typeof O !== 'function')
      ? undefined
      : nativeTagGetter
        ? nativeTagGetter.call(O)
        : nameByTag[objectToString.call(O)];
  if (name === undefined) {
    throw new TypeError('%TypedArray%.prototype.' + method + ': this is not a typed array');
  }
  // inlined: isDetached(O), bufferOf(O)
  if (detachedGetter && detachedGetter.call(nativeBufferGetter ? nativeBufferGetter.call(O) : O.buffer)) {
    throw new TypeError('%TypedArray%.prototype.' + method + ': the buffer is detached');
  }
  // inlined: lengthOf(O)
  return nativeLengthGetter ? nativeLengthGetter.call(O) : O.length;
};

const relativeIndex = (value: any, len: number): number => {
  // inlined: toIntegerOrInfinity(value)
  let rel = +value; // +x, not Number(x)
  rel = rel !== rel ? 0 : rel === Infinity || rel === -Infinity ? rel : rel < 0 ? Math.ceil(rel) : Math.floor(rel);
  return rel < 0 ? Math.max(len + rel, 0) : Math.min(rel, len);
};
// IsConstructor, best ES5 approximation (see es.array.from for the native probe)
// IsConstructor, plus the typed array constructors Safari 7.1-8 report as typeof 'object'.
const isConstructor = (C: any): boolean =>
  (typeof C === 'function' && (hasOwn.call(C, 'prototype') || /^bound /.test(C.name || ''))) ||
  (typeof C === 'object' && C !== null && isIntrinsicObject(C));
// Statics only (from/of/species), so a ten-name walk is fine.
function isIntrinsicObject(C: any): boolean {
  for (let i = 0; i < TA_NAMES.length; i++) if (intrinsicByName[TA_NAMES[i]] === C) return true;
  return false;
}

// TypedArrayCreateFromConstructor(C, [len]): construct, validate, check the length.
const createFromConstructor = (C: any, length: number): any => {
  const created = new C(length);
  if (typedArrayName(created) === undefined) throw new TypeError('the constructor did not make a typed array');
  if (isDetached(created)) throw new TypeError('the constructed typed array is detached');
  if (lengthOf(created) < length) throw new TypeError('the constructed typed array is too short');
  return created;
};

// TypedArraySpeciesCreate(exemplar, [len]) via SpeciesConstructor.
const speciesCreate = (O: any, length: number): any => {
  const defaultCtor = intrinsicByName[typedArrayName(O) as string];
  let C: any = O.constructor;
  if (C === undefined) {
    C = defaultCtor;
  } else {
    if (!isObject(C)) throw new TypeError('the typed array constructor is not an object');
    const S = typeof Symbol !== 'undefined' && (Symbol as any).species ? C[(Symbol as any).species] : undefined;
    if (S === undefined || S === null) C = defaultCtor;
    else if (isConstructor(S)) C = S;
    else throw new TypeError('the typed array @@species is not a constructor');
  }
  return createFromConstructor(C, length);
};

// TypedArrayCreateSameType: the intrinsic constructor, never @@species.
const createSameType = (O: any, length: number): any => new intrinsicByName[typedArrayName(O) as string](length);

// %TypedArray% default comparator: numeric ascending, -0 before +0, NaN last.
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
let activeCompareFn: any;
const userCompare = (a: any, b: any): number => {
  const v = +activeCompareFn(a, b);
  return v === v ? v : 0;
};
// Stable merge sort over null-prototype lists (spec-internal: no setter may run).
const sortList = (items: any, length: number, compare: (a: any, b: any) => number): any => {
  if (length < 2) return items;
  let source = items;
  let target: any = Object.create(null);
  for (let width = 1; width < length; width *= 2) {
    for (let start = 0; start < length; start += width * 2) {
      let left = start;
      const middle = start + width < length ? start + width : length;
      let right = middle;
      const end = start + width * 2 < length ? start + width * 2 : length;
      let out = start;
      while (left < middle && right < end) {
        if (compare(source[left], source[right]) <= 0) target[out++] = source[left++];
        else target[out++] = source[right++];
      }
      while (left < middle) target[out++] = source[left++];
      while (right < end) target[out++] = source[right++];
    }
    const swap = source;
    source = target;
    target = swap;
  }
  return source;
};
const sortedList = (O: any, len: number, comparefn: any): any => {
  let items: any = Object.create(null);
  for (let i = 0; i < len; i++) items[i] = O[i];
  if (comparefn === undefined) return sortList(items, len, defaultSortCompare);
  const saved = activeCompareFn;
  activeCompareFn = comparefn;
  try {
    items = sortList(items, len, userCompare);
  } finally {
    activeCompareFn = saved;
  }
  return items;
};

// Declared (callbackfn) for the spec length of 1 throughout; thisArg from arguments.
export const typedArrayFind = function find(this: any, callbackfn: any) {
  const len = validate(this, 'find');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = 0; k < len; k++) {
    const kValue = this[k];
    if (callbackfn.call(thisArg, kValue, k, this)) return kValue;
  }
  return undefined;
};

export const typedArrayFindIndex = function findIndex(this: any, callbackfn: any) {
  const len = validate(this, 'findIndex');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = 0; k < len; k++) {
    if (callbackfn.call(thisArg, this[k], k, this)) return k;
  }
  return -1;
};

// Declared (searchElement) for the spec length of 1; fromIndex from arguments.
export const typedArrayIncludes = function includes(this: any, searchElement: any) {
  const len = validate(this, 'includes');
  // an empty array answers false before fromIndex is converted
  if (len === 0) return false;
  // inlined: toIntegerOrInfinity((arguments.length > 1 ? arguments[1] : undefined))
  let n = +(arguments.length > 1 ? arguments[1] : undefined); // +x, not Number(x)
  n = n !== n ? 0 : n === Infinity || n === -Infinity ? n : n < 0 ? Math.ceil(n) : Math.floor(n);
  if (n === Infinity) return false;
  if (n === -Infinity) n = 0;
  for (let k = n >= 0 ? n : Math.max(len + n, 0); k < len; k++) {
    const el = this[k];
    if (el === searchElement || (el !== el && searchElement !== searchElement)) return true;
  }
  return false;
};

export const typedArrayAt = function at(this: any, index: any) {
  const len = validate(this, 'at');
  // inlined: toIntegerOrInfinity(index)
  let rel = +index; // +x, not Number(x)
  rel = rel !== rel ? 0 : rel === Infinity || rel === -Infinity ? rel : rel < 0 ? Math.ceil(rel) : Math.floor(rel);
  const k = rel >= 0 ? rel : len + rel;
  if (k < 0 || k >= len) return undefined;
  return this[k];
};

export const typedArrayEvery = function every(this: any, callbackfn: any) {
  const len = validate(this, 'every');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = 0; k < len; k++) {
    if (!callbackfn.call(thisArg, this[k], k, this)) return false;
  }
  return true;
};

export const typedArraySome = function some(this: any, callbackfn: any) {
  const len = validate(this, 'some');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = 0; k < len; k++) {
    if (callbackfn.call(thisArg, this[k], k, this)) return true;
  }
  return false;
};

export const typedArrayForEach = function forEach(this: any, callbackfn: any) {
  const len = validate(this, 'forEach');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = 0; k < len; k++) callbackfn.call(thisArg, this[k], k, this);
  return undefined;
};

export const typedArrayMap = function map(this: any, callbackfn: any) {
  const len = validate(this, 'map');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  const A = speciesCreate(this, len);
  for (let k = 0; k < len; k++) {
    // assignment converts per element type, matching the spec's Set
    A[k] = callbackfn.call(thisArg, this[k], k, this);
  }
  return A;
};

export const typedArrayFilter = function filter(this: any, callbackfn: any) {
  const len = validate(this, 'filter');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  // internal list: the kept count is unknowable without running the predicate twice
  const kept: any = Object.create(null);
  let captured = 0;
  for (let k = 0; k < len; k++) {
    const kValue = this[k];
    if (callbackfn.call(thisArg, kValue, k, this)) kept[captured++] = kValue;
  }
  const A = speciesCreate(this, captured);
  for (let n = 0; n < captured; n++) A[n] = kept[n];
  return A;
};

// Declared (searchElement) for the spec length of 1; fromIndex from arguments.
export const typedArrayIndexOf = function indexOf(this: any, searchElement: any) {
  const len = validate(this, 'indexOf');
  if (len === 0) return -1;
  // inlined: toIntegerOrInfinity((arguments.length > 1 ? arguments[1] : undefined))
  let n = +(arguments.length > 1 ? arguments[1] : undefined); // +x, not Number(x)
  n = n !== n ? 0 : n === Infinity || n === -Infinity ? n : n < 0 ? Math.ceil(n) : Math.floor(n);
  if (n === Infinity) return -1;
  if (n === -Infinity) n = 0;
  for (let k = n >= 0 ? n : Math.max(len + n, 0); k < len; k++) {
    // strict equality: NaN never matches, -0 === +0; + 0 so the result is never -0
    if (k in this && this[k] === searchElement) return k + 0;
  }
  return -1;
};

export const typedArrayLastIndexOf = function lastIndexOf(this: any, searchElement: any) {
  const len = validate(this, 'lastIndexOf');
  if (len === 0) return -1;
  let n = len - 1;
  if (arguments.length > 1) {
    // inlined: toIntegerOrInfinity(arguments[1])
    n = +arguments[1]; // +x, not Number(x)
    n = n !== n ? 0 : n === Infinity || n === -Infinity ? n : n < 0 ? Math.ceil(n) : Math.floor(n);
  }
  if (n === -Infinity) return -1;
  for (let k = n >= 0 ? Math.min(n, len - 1) : len + n; k >= 0; k--) {
    if (k in this && this[k] === searchElement) return k + 0;
  }
  return -1;
};

export const typedArrayJoin = function join(this: any, separator?: any) {
  const len = validate(this, 'join');
  // inlined: toStr(separator), toStr(element) -- String(symbol) returns
  // "Symbol(...)"; the spec throws
  if (typeof separator === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const sep = separator === undefined ? ',' : typeof separator === 'string' ? separator : String(separator);
  let out = '';
  for (let k = 0; k < len; k++) {
    if (k > 0) out += sep;
    const element = this[k];
    if (element !== undefined) {
      if (typeof element === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      out += typeof element === 'string' ? element : String(element);
    }
  }
  return out;
};

export const typedArrayToString = function toString(this: any) {
  return typedArrayJoin.call(this);
};

export const typedArrayToLocaleString = function toLocaleString(this: any) {
  const len = validate(this, 'toLocaleString');
  let out = '';
  for (let k = 0; k < len; k++) {
    if (k > 0) out += ',';
    const element = this[k];
    if (element !== undefined && element !== null) {
      // inlined: toStr(element.toLocaleString())
      const local = element.toLocaleString();
      if (typeof local === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      out += typeof local === 'string' ? local : String(local);
    }
  }
  return out;
};

export const typedArrayReduce = function reduce(this: any, callbackfn: any) {
  const len = validate(this, 'reduce');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  let k = 0;
  let accumulator: any;
  if (arguments.length > 1) {
    accumulator = arguments[1];
  } else {
    if (len === 0) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = this[0];
    k = 1;
  }
  for (; k < len; k++) accumulator = callbackfn(accumulator, this[k], k, this);
  return accumulator;
};

export const typedArrayReduceRight = function reduceRight(this: any, callbackfn: any) {
  const len = validate(this, 'reduceRight');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  let k = len - 1;
  let accumulator: any;
  if (arguments.length > 1) {
    accumulator = arguments[1];
  } else {
    if (len === 0) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = this[k];
    k--;
  }
  for (; k >= 0; k--) accumulator = callbackfn(accumulator, this[k], k, this);
  return accumulator;
};

export const typedArrayReverse = function reverse(this: any) {
  const len = validate(this, 'reverse');
  for (let lower = 0, upper = len - 1; lower < upper; lower++, upper--) {
    const tmp = this[lower];
    this[lower] = this[upper];
    this[upper] = tmp;
  }
  return this;
};

export const typedArraySlice = function slice(this: any, start?: any, end?: any) {
  const len = validate(this, 'slice');
  const from = relativeIndex(start, len);
  const to = end === undefined ? len : relativeIndex(end, len);
  const count = Math.max(to - from, 0);
  const A = speciesCreate(this, count);
  if (count > 0) {
    if (isDetached(this)) throw new TypeError('%TypedArray%.prototype.slice: the buffer was detached');
    const finalIndex = Math.min(to, lengthOf(this));
    for (let k = from, n = 0; k < finalIndex; k++, n++) A[n] = this[k];
  }
  return A;
};

export const typedArraySort = function sort(this: any, comparefn?: any) {
  if (comparefn !== undefined && typeof comparefn !== 'function') {
    throw new TypeError('The comparison function must be either a function or undefined');
  }
  const len = validate(this, 'sort');
  const items = sortedList(this, len, comparefn);
  for (let k = 0; k < len; k++) this[k] = items[k];
  return this;
};

// Declared (target, start) for the spec length of 2; end from arguments.
export const typedArrayCopyWithin = function copyWithin(this: any, target: any, start: any) {
  const len = validate(this, 'copyWithin');
  let to = relativeIndex(target, len);
  let from = relativeIndex(start, len);
  const end = arguments.length > 2 ? arguments[2] : undefined;
  const final = end === undefined ? len : relativeIndex(end, len);
  let count = Math.min(final - from, len - to);
  if (count > 0) {
    if (isDetached(this)) throw new TypeError('%TypedArray%.prototype.copyWithin: the buffer was detached');
    count = Math.min(count, lengthOf(this) - from, lengthOf(this) - to);
    if (from < to && to < from + count) {
      // overlapping forward copy would clobber the source -- copy backwards
      for (let i = count - 1; i >= 0; i--) this[to + i] = this[from + i];
    } else {
      for (let i = 0; i < count; i++) this[to + i] = this[from + i];
    }
  }
  return this;
};

// Declared (value) for the spec length of 1; start and end from arguments.
export const typedArrayFill = function fill(this: any, value: any) {
  const len = validate(this, 'fill');
  // ToNumber(value) once, before the range arguments
  const numericValue = +value;
  const start = arguments.length > 1 ? arguments[1] : undefined;
  const end = arguments.length > 2 ? arguments[2] : undefined;
  const k = relativeIndex(start, len);
  const final = end === undefined ? len : relativeIndex(end, len);
  if (isDetached(this)) throw new TypeError('%TypedArray%.prototype.fill: the buffer was detached');
  const stop = Math.min(final, lengthOf(this));
  for (let i = k; i < stop; i++) this[i] = numericValue;
  return this;
};

/*
 * keys/values/entries: CreateArrayIterator(O, kind), i.e. %ArrayIteratorPrototype%.
 * The Array.prototype ones produce exactly that (native, or spackle's es.array
 * iterator), and they read the length each step as the spec's does.
 */
const arrayIteratorMethod = (name: string): any => {
  const fn = (Array.prototype as any)[name];
  return typeof fn === 'function' ? fn : undefined;
};
const returnSelfIterator = function (this: any) {
  return this;
};
// Fallback for engines with no Array iterators at all: one shared prototype.
const TypedArrayIteratorPrototype: any = {};
Object.defineProperty(TypedArrayIteratorPrototype, 'next', {
  value: function next(this: any): any {
    if (this === null || typeof this !== 'object' || !hasOwn.call(this, '_kind')) {
      throw new TypeError('next method called on an object that is not an Array Iterator');
    }
    const ta = this._ta;
    if (ta === null || this._index >= lengthOf(ta)) {
      // Release at exhaustion so a spent iterator does not pin the buffer.
      this._ta = null;
      return { value: undefined, done: true };
    }
    const index = this._index++;
    const kind = this._kind;
    if (kind === 0) return { value: index, done: false };
    if (kind === 1) return { value: ta[index], done: false };
    return { value: [index, ta[index]], done: false };
  },
  writable: true,
  enumerable: false,
  configurable: true,
});
if (typeof Symbol !== 'undefined' && (Symbol as any).iterator) {
  Object.defineProperty(TypedArrayIteratorPrototype, (Symbol as any).iterator, {
    value: returnSelfIterator,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
const ITER_SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: false };
const makeIterator = (O: any, kind: number): any => {
  const iterator: any = Object.create(TypedArrayIteratorPrototype);
  ITER_SLOT.value = O;
  Object.defineProperty(iterator, '_ta', ITER_SLOT);
  ITER_SLOT.value = 0;
  Object.defineProperty(iterator, '_index', ITER_SLOT);
  ITER_SLOT.value = kind;
  Object.defineProperty(iterator, '_kind', ITER_SLOT);
  ITER_SLOT.value = undefined;
  return iterator;
};

export const typedArrayKeys = function keys(this: any) {
  validate(this, 'keys');
  const fn = arrayIteratorMethod('keys');
  return fn ? fn.call(this) : makeIterator(this, 0);
};

export const typedArrayValues = function values(this: any) {
  validate(this, 'values');
  const fn = arrayIteratorMethod('values');
  return fn ? fn.call(this) : makeIterator(this, 1);
};

export const typedArrayEntries = function entries(this: any) {
  validate(this, 'entries');
  const fn = arrayIteratorMethod('entries');
  return fn ? fn.call(this) : makeIterator(this, 2);
};

const installTypedArrayPolyfill = (): void => {
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
    // Where %TypedArray% exists the members belong on it (and every concrete
    // type, Float16Array included, inherits them); only engines without one get
    // a copy per concrete prototype.
    const typedArrayTypesTargets: any[] = typedArrayProto ? [Object.getPrototypeOf(Int8Array)] : typedArrayTypes;
    for (let i = 0; i < typedArrayTypesTargets.length; i++) {
      const TypedArray = typedArrayTypesTargets[i];
      if (!TypedArray) continue;
      const proto = TypedArray.prototype as any;
      for (let m = 0; m < typedArrayMethods.length; m++) {
        const name = typedArrayMethods[m][0];
        /*
         * Overwrite even when present: this only runs when isSupported() found the
         * suite defective (Chrome 41's map/filter/find exist but are broken).
         */
        {
          try {
            Object.defineProperty(typedArrayMethods[m][1], "name", {
              value: name,
              configurable: true,
            });
          } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
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
      // compare identity: these inherit from Object.prototype pre-ES2015
      if (proto.toString === Object.prototype.toString) {
        // %TypedArray%.prototype.toString is the same function object as
        // Array.prototype.toString -- a native, so it is neither renamed nor marked
        Object.defineProperty(proto, "toString", {
          value: Array.prototype.toString,
          writable: true,
          enumerable: false,
          configurable: true,
        });
      }
      if (proto.toLocaleString === Object.prototype.toLocaleString) {
        Object.defineProperty(proto, "toLocaleString", {
          value: typedArrayToLocaleString,
          writable: true,
          enumerable: false,
          configurable: true,
        });
        try {
          Object.defineProperty(proto.toLocaleString, "name", {
            value: "toLocaleString",
            configurable: true,
          });
        } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
        Object.defineProperty(proto.toLocaleString as any, "__polyfilled", {
          value: true,
        });
      }
      // for...of support — wire Symbol.iterator to values when a Symbol exists
      // (native, or installed earlier in this run).
      if (
        typeof Symbol !== "undefined" &&
        (Symbol as any).iterator
      ) {
        // @@iterator is the very same function as values
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
};

// ES2023 additions and the from/of statics: gate 2 (see the header).

export const isModernSupported = (): boolean => {
  try {
    if (typeof Uint8Array === "undefined") {
      return false;
    }
    const prototype = Uint8Array.prototype as any;
    if (
      // at (ES2022) and includes (ES2016) live here, not in the ES2015 gate:
      // requiring them there failed Safari 10-15.3 and replaced 22 working
      // natives to supply two missing ones.
      typeof prototype.at !== "function" ||
      typeof prototype.includes !== "function" ||
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
    // core-js's es.typed-array.set probes: array-likes at an offset, and ToObject
    // on primitives (V8 issue 11294)
    try {
      const clamped = new Uint8ClampedArray(2);
      clamped.set({ length: 1, 0: 3 } as any, 1);
      const int8 = new Int8Array(2);
      int8.set(1 as any);
      int8.set('2' as any, 1);
      if (clamped[1] !== 3 || int8[0] !== 0 || int8[1] !== 2) return false;
    } catch {
      return false;
    }
    // core-js's es.typed-array.fill CONVERSION_BUG and es.typed-array.sort probes
    // (see installTypedArrayExtensionsOnNative)
    try {
      let count = 0;
      new Int8Array(2).fill({ valueOf: function () { return count++; } } as any);
      if (count !== 1) return false;
    } catch {
      return false;
    }
    const nativeSort = (Uint16Array.prototype as any).sort;
    let threwNull = false;
    let threwObject = false;
    try { nativeSort.call(new Uint16Array(2), null); } catch (e) { threwNull = true; }
    try { nativeSort.call(new Uint16Array(2), {}); } catch (e) { threwObject = true; }
    if (!threwNull || !threwObject) return false;
    try {
      const array = new Uint16Array(516);
      for (let index = 0; index < 516; index++) array[index] = 515 - index;
      nativeSort.call(array, function (a: number, b: number) { return ((a / 4) | 0) - ((b / 4) | 0); });
      for (let index = 0; index < 516; index++) {
        if (array[index] !== index - 2 * (index % 4) + 3) return false;
      }
    } catch {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const typedArrayFindLast = function findLast(this: any, callbackfn: any) {
  const len = validate(this, 'findLast');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = len - 1; k >= 0; k--) {
    const kValue = this[k];
    if (callbackfn.call(thisArg, kValue, k, this)) return kValue;
  }
  return undefined;
};

export const typedArrayFindLastIndex = function findLastIndex(this: any, callbackfn: any) {
  const len = validate(this, 'findLastIndex');
  if (typeof callbackfn !== 'function') throw new TypeError('callback is not a function');
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  for (let k = len - 1; k >= 0; k--) {
    if (callbackfn.call(thisArg, this[k], k, this)) return k;
  }
  return -1;
};

export const typedArrayToReversed = function toReversed(this: any) {
  const len = validate(this, 'toReversed');
  const A = createSameType(this, len);
  for (let k = 0; k < len; k++) A[k] = this[len - k - 1];
  return A;
};

export const typedArrayToSorted = function toSorted(this: any, comparefn?: any) {
  if (comparefn !== undefined && typeof comparefn !== 'function') {
    throw new TypeError('The comparison function must be either a function or undefined');
  }
  const len = validate(this, 'toSorted');
  const A = createSameType(this, len);
  const items = sortedList(this, len, comparefn);
  for (let k = 0; k < len; k++) A[k] = items[k];
  return A;
};

export const typedArrayWith = function (this: any, index: any, value: any) {
  const len = validate(this, 'with');
  // inlined: toIntegerOrInfinity(index)
  let rel = +index; // +x, not Number(x)
  rel = rel !== rel ? 0 : rel === Infinity || rel === -Infinity ? rel : rel < 0 ? Math.ceil(rel) : Math.floor(rel);
  const actual = rel >= 0 ? rel : len + rel;
  // the value is converted before the index is range-checked
  const numericValue = +value;
  if (actual < 0 || actual >= lengthOf(this) || isDetached(this)) {
    throw new RangeError('Invalid typed array index');
  }
  const A = createSameType(this, len);
  for (let k = 0; k < len; k++) A[k] = k === actual ? numericValue : this[k];
  return A;
};

// Declared (source) for the spec length of 1; offset from arguments.
export const typedArraySet = function (this: any, source: any) {
  if (typedArrayName(this) === undefined) {
    throw new TypeError('%TypedArray%.prototype.set: this is not a typed array');
  }
  // inlined: toIntegerOrInfinity((arguments.length > 1 ? arguments[1] : undefined))
  let targetOffset = +(arguments.length > 1 ? arguments[1] : undefined); // +x, not Number(x)
  targetOffset = targetOffset !== targetOffset ? 0 : targetOffset === Infinity || targetOffset === -Infinity ? targetOffset : targetOffset < 0 ? Math.ceil(targetOffset) : Math.floor(targetOffset);
  if (targetOffset < 0) throw new RangeError('offset is out of bounds');
  if (isDetached(this)) throw new TypeError('%TypedArray%.prototype.set: the buffer is detached');
  const targetLength = lengthOf(this);
  if (typedArrayName(source) !== undefined) {
    // SetTypedArrayFromTypedArray: read every value first, so a source sharing
    // this buffer is copied as if through a temporary
    if (isDetached(source)) throw new TypeError('%TypedArray%.prototype.set: the source buffer is detached');
    const srcLength = lengthOf(source);
    if (targetOffset === Infinity || srcLength + targetOffset > targetLength) throw new RangeError('offset is out of bounds');
    const values: any = Object.create(null);
    for (let k = 0; k < srcLength; k++) values[k] = source[k];
    for (let k = 0; k < srcLength; k++) this[targetOffset + k] = values[k];
    return undefined;
  }
  // SetTypedArrayFromArrayLike
  const src = Object(source);
  let srcLength = +src.length;
  srcLength = srcLength !== srcLength || srcLength <= 0 ? 0 : srcLength > 9007199254740991 ? 9007199254740991 : Math.floor(srcLength);
  if (targetOffset === Infinity || srcLength + targetOffset > targetLength) throw new RangeError('offset is out of bounds');
  for (let k = 0; k < srcLength; k++) this[targetOffset + k] = src[k];
  return undefined;
};

// Statics. `this` is the constructor being called on.
export const typedArrayOf = function of(this: any) {
  const C = this;
  if (!isConstructor(C)) throw new TypeError('%TypedArray%.of: this is not a constructor');
  const len = arguments.length;
  const newObj = createFromConstructor(C, len);
  for (let k = 0; k < len; k++) newObj[k] = arguments[k];
  return newObj;
};

// Declared (source) for the spec length of 1; mapfn and thisArg from arguments.
export const typedArrayFrom = function from(this: any, source: any) {
  const C = this;
  if (!isConstructor(C)) throw new TypeError('%TypedArray%.from: this is not a constructor');
  const mapfn = arguments.length > 1 ? arguments[1] : undefined;
  const thisArg = arguments.length > 2 ? arguments[2] : undefined;
  if (mapfn !== undefined && typeof mapfn !== 'function') throw new TypeError('mapfn is not a function');
  const iteratorKey = typeof Symbol !== 'undefined' && (Symbol as any).iterator ? (Symbol as any).iterator : undefined;
  let usingIterator: any = iteratorKey && source !== null && source !== undefined ? source[iteratorKey] : undefined;
  if (usingIterator === null) usingIterator = undefined;
  if (usingIterator !== undefined) {
    if (typeof usingIterator !== 'function') throw new TypeError('%TypedArray%.from: @@iterator is not a function');
    // IteratorToList first: every value is read before the target exists
    const iterator = usingIterator.call(source);
    if (!isObject(iterator)) throw new TypeError('Result of the Symbol.iterator method is not an object');
    const next = iterator.next;
    const values: any = Object.create(null);
    let len = 0;
    for (;;) {
      const step = next.call(iterator);
      if (!isObject(step)) throw new TypeError('Iterator result is not an object');
      if (step.done) break;
      values[len++] = step.value;
    }
    const target = createFromConstructor(C, len);
    for (let k = 0; k < len; k++) target[k] = mapfn !== undefined ? mapfn.call(thisArg, values[k], k) : values[k];
    return target;
  }
  if (source === null || source === undefined) throw new TypeError('%TypedArray%.from: source is null or undefined');
  const arrayLike = Object(source);
  let len = +arrayLike.length;
  len = len !== len || len <= 0 ? 0 : len > 9007199254740991 ? 9007199254740991 : Math.floor(len);
  const target = createFromConstructor(C, len);
  for (let k = 0; k < len; k++) {
    const kValue = arrayLike[k];
    target[k] = mapfn !== undefined ? mapfn.call(thisArg, kValue, k) : kValue;
  }
  return target;
};

const installTypedArrayExtensionsOnNative = (): void => {
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
      ["at", typedArrayAt],
      ["includes", typedArrayIncludes],
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
    // core-js's es.typed-array.fill CONVERSION_BUG (V8 < Chrome 59, Safari < 14.1):
    // the value must be converted once, before start and end.
    const fillIsBroken = (function () {
      if (typeof Int8Array === "undefined") return false;
      try {
        let count = 0;
        new Int8Array(2).fill({ valueOf: function () { return count++; } } as any);
        return count !== 1;
      } catch (e) {
        return true;
      }
    })();
    // core-js's es.typed-array.sort: a comparator that is neither undefined nor
    // callable must throw (WebKit accepts null and objects), and the sort must be
    // stable (V8 < 7.4, WebKit < 602). core-js checks stability by engine version
    // where it can; this runs its behavioural fallback, 516 elements, everywhere.
    const sortIsBroken = (function () {
      if (typeof Uint16Array === "undefined") return false;
      const nativeSort = (Uint16Array.prototype as any).sort;
      if (typeof nativeSort !== "function") return false;
      let threwNull = false;
      let threwObject = false;
      try { nativeSort.call(new Uint16Array(2), null); } catch (e) { threwNull = true; }
      try { nativeSort.call(new Uint16Array(2), {}); } catch (e) { threwObject = true; }
      if (!threwNull || !threwObject) return true;
      try {
        const array = new Uint16Array(516);
        for (let index = 0; index < 516; index++) array[index] = 515 - index;
        nativeSort.call(array, function (a: number, b: number) { return ((a / 4) | 0) - ((b / 4) | 0); });
        for (let index = 0; index < 516; index++) {
          if (array[index] !== index - 2 * (index % 4) + 3) return true;
        }
        return false;
      } catch (e) {
        return true;
      }
    })();
    // set() is special: unlike everything else here it already exists, so the
    // per-name presence check would skip it. Replace it only when the behavioural
    // probe above said the native one is wrong.
    const setIsBroken = (function () {
      if (typeof Uint8Array === "undefined") return false;
      // core-js's es.typed-array.set probes: array-likes at an offset, and ToObject
      // on primitives (Chrome 41 throws "invalid_argument"; V8 issue 11294)
      try {
        const clamped = new Uint8ClampedArray(2);
        clamped.set({ length: 1, 0: 3 } as any, 1);
        const int8 = new Int8Array(2);
        int8.set(1 as any);
        int8.set('2' as any, 1);
        if (clamped[1] !== 3 || int8[0] !== 0 || int8[1] !== 2) return true;
      } catch {
        return true;
      }
      // and a source that doesn't fit must throw RangeError, not truncate
      try {
        new Uint8Array(2).set([1, 2, 3] as any);
        return true;
      } catch {
        return false;
      }
    })();

    // Where %TypedArray% exists the members belong on it (and every concrete
    // type, Float16Array included, inherits them); only engines without one get
    // a copy per concrete prototype.
    const modernTypesTargets: any[] = typedArrayProto ? [Object.getPrototypeOf(Int8Array)] : modernTypes;
    for (let i = 0; i < modernTypesTargets.length; i++) {
      const TypedArray = modernTypesTargets[i] as any;
      if (!TypedArray) continue;
      const proto = TypedArray.prototype as any;
      for (let m = 0; m < modernMethods.length; m++) {
        const name = modernMethods[m][0];
        if (!proto[name]) {
          try {
            Object.defineProperty(modernMethods[m][1], "name", {
              value: name,
              configurable: true,
            });
          } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
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
        try {
          Object.defineProperty(proto.set, "name", {
            value: "set",
            configurable: true,
          });
        } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
        Object.defineProperty(proto.set as any, "__polyfilled", { value: true });
      }
      // fill and sort exist too: replaced only where core-js's probes above fail
      const patches: [boolean, string, Function][] = [[fillIsBroken, "fill", typedArrayFill], [sortIsBroken, "sort", typedArraySort]];
      for (let p = 0; p < patches.length; p++) {
        if (!patches[p][0]) continue;
        const name = patches[p][1];
        Object.defineProperty(proto, name, { value: patches[p][2], writable: true, enumerable: false, configurable: true });
        try {
          Object.defineProperty(proto[name], "name", { value: name, configurable: true });
        } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
        try {
          Object.defineProperty(proto[name] as any, "__polyfilled", { value: true });
        } catch (e) { /* already stamped: the same function on another prototype */ }
      }
      for (let s = 0; s < modernStatics.length; s++) {
        const name = modernStatics[s][0];
        if (!TypedArray[name]) {
          try {
            Object.defineProperty(modernStatics[s][1], "name", {
              value: name,
              configurable: true,
            });
          } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
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
};

/*
 * One %ArrayIteratorPrototype%: when es.array.iterator had to replace the array
 * iterators, typed arrays must iterate through the same prototype, so their
 * keys/values/entries/@@iterator follow (they delegate to the Array ones).
 */
const unifyIterators = (): void => {
  const arrayValues = (Array.prototype as any).values;
  if (!arrayValues || arrayValues.__polyfilled !== true) return;
  const targets: any[] = typedArrayProto
    ? [typedArrayProto]
    : TA_NAMES.map(function (name: string) { return intrinsicByName[name] ? intrinsicByName[name].prototype : null; });
  const methods: [string, any][] = [['keys', typedArrayKeys], ['values', typedArrayValues], ['entries', typedArrayEntries]];
  for (let t = 0; t < targets.length; t++) {
    const proto = targets[t];
    if (!proto || (proto.values && proto.values.__polyfilled === true)) continue;
    for (let m = 0; m < methods.length; m++) {
      try {
        Object.defineProperty(methods[m][1], 'name', { value: methods[m][0], configurable: true });
      } catch (e) { /* Function#name non-configurable pre-ES6 */ }
      Object.defineProperty(proto, methods[m][0], { value: methods[m][1], writable: true, enumerable: false, configurable: true });
      try {
        Object.defineProperty(methods[m][1], '__polyfilled', { value: true });
      } catch (e) { /* already marked */ }
    }
    if (typeof Symbol !== 'undefined' && (Symbol as any).iterator) {
      Object.defineProperty(proto, (Symbol as any).iterator, { value: typedArrayValues, writable: true, enumerable: false, configurable: true });
    }
  }
};

export const installTypedArray = (): void => {
  installTypedArrayPolyfill();
  installTypedArrayExtensionsOnNative();
  unifyIterators();
};