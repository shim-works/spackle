// Needs Symbol.hasInstance (native or the es.symbol island). Without one there
// is nothing to attach, so report supported and no-op.
const hasInstanceKey =
  typeof Symbol !== 'undefined' ? (Symbol as any).hasInstance : undefined;

export const isSupported = (): boolean => {
  try {
    return (
      !hasInstanceKey ||
      typeof (Function.prototype as any)[hasInstanceKey] === 'function'
    );
  } catch {
    return true;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
 *
 * Known limitations:
 * - [unfixable] Installing this does not make the engine's own `instanceof`
 *   consult @@hasInstance -- that is syntax-level behaviour ES5 can't change.
 *   Code that calls `F[Symbol.hasInstance](v)` explicitly (and Babel's
 *   `_instanceof` helper, which does) gets the right answer.
 */

// OrdinaryHasInstance, inlined: walk the value's prototype chain looking for
// this function's .prototype.
export const functionHasInstance = function (this: any, value: any): boolean {
  if (typeof this !== 'function') {
    return false;
  }
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    return false;
  }
  const target = this.prototype;
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    throw new TypeError('Function has non-object prototype in instanceof check');
  }
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === target) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};

export const install = (): void => {
  if (hasInstanceKey) {
    // spec attributes: { writable: false, enumerable: false, configurable: false }
    try {
      Object.defineProperty(Function.prototype, hasInstanceKey, {
        value: functionHasInstance,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    } catch (e) {
      /* already installed non-configurable by an earlier run */
    }
    try { Object.defineProperty(functionHasInstance, 'name', { value: '[Symbol.hasInstance]', configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
    Object.defineProperty((functionHasInstance as any), '__polyfilled', { value: true });
  }
};
