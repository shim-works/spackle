// ids: es.uint8-array.from-base64, es.uint8-array.from-hex, es.uint8-array.set-from-base64,
//   es.uint8-array.set-from-hex, es.uint8-array.to-base64, es.uint8-array.to-hex
/** Spec: https://tc39.es/proposal-arraybuffer-base64/ */

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
// Stands in for an omitted options argument. Only ever read.
const NO_OPTIONS: any = {};
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

/**
 * Receiver guard: a real Uint8Array with an attached buffer. Length can't tell
 * detached from empty, so construct a zero-length view (throws only when
 * detached). Chrome 38 accepts views over a neutered buffer, so
 * es.array-buffer.transfer also stamps what it detaches with this flag.
 */
const DETACHED_FLAG = '__spackleDetached';

const isDetached = (value: any): boolean => {
  const buffer = value.buffer;
  if (buffer && buffer[DETACHED_FLAG] === true) {
    return true;
  }
  try {
    new Uint8Array(buffer, 0, 0);
    return false;
  } catch {
    /*
     * Construction failed: usually detached, but Safari 7.1's host-object
     * constructors land here too, so a buffer that still has bytes isn't detached.
     */
    try {
      return buffer.byteLength === 0;
    } catch {
      return true;
    }
  }
};

// checkDetached: toBase64/setFromBase64 pass false, because the spec's check
// runs after the `options.alphabet` getter (which may detach).
/*
 * The brand without instanceof: Safari 7.1's typed arrays are host objects
 * (`typeof Uint8Array` is 'object'). toString plus BYTES_PER_ELEMENT, so a
 * @@toStringTag spoof can't pass.
 */

