// Ported from: the prior implementation (string-search.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.search === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.search
 *
 * Known limitations:
 * - [scope] only the String.prototype side dispatches; RegExp.prototype
 *   [Symbol.search] itself is not installed, so plain regexes ride the
 *   native path.
 */

const nativeSearch = String.prototype.search;

export const stringSearch = function (this: any, matcher: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.search called on null or undefined');
  }
  // a custom Symbol.search handler wins — that's the whole ES2015 addition
  if (
    matcher !== null &&
    matcher !== undefined &&
    typeof Symbol !== 'undefined' &&
    (Symbol as any).search
  ) {
    const handler = matcher[(Symbol as any).search];
    if (typeof handler === 'function') {
      return handler.call(matcher, String(this));
    }
  }
  return nativeSearch.call(this, matcher);
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'search', { value: stringSearch as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.search, 'name', { value: 'search', configurable: true });
  Object.defineProperty((String.prototype.search as any), '__polyfilled', { value: true });
}
