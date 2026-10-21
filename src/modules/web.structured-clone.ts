// A typeof check can't tell a real deep clone from a shallow stub. Check a
// nested object and a Date before deciding whether to keep the host function.
export const isSupported = (): boolean => {
  try {
    if (typeof (window as any).structuredClone !== 'function') return false;
    const source: any = { a: 1, nested: { b: 2 }, when: new Date(0) };
    const copy = (window as any).structuredClone(source);
    return (
      copy !== source &&
      copy.nested !== source.nested &&
      copy.a === 1 &&
      copy.nested.b === 2 &&
      copy.when instanceof Date &&
      copy.when.getTime() === 0
    );
  } catch {
    return false;
  }
};

/**
 * A single-pass structured clone for the data types this ES5-era package can
 * represent. `seen` is both the cycle table and the shared-reference table.
 *
 * Known limitations:
 * - [incomplete] Transfer lists are ignored; ES5 cannot detach an ArrayBuffer.
 * - [incomplete] Host objects outside the supported built-ins do not retain
 *   their internal state.
 */

const hasOwn = Object.prototype.hasOwnProperty;
const objectToString = Object.prototype.toString;

/*
 * The seen-table is the engine's own Map, captured before es.map can replace it
 * (Safari 7.1/8's native Map fails es.map's probe but is O(1)). No native Map:
 * parallel arrays.
 */
const EngineMap: any = typeof Map === 'function' ? Map : null;

// The serializable error names (HTML "StructuredSerializeInternal"). A lookup
// object rather than an array so the check allocates nothing.
const ERROR_NAMES: { [name: string]: boolean } = {
  Error: true,
  EvalError: true,
  RangeError: true,
  ReferenceError: true,
  SyntaxError: true,
  TypeError: true,
  URIError: true,
};

// Non-enumerable own data, like the native error's own stack/cause. Reused --
// one descriptor for the island, never a literal per clone.
const STACK: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

const hasOwnOrInherited = (value: any, key: string): boolean => {
  try {
    return key in value;
  } catch (e) {
    return false;
  }
};

const makeSeen = (): any => {
  if (EngineMap) return new EngineMap();
  const keys: any[] = [];
  const values: any[] = [];
  return {
    has: function (key: any): boolean {
      return keys.indexOf(key) !== -1;
    },
    get: function (key: any): any {
      return values[keys.indexOf(key)];
    },
    set: function (key: any, value: any): void {
      keys.push(key);
      values.push(value);
    },
  };
};

const cloneError = (message: string): Error => {
  try {
    const error: any = new (window as any).DOMException(message, 'DataCloneError');
    if (error && error.name === 'DataCloneError') return error;
  } catch (e) {
    // Older DOMException constructors are not callable with `new`.
  }
  const error = new TypeError(message);
  error.name = 'DataCloneError';
  return error;
};

