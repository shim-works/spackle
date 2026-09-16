import {
  iteratorMap,
  iteratorFilter,
  iteratorTake,
  iteratorDrop,
  iteratorFlatMap,
  iteratorToArray,
  iteratorForEach,
  iteratorReduce,
  iteratorSome,
  iteratorEvery,
  iteratorFind,
  iteratorFrom,
  iteratorConcat,
} from '../src/modules/_iterator-impl.js';

/**
 * https://tc39.es/ecma262/#sec-iterator-helper-objects
 *
 * Node already ships iterator helpers, so the module no-ops on import — the
 * implementations are exercised directly, as the other island suites do.
 */
const iterOf = (values: any[]): any => {
  let index = 0;
  return {
    next: () => (index < values.length
      ? { value: values[index++], done: false }
      : { value: undefined, done: true }),
  };
};

// a source that records whether it was closed early
const closableIterOf = (values: any[]): any => {
  let index = 0;
  return {
    closed: false,
    next(this: any) {
      return index < values.length
        ? { value: values[index++], done: false }
        : { value: undefined, done: true };
    },
    return(this: any) {
      this.closed = true;
      return { value: undefined, done: true };
    },
  };
};

const drain = (helper: any): any[] => {
  const out: any[] = [];
  for (;;) {
    const step = helper.next();
    if (step.done) return out;
    out.push(step.value);
  }
};

describe('%IteratorHelperPrototype% identity', () => {
  it('every helper kind shares one prototype', () => {
    const protos = [
      iteratorMap.call(iterOf([1]), (x: number) => x),
      iteratorFilter.call(iterOf([1]), () => true),
      iteratorTake.call(iterOf([1]), 1),
      iteratorDrop.call(iterOf([1]), 1),
      iteratorFlatMap.call(iterOf([[1]]), (x: any) => x),
    ].map((helper) => Object.getPrototypeOf(helper));

    // This is the assertion that fails if anyone splits the atomic install into
    // per-id installs — it is spec-observable, not cosmetic.
    for (let i = 1; i < protos.length; i++) {
      expect(protos[i]).toBe(protos[0]);
    }
  });

  it('helpers are themselves iterable', () => {
    const helper: any = iteratorMap.call(iterOf([1, 2]), (x: number) => x);
    expect(helper[Symbol.iterator]()).toBe(helper);
    expect(Array.from(helper)).toEqual([1, 2]);
  });
});

describe('map / filter / take / drop', () => {
  it('map transforms and passes the index', () => {
    const helper = iteratorMap.call(iterOf(['a', 'b']), (v: string, i: number) => v + i);
    expect(drain(helper)).toEqual(['a0', 'b1']);
  });

  it('filter keeps matches only', () => {
    const helper = iteratorFilter.call(iterOf([1, 2, 3, 4]), (v: number) => v % 2 === 0);
    expect(drain(helper)).toEqual([2, 4]);
  });

  it('take stops after n and closes the source', () => {
    const source = closableIterOf([1, 2, 3, 4]);
    expect(drain(iteratorTake.call(source, 2))).toEqual([1, 2]);
    expect(source.closed).toBe(true);
  });

  it('take(0) yields nothing', () => {
    expect(drain(iteratorTake.call(iterOf([1, 2]), 0))).toEqual([]);
  });

  it('drop skips the first n', () => {
    expect(drain(iteratorDrop.call(iterOf([1, 2, 3]), 2))).toEqual([3]);
  });

  it('take and drop reject negative counts', () => {
    expect(() => iteratorTake.call(iterOf([1]), -1)).toThrow(RangeError);
    expect(() => iteratorDrop.call(iterOf([1]), -1)).toThrow(RangeError);
  });

  it('rejects a non-callable mapper or predicate', () => {
    expect(() => iteratorMap.call(iterOf([1]), 1)).toThrow(TypeError);
    expect(() => iteratorFilter.call(iterOf([1]), 1)).toThrow(TypeError);
  });

  it('is lazy — nothing runs until next() is called', () => {
    let calls = 0;
    const helper = iteratorMap.call(iterOf([1, 2, 3]), (v: number) => {
      calls++;
      return v;
    });
    expect(calls).toBe(0);
    helper.next();
    expect(calls).toBe(1);
  });
});

