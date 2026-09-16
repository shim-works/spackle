// Ported from: the prior implementation (string-starts-with.ts + is-string-starts-with-supported.ts)

// String.prototype.startsWith — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken startsWith, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.startsWith === 'function';
  } catch {
    return false;
  }
};

export const isStringStartsWithSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.startswith
 */

// ToInteger: NaN -> 0; otherwise truncate toward zero. (±Infinity can't matter
// here — an out-of-range index just yields NaN from charCodeAt below.)
const toInteger = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric)) {
    return 0;
  }
  return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
};

export const stringStartsWith = function (
  this: string,
  search: any,
  start?: number,
): boolean {
  if (search instanceof RegExp) {
    throw new TypeError(
      'First argument to String.prototype.startsWith must not be a regular expression',
    );
  }

  const searchString = String(search);
  let position = start === undefined ? 0 : toInteger(start);
  if (position < 0) {
    position = 0;
  }

  for (let i = 0; i < searchString.length; i++) {
    // charCodeAt past the end returns NaN, which never equals a real code unit.
    if (this.charCodeAt(position + i) !== searchString.charCodeAt(i)) {
      return false;
    }
  }
  return true;
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'startsWith', { value: stringStartsWith as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.startsWith, 'name', { value: 'startsWith', configurable: true });
  Object.defineProperty((String.prototype.startsWith as any), '__polyfilled', { value: true });
}
