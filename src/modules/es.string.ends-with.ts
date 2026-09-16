// Ported from: the prior implementation (string-ends-with.ts + is-string-ends-with-supported.ts)

// String.prototype.endsWith — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken endsWith, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.endsWith === 'function';
  } catch {
    return false;
  }
};

export const isStringEndsWithSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.endswith
 */

// ToInteger: NaN -> 0; otherwise truncate toward zero.
const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
};

export const stringEndsWith = function (
  this: string,
  search: any,
  endPosition?: number,
): boolean {
  if (search instanceof RegExp) {
    throw new TypeError(
      'First argument to String.prototype.endsWith must not be a regular expression',
    );
  }

  const length = this.length;
  let endIndex = endPosition === undefined ? length : toInteger(endPosition);
  if (endIndex < 0) {
    endIndex = 0;
  } else if (endIndex > length) {
    endIndex = length;
  }

  const searchString = String(search);
  const startIndex = endIndex - searchString.length;
  if (startIndex < 0) {
    return false;
  }

  for (let i = 0; i < searchString.length; i++) {
    if (this.charCodeAt(startIndex + i) !== searchString.charCodeAt(i)) {
      return false;
    }
  }
  return true;
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'endsWith', { value: stringEndsWith as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.endsWith, 'name', { value: 'endsWith', configurable: true });
  Object.defineProperty((String.prototype.endsWith as any), '__polyfilled', { value: true });
}