describe('flatMap', () => {
  it('flattens iterables one level', () => {
    const helper = iteratorFlatMap.call(iterOf([1, 2]), (v: number) => [v, v * 10]);
    expect(drain(helper)).toEqual([1, 10, 2, 20]);
  });

  it('skips empty inner iterables', () => {
    const helper = iteratorFlatMap.call(iterOf([1, 2, 3]), (v: number) => (v === 2 ? [] : [v]));
    expect(drain(helper)).toEqual([1, 3]);
  });

  it('rejects a string result — primitives are not flattened', () => {
    const helper = iteratorFlatMap.call(iterOf(['ab']), (v: string) => v);
    expect(() => helper.next()).toThrow(TypeError);
  });
});

describe('terminal operations', () => {
  it('toArray collects everything', () => {
    expect(iteratorToArray.call(iterOf([1, 2, 3]))).toEqual([1, 2, 3]);
  });

  it('forEach visits each value with its index', () => {
    const seen: any[] = [];
    iteratorForEach.call(iterOf(['a', 'b']), (v: string, i: number) => seen.push([v, i]));
    expect(seen).toEqual([['a', 0], ['b', 1]]);
  });

  it('reduce works with and without an initial value', () => {
    expect(iteratorReduce.call(iterOf([1, 2, 3]), (a: number, b: number) => a + b)).toBe(6);
    expect(iteratorReduce.call(iterOf([1, 2, 3]), (a: number, b: number) => a + b, 10)).toBe(16);
  });

  it('reduce throws on an empty iterator with no initial value', () => {
    expect(() => iteratorReduce.call(iterOf([]), (a: any, b: any) => a + b)).toThrow(TypeError);
  });

  it('reduce accepts a falsy initial value rather than treating it as absent', () => {
    expect(iteratorReduce.call(iterOf([1, 2]), (a: number, b: number) => a + b, 0)).toBe(3);
  });

  it('some / every / find short-circuit and close the source', () => {
    const forSome = closableIterOf([1, 2, 3]);
    expect(iteratorSome.call(forSome, (v: number) => v === 2)).toBe(true);
    expect(forSome.closed).toBe(true);

    const forEvery = closableIterOf([1, 2, 3]);
    expect(iteratorEvery.call(forEvery, (v: number) => v === 1)).toBe(false);
    expect(forEvery.closed).toBe(true);

    const forFind = closableIterOf([1, 2, 3]);
    expect(iteratorFind.call(forFind, (v: number) => v === 2)).toBe(2);
    expect(forFind.closed).toBe(true);
  });

  it('some / every / find report the exhausted cases', () => {
    expect(iteratorSome.call(iterOf([1]), () => false)).toBe(false);
    expect(iteratorEvery.call(iterOf([1]), () => true)).toBe(true);
    expect(iteratorFind.call(iterOf([1]), () => false)).toBe(undefined);
  });
});

describe('Iterator.from / Iterator.concat', () => {
  it('from wraps a bare iterator', () => {
    expect(drain(iteratorFrom(iterOf([1, 2])))).toEqual([1, 2]);
  });

  it('from accepts an iterable', () => {
    expect(drain(iteratorFrom([1, 2]))).toEqual([1, 2]);
    expect(drain(iteratorFrom(new Set([3])))).toEqual([3]);
  });

  it('from rejects a non-object', () => {
    expect(() => iteratorFrom(1 as any)).toThrow(TypeError);
  });

  it('concat walks its sources in order', () => {
    expect(drain(iteratorConcat([1, 2], [3], []))).toEqual([1, 2, 3]);
  });

  it('concat rejects a non-object argument', () => {
    expect(() => iteratorConcat(1 as any)).toThrow(TypeError);
  });
});

describe('chaining', () => {
  it('composes lazily end to end', () => {
    const chain: any = iteratorTake.call(
      iteratorFilter.call(
        iteratorMap.call(iterOf([1, 2, 3, 4, 5, 6]), (v: number) => v * 2),
        (v: number) => v % 3 === 0
      ),
      2
    );
    expect(iteratorToArray.call(chain)).toEqual([6, 12]);
  });
});

