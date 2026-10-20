// Based on core-js (es.date.to-json)
const nativeToJSON = Date.prototype.toJSON;

// Behavioral: toJSON is ES5 (present in range) but some old engines return a
// string for `new Date(NaN).toJSON()` instead of null, and mis-handle a generic
// `this` that carries its own toISOString. Mirrors core-js's FORCED.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeToJSON !== 'function') return false;
    if (new Date(NaN).toJSON() !== null) return false;
    if ((nativeToJSON.call({ toISOString: () => 1 } as any) as unknown) !== 1) return false;
    return true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-date.prototype.tojson */
export const dateToJSON = function toJSON(this: any, _key?: any): any {
  const object = Object(this);
  // inlined: toNumberPrimitive(object) -- OrdinaryToPrimitive(O, "number")
  let primitive: any = object;
  if (object !== null && typeof object === 'object') {
    let converted = false;
    const valueOf = object.valueOf;
    if (typeof valueOf === 'function') {
      const result = valueOf.call(object);
      if (result === null || typeof result !== 'object') {
        primitive = result;
        converted = true;
      }
    }
    if (!converted) {
      const toString = object.toString;
      if (typeof toString === 'function') {
        const result = toString.call(object);
        if (result === null || typeof result !== 'object') {
          primitive = result;
          converted = true;
        }
      }
    }
    if (!converted) throw new TypeError('Cannot convert object to primitive value');
  }
  return typeof primitive === 'number' && primitive - primitive !== 0 ? null : object.toISOString(); // x - x === 0: false for NaN and ±Infinity, and no global isFinite call
};

