// Existence-only: Array.fromAsync is absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return typeof (Array as any).fromAsync === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/proposal-array-from-async/
 *
 * An explicit promise chain (no downlevelled async helpers). Values are awaited
 * one at a time, in order, as the spec requires.
 */
const PUT: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };

export const arrayFromAsync = function (
  this: any,
  source: any,
  mapFn?: any,
  thisArg?: any
): any {
  const C = this;
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

  /*
   * `this` is the constructor (IsConstructor(C) -> Construct(C), else []). Elements
   * go in by CreateDataPropertyOrThrow: its throw is what stops an infinite source
   * when the target refuses the write.
   */
  const out: any = typeof C === 'function' ? new C() : [];
  let index = 0;

  /** CreateDataPropertyOrThrow: defineProperty throws where a plain write would not. */
  const put = (position: number, value: any): void => {
    // reused descriptor: a literal per element was one extra object per item
    // limit: no try/finally (not in the baseline). If defineProperty throws,
    // PUT holds this one value until the next element overwrites it.
    PUT.value = value;
    Object.defineProperty(out, String(position), PUT);
    PUT.value = undefined;
  };

  /** Set(A, "length", k, true) -- a real array tracks it, anything else needs telling. */
  const finish = (): any => {
    if (!Array.isArray(out)) out.length = index;
    return out;
  };

  const collect = (value: any): any => {
    // await the element itself first -- a sync iterable of promises resolves
    // its values, which is the behaviour that distinguishes this from Array.from
    return Promise.resolve(value).then(function (awaited: any) {
      if (mapFn === undefined) {
        put(index, awaited);
        return undefined;
      }
      return Promise.resolve(mapFn.call(thisArg, awaited, index)).then(function (
        mapped: any
      ) {
        put(index, mapped);
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
          return finish();
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
      return finish();
    }
    return collect(boxed[index]).then(function () {
      index++;
      return step();
    });
  };
  return Promise.resolve().then(step);
};

