// Ported from: the prior implementation (promise-any.ts)

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

// "is this an array or array-like (has a numeric .length)?" — lets us take the
// cheap index loop instead of the forEach path
const isArrayLike = (candidate: any): boolean =>
  candidate != null && typeof candidate !== 'function' && typeof candidate.length === 'number';

// once-flag for the generic-iterable warn below
let warnedGenericIterable = false;

// flatten whatever we were handed into a plain array we can index into. covers
// real arrays, array-likes, and Map/Set-style things that expose forEach.
const toArray = (iterable: any): any[] => {
  const collected: any[] = [];
  if (isArrayLike(iterable)) {
    for (let i = 0; i < iterable.length; i++) {
      collected[collected.length] = iterable[i];
    }
    return collected;
  }
  if (typeof iterable.forEach === 'function') {
    iterable.forEach(function (value: any) {
      collected[collected.length] = value;
    });
  } else if (!warnedGenericIterable) {
    // the [incomplete] gap from the header, hit at runtime — say so
    warnedGenericIterable = true;
    console.warn(
      '[spackle] Promise.any: generic iterables are not implemented — only arrays, array-likes and forEach-bearing collections; treating as empty'
    );
  }
  return collected;
};

const makeAggregateError = (errors: any[], message: string): any => {
  // Native-first: AggregateError ships alongside Promise.any (Chrome 85). Any
  // engine reaching the fallback lacks both. (es-x flags this as audit noise.)
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
    const items = toArray(iterable);
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

if (typeof Promise !== 'undefined' && !isSupported()) {
  Object.defineProperty(Promise, 'any', { value: promiseAny as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Promise.any, 'name', { value: 'any', configurable: true });
  Object.defineProperty((Promise.any as any), '__polyfilled', { value: true });
}
