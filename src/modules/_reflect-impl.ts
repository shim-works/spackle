// Ported from: the prior implementation (reflect.ts + is-reflect-supported.ts)

// Reflect — shipped complete (Chrome 49 / Safari 10). No engine has a half-
// baked Reflect, so existence is all we need.
export const isSupported = (): boolean => {
  try {
    return typeof Reflect !== 'undefined';
  } catch {
    return false;
  }
};

export const isReflectSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-reflect-object
 * Inspired by: core-js Reflect modules (lean ES5 subset, bind-trick construct).
 *
 * Known limitations:
 * - [incomplete] No Reflect.metadata.
 * - [incomplete] ownKeys omits Symbol keys when the runtime has no Symbols.
 */

const hasOwn = Object.prototype.hasOwnProperty;
const getProto =
  Object.getPrototypeOf ||
  function (o: any) {
    return o.__proto__ || null;
  };

const setProto =
  Object.setPrototypeOf ||
  function (o: any, proto: any) {
    o.__proto__ = proto;
    return o;
  };

// Walk the prototype chain to find the descriptor that owns `key`.
const findDescriptor = (target: any, key: any): any => {
  let obj = target;
  while (obj !== null && obj !== undefined) {
    if (hasOwn.call(obj, key)) {
      return Object.getOwnPropertyDescriptor(obj, key);
    }
    obj = getProto(obj);
  }
  return undefined;
};

export const Reflect = {
  apply: function (target: any, thisArgument: any, argumentsList: any): any {
    return Function.prototype.apply.call(target, thisArgument, argumentsList);
  },

  // No spread on the floor — bind a null-this constructor with the args spliced
  // in, then `new` it. Re-point the prototype when a distinct newTarget is given.
  construct: function (target: any, argumentsList: any, newTarget?: any): any {
    const args = [null];
    for (let i = 0; i < argumentsList.length; i++) {
      args[args.length] = argumentsList[i];
    }
    const Bound = Function.prototype.bind.apply(target, args as any);
    const instance = new Bound();
    if (newTarget !== undefined && newTarget !== target && newTarget.prototype) {
      setProto(instance, newTarget.prototype);
    }
    return instance;
  },

  defineProperty: function (target: any, key: any, attributes: any): boolean {
    try {
      Object.defineProperty(target, key, attributes);
      return true;
    } catch (e) {
      // Reflect.defineProperty reports failure as `false`, never throws.
      return false;
    }
  },

  deleteProperty: function (target: any, key: any): boolean {
    try {
      delete target[key];
      return true;
    } catch (e) {
      return false;
    }
  },

  get: function (target: any, key: any, receiver?: any): any {
    const desc = findDescriptor(target, key);
    if (desc === undefined) {
      return undefined;
    }
    // Accessor: invoke the getter bound to the receiver (defaults to target).
    if (desc.get) {
      return desc.get.call(receiver === undefined ? target : receiver);
    }
    return desc.value;
  },

  getOwnPropertyDescriptor: function (target: any, key: any): any {
    return Object.getOwnPropertyDescriptor(target, key);
  },

  getPrototypeOf: function (target: any): any {
    return getProto(target);
  },

  has: function (target: any, key: any): boolean {
    return key in target;
  },

  isExtensible: function (target: any): boolean {
    return Object.isExtensible(target);
  },

  ownKeys: function (target: any): any[] {
    const keys = Object.getOwnPropertyNames(target);
    // Append Symbol keys only when the runtime actually has Symbols.
    if (typeof Object.getOwnPropertySymbols === 'function') {
      const symbols = Object.getOwnPropertySymbols(target);
      for (let i = 0; i < symbols.length; i++) {
        keys[keys.length] = symbols[i] as any;
      }
    }
    return keys;
  },

  preventExtensions: function (target: any): boolean {
    try {
      Object.preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  },

  set: function (target: any, key: any, value: any, receiver?: any): boolean {
    const dest = receiver === undefined ? target : receiver;
    const desc = findDescriptor(target, key);
    try {
      // Accessor: drive the setter on the receiver.
      if (desc && desc.set) {
        desc.set.call(dest, value);
        return true;
      }
      // A getter-only accessor has no setter — write must fail.
      if (desc && desc.get && !desc.set) {
        return false;
      }
      dest[key] = value;
      return true;
    } catch (e) {
      return false;
    }
  },

  setPrototypeOf: function (target: any, proto: any): boolean {
    try {
      setProto(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  },
};

if (!isSupported()) {
  (window as any).Reflect = null;
  delete (window as any).Reflect;
  Object.defineProperty((window as any), 'Reflect', { value: Reflect, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).Reflect, 'name', { value: 'Reflect', configurable: true });
  Object.defineProperty((window as any).Reflect, '__polyfilled', { value: true });
}
