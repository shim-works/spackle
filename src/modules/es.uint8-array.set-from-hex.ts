// Thin re-export: core-js-compat tracks the base64/hex proposal as six module
// ids, but it's one codec -- see _uint8-array-impl.ts, which every
// es.uint8-array.* id delegates to.
export * from './_uint8-array-impl.js';
