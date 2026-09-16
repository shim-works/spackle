// Ported from: the prior implementation (date-to-primitive.ts)

export const isSupported = (): boolean => {
  try {
    return (
      typeof Symbol === 'undefined' ||
      !(Symbol as any).toPrimitive ||
      typeof (Date.prototype as any)[(Symbol as any).toPrimitive] === 'function'
    );
  } catch {
    return true; // no usable Symbol -- nothing for this module to do
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
 */

// OrdinaryToPrimitive with the Date twist: 'default' behaves like 'string'
export const dateToPrimitive = function (this: any, hint: any): any {
  if (this === null || (typeof this !== 'object' && typeof this !== 'function')) {
    throw new TypeError('Date.prototype[Symbol.toPrimitive] called on a non-object');
  }
  let stringFirst: boolean;
  if (hint === 'string' || hint === 'default') {
    stringFirst = true;
  } else if (hint === 'number') {
    stringFirst = false;
  } else {
    throw new TypeError('Invalid hint: ' + String(hint));
  }
  const first = stringFirst ? this.toString : this.valueOf;
  const second = stringFirst ? this.valueOf : this.toString;
  if (typeof first === 'function') {
    const result = first.call(this);
    if (result === null || (typeof result !== 'object' && typeof result !== 'function')) {
      return result;
    }
  }
  if (typeof second === 'function') {
    const result = second.call(this);
    if (result === null || (typeof result !== 'object' && typeof result !== 'function')) {
      return result;
    }
  }
  throw new TypeError('Cannot convert object to primitive value');
};

if (typeof Symbol !== 'undefined' && (Symbol as any).toPrimitive && !isSupported()) {
  Object.defineProperty((Date.prototype as any), (Symbol as any).toPrimitive, { value: dateToPrimitive, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(dateToPrimitive, 'name', { value: '[Symbol.toPrimitive]', configurable: true });
  Object.defineProperty(((Date.prototype as any)[(Symbol as any).toPrimitive] as any), '__polyfilled', { value: true });
}
