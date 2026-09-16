// Existence-only probe: getOrInsertComputed is absent everywhere on the floor,
// so there is no partial-implementation case to detect.
export const isSupported = (): boolean => {
  try {
    return (
      typeof WeakMap !== 'undefined' &&
      typeof (WeakMap.prototype as any).getOrInsertComputed === 'function'
    );
  } catch {
    return false;
  }
};

export const isWeakMapGetOrInsertComputedSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-upsert/#sec-weakmap.prototype.getorinsertcomputed
 *
 * Goes through the live WeakMap's own has/get/set, so this rides on whichever
 * WeakMap is installed -- native, or the es.weak-map island if that replaced it.
 */

// CanBeHeldWeakly. Objects and functions, plus NON-registered symbols -- a
// symbol from Symbol.for() lives in the global registry forever, so it can
// never be collected and the spec rejects it as a weak key.
const canBeHeldWeakly = (value: any): boolean => {
  if (value === null) return false;
  const kind = typeof value;
  if (kind === 'object' || kind === 'function') return true;
  if (kind === 'symbol') {
    if (typeof Symbol === 'undefined' || typeof (Symbol as any).keyFor !== 'function') {
      return true;
    }
    return (Symbol as any).keyFor(value) === undefined;
  }
  return false;
};

// Brand check: a Map has has/get/set too, so going through the public API alone
// would silently accept one. The spec requires a real WeakMap.
const assertWeakMap = (value: any, method: string): void => {
  if (Object.prototype.toString.call(value) !== '[object WeakMap]') {
    throw new TypeError('WeakMap.prototype.' + method + ' called on incompatible receiver');
  }
};

export const weakMapGetOrInsertComputed = function (
  this: any,
  key: any,
  callbackfn: any
): any {
  assertWeakMap(this, 'getOrInsertComputed');
  if (!canBeHeldWeakly(key)) {
    throw new TypeError('Invalid value used as weak map key');
  }
  if (typeof callbackfn !== 'function') {
    throw new TypeError('WeakMap.prototype.getOrInsertComputed: callback is not callable');
  }
  if (this.has(key)) {
    return this.get(key);
  }
  const value = callbackfn(key);
  // The callback can mutate the map -- including inserting this very key. The
  // spec re-checks afterwards and writes the computed value regardless, so a
  // plain set() is the correct resolution rather than a second has() guard.
  this.set(key, value);
  return value;
};

if (typeof WeakMap !== 'undefined' && WeakMap.prototype && !isSupported()) {
  Object.defineProperty((WeakMap.prototype as any), 'getOrInsertComputed', { value: weakMapGetOrInsertComputed, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((WeakMap.prototype as any).getOrInsertComputed, 'name', { value: 'getOrInsertComputed', configurable: true });
  Object.defineProperty((WeakMap.prototype as any).getOrInsertComputed, '__polyfilled', {
    value: true,
  });
}
