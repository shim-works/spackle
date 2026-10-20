// Match core-js's correctness-of-iteration gate: keep the native only if it
// consumes a custom iterable and closes that iterator when mapping throws.
export const isSupported = (): boolean => {
  try {
    if (typeof Array.from !== 'function') return false;

    const iteratorKey =
      typeof Symbol !== 'undefined' && (Symbol as any).iterator
        ? (Symbol as any).iterator
        : '@@iterator';
    let stepped = false;
    let nextCalls = 0;
    let closed = false;
    const iterable: any = {};
    iterable[iteratorKey] = function () {
      return {
        next: function () {
          nextCalls++;
          stepped = true;
          return { value: 1, done: nextCalls > 1 };
        },
        return: function () {
          closed = true;
          return { value: undefined, done: true };
        },
      };
    };

    try {
      Array.from(iterable, function () {
        throw new Error('Array.from probe');
      });
    } catch (e) {
      // The mapping error is deliberate; check below that the iterator closed.
    }
    return stepped && closed;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.from
 *
 * Known limitations:
 * - [incomplete] With no native Symbol (Safari 7/8), strings take the array-like
 *   path and split by UTF-16 code unit, so astral code points (emoji) break into
 *   surrogate halves. A native Symbol (Chrome 38 / Safari 9+) keeps them whole.
 */

// once-flag for the astral-split warn below — this path can run per keystroke
let warnedAstralSplit = false;

export const arrayFrom = function <T>(
  this: any,
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

  // Spec: `this` is the constructor, so `Sub.from(...)` yields a Sub.
  const Ctor: any = this;
  const useCtor = typeof Ctor === 'function' && Ctor !== Array;

  // 1. Iterable path (Symbol.iterator or the older @@iterator key).
  const iteratorMethod =
    (typeof Symbol !== 'undefined' &&
      Symbol.iterator &&
      (source as any)[Symbol.iterator]) ||
    (source as any)['@@iterator'];

  if (typeof iteratorMethod === 'function') {
    // Spec: Construct(C) with no length — the count isn't known up front here.
    const result: any = useCtor ? new Ctor() : [];
    const iterator = iteratorMethod.call(source);
    let index = 0;
    // Spec: a throwing mapFn (or write) closes the iterator; an error from the
    // iterator's own next()/done/value propagates without closing it.
    for (let step = iterator.next(); !step.done; step = iterator.next()) {
      const value = step.value;
      try {
        result[index] = mapFn ? mapFn.call(thisArg, value, index) : value;
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
      index++;
    }
    // Spec sets length explicitly: a custom constructor's instance does not
    // grow one from index assignment the way an Array does.
    result.length = index;
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
  // inlined: toLength(arrayLike.length)
  let length = +arrayLike.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // Spec: Construct(C, [len]) here — the length IS known on this path.
  const result: any = useCtor ? new Ctor(length) : [];
  for (let i = 0; i < length; i++) {
    if (mapFn) {
      result[i] = mapFn.call(thisArg, arrayLike[i], i);
    } else {
      result[i] = arrayLike[i];
    }
  }
  result.length = length;
  return result;
};
