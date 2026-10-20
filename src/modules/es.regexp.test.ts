// Behavioural: older engines match internally instead of delegating to this.exec.
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

/**
 * Spec: https://tc39.es/ecma262/#sec-regexp.prototype.test
 *
 * test() goes through RegExpExec, which prefers a user-supplied `exec`.
 */

const nativeTest = RegExp.prototype.test;
const nativeExec = RegExp.prototype.exec;

export const regexpTest = function (this: any, string: any): boolean {
  if (this === null || typeof this !== 'object') {
    throw new TypeError('RegExp.prototype.test called on a non-object');
  }
  const exec = this.exec;
  // Untouched built-in exec: the native test() gives the same answer without
  // building a match array per call. Only a user-supplied exec needs the hook.
  if (exec === nativeExec) {
    return nativeTest.call(this, String(string));
  }
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

