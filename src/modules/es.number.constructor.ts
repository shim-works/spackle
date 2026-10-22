// Number constructor — behavioral: ES2015 taught Number('0b101') / Number('0o17')
// to parse binary and octal string literals; older engines return NaN.
import { define } from '../define.js';
export const isSupported = (): boolean => {
  try {
    if (Number('0b101') !== 5 || Number('0o17') !== 15 || Number(' 0o1') !== 1) return false;
    // signed hex is NaN (old V8 parsed '+0x1' as 1)
    const signedHex = Number('+0x1');
    return signedHex !== signedHex;
  } catch {
    return false;
  }
};

export const isNumberConstructorSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-number-constructor
 *
 * Known limitations:
 * - [incomplete] only the ES2015 StringNumericLiteral additions are fixed
 *   (binary '0b' / octal '0o' string parsing, U+180E no longer whitespace);
 *   everything else defers to the native constructor.
 */

const NativeNumber = Number;

export const NumberPolyfill = function (this: any, value?: any): any {
  let input: any = arguments.length === 0 ? 0 : value;
  if (arguments.length !== 0 && typeof value === 'string') {
    // U+180E left the whitespace set in Unicode 6.3; old engines still trim
    // it. It can't appear inside a numeric literal, so anywhere means NaN.
    if (value.indexOf('\u180E') !== -1) input = NaN;
    // inlined: parseNumericString(value) -- 0b/0o literals; anything else is native
    const trimmed = value.replace(/^\s+|\s+$/g, '');
    const sign = trimmed.charAt(0);
    if ((sign === '+' || sign === '-') && (trimmed.charAt(2) === 'x' || trimmed.charAt(2) === 'X') && trimmed.charAt(1) === '0') {
      input = NaN;
    } else if (trimmed.length > 2 && sign === '0') {
      const marker = trimmed.charAt(1);
      const digits = trimmed.substring(2);
      if (marker === 'b' || marker === 'B') {
        input = /^[01]+$/.test(digits) ? parseInt(digits, 2) : NaN;
      } else if (marker === 'o' || marker === 'O') {
        input = /^[0-7]+$/.test(digits) ? parseInt(digits, 8) : NaN;
      }
    }
  }
  // `new Number(x)` boxes — hand back a genuine native wrapper object so
  // typeof/valueOf/instanceof all stay honest
  if (this instanceof NumberPolyfill) {
    return new NativeNumber(NativeNumber(input));
  }
  return NativeNumber(input);
};

// instances are native boxed Numbers, so instanceof keeps working
NumberPolyfill.prototype = NativeNumber.prototype;

// carry the statics across (constants and ES2015+ methods)
const staticKeys = [
  'MAX_VALUE',
  'MIN_VALUE',
  'NaN',
  'NEGATIVE_INFINITY',
  'POSITIVE_INFINITY',
  'EPSILON',
  'MAX_SAFE_INTEGER',
  'MIN_SAFE_INTEGER',
  'isFinite',
  'isInteger',
  'isNaN',
  'isSafeInteger',
  'parseFloat',
  'parseInt',
];
for (let i = 0; i < staticKeys.length; i++) {
  const key = staticKeys[i];
  // Copy the native's own descriptor, not its value: plain assignment made
  // every static enumerable and writable (Number.MAX_VALUE = 0 "worked").
  const descriptor = Object.getOwnPropertyDescriptor(NativeNumber, key);
  if (descriptor) {
    Object.defineProperty(NumberPolyfill, key, descriptor);
  }
}


export const install = (): void => {
  define(window as any, 'Number', NumberPolyfill);
  // Number.prototype.constructor is Number: repoint the shared prototype
  Object.defineProperty(NativeNumber.prototype, 'constructor', {
    value: NumberPolyfill, writable: true, enumerable: false, configurable: true,
  });
};
