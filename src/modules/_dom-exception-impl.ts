// ids: web.dom-exception.constructor, web.dom-exception.stack, web.dom-exception.to-string-tag

// DOMException — behavioral: old engines exposed the interface but threw
// "Illegal constructor" on \`new DOMException()\`. So we try to construct one and
// confirm it's a real instance; if that throws, we install our own.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    const exception = new DOMException('test');
    return exception instanceof DOMException;
  } catch {
    return false;
  }
};

/** Spec: https://webidl.spec.whatwg.org/#idl-DOMException */

/** Standard DOMException error code mapping. */
const DOMEXCEPTION_CODES: Record<string, number> = {
  IndexSizeError: 1,
  HierarchyRequestError: 3,
  WrongDocumentError: 4,
  InvalidCharacterError: 5,
  NoModificationAllowedError: 7,
  NotFoundError: 8,
  NotSupportedError: 9,
  InUseAttributeError: 10,
  InvalidStateError: 11,
  SyntaxError: 12,
  InvalidModificationError: 13,
  NamespaceError: 14,
  InvalidAccessError: 15,
  TypeMismatchError: 17,
  SecurityError: 18,
  NetworkError: 19,
  AbortError: 20,
  URLMismatchError: 21,
  QuotaExceededError: 22,
  TimeoutError: 23,
  InvalidNodeTypeError: 24,
  DataCloneError: 25,
};

/*
 * WebIDL keeps name, message and code in internal slots read through prototype
 * getters, so an instance has no own name/message/code. Here the slots are
 * hidden own properties (no extra object per instance, like core-js's state
 * record but without its WeakMap entry), and the getters below brand-check by
 * the code slot.
 */
const NAME = '_domName';
const MESSAGE = '_domMessage';
const CODE = '_domCode';
const hasOwn = Object.prototype.hasOwnProperty;

/** `new DOMException(message?, name?)` */
export function DOMExceptionPolyfill(
  this: any,
  message?: string,
  name?: string,
): void {
  if (!(this instanceof DOMExceptionPolyfill)) {
    throw new TypeError("Failed to construct 'DOMException': Please use the 'new' operator");
  }
  // ToString, with the WebIDL defaults (core-js's normalizeStringArgument):
  // null becomes 'null', only undefined takes the default. '' + x throws on a Symbol.
  const errorMessage = message === undefined ? '' : '' + message;
  const errorName = name === undefined ? 'Error' : '' + name;
  const err = Error.call(this, errorMessage);

  // inlined: ownValue(this, MESSAGE, ...)
  SLOT.value = errorMessage;
  Object.defineProperty(this, MESSAGE, SLOT);
  // inlined: ownValue(this, NAME, ...)
  SLOT.value = errorName;
  Object.defineProperty(this, NAME, SLOT);
  // inlined: ownValue(this, CODE, ...) -- hasOwn: 'toString' is not a code
  SLOT.value = hasOwn.call(DOMEXCEPTION_CODES, errorName) ? DOMEXCEPTION_CODES[errorName] : 0;
  Object.defineProperty(this, CODE, SLOT);
  SLOT.value = undefined; // never pin the last value

  if (err.stack) {
    // inlined: ownValue(this, 'stack', ...)
    SLOT.value = err.stack;
    Object.defineProperty(this, 'stack', SLOT);
    SLOT.value = undefined; // never pin the last value
  }
}

// One reused descriptor: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };

// The legacy constants, in code order: INDEX_SIZE_ERR is 1 ... DATA_CLONE_ERR is 25.
const CONSTANTS = ['INDEX_SIZE_ERR', 'DOMSTRING_SIZE_ERR', 'HIERARCHY_REQUEST_ERR', 'WRONG_DOCUMENT_ERR',
  'INVALID_CHARACTER_ERR', 'NO_DATA_ALLOWED_ERR', 'NO_MODIFICATION_ALLOWED_ERR', 'NOT_FOUND_ERR',
  'NOT_SUPPORTED_ERR', 'INUSE_ATTRIBUTE_ERR', 'INVALID_STATE_ERR', 'SYNTAX_ERR', 'INVALID_MODIFICATION_ERR',
  'NAMESPACE_ERR', 'INVALID_ACCESS_ERR', 'VALIDATION_ERR', 'TYPE_MISMATCH_ERR', 'SECURITY_ERR', 'NETWORK_ERR',
  'ABORT_ERR', 'URL_MISMATCH_ERR', 'QUOTA_EXCEEDED_ERR', 'TIMEOUT_ERR', 'INVALID_NODE_TYPE_ERR', 'DATA_CLONE_ERR'];

