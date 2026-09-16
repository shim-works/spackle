// Ported from: the prior implementation (object-is.ts + is-object-is-supported.ts)

// Object.is — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken Object.is, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof Object.is === 'function';
  } catch {
    return false;
  }
};

export const isObjectIsSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.is
 * GC: pure function, zero allocations.
 */
export const objectIs = (first: any, second: any): boolean => {
  if (first === second) {
    // === already said equal. the only gotcha left is +0 vs -0, which === can't
    // tell apart. dividing by them does: 1/+0 is Infinity, 1/-0 is -Infinity.
    return first !== 0 || 1 / first === 1 / second;
  }
  // not === equal. the one case that should still count as "same" is NaN vs
  // NaN — and NaN is the only value that isn't equal to itself.
  return first !== first && second !== second;
};

if (!isSupported()) {
  Object.defineProperty(Object, 'is', { value: objectIs as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.is, 'name', { value: 'is', configurable: true });
  Object.defineProperty((Object.is as any), '__polyfilled', { value: true });
}
