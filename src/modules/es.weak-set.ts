// Existence-only: the island rides on whichever WeakMap is live.
import { define } from '../define.js';
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
 * A hidden per-set property on each member object, like es.weak-map, so it
 * needs no WeakMap underneath. Symbol members (CanBeHeldWeakly allows
 * non-registered ones) go in a side list.
 *
 * Known limitations:
 * - [incomplete] A frozen / non-extensible object cannot be added: it can't
 *   take the hidden property.
 * - [incomplete] Symbol members are held strongly: ES5 can't make them weak.
 */
// One reused descriptor per island: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };
const MEMBER: PropertyDescriptor = { value: true, writable: true, enumerable: false, configurable: true };
const hasOwn = Object.prototype.hasOwnProperty;
const iteratorKey: any = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
const arrayIterAtLoad: any = iteratorKey ? (Array.prototype as any)[iteratorKey] : undefined;
let counter = 0;

// Not inlined: holds a try/catch, and Chrome 41 (Crankshaft) won't optimise a function
// containing one, so inlining this deopts its caller. Measured with every try helper
// inlined: +15% garbage in the speed test on Chrome 41.
const isRegisteredSymbol = (value: any): boolean => {
  try {
    return (Symbol as any).keyFor(value) !== undefined;
  } catch (e) {
    return false;
  }
};
const symbolIndex = (self: any, value: any): number => {
  const list = self._syms;
  if (list === undefined) return -1;
  for (let i = 0; i < list.length; i++) if (list[i] === value) return i;
  return -1;
};
// Not inlined: holds a try/catch, and Chrome 41 (Crankshaft) won't optimise a function
// containing one, so inlining this deopts its caller. Measured with every try helper
// inlined: +15% garbage in the speed test on Chrome 41.
const closeIterator = (iterator: any): void => {
  try {
    const ret = iterator['return'];
    if (ret !== undefined && ret !== null) ret.call(iterator);
  } catch (e) {
    /* the original error wins */
  }
};

export const WeakSet = function (this: any) {
  if (!(this instanceof WeakSet)) {
    throw new TypeError("Constructor WeakSet requires 'new'");
  }
  counter++;
  SLOT.value = `__ws$${counter}$${Math.random().toString(36).substring(2)}`;
  Object.defineProperty(this, '_wsid', SLOT);
  SLOT.value = undefined; // never pin the last value

  const iterable = arguments.length > 0 ? arguments[0] : undefined;
  if (iterable === null || iterable === undefined) {
    return;
  }
  // Get(set, "add") for every iterable, even an empty one
  const adder = this.add;
  if (typeof adder !== 'function') {
    throw new TypeError('WeakSet constructor: this.add is not a function');
  }
  if (Array.isArray(iterable) && (!iteratorKey || (iterable[iteratorKey] === arrayIterAtLoad && (Array.prototype as any)[iteratorKey] === arrayIterAtLoad))) {
    for (let i = 0; i < iterable.length; i++) adder.call(this, iterable[i]);
    return;
  }
  const method = iteratorKey ? iterable[iteratorKey] : undefined;
  if (typeof method !== 'function') {
    throw new TypeError('WeakSet constructor argument is not iterable');
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
    const value = step.value;
    try {
      adder.call(this, value);
    } catch (error) {
      closeIterator(iterator);
      throw error;
    }
  }
} as any;

WeakSet.prototype.add = function (this: any, value: any): any {
  // inlined: requireWeakSet(this, 'add')
  if (this === null || typeof this !== 'object' || this._wsid === undefined) {
    throw new TypeError('Method WeakSet.prototype.add called on incompatible receiver');
  }
  // inlined: canBeHeldWeakly(value) -- an object, or a symbol not in the global
  // registry; only a symbol reaches isRegisteredSymbol's try
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    if (typeof value !== 'symbol' || isRegisteredSymbol(value)) throw new TypeError('Invalid value used in weak set');
  }
  if (typeof value === 'symbol') {
    if (symbolIndex(this, value) === -1) {
      if (this._syms === undefined) {
        SLOT.value = [];
        Object.defineProperty(this, '_syms', SLOT);
        SLOT.value = undefined;
      }
      this._syms.push(value);
    }
    return this;
  }
  const id = this._wsid;
  if (!hasOwn.call(value, id)) {
    if (!Object.isExtensible(value)) {
      throw new TypeError('Cannot add a non-extensible object to a WeakSet');
    }
    Object.defineProperty(value, id, MEMBER);
  }
  return this;
};

WeakSet.prototype.has = function (this: any, value: any): boolean {
  // inlined: requireWeakSet(this, 'has')
  if (this === null || typeof this !== 'object' || this._wsid === undefined) {
    throw new TypeError('Method WeakSet.prototype.has called on incompatible receiver');
  }
  if (typeof value === 'symbol') return symbolIndex(this, value) !== -1;
  // inlined: isObject(value)
  return (value !== null && (typeof value === 'object' || typeof value === 'function')) && hasOwn.call(value, this._wsid);
};

