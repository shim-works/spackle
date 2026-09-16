// Ported from: the prior implementation (regexp-flags.ts + is-regexp-flags-supported.ts)

// RegExp.prototype.flags — just check the getter is there. It landed Chrome 49 /
// Safari 9, so our targets (Chrome 38 / Safari 7) lack it outright; no half-broken
// partials in range, so presence is enough.
export const isSupported = (): boolean => {
  try {
    return typeof RegExp !== 'undefined' && 'flags' in RegExp.prototype;
  } catch {
    return false;
  }
};

export const isRegExpFlagsSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
 */
export const regExpFlags = function (this: any): string {
  if (this === null || typeof this !== 'object') {
    throw new TypeError('RegExp.prototype.flags getter called on a non-object');
  }
  // build the flag string in the exact order the spec mandates. each flag is a
  // separate boolean prop on the regex; we only append the letter when it's set.
  let result = '';
  if (this.hasIndices) result += 'd';
  if (this.global) result += 'g';
  if (this.ignoreCase) result += 'i';
  if (this.multiline) result += 'm';
  if (this.dotAll) result += 's';
  if (this.unicode) result += 'u';
  if (this.unicodeSets) result += 'v';
  if (this.sticky) result += 'y';
  return result;
};

if (!isSupported()) {
  Object.defineProperty((regExpFlags as any), '__polyfilled', { value: true });
  // Accessor functions get "get "/"set " prepended to the property name --
  // distinct from the [Symbol.x] bracket form symbol-keyed methods get.
  Object.defineProperty(regExpFlags, 'name', { value: 'get flags', configurable: true });
  Object.defineProperty(RegExp.prototype, 'flags', {
    configurable: true,
    get: regExpFlags,
  });
}
