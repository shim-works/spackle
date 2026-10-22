/**
 * The install run, in order. Each island exports a pure implementation and its
 * isSupported() probe; the gate always lives here. No try/catch: define() and
 * defineGetter() swallow a locked-down owner themselves.
 */
// Symbol self-installs on import, first: other islands read Symbol.iterator and
// friends as property keys at module scope, before installPolyfills() runs.
import { applySymbolKeyFilters } from './modules/es.symbol.js';

import { define } from './define.js';

// Installed first in the function body: other islands use these constructors.
import { isSupported as isObjectToStringSupported, install as installObjectToString } from './modules/es.object.to-string.js';
import { isSupported as isAggregateErrorSupported, install as installAggregateError } from './modules/es.aggregate-error.js';
import { install as installMap } from './modules/es.map.js';
import { install as installSet } from './modules/es.set.js';
import { install as installWeakMap } from './modules/es.weak-map.js';
import { isSupported as isPromiseSupported, install as installPromise } from './modules/es.promise.js';
import { installDisposable } from './modules/install-disposable.js';
import { isSupported as isUrlSearchParamsSupported, install as installUrlSearchParams } from './modules/web.url-search-params.js';
import { isSupported as isUrlSupported, install as installUrl } from './modules/web.url.js';

import { isSupported as isErrorCauseSupported, install as installErrorCause } from './modules/es.error.cause.js';
import { isSupported as isErrorIsErrorSupported, errorIsError } from './modules/es.error.is-error.js';
import { isSupported as isErrorToStringSupported, errorToString } from './modules/es.error.to-string.js';
import { isSupported as isMapGetOrInsertSupported, mapGetOrInsert } from './modules/es.map.get-or-insert.js';
import { isSupported as isMapGetOrInsertComputedSupported, mapGetOrInsertComputed } from './modules/es.map.get-or-insert-computed.js';
import { isSupported as isMapGroupBySupported, mapGroupBy } from './modules/es.map.group-by.js';
import { isSupported as isWeakMapGetOrInsertSupported, weakMapGetOrInsert } from './modules/es.weak-map.get-or-insert.js';
import { isSupported as isWeakMapGetOrInsertComputedSupported, weakMapGetOrInsertComputed } from './modules/es.weak-map.get-or-insert-computed.js';
import { isSupported as isWeakSetSupported, WeakSet } from './modules/es.weak-set.js';
import { isSupported as isFunctionHasInstanceSupported, install as installFunctionHasInstance } from './modules/es.function.has-instance.js';
import { isSupported as isGlobalThisSupported, install as installGlobalThis } from './modules/es.global-this.js';
import { isSupported as isObjectAssignSupported, objectAssign } from './modules/es.object.assign.js';
import { isSupported as isObjectDefineGetterSupported, objectDefineGetter } from './modules/es.object.define-getter.js';
import { isSupported as isObjectDefineSetterSupported, objectDefineSetter } from './modules/es.object.define-setter.js';
import { isSupported as isObjectEntriesSupported, objectEntries } from './modules/es.object.entries.js';
import { isSupported as isObjectFreezeSupported, objectFreeze } from './modules/es.object.freeze.js';
import { isSupported as isObjectFromEntriesSupported, objectFromEntries } from './modules/es.object.from-entries.js';
import { isSupported as isObjectGetOwnPropertyDescriptorSupported, objectGetOwnPropertyDescriptor } from './modules/es.object.get-own-property-descriptor.js';
import { isSupported as isObjectGetOwnPropertyDescriptorsSupported, objectGetOwnPropertyDescriptors } from './modules/es.object.get-own-property-descriptors.js';
import { isSupported as isObjectGetOwnPropertyNamesSupported, objectGetOwnPropertyNames } from './modules/es.object.get-own-property-names.js';
import { isSupported as isObjectGetPrototypeOfSupported, objectGetPrototypeOf } from './modules/es.object.get-prototype-of.js';
import { isSupported as isObjectGroupBySupported, objectGroupBy } from './modules/es.object.group-by.js';
import { isSupported as isObjectHasOwnSupported, objectHasOwn } from './modules/es.object.has-own.js';
import { isSupported as isObjectIsSupported, objectIs } from './modules/es.object.is.js';
import { isSupported as isObjectIsExtensibleSupported, objectIsExtensible } from './modules/es.object.is-extensible.js';
import { isSupported as isObjectIsFrozenSupported, objectIsFrozen } from './modules/es.object.is-frozen.js';
import { isSupported as isObjectIsSealedSupported, objectIsSealed } from './modules/es.object.is-sealed.js';
import { isSupported as isObjectKeysSupported, objectKeys } from './modules/es.object.keys.js';
import { isSupported as isObjectLookupGetterSupported, objectLookupGetter } from './modules/es.object.lookup-getter.js';
import { isSupported as isObjectLookupSetterSupported, objectLookupSetter } from './modules/es.object.lookup-setter.js';
import { isSupported as isObjectPreventExtensionsSupported, objectPreventExtensions } from './modules/es.object.prevent-extensions.js';
import { isSupported as isObjectSealSupported, objectSeal } from './modules/es.object.seal.js';
import { isSupported as isObjectSetPrototypeOfSupported, objectSetPrototypeOf } from './modules/es.object.set-prototype-of.js';
import { isSupported as isObjectValuesSupported, objectValues } from './modules/es.object.values.js';
import { isSupported as isReflectToStringTagSupported, install as installReflectToStringTag } from './modules/es.reflect.to-string-tag.js';
import { isSupported as isArrayAtSupported, arrayAt } from './modules/es.array.at.js';
import { isSupported as isArrayConcatSupported, arrayConcat } from './modules/es.array.concat.js';
import { isSupported as isArrayCopyWithinSupported, arrayCopyWithin } from './modules/es.array.copy-within.js';
import { isSupported as isArrayEverySupported, arrayEvery } from './modules/es.array.every.js';
import { isSupported as isArrayFillSupported, arrayFill } from './modules/es.array.fill.js';
import { isSupported as isArrayFilterSupported, arrayFilter } from './modules/es.array.filter.js';
import { isSupported as isArrayFindSupported, arrayFind } from './modules/es.array.find.js';
import { isSupported as isArrayFindIndexSupported, arrayFindIndex } from './modules/es.array.find-index.js';
import { isSupported as isArrayFindLastSupported, arrayFindLast } from './modules/es.array.find-last.js';
import { isSupported as isArrayFindLastIndexSupported, arrayFindLastIndex } from './modules/es.array.find-last-index.js';
import { isSupported as isArrayFlatSupported, arrayFlat } from './modules/es.array.flat.js';
import { isSupported as isArrayFlatMapSupported, arrayFlatMap } from './modules/es.array.flat-map.js';
import { isSupported as isArrayForEachSupported, arrayForEach } from './modules/es.array.for-each.js';
import { isSupported as isArrayFromSupported, arrayFrom } from './modules/es.array.from.js';
import { isSupported as isArrayFromAsyncSupported, arrayFromAsync } from './modules/es.array.from-async.js';
import { isSupported as isArrayIncludesSupported, arrayIncludes } from './modules/es.array.includes.js';
import { isSupported as isArrayIndexOfSupported, arrayIndexOf } from './modules/es.array.index-of.js';
import { install as installArrayIterator } from './modules/es.array.iterator.js';
import { isSupported as isArrayJoinSupported, arrayJoin } from './modules/es.array.join.js';
import { isSupported as isArrayLastIndexOfSupported, arrayLastIndexOf } from './modules/es.array.last-index-of.js';
import { isSupported as isArrayMapSupported, arrayMap } from './modules/es.array.map.js';
import { isSupported as isArrayOfSupported, arrayOf } from './modules/es.array.of.js';
import { isSupported as isArrayPushSupported, arrayPush } from './modules/es.array.push.js';
import { isSupported as isArrayReduceSupported, arrayReduce } from './modules/es.array.reduce.js';
import { isSupported as isArrayReduceRightSupported, arrayReduceRight } from './modules/es.array.reduce-right.js';
import { isSupported as isArrayReverseSupported, arrayReverse } from './modules/es.array.reverse.js';
import { isSupported as isArraySliceSupported, arraySlice } from './modules/es.array.slice.js';
import { isSupported as isArraySomeSupported, arraySome } from './modules/es.array.some.js';
import { isSupported as isArraySortSupported, arraySort } from './modules/es.array.sort.js';
import { isSupported as isArraySpeciesSupported, install as installArraySpecies } from './modules/es.array.species.js';
import { isSupported as isArraySpliceSupported, arraySplice } from './modules/es.array.splice.js';
import { isSupported as isArrayToReversedSupported, arrayToReversed } from './modules/es.array.to-reversed.js';
import { isSupported as isArrayToSortedSupported, arrayToSorted } from './modules/es.array.to-sorted.js';
import { isSupported as isArrayToSplicedSupported, arrayToSpliced } from './modules/es.array.to-spliced.js';
import { isSupported as isArrayUnscopablesFlatSupported, install as installArrayUnscopablesFlat } from './modules/es.array.unscopables.flat.js';
import { isSupported as isArrayUnscopablesFlatMapSupported, install as installArrayUnscopablesFlatMap } from './modules/es.array.unscopables.flat-map.js';
import { isSupported as isArrayUnshiftSupported, arrayUnshift } from './modules/es.array.unshift.js';
import { isSupported as isArrayWithSupported, arrayWith } from './modules/es.array.with.js';
import { isSupported as isRegexpConstructorSupported, install as installRegexpConstructor } from './modules/es.regexp.constructor.js';
import { isSupported as isRegexpDotAllSupported, install as installRegexpDotAll } from './modules/es.regexp.dot-all.js';
import { isSupported as isRegexpEscapeSupported, regExpEscape } from './modules/es.regexp.escape.js';
import { isSupported as isRegexpFlagsSupported, install as installRegexpFlags } from './modules/es.regexp.flags.js';
import { isSupported as isRegexpTestSupported, regexpTest } from './modules/es.regexp.test.js';
import { isSupported as isRegexpToStringSupported, regExpToString } from './modules/es.regexp.to-string.js';
import { isSupported as isStringAtAlternativeSupported, stringAt } from './modules/es.string.at-alternative.js';
import { isSupported as isStringCodePointAtSupported, stringCodePointAt } from './modules/es.string.code-point-at.js';
import { isSupported as isStringEndsWithSupported, stringEndsWith } from './modules/es.string.ends-with.js';
import { isSupported as isStringFromCodePointSupported, stringFromCodePoint } from './modules/es.string.from-code-point.js';
import { isSupported as isStringIncludesSupported, stringIncludes } from './modules/es.string.includes.js';
import { isSupported as isStringIsWellFormedSupported, stringIsWellFormed } from './modules/es.string.is-well-formed.js';
import { isSupported as isStringMatchSupported, stringMatch } from './modules/es.string.match.js';
import { isSupported as isStringMatchAllSupported, install as installStringMatchAll } from './modules/es.string.match-all.js';
import { isSupported as isStringPadEndSupported, stringPadEnd } from './modules/es.string.pad-end.js';
import { isSupported as isStringPadStartSupported, stringPadStart } from './modules/es.string.pad-start.js';
import { isSupported as isStringRawSupported, stringRaw } from './modules/es.string.raw.js';
import { isSupported as isStringRepeatSupported, stringRepeat } from './modules/es.string.repeat.js';
import { isSupported as isStringReplaceSupported, stringReplace } from './modules/es.string.replace.js';
import { isSupported as isStringReplaceAllSupported, stringReplaceAll } from './modules/es.string.replace-all.js';
import { isSupported as isStringSearchSupported, stringSearch } from './modules/es.string.search.js';
import { isSupported as isStringSplitSupported, stringSplit } from './modules/es.string.split.js';
import { isSupported as isStringStartsWithSupported, stringStartsWith } from './modules/es.string.starts-with.js';
import { isSupported as isStringToWellFormedSupported, stringToWellFormed } from './modules/es.string.to-well-formed.js';
import { isSupported as isStringTrimSupported, stringTrim } from './modules/es.string.trim.js';
import { isSupported as isStringTrimEndSupported, stringTrimEnd } from './modules/es.string.trim-end.js';
import { isSupported as isStringTrimStartSupported, stringTrimStart } from './modules/es.string.trim-start.js';
import { isSupported as isArrayBufferDetachedSupported, install as installArrayBufferDetached } from './modules/es.array-buffer.detached.js';
import { isSupported as isArrayBufferTransferSupported, install as installArrayBufferTransfer } from './modules/es.array-buffer.transfer.js';
import { isSupported as isArrayBufferImplSupported, installArrayBuffer } from './modules/install-array-buffer.js';
import { isSupported as isFloat16ImplSupported, installFloat16 } from './modules/install-float16.js';
import { installTypedArray } from './modules/install-typed-array.js';
import { isSupported as isUint8ArrayImplSupported, installUint8Array } from './modules/install-uint8-array.js';
import { isSupported as isDateToIsoStringSupported, dateToISOString } from './modules/es.date.to-iso-string.js';
import { isSupported as isDateToJsonSupported, dateToJSON } from './modules/es.date.to-json.js';
import { isSupported as isDateToPrimitiveSupported, install as installDateToPrimitive } from './modules/es.date.to-primitive.js';
import { isSupported as isJsonToStringTagSupported, install as installJsonToStringTag } from './modules/es.json.to-string-tag.js';
import { isSupported as isMathAcoshSupported, mathAcosh } from './modules/es.math.acosh.js';
import { isSupported as isMathAsinhSupported, mathAsinh } from './modules/es.math.asinh.js';
import { isSupported as isMathAtanhSupported, mathAtanh } from './modules/es.math.atanh.js';
import { isSupported as isMathCbrtSupported, mathCbrt } from './modules/es.math.cbrt.js';
import { isSupported as isMathClz32Supported, mathClz32 } from './modules/es.math.clz32.js';
import { isSupported as isMathCoshSupported, mathCosh } from './modules/es.math.cosh.js';
import { isSupported as isMathExpm1Supported, mathExpm1 } from './modules/es.math.expm1.js';
import { isSupported as isMathFroundSupported, mathFround } from './modules/es.math.fround.js';
import { isSupported as isMathHypotSupported, mathHypot } from './modules/es.math.hypot.js';
import { isSupported as isMathImulSupported, mathImul } from './modules/es.math.imul.js';
import { isSupported as isMathLog10Supported, mathLog10 } from './modules/es.math.log10.js';
import { isSupported as isMathLog1pSupported, mathLog1p } from './modules/es.math.log1p.js';
import { isSupported as isMathLog2Supported, mathLog2 } from './modules/es.math.log2.js';
import { isSupported as isMathSignSupported, mathSign } from './modules/es.math.sign.js';
import { isSupported as isMathSinhSupported, mathSinh } from './modules/es.math.sinh.js';
import { isSupported as isMathSumPreciseSupported, mathSumPrecise } from './modules/es.math.sum-precise.js';
import { isSupported as isMathTanhSupported, mathTanh } from './modules/es.math.tanh.js';
import { isSupported as isMathToStringTagSupported, install as installMathToStringTag } from './modules/es.math.to-string-tag.js';
import { isSupported as isMathTruncSupported, mathTrunc } from './modules/es.math.trunc.js';
import { isSupported as isNumberConstructorSupported, install as installNumberConstructor } from './modules/es.number.constructor.js';
import { isSupported as isNumberEpsilonSupported, install as installNumberEpsilon } from './modules/es.number.epsilon.js';
import { isSupported as isNumberIsFiniteSupported, numberIsFinite } from './modules/es.number.is-finite.js';
import { isSupported as isNumberIsIntegerSupported, numberIsInteger } from './modules/es.number.is-integer.js';
import { isSupported as isNumberIsNanSupported, numberIsNaN } from './modules/es.number.is-nan.js';
import { isSupported as isNumberIsSafeIntegerSupported, numberIsSafeInteger } from './modules/es.number.is-safe-integer.js';
import { isSupported as isNumberMaxSafeIntegerSupported, install as installNumberMaxSafeInteger } from './modules/es.number.max-safe-integer.js';
import { isSupported as isNumberMinSafeIntegerSupported, install as installNumberMinSafeInteger } from './modules/es.number.min-safe-integer.js';
import { isSupported as isNumberParseFloatSupported, numberParseFloat } from './modules/es.number.parse-float.js';
import { isSupported as isNumberParseIntSupported, numberParseInt } from './modules/es.number.parse-int.js';
import { isSupported as isNumberToExponentialSupported, numberToExponential } from './modules/es.number.to-exponential.js';
import { isSupported as isNumberToFixedSupported, numberToFixed } from './modules/es.number.to-fixed.js';
import { isSupported as isNumberToPrecisionSupported, numberToPrecision } from './modules/es.number.to-precision.js';
import { isSupported as isParseFloatSupported, numberParseFloat as globalParseFloat } from './modules/es.parse-float.js';
import { isSupported as isParseIntSupported, numberParseInt as globalParseInt } from './modules/es.parse-int.js';
import { installIterator } from './modules/install-iterator.js';
import { isSupported as isPromiseAllSettledSupported, promiseAllSettled } from './modules/es.promise.all-settled.js';
import { isSupported as isPromiseAnySupported, promiseAny } from './modules/es.promise.any.js';
import { isSupported as isPromiseFinallySupported, promiseFinally } from './modules/es.promise.finally.js';
import { isSupported as isPromiseTrySupported, promiseTry } from './modules/es.promise.try.js';
import { isSupported as isPromiseWithResolversSupported, promiseWithResolvers } from './modules/es.promise.with-resolvers.js';
import { isSupported as isDomExceptionImplSupported, installDomException } from './modules/install-dom-exception.js';
import { isSupported as isSetImmediateImplSupported, installSetImmediate } from './modules/install-set-immediate.js';
import { isSupported as isAtobSupported, atobPolyfill } from './modules/web.atob.js';
import { isSupported as isQueueMicrotaskSupported, queueMicrotask } from './modules/web.queue-microtask.js';
import { isSupported as isSelfSupported, install as installSelf } from './modules/web.self.js';
import { isSupported as isStructuredCloneSupported, structuredClone } from './modules/web.structured-clone.js';
import { isSupported as isUrlSearchParamsDeleteSupported, install as installUrlSearchParamsDelete } from './modules/web.url-search-params.delete.js';
import { isSupported as isUrlSearchParamsHasSupported, install as installUrlSearchParamsHas } from './modules/web.url-search-params.has.js';
import { isSupported as isUrlSearchParamsSizeSupported, install as installUrlSearchParamsSize } from './modules/web.url-search-params.size.js';
import { isSupported as isUrlCanParseSupported, urlCanParse } from './modules/web.url.can-parse.js';
import { isSupported as isUrlParseSupported, urlParse } from './modules/web.url.parse.js';
import { isSupported as isUrlToJsonSupported, urlToJSON } from './modules/web.url.to-json.js';
import { isSupported as isReflectImplSupported, installReflect } from './modules/install-reflect.js';
import { installSetMethods } from './modules/install-set-methods.js';
import { isSupported as isStringIteratorSupported, install as installStringIterator } from './modules/es.string.iterator.js';
import { install as installDomCollectionsForEach } from './modules/web.dom-collections.for-each.js';
import { install as installDomCollectionsIterator } from './modules/web.dom-collections.iterator.js';

