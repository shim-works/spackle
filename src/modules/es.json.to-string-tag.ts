// Needs Symbol.toStringTag (native or the es.symbol island). Without one there
// is nothing to attach, so report supported and no-op.
const tagKey =
  typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;

export const isSupported = (): boolean => {
  try {
    return !tagKey || typeof JSON === 'undefined' || (JSON as any)[tagKey] === 'JSON';
  } catch {
    return true;
  }
};

export const isJSONToStringTagSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-json-@@tostringtag
 *
 * Makes Object.prototype.toString.call(JSON) report [object JSON] instead of
 * [object Object].
 *
 * No __polyfilled marker: the value is a string, not a function that can carry
 * one.
 */
if (tagKey && typeof JSON !== 'undefined' && !isSupported()) {
  Object.defineProperty(JSON, tagKey, { configurable: true, value: 'JSON' });
}
