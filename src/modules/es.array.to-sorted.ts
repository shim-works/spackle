export const isSupported = (): boolean => {
  try {
    return typeof Array.prototype.toSorted === 'function';
  } catch {
    return false;
  }
};

/**
 * Spec: https://tc39.es/ecma262/#sec-array.prototype.tosorted
 * Inspired by: es-shims array.prototype.tosorted (lean ES5 rewrite)
 */

// Bottom-up merge sort, inlined: stable (V8's sort wasn't until Chrome 70), one
// aux buffer, no recursion.
// One descriptor for CreateDataPropertyOrThrow, reused by every call; value is
// cleared after each run so it never pins an element.
const dataDesc: PropertyDescriptor = { value: undefined, writable: true, enumerable: true, configurable: true };
// CreateDataPropertyOrThrow, the fast way when it is the same thing: on an array
// this call created, with nothing at that index up the prototype chain, a plain
// write cannot hit a setter or a read-only slot. Anything else (a @@species or
// `this` constructor's object, an index defined on Array.prototype) goes through
// defineProperty, as the spec requires. core-js always pays for defineProperty.
const ArrayProto = Array.prototype;

// Bottom-up merge sort, inlined: stable (V8's sort wasn't until Chrome 70), one
// aux buffer, no recursion. The lists are null-prototype objects: they are
// spec-internal, so no write may reach a setter on Array/Object.prototype.
// Returns whichever buffer holds the result.
const stableSort = (items: any, length: number, compareFn: any): any => {
  if (length < 2) {
    return items;
  }
  let source = items;
  let target: any = Object.create(null);
  for (let width = 1; width < length; width *= 2) {
    for (let start = 0; start < length; start += width * 2) {
      let left = start;
      const middle = start + width < length ? start + width : length;
      let right = middle;
      const end = start + width * 2 < length ? start + width * 2 : length;
      let out = start;
      while (left < middle && right < end) {
        // `<= 0` keeps equal items in first-seen order
        // inlined: SortCompare(compareFn, a, b) -- undefineds sort last, unseen by the comparator
        const a = source[left];
        const b = source[right];
        let order: number;
        if (a === undefined) {
          order = b === undefined ? 0 : 1;
        } else if (b === undefined) {
          order = -1;
        } else if (compareFn) {
          order = +compareFn(a, b) || 0; // +x, not Number(x)
        } else {
          // inlined: defaultCompare(a, b)
          const sa = String(a);
          const sb = String(b);
          order = sa < sb ? -1 : sa > sb ? 1 : 0;
        }
        if (order <= 0) {
          target[out++] = source[left++];
        } else {
          target[out++] = source[right++];
        }
      }
      while (left < middle) {
        target[out++] = source[left++];
      }
      while (right < end) {
        target[out++] = source[right++];
      }
    }
    const swap = source;
    source = target;
    target = swap;
  }
  return source;
};

// Declared (comparefn) for the spec length of 1.
export const arrayToSorted = function toSorted(this: any, comparefn?: any): any[] {
  if (comparefn !== undefined && typeof comparefn !== 'function') {
    throw new TypeError('The comparison function must be either a function or undefined');
  }
  if (this === null || this === undefined) {
    throw new TypeError('Array.prototype.toSorted called on null or undefined');
  }
  // box it so strings / array-likes behave like real arrays
  const object = Object(this);
  // inlined: toLength(object.length)
  let length = +object.length;
  length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
  // ArrayCreate(len) first: RangeError past 2^32-1 before anything is read
  const result: any[] = new Array(length);
  // read every index once, holes as undefined, into an internal list
  let items: any = Object.create(null);
  for (let i = 0; i < length; i++) {
    items[i] = object[i];
  }
  items = stableSort(items, length, comparefn);
  for (let i = 0; i < length; i++) {
    if (!(i in ArrayProto)) result[i] = items[i];
    else {
      dataDesc.value = items[i];
      Object.defineProperty(result, i, dataDesc);
    }
  }
  dataDesc.value = undefined;
  return result;
};
