// Alias re-export: core-js-compat tracks es.aggregate-error.cause as its own module id,
// but the whole feature is already implemented by es.aggregate-error -- this
// id just delegates there so the provider can inject it.
export * from './es.aggregate-error.js';
