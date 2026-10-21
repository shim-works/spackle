// Based on core-js (es.array.push)
const nativePush = Array.prototype.push;

// Behavioral: real in-range bug. V8 <= 121 / Safari <= 15.4 don't throw on a
// non-writable length, and some engines mis-compute ToLength past 2^32.
// Mirrors core-js's FORCED (inverted).
export const isSupported = (): boolean => {
  try {
    if (typeof nativePush !== 'function') return false;
    // ToLength correctness: pushing onto {length: 2^32} yields 2^32 + 1
    if ((nativePush as any).call({ length: 0x100000000 }, 1) !== 4294967297) return false;
    // must throw TypeError on a non-writable length
    try {
      (Object.defineProperty([], 'length', { writable: false }) as any).push();
      return false;
    } catch (error) {
      return error instanceof TypeError;
    }
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.push */
// Declared (item) only, for the spec length of 1; every argument comes from arguments.
export const arrayPush = function push(this: any, _item?: any): number {
  // inlined: toObject(this)
  if (this === null || this === undefined) throw new TypeError('Cannot convert undefined or null to object');
  const O = Object(this);
  // inlined: toLength(O.length)
  let len = +O.length;
  len = len !== len || len <= 0 ? 0 : len > 9007199254740991 ? 9007199254740991 : Math.floor(len);
  const argCount = arguments.length;
  // inlined: doesNotExceedSafeInteger(len + argCount)
  if (len + argCount > 9007199254740991) throw new TypeError('Maximum allowed index exceeded');
  for (let i = 0; i < argCount; i++) {
    O[len] = arguments[i];
    len++;
  }
  // inlined: setArrayLength(O, len) -- write, then read back (no descriptor
  // allocated); a non-writable length keeps the old value.
  O.length = len;
  if (O.length !== len && Array.isArray(O)) throw new TypeError('Cannot set read only .length');
  return len;
};

