// Symbol.unscopables is only reachable once a Symbol exists (native or the
// es.symbol island). Without one there is nothing to attach to, so report
// supported and no-op rather than failing.
const unscopablesKey =
  typeof Symbol !== 'undefined' ? (Symbol as any).unscopables : undefined;

export const isSupported = (): boolean => {
  try {
    if (!unscopablesKey) {
      return true;
    }
    const table = (Array.prototype as any)[unscopablesKey];
    return !!table && table.flatMap === true;
  } catch {
    return true;
  }
};

export const isArrayUnscopablesFlatMapSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
 *
 * Keeps `flatMap` out of `with (array) { ... }` scope, so old code with a local
 * `flatMap` binding isn't shadowed by the array method.
 *
 * No __polyfilled marker: the value is a boolean on the unscopables table, not
 * a function that can carry one.
 */
if (unscopablesKey && !isSupported()) {
  let table = (Array.prototype as any)[unscopablesKey];
  if (!table) {
    // spec says null-prototype, so a stray Object.prototype key can't read as
    // unscopable
    table = Object.create(null);
    Object.defineProperty(Array.prototype, unscopablesKey, {
      configurable: true,
      value: table,
    });
  }
  table.flatMap = true;
}
