// Array.prototype.find: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.find === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-array.prototype.find */

export const arrayFind = function <T>(
  this: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any,
): T | undefined {
  if (typeof predicate !== 'function') {
    throw new TypeError('Array.prototype.find: predicate must be a function');
  }

  // Capture length once: elements appended during iteration are not visited.
  // inlined: toLength(this.length)
  let length = +this.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  for (let i = 0; i < length; i++) {
    const value = this[i];
    if (predicate.call(thisArg, value, i, this)) {
      return value;
    }
  }
  return undefined;
};

