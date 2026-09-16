// Ported from: the prior implementation (object-set-prototype-of.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
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
  if (protoSetterWorks) {
    target.__proto__ = proto;
  }
  return target;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'setPrototypeOf', { value: objectSetPrototypeOf as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.setPrototypeOf, 'name', { value: 'setPrototypeOf', configurable: true });
  Object.defineProperty((Object.setPrototypeOf as any), '__polyfilled', { value: true });
}
