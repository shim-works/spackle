declare module 'promise-polyfill' {
  const PromisePolyfill: PromiseConstructor;
  export default PromisePolyfill;
}

// RegExp.escape (ES2025, Stage 4) -- the es.regexp.escape island patches it,
// but no released TypeScript lib declares it yet, so declare it here to keep
// the probe + assignment in src/modules/es.regexp.escape.ts type-checking.
interface RegExpConstructor {
  escape?(str: string): string;
}
