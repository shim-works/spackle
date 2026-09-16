// Thin re-export: core-js-compat tracks ArrayBuffer.isView and
// ArrayBuffer.prototype.slice as separate module ids, but
// the prior implementation implements both in one file -- see
// _array-buffer-impl.ts, which both ids delegate to.
export * from './_array-buffer-impl.js';
