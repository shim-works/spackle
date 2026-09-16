// Existence-only: Array.fromAsync is absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return typeof (Array as any).fromAsync === 'function';
  } catch {
    return false;
  }
};

export const isArrayFromAsyncSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-array-from-async/
 *
 * Written as an explicit promise chain rather than with async/await, matching
 * _disposable-impl.ts's disposeAsync -- keeps the module free of downlevel
 * async helpers, which matters for an ES5 target.
 *
 * Values are awaited one at a time, in order. The spec requires sequential
 * consumption: a source may depend on the previous value having settled.
 */
export const arrayFromAsync = function (
  source: any,
  mapFn?: any,
  thisArg?: any
): any {
  if (typeof Promise === 'undefined') {
    throw new TypeError('Array.fromAsync requires Promise');
  }
  if (mapFn !== undefined && typeof mapFn !== 'function') {
    return Promise.reject(new TypeError('mapfn is not a function'));
  }
  if (source === null || source === undefined) {
    return Promise.reject(new TypeError('Array.fromAsync called on null or undefined'));
  }

  const asyncIteratorKey =
    typeof Symbol !== 'undefined' ? (Symbol as any).asyncIterator : undefined;
  const iteratorKey =
    typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;

  const boxed = Object(source);
  const out: any[] = [];
  let index = 0;

  const collect = (value: any): any => {
    // await the element itself first -- a sync iterable of promises resolves
    // its values, which is the behaviour that distinguishes this from Array.from
    return Promise.resolve(value).then(function (awaited: any) {
      if (mapFn === undefined) {
        out.push(awaited);
        return undefined;
      }
      return Promise.resolve(mapFn.call(thisArg, awaited, index)).then(function (
        mapped: any
      ) {
        out.push(mapped);
        return undefined;
      });
    });
  };

  let iterator: any;
  let isAsync = false;
  if (asyncIteratorKey && typeof boxed[asyncIteratorKey] === 'function') {
    iterator = boxed[asyncIteratorKey]();
    isAsync = true;
  } else if (iteratorKey && typeof boxed[iteratorKey] === 'function') {
    iterator = boxed[iteratorKey]();
  }

  if (iterator) {
    const step = function (): any {
      // an async iterator's next() returns a promise; a sync one doesn't --
      // Promise.resolve normalises both
      return Promise.resolve(iterator.next()).then(function (result: any) {
        if (!result || typeof result !== 'object') {
          throw new TypeError('iterator result is not an object');
        }
        if (result.done) {
          return out;
        }
        return collect(result.value).then(function () {
          index++;
          return step();
        });
      });
    };
    return Promise.resolve()
      .then(step)
      .then(undefined, function (error: any) {
        // close the source on failure so it isn't left mid-iteration
        try {
          const method = iterator.return;
          if (typeof method === 'function') {
            const closed = method.call(iterator);
            if (isAsync) return Promise.resolve(closed).then(function () {
              throw error;
            });
          }
        } catch {
          /* ignore a misbehaving return() -- the original error matters more */
        }
        throw error;
      });
  }

  // array-like fallback
  const length = boxed.length >>> 0;
  const step = function (): any {
    if (index >= length) {
      return out;
    }
    return collect(boxed[index]).then(function () {
      index++;
      return step();
    });
  };
  return Promise.resolve().then(step);
};

if (!isSupported()) {
  Object.defineProperty((Array as any), 'fromAsync', { value: arrayFromAsync, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((Array as any).fromAsync, 'name', { value: 'fromAsync', configurable: true });
  // mapFn/thisArg are optional and don't count toward spec arity -- the
  // compiled function's real param count (3) overshoots the required length.
  Object.defineProperty((Array as any).fromAsync, 'length', { value: 1, configurable: true });
  Object.defineProperty((Array as any).fromAsync, '__polyfilled', { value: true });
}
