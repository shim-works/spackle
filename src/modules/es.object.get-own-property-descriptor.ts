// Ported from: the prior implementation (object-get-own-property-descriptor.ts + is-object-get-own-property-descriptor-supported.ts)

// Object.getOwnPropertyDescriptor — behavioral: ES5 engines threw on a
// primitive first arg; ES2015 boxes it instead. Probing a string picks up an
// own index property either way.
export const isSupported = (): boolean => {
  try {
    // ES5 natives throw right here; ES2015 sees the boxed String's index 0
    const descriptor = Object.getOwnPropertyDescriptor('a', 0);
    return !!descriptor && descriptor.value === 'a';
  } catch {
    return false;
  }
};

export const isObjectGetOwnPropertyDescriptorSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
 */

// ES5 natives threw on primitives; ES2015 boxes them first
const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

export const objectGetOwnPropertyDescriptor = function (
  target: any,
  key: any
): PropertyDescriptor | undefined {
  // ToObject still rejects null/undefined — Object() would box them to {}
  if (target === null || target === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return nativeGetOwnPropertyDescriptor(Object(target), key);
};

if (!isSupported()) {
  Object.defineProperty(Object, 'getOwnPropertyDescriptor', { value: objectGetOwnPropertyDescriptor as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Object.getOwnPropertyDescriptor, 'name', { value: 'getOwnPropertyDescriptor', configurable: true });
  Object.defineProperty((Object.getOwnPropertyDescriptor as any), '__polyfilled', { value: true });
}
