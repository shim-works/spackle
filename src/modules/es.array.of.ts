// Match core-js's generic-constructor probe: Array.of must construct through
// its receiver rather than always returning a plain Array.
export const isSupported = (): boolean => {
  try {
    if (typeof Array.of !== 'function') return false;
    const Sub: any = function () {};
    const result = (Array.of as any).call(Sub, 1, 2);
    return result instanceof Sub && result.length === 2 && result[0] === 1 && result[1] === 2;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.of
 *
 * Generic on `this`: `Sub.of(1, 2)` builds a Sub.
 */
// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// IsConstructor without calling the candidate: the native Reflect.construct
// (captured before any polyfill) throws for a non-constructor newTarget. On
// engines without it, a function with an own prototype is the best ES5 test.
const nativeConstruct: any =
  typeof Reflect !== 'undefined' && typeof (Reflect as any).construct === 'function' ? (Reflect as any).construct : undefined;
const noArgs: any[] = [];
const isConstructor = (C: any): boolean => {
  if (typeof C !== 'function') return false;
  if (nativeConstruct) {
    try {
      nativeConstruct(String, noArgs, C);
      return true;
    } catch {
      return false;
    }
  }
  return Object.prototype.hasOwnProperty.call(C, 'prototype');
};

export const arrayOf = function of(this: any): any {
  const C: any = this;
  const len = arguments.length;
  // false when `this` is a constructor that builds the result itself
  const plain = !(C !== Array && isConstructor(C));
  const A: any = plain ? new Array(len) : new C(len);
  for (let k = 0; k < len; k++) {
    if (plain && !(k in ArrayProto)) A[k] = arguments[k];
    else {
      dataDesc.value = arguments[k];
      Object.defineProperty(A, k, dataDesc);
    }
  }
  dataDesc.value = undefined;
  A.length = len;
  return A;
};
