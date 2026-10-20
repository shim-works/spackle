// String.prototype.padEnd: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.padEnd !== 'function') return false;
    // Match core-js's targeted WebKit workaround for Safari 10.
    const ua = (window as any).navigator && (window as any).navigator.userAgent;
    return !/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(ua || '');
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.padend */
export const stringPadEnd = function (
  this: string,
  targetLength: number,
  padString?: string
): string {
  const source = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
  const padWith = padString !== undefined ? String(padString) : ' ';
  // already long enough, or nothing to pad with → nothing to do
  if (source.length >= targetLength || padWith.length === 0) {
    return source;
  }
  const charsNeeded = targetLength - source.length;
  // double the pad string until it covers the gap -- log2(n) intermediate
  // strings instead of one per pad unit...
  let fill = padWith;
  while (fill.length < charsNeeded) {
    fill = fill + fill;
  }
  // ...then trim to the exact gap and stick it on the end
  return source + fill.substring(0, charsNeeded);
};
