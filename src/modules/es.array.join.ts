// Based on core-js (es.array.join)
const nativeJoin = Array.prototype.join;

const STOP = {};

// Behavioral: mirrors core-js's FORCED (inverted) -- ES3 engines with
// non-enumerable boxed strings, or a non-strict join, need the fill -- plus the
// length probe core-js doesn't have.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeJoin !== 'function') return false;
    // ES3_STRINGS check: modern engines enumerate boxed-string indices
    if (!Object('z').propertyIsEnumerable(0)) return false;
    // strict check: join must throw on a null this
    try {
      (nativeJoin as any).call(null, ',');
      return false;
    } catch {
      /* strict, as it should be */
    }
    // ToLength, not ToUint32 (Chrome < 45): a 32-bit native reads this length as
    // 1 and quietly returns 'a', where on a huge real length it would build a
    // string of ~2^32 separators (the Chrome 38 hang / OOM). A ToLength native
    // either goes on to index 1, whose getter throws, or (modern V8) refuses a
    // length past 2^32-1 up front with a RangeError: any throw means no wrap.
    const o: any = { length: 4294967297, 0: 'a' };
    Object.defineProperty(o, 1, { get: function () { throw STOP; }, configurable: true });
    try {
      (nativeJoin as any).call(o, ',');
      return false;
    } catch (e) {
      return true;
    }
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.join */

// ToString: String(symbol) returns "Symbol(...)"; the spec throws a TypeError.
const toStr = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return typeof value === 'string' ? value : String(value);
};

// Objects being joined right now. Every engine returns '' for an array-like
// already on this stack (a cycle) instead of recursing until the stack overflows.
const joining: any[] = [];
let depth = 0;

// The loop on its own, free of the try/catch below, so the engine can optimise it.
const joinLoop = function (O: any, len: number, sep: string): string {
  let result = '';
  for (let k = 0; k < len; k++) {
    if (k > 0) result += sep;
    const element = O[k];
    if (element !== null && element !== undefined) result += toStr(element);
  }
  return result;
};

export const arrayJoin = function join(this: any, separator?: any): string {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.join called on null or undefined');
  }
  // inlined: toIndexedObject(this) -- box, splitting a primitive string into an
  // index-accessible object so old non-enumerable-string engines behave
  const O = typeof this === 'string' ? (this as string).split('') : Object(this);
  // A real array's length is below 2^32, so ToUint32 and ToLength agree: the
  // native stays the fast path (and handles cycles itself); only array-likes
  // take the spec loop.
  if (Array.isArray(O)) return (nativeJoin as any).call(O, separator === undefined ? ',' : separator);
  // inlined: ToLength(Get(O, "length")) -- before the separator, as the spec orders it
  let len = +O.length;
  len = len !== len || len <= 0 ? 0 : len > 9007199254740991 ? 9007199254740991 : Math.floor(len);
  const sep = separator === undefined ? ',' : toStr(separator);
  for (let i = 0; i < depth; i++) {
    if (joining[i] === O) return '';
  }
  joining[depth++] = O;
  let result: string;
  try {
    result = joinLoop(O, len, sep);
  } catch (error) {
    joining[--depth] = undefined; // never pin it
    throw error;
  }
  joining[--depth] = undefined; // never pin it
  return result;
};
