// Existence-only: the dotAll getter is either on RegExp.prototype or it isn't.
export const isSupported = (): boolean => {
  try {
    return 'dotAll' in RegExp.prototype;
  } catch {
    return false;
  }
};

export const isRegExpDotAllSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
 *
 * Known limitations:
 * - [unfixable] This exposes the accessor only. An engine without ES2018
 *   `s`-flag support still throws on `new RegExp('.', 's')`, so `dotAll` will
 *   read `false` because the flag could never be set in the first place. There
 *   is no way to change how the engine's own matcher treats `.` from ES5.
 */

// Reads `this.flags` at call time rather than at install time, so it picks up
// the es.regexp.flags island regardless of which of the two loaded first.
export const regexpDotAllGetter = function (this: any): boolean | undefined {
  if (this === null || typeof this !== 'object') {
    throw new TypeError('RegExp.prototype.dotAll getter called on a non-object');
  }
  const flags = this.flags;
  if (typeof flags !== 'string') {
    return undefined;
  }
  return flags.indexOf('s') !== -1;
};

if (!isSupported()) {
  Object.defineProperty(RegExp.prototype, 'dotAll', {
    configurable: true,
    get: regexpDotAllGetter,
  });
  Object.defineProperty(regexpDotAllGetter, 'name', { value: 'get dotAll', configurable: true });
  // accessor property -- the marker goes on the getter function itself, the
  // same treatment es.regexp.flags uses
  Object.defineProperty((regexpDotAllGetter as any), '__polyfilled', { value: true });
}
