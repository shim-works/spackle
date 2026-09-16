/**
 * Spec: https://tc39.es/proposal-arraybuffer-base64/
 *
 * Shared by all six es.uint8-array.* module ids — one codec, six thin
 * re-exports, same pattern as _set-methods-impl.ts. Stateless: nothing here
 * holds a reference to anything, so the shared file carries no retention cost.
 *
 * Known limitations:
 * - [incomplete] `lastChunkHandling` is not implemented; decoding always
 *   behaves as the default 'loose'. Passing 'strict' or 'stop-before-partial'
 *   is accepted and ignored rather than throwing, so a caller relying on strict
 *   rejection of a partial final chunk gets a lenient decode instead.
 */

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const HEX = '0123456789abcdef';

// Every one of these is absent everywhere on the floor, so existence is enough.
export const isSupported = (): boolean => {
  try {
    if (typeof Uint8Array === 'undefined') {
      return false;
    }
    return (
      typeof (Uint8Array as any).fromBase64 === 'function' &&
      typeof (Uint8Array as any).fromHex === 'function' &&
      typeof (Uint8Array.prototype as any).toBase64 === 'function' &&
      typeof (Uint8Array.prototype as any).toHex === 'function' &&
      typeof (Uint8Array.prototype as any).setFromBase64 === 'function' &&
      typeof (Uint8Array.prototype as any).setFromHex === 'function'
    );
  } catch {
    return false;
  }
};

export const isUint8ArrayBase64Supported = isSupported;

const alphabetFor = (options: any): string => {
  // read once into a local: `x === undefined ? d : x` hits the accessor twice
  const raw = options.alphabet;
  const name = raw === undefined ? 'base64' : raw;
  if (name !== 'base64' && name !== 'base64url') {
    throw new TypeError("alphabet must be either 'base64' or 'base64url'");
  }
  return name === 'base64url' ? BASE64URL : BASE64;
};

const lastChunkHandlingFor = (options: any): string => {
  const raw = options.lastChunkHandling;
  const mode = raw === undefined ? 'loose' : raw;
  if (mode !== 'loose' && mode !== 'strict' && mode !== 'stop-before-partial') {
    throw new TypeError(
      "lastChunkHandling must be 'loose', 'strict' or 'stop-before-partial'",
    );
  }
  return mode;
};

const toOptions = (options: any): any => {
  if (options === undefined) return {};
  if (options === null || typeof options !== 'object') {
    throw new TypeError('options must be an object or undefined');
  }
  return options;
};

/**
 * Receiver guard for the prototype methods -- the spec requires a real
 * Uint8Array whose buffer is still attached.
 *
 * The detached case cannot be detected by length: a detached view reports 0,
 * and so does a legitimately empty one. Constructing a zero-length view over
 * the buffer is the discriminator -- that throws only when detached.
 */
const isDetached = (value: any): boolean => {
  try {
    new Uint8Array(value.buffer, 0, 0);
    return false;
  } catch {
    return true;
  }
};

// checkDetached defaults true. toBase64/setFromBase64 pass false: they read an
// `options.alphabet` getter afterward that can run arbitrary code (including
// detaching the buffer), and the spec's detached check runs AFTER that read
// finishes -- even when already detached on entry, the getter must still fire
// before the TypeError, so an early check here would skip it.
const assertUint8Array = (
  value: any,
  method: string,
  checkDetached: boolean = true,
): void => {
  if (
    typeof Uint8Array === 'undefined' ||
    !(value instanceof Uint8Array) ||
    Object.prototype.toString.call(value) !== '[object Uint8Array]'
  ) {
    throw new TypeError('Uint8Array.prototype.' + method + ' called on a non-Uint8Array');
  }
  if (checkDetached && isDetached(value)) {
    throw new TypeError('Uint8Array.prototype.' + method + ' called on a detached buffer');
  }
};

const isBase64Whitespace = (ch: string): boolean =>
  ch === ' ' || ch === '\t' || ch === '\n' || ch === '\f' || ch === '\r';

/**
 * Spec: https://tc39.es/proposal-arraybuffer-base64/#sec-frombase64
 *
 * Walks the ORIGINAL string, because `read` must be an index into it -- padding
 * and whitespace included. (Pre-stripping those, which this used to do, makes
 * `read` unusable for resuming and fails the RFC 4648 vectors outright.)
 *
 * `read` only advances to a completed 4-character chunk boundary, so a caller
 * can hand the remainder back in later. Bytes are emitted through `emit` as they
 * are produced, which is what lets setFromBase64 keep the bytes it decoded
 * before hitting invalid input.
 *
 * lastChunkHandling:
 *   'loose'               (default) a 2- or 3-char tail decodes; extra bits ignored
 *   'strict'              the tail must be a full padded chunk with zero extra bits
 *   'stop-before-partial' an incomplete tail is left undecoded, no error
 */
