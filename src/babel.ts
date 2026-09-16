/**
 * Babel plugin entry: `["@shim-works/spackle/babel", { method, targets }]`.
 *
 * Kept off the package root deliberately. The root now installs every ported
 * module as an import side effect (see index.ts), and Babel `require()`s its
 * plugins in Node at build time -- where most modules throw, since they patch
 * `window`. Separate specifier, separate job.
 */
export { default } from './provider.js';
