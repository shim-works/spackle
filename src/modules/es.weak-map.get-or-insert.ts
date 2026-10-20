// Existence-only: absent everywhere on the floor.
export const isSupported = (): boolean => {
  try {
    return (
      typeof WeakMap !== 'undefined' &&
      typeof (WeakMap.prototype as any).getOrInsert === 'function'
    );
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/proposal-upsert/#sec-weakmap.prototype.getorinsert
 *
 * Uses the live WeakMap's has/get/set, native or the es.weak-map island.
 */

// CanBeHeldWeakly, symbol half: registered symbols (Symbol.for) can never be
// collected, so they're rejected. Object/function keys are decided inline at the
// call site, keeping this try off the common path.
const isRegisteredSymbol = (value: any): boolean => {
  if (typeof Symbol === 'undefined' || typeof (Symbol as any).keyFor !== 'function') return false;
  try {
    return (Symbol as any).keyFor(value) !== undefined;
  } catch {
    return false;
  }
};

export const weakMapGetOrInsert = function (this: any, key: any, value: any): any {
  // inlined: assertWeakMap(this, 'getOrInsert')
  const isPolyfilled =
    this !== null &&
    typeof this === 'object' &&
    typeof (this as any)._id === 'string' &&
    (this as any)._id.indexOf('__wm$') === 0;
  if (!isPolyfilled && Object.prototype.toString.call(this) !== '[object WeakMap]') {
    throw new TypeError('WeakMap.prototype.getOrInsert called on incompatible receiver');
  }
  // inlined: canBeHeldWeakly(key) -- a shimmed symbol is typeof 'object', spotted
  // by its `__name__` string (a false positive costs one registry lookup)
  const keyKind = typeof key;
  const mightBeSymbol =
    keyKind === 'symbol' || (keyKind === 'object' && key !== null && typeof (key as any).__name__ === 'string');
  const holdable =
    key !== null &&
    (keyKind === 'object' || keyKind === 'function' || keyKind === 'symbol') &&
    !(mightBeSymbol && isRegisteredSymbol(key));
  if (!holdable) {
    throw new TypeError('Invalid value used as weak map key');
  }
  if (this.has(key)) {
    return this.get(key);
  }
  this.set(key, value);
  return value;
};

