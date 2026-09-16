// Ported from: the prior implementation (regexp-to-string.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof RegExp.prototype.toString === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-regexp.prototype.tostring
 */

// generic on purpose: the ES2015 spec reads source/flags off any object, so
// duck-typed regex-likes serialize too
export const regExpToString = function (this: any): string {
  if (this === null || this === undefined) {
    throw new TypeError('RegExp.prototype.toString called on null or undefined');
  }
  return '/' + String(this.source) + '/' + String(this.flags);
};

if (!isSupported()) {
  Object.defineProperty(RegExp.prototype, 'toString', { value: regExpToString as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(RegExp.prototype.toString, 'name', { value: 'toString', configurable: true });
  Object.defineProperty((RegExp.prototype.toString as any), '__polyfilled', { value: true });
}
