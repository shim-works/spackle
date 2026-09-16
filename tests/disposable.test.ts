import {
  SuppressedError,
  DisposableStack,
  AsyncDisposableStack,
} from '../src/modules/_disposable-impl.js';

/**
 * https://tc39.es/proposal-explicit-resource-management/
 *
 * `using` / `await using` are syntax and can't be exercised here — these test
 * the objects the syntax desugars to, which is what the polyfill provides.
 */
const disposeKey: any = (Symbol as any).dispose;
const asyncDisposeKey: any = (Symbol as any).asyncDispose;

describe('SuppressedError', () => {
  it('carries both errors and reads as an Error', () => {
    const outer = new Error('outer');
    const inner = new Error('inner');
    const suppressed: any = new (SuppressedError as any)(outer, inner, 'both failed');
    expect(suppressed.error).toBe(outer);
    expect(suppressed.suppressed).toBe(inner);
    expect(suppressed.message).toBe('both failed');
    expect(suppressed.name).toBe('SuppressedError');
    expect(suppressed instanceof Error).toBe(true);
  });

  it('works without new', () => {
    const suppressed: any = (SuppressedError as any)(1, 2);
    expect(suppressed instanceof (SuppressedError as any)).toBe(true);
    expect(suppressed.message).toBe('');
  });
});

describe('DisposableStack', () => {
  it('requires new', () => {
    expect(() => (DisposableStack as any)()).toThrow(TypeError);
  });

  it('disposes in reverse order and reports disposed', () => {
    const order: number[] = [];
    const stack: any = new (DisposableStack as any)();
    expect(stack.disposed).toBe(false);
    stack.defer(() => order.push(1));
    stack.defer(() => order.push(2));
    stack.defer(() => order.push(3));
    stack.dispose();
    expect(order).toEqual([3, 2, 1]);
    expect(stack.disposed).toBe(true);
  });

  it('is a no-op when disposed twice', () => {
    let calls = 0;
    const stack: any = new (DisposableStack as any)();
    stack.defer(() => calls++);
    stack.dispose();
    stack.dispose();
    expect(calls).toBe(1);
  });

  it('use() registers @@dispose and returns the value', () => {
    let disposed = false;
    const resource: any = {};
    resource[disposeKey] = () => {
      disposed = true;
    };
    const stack: any = new (DisposableStack as any)();
    expect(stack.use(resource)).toBe(resource);
    stack.dispose();
    expect(disposed).toBe(true);
  });

  it('use() passes null and undefined straight through', () => {
    const stack: any = new (DisposableStack as any)();
    expect(stack.use(null)).toBe(null);
    expect(stack.use(undefined)).toBe(undefined);
  });

  it('use() rejects a non-disposable', () => {
    const stack: any = new (DisposableStack as any)();
    expect(() => stack.use({})).toThrow(TypeError);
  });

  it('adopt() calls the disposer with the value', () => {
    const seen: any[] = [];
    const stack: any = new (DisposableStack as any)();
    const value = { id: 1 };
    expect(stack.adopt(value, (v: any) => seen.push(v))).toBe(value);
    stack.dispose();
    expect(seen).toEqual([value]);
  });

  it('move() transfers ownership and disposes the original', () => {
    let calls = 0;
    const stack: any = new (DisposableStack as any)();
    stack.defer(() => calls++);
    const moved = stack.move();
    expect(stack.disposed).toBe(true);
    stack.dispose();
    expect(calls).toBe(0); // the original no longer owns it
    moved.dispose();
    expect(calls).toBe(1);
  });

  it('throws on use after dispose', () => {
    const stack: any = new (DisposableStack as any)();
    stack.dispose();
    expect(() => stack.defer(() => {})).toThrow(ReferenceError);
  });

  it('runs every disposer even when one throws, then reports both', () => {
    const order: number[] = [];
    const stack: any = new (DisposableStack as any)();
    stack.defer(() => order.push(1));
    stack.defer(() => {
      throw new Error('first');
    });
    stack.defer(() => {
      throw new Error('second');
    });
    let caught: any;
    try {
      stack.dispose();
    } catch (error) {
      caught = error;
    }
    expect(order).toEqual([1]);
    // reverse order: 'second' throws first, then 'first' displaces it
    expect(caught.name).toBe('SuppressedError');
    expect(caught.error.message).toBe('first');
    expect(caught.suppressed.message).toBe('second');
  });

  it('rethrows a lone error unwrapped', () => {
    const stack: any = new (DisposableStack as any)();
    stack.defer(() => {
      throw new Error('only');
    });
    expect(() => stack.dispose()).toThrow('only');
  });

  it('releases its resources before running them', () => {
    const stack: any = new (DisposableStack as any)();
    stack.defer(() => {
      throw new Error('boom');
    });
    try {
      stack.dispose();
    } catch {
      /* expected */
    }
    // a throwing disposer must not leave the list pinned to a finished stack
    expect(stack._stack.length).toBe(0);
  });

  it('is wired to @@dispose', () => {
    const stack: any = new (DisposableStack as any)();
    expect(typeof stack[disposeKey]).toBe('function');
  });
});

