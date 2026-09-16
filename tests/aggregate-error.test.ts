import { AggregateError as aggregateErrorPolyfill } from '../src/modules/es.aggregate-error.js';

/**
 * test262-derived conformance suite for the AggregateError polyfill.
 *
 * Cases hand-ported from tc39/test262 — test/built-ins/AggregateError/
 * https://github.com/tc39/test262/tree/main/test/built-ins/AggregateError
 */
describe('AggregateError — test262 conformance', () => {
  it('collects the errors iterable onto .errors', () => {
    const a = new Error('a');
    const b = new Error('b');
    const err = new (aggregateErrorPolyfill as any)([a, b], 'both failed');
    expect(err.errors).toEqual([a, b]);
    expect(err.message).toBe('both failed');
  });

  it('is an Error subclass named AggregateError', () => {
    const err = new (aggregateErrorPolyfill as any)([]);
    expect(err instanceof Error).toBe(true);
    expect(err instanceof (aggregateErrorPolyfill as any)).toBe(true);
    expect(err.name).toBe('AggregateError');
    expect(String(err)).toBe('AggregateError');
  });

  it('constructs when called without new (like Error)', () => {
    const err = (aggregateErrorPolyfill as any)([], 'no new');
    expect(err instanceof (aggregateErrorPolyfill as any)).toBe(true);
    expect(err.message).toBe('no new');
  });

  it('leaves message off the instance when omitted (prototype default is "")', () => {
    const err = new (aggregateErrorPolyfill as any)([]);
    expect(err.message).toBe('');
    expect(Object.prototype.hasOwnProperty.call(err, 'message')).toBe(false);
  });

  it('copies the iterable — .errors is a snapshot array, not the input', () => {
    const input = [1, 2];
    const err = new (aggregateErrorPolyfill as any)(input);
    expect(err.errors).not.toBe(input);
    input.push(3);
    expect(err.errors).toEqual([1, 2]);
  });

  it('drains arbitrary iterables (Set input)', () => {
    const err = new (aggregateErrorPolyfill as any)(new Set(['x', 'y']));
    expect(err.errors).toEqual(['x', 'y']);
  });

  it('keeps .errors and .message non-enumerable, like native', () => {
    const err = new (aggregateErrorPolyfill as any)([1], 'quiet');
    expect(Object.prototype.propertyIsEnumerable.call(err, 'errors')).toBe(false);
    expect(Object.prototype.propertyIsEnumerable.call(err, 'message')).toBe(false);
  });

  it('throws TypeError when errors is not iterable', () => {
    expect(() => new (aggregateErrorPolyfill as any)(undefined)).toThrow(TypeError);
    expect(() => new (aggregateErrorPolyfill as any)(null)).toThrow(TypeError);
    expect(() => new (aggregateErrorPolyfill as any)(123)).toThrow(TypeError);
  });

  it('coerces message with String()', () => {
    const err = new (aggregateErrorPolyfill as any)([], 42);
    expect(err.message).toBe('42');
  });

  it('installs cause from the options bag (ES2022)', () => {
    const cause = new Error('root');
    const err = new (aggregateErrorPolyfill as any)([], 'msg', { cause });
    expect(err.cause).toBe(cause);
    // no options bag, no own cause
    const bare = new (aggregateErrorPolyfill as any)([], 'msg');
    expect(Object.prototype.hasOwnProperty.call(bare, 'cause')).toBe(false);
  });

  it('matches native shape', () => {
    const NativeAggregateError = (window as any).AggregateError;
    const native = new NativeAggregateError([1, 2], 'm');
    const poly = new (aggregateErrorPolyfill as any)([1, 2], 'm');
    expect(poly.errors).toEqual(native.errors);
    expect(poly.message).toBe(native.message);
    expect(poly.name).toBe(native.name);
    expect(String(poly)).toBe(String(native));
  });
});
