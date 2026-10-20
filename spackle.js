"use strict";
var spackle = function() {
    // src/define.ts
    var mark = function mark(fn) {
        try {
            Object.defineProperty(fn, "__polyfilled", {
                value: true
            });
        } catch (e) {}
    };
    var define = function define(owner, key, value, name) {
        try {
            Object.defineProperty(owner, key, {
                value: value,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(value, "name", {
                    value: name === void 0 ? key : name,
                    configurable: true
                });
            } catch (e) {}
            mark(value);
        } catch (e) {}
    };
    var defineGetter = function defineGetter(owner, key, getter, name) {
        try {
            mark(getter);
            try {
                Object.defineProperty(getter, "name", {
                    value: name === void 0 ? "get " + key : name,
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(owner, key, {
                configurable: true,
                enumerable: false,
                get: getter
            });
        } catch (e) {}
    };
    // src/modules/es.symbol.ts
    var isSupported = function isSupported() {
        try {
            if (typeof Symbol !== "function") {
                return false;
            }
            var testSymbol = /* @__PURE__ */ Symbol("test");
            if (typeof testSymbol !== "symbol") {
                return false;
            }
            if (typeof Symbol.iterator !== "symbol") {
                return false;
            }
            var testSymbol1 = /* @__PURE__ */ Symbol("key");
            var testSymbol2 = /* @__PURE__ */ Symbol("key");
            if (testSymbol1 === testSymbol2) {
                return false;
            }
            if (typeof Symbol.for !== "function") {
                return false;
            }
            if (/* @__PURE__ */ Symbol.for("registry") !== /* @__PURE__ */ Symbol.for("registry")) {
                return false;
            }
            return true;
        } catch (unused) {
            return false;
        }
    };
    var defineProperty = Object.defineProperty;
    var symbolCounter = 0;
    var hideSymbolKeys = function hideSymbolKeys() {
        var replace = function replace(owner, key, value) {
            defineProperty(value, "__polyfilled", {
                value: true
            });
            owner[key] = value;
        };
        var nativeKeys2 = Object.keys;
        replace(Object, "keys", function(target) {
            var keys = nativeKeys2(target);
            var firstHit = -1;
            for(var i = 0; i < keys.length; i++){
                var key = keys[i];
                if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
                    firstHit = i;
                    break;
                }
            }
            if (firstHit === -1) return keys;
            var out = [];
            for(var before = 0; before < firstHit; before++)out[out.length] = keys[before];
            for(var after = firstHit + 1; after < keys.length; after++){
                var key1 = keys[after];
                if (!(key1.charCodeAt(0) === 64 && key1.charCodeAt(1) === 64)) out[out.length] = key1;
            }
            return out;
        });
        var nativeNames = Object.getOwnPropertyNames;
        if (typeof nativeNames === "function") {
            replace(Object, "getOwnPropertyNames", function(target) {
                var keys = nativeNames(target);
                var firstHit = -1;
                for(var i = 0; i < keys.length; i++){
                    var key = keys[i];
                    if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
                        firstHit = i;
                        break;
                    }
                }
                if (firstHit === -1) return keys;
                var out = [];
                for(var before = 0; before < firstHit; before++)out[out.length] = keys[before];
                for(var after = firstHit + 1; after < keys.length; after++){
                    var key1 = keys[after];
                    if (!(key1.charCodeAt(0) === 64 && key1.charCodeAt(1) === 64)) out[out.length] = key1;
                }
                return out;
            });
        }
        var nativeEntries = Object.entries;
        if (typeof nativeEntries === "function") {
            replace(Object, "entries", function(target) {
                var pairs = nativeEntries(target);
                var hit = -1;
                for(var i = 0; i < pairs.length; i++){
                    var key = pairs[i][0];
                    if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
                        hit = i;
                        break;
                    }
                }
                if (hit === -1) return pairs;
                var out = [];
                for(var before = 0; before < hit; before++)out[out.length] = pairs[before];
                for(var after = hit + 1; after < pairs.length; after++){
                    var key1 = pairs[after][0];
                    if (!(key1.charCodeAt(0) === 64 && key1.charCodeAt(1) === 64)) out[out.length] = pairs[after];
                }
                return out;
            });
        }
        var nativeValues = Object.values;
        if (typeof nativeValues === "function") {
            replace(Object, "values", function(target) {
                var keys = nativeKeys2(target);
                var hasSymbolKey = false;
                for(var scan = 0; scan < keys.length; scan++){
                    var key = keys[scan];
                    if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) {
                        hasSymbolKey = true;
                        break;
                    }
                }
                if (!hasSymbolKey) return nativeValues(target);
                var out = [];
                for(var i = 0; i < keys.length; i++){
                    var key1 = keys[i];
                    if (!(key1.charCodeAt(0) === 64 && key1.charCodeAt(1) === 64)) out[out.length] = target[key1];
                }
                return out;
            });
        }
        var nativeAssign = Object.assign;
        if (typeof nativeAssign === "function") {
            var copyingAssign = function copyingAssign(target) {
                if (target === null || target === void 0) {
                    throw new TypeError("Cannot convert undefined or null to object");
                }
                var to = Object(target);
                for(var i = 1; i < arguments.length; i++){
                    var source = arguments[i];
                    if (source === null || source === void 0) continue;
                    var keys = nativeKeys2(Object(source));
                    for(var k = 0; k < keys.length; k++){
                        to[keys[k]] = source[keys[k]];
                    }
                }
                return to;
            };
            replace(Object, "assign", copyingAssign);
        }
        if (typeof JSON !== "undefined" && typeof JSON.stringify === "function") {
            var nativeStringify = JSON.stringify;
            replace(JSON, "stringify", function(value, replacer, space) {
                if (Object.prototype.toString.call(replacer) === "[object Array]") {
                    return nativeStringify(value, replacer, space);
                }
                return nativeStringify(value, function(key, val) {
                    if (key.charCodeAt(0) === 64 && key.charCodeAt(1) === 64) return void 0;
                    return typeof replacer === "function" ? replacer.call(this, key, val) : val;
                }, space);
            });
        }
    };
    var symbolProto = {};
    defineProperty(symbolProto, "toString", {
        value: function value() {
            return this.__name__;
        }
    });
    defineProperty(symbolProto, "valueOf", {
        value: function value() {
            return this;
        }
    });
    defineProperty(symbolProto, "description", {
        configurable: true,
        get: function get() {
            return this.__description__;
        }
    });
    var SLOT = {
        value: void 0
    };
    var SymbolPolyfill = function Symbol2(description) {
        if (this instanceof SymbolPolyfill) {
            throw new TypeError("Symbol is not a constructor");
        }
        var symbol = Object.create(symbolProto);
        var desc = description === void 0 ? "" : String(description);
        SLOT.value = desc;
        defineProperty(symbol, "__description__", SLOT);
        SLOT.value = "@@" + desc + "_" + ++symbolCounter;
        defineProperty(symbol, "__name__", SLOT);
        SLOT.value = void 0;
        return symbol;
    };
    var wellKnown = [
        "hasInstance",
        "isConcatSpreadable",
        "iterator",
        "asyncIterator",
        "match",
        "matchAll",
        "replace",
        "search",
        "species",
        "split",
        "toPrimitive",
        "toStringTag",
        "unscopables",
        "dispose",
        "asyncDispose"
    ];
    for(var i = 0; i < wellKnown.length; i++){
        defineProperty(SymbolPolyfill, wellKnown[i], {
            value: SymbolPolyfill(wellKnown[i])
        });
    }
    var registry = /* @__PURE__ */ Object.create(null);
    defineProperty(SymbolPolyfill, "for", {
        value: function value(key) {
            var k = String(key);
            if (registry[k]) {
                return registry[k];
            }
            registry[k] = SymbolPolyfill(k);
            return registry[k];
        }
    });
    defineProperty(SymbolPolyfill, "keyFor", {
        value: function value(symbol) {
            for(var key in registry){
                if (registry[key] === symbol) {
                    return key;
                }
            }
            return void 0;
        }
    });
    var installSymbolPolyfill = function installSymbolPolyfill() {
        window.Symbol = null;
        delete window.Symbol;
        define(window, "Symbol", SymbolPolyfill);
    };
    var installSymbolExtensionsOnNative = function installSymbolExtensionsOnNative() {
        var NativeSymbol = window.Symbol;
        for(var i = 0; i < wellKnown.length; i++){
            var key = wellKnown[i];
            if (typeof NativeSymbol[key] !== "undefined") {
                continue;
            }
            try {
                defineProperty(NativeSymbol, key, {
                    value: NativeSymbol("Symbol." + key)
                });
            } catch (e) {}
        }
    };
    var install = function install() {
        if (!isSupported()) installSymbolPolyfill();
        else installSymbolExtensionsOnNative();
        installDescription();
    };
    var symbolDescription = function symbolDescription() {
        var text = Symbol.prototype.toString.call(this);
        return text.slice(7, text.length - 1);
    };
    var installDescription = function installDescription() {
        try {
            if (typeof Symbol === "undefined" || (/* @__PURE__ */ Symbol("probe")).description === "probe") {
                return;
            }
        } catch (e) {
            return;
        }
        try {
            defineProperty(symbolDescription, "__polyfilled", {
                value: true
            });
            defineProperty(Symbol.prototype, "description", {
                configurable: true,
                enumerable: false,
                get: symbolDescription
            });
        } catch (e) {}
    };
    var applySymbolKeyFilters = function applySymbolKeyFilters() {
        try {
            var live = window.Symbol;
            if (typeof live === "function" && live.__polyfilled === true) {
                hideSymbolKeys();
            }
        } catch (e) {}
    };
    try {
        install();
    } catch (e) {}
    // src/modules/es.object.to-string.ts
    var isSupported2 = function isSupported2() {
        try {
            var tagKey5 = typeof Symbol !== "undefined" ? Symbol.toStringTag : void 0;
            if (!tagKey5) {
                return true;
            }
            var probe = {};
            probe[tagKey5] = "SpackleProbe";
            return Object.prototype.toString.call(probe) === "[object SpackleProbe]";
        } catch (unused) {
            return true;
        }
    };
    var nativeToString = Object.prototype.toString;
    var objectToString = function objectToString() {
        if (this === null) {
            return "[object Null]";
        }
        if (this === void 0) {
            return "[object Undefined]";
        }
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            var tag;
            try {
                tag = this[Symbol.toStringTag];
            } catch (unused) {
                tag = void 0;
            }
            if (typeof tag === "string") {
                return "[object " + tag + "]";
            }
        }
        return nativeToString.call(this);
    };
    var install2 = function install2() {
        define(Object.prototype, "toString", objectToString);
    };
    try {
        if (!isSupported2()) {
            install2();
        }
    } catch (e) {}
    // src/modules/es.aggregate-error.ts
    var isSupported3 = function isSupported3() {
        try {
            var AggregateError5 = window.AggregateError;
            return typeof AggregateError5 === "function";
        } catch (unused) {
            return false;
        }
    };
    var drainErrors = function drainErrors(errors) {
        if (errors == null) {
            throw new TypeError("AggregateError requires an iterable of errors");
        }
        var out = [];
        if (typeof Symbol !== "undefined" && Symbol.iterator && typeof errors[Symbol.iterator] === "function") {
            var it = errors[Symbol.iterator]();
            var step = it.next();
            while(!step.done){
                out.push(step.value);
                step = it.next();
            }
            return out;
        }
        if (typeof errors.length === "number") {
            for(var i = 0; i < errors.length; i++){
                out.push(errors[i]);
            }
            return out;
        }
        throw new TypeError("AggregateError argument is not iterable");
    };
    var HIDDEN = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var AggregateError2 = function AggregateError3(errors, message, options) {
        var self = this instanceof AggregateError3 ? this : Object.create(AggregateError3.prototype);
        if (message !== void 0) {
            HIDDEN.value = String(message);
            Object.defineProperty(self, "message", HIDDEN);
            HIDDEN.value = void 0;
        }
        if (options !== null && typeof options === "object" && "cause" in options) {
            HIDDEN.value = options.cause;
            Object.defineProperty(self, "cause", HIDDEN);
            HIDDEN.value = void 0;
        }
        HIDDEN.value = drainErrors(errors);
        Object.defineProperty(self, "errors", HIDDEN);
        HIDDEN.value = void 0;
        var stackCarrier = new Error(message);
        if (stackCarrier.stack) {
            HIDDEN.value = stackCarrier.stack;
            Object.defineProperty(self, "stack", HIDDEN);
            HIDDEN.value = void 0;
        }
        return self;
    };
    AggregateError2.prototype = Object.create(Error.prototype);
    Object.defineProperty(AggregateError2.prototype, "constructor", {
        value: AggregateError2,
        writable: true,
        enumerable: false,
        configurable: true
    });
    try {
        try {
            Object.defineProperty(AggregateError2.prototype, "name", {
                value: "AggregateError",
                writable: true,
                enumerable: false,
                configurable: true
            });
        } catch (e) {}
    } catch (e) {}
    Object.defineProperty(AggregateError2.prototype, "message", {
        value: "",
        writable: true,
        enumerable: false,
        configurable: true
    });
    var install3 = function install3() {
        define(window, "AggregateError", AggregateError2);
    };
    // src/modules/es.map.ts
    var isSupported4 = function isSupported4() {
        try {
            var Map3 = window.Map;
            if (typeof Map3 !== "function") {
                return false;
            }
            var map = new Map3([
                [
                    "a",
                    1
                ],
                [
                    "b",
                    2
                ],
                [
                    "c",
                    3
                ]
            ]);
            if (Object.prototype.toString.call(map) !== "[object Map]") {
                return false;
            }
            if (map.size !== 3) {
                return false;
            }
            if (typeof map.clear !== "function" || typeof map.delete !== "function" || typeof map.entries !== "function" || typeof map.forEach !== "function" || typeof map.get !== "function" || typeof map.has !== "function" || typeof map.keys !== "function" || typeof map.set !== "function" || typeof map.values !== "function") {
                return false;
            }
            var firstEntry = map.entries().next();
            return firstEntry.done === false && !!firstEntry.value && firstEntry.value[0] === "a" && firstEntry.value[1] === 1;
        } catch (unused) {
            return false;
        }
    };
    var hasSymbol = typeof Symbol !== "undefined" && Symbol.iterator != null;
    var returnSelf = function returnSelf() {
        return this;
    };
    var INDEX_AT = 32;
    var HOLE = {};
    var buildIndex = function buildIndex(self) {
        var keys = self._keys;
        var si = /* @__PURE__ */ Object.create(null);
        var ni = /* @__PURE__ */ Object.create(null);
        for(var i = 0; i < keys.length; i++){
            var key = keys[i];
            if (typeof key === "string") si[key] = i;
            else if (typeof key === "number") ni[key] = i;
        }
        own(self, "_si", si);
        own(self, "_ni", ni);
    };
    var compact = function compact(self) {
        var keys = self._keys;
        var vals = self._vals;
        var length = keys.length;
        if (self._holes === length) {
            keys.length = 0;
            vals.length = 0;
            if (self._si !== 0) {
                own(self, "_si", 0);
                own(self, "_ni", 0);
            }
            own(self, "_holes", 0);
            own(self, "_remap", 0);
            own(self, "_epoch", self._epoch + 1);
            return;
        }
        var remap = new Array(length + 1);
        var w = 0;
        for(var r = 0; r < length; r++){
            remap[r] = w;
            if (keys[r] !== HOLE) {
                keys[w] = keys[r];
                vals[w] = vals[r];
                w++;
            }
        }
        remap[length] = w;
        keys.length = w;
        vals.length = w;
        if (self._si !== 0) {
            if (w >= INDEX_AT) {
                buildIndex(self);
            } else {
                own(self, "_si", 0);
                own(self, "_ni", 0);
            }
        }
        own(self, "_holes", 0);
        own(self, "_remap", remap);
        own(self, "_epoch", self._epoch + 1);
    };
    var MapIterator = function MapIterator(self, kind) {
        this._self = self;
        this._index = 0;
        this._kind = kind;
        this._epoch = self._epoch;
    };
    MapIterator.prototype.next = function() {
        var self = this._self;
        if (self === null) {
            return {
                value: void 0,
                done: true
            };
        }
        if (this._epoch !== self._epoch) {
            if (this._epoch === self._epoch - 1) {
                var remap = self._remap;
                this._index = remap === 0 ? 0 : remap[this._index < remap.length ? this._index : remap.length - 1];
            } else if (this._index > self._keys.length) {
                this._index = self._keys.length;
            }
        }
        this._epoch = self._epoch;
        var keys = self._keys;
        while(this._index < keys.length && keys[this._index] === HOLE)this._index++;
        if (this._index < keys.length) {
            var key = keys[this._index];
            var value = self._vals[this._index];
            this._index++;
            var result = this._kind === "keys" ? key : this._kind === "values" ? value : [
                key,
                value
            ];
            return {
                value: result,
                done: false
            };
        }
        this._self = null;
        return {
            value: void 0,
            done: true
        };
    };
    if (hasSymbol) {
        Object.defineProperty(MapIterator.prototype, Symbol.iterator, {
            value: returnSelf,
            writable: true,
            enumerable: false,
            configurable: true
        });
        try {
            Object.defineProperty(returnSelf, "name", {
                value: "[Symbol.iterator]",
                configurable: true
            });
        } catch (e) {}
    }
    var SLOT2 = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var own = function own(target, key, value) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = value;
        } else {
            SLOT2.value = value;
            Object.defineProperty(target, key, SLOT2);
            SLOT2.value = void 0;
        }
    };
    var Map2 = function Map21(iterable) {
        if (!(this instanceof Map2)) {
            throw new TypeError("Constructor Map requires 'new'");
        }
        SLOT2.value = [];
        Object.defineProperty(this, "_keys", SLOT2);
        SLOT2.value = void 0;
        SLOT2.value = [];
        Object.defineProperty(this, "_vals", SLOT2);
        SLOT2.value = void 0;
        if (iterable === null || iterable === void 0) {
            return;
        }
        if (Array.isArray(iterable)) {
            for(var i = 0; i < iterable.length; i++){
                var entry = iterable[i];
                if (entry === null || typeof entry !== "object" && typeof entry !== "function") {
                    throw new TypeError("Iterator value is not an entry object");
                }
                this.set(entry[0], entry[1]);
            }
            return;
        }
        if (hasSymbol && typeof iterable[Symbol.iterator] === "function") {
            var it = iterable[Symbol.iterator]();
            var step = it.next();
            while(!step.done){
                var entry1 = step.value;
                if (entry1 === null || typeof entry1 !== "object" && typeof entry1 !== "function") {
                    throw new TypeError("Iterator value is not an entry object");
                }
                this.set(entry1[0], entry1[1]);
                step = it.next();
            }
            return;
        }
        throw new TypeError("Map constructor argument is not iterable");
    };
    Map2.prototype.set = function(key, value) {
        if (key === 0) {
            key = 0;
        }
        var i = -1;
        if (this._si !== 0 && (typeof key === "string" || typeof key === "number")) {
            var at = (typeof key === "string" ? this._si : this._ni)[key];
            if (at !== void 0) i = at;
        } else {
            var list = this._keys;
            for(var k = 0; k < list.length; k++){
                var stored = list[k];
                if (stored === key || stored !== stored && key !== key) {
                    i = k;
                    break;
                }
            }
        }
        if (i === -1) {
            var at1 = this._keys.length;
            this._keys[at1] = key;
            this._vals[at1] = value;
            if (this._si !== 0) {
                if (typeof key === "string") this._si[key] = at1;
                else if (typeof key === "number") this._ni[key] = at1;
            } else if (at1 + 1 >= INDEX_AT) {
                buildIndex(this);
            }
        } else {
            this._vals[i] = value;
        }
        return this;
    };
    Map2.prototype.get = function(key) {
        var i = -1;
        if (this._si !== 0 && (typeof key === "string" || typeof key === "number")) {
            var at = (typeof key === "string" ? this._si : this._ni)[key];
            if (at !== void 0) i = at;
        } else {
            var list = this._keys;
            for(var k = 0; k < list.length; k++){
                var stored = list[k];
                if (stored === key || stored !== stored && key !== key) {
                    i = k;
                    break;
                }
            }
        }
        return i === -1 ? void 0 : this._vals[i];
    };
    Map2.prototype.has = function(key) {
        var i = -1;
        if (this._si !== 0 && (typeof key === "string" || typeof key === "number")) {
            var at = (typeof key === "string" ? this._si : this._ni)[key];
            if (at !== void 0) i = at;
        } else {
            var list = this._keys;
            for(var k = 0; k < list.length; k++){
                var stored = list[k];
                if (stored === key || stored !== stored && key !== key) {
                    i = k;
                    break;
                }
            }
        }
        return i !== -1;
    };
    Map2.prototype.delete = function(key) {
        var i = -1;
        if (this._si !== 0 && (typeof key === "string" || typeof key === "number")) {
            var at = (typeof key === "string" ? this._si : this._ni)[key];
            if (at !== void 0) i = at;
        } else {
            var list = this._keys;
            for(var k = 0; k < list.length; k++){
                var stored = list[k];
                if (stored === key || stored !== stored && key !== key) {
                    i = k;
                    break;
                }
            }
        }
        if (i === -1) {
            return false;
        }
        if (this._si !== 0) {
            if (typeof key === "string") delete this._si[key];
            else if (typeof key === "number") delete this._ni[key];
        }
        this._keys[i] = HOLE;
        this._vals[i] = void 0;
        var holes = this._holes + 1;
        own(this, "_holes", holes);
        var live = this._keys.length - holes;
        if (live === 0 || holes > 16 && holes > live) compact(this);
        return true;
    };
    Map2.prototype.clear = function() {
        own(this, "_holes", this._keys.length);
        compact(this);
    };
    Map2.prototype.forEach = function(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Map.prototype.forEach callback is not a function");
        }
        var keys = this._keys;
        var vals = this._vals;
        var index = 0;
        var epoch = this._epoch;
        for(;;){
            while(index < keys.length && keys[index] === HOLE)index++;
            if (index >= keys.length) return;
            var i = index++;
            if (thisArg === void 0) callback(vals[i], keys[i], this);
            else callback.call(thisArg, vals[i], keys[i], this);
            if (epoch !== this._epoch) {
                if (epoch === this._epoch - 1) {
                    var remap = this._remap;
                    index = remap === 0 ? 0 : remap[index < remap.length ? index : remap.length - 1];
                } else if (index > keys.length) {
                    index = keys.length;
                }
                epoch = this._epoch;
            }
        }
    };
    Map2.prototype.keys = function() {
        return new MapIterator(this, "keys");
    };
    Map2.prototype.values = function() {
        return new MapIterator(this, "values");
    };
    Map2.prototype.entries = function() {
        return new MapIterator(this, "entries");
    };
    Object.defineProperty(Map2.prototype, "size", {
        configurable: true,
        get: function get() {
            return this._keys.length - this._holes;
        }
    });
    try {
        try {
            Object.defineProperty(Object.getOwnPropertyDescriptor(Map2.prototype, "size").get, "name", {
                value: "get size",
                configurable: true
            });
        } catch (e) {}
    } catch (e) {}
    if (hasSymbol) {
        Object.defineProperty(Map2.prototype, Symbol.iterator, {
            value: Map2.prototype.entries,
            writable: true,
            enumerable: false,
            configurable: true
        });
        if (Symbol.toStringTag) {
            Object.defineProperty(Map2.prototype, Symbol.toStringTag, {
                value: "Map",
                writable: false,
                enumerable: false,
                configurable: true
            });
        }
    }
    var install4 = function install4() {
        window.Map = null;
        delete window.Map;
        define(window, "Map", Map2);
    };
    Object.defineProperty(Map2.prototype, "_holes", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map2.prototype, "_epoch", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map2.prototype, "_remap", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map2.prototype, "_si", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map2.prototype, "_ni", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    // src/modules/es.set.ts
    var isSupported5 = function isSupported5() {
        try {
            var Set3 = window.Set;
            if (typeof Set3 !== "function") {
                return false;
            }
            var set = new Set3([
                "a",
                "b",
                "c"
            ]);
            if (Object.prototype.toString.call(set) !== "[object Set]") {
                return false;
            }
            if (set.size !== 3) {
                return false;
            }
            if (typeof set.add !== "function" || typeof set.clear !== "function" || typeof set.delete !== "function" || typeof set.entries !== "function" || typeof set.forEach !== "function" || typeof set.has !== "function" || typeof set.keys !== "function" || typeof set.values !== "function") {
                return false;
            }
            var firstValue = set.values().next();
            return firstValue.done === false && firstValue.value === "a";
        } catch (unused) {
            return false;
        }
    };
    var hasSymbol2 = typeof Symbol !== "undefined" && Symbol.iterator != null;
    var returnSelf2 = function returnSelf2() {
        return this;
    };
    var INDEX_AT2 = 32;
    var HOLE2 = {};
    var buildIndex2 = function buildIndex2(self) {
        var values = self._values;
        var si = /* @__PURE__ */ Object.create(null);
        var ni = /* @__PURE__ */ Object.create(null);
        for(var i = 0; i < values.length; i++){
            var value = values[i];
            if (typeof value === "string") si[value] = i;
            else if (typeof value === "number") ni[value] = i;
        }
        own2(self, "_si", si);
        own2(self, "_ni", ni);
    };
    var compact2 = function compact2(self) {
        var values = self._values;
        var length = values.length;
        if (self._holes === length) {
            values.length = 0;
            if (self._si !== 0) {
                own2(self, "_si", 0);
                own2(self, "_ni", 0);
            }
            own2(self, "_holes", 0);
            own2(self, "_remap", 0);
            own2(self, "_epoch", self._epoch + 1);
            return;
        }
        var remap = new Array(length + 1);
        var w = 0;
        for(var r = 0; r < length; r++){
            remap[r] = w;
            if (values[r] !== HOLE2) values[w++] = values[r];
        }
        remap[length] = w;
        values.length = w;
        if (self._si !== 0) {
            if (w >= INDEX_AT2) {
                buildIndex2(self);
            } else {
                own2(self, "_si", 0);
                own2(self, "_ni", 0);
            }
        }
        own2(self, "_holes", 0);
        own2(self, "_remap", remap);
        own2(self, "_epoch", self._epoch + 1);
    };
    var SetIterator = function SetIterator(self, kind) {
        this._self = self;
        this._index = 0;
        this._kind = kind;
        this._epoch = self._epoch;
    };
    SetIterator.prototype.next = function() {
        var self = this._self;
        if (self === null) {
            return {
                value: void 0,
                done: true
            };
        }
        if (this._epoch !== self._epoch) {
            if (this._epoch === self._epoch - 1) {
                var remap = self._remap;
                this._index = remap === 0 ? 0 : remap[this._index < remap.length ? this._index : remap.length - 1];
            } else if (this._index > self._values.length) {
                this._index = self._values.length;
            }
        }
        this._epoch = self._epoch;
        var values = self._values;
        while(this._index < values.length && values[this._index] === HOLE2)this._index++;
        if (this._index < values.length) {
            var value = values[this._index];
            this._index++;
            var result = this._kind === "entries" ? [
                value,
                value
            ] : value;
            return {
                value: result,
                done: false
            };
        }
        this._self = null;
        return {
            value: void 0,
            done: true
        };
    };
    if (hasSymbol2) {
        Object.defineProperty(SetIterator.prototype, Symbol.iterator, {
            value: returnSelf2,
            writable: true,
            enumerable: false,
            configurable: true
        });
        try {
            Object.defineProperty(returnSelf2, "name", {
                value: "[Symbol.iterator]",
                configurable: true
            });
        } catch (e) {}
    }
    var SLOT3 = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var own2 = function own2(target, key, value) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = value;
        } else {
            SLOT3.value = value;
            Object.defineProperty(target, key, SLOT3);
            SLOT3.value = void 0;
        }
    };
    var Set2 = function Set21(iterable) {
        if (!(this instanceof Set2)) {
            throw new TypeError("Constructor Set requires 'new'");
        }
        SLOT3.value = [];
        Object.defineProperty(this, "_values", SLOT3);
        SLOT3.value = void 0;
        if (iterable === null || iterable === void 0) {
            return;
        }
        if (Array.isArray(iterable)) {
            for(var i = 0; i < iterable.length; i++){
                this.add(iterable[i]);
            }
            return;
        }
        if (hasSymbol2 && typeof iterable[Symbol.iterator] === "function") {
            var it = iterable[Symbol.iterator]();
            var step = it.next();
            while(!step.done){
                this.add(step.value);
                step = it.next();
            }
            return;
        }
        throw new TypeError("Set constructor argument is not iterable");
    };
    Set2.prototype.add = function(value) {
        if (value === 0) {
            value = 0;
        }
        var found = -1;
        if (this._si !== 0 && (typeof value === "string" || typeof value === "number")) {
            var at = (typeof value === "string" ? this._si : this._ni)[value];
            if (at !== void 0) found = at;
        } else {
            var list = this._values;
            for(var k = 0; k < list.length; k++){
                var stored = list[k];
                if (stored === value || stored !== stored && value !== value) {
                    found = k;
                    break;
                }
            }
        }
        if (found === -1) {
            var at1 = this._values.length;
            this._values[at1] = value;
            if (this._si !== 0) {
                if (typeof value === "string") this._si[value] = at1;
                else if (typeof value === "number") this._ni[value] = at1;
            } else if (at1 + 1 >= INDEX_AT2) {
                buildIndex2(this);
            }
        }
        return this;
    };
    Set2.prototype.has = function(value) {
        var i = -1;
        if (this._si !== 0 && (typeof value === "string" || typeof value === "number")) {
            var at = (typeof value === "string" ? this._si : this._ni)[value];
            if (at !== void 0) i = at;
        } else {
            var list = this._values;
            for(var k = 0; k < list.length; k++){
                var stored = list[k];
                if (stored === value || stored !== stored && value !== value) {
                    i = k;
                    break;
                }
            }
        }
        return i !== -1;
    };
    Set2.prototype.delete = function(value) {
        var i = -1;
        if (this._si !== 0 && (typeof value === "string" || typeof value === "number")) {
            var at = (typeof value === "string" ? this._si : this._ni)[value];
            if (at !== void 0) i = at;
        } else {
            var list = this._values;
            for(var k = 0; k < list.length; k++){
                var stored = list[k];
                if (stored === value || stored !== stored && value !== value) {
                    i = k;
                    break;
                }
            }
        }
        if (i === -1) {
            return false;
        }
        if (this._si !== 0) {
            if (typeof value === "string") delete this._si[value];
            else if (typeof value === "number") delete this._ni[value];
        }
        this._values[i] = HOLE2;
        var holes = this._holes + 1;
        own2(this, "_holes", holes);
        var live = this._values.length - holes;
        if (live === 0 || holes > 16 && holes > live) compact2(this);
        return true;
    };
    Set2.prototype.clear = function() {
        own2(this, "_holes", this._values.length);
        compact2(this);
    };
    Set2.prototype.forEach = function(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Set.prototype.forEach callback is not a function");
        }
        var values = this._values;
        var index = 0;
        var epoch = this._epoch;
        for(;;){
            while(index < values.length && values[index] === HOLE2)index++;
            if (index >= values.length) return;
            var i = index++;
            if (thisArg === void 0) callback(values[i], values[i], this);
            else callback.call(thisArg, values[i], values[i], this);
            if (epoch !== this._epoch) {
                if (epoch === this._epoch - 1) {
                    var remap = this._remap;
                    index = remap === 0 ? 0 : remap[index < remap.length ? index : remap.length - 1];
                } else if (index > values.length) {
                    index = values.length;
                }
                epoch = this._epoch;
            }
        }
    };
    Set2.prototype.values = function() {
        return new SetIterator(this, "values");
    };
    Set2.prototype.keys = Set2.prototype.values;
    Set2.prototype.entries = function() {
        return new SetIterator(this, "entries");
    };
    Object.defineProperty(Set2.prototype, "size", {
        configurable: true,
        get: function get() {
            return this._values.length - this._holes;
        }
    });
    try {
        try {
            Object.defineProperty(Object.getOwnPropertyDescriptor(Set2.prototype, "size").get, "name", {
                value: "get size",
                configurable: true
            });
        } catch (e) {}
    } catch (e) {}
    if (hasSymbol2) {
        Object.defineProperty(Set2.prototype, Symbol.iterator, {
            value: Set2.prototype.values,
            writable: true,
            enumerable: false,
            configurable: true
        });
        if (Symbol.toStringTag) {
            Object.defineProperty(Set2.prototype, Symbol.toStringTag, {
                value: "Set",
                writable: false,
                enumerable: false,
                configurable: true
            });
        }
    }
    var install5 = function install5() {
        window.Set = null;
        delete window.Set;
        define(window, "Set", Set2);
    };
    Object.defineProperty(Set2.prototype, "_holes", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Set2.prototype, "_epoch", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Set2.prototype, "_remap", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Set2.prototype, "_si", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Set2.prototype, "_ni", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
    });
    // src/modules/es.weak-map.ts
    var isSupported6 = function isSupported6() {
        try {
            var WeakMap3 = window.WeakMap;
            if (typeof WeakMap3 !== "function") {
                return false;
            }
            var weakMap = new WeakMap3();
            if (Object.prototype.toString.call(weakMap) !== "[object WeakMap]") {
                return false;
            }
            var key = {};
            weakMap.set(key, 1);
            if (weakMap.get(key) !== 1 || weakMap.has(key) !== true) {
                return false;
            }
            if (weakMap.delete(key) !== true || weakMap.has(key) !== false) {
                return false;
            }
            try {
                weakMap.set("x", 1);
                return false;
            } catch (unused) {}
            return true;
        } catch (unused) {
            return false;
        }
    };
    var hasSymbol3 = typeof Symbol !== "undefined" && Symbol.toStringTag != null;
    var counter = 0;
    var SLOT4 = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var WeakMap2 = function WeakMap21(iterable) {
        if (!(this instanceof WeakMap2)) {
            throw new TypeError("Constructor WeakMap requires 'new'");
        }
        counter++;
        SLOT4.value = "__wm$".concat(counter, "$").concat(Math.random().toString(36).substring(2));
        Object.defineProperty(this, "_id", SLOT4);
        SLOT4.value = void 0;
        if (iterable === null || iterable === void 0) {
            return;
        }
        if (Array.isArray(iterable)) {
            for(var i = 0; i < iterable.length; i++){
                this.set(iterable[i][0], iterable[i][1]);
            }
            return;
        }
        if (typeof Symbol !== "undefined" && Symbol.iterator != null && typeof iterable[Symbol.iterator] === "function") {
            var iterator = iterable[Symbol.iterator]();
            var step = iterator.next();
            while(!step.done){
                this.set(step.value[0], step.value[1]);
                step = iterator.next();
            }
            return;
        }
        throw new TypeError("WeakMap constructor argument is not iterable");
    };
    var SET_SLOT = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    WeakMap2.prototype.set = function(key, value) {
        if (key === null || typeof key !== "object" && typeof key !== "function") {
            throw new TypeError("Invalid value used as weak map key");
        }
        var id = this._id;
        if (Object.prototype.hasOwnProperty.call(key, id)) {
            key[id] = value;
            return this;
        }
        if (!Object.isExtensible(key)) {
            console.warn("[spackle] WeakMap: frozen / non-extensible keys are not supported by the hidden-property strategy \u2014 this set() will throw");
            throw new TypeError("Cannot add a WeakMap entry to a non-extensible key");
        }
        SET_SLOT.value = value;
        Object.defineProperty(key, id, SET_SLOT);
        SET_SLOT.value = void 0;
        return this;
    };
    WeakMap2.prototype.get = function(key) {
        if (key === null || typeof key !== "object" && typeof key !== "function" || !Object.prototype.hasOwnProperty.call(key, this._id)) {
            return void 0;
        }
        return key[this._id];
    };
    WeakMap2.prototype.has = function(key) {
        return key !== null && (typeof key === "object" || typeof key === "function") && Object.prototype.hasOwnProperty.call(key, this._id);
    };
    WeakMap2.prototype.delete = function(key) {
        if (key === null || typeof key !== "object" && typeof key !== "function" || !Object.prototype.hasOwnProperty.call(key, this._id)) {
            return false;
        }
        delete key[this._id];
        return true;
    };
    if (hasSymbol3) {
        Object.defineProperty(WeakMap2.prototype, Symbol.toStringTag, {
            value: "WeakMap",
            writable: false,
            enumerable: false,
            configurable: true
        });
    }
    var installWeakMapPolyfill = function installWeakMapPolyfill() {
        if (!isSupported6()) {
            window.WeakMap = null;
            delete window.WeakMap;
            define(window, "WeakMap", WeakMap2);
        }
    };
    var nativeRejectsSymbolKeys = function nativeRejectsSymbolKeys() {
        try {
            var NativeWeakMap = window.WeakMap;
            if (typeof NativeWeakMap !== "function" || typeof Symbol !== "function") {
                return false;
            }
            var probe = /* @__PURE__ */ Symbol("spackle-weak-key-probe");
            if (typeof probe !== "symbol") {
                return false;
            }
            new NativeWeakMap().set(probe, 1);
            return false;
        } catch (e) {
            return true;
        }
    };
    var installSymbolWeakKeys = function installSymbolWeakKeys(Ctor) {
        var proto2 = Ctor.prototype;
        var nativeSet = proto2.set;
        var nativeGet = proto2.get;
        var nativeHas2 = proto2.has;
        var nativeDelete2 = proto2.delete;
        var sideTables = new Ctor();
        var isRegistered = function isRegistered(value) {
            try {
                return Symbol.keyFor(value) !== void 0;
            } catch (e) {
                return false;
            }
        };
        var tableFor = function tableFor(self, create) {
            var table = nativeGet.call(sideTables, self);
            if (!table && create) {
                table = {
                    keys: [],
                    values: []
                };
                nativeSet.call(sideTables, self, table);
            }
            return table;
        };
        var indexOfKey = function indexOfKey(table, key) {
            if (!table) return -1;
            for(var i = 0; i < table.keys.length; i++){
                if (table.keys[i] === key) return i;
            }
            return -1;
        };
        proto2.set = function(key, value) {
            if (typeof key !== "symbol" || isRegistered(key)) return nativeSet.call(this, key, value);
            var table = tableFor(this, true);
            var at = indexOfKey(table, key);
            if (at === -1) {
                table.keys.push(key);
                table.values.push(value);
            } else {
                table.values[at] = value;
            }
            return this;
        };
        proto2.get = function(key) {
            if (typeof key !== "symbol" || isRegistered(key)) return nativeGet.call(this, key);
            var table = tableFor(this, false);
            var at = indexOfKey(table, key);
            return at === -1 ? void 0 : table.values[at];
        };
        proto2.has = function(key) {
            if (typeof key !== "symbol" || isRegistered(key)) return nativeHas2.call(this, key);
            return indexOfKey(tableFor(this, false), key) !== -1;
        };
        proto2.delete = function(key) {
            if (typeof key !== "symbol" || isRegistered(key)) return nativeDelete2.call(this, key);
            var table = tableFor(this, false);
            var at = indexOfKey(table, key);
            if (at === -1) return false;
            table.keys.splice(at, 1);
            table.values.splice(at, 1);
            return true;
        };
        var methods = [
            "set",
            "get",
            "has",
            "delete"
        ];
        for(var m = 0; m < methods.length; m++){
            try {
                Object.defineProperty(proto2[methods[m]], "name", {
                    value: methods[m],
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(proto2[methods[m]], "__polyfilled", {
                value: true
            });
        }
    };
    var installWeakMapExtensionsOnNative = function installWeakMapExtensionsOnNative() {
        if (isSupported6() && nativeRejectsSymbolKeys()) {
            installSymbolWeakKeys(window.WeakMap);
        }
    };
    var install6 = function install6() {
        installWeakMapPolyfill();
        installWeakMapExtensionsOnNative();
    };
    // node_modules/promise-polyfill/src/finally.js
    function finallyConstructor(callback) {
        var constructor = this.constructor;
        return this.then(function(value) {
            return constructor.resolve(callback()).then(function() {
                return value;
            });
        }, function(reason) {
            return constructor.resolve(callback()).then(function() {
                return constructor.reject(reason);
            });
        });
    }
    var finally_default = finallyConstructor;
    // node_modules/promise-polyfill/src/allSettled.js
    function allSettled(arr) {
        var P = this;
        return new P(function(resolve2, reject2) {
            if (!(arr && typeof arr.length !== "undefined")) {
                return reject2(new TypeError(typeof arr + " " + arr + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
            }
            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return resolve2([]);
            var remaining = args.length;
            function res(i2, val) {
                if (val && (typeof val === "object" || typeof val === "function")) {
                    var then = val.then;
                    if (typeof then === "function") {
                        then.call(val, function(val2) {
                            res(i2, val2);
                        }, function(e) {
                            args[i2] = {
                                status: "rejected",
                                reason: e
                            };
                            if (--remaining === 0) {
                                resolve2(args);
                            }
                        });
                        return;
                    }
                }
                args[i2] = {
                    status: "fulfilled",
                    value: val
                };
                if (--remaining === 0) {
                    resolve2(args);
                }
            }
            for(var i = 0; i < args.length; i++){
                res(i, args[i]);
            }
        });
    }
    var allSettled_default = allSettled;
    // node_modules/promise-polyfill/src/any.js
    function AggregateError4(errors, message) {
        this.name = "AggregateError", this.errors = errors;
        this.message = message || "";
    }
    AggregateError4.prototype = Error.prototype;
    function any(arr) {
        var P = this;
        return new P(function(resolve2, reject2) {
            if (!(arr && typeof arr.length !== "undefined")) {
                return reject2(new TypeError("Promise.any accepts an array"));
            }
            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return reject2();
            var rejectionReasons = [];
            for(var i = 0; i < args.length; i++){
                try {
                    P.resolve(args[i]).then(resolve2).catch(function(error) {
                        rejectionReasons.push(error);
                        if (rejectionReasons.length === args.length) {
                            reject2(new AggregateError4(rejectionReasons, "All promises were rejected"));
                        }
                    });
                } catch (ex) {
                    reject2(ex);
                }
            }
        });
    }
    var any_default = any;
    // node_modules/promise-polyfill/src/index.js
    var setTimeoutFunc = setTimeout;
    function isArray(x) {
        return Boolean(x && typeof x.length !== "undefined");
    }
    function noop() {}
    function bind(fn, thisArg) {
        return function() {
            fn.apply(thisArg, arguments);
        };
    }
    function Promise2(fn) {
        if (!(this instanceof Promise2)) throw new TypeError("Promises must be constructed via new");
        if (typeof fn !== "function") throw new TypeError("not a function");
        this._state = 0;
        this._handled = false;
        this._value = void 0;
        this._deferreds = [];
        doResolve(fn, this);
    }
    function handle(self, deferred) {
        while(self._state === 3){
            self = self._value;
        }
        if (self._state === 0) {
            self._deferreds.push(deferred);
            return;
        }
        self._handled = true;
        Promise2._immediateFn(function() {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
            }
            var ret;
            try {
                ret = cb(self._value);
            } catch (e) {
                reject(deferred.promise, e);
                return;
            }
            resolve(deferred.promise, ret);
        });
    }
    function resolve(self, newValue) {
        try {
            if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
            if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
                var then = newValue.then;
                if (newValue instanceof Promise2) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                } else if (typeof then === "function") {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
        } catch (e) {
            reject(self, e);
        }
    }
    function reject(self, newValue) {
        self._state = 2;
        self._value = newValue;
        finale(self);
    }
    function finale(self) {
        if (self._state === 2 && self._deferreds.length === 0) {
            Promise2._immediateFn(function() {
                if (!self._handled) {
                    Promise2._unhandledRejectionFn(self._value);
                }
            });
        }
        for(var i = 0, len = self._deferreds.length; i < len; i++){
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
        this.onRejected = typeof onRejected === "function" ? onRejected : null;
        this.promise = promise;
    }
    function doResolve(fn, self) {
        var done = false;
        try {
            fn(function(value) {
                if (done) return;
                done = true;
                resolve(self, value);
            }, function(reason) {
                if (done) return;
                done = true;
                reject(self, reason);
            });
        } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
        }
    }
    Promise2.prototype["catch"] = function(onRejected) {
        return this.then(null, onRejected);
    };
    Promise2.prototype.then = function(onFulfilled, onRejected) {
        var prom = new this.constructor(noop);
        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };
    Promise2.prototype["finally"] = finally_default;
    Promise2.all = function(arr) {
        return new Promise2(function(resolve2, reject2) {
            if (!isArray(arr)) {
                return reject2(new TypeError("Promise.all accepts an array"));
            }
            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return resolve2([]);
            var remaining = args.length;
            function res(i2, val) {
                try {
                    if (val && (typeof val === "object" || typeof val === "function")) {
                        var then = val.then;
                        if (typeof then === "function") {
                            then.call(val, function(val2) {
                                res(i2, val2);
                            }, reject2);
                            return;
                        }
                    }
                    args[i2] = val;
                    if (--remaining === 0) {
                        resolve2(args);
                    }
                } catch (ex) {
                    reject2(ex);
                }
            }
            for(var i = 0; i < args.length; i++){
                res(i, args[i]);
            }
        });
    };
    Promise2.any = any_default;
    Promise2.allSettled = allSettled_default;
    Promise2.resolve = function(value) {
        if (value && typeof value === "object" && value.constructor === Promise2) {
            return value;
        }
        return new Promise2(function(resolve2) {
            resolve2(value);
        });
    };
    Promise2.reject = function(value) {
        return new Promise2(function(resolve2, reject2) {
            reject2(value);
        });
    };
    Promise2.race = function(arr) {
        return new Promise2(function(resolve2, reject2) {
            if (!isArray(arr)) {
                return reject2(new TypeError("Promise.race accepts an array"));
            }
            for(var i = 0, len = arr.length; i < len; i++){
                Promise2.resolve(arr[i]).then(resolve2, reject2);
            }
        });
    };
    Promise2._immediateFn = typeof setImmediate === "function" && function(fn) {
        setImmediate(fn);
    } || function(fn) {
        setTimeoutFunc(fn, 0);
    };
    Promise2._unhandledRejectionFn = function _unhandledRejectionFn(err) {
        if (typeof console !== "undefined" && console) {
            console.warn("Possible Unhandled Promise Rejection:", err);
        }
    };
    var src_default = Promise2;
    // src/modules/es.promise.ts
    var isSupported7 = function isSupported7() {
        try {
            if (typeof Promise !== "function" || typeof Promise.prototype.then !== "function" || typeof Promise.prototype.catch !== "function" || typeof Promise.resolve !== "function" || typeof Promise.reject !== "function") {
                return false;
            }
            if (Promise.__polyfilled === true) {
                return true;
            }
            var w = window;
            if (typeof w.PromiseRejectionEvent !== "function") {
                return false;
            }
            var species = typeof Symbol !== "undefined" ? Symbol.species : void 0;
            if (!species) {
                return false;
            }
            var Fake = function Fake(executor) {
                executor(function() {}, function() {});
            };
            var probe = new Promise(function(resolve2) {
                resolve2(1);
            });
            probe.constructor = {};
            probe.constructor[species] = Fake;
            return probe.then(function() {}) instanceof Fake;
        } catch (unused) {
            return false;
        }
    };
    var scheduleDrain = function scheduleDrain() {
        var queue2 = [];
        var head3 = 0;
        var scheduled2 = false;
        var wake2;
        var drain2 = function drain2() {
            scheduled2 = false;
            while(head3 < queue2.length){
                var fn = queue2[head3];
                queue2[head3] = void 0;
                head3++;
                try {
                    fn();
                } catch (error) {
                    w.setTimeout(function() {
                        throw error;
                    }, 0);
                }
                if (head3 > 1024) {
                    var rest = queue2.length - head3;
                    for(var i = 0; i < rest; i++)queue2[i] = queue2[head3 + i];
                    queue2.length = rest;
                    head3 = 0;
                }
            }
            queue2.length = 0;
            head3 = 0;
        };
        var w = window;
        var MO = w.MutationObserver || w.WebKitMutationObserver;
        var ua = w.navigator && w.navigator.userAgent || "";
        var brokenObserver = /(?:ipad|iphone|ipod).*applewebkit/i.test(ua) || /web0s(?!.*chrome)/i.test(ua);
        var fast2;
        var needsBackup = true;
        if (MO && w.document && !brokenObserver) {
            var toggle = true;
            var node = w.document.createTextNode("");
            new MO(drain2).observe(node, {
                characterData: true
            });
            try {
                needsBackup = !/\[native code\]/.test(Function.prototype.toString.call(MO));
            } catch (e) {}
            fast2 = function fast2() {
                toggle = !toggle;
                node.data = toggle ? "1" : "0";
            };
        } else if (typeof w.MessageChannel === "function") {
            var channel = new w.MessageChannel();
            channel.port1.onmessage = drain2;
            fast2 = function fast2() {
                channel.port2.postMessage(0);
            };
        } else {
            fast2 = function fast2() {};
        }
        wake2 = function wake2() {
            fast2();
            if (needsBackup) w.setTimeout(drain2, 0);
        };
        return function(fn) {
            queue2.push(fn);
            if (scheduled2) return;
            scheduled2 = true;
            wake2();
        };
    };
    var handlerAttributeIsWired = false;
    var reportUnhandledRejection = function reportUnhandledRejection(reason) {
        var w = window;
        var prevented = false;
        try {
            var doc = w.document;
            if (doc && typeof doc.createEvent === "function" && typeof w.dispatchEvent === "function") {
                var event = doc.createEvent("Event");
                event.initEvent("unhandledrejection", false, true);
                event.reason = reason;
                event.promise = null;
                prevented = w.dispatchEvent(event) === false;
                if (!handlerAttributeIsWired && typeof w.onunhandledrejection === "function") {
                    w.onunhandledrejection(event);
                    prevented = event.defaultPrevented === true;
                }
            } else if (typeof w.onunhandledrejection === "function") {
                w.onunhandledrejection({
                    reason: reason,
                    promise: null
                });
            }
        } catch (e) {}
        if (!prevented && typeof console !== "undefined" && console.warn) {
            console.warn("Unhandled promise rejection:", reason);
        }
    };
    var install7 = function install7() {
        src_default._immediateFn = scheduleDrain();
        handlerAttributeIsWired = "onunhandledrejection" in window;
        src_default._unhandledRejectionFn = reportUnhandledRejection;
        window.Promise = null;
        delete window.Promise;
        delete src_default.any;
        delete src_default.allSettled;
        define(window, "Promise", src_default);
    };
    // src/modules/_disposable-impl.ts
    var ensureSymbol = function ensureSymbol(name) {
        if (typeof Symbol === "undefined") {
            return void 0;
        }
        var existing = Symbol[name];
        if (existing !== void 0) {
            return existing;
        }
        try {
            Object.defineProperty(Symbol, name, {
                value: /* @__PURE__ */ Symbol("Symbol." + name)
            });
        } catch (unused) {
            return void 0;
        }
        return Symbol[name];
    };
    var def = function def(target, key, value) {
        if (typeof value === "function" && typeof key === "string" && key !== "constructor") {
            try {
                Object.defineProperty(value, "name", {
                    value: key,
                    configurable: true
                });
            } catch (e) {}
        }
        Object.defineProperty(target, key, {
            value: value,
            writable: true,
            enumerable: false,
            configurable: true
        });
    };
    var SuppressedError = function SuppressedError1(error, suppressed, message) {
        var self = this instanceof SuppressedError ? this : Object.create(SuppressedError.prototype);
        if (message !== void 0) {
            if (typeof message === "symbol") {
                throw new TypeError("Cannot convert a Symbol value to a string");
            }
            def(self, "message", String(message));
        }
        def(self, "error", error);
        def(self, "suppressed", suppressed);
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(self, SuppressedError);
        } else {
            var stack = new Error().stack;
            if (stack) self.stack = stack;
        }
        return self;
    };
    SuppressedError.prototype = Object.create(Error.prototype);
    def(SuppressedError.prototype, "constructor", SuppressedError);
    def(SuppressedError.prototype, "name", "SuppressedError");
    def(SuppressedError.prototype, "message", "");
    var suppress = function suppress(existing, hasExisting, thrown) {
        return hasExisting ? new SuppressedError(thrown, existing) : thrown;
    };
    var DisposableStack = function DisposableStack1() {
        if (!(this instanceof DisposableStack)) {
            throw new TypeError("Constructor DisposableStack requires 'new'");
        }
        this._brand = "DisposableStack";
        this._stack = [];
        this._disposed = false;
    };
    var disposablestackDisposedGetter = function disposablestackDisposedGetter() {
        if (this === null || typeof this !== "object" || this._brand !== "DisposableStack") {
            throw new TypeError("DisposableStack.prototype.disposed called on incompatible receiver");
        }
        return this._disposed;
    };
    try {
        try {
            Object.defineProperty(disposablestackDisposedGetter, "name", {
                value: "get disposed",
                configurable: true
            });
        } catch (e) {}
    } catch (e) {}
    Object.defineProperty(DisposableStack.prototype, "disposed", {
        configurable: true,
        get: disposablestackDisposedGetter
    });
    def(DisposableStack.prototype, "use", function(value) {
        if (this === null || typeof this !== "object" || this._brand !== "DisposableStack") {
            throw new TypeError("DisposableStack.prototype.use called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: use");
        if (value === null || value === void 0) {
            return value;
        }
        var target = Object(value);
        var method = void 0;
        var methodKey = ensureSymbol("dispose");
        if (methodKey !== void 0) {
            var found = target[methodKey];
            if (found !== null && found !== void 0) {
                if (typeof found !== "function") throw new TypeError("dispose method is not callable");
                method = found;
            }
        }
        if (method === void 0) {
            throw new TypeError("value is not disposable");
        }
        this._stack.push(function() {
            method.call(value);
        });
        return value;
    });
    def(DisposableStack.prototype, "adopt", function(value, onDispose) {
        if (this === null || typeof this !== "object" || this._brand !== "DisposableStack") {
            throw new TypeError("DisposableStack.prototype.adopt called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: adopt");
        if (typeof onDispose !== "function") {
            throw new TypeError("onDispose is not a function");
        }
        this._stack.push(function() {
            onDispose(value);
        });
        return value;
    });
    def(DisposableStack.prototype, "defer", function(onDispose) {
        if (this === null || typeof this !== "object" || this._brand !== "DisposableStack") {
            throw new TypeError("DisposableStack.prototype.defer called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: defer");
        if (typeof onDispose !== "function") {
            throw new TypeError("onDispose is not a function");
        }
        this._stack.push(onDispose);
    });
    def(DisposableStack.prototype, "move", function() {
        if (this === null || typeof this !== "object" || this._brand !== "DisposableStack") {
            throw new TypeError("DisposableStack.prototype.move called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: move");
        var moved = new DisposableStack();
        moved._stack = this._stack;
        this._stack = [];
        this._disposed = true;
        return moved;
    });
    def(DisposableStack.prototype, "dispose", function() {
        if (this === null || typeof this !== "object" || this._brand !== "DisposableStack") {
            throw new TypeError("DisposableStack.prototype.dispose called on incompatible receiver");
        }
        if (this._disposed) return;
        this._disposed = true;
        var pending = this._stack;
        this._stack = [];
        var hasError = false;
        var error;
        for(var i = pending.length - 1; i >= 0; i--){
            try {
                pending[i]();
            } catch (thrown) {
                error = suppress(error, hasError, thrown);
                hasError = true;
            }
        }
        if (hasError) throw error;
    });
    var AsyncDisposableStack = function AsyncDisposableStack1() {
        if (!(this instanceof AsyncDisposableStack)) {
            throw new TypeError("Constructor AsyncDisposableStack requires 'new'");
        }
        this._brand = "AsyncDisposableStack";
        this._stack = [];
        this._disposed = false;
    };
    var asyncdisposablestackDisposedGetter = function asyncdisposablestackDisposedGetter() {
        if (this === null || typeof this !== "object" || this._brand !== "AsyncDisposableStack") {
            throw new TypeError("AsyncDisposableStack.prototype.disposed called on incompatible receiver");
        }
        return this._disposed;
    };
    try {
        try {
            Object.defineProperty(asyncdisposablestackDisposedGetter, "name", {
                value: "get disposed",
                configurable: true
            });
        } catch (e) {}
    } catch (e) {}
    Object.defineProperty(AsyncDisposableStack.prototype, "disposed", {
        configurable: true,
        get: asyncdisposablestackDisposedGetter
    });
    def(AsyncDisposableStack.prototype, "use", function(value) {
        if (this === null || typeof this !== "object" || this._brand !== "AsyncDisposableStack") {
            throw new TypeError("AsyncDisposableStack.prototype.use called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: use");
        if (value === null || value === void 0) {
            return value;
        }
        var boxed = Object(value);
        var method = void 0;
        var methodKey = ensureSymbol("asyncDispose");
        if (methodKey !== void 0) {
            var found = boxed[methodKey];
            if (found !== null && found !== void 0) {
                if (typeof found !== "function") throw new TypeError("dispose method is not callable");
                method = found;
            }
        }
        if (method === void 0) {
            var syncMethod = void 0;
            var syncMethodKey = ensureSymbol("dispose");
            if (syncMethodKey !== void 0) {
                var found1 = boxed[syncMethodKey];
                if (found1 !== null && found1 !== void 0) {
                    if (typeof found1 !== "function") throw new TypeError("dispose method is not callable");
                    syncMethod = found1;
                }
            }
            method = syncMethod;
        }
        if (method === void 0) {
            throw new TypeError("value is not async disposable");
        }
        this._stack.push(function() {
            return method.call(value);
        });
        return value;
    });
    def(AsyncDisposableStack.prototype, "adopt", function(value, onDispose) {
        if (this === null || typeof this !== "object" || this._brand !== "AsyncDisposableStack") {
            throw new TypeError("AsyncDisposableStack.prototype.adopt called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: adopt");
        if (typeof onDispose !== "function") {
            throw new TypeError("onDispose is not a function");
        }
        this._stack.push(function() {
            return onDispose(value);
        });
        return value;
    });
    def(AsyncDisposableStack.prototype, "defer", function(onDispose) {
        if (this === null || typeof this !== "object" || this._brand !== "AsyncDisposableStack") {
            throw new TypeError("AsyncDisposableStack.prototype.defer called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: defer");
        if (typeof onDispose !== "function") {
            throw new TypeError("onDispose is not a function");
        }
        this._stack.push(onDispose);
    });
    def(AsyncDisposableStack.prototype, "move", function() {
        if (this === null || typeof this !== "object" || this._brand !== "AsyncDisposableStack") {
            throw new TypeError("AsyncDisposableStack.prototype.move called on incompatible receiver");
        }
        if (this._disposed) throw new ReferenceError("DisposableStack already disposed: move");
        var moved = new AsyncDisposableStack();
        moved._stack = this._stack;
        this._stack = [];
        this._disposed = true;
        return moved;
    });
    def(AsyncDisposableStack.prototype, "disposeAsync", function() {
        if (this === null || typeof this !== "object" || this._brand !== "AsyncDisposableStack") {
            throw new TypeError("AsyncDisposableStack.prototype.disposeAsync called on incompatible receiver");
        }
        if (typeof Promise === "undefined") {
            throw new TypeError("AsyncDisposableStack requires Promise");
        }
        if (this._disposed) {
            return Promise.resolve(void 0);
        }
        this._disposed = true;
        var pending = this._stack;
        this._stack = [];
        var index = pending.length - 1;
        var hasError = false;
        var error;
        var step = function step1() {
            if (index < 0) {
                if (hasError) throw error;
                return void 0;
            }
            var disposer = pending[index--];
            return Promise.resolve().then(function() {
                return disposer();
            }).then(void 0, function(thrown) {
                error = suppress(error, hasError, thrown);
                hasError = true;
            }).then(step);
        };
        return Promise.resolve().then(step);
    });
    var setProto = Object.setPrototypeOf || function(target, proto2) {
        target.__proto__ = proto2;
        return target;
    };
    try {
        setProto(SuppressedError, Error);
    } catch (unused) {}
    for(var i1 = 0; i1 < 3; i1++){
        var ctor = [
            SuppressedError,
            DisposableStack,
            AsyncDisposableStack
        ][i1];
        try {
            Object.defineProperty(ctor, "prototype", {
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (unused) {}
    }
    var disposeKey = ensureSymbol("dispose");
    var asyncDisposeKey = ensureSymbol("asyncDispose");
    var tagKey = typeof Symbol !== "undefined" ? Symbol.toStringTag : void 0;
    var defTag = function defTag(target, value) {
        Object.defineProperty(target, tagKey, {
            value: value,
            writable: false,
            enumerable: false,
            configurable: true
        });
    };
    var install8 = function install8() {
        if (tagKey) {
            defTag(DisposableStack.prototype, "DisposableStack");
            defTag(AsyncDisposableStack.prototype, "AsyncDisposableStack");
            defTag(SuppressedError.prototype, "SuppressedError");
        }
        if (disposeKey !== void 0) {
            def(DisposableStack.prototype, disposeKey, DisposableStack.prototype.dispose);
        }
        if (asyncDisposeKey !== void 0) {
            def(AsyncDisposableStack.prototype, asyncDisposeKey, AsyncDisposableStack.prototype.disposeAsync);
        }
        var target = typeof window !== "undefined" ? window : globalThis;
        if (!target.SuppressedError) define(target, "SuppressedError", SuppressedError);
        if (!target.DisposableStack) define(target, "DisposableStack", DisposableStack);
        if (!target.AsyncDisposableStack) define(target, "AsyncDisposableStack", AsyncDisposableStack);
        if (asyncDisposeKey !== void 0) {
            try {
                var makeAsyncGen = Function("return (async function* () {})");
                var asyncGenFn = makeAsyncGen();
                var asyncIteratorProto = Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(asyncGenFn())));
                if (asyncIteratorProto && !asyncIteratorProto[asyncDisposeKey]) {
                    var asyncIteratorDispose = function asyncIteratorDispose() {
                        var self = this;
                        return Promise.resolve().then(function() {
                            var method = self.return;
                            return typeof method === "function" ? method.call(self) : void 0;
                        });
                    };
                    define(asyncIteratorProto, asyncDisposeKey, asyncIteratorDispose, "[Symbol.asyncDispose]");
                }
            } catch (unused) {}
        }
    };
    // src/modules/web.url-search-params.ts
    var isSupported8 = function isSupported8() {
        try {
            var Native = window.URLSearchParams;
            if (typeof Native === "undefined") {
                return false;
            }
            if (new Native({
                a: "1"
            }).toString() !== "a=1") {
                return false;
            }
            if (new Native("?a=1").toString() !== "a=1") {
                return false;
            }
            if (new Native("a=1&b=2&a=3").toString() !== "a=1&b=2&a=3") {
                return false;
            }
            return new Native("a=1").get("a") === "1";
        } catch (unused) {
            return false;
        }
    };
    var decodePercent = function decodePercent(str) {
        try {
            return decodeURIComponent(str);
        } catch (e) {
            return decodeLenient(str);
        }
    };
    var decodeLenient = function decodeLenient(str) {
        var out = "";
        var needed = 0;
        var seen = 0;
        var cp = 0;
        var lower = 128;
        var upper = 191;
        var flush = function flush() {
            if (needed !== 0) {
                out += "\uFFFD";
                needed = seen = cp = 0;
                lower = 128;
                upper = 191;
            }
        };
        for(var i = 0; i < str.length; i++){
            var ch = str.charCodeAt(i);
            var byte = -1;
            if (ch === 37 && i + 2 < str.length) {
                var hiCode = str.charCodeAt(i + 1);
                var hi = hiCode >= 48 && hiCode <= 57 ? hiCode - 48 : // 0-9
                hiCode >= 65 && hiCode <= 70 ? hiCode - 55 : // A-F
                hiCode >= 97 && hiCode <= 102 ? hiCode - 87 : // a-f
                -1;
                var loCode = str.charCodeAt(i + 2);
                var lo = loCode >= 48 && loCode <= 57 ? loCode - 48 : // 0-9
                loCode >= 65 && loCode <= 70 ? loCode - 55 : // A-F
                loCode >= 97 && loCode <= 102 ? loCode - 87 : // a-f
                -1;
                if (hi !== -1 && lo !== -1) {
                    byte = hi * 16 + lo;
                    i += 2;
                }
            }
            if (byte === -1) {
                flush();
                out += str.charAt(i);
                continue;
            }
            for(;;){
                if (needed === 0) {
                    if (byte <= 127) out += String.fromCharCode(byte);
                    else if (byte >= 194 && byte <= 223) {
                        needed = 1;
                        cp = byte & 31;
                    } else if (byte >= 224 && byte <= 239) {
                        if (byte === 224) lower = 160;
                        if (byte === 237) upper = 159;
                        needed = 2;
                        cp = byte & 15;
                    } else if (byte >= 240 && byte <= 244) {
                        if (byte === 240) lower = 144;
                        if (byte === 244) upper = 143;
                        needed = 3;
                        cp = byte & 7;
                    } else out += "\uFFFD";
                    break;
                }
                if (byte < lower || byte > upper) {
                    flush();
                    continue;
                }
                lower = 128;
                upper = 191;
                cp = cp << 6 | byte & 63;
                if (++seen === needed) {
                    if (cp <= 65535) {
                        out += String.fromCharCode(cp);
                    } else {
                        var offset = cp - 65536;
                        out += String.fromCharCode(55296 + (offset >> 10), 56320 + (offset & 1023));
                    }
                    needed = seen = cp = 0;
                }
                break;
            }
        }
        flush();
        return out;
    };
    var parseString = function parseString(search) {
        var pairs = [];
        var query = search.indexOf("?") === 0 ? search.substring(1) : search;
        if (!query) {
            return pairs;
        }
        var chunks = query.split("&");
        for(var i = 0; i < chunks.length; i++){
            var chunk = chunks[i];
            if (chunk === "") {
                continue;
            }
            var equalsAt = chunk.indexOf("=");
            var name = equalsAt > -1 ? chunk.substring(0, equalsAt) : chunk;
            if (name.indexOf("+") !== -1) name = name.replace(/\+/g, " ");
            if (name.indexOf("%") !== -1) name = decodePercent(name);
            var value = "";
            if (equalsAt > -1) {
                value = chunk.substring(equalsAt + 1);
                if (value.indexOf("+") !== -1) value = value.replace(/\+/g, " ");
                if (value.indexOf("%") !== -1) value = decodePercent(value);
            }
            pairs.push([
                name,
                value
            ]);
        }
        return pairs;
    };
    var SLOT5 = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var URLSearchParams2 = function URLSearchParams21(search) {
        SLOT5.value = [];
        Object.defineProperty(this, "_pairs", SLOT5);
        SLOT5.value = void 0;
        if (search === null || search === void 0 || search === "") {
            return;
        }
        if (typeof search === "string") {
            this._pairs = parseString(search);
            return;
        }
        if (search instanceof URLSearchParams2) {
            var source = search._pairs;
            for(var i = 0; i < source.length; i++){
                this._pairs.push([
                    source[i][0],
                    source[i][1]
                ]);
            }
            return;
        }
        var iteratorKey = typeof Symbol !== "undefined" ? Symbol.iterator : void 0;
        if (iteratorKey && !Array.isArray(search) && typeof search[iteratorKey] === "function") {
            var iterator = search[iteratorKey]();
            for(var step = iterator.next(); !step.done; step = iterator.next()){
                var entry = step.value;
                if (entry === null || typeof entry !== "object" || Math.floor(+entry.length) !== 2) {
                    throw new TypeError("Failed to construct 'URLSearchParams': Each sequence element must contain exactly two items");
                }
                this._pairs.push([
                    String(entry[0]),
                    String(entry[1])
                ]);
            }
            return;
        }
        if (Array.isArray(search)) {
            for(var i1 = 0; i1 < search.length; i1++){
                var entry1 = search[i1];
                if (!entry1 || entry1.length !== 2) {
                    throw new TypeError("Failed to construct 'URLSearchParams': Each sequence element must contain exactly two items");
                }
                this._pairs.push([
                    String(entry1[0]),
                    String(entry1[1])
                ]);
            }
            return;
        }
        for(var key in search){
            if (Object.prototype.hasOwnProperty.call(search, key)) {
                this._pairs.push([
                    key,
                    String(search[key])
                ]);
            }
        }
    };
    URLSearchParams2.prototype.get = function(name) {
        var key = String(name);
        for(var i = 0; i < this._pairs.length; i++){
            if (this._pairs[i][0] === key) {
                return this._pairs[i][1];
            }
        }
        return null;
    };
    URLSearchParams2.prototype.getAll = function(name) {
        var key = String(name);
        var values = [];
        for(var i = 0; i < this._pairs.length; i++){
            if (this._pairs[i][0] === key) {
                values.push(this._pairs[i][1]);
            }
        }
        return values;
    };
    URLSearchParams2.prototype.has = function(name) {
        var key = String(name);
        for(var i = 0; i < this._pairs.length; i++){
            if (this._pairs[i][0] === key) {
                return true;
            }
        }
        return false;
    };
    URLSearchParams2.prototype.set = function(name, value) {
        var key = String(name);
        var next = String(value);
        var replaced = false;
        var kept = [];
        for(var i = 0; i < this._pairs.length; i++){
            if (this._pairs[i][0] !== key) {
                kept.push(this._pairs[i]);
            } else if (!replaced) {
                kept.push([
                    key,
                    next
                ]);
                replaced = true;
            }
        }
        if (!replaced) {
            kept.push([
                key,
                next
            ]);
        }
        this._pairs = kept;
    };
    URLSearchParams2.prototype.append = function(name, value) {
        this._pairs.push([
            String(name),
            String(value)
        ]);
    };
    URLSearchParams2.prototype["delete"] = function(name) {
        var key = String(name);
        var kept = [];
        for(var i = 0; i < this._pairs.length; i++){
            if (this._pairs[i][0] !== key) {
                kept.push(this._pairs[i]);
            }
        }
        this._pairs = kept;
    };
    Object.defineProperty(URLSearchParams2.prototype, "toString", {
        writable: true,
        enumerable: false,
        configurable: true,
        value: function value() {
            var out = "";
            for(var i = 0; i < this._pairs.length; i++){
                if (i > 0) out += "&";
                out += encodeURIComponent(this._pairs[i][0]).replace(/%20/g, "+") + "=" + encodeURIComponent(this._pairs[i][1]).replace(/%20/g, "+");
            }
            return out;
        }
    });
    URLSearchParams2.prototype.forEach = function(callback, thisArg) {
        for(var i = 0; i < this._pairs.length; i++){
            callback.call(thisArg, this._pairs[i][1], this._pairs[i][0], this);
        }
    };
    var install9 = function install9() {
        define(window, "URLSearchParams", URLSearchParams2);
    };
    // src/modules/web.url.ts
    var isSupported9 = function isSupported9() {
        try {
            var url = new URL("b", "http://a");
            url.pathname = "c d";
            if (url.href !== "http://a/c%20d" || url.searchParams === void 0) {
                return false;
            }
            if (url.searchParams !== url.searchParams) {
                return false;
            }
            var live = new URL("http://a/?x=1");
            live.searchParams.set("x", "2");
            return live.search === "?x=2";
        } catch (unused) {
            return false;
        }
    };
    var alreadyInstalled = false;
    var applyURLPolyfill = function applyURLPolyfill() {
        if (alreadyInstalled) return;
        alreadyInstalled = true;
        if (typeof window === "undefined") return;
        var nativeURL = window.URL || window.webkitURL || null;
        var anchor = document.createElement("a");
        var resolverDoc = null;
        var resolverBase = null;
        var resolverAnchor = null;
        var resolveUrl = function resolveUrl(base, relative) {
            if (resolverDoc === null) {
                resolverDoc = document.implementation.createHTMLDocument("");
                resolverBase = resolverDoc.createElement("base");
                resolverDoc.head.appendChild(resolverBase);
                resolverAnchor = resolverDoc.createElement("a");
                resolverDoc.body.appendChild(resolverAnchor);
            }
            resolverBase.href = base;
            resolverAnchor.href = relative;
            return resolverAnchor.href;
        };
        var normalizeSearch = function normalizeSearch(value) {
            if (value === "" || value === "?") return "";
            return value.charAt(0) === "?" ? value : "?" + value;
        };
        var URLPolyfill = function URLPolyfill(url, base) {
            if (typeof url !== "string") {
                url = String(url);
            }
            url = url.trim();
            if (base === void 0 && !/^[a-zA-Z][a-zA-Z0-9+.\-]*:/.test(url)) {
                throw new TypeError("Invalid URL: '" + url + "'");
            }
            var resolvedUrl = base !== void 0 ? resolveUrl(String(base), url) : url;
            anchor.href = resolvedUrl;
            if (anchor.host === "") {
                anchor.href = anchor.href;
            }
            if (!anchor.protocol || anchor.protocol === ":") {
                throw new TypeError("Invalid URL: '" + url + "'");
            }
            this.protocol = anchor.protocol;
            this.hostname = anchor.hostname;
            this.port = anchor.port;
            this.host = anchor.host;
            this.hash = anchor.hash;
            this.username = "";
            this.password = "";
            this.pathname = anchor.pathname;
            if (this.pathname.charAt(0) !== "/") {
                this.pathname = "/" + this.pathname;
            }
            this.origin = this.protocol + "//" + this.hostname + (this.port ? ":" + this.port : "");
            this._rawSearch = normalizeSearch(anchor.search);
            this._params = null;
        };
        Object.defineProperty(URLPolyfill.prototype, "searchParams", {
            configurable: true,
            enumerable: true,
            get: function get() {
                if (this._params === null) {
                    this._params = new URLSearchParams(this._rawSearch);
                }
                return this._params;
            }
        });
        Object.defineProperty(URLPolyfill.prototype, "search", {
            configurable: true,
            enumerable: true,
            // Read through to the params when they exist, so mutations made via
            // searchParams show up here with no write-back wiring at all.
            get: function get() {
                if (this._params !== null) {
                    var query = this._params.toString();
                    return query ? "?" + query : "";
                }
                return this._rawSearch;
            },
            set: function set(value) {
                var next = normalizeSearch(String(value));
                this._rawSearch = next;
                if (this._params !== null) {
                    var params = this._params;
                    var names = [];
                    params.forEach(function(_value, name) {
                        if (names.indexOf(name) === -1) names.push(name);
                    });
                    for(var i = 0; i < names.length; i++){
                        params.delete(names[i]);
                    }
                    new URLSearchParams(next).forEach(function(v, name) {
                        params.append(name, v);
                    });
                }
            }
        });
        Object.defineProperty(URLPolyfill.prototype, "href", {
            configurable: true,
            enumerable: true,
            get: function get() {
                return this.protocol + "//" + this.host + this.pathname + this.search + this.hash;
            }
        });
        Object.defineProperty(URLPolyfill.prototype, "toString", {
            writable: true,
            enumerable: false,
            configurable: true,
            value: function value() {
                return this.href;
            }
        });
        URLPolyfill.prototype.toJSON = function() {
            return this.href;
        };
        if (nativeURL) {
            if (nativeURL.createObjectURL) {
                URLPolyfill.createObjectURL = function(blob) {
                    return nativeURL.createObjectURL(blob);
                };
            }
            if (nativeURL.revokeObjectURL) {
                URLPolyfill.revokeObjectURL = function(url) {
                    return nativeURL.revokeObjectURL(url);
                };
            }
        }
        define(window, "URL", URLPolyfill);
        if (typeof window.location !== "undefined" && !("origin" in window.location)) {
            var getOrigin = function getOrigin() {
                return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
            };
            try {
                Object.defineProperty(window.location, "origin", {
                    get: getOrigin,
                    enumerable: true
                });
            } catch (unused) {
                window.location.origin = getOrigin();
            }
        }
    };
    var install10 = function install10() {
        applyURLPolyfill();
    };
    // src/modules/es.error.cause.ts
    var isSupported10 = function isSupported10() {
        try {
            return new Error("m", {
                cause: 1
            }).cause === 1 && new TypeError("m", {
                cause: 1
            }).cause === 1;
        } catch (unused) {
            return false;
        }
    };
    var CAUSE = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var wrapErrorConstructor = function wrapErrorConstructor(Native) {
        var _loop = function(i) {
            var name = names[i];
            if (name === "prototype" || name === "length" || name === "name") return "continue";
            try {
                var descriptor = Object.getOwnPropertyDescriptor(Native, name);
                if (!descriptor) return "continue";
                Object.defineProperty(Wrapped, name, {
                    get: function get() {
                        return Native[name];
                    },
                    set: function set(value) {
                        Native[name] = value;
                    },
                    enumerable: descriptor.enumerable,
                    configurable: true
                });
            } catch (unused) {}
        };
        var Wrapped = function Wrapped(message, options) {
            var error = message === void 0 ? new Native() : new Native(message);
            if (options !== null && typeof options === "object" && "cause" in options) {
                CAUSE.value = options.cause;
                Object.defineProperty(error, "cause", CAUSE);
                CAUSE.value = void 0;
            }
            return error;
        };
        Wrapped.prototype = Native.prototype;
        try {
            Object.defineProperty(Native.prototype, "constructor", {
                value: Wrapped,
                writable: true,
                enumerable: false,
                configurable: true
            });
        } catch (unused) {}
        var names = Object.getOwnPropertyNames(Native);
        for(var i = 0; i < names.length; i++)_loop(i);
        return Wrapped;
    };
    var install11 = function install11() {
        if (typeof window !== "undefined") {
            var targets = [
                "Error",
                "TypeError",
                "RangeError",
                "SyntaxError",
                "ReferenceError",
                "EvalError",
                "URIError"
            ];
            for(var i = 0; i < targets.length; i++){
                var name = targets[i];
                var Native = window[name];
                if (typeof Native !== "function") continue;
                var Wrapped = wrapErrorConstructor(Native);
                Object.defineProperty(window, name, {
                    value: Wrapped,
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Wrapped, "__polyfilled", {
                    value: true
                });
            }
        }
    };
    // src/modules/es.error.is-error.ts
    var isSupported11 = function isSupported11() {
        try {
            return typeof Error.isError === "function";
        } catch (unused) {
            return false;
        }
    };
    var errorIsError = function errorIsError(value) {
        return Object.prototype.toString.call(value) === "[object Error]";
    };
    // src/modules/es.error.to-string.ts
    var isSupported12 = function isSupported12() {
        try {
            return Error.prototype.toString.call({
                name: "x",
                message: "y"
            }) === "x: y" && Error.prototype.toString.call({}) === "Error" && Error.prototype.toString.call({
                name: "x"
            }) === "x" && Error.prototype.toString.call({
                message: "y"
            }) === "Error: y";
        } catch (unused) {
            return false;
        }
    };
    var errorToString = function errorToString() {
        if (this === null || typeof this !== "object") {
            throw new TypeError("Error.prototype.toString called on a non-object");
        }
        var rawName = this.name;
        var name = rawName === void 0 ? "Error" : String(rawName);
        var rawMessage = this.message;
        var message = rawMessage === void 0 ? "" : String(rawMessage);
        if (name === "") {
            return message;
        }
        if (message === "") {
            return name;
        }
        return name + ": " + message;
    };
    // src/modules/es.map.get-or-insert.ts
    var isSupported13 = function isSupported13() {
        try {
            return typeof Map !== "undefined" && typeof Map.prototype.getOrInsert === "function";
        } catch (unused) {
            return false;
        }
    };
    var mapGetOrInsert = function mapGetOrInsert(key, value) {
        var normalized = key === 0 ? 0 : key;
        if (this.has(normalized)) {
            return this.get(normalized);
        }
        this.set(normalized, value);
        return value;
    };
    // src/modules/es.map.get-or-insert-computed.ts
    var isSupported14 = function isSupported14() {
        try {
            return typeof Map !== "undefined" && typeof Map.prototype.getOrInsertComputed === "function";
        } catch (unused) {
            return false;
        }
    };
    var mapGetOrInsertComputed = function mapGetOrInsertComputed(key, callbackfn) {
        if (typeof callbackfn !== "function") {
            throw new TypeError("Map.prototype.getOrInsertComputed: callback is not callable");
        }
        var normalized = key === 0 ? 0 : key;
        if (this.has(normalized)) {
            return this.get(normalized);
        }
        var value = callbackfn(normalized);
        this.set(normalized, value);
        return value;
    };
    // src/modules/es.map.group-by.ts
    var isSupported15 = function isSupported15() {
        try {
            return typeof Map.groupBy === "function";
        } catch (unused) {
            return false;
        }
    };
    var mapGroupBy = function mapGroupBy(items, callbackfn) {
        if (items == null) {
            throw new TypeError("Map.groupBy requires an iterable of items");
        }
        if (typeof callbackfn !== "function") {
            throw new TypeError("Map.groupBy callback is not a function");
        }
        var groups = /* @__PURE__ */ new Map();
        if (typeof Symbol !== "undefined" && Symbol.iterator && typeof items[Symbol.iterator] === "function") {
            var it = items[Symbol.iterator]();
            var index = 0;
            var step = it.next();
            while(!step.done){
                var key = callbackfn(step.value, index++);
                var normalized = key === 0 ? 0 : key;
                var existing = groups.get(normalized);
                if (existing) existing.push(step.value);
                else groups.set(normalized, [
                    step.value
                ]);
                step = it.next();
            }
            return groups;
        }
        if (typeof items.length === "number") {
            for(var i = 0; i < items.length; i++){
                var key1 = callbackfn(items[i], i);
                var normalized1 = key1 === 0 ? 0 : key1;
                var existing1 = groups.get(normalized1);
                if (existing1) existing1.push(items[i]);
                else groups.set(normalized1, [
                    items[i]
                ]);
            }
            return groups;
        }
        throw new TypeError("Map.groupBy argument is not iterable");
    };
    // src/modules/es.weak-map.get-or-insert.ts
    var isSupported16 = function isSupported16() {
        try {
            return typeof WeakMap !== "undefined" && typeof WeakMap.prototype.getOrInsert === "function";
        } catch (unused) {
            return false;
        }
    };
    var isRegisteredSymbol = function isRegisteredSymbol(value) {
        if (typeof Symbol === "undefined" || typeof Symbol.keyFor !== "function") return false;
        try {
            return Symbol.keyFor(value) !== void 0;
        } catch (unused) {
            return false;
        }
    };
    var weakMapGetOrInsert = function weakMapGetOrInsert(key, value) {
        var isPolyfilled = this !== null && typeof this === "object" && typeof this._id === "string" && this._id.indexOf("__wm$") === 0;
        if (!isPolyfilled && Object.prototype.toString.call(this) !== "[object WeakMap]") {
            throw new TypeError("WeakMap.prototype.getOrInsert called on incompatible receiver");
        }
        var keyKind = typeof key;
        var mightBeSymbol = keyKind === "symbol" || keyKind === "object" && key !== null && typeof key.__name__ === "string";
        var holdable = key !== null && (keyKind === "object" || keyKind === "function" || keyKind === "symbol") && !(mightBeSymbol && isRegisteredSymbol(key));
        if (!holdable) {
            throw new TypeError("Invalid value used as weak map key");
        }
        if (this.has(key)) {
            return this.get(key);
        }
        this.set(key, value);
        return value;
    };
    // src/modules/es.weak-map.get-or-insert-computed.ts
    var isSupported17 = function isSupported17() {
        try {
            return typeof WeakMap !== "undefined" && typeof WeakMap.prototype.getOrInsertComputed === "function";
        } catch (unused) {
            return false;
        }
    };
    var isRegisteredSymbol2 = function isRegisteredSymbol2(value) {
        if (typeof Symbol === "undefined" || typeof Symbol.keyFor !== "function") return false;
        try {
            return Symbol.keyFor(value) !== void 0;
        } catch (unused) {
            return false;
        }
    };
    var weakMapGetOrInsertComputed = function weakMapGetOrInsertComputed(key, callbackfn) {
        var isPolyfilled = this !== null && typeof this === "object" && typeof this._id === "string" && this._id.indexOf("__wm$") === 0;
        if (!isPolyfilled && Object.prototype.toString.call(this) !== "[object WeakMap]") {
            throw new TypeError("WeakMap.prototype.getOrInsertComputed called on incompatible receiver");
        }
        var keyKind = typeof key;
        var mightBeSymbol = keyKind === "symbol" || keyKind === "object" && key !== null && typeof key.__name__ === "string";
        var holdable = key !== null && (keyKind === "object" || keyKind === "function" || keyKind === "symbol") && !(mightBeSymbol && isRegisteredSymbol2(key));
        if (!holdable) {
            throw new TypeError("Invalid value used as weak map key");
        }
        if (typeof callbackfn !== "function") {
            throw new TypeError("WeakMap.prototype.getOrInsertComputed: callback is not callable");
        }
        if (this.has(key)) {
            return this.get(key);
        }
        var value = callbackfn(key);
        this.set(key, value);
        return value;
    };
    // src/modules/es.weak-set.ts
    var isSupported18 = function isSupported18() {
        try {
            var WeakSet3 = window.WeakSet;
            return typeof WeakSet3 === "function";
        } catch (unused) {
            return false;
        }
    };
    var SLOT6 = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var WeakSet2 = function WeakSet2() {
        if (arguments.length > 0 && arguments[0] !== null && arguments[0] !== void 0) {
            console.warn("[spackle] WeakSet: the iterable constructor argument is not implemented \u2014 starting empty; add() entries individually");
        }
        if (typeof WeakMap !== "undefined") {
            SLOT6.value = /* @__PURE__ */ new WeakMap();
            Object.defineProperty(this, "_map", SLOT6);
            SLOT6.value = void 0;
        } else {
            SLOT6.value = "_ws_".concat(Math.random().toString(36).substring(2));
            Object.defineProperty(this, "_id", SLOT6);
            SLOT6.value = void 0;
        }
    };
    WeakSet2.prototype.add = function(key) {
        if (this._map) {
            this._map.set(key, true);
        } else {
            Object.defineProperty(key, this._id, {
                configurable: true,
                enumerable: false,
                value: true,
                writable: false
            });
        }
        return this;
    };
    WeakSet2.prototype.has = function(key) {
        if (this._map) {
            return this._map.has(key);
        }
        return key[this._id] === true;
    };
    WeakSet2.prototype.delete = function(key) {
        if (this._map) {
            return this._map.delete(key);
        }
        if (key[this._id] === true) {
            delete key[this._id];
            return true;
        }
        return false;
    };
    // src/modules/es.function.has-instance.ts
    var hasInstanceKey = typeof Symbol !== "undefined" ? Symbol.hasInstance : void 0;
    var isSupported19 = function isSupported19() {
        try {
            return !hasInstanceKey || typeof Function.prototype[hasInstanceKey] === "function";
        } catch (unused) {
            return true;
        }
    };
    var functionHasInstance = function functionHasInstance(value) {
        if (typeof this !== "function") {
            return false;
        }
        if (value === null || typeof value !== "object" && typeof value !== "function") {
            return false;
        }
        var target = this.prototype;
        if (target === null || typeof target !== "object" && typeof target !== "function") {
            throw new TypeError("Function has non-object prototype in instanceof check");
        }
        var proto2 = Object.getPrototypeOf(value);
        while(proto2 !== null){
            if (proto2 === target) {
                return true;
            }
            proto2 = Object.getPrototypeOf(proto2);
        }
        return false;
    };
    var install12 = function install12() {
        if (hasInstanceKey) {
            Object.defineProperty(Function.prototype, hasInstanceKey, {
                configurable: true,
                value: functionHasInstance
            });
            try {
                Object.defineProperty(functionHasInstance, "name", {
                    value: "[Symbol.hasInstance]",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(functionHasInstance, "__polyfilled", {
                value: true
            });
        }
    };
    // src/modules/es.global-this.ts
    var isSupported20 = function isSupported20() {
        try {
            return typeof globalThis !== "undefined" && globalThis.globalThis === globalThis;
        } catch (unused) {
            return false;
        }
    };
    var install13 = function install13() {
        window.globalThis = window;
    };
    // src/modules/es.object.assign.ts
    var isSupported21 = function isSupported21() {
        try {
            if (typeof Object.assign !== "function") {
                return false;
            }
            if (typeof Object.defineProperty === "function") {
                var first = {};
                Object.defineProperty(first, "a", {
                    enumerable: true,
                    get: function get() {
                        Object.defineProperty(this, "b", {
                            value: 3,
                            enumerable: false
                        });
                        return 0;
                    }
                });
                if (Object.assign({
                    b: 1
                }, first, {
                    b: 2
                }).b !== 1) return false;
            }
            var ordered = {};
            var alphabet = "abcdefghijklmnopqrst";
            for(var i = 0; i < alphabet.length; i++)ordered[alphabet.charAt(i)] = i;
            if (Object.keys(Object.assign({}, ordered)).join("") !== alphabet) return false;
            if (typeof Symbol === "function" && typeof /* @__PURE__ */ Symbol("assign detection") === "symbol" && typeof Object.getOwnPropertySymbols === "function") {
                var symbol = /* @__PURE__ */ Symbol("assign detection");
                var source = {};
                source[symbol] = 7;
                if (Object.assign({}, source)[symbol] !== 7) return false;
            }
            return true;
        } catch (unused) {
            return false;
        }
    };
    var hasOwn = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    var nativeGetOwnPropertySymbols = Object.getOwnPropertySymbols;
    var NATIVE_SYMBOLS = typeof Symbol === "function" && typeof /* @__PURE__ */ Symbol() === "symbol" && typeof nativeGetOwnPropertySymbols === "function";
    var objectAssign = function objectAssign(target, _source) {
        if (target == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var to = Object(target);
        for(var index = 1; index < arguments.length; index++){
            var nextSource = arguments[index];
            if (nextSource == null) {
                continue;
            }
            for(var key in nextSource){
                if (hasOwn.call(nextSource, key)) {
                    to[key] = nextSource[key];
                }
            }
            if (NATIVE_SYMBOLS) {
                var symbols = nativeGetOwnPropertySymbols(Object(nextSource));
                for(var symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++){
                    var symbolKey = symbols[symbolIndex];
                    if (propIsEnumerable.call(nextSource, symbolKey)) {
                        to[symbolKey] = nextSource[symbolKey];
                    }
                }
            }
        }
        return to;
    };
    // src/modules/es.object.define-getter.ts
    var isSupported22 = function isSupported22() {
        try {
            return typeof Object.prototype.__defineGetter__ === "function";
        } catch (unused) {
            return false;
        }
    };
    var ACCESSOR = {
        get: void 0,
        enumerable: true,
        configurable: true
    };
    var objectDefineGetter = function objectDefineGetter(key, getter) {
        if (this === null || this === void 0) {
            throw new TypeError("Object.prototype.__defineGetter__ called on null or undefined");
        }
        if (typeof getter !== "function") {
            throw new TypeError("Getter must be a function");
        }
        ACCESSOR.get = getter;
        Object.defineProperty(Object(this), key, ACCESSOR);
        ACCESSOR.get = void 0;
    };
    // src/modules/es.object.define-setter.ts
    var isSupported23 = function isSupported23() {
        try {
            return typeof Object.prototype.__defineSetter__ === "function";
        } catch (unused) {
            return false;
        }
    };
    var ACCESSOR2 = {
        set: void 0,
        enumerable: true,
        configurable: true
    };
    var objectDefineSetter = function objectDefineSetter(key, setter) {
        if (this === null || this === void 0) {
            throw new TypeError("Object.prototype.__defineSetter__ called on null or undefined");
        }
        if (typeof setter !== "function") {
            throw new TypeError("Setter must be a function");
        }
        ACCESSOR2.set = setter;
        Object.defineProperty(Object(this), key, ACCESSOR2);
        ACCESSOR2.set = void 0;
    };
    // src/modules/es.object.entries.ts
    var isSupported24 = function isSupported24() {
        try {
            return typeof Object.entries === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectEntries = function objectEntries(obj) {
        if (obj == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var object = Object(obj);
        var keys = Object.keys(object);
        var pairs = [];
        for(var i = 0; i < keys.length; i++){
            pairs[pairs.length] = [
                keys[i],
                object[keys[i]]
            ];
        }
        return pairs;
    };
    // src/modules/es.object.freeze.ts
    var isSupported25 = function isSupported25() {
        try {
            var _Object;
            (_Object = Object) === null || _Object === void 0 ? void 0 : _Object.freeze(1);
            return true;
        } catch (unused) {
            return false;
        }
    };
    var nativeFreeze = Object.freeze;
    var objectFreeze = function objectFreeze(obj) {
        if (Object(obj) !== obj) return obj;
        return nativeFreeze(obj);
    };
    // src/modules/es.object.from-entries.ts
    var isSupported26 = function isSupported26() {
        try {
            return typeof Object.fromEntries === "function";
        } catch (unused) {
            return false;
        }
    };
    var ENTRY = {
        value: void 0,
        writable: true,
        enumerable: true,
        configurable: true
    };
    var ObjectPrototype = Object.prototype;
    var closeQuietly = function closeQuietly(iterator) {
        try {
            var ret = iterator.return;
            if (typeof ret === "function") ret.call(iterator);
        } catch (e) {}
    };
    var objectFromEntries = function objectFromEntries(iterable) {
        if (iterable === null || iterable === void 0) {
            throw new TypeError("Object.fromEntries requires an iterable");
        }
        var result = {};
        var iteratorKey = typeof Symbol !== "undefined" && Symbol.iterator ? Symbol.iterator : "@@iterator";
        var method = iterable[iteratorKey];
        if (Array.isArray(iterable) && method === Array.prototype.values) {
            for(var i = 0; i < iterable.length; i++){
                var entry = iterable[i];
                if (entry === null || typeof entry !== "object" && typeof entry !== "function") {
                    throw new TypeError("Iterator value " + String(entry) + " is not an entry object");
                }
                var key = entry[0];
                var value = entry[1];
                var propertyKey = typeof key === "symbol" ? key : String(key);
                if (!(propertyKey in ObjectPrototype)) {
                    result[propertyKey] = value;
                } else {
                    ENTRY.value = value;
                    Object.defineProperty(result, propertyKey, ENTRY);
                    ENTRY.value = void 0;
                }
            }
            return result;
        }
        if (typeof method !== "function") {
            throw new TypeError("Object.fromEntries requires an iterable");
        }
        var iterator = method.call(iterable);
        for(;;){
            var step = iterator.next();
            if (step.done) return result;
            var entry1 = step.value;
            if (entry1 === null || typeof entry1 !== "object" && typeof entry1 !== "function") {
                closeQuietly(iterator);
                throw new TypeError("Iterator value " + String(entry1) + " is not an entry object");
            }
            try {
                var key1 = entry1[0];
                var value1 = entry1[1];
                var propertyKey1 = typeof key1 === "symbol" ? key1 : String(key1);
                if (!(propertyKey1 in ObjectPrototype)) {
                    result[propertyKey1] = value1;
                } else {
                    ENTRY.value = value1;
                    Object.defineProperty(result, propertyKey1, ENTRY);
                    ENTRY.value = void 0;
                }
            } catch (error) {
                closeQuietly(iterator);
                throw error;
            }
        }
    };
    // src/modules/es.object.get-own-property-descriptor.ts
    var isSupported27 = function isSupported27() {
        try {
            var descriptor = Object.getOwnPropertyDescriptor("a", 0);
            return !!descriptor && descriptor.value === "a";
        } catch (unused) {
            return false;
        }
    };
    var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var objectGetOwnPropertyDescriptor = function objectGetOwnPropertyDescriptor(target, key) {
        if (target === null || target === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        return nativeGetOwnPropertyDescriptor(Object(target), key);
    };
    // src/modules/es.object.get-own-property-descriptors.ts
    var isSupported28 = function isSupported28() {
        try {
            return typeof Object.getOwnPropertyDescriptors === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeGetOwnPropertyNames = Object.getOwnPropertyNames;
    var nativeGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
    var nativeGetOwnPropertySymbols2 = Object.getOwnPropertySymbols;
    var objectGetOwnPropertyDescriptors = function objectGetOwnPropertyDescriptors(obj) {
        if (obj === null || obj === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var object = Object(obj);
        var keys = nativeGetOwnPropertyNames(object);
        var result = {};
        for(var i = 0; i < keys.length; i++){
            result[keys[i]] = nativeGetOwnPropertyDescriptor2(object, keys[i]);
        }
        if (typeof Symbol !== "undefined" && typeof nativeGetOwnPropertySymbols2 === "function") {
            var symbols = nativeGetOwnPropertySymbols2(object);
            for(var symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++){
                result[symbols[symbolIndex]] = nativeGetOwnPropertyDescriptor2(object, symbols[symbolIndex]);
            }
        }
        return result;
    };
    // src/modules/es.object.get-own-property-names.ts
    var isSupported29 = function isSupported29() {
        try {
            if (typeof Object.getOwnPropertyNames !== "function") {
                return false;
            }
            var names = Object.getOwnPropertyNames("ab");
            return !!names && names.indexOf("0") !== -1 && names.indexOf("length") !== -1;
        } catch (unused) {
            return false;
        }
    };
    var nativeGetOwnPropertyNames2 = Object.getOwnPropertyNames;
    var objectGetOwnPropertyNames = function objectGetOwnPropertyNames(target) {
        if (target === null || target === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        return nativeGetOwnPropertyNames2(Object(target));
    };
    // src/modules/es.object.get-prototype-of.ts
    var isSupported30 = function isSupported30() {
        try {
            if (typeof Object.getPrototypeOf !== "function") {
                return false;
            }
            return Object.getPrototypeOf("a") === String.prototype;
        } catch (unused) {
            return false;
        }
    };
    var nativeGetPrototypeOf = Object.getPrototypeOf;
    var objectGetPrototypeOf = function objectGetPrototypeOf(target) {
        if (target === null || target === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        return nativeGetPrototypeOf(Object(target));
    };
    // src/modules/es.object.group-by.ts
    var isSupported31 = function isSupported31() {
        try {
            return typeof Object.groupBy === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectGroupBy = function objectGroupBy(items, callbackfn) {
        if (items == null) {
            throw new TypeError("Object.groupBy requires an iterable of items");
        }
        if (typeof callbackfn !== "function") {
            throw new TypeError("Object.groupBy callback is not a function");
        }
        var groups = /* @__PURE__ */ Object.create(null);
        if (typeof Symbol !== "undefined" && Symbol.iterator && typeof items[Symbol.iterator] === "function") {
            var it = items[Symbol.iterator]();
            var index = 0;
            var step = it.next();
            while(!step.done){
                var key = callbackfn(step.value, index++);
                var propertyKey = typeof key === "symbol" ? key : String(key);
                if (groups[propertyKey]) groups[propertyKey].push(step.value);
                else groups[propertyKey] = [
                    step.value
                ];
                step = it.next();
            }
            return groups;
        }
        if (typeof items.length === "number") {
            for(var i = 0; i < items.length; i++){
                var key1 = callbackfn(items[i], i);
                var propertyKey1 = typeof key1 === "symbol" ? key1 : String(key1);
                if (groups[propertyKey1]) groups[propertyKey1].push(items[i]);
                else groups[propertyKey1] = [
                    items[i]
                ];
            }
            return groups;
        }
        throw new TypeError("Object.groupBy argument is not iterable");
    };
    // src/modules/es.object.has-own.ts
    var isSupported32 = function isSupported32() {
        try {
            return typeof Object.hasOwn === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeHasOwnProperty = Object.prototype.hasOwnProperty;
    var objectHasOwn = function objectHasOwn(target, key) {
        if (target === null || target === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        return nativeHasOwnProperty.call(Object(target), key);
    };
    // src/modules/es.object.is.ts
    var isSupported33 = function isSupported33() {
        try {
            return typeof Object.is === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectIs = function objectIs(first, second) {
        if (first === second) {
            return first !== 0 || 1 / first === 1 / second;
        }
        return first !== first && second !== second;
    };
    // src/modules/es.object.is-extensible.ts
    var isSupported34 = function isSupported34() {
        try {
            return Object.isExtensible(1) === false;
        } catch (unused) {
            return false;
        }
    };
    var nativeIsExtensible = Object.isExtensible;
    var objectIsExtensible = function objectIsExtensible(target) {
        if (target === null || typeof target !== "object" && typeof target !== "function") {
            return false;
        }
        return nativeIsExtensible ? nativeIsExtensible(target) : true;
    };
    // src/modules/es.object.is-frozen.ts
    var isSupported35 = function isSupported35() {
        try {
            return Object.isFrozen(1) === true;
        } catch (unused) {
            return false;
        }
    };
    var nativeIsFrozen = Object.isFrozen;
    var objectIsFrozen = function objectIsFrozen(target) {
        if (target === null || typeof target !== "object" && typeof target !== "function") {
            return true;
        }
        return nativeIsFrozen ? nativeIsFrozen(target) : false;
    };
    // src/modules/es.object.is-sealed.ts
    var isSupported36 = function isSupported36() {
        try {
            return Object.isSealed(1) === true;
        } catch (unused) {
            return false;
        }
    };
    var nativeIsSealed = Object.isSealed;
    var objectIsSealed = function objectIsSealed(target) {
        if (target === null || typeof target !== "object" && typeof target !== "function") {
            return true;
        }
        return nativeIsSealed ? nativeIsSealed(target) : false;
    };
    // src/modules/es.object.keys.ts
    var isSupported37 = function isSupported37() {
        try {
            if (typeof Object.keys !== "function") {
                return false;
            }
            var keys = Object.keys("ab");
            return !!keys && keys.length === 2 && keys[0] === "0" && keys[1] === "1";
        } catch (unused) {
            return false;
        }
    };
    var nativeKeys = typeof Object.keys === "function" ? Object.keys : null;
    var objectKeys = function objectKeys(target) {
        if (target === null || target === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var object = Object(target);
        if (nativeKeys) {
            return nativeKeys(object);
        }
        var keys = [];
        for(var key in object){
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                keys.push(key);
            }
        }
        return keys;
    };
    // src/modules/es.object.lookup-getter.ts
    var isSupported38 = function isSupported38() {
        try {
            return typeof Object.prototype.__lookupGetter__ === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectLookupGetter = function objectLookupGetter(key) {
        if (this === null || this === void 0) {
            throw new TypeError("Object.prototype.__lookupGetter__ called on null or undefined");
        }
        var object = Object(this);
        var propertyKey = typeof key === "symbol" ? key : String(key);
        do {
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyKey);
            if (descriptor) {
                return descriptor.get;
            }
            object = Object.getPrototypeOf(object);
        }while (object !== null);
        return void 0;
    };
    // src/modules/es.object.lookup-setter.ts
    var isSupported39 = function isSupported39() {
        try {
            return typeof Object.prototype.__lookupSetter__ === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectLookupSetter = function objectLookupSetter(key) {
        if (this === null || this === void 0) {
            throw new TypeError("Object.prototype.__lookupSetter__ called on null or undefined");
        }
        var object = Object(this);
        var propertyKey = typeof key === "symbol" ? key : String(key);
        do {
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyKey);
            if (descriptor) {
                return descriptor.set;
            }
            object = Object.getPrototypeOf(object);
        }while (object !== null);
        return void 0;
    };
    // src/modules/es.object.prevent-extensions.ts
    var isSupported40 = function isSupported40() {
        try {
            return Object.preventExtensions(1) === 1;
        } catch (unused) {
            return false;
        }
    };
    var nativePreventExtensions = Object.preventExtensions;
    var objectPreventExtensions = function objectPreventExtensions(target) {
        if (target === null || typeof target !== "object" && typeof target !== "function") {
            return target;
        }
        return nativePreventExtensions ? nativePreventExtensions(target) : target;
    };
    // src/modules/es.object.seal.ts
    var isSupported41 = function isSupported41() {
        try {
            return Object.seal(1) === 1;
        } catch (unused) {
            return false;
        }
    };
    var nativeSeal = Object.seal;
    var objectSeal = function objectSeal(target) {
        if (target === null || typeof target !== "object" && typeof target !== "function") {
            return target;
        }
        return nativeSeal ? nativeSeal(target) : target;
    };
    // src/modules/es.object.set-prototype-of.ts
    var isSupported42 = function isSupported42() {
        try {
            return typeof Object.setPrototypeOf === "function";
        } catch (unused) {
            return false;
        }
    };
    var protoSetterWorks = function() {
        try {
            var probe = {};
            probe.__proto__ = Array.prototype;
            return probe instanceof Array;
        } catch (unused) {
            return false;
        }
    }();
    var protoSetter = function() {
        try {
            var descriptor = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
            return descriptor && typeof descriptor.set === "function" ? descriptor.set : null;
        } catch (unused) {
            return null;
        }
    }();
    var objectSetPrototypeOf = function objectSetPrototypeOf(target, proto2) {
        if (target === null || target === void 0) {
            throw new TypeError("Object.setPrototypeOf called on null or undefined");
        }
        if (proto2 !== null && typeof proto2 !== "object" && typeof proto2 !== "function") {
            throw new TypeError("Object prototype may only be an Object or null: " + proto2);
        }
        if (typeof target !== "object" && typeof target !== "function") {
            return target;
        }
        if (protoSetter) {
            protoSetter.call(target, proto2);
        } else if (protoSetterWorks) {
            target.__proto__ = proto2;
        }
        if (Object.getPrototypeOf(target) !== proto2) {
            throw new TypeError("Object.setPrototypeOf: cannot set the prototype of this object");
        }
        return target;
    };
    // src/modules/es.object.values.ts
    var isSupported43 = function isSupported43() {
        try {
            return typeof Object.values === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectValues = function objectValues(obj) {
        if (obj == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var object = Object(obj);
        var keys = Object.keys(object);
        var values = [];
        for(var i = 0; i < keys.length; i++){
            values[values.length] = object[keys[i]];
        }
        return values;
    };
    // src/modules/es.reflect.to-string-tag.ts
    var tagKey2 = typeof Symbol !== "undefined" ? Symbol.toStringTag : void 0;
    var isSupported44 = function isSupported44() {
        try {
            return !tagKey2 || typeof Reflect === "undefined" || Reflect[tagKey2] === "Reflect";
        } catch (unused) {
            return true;
        }
    };
    var install14 = function install14() {
        if (tagKey2 && typeof Reflect !== "undefined") {
            Object.defineProperty(Reflect, tagKey2, {
                configurable: true,
                value: "Reflect"
            });
        }
    };
    // src/modules/es.array.at.ts
    var isSupported45 = function isSupported45() {
        try {
            return typeof Array.prototype.at === "function";
        } catch (unused) {
            return false;
        }
    };
    var MAX_SAFE_LENGTH = 9007199254740991;
    var min = Math.min;
    var ceil = Math.ceil;
    var floor = Math.floor;
    var arrayAt = function arrayAt(index) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.at called on null or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length === 0 ? 0 : length < 0 ? ceil(length) : floor(length);
        length = length > 0 ? min(length, MAX_SAFE_LENGTH) : 0;
        var k = +index;
        k = k !== k || k === 0 ? 0 : k < 0 ? ceil(k) : floor(k);
        if (k < 0) k = length + k;
        if (k < 0 || k >= length) {
            return void 0;
        }
        return object[k];
    };
    // src/modules/es.array.concat.ts
    var isSupported46 = function isSupported46() {
        try {
            if (typeof Array.prototype.concat !== "function") {
                return false;
            }
            var symbols = typeof Symbol !== "undefined" ? Symbol : void 0;
            var key = symbols && symbols.isConcatSpreadable;
            if (!key) {
                return false;
            }
            var blocked = [
                1,
                2
            ];
            blocked[key] = false;
            if ([
                0
            ].concat(blocked).length !== 2) {
                return false;
            }
            var forced = {
                length: 2,
                0: 1,
                1: 2
            };
            forced[key] = true;
            if ([
                0
            ].concat(forced).length !== 3) {
                return false;
            }
            return true;
        } catch (unused) {
            return false;
        }
    };
    var arrayConcat = function arrayConcat() {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.concat called on null or undefined");
        }
        var object = Object(this);
        var result;
        if (!Array.isArray(object)) {
            result = new Array(0);
        } else {
            var ctor = object.constructor;
            if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
                var species = ctor[Symbol.species];
                ctor = species == null ? void 0 : species;
            }
            if (ctor === void 0 || ctor === Array) {
                result = new Array(0);
            } else {
                if (typeof ctor !== "function") throw new TypeError("constructor property is not a constructor");
                result = new ctor(0);
            }
        }
        var out = 0;
        var source = object;
        var argIndex = 0;
        while(true){
            var spreadable = false;
            if (source !== null && (typeof source === "object" || typeof source === "function")) {
                var flag = typeof Symbol !== "undefined" && Symbol.isConcatSpreadable ? source[Symbol.isConcatSpreadable] : void 0;
                spreadable = flag !== void 0 ? !!flag : Array.isArray(source);
            }
            if (spreadable) {
                var length = +source.length;
                length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
                for(var i = 0; i < length; i++){
                    if (i in source) {
                        result[out] = source[i];
                    }
                    out++;
                }
            } else {
                result[out++] = source;
            }
            if (argIndex >= arguments.length) {
                break;
            }
            source = arguments[argIndex++];
        }
        result.length = out;
        return result;
    };
    // src/modules/es.array.copy-within.ts
    var isSupported47 = function isSupported47() {
        try {
            return typeof Array.prototype.copyWithin === "function";
        } catch (unused) {
            return false;
        }
    };
    var MAX_SAFE_LENGTH2 = 9007199254740991;
    var max = Math.max;
    var min2 = Math.min;
    var ceil2 = Math.ceil;
    var floor2 = Math.floor;
    var arrayCopyWithin = function arrayCopyWithin(target, start, end) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.copyWithin called on null or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length === 0 ? 0 : length < 0 ? ceil2(length) : floor2(length);
        length = length > 0 ? min2(length, MAX_SAFE_LENGTH2) : 0;
        var to = +target;
        to = to !== to || to === 0 ? 0 : to < 0 ? ceil2(to) : floor2(to);
        to = to < 0 ? max(to + length, 0) : min2(to, length);
        var from = +start;
        from = from !== from || from === 0 ? 0 : from < 0 ? ceil2(from) : floor2(from);
        from = from < 0 ? max(from + length, 0) : min2(from, length);
        var final = length;
        if (end !== void 0) {
            final = +end;
            final = final !== final || final === 0 ? 0 : final < 0 ? ceil2(final) : floor2(final);
            final = final < 0 ? max(final + length, 0) : min2(final, length);
        }
        var count = min2(final - from, length - to);
        var direction = 1;
        if (from < to && to < from + count) {
            direction = -1;
            from += count - 1;
            to += count - 1;
        }
        while(count-- > 0){
            if (from in object) object[to] = object[from];
            else if (!delete object[to]) throw new TypeError("Cannot delete property");
            to += direction;
            from += direction;
        }
        return object;
    };
    // src/modules/es.array.every.ts
    var isSupported48 = function isSupported48() {
        try {
            var method = Array.prototype.every;
            if (typeof method !== "function") return false;
            try {
                method.call(null, function() {
                    return 1;
                }, 1);
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var arrayEvery = function every(callbackfn) {
        if (this === null || this === void 0) throw new TypeError("Cannot convert undefined or null to object");
        var O = Object(this);
        var thisArg = arguments.length > 1 ? arguments[1] : void 0;
        var length = +O.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        for(var index = 0; index < length; index++){
            if (index in O) {
                if (!callbackfn.call(thisArg, O[index], index, O)) return false;
            }
        }
        return true;
    };
    // src/modules/es.array.fill.ts
    var isSupported49 = function isSupported49() {
        try {
            return typeof Array.prototype.fill === "function";
        } catch (unused) {
            return false;
        }
    };
    var MAX_SAFE_LENGTH3 = 9007199254740991;
    var max2 = Math.max;
    var min3 = Math.min;
    var ceil3 = Math.ceil;
    var floor3 = Math.floor;
    var arrayFill = function arrayFill(value, start, end) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.fill called on null or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length === 0 ? 0 : length < 0 ? ceil3(length) : floor3(length);
        length = length > 0 ? min3(length, MAX_SAFE_LENGTH3) : 0;
        var index = +start;
        index = index !== index || index === 0 ? 0 : index < 0 ? ceil3(index) : floor3(index);
        index = index < 0 ? max2(index + length, 0) : min3(index, length);
        var endPosition = length;
        if (end !== void 0) {
            endPosition = +end;
            endPosition = endPosition !== endPosition || endPosition === 0 ? 0 : endPosition < 0 ? ceil3(endPosition) : floor3(endPosition);
            endPosition = endPosition < 0 ? max2(endPosition + length, 0) : min3(endPosition, length);
        }
        while(endPosition > index)object[index++] = value;
        return object;
    };
    // src/modules/es.array.filter.ts
    var isSupported50 = function isSupported50() {
        try {
            return typeof Array.prototype.filter === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayFilter = function arrayFilter(callback, thisArg) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.filter called on null or undefined");
        }
        if (typeof callback !== "function") {
            throw new TypeError("callback is not a function");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var result;
        if (!Array.isArray(object)) {
            result = new Array(0);
        } else {
            var ctor = object.constructor;
            if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
                var species = ctor[Symbol.species];
                ctor = species == null ? void 0 : species;
            }
            if (ctor === void 0 || ctor === Array) {
                result = new Array(0);
            } else {
                if (typeof ctor !== "function") throw new TypeError("constructor property is not a constructor");
                result = new ctor(0);
            }
        }
        var out = 0;
        for(var i = 0; i < length; i++){
            if (i in object) {
                var value = object[i];
                if (callback.call(thisArg, value, i, object)) {
                    result[out++] = value;
                }
            }
        }
        return result;
    };
    // src/modules/es.array.find.ts
    var isSupported51 = function isSupported51() {
        try {
            return typeof Array.prototype.find === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayFind = function arrayFind(predicate, thisArg) {
        if (typeof predicate !== "function") {
            throw new TypeError("Array.prototype.find: predicate must be a function");
        }
        var length = +this.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        for(var i = 0; i < length; i++){
            var value = this[i];
            if (predicate.call(thisArg, value, i, this)) {
                return value;
            }
        }
        return void 0;
    };
    // src/modules/es.array.find-index.ts
    var isSupported52 = function isSupported52() {
        try {
            return typeof Array.prototype.findIndex === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayFindIndex = function arrayFindIndex(predicate, thisArg) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.findIndex called on null or undefined");
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        for(var i = 0; i < length; i++){
            if (predicate.call(thisArg, object[i], i, object)) {
                return i;
            }
        }
        return -1;
    };
    // src/modules/es.array.find-last.ts
    var isSupported53 = function isSupported53() {
        try {
            return typeof Array.prototype.findLast === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayFindLast = function arrayFindLast(predicate, thisArg) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.findLast called on null or undefined");
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        for(var i = length - 1; i >= 0; i--){
            if (predicate.call(thisArg, object[i], i, object)) {
                return object[i];
            }
        }
        return void 0;
    };
    // src/modules/es.array.find-last-index.ts
    var isSupported54 = function isSupported54() {
        try {
            return typeof Array.prototype.findLastIndex === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayFindLastIndex = function arrayFindLastIndex(predicate, thisArg) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.findLastIndex called on null or undefined");
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        for(var i = length - 1; i >= 0; i--){
            if (predicate.call(thisArg, object[i], i, object)) {
                return i;
            }
        }
        return -1;
    };
    // src/modules/es.array.flat.ts
    var isSupported55 = function isSupported55() {
        try {
            return typeof Array.prototype.flat === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeIsArray = Array.isArray;
    var arrayFlat = function arrayFlat(depth) {
        var startDepth = 1;
        if (depth !== void 0) {
            startDepth = +depth;
            startDepth = startDepth !== startDepth ? 0 : startDepth < 0 ? Math.ceil(startDepth) : Math.floor(startDepth);
        }
        var result = [];
        var rootLength = +this.length;
        rootLength = rootLength !== rootLength || rootLength <= 0 ? 0 : rootLength > 9007199254740991 ? 9007199254740991 : Math.floor(rootLength);
        var stack = [
            {
                array: this,
                index: 0,
                length: rootLength,
                depth: startDepth
            }
        ];
        while(stack.length > 0){
            var frame = stack[stack.length - 1];
            if (frame.index >= frame.length) {
                stack.pop();
                continue;
            }
            var currentIndex = frame.index++;
            if (!(currentIndex in frame.array)) {
                continue;
            }
            var value = frame.array[currentIndex];
            if (frame.depth > 0 && nativeIsArray(value)) {
                var innerLength = +value.length;
                innerLength = innerLength !== innerLength || innerLength <= 0 ? 0 : innerLength > 9007199254740991 ? 9007199254740991 : Math.floor(innerLength);
                stack.push({
                    array: value,
                    index: 0,
                    length: innerLength,
                    depth: frame.depth - 1
                });
            } else {
                result[result.length] = value;
            }
        }
        return result;
    };
    // src/modules/es.array.flat-map.ts
    var isSupported56 = function isSupported56() {
        try {
            return typeof Array.prototype.flatMap === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeIsArray2 = Array.isArray;
    var arrayFlatMap = function arrayFlatMap(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Array.prototype.flatMap: callback must be a function");
        }
        var length = +this.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var result = [];
        for(var i = 0; i < length; i++){
            if (!(i in this)) {
                continue;
            }
            var mapped = callback.call(thisArg, this[i], i, this);
            if (nativeIsArray2(mapped)) {
                for(var j = 0, mappedLength = mapped.length; j < mappedLength; j++){
                    if (j in mapped) {
                        result[result.length] = mapped[j];
                    }
                }
            } else {
                result[result.length] = mapped;
            }
        }
        return result;
    };
    // src/modules/es.array.for-each.ts
    var isSupported57 = function isSupported57() {
        try {
            var method = Array.prototype.forEach;
            if (typeof method !== "function") return false;
            try {
                method.call(null, function() {
                    return 1;
                }, 1);
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var arrayForEach = function forEach(callbackfn) {
        if (this === null || this === void 0) throw new TypeError("Cannot convert undefined or null to object");
        var O = Object(this);
        var thisArg = arguments.length > 1 ? arguments[1] : void 0;
        var length = +O.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        for(var index = 0; index < length; index++){
            if (index in O) {
                callbackfn.call(thisArg, O[index], index, O);
            }
        }
    };
    // src/modules/es.array.from.ts
    var isSupported58 = function isSupported58() {
        try {
            if (typeof Array.from !== "function") return false;
            var iteratorKey = typeof Symbol !== "undefined" && Symbol.iterator ? Symbol.iterator : "@@iterator";
            var stepped = false;
            var nextCalls = 0;
            var closed = false;
            var iterable = {};
            iterable[iteratorKey] = function() {
                return {
                    next: function next() {
                        nextCalls++;
                        stepped = true;
                        return {
                            value: 1,
                            done: nextCalls > 1
                        };
                    },
                    return: function _return() {
                        closed = true;
                        return {
                            value: void 0,
                            done: true
                        };
                    }
                };
            };
            try {
                Array.from(iterable, function() {
                    throw new Error("Array.from probe");
                });
            } catch (e) {}
            return stepped && closed;
        } catch (unused) {
            return false;
        }
    };
    var warnedAstralSplit = false;
    var arrayFrom = function arrayFrom(source, mapFn, thisArg) {
        if (source === null || source === void 0) {
            throw new TypeError("Array.from requires an array-like or iterable object");
        }
        if (mapFn !== void 0 && typeof mapFn !== "function") {
            throw new TypeError("Array.from: when provided, the second argument must be a function");
        }
        var Ctor = this;
        var useCtor = typeof Ctor === "function" && Ctor !== Array;
        var iteratorMethod = typeof Symbol !== "undefined" && Symbol.iterator && source[Symbol.iterator] || source["@@iterator"];
        if (typeof iteratorMethod === "function") {
            var result2 = useCtor ? new Ctor() : [];
            var iterator = iteratorMethod.call(source);
            var index = 0;
            for(var step = iterator.next(); !step.done; step = iterator.next()){
                var value = step.value;
                try {
                    result2[index] = mapFn ? mapFn.call(thisArg, value, index) : value;
                } catch (error) {
                    if (typeof iterator.return === "function") {
                        try {
                            iterator.return();
                        } catch (unused) {}
                    }
                    throw error;
                }
                index++;
            }
            result2.length = index;
            return result2;
        }
        if (typeof source === "string" && !warnedAstralSplit && /[\uD800-\uDFFF]/.test(source)) {
            warnedAstralSplit = true;
            console.warn("[spackle] Array.from: no Symbol.iterator on this engine, so strings split by UTF-16 unit \u2014 astral characters break into surrogate halves");
        }
        var arrayLike = source;
        var length = +arrayLike.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var result = useCtor ? new Ctor(length) : [];
        for(var i = 0; i < length; i++){
            if (mapFn) {
                result[i] = mapFn.call(thisArg, arrayLike[i], i);
            } else {
                result[i] = arrayLike[i];
            }
        }
        result.length = length;
        return result;
    };
    // src/modules/es.array.from-async.ts
    var isSupported59 = function isSupported59() {
        try {
            return typeof Array.fromAsync === "function";
        } catch (unused) {
            return false;
        }
    };
    var PUT = {
        value: void 0,
        writable: true,
        enumerable: true,
        configurable: true
    };
    var arrayFromAsync = function arrayFromAsync(source, mapFn, thisArg) {
        var C = this;
        if (typeof Promise === "undefined") {
            throw new TypeError("Array.fromAsync requires Promise");
        }
        if (mapFn !== void 0 && typeof mapFn !== "function") {
            return Promise.reject(new TypeError("mapfn is not a function"));
        }
        if (source === null || source === void 0) {
            return Promise.reject(new TypeError("Array.fromAsync called on null or undefined"));
        }
        var asyncIteratorKey = typeof Symbol !== "undefined" ? Symbol.asyncIterator : void 0;
        var iteratorKey = typeof Symbol !== "undefined" ? Symbol.iterator : void 0;
        var boxed = Object(source);
        var out = typeof C === "function" ? new C() : [];
        var index = 0;
        var put = function put(position, value) {
            PUT.value = value;
            Object.defineProperty(out, String(position), PUT);
            PUT.value = void 0;
        };
        var finish = function finish() {
            if (!Array.isArray(out)) out.length = index;
            return out;
        };
        var collect2 = function collect2(value) {
            return Promise.resolve(value).then(function(awaited) {
                if (mapFn === void 0) {
                    put(index, awaited);
                    return void 0;
                }
                return Promise.resolve(mapFn.call(thisArg, awaited, index)).then(function(mapped) {
                    put(index, mapped);
                    return void 0;
                });
            });
        };
        var iterator;
        var isAsync = false;
        if (asyncIteratorKey && typeof boxed[asyncIteratorKey] === "function") {
            iterator = boxed[asyncIteratorKey]();
            isAsync = true;
        } else if (iteratorKey && typeof boxed[iteratorKey] === "function") {
            iterator = boxed[iteratorKey]();
        }
        if (iterator) {
            var step2 = function step21() {
                return Promise.resolve(iterator.next()).then(function(result) {
                    if (!result || typeof result !== "object") {
                        throw new TypeError("iterator result is not an object");
                    }
                    if (result.done) {
                        return finish();
                    }
                    return collect2(result.value).then(function() {
                        index++;
                        return step2();
                    });
                });
            };
            return Promise.resolve().then(step2).then(void 0, function(error) {
                try {
                    var method = iterator.return;
                    if (typeof method === "function") {
                        var closed = method.call(iterator);
                        if (isAsync) return Promise.resolve(closed).then(function() {
                            throw error;
                        });
                    }
                } catch (unused) {}
                throw error;
            });
        }
        var length = boxed.length >>> 0;
        var step = function step1() {
            if (index >= length) {
                return finish();
            }
            return collect2(boxed[index]).then(function() {
                index++;
                return step();
            });
        };
        return Promise.resolve().then(step);
    };
    // src/modules/es.array.includes.ts
    var isSupported60 = function isSupported60() {
        try {
            return typeof Array.prototype.includes === "function";
        } catch (unused) {
            return false;
        }
    };
    var MAX_SAFE_LENGTH4 = 9007199254740991;
    var floor4 = Math.floor;
    var arrayIncludes = function arrayIncludes(searchElement, fromIndex) {
        var length = +this.length;
        length = length !== length || length <= 0 ? 0 : length > MAX_SAFE_LENGTH4 ? MAX_SAFE_LENGTH4 : floor4(length);
        if (length === 0) {
            return false;
        }
        var position = 0;
        if (fromIndex !== void 0) {
            position = +fromIndex;
        }
        if (position !== position) {
            position = 0;
        }
        if (position >= 0) {
            position = Math.floor(position);
        } else {
            position = Math.ceil(position);
        }
        var start = position;
        if (position < 0) {
            start = length + position;
        }
        if (start < 0) {
            start = 0;
        }
        for(var i = start; i < length; i++){
            var element = this[i];
            if (element === searchElement || // SameValueZero: NaN matches NaN.
            element !== element && searchElement !== searchElement) {
                return true;
            }
        }
        return false;
    };
    // src/modules/es.array.index-of.ts
    var isSupported61 = function isSupported61() {
        try {
            return typeof Array.prototype.indexOf === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayIndexOf = function arrayIndexOf(searchElement, fromIndex) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.indexOf called on null or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        if (length === 0) {
            return -1;
        }
        var start = +fromIndex;
        start = start !== start ? 0 : start < 0 ? Math.ceil(start) : Math.floor(start);
        if (start >= length) {
            return -1;
        }
        if (start < 0) {
            start = Math.max(length + start, 0);
        }
        for(var i = start; i < length; i++){
            if (i in object && object[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    // src/modules/es.array.iterator.ts
    var returnSelf3 = function returnSelf3() {
        return this;
    };
    var ArrayIteratorPrototype = {};
    ArrayIteratorPrototype.next = function() {
        var object = this._object;
        if (object === null) {
            return {
                value: void 0,
                done: true
            };
        }
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        if (this._index >= length) {
            this._object = null;
            return {
                value: void 0,
                done: true
            };
        }
        var index = this._index++;
        var kind = this._kind;
        if (kind === "keys") {
            return {
                value: index,
                done: false
            };
        }
        if (kind === "values") {
            return {
                value: object[index],
                done: false
            };
        }
        return {
            value: [
                index,
                object[index]
            ],
            done: false
        };
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
        Object.defineProperty(ArrayIteratorPrototype, Symbol.iterator, {
            value: returnSelf3,
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    var arrayKeys = function arrayKeys() {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.keys called on null or undefined");
        }
        var iterator = Object.create(ArrayIteratorPrototype);
        iterator._object = Object(this);
        iterator._index = 0;
        iterator._kind = "keys";
        return iterator;
    };
    var arrayValues = function arrayValues() {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.values called on null or undefined");
        }
        var iterator = Object.create(ArrayIteratorPrototype);
        iterator._object = Object(this);
        iterator._index = 0;
        iterator._kind = "values";
        return iterator;
    };
    var arrayEntries = function arrayEntries() {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.entries called on null or undefined");
        }
        var iterator = Object.create(ArrayIteratorPrototype);
        iterator._object = Object(this);
        iterator._index = 0;
        iterator._kind = "entries";
        return iterator;
    };
    var install15 = function install15() {
        if (typeof Array.prototype.keys !== "function") {
            Object.defineProperty(Array.prototype, "keys", {
                value: arrayKeys,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(Array.prototype.keys, "name", {
                    value: "keys",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(Array.prototype.keys, "__polyfilled", {
                value: true
            });
        }
        if (typeof Array.prototype.values !== "function") {
            Object.defineProperty(Array.prototype, "values", {
                value: arrayValues,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(Array.prototype.values, "name", {
                    value: "values",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(Array.prototype.values, "__polyfilled", {
                value: true
            });
        }
        if (typeof Array.prototype.entries !== "function") {
            Object.defineProperty(Array.prototype, "entries", {
                value: arrayEntries,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(Array.prototype.entries, "name", {
                    value: "entries",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(Array.prototype.entries, "__polyfilled", {
                value: true
            });
        }
        if (typeof Symbol !== "undefined" && Symbol.iterator && !Array.prototype[Symbol.iterator]) {
            Object.defineProperty(Array.prototype, Symbol.iterator, {
                value: Array.prototype.values,
                writable: true,
                enumerable: false,
                configurable: true
            });
        }
    };
    // src/modules/es.array.join.ts
    var nativeJoin = Array.prototype.join;
    var isSupported62 = function isSupported62() {
        try {
            if (typeof nativeJoin !== "function") return false;
            if (!Object("z").propertyIsEnumerable(0)) return false;
            try {
                nativeJoin.call(null, ",");
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var arrayJoin = function join(separator) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.join called on null or undefined");
        }
        var object = typeof this === "string" ? this.split("") : Object(this);
        return nativeJoin.call(object, separator === void 0 ? "," : separator);
    };
    // src/modules/es.array.last-index-of.ts
    var isSupported63 = function isSupported63() {
        try {
            return typeof Array.prototype.lastIndexOf === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayLastIndexOf = function arrayLastIndexOf(searchElement) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.lastIndexOf called on null or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        if (length === 0) {
            return -1;
        }
        var start = length - 1;
        if (arguments.length > 1) {
            start = +arguments[1];
            start = start !== start ? 0 : start < 0 ? Math.ceil(start) : Math.floor(start);
        }
        if (start >= 0) {
            start = Math.min(start, length - 1);
        } else {
            start = length + start;
        }
        for(var i = start; i >= 0; i--){
            if (i in object && object[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    // src/modules/es.array.map.ts
    var isSupported64 = function isSupported64() {
        try {
            return typeof Array.prototype.map === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayMap = function arrayMap(callback, thisArg) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.map called on null or undefined");
        }
        if (typeof callback !== "function") {
            throw new TypeError("callback is not a function");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var result;
        if (!Array.isArray(object)) {
            result = new Array(length);
        } else {
            var ctor = object.constructor;
            if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
                var species = ctor[Symbol.species];
                ctor = species == null ? void 0 : species;
            }
            if (ctor === void 0 || ctor === Array) {
                result = new Array(length);
            } else {
                if (typeof ctor !== "function") throw new TypeError("constructor property is not a constructor");
                result = new ctor(length);
            }
        }
        for(var i = 0; i < length; i++){
            if (i in object) {
                result[i] = callback.call(thisArg, object[i], i, object);
            }
        }
        return result;
    };
    // src/modules/es.array.of.ts
    var isSupported65 = function isSupported65() {
        try {
            if (typeof Array.of !== "function") return false;
            var Sub = function Sub() {};
            var result = Array.of.call(Sub, 1, 2);
            return result instanceof Sub && result.length === 2 && result[0] === 1 && result[1] === 2;
        } catch (unused) {
            return false;
        }
    };
    var arrayOf = function arrayOf() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        var Ctor = this;
        if (typeof Ctor !== "function" || Ctor === Array) return args;
        var result = new Ctor(args.length);
        for(var i = 0; i < args.length; i++){
            result[i] = args[i];
        }
        result.length = args.length;
        return result;
    };
    // src/modules/es.array.push.ts
    var nativePush = Array.prototype.push;
    var isSupported66 = function isSupported66() {
        try {
            if (typeof nativePush !== "function") return false;
            if (nativePush.call({
                length: 4294967296
            }, 1) !== 4294967297) return false;
            try {
                Object.defineProperty([], "length", {
                    writable: false
                }).push();
                return false;
            } catch (error) {
                return error instanceof TypeError;
            }
        } catch (unused) {
            return false;
        }
    };
    var arrayPush = function push() {
        if (this === null || this === void 0) throw new TypeError("Cannot convert undefined or null to object");
        var O = Object(this);
        var len = +O.length;
        len = len !== len || len <= 0 ? 0 : len > 9007199254740991 ? 9007199254740991 : Math.floor(len);
        var argCount = arguments.length;
        if (len + argCount > 9007199254740991) throw new TypeError("Maximum allowed index exceeded");
        for(var i = 0; i < argCount; i++){
            O[len] = arguments[i];
            len++;
        }
        O.length = len;
        if (O.length !== len && Array.isArray(O)) throw new TypeError("Cannot set read only .length");
        return len;
    };
    // src/modules/es.array.reduce.ts
    var isSupported67 = function isSupported67() {
        try {
            return typeof Array.prototype.reduce === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayReduce = function arrayReduce(callback, initialValue) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.reduce called on null or undefined");
        }
        if (typeof callback !== "function") {
            throw new TypeError("callback is not a function");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var accumulator;
        var index = 0;
        if (arguments.length > 1) {
            accumulator = initialValue;
        } else {
            var found = false;
            while(index < length){
                if (index in object) {
                    accumulator = object[index++];
                    found = true;
                    break;
                }
                index++;
            }
            if (!found) {
                throw new TypeError("Reduce of empty array with no initial value");
            }
        }
        for(; index < length; index++){
            if (index in object) {
                accumulator = callback(accumulator, object[index], index, object);
            }
        }
        return accumulator;
    };
    // src/modules/es.array.reduce-right.ts
    var isSupported68 = function isSupported68() {
        try {
            return typeof Array.prototype.reduceRight === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayReduceRight = function arrayReduceRight(callback, initialValue) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.reduceRight called on null or undefined");
        }
        if (typeof callback !== "function") {
            throw new TypeError("callback is not a function");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var accumulator;
        var index = length - 1;
        if (arguments.length > 1) {
            accumulator = initialValue;
        } else {
            var found = false;
            while(index >= 0){
                if (index in object) {
                    accumulator = object[index--];
                    found = true;
                    break;
                }
                index--;
            }
            if (!found) {
                throw new TypeError("Reduce of empty array with no initial value");
            }
        }
        for(; index >= 0; index--){
            if (index in object) {
                accumulator = callback(accumulator, object[index], index, object);
            }
        }
        return accumulator;
    };
    // src/modules/es.array.reverse.ts
    var nativeReverse = Array.prototype.reverse;
    var isSupported69 = function isSupported69() {
        try {
            if (typeof nativeReverse !== "function") return false;
            var test = [
                1,
                2
            ];
            var before = String(test);
            var after = String(test.reverse());
            return before !== after;
        } catch (unused) {
            return false;
        }
    };
    var arrayReverse = function reverse() {
        if (Array.isArray(this)) this.length = this.length;
        return nativeReverse.call(this);
    };
    // src/modules/es.array.slice.ts
    var isSupported70 = function isSupported70() {
        try {
            return typeof Array.prototype.slice === "function";
        } catch (unused) {
            return false;
        }
    };
    var arraySlice = function arraySlice(start, end) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.slice called on null or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var from = +start;
        from = from !== from ? 0 : from < 0 ? Math.ceil(from) : Math.floor(from);
        from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);
        var to = length;
        if (end !== void 0) {
            to = +end;
            to = to !== to ? 0 : to < 0 ? Math.ceil(to) : Math.floor(to);
        }
        to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);
        var count = Math.max(to - from, 0);
        var result;
        if (!Array.isArray(object)) {
            result = new Array(count);
        } else {
            var ctor = object.constructor;
            if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
                var species = ctor[Symbol.species];
                ctor = species == null ? void 0 : species;
            }
            if (ctor === void 0 || ctor === Array) {
                result = new Array(count);
            } else {
                if (typeof ctor !== "function") throw new TypeError("constructor property is not a constructor");
                result = new ctor(count);
            }
        }
        var out = 0;
        for(var i = from; i < to; i++){
            if (i in object) {
                result[out] = object[i];
            }
            out++;
        }
        result.length = count;
        return result;
    };
    // src/modules/es.array.some.ts
    var isSupported71 = function isSupported71() {
        try {
            var method = Array.prototype.some;
            if (typeof method !== "function") return false;
            try {
                method.call(null, function() {
                    return 1;
                }, 1);
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var arraySome = function some(callbackfn) {
        if (this === null || this === void 0) throw new TypeError("Cannot convert undefined or null to object");
        var O = Object(this);
        var thisArg = arguments.length > 1 ? arguments[1] : void 0;
        var length = +O.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        for(var index = 0; index < length; index++){
            if (index in O) {
                if (callbackfn.call(thisArg, O[index], index, O)) return true;
            }
        }
        return false;
    };
    // src/modules/es.array.sort.ts
    var isSupported72 = function isSupported72() {
        try {
            if (typeof Array.prototype.sort !== "function") {
                return false;
            }
            var items = [];
            for(var i = 0; i < 16; i++){
                items.push({
                    key: i % 2,
                    tag: i
                });
            }
            items.sort(function(a, b) {
                return a.key - b.key;
            });
            for(var i1 = 1; i1 < items.length; i1++){
                if (items[i1].key === items[i1 - 1].key && items[i1].tag < items[i1 - 1].tag) {
                    return false;
                }
            }
            return true;
        } catch (unused) {
            return false;
        }
    };
    var defaultCompare = function defaultCompare(a, b) {
        var left = String(a);
        var right = String(b);
        if (left < right) {
            return -1;
        }
        if (left > right) {
            return 1;
        }
        return 0;
    };
    var stableSort = function stableSort(items, compare2) {
        var length = items.length;
        if (length < 2) {
            return;
        }
        var source = items;
        var target = new Array(length);
        for(var width = 1; width < length; width *= 2){
            for(var start = 0; start < length; start += width * 2){
                var left = start;
                var middle = start + width < length ? start + width : length;
                var right = middle;
                var end = start + width * 2 < length ? start + width * 2 : length;
                var out = start;
                while(left < middle && right < end){
                    if (compare2(source[left], source[right]) <= 0) {
                        target[out++] = source[left++];
                    } else {
                        target[out++] = source[right++];
                    }
                }
                while(left < middle){
                    target[out++] = source[left++];
                }
                while(right < end){
                    target[out++] = source[right++];
                }
            }
            var swap = source;
            source = target;
            target = swap;
        }
        if (source !== items) {
            for(var i = 0; i < length; i++){
                items[i] = source[i];
            }
        }
    };
    var arraySort = function arraySort(compareFn) {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.sort called on null or undefined");
        }
        if (compareFn !== void 0 && typeof compareFn !== "function") {
            throw new TypeError("The comparison function must be either a function or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var items = [];
        var undefinedCount = 0;
        var holeCount = 0;
        for(var i = 0; i < length; i++){
            if (!(i in object)) {
                holeCount++;
            } else if (object[i] === void 0) {
                undefinedCount++;
            } else {
                items.push(object[i]);
            }
        }
        var compare2 = compareFn ? function(a, b) {
            var numeric = +compareFn(a, b);
            return numeric === numeric ? numeric : 0;
        } : defaultCompare;
        stableSort(items, compare2);
        var index = 0;
        for(var i1 = 0; i1 < items.length; i1++){
            object[index++] = items[i1];
        }
        for(var u = 0; u < undefinedCount; u++){
            object[index++] = void 0;
        }
        for(var h = 0; h < holeCount; h++){
            delete object[index++];
        }
        return object;
    };
    // src/modules/es.array.species.ts
    var isSupported73 = function isSupported73() {
        try {
            var species = typeof Symbol !== "undefined" && Symbol.species;
            if (!species) return true;
            return !!Array[species];
        } catch (unused) {
            return false;
        }
    };
    var arraySpeciesGetter = function arraySpeciesGetter() {
        return this;
    };
    var install16 = function install16() {
        defineGetter(Array, Symbol.species, arraySpeciesGetter, "get [Symbol.species]");
    };
    // src/modules/es.array.splice.ts
    var isSupported74 = function isSupported74() {
        try {
            return typeof Array.prototype.splice === "function";
        } catch (unused) {
            return false;
        }
    };
    var arraySplice = function arraySplice() {
        if (this === null || this === void 0) {
            throw new TypeError("Array.prototype.splice called on null or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var argCount = arguments.length;
        var relativeStart = argCount > 0 ? +arguments[0] : 0;
        relativeStart = relativeStart !== relativeStart ? 0 : relativeStart < 0 ? Math.ceil(relativeStart) : Math.floor(relativeStart);
        var actualStart = relativeStart < 0 ? Math.max(length + relativeStart, 0) : Math.min(relativeStart, length);
        var insertCount;
        var actualDeleteCount;
        if (argCount === 0) {
            insertCount = 0;
            actualDeleteCount = 0;
        } else if (argCount === 1) {
            insertCount = 0;
            actualDeleteCount = length - actualStart;
        } else {
            insertCount = argCount - 2;
            var deleteCount = +arguments[1];
            deleteCount = deleteCount !== deleteCount ? 0 : deleteCount < 0 ? Math.ceil(deleteCount) : Math.floor(deleteCount);
            actualDeleteCount = Math.min(Math.max(deleteCount, 0), length - actualStart);
        }
        var removed;
        if (!Array.isArray(object)) {
            removed = new Array(actualDeleteCount);
        } else {
            var ctor = object.constructor;
            if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
                var species = ctor[Symbol.species];
                ctor = species == null ? void 0 : species;
            }
            if (ctor === void 0 || ctor === Array) {
                removed = new Array(actualDeleteCount);
            } else {
                if (typeof ctor !== "function") throw new TypeError("constructor property is not a constructor");
                removed = new ctor(actualDeleteCount);
            }
        }
        for(var i = 0; i < actualDeleteCount; i++){
            var from = actualStart + i;
            if (from in object) {
                removed[i] = object[from];
            }
        }
        removed.length = actualDeleteCount;
        var countDelta = insertCount - actualDeleteCount;
        if (countDelta < 0) {
            for(var i1 = actualStart; i1 < length - actualDeleteCount; i1++){
                var from1 = i1 + actualDeleteCount;
                var to = i1 + insertCount;
                if (from1 in object) {
                    object[to] = object[from1];
                } else {
                    delete object[to];
                }
            }
            for(var i2 = length; i2 > length + countDelta; i2--){
                delete object[i2 - 1];
            }
        } else if (countDelta > 0) {
            for(var i3 = length - actualDeleteCount; i3 > actualStart; i3--){
                var from2 = i3 + actualDeleteCount - 1;
                var to1 = i3 + insertCount - 1;
                if (from2 in object) {
                    object[to1] = object[from2];
                } else {
                    delete object[to1];
                }
            }
        }
        for(var i4 = 0; i4 < insertCount; i4++){
            object[actualStart + i4] = arguments[i4 + 2];
        }
        object.length = length + countDelta;
        return removed;
    };
    // src/modules/es.array.to-reversed.ts
    var isSupported75 = function isSupported75() {
        try {
            return typeof Array.prototype.toReversed === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayToReversed = function arrayToReversed() {
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var result = new Array(length);
        for(var i = 0; i < length; i++){
            result[i] = object[length - 1 - i];
        }
        return result;
    };
    // src/modules/es.array.to-sorted.ts
    var isSupported76 = function isSupported76() {
        try {
            return typeof Array.prototype.toSorted === "function";
        } catch (unused) {
            return false;
        }
    };
    var stableSort2 = function stableSort2(items, compareFn) {
        var length = items.length;
        if (length < 2) {
            return;
        }
        var source = items;
        var target = new Array(length);
        for(var width = 1; width < length; width *= 2){
            for(var start = 0; start < length; start += width * 2){
                var left = start;
                var middle = start + width < length ? start + width : length;
                var right = middle;
                var end = start + width * 2 < length ? start + width * 2 : length;
                var out = start;
                while(left < middle && right < end){
                    var a = source[left];
                    var b = source[right];
                    var order = void 0;
                    if (a === void 0) {
                        order = b === void 0 ? 0 : 1;
                    } else if (b === void 0) {
                        order = -1;
                    } else if (compareFn) {
                        order = +compareFn(a, b) || 0;
                    } else {
                        var sa = String(a);
                        var sb = String(b);
                        order = sa < sb ? -1 : sa > sb ? 1 : 0;
                    }
                    if (order <= 0) {
                        target[out++] = source[left++];
                    } else {
                        target[out++] = source[right++];
                    }
                }
                while(left < middle){
                    target[out++] = source[left++];
                }
                while(right < end){
                    target[out++] = source[right++];
                }
            }
            var swap = source;
            source = target;
            target = swap;
        }
        if (source !== items) {
            for(var i = 0; i < length; i++){
                items[i] = source[i];
            }
        }
    };
    var arrayToSorted = function arrayToSorted(compareFn) {
        if (compareFn !== void 0 && typeof compareFn !== "function") {
            throw new TypeError("The comparison function must be either a function or undefined");
        }
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var items = new Array(length);
        for(var i = 0; i < length; i++){
            items[i] = object[i];
        }
        stableSort2(items, compareFn);
        return items;
    };
    // src/modules/es.array.to-spliced.ts
    var isSupported77 = function isSupported77() {
        try {
            return typeof Array.prototype.toSpliced === "function";
        } catch (unused) {
            return false;
        }
    };
    var MAX_SAFE_LENGTH5 = 9007199254740991;
    var arrayToSpliced = function arrayToSpliced(start, skipCount, _items) {
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var argCount = arguments.length;
        var relativeStart = +start;
        relativeStart = relativeStart !== relativeStart ? 0 : relativeStart < 0 ? Math.ceil(relativeStart) : Math.floor(relativeStart);
        var actualStart;
        if (relativeStart === -Infinity) {
            actualStart = 0;
        } else if (relativeStart < 0) {
            actualStart = Math.max(length + relativeStart, 0);
        } else {
            actualStart = Math.min(relativeStart, length);
        }
        var actualSkipCount;
        if (argCount === 0) {
            actualSkipCount = 0;
        } else if (argCount === 1) {
            actualSkipCount = length - actualStart;
        } else {
            var skip = +skipCount;
            skip = skip !== skip ? 0 : skip < 0 ? Math.ceil(skip) : Math.floor(skip);
            actualSkipCount = Math.min(Math.max(skip, 0), length - actualStart);
        }
        var insertCount = argCount > 2 ? argCount - 2 : 0;
        var newLength = length - actualSkipCount + insertCount;
        if (newLength > MAX_SAFE_LENGTH5) {
            throw new TypeError("Array length exceeded");
        }
        var result = new Array(newLength);
        var writeIndex = 0;
        while(writeIndex < actualStart){
            result[writeIndex] = object[writeIndex];
            writeIndex++;
        }
        for(var i = 0; i < insertCount; i++){
            result[writeIndex] = arguments[i + 2];
            writeIndex++;
        }
        var readFrom = actualStart + actualSkipCount;
        while(writeIndex < newLength){
            result[writeIndex] = object[readFrom];
            writeIndex++;
            readFrom++;
        }
        return result;
    };
    // src/modules/es.array.unscopables.flat.ts
    var unscopablesKey = typeof Symbol !== "undefined" ? Symbol.unscopables : void 0;
    var isSupported78 = function isSupported78() {
        try {
            if (!unscopablesKey) {
                return true;
            }
            var table = Array.prototype[unscopablesKey];
            return !!table && table.flat === true;
        } catch (unused) {
            return true;
        }
    };
    var install17 = function install17() {
        if (unscopablesKey) {
            var table = Array.prototype[unscopablesKey];
            if (!table) {
                table = /* @__PURE__ */ Object.create(null);
                Object.defineProperty(Array.prototype, unscopablesKey, {
                    configurable: true,
                    value: table
                });
            }
            table.flat = true;
        }
    };
    // src/modules/es.array.unscopables.flat-map.ts
    var unscopablesKey2 = typeof Symbol !== "undefined" ? Symbol.unscopables : void 0;
    var isSupported79 = function isSupported79() {
        try {
            if (!unscopablesKey2) {
                return true;
            }
            var table = Array.prototype[unscopablesKey2];
            return !!table && table.flatMap === true;
        } catch (unused) {
            return true;
        }
    };
    var install18 = function install18() {
        if (unscopablesKey2) {
            var table = Array.prototype[unscopablesKey2];
            if (!table) {
                table = /* @__PURE__ */ Object.create(null);
                Object.defineProperty(Array.prototype, unscopablesKey2, {
                    configurable: true,
                    value: table
                });
            }
            table.flatMap = true;
        }
    };
    // src/modules/es.array.unshift.ts
    var nativeUnshift = Array.prototype.unshift;
    var isSupported80 = function isSupported80() {
        try {
            if (typeof nativeUnshift !== "function") return false;
            if ([].unshift(0) !== 1) return false;
            try {
                Object.defineProperty([], "length", {
                    writable: false
                }).unshift();
                return false;
            } catch (error) {
                return error instanceof TypeError;
            }
        } catch (unused) {
            return false;
        }
    };
    var arrayUnshift = function unshift() {
        if (this === null || this === void 0) throw new TypeError("Cannot convert undefined or null to object");
        var O = Object(this);
        var len = +O.length;
        len = len !== len || len <= 0 ? 0 : len > 9007199254740991 ? 9007199254740991 : Math.floor(len);
        var argCount = arguments.length;
        if (argCount) {
            if (len + argCount > 9007199254740991) throw new TypeError("Maximum allowed index exceeded");
            var k = len;
            while(k--){
                var to = k + argCount;
                if (k in O) O[to] = O[k];
                else if (!delete O[to]) throw new TypeError("Cannot delete property " + to + " of " + O);
            }
            for(var j = 0; j < argCount; j++){
                O[j] = arguments[j];
            }
        }
        var newLength = len + argCount;
        O.length = newLength;
        if (O.length !== newLength && Array.isArray(O)) throw new TypeError("Cannot set read only .length");
        return newLength;
    };
    // src/modules/es.array.with.ts
    var isSupported81 = function isSupported81() {
        try {
            return typeof Array.prototype.with === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayWith = function arrayWith(index, value) {
        var object = Object(this);
        var length = +object.length;
        length = length !== length || length <= 0 ? 0 : length > 9007199254740991 ? 9007199254740991 : Math.floor(length);
        var relativeIndex = +index;
        relativeIndex = relativeIndex !== relativeIndex ? 0 : relativeIndex < 0 ? Math.ceil(relativeIndex) : Math.floor(relativeIndex);
        var actualIndex = relativeIndex;
        if (relativeIndex < 0) {
            actualIndex = length + relativeIndex;
        }
        if (actualIndex < 0 || actualIndex >= length) {
            throw new RangeError("Invalid index : " + index);
        }
        var result = new Array(length);
        for(var i = 0; i < length; i++){
            if (i === actualIndex) {
                result[i] = value;
            } else {
                result[i] = object[i];
            }
        }
        return result;
    };
    // src/modules/es.regexp.constructor.ts
    var isSupported82 = function isSupported82() {
        try {
            var regex = new RegExp("a", "y");
            if (regex.sticky !== true) {
                return false;
            }
            regex.lastIndex = 1;
            return regex.exec("a_a") === null;
        } catch (unused) {
            return false;
        }
    };
    var NativeRegExp = RegExp;
    var supportsSticky = true;
    try {
        new NativeRegExp("a", "y");
    } catch (unused) {
        supportsSticky = false;
    }
    var supportsUnicode = true;
    try {
        new NativeRegExp("a", "u");
    } catch (unused) {
        supportsUnicode = false;
    }
    var warnedUnicode = false;
    var SPEC_FLAG_ORDER = "dgimsuvy";
    var makeStickyInstance = function makeStickyInstance(source, flags) {
        var bareFlags = flags.replace("y", "");
        var searcherFlags = bareFlags.indexOf("g") === -1 ? bareFlags + "g" : bareFlags;
        var searcher = new NativeRegExp("(?:" + source + ")|()", searcherFlags);
        var instance = new NativeRegExp(source, bareFlags);
        instance.lastIndex = 0;
        try {
            Object.defineProperty(instance, "sticky", {
                value: true
            });
            var ordered = "";
            for(var i = 0; i < SPEC_FLAG_ORDER.length; i++){
                if (flags.indexOf(SPEC_FLAG_ORDER.charAt(i)) !== -1) ordered += SPEC_FLAG_ORDER.charAt(i);
            }
            Object.defineProperty(instance, "flags", {
                value: ordered
            });
        } catch (unused) {}
        instance.exec = function(input) {
            var str = String(input);
            searcher.lastIndex = this.lastIndex;
            var match = searcher.exec(str);
            if (match && match.index === this.lastIndex && match[match.length - 1] === void 0) {
                match.length = match.length - 1;
                this.lastIndex = searcher.lastIndex;
                return match;
            }
            this.lastIndex = 0;
            return null;
        };
        instance.test = function(input) {
            return this.exec(input) !== null;
        };
        return instance;
    };
    var RegExpPolyfill = function RegExpPolyfill(pattern, flags) {
        if (pattern instanceof NativeRegExp) {
            if (flags === void 0) {
                flags = pattern.flags !== void 0 ? pattern.flags : (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "");
            }
            pattern = pattern.source;
        }
        var source = pattern === void 0 ? "" : String(pattern);
        var flagString = flags === void 0 ? "" : String(flags);
        if (!supportsUnicode && flagString.indexOf("u") !== -1) {
            if (!warnedUnicode) {
                warnedUnicode = true;
                console.warn("[spackle] RegExp: the u flag is not emulated on this engine \u2014 stripping it; astral character classes will misbehave");
            }
            flagString = flagString.replace("u", "");
        }
        if (!supportsSticky && flagString.indexOf("y") !== -1) {
            return makeStickyInstance(source, flagString);
        }
        return new NativeRegExp(source, flagString);
    };
    RegExpPolyfill.prototype = NativeRegExp.prototype;
    // src/modules/es.regexp.dot-all.ts
    var isSupported83 = function isSupported83() {
        try {
            if (!("dotAll" in RegExp.prototype)) {
                return false;
            }
            if (new RegExp(".", "s").dotAll !== true) return false;
            return new RegExp(".").dotAll === false;
        } catch (unused) {
            return false;
        }
    };
    var regexpDotAllGetter = function regexpDotAllGetter() {
        if (this === null || typeof this !== "object") {
            throw new TypeError("RegExp.prototype.dotAll getter called on a non-object");
        }
        if (!Object.prototype.hasOwnProperty.call(this, "flags")) {
            return false;
        }
        var flags = this.flags;
        if (typeof flags !== "string") {
            return void 0;
        }
        return flags.indexOf("s") !== -1;
    };
    var install19 = function install19() {
        defineGetter(RegExp.prototype, "dotAll", regexpDotAllGetter);
    };
    // src/modules/es.regexp.escape.ts
    var isSupported84 = function isSupported84() {
        try {
            return typeof RegExp.escape === "function";
        } catch (unused) {
            return false;
        }
    };
    var SYNTAX_CHARS = "^$\\.*+?()[]{}|/";
    var OTHER_PUNCTUATORS = ",-=<>#&!%:;@~'`\"";
    var regExpEscape = function regExpEscape(str) {
        if (typeof str !== "string") {
            throw new TypeError("RegExp.escape requires a string");
        }
        var out = "";
        for(var i = 0; i < str.length; i++){
            var ch = str.charAt(i);
            var code = str.charCodeAt(i);
            var hex = false;
            if (i === 0 && (code >= 48 && code <= 57 || // 0-9
            code >= 65 && code <= 90 || // A-Z
            code >= 97 && code <= 122)) {
                hex = true;
            } else if (SYNTAX_CHARS.indexOf(ch) !== -1) {
                out += "\\" + ch;
            } else if (OTHER_PUNCTUATORS.indexOf(ch) !== -1 || // inlined: isWhiteSpaceOrLineTerminator(code)
            code >= 9 && code <= 13 || // tab, LF, VT, FF, CR
            code === 32 || code === 160 || code === 5760 || code >= 8192 && code <= 8202 || code === 8232 || code === 8233 || code === 8239 || code === 8287 || code === 12288 || code === 65279) {
                hex = true;
            } else if (code >= 55296 && code <= 56319) {
                var next = str.charCodeAt(i + 1);
                if (next >= 56320 && next <= 57343) {
                    out += ch + str.charAt(i + 1);
                    i++;
                } else {
                    hex = true;
                }
            } else if (code >= 56320 && code <= 57343) {
                hex = true;
            } else {
                out += ch;
            }
            if (hex) {
                var digits = code.toString(16);
                if (code <= 255) {
                    out += "\\x" + (digits.length < 2 ? "0" + digits : digits);
                } else {
                    var padded = digits;
                    while(padded.length < 4)padded = "0" + padded;
                    out += "\\u" + padded;
                }
            }
        }
        return out;
    };
    // src/modules/es.regexp.flags.ts
    var isSupported85 = function isSupported85() {
        try {
            if (typeof RegExp === "undefined" || !("flags" in RegExp.prototype)) {
                return false;
            }
            if (new RegExp("x", "gi").flags !== "gi") return false;
            if (new RegExp("x").flags !== "") return false;
            return new RegExp("x", "ig").flags === "gi";
        } catch (unused) {
            return false;
        }
    };
    var lookupGetter = Object.prototype.__lookupGetter__;
    var hasOwn2 = Object.prototype.hasOwnProperty;
    var RegExpProto = RegExp.prototype;
    var FLAG_KEYS = [
        "hasIndices",
        "global",
        "ignoreCase",
        "multiline",
        "dotAll",
        "unicode",
        "unicodeSets",
        "sticky"
    ];
    var FLAG_CHARS = "dgimsuvy";
    var regExpFlags = function regExpFlags() {
        if (this === null || typeof this !== "object") {
            throw new TypeError("RegExp.prototype.flags getter called on a non-object");
        }
        var result = "";
        for(var i = 0; i < FLAG_KEYS.length; i++){
            var key = FLAG_KEYS[i];
            var on = void 0;
            if (hasOwn2.call(this, key)) {
                on = !!this[key];
            } else {
                var getter = lookupGetter ? lookupGetter.call(RegExpProto, key) : (Object.getOwnPropertyDescriptor(RegExpProto, key) || {}).get;
                on = getter && getter.__polyfilled ? false : !!this[key];
            }
            if (on) result += FLAG_CHARS.charAt(i);
        }
        return result;
    };
    var install20 = function install20() {
        defineGetter(RegExp.prototype, "flags", regExpFlags);
    };
    // src/modules/es.regexp.test.ts
    var isSupported86 = function isSupported86() {
        try {
            var regexp = /a/;
            var calledExec = false;
            regexp.exec = function() {
                calledExec = true;
                return null;
            };
            regexp.test("a");
            return calledExec;
        } catch (unused) {
            return false;
        }
    };
    var nativeTest = RegExp.prototype.test;
    var nativeExec = RegExp.prototype.exec;
    var regexpTest = function regexpTest(string) {
        if (this === null || typeof this !== "object") {
            throw new TypeError("RegExp.prototype.test called on a non-object");
        }
        var exec = this.exec;
        if (exec === nativeExec) {
            return nativeTest.call(this, String(string));
        }
        if (typeof exec === "function") {
            var result = exec.call(this, String(string));
            if (result !== null && typeof result !== "object") {
                throw new TypeError("RegExp exec method returned something other than an Object or null");
            }
            return result !== null;
        }
        return nativeTest.call(this, String(string));
    };
    // src/modules/es.regexp.to-string.ts
    var isSupported87 = function isSupported87() {
        try {
            return typeof RegExp.prototype.toString === "function";
        } catch (unused) {
            return false;
        }
    };
    var regExpToString = function regExpToString() {
        if (this === null || this === void 0) {
            throw new TypeError("RegExp.prototype.toString called on null or undefined");
        }
        return "/" + String(this.source) + "/" + String(this.flags);
    };
    // src/modules/es.string.at-alternative.ts
    var isSupported88 = function isSupported88() {
        try {
            return typeof String.prototype.at === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringAt = function stringAt(index) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.at called on null or undefined");
        }
        var source = typeof this === "string" ? this : String(this);
        var length = source.length;
        var relativeIndex = +index;
        if (relativeIndex !== relativeIndex) {
            relativeIndex = 0;
        }
        relativeIndex = relativeIndex < 0 ? Math.ceil(relativeIndex) : Math.floor(relativeIndex);
        var actualIndex = relativeIndex < 0 ? length + relativeIndex : relativeIndex;
        if (actualIndex < 0 || actualIndex >= length) {
            return void 0;
        }
        return source.charAt(actualIndex);
    };
    // src/modules/es.string.code-point-at.ts
    var isSupported89 = function isSupported89() {
        try {
            return typeof String.prototype.codePointAt === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringCodePointAt = function stringCodePointAt(pos) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.codePointAt called on null or undefined");
        }
        var source = typeof this === "string" ? this : String(this);
        var length = source.length;
        var index = +pos;
        if (index !== index) {
            index = 0;
        }
        index = index < 0 ? Math.ceil(index) : Math.floor(index);
        if (index < 0 || index >= length) {
            return void 0;
        }
        var first = source.charCodeAt(index);
        if (first >= 55296 && first <= 56319 && index + 1 < length) {
            var second = source.charCodeAt(index + 1);
            if (second >= 56320 && second <= 57343) {
                return (first - 55296) * 1024 + (second - 56320) + 65536;
            }
        }
        return first;
    };
    // src/modules/es.string.ends-with.ts
    var isSupported90 = function isSupported90() {
        try {
            return typeof String.prototype.endsWith === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectToString2 = Object.prototype.toString;
    var stringEndsWith = function stringEndsWith(search, endPosition) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.endsWith called on null or undefined");
        }
        var s = typeof this === "string" ? this : String(this);
        var isRegExpValue = false;
        if (search !== null && (typeof search === "object" || typeof search === "function")) {
            var matchKey = typeof Symbol !== "undefined" ? Symbol.match : void 0;
            var matcher = matchKey ? search[matchKey] : void 0;
            isRegExpValue = matcher !== void 0 ? !!matcher : objectToString2.call(search) === "[object RegExp]";
        }
        if (isRegExpValue) {
            throw new TypeError("First argument to String.prototype.endsWith must not be a regular expression");
        }
        var searchString = String(search);
        var length = s.length;
        var endIndex = length;
        if (endPosition !== void 0) {
            endIndex = +endPosition;
            endIndex = endIndex !== endIndex ? 0 : endIndex < 0 ? Math.ceil(endIndex) : Math.floor(endIndex);
        }
        if (endIndex < 0) {
            endIndex = 0;
        } else if (endIndex > length) {
            endIndex = length;
        }
        var startIndex = endIndex - searchString.length;
        if (startIndex < 0) {
            return false;
        }
        for(var i = 0; i < searchString.length; i++){
            if (s.charCodeAt(startIndex + i) !== searchString.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    };
    // src/modules/es.string.from-code-point.ts
    var isSupported91 = function isSupported91() {
        try {
            return typeof String.fromCodePoint === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringFromCodePoint = function stringFromCodePoint(_codePoint) {
        var parts = [];
        for(var i = 0; i < arguments.length; i++){
            var codePoint = +arguments[i];
            if (codePoint < 0 || codePoint > 1114111 || codePoint !== (codePoint | 0)) {
                throw new RangeError("Invalid code point: ".concat(codePoint));
            }
            if (codePoint > 65535) {
                codePoint -= 65536;
                parts[parts.length] = String.fromCharCode((codePoint >> 10) + 55296, // high surrogate = top 10 bits
                (codePoint & 1023) + 56320);
            } else {
                parts[parts.length] = String.fromCharCode(codePoint);
            }
        }
        return parts.join("");
    };
    // src/modules/es.string.includes.ts
    var isSupported92 = function isSupported92() {
        try {
            return typeof String.prototype.includes === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectToString3 = Object.prototype.toString;
    var stringIncludes = function stringIncludes(search, start) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.includes called on null or undefined");
        }
        var s = typeof this === "string" ? this : String(this);
        var isRegExpValue = false;
        if (search !== null && (typeof search === "object" || typeof search === "function")) {
            var matchKey = typeof Symbol !== "undefined" ? Symbol.match : void 0;
            var matcher = matchKey ? search[matchKey] : void 0;
            isRegExpValue = matcher !== void 0 ? !!matcher : objectToString3.call(search) === "[object RegExp]";
        }
        if (isRegExpValue) {
            throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
        }
        return s.indexOf(String(search), start) !== -1;
    };
    // src/modules/es.string.is-well-formed.ts
    var isSupported93 = function isSupported93() {
        try {
            return typeof String.prototype.isWellFormed === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringIsWellFormed = function stringIsWellFormed() {
        var str = typeof this === "string" ? this : String(this);
        for(var i = 0; i < str.length; i++){
            var code = str.charCodeAt(i);
            if (code >= 56320 && code <= 57343) {
                return false;
            }
            if (code >= 55296 && code <= 56319) {
                var next = str.charCodeAt(i + 1);
                if (!(next >= 56320 && next <= 57343)) {
                    return false;
                }
                i++;
            }
        }
        return true;
    };
    // src/modules/es.string.match.ts
    var isSupported94 = function isSupported94() {
        try {
            return typeof String.prototype.match === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeMatch = String.prototype.match;
    var stringMatch = function stringMatch(matcher) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.match called on null or undefined");
        }
        if (matcher !== null && matcher !== void 0 && typeof Symbol !== "undefined" && Symbol.match) {
            var handler = matcher[Symbol.match];
            if (typeof handler === "function") {
                return handler.call(matcher, typeof this === "string" ? this : String(this));
            }
        }
        return nativeMatch.call(this, matcher);
    };
    // src/modules/es.string.match-all.ts
    var isSupported95 = function isSupported95() {
        try {
            if (typeof String.prototype.matchAll !== "function") {
                return false;
            }
            try {
                "".matchAll(/./);
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var returnSelf4 = function returnSelf4() {
        return this;
    };
    var MatchIteratorPrototype = {};
    MatchIteratorPrototype.next = function() {
        var rx = this._rx;
        if (rx === null) return {
            value: void 0,
            done: true
        };
        var s = this._s;
        var match;
        var exec = rx.exec;
        if (typeof exec === "function") {
            match = exec.call(rx, s);
            if (match !== null && typeof match !== "object") {
                throw new TypeError("RegExp exec method returned something other than an Object or null");
            }
        } else {
            match = RegExp.prototype.exec.call(rx, s);
        }
        if (match === null) {
            this._rx = null;
            this._s = null;
            return {
                value: void 0,
                done: true
            };
        }
        if (!this._global) {
            this._rx = null;
            this._s = null;
            return {
                value: match,
                done: false
            };
        }
        if (String(match[0]) === "") {
            var index = +rx.lastIndex;
            index = index !== index || index <= 0 ? 0 : index > 9007199254740991 ? 9007199254740991 : Math.floor(index);
            var next = index + 1;
            if (this._unicode && index + 1 < s.length) {
                var first = s.charCodeAt(index);
                if (first >= 55296 && first <= 56319) {
                    var second = s.charCodeAt(index + 1);
                    if (second >= 56320 && second <= 57343) next = index + 2;
                }
            }
            rx.lastIndex = next;
        }
        return {
            value: match,
            done: false
        };
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
        Object.defineProperty(MatchIteratorPrototype, Symbol.iterator, {
            value: returnSelf4,
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    var objectToString4 = Object.prototype.toString;
    var regExpMatchAll = function regExpMatchAll(R, s) {
        var Default = window.RegExp;
        var C = R.constructor;
        if (C === void 0) {
            C = Default;
        } else {
            if (C === null || typeof C !== "object" && typeof C !== "function") {
                throw new TypeError("RegExp constructor is not an object");
            }
            var speciesKey = typeof Symbol !== "undefined" ? Symbol.species : void 0;
            var species = speciesKey ? C[speciesKey] : void 0;
            C = species === void 0 || species === null ? Default : species;
            if (typeof C !== "function") throw new TypeError("RegExp species is not a constructor");
        }
        var flags = String(R.flags);
        var matcher = C === Default ? new C(R.source, flags) : new C(R, flags);
        var lastIndex = +R.lastIndex;
        lastIndex = lastIndex !== lastIndex || lastIndex <= 0 ? 0 : lastIndex > 9007199254740991 ? 9007199254740991 : Math.floor(lastIndex);
        matcher.lastIndex = lastIndex;
        var iterator = Object.create(MatchIteratorPrototype);
        iterator._rx = matcher;
        iterator._s = s;
        iterator._global = flags.indexOf("g") !== -1;
        iterator._unicode = flags.indexOf("u") !== -1;
        return iterator;
    };
    var stringMatchAll = function stringMatchAll(regexp) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.matchAll called on null or undefined");
        }
        if (regexp !== null && regexp !== void 0) {
            var isRegExpValue = false;
            if (regexp !== null && (typeof regexp === "object" || typeof regexp === "function")) {
                var matchKey = typeof Symbol !== "undefined" ? Symbol.match : void 0;
                var matcher2 = matchKey ? regexp[matchKey] : void 0;
                isRegExpValue = matcher2 !== void 0 ? !!matcher2 : objectToString4.call(regexp) === "[object RegExp]";
            }
            if (isRegExpValue) {
                var flags = regexp.flags;
                if (flags === null || flags === void 0) {
                    throw new TypeError("String.prototype.matchAll called with a RegExp whose flags are null or undefined");
                }
                if (String(flags).indexOf("g") === -1) {
                    throw new TypeError("String.prototype.matchAll called with a non-global RegExp argument");
                }
            }
            var matchAllKey = typeof Symbol !== "undefined" ? Symbol.matchAll : void 0;
            var matcher = matchAllKey ? regexp[matchAllKey] : void 0;
            if (matcher !== void 0 && matcher !== null) {
                return matcher.call(regexp, this);
            }
            if (objectToString4.call(regexp) === "[object RegExp]") {
                return regExpMatchAll(regexp, typeof this === "string" ? this : String(this));
            }
        }
        var s = typeof this === "string" ? this : String(this);
        var rx = new window.RegExp(regexp === void 0 ? "" : regexp, "g");
        return regExpMatchAll(rx, s);
    };
    var install21 = function install21() {
        Object.defineProperty(String.prototype, "matchAll", {
            value: stringMatchAll,
            writable: true,
            enumerable: false,
            configurable: true
        });
        try {
            Object.defineProperty(String.prototype.matchAll, "name", {
                value: "matchAll",
                configurable: true
            });
        } catch (e) {}
        Object.defineProperty(String.prototype.matchAll, "__polyfilled", {
            value: true
        });
    };
    // src/modules/es.string.pad-end.ts
    var isSupported96 = function isSupported96() {
        try {
            if (typeof String.prototype.padEnd !== "function") return false;
            var ua = window.navigator && window.navigator.userAgent;
            return !/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(ua || "");
        } catch (unused) {
            return false;
        }
    };
    var stringPadEnd = function stringPadEnd(targetLength, padString) {
        var source = typeof this === "string" ? this : String(this);
        var padWith = padString !== void 0 ? String(padString) : " ";
        if (source.length >= targetLength || padWith.length === 0) {
            return source;
        }
        var charsNeeded = targetLength - source.length;
        var fill = padWith;
        while(fill.length < charsNeeded){
            fill = fill + fill;
        }
        return source + fill.substring(0, charsNeeded);
    };
    // src/modules/es.string.pad-start.ts
    var isSupported97 = function isSupported97() {
        try {
            if (typeof String.prototype.padStart !== "function") return false;
            var ua = window.navigator && window.navigator.userAgent;
            return !/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(ua || "");
        } catch (unused) {
            return false;
        }
    };
    var stringPadStart = function stringPadStart(targetLength, padString) {
        var source = typeof this === "string" ? this : String(this);
        var padWith = padString !== void 0 ? String(padString) : " ";
        if (source.length >= targetLength || padWith.length === 0) {
            return source;
        }
        var charsNeeded = targetLength - source.length;
        var fill = padWith;
        while(fill.length < charsNeeded){
            fill = fill + fill;
        }
        return fill.substring(0, charsNeeded) + source;
    };
    // src/modules/es.string.raw.ts
    var isSupported98 = function isSupported98() {
        try {
            return typeof String.raw === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringRaw = function stringRaw(template) {
        if (template === null || template === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var raw = Object(template).raw;
        if (raw === null || raw === void 0) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var segmentCount = raw.length >>> 0;
        if (segmentCount === 0) {
            return "";
        }
        var result = "";
        var substitutionCount = arguments.length - 1;
        for(var i = 0; i < segmentCount; i++){
            result += String(raw[i]);
            if (i + 1 === segmentCount) {
                break;
            }
            if (i < substitutionCount) {
                result += String(arguments[i + 1]);
            }
        }
        return result;
    };
    // src/modules/es.string.repeat.ts
    var isSupported99 = function isSupported99() {
        try {
            return typeof String.prototype.repeat === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringRepeat = function stringRepeat(count) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.repeat called on null or undefined");
        }
        var source = typeof this === "string" ? this : String(this);
        var times = +count;
        if (times !== times) {
            times = 0;
        }
        times = times < 0 ? Math.ceil(times) : Math.floor(times);
        if (times < 0 || times === Infinity) {
            throw new RangeError("Invalid count value: " + count);
        }
        var result = "";
        var chunk = source;
        while(times > 0){
            if (times % 2 === 1) {
                result += chunk;
            }
            times = Math.floor(times / 2);
            if (times > 0) {
                chunk += chunk;
            }
        }
        return result;
    };
    // src/modules/es.string.replace.ts
    var isSupported100 = function isSupported100() {
        try {
            return typeof String.prototype.replace === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeReplace = String.prototype.replace;
    var stringReplace = function stringReplace(searchValue, replaceValue) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.replace called on null or undefined");
        }
        if (searchValue !== null && searchValue !== void 0 && typeof Symbol !== "undefined" && Symbol.replace) {
            var handler = searchValue[Symbol.replace];
            if (typeof handler === "function") {
                return handler.call(searchValue, typeof this === "string" ? this : String(this), replaceValue);
            }
        }
        return nativeReplace.call(this, searchValue, replaceValue);
    };
    // src/modules/es.string.replace-all.ts
    var isSupported101 = function isSupported101() {
        try {
            return typeof String.prototype.replaceAll === "function";
        } catch (unused) {
            return false;
        }
    };
    var substitute = function substitute(replacementString, matched, position, source) {
        if (replacementString.indexOf("$") === -1) {
            return replacementString;
        }
        var result = "";
        for(var i = 0; i < replacementString.length; i++){
            var character = replacementString.charAt(i);
            var nextCharacter = i + 1 < replacementString.length ? replacementString.charAt(i + 1) : "";
            if (character === "$" && nextCharacter !== "") {
                if (nextCharacter === "$") {
                    result += "$";
                    i++;
                    continue;
                }
                if (nextCharacter === "&") {
                    result += matched;
                    i++;
                    continue;
                }
                if (nextCharacter === "`") {
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
    var stringReplaceAll = function stringReplaceAll(searchValue, replaceValue) {
        if (searchValue instanceof RegExp) {
            if (!searchValue.global) {
                throw new TypeError("replaceAll must be called with a global RegExp");
            }
            return this.replace(searchValue, replaceValue);
        }
        var source = typeof this === "string" ? this : String(this);
        var searchString = String(searchValue);
        var isFunction = typeof replaceValue === "function";
        var replacementString = isFunction ? "" : String(replaceValue);
        var hasDollar = replacementString.indexOf("$") !== -1;
        if (searchString === "") {
            var result2 = isFunction ? String(replaceValue("", 0, source)) : hasDollar ? substitute(replacementString, "", 0, source) : replacementString;
            for(var i = 0; i < source.length; i++){
                var replacement = isFunction ? String(replaceValue("", i + 1, source)) : hasDollar ? substitute(replacementString, "", i + 1, source) : replacementString;
                result2 += source.charAt(i) + replacement;
            }
            return result2;
        }
        var result = "";
        var position = 0;
        var index = source.indexOf(searchString, position);
        while(index !== -1){
            var replacement1 = isFunction ? String(replaceValue(searchString, index, source)) : hasDollar ? substitute(replacementString, searchString, index, source) : replacementString;
            result += source.substring(position, index) + replacement1;
            position = index + searchString.length;
            index = source.indexOf(searchString, position);
        }
        result += source.substring(position);
        return result;
    };
    // src/modules/es.string.search.ts
    var isSupported102 = function isSupported102() {
        try {
            return typeof String.prototype.search === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeSearch = String.prototype.search;
    var stringSearch = function stringSearch(matcher) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.search called on null or undefined");
        }
        if (matcher !== null && matcher !== void 0 && typeof Symbol !== "undefined" && Symbol.search) {
            var handler = matcher[Symbol.search];
            if (typeof handler === "function") {
                return handler.call(matcher, typeof this === "string" ? this : String(this));
            }
        }
        return nativeSearch.call(this, matcher);
    };
    // src/modules/es.string.split.ts
    var isSupported103 = function isSupported103() {
        try {
            return typeof String.prototype.split === "function";
        } catch (unused) {
            return false;
        }
    };
    var nativeSplit = String.prototype.split;
    var stringSplit = function stringSplit(separator, limit) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.split called on null or undefined");
        }
        if (separator !== null && separator !== void 0 && typeof Symbol !== "undefined" && Symbol.split) {
            var handler = separator[Symbol.split];
            if (typeof handler === "function") {
                return handler.call(separator, typeof this === "string" ? this : String(this), limit);
            }
        }
        return nativeSplit.call(this, separator, limit);
    };
    // src/modules/es.string.starts-with.ts
    var isSupported104 = function isSupported104() {
        try {
            return typeof String.prototype.startsWith === "function";
        } catch (unused) {
            return false;
        }
    };
    var objectToString5 = Object.prototype.toString;
    var stringStartsWith = function stringStartsWith(search, start) {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.startsWith called on null or undefined");
        }
        var s = typeof this === "string" ? this : String(this);
        var isRegExpValue = false;
        if (search !== null && (typeof search === "object" || typeof search === "function")) {
            var matchKey = typeof Symbol !== "undefined" ? Symbol.match : void 0;
            var matcher = matchKey ? search[matchKey] : void 0;
            isRegExpValue = matcher !== void 0 ? !!matcher : objectToString5.call(search) === "[object RegExp]";
        }
        if (isRegExpValue) {
            throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");
        }
        var searchString = String(search);
        var position = 0;
        if (start !== void 0) {
            position = +start;
            position = position !== position ? 0 : position < 0 ? Math.ceil(position) : Math.floor(position);
        }
        if (position < 0) {
            position = 0;
        } else if (position > s.length) {
            position = s.length;
        }
        if (position + searchString.length > s.length) {
            return false;
        }
        for(var i = 0; i < searchString.length; i++){
            if (s.charCodeAt(position + i) !== searchString.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    };
    // src/modules/es.string.to-well-formed.ts
    var isSupported105 = function isSupported105() {
        try {
            return typeof String.prototype.toWellFormed === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringToWellFormed = function stringToWellFormed() {
        var str = typeof this === "string" ? this : String(this);
        var out = "";
        for(var i = 0; i < str.length; i++){
            var code = str.charCodeAt(i);
            if (code >= 56320 && code <= 57343) {
                out += "\uFFFD";
            } else if (code >= 55296 && code <= 56319) {
                var next = str.charCodeAt(i + 1);
                if (next >= 56320 && next <= 57343) {
                    out += str.charAt(i) + str.charAt(i + 1);
                    i++;
                } else {
                    out += "\uFFFD";
                }
            } else {
                out += str.charAt(i);
            }
        }
        return out;
    };
    // src/modules/es.string.trim.ts
    var isSupported106 = function isSupported106() {
        try {
            return typeof String.prototype.trim === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringTrim = function stringTrim() {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.trim called on null or undefined");
        }
        return (typeof this === "string" ? this : String(this)).replace(/^\s+|\s+$/g, "");
    };
    // src/modules/es.string.trim-end.ts
    var isSupported107 = function isSupported107() {
        try {
            return typeof String.prototype.trimEnd === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringTrimEnd = function stringTrimEnd() {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.trimEnd called on null or undefined");
        }
        return (typeof this === "string" ? this : String(this)).replace(/\s+$/, "");
    };
    // src/modules/es.string.trim-start.ts
    var isSupported108 = function isSupported108() {
        try {
            return typeof String.prototype.trimStart === "function";
        } catch (unused) {
            return false;
        }
    };
    var stringTrimStart = function stringTrimStart() {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype.trimStart called on null or undefined");
        }
        return (typeof this === "string" ? this : String(this)).replace(/^\s+/, "");
    };
    // src/modules/es.array-buffer.detached.ts
    var isSupported109 = function isSupported109() {
        try {
            if (typeof ArrayBuffer === "undefined") {
                return false;
            }
            if (!("detached" in ArrayBuffer.prototype)) {
                return false;
            }
            return new ArrayBuffer(0).detached === false;
        } catch (unused) {
            return false;
        }
    };
    var DETACHED_FLAG = "__spackleDetached";
    var arrayBufferDetached = function arrayBufferDetached() {
        if (!this || typeof this !== "object" || Object.prototype.toString.call(this) !== "[object ArrayBuffer]") {
            throw new TypeError("ArrayBuffer.prototype.detached called on a non-ArrayBuffer");
        }
        if (this.byteLength !== 0) {
            return false;
        }
        if (this[DETACHED_FLAG] === true) {
            return true;
        }
        try {
            new DataView(this);
            return false;
        } catch (e) {
            return true;
        }
    };
    var install22 = function install22() {
        if (typeof ArrayBuffer === "undefined") {
            return;
        }
        if ("detached" in ArrayBuffer.prototype) {
            return;
        }
        defineGetter(ArrayBuffer.prototype, "detached", arrayBufferDetached);
    };
    // src/modules/es.array-buffer.transfer.ts
    var isSupported110 = function isSupported110() {
        try {
            if (typeof ArrayBuffer === "undefined") {
                return false;
            }
            var proto2 = ArrayBuffer.prototype;
            if (typeof proto2.transfer !== "function" || typeof proto2.transferToFixedLength !== "function") {
                return false;
            }
            var probe = new ArrayBuffer(2);
            var moved = proto2.transfer.call(probe, 2);
            return moved.byteLength === 2 && probe.byteLength === 0;
        } catch (unused) {
            return false;
        }
    };
    var DETACHED_FLAG2 = "__spackleDetached";
    var DETACHED_DESC = {
        value: true,
        configurable: true
    };
    var markDetached = function markDetached(buffer) {
        try {
            Object.defineProperty(buffer, DETACHED_FLAG2, DETACHED_DESC);
        } catch (e) {}
    };
    var isDetached = function isDetached(buffer) {
        if (buffer.byteLength !== 0) {
            return false;
        }
        if (buffer[DETACHED_FLAG2] === true) {
            return true;
        }
        try {
            new DataView(buffer);
            return false;
        } catch (e) {
            return true;
        }
    };
    var globalRef = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : void 0;
    var closePorts = function closePorts(channel) {
        try {
            channel.port1.close();
            channel.port2.close();
        } catch (e) {}
    };
    var resolveDetacher = function resolveDetacher() {
        var host = globalRef;
        if (!host) {
            return null;
        }
        try {
            var clone = host.structuredClone;
            if (typeof clone === "function") {
                var probe = new ArrayBuffer(2);
                clone(probe, {
                    transfer: [
                        probe
                    ]
                });
                if (probe.byteLength === 0) {
                    return function(buffer) {
                        clone(buffer, {
                            transfer: [
                                buffer
                            ]
                        });
                    };
                }
            }
        } catch (e) {}
        try {
            var Channel = host.MessageChannel;
            if (typeof Channel === "function") {
                var probe1 = new ArrayBuffer(2);
                var channel = new Channel();
                channel.port1.postMessage(null, [
                    probe1
                ]);
                closePorts(channel);
                if (probe1.byteLength === 0) {
                    return function(buffer) {
                        var live = new Channel();
                        live.port1.postMessage(null, [
                            buffer
                        ]);
                        closePorts(live);
                    };
                }
            }
        } catch (e) {}
        return null;
    };
    var detacher = null;
    var detacherResolved = false;
    var getDetacher = function getDetacher() {
        if (!detacherResolved) {
            detacherResolved = true;
            detacher = resolveDetacher();
        }
        return detacher;
    };
    var transferImpl = function transferImpl(source, newLength) {
        if (!source || typeof source !== "object" || Object.prototype.toString.call(source) !== "[object ArrayBuffer]") {
            throw new TypeError("ArrayBuffer.prototype.transfer called on a non-ArrayBuffer");
        }
        if (isDetached(source)) {
            throw new TypeError("Cannot transfer a detached ArrayBuffer");
        }
        var detach = getDetacher();
        if (!detach) {
            throw new TypeError("This engine cannot detach an ArrayBuffer");
        }
        var oldLength = source.byteLength;
        var length = oldLength;
        if (newLength !== void 0) {
            var numeric = +newLength;
            length = numeric !== numeric ? 0 : numeric >= 0 ? Math.floor(numeric) : Math.ceil(numeric);
            if (length < 0 || length > 9007199254740991) {
                throw new RangeError("Invalid ArrayBuffer length");
            }
        }
        var next = new ArrayBuffer(length);
        var copyLength = Math.min(length, oldLength);
        if (copyLength > 0) {
            new Uint8Array(next).set(new Uint8Array(source, 0, copyLength));
        }
        detach(source);
        markDetached(source);
        return next;
    };
    var arrayBufferTransfer = function arrayBufferTransfer(newLength) {
        return transferImpl(this, newLength);
    };
    var arrayBufferTransferToFixedLength = function arrayBufferTransferToFixedLength(newLength) {
        return transferImpl(this, newLength);
    };
    var install23 = function install23() {
        if (typeof ArrayBuffer === "undefined") {
            return;
        }
        var proto2 = ArrayBuffer.prototype;
        if (typeof proto2.transfer === "function" && typeof proto2.transferToFixedLength === "function") {
            return;
        }
        if (!getDetacher()) {
            return;
        }
        if (typeof proto2.transfer !== "function") {
            define(proto2, "transfer", arrayBufferTransfer);
        }
        if (typeof proto2.transferToFixedLength !== "function") {
            define(proto2, "transferToFixedLength", arrayBufferTransferToFixedLength);
        }
    };
    // src/modules/_array-buffer-impl.ts
    var isSupported111 = function isSupported111() {
        try {
            if (typeof ArrayBuffer === "undefined") {
                return false;
            }
            return typeof ArrayBuffer.isView === "function" && typeof ArrayBuffer.prototype.slice === "function";
        } catch (unused) {
            return false;
        }
    };
    var arrayBufferIsView = function arrayBufferIsView(value) {
        return !!value && typeof value === "object" && !!value.buffer && // The brand, not instanceof: Safari 7.1's ArrayBuffer and typed-array
        // constructors are host objects, where `x instanceof ArrayBuffer` is false
        // for a genuine buffer -- isView() would then answer false for every real
        // view on that engine.
        Object.prototype.toString.call(value.buffer) === "[object ArrayBuffer]" && typeof value.byteLength === "number";
    };
    var arrayBufferSlice = function arrayBufferSlice(begin, end) {
        var length = this.byteLength;
        var from = 0;
        if (begin !== void 0) {
            from = +begin;
            from = from !== from ? 0 : from < 0 ? Math.ceil(from) : Math.floor(from);
        }
        from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);
        var to = length;
        if (end !== void 0) {
            to = +end;
            to = to !== to ? 0 : to < 0 ? Math.ceil(to) : Math.floor(to);
        }
        to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);
        var count = Math.max(to - from, 0);
        var sliced = new ArrayBuffer(count);
        new Uint8Array(sliced).set(new Uint8Array(this, from, count));
        return sliced;
    };
    var install24 = function install24() {
        if (typeof ArrayBuffer !== "undefined") {
            if (typeof ArrayBuffer.isView !== "function") {
                define(ArrayBuffer, "isView", arrayBufferIsView);
            }
            if (typeof ArrayBuffer.prototype.slice !== "function") {
                define(ArrayBuffer.prototype, "slice", arrayBufferSlice);
            }
        }
    };
    // src/modules/_float16-impl.ts
    var scratch = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" ? new DataView(new ArrayBuffer(8)) : null;
    var isSupported112 = function isSupported112() {
        try {
            return typeof Math.f16round === "function" && typeof DataView !== "undefined" && typeof DataView.prototype.getFloat16 === "function" && typeof DataView.prototype.setFloat16 === "function";
        } catch (unused) {
            return false;
        }
    };
    var doubleToFloat16Bits = function doubleToFloat16Bits(value) {
        var n = +value;
        if (n !== n) return 32256;
        if (n === Infinity) return 31744;
        if (n === -Infinity) return 64512;
        if (n === 0) {
            return 1 / n === -Infinity ? 32768 : 0;
        }
        var sign = n < 0 || n === 0 && 1 / n < 0 ? 32768 : 0;
        var magnitude = Math.abs(n);
        if (magnitude >= 65520) {
            return sign | 31744;
        }
        if (magnitude < 5960464477539063e-23 / 2) {
            return sign;
        }
        if (magnitude < 6103515625e-14) {
            var scaled = magnitude / 5960464477539063e-23;
            var roundedValue = scaled;
            var roundedFloor = Math.floor(roundedValue);
            var roundedFraction = roundedValue - roundedFloor;
            var rounded = roundedFraction < 0.5 ? roundedFloor : roundedFraction > 0.5 ? roundedFloor + 1 : roundedFloor % 2 === 0 ? roundedFloor : roundedFloor + 1;
            return sign | rounded;
        }
        var exponent = Math.floor(Math.log(magnitude) / Math.LN2);
        if (magnitude < Math.pow(2, exponent)) exponent--;
        if (magnitude >= Math.pow(2, exponent + 1)) exponent++;
        var mantissa = magnitude / Math.pow(2, exponent) - 1;
        var mantissaBitsValue = mantissa * 1024;
        var mantissaBitsFloor = Math.floor(mantissaBitsValue);
        var mantissaBitsFraction = mantissaBitsValue - mantissaBitsFloor;
        var mantissaBits = mantissaBitsFraction < 0.5 ? mantissaBitsFloor : mantissaBitsFraction > 0.5 ? mantissaBitsFloor + 1 : mantissaBitsFloor % 2 === 0 ? mantissaBitsFloor : mantissaBitsFloor + 1;
        if (mantissaBits === 1024) {
            mantissaBits = 0;
            exponent++;
            if (exponent > 15) return sign | 31744;
        }
        return sign | exponent + 15 << 10 | mantissaBits;
    };
    var float16BitsToDouble = function float16BitsToDouble(bits) {
        var sign = bits & 32768 ? -1 : 1;
        var exponent = bits >> 10 & 31;
        var mantissa = bits & 1023;
        if (exponent === 0) {
            return mantissa === 0 ? sign * 0 : sign * mantissa * 5960464477539063e-23;
        }
        if (exponent === 31) {
            return mantissa === 0 ? sign * Infinity : NaN;
        }
        return sign * Math.pow(2, exponent - 15) * (1 + mantissa / 1024);
    };
    var mathF16round = function mathF16round(value) {
        var n = +value;
        if (n !== n) return NaN;
        if (n === 0 || n === Infinity || n === -Infinity) return n;
        return float16BitsToDouble(doubleToFloat16Bits(n));
    };
    var dataViewGetFloat16 = function dataViewGetFloat16(byteOffset, littleEndian) {
        return float16BitsToDouble(this.getUint16(byteOffset, !!littleEndian));
    };
    var dataViewSetFloat16 = function dataViewSetFloat16(byteOffset, value, littleEndian) {
        this.setUint16(byteOffset, doubleToFloat16Bits(value), !!littleEndian);
    };
    var install25 = function install25() {
        if (scratch) {
            if (typeof Math.f16round !== "function") {
                define(Math, "f16round", mathF16round);
            }
            if (typeof DataView !== "undefined" && DataView.prototype) {
                if (typeof DataView.prototype.getFloat16 !== "function") {
                    Object.defineProperty(DataView.prototype, "getFloat16", {
                        value: dataViewGetFloat16,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    try {
                        Object.defineProperty(DataView.prototype.getFloat16, "name", {
                            value: "getFloat16",
                            configurable: true
                        });
                    } catch (e) {}
                    Object.defineProperty(DataView.prototype.getFloat16, "__polyfilled", {
                        value: true
                    });
                }
                if (typeof DataView.prototype.setFloat16 !== "function") {
                    Object.defineProperty(DataView.prototype, "setFloat16", {
                        value: dataViewSetFloat16,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    try {
                        Object.defineProperty(DataView.prototype.setFloat16, "name", {
                            value: "setFloat16",
                            configurable: true
                        });
                    } catch (e) {}
                    Object.defineProperty(DataView.prototype.setFloat16, "__polyfilled", {
                        value: true
                    });
                }
            }
        }
    };
    // src/modules/_typed-array-impl.ts
    var isSupported113 = function isSupported113() {
        try {
            if (typeof Uint8Array === "undefined") {
                return false;
            }
            var prototype = Uint8Array.prototype;
            var allPresent = typeof prototype.find === "function" && typeof prototype.findIndex === "function" && typeof prototype.every === "function" && typeof prototype.some === "function" && typeof prototype.forEach === "function" && typeof prototype.map === "function" && typeof prototype.filter === "function" && typeof prototype.indexOf === "function" && typeof prototype.lastIndexOf === "function" && typeof prototype.join === "function" && typeof prototype.reduce === "function" && typeof prototype.reduceRight === "function" && typeof prototype.reverse === "function" && typeof prototype.slice === "function" && typeof prototype.sort === "function" && typeof prototype.copyWithin === "function" && typeof prototype.fill === "function" && typeof prototype.keys === "function" && typeof prototype.values === "function" && typeof prototype.entries === "function" && prototype.toString !== Object.prototype.toString && prototype.toLocaleString !== Object.prototype.toLocaleString;
            if (!allPresent) {
                return false;
            }
            var sample = new Int32Array([
                1,
                2,
                3
            ]);
            var mapped = sample.map(function(v) {
                return v * 2;
            });
            if (!mapped || mapped.length !== 3 || mapped[0] !== 2 || mapped[2] !== 6) {
                return false;
            }
            var filtered = sample.filter(function(v) {
                return v > 1;
            });
            if (!filtered || filtered.length !== 2 || filtered[0] !== 2) {
                return false;
            }
            if (sample.find(function(v) {
                return v > 1;
            }) !== 2) {
                return false;
            }
            if (sample.reduce(function(a, b) {
                return a + b;
            }, 0) !== 6) {
                return false;
            }
            if (sample.slice(1).length !== 2) {
                return false;
            }
            if (sample.join("-") !== "1-2-3") {
                return false;
            }
            if (sample.indexOf(3) !== 2) {
                return false;
            }
            var iter = sample.values();
            if (!iter || typeof iter.next !== "function" || iter.next().value !== 1) {
                return false;
            }
            var seen = 0;
            sample.forEach(function() {
                seen++;
            });
            return seen === 3;
        } catch (unused) {
            return false;
        }
    };
    var typedArrayFind = function typedArrayFind(predicate, thisArg) {
        if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
        for(var i = 0; i < this.length; i++){
            if (predicate.call(thisArg, this[i], i, this)) {
                return this[i];
            }
        }
        return void 0;
    };
    var typedArrayFindIndex = function typedArrayFindIndex(predicate, thisArg) {
        if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
        for(var i = 0; i < this.length; i++){
            if (predicate.call(thisArg, this[i], i, this)) {
                return i;
            }
        }
        return -1;
    };
    var typedArrayIncludes = function typedArrayIncludes(searchElement, fromIndex) {
        var n = fromIndex !== void 0 ? +fromIndex : 0;
        if (n !== n) n = 0;
        n = n >= 0 ? Math.floor(n) : Math.ceil(n);
        for(var i = Math.max(n >= 0 ? n : this.length + n, 0); i < this.length; i++){
            var el = this[i];
            if (el === searchElement || el !== el && searchElement !== searchElement) {
                return true;
            }
        }
        return false;
    };
    var typedArrayAt = function typedArrayAt(index) {
        var n = +index;
        var i = n !== n ? 0 : n < 0 ? Math.ceil(n) : Math.floor(n);
        if (i < 0) {
            i += this.length;
        }
        if (i < 0 || i >= this.length) {
            return void 0;
        }
        return this[i];
    };
    var typedArrayEvery = function typedArrayEvery(predicate, thisArg) {
        if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
        for(var i = 0; i < this.length; i++){
            if (!predicate.call(thisArg, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
    var typedArraySome = function typedArraySome(predicate, thisArg) {
        if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
        for(var i = 0; i < this.length; i++){
            if (predicate.call(thisArg, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
    var typedArrayForEach = function typedArrayForEach(callback, thisArg) {
        if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
        for(var i = 0; i < this.length; i++){
            callback.call(thisArg, this[i], i, this);
        }
        return void 0;
    };
    var typedArrayMap = function typedArrayMap(callback, thisArg) {
        if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
        var out = new this.constructor(this.length);
        for(var i = 0; i < this.length; i++){
            out[i] = callback.call(thisArg, this[i], i, this);
        }
        return out;
    };
    var typedArrayFilter = function typedArrayFilter(predicate, thisArg) {
        if (typeof predicate !== "function") throw new TypeError(predicate + " is not a function");
        var kept = [];
        for(var i = 0; i < this.length; i++){
            var el = this[i];
            if (predicate.call(thisArg, el, i, this)) {
                kept.push(el);
            }
        }
        var out = new this.constructor(kept.length);
        for(var i1 = 0; i1 < kept.length; i1++){
            out[i1] = kept[i1];
        }
        return out;
    };
    var typedArrayIndexOf = function typedArrayIndexOf(searchElement, fromIndex) {
        var len = this.length;
        var n = 0;
        if (fromIndex !== void 0) {
            n = +fromIndex;
            n = n !== n ? 0 : n >= 0 ? Math.floor(n) : Math.ceil(n);
        }
        if (n >= len) return -1;
        for(var i = Math.max(n >= 0 ? n : len + n, 0); i < len; i++){
            if (this[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    var typedArrayLastIndexOf = function typedArrayLastIndexOf(searchElement, fromIndex) {
        var len = this.length;
        var k = len - 1;
        if (arguments.length > 1) {
            k = +fromIndex;
            k = k !== k ? 0 : k >= 0 ? Math.floor(k) : Math.ceil(k);
        }
        k = k >= 0 ? Math.min(k, len - 1) : len + k;
        for(var i = k; i >= 0; i--){
            if (this[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    var typedArrayJoin = function typedArrayJoin(separator) {
        var sep = separator === void 0 ? "," : String(separator);
        var ta = this;
        var out = "";
        for(var i = 0; i < ta.length; i++){
            if (i > 0) out += sep;
            out += ta[i];
        }
        return out;
    };
    var typedArrayToString = function typedArrayToString() {
        var ta = this;
        var out = "";
        for(var i = 0; i < ta.length; i++){
            if (i > 0) out += ",";
            out += ta[i];
        }
        return out;
    };
    var typedArrayToLocaleString = function typedArrayToLocaleString() {
        var ta = this;
        var out = "";
        for(var i = 0; i < ta.length; i++){
            if (i > 0) out += ",";
            out += ta[i].toLocaleString();
        }
        return out;
    };
    var typedArrayReduce = function typedArrayReduce(callback, initialValue) {
        if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
        var len = this.length;
        var acc;
        var i = 0;
        if (arguments.length > 1) {
            acc = initialValue;
        } else {
            if (len === 0) {
                throw new TypeError("Reduce of empty array with no initial value");
            }
            acc = this[0];
            i = 1;
        }
        for(; i < len; i++){
            acc = callback(acc, this[i], i, this);
        }
        return acc;
    };
    var typedArrayReduceRight = function typedArrayReduceRight(callback, initialValue) {
        if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
        var len = this.length;
        var acc;
        var i = len - 1;
        if (arguments.length > 1) {
            acc = initialValue;
        } else {
            if (len === 0) {
                throw new TypeError("Reduce of empty array with no initial value");
            }
            acc = this[len - 1];
            i = len - 2;
        }
        for(; i >= 0; i--){
            acc = callback(acc, this[i], i, this);
        }
        return acc;
    };
    var typedArrayReverse = function typedArrayReverse() {
        var len = this.length;
        for(var i = 0, j = len - 1; i < j; i++, j--){
            var tmp = this[i];
            this[i] = this[j];
            this[j] = tmp;
        }
        return this;
    };
    var typedArraySlice = function typedArraySlice(start, end) {
        var len = this.length;
        var from = 0;
        if (start !== void 0) {
            from = +start;
            from = from !== from ? 0 : from >= 0 ? Math.floor(from) : Math.ceil(from);
            from = from < 0 ? Math.max(len + from, 0) : Math.min(from, len);
        }
        var to = len;
        if (end !== void 0) {
            to = +end;
            to = to !== to ? 0 : to >= 0 ? Math.floor(to) : Math.ceil(to);
            to = to < 0 ? Math.max(len + to, 0) : Math.min(to, len);
        }
        var count = Math.max(to - from, 0);
        var out = new this.constructor(count);
        for(var i = 0; i < count; i++){
            out[i] = this[from + i];
        }
        return out;
    };
    var defaultSortCompare = function defaultSortCompare(x, y) {
        if (x !== x) return y !== y ? 0 : 1;
        if (y !== y) return -1;
        if (x < y) return -1;
        if (x > y) return 1;
        if (x === 0 && y === 0) {
            if (1 / x < 0 && 1 / y > 0) return -1;
            if (1 / x > 0 && 1 / y < 0) return 1;
        }
        return 0;
    };
    var typedArraySort = function typedArraySort(compareFn) {
        if (compareFn !== void 0 && typeof compareFn !== "function") {
            throw new TypeError("The comparison function must be either a function or undefined");
        }
        var len = this.length;
        var tmp = [];
        for(var i = 0; i < len; i++){
            tmp.push(this[i]);
        }
        tmp.sort(compareFn !== void 0 ? compareFn : defaultSortCompare);
        for(var i1 = 0; i1 < len; i1++){
            this[i1] = tmp[i1];
        }
        return this;
    };
    var typedArrayCopyWithin = function typedArrayCopyWithin(target, start, end) {
        var len = this.length;
        var to = 0;
        if (target !== void 0) {
            to = +target;
            to = to !== to ? 0 : to >= 0 ? Math.floor(to) : Math.ceil(to);
            to = to < 0 ? Math.max(len + to, 0) : Math.min(to, len);
        }
        var from = 0;
        if (start !== void 0) {
            from = +start;
            from = from !== from ? 0 : from >= 0 ? Math.floor(from) : Math.ceil(from);
            from = from < 0 ? Math.max(len + from, 0) : Math.min(from, len);
        }
        var final = len;
        if (end !== void 0) {
            final = +end;
            final = final !== final ? 0 : final >= 0 ? Math.floor(final) : Math.ceil(final);
            final = final < 0 ? Math.max(len + final, 0) : Math.min(final, len);
        }
        var count = Math.min(final - from, len - to);
        if (from < to && to < from + count) {
            from += count - 1;
            to += count - 1;
            while(count > 0){
                this[to] = this[from];
                to--;
                from--;
                count--;
            }
        } else {
            while(count > 0){
                this[to] = this[from];
                to++;
                from++;
                count--;
            }
        }
        return this;
    };
    var typedArrayFill = function typedArrayFill(value, start, end) {
        var len = this.length;
        var from = 0;
        if (start !== void 0) {
            from = +start;
            from = from !== from ? 0 : from >= 0 ? Math.floor(from) : Math.ceil(from);
            from = from < 0 ? Math.max(len + from, 0) : Math.min(from, len);
        }
        var to = len;
        if (end !== void 0) {
            to = +end;
            to = to !== to ? 0 : to >= 0 ? Math.floor(to) : Math.ceil(to);
            to = to < 0 ? Math.max(len + to, 0) : Math.min(to, len);
        }
        for(var i = from; i < to; i++){
            this[i] = value;
        }
        return this;
    };
    var returnSelfIterator = function returnSelfIterator() {
        return this;
    };
    var TypedArrayIteratorPrototype = {};
    TypedArrayIteratorPrototype.next = function() {
        var ta = this._ta;
        if (ta === null || this._index >= ta.length) {
            this._ta = null;
            return {
                value: void 0,
                done: true
            };
        }
        var index = this._index++;
        var kind = this._kind;
        if (kind === 0) return {
            value: index,
            done: false
        };
        if (kind === 1) return {
            value: ta[index],
            done: false
        };
        return {
            value: [
                index,
                ta[index]
            ],
            done: false
        };
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
        Object.defineProperty(TypedArrayIteratorPrototype, Symbol.iterator, {
            value: returnSelfIterator,
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    var typedArrayKeys = function typedArrayKeys() {
        var iterator = Object.create(TypedArrayIteratorPrototype);
        iterator._ta = this;
        iterator._index = 0;
        iterator._kind = 0;
        return iterator;
    };
    var typedArrayValues = function typedArrayValues() {
        var iterator = Object.create(TypedArrayIteratorPrototype);
        iterator._ta = this;
        iterator._index = 0;
        iterator._kind = 1;
        return iterator;
    };
    var typedArrayEntries = function typedArrayEntries() {
        var iterator = Object.create(TypedArrayIteratorPrototype);
        iterator._ta = this;
        iterator._index = 0;
        iterator._kind = 2;
        return iterator;
    };
    var installTypedArrayPolyfill = function installTypedArrayPolyfill() {
        if (!isSupported113()) {
            var typedArrayTypes = [
                typeof Uint8Array !== "undefined" ? Uint8Array : null,
                typeof Int8Array !== "undefined" ? Int8Array : null,
                typeof Uint16Array !== "undefined" ? Uint16Array : null,
                typeof Int16Array !== "undefined" ? Int16Array : null,
                typeof Uint32Array !== "undefined" ? Uint32Array : null,
                typeof Int32Array !== "undefined" ? Int32Array : null,
                typeof Float32Array !== "undefined" ? Float32Array : null,
                typeof Float64Array !== "undefined" ? Float64Array : null,
                typeof Uint8ClampedArray !== "undefined" ? Uint8ClampedArray : null
            ];
            var typedArrayMethods = [
                [
                    "find",
                    typedArrayFind
                ],
                [
                    "findIndex",
                    typedArrayFindIndex
                ],
                [
                    "includes",
                    typedArrayIncludes
                ],
                [
                    "at",
                    typedArrayAt
                ],
                [
                    "every",
                    typedArrayEvery
                ],
                [
                    "some",
                    typedArraySome
                ],
                [
                    "forEach",
                    typedArrayForEach
                ],
                [
                    "map",
                    typedArrayMap
                ],
                [
                    "filter",
                    typedArrayFilter
                ],
                [
                    "indexOf",
                    typedArrayIndexOf
                ],
                [
                    "lastIndexOf",
                    typedArrayLastIndexOf
                ],
                [
                    "join",
                    typedArrayJoin
                ],
                [
                    "reduce",
                    typedArrayReduce
                ],
                [
                    "reduceRight",
                    typedArrayReduceRight
                ],
                [
                    "reverse",
                    typedArrayReverse
                ],
                [
                    "slice",
                    typedArraySlice
                ],
                [
                    "sort",
                    typedArraySort
                ],
                [
                    "copyWithin",
                    typedArrayCopyWithin
                ],
                [
                    "fill",
                    typedArrayFill
                ],
                [
                    "keys",
                    typedArrayKeys
                ],
                [
                    "values",
                    typedArrayValues
                ],
                [
                    "entries",
                    typedArrayEntries
                ]
            ];
            for(var i = 0; i < typedArrayTypes.length; i++){
                var TypedArray = typedArrayTypes[i];
                if (!TypedArray) continue;
                var proto2 = TypedArray.prototype;
                for(var m = 0; m < typedArrayMethods.length; m++){
                    var name = typedArrayMethods[m][0];
                    {
                        try {
                            Object.defineProperty(typedArrayMethods[m][1], "name", {
                                value: name,
                                configurable: true
                            });
                        } catch (e) {}
                        Object.defineProperty(proto2, name, {
                            value: typedArrayMethods[m][1],
                            writable: true,
                            enumerable: false,
                            configurable: true
                        });
                        Object.defineProperty(proto2[name], "__polyfilled", {
                            value: true
                        });
                    }
                }
                if (proto2.toString === Object.prototype.toString) {
                    Object.defineProperty(proto2, "toString", {
                        value: typedArrayToString,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    try {
                        Object.defineProperty(proto2.toString, "name", {
                            value: "toString",
                            configurable: true
                        });
                    } catch (e) {}
                    Object.defineProperty(proto2.toString, "__polyfilled", {
                        value: true
                    });
                }
                if (proto2.toLocaleString === Object.prototype.toLocaleString) {
                    Object.defineProperty(proto2, "toLocaleString", {
                        value: typedArrayToLocaleString,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    try {
                        Object.defineProperty(proto2.toLocaleString, "name", {
                            value: "toLocaleString",
                            configurable: true
                        });
                    } catch (e) {}
                    Object.defineProperty(proto2.toLocaleString, "__polyfilled", {
                        value: true
                    });
                }
                if (typeof Symbol !== "undefined" && Symbol.iterator && !proto2[Symbol.iterator]) {
                    Object.defineProperty(proto2, Symbol.iterator, {
                        value: proto2.values,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(proto2[Symbol.iterator], "__polyfilled", {
                        value: true
                    });
                }
            }
        }
    };
    var isModernSupported = function isModernSupported() {
        try {
            if (typeof Uint8Array === "undefined") {
                return false;
            }
            var prototype = Uint8Array.prototype;
            if (// at (ES2022) and includes (ES2016) live here, not in the ES2015 gate:
            // requiring them there failed Safari 10-15.3 and replaced 22 working
            // natives to supply two missing ones.
            typeof prototype.at !== "function" || typeof prototype.includes !== "function" || typeof prototype.findLast !== "function" || typeof prototype.findLastIndex !== "function" || typeof prototype.toReversed !== "function" || typeof prototype.toSorted !== "function" || typeof prototype.with !== "function" || typeof Uint8Array.from !== "function" || typeof Uint8Array.of !== "function") {
                return false;
            }
            try {
                new Uint8Array(2).set([
                    1,
                    2,
                    3
                ]);
                return false;
            } catch (unused) {}
            return true;
        } catch (unused) {
            return false;
        }
    };
    var typedArrayFindLast = function typedArrayFindLast(predicate, thisArg) {
        if (typeof predicate !== "function") {
            throw new TypeError("predicate is not a function");
        }
        for(var i = this.length - 1; i >= 0; i--){
            if (predicate.call(thisArg, this[i], i, this)) {
                return this[i];
            }
        }
        return void 0;
    };
    var typedArrayFindLastIndex = function typedArrayFindLastIndex(predicate, thisArg) {
        if (typeof predicate !== "function") {
            throw new TypeError("predicate is not a function");
        }
        for(var i = this.length - 1; i >= 0; i--){
            if (predicate.call(thisArg, this[i], i, this)) {
                return i;
            }
        }
        return -1;
    };
    var typedArrayToReversed = function typedArrayToReversed() {
        var len = this.length;
        var out = new this.constructor(len);
        for(var i = 0; i < len; i++){
            out[i] = this[len - i - 1];
        }
        return out;
    };
    var typedArrayToSorted = function typedArrayToSorted(compareFn) {
        if (compareFn !== void 0 && typeof compareFn !== "function") {
            throw new TypeError("The comparison function must be either a function or undefined");
        }
        var len = this.length;
        var out = new this.constructor(len);
        for(var i = 0; i < len; i++){
            out[i] = this[i];
        }
        return typedArraySort.call(out, compareFn);
    };
    var typedArrayWith = function typedArrayWith(index, value) {
        var len = this.length;
        var relative = +index;
        relative = relative !== relative ? 0 : relative >= 0 ? Math.floor(relative) : Math.ceil(relative);
        var actual = relative < 0 ? len + relative : relative;
        if (actual < 0 || actual >= len) {
            throw new RangeError("Invalid index");
        }
        var out = new this.constructor(len);
        for(var i = 0; i < len; i++){
            out[i] = i === actual ? value : this[i];
        }
        return out;
    };
    var typedArraySet = function typedArraySet(source, offset) {
        var targetOffset = 0;
        if (offset !== void 0) {
            targetOffset = +offset;
            targetOffset = targetOffset !== targetOffset ? 0 : targetOffset >= 0 ? Math.floor(targetOffset) : Math.ceil(targetOffset);
        }
        if (targetOffset < 0) {
            throw new RangeError("offset is out of bounds");
        }
        var src = Object(source);
        var srcLength = src.length >>> 0;
        if (srcLength + targetOffset > this.length) {
            throw new RangeError("offset is out of bounds");
        }
        for(var i = 0; i < srcLength; i++){
            this[targetOffset + i] = src[i];
        }
    };
    var typedArrayOf = function typedArrayOf() {
        var len = arguments.length;
        var out = new this(len);
        for(var i = 0; i < len; i++){
            out[i] = arguments[i];
        }
        return out;
    };
    var typedArrayFrom = function typedArrayFrom(source, mapFn, thisArg) {
        if (mapFn !== void 0 && typeof mapFn !== "function") {
            throw new TypeError("mapfn is not a function");
        }
        var src = Object(source);
        var items = [];
        var iteratorKey = typeof Symbol !== "undefined" && Symbol.iterator ? Symbol.iterator : void 0;
        if (iteratorKey && typeof src[iteratorKey] === "function") {
            var iterator = src[iteratorKey]();
            var step = iterator.next();
            while(!step.done){
                items.push(step.value);
                step = iterator.next();
            }
        } else {
            var len = src.length >>> 0;
            for(var i = 0; i < len; i++){
                items.push(src[i]);
            }
        }
        var out = new this(items.length);
        for(var i1 = 0; i1 < items.length; i1++){
            out[i1] = mapFn ? mapFn.call(thisArg, items[i1], i1) : items[i1];
        }
        return out;
    };
    var installTypedArrayExtensionsOnNative = function installTypedArrayExtensionsOnNative() {
        if (!isModernSupported()) {
            var modernTypes = [
                typeof Uint8Array !== "undefined" ? Uint8Array : null,
                typeof Int8Array !== "undefined" ? Int8Array : null,
                typeof Uint16Array !== "undefined" ? Uint16Array : null,
                typeof Int16Array !== "undefined" ? Int16Array : null,
                typeof Uint32Array !== "undefined" ? Uint32Array : null,
                typeof Int32Array !== "undefined" ? Int32Array : null,
                typeof Float32Array !== "undefined" ? Float32Array : null,
                typeof Float64Array !== "undefined" ? Float64Array : null,
                typeof Uint8ClampedArray !== "undefined" ? Uint8ClampedArray : null
            ];
            var modernMethods = [
                [
                    "at",
                    typedArrayAt
                ],
                [
                    "includes",
                    typedArrayIncludes
                ],
                [
                    "findLast",
                    typedArrayFindLast
                ],
                [
                    "findLastIndex",
                    typedArrayFindLastIndex
                ],
                [
                    "toReversed",
                    typedArrayToReversed
                ],
                [
                    "toSorted",
                    typedArrayToSorted
                ],
                [
                    "with",
                    typedArrayWith
                ]
            ];
            var modernStatics = [
                [
                    "from",
                    typedArrayFrom
                ],
                [
                    "of",
                    typedArrayOf
                ]
            ];
            var setIsBroken = function() {
                try {
                    if (typeof Uint8Array === "undefined") return false;
                    new Uint8Array(2).set([
                        1,
                        2,
                        3
                    ]);
                    return true;
                } catch (unused) {
                    return false;
                }
            }();
            for(var i = 0; i < modernTypes.length; i++){
                var TypedArray = modernTypes[i];
                if (!TypedArray) continue;
                var proto2 = TypedArray.prototype;
                for(var m = 0; m < modernMethods.length; m++){
                    var name = modernMethods[m][0];
                    if (!proto2[name]) {
                        try {
                            Object.defineProperty(modernMethods[m][1], "name", {
                                value: name,
                                configurable: true
                            });
                        } catch (e) {}
                        Object.defineProperty(proto2, name, {
                            value: modernMethods[m][1],
                            writable: true,
                            enumerable: false,
                            configurable: true
                        });
                        Object.defineProperty(proto2[name], "__polyfilled", {
                            value: true
                        });
                    }
                }
                if (setIsBroken) {
                    Object.defineProperty(proto2, "set", {
                        value: typedArraySet,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    try {
                        Object.defineProperty(proto2.set, "name", {
                            value: "set",
                            configurable: true
                        });
                    } catch (e) {}
                    Object.defineProperty(proto2.set, "__polyfilled", {
                        value: true
                    });
                }
                for(var s = 0; s < modernStatics.length; s++){
                    var name1 = modernStatics[s][0];
                    if (!TypedArray[name1]) {
                        try {
                            Object.defineProperty(modernStatics[s][1], "name", {
                                value: name1,
                                configurable: true
                            });
                        } catch (e) {}
                        Object.defineProperty(TypedArray, name1, {
                            value: modernStatics[s][1],
                            writable: true,
                            enumerable: false,
                            configurable: true
                        });
                        Object.defineProperty(TypedArray[name1], "__polyfilled", {
                            value: true
                        });
                    }
                }
            }
        }
    };
    var install26 = function install26() {
        installTypedArrayPolyfill();
        installTypedArrayExtensionsOnNative();
    };
    // src/modules/_uint8-array-impl.ts
    var BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var NO_OPTIONS = {};
    var HEX = "0123456789abcdef";
    var isSupported114 = function isSupported114() {
        try {
            if (typeof Uint8Array === "undefined") {
                return false;
            }
            return typeof Uint8Array.fromBase64 === "function" && typeof Uint8Array.fromHex === "function" && typeof Uint8Array.prototype.toBase64 === "function" && typeof Uint8Array.prototype.toHex === "function" && typeof Uint8Array.prototype.setFromBase64 === "function" && typeof Uint8Array.prototype.setFromHex === "function";
        } catch (unused) {
            return false;
        }
    };
    var DETACHED_FLAG3 = "__spackleDetached";
    var isDetached2 = function isDetached2(value) {
        var buffer = value.buffer;
        if (buffer && buffer[DETACHED_FLAG3] === true) {
            return true;
        }
        try {
            new Uint8Array(buffer, 0, 0);
            return false;
        } catch (unused) {
            try {
                return buffer.byteLength === 0;
            } catch (unused) {
                return true;
            }
        }
    };
    var decodeBase64 = function decodeBase64(input, chars, maxBytes, lastChunkHandling, emit) {
        if (maxBytes === 0) {
            return {
                read: 0,
                written: 0
            };
        }
        var length = input.length;
        var index = 0;
        var read = 0;
        var written = 0;
        var chunk = 0;
        var chunkLength = 0;
        var flushPartial = function flushPartial() {
            if (chunkLength === 2) {
                emit(chunk >> 4 & 255);
                written++;
            } else {
                emit(chunk >> 10 & 255);
                emit(chunk >> 2 & 255);
                written += 2;
            }
        };
        var extraBitsSet = function extraBitsSet() {
            return chunkLength === 2 ? (chunk & 15) !== 0 : (chunk & 3) !== 0;
        };
        for(;;){
            if (index === length) {
                if (chunkLength > 0) {
                    if (lastChunkHandling === "stop-before-partial") {
                        return {
                            read: read,
                            written: written
                        };
                    }
                    if (chunkLength === 1) {
                        throw new SyntaxError("Invalid base64: a single trailing character");
                    }
                    if (lastChunkHandling === "strict") {
                        throw new SyntaxError("Invalid base64: incomplete final chunk");
                    }
                    if (written + (chunkLength - 1) > maxBytes) {
                        return {
                            read: read,
                            written: written
                        };
                    }
                    flushPartial();
                }
                return {
                    read: length,
                    written: written
                };
            }
            var ch = input.charAt(index);
            index++;
            if (ch === " " || ch === "	" || ch === "\n" || ch === "\f" || ch === "\r") continue;
            if (ch === "=") {
                if (chunkLength < 2) {
                    throw new SyntaxError("Invalid base64: misplaced padding");
                }
                var sawSecond = false;
                while(index < length){
                    var tail = input.charAt(index);
                    index++;
                    if (tail === " " || tail === "	" || tail === "\n" || tail === "\f" || tail === "\r") continue;
                    if (tail === "=" && chunkLength === 2 && !sawSecond) {
                        sawSecond = true;
                        continue;
                    }
                    throw new SyntaxError("Invalid base64: characters after padding");
                }
                if (chunkLength === 2 && !sawSecond) {
                    if (lastChunkHandling === "stop-before-partial") {
                        return {
                            read: read,
                            written: written
                        };
                    }
                    throw new SyntaxError("Invalid base64: missing padding");
                }
                if (lastChunkHandling === "strict" && extraBitsSet()) {
                    throw new SyntaxError("Invalid base64: non-zero padding bits");
                }
                if (written + (chunkLength - 1) > maxBytes) {
                    return {
                        read: read,
                        written: written
                    };
                }
                flushPartial();
                return {
                    read: length,
                    written: written
                };
            }
            var value = chars.indexOf(ch);
            if (value === -1) {
                throw new SyntaxError("Invalid base64: bad character");
            }
            if (written === maxBytes && chunkLength === 0) {
                return {
                    read: read,
                    written: written
                };
            }
            chunk = chunk * 64 + value;
            chunkLength++;
            if (chunkLength === 4) {
                if (written + 3 > maxBytes) {
                    return {
                        read: read,
                        written: written
                    };
                }
                emit(chunk >> 16 & 255);
                emit(chunk >> 8 & 255);
                emit(chunk & 255);
                written += 3;
                chunk = 0;
                chunkLength = 0;
                read = index;
                if (written === maxBytes) {
                    return {
                        read: read,
                        written: written
                    };
                }
            }
        }
    };
    var decodeHex = function decodeHex(input, maxBytes, emit) {
        if (input.length % 2 !== 0) {
            throw new SyntaxError("Invalid hex string: odd length");
        }
        var written = 0;
        var read = 0;
        for(var i = 0; i + 1 < input.length; i += 2){
            if (written >= maxBytes) break;
            var high = HEX.indexOf(input.charAt(i).toLowerCase());
            var low = HEX.indexOf(input.charAt(i + 1).toLowerCase());
            if (high === -1 || low === -1) {
                throw new SyntaxError("Invalid hex string: bad character");
            }
            emit(high * 16 + low);
            written++;
            read = i + 2;
        }
        return {
            read: read,
            written: written
        };
    };
    var uint8ArrayToBase64 = function uint8ArrayToBase64(options) {
        if (typeof Uint8Array === "undefined" || !this || typeof this !== "object" || Object.prototype.toString.call(this) !== "[object Uint8Array]" || this.BYTES_PER_ELEMENT !== 1 || typeof this.byteLength !== "number") {
            throw new TypeError("Uint8Array.prototype.toBase64 called on a non-Uint8Array");
        }
        if (options !== void 0 && (options === null || typeof options !== "object")) {
            throw new TypeError("options must be an object or undefined");
        }
        var opts = options === void 0 ? NO_OPTIONS : options;
        var rawAlphabet = opts.alphabet;
        var alphabet = rawAlphabet === void 0 ? "base64" : rawAlphabet;
        if (alphabet !== "base64" && alphabet !== "base64url") {
            throw new TypeError("alphabet must be either 'base64' or 'base64url'");
        }
        var chars = alphabet === "base64url" ? BASE64URL : BASE64;
        var omitPadding = !!opts.omitPadding;
        if (isDetached2(this)) {
            throw new TypeError("Uint8Array.prototype.toBase64 called on a detached buffer");
        }
        var length = this.length;
        var out = "";
        var i = 0;
        for(; i + 2 < length; i += 3){
            var n = this[i] * 65536 + this[i + 1] * 256 + this[i + 2];
            out += chars.charAt(n >> 18 & 63) + chars.charAt(n >> 12 & 63) + chars.charAt(n >> 6 & 63) + chars.charAt(n & 63);
        }
        var remaining = length - i;
        if (remaining === 1) {
            var n1 = this[i];
            out += chars.charAt(n1 >> 2) + chars.charAt(n1 << 4 & 63);
            if (!omitPadding) out += "==";
        } else if (remaining === 2) {
            var n2 = this[i] * 256 + this[i + 1];
            out += chars.charAt(n2 >> 10) + chars.charAt(n2 >> 4 & 63) + chars.charAt(n2 << 2 & 63);
            if (!omitPadding) out += "=";
        }
        return out;
    };
    var uint8ArrayToHex = function uint8ArrayToHex() {
        if (typeof Uint8Array === "undefined" || !this || typeof this !== "object" || Object.prototype.toString.call(this) !== "[object Uint8Array]" || this.BYTES_PER_ELEMENT !== 1 || typeof this.byteLength !== "number") {
            throw new TypeError("Uint8Array.prototype.toHex called on a non-Uint8Array");
        }
        if (isDetached2(this)) {
            throw new TypeError("Uint8Array.prototype.toHex called on a detached buffer");
        }
        var out = "";
        for(var i = 0; i < this.length; i++){
            var byte = this[i];
            out += HEX.charAt(byte >> 4 & 15) + HEX.charAt(byte & 15);
        }
        return out;
    };
    var uint8ArrayFromBase64 = function uint8ArrayFromBase64(input, options) {
        if (typeof input !== "string") {
            throw new TypeError("argument must be a string");
        }
        if (options !== void 0 && (options === null || typeof options !== "object")) {
            throw new TypeError("options must be an object or undefined");
        }
        var opts = options === void 0 ? NO_OPTIONS : options;
        var rawAlphabet = opts.alphabet;
        var alphabet = rawAlphabet === void 0 ? "base64" : rawAlphabet;
        if (alphabet !== "base64" && alphabet !== "base64url") {
            throw new TypeError("alphabet must be either 'base64' or 'base64url'");
        }
        var chars = alphabet === "base64url" ? BASE64URL : BASE64;
        var rawMode = opts.lastChunkHandling;
        var lastChunkHandling = rawMode === void 0 ? "loose" : rawMode;
        if (lastChunkHandling !== "loose" && lastChunkHandling !== "strict" && lastChunkHandling !== "stop-before-partial") {
            throw new TypeError("lastChunkHandling must be 'loose', 'strict' or 'stop-before-partial'");
        }
        var bytes = [];
        decodeBase64(input, chars, Infinity, lastChunkHandling, function(b) {
            return bytes.push(b);
        });
        var out = new Uint8Array(bytes.length);
        for(var i = 0; i < bytes.length; i++)out[i] = bytes[i];
        return out;
    };
    var uint8ArrayFromHex = function uint8ArrayFromHex(input) {
        if (typeof input !== "string") {
            throw new TypeError("argument must be a string");
        }
        var bytes = [];
        decodeHex(input, Infinity, function(b) {
            return bytes.push(b);
        });
        var out = new Uint8Array(bytes.length);
        for(var i = 0; i < bytes.length; i++)out[i] = bytes[i];
        return out;
    };
    var uint8ArraySetFromBase64 = function uint8ArraySetFromBase64(input, options) {
        if (typeof Uint8Array === "undefined" || !this || typeof this !== "object" || Object.prototype.toString.call(this) !== "[object Uint8Array]" || this.BYTES_PER_ELEMENT !== 1 || typeof this.byteLength !== "number") {
            throw new TypeError("Uint8Array.prototype.setFromBase64 called on a non-Uint8Array");
        }
        if (typeof input !== "string") {
            throw new TypeError("argument must be a string");
        }
        if (options !== void 0 && (options === null || typeof options !== "object")) {
            throw new TypeError("options must be an object or undefined");
        }
        var opts = options === void 0 ? NO_OPTIONS : options;
        var rawAlphabet = opts.alphabet;
        var alphabet = rawAlphabet === void 0 ? "base64" : rawAlphabet;
        if (alphabet !== "base64" && alphabet !== "base64url") {
            throw new TypeError("alphabet must be either 'base64' or 'base64url'");
        }
        var chars = alphabet === "base64url" ? BASE64URL : BASE64;
        var rawMode = opts.lastChunkHandling;
        var lastChunkHandling = rawMode === void 0 ? "loose" : rawMode;
        if (lastChunkHandling !== "loose" && lastChunkHandling !== "strict" && lastChunkHandling !== "stop-before-partial") {
            throw new TypeError("lastChunkHandling must be 'loose', 'strict' or 'stop-before-partial'");
        }
        if (isDetached2(this)) {
            throw new TypeError("Uint8Array.prototype.setFromBase64 called on a detached buffer");
        }
        var target = this;
        var cursor = 0;
        return decodeBase64(input, chars, target.length, lastChunkHandling, function(b) {
            target[cursor++] = b;
        });
    };
    var uint8ArraySetFromHex = function uint8ArraySetFromHex(input) {
        if (typeof Uint8Array === "undefined" || !this || typeof this !== "object" || Object.prototype.toString.call(this) !== "[object Uint8Array]" || this.BYTES_PER_ELEMENT !== 1 || typeof this.byteLength !== "number") {
            throw new TypeError("Uint8Array.prototype.setFromHex called on a non-Uint8Array");
        }
        if (isDetached2(this)) {
            throw new TypeError("Uint8Array.prototype.setFromHex called on a detached buffer");
        }
        if (typeof input !== "string") {
            throw new TypeError("argument must be a string");
        }
        var target = this;
        var cursor = 0;
        return decodeHex(input, target.length, function(b) {
            target[cursor++] = b;
        });
    };
    var SPEC_LENGTH = {
        toBase64: 0,
        toHex: 0,
        setFromBase64: 1,
        setFromHex: 1,
        fromBase64: 1,
        fromHex: 1
    };
    var install27 = function install27() {
        if (typeof Uint8Array !== "undefined") {
            var proto2 = Uint8Array.prototype;
            var protoMethods = [
                [
                    "toBase64",
                    uint8ArrayToBase64
                ],
                [
                    "toHex",
                    uint8ArrayToHex
                ],
                [
                    "setFromBase64",
                    uint8ArraySetFromBase64
                ],
                [
                    "setFromHex",
                    uint8ArraySetFromHex
                ]
            ];
            for(var i = 0; i < protoMethods.length; i++){
                var name = protoMethods[i][0];
                if (!proto2[name]) {
                    try {
                        Object.defineProperty(protoMethods[i][1], "name", {
                            value: name,
                            configurable: true
                        });
                    } catch (e) {}
                    try {
                        Object.defineProperty(protoMethods[i][1], "length", {
                            value: SPEC_LENGTH[name],
                            configurable: true
                        });
                    } catch (e) {}
                    Object.defineProperty(proto2, name, {
                        value: protoMethods[i][1],
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(proto2[name], "__polyfilled", {
                        value: true
                    });
                }
            }
            var statics = [
                [
                    "fromBase64",
                    uint8ArrayFromBase64
                ],
                [
                    "fromHex",
                    uint8ArrayFromHex
                ]
            ];
            for(var i1 = 0; i1 < statics.length; i1++){
                var name1 = statics[i1][0];
                if (!Uint8Array[name1]) {
                    try {
                        Object.defineProperty(statics[i1][1], "name", {
                            value: name1,
                            configurable: true
                        });
                    } catch (e) {}
                    try {
                        Object.defineProperty(statics[i1][1], "length", {
                            value: SPEC_LENGTH[name1],
                            configurable: true
                        });
                    } catch (e) {}
                    Object.defineProperty(Uint8Array, name1, {
                        value: statics[i1][1],
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Uint8Array[name1], "__polyfilled", {
                        value: true
                    });
                }
            }
        }
    };
    // src/modules/es.date.to-iso-string.ts
    var nativeToISOString = Date.prototype.toISOString;
    var isSupported115 = function isSupported115() {
        try {
            if (typeof nativeToISOString !== "function") return false;
            if (nativeToISOString.call(new Date(-5e13 - 1)) !== "0385-07-25T07:06:39.999Z") return false;
            try {
                nativeToISOString.call(/* @__PURE__ */ new Date(NaN));
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var dateToISOString = function toISOString() {
        var time = Date.prototype.getTime.call(this);
        if (time - time !== 0) throw new RangeError("Invalid time value");
        var year = this.getUTCFullYear();
        var sign = year < 0 ? "-" : year > 9999 ? "+" : "";
        var yearText = String(Math.abs(year));
        var yearWidth = sign ? 6 : 4;
        while(yearText.length < yearWidth)yearText = "0" + yearText;
        var month = this.getUTCMonth() + 1;
        var day = this.getUTCDate();
        var hours = this.getUTCHours();
        var minutes = this.getUTCMinutes();
        var seconds = this.getUTCSeconds();
        var ms = this.getUTCMilliseconds();
        return sign + yearText + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day + "T" + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "." + (ms < 10 ? "00" : ms < 100 ? "0" : "") + ms + "Z";
    };
    // src/modules/es.date.to-json.ts
    var nativeToJSON = Date.prototype.toJSON;
    var isSupported116 = function isSupported116() {
        try {
            if (typeof nativeToJSON !== "function") return false;
            if ((/* @__PURE__ */ new Date(NaN)).toJSON() !== null) return false;
            if (nativeToJSON.call({
                toISOString: function toISOString() {
                    return 1;
                }
            }) !== 1) return false;
            return true;
        } catch (unused) {
            return false;
        }
    };
    var dateToJSON = function toJSON(_key) {
        var object = Object(this);
        var primitive = object;
        if (object !== null && typeof object === "object") {
            var converted = false;
            var valueOf = object.valueOf;
            if (typeof valueOf === "function") {
                var result = valueOf.call(object);
                if (result === null || typeof result !== "object") {
                    primitive = result;
                    converted = true;
                }
            }
            if (!converted) {
                var toString = object.toString;
                if (typeof toString === "function") {
                    var result1 = toString.call(object);
                    if (result1 === null || typeof result1 !== "object") {
                        primitive = result1;
                        converted = true;
                    }
                }
            }
            if (!converted) throw new TypeError("Cannot convert object to primitive value");
        }
        return typeof primitive === "number" && primitive - primitive !== 0 ? null : object.toISOString();
    };
    // src/modules/es.date.to-primitive.ts
    var isSupported117 = function isSupported117() {
        try {
            return typeof Symbol === "undefined" || !Symbol.toPrimitive || typeof Date.prototype[Symbol.toPrimitive] === "function";
        } catch (unused) {
            return true;
        }
    };
    var dateToPrimitive = function dateToPrimitive(hint) {
        if (this === null || typeof this !== "object" && typeof this !== "function") {
            throw new TypeError("Date.prototype[Symbol.toPrimitive] called on a non-object");
        }
        var stringFirst;
        if (hint === "string" || hint === "default") {
            stringFirst = true;
        } else if (hint === "number") {
            stringFirst = false;
        } else {
            throw new TypeError("Invalid hint: " + String(hint));
        }
        var first = stringFirst ? this.toString : this.valueOf;
        var second = stringFirst ? this.valueOf : this.toString;
        if (typeof first === "function") {
            var result = first.call(this);
            if (result === null || typeof result !== "object" && typeof result !== "function") {
                return result;
            }
        }
        if (typeof second === "function") {
            var result1 = second.call(this);
            if (result1 === null || typeof result1 !== "object" && typeof result1 !== "function") {
                return result1;
            }
        }
        throw new TypeError("Cannot convert object to primitive value");
    };
    var install28 = function install28() {
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive) {
            Object.defineProperty(Date.prototype, Symbol.toPrimitive, {
                value: dateToPrimitive,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(dateToPrimitive, "name", {
                    value: "[Symbol.toPrimitive]",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(Date.prototype[Symbol.toPrimitive], "__polyfilled", {
                value: true
            });
        }
    };
    // src/modules/es.json.to-string-tag.ts
    var tagKey3 = typeof Symbol !== "undefined" ? Symbol.toStringTag : void 0;
    var isSupported118 = function isSupported118() {
        try {
            return !tagKey3 || typeof JSON === "undefined" || JSON[tagKey3] === "JSON";
        } catch (unused) {
            return true;
        }
    };
    var install29 = function install29() {
        if (tagKey3 && typeof JSON !== "undefined") {
            Object.defineProperty(JSON, tagKey3, {
                configurable: true,
                value: "JSON"
            });
        }
    };
    // src/modules/es.math.acosh.ts
    var isSupported119 = function isSupported119() {
        try {
            if (typeof Math.acosh !== "function") {
                return false;
            }
            var big = Math.acosh(17976931348623157e292);
            return big === big && big !== Infinity;
        } catch (unused) {
            return false;
        }
    };
    var mathAcosh = function mathAcosh(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric < 1) {
            return NaN;
        }
        if (numeric === Infinity) {
            return Infinity;
        }
        if (numeric > 9490626562425156e-8) {
            return Math.log(numeric) + Math.LN2;
        }
        var t = numeric - 1;
        var arg = t + Math.sqrt(t) * Math.sqrt(numeric + 1);
        if (typeof Math.log1p === "function") return Math.log1p(arg);
        return arg > -1e-8 && arg < 1e-8 ? arg - arg * arg / 2 : Math.log(1 + arg);
    };
    // src/modules/es.math.asinh.ts
    var isSupported120 = function isSupported120() {
        try {
            return typeof Math.asinh === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathAsinh = function mathAsinh1(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
            return numeric;
        }
        if (numeric < 0) {
            return -mathAsinh(-numeric);
        }
        return Math.log(numeric + Math.sqrt(numeric * numeric + 1));
    };
    // src/modules/es.math.atanh.ts
    var isSupported121 = function isSupported121() {
        try {
            return typeof Math.atanh === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathAtanh = function mathAtanh(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0) {
            return numeric;
        }
        return Math.log((1 + numeric) / (1 - numeric)) / 2;
    };
    // src/modules/es.math.cbrt.ts
    var isSupported122 = function isSupported122() {
        try {
            return typeof Math.cbrt === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathCbrt = function mathCbrt(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
            return numeric;
        }
        var root = Math.pow(Math.abs(numeric), 1 / 3);
        if (numeric < 0) {
            return -root;
        }
        return root;
    };
    // src/modules/es.math.clz32.ts
    var isSupported123 = function isSupported123() {
        try {
            return typeof Math.clz32 === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathClz32 = function mathClz32(x) {
        var uint32 = x >>> 0;
        if (uint32 === 0) {
            return 32;
        }
        return 31 - Math.floor(Math.log(uint32 + 0.5) * Math.LOG2E);
    };
    // src/modules/es.math.cosh.ts
    var isSupported124 = function isSupported124() {
        try {
            return typeof Math.cosh === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathCosh = function mathCosh(x) {
        var numeric = +x;
        if (numeric !== numeric) {
            return numeric;
        }
        var e = Math.exp(numeric);
        return (e + 1 / e) / 2;
    };
    // src/modules/es.math.expm1.ts
    var isSupported125 = function isSupported125() {
        try {
            if (typeof Math.expm1 !== "function") {
                return false;
            }
            return Math.expm1(-2e-17) === -2e-17;
        } catch (unused) {
            return false;
        }
    };
    var mathExpm1 = function mathExpm1(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0 || numeric === Infinity) {
            return numeric;
        }
        if (numeric === -Infinity) {
            return -1;
        }
        if (numeric > -1e-6 && numeric < 1e-6) {
            return numeric + numeric * numeric / 2;
        }
        return Math.exp(numeric) - 1;
    };
    // src/modules/es.math.fround.ts
    var isSupported126 = function isSupported126() {
        try {
            return typeof Math.fround === "function";
        } catch (unused) {
            return false;
        }
    };
    var float32 = typeof Float32Array !== "undefined" ? new Float32Array(1) : null;
    var mathFround = function mathFround(x) {
        var numeric = +x;
        if (!float32 || numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
            return numeric;
        }
        float32[0] = numeric;
        return float32[0];
    };
    // src/modules/es.math.hypot.ts
    var isSupported127 = function isSupported127() {
        try {
            if (typeof Math.hypot !== "function") {
                return false;
            }
            return Math.hypot(Infinity, NaN) === Infinity;
        } catch (unused) {
            return false;
        }
    };
    var mathHypot = function mathHypot() {
        var max3 = 0;
        var hasInfinity = false;
        var hasNaN = false;
        for(var i = 0; i < arguments.length; i++){
            var numeric = +arguments[i];
            if (numeric === Infinity || numeric === -Infinity) {
                hasInfinity = true;
            } else if (numeric !== numeric) {
                hasNaN = true;
            } else {
                var magnitude = numeric < 0 ? -numeric : numeric;
                if (magnitude > max3) {
                    max3 = magnitude;
                }
            }
        }
        if (hasInfinity) {
            return Infinity;
        }
        if (hasNaN) {
            return NaN;
        }
        if (max3 === 0) {
            return 0;
        }
        var sumOfSquares = 0;
        for(var i1 = 0; i1 < arguments.length; i1++){
            var scaled = +arguments[i1] / max3;
            sumOfSquares += scaled * scaled;
        }
        return max3 * Math.sqrt(sumOfSquares);
    };
    // src/modules/es.math.imul.ts
    var isSupported128 = function isSupported128() {
        try {
            if (typeof Math.imul !== "function") {
                return false;
            }
            return Math.imul(4294967295, 5) === -5;
        } catch (unused) {
            return false;
        }
    };
    var mathImul = function mathImul(a, b) {
        var aHigh = a >>> 16 & 65535;
        var aLow = a & 65535;
        var bHigh = b >>> 16 & 65535;
        var bLow = b & 65535;
        return aLow * bLow + (aHigh * bLow + aLow * bHigh << 16 >>> 0) | 0;
    };
    // src/modules/es.math.log10.ts
    var isSupported129 = function isSupported129() {
        try {
            return typeof Math.log10 === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathLog10 = function mathLog10(x) {
        return Math.log(x) * Math.LOG10E;
    };
    // src/modules/es.math.log1p.ts
    var isSupported130 = function isSupported130() {
        try {
            return typeof Math.log1p === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathLog1p = function mathLog1p(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0) {
            return numeric;
        }
        if (numeric > -1e-8 && numeric < 1e-8) {
            return numeric - numeric * numeric / 2;
        }
        return Math.log(1 + numeric);
    };
    // src/modules/es.math.log2.ts
    var isSupported131 = function isSupported131() {
        try {
            return Math.log2(8) === 3 && Math.log2(1 / 2) === -1;
        } catch (unused) {
            return false;
        }
    };
    var mathLog2 = function mathLog2(x) {
        var approx = Math.log(x) * Math.LOG2E;
        var rounded = Math.round(approx);
        return Math.pow(2, rounded) === x ? rounded : approx;
    };
    // src/modules/es.math.sign.ts
    var isSupported132 = function isSupported132() {
        try {
            return typeof Math.sign === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathSign = function mathSign(x) {
        var numeric = +x;
        if (numeric === 0 || numeric !== numeric) {
            return numeric;
        }
        return numeric > 0 ? 1 : -1;
    };
    // src/modules/es.math.sinh.ts
    var isSupported133 = function isSupported133() {
        try {
            if (typeof Math.sinh !== "function") {
                return false;
            }
            return Math.sinh(-2e-17) === -2e-17;
        } catch (unused) {
            return false;
        }
    };
    var mathSinh = function mathSinh(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
            return numeric;
        }
        if (numeric > -1 && numeric < 1) {
            var hasExpm1 = typeof Math.expm1 === "function";
            var negated = -numeric;
            var a = hasExpm1 ? Math.expm1(numeric) : numeric > -1e-6 && numeric < 1e-6 ? numeric + numeric * numeric / 2 : Math.exp(numeric) - 1;
            var b = hasExpm1 ? Math.expm1(negated) : negated > -1e-6 && negated < 1e-6 ? negated + negated * negated / 2 : Math.exp(negated) - 1;
            return (a - b) / 2;
        }
        return (Math.exp(numeric) - Math.exp(-numeric)) / 2;
    };
    // src/modules/es.math.sum-precise.ts
    var isSupported134 = function isSupported134() {
        try {
            return typeof Math.sumPrecise === "function";
        } catch (unused) {
            return false;
        }
    };
    var LIMB_BITS = 24;
    var LIMB_BASE = 16777216;
    var BIAS = 1074;
    var LIMB_COUNT = 96;
    var scratch2 = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" ? new DataView(new ArrayBuffer(8)) : null;
    var makeAccumulator = function makeAccumulator() {
        var limbs = [];
        for(var i = 0; i < LIMB_COUNT; i++)limbs.push(0);
        return limbs;
    };
    var normalize = function normalize(limbs) {
        var carry = 0;
        for(var i = 0; i < LIMB_COUNT; i++){
            var v = limbs[i] + carry;
            var r = v % LIMB_BASE;
            limbs[i] = r;
            carry = (v - r) / LIMB_BASE;
        }
    };
    var addMagnitude = function addMagnitude(limbs, value) {
        scratch2.setFloat64(0, Math.abs(value));
        var hi = scratch2.getUint32(0);
        var lo = scratch2.getUint32(4);
        var biasedExp = hi >>> 20 & 2047;
        var mantHi = hi & 1048575;
        var mantissa;
        var exp;
        if (biasedExp === 0) {
            mantissa = mantHi * 4294967296 + lo;
            exp = -1074;
        } else {
            mantissa = (mantHi + 1048576) * 4294967296 + lo;
            exp = biasedExp - 1075;
        }
        if (mantissa === 0) return;
        var bit = exp + BIAS;
        var limb = Math.floor(bit / LIMB_BITS);
        var shift = bit % LIMB_BITS;
        var scale = Math.pow(2, shift);
        var c0 = mantissa % LIMB_BASE;
        var c1 = Math.floor(mantissa / LIMB_BASE) % LIMB_BASE;
        var c2 = Math.floor(mantissa / (LIMB_BASE * LIMB_BASE));
        limbs[limb] += c0 * scale;
        limbs[limb + 1] += c1 * scale;
        if (c2 !== 0) limbs[limb + 2] += c2 * scale;
    };
    var compare = function compare(a, b) {
        for(var i = LIMB_COUNT - 1; i >= 0; i--){
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    };
    var subtract = function subtract(a, b) {
        var borrow = 0;
        for(var i = 0; i < LIMB_COUNT; i++){
            var v = a[i] - b[i] - borrow;
            if (v < 0) {
                v += LIMB_BASE;
                borrow = 1;
            } else {
                borrow = 0;
            }
            a[i] = v;
        }
    };
    var anyBitBelow = function anyBitBelow(limbs, index) {
        var limb = Math.floor(index / LIMB_BITS);
        for(var i = 0; i < limb && i < LIMB_COUNT; i++){
            if (limbs[i] !== 0) return 1;
        }
        if (limb < LIMB_COUNT && limbs[limb] % Math.pow(2, index % LIMB_BITS) !== 0) return 1;
        return 0;
    };
    var bitAt = function bitAt(limbs, index) {
        var limb = Math.floor(index / LIMB_BITS);
        if (limb < 0 || limb >= LIMB_COUNT) return 0;
        return Math.floor(limbs[limb] / Math.pow(2, index % LIMB_BITS)) % 2;
    };
    var toDouble = function toDouble(limbs) {
        var top = -1;
        for(var i = LIMB_COUNT - 1; i >= 0 && top < 0; i--){
            if (limbs[i] !== 0) {
                for(var b = LIMB_BITS - 1; b >= 0; b--){
                    if (bitAt(limbs, i * LIMB_BITS + b)) {
                        top = i * LIMB_BITS + b;
                        break;
                    }
                }
            }
        }
        if (top < 0) return 0;
        var low = top - 52 > 0 ? top - 52 : 0;
        var mantissa = 0;
        for(var i1 = top; i1 >= low; i1--)mantissa = mantissa * 2 + bitAt(limbs, i1);
        var exp = low - BIAS;
        if (low > 0) {
            var roundBit = bitAt(limbs, low - 1);
            var sticky = anyBitBelow(limbs, low - 1);
            if (roundBit === 1 && (sticky === 1 || mantissa % 2 === 1)) {
                mantissa += 1;
                if (mantissa === 9007199254740992) {
                    mantissa = 4503599627370496;
                    exp += 1;
                }
            }
        }
        return mantissa * Math.pow(2, exp);
    };
    var sharedPositive = makeAccumulator();
    var sharedNegative = makeAccumulator();
    var busy = false;
    var zero = function zero(limbs) {
        for(var i = 0; i < LIMB_COUNT; i++)limbs[i] = 0;
    };
    var mathSumPrecise = function mathSumPrecise(items) {
        if (items === null || items === void 0) {
            throw new TypeError("Math.sumPrecise called on null or undefined");
        }
        var iteratorKey = typeof Symbol !== "undefined" ? Symbol.iterator : void 0;
        if (!iteratorKey || typeof items[iteratorKey] !== "function") {
            throw new TypeError("Math.sumPrecise argument is not iterable");
        }
        if (!scratch2) {
            throw new TypeError("Math.sumPrecise requires DataView");
        }
        var reentered = busy;
        var positive = reentered ? makeAccumulator() : sharedPositive;
        var negative = reentered ? makeAccumulator() : sharedNegative;
        if (!reentered) {
            zero(positive);
            zero(negative);
            busy = true;
        }
        var result;
        try {
            result = sumInto(items, iteratorKey, positive, negative);
        } catch (error) {
            if (!reentered) busy = false;
            throw error;
        }
        if (!reentered) busy = false;
        return result;
    };
    var sumInto = function sumInto(items, iteratorKey, positive, negative) {
        var count = 0;
        var sinceNormalize = 0;
        var sawNaN = false;
        var sawPosInfinity = false;
        var sawNegInfinity = false;
        var allMinusZero = true;
        var iterator = items[iteratorKey]();
        for(;;){
            var step = iterator.next();
            if (step.done) break;
            var value = step.value;
            if (typeof value !== "number") {
                try {
                    var ret = iterator.return;
                    if (typeof ret === "function") ret.call(iterator);
                } catch (unused) {}
                throw new TypeError("Math.sumPrecise: every element must be a Number");
            }
            count++;
            if (value !== value) {
                sawNaN = true;
                allMinusZero = false;
                continue;
            }
            if (value === Infinity) {
                sawPosInfinity = true;
                allMinusZero = false;
                continue;
            }
            if (value === -Infinity) {
                sawNegInfinity = true;
                allMinusZero = false;
                continue;
            }
            if (value === 0) {
                if (1 / value > 0) allMinusZero = false;
                continue;
            }
            allMinusZero = false;
            addMagnitude(value > 0 ? positive : negative, value);
            if (++sinceNormalize >= 32) {
                normalize(positive);
                normalize(negative);
                sinceNormalize = 0;
            }
        }
        if (sawNaN) return NaN;
        if (sawPosInfinity && sawNegInfinity) return NaN;
        if (sawPosInfinity) return Infinity;
        if (sawNegInfinity) return -Infinity;
        if (count === 0 || allMinusZero) return -0;
        normalize(positive);
        normalize(negative);
        var order = compare(positive, negative);
        if (order === 0) return 0;
        if (order > 0) {
            subtract(positive, negative);
            return toDouble(positive);
        }
        subtract(negative, positive);
        return -toDouble(negative);
    };
    // src/modules/es.math.tanh.ts
    var isSupported135 = function isSupported135() {
        try {
            return typeof Math.tanh === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathTanh = function mathTanh(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0) {
            return numeric;
        }
        var hasExpm1 = typeof Math.expm1 === "function";
        var negated = -numeric;
        var a = hasExpm1 ? Math.expm1(numeric) : numeric > -1e-6 && numeric < 1e-6 ? numeric + numeric * numeric / 2 : Math.exp(numeric) - 1;
        if (a === Infinity) {
            return 1;
        }
        var b = hasExpm1 ? Math.expm1(negated) : negated > -1e-6 && negated < 1e-6 ? negated + negated * negated / 2 : Math.exp(negated) - 1;
        if (b === Infinity) {
            return -1;
        }
        return (a - b) / (a + b + 2);
    };
    // src/modules/es.math.to-string-tag.ts
    var tagKey4 = typeof Symbol !== "undefined" ? Symbol.toStringTag : void 0;
    var isSupported136 = function isSupported136() {
        try {
            return !tagKey4 || Math[tagKey4] === "Math";
        } catch (unused) {
            return true;
        }
    };
    var install30 = function install30() {
        if (tagKey4) {
            Object.defineProperty(Math, tagKey4, {
                configurable: true,
                value: "Math"
            });
        }
    };
    // src/modules/es.math.trunc.ts
    var isSupported137 = function isSupported137() {
        try {
            return typeof Math.trunc === "function";
        } catch (unused) {
            return false;
        }
    };
    var mathTrunc = function mathTrunc(x) {
        var numeric = +x;
        if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
            return numeric;
        }
        if (numeric < 0) {
            return Math.ceil(numeric);
        }
        return Math.floor(numeric);
    };
    // src/modules/es.number.constructor.ts
    var isSupported138 = function isSupported138() {
        try {
            return Number("0b101") === 5 && Number("0o17") === 15;
        } catch (unused) {
            return false;
        }
    };
    var NativeNumber = Number;
    var NumberPolyfill = function NumberPolyfill1(value) {
        var input = arguments.length === 0 ? 0 : value;
        if (arguments.length !== 0 && typeof value === "string") {
            var trimmed = value.replace(/^\s+|\s+$/g, "");
            if (trimmed.length > 2 && trimmed.charAt(0) === "0") {
                var marker = trimmed.charAt(1);
                var digits = trimmed.substring(2);
                if (marker === "b" || marker === "B") {
                    input = /^[01]+$/.test(digits) ? parseInt(digits, 2) : NaN;
                } else if (marker === "o" || marker === "O") {
                    input = /^[0-7]+$/.test(digits) ? parseInt(digits, 8) : NaN;
                }
            }
        }
        if (this instanceof NumberPolyfill) {
            return new NativeNumber(NativeNumber(input));
        }
        return NativeNumber(input);
    };
    NumberPolyfill.prototype = NativeNumber.prototype;
    var staticKeys = [
        "MAX_VALUE",
        "MIN_VALUE",
        "NaN",
        "NEGATIVE_INFINITY",
        "POSITIVE_INFINITY",
        "EPSILON",
        "MAX_SAFE_INTEGER",
        "MIN_SAFE_INTEGER",
        "isFinite",
        "isInteger",
        "isNaN",
        "isSafeInteger",
        "parseFloat",
        "parseInt"
    ];
    for(var i2 = 0; i2 < staticKeys.length; i2++){
        var key = staticKeys[i2];
        var descriptor = Object.getOwnPropertyDescriptor(NativeNumber, key);
        if (descriptor) {
            Object.defineProperty(NumberPolyfill, key, descriptor);
        }
    }
    // src/modules/es.number.epsilon.ts
    var isSupported139 = function isSupported139() {
        try {
            return Number.EPSILON === 2220446049250313e-31;
        } catch (unused) {
            return false;
        }
    };
    var install31 = function install31() {
        try {
            Object.defineProperty(Number, "EPSILON", {
                value: 2220446049250313e-31,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {}
    };
    // src/modules/es.number.is-finite.ts
    var isSupported140 = function isSupported140() {
        try {
            return typeof Number.isFinite === "function";
        } catch (unused) {
            return false;
        }
    };
    var numberIsFinite = function numberIsFinite(value) {
        return typeof value === "number" && value - value === 0;
    };
    // src/modules/es.number.is-integer.ts
    var isSupported141 = function isSupported141() {
        try {
            return typeof Number.isInteger === "function";
        } catch (unused) {
            return false;
        }
    };
    var numberIsInteger = function numberIsInteger(value) {
        return typeof value === "number" && value - value === 0 && Math.floor(value) === value;
    };
    // src/modules/es.number.is-nan.ts
    var isSupported142 = function isSupported142() {
        try {
            return typeof Number.isNaN === "function";
        } catch (unused) {
            return false;
        }
    };
    var numberIsNaN = function numberIsNaN(value) {
        return typeof value === "number" && value !== value;
    };
    // src/modules/es.number.is-safe-integer.ts
    var isSupported143 = function isSupported143() {
        try {
            return typeof Number.isSafeInteger === "function";
        } catch (unused) {
            return false;
        }
    };
    var MAX_SAFE_INTEGER = 9007199254740991;
    var numberIsSafeInteger = function numberIsSafeInteger(value) {
        return typeof value === "number" && value - value === 0 && // x - x === 0: false for NaN and ±Infinity, and no global isFinite call
        Math.floor(value) === value && // it's a whole number...
        Math.abs(value) <= MAX_SAFE_INTEGER;
    };
    // src/modules/es.number.max-safe-integer.ts
    var isSupported144 = function isSupported144() {
        try {
            return Number.MAX_SAFE_INTEGER === 9007199254740991;
        } catch (unused) {
            return false;
        }
    };
    var install32 = function install32() {
        try {
            Object.defineProperty(Number, "MAX_SAFE_INTEGER", {
                value: 9007199254740991,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {}
    };
    // src/modules/es.number.min-safe-integer.ts
    var isSupported145 = function isSupported145() {
        try {
            return Number.MIN_SAFE_INTEGER === -9007199254740991;
        } catch (unused) {
            return false;
        }
    };
    var install33 = function install33() {
        try {
            Object.defineProperty(Number, "MIN_SAFE_INTEGER", {
                value: -9007199254740991,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {}
    };
    // src/modules/es.number.parse-float.ts
    var isSupported146 = function isSupported146() {
        try {
            return Number.parseFloat === parseFloat;
        } catch (unused) {
            return false;
        }
    };
    var numberParseFloat = parseFloat;
    // src/modules/es.number.parse-int.ts
    var isSupported147 = function isSupported147() {
        try {
            return Number.parseInt === parseInt;
        } catch (unused) {
            return false;
        }
    };
    var numberParseInt = parseInt;
    // src/modules/es.number.to-exponential.ts
    var nativeToExponential = Number.prototype.toExponential;
    var abs = Math.abs;
    var floor5 = Math.floor;
    var pow = Math.pow;
    var round = Math.round;
    var POW_10_308 = pow(10, 308);
    var ROUNDS_PROPERLY = function() {
        try {
            return typeof nativeToExponential === "function" && nativeToExponential.call(-69e-12, 4) === "-6.9000e-11" && nativeToExponential.call(1.255, 2) === "1.25e+0" && nativeToExponential.call(12345, 3) === "1.235e+4" && nativeToExponential.call(25, 0) === "3e+1";
        } catch (unused) {
            return false;
        }
    }();
    var throwsOn = function throwsOn(thisArg, arg) {
        try {
            nativeToExponential.call(thisArg, arg);
            return false;
        } catch (unused) {
            return true;
        }
    };
    var isSupported148 = function isSupported148() {
        try {
            if (typeof nativeToExponential !== "function") return false;
            if (!ROUNDS_PROPERLY) return false;
            if (!throwsOn(1, Infinity) || !throwsOn(1, -Infinity)) return false;
            nativeToExponential.call(Infinity, Infinity);
            nativeToExponential.call(NaN, Infinity);
            return true;
        } catch (unused) {
            return false;
        }
    };
    var numberToExponential = function toExponential(fractionDigits) {
        var x = Number.prototype.valueOf.call(this);
        if (fractionDigits === void 0) return nativeToExponential.call(x);
        var f = +fractionDigits;
        f = f !== f || f === 0 ? 0 : f > 0 ? floor5(f) : Math.ceil(f);
        if (x - x !== 0) return String(x);
        if (f < 0 || f > 20) throw new RangeError("Incorrect fraction digits");
        if (ROUNDS_PROPERLY) return nativeToExponential.call(x, f);
        var s = "";
        var m;
        var e;
        var c;
        var d;
        var l;
        var n;
        var xScaled;
        if (x < 0) {
            s = "-";
            x = -x;
        }
        if (x === 0) {
            e = 0;
            m = "";
            for(var i = 0; i < f + 1; i++)m += "0";
        } else {
            l = Math.log(x) / Math.LN10;
            e = floor5(l);
            if (f - e >= 308) {
                xScaled = x * POW_10_308 * pow(10, f - e - 308);
            } else {
                xScaled = x / pow(10, e - f);
            }
            n = round(xScaled);
            if (xScaled - n >= 0.5) {
                n += 1;
            }
            if (n >= pow(10, f + 1)) {
                n /= 10;
                e += 1;
            }
            m = String(n);
        }
        if (f !== 0) {
            m = m.slice(0, 1) + "." + m.slice(1);
        }
        if (e === 0) {
            c = "+";
            d = "0";
        } else {
            c = e > 0 ? "+" : "-";
            d = String(abs(e));
        }
        m += "e" + c + d;
        return s + m;
    };
    // src/modules/es.number.to-fixed.ts
    var nativeToFixed = Number.prototype.toFixed;
    var isSupported149 = function isSupported149() {
        try {
            if (typeof nativeToFixed !== "function") return false;
            if (nativeToFixed.call(8e-5, 3) !== "0.000") return false;
            if (nativeToFixed.call(0.9, 0) !== "1") return false;
            if (nativeToFixed.call(1.255, 2) !== "1.25") return false;
            if (nativeToFixed.call(1000000000000000100, 0) !== "1000000000000000128") return false;
            try {
                nativeToFixed.call({});
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var floor6 = Math.floor;
    var pow2 = function pow21(x, n, acc) {
        return n === 0 ? acc : n % 2 === 1 ? pow2(x, n - 1, acc * x) : pow2(x * x, n / 2, acc);
    };
    var log = function log(x) {
        var n = 0;
        var x2 = x;
        while(x2 >= 4096){
            n += 12;
            x2 /= 4096;
        }
        while(x2 >= 2){
            n += 1;
            x2 /= 2;
        }
        return n;
    };
    var multiply = function multiply(data, n, c) {
        var index = -1;
        var c2 = c;
        while(++index < 6){
            c2 += n * data[index];
            data[index] = c2 % 1e7;
            c2 = floor6(c2 / 1e7);
        }
    };
    var divide = function divide(data, n) {
        var index = 6;
        var c = 0;
        while(--index >= 0){
            c += data[index];
            data[index] = floor6(c / n);
            c = c % n * 1e7;
        }
    };
    var dataToString = function dataToString(data) {
        var index = 6;
        var s = "";
        while(--index >= 0){
            if (s !== "" || index === 0 || data[index] !== 0) {
                var t = String(data[index]);
                var zeros = "";
                for(var r = 0; r < 7 - t.length; r++)zeros += "0";
                s = s === "" ? t : s + zeros + t;
            }
        }
        return s;
    };
    var numberToFixed = function toFixed(fractionDigits) {
        var number = Number.prototype.valueOf.call(this);
        var fractDigits = +fractionDigits;
        fractDigits = fractDigits !== fractDigits || fractDigits === 0 ? 0 : fractDigits > 0 ? floor6(fractDigits) : Math.ceil(fractDigits);
        var data = [
            0,
            0,
            0,
            0,
            0,
            0
        ];
        var sign = "";
        var result = "0";
        var e;
        var z;
        var j;
        var k;
        if (fractDigits < 0 || fractDigits > 20) throw new RangeError("Incorrect fraction digits");
        if (number !== number) return "NaN";
        if (number <= -1e21 || number >= 1e21) return String(number);
        if (number < 0) {
            sign = "-";
            number = -number;
        }
        if (number > 1e-21) {
            e = log(number * pow2(2, 69, 1)) - 69;
            z = e < 0 ? number * pow2(2, -e, 1) : number / pow2(2, e, 1);
            z *= 4503599627370496;
            e = 52 - e;
            if (e > 0) {
                multiply(data, 0, z);
                j = fractDigits;
                while(j >= 7){
                    multiply(data, 1e7, 0);
                    j -= 7;
                }
                multiply(data, pow2(10, j, 1), 0);
                j = e - 1;
                while(j >= 23){
                    divide(data, 1 << 23);
                    j -= 23;
                }
                divide(data, 1 << j);
                multiply(data, 1, 1);
                divide(data, 2);
                result = dataToString(data);
            } else {
                multiply(data, 0, z);
                multiply(data, 1 << -e, 0);
                var zeros = "";
                for(var r = 0; r < fractDigits; r++)zeros += "0";
                result = dataToString(data) + zeros;
            }
        }
        if (fractDigits > 0) {
            k = result.length;
            var zeros1 = "";
            for(var r1 = 0; r1 < fractDigits - k; r1++)zeros1 += "0";
            result = sign + (k <= fractDigits ? "0." + zeros1 + result : result.slice(0, k - fractDigits) + "." + result.slice(k - fractDigits));
        } else {
            result = sign + result;
        }
        return result;
    };
    // src/modules/es.number.to-precision.ts
    var nativeToPrecision = Number.prototype.toPrecision;
    var isSupported150 = function isSupported150() {
        try {
            if (typeof nativeToPrecision !== "function") return false;
            if (nativeToPrecision.call(1, void 0) !== "1") return false;
            try {
                nativeToPrecision.call({});
                return false;
            } catch (unused) {
                return true;
            }
        } catch (unused) {
            return false;
        }
    };
    var numberToPrecision = function toPrecision(precision) {
        var value = Number.prototype.valueOf.call(this);
        return precision === void 0 ? nativeToPrecision.call(value) : nativeToPrecision.call(value, precision);
    };
    // src/modules/es.parse-float.ts
    var WHITESPACE_CODES = [
        9,
        10,
        11,
        12,
        13,
        32,
        160,
        5760,
        8192,
        8193,
        8194,
        8195,
        8196,
        8197,
        8198,
        8199,
        8200,
        8201,
        8202,
        8239,
        8287,
        12288,
        8232,
        8233,
        65279
    ];
    var whitespaces = "";
    for(var i3 = 0; i3 < WHITESPACE_CODES.length; i3++){
        whitespaces += String.fromCharCode(WHITESPACE_CODES[i3]);
    }
    var nativeParseFloat = parseFloat;
    var trimRegExp = new RegExp("^[" + whitespaces + "]+|[" + whitespaces + "]+$", "g");
    var isSupported151 = function isSupported151() {
        try {
            return 1 / nativeParseFloat(whitespaces + "-0") === -Infinity;
        } catch (unused) {
            return false;
        }
    };
    var numberParseFloat2 = function parseFloat2(string) {
        var trimmed = String(string).replace(trimRegExp, "");
        var result = nativeParseFloat(trimmed);
        return result === 0 && trimmed.charAt(0) === "-" ? -0 : result;
    };
    // src/modules/es.parse-int.ts
    var WHITESPACE_CODES2 = [
        9,
        10,
        11,
        12,
        13,
        32,
        160,
        5760,
        8192,
        8193,
        8194,
        8195,
        8196,
        8197,
        8198,
        8199,
        8200,
        8201,
        8202,
        8239,
        8287,
        12288,
        8232,
        8233,
        65279
    ];
    var whitespaces2 = "";
    for(var i4 = 0; i4 < WHITESPACE_CODES2.length; i4++){
        whitespaces2 += String.fromCharCode(WHITESPACE_CODES2[i4]);
    }
    var nativeParseInt = parseInt;
    var trimRegExp2 = new RegExp("^[" + whitespaces2 + "]+|[" + whitespaces2 + "]+$", "g");
    var hexRegExp = /^[+-]?0x/i;
    var isSupported152 = function isSupported152() {
        try {
            return nativeParseInt(whitespaces2 + "08") === 8 && nativeParseInt(whitespaces2 + "0x16") === 22;
        } catch (unused) {
            return false;
        }
    };
    var numberParseInt2 = function parseInt2(string, radix) {
        var S = String(string).replace(trimRegExp2, "");
        return nativeParseInt(S, radix >>> 0 || (hexRegExp.test(S) ? 16 : 10));
    };
    // src/modules/_iterator-impl.ts
    var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : void 0;
    var returnSelf5 = function returnSelf5() {
        return this;
    };
    var getIteratorPrototype = function getIteratorPrototype() {
        if (!iteratorSymbol) return void 0;
        try {
            var arrayIterator = [][iteratorSymbol]();
            var proto2 = Object.getPrototypeOf(Object.getPrototypeOf(arrayIterator));
            if (proto2 && proto2 !== Object.prototype) {
                return proto2;
            }
        } catch (unused) {}
        var synthetic = {};
        Object.defineProperty(synthetic, iteratorSymbol, {
            value: returnSelf5,
            writable: true,
            enumerable: false,
            configurable: true
        });
        return synthetic;
    };
    var IteratorPrototype = getIteratorPrototype();
    var isSupported153 = function isSupported153() {
        try {
            if (!iteratorSymbol || !IteratorPrototype) {
                return true;
            }
            return typeof globalThis.Iterator === "function" && typeof IteratorPrototype.map === "function" && typeof IteratorPrototype.filter === "function" && typeof IteratorPrototype.take === "function" && typeof IteratorPrototype.drop === "function" && typeof IteratorPrototype.flatMap === "function" && typeof IteratorPrototype.reduce === "function" && typeof IteratorPrototype.toArray === "function" && typeof IteratorPrototype.forEach === "function" && typeof IteratorPrototype.some === "function" && typeof IteratorPrototype.every === "function" && typeof IteratorPrototype.find === "function";
        } catch (unused) {
            return false;
        }
    };
    var MAX_SAFE = 9007199254740991;
    var validateLimitOrClose = function validateLimitOrClose(receiver, limit, method) {
        var integerLimit;
        try {
            var numLimit = +limit;
            if (numLimit !== numLimit) {
                throw new RangeError("Iterator.prototype." + method + " limit must not be NaN");
            }
            integerLimit = numLimit === Infinity || numLimit === -Infinity ? numLimit : numLimit >= 0 ? Math.floor(numLimit) : Math.ceil(numLimit);
            if (integerLimit < 0) {
                throw new RangeError("Iterator.prototype." + method + " limit must not be negative");
            }
            if (integerLimit !== Infinity && integerLimit > MAX_SAFE) {
                throw new RangeError("Iterator.prototype." + method + " limit must be a safe integer or Infinity");
            }
        } catch (error) {
            closeIterator(receiver, true);
            throw error;
        }
        return integerLimit;
    };
    var closeIterator = function closeIterator(iterator, swallowErrors) {
        if (!iterator) return;
        var method;
        try {
            method = iterator.return;
        } catch (error) {
            if (swallowErrors) return;
            throw error;
        }
        if (method === null || method === void 0) return;
        if (typeof method !== "function") {
            if (swallowErrors) return;
            throw new TypeError("iterator.return is not a function");
        }
        var result;
        try {
            result = method.call(iterator);
        } catch (error) {
            if (swallowErrors) return;
            throw error;
        }
        if (!swallowErrors && (result === null || typeof result !== "object")) {
            throw new TypeError("iterator return method returned a non-object");
        }
    };
    var IteratorHelperPrototype = IteratorPrototype ? Object.create(IteratorPrototype) : Object.create(Object.prototype);
    var makeHelper = function makeHelper(underlying, kind, callback, limit, nextMethod) {
        var helper = Object.create(IteratorHelperPrototype);
        helper._isIteratorHelper = true;
        helper._running = false;
        helper._underlying = underlying;
        helper._next = nextMethod === void 0 ? underlying.next : nextMethod;
        helper._innerNext = null;
        helper._kind = kind;
        helper._callback = callback;
        helper._limit = limit;
        helper._counter = 0;
        helper._inner = null;
        return helper;
    };
    IteratorHelperPrototype.next = function() {
        if (this === null || typeof this !== "object" || this._isIteratorHelper !== true) {
            throw new TypeError("Iterator Helper.prototype.next called on incompatible receiver");
        }
        if (this._running) {
            throw new TypeError("Iterator Helper is already running");
        }
        var underlying = this._underlying;
        if (underlying === null) {
            return {
                value: void 0,
                done: true
            };
        }
        var kind = this._kind;
        var callback = this._callback;
        this._running = true;
        var closeOnError = true;
        try {
            for(;;){
                if (kind === "take") {
                    if (this._counter >= this._limit) {
                        this._underlying = null;
                        this._callback = null;
                        this._inner = null;
                        this._next = null;
                        this._innerNext = null;
                        closeIterator(underlying, false);
                        this._running = false;
                        return {
                            value: void 0,
                            done: true
                        };
                    }
                }
                if (kind === "flatMap" && this._inner) {
                    if (typeof this._innerNext !== "function") throw new TypeError("iterator.next is not a function");
                    var innerStep = this._innerNext.call(this._inner);
                    if (!innerStep.done) {
                        this._running = false;
                        return {
                            value: innerStep.value,
                            done: false
                        };
                    }
                    this._inner = null;
                    this._innerNext = null;
                }
                closeOnError = false;
                if (typeof this._next !== "function") throw new TypeError("iterator.next is not a function");
                var step = this._next.call(underlying);
                if (step.done) {
                    this._underlying = null;
                    this._callback = null;
                    this._inner = null;
                    this._next = null;
                    this._innerNext = null;
                    this._running = false;
                    return {
                        value: void 0,
                        done: true
                    };
                }
                var value = step.value;
                closeOnError = true;
                var index = this._counter++;
                if (kind === "map") {
                    var mapped = callback(value, index);
                    this._running = false;
                    return {
                        value: mapped,
                        done: false
                    };
                }
                if (kind === "filter") {
                    if (callback(value, index)) {
                        this._running = false;
                        return {
                            value: value,
                            done: false
                        };
                    }
                    continue;
                }
                if (kind === "take") {
                    this._running = false;
                    return {
                        value: value,
                        done: false
                    };
                }
                if (kind === "drop") {
                    if (index < this._limit) {
                        continue;
                    }
                    this._running = false;
                    return {
                        value: value,
                        done: false
                    };
                }
                if (kind === "flatMap") {
                    var mapped1 = callback(value, index);
                    this._inner = getInnerIterator(mapped1);
                    this._innerNext = this._inner.next;
                    continue;
                }
                if (kind === "concat") {
                    this._running = false;
                    return {
                        value: value,
                        done: false
                    };
                }
                this._running = false;
                return {
                    value: value,
                    done: false
                };
            }
        } catch (error) {
            var alreadyClosed = this._underlying === null;
            this._underlying = null;
            this._callback = null;
            this._inner = null;
            this._next = null;
            this._innerNext = null;
            if (!alreadyClosed && closeOnError) {
                closeIterator(underlying, true);
            }
            this._running = false;
            throw error;
        }
    };
    IteratorHelperPrototype.return = function() {
        if (this === null || typeof this !== "object" || this._isIteratorHelper !== true) {
            throw new TypeError("Iterator Helper.prototype.return called on incompatible receiver");
        }
        if (this._running) {
            throw new TypeError("Iterator Helper is already running");
        }
        var underlying = this._underlying;
        if (underlying !== null) {
            var inner = this._inner;
            this._underlying = null;
            this._callback = null;
            this._inner = null;
            this._next = null;
            this._innerNext = null;
            closeIterator(inner, false);
            closeIterator(underlying, false);
        }
        return {
            value: void 0,
            done: true
        };
    };
    if (iteratorSymbol) {
        Object.defineProperty(IteratorHelperPrototype, iteratorSymbol, {
            value: function value() {
                return this;
            },
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    var getInnerIterator = function getInnerIterator(value) {
        if (value === null || typeof value !== "object" && typeof value !== "function") {
            throw new TypeError("flatMap callback must return an object");
        }
        if (iteratorSymbol) {
            var method = value[iteratorSymbol];
            if (method !== null && method !== void 0) {
                if (typeof method !== "function") {
                    throw new TypeError("flatMap callback result's Symbol.iterator is not a function");
                }
                return method.call(value);
            }
        }
        if (typeof value.next === "function") {
            return value;
        }
        throw new TypeError("flatMap callback must return an iterable or iterator");
    };
    var iteratorMap = function iteratorMap(mapper) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.map called on a non-object");
        if (typeof mapper !== "function") {
            closeIterator(this, true);
            throw new TypeError("mapper is not a function");
        }
        var underlying = this;
        return makeHelper(underlying, "map", mapper, 0);
    };
    var iteratorFilter = function iteratorFilter(predicate) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.filter called on a non-object");
        if (typeof predicate !== "function") {
            closeIterator(this, true);
            throw new TypeError("predicate is not a function");
        }
        var underlying = this;
        return makeHelper(underlying, "filter", predicate, 0);
    };
    var iteratorTake = function iteratorTake(limit) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.take called on a non-object");
        var count = validateLimitOrClose(this, limit, "take");
        var underlying = this;
        return makeHelper(underlying, "take", null, count);
    };
    var iteratorDrop = function iteratorDrop(limit) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.drop called on a non-object");
        var count = validateLimitOrClose(this, limit, "drop");
        var underlying = this;
        return makeHelper(underlying, "drop", null, count);
    };
    var iteratorFlatMap = function iteratorFlatMap(mapper) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.flatMap called on a non-object");
        if (typeof mapper !== "function") {
            closeIterator(this, true);
            throw new TypeError("mapper is not a function");
        }
        var underlying = this;
        return makeHelper(underlying, "flatMap", mapper, 0);
    };
    var iteratorToArray = function iteratorToArray() {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.toArray called on a non-object");
        var underlying = this;
        var nextMethod = underlying.next;
        var out = [];
        for(;;){
            if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
            var step = nextMethod.call(underlying);
            if (step.done) return out;
            out.push(step.value);
        }
    };
    var iteratorForEach = function iteratorForEach(fn) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.forEach called on a non-object");
        if (typeof fn !== "function") {
            closeIterator(this, true);
            throw new TypeError("fn is not a function");
        }
        var underlying = this;
        var nextMethod = underlying.next;
        var index = 0;
        for(;;){
            if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
            var step = nextMethod.call(underlying);
            if (step.done) return void 0;
            try {
                fn(step.value, index++);
            } catch (error) {
                closeIterator(underlying, true);
                throw error;
            }
        }
    };
    var iteratorReduce = function iteratorReduce(reducer, initial) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.reduce called on a non-object");
        if (typeof reducer !== "function") {
            closeIterator(this, true);
            throw new TypeError("reducer is not a function");
        }
        var underlying = this;
        var nextMethod = underlying.next;
        var accumulator;
        var index = 0;
        if (arguments.length < 2) {
            if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
            var first = nextMethod.call(underlying);
            if (first.done) {
                throw new TypeError("Reduce of empty iterator with no initial value");
            }
            accumulator = first.value;
            index = 1;
        } else {
            accumulator = initial;
        }
        for(;;){
            if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
            var step = nextMethod.call(underlying);
            if (step.done) return accumulator;
            try {
                accumulator = reducer(accumulator, step.value, index++);
            } catch (error) {
                closeIterator(underlying, true);
                throw error;
            }
        }
    };
    var iteratorSome = function iteratorSome(predicate) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.some called on a non-object");
        if (typeof predicate !== "function") {
            closeIterator(this, true);
            throw new TypeError("predicate is not a function");
        }
        var underlying = this;
        var nextMethod = underlying.next;
        var index = 0;
        for(;;){
            if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
            var step = nextMethod.call(underlying);
            if (step.done) return false;
            try {
                if (predicate(step.value, index++)) {
                    closeIterator(underlying, false);
                    return true;
                }
            } catch (error) {
                closeIterator(underlying, true);
                throw error;
            }
        }
    };
    var iteratorEvery = function iteratorEvery(predicate) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.every called on a non-object");
        if (typeof predicate !== "function") {
            closeIterator(this, true);
            throw new TypeError("predicate is not a function");
        }
        var underlying = this;
        var nextMethod = underlying.next;
        var index = 0;
        for(;;){
            if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
            var step = nextMethod.call(underlying);
            if (step.done) return true;
            try {
                if (!predicate(step.value, index++)) {
                    closeIterator(underlying, false);
                    return false;
                }
            } catch (error) {
                closeIterator(underlying, true);
                throw error;
            }
        }
    };
    var iteratorFind = function iteratorFind(predicate) {
        if (this === null || typeof this !== "object") throw new TypeError("Iterator.prototype.find called on a non-object");
        if (typeof predicate !== "function") {
            closeIterator(this, true);
            throw new TypeError("predicate is not a function");
        }
        var underlying = this;
        var nextMethod = underlying.next;
        var index = 0;
        for(;;){
            if (typeof nextMethod !== "function") throw new TypeError("iterator.next is not a function");
            var step = nextMethod.call(underlying);
            if (step.done) return void 0;
            try {
                if (predicate(step.value, index++)) {
                    closeIterator(underlying, false);
                    return step.value;
                }
            } catch (error) {
                closeIterator(underlying, true);
                throw error;
            }
        }
    };
    var iteratorConcat = function iteratorConcat() {
        var sources = [];
        for(var i = 0; i < arguments.length; i++){
            var source = arguments[i];
            if (source === null || typeof source !== "object") {
                throw new TypeError("Iterator.concat arguments must be objects");
            }
            sources.push(source);
        }
        var cursor = 0;
        var current = null;
        var currentNext = null;
        var driver = {
            next: function next() {
                for(;;){
                    if (current === null) {
                        if (cursor >= sources.length) {
                            return {
                                value: void 0,
                                done: true
                            };
                        }
                        var source = sources[cursor];
                        sources[cursor++] = null;
                        current = iteratorSymbol && typeof source[iteratorSymbol] === "function" ? source[iteratorSymbol]() : source;
                        currentNext = current.next;
                    }
                    if (typeof currentNext !== "function") throw new TypeError("iterator.next is not a function");
                    var step = currentNext.call(current);
                    if (!step.done) {
                        return {
                            value: step.value,
                            done: false
                        };
                    }
                    current = null;
                    currentNext = null;
                }
            },
            return: function _return() {
                closeIterator(current, false);
                current = null;
                currentNext = null;
                sources.length = 0;
                cursor = 0;
                return {
                    value: void 0,
                    done: true
                };
            }
        };
        return makeHelper(driver, "concat", null, 0);
    };
    var iteratorFrom = function iteratorFrom(source) {
        if (typeof source === "string") {
            if (!iteratorSymbol) {
                throw new TypeError("Iterator.from requires Symbol.iterator");
            }
            return makeHelper(source[iteratorSymbol](), "concat", null, 0);
        }
        if (source === null || typeof source !== "object") {
            throw new TypeError("Iterator.from called on a non-object");
        }
        var iterator = iteratorSymbol && typeof source[iteratorSymbol] === "function" ? source[iteratorSymbol]() : source;
        if (typeof iterator.next !== "function") {
            throw new TypeError("Iterator.from argument is not iterable");
        }
        if (IteratorPrototype && IteratorPrototype.isPrototypeOf(iterator)) {
            return iterator;
        }
        return makeHelper(iterator, "concat", null, 0);
    };
    var iteratorDispose = function iteratorDispose() {
        closeIterator(this);
    };
    var ensureSymbol2 = function ensureSymbol2(name) {
        if (typeof Symbol === "undefined") {
            return void 0;
        }
        var existing = Symbol[name];
        if (existing !== void 0) {
            return existing;
        }
        try {
            Object.defineProperty(Symbol, name, {
                value: /* @__PURE__ */ Symbol("Symbol." + name)
            });
        } catch (unused) {
            return void 0;
        }
        return Symbol[name];
    };
    if (IteratorPrototype) {
        var disposeKey2 = ensureSymbol2("dispose");
        if (disposeKey2 && !IteratorPrototype[disposeKey2]) {
            Object.defineProperty(IteratorPrototype, disposeKey2, {
                value: iteratorDispose,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                try {
                    Object.defineProperty(iteratorDispose, "name", {
                        value: "[Symbol.dispose]",
                        configurable: true
                    });
                } catch (e) {}
            } catch (e) {}
            Object.defineProperty(iteratorDispose, "__polyfilled", {
                value: true
            });
        }
    }
    var MAX_CHAIN = 100;
    var inheritsFrom = function inheritsFrom(value, ancestor) {
        var current = value;
        var steps = 0;
        while(current !== null && current !== void 0){
            if (current === ancestor) {
                return true;
            }
            if (++steps > MAX_CHAIN) {
                return true;
            }
            try {
                current = Object.getPrototypeOf(current);
            } catch (e) {
                return false;
            }
        }
        return false;
    };
    var chainTerminates = function chainTerminates(value) {
        var current = value;
        var steps = 0;
        while(current !== null && current !== void 0){
            if (++steps > MAX_CHAIN) {
                return false;
            }
            try {
                current = Object.getPrototypeOf(current);
            } catch (e) {
                return false;
            }
        }
        return true;
    };
    var setProtoOf = function setProtoOf(target, proto2) {
        var previous;
        try {
            previous = Object.getPrototypeOf(target);
        } catch (e) {
            return;
        }
        try {
            if (typeof Object.setPrototypeOf === "function") {
                Object.setPrototypeOf(target, proto2);
            } else {
                target.__proto__ = proto2;
            }
        } catch (e) {
            return;
        }
        try {
            if (Object.getPrototypeOf(target) === proto2 && chainTerminates(target)) {
                return;
            }
            if (typeof Object.setPrototypeOf === "function") {
                Object.setPrototypeOf(target, previous);
            } else {
                target.__proto__ = previous;
            }
        } catch (e) {}
    };
    var protoOfSample = function protoOfSample(make) {
        try {
            var iterator = make();
            if (!iterator || typeof iterator.next !== "function") {
                return void 0;
            }
            return Object.getPrototypeOf(iterator);
        } catch (e) {
            return void 0;
        }
    };
    var installIteratorExtensionsOnNative = function installIteratorExtensionsOnNative() {
        if (!IteratorPrototype || !iteratorSymbol) {
            return;
        }
        var g = typeof window !== "undefined" ? window : globalThis;
        var sources = [
            function() {
                return [].keys();
            },
            function() {
                return [].values();
            },
            function() {
                return [].entries();
            },
            function() {
                return [][iteratorSymbol]();
            },
            function() {
                return ""[iteratorSymbol]();
            },
            function() {
                return new g.Map()[iteratorSymbol]();
            },
            function() {
                return new g.Set()[iteratorSymbol]();
            },
            function() {
                return new g.Uint8Array(1).values();
            },
            function() {
                return "a".matchAll(/a/g);
            },
            function() {
                return g.document.createElement("div").childNodes.values();
            }
        ];
        for(var i = 0; i < sources.length; i++){
            var proto2 = protoOfSample(sources[i]);
            if (!proto2) {
                continue;
            }
            if (proto2 === Object.prototype || inheritsFrom(IteratorPrototype, proto2)) {
                continue;
            }
            if (inheritsFrom(proto2, IteratorPrototype)) {
                continue;
            }
            setProtoOf(proto2, IteratorPrototype);
        }
    };
    var installIteratorPolyfill = function installIteratorPolyfill() {
        if (!isSupported153() && IteratorPrototype) {
            var Iterator = function Iterator() {
                if (this === void 0 || this === null) {
                    throw new TypeError("Constructor Iterator requires 'new'");
                }
            };
            Iterator.prototype = IteratorPrototype;
            try {
                Object.defineProperty(IteratorPrototype, "constructor", {
                    get: function get() {
                        return Iterator;
                    },
                    set: function set(v) {
                        if (this === null || typeof this !== "object") {
                            throw new TypeError("Iterator.prototype.constructor setter called on a non-object");
                        }
                        if (this === IteratorPrototype) {
                            throw new TypeError("Cannot assign to read only property 'constructor' of #<Iterator>");
                        }
                        var desc = Object.getOwnPropertyDescriptor(this, "constructor");
                        if (desc === void 0) {
                            Object.defineProperty(this, "constructor", {
                                value: v,
                                writable: true,
                                enumerable: true,
                                configurable: true
                            });
                        } else {
                            this.constructor = v;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                var ctorDesc = Object.getOwnPropertyDescriptor(IteratorPrototype, "constructor");
                try {
                    Object.defineProperty(ctorDesc.get, "name", {
                        value: "get constructor",
                        configurable: true
                    });
                } catch (e) {}
                try {
                    Object.defineProperty(ctorDesc.set, "name", {
                        value: "set constructor",
                        configurable: true
                    });
                } catch (e) {}
            } catch (unused) {}
            Iterator.from = iteratorFrom;
            Iterator.concat = iteratorConcat;
            var methods = [
                [
                    "map",
                    iteratorMap
                ],
                [
                    "filter",
                    iteratorFilter
                ],
                [
                    "take",
                    iteratorTake
                ],
                [
                    "drop",
                    iteratorDrop
                ],
                [
                    "flatMap",
                    iteratorFlatMap
                ],
                [
                    "toArray",
                    iteratorToArray
                ],
                [
                    "forEach",
                    iteratorForEach
                ],
                [
                    "reduce",
                    iteratorReduce
                ],
                [
                    "some",
                    iteratorSome
                ],
                [
                    "every",
                    iteratorEvery
                ],
                [
                    "find",
                    iteratorFind
                ]
            ];
            for(var i = 0; i < methods.length; i++){
                var name = methods[i][0];
                if (!IteratorPrototype[name]) {
                    try {
                        Object.defineProperty(methods[i][1], "name", {
                            value: name,
                            configurable: true
                        });
                    } catch (e) {}
                    if (name === "reduce") {
                        try {
                            Object.defineProperty(methods[i][1], "length", {
                                value: 1,
                                configurable: true
                            });
                        } catch (e) {}
                    }
                    Object.defineProperty(IteratorPrototype, name, {
                        value: methods[i][1],
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(IteratorPrototype[name], "__polyfilled", {
                        value: true
                    });
                }
            }
            var target = typeof window !== "undefined" ? window : globalThis;
            if (!target.Iterator) {
                Object.defineProperty(target, "Iterator", {
                    value: Iterator,
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
                try {
                    Object.defineProperty(target.Iterator, "name", {
                        value: "Iterator",
                        configurable: true
                    });
                } catch (e) {}
                Object.defineProperty(target.Iterator, "__polyfilled", {
                    value: true
                });
            }
        }
    };
    var install34 = function install34() {
        installIteratorPolyfill();
        installIteratorExtensionsOnNative();
    };
    // src/modules/es.promise.all-settled.ts
    var isSupported154 = function isSupported154() {
        try {
            return typeof Promise !== "undefined" && typeof Promise.allSettled === "function";
        } catch (unused) {
            return false;
        }
    };
    var warnedGenericIterable = false;
    var settle = function settle(PromiseCtor, item, index, results, done) {
        PromiseCtor.resolve(item).then(function(value) {
            results[index] = {
                status: "fulfilled",
                value: value
            };
            done();
        }, function(reason) {
            results[index] = {
                status: "rejected",
                reason: reason
            };
            done();
        });
    };
    var promiseAllSettled = function promiseAllSettled(iterable) {
        var PromiseCtor = Promise;
        if (typeof this === "function") {
            PromiseCtor = this;
        }
        return new PromiseCtor(function(resolve2, reject2) {
            if (iterable == null) {
                reject2(new TypeError("Promise.allSettled requires an array-like or iterable argument"));
                return;
            }
            var items = [];
            if (typeof iterable !== "function" && typeof iterable.length === "number") {
                for(var i = 0; i < iterable.length; i++){
                    items[items.length] = iterable[i];
                }
            } else if (typeof iterable.forEach === "function") {
                iterable.forEach(function(value) {
                    items[items.length] = value;
                });
            } else if (!warnedGenericIterable) {
                warnedGenericIterable = true;
                console.warn("[spackle] Promise.allSettled: generic iterables are not implemented \u2014 only arrays, array-likes and forEach-bearing collections; treating as empty");
            }
            var total = items.length;
            var results = new Array(total);
            var remaining = total;
            if (remaining === 0) {
                resolve2(results);
                return;
            }
            for(var i1 = 0; i1 < total; i1++){
                settle(PromiseCtor, items[i1], i1, results, function() {
                    remaining--;
                    if (remaining === 0) {
                        resolve2(results);
                    }
                });
            }
        });
    };
    // src/modules/es.promise.any.ts
    var isSupported155 = function isSupported155() {
        try {
            return typeof Promise !== "undefined" && typeof Promise.any === "function";
        } catch (unused) {
            return false;
        }
    };
    var warnedGenericIterable2 = false;
    var makeAggregateError = function makeAggregateError(errors, message) {
        if (typeof AggregateError !== "undefined") {
            return new AggregateError(errors, message);
        }
        var err = new Error(message);
        err.name = "AggregateError";
        err.errors = errors;
        return err;
    };
    var collect = function collect(PromiseCtor, item, index, errors, resolve2, done) {
        PromiseCtor.resolve(item).then(function(value) {
            resolve2(value);
        }, function(reason) {
            errors[index] = reason;
            done();
        });
    };
    var promiseAny = function promiseAny(iterable) {
        var PromiseCtor = Promise;
        if (typeof this === "function") {
            PromiseCtor = this;
        }
        return new PromiseCtor(function(resolve2, reject2) {
            if (iterable == null) {
                reject2(new TypeError("Promise.any requires an array-like or iterable argument"));
                return;
            }
            var items = [];
            if (typeof iterable !== "function" && typeof iterable.length === "number") {
                for(var i = 0; i < iterable.length; i++){
                    items[items.length] = iterable[i];
                }
            } else if (typeof iterable.forEach === "function") {
                iterable.forEach(function(value) {
                    items[items.length] = value;
                });
            } else if (!warnedGenericIterable2) {
                warnedGenericIterable2 = true;
                console.warn("[spackle] Promise.any: generic iterables are not implemented \u2014 only arrays, array-likes and forEach-bearing collections; treating as empty");
            }
            var total = items.length;
            var errors = new Array(total);
            var remaining = total;
            if (remaining === 0) {
                reject2(makeAggregateError(errors, "All promises were rejected"));
                return;
            }
            for(var i1 = 0; i1 < total; i1++){
                collect(PromiseCtor, items[i1], i1, errors, resolve2, function() {
                    remaining--;
                    if (remaining === 0) {
                        reject2(makeAggregateError(errors, "All promises were rejected"));
                    }
                });
            }
        });
    };
    // src/modules/es.promise.finally.ts
    var isSupported156 = function isSupported156() {
        try {
            return typeof Promise !== "undefined" && typeof Promise.prototype.finally === "function";
        } catch (unused) {
            return false;
        }
    };
    var promiseFinally = function promiseFinally(callback) {
        var promise = this;
        if (promise === null || typeof promise !== "object" && typeof promise !== "function") {
            throw new TypeError("Promise.prototype.finally called on a non-object");
        }
        var Default = window.Promise;
        var C = promise.constructor;
        if (C === void 0) {
            C = Default;
        } else {
            if (C === null || typeof C !== "object" && typeof C !== "function") {
                throw new TypeError("Promise constructor is not an object");
            }
            var speciesKey = typeof Symbol !== "undefined" ? Symbol.species : void 0;
            var species = speciesKey ? C[speciesKey] : void 0;
            C = species === void 0 || species === null ? Default : species;
        }
        if (typeof callback !== "function") {
            return promise.then(callback, callback);
        }
        return promise.then(function(value) {
            var result = callback();
            var settled = result !== null && typeof result === "object" && result.constructor === C ? result : new C(function(resolve2) {
                resolve2(result);
            });
            return settled.then(function() {
                return value;
            });
        }, function(reason) {
            var result = callback();
            var settled = result !== null && typeof result === "object" && result.constructor === C ? result : new C(function(resolve2) {
                resolve2(result);
            });
            return settled.then(function() {
                throw reason;
            });
        });
    };
    // src/modules/es.promise.try.ts
    var isSupported157 = function isSupported157() {
        try {
            return typeof Promise !== "undefined" && typeof Promise.try === "function";
        } catch (unused) {
            return false;
        }
    };
    var promiseTry = function promiseTry(callback) {
        var argCount = arguments.length;
        var args = null;
        if (argCount > 1) {
            args = [];
            for(var i = 1; i < argCount; i++){
                args[i - 1] = arguments[i];
            }
        }
        return new this(function(resolve2) {
            resolve2(args === null ? callback() : callback.apply(void 0, args));
        });
    };
    // src/modules/es.promise.with-resolvers.ts
    var isSupported158 = function isSupported158() {
        try {
            return typeof Promise !== "undefined" && typeof Promise.withResolvers === "function";
        } catch (unused) {
            return false;
        }
    };
    var promiseWithResolvers = function promiseWithResolvers() {
        var resolve2;
        var reject2;
        var promise = new this(function(resolveFn, rejectFn) {
            resolve2 = resolveFn;
            reject2 = rejectFn;
        });
        return {
            promise: promise,
            resolve: resolve2,
            reject: reject2
        };
    };
    // src/modules/_dom-exception-impl.ts
    var isSupported159 = function isSupported159() {
        try {
            var exception = new DOMException("test");
            return exception instanceof DOMException;
        } catch (unused) {
            return false;
        }
    };
    var DOMEXCEPTION_CODES = {
        IndexSizeError: 1,
        HierarchyRequestError: 3,
        WrongDocumentError: 4,
        InvalidCharacterError: 5,
        NoModificationAllowedError: 7,
        NotFoundError: 8,
        NotSupportedError: 9,
        InvalidStateError: 11,
        SyntaxError: 12,
        InvalidModificationError: 13,
        NamespaceError: 14,
        InvalidAccessError: 15,
        TypeMismatchError: 17,
        SecurityError: 18,
        NetworkError: 19,
        AbortError: 20,
        URLMismatchError: 21,
        QuotaExceededError: 22,
        TimeoutError: 23,
        InvalidNodeTypeError: 24,
        DataCloneError: 25
    };
    function DOMExceptionPolyfill(message, name) {
        var errorName = name || "Error";
        var errorMessage = message || "";
        var err = Error.call(this, errorMessage);
        SLOT7.value = errorMessage;
        Object.defineProperty(this, "message", SLOT7);
        SLOT7.value = void 0;
        SLOT7.value = errorName;
        Object.defineProperty(this, "name", SLOT7);
        SLOT7.value = void 0;
        SLOT7.value = DOMEXCEPTION_CODES[errorName] || 0;
        Object.defineProperty(this, "code", SLOT7);
        SLOT7.value = void 0;
        if (err.stack) {
            SLOT7.value = err.stack;
            Object.defineProperty(this, "stack", SLOT7);
            SLOT7.value = void 0;
        }
    }
    var SLOT7 = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    DOMExceptionPolyfill.prototype = Object.create(Error.prototype);
    Object.defineProperty(DOMExceptionPolyfill.prototype, "constructor", {
        value: DOMExceptionPolyfill,
        writable: true,
        enumerable: false,
        configurable: true
    });
    var install35 = function install35() {
        var native = window.DOMException;
        if (native && native.prototype) {
            var ownProto = DOMExceptionPolyfill.prototype;
            try {
                DOMExceptionPolyfill.prototype = native.prototype;
                var probe = new DOMExceptionPolyfill("m", "SyntaxError");
                if (probe.message !== "m" || probe.name !== "SyntaxError" || probe.code !== 12) throw 0;
                String(probe);
            } catch (e) {
                DOMExceptionPolyfill.prototype = ownProto;
            }
            for(var key in native){
                if (/^[A-Z_]+$/.test(key) && typeof native[key] === "number") {
                    try {
                        Object.defineProperty(DOMExceptionPolyfill, key, {
                            value: native[key],
                            writable: false,
                            enumerable: true,
                            configurable: false
                        });
                    } catch (e) {}
                }
            }
        }
        window.DOMException = null;
        delete window.DOMException;
        define(window, "DOMException", DOMExceptionPolyfill);
    };
    // src/modules/_set-immediate-impl.ts
    var isSupported160 = function isSupported160() {
        try {
            return typeof window.setImmediate === "function";
        } catch (unused) {
            return false;
        }
    };
    var fns = [];
    var argsQ = [];
    var head = 0;
    var baseHandle = 1;
    var post = null;
    var warnedStringCallback = false;
    var runNext = function runNext() {
        if (head >= fns.length) return;
        var fn = fns[head];
        var args = argsQ[head];
        fns[head] = void 0;
        argsQ[head] = void 0;
        head++;
        if (head === fns.length) {
            fns.length = 0;
            argsQ.length = 0;
            baseHandle += head;
            head = 0;
        } else if (head > 1024) {
            var rest = fns.length - head;
            for(var i = 0; i < rest; i++){
                fns[i] = fns[head + i];
                argsQ[i] = argsQ[head + i];
            }
            fns.length = rest;
            argsQ.length = rest;
            baseHandle += head;
            head = 0;
        }
        if (fn) {
            if (args === void 0) fn();
            else fn.apply(void 0, args);
        }
    };
    var makePost = function makePost() {
        var w = window;
        if (typeof w.MessageChannel === "function") {
            var channel = new w.MessageChannel();
            channel.port1.onmessage = runNext;
            return function() {
                channel.port2.postMessage(0);
            };
        }
        return function() {
            setTimeout(runNext, 0);
        };
    };
    var setImmediate2 = function setImmediate2(callback) {
        if (typeof callback !== "function") {
            if (!warnedStringCallback) {
                warnedStringCallback = true;
                console.warn("[spackle] setImmediate: non-function callbacks (string eval form) are not implemented");
            }
            return 0;
        }
        var slot = fns.length;
        fns[slot] = callback;
        if (arguments.length > 1) {
            var args = [];
            for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
            argsQ[slot] = args;
        } else {
            argsQ[slot] = void 0;
        }
        if (post === null) post = makePost();
        post();
        return baseHandle + slot;
    };
    var clearImmediate = function clearImmediate(handle2) {
        var slot = handle2 - baseHandle;
        if (slot >= head && slot < fns.length) {
            fns[slot] = void 0;
            argsQ[slot] = void 0;
        }
    };
    // src/modules/web.atob.ts
    var isSupported161 = function isSupported161() {
        try {
            if (typeof atob !== "function") {
                return false;
            }
            if (atob("aGk=") !== "hi") {
                return false;
            }
            if (atob(" a G k = ") !== "hi") {
                return false;
            }
            try {
                atob("a");
                return false;
            } catch (unused) {}
            return true;
        } catch (unused) {
            return false;
        }
    };
    var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var invalidCharacterError = function invalidCharacterError() {
        var message = "Failed to execute 'atob': The string to be decoded is not correctly encoded.";
        if (typeof DOMException === "function") {
            return new DOMException(message, "InvalidCharacterError");
        }
        var error = new Error(message);
        error.name = "InvalidCharacterError";
        return error;
    };
    var atobPolyfill = function atobPolyfill(data) {
        var input = String(data).replace(/[\t\n\f\r ]/g, "");
        if (input.length % 4 === 0) {
            input = input.replace(/==?$/, "");
        }
        if (input.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(input)) {
            throw invalidCharacterError();
        }
        var output = "";
        var bitStorage = 0;
        var bitCounter = 0;
        for(var i = 0; i < input.length; i++){
            var index = ALPHABET.indexOf(input.charAt(i));
            bitStorage = bitCounter % 4 ? bitStorage * 64 + index : index;
            if (bitCounter++ % 4) {
                output += String.fromCharCode(255 & bitStorage >> (-2 * bitCounter & 6));
            }
        }
        return output;
    };
    // src/modules/web.queue-microtask.ts
    var isSupported162 = function isSupported162() {
        try {
            return typeof window.queueMicrotask === "function";
        } catch (unused) {
            return false;
        }
    };
    var CAPACITY = 1024;
    var queue = [];
    var head2 = 0;
    var scheduled = false;
    var fast = null;
    var drain = function drain() {
        scheduled = false;
        while(head2 < queue.length){
            var callback = queue[head2];
            queue[head2] = void 0;
            head2++;
            try {
                callback();
            } catch (error) {
                setTimeout(function() {
                    throw error;
                }, 0);
            }
            if (head2 > CAPACITY) {
                var rest = queue.length - head2;
                for(var i = 0; i < rest; i++)queue[i] = queue[head2 + i];
                queue.length = rest;
                head2 = 0;
            }
        }
        queue.length = 0;
        head2 = 0;
    };
    var wake = function wake() {
        if (fast === null) {
            var w = window;
            var MO = w.MutationObserver || w.WebKitMutationObserver;
            var ua = w.navigator && w.navigator.userAgent || "";
            var brokenObserver = /(?:ipad|iphone|ipod).*applewebkit/i.test(ua) || /web0s(?!.*chrome)/i.test(ua);
            if (MO && w.document && !brokenObserver) {
                var toggle = true;
                var node = w.document.createTextNode("");
                new MO(drain).observe(node, {
                    characterData: true
                });
                fast = function fast() {
                    toggle = !toggle;
                    node.data = toggle ? "1" : "0";
                };
            } else if (typeof w.MessageChannel === "function") {
                var channel = new w.MessageChannel();
                channel.port1.onmessage = drain;
                fast = function fast() {
                    channel.port2.postMessage(0);
                };
            } else {
                fast = function fast() {
                    setTimeout(drain, 0);
                };
            }
        }
        fast();
    };
    var queueMicrotask = function queueMicrotask(callback) {
        if (typeof callback !== "function") {
            throw new TypeError("queueMicrotask requires a function argument");
        }
        queue[queue.length] = callback;
        if (scheduled) {
            return;
        }
        scheduled = true;
        wake();
    };
    // src/modules/web.self.ts
    var isSupported163 = function isSupported163() {
        try {
            return typeof window === "undefined" || window.self === window;
        } catch (unused) {
            return true;
        }
    };
    var install36 = function install36() {
        if (typeof window !== "undefined") {
            try {
                window.self = window;
            } catch (unused) {}
        }
    };
    // src/modules/web.structured-clone.ts
    var isSupported164 = function isSupported164() {
        try {
            if (typeof window.structuredClone !== "function") return false;
            var source = {
                a: 1,
                nested: {
                    b: 2
                },
                when: /* @__PURE__ */ new Date(0)
            };
            var copy = window.structuredClone(source);
            return copy !== source && copy.nested !== source.nested && copy.a === 1 && copy.nested.b === 2 && copy.when instanceof Date && copy.when.getTime() === 0;
        } catch (unused) {
            return false;
        }
    };
    var hasOwn3 = Object.prototype.hasOwnProperty;
    var objectToString6 = Object.prototype.toString;
    var EngineMap = typeof Map === "function" ? Map : null;
    var ERROR_NAMES = {
        Error: true,
        EvalError: true,
        RangeError: true,
        ReferenceError: true,
        SyntaxError: true,
        TypeError: true,
        URIError: true
    };
    var STACK = {
        value: void 0,
        writable: true,
        enumerable: false,
        configurable: true
    };
    var hasOwnOrInherited = function hasOwnOrInherited(value, key) {
        try {
            return key in value;
        } catch (e) {
            return false;
        }
    };
    var makeSeen = function makeSeen() {
        if (EngineMap) return new EngineMap();
        var keys = [];
        var values = [];
        return {
            has: function has(key) {
                return keys.indexOf(key) !== -1;
            },
            get: function get(key) {
                return values[keys.indexOf(key)];
            },
            set: function set(key, value) {
                keys.push(key);
                values.push(value);
            }
        };
    };
    var cloneError = function cloneError(message) {
        try {
            var error2 = new window.DOMException(message, "DataCloneError");
            if (error2 && error2.name === "DataCloneError") return error2;
        } catch (e) {}
        var error = new TypeError(message);
        error.name = "DataCloneError";
        return error;
    };
    var copyProperties = function copyProperties(source, target, seen) {
        for(var key in source){
            if (hasOwn3.call(source, key)) {
                if (Array.isArray(source)) {
                    var index = +key;
                    if (index >= 0 && index < source.length && Math.floor(index) === index && String(index) === key) {
                        continue;
                    }
                }
                var value = cloneValue(source[key], seen);
                if (key === "__proto__" && typeof Object.defineProperty === "function") {
                    Object.defineProperty(target, key, {
                        value: value,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                } else {
                    target[key] = value;
                }
            }
        }
    };
    var cloneValue = function cloneValue1(value, seen) {
        if (value === null || typeof value !== "object" && typeof value !== "function") {
            if (typeof value === "symbol") throw cloneError("Cannot clone a Symbol");
            return value;
        }
        if (typeof value === "function") throw cloneError("Cannot clone a function");
        if (seen.has(value)) return seen.get(value);
        if (Array.isArray(value)) {
            var copy2 = new Array(value.length);
            seen.set(value, copy2);
            for(var i = 0; i < value.length; i++){
                if (i in value) copy2[i] = cloneValue(value[i], seen);
            }
            copyProperties(value, copy2, seen);
            return copy2;
        }
        if (typeof Map === "function" && value instanceof Map) {
            var copy21 = /* @__PURE__ */ new Map();
            seen.set(value, copy21);
            value.forEach(function(entryValue, key) {
                copy21.set(cloneValue(key, seen), cloneValue(entryValue, seen));
            });
            return copy21;
        }
        if (typeof Set === "function" && value instanceof Set) {
            var copy22 = /* @__PURE__ */ new Set();
            seen.set(value, copy22);
            value.forEach(function(entryValue) {
                copy22.add(cloneValue(entryValue, seen));
            });
            return copy22;
        }
        if (typeof WeakMap === "function" && value instanceof WeakMap || typeof WeakSet === "function" && value instanceof WeakSet || typeof Promise === "function" && value instanceof Promise) {
            throw cloneError("Cannot clone this value");
        }
        if (value instanceof Date) {
            var copy23 = new Date(value.getTime());
            seen.set(value, copy23);
            return copy23;
        }
        if (value instanceof RegExp) {
            var copy24 = new RegExp(value.source, value.flags || "");
            copy24.lastIndex = value.lastIndex;
            seen.set(value, copy24);
            return copy24;
        }
        if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
            var bufferCopy = seen.get(value);
            if (!seen.has(value)) {
                bufferCopy = new ArrayBuffer(value.byteLength);
                seen.set(value, bufferCopy);
                var sourceBytes = new Uint8Array(value);
                var targetBytes = new Uint8Array(bufferCopy);
                for(var i1 = 0; i1 < sourceBytes.length; i1++)targetBytes[i1] = sourceBytes[i1];
            }
            return bufferCopy;
        }
        if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && ArrayBuffer.isView(value)) {
            var buffer = seen.get(value.buffer);
            if (!seen.has(value.buffer)) {
                buffer = new ArrayBuffer(value.buffer.byteLength);
                seen.set(value.buffer, buffer);
                var sourceBytes1 = new Uint8Array(value.buffer);
                var targetBytes1 = new Uint8Array(buffer);
                for(var i2 = 0; i2 < sourceBytes1.length; i2++)targetBytes1[i2] = sourceBytes1[i2];
            }
            var copy25 = objectToString6.call(value) === "[object DataView]" ? new DataView(buffer, value.byteOffset, value.byteLength) : new value.constructor(buffer, value.byteOffset, value.length);
            seen.set(value, copy25);
            return copy25;
        }
        var DOMExceptionCtor = window.DOMException;
        var isDOMException = typeof DOMExceptionCtor === "function" && value instanceof DOMExceptionCtor || objectToString6.call(value) === "[object DOMException]";
        if (isDOMException && typeof DOMExceptionCtor === "function") {
            var copy26 = new DOMExceptionCtor(hasOwnOrInherited(value, "message") ? String(value.message) : "", String(value.name));
            seen.set(value, copy26);
            return copy26;
        }
        if (value instanceof Error || isDOMException) {
            var name = String(value.name);
            var ErrorCtor = ERROR_NAMES[name] === true ? window[name] : Error;
            var hasMessage = hasOwn3.call(value, "message");
            var copy27 = hasMessage ? new ErrorCtor(String(value.message)) : new ErrorCtor();
            seen.set(value, copy27);
            if (value.stack) {
                STACK.value = value.stack;
                Object.defineProperty(copy27, "stack", STACK);
                STACK.value = void 0;
            }
            if (hasOwn3.call(value, "cause")) {
                STACK.value = cloneValue(value.cause, seen);
                Object.defineProperty(copy27, "cause", STACK);
                STACK.value = void 0;
            }
            return copy27;
        }
        var tag = objectToString6.call(value);
        if (tag === "[object Number]" || tag === "[object String]" || tag === "[object Boolean]") {
            var copy28 = Object(value.valueOf());
            seen.set(value, copy28);
            return copy28;
        }
        var copy = {};
        seen.set(value, copy);
        copyProperties(value, copy, seen);
        return copy;
    };
    var structuredClone = function structuredClone(value, _options) {
        return cloneValue(value, makeSeen());
    };
    // src/modules/web.url-search-params.delete.ts
    var isSupported165 = function isSupported165() {
        try {
            if (typeof URLSearchParams === "undefined") {
                return true;
            }
            var params = new URLSearchParams("a=1&a=2");
            params.delete("a", "1");
            return params.toString() === "a=2";
        } catch (unused) {
            return false;
        }
    };
    var nativeDelete = function nativeDelete() {
        var Ctor = window.URLSearchParams;
        return Ctor && Ctor.prototype ? Ctor.prototype.delete : void 0;
    };
    var originalDelete;
    var urlSearchParamsDelete = function urlSearchParamsDelete(name, value) {
        var remove = originalDelete || nativeDelete();
        if (!remove) {
            throw new TypeError("URLSearchParams.prototype.delete is not available");
        }
        if (value === void 0) {
            remove.call(this, name);
            return;
        }
        var key = String(name);
        var unwanted = String(value);
        var survivors = [];
        var names = [];
        this.forEach(function(pairValue, pairName) {
            if (pairName !== key || pairValue !== unwanted) {
                survivors.push([
                    pairName,
                    pairValue
                ]);
            }
            if (names.indexOf(pairName) === -1) {
                names.push(pairName);
            }
        });
        for(var i = 0; i < names.length; i++){
            remove.call(this, names[i]);
        }
        for(var i1 = 0; i1 < survivors.length; i1++){
            this.append(survivors[i1][0], survivors[i1][1]);
        }
    };
    var install37 = function install37() {
        originalDelete = nativeDelete();
        if (originalDelete) {
            define(URLSearchParams.prototype, "delete", urlSearchParamsDelete);
        }
    };
    // src/modules/web.url-search-params.has.ts
    var isSupported166 = function isSupported166() {
        try {
            if (typeof URLSearchParams === "undefined") {
                return true;
            }
            return new URLSearchParams("a=1").has("a", "2") === false;
        } catch (unused) {
            return false;
        }
    };
    var nativeHas = function nativeHas() {
        var Ctor = window.URLSearchParams;
        return Ctor && Ctor.prototype ? Ctor.prototype.has : void 0;
    };
    var originalHas;
    var urlSearchParamsHas = function urlSearchParamsHas(name, value) {
        if (value === void 0) {
            var has = originalHas || nativeHas();
            if (!has) {
                throw new TypeError("URLSearchParams.prototype.has is not available");
            }
            return has.call(this, name);
        }
        var key = String(name);
        var wanted = String(value);
        var found = false;
        this.forEach(function(pairValue, pairName) {
            if (!found && pairName === key && pairValue === wanted) {
                found = true;
            }
        });
        return found;
    };
    var install38 = function install38() {
        originalHas = nativeHas();
        if (originalHas) {
            define(URLSearchParams.prototype, "has", urlSearchParamsHas);
        }
    };
    // src/modules/web.url-search-params.size.ts
    var isSupported167 = function isSupported167() {
        try {
            if (typeof URLSearchParams === "undefined") {
                return true;
            }
            return new URLSearchParams("a=1&a=2").size === 2;
        } catch (unused) {
            return false;
        }
    };
    var urlSearchParamsSizeGetter = function urlSearchParamsSizeGetter() {
        var count = 0;
        this.forEach(function() {
            count++;
        });
        return count;
    };
    var install39 = function install39() {
        if (typeof URLSearchParams !== "undefined" && URLSearchParams.prototype) {
            defineGetter(URLSearchParams.prototype, "size", urlSearchParamsSizeGetter);
        }
    };
    // src/modules/web.url.can-parse.ts
    var isSupported168 = function isSupported168() {
        try {
            return typeof URL === "undefined" || typeof URL.canParse === "function";
        } catch (unused) {
            return true;
        }
    };
    var urlCanParse = function urlCanParse(url, base) {
        try {
            if (base === void 0) {
                new URL(String(url));
            } else {
                new URL(String(url), String(base));
            }
            return true;
        } catch (unused) {
            return false;
        }
    };
    // src/modules/web.url.parse.ts
    var isSupported169 = function isSupported169() {
        try {
            return typeof URL === "undefined" || typeof URL.parse === "function";
        } catch (unused) {
            return true;
        }
    };
    var urlParse = function urlParse(url, base) {
        try {
            return base === void 0 ? new URL(String(url)) : new URL(String(url), String(base));
        } catch (unused) {
            return null;
        }
    };
    // src/modules/web.url.to-json.ts
    var isSupported170 = function isSupported170() {
        try {
            return typeof URL === "undefined" || !URL.prototype || typeof URL.prototype.toJSON === "function";
        } catch (unused) {
            return true;
        }
    };
    var urlToJSON = function urlToJSON() {
        return this.href;
    };
    // src/modules/_reflect-impl.ts
    var isSupported171 = function isSupported171() {
        try {
            var Native = window.Reflect;
            return typeof Native !== "undefined";
        } catch (unused) {
            return false;
        }
    };
    var hasOwn4 = Object.prototype.hasOwnProperty;
    var getProto = Object.getPrototypeOf || function(o) {
        return o.__proto__ || null;
    };
    var setProto2 = Object.setPrototypeOf || function(o, proto2) {
        o.__proto__ = proto2;
        return o;
    };
    var MAX_CHAIN2 = 100;
    var Reflect2 = {
        // apply/construct are the two exceptions: the spec checks callable and
        // constructor respectively, which Function.prototype.apply/bind already do.
        apply: function apply(target, thisArgument, argumentsList) {
            return Function.prototype.apply.call(target, thisArgument, argumentsList);
        },
        // No spread on the floor — bind a null-this constructor with the args spliced
        // in, then `new` it. Re-point the prototype when a distinct newTarget is given.
        construct: function construct(target, argumentsList, newTarget) {
            var args = [
                null
            ];
            for(var i = 0; i < argumentsList.length; i++){
                args[args.length] = argumentsList[i];
            }
            var Bound = Function.prototype.bind.apply(target, args);
            var instance = new Bound();
            if (newTarget !== void 0 && newTarget !== target && newTarget.prototype) {
                setProto2(instance, newTarget.prototype);
            }
            return instance;
        },
        defineProperty: function defineProperty(target, key, attributes) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.defineProperty called on non-object");
            }
            try {
                Object.defineProperty(target, key, attributes);
                return true;
            } catch (e) {
                return false;
            }
        },
        deleteProperty: function deleteProperty(target, key) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.deleteProperty called on non-object");
            }
            try {
                delete target[key];
                return true;
            } catch (e) {
                return false;
            }
        },
        get: function get(target, key, receiver) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.get called on non-object");
            }
            var desc = void 0;
            var owner = target;
            var steps = 0;
            while(owner !== null && owner !== void 0){
                if (hasOwn4.call(owner, key)) {
                    desc = Object.getOwnPropertyDescriptor(owner, key);
                    break;
                }
                if (++steps > MAX_CHAIN2) break;
                owner = getProto(owner);
            }
            if (desc === void 0) {
                return void 0;
            }
            if (desc.get) {
                return desc.get.call(receiver === void 0 ? target : receiver);
            }
            return desc.value;
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, key) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.getOwnPropertyDescriptor called on non-object");
            }
            return Object.getOwnPropertyDescriptor(target, key);
        },
        getPrototypeOf: function getPrototypeOf(target) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.getPrototypeOf called on non-object");
            }
            return getProto(target);
        },
        has: function has(target, key) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.has called on non-object");
            }
            return key in target;
        },
        isExtensible: function isExtensible(target) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.isExtensible called on non-object");
            }
            return Object.isExtensible(target);
        },
        ownKeys: function ownKeys(target) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.ownKeys called on non-object");
            }
            var keys = Object.getOwnPropertyNames(target);
            if (typeof Object.getOwnPropertySymbols === "function") {
                var symbols = Object.getOwnPropertySymbols(target);
                for(var i = 0; i < symbols.length; i++){
                    keys[keys.length] = symbols[i];
                }
            }
            return keys;
        },
        preventExtensions: function preventExtensions(target) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.preventExtensions called on non-object");
            }
            try {
                Object.preventExtensions(target);
                return true;
            } catch (e) {
                return false;
            }
        },
        set: function set(target, key, value, receiver) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.set called on non-object");
            }
            var dest = receiver === void 0 ? target : receiver;
            var desc = void 0;
            var owner = target;
            var steps = 0;
            while(owner !== null && owner !== void 0){
                if (hasOwn4.call(owner, key)) {
                    desc = Object.getOwnPropertyDescriptor(owner, key);
                    break;
                }
                if (++steps > MAX_CHAIN2) break;
                owner = getProto(owner);
            }
            try {
                if (desc && desc.set) {
                    desc.set.call(dest, value);
                    return true;
                }
                if (desc && desc.get && !desc.set) {
                    return false;
                }
                dest[key] = value;
                return true;
            } catch (e) {
                return false;
            }
        },
        setPrototypeOf: function setPrototypeOf(target, proto2) {
            if (target === null || typeof target !== "object" && typeof target !== "function") {
                throw new TypeError("Reflect.setPrototypeOf called on non-object");
            }
            try {
                setProto2(target, proto2);
                return true;
            } catch (e) {
                return false;
            }
        }
    };
    // src/modules/_set-methods-impl.ts
    var SetCtor;
    var proto;
    var sizeGetter;
    var bind2 = function bind2() {
        if (proto !== void 0) return;
        SetCtor = typeof Set !== "undefined" ? Set : null;
        proto = SetCtor ? SetCtor.prototype : null;
        var sizeDescriptor = proto && Object.getOwnPropertyDescriptor(proto, "size");
        sizeGetter = sizeDescriptor ? sizeDescriptor.get : null;
    };
    var setUnion = function union(other) {
        if (proto === void 0) bind2();
        proto.has.call(this);
        var O = this;
        if (other === null || typeof other !== "object" && typeof other !== "function") {
            throw new TypeError("Set-like is not an object");
        }
        var rawSize = +other.size;
        if (rawSize !== rawSize) throw new TypeError("Invalid size");
        var intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
        if (intSize < 0) throw new RangeError("Invalid size");
        var otherHas = other.has;
        var otherKeys = other.keys;
        if (typeof otherHas !== "function") throw new TypeError("has is not callable");
        if (typeof otherKeys !== "function") throw new TypeError("keys is not callable");
        var result = new SetCtor();
        var cloneIterator = proto.keys.call(O);
        var cloneNext = cloneIterator.next;
        var cloneStep;
        while(!(cloneStep = cloneNext.call(cloneIterator)).done)proto.add.call(result, cloneStep.value);
        var recordIterator = otherKeys.call(other);
        if (recordIterator === null || typeof recordIterator !== "object") {
            throw new TypeError("keys() did not return an object");
        }
        var recordNext = recordIterator.next;
        var recordStep;
        while(!(recordStep = recordNext.call(recordIterator)).done){
            var value = recordStep.value;
            proto.add.call(result, value);
        }
        return result;
    };
    var setIntersection = function intersection(other) {
        if (proto === void 0) bind2();
        proto.has.call(this);
        var O = this;
        if (other === null || typeof other !== "object" && typeof other !== "function") {
            throw new TypeError("Set-like is not an object");
        }
        var rawSize = +other.size;
        if (rawSize !== rawSize) throw new TypeError("Invalid size");
        var intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
        if (intSize < 0) throw new RangeError("Invalid size");
        var otherSize = intSize;
        var otherHas = other.has;
        var otherKeys = other.keys;
        if (typeof otherHas !== "function") throw new TypeError("has is not callable");
        if (typeof otherKeys !== "function") throw new TypeError("keys is not callable");
        var result = new SetCtor();
        if (sizeGetter.call(O) > otherSize) {
            var recordIterator = otherKeys.call(other);
            if (recordIterator === null || typeof recordIterator !== "object") {
                throw new TypeError("keys() did not return an object");
            }
            var recordNext = recordIterator.next;
            var recordStep;
            while(!(recordStep = recordNext.call(recordIterator)).done){
                var value = recordStep.value;
                if (proto.has.call(O, value)) proto.add.call(result, value);
            }
        } else {
            var ownIterator = proto.keys.call(O);
            var ownNext = ownIterator.next;
            var ownStep;
            while(!(ownStep = ownNext.call(ownIterator)).done){
                var value1 = ownStep.value;
                if (otherHas.call(other, value1)) proto.add.call(result, value1);
            }
        }
        return result;
    };
    var setDifference = function difference(other) {
        if (proto === void 0) bind2();
        proto.has.call(this);
        var O = this;
        if (other === null || typeof other !== "object" && typeof other !== "function") {
            throw new TypeError("Set-like is not an object");
        }
        var rawSize = +other.size;
        if (rawSize !== rawSize) throw new TypeError("Invalid size");
        var intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
        if (intSize < 0) throw new RangeError("Invalid size");
        var otherSize = intSize;
        var otherHas = other.has;
        var otherKeys = other.keys;
        if (typeof otherHas !== "function") throw new TypeError("has is not callable");
        if (typeof otherKeys !== "function") throw new TypeError("keys is not callable");
        var result = new SetCtor();
        var cloneIterator = proto.keys.call(O);
        var cloneNext = cloneIterator.next;
        var cloneStep;
        while(!(cloneStep = cloneNext.call(cloneIterator)).done)proto.add.call(result, cloneStep.value);
        if (sizeGetter.call(result) <= otherSize) {
            var ownIterator = proto.keys.call(result);
            var ownNext = ownIterator.next;
            var ownStep;
            while(!(ownStep = ownNext.call(ownIterator)).done){
                var value = ownStep.value;
                if (otherHas.call(other, value)) proto["delete"].call(result, value);
            }
        } else {
            var recordIterator = otherKeys.call(other);
            if (recordIterator === null || typeof recordIterator !== "object") {
                throw new TypeError("keys() did not return an object");
            }
            var recordNext = recordIterator.next;
            var recordStep;
            while(!(recordStep = recordNext.call(recordIterator)).done){
                var value1 = recordStep.value;
                if (proto.has.call(result, value1)) proto["delete"].call(result, value1);
            }
        }
        return result;
    };
    var setSymmetricDifference = function symmetricDifference(other) {
        if (proto === void 0) bind2();
        proto.has.call(this);
        var O = this;
        if (other === null || typeof other !== "object" && typeof other !== "function") {
            throw new TypeError("Set-like is not an object");
        }
        var rawSize = +other.size;
        if (rawSize !== rawSize) throw new TypeError("Invalid size");
        var intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
        if (intSize < 0) throw new RangeError("Invalid size");
        var otherHas = other.has;
        var otherKeys = other.keys;
        if (typeof otherHas !== "function") throw new TypeError("has is not callable");
        if (typeof otherKeys !== "function") throw new TypeError("keys is not callable");
        var result = new SetCtor();
        var cloneIterator = proto.keys.call(O);
        var cloneNext = cloneIterator.next;
        var cloneStep;
        while(!(cloneStep = cloneNext.call(cloneIterator)).done)proto.add.call(result, cloneStep.value);
        var recordIterator = otherKeys.call(other);
        if (recordIterator === null || typeof recordIterator !== "object") {
            throw new TypeError("keys() did not return an object");
        }
        var recordNext = recordIterator.next;
        var recordStep;
        while(!(recordStep = recordNext.call(recordIterator)).done){
            var value = recordStep.value;
            if (proto.has.call(O, value)) proto["delete"].call(result, value);
            else proto.add.call(result, value);
        }
        return result;
    };
    var setIsSubsetOf = function isSubsetOf(other) {
        if (proto === void 0) bind2();
        proto.has.call(this);
        var O = this;
        if (other === null || typeof other !== "object" && typeof other !== "function") {
            throw new TypeError("Set-like is not an object");
        }
        var rawSize = +other.size;
        if (rawSize !== rawSize) throw new TypeError("Invalid size");
        var intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
        if (intSize < 0) throw new RangeError("Invalid size");
        var otherSize = intSize;
        var otherHas = other.has;
        var otherKeys = other.keys;
        if (typeof otherHas !== "function") throw new TypeError("has is not callable");
        if (typeof otherKeys !== "function") throw new TypeError("keys is not callable");
        if (sizeGetter.call(O) > otherSize) return false;
        var ownIterator = proto.keys.call(O);
        var ownNext = ownIterator.next;
        var ownStep;
        while(!(ownStep = ownNext.call(ownIterator)).done){
            var value = ownStep.value;
            if (!otherHas.call(other, value)) return false;
        }
        return true;
    };
    var setIsSupersetOf = function isSupersetOf(other) {
        if (proto === void 0) bind2();
        proto.has.call(this);
        var O = this;
        if (other === null || typeof other !== "object" && typeof other !== "function") {
            throw new TypeError("Set-like is not an object");
        }
        var rawSize = +other.size;
        if (rawSize !== rawSize) throw new TypeError("Invalid size");
        var intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
        if (intSize < 0) throw new RangeError("Invalid size");
        var otherSize = intSize;
        var otherHas = other.has;
        var otherKeys = other.keys;
        if (typeof otherHas !== "function") throw new TypeError("has is not callable");
        if (typeof otherKeys !== "function") throw new TypeError("keys is not callable");
        if (sizeGetter.call(O) < otherSize) return false;
        var recordIterator = otherKeys.call(other);
        if (recordIterator === null || typeof recordIterator !== "object") {
            throw new TypeError("keys() did not return an object");
        }
        var recordNext = recordIterator.next;
        var recordStep;
        while(!(recordStep = recordNext.call(recordIterator)).done){
            var value = recordStep.value;
            if (!proto.has.call(O, value)) {
                var ret = recordIterator.return;
                if (ret !== void 0 && ret !== null) {
                    if (typeof ret !== "function") throw new TypeError("iterator.return is not a function");
                    var closed = ret.call(recordIterator);
                    if (closed === null || typeof closed !== "object" && typeof closed !== "function") {
                        throw new TypeError("iterator.return() did not return an object");
                    }
                }
                return false;
            }
        }
        return true;
    };
    var setIsDisjointFrom = function isDisjointFrom(other) {
        if (proto === void 0) bind2();
        proto.has.call(this);
        var O = this;
        if (other === null || typeof other !== "object" && typeof other !== "function") {
            throw new TypeError("Set-like is not an object");
        }
        var rawSize = +other.size;
        if (rawSize !== rawSize) throw new TypeError("Invalid size");
        var intSize = rawSize === 0 ? 0 : rawSize > 0 ? Math.floor(rawSize) : Math.ceil(rawSize);
        if (intSize < 0) throw new RangeError("Invalid size");
        var otherSize = intSize;
        var otherHas = other.has;
        var otherKeys = other.keys;
        if (typeof otherHas !== "function") throw new TypeError("has is not callable");
        if (typeof otherKeys !== "function") throw new TypeError("keys is not callable");
        if (sizeGetter.call(O) <= otherSize) {
            var ownIterator = proto.keys.call(O);
            var ownNext = ownIterator.next;
            var ownStep;
            while(!(ownStep = ownNext.call(ownIterator)).done){
                var value = ownStep.value;
                if (otherHas.call(other, value)) return false;
            }
            return true;
        }
        var recordIterator = otherKeys.call(other);
        if (recordIterator === null || typeof recordIterator !== "object") {
            throw new TypeError("keys() did not return an object");
        }
        var recordNext = recordIterator.next;
        var recordStep;
        while(!(recordStep = recordNext.call(recordIterator)).done){
            var value1 = recordStep.value;
            if (proto.has.call(O, value1)) {
                var ret = recordIterator.return;
                if (ret !== void 0 && ret !== null) {
                    if (typeof ret !== "function") throw new TypeError("iterator.return is not a function");
                    var closed = ret.call(recordIterator);
                    if (closed === null || typeof closed !== "object" && typeof closed !== "function") {
                        throw new TypeError("iterator.return() did not return an object");
                    }
                }
                return false;
            }
        }
        return true;
    };
    var METHODS = [
        [
            "union",
            setUnion
        ],
        [
            "intersection",
            setIntersection
        ],
        [
            "difference",
            setDifference
        ],
        [
            "symmetricDifference",
            setSymmetricDifference
        ],
        [
            "isSubsetOf",
            setIsSubsetOf
        ],
        [
            "isSupersetOf",
            setIsSupersetOf
        ],
        [
            "isDisjointFrom",
            setIsDisjointFrom
        ]
    ];
    var install40 = function install40() {
        if (proto === void 0) bind2();
        if (!proto) return;
        for(var i = 0; i < METHODS.length; i++){
            var name = METHODS[i][0];
            if (typeof proto[name] !== "function") define(proto, name, METHODS[i][1]);
        }
    };
    // src/modules/es.string.iterator.ts
    var isSupported172 = function isSupported172() {
        try {
            return typeof Symbol === "undefined" || !Symbol.iterator || typeof String.prototype[Symbol.iterator] === "function";
        } catch (unused) {
            return true;
        }
    };
    var returnSelf6 = function returnSelf6() {
        return this;
    };
    var StringIteratorPrototype = {};
    StringIteratorPrototype.next = function() {
        var string = this._string;
        if (string === null || this._index >= string.length) {
            this._string = null;
            return {
                value: void 0,
                done: true
            };
        }
        var index = this._index;
        var first = string.charCodeAt(index);
        var size = 1;
        if (first >= 55296 && first <= 56319 && index + 1 < string.length) {
            var second = string.charCodeAt(index + 1);
            if (second >= 56320 && second <= 57343) {
                size = 2;
            }
        }
        this._index = index + size;
        return {
            value: string.substring(index, index + size),
            done: false
        };
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
        Object.defineProperty(StringIteratorPrototype, Symbol.iterator, {
            value: returnSelf6,
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    var stringIterator = function stringIterator() {
        if (this === null || this === void 0) {
            throw new TypeError("String.prototype[Symbol.iterator] called on null or undefined");
        }
        var iterator = Object.create(StringIteratorPrototype);
        iterator._string = typeof this === "string" ? this : String(this);
        iterator._index = 0;
        return iterator;
    };
    var install41 = function install41() {
        if (typeof Symbol !== "undefined" && Symbol.iterator) {
            define(String.prototype, Symbol.iterator, stringIterator, "[Symbol.iterator]");
        }
    };
    // src/modules/web.dom-collections.for-each.ts
    var domCollectionForEach = function domCollectionForEach(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        for(var i = 0; i < this.length; i++){
            callback.call(thisArg, this[i], i, this);
        }
    };
    var install42 = function install42() {
        if (typeof NodeList !== "undefined" && !NodeList.prototype.forEach) {
            define(NodeList.prototype, "forEach", domCollectionForEach);
        }
        if (typeof DOMTokenList !== "undefined" && !DOMTokenList.prototype.forEach) {
            define(DOMTokenList.prototype, "forEach", domCollectionForEach);
        }
    };
    // src/modules/web.dom-collections.iterator.ts
    var returnSelf7 = function returnSelf7() {
        return this;
    };
    var CollectionIteratorPrototype = {};
    CollectionIteratorPrototype.next = function() {
        var collection = this._collection;
        if (collection === null || this._index >= collection.length) {
            this._collection = null;
            return {
                value: void 0,
                done: true
            };
        }
        var index = this._index++;
        var kind = this._kind;
        if (kind === 0) return {
            value: index,
            done: false
        };
        if (kind === 1) return {
            value: collection[index],
            done: false
        };
        return {
            value: [
                index,
                collection[index]
            ],
            done: false
        };
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
        Object.defineProperty(CollectionIteratorPrototype, Symbol.iterator, {
            value: returnSelf7,
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    var domCollectionKeys = function domCollectionKeys() {
        var iterator = Object.create(CollectionIteratorPrototype);
        iterator._collection = this;
        iterator._index = 0;
        iterator._kind = 0;
        return iterator;
    };
    var domCollectionValues = function domCollectionValues() {
        var iterator = Object.create(CollectionIteratorPrototype);
        iterator._collection = this;
        iterator._index = 0;
        iterator._kind = 1;
        return iterator;
    };
    var domCollectionEntries = function domCollectionEntries() {
        var iterator = Object.create(CollectionIteratorPrototype);
        iterator._collection = this;
        iterator._index = 0;
        iterator._kind = 2;
        return iterator;
    };
    var patchCollection = function patchCollection(proto2) {
        if (!proto2.keys) {
            Object.defineProperty(proto2, "keys", {
                value: domCollectionKeys,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(proto2.keys, "name", {
                    value: "keys",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(proto2.keys, "__polyfilled", {
                value: true
            });
        }
        if (!proto2.values) {
            Object.defineProperty(proto2, "values", {
                value: domCollectionValues,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(proto2.values, "name", {
                    value: "values",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(proto2.values, "__polyfilled", {
                value: true
            });
        }
        if (!proto2.entries) {
            Object.defineProperty(proto2, "entries", {
                value: domCollectionEntries,
                writable: true,
                enumerable: false,
                configurable: true
            });
            try {
                Object.defineProperty(proto2.entries, "name", {
                    value: "entries",
                    configurable: true
                });
            } catch (e) {}
            Object.defineProperty(proto2.entries, "__polyfilled", {
                value: true
            });
        }
        if (typeof Symbol !== "undefined" && Symbol.iterator && !proto2[Symbol.iterator]) {
            Object.defineProperty(proto2, Symbol.iterator, {
                value: proto2.values,
                writable: true,
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(proto2[Symbol.iterator], "__polyfilled", {
                value: true
            });
        }
    };
    var install43 = function install43() {
        if (typeof NodeList !== "undefined") {
            patchCollection(NodeList.prototype);
        }
        if (typeof DOMTokenList !== "undefined") {
            patchCollection(DOMTokenList.prototype);
        }
    };
    // src/install-polyfills.ts
    var installPolyfills = function installPolyfills() {
        if (!isSupported2()) install2();
        if (!isSupported3()) install3();
        if (!isSupported4()) install4();
        if (!isSupported5()) install5();
        install6();
        if (!isSupported7()) install7();
        install8();
        if (!isSupported8()) install9();
        if (!isSupported9()) install10();
        if (!isSupported10()) install11();
        if (!isSupported11()) define(Error, "isError", errorIsError);
        if (!isSupported12()) define(Error.prototype, "toString", errorToString);
        install40();
        if (typeof Map !== "undefined" && Map.prototype && !isSupported13()) define(Map.prototype, "getOrInsert", mapGetOrInsert);
        if (typeof Map !== "undefined" && Map.prototype && !isSupported14()) define(Map.prototype, "getOrInsertComputed", mapGetOrInsertComputed);
        if (typeof Map !== "undefined" && !isSupported15()) define(Map, "groupBy", mapGroupBy);
        if (typeof WeakMap !== "undefined" && WeakMap.prototype && !isSupported16()) define(WeakMap.prototype, "getOrInsert", weakMapGetOrInsert);
        if (typeof WeakMap !== "undefined" && WeakMap.prototype && !isSupported17()) define(WeakMap.prototype, "getOrInsertComputed", weakMapGetOrInsertComputed);
        if (!isSupported18()) define(window, "WeakSet", WeakSet2);
        if (!isSupported19()) install12();
        if (!isSupported20()) install13();
        if (!isSupported21()) define(Object, "assign", objectAssign);
        if (!isSupported22()) define(Object.prototype, "__defineGetter__", objectDefineGetter);
        if (!isSupported23()) define(Object.prototype, "__defineSetter__", objectDefineSetter);
        if (!isSupported24()) define(Object, "entries", objectEntries);
        if (!isSupported25()) define(Object, "freeze", objectFreeze);
        if (!isSupported26()) define(Object, "fromEntries", objectFromEntries);
        if (!isSupported27()) define(Object, "getOwnPropertyDescriptor", objectGetOwnPropertyDescriptor);
        if (!isSupported28()) define(Object, "getOwnPropertyDescriptors", objectGetOwnPropertyDescriptors);
        if (!isSupported29()) define(Object, "getOwnPropertyNames", objectGetOwnPropertyNames);
        if (!isSupported30()) define(Object, "getPrototypeOf", objectGetPrototypeOf);
        if (!isSupported31()) define(Object, "groupBy", objectGroupBy);
        if (!isSupported32()) define(Object, "hasOwn", objectHasOwn);
        if (!isSupported33()) define(Object, "is", objectIs);
        if (!isSupported34()) define(Object, "isExtensible", objectIsExtensible);
        if (!isSupported35()) define(Object, "isFrozen", objectIsFrozen);
        if (!isSupported36()) define(Object, "isSealed", objectIsSealed);
        if (!isSupported37()) define(Object, "keys", objectKeys);
        if (!isSupported38()) define(Object.prototype, "__lookupGetter__", objectLookupGetter);
        if (!isSupported39()) define(Object.prototype, "__lookupSetter__", objectLookupSetter);
        if (!isSupported40()) define(Object, "preventExtensions", objectPreventExtensions);
        if (!isSupported41()) define(Object, "seal", objectSeal);
        if (!isSupported42()) define(Object, "setPrototypeOf", objectSetPrototypeOf);
        if (!isSupported43()) define(Object, "values", objectValues);
        if (!isSupported171()) define(window, "Reflect", Reflect2);
        if (!isSupported44()) install14();
        if (!isSupported45()) define(Array.prototype, "at", arrayAt);
        if (!isSupported46()) define(Array.prototype, "concat", arrayConcat);
        if (!isSupported47()) define(Array.prototype, "copyWithin", arrayCopyWithin);
        if (!isSupported48()) define(Array.prototype, "every", arrayEvery);
        if (!isSupported49()) define(Array.prototype, "fill", arrayFill);
        if (!isSupported50()) define(Array.prototype, "filter", arrayFilter);
        if (!isSupported51()) define(Array.prototype, "find", arrayFind);
        if (!isSupported52()) define(Array.prototype, "findIndex", arrayFindIndex);
        if (!isSupported53()) define(Array.prototype, "findLast", arrayFindLast);
        if (!isSupported54()) define(Array.prototype, "findLastIndex", arrayFindLastIndex);
        if (!isSupported55()) define(Array.prototype, "flat", arrayFlat);
        if (!isSupported56()) define(Array.prototype, "flatMap", arrayFlatMap);
        if (!isSupported57()) define(Array.prototype, "forEach", arrayForEach);
        if (!isSupported58()) define(Array, "from", arrayFrom);
        if (!isSupported59()) define(Array, "fromAsync", arrayFromAsync);
        if (!isSupported60()) define(Array.prototype, "includes", arrayIncludes);
        if (!isSupported61()) define(Array.prototype, "indexOf", arrayIndexOf);
        install15();
        if (!isSupported62()) define(Array.prototype, "join", arrayJoin);
        if (!isSupported63()) define(Array.prototype, "lastIndexOf", arrayLastIndexOf);
        if (!isSupported64()) define(Array.prototype, "map", arrayMap);
        if (!isSupported65()) define(Array, "of", arrayOf);
        if (!isSupported66()) define(Array.prototype, "push", arrayPush);
        if (!isSupported67()) define(Array.prototype, "reduce", arrayReduce);
        if (!isSupported68()) define(Array.prototype, "reduceRight", arrayReduceRight);
        if (!isSupported69()) define(Array.prototype, "reverse", arrayReverse);
        if (!isSupported70()) define(Array.prototype, "slice", arraySlice);
        if (!isSupported71()) define(Array.prototype, "some", arraySome);
        if (!isSupported72()) define(Array.prototype, "sort", arraySort);
        if (!isSupported73()) install16();
        if (!isSupported74()) define(Array.prototype, "splice", arraySplice);
        if (!isSupported75()) define(Array.prototype, "toReversed", arrayToReversed);
        if (!isSupported76()) define(Array.prototype, "toSorted", arrayToSorted);
        if (!isSupported77()) define(Array.prototype, "toSpliced", arrayToSpliced);
        if (!isSupported78()) install17();
        if (!isSupported79()) install18();
        if (!isSupported80()) define(Array.prototype, "unshift", arrayUnshift);
        if (!isSupported81()) define(Array.prototype, "with", arrayWith);
        if (!isSupported172()) install41();
        if (!isSupported82()) define(window, "RegExp", RegExpPolyfill);
        if (!isSupported83()) install19();
        if (!isSupported84()) define(RegExp, "escape", regExpEscape);
        if (!isSupported85()) install20();
        if (!isSupported86()) define(RegExp.prototype, "test", regexpTest);
        if (!isSupported87()) define(RegExp.prototype, "toString", regExpToString);
        if (!isSupported88()) define(String.prototype, "at", stringAt);
        if (!isSupported89()) define(String.prototype, "codePointAt", stringCodePointAt);
        if (!isSupported90()) define(String.prototype, "endsWith", stringEndsWith);
        if (!isSupported91()) define(String, "fromCodePoint", stringFromCodePoint);
        if (!isSupported92()) define(String.prototype, "includes", stringIncludes);
        if (!isSupported93()) define(String.prototype, "isWellFormed", stringIsWellFormed);
        if (!isSupported94()) define(String.prototype, "match", stringMatch);
        if (!isSupported95()) install21();
        if (!isSupported96()) define(String.prototype, "padEnd", stringPadEnd);
        if (!isSupported97()) define(String.prototype, "padStart", stringPadStart);
        if (!isSupported98()) define(String, "raw", stringRaw);
        if (!isSupported99()) define(String.prototype, "repeat", stringRepeat);
        if (!isSupported100()) define(String.prototype, "replace", stringReplace);
        if (!isSupported101()) define(String.prototype, "replaceAll", stringReplaceAll);
        if (!isSupported102()) define(String.prototype, "search", stringSearch);
        if (!isSupported103()) define(String.prototype, "split", stringSplit);
        if (!isSupported104()) define(String.prototype, "startsWith", stringStartsWith);
        if (!isSupported105()) define(String.prototype, "toWellFormed", stringToWellFormed);
        if (!isSupported106()) define(String.prototype, "trim", stringTrim);
        if (!isSupported107()) define(String.prototype, "trimEnd", stringTrimEnd);
        if (!isSupported108()) define(String.prototype, "trimStart", stringTrimStart);
        if (!isSupported109()) install22();
        if (!isSupported110()) install23();
        if (!isSupported111()) install24();
        if (!isSupported112()) install25();
        install26();
        if (!isSupported114()) install27();
        if (!isSupported115()) define(Date.prototype, "toISOString", dateToISOString);
        if (!isSupported116()) define(Date.prototype, "toJSON", dateToJSON);
        if (!isSupported117()) install28();
        if (!isSupported118()) install29();
        if (!isSupported119()) define(Math, "acosh", mathAcosh);
        if (!isSupported120()) define(Math, "asinh", mathAsinh);
        if (!isSupported121()) define(Math, "atanh", mathAtanh);
        if (!isSupported122()) define(Math, "cbrt", mathCbrt);
        if (!isSupported123()) define(Math, "clz32", mathClz32);
        if (!isSupported124()) define(Math, "cosh", mathCosh);
        if (!isSupported125()) define(Math, "expm1", mathExpm1);
        if (!isSupported126()) define(Math, "fround", mathFround);
        if (!isSupported127()) define(Math, "hypot", mathHypot);
        if (!isSupported128()) define(Math, "imul", mathImul);
        if (!isSupported129()) define(Math, "log10", mathLog10);
        if (!isSupported130()) define(Math, "log1p", mathLog1p);
        if (!isSupported131()) define(Math, "log2", mathLog2);
        if (!isSupported132()) define(Math, "sign", mathSign);
        if (!isSupported133()) define(Math, "sinh", mathSinh);
        if (!isSupported134()) define(Math, "sumPrecise", mathSumPrecise);
        if (!isSupported135()) define(Math, "tanh", mathTanh);
        if (!isSupported136()) install30();
        if (!isSupported137()) define(Math, "trunc", mathTrunc);
        if (!isSupported138()) define(window, "Number", NumberPolyfill);
        if (!isSupported139()) install31();
        if (!isSupported140()) define(Number, "isFinite", numberIsFinite);
        if (!isSupported141()) define(Number, "isInteger", numberIsInteger);
        if (!isSupported142()) define(Number, "isNaN", numberIsNaN);
        if (!isSupported143()) define(Number, "isSafeInteger", numberIsSafeInteger);
        if (!isSupported144()) install32();
        if (!isSupported145()) install33();
        if (!isSupported146()) define(Number, "parseFloat", numberParseFloat);
        if (!isSupported147()) define(Number, "parseInt", numberParseInt);
        if (!isSupported148()) define(Number.prototype, "toExponential", numberToExponential);
        if (!isSupported149()) define(Number.prototype, "toFixed", numberToFixed);
        if (!isSupported150()) define(Number.prototype, "toPrecision", numberToPrecision);
        if (!isSupported151()) define(window, "parseFloat", numberParseFloat2);
        if (!isSupported152()) define(window, "parseInt", numberParseInt2);
        if (typeof Promise !== "undefined" && !isSupported154()) define(Promise, "allSettled", promiseAllSettled);
        if (typeof Promise !== "undefined" && !isSupported155()) define(Promise, "any", promiseAny);
        if (typeof Promise !== "undefined" && !isSupported156()) define(Promise.prototype, "finally", promiseFinally);
        if (typeof Promise !== "undefined" && !isSupported157()) define(Promise, "try", promiseTry);
        if (typeof Promise !== "undefined" && !isSupported158()) define(Promise, "withResolvers", promiseWithResolvers);
        install42();
        install43();
        install34();
        if (!isSupported159()) install35();
        if (!isSupported160()) {
            define(window, "setImmediate", setImmediate2);
            define(window, "clearImmediate", clearImmediate);
        }
        if (typeof window !== "undefined" && !isSupported161()) define(window, "atob", atobPolyfill);
        if (!isSupported162()) define(window, "queueMicrotask", queueMicrotask);
        if (!isSupported163()) install36();
        if (!isSupported164()) define(window, "structuredClone", structuredClone);
        if (!isSupported165()) install37();
        if (!isSupported166()) install38();
        if (!isSupported167()) install39();
        if (typeof URL !== "undefined" && !isSupported168()) define(URL, "canParse", urlCanParse);
        if (typeof URL !== "undefined" && !isSupported169()) define(URL, "parse", urlParse);
        if (typeof URL !== "undefined" && URL.prototype && !isSupported170()) define(URL.prototype, "toJSON", urlToJSON);
        try {
            applySymbolKeyFilters();
        } catch (e) {}
    };
    // src/index.ts
    installPolyfills();
}();
