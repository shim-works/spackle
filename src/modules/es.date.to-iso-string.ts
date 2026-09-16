// Authored for spackle (no the prior implementation origin) -- based on core-js (es.date.to-iso-string / internals/date-to-iso-string)

// Capture the native BEFORE any install so the probe + fallback can reference it.
const nativeToISOString = Date.prototype.toISOString;

// Behavioral, not existence: toISOString is ES5 (present in range) but old
// WebKit/PhantomJS mis-pad far-past years and don't throw on an invalid date.
// Mirrors core-js's FORCED: healthy natives produce the padded string AND throw
// on `new Date(NaN)`.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeToISOString !== 'function') return false;
    if (nativeToISOString.call(new Date(-5e13 - 1)) !== '0385-07-25T07:06:39.999Z') return false;
    try {
      nativeToISOString.call(new Date(NaN));
      return false; // a healthy native throws RangeError on an invalid date
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-date.prototype.toisostring
 */
// left-pad a number with '0' to the given width (inlined; no String.padStart dep)
const padStart = (value: number, width: number): string => {
  let str = String(value);
  while (str.length < width) str = '0' + str;
  return str;
};

export const dateToISOString = function toISOString(this: Date): string {
  const time = Date.prototype.getTime.call(this);
  if (!isFinite(time)) throw new RangeError('Invalid time value');
  const year = this.getUTCFullYear();
  const sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  return (
    sign +
    padStart(Math.abs(year), sign ? 6 : 4) +
    '-' + padStart(this.getUTCMonth() + 1, 2) +
    '-' + padStart(this.getUTCDate(), 2) +
    'T' + padStart(this.getUTCHours(), 2) +
    ':' + padStart(this.getUTCMinutes(), 2) +
    ':' + padStart(this.getUTCSeconds(), 2) +
    '.' + padStart(this.getUTCMilliseconds(), 3) +
    'Z'
  );
};

if (!isSupported()) {
  Object.defineProperty(Date.prototype, 'toISOString', { value: dateToISOString as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Date.prototype.toISOString, 'name', { value: 'toISOString', configurable: true });
  Object.defineProperty((Date.prototype.toISOString as any), '__polyfilled', { value: true });
}
