// Behavioural: round-trip on an object key, reject a primitive key, and tag
// [object WeakMap].
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    // Read the global: the bare name `WeakMap` resolves to this module's own polyfill.
    const WeakMap = (window as any).WeakMap;
    if (typeof WeakMap !== 'function') {
      return false;
    }

    const weakMap = new WeakMap();
    if (Object.prototype.toString.call(weakMap) !== '[object WeakMap]') {
      return false;
    }

    const key = {};
    weakMap.set(key, 1);
    if (weakMap.get(key) !== 1 || weakMap.has(key) !== true) {
      return false;
    }

    if (weakMap.delete(key) !== true || weakMap.has(key) !== false) {
      return false;
    }

    try {
      weakMap.set('x' as any, 1);
      return false; // it didn't throw, so this native is wrong
    } catch {
      // good — that's the throw we wanted
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-weakmap-objects
 *
 * Known limitations:
 * - [incomplete] A frozen / non-extensible key cannot be used — defineProperty
 *   rejects new properties on it and throws.
 */

const hasSymbol =
  typeof Symbol !== 'undefined' && (Symbol as any).toStringTag != null;
const iteratorKey: any = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
const hasOwn = Object.prototype.hasOwnProperty;

let counter = 0;

// One reused descriptor per island: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

// CanBeHeldWeakly: an object, or a symbol that is not in the global registry.
// The try stays in here, so set() calls this for symbols only.
const isRegisteredSymbol = (value: any): boolean => {
  try {
    return (Symbol as any).keyFor(value) !== undefined;
  } catch (e) {
    return false;
  }
};

/*
 * Symbol keys can't carry the hidden property, so they go in a per-map side
 * list (_skeys/_svals, created on first use). [incomplete] Those entries are
 * held strongly: ES5 can't make them weak.
 */
const symbolIndex = (self: any, key: any): number => {
  const keys = self._skeys;
  if (keys === undefined) return -1;
  for (let i = 0; i < keys.length; i++) if (keys[i] === key) return i;
  return -1;
};

// IteratorClose after a per-item failure; a throwing return() must not mask the original.
const closeIterator = (iterator: any): void => {
  try {
    const ret = iterator['return'];
    if (ret !== undefined && ret !== null) ret.call(iterator);
  } catch (e) {
    /* the original error wins */
  }
};

const arrayIterAtLoad: any = iteratorKey ? (Array.prototype as any)[iteratorKey] : undefined;

export const WeakMap = function (this: any) {
  if (!(this instanceof WeakMap)) {
    throw new TypeError("Constructor WeakMap requires 'new'");
  }
  counter++;
  // Non-enumerable, like a native slot.
  SLOT.value = `__wm$${counter}$${Math.random().toString(36).substring(2)}`;
  Object.defineProperty(this, '_id', SLOT);
  SLOT.value = undefined; // never pin the last value

  const iterable = arguments.length > 0 ? arguments[0] : undefined;
  if (iterable === null || iterable === undefined) {
    return;
  }
  // Get(map, "set") for every iterable, even an empty one
  const adder = this.set;
  if (typeof adder !== 'function') {
    throw new TypeError('WeakMap constructor: this.set is not a function');
  }
  if (Array.isArray(iterable) && (!iteratorKey || (iterable[iteratorKey] === arrayIterAtLoad && (Array.prototype as any)[iteratorKey] === arrayIterAtLoad))) {
    for (let i = 0; i < iterable.length; i++) {
      const item = iterable[i];
      // inlined: isObject(item)
      if ((item === null || (typeof item !== 'object' && typeof item !== 'function'))) throw new TypeError('Iterator value is not an entry object');
      adder.call(this, item[0], item[1]);
    }
    return;
  }
  const method = iteratorKey ? iterable[iteratorKey] : undefined;
  if (typeof method !== 'function') {
    throw new TypeError('WeakMap constructor argument is not iterable');
  }
  const iterator = method.call(iterable);
  // inlined: isObject(iterator)
  if ((iterator === null || (typeof iterator !== 'object' && typeof iterator !== 'function'))) throw new TypeError('Result of the Symbol.iterator method is not an object');
  const next = iterator.next;
  for (;;) {
    const step = next.call(iterator);
    // inlined: isObject(step)
    if ((step === null || (typeof step !== 'object' && typeof step !== 'function'))) throw new TypeError('Iterator result is not an object');
    if (step.done) return;
    const item = step.value;
    try {
      // inlined: isObject(item)
      if ((item === null || (typeof item !== 'object' && typeof item !== 'function'))) throw new TypeError('Iterator value is not an entry object');
      adder.call(this, item[0], item[1]);
    } catch (error) {
      closeIterator(iterator);
      throw error;
    }
  }
} as any;

// Reused descriptor: no allocation per call.
const SET_SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

WeakMap.prototype.set = function (this: any, key: any, value: any): any {
  // inlined: requireWeakMap(this, 'set')
  if (this === null || typeof this !== 'object' || this._id === undefined) {
    throw new TypeError('Method WeakMap.prototype.set called on incompatible receiver');
  }
  // inlined: canBeHeldWeakly(key) -- only a symbol reaches isRegisteredSymbol's try
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    if (typeof key !== 'symbol' || isRegisteredSymbol(key)) throw new TypeError('Invalid value used as weak map key');
  }
  if (typeof key === 'symbol') {
    const at = symbolIndex(this, key);
    if (at !== -1) {
      this._svals[at] = value;
    } else {
      if (this._skeys === undefined) {
        SLOT.value = [];
        Object.defineProperty(this, '_skeys', SLOT);
        SLOT.value = [];
        Object.defineProperty(this, '_svals', SLOT);
        SLOT.value = undefined;
      }
      this._skeys.push(key);
      this._svals.push(value);
    }
    return this;
  }
  const id = this._id;
  // Overwrite: the hidden property is already there and writable, so a plain
  // store does it -- no isExtensible, no defineProperty, no descriptor.
  if (hasOwn.call(key, id)) {
    key[id] = value;
    return this;
  }
  // the [incomplete] gap from the header: fail before SET_SLOT holds the value
  if (!Object.isExtensible(key)) {
    console.warn(
      '[spackle] WeakMap: frozen / non-extensible keys are not supported by the hidden-property strategy — this set() will throw'
    );
    throw new TypeError('Cannot add a WeakMap entry to a non-extensible key');
  }
  SET_SLOT.value = value;
  Object.defineProperty(key, id, SET_SLOT);
  SET_SLOT.value = undefined; // never pin the last value
  return this;
};

