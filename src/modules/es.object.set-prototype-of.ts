export const isSupported = (): boolean => {
  try {
    return typeof Object.setPrototypeOf === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-object.setprototypeof
 * Inspired by: es-shims object.setprototypeof (__proto__ assignment)
 */

// Does this engine honor `obj.__proto__ = proto`? Checked once.
const protoSetterWorks = (function (): boolean {
  try {
    const probe: any = {};
    probe.__proto__ = Array.prototype;
    return probe instanceof Array;
  } catch {
    return false;
  }
})();

// The __proto__ setter, captured once: `target.__proto__ = x` on an
// Object.create(null) target would just make an own property.
const protoSetter = (function (): any {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');
    return descriptor && typeof descriptor.set === 'function' ? descriptor.set : null;
  } catch {
    return null;
  }
})();

export const objectSetPrototypeOf = (target: any, proto: any): any => {
  if (target === null || target === undefined) {
    throw new TypeError('Object.setPrototypeOf called on null or undefined');
  }
  if (proto !== null && typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null: ' + proto);
  }
  // Primitives have an immutable prototype — return as-is.
  if (typeof target !== 'object' && typeof target !== 'function') {
    return target;
  }
  if (protoSetter) {
    // the native setter already throws for a cycle or a non-extensible target
    protoSetter.call(target, proto);
  } else if (protoSetterWorks) {
    target.__proto__ = proto;
  }
  // [[SetPrototypeOf]] returned false: the spec answer is a TypeError, not a
  // silent no-op
  if (Object.getPrototypeOf(target) !== proto) {
    throw new TypeError('Object.setPrototypeOf: cannot set the prototype of this object');
  }
  return target;
};

