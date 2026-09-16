// Thin re-export: core-js-compat tracks typed arrays as ~30 separate
// module ids, but the prior implementation treats the whole method suite as
// atomic across all 9 concrete types -- see _typed-array-impl.ts, which
// every es.typed-array.* id here delegates to.
export * from './_typed-array-impl.js';
