// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.every / internals/array-iteration)

// Behavioral: a spec-strict every throws when called on a null `this`. Old
// (ES3-era) engines were sloppy. Mirrors core-js's `arrayMethodIsStrict('every')`
// -- true in every engine in range, so this never patches at runtime.
export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.every;
    if (typeof method !== 'function') return false;
    try {
      (method as any).call(null, () => 1, 1);
      return false; // a strict method throws on a null this
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.every
 */
const toObject = (arg: any): any => {
  if (arg === null || arg === undefined) throw new TypeError('Cannot convert undefined or null to object');
  return Object(arg);
};
const toLength = (value: any): number => {
  const n = Number(value);
  if (isNaN(n) || n <= 0) return 0;
  return n > 9007199254740991 ? 9007199254740991 : Math.floor(n);
};

export const arrayEvery = function every(this: any, callbackfn: any): boolean {
  const O = toObject(this);
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  const length = toLength(O.length);
  for (let index = 0; index < length; index++) {
    if (index in O) {
      if (!callbackfn.call(thisArg, O[index], index, O)) return false;
    }
  }
  return true;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'every', { value: arrayEvery as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.every, 'name', { value: 'every', configurable: true });
  Object.defineProperty((Array.prototype.every as any), '__polyfilled', { value: true });
}
