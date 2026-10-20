export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.trim === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.trim */
export const stringTrim = function (this: string): string {
  // RequireObjectCoercible + ToString(this): `this` can be any value.
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.trim called on null or undefined');
  }
  return (typeof this === 'string' ? this : String(this)).replace(/^\s+|\s+$/g, '');
};

