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
const getOwnDesc = Object.getOwnPropertyDescriptor;
const defineProp = Object.defineProperty;
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

// Step cap on every prototype walk: a chain longer than this is a cycle (an
// engine let one land through `__proto__ =`), so give up instead of hanging --
// Safari 7.1 died silently on an unbounded walk.
const MAX_CHAIN = 100;

const isObject = (value: any): boolean =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

const requireObject = (target: any, method: string): void => {
  if (!isObject(target)) throw new TypeError('Reflect.' + method + ' called on non-object');
};

// ToPropertyKey: ToPrimitive with hint string, then a Symbol stays a Symbol.
const toPropertyKey = (key: any): any => {
  if (isObject(key)) {
    const toPrimitive = typeof Symbol !== 'undefined' && (Symbol as any).toPrimitive ? key[(Symbol as any).toPrimitive] : undefined;
    let primitive: any;
    if (toPrimitive !== undefined && toPrimitive !== null) {
      primitive = toPrimitive.call(key, 'string');
      if (isObject(primitive)) throw new TypeError('Cannot convert object to primitive value');
    } else {
      // OrdinaryToPrimitive(key, string): toString, then valueOf
      const toStringFn = key.toString;
      if (typeof toStringFn === 'function') primitive = toStringFn.call(key);
      if (typeof toStringFn !== 'function' || isObject(primitive)) {
        const valueOfFn = key.valueOf;
        if (typeof valueOfFn === 'function') primitive = valueOfFn.call(key);
        if (typeof valueOfFn !== 'function' || isObject(primitive)) {
          throw new TypeError('Cannot convert object to primitive value');
        }
      }
    }
    key = primitive;
  }
  return typeof key === 'symbol' ? key : String(key);
};

// CreateListFromArrayLike: an Object, its length, each index read in order.
const listFromArrayLike = (argumentsList: any): any[] => {
  if (!isObject(argumentsList)) throw new TypeError('CreateListFromArrayLike called on non-object');
  let length = +argumentsList.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  const list = new Array(length);
  for (let i = 0; i < length; i++) list[i] = argumentsList[i];
  return list;
};

// IsConstructor, best ES5 approximation: built-ins and ordinary functions carry
// an own prototype; bound functions are constructors without one.
const isConstructor = (C: any): boolean =>
  typeof C === 'function' && (hasOwn.call(C, 'prototype') || /^bound /.test(C.name || ''));

const nativeCodeRe = /\[native code\]/;
const fnToString = Function.prototype.toString;

// ToPropertyDescriptor: Has/Get each field in spec order, then validate.
const toPropertyDescriptor = (attributes: any): any => {
  if (!isObject(attributes)) throw new TypeError('Property description must be an object');
  const desc: any = {};
  if ('enumerable' in attributes) desc.enumerable = !!attributes.enumerable;
  if ('configurable' in attributes) desc.configurable = !!attributes.configurable;
  if ('value' in attributes) desc.value = attributes.value;
  if ('writable' in attributes) desc.writable = !!attributes.writable;
  if ('get' in attributes) {
    const getter = attributes.get;
    if (getter !== undefined && typeof getter !== 'function') throw new TypeError('Getter must be a function');
    desc.get = getter;
  }
  if ('set' in attributes) {
    const setter = attributes.set;
    if (setter !== undefined && typeof setter !== 'function') throw new TypeError('Setter must be a function');
    desc.set = setter;
  }
  if (('get' in desc || 'set' in desc) && ('value' in desc || 'writable' in desc)) {
    throw new TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
  }
  return desc;
};

// OrdinarySet(O, P, V, Receiver), walking the prototype chain without [[Set]].
const ordinarySet = (target: any, key: any, value: any, receiver: any): boolean => {
  let ownDesc: any = getOwnDesc(target, key);
  let steps = 0;
  while (ownDesc === undefined) {
    const parent = getProto(target);
    if (parent === null || ++steps > MAX_CHAIN) {
      ownDesc = { value: undefined, writable: true, enumerable: true, configurable: true };
      break;
    }
    target = parent;
    ownDesc = getOwnDesc(target, key);
  }
  if ('value' in ownDesc || 'writable' in ownDesc) {
    if (!ownDesc.writable || !isObject(receiver)) return false;
    const existing: any = getOwnDesc(receiver, key);
    if (existing !== undefined) {
      if (existing.get !== undefined || existing.set !== undefined || !('value' in existing)) return false;
      if (!existing.writable) return false;
      try {
        defineProp(receiver, key, { value: value });
        return true;
      } catch {
        return false;
      }
    }
    try {
      defineProp(receiver, key, { value: value, writable: true, enumerable: true, configurable: true });
      return true;
    } catch {
      return false;
    }
  }
  if (ownDesc.set === undefined) return false;
  ownDesc.set.call(receiver, value);
  return true;
};