describe('retention', () => {
  it('releases the source and callback when exhausted', () => {
    const helper: any = iteratorMap.call(iterOf([1, 2]), (v: number) => v);
    expect(helper._underlying).not.toBe(null);
    drain(helper);
    // an exhausted helper must not pin the source or the callback
    expect(helper._underlying).toBe(null);
    expect(helper._callback).toBe(null);
  });

  it('releases every wrapper in an exhausted chain', () => {
    const inner: any = iteratorMap.call(iterOf([1, 2]), (v: number) => v);
    const outer: any = iteratorFilter.call(inner, () => true);
    drain(outer);
    expect(outer._underlying).toBe(null);
    expect(inner._underlying).toBe(null);
    expect(inner._callback).toBe(null);
  });

  it('releases on return() and closes the source', () => {
    const source = closableIterOf([1, 2, 3]);
    const helper: any = iteratorMap.call(source, (v: number) => v);
    helper.next();
    helper.return();
    expect(helper._underlying).toBe(null);
    expect(helper._callback).toBe(null);
    expect(source.closed).toBe(true);
  });

  it('releases when a callback throws', () => {
    const source = closableIterOf([1, 2]);
    const helper: any = iteratorMap.call(source, () => {
      throw new Error('boom');
    });
    expect(() => helper.next()).toThrow('boom');
    expect(helper._underlying).toBe(null);
    expect(source.closed).toBe(true);
  });

  it('stays done rather than throwing once released', () => {
    const helper: any = iteratorMap.call(iterOf([1]), (v: number) => v);
    drain(helper);
    expect(helper.next()).toEqual({ value: undefined, done: true });
    expect(helper.next()).toEqual({ value: undefined, done: true });
  });
});

/**
 * Regressions found by running real test262 against a forced install.
 * Each of these passed the original hand-written suite.
 */
