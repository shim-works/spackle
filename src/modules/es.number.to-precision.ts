// Authored for spackle (no the prior implementation origin) -- based on core-js (es.number.to-precision)

const nativeToPrecision = Number.prototype.toPrecision;

const thisNumberValue = (value: any): number => (Number.prototype.valueOf as any).call(value);

// Behavioral: mirrors core-js's FORCED (inverted). Old engines differ between
// `n.toPrecision()` and `n.toPrecision(undefined)`, and some don't throw on a
// non-number `this`. A healthy native returns '1' for `(1).toPrecision(undefined)`
// and throws on `{}`.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeToPrecision !== 'function') return false;
    if (nativeToPrecision.call(1, undefined as any) !== '1') return false;
    try {
      (nativeToPrecision as any).call({});
      return false; // a healthy native throws on a non-number this
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.prototype.toprecision
 *
 * The formatting is delegated to the native; this wrapper only fixes the
 * two bugs the probe detects: the `undefined` argument arity and unboxing/
 * validating `this` (throws on a non-number receiver).
 */
export const numberToPrecision = function toPrecision(this: any, precision?: any): string {
  const value = thisNumberValue(this);
  return precision === undefined
    ? (nativeToPrecision as any).call(value)
    : (nativeToPrecision as any).call(value, precision);
};

if (!isSupported()) {
  Object.defineProperty(Number.prototype, 'toPrecision', { value: numberToPrecision as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.prototype.toPrecision, 'name', { value: 'toPrecision', configurable: true });
  Object.defineProperty((Number.prototype.toPrecision as any), '__polyfilled', { value: true });
}
