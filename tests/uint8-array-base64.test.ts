import {
  uint8ArrayToBase64,
  uint8ArrayToHex,
  uint8ArrayFromBase64,
  uint8ArrayFromHex,
  uint8ArraySetFromBase64,
  uint8ArraySetFromHex,
} from '../src/modules/_uint8-array-impl.js';

/**
 * https://tc39.es/proposal-arraybuffer-base64/
 *
 * The test vectors are the RFC 4648 ones ("", "f", "fo", "foo", "foob",
 * "fooba", "foobar"), which is where padding and partial-chunk handling
 * actually get exercised.
 */
const bytesOf = (text: string) => {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i);
  return out;
};
const textOf = (bytes: any) => {
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
  return out;
};

describe('toBase64', () => {
  it('matches the RFC 4648 vectors', () => {
    expect(uint8ArrayToBase64.call(bytesOf(''))).toBe('');
    expect(uint8ArrayToBase64.call(bytesOf('f'))).toBe('Zg==');
    expect(uint8ArrayToBase64.call(bytesOf('fo'))).toBe('Zm8=');
    expect(uint8ArrayToBase64.call(bytesOf('foo'))).toBe('Zm9v');
    expect(uint8ArrayToBase64.call(bytesOf('foob'))).toBe('Zm9vYg==');
    expect(uint8ArrayToBase64.call(bytesOf('fooba'))).toBe('Zm9vYmE=');
    expect(uint8ArrayToBase64.call(bytesOf('foobar'))).toBe('Zm9vYmFy');
  });

  it('agrees with btoa across every partial-chunk length', () => {
    for (const text of ['', 'f', 'fo', 'foo', 'foob', 'fooba', 'foobar']) {
      expect(uint8ArrayToBase64.call(bytesOf(text))).toBe(btoa(text));
    }
  });

  it('omits padding when asked', () => {
    expect(uint8ArrayToBase64.call(bytesOf('f'), { omitPadding: true })).toBe('Zg');
    expect(uint8ArrayToBase64.call(bytesOf('fo'), { omitPadding: true })).toBe('Zm8');
  });

  it('uses the url-safe alphabet when asked', () => {
    const bytes = new Uint8Array([251, 255]);
    expect(uint8ArrayToBase64.call(bytes)).toBe('+/8=');
    expect(uint8ArrayToBase64.call(bytes, { alphabet: 'base64url' })).toBe('-_8=');
  });

  it('rejects an unknown alphabet', () => {
    expect(() => uint8ArrayToBase64.call(bytesOf('f'), { alphabet: 'nope' })).toThrow(
      TypeError
    );
  });
});

describe('fromBase64', () => {
  it('round-trips every RFC 4648 vector', () => {
    for (const text of ['', 'f', 'fo', 'foo', 'foob', 'fooba', 'foobar']) {
      expect(textOf(uint8ArrayFromBase64(btoa(text)))).toBe(text);
    }
  });

  it('accepts input with padding omitted', () => {
    expect(textOf(uint8ArrayFromBase64('Zm8'))).toBe('fo');
    expect(textOf(uint8ArrayFromBase64('Zg'))).toBe('f');
  });

  it('decodes the url-safe alphabet', () => {
    expect(Array.from(uint8ArrayFromBase64('-_8=', { alphabet: 'base64url' }))).toEqual([
      251, 255,
    ]);
  });

  it('returns a real Uint8Array', () => {
    expect(uint8ArrayFromBase64('Zm9v') instanceof Uint8Array).toBe(true);
  });

  it('rejects a dangling character and bad characters', () => {
    expect(() => uint8ArrayFromBase64('Zm9vZ')).toThrow(SyntaxError);
    expect(() => uint8ArrayFromBase64('Zm9*')).toThrow(SyntaxError);
  });

  it('rejects a non-string', () => {
    expect(() => uint8ArrayFromBase64(1 as any)).toThrow(TypeError);
  });
});

