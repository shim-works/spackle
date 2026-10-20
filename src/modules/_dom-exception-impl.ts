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

/** `new DOMException(message?, name?)` */
export function DOMExceptionPolyfill(
  this: any,
  message?: string,
  name?: string,
): void {
  const errorName = name || 'Error';
  const errorMessage = message || '';
  const err = Error.call(this, errorMessage);

  // defineProperty, not assignment: when the prototype is the engine's own
  // (see install), it can carry setter-less accessors for these names, and a
  // strict-mode assignment through one throws.
  // inlined: ownValue(this, 'message', ...)
  SLOT.value = errorMessage;
  Object.defineProperty(this, 'message', SLOT);
  SLOT.value = undefined; // never pin the last value
  // inlined: ownValue(this, 'name', ...)
  SLOT.value = errorName;
  Object.defineProperty(this, 'name', SLOT);
  SLOT.value = undefined; // never pin the last value
  // inlined: ownValue(this, 'code', ...)
  SLOT.value = DOMEXCEPTION_CODES[errorName] || 0;
  Object.defineProperty(this, 'code', SLOT);
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

DOMExceptionPolyfill.prototype = Object.create(Error.prototype);
Object.defineProperty(DOMExceptionPolyfill.prototype, 'constructor', { value: DOMExceptionPolyfill, writable: true, enumerable: false, configurable: true });

export const install = (): void => {
  /*
   * Keep the engine's interface where it exists: Safari 7.1-9's DOMException can't
   * be constructed but is what the DOM throws. Share its prototype and statics if
   * an instance built here survives its accessors and toString.
   */
  const native = (window as any).DOMException;
  if (native && native.prototype) {
    const ownProto = DOMExceptionPolyfill.prototype;
    try {
      DOMExceptionPolyfill.prototype = native.prototype;
      const probe: any = new (DOMExceptionPolyfill as any)('m', 'SyntaxError');
      if (probe.message !== 'm' || probe.name !== 'SyntaxError' || probe.code !== 12) throw 0;
      String(probe);
    } catch (e) {
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

  (window as any).DOMException = null;
  delete (window as any).DOMException;
  define((window as any), 'DOMException', DOMExceptionPolyfill);
};
