// Match core-js's generic-constructor probe: Array.of must construct through
// its receiver rather than always returning a plain Array.
export const isSupported = (): boolean => {
  try {
    if (typeof Array.of !== 'function') return false;
    const Sub: any = function () {};
    const result = (Array.of as any).call(Sub, 1, 2);
    return result instanceof Sub && result.length === 2 && result[0] === 1 && result[1] === 2;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.of
 *
 * Generic on `this`: `Sub.of(1, 2)` builds a Sub.
 */
export const arrayOf = function (this: any, ...args: any[]): any[] {
  const Ctor: any = this;
  // Plain Array.of (or an unbound call): the args array IS the result.
  if (typeof Ctor !== 'function' || Ctor === Array) return args;
  const result: any = new Ctor(args.length);
  for (let i = 0; i < args.length; i++) {
    result[i] = args[i];
  }
  result.length = args.length;
  return result;
};
