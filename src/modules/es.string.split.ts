// Ported from: the prior implementation (string-split.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.split === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.split
 *
 * Known limitations:
 * - [scope] only the String.prototype side dispatches; RegExp.prototype
 *   [Symbol.split] itself is not installed, so plain regexes ride the
 *   native path.
 */

const nativeSplit = String.prototype.split;

export const stringSplit = function (this: any, separator: any, limit?: any): any {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.split called on null or undefined');
  }
  // a custom Symbol.split handler wins — that's the whole ES2015 addition
  if (
    separator !== null &&
    separator !== undefined &&
    typeof Symbol !== 'undefined' &&
    (Symbol as any).split
  ) {
    const handler = separator[(Symbol as any).split];
    if (typeof handler === 'function') {
      return handler.call(separator, String(this), limit);
    }
  }
  return nativeSplit.call(this, separator, limit);
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'split', { value: stringSplit as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.split, 'name', { value: 'split', configurable: true });
  Object.defineProperty((String.prototype.split as any), '__polyfilled', { value: true });
}
