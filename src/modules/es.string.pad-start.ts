/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.padstart
 * Ported from: the prior implementation (string-pad-start.ts + is-string-pad-start-supported.ts)
 * GC: one intermediate fill string, one result string.
 */

export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.padStart === 'function';
  } catch {
    return false;
  }
};

export const isStringPadStartSupported = isSupported;

export const stringPadStart = function (
  this: string,
  targetLength: number,
  padString?: string
): string {
  const source = String(this);
  const padWith = padString !== undefined ? String(padString) : ' ';
  if (source.length >= targetLength || padWith.length === 0) {
    return source;
  }
  const charsNeeded = targetLength - source.length;
  let fill = padWith;
  while (fill.length < charsNeeded) {
    fill = fill + padWith;
  }
  return fill.substring(0, charsNeeded) + source;
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'padStart', { value: stringPadStart, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.padStart, 'name', { value: 'padStart', configurable: true });
  Object.defineProperty((String.prototype.padStart as any), '__polyfilled', { value: true });
}
