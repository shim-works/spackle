/**
 * Runtime polyfill entry. One import at the top of your app:
 *
 *   import "@shim-works/spackle";
 *
 * Each module gates on its own isSupported() and patches only what the browser
 * actually lacks. Synchronous and static, so installation finishes before any
 * module imported after this one evaluates.
 */
import './stable.js';

export { installPolyfills } from './install.js';
