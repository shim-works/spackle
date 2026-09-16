// Thin re-export: core-js-compat tracks Reflect as 13 separate module
// ids, but the prior implementation implements the whole object at once --
// see _reflect-impl.ts, which every es.reflect.* id delegates to.
export * from './_reflect-impl.js';
