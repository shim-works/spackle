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

// once-flag for the generic-iterable warn below
let warnedGenericIterable = false;

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
        '[spackle] Promise.allSettled: generic iterables are not implemented — only arrays, array-likes and forEach-bearing collections; treating as empty'
      );
    }
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

