// Behavioural: older Safari's atob accepted bad input and mishandled whitespace.
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

/**
 * Spec: https://html.spec.whatwg.org/multipage/webappapis.html#dom-atob
 *
 * Known limitations:
 * - [incomplete] Throws a plain Error, not an InvalidCharacterError DOMException,
 *   unless a DOMException constructor (native or the island) is available.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Hoisted: an ES5 engine builds a new RegExp object each time a literal is evaluated.
// String#replace resets a global regex's lastIndex, so sharing RE_WHITESPACE is safe.
const RE_WHITESPACE = /[\t\n\f\r ]/g;
const RE_PADDING = /==?$/;
const RE_NOT_BASE64 = /[^+/0-9A-Za-z]/;

export const atobPolyfill = function (data: any): string {
  // WebIDL: a missing required argument is a TypeError, not the string "undefined"
  if (arguments.length === 0) throw new TypeError("Failed to execute 'atob' on 'Window': 1 argument required, but only 0 present.");
  // ASCII whitespace per the spec: tab, LF, FF, CR, space
  let input = String(data).replace(RE_WHITESPACE, '');
  if (input.length % 4 === 0) {
    input = input.replace(RE_PADDING, '');
  }
  // length % 4 === 1 leaves a dangling 6 bits that can't form a byte
  if (input.length % 4 === 1 || RE_NOT_BASE64.test(input)) {
    // inlined: invalidCharacterError()
    const message = "Failed to execute 'atob': The string to be decoded is not correctly encoded.";
    if (typeof DOMException === 'function') {
      throw new DOMException(message, 'InvalidCharacterError');
    } else {
      const error: any = new Error(message);
      error.name = 'InvalidCharacterError';
      throw error;
    }
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

