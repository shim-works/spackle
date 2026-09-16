// Behavioral, not just existence: Safari's older atob accepted input it should
// have rejected and mishandled whitespace, so exercise a real decode plus the
// two rejection cases rather than checking typeof.
export const isSupported = (): boolean => {
  try {
    if (typeof atob !== 'function') {
      return false;
    }
    if (atob('aGk=') !== 'hi') {
      return false;
    }
    // stray whitespace is stripped, not rejected
    if (atob(' a G k = ') !== 'hi') {
      return false;
    }
    // a lone leftover character can't form a byte -- must throw
    try {
      atob('a');
      return false;
    } catch {
      // good, that's the throw we wanted
    }
    return true;
  } catch {
    return false;
  }
};

export const isAtobSupported = isSupported;

/**
 * Spec: https://html.spec.whatwg.org/multipage/webappapis.html#dom-atob
 *
 * Known limitations:
 * - [incomplete] Throws a plain Error where a browser throws a DOMException
 *   named InvalidCharacterError, unless a DOMException constructor happens to
 *   be available (native, or the _dom-exception-impl island) -- in which case
 *   the real thing is used.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const invalidCharacterError = (): any => {
  const message = "Failed to execute 'atob': The string to be decoded is not correctly encoded.";
  if (typeof DOMException === 'function') {
    return new DOMException(message, 'InvalidCharacterError');
  }
  const error: any = new Error(message);
  error.name = 'InvalidCharacterError';
  return error;
};

export const atobPolyfill = function (data: any): string {
  // ASCII whitespace per the spec: tab, LF, FF, CR, space
  let input = String(data).replace(/[\t\n\f\r ]/g, '');
  if (input.length % 4 === 0) {
    input = input.replace(/==?$/, '');
  }
  // length % 4 === 1 leaves a dangling 6 bits that can't form a byte
  if (input.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(input)) {
    throw invalidCharacterError();
  }
  let output = '';
  let bitStorage = 0;
  let bitCounter = 0;
  for (let i = 0; i < input.length; i++) {
    const index = ALPHABET.indexOf(input.charAt(i));
    bitStorage = bitCounter % 4 ? bitStorage * 64 + index : index;
    // every 4 input chars (24 bits) yield 3 bytes; emit one per step after the
    // first of each group
    if (bitCounter++ % 4) {
      output += String.fromCharCode(255 & (bitStorage >> ((-2 * bitCounter) & 6)));
    }
  }
  return output;
};

if (typeof window !== 'undefined' && !isSupported()) {
  Object.defineProperty((window as any), 'atob', { value: atobPolyfill, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).atob, 'name', { value: 'atob', configurable: true });
  Object.defineProperty((window as any).atob, '__polyfilled', { value: true });
}
