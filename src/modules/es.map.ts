// Behavioural: old WebKit's Map crashed when given an iterable. Checks follow
// es6-map's is-implemented.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    // Read the global: the bare name `Map` resolves to this module's own polyfill.
    const Map = (window as any).Map;
    // eslint-disable-next-line es-x/no-map
    if (typeof Map !== 'function') {
      return false;
    }

    // old WebKit dies here
    // eslint-disable-next-line compat/compat, es-x/no-map
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    if (Object.prototype.toString.call(map) !== '[object Map]') {
      return false;
    }

    if (map.size !== 3) {
      return false;
    }

    if (
      typeof map.clear !== 'function' ||
      typeof map.delete !== 'function' ||
      typeof map.entries !== 'function' ||
      typeof map.forEach !== 'function' ||
      typeof map.get !== 'function' ||
      typeof map.has !== 'function' ||
      typeof map.keys !== 'function' ||
      typeof map.set !== 'function' ||
      typeof map.values !== 'function'
    ) {
      return false;
    }

    const firstEntry = map.entries().next();
    return (
      firstEntry.done === false &&
      !!firstEntry.value &&
      firstEntry.value[0] === 'a' &&
      firstEntry.value[1] === 1
    );
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-map-objects */

// Symbol.iterator / Symbol.toStringTag are used only when present at runtime
// (native or an already-installed Symbol polyfill) — never required.
const hasSymbol =
  typeof Symbol !== 'undefined' && (Symbol as any).iterator != null;

// Shared: an iterator returns itself from [Symbol.iterator].
const returnSelf = function (this: any) {
  return this;
};

/*
 * Small Maps scan. From INDEX_AT keys up, strings and numbers also go in
 * null-prototype dictionaries (_si, _ni: separate so '1' and 1 never collide).
 * ToString(-0) is "0" and ToString(NaN) is "NaN", matching SameValueZero.
 *
 * limit: object, boolean, null, undefined and symbol keys still scan in a
 * big Map. Stamp a hidden id on object keys if a bench ever shows it matters.
 */
const INDEX_AT = 32;

/*
 * Tombstones (the spec's ~empty~ model): delete() leaves HOLE in the slot, so a
 * live iterator or forEach never skips the next entry. Holes pin nothing and are
 * swept: emptying truncates and bumps _epoch (paused iterators restart at 0);
 * holes > live (and > 16) compacts in place, with _remap letting a paused
 * iterator resume at the same place. Amortised O(1) per delete.
 */
const HOLE = {};

// One pass over the live slots. Called once when a Map reaches INDEX_AT, and
// again after a compaction moves the slots.
const buildIndex = (self: any): void => {
  const keys = self._keys;
  const si = Object.create(null);
  const ni = Object.create(null);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof key === 'string') si[key] = i;
    else if (typeof key === 'number') ni[key] = i;
  }
  own(self, '_si', si);
  own(self, '_ni', ni);
};

// limit: an iterator paused across TWO compactions resumes from its old index,
// clamped (only the latest remap is kept). Keep a chain if that ever matters.

const compact = (self: any): void => {
  const keys = self._keys;
  const vals = self._vals;
  const length = keys.length;
  if (self._holes === length) {
    keys.length = 0;
    vals.length = 0;
    if (self._si !== 0) {
      own(self, '_si', 0);
      own(self, '_ni', 0);
    }
    own(self, '_holes', 0);
    own(self, '_remap', 0);
    own(self, '_epoch', self._epoch + 1);
    return;
  }
  const remap: number[] = new Array(length + 1);
  let w = 0;
  for (let r = 0; r < length; r++) {
    remap[r] = w;
    if (keys[r] !== HOLE) {
      keys[w] = keys[r];
      vals[w] = vals[r];
      w++;
    }
  }
  remap[length] = w;
  keys.length = w;
  vals.length = w;
  // Slots moved: the index is rebuilt, or dropped if the Map shrank back small.
  if (self._si !== 0) {
    if (w >= INDEX_AT) {
      buildIndex(self);
    } else {
      own(self, '_si', 0);
      own(self, '_ni', 0);
    }
  }
  own(self, '_holes', 0);
  own(self, '_remap', remap);
  own(self, '_epoch', self._epoch + 1);
};

