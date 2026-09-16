// Needs Symbol.toStringTag and a Reflect to tag (native, or the _reflect-impl
// island if that installed one). Without either there is nothing to attach, so
// report supported and no-op.
const tagKey =
  typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;

export const isSupported = (): boolean => {
  try {
    return (
      !tagKey ||
      typeof Reflect === 'undefined' ||
      (Reflect as any)[tagKey] === 'Reflect'
    );
  } catch {
    return true;
  }
};

export const isReflectToStringTagSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-reflect-@@tostringtag
 *
 * Makes Object.prototype.toString.call(Reflect) report [object Reflect] instead
 * of [object Object].
 *
 * No __polyfilled marker: the value is a string, not a function that can carry
 * one.
 */
if (tagKey && typeof Reflect !== 'undefined' && !isSupported()) {
  Object.defineProperty(Reflect, tagKey, { configurable: true, value: 'Reflect' });
}
