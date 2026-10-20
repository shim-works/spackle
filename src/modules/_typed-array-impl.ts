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

export const typedArrayFind = function (
  this: any,
  predicate: Function,
  thisArg?: any,
) {
  // spec: a non-callable predicate is a TypeError even on an empty array
  // inlined: assertCallable(predicate)
  if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
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
  // inlined: assertCallable(predicate)
  if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
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
  let n = fromIndex !== undefined ? +fromIndex : 0; // +x, not Number(x)
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
  // ToIntegerOrInfinity, not `| 0`: ToInt32 wrapped 2^32 back round to 0, so
  // at(4294967296) answered element 0 instead of undefined.
  const n = +index;
  let i = n !== n ? 0 : n < 0 ? Math.ceil(n) : Math.floor(n);
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
  // inlined: assertCallable(predicate)
  if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
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
  // inlined: assertCallable(predicate)
  if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
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
  // inlined: assertCallable(callback)
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
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
  // inlined: assertCallable(callback)
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
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
  // inlined: assertCallable(predicate)
  if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
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
  let n = 0;
  if (fromIndex !== undefined) {
    // inlined: toInt(fromIndex)
    n = +fromIndex;
    n = n !== n ? 0 : n >= 0 ? Math.floor(n) : Math.ceil(n);
  }
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
  let k = len - 1;
  if (arguments.length > 1) {
    // inlined: toInt(fromIndex)
    k = +fromIndex;
    k = k !== k ? 0 : k >= 0 ? Math.floor(k) : Math.ceil(k);
  }
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
  // inlined: joinInternal(this, sep, false)
  const ta = this;
  let out = "";
  for (let i = 0; i < ta.length; i++) {
    if (i > 0) out += sep;
    out += ta[i];
  }
  return out;
};

export const typedArrayToString = function (this: any) {
  // inlined: joinInternal(this, ",", false)
  const ta = this;
  let out = "";
  for (let i = 0; i < ta.length; i++) {
    if (i > 0) out += ",";
    out += ta[i];
  }
  return out;
};

export const typedArrayToLocaleString = function (this: any) {
  // inlined: joinInternal(this, ",", true)
  const ta = this;
  let out = "";
  for (let i = 0; i < ta.length; i++) {
    if (i > 0) out += ",";
    out += ta[i].toLocaleString();
  }
  return out;
};

export const typedArrayReduce = function (
  this: any,
  callback: Function,
  initialValue?: any,
) {
  // inlined: assertCallable(callback)
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
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
  // inlined: assertCallable(callback)
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
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
  // inlined: relativeIndex(start, len, 0)
  let from = 0;
  if (start !== undefined) {
    from = +start;
    from = from !== from ? 0 : from >= 0 ? Math.floor(from) : Math.ceil(from);
    from = from < 0 ? Math.max(len + from, 0) : Math.min(from, len);
  }
  // inlined: relativeIndex(end, len, len)
  let to = len;
  if (end !== undefined) {
    to = +end;
    to = to !== to ? 0 : to >= 0 ? Math.floor(to) : Math.ceil(to);
    to = to < 0 ? Math.max(len + to, 0) : Math.min(to, len);
  }
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
  // inlined: relativeIndex(target, len, 0)
  let to = 0;
  if (target !== undefined) {
    to = +target;
    to = to !== to ? 0 : to >= 0 ? Math.floor(to) : Math.ceil(to);
    to = to < 0 ? Math.max(len + to, 0) : Math.min(to, len);
  }
  // inlined: relativeIndex(start, len, 0)
  let from = 0;
  if (start !== undefined) {
    from = +start;
    from = from !== from ? 0 : from >= 0 ? Math.floor(from) : Math.ceil(from);
    from = from < 0 ? Math.max(len + from, 0) : Math.min(from, len);
  }
  // inlined: relativeIndex(end, len, len)
  let final = len;
  if (end !== undefined) {
    final = +end;
    final = final !== final ? 0 : final >= 0 ? Math.floor(final) : Math.ceil(final);
    final = final < 0 ? Math.max(len + final, 0) : Math.min(final, len);
  }
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
  // inlined: relativeIndex(start, len, 0)
  let from = 0;
  if (start !== undefined) {
    from = +start;
    from = from !== from ? 0 : from >= 0 ? Math.floor(from) : Math.ceil(from);
    from = from < 0 ? Math.max(len + from, 0) : Math.min(from, len);
  }
  // inlined: relativeIndex(end, len, len)
  let to = len;
  if (end !== undefined) {
    to = +end;
    to = to !== to ? 0 : to >= 0 ? Math.floor(to) : Math.ceil(to);
    to = to < 0 ? Math.max(len + to, 0) : Math.min(to, len);
  }
  for (let i = from; i < to; i++) {
    // assignment coerces per element type
    this[i] = value;
  }
  return this;
};

const returnSelfIterator = function (this: any) {
  return this;
};

// One prototype for every typed-array iterator, so _iterator-impl's splice has
// something to hang the helpers off (never Object.prototype).
const TypedArrayIteratorPrototype: any = {};

TypedArrayIteratorPrototype.next = function (this: any): any {
  const ta = this._ta;
  if (ta === null || this._index >= ta.length) {
    // Release at exhaustion so a spent iterator does not pin the buffer.
    this._ta = null;
    return { value: undefined, done: true };
  }
  const index = this._index++;
  const kind = this._kind;
  if (kind === 0) return { value: index, done: false };
  if (kind === 1) return { value: ta[index], done: false };
  return { value: [index, ta[index]], done: false };
};

if (typeof Symbol !== "undefined" && (Symbol as any).iterator) {
  Object.defineProperty(TypedArrayIteratorPrototype, (Symbol as any).iterator, {
    value: returnSelfIterator,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export const typedArrayKeys = function (this: any) {
  // inlined: createTypedArrayIterator(this, 0)
  const iterator: any = Object.create(TypedArrayIteratorPrototype);
  iterator._ta = this;
  iterator._index = 0;
  iterator._kind = 0;
  return iterator;
};

export const typedArrayValues = function (this: any) {
  // inlined: createTypedArrayIterator(this, 1)
  const iterator: any = Object.create(TypedArrayIteratorPrototype);
  iterator._ta = this;
  iterator._index = 0;
  iterator._kind = 1;
  return iterator;
};

export const typedArrayEntries = function (this: any) {
  // inlined: createTypedArrayIterator(this, 2)
  const iterator: any = Object.create(TypedArrayIteratorPrototype);
  iterator._ta = this;
  iterator._index = 0;
  iterator._kind = 2;
  return iterator;
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
    for (let i = 0; i < typedArrayTypes.length; i++) {
      const TypedArray = typedArrayTypes[i];
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
        Object.defineProperty(proto, "toString", {
          value: typedArrayToString,
          writable: true,
          enumerable: false,
          configurable: true,
        });
        try {
          Object.defineProperty(proto.toString, "name", {
            value: "toString",
            configurable: true,
          });
        } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
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
    return true;
  } catch {
    return false;
  }
};

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
  // inlined: toInt(index)
  let relative = +index;
  relative = relative !== relative ? 0 : relative >= 0 ? Math.floor(relative) : Math.ceil(relative);
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
  let targetOffset = 0;
  if (offset !== undefined) {
    // inlined: toInt(offset)
    targetOffset = +offset;
    targetOffset = targetOffset !== targetOffset ? 0 : targetOffset >= 0 ? Math.floor(targetOffset) : Math.ceil(targetOffset);
  }
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

export const install = (): void => {
  installTypedArrayPolyfill();
  installTypedArrayExtensionsOnNative();
};