// Ported from: the prior implementation (string-trim-start.ts + is-string-trim-start-supported.ts)

// String.prototype.trimStart — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken trimStart, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.trimStart === 'function';
  } catch {
    return false;
  }
};

export const isStringTrimStartSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.trimstart
 * GC: one string allocation.
 */
export const stringTrimStart = function (this: string): string {
  return this.replace(/^\s+/, '');
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'trimStart', { value: stringTrimStart as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.trimStart, 'name', { value: 'trimStart', configurable: true });
  Object.defineProperty((String.prototype.trimStart as any), '__polyfilled', { value: true });
}
