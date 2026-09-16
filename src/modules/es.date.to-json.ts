// Authored for spackle (no the prior implementation origin) -- based on core-js (es.date.to-json)

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

/**
 * Spec: https://tc39.es/ecma262/#sec-date.prototype.tojson
 */
// OrdinaryToPrimitive(O, "number") -- valueOf then toString, inlined so this
// island stays self-contained.
const toNumberPrimitive = (input: any): any => {
  if (input === null || typeof input !== 'object') return input;
  const methods = ['valueOf', 'toString'];
  for (let i = 0; i < methods.length; i++) {
    const fn = input[methods[i]];
    if (typeof fn === 'function') {
      const result = fn.call(input);
      if (result === null || typeof result !== 'object') return result;
    }
  }
  throw new TypeError('Cannot convert object to primitive value');
};

export const dateToJSON = function toJSON(this: any, _key?: any): any {
  const object = Object(this);
  const primitive = toNumberPrimitive(object);
  return typeof primitive === 'number' && !isFinite(primitive) ? null : object.toISOString();
};

if (!isSupported()) {
  Object.defineProperty(Date.prototype, 'toJSON', { value: dateToJSON as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Date.prototype.toJSON, 'name', { value: 'toJSON', configurable: true });
  Object.defineProperty((Date.prototype.toJSON as any), '__polyfilled', { value: true });
}
