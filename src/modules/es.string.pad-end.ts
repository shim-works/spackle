// Ported from: the prior implementation (string-pad-end.ts + is-string-pad-end-supported.ts)

// String.prototype.padEnd — just check it's there. No engine in our range (Chrome 38 / Safari 7
// and up) ever shipped a half-broken padEnd, so actually calling it would only
// cost us boot time.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.padEnd === 'function';
  } catch {
    return false;
  }
};

export const isStringPadEndSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.padend
 * GC: one intermediate fill string, one result string.
 */
export const stringPadEnd = function (
  this: string,
  targetLength: number,
  padString?: string
): string {
  const source = String(this);
  const padWith = padString !== undefined ? String(padString) : ' ';
  // already long enough, or nothing to pad with → nothing to do
  if (source.length >= targetLength || padWith.length === 0) {
    return source;
  }
  const charsNeeded = targetLength - source.length;
  // repeat the pad string until it covers the gap...
  let fill = padWith;
  while (fill.length < charsNeeded) {
    fill = fill + padWith;
  }
  // ...then trim to the exact gap and stick it on the end
  return source + fill.substring(0, charsNeeded);
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'padEnd', { value: stringPadEnd as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.padEnd, 'name', { value: 'padEnd', configurable: true });
  Object.defineProperty((String.prototype.padEnd as any), '__polyfilled', { value: true });
}
