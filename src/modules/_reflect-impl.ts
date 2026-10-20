// ids: es.reflect.apply, es.reflect.construct, es.reflect.define-property,
//   es.reflect.delete-property, es.reflect.get, es.reflect.get-own-property-descriptor,
//   es.reflect.get-prototype-of, es.reflect.has, es.reflect.is-extensible, es.reflect.own-keys,
//   es.reflect.prevent-extensions, es.reflect.set, es.reflect.set-prototype-of

// Reflect — shipped complete (Chrome 49 / Safari 10). No engine has a half-
// baked Reflect, so existence is all we need.
export const isSupported = (): boolean => {
  try {
    // Read the global: the bare name `Reflect` resolves to this module's own polyfill.
    const Native = (window as any).Reflect;
    return typeof Native !== 'undefined';
  } catch {
    return false;
  }
};

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

// Walk the chain to the descriptor that owns `key`. Step-capped: a longer chain
// is a cycle; give up with undefined rather than hang.
const MAX_CHAIN = 100;

export const Reflect = {
  // apply/construct are the two exceptions: the spec checks callable and
  // constructor respectively, which Function.prototype.apply/bind already do.
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
    // inlined: anObject(target, 'defineProperty')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.defineProperty called on non-object');
    }
    try {
      Object.defineProperty(target, key, attributes);
      return true;
    } catch (e) {
      // Reflect.defineProperty reports failure as `false`, never throws.
      return false;
    }
  },

  deleteProperty: function (target: any, key: any): boolean {
    // inlined: anObject(target, 'deleteProperty')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.deleteProperty called on non-object');
    }
    try {
      delete target[key];
      return true;
    } catch (e) {
      return false;
    }
  },

  get: function (target: any, key: any, receiver?: any): any {
    // inlined: anObject(target, 'get')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.get called on non-object');
    }
    // inlined: findDescriptor(target, key)
    let desc: any = undefined;
    let owner = target;
    let steps = 0;
    while (owner !== null && owner !== undefined) {
      if (hasOwn.call(owner, key)) {
        desc = Object.getOwnPropertyDescriptor(owner, key);
        break;
      }
      if (++steps > MAX_CHAIN) break;
      owner = getProto(owner);
    }
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
    // inlined: anObject(target, 'getOwnPropertyDescriptor')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.getOwnPropertyDescriptor called on non-object');
    }
    return Object.getOwnPropertyDescriptor(target, key);
  },

  getPrototypeOf: function (target: any): any {
    // inlined: anObject(target, 'getPrototypeOf')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.getPrototypeOf called on non-object');
    }
    return getProto(target);
  },

  has: function (target: any, key: any): boolean {
    // inlined: anObject(target, 'has')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.has called on non-object');
    }
    return key in target;
  },

  isExtensible: function (target: any): boolean {
    // inlined: anObject(target, 'isExtensible')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.isExtensible called on non-object');
    }
    return Object.isExtensible(target);
  },

  ownKeys: function (target: any): any[] {
    // inlined: anObject(target, 'ownKeys')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.ownKeys called on non-object');
    }
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
    // inlined: anObject(target, 'preventExtensions')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.preventExtensions called on non-object');
    }
    try {
      Object.preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  },

  set: function (target: any, key: any, value: any, receiver?: any): boolean {
    // inlined: anObject(target, 'set')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.set called on non-object');
    }
    const dest = receiver === undefined ? target : receiver;
    // inlined: findDescriptor(target, key)
    let desc: any = undefined;
    let owner = target;
    let steps = 0;
    while (owner !== null && owner !== undefined) {
      if (hasOwn.call(owner, key)) {
        desc = Object.getOwnPropertyDescriptor(owner, key);
        break;
      }
      if (++steps > MAX_CHAIN) break;
      owner = getProto(owner);
    }
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
    // inlined: anObject(target, 'setPrototypeOf')
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
      throw new TypeError('Reflect.setPrototypeOf called on non-object');
    }
    try {
      setProto(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  },
};