describe('spec conformance regressions (from test262)', () => {
  it('reads `next` exactly once, not per step', () => {
    // A `next` accessor handing back a fresh closure each access used to make
    // the helper loop forever: every step restarted the source's own counter.
    let nextGets = 0;
    const source: any = {
      get next() {
        nextGets++;
        let count = 3;
        return function () {
          count--;
          return count >= 0 ? { done: false, value: count } : { done: true, value: undefined };
        };
      },
    };
    let mapperCalls = 0;
    const helper: any = iteratorMap.call(source, (v: any) => {
      mapperCalls++;
      return v;
    });
    expect(drain(helper)).toHaveLength(3);
    expect(mapperCalls).toBe(3);
    expect(nextGets).toBe(1);
  });

  it('propagates an error thrown by return() on a normal completion', () => {
    // Previously swallowed unconditionally, silently eating user errors.
    const source: any = {
      next: () => ({ done: false, value: 1 }),
      return() {
        throw new Error('return blew up');
      },
    };
    expect(() => drain(iteratorTake.call(source, 1))).toThrow('return blew up');
  });

  it('discards a return() error when already unwinding', () => {
    // The original error must win, not the one from cleanup.
    const source: any = {
      next: () => ({ done: false, value: 1 }),
      return() {
        throw new Error('cleanup blew up');
      },
    };
    const helper: any = iteratorMap.call(source, () => {
      throw new Error('callback blew up');
    });
    expect(() => helper.next()).toThrow('callback blew up');
  });

  it('throws TypeError if return() hands back a non-object', () => {
    const source: any = { next: () => ({ done: false, value: 1 }), return: () => 1 };
    expect(() => drain(iteratorTake.call(source, 1))).toThrow(TypeError);
  });

  it('validates arguments before reading `next`', () => {
    const effects: string[] = [];
    const source: any = {
      get next() {
        effects.push('get next');
        return () => ({ done: true, value: undefined });
      },
      return: () => ({}),
    };
    iteratorTake.call(source, {
      valueOf() {
        effects.push('ToNumber limit');
        return 0;
      },
    });
    expect(effects).toEqual(['ToNumber limit', 'get next']);
  });

  it('rejects the limits the spec rejects, and accepts the ones it accepts', () => {
    const src = () => ({ next: () => ({ done: true, value: undefined }), return: () => ({}) });
    for (const ok of [0, -0.5, null, Number.MAX_SAFE_INTEGER, Infinity]) {
      expect(() => iteratorTake.call(src(), ok)).not.toThrow();
    }
    for (const bad of [-1, undefined, NaN, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => iteratorTake.call(src(), bad)).toThrow(RangeError);
    }
  });

  it('closes the receiver when argument validation fails', () => {
    let closed = false;
    const source: any = {
      get next() {
        throw new Error('next must not be read');
      },
      return() {
        closed = true;
        return {};
      },
    };
    expect(() => iteratorTake.call(source, NaN)).toThrow(RangeError);
    expect(closed).toBe(true);

    closed = false;
    expect(() => iteratorMap.call(source, 'not a function')).toThrow(TypeError);
    expect(closed).toBe(true);
  });

  it('closes the source when reduce/forEach/some/every/find get a bad callback', () => {
    const closableSource = (): any => {
      let closed = false;
      return {
        closed: false,
        next: () => ({ done: false, value: 1 }),
        return() {
          this.closed = true;
          return {};
        },
      };
    };
    const calls: [any, string][] = [
      [iteratorReduce, 'reducer'],
      [iteratorForEach, 'fn'],
      [iteratorSome, 'predicate'],
      [iteratorEvery, 'predicate'],
      [iteratorFind, 'predicate'],
    ];
    for (const [fn] of calls) {
      const source = closableSource();
      expect(() => fn.call(source, 'not a function')).toThrow(TypeError);
      expect(source.closed).toBe(true);
    }
  });

  it('flatMap rejects every primitive the callback returns, even a boxable one with a patched wrapper prototype', () => {
    // test262: patching Number.prototype[Symbol.iterator] must not make a
    // returned primitive number flatten -- GetIteratorFlattenable rejects any
    // non-object outright, it never auto-boxes to check for an iterator.
    const original = (Number.prototype as any)[Symbol.iterator];
    (Number.prototype as any)[Symbol.iterator] = function* (this: any) {
      yield this;
    };
    try {
      const helper = iteratorFlatMap.call(iterOf([1]), () => 5);
      expect(() => helper.next()).toThrow(TypeError);
    } finally {
      if (original === undefined) {
        delete (Number.prototype as any)[Symbol.iterator];
      } else {
        (Number.prototype as any)[Symbol.iterator] = original;
      }
    }
  });

  it('flatMap throws when the returned object has a defined, non-callable Symbol.iterator', () => {
    const helper = iteratorFlatMap.call(iterOf([1]), () => ({
      [Symbol.iterator]: 0,
      next: () => ({ done: true, value: undefined }),
    }));
    expect(() => helper.next()).toThrow(TypeError);
  });

  it('flatMap falls back to the object itself when Symbol.iterator is null/undefined', () => {
    for (const iteratorValue of [null, undefined]) {
      const inner = iterOf([1, 2]);
      const helper = iteratorFlatMap.call(iterOf([0]), () => ({
        [Symbol.iterator]: iteratorValue,
        next: () => inner.next(),
      }));
      expect(drain(helper)).toEqual([1, 2]);
    }
  });
});

describe('re-entrancy and brand (from test262)', () => {
  it('throws if a callback re-enters the same helper', () => {
    const helper: any = iteratorMap.call(iterOf([1, 2, 3]), () => {
      // reaching back into the helper mid-step must throw, not interleave
      return helper.next();
    });
    expect(() => helper.next()).toThrow(TypeError);
  });

  it('rejects a foreign receiver', () => {
    const helper: any = iteratorMap.call(iterOf([1]), (v: any) => v);
    const proto = Object.getPrototypeOf(helper);
    expect(() => proto.next.call({})).toThrow(TypeError);
    expect(() => proto.next.call(null)).toThrow(TypeError);
    expect(() => proto.return.call({ _underlying: null })).toThrow(TypeError);
  });
});
