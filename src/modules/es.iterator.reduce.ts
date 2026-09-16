// Thin re-export: core-js-compat tracks iterator helpers as 15 module ids, but
// they share one %IteratorHelperPrototype% -- an identity the spec makes
// observable -- so they install atomically. See _iterator-impl.ts.
export * from './_iterator-impl.js';
