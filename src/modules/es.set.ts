// Behavioural: Safari 7/8's Set crashed when given an iterable.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    // Read the global: the bare name `Set` resolves to this module's own polyfill.
    const Set = (window as any).Set;
    // eslint-disable-next-line es-x/no-set
    if (typeof Set !== 'function') {
      return false;
    }

    // Safari 7/8 throws here
    // eslint-disable-next-line compat/compat, es-x/no-set
    const set = new Set(['a', 'b', 'c']);

    if (Object.prototype.toString.call(set) !== '[object Set]') {
      return false;
    }

    if (set.size !== 3) {
      return false;
    }

    if (
      typeof set.add !== 'function' ||
      typeof set.clear !== 'function' ||
      typeof set.delete !== 'function' ||
      typeof set.entries !== 'function' ||
      typeof set.forEach !== 'function' ||
      typeof set.has !== 'function' ||
      typeof set.keys !== 'function' ||
      typeof set.values !== 'function'
    ) {
      return false;
    }

    const firstValue = set.values().next();
    return firstValue.done === false && firstValue.value === 'a';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-set-objects */

// Symbol.iterator / Symbol.toStringTag are used only when present at runtime
// (native or an already-installed Symbol polyfill) — never required.
const hasSymbol =
  typeof Symbol !== 'undefined' && (Symbol as any).iterator != null;

// Shared: an iterator returns itself from [Symbol.iterator].
const returnSelf = function (this: any) {
  return this;
};

/*
 * Small Sets scan; from INDEX_AT values up, strings and numbers also go in
 * null-prototype dictionaries (_si, _ni), as in es.map.
 *
 * limit: object, boolean, null, undefined and symbol values still scan in
 * a big Set. Stamp a hidden id on objects if a bench ever shows it matters.
 */
const INDEX_AT = 32;

/*
 * Tombstones, as in es.map: delete() leaves HOLE instead of splicing, so a live
 * iterator or forEach never skips the next value. Holes pin nothing and are
 * swept when the set empties or holes outnumber live values.
 */
const HOLE = {};

// limit: an iterator paused across TWO compactions resumes from its old index,
// clamped (only the latest remap is kept). Keep a chain if that ever matters.

// One pass over the live slots. Called once when a Set reaches INDEX_AT, and
// again after a compaction moves the slots.
const buildIndex = (self: any): void => {
  const values = self._values;
  const si = Object.create(null);
  const ni = Object.create(null);
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (typeof value === 'string') si[value] = i;
    else if (typeof value === 'number') ni[value] = i;
  }
  own(self, '_si', si);
  own(self, '_ni', ni);
};

const compact = (self: any): void => {
  const values = self._values;
  const length = values.length;
  if (self._holes === length) {
    values.length = 0;
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
    if (values[r] !== HOLE) values[w++] = values[r];
  }
  remap[length] = w;
  values.length = w;
  // Slots moved: the index is rebuilt, or dropped if the Set shrank back small.
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
const SetIterator = function (
  this: any,
  self: any,
  kind: 'values' | 'entries',
): void {
  this._self = self;
  this._index = 0;
  this._kind = kind;
  this._epoch = self._epoch;
} as any;

SetIterator.prototype.next = function (this: any): any {
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
    } else if (this._index > self._values.length) {
      this._index = self._values.length;
    }
  }
  this._epoch = self._epoch;
  const values = self._values;
  while (this._index < values.length && values[this._index] === HOLE) this._index++;
  if (this._index < values.length) {
    const value = values[this._index];
    this._index++;
    const result = this._kind === 'entries' ? [value, value] : value;
    return { value: result, done: false };
  }
  // Release the Set at completion. A done iterator left in scope otherwise
  // keeps the whole collection -- every value in it -- alive.
  this._self = null;
  return { value: undefined, done: true };
};