/**
 * Spec: https://tc39.es/proposal-arraybuffer-base64/#sec-frombase64
 *
 * Walks the original string so `read` indexes into it, advancing only at
 * complete 4-char chunks. Bytes go out through `emit` as produced, so
 * setFromBase64 keeps what it decoded before invalid input.
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
  // Spec: maxLength 0 returns before examining any character.
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

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\f' || ch === '\r') continue; // inlined: isBase64Whitespace(ch)

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
        if (tail === ' ' || tail === '\t' || tail === '\n' || tail === '\f' || tail === '\r') continue; // inlined: isBase64Whitespace(tail)
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

// Declared with the spec length (0): pre-ES6 Function#length can't be redefined.
export const uint8ArrayToBase64 = function (this: any): string {
  const options = arguments.length > 0 ? arguments[0] : undefined;
  // inlined: assertUint8Array(this, 'toBase64', false) with isUint8Array
  if (
    typeof Uint8Array === 'undefined' ||
    !this ||
    typeof this !== 'object' ||
    Object.prototype.toString.call(this) !== '[object Uint8Array]' ||
    (this as any).BYTES_PER_ELEMENT !== 1 ||
    typeof (this as any).byteLength !== 'number'
  ) {
    throw new TypeError('Uint8Array.prototype.toBase64 called on a non-Uint8Array');
  }
  // inlined: toOptions(options) -- shared empty object, no `{}` per call
  if (options !== undefined && (options === null || typeof options !== 'object')) {
    throw new TypeError('options must be an object or undefined');
  }
  const opts = options === undefined ? NO_OPTIONS : options;
  // inlined: alphabetFor(opts) -- read the option once; it may be an accessor
  const rawAlphabet = opts.alphabet;
  const alphabet = rawAlphabet === undefined ? 'base64' : rawAlphabet;
  if (alphabet !== 'base64' && alphabet !== 'base64url') {
    throw new TypeError("alphabet must be either 'base64' or 'base64url'");
  }
  const chars = alphabet === 'base64url' ? BASE64URL : BASE64;
  const omitPadding = !!opts.omitPadding;
  // Re-check: the option getter above may have detached the buffer.
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
  // inlined: assertUint8Array(this, 'toHex') with isUint8Array
  if (
    typeof Uint8Array === 'undefined' ||
    !this ||
    typeof this !== 'object' ||
    Object.prototype.toString.call(this) !== '[object Uint8Array]' ||
    (this as any).BYTES_PER_ELEMENT !== 1 ||
    typeof (this as any).byteLength !== 'number'
  ) {
    throw new TypeError('Uint8Array.prototype.toHex called on a non-Uint8Array');
  }
  if (isDetached(this)) {
    throw new TypeError('Uint8Array.prototype.toHex called on a detached buffer');
  }
  let out = '';
  for (let i = 0; i < this.length; i++) {
    const byte = this[i];
    out += HEX.charAt((byte >> 4) & 15) + HEX.charAt(byte & 15);
  }
  return out;
};

// Declared with the spec length (1): pre-ES6 Function#length can't be redefined.
export const uint8ArrayFromBase64 = function (input: any): any {
  const options = arguments.length > 1 ? arguments[1] : undefined;
  if (typeof input !== 'string') {
    throw new TypeError('argument must be a string');
  }
  // inlined: toOptions(options) -- shared empty object, no `{}` per call
  if (options !== undefined && (options === null || typeof options !== 'object')) {
    throw new TypeError('options must be an object or undefined');
  }
  const opts = options === undefined ? NO_OPTIONS : options;
  // read both options up front, in spec order (test262 counts the gets)
  // inlined: alphabetFor(opts) -- read the option once; it may be an accessor
  const rawAlphabet = opts.alphabet;
  const alphabet = rawAlphabet === undefined ? 'base64' : rawAlphabet;
  if (alphabet !== 'base64' && alphabet !== 'base64url') {
    throw new TypeError("alphabet must be either 'base64' or 'base64url'");
  }
  const chars = alphabet === 'base64url' ? BASE64URL : BASE64;
  // inlined: lastChunkHandlingFor(opts)
  const rawMode = opts.lastChunkHandling;
  const lastChunkHandling = rawMode === undefined ? 'loose' : rawMode;
  if (lastChunkHandling !== 'loose' && lastChunkHandling !== 'strict' && lastChunkHandling !== 'stop-before-partial') {
    throw new TypeError("lastChunkHandling must be 'loose', 'strict' or 'stop-before-partial'");
  }
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

// Declared with the spec length (1): pre-ES6 Function#length can't be redefined.
export const uint8ArraySetFromBase64 = function (
  this: any,
  input: any
): { read: number; written: number } {
  const options = arguments.length > 1 ? arguments[1] : undefined;
  // inlined: assertUint8Array(this, 'setFromBase64', false) with isUint8Array
  if (
    typeof Uint8Array === 'undefined' ||
    !this ||
    typeof this !== 'object' ||
    Object.prototype.toString.call(this) !== '[object Uint8Array]' ||
    (this as any).BYTES_PER_ELEMENT !== 1 ||
    typeof (this as any).byteLength !== 'number'
  ) {
    throw new TypeError('Uint8Array.prototype.setFromBase64 called on a non-Uint8Array');
  }
  if (typeof input !== 'string') {
    throw new TypeError('argument must be a string');
  }
  // inlined: toOptions(options) -- shared empty object, no `{}` per call
  if (options !== undefined && (options === null || typeof options !== 'object')) {
    throw new TypeError('options must be an object or undefined');
  }
  const opts = options === undefined ? NO_OPTIONS : options;
  // inlined: alphabetFor(opts) -- read the option once; it may be an accessor
  const rawAlphabet = opts.alphabet;
  const alphabet = rawAlphabet === undefined ? 'base64' : rawAlphabet;
  if (alphabet !== 'base64' && alphabet !== 'base64url') {
    throw new TypeError("alphabet must be either 'base64' or 'base64url'");
  }
  const chars = alphabet === 'base64url' ? BASE64URL : BASE64;
  // inlined: lastChunkHandlingFor(opts)
  const rawMode = opts.lastChunkHandling;
  const lastChunkHandling = rawMode === undefined ? 'loose' : rawMode;
  if (lastChunkHandling !== 'loose' && lastChunkHandling !== 'strict' && lastChunkHandling !== 'stop-before-partial') {
    throw new TypeError("lastChunkHandling must be 'loose', 'strict' or 'stop-before-partial'");
  }
  // Re-check: the option getters above may have detached the buffer.
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
  // inlined: assertUint8Array(this, 'setFromHex') with isUint8Array
  if (
    typeof Uint8Array === 'undefined' ||
    !this ||
    typeof this !== 'object' ||
    Object.prototype.toString.call(this) !== '[object Uint8Array]' ||
    (this as any).BYTES_PER_ELEMENT !== 1 ||
    typeof (this as any).byteLength !== 'number'
  ) {
    throw new TypeError('Uint8Array.prototype.setFromHex called on a non-Uint8Array');
  }
  if (isDetached(this)) {
    throw new TypeError('Uint8Array.prototype.setFromHex called on a detached buffer');
  }
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

export const install = (): void => {
  if (typeof Uint8Array !== 'undefined') {
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
        try { Object.defineProperty(protoMethods[i][1], 'name', { value: name, configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
        try { Object.defineProperty(protoMethods[i][1], 'length', { value: SPEC_LENGTH[name], configurable: true }); } catch (e) { /* Function#length non-configurable pre-ES6 */ }
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
        try { Object.defineProperty(statics[i][1], 'name', { value: name, configurable: true }); } catch (e) { /* Function#name non-configurable pre-ES6 */ }
        try { Object.defineProperty(statics[i][1], 'length', { value: SPEC_LENGTH[name], configurable: true }); } catch (e) { /* Function#length non-configurable pre-ES6 */ }
        Object.defineProperty((Uint8Array as any), name, { value: statics[i][1], writable: true, enumerable: false, configurable: true });
        Object.defineProperty(((Uint8Array as any)[name] as any), '__polyfilled', {
          value: true,
        });
      }
    }
  }
};