WeakMap.prototype.get = function (this: any, key: any): any {
  // inlined: requireWeakMap(this, 'get')
  if (this === null || typeof this !== 'object' || this._id === undefined) {
    throw new TypeError('Method WeakMap.prototype.get called on incompatible receiver');
  }
  if (typeof key === 'symbol') {
    const at = symbolIndex(this, key);
    return at === -1 ? undefined : this._svals[at];
  }
  // inlined: isObject(key)
  if ((key === null || (typeof key !== 'object' && typeof key !== 'function')) || !hasOwn.call(key, this._id)) {
    return undefined;
  }
  return key[this._id];
};

WeakMap.prototype.has = function (this: any, key: any): boolean {
  // inlined: requireWeakMap(this, 'has')
  if (this === null || typeof this !== 'object' || this._id === undefined) {
    throw new TypeError('Method WeakMap.prototype.has called on incompatible receiver');
  }
  if (typeof key === 'symbol') return symbolIndex(this, key) !== -1;
  // inlined: isObject(key)
  return (key !== null && (typeof key === 'object' || typeof key === 'function')) && hasOwn.call(key, this._id);
};

WeakMap.prototype.delete = function (this: any, key: any): boolean {
  // inlined: requireWeakMap(this, 'delete')
  if (this === null || typeof this !== 'object' || this._id === undefined) {
    throw new TypeError('Method WeakMap.prototype.delete called on incompatible receiver');
  }
  if (typeof key === 'symbol') {
    const at = symbolIndex(this, key);
    if (at === -1) return false;
    this._skeys.splice(at, 1);
    this._svals.splice(at, 1);
    return true;
  }
  // inlined: isObject(key)
  if ((key === null || (typeof key !== 'object' && typeof key !== 'function')) || !hasOwn.call(key, this._id)) {
    return false;
  }
  delete key[this._id];
  return true;
};

// Methods non-enumerable, writable and configurable, with their spec names.
const weakMapMethods = ['set', 'get', 'has', 'delete'];
for (let i = 0; i < weakMapMethods.length; i++) {
  const fn = (WeakMap.prototype as any)[weakMapMethods[i]];
  try {
    Object.defineProperty(fn, 'name', { value: weakMapMethods[i], configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty(WeakMap.prototype, weakMapMethods[i], { value: fn, writable: true, enumerable: false, configurable: true });
}

if (hasSymbol) {
  Object.defineProperty(WeakMap.prototype, (Symbol as any).toStringTag, { value: 'WeakMap', writable: false, enumerable: false, configurable: true });
}

const installWeakMapPolyfill = (): void => {
  if (!isSupported()) {
    (window as any).WeakMap = null;
    delete (window as any).WeakMap;
    define((window as any), 'WeakMap', WeakMap);
  }
};

/*
 * Symbols as weak keys (ES2023: Chrome 108, Safari 16.4) are not patched onto an
 * older native WeakMap, as core-js doesn't either: wrapping set/get/has/delete
 * put every object-key call on Chrome < 108 / Safari < 16.4 behind a JS hop.
 * spackle's own WeakMap (above), installed where the native fails isSupported(),
 * does take symbol keys.
 */
export const install = (): void => {
  installWeakMapPolyfill();
  // core-js setToStringTag on a kept native (Chrome 38-48, Safari 9)
  const Native = (window as any).WeakMap;
  const tag = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;
  if (tag && typeof Native === 'function' && Native !== WeakMap) {
    try {
      if (!Object.prototype.hasOwnProperty.call(Native.prototype, tag)) Object.defineProperty(Native.prototype, tag, { value: 'WeakMap', writable: false, enumerable: false, configurable: true });
    } catch (e) { /* locked-down prototype */ }
  }
};
