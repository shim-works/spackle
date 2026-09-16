// Ported from: the prior implementation (promise-all-settled.ts)

export const isSupported = (): boolean => {
  try {
    return typeof Promise !== 'undefined' && typeof Promise.allSettled === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-promise.allsettled
 *
 * Known limitations:
 * - [incomplete] Accepts arrays, array-likes, and forEach-bearing iterables (Map/Set);
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
      '[spackle] Promise.allSettled: generic iterables are not implemented — only arrays, array-likes and forEach-bearing collections; treating as empty'
    );
  }
  return collected;
};

const settle = (
  PromiseCtor: PromiseConstructor,
  item: any,
  index: number,
  results: any[],
  done: () => void
): void => {
  PromiseCtor.resolve(item).then(
    function (value: any) {
      results[index] = { status: 'fulfilled', value: value };
      done();
    },
    function (reason: any) {
      results[index] = { status: 'rejected', reason: reason };
      done();
    }
  );
};

export const promiseAllSettled = function (this: any, iterable: any) {
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
          'Promise.allSettled requires an array-like or iterable argument'
        )
      );
      return;
    }
    const items = toArray(iterable);
    const total = items.length;
    const results = new Array(total);
    let remaining = total;
    // empty input settles immediately with an empty result list
    if (remaining === 0) {
      resolve(results);
      return;
    }
    // fire them all off; the last one to finish resolves the outer promise
    for (let i = 0; i < total; i++) {
      settle(PromiseCtor, items[i], i, results, function () {
        remaining--;
        if (remaining === 0) {
          resolve(results);
        }
      });
    }
  });
};

if (typeof Promise !== 'undefined' && !isSupported()) {
  Object.defineProperty(Promise, 'allSettled', { value: promiseAllSettled as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Promise.allSettled, 'name', { value: 'allSettled', configurable: true });
  Object.defineProperty((Promise.allSettled as any), '__polyfilled', { value: true });
}
