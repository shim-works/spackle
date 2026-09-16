// Ported from: the prior implementation (string-trim-end.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.trimEnd === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.trimend
 */
export const stringTrimEnd = function (this: any): string {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.trimEnd called on null or undefined');
  }
  return String(this).replace(/\s+$/, '');
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'trimEnd', { value: stringTrimEnd as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.trimEnd, 'name', { value: 'trimEnd', configurable: true });
  Object.defineProperty((String.prototype.trimEnd as any), '__polyfilled', { value: true });
}