if (hasSymbol) {
  Object.defineProperty(SetIterator.prototype, (Symbol as any).iterator, { value: returnSelf, writable: true, enumerable: false, configurable: true });
  try { Object.defineProperty(returnSelf, 'name', { value: '[Symbol.iterator]', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
}

// One reused descriptor per island: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

/*
 * Tombstone fields (_holes, _epoch, _remap) live on the prototype until the
 * first delete or clear: a new Set pays for two hidden fields, not five.
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

export const Set = function (this: any, iterable?: any) {
  if (!(this instanceof Set)) {
    throw new TypeError("Constructor Set requires 'new'");
  }
  // Non-enumerable, like a native slot.
  // inlined: slot(this, '_values', ...)
  SLOT.value = [];
  Object.defineProperty(this, '_values', SLOT);
  SLOT.value = undefined; // never pin the last value

  if (iterable === null || iterable === undefined) {
    return;
  }

  // Consume an array directly, otherwise any Symbol.iterator iterable.
  if (Array.isArray(iterable)) {
    for (let i = 0; i < iterable.length; i++) {
      this.add(iterable[i]);
    }
    return;
  }

  if (hasSymbol && typeof iterable[(Symbol as any).iterator] === 'function') {
    const it = iterable[(Symbol as any).iterator]();
    let step = it.next();
    while (!step.done) {
      this.add(step.value);
      step = it.next();
    }
    return;
  }

  throw new TypeError('Set constructor argument is not iterable');
} as any;

Set.prototype.add = function (this: any, value: any): any {
  // Normalise -0 to +0 so iteration never surfaces -0 (SameValueZero value).
  if (value === 0) {
    value = 0;
  }
  // inlined: indexOf(this, value) -- dictionary once big, else scan
  let found = -1;
  if (this._si !== 0 && (typeof value === 'string' || typeof value === 'number')) {
    const at = (typeof value === 'string' ? this._si : this._ni)[value];
    if (at !== undefined) found = at;
  } else {
    const list = this._values;
    for (let k = 0; k < list.length; k++) {
      const stored = list[k];
      // inlined: sameValueZero(stored, value)
      if (stored === value || (stored !== stored && value !== value)) {
        found = k;
        break;
      }
    }
  }
  if (found === -1) {
    const at = this._values.length;
    this._values[at] = value;
    if (this._si !== 0) {
      if (typeof value === 'string') this._si[value] = at;
      else if (typeof value === 'number') this._ni[value] = at;
    } else if (at + 1 >= INDEX_AT) {
      buildIndex(this);
    }
  }
  return this;
};

Set.prototype.has = function (this: any, value: any): boolean {
  // inlined: indexOf(this, value) -- dictionary once big, else scan
  let i = -1;
  if (this._si !== 0 && (typeof value === 'string' || typeof value === 'number')) {
    const at = (typeof value === 'string' ? this._si : this._ni)[value];
    if (at !== undefined) i = at;
  } else {
    const list = this._values;
    for (let k = 0; k < list.length; k++) {
      const stored = list[k];
      // inlined: sameValueZero(stored, value)
      if (stored === value || (stored !== stored && value !== value)) {
        i = k;
        break;
      }
    }
  }
  return i !== -1;
};

Set.prototype.delete = function (this: any, value: any): boolean {
  // inlined: indexOf(this, value) -- dictionary once big, else scan
  let i = -1;
  if (this._si !== 0 && (typeof value === 'string' || typeof value === 'number')) {
    const at = (typeof value === 'string' ? this._si : this._ni)[value];
    if (at !== undefined) i = at;
  } else {
    const list = this._values;
    for (let k = 0; k < list.length; k++) {
      const stored = list[k];
      // inlined: sameValueZero(stored, value)
      if (stored === value || (stored !== stored && value !== value)) {
        i = k;
        break;
      }
    }
  }
  if (i === -1) {
    return false;
  }
  if (this._si !== 0) {
    if (typeof value === 'string') delete this._si[value];
    else if (typeof value === 'number') delete this._ni[value];
  }
  this._values[i] = HOLE; // the shared marker pins nothing
  const holes = this._holes + 1;
  own(this, '_holes', holes);
  const live = this._values.length - holes;
  if (live === 0 || (holes > 16 && holes > live)) compact(this);
  return true;
};

Set.prototype.clear = function (this: any): void {
  // spec: every element becomes ~empty~; the epoch restart lets a paused
  // iterator see exactly what is added afterwards
  own(this, '_holes', this._values.length);
  compact(this);
};

Set.prototype.forEach = function (
  this: any,
  callback: (value: any, value2: any, set: any) => void,
  thisArg?: any,
): void {
  if (typeof callback !== 'function') {
    throw new TypeError('Set.prototype.forEach callback is not a function');
  }
  // The backing arrays are rewritten in place, never replaced, so read them once.
  // Only the callback can delete or compact, so the epoch is checked after it.
  const values = this._values;
  let index = 0;
  let epoch = this._epoch;
  for (;;) {
    while (index < values.length && values[index] === HOLE) index++;
    if (index >= values.length) return;
    const i = index++;
    // a direct call when there is no thisArg: same result in strict code, and
    // cheaper than going through .call
    if (thisArg === undefined) callback(values[i], values[i], this);
    else callback.call(thisArg, values[i], values[i], this);
    if (epoch !== this._epoch) {
      // inlined: resync(index, epoch, this)
      if (epoch === this._epoch - 1) {
        const remap = this._remap;
        index = remap === 0 ? 0 : remap[index < remap.length ? index : remap.length - 1];
      } else if (index > values.length) {
        index = values.length;
      }
      epoch = this._epoch;
    }
  }
};

Set.prototype.values = function (this: any): any {
  return new SetIterator(this, 'values');
};

// Set keys are its values — keys() is an alias of values().
Set.prototype.keys = Set.prototype.values;

Set.prototype.entries = function (this: any): any {
  return new SetIterator(this, 'entries');
};

Object.defineProperty(Set.prototype, 'size', {
  configurable: true,
  get(this: any): number {
    return this._values.length - this._holes;
  },
});
// shorthand `get(){}` would be named "get", not "get size"
try {
  try {
    Object.defineProperty(Object.getOwnPropertyDescriptor(Set.prototype, 'size')!.get!, 'name', {
      value: 'get size',
      configurable: true,
    });
  } catch (e) { /* Function#name/length non-configurable pre-ES6 */ }
} catch (e) { /* Function#name non-configurable pre-ES6 */ }

if (hasSymbol) {
  // Make the set iterable (values) and report [object Set].
  Object.defineProperty(Set.prototype, (Symbol as any).iterator, { value: Set.prototype.values, writable: true, enumerable: false, configurable: true });
  if ((Symbol as any).toStringTag) {
    Object.defineProperty(Set.prototype, (Symbol as any).toStringTag, { value: 'Set', writable: false, enumerable: false, configurable: true });
  }
}

export const install = (): void => {
  // null-then-delete: on some engines a bare delete of a non-configurable
  // global is a no-op, and the write clears the old binding either way.
  (window as any).Set = null;
  delete (window as any).Set;
  define((window as any), 'Set', Set);
};

// Prototype defaults for the tombstone fields -- see `own` above.
Object.defineProperty(Set.prototype, '_holes', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Set.prototype, '_epoch', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Set.prototype, '_remap', { value: 0, writable: true, enumerable: false, configurable: true });
// Lookup index, 0 until the Set reaches INDEX_AT -- see INDEX_AT.
Object.defineProperty(Set.prototype, '_si', { value: 0, writable: true, enumerable: false, configurable: true });
Object.defineProperty(Set.prototype, '_ni', { value: 0, writable: true, enumerable: false, configurable: true });
