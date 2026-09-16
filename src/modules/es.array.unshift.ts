// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.unshift)

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

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.unshift
 */
const toObject = (arg: any): any => {
  if (arg === null || arg === undefined) throw new TypeError('Cannot convert undefined or null to object');
  return Object(arg);
};
const toLength = (value: any): number => {
  const n = Number(value);
  if (isNaN(n) || n <= 0) return 0;
  return n > 9007199254740991 ? 9007199254740991 : Math.floor(n);
};
const doesNotExceedSafeInteger = (it: number): number => {
  if (it > 9007199254740991) throw new TypeError('Maximum allowed index exceeded');
  return it;
};
const setArrayLength = (O: any, length: number): number => {
  if (Array.isArray(O)) {
    const descriptor = Object.getOwnPropertyDescriptor(O, 'length');
    if (descriptor && !descriptor.writable) throw new TypeError('Cannot set read only .length');
  }
  return (O.length = length);
};
const deletePropertyOrThrow = (O: any, P: any): void => {
  if (!delete O[P]) throw new TypeError('Cannot delete property ' + P + ' of ' + O);
};

export const arrayUnshift = function unshift(this: any): number {
  const O = toObject(this);
  const len = toLength(O.length);
  const argCount = arguments.length;
  if (argCount) {
    doesNotExceedSafeInteger(len + argCount);
    let k = len;
    while (k--) {
      const to = k + argCount;
      if (k in O) O[to] = O[k];
      else deletePropertyOrThrow(O, to);
    }
    for (let j = 0; j < argCount; j++) {
      O[j] = arguments[j];
    }
  }
  return setArrayLength(O, len + argCount);
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'unshift', { value: arrayUnshift as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.unshift, 'name', { value: 'unshift', configurable: true });
  Object.defineProperty((Array.prototype.unshift as any), '__polyfilled', { value: true });
}
