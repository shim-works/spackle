// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.push)

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

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.push
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

export const arrayPush = function push(this: any): number {
  const O = toObject(this);
  let len = toLength(O.length);
  const argCount = arguments.length;
  doesNotExceedSafeInteger(len + argCount);
  for (let i = 0; i < argCount; i++) {
    O[len] = arguments[i];
    len++;
  }
  setArrayLength(O, len);
  return len;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'push', { value: arrayPush as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.push, 'name', { value: 'push', configurable: true });
  Object.defineProperty((Array.prototype.push as any), '__polyfilled', { value: true });
}
