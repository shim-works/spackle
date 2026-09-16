// Authored for spackle (no the prior implementation origin) -- based on core-js (es.array.reverse)

const nativeReverse = Array.prototype.reverse;

// Behavioral: real in-range bug. Safari 12.0 (webkit #188794) mis-reverses
// certain arrays. Mirrors core-js's FORCED (inverted): reversing [1,2] must
// actually change its string form.
export const isSupported = (): boolean => {
  try {
    if (typeof nativeReverse !== 'function') return false;
    const test = [1, 2];
    const before = String(test);
    const after = String((test as any).reverse());
    return before !== after;
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.reverse
 */
export const arrayReverse = function reverse(this: any): any {
  // touching .length normalizes the holey/packed state Safari 12 got wrong
  if (Array.isArray(this)) this.length = this.length;
  return (nativeReverse as any).call(this);
};

if (!isSupported()) {
  Object.defineProperty(Array.prototype, 'reverse', { value: arrayReverse as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Array.prototype.reverse, 'name', { value: 'reverse', configurable: true });
  Object.defineProperty((Array.prototype.reverse as any), '__polyfilled', { value: true });
}
