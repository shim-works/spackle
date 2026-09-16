// Behavioral, not existence: RegExp.prototype.test has always existed, but
// older engines run the match internally instead of delegating to this.exec.
// An existence check would never fire, so probe the delegation directly.
export const isSupported = (): boolean => {
  try {
    const regexp = /a/;
    let calledExec = false;
    (regexp as any).exec = function () {
      calledExec = true;
      return null;
    };
    regexp.test('a');
    return calledExec;
  } catch {
    return false;
  }
};

export const isRegExpTestSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-regexp.prototype.test
 *
 * test() must go through RegExpExec, which prefers a user-supplied `exec`.
 * Subclasses and instrumented regexes rely on that hook; an engine that matches
 * internally silently ignores it.
 */

const nativeTest = RegExp.prototype.test;

export const regexpTest = function (this: any, string: any): boolean {
  if (this === null || typeof this !== 'object') {
    throw new TypeError('RegExp.prototype.test called on a non-object');
  }
  const exec = this.exec;
  if (typeof exec === 'function') {
    const result = exec.call(this, String(string));
    if (result !== null && typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result !== null;
  }
  // no callable exec at all -- fall back to whatever the engine gave us
  return nativeTest.call(this, String(string));
};

if (!isSupported()) {
  Object.defineProperty(RegExp.prototype, 'test', { value: regexpTest as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(RegExp.prototype.test, 'name', { value: 'test', configurable: true });
  Object.defineProperty((RegExp.prototype.test as any), '__polyfilled', { value: true });
}
