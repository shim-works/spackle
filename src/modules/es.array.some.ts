// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.some / internals/array-iteration)

// Behavioral: mirrors core-js's `arrayMethodIsStrict('some')` -- a spec-strict
// some throws on a null `this`. True in every engine in range.
export const isSupported = (): boolean => {
  try {
    const method = Array.prototype.some;
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
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.some
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

export const arraySome = function some(this: any, callbackfn: any): boolean {
  const O = toObject(this);
  const thisArg = arguments.length > 1 ? arguments[1] : undefined;
  const length = toLength(O.length);
  for (let index = 0; index < length; index++) {
    if (index in O) {
      if (callbackfn.call(thisArg, O[index], index, O)) return true;
    }
  }
  return false;
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'some', { value: arraySome as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.some, 'name', { value: 'some', configurable: true });
  Object.defineProperty((Array.prototype.some as any), '__polyfilled', { value: true });
}
