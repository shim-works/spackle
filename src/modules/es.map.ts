// Ported from: the prior implementation (map.ts + is-map-supported.ts)

// Map — behavioral (not just typeof): old WebKit shipped a Map that crashed when
// you handed the constructor an iterable. Same checks as es6-map's is-implemented
// — consume an iterable, report [object Map], expose the full method set, and
// walk a working entries iterator. Anything off → install our island.
export const isSupported = (): boolean => {
  try {
    // No constructor at all? Nothing to work with.
    // eslint-disable-next-line es-x/no-map
    if (typeof Map !== 'function') {
      return false;
    }

    // hand the constructor an iterable — old WebKit dies right here
    // eslint-disable-next-line compat/compat, es-x/no-map
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    // Should stringify as a real Map, not [object Object].
    if (Object.prototype.toString.call(map) !== '[object Map]') {
      return false;
    }

    // The three entries above should actually have landed.
    if (map.size !== 3) {
      return false;
    }

    // The whole method set should be present.
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

    // And the iterator should actually walk the entries, in order.
    const firstEntry = map.entries().next();
    return (
      firstEntry.done === false &&
      !!firstEntry.value &&
      firstEntry.value[0] === 'a' &&
      firstEntry.value[1] === 1
    );
  } catch {
    // anything threw → treat as unusable, let the island take over
    return false;
  }
};

export const isMapSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-map-objects
 */

// SameValueZero: like ===, but NaN equals NaN. -0 === +0 is already true.
const sameValueZero = (a: any, b: any): boolean => {
  return a === b || (a !== a && b !== b);
};

// Symbol.iterator / Symbol.toStringTag are used only when present at runtime
// (native or an already-installed Symbol polyfill) — never required.
const hasSymbol =
  typeof Symbol !== 'undefined' && (Symbol as any).iterator != null;

// Shared, allocated once: an iterator returns itself from [Symbol.iterator].
// Hoisted out of makeIterator so we don't allocate a fresh closure per iterator.
const returnSelf = function (this: any) {
  return this;
};

const indexOfKey = (self: any, key: any): number => {
  const keys = self._keys;
  for (let i = 0; i < keys.length; i++) {
    if (sameValueZero(keys[i], key)) {
      return i;
    }
  }
  return -1;
};

const isObjectLike = (value: any): boolean => {
  return value !== null && (typeof value === 'object' || typeof value === 'function');
};

// Prototype-based iterator: `next` lives on the prototype (allocated once and
// shared), so creating an iterator is a single object allocation — no per-call
// closure. State is held in instance fields. GC-leaner than a closure factory.
const MapIterator = function (
  this: any,
  self: any,
  kind: 'keys' | 'values' | 'entries',
): void {
  this._self = self;
  this._index = 0;
  this._kind = kind;
} as any;

MapIterator.prototype.next = function (this: any): any {
  const self = this._self;
  // already exhausted -- _self was released below, nothing left to read
  if (self === null) {
    return { value: undefined, done: true };
  }
  if (this._index < self._keys.length) {
    const key = self._keys[this._index];
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
  Object.defineProperty(returnSelf, 'name', { value: '[Symbol.iterator]', configurable: true });
}

export const Map = function (this: any, iterable?: any) {
  if (!(this instanceof Map)) {
    throw new TypeError("Constructor Map requires 'new'");
  }
  this._keys = [];
  this._vals = [];

  if (iterable === null || iterable === undefined) {
    return;
  }

  // Consume an array directly, otherwise any Symbol.iterator iterable.
  if (Array.isArray(iterable)) {
    for (let i = 0; i < iterable.length; i++) {
      addEntry(this, iterable[i]);
    }
    return;
  }

  if (hasSymbol && typeof iterable[(Symbol as any).iterator] === 'function') {
    const it = iterable[(Symbol as any).iterator]();
    let step = it.next();
    while (!step.done) {
      addEntry(this, step.value);
      step = it.next();
    }
    return;
  }

  throw new TypeError('Map constructor argument is not iterable');
} as any;

const addEntry = (self: any, entry: any): void => {
  if (!isObjectLike(entry)) {
    throw new TypeError('Iterator value is not an entry object');
  }
  self.set(entry[0], entry[1]);
};

Map.prototype.set = function (this: any, key: any, value: any): any {
  // Normalise -0 to +0 so iteration never surfaces -0 (SameValueZero key).
  if (key === 0) {
    key = 0;
  }
  const i = indexOfKey(this, key);
  if (i === -1) {
    this._keys[this._keys.length] = key;
    this._vals[this._vals.length] = value;
  } else {
    this._vals[i] = value;
  }
  return this;
};

Map.prototype.get = function (this: any, key: any): any {
  const i = indexOfKey(this, key);
  return i === -1 ? undefined : this._vals[i];
};

Map.prototype.has = function (this: any, key: any): boolean {
  return indexOfKey(this, key) !== -1;
};

Map.prototype.delete = function (this: any, key: any): boolean {
  const i = indexOfKey(this, key);
  if (i === -1) {
    return false;
  }
  this._keys.splice(i, 1);
  this._vals.splice(i, 1);
  return true;
};

Map.prototype.clear = function (this: any): void {
  this._keys.length = 0;
  this._vals.length = 0;
};

Map.prototype.forEach = function (
  this: any,
  callback: (value: any, key: any, map: any) => void,
  thisArg?: any,
): void {
  for (let i = 0; i < this._keys.length; i++) {
    callback.call(thisArg, this._vals[i], this._keys[i], this);
  }
};

Map.prototype.keys = function (this: any): any {
  return new MapIterator(this, 'keys');
};

Map.prototype.values = function (this: any): any {
  return new MapIterator(this, 'values');
};

Map.prototype.entries = function (this: any): any {
  return new MapIterator(this, 'entries');
};

Object.defineProperty(Map.prototype, 'size', {
  configurable: true,
  get(this: any): number {
    return this._keys.length;
  },
});
// method-shorthand `get(){}` names the function "get", not "get size" -- the
// descriptor key it's shorthand-named after is "get" itself, not the property
// it ends up installed under.
Object.defineProperty(Object.getOwnPropertyDescriptor(Map.prototype, 'size')!.get!, 'name', {
  value: 'get size',
  configurable: true,
});

if (hasSymbol) {
  // Make the map iterable (entries) and report [object Map].
  Object.defineProperty(Map.prototype, (Symbol as any).iterator, { value: Map.prototype.entries, writable: true, enumerable: false, configurable: true });
  if ((Symbol as any).toStringTag) {
    Object.defineProperty(Map.prototype, (Symbol as any).toStringTag, { value: 'Map', writable: false, enumerable: false, configurable: true });
  }
}

if (!isSupported()) {
  (window as any).Map = null;
  delete (window as any).Map;
  Object.defineProperty((window as any), 'Map', { value: Map, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).Map, 'name', { value: 'Map', configurable: true });
  Object.defineProperty((window as any).Map, '__polyfilled', { value: true });
}
