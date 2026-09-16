// Ported from: the prior implementation (string-trim.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.trim === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.trim
 * GC: one string allocation.
 */
export const stringTrim = function (this: string): string {
  return this.replace(/^\s+|\s+$/g, '');
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'trim', { value: stringTrim as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.trim, 'name', { value: 'trim', configurable: true });
  Object.defineProperty((String.prototype.trim as any), '__polyfilled', { value: true });
}
