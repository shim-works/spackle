// Existence-only: URL.canParse is a newer static, either there or not.
export const isSupported = (): boolean => {
  try {
    if (typeof URL === 'undefined') return true;
    const canParse = (URL as any).canParse;
    if (typeof canParse !== 'function' || canParse.length !== 1) return false;
    // core-js THROWS_WITHOUT_ARGUMENTS: canParse() with no argument must throw
    try {
      canParse();
    } catch (e) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
};

/**
 * Spec: https://url.spec.whatwg.org/#dom-url-canparse
 *
 * Attaches to whichever URL is live -- native, or the web.url island if that
 * replaced it -- rather than shipping a second parser.
 */
// base read from arguments, so length is 1 (core-js WRONG_ARITY)
export const urlCanParse = function canParse(url: any): boolean {
  if (arguments.length < 1) throw new TypeError("Failed to execute 'canParse' on 'URL': 1 argument required, but only 0 present.");
  const base = arguments[1];
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

