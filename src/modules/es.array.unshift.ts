// Based on core-js (es.array.unshift)
const nativeUnshift = Array.prototype.unshift;

// Behavioral: real in-range bug. V8 ~ Chrome < 71 / Safari <= 15.4 don't throw
// on a non-writable length; IE8- returned the wrong result. Mirrors core-js's
// FORCED (inverted).
export const isSupported = (): boolean => {
  try {
    if (typeof nativeUnshift !== 'function') return false;
    // INCORRECT_RESULT: unshift returns the new length
    if (([] as any).unshift(0) !== 1) return false;
    // ToLength, not ToUint32 (Chrome < 45): a 32-bit native reads {length: 2^32}
    // as 0; on a huge real length it would move ~2^32 elements
    if ((nativeUnshift as any).call({ length: 4294967296 }) !== 4294967296) return false;
    // must throw TypeError on a non-writable length
    try {
      (Object.defineProperty([], 'length', { writable: false }) as any).unshift();
      return false;
    } catch (error) {
      return error instanceof TypeError;
    }
  } catch {
    return false;
  }
};

// Safari < 13 lets a write to a read-only array length pass silently, even in
// strict code (core-js's array-set-length). Probed once; elsewhere this is false
// and the length write below costs nothing extra.
const SILENT_LENGTH_SET = (function () {
  try {
    (Object.defineProperty([], 'length', { writable: false }) as any).length = 1;
    return true;
  } catch (e) {
    return false;
  }
})();

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.unshift */

// Declared (item) only, for the spec length of 1; every argument comes from arguments.
export const arrayUnshift = function unshift(this: any, _item?: any): number {
  // inlined: toObject(this)
  if (this === null || this === undefined) throw new TypeError('Cannot convert undefined or null to object');
  const O = Object(this);
  // inlined: toLength(O.length)
  let len = +O.length;
  len = len !== len || len <= 0 ? 0 : len > 9007199254740991 ? 9007199254740991 : Math.floor(len);
  const argCount = arguments.length;
  if (argCount) {
    // inlined: doesNotExceedSafeInteger(len + argCount)
    if (len + argCount > 9007199254740991) throw new TypeError('Maximum allowed index exceeded');
    let k = len;
    while (k--) {
      const to = k + argCount;
      if (k in O) O[to] = O[k];
      // inlined: deletePropertyOrThrow(O, to)
      else if (!delete O[to]) throw new TypeError('Cannot delete property ' + to + ' of ' + O);
    }
    for (let j = 0; j < argCount; j++) {
      O[j] = arguments[j];
    }
  }
  // inlined: setArrayLength(O, len + argCount) -- write, then read back, as in es.array.push
  const newLength = len + argCount;
  // inlined: setArrayLength(O, ...) -- the TypeError Safari < 13 swallows
  if (SILENT_LENGTH_SET && Array.isArray(O) && !(Object.getOwnPropertyDescriptor(O, 'length') as any).writable) {
    throw new TypeError('Cannot set read only .length');
  }
  O.length = newLength;
  if (O.length !== newLength && Array.isArray(O)) throw new TypeError('Cannot set read only .length');
  return newLength;
};

