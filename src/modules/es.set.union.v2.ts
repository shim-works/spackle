// Thin re-export: core-js-compat tracks the seven ES2024 Set methods as seven
// module ids, but they share one GetSetRecord machinery -- see
// _set-methods-impl.ts, which every es.set.*.v2 id delegates to.
export * from './_set-methods-impl.js';
