// Standalone, NOT an alias of es.symbol: a browser with a native Symbol that
// simply predates Symbol.dispose passes es.symbol's probe, so es.symbol never
// installs and an alias would add nothing. This island attaches the well-known
// to whichever Symbol is live.
export const isSupported = (): boolean => {
  try {
    return typeof Symbol === 'undefined' || (Symbol as any).dispose !== undefined;
  } catch {
    return true;
  }
};

export const isSymbolDisposeSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/#sec-symbol.dispose
 *
 * No __polyfilled marker: the value is a symbol, not a function that can carry
 * one.
 */
if (typeof Symbol !== 'undefined' && !isSupported()) {
  Object.defineProperty(Symbol, 'dispose', {
    // matches native well-knowns: not writable, not enumerable, not configurable
    value: (Symbol as any)('Symbol.dispose'),
  });
}
