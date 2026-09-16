// Thin re-export: core-js-compat tracks explicit resource management as four
// module ids, but they're one feature with one error-aggregation rule -- see
// _disposable-impl.ts, which all four delegate to.
export * from './_disposable-impl.js';
