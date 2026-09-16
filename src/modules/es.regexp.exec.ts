// Alias re-export: core-js-compat tracks es.regexp.exec as its own module id,
// but the whole feature is already implemented by es.regexp.constructor -- this
// id just delegates there so the provider can inject it.
export * from './es.regexp.constructor.js';
