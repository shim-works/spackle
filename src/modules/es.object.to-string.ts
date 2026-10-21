// Behavioural: installs where Object.prototype.toString ignores @@toStringTag.
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    const tagKey = typeof Symbol !== 'undefined' ? (Symbol as any).toStringTag : undefined;
    // No tag to honour: nothing for this island to add, so report supported.
    if (!tagKey) {
      return true;
    }
    const probe: any = {};
    probe[tagKey] = 'SpackleProbe';
    return Object.prototype.toString.call(probe) === '[object SpackleProbe]';
  } catch {
    return true;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-object.prototype.tostring */

const nativeToString = Object.prototype.toString;

export const objectToString = function (this: any): string {
  if (this === null) {
    return '[object Null]';
  }
  if (this === undefined) {
    return '[object Undefined]';
  }
  // honour a toStringTag from the live Symbol (native or island)
  if (typeof Symbol !== 'undefined' && (Symbol as any).toStringTag) {
    let tag;
    try {
      tag = this[(Symbol as any).toStringTag];
    } catch (error) {
      // Spec: a getter's error propagates. core-js swallows every error (an IE11
      // workaround); only a cross-origin window's SecurityError is swallowed
      // here, so type checks on window.parent from an iframe don't throw.
      if (!error || (error as any).name !== 'SecurityError') throw error;
      tag = undefined;
    }
    if (typeof tag === 'string') {
      return '[object ' + tag + ']';
    }
  }
  return nativeToString.call(this);
};

// Self-installs on import: code can capture Object.prototype.toString at its
// own module scope, so the patch must land before those bodies run.
export const install = (): void => {
  define(Object.prototype, 'toString', objectToString);
};

/*
 * Runs after es.symbol's self-install (install-polyfills.ts order), so
 * Symbol.toStringTag exists. Guarded: a throw here would abort the module graph.
 */
try {
  if (!isSupported()) {
    install();
  }
} catch (e) {
  /* locked-down engine: nothing further we can do here */
}
