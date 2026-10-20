export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.any === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-promise.any
 *
 * Known limitations:
 * - [incomplete] Accepts arrays, array-likes, and forEach-bearing iterables;
 *   generic Symbol.iterator-only iterables are not supported on the ES5 baseline.
 */

// once-flag for the generic-iterable warn below
let warnedGenericIterable = false;

const makeAggregateError = (errors: any[], message: string): any => {
  // AggregateError ships alongside Promise.any (Chrome 85): an engine reaching the
  // fallback lacks both.
  if (typeof AggregateError !== 'undefined') {
    return new AggregateError(errors, message);
  }
  const err: any = new Error(message);
  err.name = 'AggregateError';
  err.errors = errors;
  return err;
};

const collect = (
  PromiseCtor: PromiseConstructor,
  item: any,
  index: number,
  errors: any[],
  resolve: (value: any) => void,
  done: () => void
): void => {
  PromiseCtor.resolve(item).then(
    function (value: any) {
      resolve(value);
    },
    function (reason: any) {
      errors[index] = reason;
      done();
    }
  );
};

export const promiseAny = function (this: any, iterable: any) {
  // native-first via species: use the constructor we're called on (Promise, or
  // a subclass); fall back to the global Promise, which is native when present
  let PromiseCtor: PromiseConstructor = Promise as PromiseConstructor;
  if (typeof this === 'function') {
    PromiseCtor = this;
  }
  return new PromiseCtor(function (resolve: any, reject: any) {
    if (iterable == null) {
      reject(
        new TypeError(
          'Promise.any requires an array-like or iterable argument'
        )
      );
      return;
    }
// inlined: toArray(iterable) -- arrays, array-likes, and forEach-bearing iterables
    const items: any[] = [];
    // inlined: isArrayLike(iterable) -- takes the cheap index loop
    if (typeof iterable !== 'function' && typeof iterable.length === 'number') {
      for (let i = 0; i < iterable.length; i++) {
        items[items.length] = iterable[i];
      }
    } else if (typeof iterable.forEach === 'function') {
      iterable.forEach(function (value: any) {
        items[items.length] = value;
      });
    } else if (!warnedGenericIterable) {
      // the [incomplete] gap from the header, hit at runtime — say so
      warnedGenericIterable = true;
      console.warn(
        '[spackle] Promise.any: generic iterables are not implemented — only arrays, array-likes and forEach-bearing collections; treating as empty'
      );
    }
    const total = items.length;
    const errors = new Array(total);
    let remaining = total;
    // no inputs at all → nothing can succeed, so reject right away
    if (remaining === 0) {
      reject(makeAggregateError(errors, 'All promises were rejected'));
      return;
    }
    // first success wins; if the last one fails, we reject with everything
    for (let i = 0; i < total; i++) {
      collect(PromiseCtor, items[i], i, errors, resolve, function () {
        remaining--;
        if (remaining === 0) {
          reject(makeAggregateError(errors, 'All promises were rejected'));
        }
      });
    }
  });
};

