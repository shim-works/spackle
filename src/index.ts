/**
 * Runtime polyfill entry. One import at the top of your app:
 *
 *   import "@shim-works/spackle";
 *
 * Every decision about what gets installed, and in what order, lives in
 * src/install-polyfills.ts. Synchronous and static, so installation finishes
 * before any module imported after this one evaluates.
 */
import { installPolyfills } from './install-polyfills.js';

installPolyfills();
