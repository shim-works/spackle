declare module '@babel/helper-define-polyfill-provider' {
  const definePolyfillProvider: (factory: (...args: any[]) => any) => any;
  export default definePolyfillProvider;
}

declare module 'promise-polyfill' {
  const PromisePolyfill: PromiseConstructor;
  export default PromisePolyfill;
}

declare module '@ungap/structured-clone' {
  const structuredClone: (value: any, options?: any) => any;
  export default structuredClone;
}

// RegExp.escape (ES2025, Stage 4) -- the es.regexp.escape island patches it,
// but no released TypeScript lib declares it yet, so declare it here to keep
// the probe + assignment in src/modules/es.regexp.escape.ts type-checking.
interface RegExpConstructor {
  escape?(str: string): string;
}

// Loose shim -- only `types` (for AST node checks in usage-filters.ts) is
// actually used from src code; @babel/core proper is a devDependency/peer,
// not something spackle ships types for.
declare module '@babel/core' {
  export const types: any;
  export function caller(callback: (caller: any) => boolean): boolean;
}
