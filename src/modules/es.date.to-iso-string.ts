// Based on core-js (es.date.to-iso-string / internals/date-to-iso-string)
// Capture the native BEFORE any install so the probe + fallback can reference it.
const nativeToISOString = Date.prototype.toISOString;

// Behavioural (core-js's FORCED): old WebKit mis-pads far-past years and doesn't
// throw on an invalid date.
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

/** Spec: https://tc39.es/ecma262/#sec-date.prototype.toisostring */
export const dateToISOString = function toISOString(this: Date): string {
  const time = Date.prototype.getTime.call(this);
  if (time - time !== 0) throw new RangeError('Invalid time value'); // x - x === 0: false for NaN and ±Infinity, and no global isFinite call
  const year = this.getUTCFullYear();
  const sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  // inlined: padStart(Math.abs(year), sign ? 6 : 4)
  let yearText = String(Math.abs(year));
  const yearWidth = sign ? 6 : 4;
  while (yearText.length < yearWidth) yearText = '0' + yearText;
  // inlined: padStart(field, 2) and padStart(ms, 3) -- every field is a
  // non-negative integer below 1000, so the pad is a fixed prefix
  const month = this.getUTCMonth() + 1;
  const day = this.getUTCDate();
  const hours = this.getUTCHours();
  const minutes = this.getUTCMinutes();
  const seconds = this.getUTCSeconds();
  const ms = this.getUTCMilliseconds();
  return (
    sign + yearText +
    '-' + (month < 10 ? '0' : '') + month +
    '-' + (day < 10 ? '0' : '') + day +
    'T' + (hours < 10 ? '0' : '') + hours +
    ':' + (minutes < 10 ? '0' : '') + minutes +
    ':' + (seconds < 10 ? '0' : '') + seconds +
    '.' + (ms < 10 ? '00' : ms < 100 ? '0' : '') + ms +
    'Z'
  );
};