// Prototype-based iterator: one allocation per iterator, no closure.
const MapIterator = function (
  this: any,
  self: any,
  kind: 'keys' | 'values' | 'entries',
): void {
  // Slots stay non-enumerable, like the spec's: Object.keys(iterator) is [].
  SLOT.value = self;
  Object.defineProperty(this, '_self', SLOT);
  SLOT.value = 0;
  Object.defineProperty(this, '_index', SLOT);
  SLOT.value = kind;
  Object.defineProperty(this, '_kind', SLOT);
  SLOT.value = self._epoch;
  Object.defineProperty(this, '_epoch', SLOT);
  SLOT.value = undefined; // never pin the last value
} as any;

const hasOwnSlot = Object.prototype.hasOwnProperty;

MapIterator.prototype.next = function next(this: any): any {
  if (this === null || typeof this !== 'object' || !hasOwnSlot.call(this, '_kind')) {
    throw new TypeError('next method called on an object that is not a Map Iterator');
  }
  const self = this._self;
  // already exhausted -- _self was released below, nothing left to read
  if (self === null) {
    return { value: undefined, done: true };
  }
  // inlined: resync(this._index, this._epoch, self)
  if (this._epoch !== self._epoch) {
    if (this._epoch === self._epoch - 1) {
      const remap = self._remap;
      this._index = remap === 0 ? 0 : remap[this._index < remap.length ? this._index : remap.length - 1];
    } else if (this._index > self._keys.length) {
      this._index = self._keys.length;
    }
  }
  this._epoch = self._epoch;
  const keys = self._keys;
  while (this._index < keys.length && keys[this._index] === HOLE) this._index++;
  if (this._index < keys.length) {
    const key = keys[this._index];
    const value = self._vals[this._index];
    this._index++;
    const result =
      this._kind === 'keys'
        ? key
        : this._kind === 'values'
          ? value
          : [key, value];
    return { value: result, done: false };
  }
  // Release the Map at completion. A done iterator left in scope otherwise
  // keeps the whole collection -- every key and every value -- alive.
  this._self = null;
  return { value: undefined, done: true };
};

