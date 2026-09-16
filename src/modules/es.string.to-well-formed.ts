// Ported from: the prior implementation (string-to-well-formed.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.toWellFormed === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.prototype.towellformed
 */
export const stringToWellFormed = function (this: any): string {
  const str = String(this);
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xdc00 && code <= 0xdfff) {
      // lone low surrogate — a paired one would've been consumed below
      out += '�';
    } else if (code >= 0xd800 && code <= 0xdbff) {
      const next = str.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        // intact pair — copy both halves through
        out += str.charAt(i) + str.charAt(i + 1);
        i++;
      } else {
        out += '�';
      }
    } else {
      out += str.charAt(i);
    }
  }
  return out;
};

if (!isSupported()) {
  Object.defineProperty(String.prototype, 'toWellFormed', { value: stringToWellFormed as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.prototype.toWellFormed, 'name', { value: 'toWellFormed', configurable: true });
  Object.defineProperty((String.prototype.toWellFormed as any), '__polyfilled', { value: true });
}
