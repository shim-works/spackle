// Behavioural: relative resolution, path %-encoding, empty ?/# kept, credentials,
// file: paths, and a `searchParams` that is identity-stable and live (Chrome
// 49-55's returned a detached copy each time).
import { define } from '../define.js';

export const isSupported = (): boolean => {
  try {
    const url = new URL('b', 'http://a');
    url.pathname = 'c d';
    if (url.href !== 'http://a/c%20d' || url.searchParams === undefined) {
      return false;
    }
    if (url.searchParams !== url.searchParams) {
      return false;
    }
    const live = new URL('http://a/?x=1');
    live.searchParams.set('x', '2');
    if (live.search !== '?x=2') return false;
    if (new URL('http://u:p@a/?#').href !== 'http://u:p@a/?#') return false;
    // no drive letters: Chromium's own differ (file:///C:/.. -> file:///b), and
    // that Windows-only quirk is no reason to replace its URL
    if (new URL('c.png', 'file:///a/b/../index.html').href !== 'file:///a/c.png') return false;

    // core-js's url-constructor-detection, as is
    const probe = new URL('b?a=1&b=2&c=3', 'https://a');
    const params: any = probe.searchParams;
    let result = '';
    probe.pathname = 'c%20d';
    params.forEach(function (value: string, key: string) {
      params['delete']('b');
      result += key + value;
    });
    const iteratorKey = typeof Symbol === 'function' ? (Symbol as any).iterator : undefined;
    return !(
      !params.sort ||
      probe.href !== 'https://a/c%20d?a=1&c=3' ||
      params.get('c') !== '3' ||
      String(new URLSearchParams('?a=1')) !== 'a=1' ||
      (iteratorKey && !params[iteratorKey]) ||
      new URL('https://a@b').username !== 'a' || // throws in Edge
      new URLSearchParams(new URLSearchParams('a=b') as any).get('a') !== 'b' ||
      new URL('https://тест').host !== 'xn--e1aybc' || // not punycoded in Edge
      new URL('https://a#б').hash !== '#%D0%B1' || // not escaped in Chrome 62-
      result !== 'a1c3' || // fails in Chrome 66-
      new URL('https://x', undefined).host !== 'x' // throws in Safari
    );
  } catch {
    return false;
  }
};

/**
 * Spec: https://url.spec.whatwg.org/
 *
 * The basic URL parser state machine, the host parser (IPv4, IPv6, opaque and
 * domain hosts), the serializer, every setter (state override) and the
 * URLSearchParams update steps. Special schemes (http, https, ws, wss, ftp,
 * file) are the target; non-special ones fall out of the same machine.
 *
 * Each URL holds one record (scheme, username, password, host, port, path,
 * query, fragment) in a hidden `_url` slot; getters serialize from it. Params
 * are made on first `searchParams` read. spackle's own URLSearchParams shares
 * the record (its `_url` slot) and writes the query back on every mutation.
 *
 * Known limitations:
 * - [incomplete] Domain to ASCII is core-js's UTS #46 subset plus punycode: no
 *   mapping table, NFC, CheckJoiners or CheckBidi, and xn-- labels are not
 *   decoded back for validation.
 * - [incomplete] With a native URLSearchParams underneath, a params change is
 *   only seen when it changes the serialization.
 */

const hasOwn = Object.prototype.hasOwnProperty;
const FAILURE: any = {};
// default ports; null for file. hasOwn: '__proto__' is not special.
const SPECIAL: any = { ftp: 21, file: null, http: 80, https: 443, ws: 80, wss: 443 };
const isSpecialScheme = (scheme: string): boolean => hasOwn.call(SPECIAL, scheme);

// states
const SCHEME_START = 1, SCHEME = 2, NO_SCHEME = 3, SPECIAL_RELATIVE_OR_AUTHORITY = 4,
  PATH_OR_AUTHORITY = 5, RELATIVE = 6, RELATIVE_SLASH = 7, SPECIAL_AUTHORITY_SLASHES = 8,
  SPECIAL_AUTHORITY_IGNORE_SLASHES = 9, AUTHORITY = 10, HOST = 11, HOSTNAME = 12, PORT = 13,
  FILE = 14, FILE_SLASH = 15, FILE_HOST = 16, PATH_START = 17, PATH = 18, OPAQUE_PATH = 19,
  QUERY = 20, FRAGMENT = 21;

/* ------------------------------------------------------- percent-encoding */

const SET_C0 = 0, SET_FRAGMENT = 1, SET_QUERY = 2, SET_SPECIAL_QUERY = 3, SET_PATH = 4, SET_USERINFO = 5;

const inSet = (code: number, set: number): boolean => {
  if (code < 0x20 || code > 0x7e) return true;
  if (set === SET_C0) return false;
  if (set === SET_FRAGMENT) return code === 0x20 || code === 0x22 || code === 0x3c || code === 0x3e || code === 0x60;
  if (code === 0x20 || code === 0x22 || code === 0x23 || code === 0x3c || code === 0x3e) return true;
  if (set === SET_QUERY) return false;
  if (set === SET_SPECIAL_QUERY) return code === 0x27;
  if (code === 0x3f || code === 0x5e || code === 0x60 || code === 0x7b || code === 0x7d) return true;
  if (set === SET_PATH) return false;
  return code === 0x2f || code === 0x3a || code === 0x3b || code === 0x3d || code === 0x40 ||
    (code >= 0x5b && code <= 0x5d) || code === 0x7c;
};