if (hasSymbol) {
  Object.defineProperty(MapIterator.prototype, (Symbol as any).iterator, { value: returnSelf, writable: true, enumerable: false, configurable: true });
  try { Object.defineProperty(returnSelf, 'name', { value: '[Symbol.iterator]', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
}

// One reused descriptor per island: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

/*
 * Tombstone fields (_holes, _epoch, _remap) live on the prototype until the
 * first delete or clear: a new Map pays for two hidden fields, not five
 * (defineProperty is slow on these engines).
 */
const own = (target: any, key: string, value: any): void => {
  if (Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = value;
  } else {
    // inlined: slot(target, key, ...)
    SLOT.value = value;
    Object.defineProperty(target, key, SLOT);
    SLOT.value = undefined; // never pin the last value
  }
};

// Captured at load: the array fast path below is only taken while arrays still
// iterate with this function, so a patched Array.prototype[@@iterator] is honoured.
const arrayIterAtLoad: any = hasSymbol ? (Array.prototype as any)[(Symbol as any).iterator] : undefined;

// IteratorClose after a per-item failure: a throw from return() itself must
// not mask the original error.
const closeIterator = (iterator: any): void => {
  try {
    const ret = iterator['return'];
    if (ret !== undefined && ret !== null) ret.call(iterator);
  } catch (e) {
    /* the original error wins */
  }
};

// The iterable half of the constructor, shared by the polyfill and the wrapper
// around a native that ignores iterables.
const addEntries = (target: any, iterable: any): void => {
  // Get(map, "set") happens for every iterable, even an empty one
  const adder = target.set;
  if (typeof adder !== 'function') {
    throw new TypeError('Map constructor: this.set is not a function');
  }

  // A genuine array with untouched iteration: walk it directly (an array
  // iterator has no return(), so nothing to close). Engines without Symbol get
  // this path for arrays too, since nothing else is iterable there.
  if (Array.isArray(iterable) && (!hasSymbol || (iterable[(Symbol as any).iterator] === arrayIterAtLoad && (Array.prototype as any)[(Symbol as any).iterator] === arrayIterAtLoad))) {
    for (let i = 0; i < iterable.length; i++) {
      const item = iterable[i];
      if (item === null || (typeof item !== 'object' && typeof item !== 'function')) {
        throw new TypeError('Iterator value is not an entry object');
      }
      adder.call(target, item[0], item[1]);
    }
    return;
  }

  const method = hasSymbol ? iterable[(Symbol as any).iterator] : undefined;
  if (typeof method !== 'function') {
    throw new TypeError('Map constructor argument is not iterable');
  }
  const iterator = method.call(iterable);
  if (iterator === null || (typeof iterator !== 'object' && typeof iterator !== 'function')) {
    throw new TypeError('Result of the Symbol.iterator method is not an object');
  }
  // GetIteratorDirect reads next once; errors from next/done/value never close
  const next = iterator.next;
  for (;;) {
    const step = next.call(iterator);
    if (step === null || (typeof step !== 'object' && typeof step !== 'function')) {
      throw new TypeError('Iterator result is not an object');
    }
    if (step.done) {
      return;
    }
    const item = step.value;
    try {
      if (item === null || (typeof item !== 'object' && typeof item !== 'function')) {
        throw new TypeError('Iterator value is not an entry object');
      }
      adder.call(target, item[0], item[1]);
    } catch (error) {
      closeIterator(iterator);
      throw error;
    }
  }
};

export const Map = function (this: any) {
  if (!(this instanceof Map)) {
    throw new TypeError("Constructor Map requires 'new'");
  }
  // Non-enumerable, like a native slot.
  // inlined: slot(this, '_keys', ...)
  SLOT.value = [];
  Object.defineProperty(this, '_keys', SLOT);
  SLOT.value = undefined; // never pin the last value
  // inlined: slot(this, '_vals', ...)
  SLOT.value = [];
  Object.defineProperty(this, '_vals', SLOT);
  SLOT.value = undefined; // never pin the last value

  const iterable = arguments.length > 0 ? arguments[0] : undefined;
  if (iterable !== null && iterable !== undefined) addEntries(this, iterable);
} as any;

Map.prototype.set = function (this: any, key: any, value: any): any {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.set called on incompatible receiver');
  }
  // Normalise -0 to +0 so iteration never surfaces -0 (SameValueZero key).
  if (key === 0) {
    key = 0;
  }
  // inlined: indexOf(this, key) -- dictionary once big, else scan
  let i = -1;
  if (this._si !== 0 && (typeof key === 'string' || typeof key === 'number')) {
    const at = (typeof key === 'string' ? this._si : this._ni)[key];
    if (at !== undefined) i = at;
  } else {
    const list = this._keys;
    for (let k = 0; k < list.length; k++) {
      const stored = list[k];
      // inlined: sameValueZero(stored, key)
      if (stored === key || (stored !== stored && key !== key)) {
        i = k;
        break;
      }
    }
  }
  if (i === -1) {
    const at = this._keys.length;
    this._keys[at] = key;
    this._vals[at] = value;
    if (this._si !== 0) {
      if (typeof key === 'string') this._si[key] = at;
      else if (typeof key === 'number') this._ni[key] = at;
    } else if (at + 1 >= INDEX_AT) {
      buildIndex(this);
    }
  } else {
    this._vals[i] = value;
  }
  return this;
};

Map.prototype.get = function (this: any, key: any): any {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.get called on incompatible receiver');
  }
  // inlined: indexOf(this, key) -- dictionary once big, else scan
  let i = -1;
  if (this._si !== 0 && (typeof key === 'string' || typeof key === 'number')) {
    const at = (typeof key === 'string' ? this._si : this._ni)[key];
    if (at !== undefined) i = at;
  } else {
    const list = this._keys;
    for (let k = 0; k < list.length; k++) {
      const stored = list[k];
      // inlined: sameValueZero(stored, key)
      if (stored === key || (stored !== stored && key !== key)) {
        i = k;
        break;
      }
    }
  }
  return i === -1 ? undefined : this._vals[i];
};

Map.prototype.has = function (this: any, key: any): boolean {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.has called on incompatible receiver');
  }
  // inlined: indexOf(this, key) -- dictionary once big, else scan
  let i = -1;
  if (this._si !== 0 && (typeof key === 'string' || typeof key === 'number')) {
    const at = (typeof key === 'string' ? this._si : this._ni)[key];
    if (at !== undefined) i = at;
  } else {
    const list = this._keys;
    for (let k = 0; k < list.length; k++) {
      const stored = list[k];
      // inlined: sameValueZero(stored, key)
      if (stored === key || (stored !== stored && key !== key)) {
        i = k;
        break;
      }
    }
  }
  return i !== -1;
};

