// Based on core-js (es.number.to-precision)
const nativeToPrecision = Number.prototype.toPrecision;

// Behavioural (core-js's FORCED): old engines mishandle toPrecision(undefined)
// and don't throw on a non-number `this`.
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
 * Formatting stays native; this fixes the `undefined` argument and the receiver check.
 */
export const numberToPrecision = function toPrecision(this: any, precision?: any): string {
  // inlined: thisNumberValue(this)
  const value = (Number.prototype.valueOf as any).call(this);
  return precision === undefined
    ? (nativeToPrecision as any).call(value)
    : (nativeToPrecision as any).call(value, precision);
};

