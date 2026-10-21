// ids: es.set.difference.v2, es.set.intersection.v2, es.set.is-disjoint-from.v2,
//   es.set.is-subset-of.v2, es.set.is-superset-of.v2, es.set.symmetric-difference.v2,
//   es.set.union.v2
// Based on core-js (es.set.*.v2 and the set-* internals).
// One shared impl for the seven ES2024 Set methods (one GetSetRecord machinery).
import { define } from '../define.js';

// Set and its prototype ops, captured once at install (before user code can
// patch them): the methods read the receiver's [[SetData]] through these, never
// through whatever Set.prototype.add/has/keys are later. es.set installs after
// every module has evaluated, so at module scope there may be no Set.
let SetCtor: any;
let proto: any;
let sizeGetter: any;
let hasFn: any;
let addFn: any;
let keysFn: any;

// Call sites guard it, so the steady state pays no call. install() re-binds to
// whichever Set is live by then (es.set may have replaced a broken native).
const bind = (): void => {
  SetCtor = typeof Set !== 'undefined' ? Set : null;
  proto = SetCtor ? SetCtor.prototype : null;
  const sizeDescriptor = proto && Object.getOwnPropertyDescriptor(proto, 'size');
  sizeGetter = sizeDescriptor ? sizeDescriptor.get : null;
  hasFn = proto ? proto.has : null;
  addFn = proto ? proto.add : null;
  keysFn = proto ? proto.keys : null;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.union */
export const setUnion = function union(this: any, other: any): any {
  // inlined: aSet(this) -- the native has() brand-checks
  if (proto === undefined) bind();
  hasFn.call(this);
  const O = this;
  // inlined: getSetRecord(other)
  if (other === null || (typeof other !== 'object' && typeof other !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const rawSize = +other.size;
  if (rawSize !== rawSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const otherHas = other.has;
  const otherKeys = other.keys;
  if (typeof otherHas !== 'function') throw new TypeError('has is not callable');
  if (typeof otherKeys !== 'function') throw new TypeError('keys is not callable');
  // inlined: clone(O)
  const result = new SetCtor();
  const cloneIterator = keysFn.call(O);
  const cloneNext = cloneIterator.next;
  let cloneStep;
  while (!(cloneStep = cloneNext.call(cloneIterator)).done) addFn.call(result, cloneStep.value);
  // inlined: iterateRecord(other, ...)
  // inlined: getIterator()
  const recordIterator = otherKeys.call(other);
  if (recordIterator === null || typeof recordIterator !== 'object') {
    throw new TypeError('keys() did not return an object');
  }
  const recordNext = recordIterator.next;
  let recordStep;
  while (!(recordStep = recordNext.call(recordIterator)).done) {
    const value = recordStep.value;
    addFn.call(result, value) /* inlined: add */;
  }
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.intersection */
export const setIntersection = function intersection(this: any, other: any): any {
  // inlined: aSet(this) -- the native has() brand-checks
  if (proto === undefined) bind();
  hasFn.call(this);
  const O = this;
  // inlined: getSetRecord(other)
  if (other === null || (typeof other !== 'object' && typeof other !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const rawSize = +other.size;
  if (rawSize !== rawSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const otherSize = intSize;
  const otherHas = other.has;
  const otherKeys = other.keys;
  if (typeof otherHas !== 'function') throw new TypeError('has is not callable');
  if (typeof otherKeys !== 'function') throw new TypeError('keys is not callable');
  const result = new SetCtor();
  if (sizeGetter.call(O) /* inlined: getSize */ > otherSize) {
    // inlined: iterateRecord(other, ...)
    // inlined: getIterator()
    const recordIterator = otherKeys.call(other);
    if (recordIterator === null || typeof recordIterator !== 'object') {
      throw new TypeError('keys() did not return an object');
    }
    const recordNext = recordIterator.next;
    let recordStep;
    while (!(recordStep = recordNext.call(recordIterator)).done) {
      const value = recordStep.value;
      if (hasFn.call(O, value) /* inlined: has */) addFn.call(result, value) /* inlined: add */;
    }
  } else {
    // inlined: iterateOwn(O, ...)
    const ownIterator = keysFn.call(O);
    const ownNext = ownIterator.next;
    let ownStep;
    while (!(ownStep = ownNext.call(ownIterator)).done) {
      const value = ownStep.value;
      if (otherHas.call(other, value)) addFn.call(result, value) /* inlined: add */;
    }
  }
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.difference */
export const setDifference = function difference(this: any, other: any): any {
  // inlined: aSet(this) -- the native has() brand-checks
  if (proto === undefined) bind();
  hasFn.call(this);
  const O = this;
  // inlined: getSetRecord(other)
  if (other === null || (typeof other !== 'object' && typeof other !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const rawSize = +other.size;
  if (rawSize !== rawSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const otherSize = intSize;
  const otherHas = other.has;
  const otherKeys = other.keys;
  if (typeof otherHas !== 'function') throw new TypeError('has is not callable');
  if (typeof otherKeys !== 'function') throw new TypeError('keys is not callable');
  // inlined: clone(O)
  const result = new SetCtor();
  const cloneIterator = keysFn.call(O);
  const cloneNext = cloneIterator.next;
  let cloneStep;
  while (!(cloneStep = cloneNext.call(cloneIterator)).done) addFn.call(result, cloneStep.value);
  if (sizeGetter.call(result) /* inlined: getSize */ <= otherSize) {
    // inlined: iterateOwn(result, ...)
    const ownIterator = keysFn.call(result);
    const ownNext = ownIterator.next;
    let ownStep;
    while (!(ownStep = ownNext.call(ownIterator)).done) {
      const value = ownStep.value;
      if (otherHas.call(other, value)) proto['delete'].call(result, value) /* inlined: remove */;
    }
  } else {
    // inlined: iterateRecord(other, ...)
    // inlined: getIterator()
    const recordIterator = otherKeys.call(other);
    if (recordIterator === null || typeof recordIterator !== 'object') {
      throw new TypeError('keys() did not return an object');
    }
    const recordNext = recordIterator.next;
    let recordStep;
    while (!(recordStep = recordNext.call(recordIterator)).done) {
      const value = recordStep.value;
      if (hasFn.call(result, value) /* inlined: has */) proto['delete'].call(result, value) /* inlined: remove */;
    }
  }
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.symmetricdifference */
export const setSymmetricDifference = function symmetricDifference(this: any, other: any): any {
  // inlined: aSet(this) -- the native has() brand-checks
  if (proto === undefined) bind();
  hasFn.call(this);
  const O = this;
  // inlined: getSetRecord(other)
  if (other === null || (typeof other !== 'object' && typeof other !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const rawSize = +other.size;
  if (rawSize !== rawSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const otherHas = other.has;
  const otherKeys = other.keys;
  if (typeof otherHas !== 'function') throw new TypeError('has is not callable');
  if (typeof otherKeys !== 'function') throw new TypeError('keys is not callable');
  // inlined: clone(O)
  const result = new SetCtor();
  const cloneIterator = keysFn.call(O);
  const cloneNext = cloneIterator.next;
  let cloneStep;
  while (!(cloneStep = cloneNext.call(cloneIterator)).done) addFn.call(result, cloneStep.value);
  // inlined: iterateRecord(other, ...)
  // inlined: getIterator()
  const recordIterator = otherKeys.call(other);
  if (recordIterator === null || typeof recordIterator !== 'object') {
    throw new TypeError('keys() did not return an object');
  }
  const recordNext = recordIterator.next;
  let recordStep;
  while (!(recordStep = recordNext.call(recordIterator)).done) {
    const value = recordStep.value;
    if (hasFn.call(O, value) /* inlined: has */) proto['delete'].call(result, value) /* inlined: remove */;
    else addFn.call(result, value) /* inlined: add */;
  }
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.issubsetof */
export const setIsSubsetOf = function isSubsetOf(this: any, other: any): boolean {
  // inlined: aSet(this) -- the native has() brand-checks
  if (proto === undefined) bind();
  hasFn.call(this);
  const O = this;
  // inlined: getSetRecord(other)
  if (other === null || (typeof other !== 'object' && typeof other !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const rawSize = +other.size;
  if (rawSize !== rawSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const otherSize = intSize;
  const otherHas = other.has;
  const otherKeys = other.keys;
  if (typeof otherHas !== 'function') throw new TypeError('has is not callable');
  if (typeof otherKeys !== 'function') throw new TypeError('keys is not callable');
  if (sizeGetter.call(O) /* inlined: getSize */ > otherSize) return false;
  // inlined: iterateOwn(O, ...)
  const ownIterator = keysFn.call(O);
  const ownNext = ownIterator.next;
  let ownStep;
  while (!(ownStep = ownNext.call(ownIterator)).done) {
    const value = ownStep.value;
    if (!otherHas.call(other, value)) return false;
  }
  return true;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.issupersetof */
export const setIsSupersetOf = function isSupersetOf(this: any, other: any): boolean {
  // inlined: aSet(this) -- the native has() brand-checks
  if (proto === undefined) bind();
  hasFn.call(this);
  const O = this;
  // inlined: getSetRecord(other)
  if (other === null || (typeof other !== 'object' && typeof other !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const rawSize = +other.size;
  if (rawSize !== rawSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const otherSize = intSize;
  const otherHas = other.has;
  const otherKeys = other.keys;
  if (typeof otherHas !== 'function') throw new TypeError('has is not callable');
  if (typeof otherKeys !== 'function') throw new TypeError('keys is not callable');
  if (sizeGetter.call(O) /* inlined: getSize */ < otherSize) return false;
  // inlined: iterateRecord(other, ...)
  // inlined: getIterator()
  const recordIterator = otherKeys.call(other);
  if (recordIterator === null || typeof recordIterator !== 'object') {
    throw new TypeError('keys() did not return an object');
  }
  const recordNext = recordIterator.next;
  let recordStep;
  while (!(recordStep = recordNext.call(recordIterator)).done) {
    const value = recordStep.value;
    if (!hasFn.call(O, value) /* inlined: has */) {
      // close the other set's iterator before answering early
      const ret = recordIterator.return;
      if (ret !== undefined && ret !== null) {
        if (typeof ret !== 'function') throw new TypeError('iterator.return is not a function');
        const closed = ret.call(recordIterator);
        if (closed === null || (typeof closed !== 'object' && typeof closed !== 'function')) {
          throw new TypeError('iterator.return() did not return an object');
        }
      }
      return false;
    }
  }
  return true;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.isdisjointfrom */
export const setIsDisjointFrom = function isDisjointFrom(this: any, other: any): boolean {
  // inlined: aSet(this) -- the native has() brand-checks
  if (proto === undefined) bind();
  hasFn.call(this);
  const O = this;
  // inlined: getSetRecord(other)
  if (other === null || (typeof other !== 'object' && typeof other !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const rawSize = +other.size;
  if (rawSize !== rawSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const otherSize = intSize;
  const otherHas = other.has;
  const otherKeys = other.keys;
  if (typeof otherHas !== 'function') throw new TypeError('has is not callable');
  if (typeof otherKeys !== 'function') throw new TypeError('keys is not callable');
  if (sizeGetter.call(O) /* inlined: getSize */ <= otherSize) {
    // inlined: iterateOwn(O, ...)
    const ownIterator = keysFn.call(O);
    const ownNext = ownIterator.next;
    let ownStep;
    while (!(ownStep = ownNext.call(ownIterator)).done) {
      const value = ownStep.value;
      if (otherHas.call(other, value)) return false;
    }
    return true;
  }
  // inlined: iterateRecord(other, ...)
  // inlined: getIterator()
  const recordIterator = otherKeys.call(other);
  if (recordIterator === null || typeof recordIterator !== 'object') {
    throw new TypeError('keys() did not return an object');
  }
  const recordNext = recordIterator.next;
  let recordStep;
  while (!(recordStep = recordNext.call(recordIterator)).done) {
    const value = recordStep.value;
    if (hasFn.call(O, value) /* inlined: has */) {
      // close the other set's iterator before answering early
      const ret = recordIterator.return;
      if (ret !== undefined && ret !== null) {
        if (typeof ret !== 'function') throw new TypeError('iterator.return is not a function');
        const closed = ret.call(recordIterator);
        if (closed === null || (typeof closed !== 'object' && typeof closed !== 'function')) {
          throw new TypeError('iterator.return() did not return an object');
        }
      }
      return false;
    }
  }
  return true;
};

const METHODS: Array<[string, Function]> = [
  ['union', setUnion],
  ['intersection', setIntersection],
  ['difference', setDifference],
  ['symmetricDifference', setSymmetricDifference],
  ['isSubsetOf', setIsSubsetOf],
  ['isSupersetOf', setIsSupersetOf],
  ['isDisjointFrom', setIsDisjointFrom],
];

// Existence-based: on the Chrome 38 / Safari 7 floor all seven are simply
// absent, so a per-method existence gate installs the correct spec impls.
export const isSupported = (): boolean => {
  try {
    if (proto === undefined) bind();
    for (let i = 0; i < METHODS.length; i++) {
      if (typeof proto[METHODS[i][0]] !== 'function') return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Known limitations:
 * - [incomplete] installs on absence only; it does not re-detect the Safari
 *   17.x set-like edge bugs core-js's behavioral FORCED catches (a method that
 *   exists but mishandles a mutating set-like argument is left as-is).
 */
// Bound at load where a Set exists, so even a direct import never captures
// methods user code patched later.
if (typeof Set !== 'undefined') bind();

export const install = (): void => {
  bind();
  if (!proto) return;
  // Per-method, so a partial engine gets only the members it is missing --
  // which is why install-polyfills.ts calls this one ungated.
  for (let i = 0; i < METHODS.length; i++) {
    const name = METHODS[i][0];
    if (typeof proto[name] !== 'function') define(proto, name, METHODS[i][1]);
  }
};
