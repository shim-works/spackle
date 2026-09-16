// Needs Symbol.toStringTag (native or the es.symbol island). Without one there
// is nothing to attach, so report supported and no-op.
const tagKey =
  typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;

export const isSupported = (): boolean => {
  try {
    return !tagKey || (Math as any)[tagKey] === 'Math';
  } catch {
    return true;
  }
};

export const isMathToStringTagSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-math-@@tostringtag
 *
 * Makes Object.prototype.toString.call(Math) report [object Math] instead of
 * [object Object].
 *
 * No __polyfilled marker: the value is a string, not a function that can carry
 * one.
 */
if (tagKey && !isSupported()) {
  Object.defineProperty(Math, tagKey, { configurable: true, value: 'Math' });
}