// UTF-8 percent-encode every code point of s that is in the set. s is a USV
// string (no lone surrogates), so encodeURIComponent never throws.
const percentEncode = (s: string, set: number): string => {
  let i = 0;
  while (i < s.length && !inSet(s.charCodeAt(i), set)) i++;
  if (i === s.length) return s;
  let out = s.substring(0, i);
  for (; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (!inSet(code, set)) {
      out += s.charAt(i);
    } else if (code < 0x80) {
      out += (code < 16 ? '%0' : '%') + code.toString(16).toUpperCase();
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < s.length) {
      out += encodeURIComponent(s.charAt(i) + s.charAt(i + 1));
      i++;
    } else {
      out += encodeURIComponent(s.charAt(i));
    }
  }
  return out;
};

const isHex = (c: string): boolean => /^[0-9A-Fa-f]$/.test(c);

// percent-decode, then UTF-8 decode without BOM, invalid bytes to U+FFFD
const percentDecodeUtf8 = (s: string): string => {
  if (s.indexOf('%') === -1) return s;
  const bytes: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);
    if (c === '%' && i + 2 < s.length && isHex(s.charAt(i + 1)) && isHex(s.charAt(i + 2))) {
      bytes.push(parseInt(s.substr(i + 1, 2), 16));
      i += 2;
    } else {
      const code = s.charCodeAt(i);
      if (code < 0x80) {
        bytes.push(code);
      } else {
        let ch = c;
        if (code >= 0xd800 && code <= 0xdbff && i + 1 < s.length) ch += s.charAt(++i);
        const enc = encodeURIComponent(ch);
        for (let k = 0; k < enc.length; k += 3) bytes.push(parseInt(enc.substr(k + 1, 2), 16));
      }
    }
  }
  let out = '';
  for (let i = 0; i < bytes.length;) {
    const b = bytes[i];
    if (b < 0x80) {
      out += String.fromCharCode(b);
      i++;
      continue;
    }
    let need = 0, cp = 0, lower = 0x80, upper = 0xbf;
    if (b >= 0xc2 && b <= 0xdf) { need = 1; cp = b & 0x1f; }
    else if (b >= 0xe0 && b <= 0xef) { need = 2; cp = b & 0x0f; if (b === 0xe0) lower = 0xa0; if (b === 0xed) upper = 0x9f; }
    else if (b >= 0xf0 && b <= 0xf4) { need = 3; cp = b & 0x07; if (b === 0xf0) lower = 0x90; if (b === 0xf4) upper = 0x8f; }
    else { out += '\ufffd'; i++; continue; }
    let j = i + 1;
    let ok = true;
    for (let k = 0; k < need; k++, j++) {
      const n = bytes[j];
      if (n === undefined || n < lower || n > upper) { ok = false; break; }
      lower = 0x80;
      upper = 0xbf;
      cp = (cp << 6) | (n & 0x3f);
    }
    if (!ok) {
      out += '\ufffd';
      i = j; // maximal subpart: the bad byte is read again
      continue;
    }
    if (cp > 0xffff) {
      cp -= 0x10000;
      out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
    } else {
      out += String.fromCharCode(cp);
    }
    i = j;
  }
  return out;
};

