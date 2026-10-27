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
// Declared (maxLength) for the spec length of 1; fillString comes from arguments.
export const stringPadEnd = function padEnd(this: any, maxLength: any): string {
  // RequireObjectCoercible + ToString(this), then ToLength(maxLength), then
  // ToString(fillString) -- the spec's conversion order
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.padEnd called on null or undefined');
  }
  // inlined: toStr(this) -- String(symbol) returns "Symbol(...)"; the spec throws
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const source = typeof this === 'string' ? this : String(this);
  let intMaxLength = +maxLength; // +x, not Number(x)
  intMaxLength = intMaxLength !== intMaxLength || intMaxLength <= 0 ? 0 : intMaxLength > 9007199254740991 ? 9007199254740991 : Math.floor(intMaxLength);
  const stringLength = source.length;
  if (intMaxLength <= stringLength) {
    return source;
  }
  const fillString = arguments.length > 1 ? arguments[1] : undefined;
  // inlined: toStr(fillString)
  if (typeof fillString === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const padWith = fillString === undefined ? ' ' : typeof fillString === 'string' ? fillString : String(fillString);
  if (padWith.length === 0) {
    return source;
  }
  const charsNeeded = intMaxLength - stringLength;
  let fill = padWith;
  // Double, don't append: log2(n) intermediate strings instead of n.
  while (fill.length < charsNeeded) {
    fill = fill + fill;
  }
  return source + fill.substring(0, charsNeeded);
};
