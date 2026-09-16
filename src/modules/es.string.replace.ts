// Ported from: the prior implementation (string-replace.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.replace === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.replace
 *
 * Known limitations:
 * - [scope] only the String.prototype side dispatches; RegExp.prototype
 *   [Symbol.replace] itself is not installed, so plain regexes ride the
 *   native path.
 */

const nativeReplace = String.prototype.replace;

export const stringReplace = function (this: any, searchValue: any, replaceValue: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.replace called on null or undefined');
  }
  // a custom Symbol.replace handler wins — that's the whole ES2015 addition
  if (
    searchValue !== null &&
    searchValue !== undefined &&
    typeof Symbol !== 'undefined' &&
    (Symbol as any).replace
  ) {
    const handler = searchValue[(Symbol as any).replace];
    if (typeof handler === 'function') {
      return handler.call(searchValue, String(this), replaceValue);
    }
  }
  return nativeReplace.call(this, searchValue, replaceValue);
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'replace', { value: stringReplace as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.replace, 'name', { value: 'replace', configurable: true });
  Object.defineProperty((String.prototype.replace as any), '__polyfilled', { value: true });
}
