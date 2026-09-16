// Ported from: the prior implementation (string-at.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.at === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.at
 */
export const stringAt = function (this: any, index: number): string | undefined {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.at called on null or undefined');
  }
  const source = String(this);
  const length = source.length;
  let relativeIndex = Number(index);
  if (relativeIndex !== relativeIndex) {
    relativeIndex = 0; // NaN → 0
  }
  relativeIndex = relativeIndex < 0 ? Math.ceil(relativeIndex) : Math.floor(relativeIndex);
  // the whole point of .at over [] is negative indexing: -1 means last char,
  // so a negative index counts back from the end
  const actualIndex = relativeIndex < 0 ? length + relativeIndex : relativeIndex;
  if (actualIndex < 0 || actualIndex >= length) {
    return undefined;
  }
  return source.charAt(actualIndex);
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'at', { value: stringAt as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.at, 'name', { value: 'at', configurable: true });
  Object.defineProperty((String.prototype.at as any), '__polyfilled', { value: true });
}
