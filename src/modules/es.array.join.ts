// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.join)

const nativeJoin = Array.prototype.join;

// Behavioral: mirrors core-js's FORCED (inverted) -- ES3 engines with
// non-enumerable boxed strings, or a non-strict join, need the fill. Both are
// healthy in range, so this never patches at runtime.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeJoin !== 'function') return false;
    // ES3_STRINGS check: modern engines enumerate boxed-string indices
    if (!Object('z').propertyIsEnumerable(0)) return false;
    // strict check: join must throw on a null this
    try {
      (nativeJoin as any).call(null, ',');
      return false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.join
 */
// IndexedObject(RequireObjectCoercible(this)): box, splitting a primitive string
// into an index-accessible object so old non-enumerable-string engines behave.
const toIndexedObject = (value: any): any => {
  if (value === null || value === undefined) {
    throw new TypeError('Array.prototype.join called on null or undefined');
  }
  return typeof value === 'string' ? value.split('') : Object(value);
};

export const arrayJoin = function join(this: any, separator?: any): string {
  return (nativeJoin as any).call(toIndexedObject(this), separator === undefined ? ',' : separator);
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'join', { value: arrayJoin as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.join, 'name', { value: 'join', configurable: true });
  Object.defineProperty((Array.prototype.join as any), '__polyfilled', { value: true });
}