const methods: any = {
  apply: function apply(target: any, thisArgument: any, argumentsList: any): any {
    if (typeof target !== 'function') throw new TypeError('Reflect.apply target is not callable');
    return Function.prototype.apply.call(target, thisArgument, listFromArrayLike(argumentsList));
  },

  // Declared (target, argumentsList) for the spec length of 2; newTarget from arguments.
  construct: function construct(target: any, argumentsList: any): any {
    if (!isConstructor(target)) throw new TypeError('Reflect.construct target is not a constructor');
    const newTarget = arguments.length > 2 ? arguments[2] : target;
    if (!isConstructor(newTarget)) throw new TypeError('Reflect.construct newTarget is not a constructor');
    const args = listFromArrayLike(argumentsList);
    if (newTarget === target || nativeCodeRe.test(fnToString.call(target))) {
      // No spread on the floor: bind a null-this constructor with the args spliced
      // in and `new` it, which keeps built-in exotic objects (Date, Array, Error).
      const boundArgs = [null];
      for (let i = 0; i < args.length; i++) boundArgs[i + 1] = args[i];
      const Bound = Function.prototype.bind.apply(target, boundArgs as any);
      const instance = new Bound();
      if (newTarget !== target) {
        const proto = newTarget.prototype;
        if (isObject(proto)) setProto(instance, proto);
      }
      return instance;
    }
    // An ordinary function with a distinct newTarget: OrdinaryCreateFromConstructor
    // first, so the body already sees newTarget.prototype.
    let proto = newTarget.prototype;
    if (!isObject(proto)) proto = Object.prototype;
    const object = Object.create(proto);
    const result = target.apply(object, args);
    return isObject(result) ? result : object;
  },

  defineProperty: function defineProperty(target: any, key: any, attributes: any): boolean {
    requireObject(target, 'defineProperty');
    const propertyKey = toPropertyKey(key);
    const desc = toPropertyDescriptor(attributes);
    try {
      defineProp(target, propertyKey, desc);
      return true;
    } catch (e) {
      // [[DefineOwnProperty]] reports failure as false; only conversions throw
      return false;
    }
  },

  deleteProperty: function deleteProperty(target: any, key: any): boolean {
    requireObject(target, 'deleteProperty');
    const propertyKey = toPropertyKey(key);
    try {
      return delete target[propertyKey];
    } catch (e) {
      return false;
    }
  },

  // Declared (target, propertyKey) for the spec length of 2; receiver from arguments.
  get: function get(target: any, key: any): any {
    requireObject(target, 'get');
    const propertyKey = toPropertyKey(key);
    const receiver = arguments.length > 2 ? arguments[2] : target;
    let owner = target;
    let steps = 0;
    while (owner !== null && owner !== undefined) {
      const desc: any = getOwnDesc(owner, propertyKey);
      if (desc !== undefined) {
        if ('value' in desc || 'writable' in desc) return desc.value;
        return desc.get === undefined ? undefined : desc.get.call(receiver);
      }
      if (++steps > MAX_CHAIN) break;
      owner = getProto(owner);
    }
    return undefined;
  },

  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target: any, key: any): any {
    requireObject(target, 'getOwnPropertyDescriptor');
    return getOwnDesc(target, toPropertyKey(key));
  },

  getPrototypeOf: function getPrototypeOf(target: any): any {
    requireObject(target, 'getPrototypeOf');
    return getProto(target);
  },

  has: function has(target: any, key: any): boolean {
    requireObject(target, 'has');
    return toPropertyKey(key) in target;
  },

  isExtensible: function isExtensible(target: any): boolean {
    requireObject(target, 'isExtensible');
    return Object.isExtensible(target);
  },

  ownKeys: function ownKeys(target: any): any[] {
    requireObject(target, 'ownKeys');
    const keys: any[] = Object.getOwnPropertyNames(target);
    // Append Symbol keys only when the runtime actually has Symbols.
    if (typeof Object.getOwnPropertySymbols === 'function') {
      const symbols = Object.getOwnPropertySymbols(target);
      for (let i = 0; i < symbols.length; i++) keys.push(symbols[i]);
    }
    return keys;
  },

  preventExtensions: function preventExtensions(target: any): boolean {
    requireObject(target, 'preventExtensions');
    Object.preventExtensions(target);
    return true;
  },

  // Declared (target, propertyKey, V) for the spec length of 3; receiver from arguments.
  set: function set(target: any, key: any, value: any): boolean {
    requireObject(target, 'set');
    const propertyKey = toPropertyKey(key);
    return ordinarySet(target, propertyKey, value, arguments.length > 3 ? arguments[3] : target);
  },

  setPrototypeOf: function setPrototypeOf(target: any, proto: any): boolean {
    requireObject(target, 'setPrototypeOf');
    if (proto !== null && !isObject(proto)) throw new TypeError('Object prototype may only be an Object or null');
    const current = getProto(target);
    if (current === proto) return true;
    if (!Object.isExtensible(target)) return false;
    // OrdinarySetPrototypeOf refuses a cycle
    let steps = 0;
    for (let p = proto; p !== null && p !== undefined && ++steps <= MAX_CHAIN; p = getProto(p)) {
      if (p === target) return false;
    }
    try {
      setProto(target, proto);
    } catch (e) {
      return false;
    }
    return getProto(target) === proto;
  },
};

// The Reflect namespace: an ordinary object whose methods are non-enumerable,
// writable and configurable, with their spec names (the bundler may rename).
export const Reflect: any = {};
for (const name in methods) {
  if (!hasOwn.call(methods, name)) continue;
  try {
    defineProp(methods[name], 'name', { value: name, configurable: true });
  } catch (e) {
    /* Function#name non-configurable pre-ES6 */
  }
  defineProp(methods[name], '__polyfilled', { value: true });
  defineProp(Reflect, name, { value: methods[name], writable: true, enumerable: false, configurable: true });
}

export const installReflect = (): void => {
  Object.defineProperty(window, 'Reflect', { value: Reflect, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Reflect, '__polyfilled', { value: true });
};
