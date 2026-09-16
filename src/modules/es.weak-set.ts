// Ported from: the prior implementation (weak-set.ts + is-weak-set-supported.ts)

// WeakSet — existence only; the island rides on whatever WeakMap is live, so if
// the constructor is here at all we are good.
export const isSupported = (): boolean => {
  try {
    return typeof WeakSet === 'function';
  } catch {
    return false;
  }
};

export const isWeakSetSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-weakset-objects
 * GC: delegates to WeakMap — entries collected when key is collected.
 *
 * Known limitations:
 * - [incomplete] Constructor does not accept an iterable argument —
 *   new WeakSet([obj1, obj2]) is not supported.
 */
export const WeakSet = function (this: any) {
  // the [incomplete] gap from the header, hit at runtime — say so
  if (arguments.length > 0 && arguments[0] !== null && arguments[0] !== undefined) {
    console.warn(
      '[spackle] WeakSet: the iterable constructor argument is not implemented — starting empty; add() entries individually'
    );
  }
  if (typeof WeakMap !== 'undefined') {
    this._map = new WeakMap();
  } else {
    this._id = `_ws_${Math.random().toString(36).substring(2)}`;
  }
} as any;

WeakSet.prototype.add = function (this: any, key: object): any {
  if (this._map) {
    this._map.set(key, true);
  } else {
    Object.defineProperty(key, this._id, {
      configurable: true,
      enumerable: false,
      value: true,
      writable: false,
    });
  }
  return this;
};

WeakSet.prototype.has = function (this: any, key: object): boolean {
  if (this._map) {
    return this._map.has(key);
  }
  return (key as any)[this._id] === true;
};

WeakSet.prototype.delete = function (this: any, key: object): boolean {
  if (this._map) {
    return this._map.delete(key);
  }
  if ((key as any)[this._id] === true) {
    delete (key as any)[this._id];
    return true;
  }
  return false;
};

if (!isSupported()) {
  (window as any).WeakSet = null;
  delete (window as any).WeakSet;
  Object.defineProperty((window as any), 'WeakSet', { value: WeakSet, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).WeakSet, 'name', { value: 'WeakSet', configurable: true });
  Object.defineProperty((window as any).WeakSet, '__polyfilled', { value: true });
}
