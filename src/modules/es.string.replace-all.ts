// String.prototype.replaceAll: existence-only (no half-broken native in range).
export const isSupported = (): boolean => {
  try {
    return typeof String.prototype.replaceAll === 'function';
  } catch {
    return false;
  }
};

/** Spec: https://tc39.es/ecma262/#sec-string.prototype.replaceall */

// Expand $ patterns for a STRING-search replacement (no capture groups exist).
const substitute = (
  replacementString: string,
  matched: string,
  position: number,
  source: string,
): string => {
  if (replacementString.indexOf('$') === -1) {
    return replacementString; // fast path — the common case, no allocation/scan
  }
  let result = '';
  for (let i = 0; i < replacementString.length; i++) {
    const character = replacementString.charAt(i);
    const nextCharacter =
      i + 1 < replacementString.length ? replacementString.charAt(i + 1) : '';
    if (character === '$' && nextCharacter !== '') {
      if (nextCharacter === '$') {
        result += '$';
        i++;
        continue;
      }
      if (nextCharacter === '&') {
        result += matched;
        i++;
        continue;
      }
      if (nextCharacter === '`') {
        result += source.substring(0, position);
        i++;
        continue;
      }
      if (nextCharacter === "'") {
        result += source.substring(position + matched.length);
        i++;
        continue;
      }
    }
    result += character;
  }
  return result;
};

const objectToString = Object.prototype.toString;

export const stringReplaceAll = function replaceAll(this: any, searchValue: any, replaceValue: any): string {
  // RequireObjectCoercible(this); ToString(this) only after the searchValue checks
  if (this === null || this === undefined) {
    throw new TypeError('String.prototype.replaceAll called on null or undefined');
  }
  const replaceKey = typeof Symbol !== 'undefined' ? (Symbol as any).replace : undefined;
  if (searchValue !== null && searchValue !== undefined) {
    // inlined: IsRegExp(searchValue)
    let isRegExpValue = false;
    if (typeof searchValue === 'object' || typeof searchValue === 'function') {
      const matchKey = typeof Symbol !== 'undefined' ? (Symbol as any).match : undefined;
      const matcher = matchKey ? searchValue[matchKey] : undefined;
      isRegExpValue = matcher !== undefined ? !!matcher : objectToString.call(searchValue) === '[object RegExp]';
    }
    if (isRegExpValue) {
      const flags = searchValue.flags;
      if (flags === null || flags === undefined) {
        throw new TypeError('replaceAll called with a RegExp whose flags are null or undefined');
      }
      // inlined: toStr(flags) -- String(symbol) returns "Symbol(...)"; the spec throws
      if (typeof flags === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      if ((typeof flags === 'string' ? flags : String(flags)).indexOf('g') === -1) {
        throw new TypeError('replaceAll must be called with a global RegExp');
      }
    }
    // GetMethod(searchValue, @@replace): delegate before converting anything
    const replacer = replaceKey ? searchValue[replaceKey] : undefined;
    if (replacer !== undefined && replacer !== null) {
      if (typeof replacer !== 'function') throw new TypeError('replaceAll: @@replace is not a function');
      return replacer.call(searchValue, this, replaceValue);
    }
    // Engines with no @@replace on RegExp.prototype: a real RegExp still has to
    // replace as a RegExp, so hand it to the native replace. Not when the key is
    // there but undefined (shadowed on purpose): the spec then searches for the
    // RegExp's string form, as core-js does with its own @@replace installed.
    if (
      objectToString.call(searchValue) === '[object RegExp]' &&
      !(replaceKey && replaceKey in searchValue) &&
      !(replaceKey && typeof (RegExp.prototype as any)[replaceKey] === 'function')
    ) {
      // inlined: toStr(this)
      if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      return String.prototype.replace.call(typeof this === 'string' ? this : String(this), searchValue, replaceValue);
    }
  }

  // inlined: toStr(this), toStr(searchValue), toStr(replaceValue)
  if (typeof this === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const source: string = typeof this === 'string' ? this : String(this);
  if (typeof searchValue === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const searchString: string = typeof searchValue === 'string' ? searchValue : String(searchValue);
  const isFunction = typeof replaceValue === 'function';
  if (!isFunction && typeof replaceValue === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  const replacementString: string = isFunction ? '' : typeof replaceValue === 'string' ? replaceValue : String(replaceValue);
  // inlined: substitute()'s fast path -- no '$' means every match is replaced verbatim
  const hasDollar = replacementString.indexOf('$') !== -1;

  // weird edge the spec demands: an empty search string "matches" in the gap
  // before every character AND at the very end
  if (searchString === '') {
    let result: any;
    if (isFunction) {
      // inlined: toStr(replaceValue('', 0, source))
      result = replaceValue('', 0, source);
      if (typeof result === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      if (typeof result !== 'string') result = String(result);
    } else result = hasDollar ? substitute(replacementString, '', 0, source) : replacementString;
    for (let i = 0; i < source.length; i++) {
      let replacement: any;
      if (isFunction) {
        // inlined: toStr(replaceValue('', i + 1, source))
        replacement = replaceValue('', i + 1, source);
        if (typeof replacement === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
        if (typeof replacement !== 'string') replacement = String(replacement);
      } else replacement = hasDollar ? substitute(replacementString, '', i + 1, source) : replacementString;
      result += source.charAt(i) + replacement;
    }
    return result;
  }

  let result = '';
  let position = 0;
  let index = source.indexOf(searchString, position);
  while (index !== -1) {
    let replacement: any;
    if (isFunction) {
      // inlined: toStr(replaceValue(searchString, index, source))
      replacement = replaceValue(searchString, index, source);
      if (typeof replacement === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
      if (typeof replacement !== 'string') replacement = String(replacement);
    } else replacement = hasDollar ? substitute(replacementString, searchString, index, source) : replacementString;
    result += source.substring(position, index) + replacement;
    position = index + searchString.length;
    index = source.indexOf(searchString, position);
  }
  result += source.substring(position);
  return result;
};