describe('toHex / fromHex', () => {
  it('encodes lowercase, two chars per byte', () => {
    expect(uint8ArrayToHex.call(new Uint8Array([0, 15, 16, 255]))).toBe('000f10ff');
    expect(uint8ArrayToHex.call(new Uint8Array([]))).toBe('');
  });

  it('round-trips', () => {
    expect(Array.from(uint8ArrayFromHex('000f10ff'))).toEqual([0, 15, 16, 255]);
  });

  it('accepts uppercase input', () => {
    expect(Array.from(uint8ArrayFromHex('00FF'))).toEqual([0, 255]);
  });

  it('rejects odd length and bad characters', () => {
    expect(() => uint8ArrayFromHex('abc')).toThrow(SyntaxError);
    expect(() => uint8ArrayFromHex('zz')).toThrow(SyntaxError);
  });
});

describe('setFromBase64 / setFromHex', () => {
  it('writes into the target and reports read/written', () => {
    const target = new Uint8Array(3);
    const result = uint8ArraySetFromBase64.call(target, 'Zm9v');
    expect(textOf(target)).toBe('foo');
    expect(result).toEqual({ read: 4, written: 3 });
  });

  it('stops at the target length instead of overflowing', () => {
    const target = new Uint8Array(3);
    const result = uint8ArraySetFromBase64.call(target, 'Zm9vYmFy'); // "foobar"
    expect(result.written).toBe(3);
    expect(textOf(target)).toBe('foo');
    // read lands on a chunk boundary, so a caller can resume from there
    expect(result.read).toBe(4);
  });

  it('leaves the tail of the target untouched when the input is short', () => {
    const target = new Uint8Array([9, 9, 9]);
    const result = uint8ArraySetFromHex.call(target, '0102');
    expect(Array.from(target)).toEqual([1, 2, 9]);
    expect(result).toEqual({ read: 4, written: 2 });
  });

  it('setFromHex stops at the target length', () => {
    const target = new Uint8Array(2);
    const result = uint8ArraySetFromHex.call(target, '010203');
    expect(Array.from(target)).toEqual([1, 2]);
    expect(result).toEqual({ read: 4, written: 2 });
  });

  it('rejects a non-string', () => {
    expect(() => uint8ArraySetFromHex.call(new Uint8Array(1), 1 as any)).toThrow(TypeError);
  });
});

/**
 * Regressions from real test262. The decoder was rewritten because `read` must
 * index the ORIGINAL string — padding and whitespace included — which
 * pre-stripping made impossible.
 */
describe('lastChunkHandling (from test262)', () => {
  const bytes = (a: any) => Array.from(a);

  it('decodes a padded final chunk in every mode', () => {
    for (const mode of ['loose', 'strict', 'stop-before-partial']) {
      expect(bytes(uint8ArrayFromBase64('ZXhhZg==', { lastChunkHandling: mode })))
        .toEqual([101, 120, 97, 102]);
    }
  });

  it('treats an unpadded tail per mode', () => {
    expect(bytes(uint8ArrayFromBase64('ZXhhZg'))).toEqual([101, 120, 97, 102]);
    expect(bytes(uint8ArrayFromBase64('ZXhhZg', { lastChunkHandling: 'stop-before-partial' })))
      .toEqual([101, 120, 97]);
    expect(() => uint8ArrayFromBase64('ZXhhZg', { lastChunkHandling: 'strict' }))
      .toThrow(SyntaxError);
  });

  it('rejects non-zero padding bits only under strict', () => {
    expect(bytes(uint8ArrayFromBase64('ZXhhZh=='))).toEqual([101, 120, 97, 102]);
    expect(() => uint8ArrayFromBase64('ZXhhZh==', { lastChunkHandling: 'strict' }))
      .toThrow(SyntaxError);
  });

  it('handles an incomplete padded chunk — throws, except stop-before-partial', () => {
    expect(() => uint8ArrayFromBase64('AA=')).toThrow(SyntaxError);
    expect(() => uint8ArrayFromBase64('AA=', { lastChunkHandling: 'strict' })).toThrow(SyntaxError);
    expect(bytes(uint8ArrayFromBase64('AA=', { lastChunkHandling: 'stop-before-partial' })))
      .toEqual([]);
    expect(bytes(uint8ArrayFromBase64('ABCDAA=', { lastChunkHandling: 'stop-before-partial' })))
      .toEqual([0, 16, 131]);
  });

  it('rejects a lone trailing character', () => {
    expect(() => uint8ArrayFromBase64('A')).toThrow(SyntaxError);
    expect(() => uint8ArrayFromBase64('ABCDA')).toThrow(SyntaxError);
    expect(bytes(uint8ArrayFromBase64('A', { lastChunkHandling: 'stop-before-partial' })))
      .toEqual([]);
  });

  it('rejects an unknown lastChunkHandling', () => {
    expect(() => uint8ArrayFromBase64('ZZ==', { lastChunkHandling: 'nope' })).toThrow(TypeError);
  });
});

