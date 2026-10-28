/**
 * Install primitives. Members go on non-enumerable, like natives, and carry
 * `__polyfilled` for spackle-verify. Both swallow: a locked-down owner costs that
 * one member, not the install run.
 */
import { installed } from './trace.js';

/* Non-configurable once set: re-stamping on a repeat install throws, so own try. */
const mark = (fn: any): void => {
  try {
    Object.defineProperty(fn, '__polyfilled', { value: true });
  } catch (e) {
    /* already marked, or a frozen function */
  }
};

/** A data property: a method or a constructor. */
export const define = (owner: any, key: any, value: any, name?: string): void => {
  try {
    Object.defineProperty(owner, key, { value: value, writable: true, enumerable: false, configurable: true });
    try {
      Object.defineProperty(value, 'name', { value: name === undefined ? key : name, configurable: true });
    } catch (e) {
      /* Function#name non-configurable pre-ES6 */
    }
    mark(value);
    installed.push(name === undefined ? String(key) : name);
  } catch (e) {
    /* locked-down owner: skip this member, keep installing */
  }
};

/**
 * An accessor. The marker goes on the getter (spackle-verify reads it there),
 * stamped before install. Names get "get " prepended; pass `name` for a symbol key.
 */
export const defineGetter = (owner: any, key: any, getter: () => any, name?: string): void => {
  try {
    mark(getter);
    try {
      Object.defineProperty(getter, 'name', { value: name === undefined ? 'get ' + key : name, configurable: true });
    } catch (e) {
      /* Function#name non-configurable pre-ES6 */
    }
    Object.defineProperty(owner, key, { configurable: true, enumerable: false, get: getter });
    installed.push(name === undefined ? 'get ' + String(key) : name);
  } catch (e) {
    /* locked-down owner: skip this member, keep installing */
  }
};
