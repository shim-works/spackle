// Thin re-export: core-js-compat tracks typed arrays as ~30 separate module
// ids. This one is part of the ES2023/statics group, installed under
// _typed-array-impl.ts's SECOND gate (isModernSupported) -- separate from the
// ES2015 suite, because an engine can have that whole suite and none of these.
export * from './_typed-array-impl.js';
