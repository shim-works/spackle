// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.for-each / internals/array-for-each)

// Behavioral: mirrors core-js's `arrayMethodIsStrict('forEach')` -- a spec-strict
// forEach throws on a null `this`. True in every engine in range.
export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.forEach;
    if (typeof method !== 'function') return false;
    try {
      (method as any).call(null, () => 1, 1);
      return false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.foreach
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

export const arrayForEach = function forEach(this: any, callbackfn: any): void {
  const O = toObject(this);
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  const length = toLength(O.length);
  for (let index = 0; index < length; index++) {
    if (index in O) {
      callbackfn.call(thisArg, O[index], index, O);
    }
  }
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'forEach', { value: arrayForEach as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.forEach, 'name', { value: 'forEach', configurable: true });
  Object.defineProperty((Array.prototype.forEach as any), '__polyfilled', { value: true });
}
