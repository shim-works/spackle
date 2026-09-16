// Ported from: the prior implementation (weak-map.ts + is-weak-map-supported.ts)

// WeakMap — behavioral (not just typeof): the constructor must work,
// set/get/has/delete must round-trip on an object key, a primitive key must
// throw, and the tag must be [object WeakMap]. Any miss → install our island.
export const isSupported = (): boolean => {
  try {
    // No constructor at all? Nothing to work with.
    if (typeof WeakMap !== 'function') {
      return false;
    }

    // Should stringify as a real WeakMap, not [object Object].
    const weakMap = new WeakMap();
    if (Object.prototype.toString.call(weakMap) !== '[object WeakMap]') {
      return false;
    }

    // set/get/has should round-trip on an object key.
    const key = {};
    weakMap.set(key, 1);
    if (weakMap.get(key) !== 1 || weakMap.has(key) !== true) {
      return false;
    }

    // delete should report success, and the key should be gone afterwards.
    if (weakMap.delete(key) !== true || weakMap.has(key) !== false) {
      return false;
    }

    // Primitive keys aren't allowed — set must reject one.
    try {
      weakMap.set('x' as any, 1);
      return false; // it didn't throw, so this native is wrong
    } catch {
      // good — that's the throw we wanted
    }

    return true;
  } catch {
    // Anything threw → treat as unusable and let the polyfill take over.
    return false;
  }
};

export const isWeakMapSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-weakmap-objects
 *
 * Known limitations:
 * - [incomplete] A frozen / non-extensible key cannot be used — defineProperty
 *   rejects new properties on it and throws.
 */

const hasSymbol =
  typeof Symbol !== 'undefined' && (Symbol as any).toStringTag != null;

let counter = 0;

const isObjectLike = (value: any): boolean => {
  return value !== null && (typeof value === 'object' || typeof value === 'function');
};

export const WeakMap = function (this: any, iterable?: any) {
  if (!(this instanceof WeakMap)) {
    throw new TypeError("Constructor WeakMap requires 'new'");
  }
  counter++;
  this._id = `__wm$${counter}$${Math.random().toString(36).substring(2)}`;

  if (iterable === null || iterable === undefined) {
    return;
  }

  if (Array.isArray(iterable)) {
    for (let i = 0; i < iterable.length; i++) {
      this.set(iterable[i][0], iterable[i][1]);
    }
    return;
  }

  if (
    typeof Symbol !== 'undefined' &&
    (Symbol as any).iterator != null &&
    typeof iterable[(Symbol as any).iterator] === 'function'
  ) {
    const iterator = iterable[(Symbol as any).iterator]();
    let step = iterator.next();
    while (!step.done) {
      this.set(step.value[0], step.value[1]);
      step = iterator.next();
    }
    return;
  }

  throw new TypeError('WeakMap constructor argument is not iterable');
} as any;

WeakMap.prototype.set = function (this: any, key: any, value: any): any {
  if (!isObjectLike(key)) {
    throw new TypeError('Invalid value used as weak map key');
  }
  // the [incomplete] gap from the header, about to be hit — say so before the
  // defineProperty below throws
  if (!Object.isExtensible(key)) {
    console.warn(
      '[spackle] WeakMap: frozen / non-extensible keys are not supported by the hidden-property strategy — this set() will throw'
    );
  }
  Object.defineProperty(key, this._id, {
    configurable: true,
    enumerable: false,
    writable: true,
    value,
  });
  return this;
};

WeakMap.prototype.get = function (this: any, key: any): any {
  if (!isObjectLike(key) || !Object.prototype.hasOwnProperty.call(key, this._id)) {
    return undefined;
  }
  return key[this._id];
};

WeakMap.prototype.has = function (this: any, key: any): boolean {
  return (
    isObjectLike(key) && Object.prototype.hasOwnProperty.call(key, this._id)
  );
};

WeakMap.prototype.delete = function (this: any, key: any): boolean {
  if (!isObjectLike(key) || !Object.prototype.hasOwnProperty.call(key, this._id)) {
    return false;
  }
  delete key[this._id];
  return true;
};

if (hasSymbol) {
  Object.defineProperty(WeakMap.prototype, (Symbol as any).toStringTag, { value: 'WeakMap', writable: false, enumerable: false, configurable: true });
}

if (!isSupported()) {
  (window as any).WeakMap = null;
  delete (window as any).WeakMap;
  Object.defineProperty((window as any), 'WeakMap', { value: WeakMap, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).WeakMap, 'name', { value: 'WeakMap', configurable: true });
  Object.defineProperty((window as any).WeakMap, '__polyfilled', { value: true });
}