Map.prototype.delete = function (this: any, key: any): boolean {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.delete called on incompatible receiver');
  }
  // inlined: indexOf(this, key) -- dictionary once big, else scan
  let i = -1;
  if (this._si !== 0 && (typeof key === 'string' || typeof key === 'number')) {
    const at = (typeof key === 'string' ? this._si : this._ni)[key];
    if (at !== undefined) i = at;
  } else {
    const list = this._keys;
    for (let k = 0; k < list.length; k++) {
      const stored = list[k];
      // inlined: sameValueZero(stored, key)
      if (stored === key || (stored !== stored && key !== key)) {
        i = k;
        break;
      }
    }
  }
  if (i === -1) {
    return false;
  }
  if (this._si !== 0) {
    if (typeof key === 'string') delete this._si[key];
    else if (typeof key === 'number') delete this._ni[key];
  }
  this._keys[i] = HOLE;
  this._vals[i] = undefined; // a dead slot pins nothing
  const holes = this._holes + 1;
  own(this, '_holes', holes);
  const live = this._keys.length - holes;
  if (live === 0 || (holes > 16 && holes > live)) compact(this);
  return true;
};

Map.prototype.clear = function (this: any): void {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.clear called on incompatible receiver');
  }
  // spec: every entry becomes ~empty~; paused iterators see only what is
  // added afterwards -- the epoch restart gives exactly that
  own(this, '_holes', this._keys.length);
  compact(this);
};

// Declared (callbackfn) for the spec length of 1; thisArg comes from arguments.
Map.prototype.forEach = function (this: any, callback: any): void {
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.forEach called on incompatible receiver');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Map.prototype.forEach callback is not a function');
  }
  // The backing arrays are rewritten in place, never replaced, so read them once.
  // Only the callback can delete or compact, so the epoch is checked after it.
  const keys = this._keys;
  const vals = this._vals;
  let index = 0;
  let epoch = this._epoch;
  for (;;) {
    while (index < keys.length && keys[index] === HOLE) index++;
    if (index >= keys.length) return;
    const i = index++;
    // a direct call when there is no thisArg: same result in strict code, and
    // cheaper than going through .call
    if (thisArg === undefined) callback(vals[i], keys[i], this);
    else callback.call(thisArg, vals[i], keys[i], this);
    if (epoch !== this._epoch) {
      // inlined: resync(index, epoch, this)
      if (epoch === this._epoch - 1) {
        const remap = this._remap;
        index = remap === 0 ? 0 : remap[index < remap.length ? index : remap.length - 1];
      } else if (index > keys.length) {
        index = keys.length;
      }
      epoch = this._epoch;
    }
  }
};

Map.prototype.keys = function (this: any): any {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.keys called on incompatible receiver');
  }
  return new MapIterator(this, 'keys');
};

Map.prototype.values = function (this: any): any {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.values called on incompatible receiver');
  }
  return new MapIterator(this, 'values');
};

Map.prototype.entries = function (this: any): any {
  if (this === null || typeof this !== 'object' || this._vals === undefined) {
    throw new TypeError('Method Map.prototype.entries called on incompatible receiver');
  }
  return new MapIterator(this, 'entries');
};

