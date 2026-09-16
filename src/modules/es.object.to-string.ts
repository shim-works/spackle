// Ported from: the prior implementation (object-to-string.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Object.prototype.toString === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.prototype.tostring
 *
 * Known limitations:
 * - [scope] installed only alongside the Symbol island — engines with native
 *   Symbols keep their native toString (which already honors toStringTag).
 */

const nativeToString = Object.prototype.toString;

export const objectToString = function (this: any): string {
  if (this === null) {
    return '[object Null]';
  }
  if (this === undefined) {
    return '[object Undefined]';
  }
  // honor a toStringTag wired through the live Symbol (native or island);
  // cheap guarded lookup — this sits on a hot path when installed
  if (typeof Symbol !== 'undefined' && (Symbol as any).toStringTag) {
    let tag;
    try {
      tag = this[(Symbol as any).toStringTag];
    } catch {
      tag = undefined;
    }
    if (typeof tag === 'string') {
      return '[object ' + tag + ']';
    }
  }
  return nativeToString.call(this);
};

if (!isSupported()) {
  Object.defineProperty(Object.prototype, 'toString', { value: objectToString as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.prototype.toString, 'name', { value: 'toString', configurable: true });
  Object.defineProperty((Object.prototype.toString as any), '__polyfilled', { value: true });
}
