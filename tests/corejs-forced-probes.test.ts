import { describe, expect, it } from 'vitest';
import { mathAsinh } from '../src/modules/es.math.asinh';
import { mathAtanh } from '../src/modules/es.math.atanh';
import { mathCosh } from '../src/modules/es.math.cosh';
import { mathAcosh } from '../src/modules/es.math.acosh';
import { NumberPolyfill } from '../src/modules/es.number.constructor';
import { arrayIndexOf } from '../src/modules/es.array.index-of';
import { arrayLastIndexOf } from '../src/modules/es.array.last-index-of';

// The polyfills pass the core-js forced probes their gates now copy.
describe('core-js forced probes, against spackle', () => {
  it('Math', () => {
    expect(1 / mathAsinh(0)).toBe(Infinity);
    expect(1 / mathAtanh(-0)).toBe(-Infinity);
    expect(mathCosh(710)).not.toBe(Infinity);
    expect(Math.floor(mathAcosh(Number.MAX_VALUE))).toBe(710);
    expect(mathAcosh(Infinity)).toBe(Infinity);
  });

  it('Number', () => {
    const N: any = NumberPolyfill;
    expect(N(' 0o1')).toBe(1);
    expect(N('0b1')).toBe(1);
    expect(N('+0x1')).toBeNaN();
    expect(N('-0X1')).toBeNaN();
    expect(N('0x1')).toBe(1);
    expect(N('+1')).toBe(1);
  });

  it('indexOf / lastIndexOf from -0', () => {
    expect(1 / arrayIndexOf.call([1], 1, -0)).toBe(Infinity);
    expect(1 / arrayLastIndexOf.call([1], 1, -0)).toBe(Infinity);
  });
});

import { promiseFinally } from '../src/modules/es.promise.finally';
import { promiseTry } from '../src/modules/es.promise.try';
import { errorIsError } from '../src/modules/es.error.is-error';
import { regExpEscape } from '../src/modules/es.regexp.escape';
import { stringAt } from '../src/modules/es.string.at-alternative';
import { stringFromCodePoint } from '../src/modules/es.string.from-code-point';
import { stringToWellFormed } from '../src/modules/es.string.to-well-formed';
import { queueMicrotask as spackleQueueMicrotask } from '../src/modules/web.queue-microtask';
import { urlCanParse } from '../src/modules/web.url.can-parse';
import { arrayFromAsync } from '../src/modules/es.array.from-async';
import { mapGroupBy } from '../src/modules/es.map.group-by';
import { objectGroupBy } from '../src/modules/es.object.group-by';

describe('core-js forced probes, against spackle (2)', () => {
  it('Promise', () => {
    expect(() => promiseFinally.call({ then: function () {} }, function () {})).not.toThrow();
    let argument: any;
    const p = Promise.resolve();
    expect(promiseTry.call(Promise, function (a: any) { argument = a; return p; }, 8)).toBe(p);
    expect(argument).toBe(8);
  });

  it('Error.isError', () => {
    expect(errorIsError(new DOMException('DOMException'))).toBe(true);
    expect(errorIsError(new (Error as any)('Error', { cause: function () {} }))).toBe(true);
    expect(errorIsError(Object.create(Error.prototype))).toBe(false);
    expect(errorIsError(Object.create(DOMException.prototype))).toBe(false);
  });

  it('strings, RegExp.escape', () => {
    expect(regExpEscape('ab')).toBe('\\x61b');
    expect(stringAt.call('𠮷', -2)).toBe('\uD842');
    expect(stringFromCodePoint.length).toBe(1);
    expect(stringToWellFormed.call(1)).toBe('1');
  });

  it('arity and no-argument calls', () => {
    expect(spackleQueueMicrotask.length).toBe(1);
    expect(urlCanParse.length).toBe(1);
    expect(() => (urlCanParse as any)()).toThrow(TypeError);
    expect(urlCanParse('https://a.b/')).toBe(true);
    expect(urlCanParse('/x', 'https://a.b/')).toBe(true);
    expect(urlCanParse('/x')).toBe(false);
  });

  it('fromAsync / groupBy', () => {
    let counter = 0;
    arrayFromAsync.call(function () { counter++; return []; }, { length: 0 });
    expect(counter).toBe(1);
    expect(mapGroupBy('ab', function (it: any) { return it; }).get('a').length).toBe(1);
    expect(objectGroupBy('ab', function (it: any) { return it; }).a.length).toBe(1);
  });
});

import { structuredClone as spackleClone } from '../src/modules/web.structured-clone';

describe('core-js checkErrorsCloning, against spackle', () => {
  it('Error and DOMException clone shared, with their stack', () => {
    for (const E of [Error, DOMException] as any[]) {
      const error = new E();
      const test = spackleClone({ a: error, b: error });
      expect(test.a).toBe(test.b);
      expect(test.a instanceof E).toBe(true);
      expect(test.a.stack).toBe(error.stack);
    }
  });
});

import { isSupported as isObjectAssignSupported } from '../src/modules/es.object.assign';

describe('gates keep a correct native', () => {
  it('Object.assign: the modern native passes (the old probe failed every engine)', () => {
    expect(isObjectAssignSupported()).toBe(true);
  });
});