WeakSet.prototype.delete = function (this: any, value: any): boolean {
  // inlined: requireWeakSet(this, 'delete')
  if (this === null || typeof this !== 'object' || this._wsid === undefined) {
    throw new TypeError('Method WeakSet.prototype.delete called on incompatible receiver');
  }
  if (typeof value === 'symbol') {
    const at = symbolIndex(this, value);
    if (at === -1) return false;
    this._syms.splice(at, 1);
    return true;
  }
  // inlined: isObject(value)
  if ((value === null || (typeof value !== 'object' && typeof value !== 'function')) || !hasOwn.call(value, this._wsid)) return false;
  delete value[this._wsid];
  return true;
};

// Methods non-enumerable, writable and configurable, with their spec names.
const weakSetMethods = ['add', 'has', 'delete'];
for (let i = 0; i < weakSetMethods.length; i++) {
  const fn = (WeakSet.prototype as any)[weakSetMethods[i]];
  try {
    Object.defineProperty(fn, 'name', { value: weakSetMethods[i], configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty(WeakSet.prototype, weakSetMethods[i], { value: fn, writable: true, enumerable: false, configurable: true });
}
if (typeof Symbol !== 'undefined' && (Symbol as any).toStringTag) {
  Object.defineProperty(WeakSet.prototype, (Symbol as any).toStringTag, { value: 'WeakSet', writable: false, enumerable: false, configurable: true });
}

/*
 * core-js ACCEPT_ITERABLES on a kept native: Chrome < 51's WeakSet doesn't close
 * the iterator when an item is rejected. Then construction goes through a
 * wrapper (as es.map's); the native's storage and methods stay.
 */
const nativeClosesIteratorWeakSet = (Native: any): boolean => {
  const key = typeof Symbol !== 'undefined' ? (Symbol as any).iterator : undefined;
  if (typeof key !== 'symbol') return true; // nothing else is iterable here
  let closed = false;
  let steps = 0;
  const bad: any = {};
  bad[key] = function () {
    return {
      // one rejected item, then done: a native that accepts it can't loop forever
      next: function () { return steps++ ? { done: true, value: undefined } : { done: false, value: 1 }; },
      'return': function () { closed = true; return {}; },
    };
  };
  try {
    new Native(bad);
  } catch (e) {
    return closed;
  }
  return true; // accepted 1: nothing this check can say
};

const wrapNativeWeakSet = (Native: any): void => {
  const proto = Native.prototype;
  const getProto = Object.getPrototypeOf;
  const Wrapped: any = function (this: any) {
    if (!(this instanceof Wrapped)) throw new TypeError("Constructor WeakSet requires 'new'");
    const that = new Native();
    const own = getProto(this);
    if (own !== proto) {
      if (typeof Object.setPrototypeOf === 'function') Object.setPrototypeOf(that, own);
      else that.__proto__ = own;
    }
    const iterable = arguments.length > 0 ? arguments[0] : undefined;
    if (iterable === null || iterable === undefined) return that;
    // Get(set, "add") happens for every iterable, even an empty one
    const adder = that.add;
    if (typeof adder !== 'function') throw new TypeError('WeakSet constructor: this.add is not a function');
    const method = iterable[(Symbol as any).iterator];
    if (typeof method !== 'function') throw new TypeError('WeakSet constructor argument is not iterable');
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
      if (step.done) return that;
      const item = step.value;
      try {
        adder.call(that, item);
      } catch (error) {
        try {
          const ret = iterator['return'];
          if (ret !== undefined && ret !== null) ret.call(iterator);
        } catch (e) { /* the original error wins */ }
        throw error;
      }
    }
  };
  try { Object.defineProperty(Wrapped, 'name', { value: 'WeakSet', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Wrapped.prototype = proto;
  Object.defineProperty(proto, 'constructor', { value: Wrapped, writable: true, enumerable: false, configurable: true });
  (window as any).WeakSet = null;
  delete (window as any).WeakSet;
  define((window as any), 'WeakSet', Wrapped);
};

// core-js setToStringTag on a kept native (Chrome 38-48, Safari 9)
export const tagNativeWeakSet = (): void => {
  const Native = (window as any).WeakSet;
  const tag = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;
  if (typeof Native !== 'function' || Native === WeakSet) return;
  if (tag) try {
    if (!Object.prototype.hasOwnProperty.call(Native.prototype, tag)) Object.defineProperty(Native.prototype, tag, { value: 'WeakSet', writable: false, enumerable: false, configurable: true });
  } catch (e) { /* locked-down prototype */ }
  if (!nativeClosesIteratorWeakSet(Native)) wrapNativeWeakSet(Native);
};