/*
 * The name/message/code getters. On the engine's own prototype (see install) a
 * DOM-thrown exception has no slots, so its read falls through to the native
 * getter that was there; a receiver that is neither throws, as WebIDL's brand
 * check does. Install time only: one closure per key per prototype.
 */
const makeGetter = function (slot: string, nativeGet: any) {
  return function (this: any): any {
    if (this !== null && typeof this === 'object' && hasOwn.call(this, CODE)) return this[slot];
    if (nativeGet) return nativeGet.call(this);
    throw new TypeError('Illegal invocation');
  };
};
const KEYS = ['name', 'message', 'code'];
const SLOTS = [NAME, MESSAGE, CODE];

// Records each descriptor it replaces in `replaced` before replacing it, so
// install() can put a native prototype back even after a partial failure.
const defineShape = function (proto: any, replaced: any[]): void {
  for (let i = 0; i < KEYS.length; i++) {
    const previous = Object.getOwnPropertyDescriptor(proto, KEYS[i]);
    replaced.push(previous);
    Object.defineProperty(proto, KEYS[i], {
      get: makeGetter(SLOTS[i], previous && previous.get),
      enumerable: true,
      configurable: true,
    });
  }
};

// Constants (non-writable, enumerable, non-configurable) on the constructor and
// the prototype, and the class string, wherever they are missing (core-js does
// the same for a native it keeps).
const defineStatics = function (proto: any): void {
  for (let i = 0; i < CONSTANTS.length; i++) {
    const descriptor = { value: i + 1, writable: false, enumerable: true, configurable: false };
    if (!hasOwn.call(DOMExceptionPolyfill, CONSTANTS[i])) Object.defineProperty(DOMExceptionPolyfill, CONSTANTS[i], descriptor);
    if (!hasOwn.call(proto, CONSTANTS[i])) {
      try { Object.defineProperty(proto, CONSTANTS[i], descriptor); } catch (e) { /* locked native prototype */ }
    }
  }
  const tag = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;
  if (tag && !hasOwn.call(proto, tag)) {
    try {
      Object.defineProperty(proto, tag, { value: 'DOMException', writable: false, enumerable: false, configurable: true });
    } catch (e) { /* locked native prototype */ }
  }
};

DOMExceptionPolyfill.prototype = Object.create(Error.prototype);
Object.defineProperty(DOMExceptionPolyfill.prototype, 'constructor', { value: DOMExceptionPolyfill, writable: true, enumerable: false, configurable: true });
defineShape(DOMExceptionPolyfill.prototype, []);

export const install = (): void => {
  // Already installed (the prototype is frozen below): nothing left to choose.
  const own = Object.getOwnPropertyDescriptor(DOMExceptionPolyfill, 'prototype');
  if (own && own.writable) {
    /*
     * Keep the engine's interface where it exists: Safari 7.1-9's DOMException can't
     * be constructed but is what the DOM throws. Share its prototype and statics if
     * an instance built here survives the getters and toString.
     */
    const native = (window as any).DOMException;
    if (native && native.prototype) {
      const ownProto = DOMExceptionPolyfill.prototype;
      const nativeProto = native.prototype;
      const replaced: any[] = [];
      try {
        defineShape(nativeProto, replaced);
        DOMExceptionPolyfill.prototype = nativeProto;
        const probe: any = new (DOMExceptionPolyfill as any)('m', 'SyntaxError');
        if (probe.message !== 'm' || probe.name !== 'SyntaxError' || probe.code !== 12) throw 0;
        String(probe);
      } catch (e) {
        // Put the native prototype back exactly as it was, then use ours.
        for (let i = 0; i < replaced.length; i++) {
          try {
            if (replaced[i]) Object.defineProperty(nativeProto, KEYS[i], replaced[i]);
            else delete nativeProto[KEYS[i]];
          } catch (e2) { /* locked native prototype */ }
        }
        DOMExceptionPolyfill.prototype = ownProto;
      }
      for (const key in native) {
        if (/^[A-Z_]+$/.test(key) && typeof native[key] === 'number') {
          try {
            Object.defineProperty(DOMExceptionPolyfill, key, { value: native[key], writable: false, enumerable: true, configurable: false });
          } catch (e) { /* already there */ }
        }
      }
    }
    defineStatics(DOMExceptionPolyfill.prototype);
    // WebIDL: the interface's prototype property is non-writable, non-enumerable,
    // non-configurable (core-js leaves it writable).
    Object.defineProperty(DOMExceptionPolyfill, 'prototype', { writable: false });
  }

  (window as any).DOMException = null;
  delete (window as any).DOMException;
  define((window as any), 'DOMException', DOMExceptionPolyfill);
};
