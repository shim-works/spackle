export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.trimEnd === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.trimend */
export const stringTrimEnd = function (this: any): string {
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.trimEnd called on null or undefined');
  }
  return (typeof this === 'string' ? this : String(this)).replace(/\s+$/, '');
};

