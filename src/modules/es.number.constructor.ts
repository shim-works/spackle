// Ported from: the prior implementation (number-constructor.ts + is-number-constructor-supported.ts)

// Number constructor — behavioral: ES2015 taught Number('0b101') / Number('0o17')
// to parse binary and octal string literals; older engines return NaN.
export const isSupported = (): boolean => {
  try {
    return Number('0b101') === 5 && Number('0o17') === 15;
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
 *   (binary '0b' / octal '0o' string parsing); everything else defers to the
 *   native constructor, and prototype.constructor is left pointing at it.
 */

const NativeNumber = Number;

// ES2015 extended StringNumericLiteral with 0b/0o forms; older natives said NaN
const parseNumericString = (value: string): number | string => {
  const trimmed = value.replace(/^\s+|\s+$/g, '');
  if (trimmed.length > 2 && trimmed.charAt(0) === '0') {
    const marker = trimmed.charAt(1);
    const digits = trimmed.substring(2);
    if (marker === 'b' || marker === 'B') {
      return /^[01]+$/.test(digits) ? parseInt(digits, 2) : NaN;
    }
    if (marker === 'o' || marker === 'O') {
      return /^[0-7]+$/.test(digits) ? parseInt(digits, 8) : NaN;
    }
  }
  // anything else — hand the original back for native coercion
  return value;
};

export const NumberPolyfill = function (this: any, value?: any): any {
  const input =
    arguments.length === 0
      ? 0
      : typeof value === 'string'
        ? parseNumericString(value)
        : value;
  // `new Number(x)` boxes — hand back a genuine native wrapper object so
  // typeof/valueOf/instanceof all stay honest
  if (this instanceof NumberPolyfill) {
    return new NativeNumber(NativeNumber(input));
  }
  return NativeNumber(input);
};

// instances are native boxed Numbers, so instanceof keeps working
NumberPolyfill.prototype = NativeNumber.prototype;

// carry the statics across — constants and the ES2015+ methods alike (the
// mounts may re-gate some of these afterwards, which lands on this wrapper)
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
  if (key in NativeNumber) {
    (NumberPolyfill as any)[key] = (NativeNumber as any)[key];
  }
}

if (!isSupported()) {
  (window as any).Number = null;
  delete (window as any).Number;
  Object.defineProperty((window as any), 'Number', { value: NumberPolyfill, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((window as any).Number, 'name', { value: 'Number', configurable: true });
  Object.defineProperty((window as any).Number, '__polyfilled', { value: true });
}
