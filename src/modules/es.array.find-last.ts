// Ported from: the prior implementation (array-find-last.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.findLast === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.findlast
 */
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

// clamp whatever .length gives us into a sane 0..MAX integer
const toLength = (value: any): number => {
  const numeric = Number(value);
  if (isNaN(numeric) || numeric <= 0) {
    return 0;
  }
  if (numeric > MAX_SAFE_LENGTH) {
    return MAX_SAFE_LENGTH;
  }
  return Math.floor(numeric);
};

export const arrayFindLast = function <T>(
  this: ArrayLike<T>,
  predicate: (value: T, index: number, array: any) => boolean,
  thisArg?: any
): T | undefined {
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.findLast called on null or undefined');
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  const length = toLength(object.length);
  // walk backwards so we hit the last match first
  for (let i = length - 1; i >= 0; i--) {
    if (predicate.call(thisArg, object[i], i, object)) {
      return object[i];
    }
  }
  return undefined;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'findLast', { value: arrayFindLast as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.findLast, 'name', { value: 'findLast', configurable: true });
  Object.defineProperty((Array.prototype.findLast as any), '__polyfilled', { value: true });
}