describe('setFromBase64 read/written (from test262)', () => {
  it('reports read as an index into the original string, padding included', () => {
    // the RFC 4648 vectors -- read must equal the full input length
    for (const [text, expected] of [
      ['', []], ['Zg==', [102]], ['Zm8=', [102, 111]], ['Zm9v', [102, 111, 111]],
      ['Zm9vYg==', [102, 111, 111, 98]], ['Zm9vYmFy', [102, 111, 111, 98, 97, 114]],
    ] as [string, number[]][]) {
      const target = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]);
      const result = uint8ArraySetFromBase64.call(target, text);
      expect(result.read).toBe(text.length);
      expect(result.written).toBe(expected.length);
      expect(Array.from(target).slice(0, expected.length)).toEqual(expected);
      // the tail is untouched
      expect(Array.from(target).slice(expected.length).every((b) => b === 255)).toBe(true);
    }
  });

  it('reads options accessors exactly once', () => {
    let alphabetGets = 0;
    let modeGets = 0;
    uint8ArrayFromBase64('ZZ==', {
      get alphabet() { alphabetGets++; return 'base64'; },
      get lastChunkHandling() { modeGets++; return 'loose'; },
    });
    expect(alphabetGets).toBe(1);
    expect(modeGets).toBe(1);
  });

  it('rejects a non-Uint8Array receiver', () => {
    expect(() => uint8ArrayToBase64.call([1, 2] as any)).toThrow(TypeError);
    expect(() => uint8ArraySetFromHex.call(new Float32Array(2) as any, 'aa')).toThrow(TypeError);
  });
});

describe('detached buffer (from test262)', () => {
  const detach = (buffer: ArrayBuffer): void => {
    structuredClone(buffer, { transfer: [buffer] });
  };

  it('toBase64 checks detachedness AFTER the options getter runs, not before', () => {
    // Already-detached-on-entry must still read the getter (side effects run)
    // before the TypeError -- an early receiver check would skip it.
    const detached = new Uint8Array(2);
    detach(detached.buffer);
    let getterCalls = 0;
    const options = { get alphabet() { getterCalls++; return 'base64'; } };
    expect(() => uint8ArrayToBase64.call(detached, options)).toThrow(TypeError);
    expect(getterCalls).toBe(1);
  });

  it('toBase64 detects a buffer detached as a side effect of the options getter', () => {
    const array = new Uint8Array(2);
    let getterCalls = 0;
    const options = {
      get alphabet() {
        getterCalls++;
        detach(array.buffer);
        return 'base64';
      },
    };
    expect(() => uint8ArrayToBase64.call(array, options)).toThrow(TypeError);
    expect(getterCalls).toBe(1);
  });

  it('setFromBase64 throws on an already-detached buffer', () => {
    const detached = new Uint8Array(3);
    detach(detached.buffer);
    expect(() => uint8ArraySetFromBase64.call(detached, 'Zg==')).toThrow(TypeError);
  });

  it('setFromBase64 detects a buffer detached as a side effect of the options getter', () => {
    const target = new Uint8Array(3);
    let getterCalls = 0;
    const options = {
      get alphabet() {
        getterCalls++;
        detach(target.buffer);
        return 'base64';
      },
    };
    expect(() => uint8ArraySetFromBase64.call(target, 'Zg==', options)).toThrow(TypeError);
    expect(getterCalls).toBe(1);
  });
});

describe('setFromBase64 on a zero-length target (from test262)', () => {
  it('ignores garbage input entirely rather than scanning and rejecting it', () => {
    // maxLength = 0 short-circuits before any character is examined -- even
    // input that would otherwise be a SyntaxError produces read:0, written:0.
    const target = new Uint8Array(0);
    for (const garbage of ['#', 'a#', 'aa#', 'aaa#', 'aaaa#']) {
      for (const lastChunkHandling of ['loose', 'strict', 'stop-before-partial'] as const) {
        const result = uint8ArraySetFromBase64.call(target, garbage, { lastChunkHandling });
        expect(result.read).toBe(0);
        expect(result.written).toBe(0);
      }
    }
  });
});
