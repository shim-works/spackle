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
  this._self = self;
  this._index = 0;
  this._kind = kind;
  this._epoch = self._epoch;
} as any;

MapIterator.prototype.next = function (this: any): any {
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

export const Map = function (this: any, iterable?: any) {
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

  if (iterable === null || iterable === undefined) {
    return;
  }

  // Consume an array directly, otherwise any Symbol.iterator iterable.
  if (Array.isArray(iterable)) {
    for (let i = 0; i < iterable.length; i++) {
      // inlined: addEntry(this, iterable[i])
      const entry = iterable[i];
      if (entry === null || (typeof entry !== 'object' && typeof entry !== 'function')) {
        throw new TypeError('Iterator value is not an entry object');
      }
      this.set(entry[0], entry[1]);
    }
    return;
  }

  if (hasSymbol && typeof iterable[(Symbol as any).iterator] === 'function') {
    const it = iterable[(Symbol as any).iterator]();
    let step = it.next();
    while (!step.done) {
      // inlined: addEntry(this, step.value)
      const entry = step.value;
      if (entry === null || (typeof entry !== 'object' && typeof entry !== 'function')) {
        throw new TypeError('Iterator value is not an entry object');
      }
      this.set(entry[0], entry[1]);
      step = it.next();
    }
    return;
  }

  throw new TypeError('Map constructor argument is not iterable');
} as any;

Map.prototype.set = function (this: any, key: any, value: any): any {
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
  // spec: every entry becomes ~empty~; paused iterators see only what is
  // added afterwards -- the epoch restart gives exactly that
  own(this, '_holes', this._keys.length);
  compact(this);
};

Map.prototype.forEach = function (
  this: any,
  callback: (value: any, key: any, map: any) => void,
  thisArg?: any,
): void {
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

export const install = (): void => {
  // null-then-delete: on some engines a bare delete of a non-configurable
  // global is a no-op, and the write clears the old binding either way.
  (window as any).Map = null;
  delete (window as any).Map;
  define((window as any), 'Map', Map);
};

// Prototype defaults for the tombstone fields -- see `own` above.
Object.defineProperty(Map.prototype, '_holes', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Map.prototype, '_epoch', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Map.prototype, '_remap', { value: 0, writable: true, enumerable: false, configurable: true });
// Lookup index, 0 until the Map reaches INDEX_AT -- see INDEX_AT.
Object.defineProperty(Map.prototype, '_si', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Map.prototype, '_ni', { value: 0, writable: true, enumerable: false, configurable: true });
