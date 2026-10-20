// ids: es.regexp.constructor, es.regexp.exec, es.regexp.sticky

// RegExp sticky — behavioral: Chrome <49 / Safari <10 throw SyntaxError on the
// 'y' flag, so we construct one and check it actually anchors at lastIndex.
export const isSupported = (): boolean => {
  try {
    const regex = new RegExp('a', 'y');
    if (regex.sticky !== true) {
      return false;
    }
    // anchored search: lastIndex 1 sits on '_', so a sticky exec must miss
    regex.lastIndex = 1;
    return regex.exec('a_a') === null;
  } catch {
    return false;
  }
};

export const isRegExpStickySupported = isSupported;

/**
 * Spec: https://tc39.es/ecma262/#sec-regexp-constructor
 *
 * Known limitations:
 * - [incomplete] sticky ('y') is emulated: the instance carries a hidden
 *   global-flagged searcher and a per-instance exec/test that anchor at
 *   lastIndex. Prototype-level exec called via .call on the instance won't anchor.
 * - [incomplete] unicode ('u') is not emulated: the flag is stripped with a
 *   one-time warn; BMP behaviour is unchanged, astral classes stay broken.
 * - [scope] legacy RegExp statics ($1, lastMatch, ...) are not proxied onto
 *   the wrapper.
 */

const NativeRegExp = RegExp;

// what the host engine actually supports, probed once
let supportsSticky = true;
try {
  new NativeRegExp('a', 'y');
} catch {
  supportsSticky = false;
}
let supportsUnicode = true;
try {
  new NativeRegExp('a', 'u');
} catch {
  supportsUnicode = false;
}

let warnedUnicode = false;

// The own `flags` stamp shadows the prototype getter, so it must be in spec
// order (d g i m s u v y): new RegExp('a', 'ym').flags is 'my'.
const SPEC_FLAG_ORDER = 'dgimsuvy';

// per-instance sticky emulation: a shadow searcher with 'g' does the actual
// matching so we can read/write lastIndex and reject non-anchored hits
const makeStickyInstance = (source: string, flags: string): any => {
  const bareFlags = flags.replace('y', '');
  const searcherFlags = bareFlags.indexOf('g') === -1 ? bareFlags + 'g' : bareFlags;
  // `|()` as a last resort: when the pattern fails AT lastIndex, the empty
  // group matches right there, so a miss never scans (or allocates a match for)
  // the rest of the input. The group is last, so user group numbers are intact.
  const searcher = new NativeRegExp('(?:' + source + ')|()', searcherFlags);
  const instance: any = new NativeRegExp(source, bareFlags);
  instance.lastIndex = 0;
  // surface the flags the caller asked for, not the stripped set -- in spec
  // order, since an own property answers ahead of the prototype's getter
  try {
    Object.defineProperty(instance, 'sticky', { value: true });
    // inlined: inSpecOrder(flags)
    let ordered = '';
    for (let i = 0; i < SPEC_FLAG_ORDER.length; i++) {
      if (flags.indexOf(SPEC_FLAG_ORDER.charAt(i)) !== -1) ordered += SPEC_FLAG_ORDER.charAt(i);
    }
    Object.defineProperty(instance, 'flags', { value: ordered });
  } catch {
    /* older engines without accessor override — exec still anchors */
  }
  instance.exec = function (input: any): any {
    const str = String(input);
    searcher.lastIndex = this.lastIndex;
    const match = searcher.exec(str);
    // sticky means the match must start exactly at lastIndex; the trailing
    // empty group being set means only the `|()` fallback matched -- a miss
    if (match && match.index === this.lastIndex && match[match.length - 1] === undefined) {
      match.length = match.length - 1;
      this.lastIndex = searcher.lastIndex;
      return match;
    }
    this.lastIndex = 0;
    return null;
  };
  instance.test = function (input: any): boolean {
    return this.exec(input) !== null;
  };
  return instance;
};

export const RegExpPolyfill = function (this: any, pattern?: any, flags?: any): any {
  // copy-construct forms: new RegExp(/x/g) and new RegExp(/x/, 'i')
  if (pattern instanceof NativeRegExp) {
    if (flags === undefined) {
      flags =
        (pattern as any).flags !== undefined
          ? (pattern as any).flags
          : (pattern.global ? 'g' : '') +
          (pattern.ignoreCase ? 'i' : '') +
          (pattern.multiline ? 'm' : '');
    }
    pattern = pattern.source;
  }
  const source = pattern === undefined ? '' : String(pattern);
  let flagString = flags === undefined ? '' : String(flags);
  if (!supportsUnicode && flagString.indexOf('u') !== -1) {
    if (!warnedUnicode) {
      warnedUnicode = true;
      console.warn(
        '[spackle] RegExp: the u flag is not emulated on this engine — stripping it; astral character classes will misbehave'
      );
    }
    flagString = flagString.replace('u', '');
  }
  if (!supportsSticky && flagString.indexOf('y') !== -1) {
    return makeStickyInstance(source, flagString);
  }
  return new NativeRegExp(source, flagString);
};

// instances are genuine native regexes, so instanceof keeps working
RegExpPolyfill.prototype = NativeRegExp.prototype;