const decodeBase64 = (
  input: string,
  chars: string,
  maxBytes: number,
  lastChunkHandling: string,
  emit: (byte: number) => void,
): { read: number; written: number } => {
  // Spec: maxLength = 0 short-circuits before any character is examined --
  // even garbage input against a zero-length target reads nothing and throws
  // nothing, rather than being scanned and rejected as invalid syntax first.
  if (maxBytes === 0) {
    return { read: 0, written: 0 };
  }
  const length = input.length;
  let index = 0;
  let read = 0;
  let written = 0;
  let chunk = 0;
  let chunkLength = 0;

  const flushPartial = (): void => {
    // 2 chars -> 1 byte, 3 chars -> 2 bytes
    if (chunkLength === 2) {
      emit((chunk >> 4) & 255);
      written++;
    } else {
      emit((chunk >> 10) & 255);
      emit((chunk >> 2) & 255);
      written += 2;
    }
  };

  const extraBitsSet = (): boolean =>
    chunkLength === 2 ? (chunk & 15) !== 0 : (chunk & 3) !== 0;

  for (;;) {
    if (index === length) {
      if (chunkLength > 0) {
        if (lastChunkHandling === 'stop-before-partial') {
          return { read: read, written: written };
        }
        if (chunkLength === 1) {
          throw new SyntaxError('Invalid base64: a single trailing character');
        }
        if (lastChunkHandling === 'strict') {
          throw new SyntaxError('Invalid base64: incomplete final chunk');
        }
        if (written + (chunkLength - 1) > maxBytes) {
          return { read: read, written: written };
        }
        flushPartial();
      }
      return { read: length, written: written };
    }

    const ch = input.charAt(index);
    index++;

    if (isBase64Whitespace(ch)) continue;

    if (ch === '=') {
      if (chunkLength < 2) {
        throw new SyntaxError('Invalid base64: misplaced padding');
      }
      // only whitespace, and one further '=' when the chunk holds 2 chars,
      // may follow
      let sawSecond = false;
      while (index < length) {
        const tail = input.charAt(index);
        index++;
        if (isBase64Whitespace(tail)) continue;
        if (tail === '=' && chunkLength === 2 && !sawSecond) {
          sawSecond = true;
          continue;
        }
        throw new SyntaxError('Invalid base64: characters after padding');
      }
      if (chunkLength === 2 && !sawSecond) {
        // 'AA=' -- a padded chunk that never completed. Every mode rejects it
        // except stop-before-partial, which just leaves it undecoded.
        if (lastChunkHandling === 'stop-before-partial') {
          return { read: read, written: written };
        }
        throw new SyntaxError('Invalid base64: missing padding');
      }
      if (lastChunkHandling === 'strict' && extraBitsSet()) {
        throw new SyntaxError('Invalid base64: non-zero padding bits');
      }
      if (written + (chunkLength - 1) > maxBytes) {
        return { read: read, written: written };
      }
      flushPartial();
      return { read: length, written: written };
    }

    const value = chars.indexOf(ch);
    if (value === -1) {
      throw new SyntaxError('Invalid base64: bad character');
    }
    // target already full and we are at a clean boundary -- stop here
    if (written === maxBytes && chunkLength === 0) {
      return { read: read, written: written };
    }

    chunk = chunk * 64 + value;
    chunkLength++;

    if (chunkLength === 4) {
      if (written + 3 > maxBytes) {
        return { read: read, written: written };
      }
      emit((chunk >> 16) & 255);
      emit((chunk >> 8) & 255);
      emit(chunk & 255);
      written += 3;
      chunk = 0;
      chunkLength = 0;
      read = index;
      if (written === maxBytes) {
        return { read: read, written: written };
      }
    }
  }
};

const decodeHex = (
  input: string,
  maxBytes: number,
  emit: (byte: number) => void,
): { read: number; written: number } => {
  if (input.length % 2 !== 0) {
    throw new SyntaxError('Invalid hex string: odd length');
  }
  let written = 0;
  let read = 0;
  for (let i = 0; i + 1 < input.length; i += 2) {
    if (written >= maxBytes) break;
    const high = HEX.indexOf(input.charAt(i).toLowerCase());
    const low = HEX.indexOf(input.charAt(i + 1).toLowerCase());
    if (high === -1 || low === -1) {
      // spec keeps whatever was decoded before the bad pair
      throw new SyntaxError('Invalid hex string: bad character');
    }
    emit(high * 16 + low);
    written++;
    read = i + 2;
  }
  return { read: read, written: written };
};

export const uint8ArrayToBase64 = function (this: any, options?: any): string {
  assertUint8Array(this, 'toBase64', false);
  const opts = toOptions(options);
  const chars = alphabetFor(opts);
  const omitPadding = !!opts.omitPadding;
  // Re-check: reading `options.alphabet` above can run arbitrary user code
  // (a getter) that detaches this view's buffer as a side effect. The spec
  // checks detachedness AFTER option reads finish, not just on entry.
  if (isDetached(this)) {
    throw new TypeError('Uint8Array.prototype.toBase64 called on a detached buffer');
  }
  const length = this.length;
  let out = '';
  let i = 0;
  for (; i + 2 < length; i += 3) {
    const n = this[i] * 65536 + this[i + 1] * 256 + this[i + 2];
    out +=
      chars.charAt((n >> 18) & 63) +
      chars.charAt((n >> 12) & 63) +
      chars.charAt((n >> 6) & 63) +
      chars.charAt(n & 63);
  }
  const remaining = length - i;
  if (remaining === 1) {
    const n = this[i];
    out += chars.charAt(n >> 2) + chars.charAt((n << 4) & 63);
    if (!omitPadding) out += '==';
  } else if (remaining === 2) {
    const n = this[i] * 256 + this[i + 1];
    out +=
      chars.charAt(n >> 10) + chars.charAt((n >> 4) & 63) + chars.charAt((n << 2) & 63);
    if (!omitPadding) out += '=';
  }
  return out;
};

