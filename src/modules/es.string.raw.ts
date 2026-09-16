// Ported from: the prior implementation (string-raw.ts)

// No dedicated probe in the prior implementation — existence-only, matching how
// load-language.ts gates this feature inline.
export const isSupported = (): boolean => {
  try {
    return typeof String.raw === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-string.raw
 */
export const stringRaw = function (template: any): string {
  if (template === null || template === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const raw = Object(template).raw;
  if (raw === null || raw === undefined) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const segmentCount = raw.length >>> 0;
  if (segmentCount === 0) {
    return '';
  }

  // walk the string chunks; after each one (except the last) drop in the
  // matching substitution, if the caller supplied one
  let result = '';
  const substitutionCount = arguments.length - 1;
  for (let i = 0; i < segmentCount; i++) {
    result += String(raw[i]);
    if (i + 1 === segmentCount) {
      break; // last chunk has no substitution after it
    }
    if (i < substitutionCount) {
      result += String(arguments[i + 1]);
    }
  }
  return result;
};

if (!isSupported()) {
  Object.defineProperty(String, 'raw', { value: stringRaw as any, writable: true, enumerable: false, configurable: true });
  Object.defineProperty(String.raw, 'name', { value: 'raw', configurable: true });
  Object.defineProperty((String.raw as any), '__polyfilled', { value: true });
}
