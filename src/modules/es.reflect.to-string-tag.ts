// Needs Symbol.toStringTag and a Reflect to tag (native, or the install-reflect
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

/**
 * Spec: https://tc39.es/ecma262/#sec-reflect-@@tostringtag
 *
 * No __polyfilled marker: the value is a string.
 */
export const install = (): void => {
  if (tagKey && typeof Reflect !== 'undefined') {
    Object.defineProperty(Reflect, tagKey, { configurable: true, value: 'Reflect' });
  }
};
