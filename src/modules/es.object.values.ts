// Object.values: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof Object.values === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.values */
// Captured at load: user code replacing Object.keys/getOwnPropertyNames must not
// change what this returns (the spec reads [[OwnPropertyKeys]] directly).
// Object.keys, as core-js: only the enumerable own keys get walked (each is still
// re-checked live below), not every hidden one getOwnPropertyNames returns.
// Captured at load, so a user replacement of Object.keys changes nothing.
const ownKeys = Object.keys;
const toObject = Object;
const isEnumerable = Object.prototype.propertyIsEnumerable;
// One descriptor for CreateArrayFromList, reused; cleared after each call.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

export const objectValues = function values(obj: any): any[] {
  if (obj === null || obj === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const object = toObject(obj);
  // EnumerableOwnProperties: every own string key, re-checked just before it is read
  const keys = ownKeys(object);
  const out: any[] = [];
  let count = 0;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (isEnumerable.call(object, key)) {
      if (!(count in ArrayProto)) out[count++] = object[key];
      else {
        dataDesc.value = object[key];
        Object.defineProperty(out, count++, dataDesc);
      }
    }
  }
  dataDesc.value = undefined;
  return out;
};
