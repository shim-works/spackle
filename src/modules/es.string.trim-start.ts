// String.prototype.trimStart: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.trimStart === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.trimstart */
export const stringTrimStart = function (this: string): string {
  // RequireObjectCoercible + ToString(this): `this` can be any value.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.trimStart called on null or undefined');
  }
  return (typeof this === 'string' ? this : String(this)).replace(/^\s+/, '');
};

