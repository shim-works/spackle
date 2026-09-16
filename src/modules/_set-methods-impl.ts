// Authored for spackle (no the prior implementation origin) -- based on core-js
// (es.set.{union,intersection,difference,symmetric-difference,is-subset-of,
//  is-superset-of,is-disjoint-from}.v2 + the set-* internals).
//
// core-js-compat tracks the seven ES2024 Set methods as seven module ids, but
// they share one GetSetRecord machinery -- so this is one shared impl (like
// _reflect-impl.ts) that every es.set.*.v2 re-export delegates to.

// Capture the (possibly polyfilled) Set + its prototype ops up front. es.set
// loads before every es.set.*.v2 in stable.ts, so this is the real ctor.
const SetCtor = Set;
const proto: any = Set.prototype;
const add = (set: any, value: any): void => {
  proto.add.call(set, value);
};
const has = (set: any, value?: any): boolean => proto.has.call(set, value);
const remove = (set: any, value: any): void => {
  proto['delete'].call(set, value);
};
const sizeGetter = (Object.getOwnPropertyDescriptor(proto, 'size') as any).get;
const getSize = (set: any): number => sizeGetter.call(set);

// RequireInternalSlot([[SetData]]): has() throws on a non-Set receiver.
const aSet = (it: any): any => {
  has(it);
  return it;
};

// ToIntegerOrInfinity (keeps Infinity for an unbounded set-like size)
const toIntegerOrInfinity = (argument: any): number => {
  const number = +argument;
  if (number !== number || number === 0) return 0;
  return number > 0 ? Math.floor(number) : Math.ceil(number);
};

// GetSetRecord: validate the set-like {size, has, keys} and expose a uniform
// iterator/includes surface.
interface SetRecord {
  size: number;
  getIterator: () => { iterator: any; next: any };
  includes: (value: any) => boolean;
}
const getSetRecord = (obj: any): SetRecord => {
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    throw new TypeError('Set-like is not an object');
  }
  const numSize = +obj.size;
  if (numSize !== numSize) throw new TypeError('Invalid size'); // size undefined -> NaN
  const intSize = toIntegerOrInfinity(numSize);
  if (intSize < 0) throw new RangeError('Invalid size');
  const hasFn = obj.has;
  const keysFn = obj.keys;
  if (typeof hasFn !== 'function') throw new TypeError('has is not callable');
  if (typeof keysFn !== 'function') throw new TypeError('keys is not callable');
  return {
    size: Math.max(intSize, 0),
    getIterator: () => {
      const iterator = keysFn.call(obj);
      if (iterator === null || typeof iterator !== 'object') {
        throw new TypeError('keys() did not return an object');
      }
      return { iterator, next: iterator.next };
    },
    includes: (value: any) => hasFn.call(obj, value),
  };
};

const clone = (set: any): any => {
  const result = new SetCtor();
  const iterator = proto.keys.call(set);
  const next = iterator.next;
  let step;
  while (!(step = next.call(iterator)).done) add(result, step.value);
  return result;
};

// walk a real Set's own values; fn returning `false` stops early -> returns false
const iterateOwn = (set: any, fn: (value: any) => boolean | void): boolean => {
  const iterator = proto.keys.call(set);
  const next = iterator.next;
  let step;
  while (!(step = next.call(iterator)).done) {
    if (fn(step.value) === false) return false;
  }
  return true;
};

// walk a set-like record's iterator; fn returning `false` stops early -> false
const iterateRecord = (record: SetRecord, fn: (value: any) => boolean | void): boolean => {
  const iter = record.getIterator();
  const iterator = iter.iterator;
  const next = iter.next;
  let step;
  while (!(step = next.call(iterator)).done) {
    if (fn(step.value) === false) return false;
  }
  return true;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.union */
export const setUnion = function union(this: any, other: any): any {
  const O = aSet(this);
  const otherRec = getSetRecord(other);
  const result = clone(O);
  iterateRecord(otherRec, (value) => {
    add(result, value);
  });
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.intersection */
export const setIntersection = function intersection(this: any, other: any): any {
  const O = aSet(this);
  const otherRec = getSetRecord(other);
  const result = new SetCtor();
  if (getSize(O) > otherRec.size) {
    iterateRecord(otherRec, (value) => {
      if (has(O, value)) add(result, value);
    });
  } else {
    iterateOwn(O, (value) => {
      if (otherRec.includes(value)) add(result, value);
    });
  }
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.difference */
export const setDifference = function difference(this: any, other: any): any {
  const O = aSet(this);
  const otherRec = getSetRecord(other);
  const result = clone(O);
  if (getSize(result) <= otherRec.size) {
    iterateOwn(result, (value) => {
      if (otherRec.includes(value)) remove(result, value);
    });
  } else {
    iterateRecord(otherRec, (value) => {
      if (has(result, value)) remove(result, value);
    });
  }
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.symmetricdifference */
export const setSymmetricDifference = function symmetricDifference(this: any, other: any): any {
  const O = aSet(this);
  const otherRec = getSetRecord(other);
  const result = clone(O);
  iterateRecord(otherRec, (value) => {
    if (has(O, value)) remove(result, value);
    else add(result, value);
  });
  return result;
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.issubsetof */
export const setIsSubsetOf = function isSubsetOf(this: any, other: any): boolean {
  const O = aSet(this);
  const otherRec = getSetRecord(other);
  if (getSize(O) > otherRec.size) return false;
  return iterateOwn(O, (value) => (otherRec.includes(value) ? undefined : false));
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.issupersetof */
export const setIsSupersetOf = function isSupersetOf(this: any, other: any): boolean {
  const O = aSet(this);
  const otherRec = getSetRecord(other);
  if (getSize(O) < otherRec.size) return false;
  return iterateRecord(otherRec, (value) => (has(O, value) ? undefined : false));
};

/** Spec: https://tc39.es/ecma262/#sec-set.prototype.isdisjointfrom */
export const setIsDisjointFrom = function isDisjointFrom(this: any, other: any): boolean {
  const O = aSet(this);
  const otherRec = getSetRecord(other);
  if (getSize(O) <= otherRec.size) {
    return iterateOwn(O, (value) => (otherRec.includes(value) ? false : undefined));
  }
  return iterateRecord(otherRec, (value) => (has(O, value) ? false : undefined));
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
for (let i = 0; i < METHODS.length; i++) {
  const name = METHODS[i][0];
  if (typeof proto[name] !== 'function') {
    Object.defineProperty(proto, name, { value: METHODS[i][1], writable: true, enumerable: false, configurable: true });
    Object.defineProperty((proto[name] as any), '__polyfilled', { value: true });
  }
}
