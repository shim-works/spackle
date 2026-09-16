// Standalone, NOT an alias of es.symbol: a browser with a native Symbol that
// simply predates Symbol.asyncDispose passes es.symbol's probe, so es.symbol
// never installs and an alias would add nothing. This island attaches the
// well-known to whichever Symbol is live.
export const isSupported = (): boolean => {
  try {
    return typeof Symbol === 'undefined' || (Symbol as any).asyncDispose !== undefined;
  } catch {
    return true;
  }
};

export const isSymbolAsyncDisposeSupported = isSupported;

/**
 * Spec: https://tc39.es/proposal-explicit-resource-management/#sec-symbol.asyncdispose
 *
 * No __polyfilled marker: the value is a symbol, not a function that can carry
 * one.
 */
if (typeof Symbol !== 'undefined' && !isSupported()) {
  Object.defineProperty(Symbol, 'asyncDispose', {
    // matches native well-knowns: not writable, not enumerable, not configurable
    value: (Symbol as any)('Symbol.asyncDispose'),
  });
}
