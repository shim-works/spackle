// Thin re-export: core-js-compat tracks this as its own module id, but
// the prior implementation covers setImmediate + clearImmediate together in one
// file -- see _set-immediate-impl.ts, which web.timers and web.immediate
// both delegate to.
export * from './_set-immediate-impl.js';