// USVString: lone surrogates become U+FFFD
const toUSV = (value: any): string => {
  if (typeof value === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const s = String(value);
  return /[\ud800-\udfff]/.test(s)
    ? s.replace(/[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g, function (m: string) { return m.length === 2 ? m : '\ufffd'; })
    : s;
};

/* ------------------------------------------------------------------ hosts */

const parseIPv4Number = (input: string): number => {
  if (input === '') return FAILURE;
  let radix = 10;
  if (input.length >= 2 && input.charAt(0) === '0' && (input.charAt(1) === 'x' || input.charAt(1) === 'X')) {
    input = input.substring(2);
    radix = 16;
  } else if (input.length >= 2 && input.charAt(0) === '0') {
    input = input.substring(1);
    radix = 8;
  }
  if (input === '') return 0;
  const valid = radix === 10 ? /^[0-9]+$/ : radix === 16 ? /^[0-9A-Fa-f]+$/ : /^[0-7]+$/;
  if (!valid.test(input)) return FAILURE;
  return parseInt(input, radix);
};

const endsInANumber = (input: string): boolean => {
  const parts = input.split('.');
  if (parts[parts.length - 1] === '') {
    if (parts.length === 1) return false;
    parts.pop();
  }
  const last = parts[parts.length - 1];
  if (last !== '' && /^[0-9]+$/.test(last)) return true;
  return parseIPv4Number(last) !== FAILURE;
};

const parseIPv4 = (input: string): any => {
  const parts = input.split('.');
  if (parts[parts.length - 1] === '' && parts.length > 1) parts.pop();
  if (parts.length > 4) return FAILURE;
  const numbers: number[] = [];
  for (let i = 0; i < parts.length; i++) {
    const n = parseIPv4Number(parts[i]);
    if (n === FAILURE) return FAILURE;
    numbers.push(n);
  }
  for (let i = 0; i < numbers.length - 1; i++) if (numbers[i] > 255) return FAILURE;
  if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) return FAILURE;
  let ipv4 = numbers[numbers.length - 1];
  for (let i = 0; i < numbers.length - 1; i++) ipv4 += numbers[i] * Math.pow(256, 3 - i);
  let out = '';
  for (let i = 3; i >= 0; i--) {
    out += Math.floor(ipv4 / Math.pow(256, i)) % 256;
    if (i > 0) out += '.';
  }
  return out;
};

const parseIPv6 = (input: string): any => {
  const address = [0, 0, 0, 0, 0, 0, 0, 0];
  let pieceIndex = 0;
  let compress = -1;
  let pointer = 0;
  if (input.charAt(0) === ':') {
    if (input.charAt(1) !== ':') return FAILURE;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (pointer < input.length) {
    if (pieceIndex === 8) return FAILURE;
    if (input.charAt(pointer) === ':') {
      if (compress !== -1) return FAILURE;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    let value = 0;
    let length = 0;
    while (length < 4 && pointer < input.length && isHex(input.charAt(pointer))) {
      value = value * 16 + parseInt(input.charAt(pointer), 16);
      pointer++;
      length++;
    }
    if (input.charAt(pointer) === '.') {
      if (length === 0) return FAILURE;
      pointer -= length;
      if (pieceIndex > 6) return FAILURE;
      let numbersSeen = 0;
      while (pointer < input.length) {
        let ipv4Piece = -1;
        if (numbersSeen > 0) {
          if (input.charAt(pointer) === '.' && numbersSeen < 4) pointer++;
          else return FAILURE;
        }
        if (!/^[0-9]$/.test(input.charAt(pointer))) return FAILURE;
        while (/^[0-9]$/.test(input.charAt(pointer))) {
          const number = +input.charAt(pointer);
          if (ipv4Piece === -1) ipv4Piece = number;
          else if (ipv4Piece === 0) return FAILURE;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return FAILURE;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen === 2 || numbersSeen === 4) pieceIndex++;
      }
      if (numbersSeen !== 4) return FAILURE;
      break;
    } else if (input.charAt(pointer) === ':') {
      pointer++;
      if (pointer >= input.length) return FAILURE;
    } else if (pointer < input.length) {
      return FAILURE;
    }
    address[pieceIndex] = value;
    pieceIndex++;
  }
  if (compress !== -1) {
    let swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex !== 0 && swaps > 0) {
      const t = address[pieceIndex];
      address[pieceIndex] = address[compress + swaps - 1];
      address[compress + swaps - 1] = t;
      pieceIndex--;
      swaps--;
    }
  } else if (pieceIndex !== 8) {
    return FAILURE;
  }
  // serialize: compress the first longest run of two or more zero pieces
  let bestStart = -1, bestLen = 1;
  for (let i = 0; i < 8;) {
    if (address[i] !== 0) { i++; continue; }
    let j = i;
    while (j < 8 && address[j] === 0) j++;
    if (j - i > bestLen) { bestStart = i; bestLen = j - i; }
    i = j;
  }
  let out = '';
  let ignore0 = false;
  for (let i = 0; i < 8; i++) {
    if (ignore0 && address[i] === 0) continue;
    ignore0 = false;
    if (bestStart === i) {
      out += i === 0 ? '::' : ':';
      ignore0 = true;
      continue;
    }
    out += address[i].toString(16);
    if (i !== 7) out += ':';
  }
  return '[' + out + ']';
};

/*
 * Domain to ASCII, as core-js's web.url does it: a subset of UTS #46 (the
 * ignored and disallowed code points, full-width forms, and the code points
 * that map onto a forbidden domain code point), lowercasing, then punycode for
 * every non-ASCII label (core-js's string-punycode-to-ascii, after punycode.js).
 * No mapping table, NFC, CheckJoiners or CheckBidi: such domains are punycoded
 * as they come, and labels that arrive as xn-- are not decoded back.
 */
// UTS #46 maps these onto a string holding a forbidden domain code point, so a
// domain with one is rejected (core-js's MAPPED_ONTO_FORBIDDEN)
const MAPPED_ONTO_FORBIDDEN = '¨¯´¸˘˙˚˛˜˝ͺ΄΅᾽᾿῀' +
  '῁῍῎῏῝῞῟῭΅´῾‗‾⁇⁈⁉' +
  '℀℁℅℆⩴゛゜ﱞﱟﱠﱡﱢﱣﷺﷻ︓' +
  '︖﹇﹈﹉﹊﹋﹌﹕﹖﹟﹤﹥﹨﹪﹫ﹰ' +
  'ﹲﹴﹶﹸﹺﹼﹾ￣';
const domainToASCII = (domain: string): any => {
  // an ASCII domain needs no mapping and no punycode: the common case, no allocation past the lowercase
  if (!/[^\u0000-\u007f]/.test(domain)) return domain === '' ? FAILURE : domain.toLowerCase();
  let mapped = '';
  for (let i = 0; i < domain.length; i++) {
    // inlined: code point at i -- a surrogate pair is one code point
    let code = domain.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < domain.length) {
      const low = domain.charCodeAt(i + 1);
      if ((low & 0xfc00) === 0xdc00) {
        code = ((code & 0x3ff) << 10) + (low & 0x3ff) + 0x10000;
        i++;
      }
    }
    // inlined: isDisallowedCodePoint(code) -- U+FFFD, lone surrogates, C1 controls,
    // bidi formatting and separators, noncharacters, private use
    if (
      code === 0xfffd || (code >= 0xd800 && code <= 0xdfff) || (code >= 0x80 && code <= 0x9f) ||
      (code >= 0x200e && code <= 0x200f) || (code >= 0x2028 && code <= 0x2029) ||
      (code >= 0x202a && code <= 0x202e) || (code >= 0x2065 && code <= 0x2069) ||
      (code >= 0xfdd0 && code <= 0xfdef) || (code & 0xfffe) === 0xfffe ||
      (code >= 0xe000 && code <= 0xf8ff) || (code >= 0xf0000 && code <= 0x10fffd)
    ) return FAILURE;
    // inlined: isIgnoredCodePoint(code)
    if (
      code === 0xad || code === 0x34f || code === 0x200b || code === 0x3164 || code === 0xfeff || code === 0xffa0 ||
      (code >= 0x115f && code <= 0x1160) || (code >= 0x17b4 && code <= 0x17b5) || (code >= 0x180b && code <= 0x180f) ||
      (code >= 0x2060 && code <= 0x2064) || (code >= 0x206a && code <= 0x206f) || (code >= 0xfe00 && code <= 0xfe0f) ||
      (code >= 0xe0100 && code <= 0xe01ef)
    ) continue;
    // inlined: mapCodePoint(code) -- full-width forms down to ASCII; spaces and the
    // MAPPED_ONTO_FORBIDDEN list to a space, which parseHost then rejects
    if (code >= 0xff01 && code <= 0xff5e) code -= 0xfee0;
    else if (
      code === 0xa0 || code === 0x1680 || code === 0x202f || code === 0x205f || code === 0x3000 ||
      (code >= 0x2000 && code <= 0x200a) ||
      (code <= 0xffff && MAPPED_ONTO_FORBIDDEN.indexOf(String.fromCharCode(code)) !== -1)
    ) code = 0x20;
    mapped += code > 0xffff
      ? String.fromCharCode(0xd800 + ((code - 0x10000) >> 10), 0xdc00 + ((code - 0x10000) & 0x3ff))
      : String.fromCharCode(code);
  }
  if (mapped === '') return FAILURE;

  // inlined: toASCII(mapped) -- lowercase, split on the IDNA separators, punycode non-ASCII labels
  const labels = mapped.toLowerCase().replace(/[.。．｡]/g, '.').split('.');
  let out = '';
  for (let l = 0; l < labels.length; l++) {
    const label = labels[l];
    if (l > 0) out += '.';
    if (!/[^\0-~]/.test(label)) {
      out += label;
      continue;
    }
    // inlined: ucs2decode(label)
    const input: number[] = [];
    for (let i = 0; i < label.length; i++) {
      const value = label.charCodeAt(i);
      if (value >= 0xd800 && value <= 0xdbff && i + 1 < label.length) {
        const extra = label.charCodeAt(i + 1);
        if ((extra & 0xfc00) === 0xdc00) {
          input.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
          i++;
          continue;
        }
      }
      input.push(value);
    }
    // inlined: encode(input) -- RFC 3492: base 36, tMin 1, tMax 26, skew 38, damp 700, bias 72, n 128
    let encoded = '';
    for (let i = 0; i < input.length; i++) {
      if (input[i] < 0x80) encoded += String.fromCharCode(input[i]);
    }
    const basicLength = encoded.length;
    let handled = basicLength;
    if (basicLength) encoded += '-';
    let n = 0x80;
    let delta = 0;
    let bias = 72;
    while (handled < input.length) {
      let m = 0x7fffffff;
      for (let i = 0; i < input.length; i++) {
        if (input[i] >= n && input[i] < m) m = input[i];
      }
      const handledPlusOne = handled + 1;
      // overflow: core-js throws a RangeError here; a host that cannot encode is a failure
      if (m - n > Math.floor((0x7fffffff - delta) / handledPlusOne)) return FAILURE;
      delta += (m - n) * handledPlusOne;
      n = m;
      for (let i = 0; i < input.length; i++) {
        const current = input[i];
        if (current < n && ++delta > 0x7fffffff) return FAILURE;
        if (current === n) {
          // delta as a generalized variable-length integer
          let q = delta;
          for (let k = 36; ; k += 36) {
            const t = k <= bias ? 1 : k >= bias + 26 ? 26 : k - bias;
            if (q < t) break;
            const qMinusT = q - t;
            const baseMinusT = 36 - t;
            // inlined: digitToBasic(digit) -- 0..25 to a..z, 26..35 to 0..9
            const digit = t + (qMinusT % baseMinusT);
            encoded += String.fromCharCode(digit + 22 + (digit < 26 ? 75 : 0));
            q = Math.floor(qMinusT / baseMinusT);
          }
          encoded += String.fromCharCode(q + 22 + (q < 26 ? 75 : 0));
          // inlined: adapt(delta, handledPlusOne, handled === basicLength)
          let d = handled === basicLength ? Math.floor(delta / 700) : delta >> 1;
          d += Math.floor(d / handledPlusOne);
          let k = 0;
          while (d > 455) {
            d = Math.floor(d / 35);
            k += 36;
          }
          bias = Math.floor(k + (36 * d) / (d + 38));
          delta = 0;
          handled++;
        }
      }
      delta++;
      n++;
    }
    out += 'xn--' + encoded;
  }
  return out;
};

const parseHost = (input: string, isOpaque: boolean): any => {
  if (input.charAt(0) === '[') {
    if (input.charAt(input.length - 1) !== ']') return FAILURE;
    return parseIPv6(input.substring(1, input.length - 1));
  }
  if (isOpaque) {
    if (/[\u0000\t\n\r #/:<>?@[\\\]^|]/.test(input)) return FAILURE;
    return percentEncode(input, SET_C0);
  }
  const asciiDomain = domainToASCII(percentDecodeUtf8(input));
  if (asciiDomain === FAILURE) return FAILURE;
  if (/[\u0000-\u0020#%/:<>?@[\\\]^|\u007f]/.test(asciiDomain)) return FAILURE;
  if (endsInANumber(asciiDomain)) return parseIPv4(asciiDomain);
  return asciiDomain;
};

/* ------------------------------------------------------------ the parser */

const isAlpha = (c: string): boolean => /^[A-Za-z]$/.test(c);
const isWindowsDriveLetter = (s: string): boolean =>
  s.length === 2 && isAlpha(s.charAt(0)) && (s.charAt(1) === ':' || s.charAt(1) === '|');
const isNormalizedWindowsDriveLetter = (s: string): boolean =>
  s.length === 2 && isAlpha(s.charAt(0)) && s.charAt(1) === ':';
const startsWithWindowsDriveLetter = (input: string, at: number): boolean => {
  if (input.length - at < 2) return false;
  if (!isWindowsDriveLetter(input.substr(at, 2))) return false;
  if (input.length - at === 2) return true;
  const third = input.charAt(at + 2);
  return third === '/' || third === '\\' || third === '?' || third === '#';
};
const isSingleDot = (s: string): boolean => s === '.' || s.toLowerCase() === '%2e';
const isDoubleDot = (s: string): boolean => {
  const l = s.toLowerCase();
  return l === '..' || l === '.%2e' || l === '%2e.' || l === '%2e%2e';
};

const shortenPath = (url: any): void => {
  const path = url.path;
  if (url.scheme === 'file' && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) return;
  path.pop();
};
const includesCredentials = (url: any): boolean => url.username !== '' || url.password !== '';
const newRecord = (): any => ({
  scheme: '', username: '', password: '', host: null, port: null, path: [], query: null, fragment: null,
});

function basicParse(input: string, base: any, url: any, stateOverride: number): any {
  if (url === null) {
    url = newRecord();
    input = input.replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, '');
  }
  input = input.replace(/[\t\n\r]/g, '');
  let state = stateOverride || SCHEME_START;
  let buffer = '';
  let atSignSeen = false, insideBrackets = false, passwordTokenSeen = false;
  const len = input.length;
  let pointer = 0;

  for (;;) {
    // '' is EOF
    const c = pointer < len ? input.charAt(pointer) : '';
    const special = isSpecialScheme(url.scheme);
    switch (state) {
      case SCHEME_START:
        if (c !== '' && isAlpha(c)) {
          buffer += c.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          pointer--;
        } else {
          return FAILURE;
        }
        break;

      case SCHEME:
        if (c !== '' && /^[A-Za-z0-9+\-.]$/.test(c)) {
          buffer += c.toLowerCase();
        } else if (c === ':') {
          if (stateOverride) {
            if (isSpecialScheme(url.scheme) !== isSpecialScheme(buffer)) return url;
            if ((includesCredentials(url) || url.port !== null) && buffer === 'file') return url;
            if (url.scheme === 'file' && url.host === '') return url;
          }
          url.scheme = buffer;
          if (stateOverride) {
            if (url.port === SPECIAL[url.scheme]) url.port = null;
            return url;
          }
          buffer = '';
          if (url.scheme === 'file') {
            state = FILE;
          } else if (isSpecialScheme(url.scheme) && base !== null && base.scheme === url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecialScheme(url.scheme)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (input.charAt(pointer + 1) === '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.path = '';
            state = OPAQUE_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = -1;
        } else {
          return FAILURE;
        }
        break;

      case NO_SCHEME:
        if (base === null || (typeof base.path === 'string' && c !== '#')) return FAILURE;
        if (typeof base.path === 'string' && c === '#') {
          url.scheme = base.scheme;
          url.path = base.path;
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else if (base.scheme !== 'file') {
          state = RELATIVE;
          pointer--;
        } else {
          state = FILE;
          pointer--;
        }
        break;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (c === '/' && input.charAt(pointer + 1) === '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          pointer--;
        }
        break;

      case PATH_OR_AUTHORITY:
        if (c === '/') {
          state = AUTHORITY;
        } else {
          state = PATH;
          pointer--;
        }
        break;

      case RELATIVE:
        url.scheme = base.scheme;
        if (c === '/' || (isSpecialScheme(url.scheme) && c === '\\')) {
          state = RELATIVE_SLASH;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          if (c === '?') {
            url.query = '';
            state = QUERY;
          } else if (c === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (c !== '') {
            url.query = null;
            shortenPath(url);
            state = PATH;
            pointer--;
          }
        }
        break;

      case RELATIVE_SLASH:
        if (special && (c === '/' || c === '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (c === '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          pointer--;
        }
        break;

      case SPECIAL_AUTHORITY_SLASHES:
        if (c === '/' && input.charAt(pointer + 1) === '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer--;
        }
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (c !== '/' && c !== '\\') {
          state = AUTHORITY;
          pointer--;
        }
        break;

      case AUTHORITY:
        if (c === '@') {
          if (atSignSeen) buffer = '%40' + buffer;
          atSignSeen = true;
          const colon = passwordTokenSeen ? -1 : buffer.indexOf(':');
          if (colon === -1) {
            if (passwordTokenSeen) url.password += percentEncode(buffer, SET_USERINFO);
            else url.username += percentEncode(buffer, SET_USERINFO);
          } else {
            passwordTokenSeen = true;
            url.username += percentEncode(buffer.substring(0, colon), SET_USERINFO);
            url.password += percentEncode(buffer.substring(colon + 1), SET_USERINFO);
          }
          buffer = '';
        } else if (c === '' || c === '/' || c === '?' || c === '#' || (special && c === '\\')) {
          if (atSignSeen && buffer === '') return FAILURE;
          pointer -= buffer.length + 1;
          buffer = '';
          state = HOST;
        } else {
          buffer += c;
        }
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme === 'file') {
          pointer--;
          state = FILE_HOST;
        } else if (c === ':' && !insideBrackets) {
          if (buffer === '') return FAILURE;
          if (stateOverride === HOSTNAME) return FAILURE;
          const host = parseHost(buffer, !special);
          if (host === FAILURE) return FAILURE;
          url.host = host;
          buffer = '';
          state = PORT;
        } else if (c === '' || c === '/' || c === '?' || c === '#' || (special && c === '\\')) {
          pointer--;
          if (special && buffer === '') return FAILURE;
          if (stateOverride && buffer === '' && (includesCredentials(url) || url.port !== null)) return FAILURE;
          const host = parseHost(buffer, !special);
          if (host === FAILURE) return FAILURE;
          url.host = host;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return url;
        } else {
          if (c === '[') insideBrackets = true;
          if (c === ']') insideBrackets = false;
          buffer += c;
        }
        break;

      case PORT:
        if (c !== '' && /^[0-9]$/.test(c)) {
          buffer += c;
        } else if (c === '' || c === '/' || c === '?' || c === '#' || (special && c === '\\') || stateOverride) {
          if (buffer !== '') {
            const port = parseInt(buffer, 10);
            if (port > 65535) return FAILURE;
            url.port = port === SPECIAL[url.scheme] ? null : port;
            buffer = '';
            if (stateOverride) return url;
          }
          if (stateOverride) return FAILURE;
          state = PATH_START;
          pointer--;
        } else {
          return FAILURE;
        }
        break;

      case FILE:
        url.scheme = 'file';
        url.host = '';
        if (c === '/' || c === '\\') {
          state = FILE_SLASH;
        } else if (base !== null && base.scheme === 'file') {
          url.host = base.host;
          url.path = base.path.slice();
          url.query = base.query;
          if (c === '?') {
            url.query = '';
            state = QUERY;
          } else if (c === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (c !== '') {
            url.query = null;
            if (!startsWithWindowsDriveLetter(input, pointer)) shortenPath(url);
            else url.path = [];
            state = PATH;
            pointer--;
          }
        } else {
          state = PATH;
          pointer--;
        }
        break;

      case FILE_SLASH:
        if (c === '/' || c === '\\') {
          state = FILE_HOST;
        } else {
          if (base !== null && base.scheme === 'file') {
            url.host = base.host;
            if (!startsWithWindowsDriveLetter(input, pointer) && base.path.length > 0 &&
                isNormalizedWindowsDriveLetter(base.path[0])) {
              url.path.push(base.path[0]);
            }
          }
          state = PATH;
          pointer--;
        }
        break;

      case FILE_HOST:
        if (c === '' || c === '/' || c === '\\' || c === '?' || c === '#') {
          pointer--;
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            // the drive letter quirk: buffer carries into the path state
            state = PATH;
          } else if (buffer === '') {
            url.host = '';
            if (stateOverride) return url;
            state = PATH_START;
          } else {
            let host = parseHost(buffer, !special);
            if (host === FAILURE) return FAILURE;
            if (host === 'localhost') host = '';
            url.host = host;
            if (stateOverride) return url;
            buffer = '';
            state = PATH_START;
          }
        } else {
          buffer += c;
        }
        break;

      case PATH_START:
        if (special) {
          state = PATH;
          if (c !== '/' && c !== '\\') pointer--;
        } else if (!stateOverride && c === '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && c === '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (c !== '') {
          state = PATH;
          if (c !== '/') pointer--;
        } else if (stateOverride && url.host === null) {
          url.path.push('');
        }
        break;

      case PATH:
        if (c === '' || c === '/' || (special && c === '\\') || (!stateOverride && (c === '?' || c === '#'))) {
          const slash = c === '/' || (special && c === '\\');
          if (isDoubleDot(buffer)) {
            shortenPath(url);
            if (!slash) url.path.push('');
          } else if (isSingleDot(buffer) && !slash) {
            url.path.push('');
          } else if (!isSingleDot(buffer)) {
            if (url.scheme === 'file' && url.path.length === 0 && isWindowsDriveLetter(buffer)) {
              buffer = buffer.charAt(0) + ':';
            }
            url.path.push(percentEncode(buffer, SET_PATH));
          }
          buffer = '';
          if (c === '?') {
            url.query = '';
            state = QUERY;
          }
          if (c === '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += c;
        }
        break;

      case OPAQUE_PATH:
        if (c === '?' || c === '#' || c === '') {
          url.path += percentEncode(buffer, SET_C0);
          buffer = '';
          if (c === '?') {
            url.query = '';
            state = QUERY;
          } else if (c === '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += c;
        }
        break;

      case QUERY:
        if ((!stateOverride && c === '#') || c === '') {
          url.query += percentEncode(buffer, special ? SET_SPECIAL_QUERY : SET_QUERY);
          buffer = '';
          if (c === '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += c;
        }
        break;

      case FRAGMENT:
        if (c !== '') {
          buffer += c;
        } else {
          url.fragment += percentEncode(buffer, SET_FRAGMENT);
        }
        break;
    }
    if (pointer >= len) break;
    pointer++;
  }
  return url;
}

const serializePath = (url: any): string => {
  if (typeof url.path === 'string') return url.path;
  let out = '';
  for (let i = 0; i < url.path.length; i++) out += '/' + url.path[i];
  return out;
};

const serialize = (url: any, excludeFragment: boolean): string => {
  let out = url.scheme + ':';
  if (url.host !== null) {
    out += '//';
    if (includesCredentials(url)) {
      out += url.username;
      if (url.password !== '') out += ':' + url.password;
      out += '@';
    }
    out += url.host;
    if (url.port !== null) out += ':' + url.port;
  }
  if (url.host === null && typeof url.path !== 'string' && url.path.length > 1 && url.path[0] === '') out += '/.';
  out += serializePath(url);
  if (url.query !== null) out += '?' + url.query;
  if (!excludeFragment && url.fragment !== null) out += '#' + url.fragment;
  return out;
};

const stripTrailingSpaces = (url: any): void => {
  if (typeof url.path !== 'string' || url.fragment !== null || url.query !== null) return;
  url.path = url.path.replace(/ +$/, '');
};

const cannotHaveCredentialsOrPort = (url: any): boolean =>
  url.host === null || url.host === '' || url.scheme === 'file';

/* ----------------------------------------------------------- the class */

// One reused descriptor per island: no allocation per construction.
const SLOT: PropertyDescriptor = { value: undefined, writable: true, enumerable: false, configurable: true };
const defineSlot = (target: any, key: string, value: any): void => {
  SLOT.value = value;
  Object.defineProperty(target, key, SLOT);
  SLOT.value = undefined; // never pin the last value
};

const recordOf = (self: any, name: string): any => {
  if (self === null || typeof self !== 'object' || !hasOwn.call(self, '_url')) {
    throw new TypeError("Failed to execute '" + name + "' on 'URL': Illegal invocation");
  }
  return self._url;
};

// Re-fill the params from the query, in place: identity is kept and a live
// iterator walks the new list. Public API, since the params may be native.
const refillParams = (self: any): void => {
  const params = self._params;
  if (params === null) return;
  const record = self._url;
  const query = record.query === null ? '' : record.query;
  if (hasOwn.call(params, '_pairs')) {
    const fresh = new ((window as any).URLSearchParams)(query)._pairs;
    params._pairs.length = 0;
    for (let i = 0; i < fresh.length; i++) params._pairs.push(fresh[i]);
  } else {
    const names: string[] = [];
    params.forEach(function (_v: string, name: string) {
      if (names.indexOf(name) === -1) names.push(name);
    });
    for (let i = 0; i < names.length; i++) params['delete'](names[i]);
    new ((window as any).URLSearchParams)(query).forEach(function (v: string, name: string) {
      params.append(name, v);
    });
  }
  self._paramsSeen = params.toString();
};

// A native URLSearchParams can't write back: pick up its changes on read.
const syncFromNativeParams = (self: any): void => {
  const params = self._params;
  if (params === null || hasOwn.call(params, '_pairs')) return;
  const now = params.toString();
  if (now === self._paramsSeen) return;
  self._paramsSeen = now;
  self._url.query = now === '' ? null : now;
  stripTrailingSpaces(self._url);
};

const parseOrThrow = (input: string, base: any): any => {
  const result = basicParse(input, base, null, 0);
  if (result === FAILURE) throw new TypeError("Failed to construct 'URL': Invalid URL");
  return result;
};

export const URLPolyfill: any = function URL(this: any, url: any) {
  if (!(this instanceof URLPolyfill)) {
    throw new TypeError("Failed to construct 'URL': Please use the 'new' operator.");
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'URL': 1 argument required, but only 0 present.");
  }
  const base = arguments.length > 1 && arguments[1] !== undefined ? parseOrThrow(toUSV(arguments[1]), null) : null;
  defineSlot(this, '_url', parseOrThrow(toUSV(url), base));
  // made on first searchParams read
  defineSlot(this, '_params', null);
  defineSlot(this, '_paramsSeen', '');
};

const UP = URLPolyfill.prototype;
const accessor = (name: string, get: (this: any) => any, set?: (this: any, value: any) => void): void => {
  try {
    Object.defineProperty(get, 'name', { value: 'get ' + name, configurable: true });
    if (set) Object.defineProperty(set, 'name', { value: 'set ' + name, configurable: true });
  } catch (e) { /* Function#name non-configurable pre-ES6 */ }
  Object.defineProperty(UP, name, { get: get, set: set, enumerable: true, configurable: true });
};

accessor('href', function (this: any) {
  const record = recordOf(this, 'href');
  syncFromNativeParams(this);
  return serialize(record, false);
}, function (this: any, value: any) {
  recordOf(this, 'href');
  const parsed = basicParse(toUSV(value), null, null, 0);
  if (parsed === FAILURE) throw new TypeError("Failed to set the 'href' property on 'URL': Invalid URL");
  this._url = parsed;
  if (this._params !== null && hasOwn.call(this._params, '_pairs')) this._params._url = parsed;
  refillParams(this);
});

accessor('origin', function (this: any) {
  const record = recordOf(this, 'origin');
  if (record.scheme === 'blob' && typeof record.path === 'string') {
    const inner = basicParse(record.path, null, null, 0);
    if (inner !== FAILURE && (inner.scheme === 'http' || inner.scheme === 'https')) {
      return inner.scheme + '://' + inner.host + (inner.port !== null ? ':' + inner.port : '');
    }
    return 'null';
  }
  if (!isSpecialScheme(record.scheme) || record.scheme === 'file') return 'null';
  return record.scheme + '://' + record.host + (record.port !== null ? ':' + record.port : '');
});

accessor('protocol', function (this: any) {
  return recordOf(this, 'protocol').scheme + ':';
}, function (this: any, value: any) {
  basicParse(toUSV(value) + ':', null, recordOf(this, 'protocol'), SCHEME_START);
});

accessor('username', function (this: any) {
  return recordOf(this, 'username').username;
}, function (this: any, value: any) {
  const record = recordOf(this, 'username');
  if (cannotHaveCredentialsOrPort(record)) return;
  record.username = percentEncode(toUSV(value), SET_USERINFO);
});

accessor('password', function (this: any) {
  return recordOf(this, 'password').password;
}, function (this: any, value: any) {
  const record = recordOf(this, 'password');
  if (cannotHaveCredentialsOrPort(record)) return;
  record.password = percentEncode(toUSV(value), SET_USERINFO);
});

accessor('host', function (this: any) {
  const record = recordOf(this, 'host');
  if (record.host === null) return '';
  return record.port === null ? record.host : record.host + ':' + record.port;
}, function (this: any, value: any) {
  const record = recordOf(this, 'host');
  if (typeof record.path === 'string') return;
  basicParse(toUSV(value), null, record, HOST);
});

accessor('hostname', function (this: any) {
  const record = recordOf(this, 'hostname');
  return record.host === null ? '' : record.host;
}, function (this: any, value: any) {
  const record = recordOf(this, 'hostname');
  if (typeof record.path === 'string') return;
  basicParse(toUSV(value), null, record, HOSTNAME);
});

accessor('port', function (this: any) {
  const record = recordOf(this, 'port');
  return record.port === null ? '' : String(record.port);
}, function (this: any, value: any) {
  const record = recordOf(this, 'port');
  if (cannotHaveCredentialsOrPort(record)) return;
  const input = toUSV(value);
  if (input === '') record.port = null;
  else basicParse(input, null, record, PORT);
});

accessor('pathname', function (this: any) {
  return serializePath(recordOf(this, 'pathname'));
}, function (this: any, value: any) {
  const record = recordOf(this, 'pathname');
  if (typeof record.path === 'string') return;
  record.path = [];
  basicParse(toUSV(value), null, record, PATH_START);
});

accessor('search', function (this: any) {
  const record = recordOf(this, 'search');
  syncFromNativeParams(this);
  return record.query === null || record.query === '' ? '' : '?' + record.query;
}, function (this: any, value: any) {
  const record = recordOf(this, 'search');
  let input = toUSV(value);
  if (input === '') {
    record.query = null;
    stripTrailingSpaces(record);
  } else {
    if (input.charAt(0) === '?') input = input.substring(1);
    record.query = '';
    basicParse(input, null, record, QUERY);
  }
  refillParams(this);
});

accessor('searchParams', function (this: any) {
  const record = recordOf(this, 'searchParams');
  if (this._params === null) {
    const params = new ((window as any).URLSearchParams)(record.query === null ? '' : record.query);
    if (hasOwn.call(params, '_pairs')) defineSlot(params, '_url', record);
    this._params = params;
    this._paramsSeen = params.toString();
  }
  return this._params;
});

accessor('hash', function (this: any) {
  const record = recordOf(this, 'hash');
  return record.fragment === null || record.fragment === '' ? '' : '#' + record.fragment;
}, function (this: any, value: any) {
  const record = recordOf(this, 'hash');
  let input = toUSV(value);
  if (input === '') {
    record.fragment = null;
    stripTrailingSpaces(record);
    return;
  }
  if (input.charAt(0) === '#') input = input.substring(1);
  record.fragment = '';
  basicParse(input, null, record, FRAGMENT);
});

const hrefOf = function (this: any): string {
  recordOf(this, 'toString');
  syncFromNativeParams(this);
  return serialize(this._url, false);
};
Object.defineProperty(UP, 'toString', { value: hrefOf, writable: true, enumerable: true, configurable: true });
const toJSON = function toJSON(this: any): string {
  recordOf(this, 'toJSON');
  syncFromNativeParams(this);
  return serialize(this._url, false);
};
Object.defineProperty(UP, 'toJSON', { value: toJSON, writable: true, enumerable: true, configurable: true });
try {
  Object.defineProperty(hrefOf, 'name', { value: 'toString', configurable: true });
} catch (e) { /* Function#name non-configurable pre-ES6 */ }
Object.defineProperty(URLPolyfill, 'prototype', { writable: false });
if (typeof Symbol !== 'undefined' && (Symbol as any).toStringTag) {
  Object.defineProperty(UP, (Symbol as any).toStringTag, { value: 'URL', writable: false, enumerable: false, configurable: true });
}

const canParse = function canParse(url: any): boolean {
  if (arguments.length < 1) throw new TypeError("Failed to execute 'canParse' on 'URL': 1 argument required, but only 0 present.");
  let base: any = null;
  if (arguments.length > 1 && arguments[1] !== undefined) {
    base = basicParse(toUSV(arguments[1]), null, null, 0);
    if (base === FAILURE) return false;
  }
  return basicParse(toUSV(url), base, null, 0) !== FAILURE;
};
const parse = function parse(url: any): any {
  if (arguments.length < 1) throw new TypeError("Failed to execute 'parse' on 'URL': 1 argument required, but only 0 present.");
  try {
    return arguments.length > 1 ? new URLPolyfill(url, arguments[1]) : new URLPolyfill(url);
  } catch (e) {
    return null;
  }
};
Object.defineProperty(URLPolyfill, 'canParse', { value: canParse, writable: true, enumerable: true, configurable: true });
Object.defineProperty(URLPolyfill, 'parse', { value: parse, writable: true, enumerable: true, configurable: true });

// install-once guard: applyURLPolyfill may be called more than once
let alreadyInstalled = false;

export const applyURLPolyfill = (): void => {
  if (alreadyInstalled) return;
  alreadyInstalled = true;

  if (typeof window === 'undefined') return;

  // Delegate the object-URL statics straight to native (blob URLs can't be faked)
  const nativeURL = (window as any).URL || (window as any).webkitURL || null;
  if (nativeURL) {
    if (nativeURL.createObjectURL) {
      URLPolyfill.createObjectURL = function (blob: any) { return nativeURL.createObjectURL(blob); };
    }
    if (nativeURL.revokeObjectURL) {
      URLPolyfill.revokeObjectURL = function (url: string) { return nativeURL.revokeObjectURL(url); };
    }
  }

  define((window as any), 'URL', URLPolyfill);

  // Polyfill window.location.origin if missing
  if (typeof window.location !== 'undefined' && !('origin' in window.location)) {
    const getOrigin = () =>
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '');
    try {
      Object.defineProperty(window.location, 'origin', {
        get: getOrigin,
        enumerable: true,
      });
    } catch {
      // If defineProperty fails (IE), set directly — static snapshot, not live
      (window.location as any).origin = getOrigin();
    }
  }
};

export const install = (): void => {
  applyURLPolyfill();
};
