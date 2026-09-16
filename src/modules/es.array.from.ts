// Ported from: the prior implementation (array-from.ts + is-array-from-supported.ts)

// Array.from — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken Array.from, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Array.from === 'function';
  } catch {
    return false;
  }
};

export const isArrayFromSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-array.from
 *
 * Known limitations:
 * - [incomplete] With no native Symbol (Safari 7/8), strings take the array-like
 *   path and split by UTF-16 code unit, so astral code points (emoji) break into
 *   surrogate halves. A native Symbol (Chrome 38 / Safari 9+) keeps them whole.
 */

// ToLength: clamp a .length value to a valid array length [0, 2^53 - 1].
// Non-numbers and NaN become 0; negatives become 0; fractions are floored.
const MAX_SAFE_LENGTH = 9007199254740991; // 2^53 - 1

// once-flag for the astral-split warn below — this path can run per keystroke
let warnedAstralSplit = false;
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

export const arrayFrom = function <T>(
  source: ArrayLike<T> | Iterable<T>,
  mapFn?: (value: T, index: number) => any,
  thisArg?: any,
): T[] {
  // Spec: ToObject(source) — null/undefined cannot be converted.
  if (source === null || source === undefined) {
    throw new TypeError('Array.from requires an array-like or iterable object');
  }

  // Spec: if mapFn is supplied it must be callable.
  if (mapFn !== undefined && typeof mapFn !== 'function') {
    throw new TypeError('Array.from: when provided, the second argument must be a function');
  }

  const result: any[] = [];

  // 1. Iterable path (Symbol.iterator or the older @@iterator key).
  const iteratorMethod =
    (typeof Symbol !== 'undefined' &&
      Symbol.iterator &&
      (source as any)[Symbol.iterator]) ||
    (source as any)['@@iterator'];

  if (typeof iteratorMethod === 'function') {
    const iterator = iteratorMethod.call(source);
    let index = 0;
    // Spec: if anything in the loop throws (typically a throwing mapFn), close
    // the iterator via return() before propagating — leaving it open would leak a
    // live generator. Only the throw path pays for this; steady state is unchanged.
    try {
      let step = iterator.next();
      while (!step.done) {
        if (mapFn) {
          result[index] = mapFn.call(thisArg, step.value, index);
        } else {
          result[index] = step.value;
        }
        index++;
        step = iterator.next();
      }
    } catch (error) {
      if (typeof iterator.return === 'function') {
        // A throw from return() itself must not mask the original error.
        try {
          iterator.return();
        } catch {
          /* swallow — the original error is what matters */
        }
      }
      throw error;
    }
    return result;
  }

  // 2. Array-like path (object with .length, read by index).
  if (typeof source === 'string' && !warnedAstralSplit && /[\uD800-\uDFFF]/.test(source)) {
    warnedAstralSplit = true;
    console.warn(
      '[spackle] Array.from: no Symbol.iterator on this engine, so strings split by UTF-16 unit — astral characters break into surrogate halves'
    );
  }
  const arrayLike = source as ArrayLike<T>;
  const length = toLength(arrayLike.length);
  for (let i = 0; i < length; i++) {
    if (mapFn) {
      result[i] = mapFn.call(thisArg, arrayLike[i], i);
    } else {
      result[i] = arrayLike[i];
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Array, 'from', { value: arrayFrom as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.from, 'name', { value: 'from', configurable: true });
  Object.defineProperty((Array.from as any), '__polyfilled', { value: true });
}
