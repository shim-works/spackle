// Needs a Symbol to attach to; without one, report supported and no-op.
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

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
 *
 * No __polyfilled marker: the value is a boolean, not a function.
 */
export const install = (): void => {
  if (unscopablesKey) {
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
};
