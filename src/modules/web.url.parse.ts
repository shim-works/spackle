// Existence-only: URL.parse is a newer static, either there or not.
export const isSupported = (): boolean => {
  try {
    return typeof URL === 'undefined' || typeof (URL as any).parse === 'function';
  } catch {
    return true;
  }
};

export const isURLParseSupported = isSupported;

/**
 * Spec: https://url.spec.whatwg.org/#dom-url-parse
 *
 * The non-throwing counterpart to the constructor: returns null instead of
 * raising on invalid input. Attaches to whichever URL is live.
 */
export const urlParse = function (url: any, base?: any): any {
  try {
    return base === undefined
      ? new URL(String(url))
      : new URL(String(url), String(base));
  } catch {
    return null;
  }
};

if (typeof URL !== 'undefined' && !isSupported()) {
  Object.defineProperty((URL as any), 'parse', { value: urlParse, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((URL as any).parse, 'name', { value: 'parse', configurable: true });
  Object.defineProperty((URL as any).parse, '__polyfilled', { value: true });
}
