// Ported from: the prior implementation (string-match.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.match === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.match
 *
 * Known limitations:
 * - [scope] only the String.prototype side dispatches; RegExp.prototype
 *   [Symbol.match] itself is not installed, so plain regexes ride the native
 *   path (which is the fast, correct one anyway).
 */

const nativeMatch = String.prototype.match;

export const stringMatch = function (this: any, matcher: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.match called on null or undefined');
  }
  // a custom Symbol.match handler wins — that's the whole ES2015 addition
  if (
    matcher !== null &&
    matcher !== undefined &&
    typeof Symbol !== 'undefined' &&
    (Symbol as any).match
  ) {
    const handler = matcher[(Symbol as any).match];
    if (typeof handler === 'function') {
      return handler.call(matcher, String(this));
    }
  }
  return nativeMatch.call(this, matcher);
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'match', { value: stringMatch as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.match, 'name', { value: 'match', configurable: true });
  Object.defineProperty((String.prototype.match as any), '__polyfilled', { value: true });
}
