// Authored for spackle (no the prior implementation origin) -- based on core-js (es.number.to-fixed)

const nativeToFixed = Number.prototype.toFixed;

// Behavioral: toFixed exists in range but old V8/JSC round it wrong and some
// engines don't throw on a non-number `this`. Mirrors core-js's FORCED
// (inverted): a healthy native gets these four cases right AND throws on `{}`.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeToFixed !== 'function') return false;
    if (nativeToFixed.call(0.00008, 3) !== '0.000') return false;
    if (nativeToFixed.call(0.9, 0) !== '1') return false;
    if (nativeToFixed.call(1.255, 2) !== '1.25') return false;
    if (nativeToFixed.call(1000000000000000128.0, 0) !== '1000000000000000128') return false;
    try {
      (nativeToFixed as any).call({});
      return false; // a healthy native throws on a non-number this
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-number.prototype.tofixed
 */
// --- inlined internals (self-contained; no cross-island imports) ---
const floor = Math.floor;

// thisNumberValue: unbox a Number / validate a primitive number this
const thisNumberValue = (value: any): number => (Number.prototype.valueOf as any).call(value);

// ToIntegerOrInfinity
const toIntegerOrInfinity = (argument: any): number => {
  const number = +argument;
  if (number !== number || number === 0) return 0;
  return number > 0 ? floor(number) : Math.ceil(number);
};

const repeat = (str: string, count: number): string => {
  let result = '';
  for (let i = 0; i < count; i++) result += str;
  return result;
};

// core-js's big-integer helpers, verbatim in logic
const pow = (x: number, n: number, acc: number): number =>
  n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);

const log = (x: number): number => {
  let n = 0;
  let x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  }
  return n;
};

const multiply = (data: number[], n: number, c: number): void => {
  let index = -1;
  let c2 = c;
  while (++index < 6) {
    c2 += n * data[index];
    data[index] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};

const divide = (data: number[], n: number): void => {
  let index = 6;
  let c = 0;
  while (--index >= 0) {
    c += data[index];
    data[index] = floor(c / n);
    c = (c % n) * 1e7;
  }
};

const dataToString = (data: number[]): string => {
  let index = 6;
  let s = '';
  while (--index >= 0) {
    if (s !== '' || index === 0 || data[index] !== 0) {
      const t = String(data[index]);
      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
    }
  }
  return s;
};

export const numberToFixed = function toFixed(this: any, fractionDigits?: any): string {
  let number = thisNumberValue(this);
  const fractDigits = toIntegerOrInfinity(fractionDigits);
  const data = [0, 0, 0, 0, 0, 0];
  let sign = '';
  let result = '0';
  let e: number;
  let z: number;
  let j: number;
  let k: number;

  if (fractDigits < 0 || fractDigits > 20) throw new RangeError('Incorrect fraction digits');
  if (number !== number) return 'NaN';
  if (number <= -1e21 || number >= 1e21) return String(number);
  if (number < 0) {
    sign = '-';
    number = -number;
  }
  if (number > 1e-21) {
    e = log(number * pow(2, 69, 1)) - 69;
    z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
    z *= 0x10000000000000;
    e = 52 - e;
    if (e > 0) {
      multiply(data, 0, z);
      j = fractDigits;
      while (j >= 7) {
        multiply(data, 1e7, 0);
        j -= 7;
      }
      multiply(data, pow(10, j, 1), 0);
      j = e - 1;
      while (j >= 23) {
        divide(data, 1 << 23);
        j -= 23;
      }
      divide(data, 1 << j);
      multiply(data, 1, 1);
      divide(data, 2);
      result = dataToString(data);
    } else {
      multiply(data, 0, z);
      multiply(data, 1 << -e, 0);
      result = dataToString(data) + repeat('0', fractDigits);
    }
  }
  if (fractDigits > 0) {
    k = result.length;
    result =
      sign +
      (k <= fractDigits
        ? '0.' + repeat('0', fractDigits - k) + result
        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
  } else {
    result = sign + result;
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(Number.prototype, 'toFixed', { value: numberToFixed as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Number.prototype.toFixed, 'name', { value: 'toFixed', configurable: true });
  Object.defineProperty((Number.prototype.toFixed as any), '__polyfilled', { value: true });
}
