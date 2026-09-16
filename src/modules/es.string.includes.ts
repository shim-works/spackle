// Ported from: the prior implementation (string-includes.ts + is-string-includes-supported.ts)

// String.prototype.includes — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken includes, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.includes === 'function';
  } catch {
    return false;
  }
};

export const isStringIncludesSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.includes
 */
export const stringIncludes = function (
  this: string,
  search: any,
  start?: number,
): boolean {
  // the spec explicitly rejects a regex here — includes is for plain strings
  if (search instanceof RegExp) {
    throw new TypeError(
      'First argument to String.prototype.includes must not be a regular expression',
    );
  }
  return this.indexOf(search, start) !== -1;
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'includes', { value: stringIncludes as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.includes, 'name', { value: 'includes', configurable: true });
  Object.defineProperty((String.prototype.includes as any), '__polyfilled', { value: true });
}
