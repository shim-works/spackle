// Based on core-js (es.number.to-exponential)
const nativeToExponential = Number.prototype.toExponential;

const abs = Math.abs;
const floor = Math.floor;
const pow = Math.pow;
const round = Math.round;
const POW_10_308 = pow(10, 308);

// log10 inlined (don't depend on the es.math.log10 island): ES5-safe.

// core-js's ROUNDS_PROPERLY: whether the native rounds toExponential correctly.
// When true, the wrapper still delegates formatting to the native.
const ROUNDS_PROPERLY = (() => {
  try {
    return (
      typeof nativeToExponential === 'function' &&
      nativeToExponential.call(-6.9e-11, 4) === '-6.9000e-11' &&
      nativeToExponential.call(1.255, 2) === '1.25e+0' &&
      nativeToExponential.call(12345, 3) === '1.235e+4' &&
      nativeToExponential.call(25, 0) === '3e+1'
    );
  } catch {
    return false;
  }
})();

const throwsOn = (thisArg: any, arg: any): boolean => {
  try {
    (nativeToExponential as any).call(thisArg, arg);
    return false;
  } catch {
    return true;
  }
};

// Behavioral: mirrors core-js's FORCED (inverted) -- healthy natives round
// correctly, throw on an infinite fractionDigits, and DON'T throw on a
// non-finite numeric this.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeToExponential !== 'function') return false;
    if (!ROUNDS_PROPERLY) return false;
    // throwsOnInfinityFraction: both must throw
    if (!throwsOn(1, Infinity) || !throwsOn(1, -Infinity)) return false;
    // properNonFiniteThisCheck: these must NOT throw
    nativeToExponential.call(Infinity, Infinity as any);
    nativeToExponential.call(NaN, Infinity as any);
    return true;
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-number.prototype.toexponential */
export const numberToExponential = function toExponential(this: any, fractionDigits?: any): string {
  // inlined: thisNumberValue(this)
  let x = (Number.prototype.valueOf as any).call(this);
  if (fractionDigits === undefined) return (nativeToExponential as any).call(x);
  // inlined: toIntegerOrInfinity(fractionDigits)
  let f = +fractionDigits;
  f = f !== f || f === 0 ? 0 : f > 0 ? floor(f) : Math.ceil(f);
  if (x - x !== 0) return String(x); // x - x === 0: false for NaN and ±Infinity, and no global isFinite call
  if (f < 0 || f > 20) throw new RangeError('Incorrect fraction digits');
  if (ROUNDS_PROPERLY) return (nativeToExponential as any).call(x, f);
  let s = '';
  let m: string;
  let e: number;
  let c: string;
  let d: string;
  let l: number;
  let n: number;
  let xScaled: number;
  if (x < 0) {
    s = '-';
    x = -x;
  }
  if (x === 0) {
    e = 0;
    // inlined: repeat('0', f + 1)
    m = '';
    for (let i = 0; i < f + 1; i++) m += '0';
  } else {
    l = Math.log(x) / Math.LN10; // inlined: log10(x)
    e = floor(l);
    if (f - e >= 308) {
      xScaled = x * POW_10_308 * pow(10, f - e - 308);
    } else {
      xScaled = x / pow(10, e - f);
    }
    n = round(xScaled);
    if (xScaled - n >= 0.5) {
      n += 1;
    }
    if (n >= pow(10, f + 1)) {
      n /= 10;
      e += 1;
    }
    m = String(n);
  }
  if (f !== 0) {
    m = m.slice(0, 1) + '.' + m.slice(1);
  }
  if (e === 0) {
    c = '+';
    d = '0';
  } else {
    c = e > 0 ? '+' : '-';
    d = String(abs(e));
  }
  m += 'e' + c + d;
  return s + m;
};

