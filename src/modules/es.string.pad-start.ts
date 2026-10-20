/** Spec: https://tc39.es/ecma262/#sec-string.prototype.padstart */

export const isSupported = (): boolean => {
  try {
    if (typeof String.prototype.padStart !== 'function') return false;
    // Match core-js's targeted WebKit workaround for Safari 10.
    const ua = (window as any).navigator && (window as any).navigator.userAgent;
    return !/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(ua || '');
  } catch {
    return false;
  }
};

export const stringPadStart = function (
  this: string,
  targetLength: number,
  padString?: string
): string {
  const source = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
  const padWith = padString !== undefined ? String(padString) : ' ';
  if (source.length >= targetLength || padWith.length === 0) {
    return source;
  }
  const charsNeeded = targetLength - source.length;
  let fill = padWith;
  // Double, don't append: log2(n) intermediate strings instead of n.
  while (fill.length < charsNeeded) {
    fill = fill + fill;
  }
  return fill.substring(0, charsNeeded) + source;
};
