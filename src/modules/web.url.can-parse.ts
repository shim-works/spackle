// Existence-only: URL.canParse is a newer static, either there or not.
export const isSupported = (): boolean => {
  try {
    return typeof URL === 'undefined' || typeof (URL as any).canParse === 'function';
  } catch {
    return true;
  }
};

export const isURLCanParseSupported = isSupported;

/**
 * Spec: https://url.spec.whatwg.org/#dom-url-canparse
 *
 * Attaches to whichever URL is live -- native, or the web.url island if that
 * replaced it -- rather than shipping a second parser.
 */
export const urlCanParse = function (url: any, base?: any): boolean {
  try {
    if (base === undefined) {
      new URL(String(url));
    } else {
      new URL(String(url), String(base));
    }
    return true;
  } catch {
    return false;
  }
};

if (typeof URL !== 'undefined' && !isSupported()) {
  Object.defineProperty((URL as any), 'canParse', { value: urlCanParse, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((URL as any).canParse, 'name', { value: 'canParse', configurable: true });
  Object.defineProperty((URL as any).canParse, '__polyfilled', { value: true });
}
