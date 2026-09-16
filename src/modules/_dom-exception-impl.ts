// Ported from: the prior implementation (dom-exception.ts + is-dom-exception-supported.ts)

// DOMException — behavioral: old engines exposed the interface but threw
// "Illegal constructor" on \`new DOMException()\`. So we try to construct one and
// confirm it's a real instance; if that throws, we install our own.
export const isSupported = (): boolean => {
  try {
    const exception = new DOMException('test');
    return exception instanceof DOMException;
  } catch {
    return false;
  }
};

export const isDOMExceptionSupported = isSupported;

/**
 * Spec: https://webidl.spec.whatwg.org/#idl-DOMException
 * GC: pure constructor, zero closures, zero allocations beyond the returned object.
 */

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

/**
 * Polyfill constructor.
 * Matches the spec signature: `new DOMException(message?, name?)`.
 */
export function DOMExceptionPolyfill(
  this: any,
  message?: string,
  name?: string,
): void {
  const errorName = name || 'Error';
  const errorMessage = message || '';
  const err = Error.call(this, errorMessage);

  this.message = errorMessage;
  this.name = errorName;
  this.code = DOMEXCEPTION_CODES[errorName] || 0;

  if (err.stack) {
    this.stack = err.stack;
  }
}

DOMExceptionPolyfill.prototype = Object.create(Error.prototype);
DOMExceptionPolyfill.prototype.constructor = DOMExceptionPolyfill;

if (!isSupported()) {
  (window as any).DOMException = null;
  delete (window as any).DOMException;
  Object.defineProperty((window as any), 'DOMException', { value: DOMExceptionPolyfill, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).DOMException, 'name', { value: 'DOMException', configurable: true });
  Object.defineProperty((window as any).DOMException, '__polyfilled', { value: true });
}