const copyProperties = (source: any, target: any, seen: any): void => {
  for (const key in source) {
    if (hasOwn.call(source, key)) {
      // Array indices were already copied by the dense indexed loop, which
      // also preserves holes. Only copy extra enumerable string properties.
      if (Array.isArray(source)) {
        const index = +key;
        if (index >= 0 && index < source.length && Math.floor(index) === index && String(index) === key) {
          continue;
        }
      }
      const value = cloneValue(source[key], seen);
      if (key === '__proto__' && typeof Object.defineProperty === 'function') {
        Object.defineProperty(target, key, {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        target[key] = value;
      }
    }
  }
};

const cloneValue = (value: any, seen: any): any => {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    if (typeof value === 'symbol') throw cloneError('Cannot clone a Symbol');
    return value;
  }
  if (typeof value === 'function') throw cloneError('Cannot clone a function');
  if (seen.has(value)) return seen.get(value);

  if (Array.isArray(value)) {
    const copy: any[] = new Array(value.length);
    seen.set(value, copy);
    for (let i = 0; i < value.length; i++) {
      if (i in value) copy[i] = cloneValue(value[i], seen);
    }
    copyProperties(value, copy, seen);
    return copy;
  }

  // One type lookup instead of a dozen instanceof checks (core-js dispatches on
  // its classof the same way). Plain objects, most of what gets cloned, go
  // straight to the copy: on Chrome 41, walking the whole chain below for an
  // object nested in another made each clone ~500x slower than core-js.
  // promise-polyfill's instances also report [object Object], so they go on to
  // the chain, which refuses them.
  if (objectToString.call(value) === '[object Object]' && !(typeof Promise === 'function' && value instanceof Promise)) {
    const copy: any = {};
    seen.set(value, copy);
    copyProperties(value, copy, seen);
    return copy;
  }

  if (typeof Map === 'function' && value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach(function (entryValue: any, key: any) {
      copy.set(cloneValue(key, seen), cloneValue(entryValue, seen));
    });
    return copy;
  }

  if (typeof Set === 'function' && value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach(function (entryValue: any) {
      copy.add(cloneValue(entryValue, seen));
    });
    return copy;
  }

  if (
    (typeof WeakMap === 'function' && value instanceof WeakMap) ||
    (typeof WeakSet === 'function' && value instanceof WeakSet) ||
    (typeof Promise === 'function' && value instanceof Promise)
  ) {
    throw cloneError('Cannot clone this value');
  }

  if (value instanceof Date) {
    const copy = new Date(value.getTime());
    seen.set(value, copy);
    return copy;
  }

  if (value instanceof RegExp) {
    // lastIndex is not serialised. Flags come from the booleans where the engine has no RegExp#flags (Chrome 41).
    const flags = (value as any).flags;
    const copy = new RegExp(value.source, typeof flags === 'string' ? flags
      : (value.global ? 'g' : '') + (value.ignoreCase ? 'i' : '') + (value.multiline ? 'm' : '') + ((value as any).sticky ? 'y' : '') + ((value as any).unicode ? 'u' : ''));
    seen.set(value, copy);
    return copy;
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    // inlined: cloneBuffer(value, seen)
    let bufferCopy: any = seen.get(value);
    if (!seen.has(value)) {
      bufferCopy = new ArrayBuffer(value.byteLength);
      seen.set(value, bufferCopy);
      const sourceBytes = new Uint8Array(value);
      const targetBytes = new Uint8Array(bufferCopy);
      for (let i = 0; i < sourceBytes.length; i++) targetBytes[i] = sourceBytes[i];
    }
    return bufferCopy;
  }

  if (
    typeof ArrayBuffer !== 'undefined' &&
    typeof (ArrayBuffer as any).isView === 'function' &&
    (ArrayBuffer as any).isView(value)
  ) {
    // inlined: cloneBuffer(value.buffer, seen)
    let buffer: any = seen.get(value.buffer);
    if (!seen.has(value.buffer)) {
      buffer = new ArrayBuffer(value.buffer.byteLength);
      seen.set(value.buffer, buffer);
      const sourceBytes = new Uint8Array(value.buffer);
      const targetBytes = new Uint8Array(buffer);
      for (let i = 0; i < sourceBytes.length; i++) targetBytes[i] = sourceBytes[i];
    }
    const copy = objectToString.call(value) === '[object DataView]'
      ? new DataView(buffer, value.byteOffset, value.byteLength)
      : new value.constructor(buffer, value.byteOffset, value.length);
    seen.set(value, copy);
    return copy;
  }

  const DOMExceptionCtor = (window as any).DOMException;
  const isDOMException =
    (typeof DOMExceptionCtor === 'function' && value instanceof DOMExceptionCtor) ||
    objectToString.call(value) === '[object DOMException]';

  /*
   * HTML StructuredSerializeInternal, Error branch: only the seven native error
   * names survive (others become Error, never a looked-up global constructor).
   * name is inherited, message copied only if own. A DOMException stays a
   * DOMException.
   */
  if (isDOMException && typeof DOMExceptionCtor === 'function') {
    const copy: any = new DOMExceptionCtor(
      hasOwnOrInherited(value, 'message') ? String(value.message) : '',
      String(value.name),
    );
    seen.set(value, copy);
    return copy;
  }
  if (value instanceof Error || isDOMException) {
    const name = String(value.name);
    const ErrorCtor = ERROR_NAMES[name] === true ? (window as any)[name] : Error;
    const hasMessage = hasOwn.call(value, 'message');
    const copy: any = hasMessage ? new ErrorCtor(String(value.message)) : new ErrorCtor();
    seen.set(value, copy);
    // stack is implementation-defined; carrying it is what every engine does
    if (value.stack) {
      STACK.value = value.stack;
      Object.defineProperty(copy, 'stack', STACK);
      STACK.value = undefined;
    }
    if (hasOwn.call(value, 'cause')) {
      STACK.value = cloneValue(value.cause, seen);
      Object.defineProperty(copy, 'cause', STACK);
      STACK.value = undefined;
    }
    return copy;
  }

  const tag = objectToString.call(value);
  if (tag === '[object Number]' || tag === '[object String]' || tag === '[object Boolean]') {
    const copy = Object(value.valueOf());
    seen.set(value, copy);
    return copy;
  }

  const copy: any = {};
  seen.set(value, copy);
  copyProperties(value, copy, seen);
  return copy;
};

export const structuredClone = function (value: any, _options?: any): any {
  if (arguments.length === 0) throw new TypeError("Failed to execute 'structuredClone' on 'Window': 1 argument required, but only 0 present.");
  return cloneValue(value, makeSeen());
};
