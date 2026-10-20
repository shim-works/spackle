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

export const stringReplaceAll = function (
  this: string,
  searchValue: any,
  replaceValue: any,
): string {
  // RegExp search must be global; delegate to native replace (handles global
  // replace-all plus function/$ replacers correctly).
  if (searchValue instanceof RegExp) {
    if (!searchValue.global) {
      throw new TypeError('replaceAll must be called with a global RegExp');
    }
    return this.replace(searchValue, replaceValue);
  }

  const source = typeof this === 'string' ? this : String(this); // String() is a call Chrome 41 won't inline; skip it on the primitive path
  const searchString = String(searchValue);
  const isFunction = typeof replaceValue === 'function';
  const replacementString = isFunction ? '' : String(replaceValue);
  // inlined: substitute()'s fast path -- no '$' means every match is replaced verbatim
  const hasDollar = replacementString.indexOf('$') !== -1;

  // weird edge the spec demands: an empty search string "matches" in the gap
  // before every character AND at the very end
  if (searchString === '') {
    let result = isFunction
      ? String(replaceValue('', 0, source))
      : hasDollar ? substitute(replacementString, '', 0, source) : replacementString;
    for (let i = 0; i < source.length; i++) {
      const replacement = isFunction
        ? String(replaceValue('', i + 1, source))
        : hasDollar ? substitute(replacementString, '', i + 1, source) : replacementString;
      result += source.charAt(i) + replacement;
    }
    return result;
  }

  let result = '';
  let position = 0;
  let index = source.indexOf(searchString, position);
  while (index !== -1) {
    const replacement = isFunction
      ? String(replaceValue(searchString, index, source))
      : hasDollar ? substitute(replacementString, searchString, index, source) : replacementString;
    result += source.substring(position, index) + replacement;
    position = index + searchString.length;
    index = source.indexOf(searchString, position);
  }
  result += source.substring(position);
  return result;
};

