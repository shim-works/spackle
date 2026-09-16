// Thin re-export: core-js-compat tracks DOMException as 3 separate
// module ids, but the prior implementation implements the whole constructor at
// once -- see _dom-exception-impl.ts, which every web.dom-exception.* id
// delegates to.
export * from './_dom-exception-impl.js';