describe('AsyncDisposableStack', () => {
  it('awaits each disposer, in reverse order', async () => {
    const order: number[] = [];
    const stack: any = new (AsyncDisposableStack as any)();
    stack.defer(() => Promise.resolve().then(() => void order.push(1)));
    stack.defer(() => void order.push(2));
    await stack.disposeAsync();
    expect(order).toEqual([2, 1]);
    expect(stack.disposed).toBe(true);
  });

  it('use() prefers @@asyncDispose over @@dispose', async () => {
    const called: string[] = [];
    const resource: any = {};
    resource[disposeKey] = () => called.push('sync');
    resource[asyncDisposeKey] = () => called.push('async');
    const stack: any = new (AsyncDisposableStack as any)();
    stack.use(resource);
    await stack.disposeAsync();
    expect(called).toEqual(['async']);
  });

  it('use() falls back to @@dispose', async () => {
    let disposed = false;
    const resource: any = {};
    resource[disposeKey] = () => {
      disposed = true;
    };
    const stack: any = new (AsyncDisposableStack as any)();
    stack.use(resource);
    await stack.disposeAsync();
    expect(disposed).toBe(true);
  });

  it('rejects with a SuppressedError when several disposers throw', async () => {
    const stack: any = new (AsyncDisposableStack as any)();
    stack.defer(() => Promise.reject(new Error('first')));
    stack.defer(() => Promise.reject(new Error('second')));
    let caught: any;
    try {
      await stack.disposeAsync();
    } catch (error) {
      caught = error;
    }
    expect(caught.name).toBe('SuppressedError');
    expect(caught.error.message).toBe('first');
    expect(caught.suppressed.message).toBe('second');
  });

  it('resolves on a second disposeAsync', async () => {
    const stack: any = new (AsyncDisposableStack as any)();
    await stack.disposeAsync();
    await expect(stack.disposeAsync()).resolves.toBe(undefined);
  });
});

/**
 * Regressions from real test262.
 */
describe('brand checks (from test262)', () => {
  const stack: any = new (DisposableStack as any)();
  const asyncStack: any = new (AsyncDisposableStack as any)();

  it('rejects an ordinary object', () => {
    for (const m of ['use', 'adopt', 'defer', 'move', 'dispose']) {
      expect(() => (DisposableStack as any).prototype[m].call({}, () => {})).toThrow(TypeError);
    }
  });

  it('rejects a non-object receiver', () => {
    expect(() => (DisposableStack as any).prototype.use.call(null, {})).toThrow(TypeError);
    expect(() => (DisposableStack as any).prototype.dispose.call(1)).toThrow(TypeError);
  });

  it('rejects the OTHER stack class — _stack alone cannot tell them apart', () => {
    expect(() => (DisposableStack as any).prototype.dispose.call(asyncStack)).toThrow(TypeError);
    expect(() => (AsyncDisposableStack as any).prototype.disposeAsync.call(stack)).toThrow(TypeError);
  });

  it('the disposed getter is branded and correctly named', () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      (DisposableStack as any).prototype, 'disposed')!;
    expect(descriptor.get!.name).toBe('get disposed');
    expect(() => descriptor.get!.call({})).toThrow(TypeError);
  });
});

describe('constructor shape (from test262)', () => {
  it('SuppressedError inherits from Error', () => {
    expect(Object.getPrototypeOf(SuppressedError)).toBe(Error);
  });

  it('a symbol message throws rather than silently stringifying', () => {
    // String(sym) is special-cased and would NOT throw; ToString(sym) does
    expect(() => new (SuppressedError as any)(1, 2, Symbol('x'))).toThrow(TypeError);
  });

  it('prototype is non-writable', () => {
    for (const ctor of [SuppressedError, DisposableStack, AsyncDisposableStack]) {
      expect(Object.getOwnPropertyDescriptor(ctor as any, 'prototype')!.writable).toBe(false);
    }
  });

  it('carries @@toStringTag', () => {
    expect((DisposableStack as any).prototype[Symbol.toStringTag]).toBe('DisposableStack');
    expect((AsyncDisposableStack as any).prototype[Symbol.toStringTag]).toBe('AsyncDisposableStack');
  });

  it('@@toStringTag is non-writable, unlike ordinary methods (from test262)', () => {
    for (const proto of [
      (DisposableStack as any).prototype,
      (AsyncDisposableStack as any).prototype,
      (SuppressedError as any).prototype,
    ]) {
      const desc = Object.getOwnPropertyDescriptor(proto, Symbol.toStringTag)!;
      expect(desc.writable).toBe(false);
      expect(desc.configurable).toBe(true);
    }
  });
});
