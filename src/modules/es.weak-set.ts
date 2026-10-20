// Existence-only: the island rides on whichever WeakMap is live.
export const isSupported = (): boolean => {
  try {
    // Read the global: the bare name `WeakSet` resolves to this module's own polyfill.
    const WeakSet = (window as any).WeakSet;
    return typeof WeakSet === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-weakset-objects
 *
 * Known limitations:
 * - [incomplete] Constructor does not accept an iterable argument —
 *   new WeakSet([obj1, obj2]) is not supported.
 */
// One reused descriptor per island: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

export const WeakSet = function (this: any) {
  // the [incomplete] gap from the header, hit at runtime — say so
  if (arguments.length > 0 && arguments[0] !== null && arguments[0] !== undefined) {
    console.warn(
      '[spackle] WeakSet: the iterable constructor argument is not implemented — starting empty; add() entries individually'
    );
  }
  if (typeof WeakMap !== 'undefined') {
    // inlined: slot(this, '_map', ...)
    SLOT.value = new WeakMap();
    Object.defineProperty(this, '_map', SLOT);
    SLOT.value = undefined; // never pin the last value
  } else {
    // inlined: slot(this, '_id', ...)
    SLOT.value = `_ws_${Math.random().toString(36).substring(2)}`;
    Object.defineProperty(this, '_id', SLOT);
    SLOT.value = undefined; // never pin the last value
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

