// Alias re-export: core-js-compat tracks es.symbol.to-string-tag as its own module id,
// but the whole feature is already implemented by es.symbol -- this
// id just delegates there so the provider can inject it.
export * from './es.symbol.js';