export const uint8ArrayToHex = function (this: any): string {
  assertUint8Array(this, 'toHex');
  let out = '';
  for (let i = 0; i < this.length; i++) {
    const byte = this[i];
    out += HEX.charAt((byte >> 4) & 15) + HEX.charAt(byte & 15);
  }
  return out;
};

export const uint8ArrayFromBase64 = function (input: any, options?: any): any {
  if (typeof input !== 'string') {
    throw new TypeError('argument must be a string');
  }
  const opts = toOptions(options);
  // read both options up front, in spec order -- test262 pins the order and
  // count of these gets via accessors
  const chars = alphabetFor(opts);
  const lastChunkHandling = lastChunkHandlingFor(opts);
  const bytes: number[] = [];
  decodeBase64(input, chars, Infinity, lastChunkHandling, (b) => bytes.push(b));
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i];
  return out;
};

export const uint8ArrayFromHex = function (input: any): any {
  if (typeof input !== 'string') {
    throw new TypeError('argument must be a string');
  }
  const bytes: number[] = [];
  decodeHex(input, Infinity, (b) => bytes.push(b));
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i];
  return out;
};

export const uint8ArraySetFromBase64 = function (
  this: any,
  input: any,
  options?: any
): { read: number; written: number } {
  assertUint8Array(this, 'setFromBase64', false);
  if (typeof input !== 'string') {
    throw new TypeError('argument must be a string');
  }
  const opts = toOptions(options);
  const chars = alphabetFor(opts);
  const lastChunkHandling = lastChunkHandlingFor(opts);
  // Re-check: option reads above can run a getter that detaches the target's
  // buffer as a side effect; the spec checks detachedness after they finish.
  if (isDetached(this)) {
    throw new TypeError('Uint8Array.prototype.setFromBase64 called on a detached buffer');
  }
  const target = this;
  let cursor = 0;
  // write as we decode: on invalid input the spec keeps whatever was already
  // written rather than leaving the target untouched
  return decodeBase64(input, chars, target.length, lastChunkHandling, (b) => {
    target[cursor++] = b;
  });
};

export const uint8ArraySetFromHex = function (
  this: any,
  input: any
): { read: number; written: number } {
  assertUint8Array(this, 'setFromHex');
  if (typeof input !== 'string') {
    throw new TypeError('argument must be a string');
  }
  const target = this;
  let cursor = 0;
  return decodeHex(input, target.length, (b) => {
    target[cursor++] = b;
  });
};

// Spec arity. A function's own .length counts declared parameters, so the
// optional `options` arg makes every one of these one too high.
const SPEC_LENGTH: { [key: string]: number } = {
  toBase64: 0,
  toHex: 0,
  setFromBase64: 1,
  setFromHex: 1,
  fromBase64: 1,
  fromHex: 1,
};

if (typeof Uint8Array !== 'undefined' && !isSupported()) {
  const proto = Uint8Array.prototype as any;
  const protoMethods: [string, Function][] = [
    ['toBase64', uint8ArrayToBase64],
    ['toHex', uint8ArrayToHex],
    ['setFromBase64', uint8ArraySetFromBase64],
    ['setFromHex', uint8ArraySetFromHex],
  ];
  for (let i = 0; i < protoMethods.length; i++) {
    const name = protoMethods[i][0];
    if (!proto[name]) {
      Object.defineProperty(protoMethods[i][1], 'name', { value: name, configurable: true });
      Object.defineProperty(protoMethods[i][1], 'length', { value: SPEC_LENGTH[name], configurable: true });
      Object.defineProperty(proto, name, { value: protoMethods[i][1], writable: true, enumerable: false, configurable: true });
      Object.defineProperty((proto[name] as any), '__polyfilled', { value: true });
    }
  }
  const statics: [string, Function][] = [
    ['fromBase64', uint8ArrayFromBase64],
    ['fromHex', uint8ArrayFromHex],
  ];
  for (let i = 0; i < statics.length; i++) {
    const name = statics[i][0];
    if (!(Uint8Array as any)[name]) {
      Object.defineProperty(statics[i][1], 'name', { value: name, configurable: true });
      Object.defineProperty(statics[i][1], 'length', { value: SPEC_LENGTH[name], configurable: true });
      Object.defineProperty((Uint8Array as any), name, { value: statics[i][1], writable: true, enumerable: false, configurable: true });
      Object.defineProperty(((Uint8Array as any)[name] as any), '__polyfilled', {
        value: true,
      });
    }
  }
}
