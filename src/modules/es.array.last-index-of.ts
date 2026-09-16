// Ported from: the prior implementation (array-last-index-of.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.lastIndexOf === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.lastindexof
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

export const arrayLastIndexOf = function (this: any, searchElement: any): number {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.lastIndexOf called on null or undefined');
  }
  const object = Object(this);
  const length = toLength(object.length);
  if (length === 0) {
    return -1;
  }
  let start = arguments.length > 1 ? toInteger(arguments[1]) : length - 1;
  if (start >= 0) {
    start = Math.min(start, length - 1);
  } else {
    start = length + start;
  }
  for (let i = start; i >= 0; i--) {
    // strict equality, holes skipped — NaN is never found, matching native
    if (i in object && object[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'lastIndexOf', { value: arrayLastIndexOf as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.lastIndexOf, 'name', { value: 'lastIndexOf', configurable: true });
  Object.defineProperty((Array.prototype.lastIndexOf as any), '__polyfilled', { value: true });
}