Object.defineProperty(Map.prototype, 'size', {
  configurable: true,
  get(this: any): number {
    return this._keys.length - this._holes;
  },
});
// shorthand `get(){}` would be named "get", not "get size"
try {
  try {
    Object.defineProperty(Object.getOwnPropertyDescriptor(Map.prototype, 'size')!.get!, 'name', {
      value: 'get size',
      configurable: true,
    });
  } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
} catch (e) { /* Function#name non-configurable pre-ES6 */ }

if (hasSymbol) {
  // Make the map iterable (entries) and report [object Map].
  Object.defineProperty(Map.prototype, (Symbol as any).iterator, { value: Map.prototype.entries, writable: true, enumerable: false, configurable: true });
  if ((Symbol as any).toStringTag) {
    Object.defineProperty(Map.prototype, (Symbol as any).toStringTag, { value: 'Map', writable: false, enumerable: false, configurable: true });
  }
}

// Methods non-enumerable, writable and configurable like the natives', with
// their spec names (assigned function expressions are anonymous).
const mapMethods: any[] = [['set', 2], ['get', 1], ['has', 1], ['delete', 1], ['clear', 0], ['forEach', 1], ['keys', 0], ['values', 0], ['entries', 0]];
for (let i = 0; i < mapMethods.length; i++) {
  const name = mapMethods[i][0];
  const fn = (Map.prototype as any)[name];
  try {
    Object.defineProperty(fn, 'name', { value: name, configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty(Map.prototype, name, { value: fn, writable: true, enumerable: false, configurable: true });
}
try {
  Object.defineProperty(MapIterator.prototype.next, 'name', { value: 'next', configurable: true });
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
Object.defineProperty(MapIterator.prototype, 'next', { value: MapIterator.prototype.next, writable: true, enumerable: false, configurable: true });
// Map[@@species]: a getter returning this
if (typeof Symbol !== 'undefined' && (Symbol as any).species) {
  const speciesGetter = function (this: any) {
    return this;
  };
  try {
    Object.defineProperty(speciesGetter, 'name', { value: 'get [Symbol.species]', configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty(Map, (Symbol as any).species, { get: speciesGetter, enumerable: false, configurable: true });
}
if (hasSymbol && (Symbol as any).toStringTag) {
  Object.defineProperty(MapIterator.prototype, (Symbol as any).toStringTag, { value: 'Map Iterator', writable: false, enumerable: false, configurable: true });
}

/*
 * core-js collection.js REPLACE: a native Map is replaced outright only when it
 * is missing, lacks a method, or its entries() iterator cannot step. Anything
 * less (no iterable constructor, -0, no chaining) is fixed on top of the native
 * by installMapExtensionsOnNative, which keeps native-speed storage and forEach
 * (Safari 7.1/8, Chrome 38-41).
 */
const nativeUnusable = (): boolean => {
  try {
    const Native = (window as any).Map;
    if (typeof Native !== 'function') return true;
    const proto = Native.prototype;
    const names = ['set', 'get', 'has', 'delete', 'clear', 'forEach', 'keys', 'values', 'entries'];
    for (let i = 0; i < names.length; i++) if (typeof proto[names[i]] !== 'function') return true;
    new Native().entries().next();
    return false;
  } catch (e) {
    return true;
  }
};

const installMapPolyfill = (): void => {
  if (!nativeUnusable()) return;
  // null-then-delete: on some engines a bare delete of a non-configurable
  // global is a no-op, and the write clears the old binding either way.
  (window as any).Map = null;
  delete (window as any).Map;
  define((window as any), 'Map', Map);
};

/*
 * A native kept by nativeUnusable() can still store -0 as -0 (Chrome 38; core-js's
 * collection.js BUGGY_ZERO). set(-0) must keep +0: the native set is
 * wrapped to normalise the key, and the lookups too where they miss +0 for -0.
 * Patched on top of the native, as es.weak-map does for symbol keys.
 */
export const installMapExtensionsOnNative = (): void => {
  const Native = (window as any).Map;
  if (typeof Native !== 'function' || Native === Map) return;
  const proto = Native.prototype;
  const nativeAdder = proto.set;
  let storesNegativeZero = false;
  let lookupMissesZero = false;
  let hasntChaining = false;
  try {
    const probe = new Native();
    hasntChaining = nativeAdder.call(probe, -0, 1) !== probe;
    probe.forEach(function () {
      // the key / value is the callback's second / first argument
      const k = arguments[1];
      if (k === 0 && 1 / k < 0) storesNegativeZero = true;
    });
    const zero = new Native();
    nativeAdder.call(zero, 0, 1);
    lookupMissesZero = !zero.has(-0);
  } catch (e) {
    return;
  }
  if (storesNegativeZero || hasntChaining) define(proto, 'set', function set(this: any, key: any, value: any): any {
    nativeAdder.call(this, key === 0 ? 0 : key, value);
    return this;
  });
  if (lookupMissesZero) {
    const names = ['has', 'get', 'delete'];
    for (let i = 0; i < names.length; i++) {
      const nativeLookup = proto[names[i]];
      define(proto, names[i], function (this: any, key: any): any {
        return nativeLookup.call(this, key === 0 ? 0 : key);
      });
    }
  }
  if (!nativeAcceptsIterables(Native)) wrapNativeConstructor(Native);
};

// core-js ACCEPT_ITERABLES: entries go in, and a bad entry closes the iterator.
const nativeAcceptsIterables = (Native: any): boolean => {
  try {
    if (new Native([[1, 2]]).get(1) !== 2) return false;
    const key = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
    if (typeof key !== 'symbol') return true; // nothing else is iterable here
    let closed = false;
    const bad: any = {};
    bad[key] = function () {
      return {
        next: function () { return { done: false, value: 1 }; },
        'return': function () { closed = true; return {}; },
      };
    };
    try {
      new Native(bad);
    } catch (e) {
      return closed;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// The native's storage and methods stay; only construction goes through this.
// A subclass instance gets its own prototype (core-js inheritIfRequired).
const wrapNativeConstructor = (Native: any): void => {
  const proto = Native.prototype;
  const getProto = Object.getPrototypeOf;
  const Wrapped: any = function Map(this: any) {
    if (!(this instanceof Wrapped)) throw new TypeError("Constructor Map requires 'new'");
    const that = new Native();
    const own = getProto(this);
    if (own !== proto) {
      if (typeof Object.setPrototypeOf === 'function') Object.setPrototypeOf(that, own);
      else that.__proto__ = own;
    }
    const iterable = arguments.length > 0 ? arguments[0] : undefined;
    if (iterable !== null && iterable !== undefined) addEntries(that, iterable);
    return that;
  };
  Wrapped.prototype = proto;
  Object.defineProperty(proto, 'constructor', { value: Wrapped, writable: true, enumerable: false, configurable: true });
  // statics: @@species, and anything already installed on the native
  const names: any[] = Object.getOwnPropertyNames(Native);
  if (typeof Object.getOwnPropertySymbols === 'function') {
    const symbols = Object.getOwnPropertySymbols(Native);
    for (let i = 0; i < symbols.length; i++) names.push(symbols[i]);
  }
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name === 'prototype' || name === 'length' || name === 'name' || name === 'arguments' || name === 'caller') continue;
    const d = Object.getOwnPropertyDescriptor(Native, name);
    if (d) Object.defineProperty(Wrapped, name, d);
  }
  (window as any).Map = null;
  delete (window as any).Map;
  define((window as any), 'Map', Wrapped);
};

export const install = (): void => {
  installMapPolyfill();
  installMapExtensionsOnNative();
};

// Prototype defaults for the tombstone fields -- see `own` above.
Object.defineProperty(Map.prototype, '_holes', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Map.prototype, '_epoch', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Map.prototype, '_remap', { value: 0, writable: true, enumerable: false, configurable: true });
// Lookup index, 0 until the Map reaches INDEX_AT -- see INDEX_AT.
Object.defineProperty(Map.prototype, '_si', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Map.prototype, '_ni', { value: 0, writable: true, enumerable: false, configurable: true });
