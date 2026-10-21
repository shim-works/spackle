// Needs a Symbol to attach to; without one, report supported and no-op.
const unscopablesKey =
  typeof Symbol !== 'undefined' ? (Symbol as any).unscopables : undefined;

// Every spec name. core-js's addToUnscopables runs in each method's module, so a
// native table that lacks a newer name (Chrome 41 has no `at`) still gets it.
// This island carries the whole list: it installs after every Array method.
const NAMES = ['at', 'copyWithin', 'entries', 'fill', 'find', 'findIndex', 'findLast', 'findLastIndex',
  'flat', 'flatMap', 'includes', 'keys', 'toReversed', 'toSorted', 'toSpliced', 'values'];

export const isSupported = (): boolean => {
  try {
    if (!unscopablesKey) {
      return true;
    }
    const table = (Array.prototype as any)[unscopablesKey];
    if (!table || table.flat !== true) return false;
    for (let i = 0; i < NAMES.length; i++) {
      if (typeof (Array.prototype as any)[NAMES[i]] === 'function' && table[NAMES[i]] !== true) return false;
    }
    return true;
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
    table.flat = true;
    // The rest only where the method exists, as core-js adds each with its method.
    for (let i = 0; i < NAMES.length; i++) {
      if (typeof (Array.prototype as any)[NAMES[i]] === 'function') table[NAMES[i]] = true;
    }
  }
};
