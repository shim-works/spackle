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

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.unshift */

export const arrayUnshift = function unshift(this: any): number {
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
  O.length = newLength;
  if (O.length !== newLength && Array.isArray(O)) throw new TypeError('Cannot set read only .length');
  return newLength;
};

