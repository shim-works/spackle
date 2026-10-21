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

const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

// CanBeHeldWeakly: an object, or a symbol that is not in the global registry.
const isRegisteredSymbol = (value: any): boolean => {
  try {
    return (Symbol as any).keyFor(value) !== undefined;
  } catch (e) {
    return false;
  }
};
const canBeHeldWeakly = (value: any): boolean =>
  isObject(value) || (typeof value === 'symbol' && !isRegisteredSymbol(value));

const requireWeakMap = (self: any, method: string): void => {
  if (self === null || typeof self !== 'object' || self._id === undefined) {
    throw new TypeError('Method WeakMap.prototype.' + method + ' called on incompatible receiver');
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
      if (!isObject(item)) throw new TypeError('Iterator value is not an entry object');
      adder.call(this, item[0], item[1]);
    }
    return;
  }
  const method = iteratorKey ? iterable[iteratorKey] : undefined;
  if (typeof method !== 'function') {
    throw new TypeError('WeakMap constructor argument is not iterable');
  }
  const iterator = method.call(iterable);
  if (!isObject(iterator)) throw new TypeError('Result of the Symbol.iterator method is not an object');
  const next = iterator.next;
  for (;;) {
    const step = next.call(iterator);
    if (!isObject(step)) throw new TypeError('Iterator result is not an object');
    if (step.done) return;
    const item = step.value;
    try {
      if (!isObject(item)) throw new TypeError('Iterator value is not an entry object');
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
  requireWeakMap(this, 'set');
  if (!canBeHeldWeakly(key)) {
    throw new TypeError('Invalid value used as weak map key');
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
  requireWeakMap(this, 'get');
  if (typeof key === 'symbol') {
    const at = symbolIndex(this, key);
    return at === -1 ? undefined : this._svals[at];
  }
  if (!isObject(key) || !hasOwn.call(key, this._id)) {
    return undefined;
  }
  return key[this._id];
};

WeakMap.prototype.has = function (this: any, key: any): boolean {
  requireWeakMap(this, 'has');
  if (typeof key === 'symbol') return symbolIndex(this, key) !== -1;
  return isObject(key) && hasOwn.call(key, this._id);
};

WeakMap.prototype.delete = function (this: any, key: any): boolean {
  requireWeakMap(this, 'delete');
  if (typeof key === 'symbol') {
    const at = symbolIndex(this, key);
    if (at === -1) return false;
    this._skeys.splice(at, 1);
    this._svals.splice(at, 1);
    return true;
  }
  if (!isObject(key) || !hasOwn.call(key, this._id)) {
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
 * Symbols as weak keys arrived in ES2023 (Chrome 108, Safari 16.4), so native
 * WeakMaps from Chrome 36 to 107 pass isSupported() yet throw on a symbol key.
 * Replacing the native would slow every object key, so only symbol keys divert
 * to a side table.
 *
 * [incomplete] Symbol keys are held strongly (ES5 can't make them weak). Avoid
 * non-registered symbol weak keys on old engines if they must be collected.
 */

const nativeRejectsSymbolKeys = (): boolean => {
  try {
    const NativeWeakMap = (window as any).WeakMap;
    if (typeof NativeWeakMap !== 'function' || typeof Symbol !== 'function') {
      return false;
    }
    const probe = (Symbol as any)('spackle-weak-key-probe');
    // A SHIMMED symbol is an object, and a native WeakMap already accepts
    // objects — nothing to patch on those engines.
    if (typeof probe !== 'symbol') {
      return false;
    }
    new NativeWeakMap().set(probe, 1);
    return false;
  } catch (e) {
    return true;
  }
};

/**
 * Route symbol keys through a side table; every other key goes to the native.
 * Exported and parameterised so tests can run it against a stub that rejects
 * symbols.
 */
export const installSymbolWeakKeys = (Ctor: any): void => {
  const proto = Ctor.prototype;
  const nativeSet = proto.set;
  const nativeGet = proto.get;
  const nativeHas = proto.has;
  const nativeDelete = proto.delete;

  // instance -> { keys: symbol[], values: any[] }. Keyed by the WeakMap
  // itself, which is an object, so the native handles it.
  const sideTables = new Ctor();

  const isRegistered = (value: any): boolean => {
    try {
      return (Symbol as any).keyFor(value) !== undefined;
    } catch (e) {
      return false;
    }
  };

  // Linear scan. Symbol keys per WeakMap are a handful in practice, and a Map
  // here would cost a Map dependency on an engine that may not have one.
  const tableFor = (self: any, create: boolean): any => {
    let table = nativeGet.call(sideTables, self);
    if (!table && create) {
      table = { keys: [], values: [] };
      nativeSet.call(sideTables, self, table);
    }
    return table;
  };

  const indexOfKey = (table: any, key: any): number => {
    if (!table) return -1;
    for (let i = 0; i < table.keys.length; i++) {
      if (table.keys[i] === key) return i;
    }
    return -1;
  };

  proto.set = function (this: any, key: any, value: any): any {
    // inlined: divert(key) -- registered symbols can't be weak keys, so the
    // native throws for them
    if (typeof key !== 'symbol' || isRegistered(key)) return nativeSet.call(this, key, value);
    const table = tableFor(this, true);
    const at = indexOfKey(table, key);
    if (at === -1) {
      table.keys.push(key);
      table.values.push(value);
    } else {
      table.values[at] = value;
    }
    return this;
  };

  proto.get = function (this: any, key: any): any {
    // inlined: divert(key)
    if (typeof key !== 'symbol' || isRegistered(key)) return nativeGet.call(this, key);
    const table = tableFor(this, false);
    const at = indexOfKey(table, key);
    return at === -1 ? undefined : table.values[at];
  };

  proto.has = function (this: any, key: any): boolean {
    // inlined: divert(key)
    if (typeof key !== 'symbol' || isRegistered(key)) return nativeHas.call(this, key);
    return indexOfKey(tableFor(this, false), key) !== -1;
  };

  proto.delete = function (this: any, key: any): boolean {
    // inlined: divert(key)
    if (typeof key !== 'symbol' || isRegistered(key)) return nativeDelete.call(this, key);
    const table = tableFor(this, false);
    const at = indexOfKey(table, key);
    if (at === -1) return false;
    table.keys.splice(at, 1);
    table.values.splice(at, 1);
    return true;
  };

  const methods = ['set', 'get', 'has', 'delete'];
  for (let m = 0; m < methods.length; m++) {
    try {
      Object.defineProperty(proto[methods[m]], 'name', { value: methods[m], configurable: true });
    } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    Object.defineProperty(proto[methods[m]], '__polyfilled', { value: true });
  }
};

const installWeakMapExtensionsOnNative = (): void => {
  if (isSupported() && nativeRejectsSymbolKeys()) {
    installSymbolWeakKeys((window as any).WeakMap);
  }
};

export const install = (): void => {
  installWeakMapPolyfill();
  installWeakMapExtensionsOnNative();
};
