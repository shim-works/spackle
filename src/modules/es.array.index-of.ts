// Ported from: the prior implementation (array-index-of.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.indexOf === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.indexof
 */

const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

const toLength = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric) || numeric <= 0) {
    return 0;
  }
  if (numeric > MAX_SAFE_LENGTH) {
    return MAX_SAFE_LENGTH;
  }
  return Math.floor(numeric);
};

const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
};

export const arrayIndexOf = function (this: any, searchElement: any, fromIndex?: any): number {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.indexOf called on null or undefined');
  }
  const object = Object(this);
  const length = toLength(object.length);
  if (length === 0) {
    return -1;
  }
  let start = toInteger(fromIndex);
  if (start >= length) {
    return -1;
  }
  if (start < 0) {
    start = Math.max(length + start, 0);
  }
  for (let i = start; i < length; i++) {
    // strict equality, holes skipped — NaN is never found, matching native
    if (i in object && object[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'indexOf', { value: arrayIndexOf as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.indexOf, 'name', { value: 'indexOf', configurable: true });
  Object.defineProperty((Array.prototype.indexOf as any), '__polyfilled', { value: true });
}
