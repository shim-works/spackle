// Behavioral, not existence: Error.prototype.toString has always existed, but
// older WebKit returned just the message, or threw on a plain object receiver.
// An existence check would never fire, so probe the actual output.
export const isSupported = (): boolean => {
  try {
    return (
      Error.prototype.toString.call({ name: 'x', message: 'y' }) === 'x: y' &&
      Error.prototype.toString.call({}) === 'Error' &&
      Error.prototype.toString.call({ name: 'x' }) === 'x' &&
      Error.prototype.toString.call({ message: 'y' }) === 'Error: y'
    );
  } catch {
    return false;
  }
};

export const isErrorToStringSupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-error.prototype.tostring
 */
export const errorToString = function (this: any): string {
  if (this === null || typeof this !== 'object') {
    throw new TypeError('Error.prototype.toString called on a non-object');
  }
  const rawName = this.name;
  const name = rawName === undefined ? 'Error' : String(rawName);
  const rawMessage = this.message;
  const message = rawMessage === undefined ? '' : String(rawMessage);
  if (name === '') {
    return message;
  }
  if (message === '') {
    return name;
  }
  return name + ': ' + message;
};

if (!isSupported()) {
  Object.defineProperty(Error.prototype, 'toString', { value: errorToString, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(Error.prototype.toString, 'name', { value: 'toString', configurable: true });
  Object.defineProperty((Error.prototype.toString as any), '__polyfilled', { value: true });
}
