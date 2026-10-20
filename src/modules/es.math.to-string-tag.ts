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

/**
 * Spec: https://tc39.es/ecma262/#sec-math-@@tostringtag
 *
 * No __polyfilled marker: the value is a string.
 */
export const install = (): void => {
  if (tagKey) {
    Object.defineProperty(Math, tagKey, { configurable: true, value: 'Math' });
  }
};
