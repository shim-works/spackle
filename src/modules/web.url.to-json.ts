// Ported from: the prior implementation (url-to-json.ts)

export const isSupported = (): boolean => {
  try {
    return (
      typeof URL === 'undefined' ||
      !URL.prototype ||
      typeof (URL.prototype as any).toJSON === 'function'
    );
  } catch {
    return true; // no URL at all -- nothing for this module to do
  }
};

/**
 * Spec: https://url.spec.whatwg.org/#dom-url-tojson
 */

// the spec serializer is exactly the href getter, so JSON.stringify(url)
// produces the full URL string
export const urlToJSON = function (this: any): string {
  return this.href;
};

if (typeof URL !== 'undefined' && URL.prototype && !isSupported()) {
  Object.defineProperty((URL.prototype as any), 'toJSON', { value: urlToJSON, writable: true, enumerable: false, configurable: true });
  Object.defineProperty((URL.prototype as any).toJSON, 'name', { value: 'toJSON', configurable: true });
  Object.defineProperty(((URL.prototype as any).toJSON as any), '__polyfilled', { value: true });
}
