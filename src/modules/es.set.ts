// Ported from: the prior implementation (set.ts + is-set-supported.ts)

// Set — behavioral (not just typeof): Safari 7/8 WebKit crashed when the
// constructor got an iterable, and es6-set's own check runs that UNGUARDED so it
// throws at import — hence the try/catch here. We consume an iterable, confirm
// [object Set], the full method set, and a working values iterator.
export const isSupported = (): boolean => {
  try {
    // No constructor at all? Nothing to work with.
    // eslint-disable-next-line es-x/no-set
    if (typeof Set !== 'function') {
      return false;
    }

    // Hand it an iterable — Safari 7/8 choked and threw right here.
    // eslint-disable-next-line compat/compat, es-x/no-set
    const set = new Set(['a', 'b', 'c']);

    // Should stringify as a real Set, not [object Object].
    if (Object.prototype.toString.call(set) !== '[object Set]') {
      return false;
    }

    // The three values above should actually have landed.
    if (set.size !== 3) {
      return false;
    }

    // The whole method set should be present.
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

    // And the iterator should actually walk the values, in order.
    const firstValue = set.values().next();
    return firstValue.done === false && firstValue.value === 'a';
  } catch {
    // Anything threw → treat as unusable and let the polyfill take over.
    return false;
  }
};

export const isSetSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-set-objects
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

const indexOfValue = (self: any, value: any): number => {
  const values = self._values;
  for (let i = 0; i < values.length; i++) {
    if (sameValueZero(values[i], value)) {
      return i;
    }
  }
  return -1;
};

// Prototype-based iterator: `next` lives on the prototype (allocated once and
// shared), so creating an iterator is a single object allocation — no per-call
// closure. State is held in instance fields. GC-leaner than a closure factory.
const SetIterator = function (
  this: any,
  self: any,
  kind: 'values' | 'entries',
): void {
  this._self = self;
  this._index = 0;
  this._kind = kind;
} as any;

SetIterator.prototype.next = function (this: any): any {
  const self = this._self;
  // already exhausted -- _self was released below, nothing left to read
  if (self === null) {
    return { value: undefined, done: true };
  }
  if (this._index < self._values.length) {
    const value = self._values[this._index];
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
  Object.defineProperty(returnSelf, 'name', { value: '[Symbol.iterator]', configurable: true });
}

export const Set = function (this: any, iterable?: any) {
  if (!(this instanceof Set)) {
    throw new TypeError("Constructor Set requires 'new'");
  }
  this._values = [];

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
  if (indexOfValue(this, value) === -1) {
    this._values[this._values.length] = value;
  }
  return this;
};

Set.prototype.has = function (this: any, value: any): boolean {
  return indexOfValue(this, value) !== -1;
};

Set.prototype.delete = function (this: any, value: any): boolean {
  const i = indexOfValue(this, value);
  if (i === -1) {
    return false;
  }
  this._values.splice(i, 1);
  return true;
};

Set.prototype.clear = function (this: any): void {
  this._values.length = 0;
};

Set.prototype.forEach = function (
  this: any,
  callback: (value: any, value2: any, set: any) => void,
  thisArg?: any,
): void {
  for (let i = 0; i < this._values.length; i++) {
    // Set.forEach passes the value twice (value, key) — key === value.
    callback.call(thisArg, this._values[i], this._values[i], this);
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
    return this._values.length;
  },
});
// method-shorthand `get(){}` names the function "get", not "get size" -- the
// descriptor key it's shorthand-named after is "get" itself, not the property
// it ends up installed under.
Object.defineProperty(Object.getOwnPropertyDescriptor(Set.prototype, 'size')!.get!, 'name', {
  value: 'get size',
  configurable: true,
});

if (hasSymbol) {
  // Make the set iterable (values) and report [object Set].
  Object.defineProperty(Set.prototype, (Symbol as any).iterator, { value: Set.prototype.values, writable: true, enumerable: false, configurable: true });
  if ((Symbol as any).toStringTag) {
    Object.defineProperty(Set.prototype, (Symbol as any).toStringTag, { value: 'Set', writable: false, enumerable: false, configurable: true });
  }
}

if (!isSupported()) {
  (window as any).Set = null;
  delete (window as any).Set;
  Object.defineProperty((window as any), 'Set', { value: Set, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).Set, 'name', { value: 'Set', configurable: true });
  Object.defineProperty((window as any).Set, '__polyfilled', { value: true });
}