export const installPolyfills = (): void => {
  // Symbol is already in (see the import at the top). These go first because
  // other islands use the constructors at install time: es.weak-set nests on
  // WeakMap, install-set-methods reads Set, es.promise.any constructs an
  // AggregateError, web.url parses with URLSearchParams.
  if (!isObjectToStringSupported()) installObjectToString();
  if (!isAggregateErrorSupported()) installAggregateError();
  // Gated inside: replaces an unfit native, else patches its -0 handling.
  installMap();
  installSet();
  // Ungated: es.weak-map has a SUPPORTED branch too -- a native WeakMap that
  // rejects symbol keys still needs patching, and gating here would skip it.
  installWeakMap();
  // queueMicrotask before Promise: the Promise island schedules its jobs through
  // it, so both share one FIFO queue.
  if (!isQueueMicrotaskSupported()) define(window, 'queueMicrotask', queueMicrotask);
  if (!isPromiseSupported()) installPromise();
  installDisposable();
  if (!isUrlSearchParamsSupported()) installUrlSearchParams();
  if (!isUrlSupported()) installUrl();

  // Errors. es.promise.any constructs an AggregateError.
  if (!isErrorCauseSupported()) installErrorCause();
  if (!isErrorIsErrorSupported()) define(Error, 'isError', errorIsError);
  if (!isErrorToStringSupported()) define(Error.prototype, 'toString', errorToString);

  // Collections. es.weak-set nests on WeakMap, so WeakMap leads.
  installSetMethods();
  if (typeof Map !== 'undefined' && Map.prototype && !isMapGetOrInsertSupported()) define(Map.prototype, 'getOrInsert', mapGetOrInsert);
  if (typeof Map !== 'undefined' && Map.prototype && !isMapGetOrInsertComputedSupported()) define(Map.prototype, 'getOrInsertComputed', mapGetOrInsertComputed);
  if (typeof Map !== 'undefined' && !isMapGroupBySupported()) define(Map, 'groupBy', mapGroupBy);
  if (typeof WeakMap !== 'undefined' && WeakMap.prototype && !isWeakMapGetOrInsertSupported()) define(WeakMap.prototype, 'getOrInsert', weakMapGetOrInsert);
  if (typeof WeakMap !== 'undefined' && WeakMap.prototype && !isWeakMapGetOrInsertComputedSupported()) define(WeakMap.prototype, 'getOrInsertComputed', weakMapGetOrInsertComputed);
  if (!isWeakSetSupported()) define(window, 'WeakSet', WeakSet);

  // Object, Reflect, Function, globalThis.
  if (!isFunctionHasInstanceSupported()) installFunctionHasInstance();
  if (!isGlobalThisSupported()) installGlobalThis();
  if (!isObjectAssignSupported()) define(Object, 'assign', objectAssign);
  if (!isObjectDefineGetterSupported()) define(Object.prototype, '__defineGetter__', objectDefineGetter);
  if (!isObjectDefineSetterSupported()) define(Object.prototype, '__defineSetter__', objectDefineSetter);
  if (!isObjectEntriesSupported()) define(Object, 'entries', objectEntries);
  if (!isObjectFreezeSupported()) define(Object, 'freeze', objectFreeze);
  if (!isObjectFromEntriesSupported()) define(Object, 'fromEntries', objectFromEntries);
  if (!isObjectGetOwnPropertyDescriptorSupported()) define(Object, 'getOwnPropertyDescriptor', objectGetOwnPropertyDescriptor);
  if (!isObjectGetOwnPropertyDescriptorsSupported()) define(Object, 'getOwnPropertyDescriptors', objectGetOwnPropertyDescriptors);
  if (!isObjectGetOwnPropertyNamesSupported()) define(Object, 'getOwnPropertyNames', objectGetOwnPropertyNames);
  if (!isObjectGetPrototypeOfSupported()) define(Object, 'getPrototypeOf', objectGetPrototypeOf);
  if (!isObjectGroupBySupported()) define(Object, 'groupBy', objectGroupBy);
  if (!isObjectHasOwnSupported()) define(Object, 'hasOwn', objectHasOwn);
  if (!isObjectIsSupported()) define(Object, 'is', objectIs);
  if (!isObjectIsExtensibleSupported()) define(Object, 'isExtensible', objectIsExtensible);
  if (!isObjectIsFrozenSupported()) define(Object, 'isFrozen', objectIsFrozen);
  if (!isObjectIsSealedSupported()) define(Object, 'isSealed', objectIsSealed);
  if (!isObjectKeysSupported()) define(Object, 'keys', objectKeys);
  if (!isObjectLookupGetterSupported()) define(Object.prototype, '__lookupGetter__', objectLookupGetter);
  if (!isObjectLookupSetterSupported()) define(Object.prototype, '__lookupSetter__', objectLookupSetter);
  if (!isObjectPreventExtensionsSupported()) define(Object, 'preventExtensions', objectPreventExtensions);
  if (!isObjectSealSupported()) define(Object, 'seal', objectSeal);
  if (!isObjectSetPrototypeOfSupported()) define(Object, 'setPrototypeOf', objectSetPrototypeOf);
  if (!isObjectValuesSupported()) define(Object, 'values', objectValues);
  // Reflect itself BEFORE its @@toStringTag: the tagger can only tag a Reflect
  // that exists, and on an engine without a native one that is this line's job.
  // Not define(): that names the value, and the Reflect namespace has no `name`.
  if (!isReflectImplSupported()) installReflect();
  if (!isReflectToStringTagSupported()) installReflectToStringTag();

  // Array.
  if (!isArrayAtSupported()) define(Array.prototype, 'at', arrayAt);
  if (!isArrayConcatSupported()) define(Array.prototype, 'concat', arrayConcat);
  if (!isArrayCopyWithinSupported()) define(Array.prototype, 'copyWithin', arrayCopyWithin);
  if (!isArrayEverySupported()) define(Array.prototype, 'every', arrayEvery);
  if (!isArrayFillSupported()) define(Array.prototype, 'fill', arrayFill);
  if (!isArrayFilterSupported()) define(Array.prototype, 'filter', arrayFilter);
  if (!isArrayFindSupported()) define(Array.prototype, 'find', arrayFind);
  if (!isArrayFindIndexSupported()) define(Array.prototype, 'findIndex', arrayFindIndex);
  if (!isArrayFindLastSupported()) define(Array.prototype, 'findLast', arrayFindLast);
  if (!isArrayFindLastIndexSupported()) define(Array.prototype, 'findLastIndex', arrayFindLastIndex);
  if (!isArrayFlatSupported()) define(Array.prototype, 'flat', arrayFlat);
  if (!isArrayFlatMapSupported()) define(Array.prototype, 'flatMap', arrayFlatMap);
  if (!isArrayForEachSupported()) define(Array.prototype, 'forEach', arrayForEach);
  if (!isArrayFromSupported()) define(Array, 'from', arrayFrom);
  if (!isArrayFromAsyncSupported()) define(Array, 'fromAsync', arrayFromAsync);
  if (!isArrayIncludesSupported()) define(Array.prototype, 'includes', arrayIncludes);
  if (!isArrayIndexOfSupported()) define(Array.prototype, 'indexOf', arrayIndexOf);
  installArrayIterator();
  if (!isArrayJoinSupported()) define(Array.prototype, 'join', arrayJoin);
  if (!isArrayLastIndexOfSupported()) define(Array.prototype, 'lastIndexOf', arrayLastIndexOf);
  if (!isArrayMapSupported()) define(Array.prototype, 'map', arrayMap);
  if (!isArrayOfSupported()) define(Array, 'of', arrayOf);
  if (!isArrayPushSupported()) define(Array.prototype, 'push', arrayPush);
  if (!isArrayReduceSupported()) define(Array.prototype, 'reduce', arrayReduce);
  if (!isArrayReduceRightSupported()) define(Array.prototype, 'reduceRight', arrayReduceRight);
  if (!isArrayReverseSupported()) define(Array.prototype, 'reverse', arrayReverse);
  if (!isArraySliceSupported()) define(Array.prototype, 'slice', arraySlice);
  if (!isArraySomeSupported()) define(Array.prototype, 'some', arraySome);
  if (!isArraySortSupported()) define(Array.prototype, 'sort', arraySort);
  // After map and filter: their gates read the native Array[@@species], not this getter.
  if (!isArraySpeciesSupported()) installArraySpecies();
  if (!isArraySpliceSupported()) define(Array.prototype, 'splice', arraySplice);
  if (!isArrayToReversedSupported()) define(Array.prototype, 'toReversed', arrayToReversed);
  if (!isArrayToSortedSupported()) define(Array.prototype, 'toSorted', arrayToSorted);
  if (!isArrayToSplicedSupported()) define(Array.prototype, 'toSpliced', arrayToSpliced);
  if (!isArrayUnscopablesFlatSupported()) installArrayUnscopablesFlat();
  if (!isArrayUnscopablesFlatMapSupported()) installArrayUnscopablesFlatMap();
  if (!isArrayUnshiftSupported()) define(Array.prototype, 'unshift', arrayUnshift);
  if (!isArrayWithSupported()) define(Array.prototype, 'with', arrayWith);

  // String and RegExp.
  if (!isStringIteratorSupported()) installStringIterator();
  if (!isRegexpConstructorSupported()) installRegexpConstructor();
  if (!isRegexpDotAllSupported()) installRegexpDotAll();
  if (!isRegexpEscapeSupported()) define(RegExp, 'escape', regExpEscape);
  if (!isRegexpFlagsSupported()) installRegexpFlags();
  if (!isRegexpTestSupported()) define(RegExp.prototype, 'test', regexpTest);
  if (!isRegexpToStringSupported()) define(RegExp.prototype, 'toString', regExpToString);
  if (!isStringAtAlternativeSupported()) define(String.prototype, 'at', stringAt);
  if (!isStringCodePointAtSupported()) define(String.prototype, 'codePointAt', stringCodePointAt);
  if (!isStringEndsWithSupported()) define(String.prototype, 'endsWith', stringEndsWith);
  if (!isStringFromCodePointSupported()) define(String, 'fromCodePoint', stringFromCodePoint);
  if (!isStringIncludesSupported()) define(String.prototype, 'includes', stringIncludes);
  if (!isStringIsWellFormedSupported()) define(String.prototype, 'isWellFormed', stringIsWellFormed);
  if (!isStringMatchSupported()) define(String.prototype, 'match', stringMatch);
  if (!isStringMatchAllSupported()) installStringMatchAll();
  if (!isStringPadEndSupported()) define(String.prototype, 'padEnd', stringPadEnd);
  if (!isStringPadStartSupported()) define(String.prototype, 'padStart', stringPadStart);
  if (!isStringRawSupported()) define(String, 'raw', stringRaw);
  if (!isStringRepeatSupported()) define(String.prototype, 'repeat', stringRepeat);
  if (!isStringReplaceSupported()) define(String.prototype, 'replace', stringReplace);
  if (!isStringReplaceAllSupported()) define(String.prototype, 'replaceAll', stringReplaceAll);
  if (!isStringSearchSupported()) define(String.prototype, 'search', stringSearch);
  if (!isStringSplitSupported()) define(String.prototype, 'split', stringSplit);
  if (!isStringStartsWithSupported()) define(String.prototype, 'startsWith', stringStartsWith);
  if (!isStringToWellFormedSupported()) define(String.prototype, 'toWellFormed', stringToWellFormed);
  if (!isStringTrimSupported()) define(String.prototype, 'trim', stringTrim);
  if (!isStringTrimEndSupported()) define(String.prototype, 'trimEnd', stringTrimEnd);
  if (!isStringTrimStartSupported()) define(String.prototype, 'trimStart', stringTrimStart);

  // Binary: ArrayBuffer, DataView, typed arrays.
  if (!isArrayBufferDetachedSupported()) installArrayBufferDetached();
  if (!isArrayBufferTransferSupported()) installArrayBufferTransfer();
  if (!isArrayBufferImplSupported()) installArrayBuffer();
  if (!isFloat16ImplSupported()) installFloat16();
  installTypedArray();
  if (!isUint8ArrayImplSupported()) installUint8Array();

  // Number, Math, Date, JSON, parsing.
  if (!isDateToIsoStringSupported()) define(Date.prototype, 'toISOString', dateToISOString);
  if (!isDateToJsonSupported()) define(Date.prototype, 'toJSON', dateToJSON);
  if (!isDateToPrimitiveSupported()) installDateToPrimitive();
  if (!isJsonToStringTagSupported()) installJsonToStringTag();
  if (!isMathAcoshSupported()) define(Math, 'acosh', mathAcosh);
  if (!isMathAsinhSupported()) define(Math, 'asinh', mathAsinh);
  if (!isMathAtanhSupported()) define(Math, 'atanh', mathAtanh);
  if (!isMathCbrtSupported()) define(Math, 'cbrt', mathCbrt);
  if (!isMathClz32Supported()) define(Math, 'clz32', mathClz32);
  if (!isMathCoshSupported()) define(Math, 'cosh', mathCosh);
  if (!isMathExpm1Supported()) define(Math, 'expm1', mathExpm1);
  if (!isMathFroundSupported()) define(Math, 'fround', mathFround);
  if (!isMathHypotSupported()) define(Math, 'hypot', mathHypot);
  if (!isMathImulSupported()) define(Math, 'imul', mathImul);
  if (!isMathLog10Supported()) define(Math, 'log10', mathLog10);
  if (!isMathLog1pSupported()) define(Math, 'log1p', mathLog1p);
  if (!isMathLog2Supported()) define(Math, 'log2', mathLog2);
  if (!isMathSignSupported()) define(Math, 'sign', mathSign);
  if (!isMathSinhSupported()) define(Math, 'sinh', mathSinh);
  if (!isMathSumPreciseSupported()) define(Math, 'sumPrecise', mathSumPrecise);
  if (!isMathTanhSupported()) define(Math, 'tanh', mathTanh);
  if (!isMathToStringTagSupported()) installMathToStringTag();
  if (!isMathTruncSupported()) define(Math, 'trunc', mathTrunc);
  if (!isNumberConstructorSupported()) installNumberConstructor();
  if (!isNumberEpsilonSupported()) installNumberEpsilon();
  if (!isNumberIsFiniteSupported()) define(Number, 'isFinite', numberIsFinite);
  if (!isNumberIsIntegerSupported()) define(Number, 'isInteger', numberIsInteger);
  if (!isNumberIsNanSupported()) define(Number, 'isNaN', numberIsNaN);
  if (!isNumberIsSafeIntegerSupported()) define(Number, 'isSafeInteger', numberIsSafeInteger);
  if (!isNumberMaxSafeIntegerSupported()) installNumberMaxSafeInteger();
  if (!isNumberMinSafeIntegerSupported()) installNumberMinSafeInteger();
  if (!isNumberParseFloatSupported()) define(Number, 'parseFloat', numberParseFloat);
  if (!isNumberParseIntSupported()) define(Number, 'parseInt', numberParseInt);
  if (!isNumberToExponentialSupported()) define(Number.prototype, 'toExponential', numberToExponential);
  if (!isNumberToFixedSupported()) define(Number.prototype, 'toFixed', numberToFixed);
  if (!isNumberToPrecisionSupported()) define(Number.prototype, 'toPrecision', numberToPrecision);
  if (!isParseFloatSupported()) define(window, 'parseFloat', globalParseFloat);
  if (!isParseIntSupported()) define(window, 'parseInt', globalParseInt);

  // Promise's per-method islands: generic over the constructor, so they patch a
  // kept native and spackle's Promise alike.
  if (typeof Promise !== 'undefined' && !isPromiseAllSettledSupported()) define(Promise, 'allSettled', promiseAllSettled);
  if (typeof Promise !== 'undefined' && !isPromiseAnySupported()) define(Promise, 'any', promiseAny);
  if (typeof Promise !== 'undefined' && !isPromiseFinallySupported()) define(Promise.prototype, 'finally', promiseFinally);
  if (typeof Promise !== 'undefined' && !isPromiseTrySupported()) define(Promise, 'try', promiseTry);
  if (typeof Promise !== 'undefined' && !isPromiseWithResolversSupported()) define(Promise, 'withResolvers', promiseWithResolvers);

  // Explicit resource management.

  // Web platform.
  installDomCollectionsForEach();
  installDomCollectionsIterator();

  // Iterator helpers, last of the iterator family: they sample a live iterator
  // from every source to find the prototypes to splice.
  installIterator();
  if (!isDomExceptionImplSupported()) installDomException();
  if (!isSetImmediateImplSupported()) installSetImmediate();
  if (typeof window !== 'undefined' && !isAtobSupported()) define(window, 'atob', atobPolyfill);
  if (!isSelfSupported()) installSelf();
  if (!isStructuredCloneSupported()) define(window, 'structuredClone', structuredClone);
  if (!isUrlSearchParamsDeleteSupported()) installUrlSearchParamsDelete();
  if (!isUrlSearchParamsHasSupported()) installUrlSearchParamsHas();
  if (!isUrlSearchParamsSizeSupported()) installUrlSearchParamsSize();
  if (typeof URL !== 'undefined' && !isUrlCanParseSupported()) define(URL, 'canParse', urlCanParse);
  if (typeof URL !== 'undefined' && !isUrlParseSupported()) define(URL, 'parse', urlParse);
  if (typeof URL !== 'undefined' && URL.prototype && !isUrlToJsonSupported()) define(URL.prototype, 'toJSON', urlToJSON);

  // Everything else.

  // Last: the '@@' key filters must wrap the final Object.keys / assign / entries /
  // values / JSON.stringify, or later installs leak the keys back.
  try { applySymbolKeyFilters(); } catch (e) { /* frozen or sealed target: skip it, keep installing */ }
};
