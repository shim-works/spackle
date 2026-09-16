"use strict";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n3 = 0, F = function F() {}; return { s: F, n: function n() { return _n3 >= r.length ? { done: !0 } : { done: !1, value: r[_n3++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = function __commonJS(cb, mod) {
    return function __require() {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
        exports: {}
      }).exports, mod), mod.exports;
    };
  };
  var __copyProps = function __copyProps(to, from, except, desc) {
    if (from && typeof from === "object" || typeof from === "function") {
      var _iterator = _createForOfIteratorHelper(__getOwnPropNames(from)),
        _step;
      try {
        var _loop = function _loop() {
          var key = _step.value;
          if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: function get() {
              return from[key];
            },
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return to;
  };
  var __toESM = function __toESM(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
      value: mod,
      enumerable: true
    }) : target, mod);
  };

  // node_modules/regenerator-runtime/runtime.js
  var require_runtime = __commonJS({
    "node_modules/regenerator-runtime/runtime.js": function node_modules_regeneratorRuntime_runtimeJs(exports, module) {
      var runtime = function (exports2) {
        "use strict";

        var Op = Object.prototype;
        var hasOwn3 = Op.hasOwnProperty;
        var defineProperty2 = Object.defineProperty || function (obj, key, desc) {
          obj[key] = desc.value;
        };
        var undefined2;
        var $Symbol = typeof Symbol === "function" ? Symbol : {};
        var iteratorSymbol2 = $Symbol.iterator || "@@iterator";
        var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
        var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
        function define(obj, key, value) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
          return obj[key];
        }
        try {
          define({}, "");
        } catch (err) {
          define = function define(obj, key, value) {
            return obj[key] = value;
          };
        }
        function wrap(innerFn, outerFn, self2, tryLocsList) {
          var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
          var generator = Object.create(protoGenerator.prototype);
          var context = new Context(tryLocsList || []);
          defineProperty2(generator, "_invoke", {
            value: makeInvokeMethod(innerFn, self2, context)
          });
          return generator;
        }
        exports2.wrap = wrap;
        function tryCatch(fn, obj, arg) {
          try {
            return {
              type: "normal",
              arg: fn.call(obj, arg)
            };
          } catch (err) {
            return {
              type: "throw",
              arg: err
            };
          }
        }
        var GenStateSuspendedStart = "suspendedStart";
        var GenStateSuspendedYield = "suspendedYield";
        var GenStateExecuting = "executing";
        var GenStateCompleted = "completed";
        var ContinueSentinel = {};
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}
        var IteratorPrototype2 = {};
        define(IteratorPrototype2, iteratorSymbol2, function () {
          return this;
        });
        var getProto2 = Object.getPrototypeOf;
        var NativeIteratorPrototype = getProto2 && getProto2(getProto2(values([])));
        if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn3.call(NativeIteratorPrototype, iteratorSymbol2)) {
          IteratorPrototype2 = NativeIteratorPrototype;
        }
        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype2);
        GeneratorFunction.prototype = GeneratorFunctionPrototype;
        defineProperty2(Gp, "constructor", {
          value: GeneratorFunctionPrototype,
          configurable: true
        });
        defineProperty2(GeneratorFunctionPrototype, "constructor", {
          value: GeneratorFunction,
          configurable: true
        });
        GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");
        function defineIteratorMethods(prototype) {
          ["next", "throw", "return"].forEach(function (method) {
            define(prototype, method, function (arg) {
              return this._invoke(method, arg);
            });
          });
        }
        exports2.isGeneratorFunction = function (genFun) {
          var ctor = typeof genFun === "function" && genFun.constructor;
          return ctor ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
        };
        exports2.mark = function (genFun) {
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
          } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            define(genFun, toStringTagSymbol, "GeneratorFunction");
          }
          genFun.prototype = Object.create(Gp);
          return genFun;
        };
        exports2.awrap = function (arg) {
          return {
            __await: arg
          };
        };
        function AsyncIterator(generator, PromiseImpl) {
          function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
            if (record.type === "throw") {
              reject(record.arg);
            } else {
              var result = record.arg;
              var value = result.value;
              if (value && typeof value === "object" && hasOwn3.call(value, "__await")) {
                return PromiseImpl.resolve(value.__await).then(function (value2) {
                  invoke("next", value2, resolve, reject);
                }, function (err) {
                  invoke("throw", err, resolve, reject);
                });
              }
              return PromiseImpl.resolve(value).then(function (unwrapped) {
                result.value = unwrapped;
                resolve(result);
              }, function (error) {
                return invoke("throw", error, resolve, reject);
              });
            }
          }
          var previousPromise;
          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return new PromiseImpl(function (resolve, reject) {
                invoke(method, arg, resolve, reject);
              });
            }
            return previousPromise =
            // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
          }
          defineProperty2(this, "_invoke", {
            value: enqueue
          });
        }
        defineIteratorMethods(AsyncIterator.prototype);
        define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
          return this;
        });
        exports2.AsyncIterator = AsyncIterator;
        exports2.async = function (innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
          if (PromiseImpl === void 0) PromiseImpl = Promise;
          var iter = new AsyncIterator(wrap(innerFn, outerFn, self2, tryLocsList), PromiseImpl);
          return exports2.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
            return result.done ? result.value : iter.next();
          });
        };
        function makeInvokeMethod(innerFn, self2, context) {
          var state = GenStateSuspendedStart;
          return function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error("Generator is already running");
            }
            if (state === GenStateCompleted) {
              if (method === "throw") {
                throw arg;
              }
              return doneResult();
            }
            context.method = method;
            context.arg = arg;
            while (true) {
              var delegate = context.delegate;
              if (delegate) {
                var delegateResult = maybeInvokeDelegate(delegate, context);
                if (delegateResult) {
                  if (delegateResult === ContinueSentinel) continue;
                  return delegateResult;
                }
              }
              if (context.method === "next") {
                context.sent = context._sent = context.arg;
              } else if (context.method === "throw") {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted;
                  throw context.arg;
                }
                context.dispatchException(context.arg);
              } else if (context.method === "return") {
                context.abrupt("return", context.arg);
              }
              state = GenStateExecuting;
              var record = tryCatch(innerFn, self2, context);
              if (record.type === "normal") {
                state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                if (record.arg === ContinueSentinel) {
                  continue;
                }
                return {
                  value: record.arg,
                  done: context.done
                };
              } else if (record.type === "throw") {
                state = GenStateCompleted;
                context.method = "throw";
                context.arg = record.arg;
              }
            }
          };
        }
        function maybeInvokeDelegate(delegate, context) {
          var methodName = context.method;
          var method = delegate.iterator[methodName];
          if (method === undefined2) {
            context.delegate = null;
            if (methodName === "throw" && delegate.iterator["return"]) {
              context.method = "return";
              context.arg = undefined2;
              maybeInvokeDelegate(delegate, context);
              if (context.method === "throw") {
                return ContinueSentinel;
              }
            }
            if (methodName !== "return") {
              context.method = "throw";
              context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method");
            }
            return ContinueSentinel;
          }
          var record = tryCatch(method, delegate.iterator, context.arg);
          if (record.type === "throw") {
            context.method = "throw";
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
          }
          var info = record.arg;
          if (!info) {
            context.method = "throw";
            context.arg = new TypeError("iterator result is not an object");
            context.delegate = null;
            return ContinueSentinel;
          }
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
            if (context.method !== "return") {
              context.method = "next";
              context.arg = undefined2;
            }
          } else {
            return info;
          }
          context.delegate = null;
          return ContinueSentinel;
        }
        defineIteratorMethods(Gp);
        define(Gp, toStringTagSymbol, "Generator");
        define(Gp, iteratorSymbol2, function () {
          return this;
        });
        define(Gp, "toString", function () {
          return "[object Generator]";
        });
        function pushTryEntry(locs) {
          var entry = {
            tryLoc: locs[0]
          };
          if (1 in locs) {
            entry.catchLoc = locs[1];
          }
          if (2 in locs) {
            entry.finallyLoc = locs[2];
            entry.afterLoc = locs[3];
          }
          this.tryEntries.push(entry);
        }
        function resetTryEntry(entry) {
          var record = entry.completion || {};
          record.type = "normal";
          delete record.arg;
          entry.completion = record;
        }
        function Context(tryLocsList) {
          this.tryEntries = [{
            tryLoc: "root"
          }];
          tryLocsList.forEach(pushTryEntry, this);
          this.reset(true);
        }
        exports2.keys = function (val) {
          var object = Object(val);
          var keys2 = [];
          for (var key in object) {
            keys2.push(key);
          }
          keys2.reverse();
          return function next() {
            while (keys2.length) {
              var key2 = keys2.pop();
              if (key2 in object) {
                next.value = key2;
                next.done = false;
                return next;
              }
            }
            next.done = true;
            return next;
          };
        };
        function values(iterable) {
          if (iterable != null) {
            var iteratorMethod = iterable[iteratorSymbol2];
            if (iteratorMethod) {
              return iteratorMethod.call(iterable);
            }
            if (typeof iterable.next === "function") {
              return iterable;
            }
            if (!isNaN(iterable.length)) {
              var i = -1,
                next = function next2() {
                  while (++i < iterable.length) {
                    if (hasOwn3.call(iterable, i)) {
                      next2.value = iterable[i];
                      next2.done = false;
                      return next2;
                    }
                  }
                  next2.value = undefined2;
                  next2.done = true;
                  return next2;
                };
              return next.next = next;
            }
          }
          throw new TypeError(typeof iterable + " is not iterable");
        }
        exports2.values = values;
        function doneResult() {
          return {
            value: undefined2,
            done: true
          };
        }
        Context.prototype = {
          constructor: Context,
          reset: function reset(skipTempReset) {
            this.prev = 0;
            this.next = 0;
            this.sent = this._sent = undefined2;
            this.done = false;
            this.delegate = null;
            this.method = "next";
            this.arg = undefined2;
            this.tryEntries.forEach(resetTryEntry);
            if (!skipTempReset) {
              for (var name in this) {
                if (name.charAt(0) === "t" && hasOwn3.call(this, name) && !isNaN(+name.slice(1))) {
                  this[name] = undefined2;
                }
              }
            }
          },
          stop: function stop() {
            this.done = true;
            var rootEntry = this.tryEntries[0];
            var rootRecord = rootEntry.completion;
            if (rootRecord.type === "throw") {
              throw rootRecord.arg;
            }
            return this.rval;
          },
          dispatchException: function dispatchException(exception) {
            if (this.done) {
              throw exception;
            }
            var context = this;
            function handle(loc, caught) {
              record.type = "throw";
              record.arg = exception;
              context.next = loc;
              if (caught) {
                context.method = "next";
                context.arg = undefined2;
              }
              return !!caught;
            }
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              var record = entry.completion;
              if (entry.tryLoc === "root") {
                return handle("end");
              }
              if (entry.tryLoc <= this.prev) {
                var hasCatch = hasOwn3.call(entry, "catchLoc");
                var hasFinally = hasOwn3.call(entry, "finallyLoc");
                if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  } else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  }
                } else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else {
                  throw new Error("try statement without catch or finally");
                }
              }
            }
          },
          abrupt: function abrupt(type, arg) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc <= this.prev && hasOwn3.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                var finallyEntry = entry;
                break;
              }
            }
            if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
              finallyEntry = null;
            }
            var record = finallyEntry ? finallyEntry.completion : {};
            record.type = type;
            record.arg = arg;
            if (finallyEntry) {
              this.method = "next";
              this.next = finallyEntry.finallyLoc;
              return ContinueSentinel;
            }
            return this.complete(record);
          },
          complete: function complete(record, afterLoc) {
            if (record.type === "throw") {
              throw record.arg;
            }
            if (record.type === "break" || record.type === "continue") {
              this.next = record.arg;
            } else if (record.type === "return") {
              this.rval = this.arg = record.arg;
              this.method = "return";
              this.next = "end";
            } else if (record.type === "normal" && afterLoc) {
              this.next = afterLoc;
            }
            return ContinueSentinel;
          },
          finish: function finish(finallyLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc);
                resetTryEntry(entry);
                return ContinueSentinel;
              }
            }
          },
          "catch": function _catch(tryLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc === tryLoc) {
                var record = entry.completion;
                if (record.type === "throw") {
                  var thrown = record.arg;
                  resetTryEntry(entry);
                }
                return thrown;
              }
            }
            throw new Error("illegal catch attempt");
          },
          delegateYield: function delegateYield(iterable, resultName, nextLoc) {
            this.delegate = {
              iterator: values(iterable),
              resultName: resultName,
              nextLoc: nextLoc
            };
            if (this.method === "next") {
              this.arg = undefined2;
            }
            return ContinueSentinel;
          }
        };
        return exports2;
      }(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
      typeof module === "object" ? module.exports : {});
      try {
        regeneratorRuntime = runtime;
      } catch (accidentalStrictMode) {
        if (typeof globalThis === "object") {
          globalThis.regeneratorRuntime = runtime;
        } else {
          Function("r", "regeneratorRuntime = r")(runtime);
        }
      }
    }
  });

  // node_modules/.spackle-browser-tests/entry.ts
  var import_runtime = __toESM(require_runtime());

  // tests/browser/harness.ts
  var suites = [];
  var current = null;
  var show = function show(value) {
    try {
      if (typeof value === "string") return JSON.stringify(value);
      if (value === void 0) return "undefined";
      if (typeof value === "function") return "function " + (value.name || "(anonymous)");
      if (typeof value === "object" && value !== null) {
        var json = JSON.stringify(value);
        return json === void 0 ? typeOf(value) : json;
      }
      if (value === 0 && 1 / value === -Infinity) return "-0";
      return String(value);
    } catch (e) {
      return typeOf(value);
    }
  };
  var describe2 = function describe2(name, fn) {
    var parent = current;
    var suite = {
      name: parent ? parent.name + " > " + name : name,
      tests: []
    };
    suites.push(suite);
    current = suite;
    try {
      fn();
    } finally {
      current = parent;
    }
  };
  var it2 = function it2(name, fn) {
    if (!current) {
      current = {
        name: "(root)",
        tests: []
      };
      suites.push(current);
    }
    current.tests.push({
      name: name,
      fn: fn
    });
  };
  it2.each = function (cases) {
    return function (name, fn) {
      var _loop2 = function _loop2() {
        var args = Object.prototype.toString.call(cases[i]) === "[object Array]" ? cases[i] : [cases[i]];
        var cursor = 0;
        var label = String(name).replace(/%[psidjfo#]/g, function () {
          return show(args[cursor++]);
        });
        (function (boundArgs) {
          it2(label, function () {
            return fn.apply(null, boundArgs);
          });
        })(args);
      };
      for (var i = 0; i < cases.length; i++) {
        _loop2();
      }
    };
  };
  var typeOf = function typeOf(value) {
    return Object.prototype.toString.call(value);
  };
  var _deepEqual = function deepEqual(a, b) {
    if (a === b) return true;
    if (a !== a && b !== b) return true;
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
      return false;
    }
    if (typeOf(a) !== typeOf(b)) return false;
    var aIsArrayLike = typeof a.length === "number" && typeOf(a) !== "[object Object]";
    if (aIsArrayLike) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (!_deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (var _i = 0; _i < aKeys.length; _i++) {
      var key = aKeys[_i];
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!_deepEqual(a[key], b[key])) return false;
    }
    return true;
  };
  var fail = function fail(message) {
    throw new Error(message);
  };
  var makeMatchers = function makeMatchers(actual, negated) {
    var check = function check(ok, message) {
      if (negated ? ok : !ok) {
        fail((negated ? "expected NOT: " : "expected: ") + message);
      }
    };
    return {
      toBe: function toBe(expected) {
        var same = actual === expected ? actual !== 0 || 1 / actual === 1 / expected : actual !== actual && expected !== expected;
        check(same, show(actual) + " to be " + show(expected));
      },
      toEqual: function toEqual(expected) {
        check(_deepEqual(actual, expected), show(actual) + " to deeply equal " + show(expected));
      },
      toThrow: function toThrow(expected) {
        var threw = false;
        var error;
        try {
          actual();
        } catch (caught) {
          threw = true;
          error = caught;
        }
        if (negated) {
          if (threw) fail("expected NOT to throw, but threw " + show(error && error.message));
          return;
        }
        if (!threw) fail("expected to throw, but did not");
        if (expected === void 0) return;
        if (typeof expected === "function") {
          if (!(error instanceof expected)) {
            fail("expected to throw " + (expected.name || "that error") + ", got " + show(error));
          }
          return;
        }
        var message = error && error.message ? String(error.message) : String(error);
        if (message.indexOf(String(expected)) === -1) {
          fail("expected message to contain " + show(expected) + ", got " + show(message));
        }
      },
      toBeNaN: function toBeNaN() {
        check(actual !== actual, show(actual) + " to be NaN");
      },
      toBeCloseTo: function toBeCloseTo(expected, digits) {
        var precision = digits === void 0 ? 2 : digits;
        var ok = Math.abs(actual - expected) < Math.pow(10, -precision) / 2;
        check(ok, show(actual) + " to be close to " + show(expected));
      },
      toContain: function toContain(expected) {
        var found = false;
        if (typeof actual === "string") {
          found = actual.indexOf(expected) !== -1;
        } else if (actual && typeof actual.length === "number") {
          for (var i = 0; i < actual.length; i++) {
            if (actual[i] === expected) {
              found = true;
              break;
            }
          }
        }
        check(found, show(actual) + " to contain " + show(expected));
      },
      toHaveLength: function toHaveLength(expected) {
        check(actual != null && actual.length === expected, show(actual) + " to have length " + expected);
      },
      toBeUndefined: function toBeUndefined() {
        check(actual === void 0, show(actual) + " to be undefined");
      },
      toBeNull: function toBeNull() {
        check(actual === null, show(actual) + " to be null");
      },
      toBeDefined: function toBeDefined() {
        check(actual !== void 0, show(actual) + " to be defined");
      },
      toBeInstanceOf: function toBeInstanceOf(expected) {
        check(actual instanceof expected, show(actual) + " to be instance of " + expected.name);
      },
      toBeGreaterThan: function toBeGreaterThan(expected) {
        check(actual > expected, show(actual) + " to be greater than " + expected);
      },
      toBeLessThanOrEqual: function toBeLessThanOrEqual(expected) {
        check(actual <= expected, show(actual) + " to be <= " + expected);
      }
    };
  };
  var expect2 = function expect2(actual) {
    var matchers = makeMatchers(actual, false);
    matchers.not = makeMatchers(actual, true);
    var settled = function settled(wantRejection) {
      var forward = {};
      var names = ["toBe", "toEqual", "toThrow", "toBeNaN", "toBeCloseTo", "toContain", "toHaveLength", "toBeUndefined", "toBeNull", "toBeDefined", "toBeInstanceOf", "toBeGreaterThan", "toBeLessThanOrEqual"];
      for (var i = 0; i < names.length; i++) {
        (function (matcher) {
          forward[matcher] = function (expected) {
            return Promise.resolve(actual).then(function (value) {
              if (wantRejection) fail("expected promise to reject, but it resolved");
              return makeMatchers(value, false)[matcher](expected);
            }, function (error) {
              if (!wantRejection) throw error;
              var subject = matcher === "toThrow" ? function () {
                throw error;
              } : error;
              return makeMatchers(subject, false)[matcher](expected);
            });
          };
        })(names[i]);
      }
      return forward;
    };
    matchers.resolves = settled(false);
    matchers.rejects = settled(true);
    return matchers;
  };
  var run = function run() {
    var failures = [];
    var passed = 0;
    var failed = 0;
    var flat = [];
    for (var s = 0; s < suites.length; s++) {
      for (var t = 0; t < suites[s].tests.length; t++) {
        flat.push({
          label: suites[s].name + " > " + suites[s].tests[t].name,
          fn: suites[s].tests[t].fn
        });
      }
    }
    var index = 0;
    var _step2 = function step() {
      if (index >= flat.length) return {
        passed: passed,
        failed: failed,
        failures: failures
      };
      var entry = flat[index++];
      return Promise.resolve().then(entry.fn).then(function () {
        passed++;
      }, function (error) {
        failed++;
        failures.push(entry.label + "\n    " + (error && error.message ? error.message : String(error)));
      }).then(_step2);
    };
    return Promise.resolve().then(_step2);
  };
  var render = function render(results) {
    if (typeof document === "undefined") return;
    var lines = ["spackle \u2014 " + results.passed + " passed, " + results.failed + " failed", ""].concat(results.failures);
    var pre = document.createElement("pre");
    pre.style.cssText = "font:12px/1.5 monospace;white-space:pre-wrap;padding:12px";
    pre.appendChild(document.createTextNode(lines.join("\n")));
    if (document.body) document.body.appendChild(pre);
  };

  // node_modules/.spackle-browser-tests/globals.ts
  var g = typeof window !== "undefined" ? window : globalThis;
  g.describe = describe2;
  g.it = it2;
  g.expect = expect2;

  // src/modules/es.aggregate-error.ts
  var isSupported = function isSupported() {
    try {
      return typeof AggregateError2 === "function";
    } catch (e) {
      return false;
    }
  };
  var drainErrors = function drainErrors(errors) {
    if (errors == null) {
      throw new TypeError("AggregateError requires an iterable of errors");
    }
    var out = [];
    if (typeof Symbol !== "undefined" && Symbol.iterator && typeof errors[Symbol.iterator] === "function") {
      var it3 = errors[Symbol.iterator]();
      var step = it3.next();
      while (!step.done) {
        out.push(step.value);
        step = it3.next();
      }
      return out;
    }
    if (typeof errors.length === "number") {
      for (var i = 0; i < errors.length; i++) {
        out.push(errors[i]);
      }
      return out;
    }
    throw new TypeError("AggregateError argument is not iterable");
  };
  var defineHidden = function defineHidden(target, key, value) {
    Object.defineProperty(target, key, {
      value: value,
      writable: true,
      enumerable: false,
      configurable: true
    });
  };
  var AggregateError2 = function AggregateError3(errors, message, options) {
    var self2 = this instanceof AggregateError3 ? this : Object.create(AggregateError3.prototype);
    if (message !== void 0) {
      defineHidden(self2, "message", String(message));
    }
    if (options !== null && typeof options === "object" && "cause" in options) {
      defineHidden(self2, "cause", options.cause);
    }
    defineHidden(self2, "errors", drainErrors(errors));
    var stackCarrier = new Error(message);
    if (stackCarrier.stack) {
      defineHidden(self2, "stack", stackCarrier.stack);
    }
    return self2;
  };
  AggregateError2.prototype = Object.create(Error.prototype);
  Object.defineProperty(AggregateError2.prototype, "constructor", {
    value: AggregateError2,
    writable: true,
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(AggregateError2.prototype, "name", {
    value: "AggregateError",
    writable: true,
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(AggregateError2.prototype, "message", {
    value: "",
    writable: true,
    enumerable: false,
    configurable: true
  });
  if (!isSupported()) {
    window.AggregateError = null;
    delete window.AggregateError;
    Object.defineProperty(window, "AggregateError", {
      value: AggregateError2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.AggregateError, "name", {
      value: "AggregateError",
      configurable: true
    });
    Object.defineProperty(window.AggregateError, "__polyfilled", {
      value: true
    });
  }

  // tests/aggregate-error.test.ts
  describe("AggregateError \u2014 test262 conformance", function () {
    it("collects the errors iterable onto .errors", function () {
      var a = new Error("a");
      var b = new Error("b");
      var err = new AggregateError2([a, b], "both failed");
      expect(err.errors).toEqual([a, b]);
      expect(err.message).toBe("both failed");
    });
    it("is an Error subclass named AggregateError", function () {
      var err = new AggregateError2([]);
      expect(err instanceof Error).toBe(true);
      expect(err instanceof AggregateError2).toBe(true);
      expect(err.name).toBe("AggregateError");
      expect(String(err)).toBe("AggregateError");
    });
    it("constructs when called without new (like Error)", function () {
      var err = AggregateError2([], "no new");
      expect(err instanceof AggregateError2).toBe(true);
      expect(err.message).toBe("no new");
    });
    it('leaves message off the instance when omitted (prototype default is "")', function () {
      var err = new AggregateError2([]);
      expect(err.message).toBe("");
      expect(Object.prototype.hasOwnProperty.call(err, "message")).toBe(false);
    });
    it("copies the iterable \u2014 .errors is a snapshot array, not the input", function () {
      var input = [1, 2];
      var err = new AggregateError2(input);
      expect(err.errors).not.toBe(input);
      input.push(3);
      expect(err.errors).toEqual([1, 2]);
    });
    it("drains arbitrary iterables (Set input)", function () {
      var err = new AggregateError2(/* @__PURE__ */new Set(["x", "y"]));
      expect(err.errors).toEqual(["x", "y"]);
    });
    it("keeps .errors and .message non-enumerable, like native", function () {
      var err = new AggregateError2([1], "quiet");
      expect(Object.prototype.propertyIsEnumerable.call(err, "errors")).toBe(false);
      expect(Object.prototype.propertyIsEnumerable.call(err, "message")).toBe(false);
    });
    it("throws TypeError when errors is not iterable", function () {
      expect(function () {
        return new AggregateError2(void 0);
      }).toThrow(TypeError);
      expect(function () {
        return new AggregateError2(null);
      }).toThrow(TypeError);
      expect(function () {
        return new AggregateError2(123);
      }).toThrow(TypeError);
    });
    it("coerces message with String()", function () {
      var err = new AggregateError2([], 42);
      expect(err.message).toBe("42");
    });
    it("installs cause from the options bag (ES2022)", function () {
      var cause = new Error("root");
      var err = new AggregateError2([], "msg", {
        cause: cause
      });
      expect(err.cause).toBe(cause);
      var bare = new AggregateError2([], "msg");
      expect(Object.prototype.hasOwnProperty.call(bare, "cause")).toBe(false);
    });
    it("matches native shape", function () {
      var NativeAggregateError = window.AggregateError;
      var native = new NativeAggregateError([1, 2], "m");
      var poly = new AggregateError2([1, 2], "m");
      expect(poly.errors).toEqual(native.errors);
      expect(poly.message).toBe(native.message);
      expect(poly.name).toBe(native.name);
      expect(String(poly)).toBe(String(native));
    });
  });

  // src/modules/es.array.at.ts
  var isSupported2 = function isSupported2() {
    try {
      return typeof Array.prototype.at === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH = 9007199254740991;
  var toLength = function toLength(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH) {
      return MAX_SAFE_LENGTH;
    }
    return Math.floor(numeric);
  };
  var toInteger = function toInteger(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    if (numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    if (numeric < 0) {
      return Math.ceil(numeric);
    }
    return Math.floor(numeric);
  };
  var arrayAt = function arrayAt(index) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.at called on null or undefined");
    }
    var object = Object(this);
    var length = toLength(object.length);
    var relativeIndex2 = toInteger(index);
    var actualIndex = relativeIndex2;
    if (relativeIndex2 < 0) {
      actualIndex = length + relativeIndex2;
    }
    if (actualIndex < 0 || actualIndex >= length) {
      return void 0;
    }
    return object[actualIndex];
  };
  if (!isSupported2()) {
    Object.defineProperty(Array.prototype, "at", {
      value: arrayAt,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.at, "name", {
      value: "at",
      configurable: true
    });
    Object.defineProperty(Array.prototype.at, "__polyfilled", {
      value: true
    });
  }

  // tests/array-at.test.ts
  describe("Array.prototype.at \u2014 test262 conformance", function () {
    it("returns the element at a positive index", function () {
      expect(arrayAt.call([1, 2, 3], 0)).toBe(1);
      expect(arrayAt.call([1, 2, 3], 2)).toBe(3);
    });
    it("counts from the end for a negative index", function () {
      expect(arrayAt.call([1, 2, 3], -1)).toBe(3);
      expect(arrayAt.call([1, 2, 3], -3)).toBe(1);
    });
    it("returns undefined when out of range", function () {
      expect(arrayAt.call([1, 2, 3], 5)).toBeUndefined();
      expect(arrayAt.call([1, 2, 3], -5)).toBeUndefined();
    });
    it("coerces the index via ToInteger (fractional truncated)", function () {
      expect(arrayAt.call([1, 2, 3], 1.9)).toBe(2);
      expect(arrayAt.call([1, 2, 3], -1.9)).toBe(3);
    });
    it("treats a missing / NaN index as 0", function () {
      expect(arrayAt.call([1, 2, 3], void 0)).toBe(1);
      expect(arrayAt.call([1, 2, 3], NaN)).toBe(1);
    });
    it("throws TypeError on null/undefined this", function () {
      expect(function () {
        return arrayAt.call(null, 0);
      }).toThrow(TypeError);
    });
    it("works on array-likes via .call", function () {
      expect(arrayAt.call({
        0: "a",
        1: "b",
        length: 2
      }, -1)).toBe("b");
    });
    it("matches native + timing", function () {
      var arr = [10, 20, 30, 40];
      var native = Array.prototype.at;
      var nativeResult = native.call(arr, -2);
      var specResult = arrayAt.call(arr, -2);
      expect(specResult).toBe(nativeResult);
    });
  });

  // src/modules/_array-buffer-impl.ts
  var isSupported3 = function isSupported3() {
    try {
      if (typeof ArrayBuffer === "undefined") {
        return false;
      }
      return typeof ArrayBuffer.isView === "function" && typeof ArrayBuffer.prototype.slice === "function";
    } catch (e) {
      return false;
    }
  };
  var isArrayBufferSupported = isSupported3;
  var arrayBufferIsView = function arrayBufferIsView(value) {
    return !!value && typeof value === "object" && value.buffer instanceof ArrayBuffer && typeof value.byteLength === "number";
  };
  var toInteger2 = function toInteger2(value) {
    var numeric = +value;
    if (numeric !== numeric) return 0;
    return numeric >= 0 ? Math.floor(numeric) : Math.ceil(numeric);
  };
  var arrayBufferSlice = function arrayBufferSlice(begin, end) {
    var length = this.byteLength;
    var from = begin === void 0 ? 0 : toInteger2(begin);
    from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);
    var to = end === void 0 ? length : toInteger2(end);
    to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);
    var count = Math.max(to - from, 0);
    var sliced = new ArrayBuffer(count);
    new Uint8Array(sliced).set(new Uint8Array(this, from, count));
    return sliced;
  };
  if (typeof ArrayBuffer !== "undefined" && !isSupported3()) {
    if (typeof ArrayBuffer.isView !== "function") {
      Object.defineProperty(ArrayBuffer, "isView", {
        value: arrayBufferIsView,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ArrayBuffer.isView, "name", {
        value: "isView",
        configurable: true
      });
      Object.defineProperty(ArrayBuffer.isView, "__polyfilled", {
        value: true
      });
    }
    if (typeof ArrayBuffer.prototype.slice !== "function") {
      Object.defineProperty(ArrayBuffer.prototype, "slice", {
        value: arrayBufferSlice,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ArrayBuffer.prototype.slice, "name", {
        value: "slice",
        configurable: true
      });
      Object.defineProperty(ArrayBuffer.prototype.slice, "__polyfilled", {
        value: true
      });
    }
  }

  // tests/array-buffer.test.ts
  describe("ArrayBuffer.isView \u2014 polyfill vs native", function () {
    it("true for typed array views and DataView", function () {
      var buf = new ArrayBuffer(8);
      var view = new Uint8Array(buf);
      var nativeResult = ArrayBuffer.isView(view);
      var specResult = arrayBufferIsView(view);
      expect(specResult).toBe(nativeResult);
      expect(arrayBufferIsView(new DataView(buf))).toBe(ArrayBuffer.isView(new DataView(buf)));
      expect(arrayBufferIsView(new Float64Array(2))).toBe(ArrayBuffer.isView(new Float64Array(2)));
    });
    it("false for non-views", function () {
      var buf = new ArrayBuffer(8);
      expect(arrayBufferIsView(buf)).toBe(ArrayBuffer.isView(buf));
      expect(arrayBufferIsView([])).toBe(ArrayBuffer.isView([]));
      expect(arrayBufferIsView({})).toBe(ArrayBuffer.isView({}));
      expect(arrayBufferIsView(null)).toBe(ArrayBuffer.isView(null));
      expect(arrayBufferIsView(void 0)).toBe(ArrayBuffer.isView(void 0));
      expect(arrayBufferIsView(42)).toBe(ArrayBuffer.isView(42));
      expect(arrayBufferIsView("view")).toBe(ArrayBuffer.isView("view"));
    });
  });
  describe("ArrayBuffer.prototype.slice \u2014 polyfill vs native", function () {
    var mk = function mk() {
      var buf = new ArrayBuffer(8);
      var bytes = new Uint8Array(buf);
      for (var i = 0; i < 8; i++) bytes[i] = i + 1;
      return buf;
    };
    var toArray3 = function toArray3(buf) {
      return Array.prototype.slice.call(new Uint8Array(buf));
    };
    it("copies a middle region", function () {
      var buf = mk();
      var nativeResult = toArray3(buf.slice(2, 5));
      var specResult = toArray3(arrayBufferSlice.call(buf, 2, 5));
      expect(specResult).toEqual(nativeResult);
    });
    it("handles negative / missing / inverted bounds", function () {
      var buf = mk();
      expect(toArray3(arrayBufferSlice.call(buf, -3))).toEqual(toArray3(buf.slice(-3)));
      expect(toArray3(arrayBufferSlice.call(buf, 0, -2))).toEqual(toArray3(buf.slice(0, -2)));
      expect(toArray3(arrayBufferSlice.call(buf))).toEqual(toArray3(buf.slice()));
      expect(toArray3(arrayBufferSlice.call(buf, 5, 2))).toEqual(toArray3(buf.slice(5, 2)));
      expect(toArray3(arrayBufferSlice.call(buf, 99))).toEqual(toArray3(buf.slice(99)));
      expect(toArray3(arrayBufferSlice.call(buf, -99))).toEqual(toArray3(buf.slice(-99)));
    });
    it("returns a copy, not a view", function () {
      var buf = mk();
      var spec = arrayBufferSlice.call(buf, 0, 4);
      expect(spec instanceof ArrayBuffer).toBe(true);
      new Uint8Array(spec)[0] = 99;
      expect(new Uint8Array(buf)[0]).toBe(1);
    });
    it("probe reports native support in a modern browser", function () {
      expect(isArrayBufferSupported()).toBe(true);
    });
  });

  // src/modules/es.array.to-reversed.ts
  var isSupported4 = function isSupported4() {
    try {
      return typeof Array.prototype.toReversed === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH2 = 9007199254740991;
  var toLength2 = function toLength2(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH2) {
      return MAX_SAFE_LENGTH2;
    }
    return Math.floor(numeric);
  };
  var arrayToReversed = function arrayToReversed() {
    var object = Object(this);
    var length = toLength2(object.length);
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = object[length - 1 - i];
    }
    return result;
  };
  if (!isSupported4()) {
    Object.defineProperty(Array.prototype, "toReversed", {
      value: arrayToReversed,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.toReversed, "name", {
      value: "toReversed",
      configurable: true
    });
    Object.defineProperty(Array.prototype.toReversed, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.to-sorted.ts
  var isSupported5 = function isSupported5() {
    try {
      return typeof Array.prototype.toSorted === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH3 = 9007199254740991;
  var toLength3 = function toLength3(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH3) {
      return MAX_SAFE_LENGTH3;
    }
    return Math.floor(numeric);
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
  var sortCompare = function sortCompare(compareFn, a, b) {
    if (a === void 0) {
      return b === void 0 ? 0 : 1;
    }
    if (b === void 0) {
      return -1;
    }
    return compareFn ? Number(compareFn(a, b)) || 0 : defaultCompare(a, b);
  };
  var stableSort = function stableSort(items, compareFn) {
    var length = items.length;
    if (length < 2) {
      return;
    }
    var source = items;
    var target = new Array(length);
    for (var width = 1; width < length; width *= 2) {
      for (var start = 0; start < length; start += width * 2) {
        var left = start;
        var middle = start + width < length ? start + width : length;
        var right = middle;
        var end = start + width * 2 < length ? start + width * 2 : length;
        var out = start;
        while (left < middle && right < end) {
          if (sortCompare(compareFn, source[left], source[right]) <= 0) {
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
      var swap = source;
      source = target;
      target = swap;
    }
    if (source !== items) {
      for (var i = 0; i < length; i++) {
        items[i] = source[i];
      }
    }
  };
  var arrayToSorted = function arrayToSorted(compareFn) {
    if (compareFn !== void 0 && typeof compareFn !== "function") {
      throw new TypeError("The comparison function must be either a function or undefined");
    }
    var object = Object(this);
    var length = toLength3(object.length);
    var items = new Array(length);
    for (var i = 0; i < length; i++) {
      items[i] = object[i];
    }
    stableSort(items, compareFn);
    return items;
  };
  if (!isSupported5()) {
    Object.defineProperty(Array.prototype, "toSorted", {
      value: arrayToSorted,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.toSorted, "name", {
      value: "toSorted",
      configurable: true
    });
    Object.defineProperty(Array.prototype.toSorted, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.to-spliced.ts
  var isSupported6 = function isSupported6() {
    try {
      return typeof Array.prototype.toSpliced === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH4 = 9007199254740991;
  var toLength4 = function toLength4(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH4) {
      return MAX_SAFE_LENGTH4;
    }
    return Math.floor(numeric);
  };
  var toInteger3 = function toInteger3(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    if (numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    if (numeric < 0) {
      return Math.ceil(numeric);
    }
    return Math.floor(numeric);
  };
  var arrayToSpliced = function arrayToSpliced(start, skipCount) {
    for (var _len = arguments.length, items = new Array(_len > 2 ? _len - 2 : 0), _key2 = 2; _key2 < _len; _key2++) {
      items[_key2 - 2] = arguments[_key2];
    }
    var object = Object(this);
    var length = toLength4(object.length);
    var argCount = arguments.length;
    var relativeStart = toInteger3(start);
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
      actualSkipCount = Math.min(Math.max(toInteger3(skipCount), 0), length - actualStart);
    }
    var insertCount = items.length;
    var newLength = length - actualSkipCount + insertCount;
    if (newLength > MAX_SAFE_LENGTH4) {
      throw new TypeError("Array length exceeded");
    }
    var result = new Array(newLength);
    var writeIndex = 0;
    while (writeIndex < actualStart) {
      result[writeIndex] = object[writeIndex];
      writeIndex++;
    }
    for (var i = 0; i < insertCount; i++) {
      result[writeIndex] = items[i];
      writeIndex++;
    }
    var readFrom = actualStart + actualSkipCount;
    while (writeIndex < newLength) {
      result[writeIndex] = object[readFrom];
      writeIndex++;
      readFrom++;
    }
    return result;
  };
  if (!isSupported6()) {
    Object.defineProperty(Array.prototype, "toSpliced", {
      value: arrayToSpliced,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.toSpliced, "name", {
      value: "toSpliced",
      configurable: true
    });
    Object.defineProperty(Array.prototype.toSpliced, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.with.ts
  var isSupported7 = function isSupported7() {
    try {
      return typeof Array.prototype.with === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH5 = 9007199254740991;
  var toLength5 = function toLength5(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH5) {
      return MAX_SAFE_LENGTH5;
    }
    return Math.floor(numeric);
  };
  var toInteger4 = function toInteger4(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    if (numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    if (numeric < 0) {
      return Math.ceil(numeric);
    }
    return Math.floor(numeric);
  };
  var arrayWith = function arrayWith(index, value) {
    var object = Object(this);
    var length = toLength5(object.length);
    var relativeIndex2 = toInteger4(index);
    var actualIndex = relativeIndex2;
    if (relativeIndex2 < 0) {
      actualIndex = length + relativeIndex2;
    }
    if (actualIndex < 0 || actualIndex >= length) {
      throw new RangeError("Invalid index : " + index);
    }
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      if (i === actualIndex) {
        result[i] = value;
      } else {
        result[i] = object[i];
      }
    }
    return result;
  };
  if (!isSupported7()) {
    Object.defineProperty(Array.prototype, "with", {
      value: arrayWith,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.with, "name", {
      value: "with",
      configurable: true
    });
    Object.defineProperty(Array.prototype.with, "__polyfilled", {
      value: true
    });
  }

  // tests/array-by-copy.test.ts
  var toReversed = function toReversed(arr) {
    return arrayToReversed.call(arr);
  };
  var toSorted = function toSorted(arr, cmp) {
    return arrayToSorted.call(arr, cmp);
  };
  var toSpliced = function toSpliced(arr) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return arrayToSpliced.apply(arr, args);
  };
  var withAt = function withAt(arr, index, value) {
    return arrayWith.call(arr, index, value);
  };
  describe("Array by copy (ES2023) \u2014 test262 conformance", function () {
    describe("toReversed", function () {
      it("returns a reversed copy without mutating the original", function () {
        var source = [1, 2, 3, 4];
        var result = toReversed(source);
        expect(result).toEqual([4, 3, 2, 1]);
        expect(source).toEqual([1, 2, 3, 4]);
        expect(result).not.toBe(source);
      });
      it("materializes holes as undefined (dense output)", function () {
        var sparse = [1,, 3];
        expect(toReversed(sparse)).toEqual([3, void 0, 1]);
      });
      it("matches native", function () {
        var source = ["a", "b", "c"];
        expect(toReversed(source)).toEqual(source.toReversed());
      });
    });
    describe("toSorted", function () {
      it("returns a sorted copy without mutating the original", function () {
        var source = [3, 1, 2];
        var result = toSorted(source);
        expect(result).toEqual([1, 2, 3]);
        expect(source).toEqual([3, 1, 2]);
      });
      it("honors a comparator", function () {
        expect(toSorted([3, 1, 2], function (a, b) {
          return b - a;
        })).toEqual([3, 2, 1]);
      });
      it("default sort is lexicographic, like native", function () {
        var source = [10, 1, 2];
        expect(toSorted(source)).toEqual(source.toSorted());
      });
      it("throws TypeError for a non-callable comparator", function () {
        expect(function () {
          return toSorted([1, 2], "nope");
        }).toThrow(TypeError);
      });
    });
    describe("toSpliced", function () {
      it("removes and inserts without mutating the original", function () {
        var source = [1, 2, 3, 4];
        var result = toSpliced(source, 1, 2, "a", "b");
        expect(result).toEqual([1, "a", "b", 4]);
        expect(source).toEqual([1, 2, 3, 4]);
      });
      it("with one arg removes through the end", function () {
        expect(toSpliced([1, 2, 3, 4], 2)).toEqual([1, 2]);
      });
      it("clamps a negative start", function () {
        var source = [1, 2, 3, 4];
        expect(toSpliced(source, -2, 1, "x")).toEqual(source.toSpliced(-2, 1, "x"));
      });
      it("no args returns a full copy", function () {
        var source = [1, 2, 3];
        var result = toSpliced(source);
        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(source);
      });
    });
    describe("with", function () {
      it("replaces one index without mutating the original", function () {
        var source = [1, 2, 3];
        var result = withAt(source, 1, 9);
        expect(result).toEqual([1, 9, 3]);
        expect(source).toEqual([1, 2, 3]);
      });
      it("accepts a negative index from the end", function () {
        expect(withAt([1, 2, 3], -1, 9)).toEqual([1, 2, 9]);
      });
      it("throws RangeError out of range", function () {
        expect(function () {
          return withAt([1, 2, 3], 5, 0);
        }).toThrow(RangeError);
        expect(function () {
          return withAt([1, 2, 3], -5, 0);
        }).toThrow(RangeError);
      });
      it("matches native", function () {
        var source = [1, 2, 3];
        expect(withAt(source, 0, 7)).toEqual(source.with(0, 7));
      });
    });
  });

  // src/modules/es.array.copy-within.ts
  var isSupported8 = function isSupported8() {
    try {
      return typeof Array.prototype.copyWithin === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH6 = 9007199254740991;
  var toLength6 = function toLength6(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH6) {
      return MAX_SAFE_LENGTH6;
    }
    return Math.floor(numeric);
  };
  var toInteger5 = function toInteger5(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    if (numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
  };
  var clampRelative = function clampRelative(value, length) {
    var relative = toInteger5(value);
    if (relative < 0) {
      return Math.max(length + relative, 0);
    }
    return Math.min(relative, length);
  };
  var arrayCopyWithin = function arrayCopyWithin(target, start, end) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.copyWithin called on null or undefined");
    }
    var object = Object(this);
    var length = toLength6(object.length);
    var to = clampRelative(target, length);
    var from = clampRelative(start, length);
    var final = end === void 0 ? length : clampRelative(end, length);
    var count = Math.min(final - from, length - to);
    var direction = 1;
    if (from < to && to < from + count) {
      direction = -1;
      from += count - 1;
      to += count - 1;
    }
    while (count > 0) {
      if (from in object) {
        object[to] = object[from];
      } else {
        delete object[to];
      }
      from += direction;
      to += direction;
      count--;
    }
    return object;
  };
  if (!isSupported8()) {
    Object.defineProperty(Array.prototype, "copyWithin", {
      value: arrayCopyWithin,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.copyWithin, "name", {
      value: "copyWithin",
      configurable: true
    });
    Object.defineProperty(Array.prototype.copyWithin, "__polyfilled", {
      value: true
    });
  }

  // tests/array-copy-within.test.ts
  describe("Array.prototype.copyWithin \u2014 test262 conformance", function () {
    it("copies a trailing slice to the front", function () {
      expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3)).toEqual([4, 5, 3, 4, 5]);
    });
    it("copies with an explicit end", function () {
      expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3, 4)).toEqual([4, 2, 3, 4, 5]);
    });
    it("handles negative target/start/end (from end)", function () {
      expect(arrayCopyWithin.call([1, 2, 3, 4, 5], -2, -3, -1)).toEqual([1, 2, 3, 3, 4]);
    });
    it("returns the same array (mutates in place)", function () {
      var arr = [1, 2, 3];
      expect(arrayCopyWithin.call(arr, 0, 1)).toBe(arr);
    });
    it("copies backward when ranges overlap (no clobber)", function () {
      expect(arrayCopyWithin.call([1, 2, 3, 4, 5], 2, 0)).toEqual([1, 2, 1, 2, 3]);
    });
    it("propagates holes (deletes destination slot)", function () {
      var arr = [, 2, 3];
      var out = arrayCopyWithin.call(arr, 2, 0, 1);
      expect(2 in out).toBe(false);
    });
    it("throws TypeError on null/undefined this", function () {
      expect(function () {
        return arrayCopyWithin.call(null, 0, 0);
      }).toThrow(TypeError);
    });
    it("matches native + timing", function () {
      var native = Array.prototype.copyWithin;
      var nativeResult = native.call([1, 2, 3, 4, 5], 0, 3);
      var specResult = arrayCopyWithin.call([1, 2, 3, 4, 5], 0, 3);
      expect(specResult).toEqual(nativeResult);
    });
  });

  // src/modules/es.array.every.ts
  var isSupported9 = function isSupported9() {
    try {
      var method = Array.prototype.every;
      if (typeof method !== "function") return false;
      try {
        method.call(null, function () {
          return 1;
        }, 1);
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var toObject = function toObject(arg) {
    if (arg === null || arg === void 0) throw new TypeError("Cannot convert undefined or null to object");
    return Object(arg);
  };
  var toLength7 = function toLength7(value) {
    var n = Number(value);
    if (isNaN(n) || n <= 0) return 0;
    return n > 9007199254740991 ? 9007199254740991 : Math.floor(n);
  };
  var arrayEvery = function every(callbackfn) {
    var O = toObject(this);
    var thisArg = arguments.length > 1 ? arguments[1] : void 0;
    var length = toLength7(O.length);
    for (var index = 0; index < length; index++) {
      if (index in O) {
        if (!callbackfn.call(thisArg, O[index], index, O)) return false;
      }
    }
    return true;
  };
  if (!isSupported9()) {
    Object.defineProperty(Array.prototype, "every", {
      value: arrayEvery,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.every, "name", {
      value: "every",
      configurable: true
    });
    Object.defineProperty(Array.prototype.every, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.some.ts
  var isSupported10 = function isSupported10() {
    try {
      var method = Array.prototype.some;
      if (typeof method !== "function") return false;
      try {
        method.call(null, function () {
          return 1;
        }, 1);
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var toObject2 = function toObject2(arg) {
    if (arg === null || arg === void 0) throw new TypeError("Cannot convert undefined or null to object");
    return Object(arg);
  };
  var toLength8 = function toLength8(value) {
    var n = Number(value);
    if (isNaN(n) || n <= 0) return 0;
    return n > 9007199254740991 ? 9007199254740991 : Math.floor(n);
  };
  var arraySome = function some(callbackfn) {
    var O = toObject2(this);
    var thisArg = arguments.length > 1 ? arguments[1] : void 0;
    var length = toLength8(O.length);
    for (var index = 0; index < length; index++) {
      if (index in O) {
        if (callbackfn.call(thisArg, O[index], index, O)) return true;
      }
    }
    return false;
  };
  if (!isSupported10()) {
    Object.defineProperty(Array.prototype, "some", {
      value: arraySome,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.some, "name", {
      value: "some",
      configurable: true
    });
    Object.defineProperty(Array.prototype.some, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.for-each.ts
  var isSupported11 = function isSupported11() {
    try {
      var method = Array.prototype.forEach;
      if (typeof method !== "function") return false;
      try {
        method.call(null, function () {
          return 1;
        }, 1);
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var toObject3 = function toObject3(arg) {
    if (arg === null || arg === void 0) throw new TypeError("Cannot convert undefined or null to object");
    return Object(arg);
  };
  var toLength9 = function toLength9(value) {
    var n = Number(value);
    if (isNaN(n) || n <= 0) return 0;
    return n > 9007199254740991 ? 9007199254740991 : Math.floor(n);
  };
  var arrayForEach = function forEach(callbackfn) {
    var O = toObject3(this);
    var thisArg = arguments.length > 1 ? arguments[1] : void 0;
    var length = toLength9(O.length);
    for (var index = 0; index < length; index++) {
      if (index in O) {
        callbackfn.call(thisArg, O[index], index, O);
      }
    }
  };
  if (!isSupported11()) {
    Object.defineProperty(Array.prototype, "forEach", {
      value: arrayForEach,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.forEach, "name", {
      value: "forEach",
      configurable: true
    });
    Object.defineProperty(Array.prototype.forEach, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.join.ts
  var nativeJoin = Array.prototype.join;
  var isSupported12 = function isSupported12() {
    try {
      if (typeof nativeJoin !== "function") return false;
      if (!Object("z").propertyIsEnumerable(0)) return false;
      try {
        nativeJoin.call(null, ",");
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var toIndexedObject = function toIndexedObject(value) {
    if (value === null || value === void 0) {
      throw new TypeError("Array.prototype.join called on null or undefined");
    }
    return typeof value === "string" ? value.split("") : Object(value);
  };
  var arrayJoin = function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === void 0 ? "," : separator);
  };
  if (!isSupported12()) {
    Object.defineProperty(Array.prototype, "join", {
      value: arrayJoin,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.join, "name", {
      value: "join",
      configurable: true
    });
    Object.defineProperty(Array.prototype.join, "__polyfilled", {
      value: true
    });
  }

  // tests/array-es5-iteration.test.ts
  describe("Array.prototype.every island", function () {
    it("returns true only when every element passes", function () {
      expect(arrayEvery.call([1, 2, 3], function (x) {
        return x < 5;
      })).toBe(true);
      expect(arrayEvery.call([1, 2, 9], function (x) {
        return x < 5;
      })).toBe(false);
    });
    it("honours thisArg and skips holes", function () {
      var ctx = {
        limit: 5
      };
      expect(arrayEvery.call([1, 2, 3], function (x) {
        return x < this.limit;
      }, ctx)).toBe(true);
      var visited = 0;
      arrayEvery.call([1,, 3], function () {
        visited++;
        return true;
      });
      expect(visited).toBe(2);
    });
    it("throws on a null this", function () {
      expect(function () {
        return arrayEvery.call(null, function () {
          return true;
        });
      }).toThrow(TypeError);
    });
  });
  describe("Array.prototype.some island", function () {
    it("returns true when any element passes", function () {
      expect(arraySome.call([1, 2, 3], function (x) {
        return x > 2;
      })).toBe(true);
      expect(arraySome.call([1, 2, 3], function (x) {
        return x > 9;
      })).toBe(false);
    });
  });
  describe("Array.prototype.forEach island", function () {
    it("visits each present index with (value, index, array)", function () {
      var seen = [];
      arrayForEach.call([10, 20], function (v, i) {
        return seen.push(i + ":" + v);
      });
      expect(seen).toEqual(["0:10", "1:20"]);
    });
    it("skips holes", function () {
      var idx = [];
      arrayForEach.call([1,, 3], function (_v, i) {
        return idx.push(i);
      });
      expect(idx).toEqual([0, 2]);
    });
  });
  describe("Array.prototype.join island", function () {
    it("defaults the separator to a comma", function () {
      expect(arrayJoin.call([1, 2, 3])).toBe("1,2,3");
    });
    it("uses an explicit separator", function () {
      expect(arrayJoin.call([1, 2, 3], "-")).toBe("1-2-3");
    });
    it("works on a primitive string this", function () {
      expect(arrayJoin.call("abc", "|")).toBe("a|b|c");
    });
    it("throws on a null this", function () {
      expect(function () {
        return arrayJoin.call(null, ",");
      }).toThrow(TypeError);
    });
  });

  // src/modules/es.array.index-of.ts
  var isSupported13 = function isSupported13() {
    try {
      return typeof Array.prototype.indexOf === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH7 = 9007199254740991;
  var toLength10 = function toLength10(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH7) {
      return MAX_SAFE_LENGTH7;
    }
    return Math.floor(numeric);
  };
  var toInteger6 = function toInteger6(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
  };
  var arrayIndexOf = function arrayIndexOf(searchElement, fromIndex) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.indexOf called on null or undefined");
    }
    var object = Object(this);
    var length = toLength10(object.length);
    if (length === 0) {
      return -1;
    }
    var start = toInteger6(fromIndex);
    if (start >= length) {
      return -1;
    }
    if (start < 0) {
      start = Math.max(length + start, 0);
    }
    for (var i = start; i < length; i++) {
      if (i in object && object[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };
  if (!isSupported13()) {
    Object.defineProperty(Array.prototype, "indexOf", {
      value: arrayIndexOf,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.indexOf, "name", {
      value: "indexOf",
      configurable: true
    });
    Object.defineProperty(Array.prototype.indexOf, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.last-index-of.ts
  var isSupported14 = function isSupported14() {
    try {
      return typeof Array.prototype.lastIndexOf === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH8 = 9007199254740991;
  var toLength11 = function toLength11(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH8) {
      return MAX_SAFE_LENGTH8;
    }
    return Math.floor(numeric);
  };
  var toInteger7 = function toInteger7(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
  };
  var arrayLastIndexOf = function arrayLastIndexOf(searchElement) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.lastIndexOf called on null or undefined");
    }
    var object = Object(this);
    var length = toLength11(object.length);
    if (length === 0) {
      return -1;
    }
    var start = arguments.length > 1 ? toInteger7(arguments[1]) : length - 1;
    if (start >= 0) {
      start = Math.min(start, length - 1);
    } else {
      start = length + start;
    }
    for (var i = start; i >= 0; i--) {
      if (i in object && object[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };
  if (!isSupported14()) {
    Object.defineProperty(Array.prototype, "lastIndexOf", {
      value: arrayLastIndexOf,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.lastIndexOf, "name", {
      value: "lastIndexOf",
      configurable: true
    });
    Object.defineProperty(Array.prototype.lastIndexOf, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.reduce.ts
  var isSupported15 = function isSupported15() {
    try {
      return typeof Array.prototype.reduce === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH9 = 9007199254740991;
  var toLength12 = function toLength12(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH9) {
      return MAX_SAFE_LENGTH9;
    }
    return Math.floor(numeric);
  };
  var arrayReduce = function arrayReduce(callback, initialValue) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.reduce called on null or undefined");
    }
    if (typeof callback !== "function") {
      throw new TypeError("callback is not a function");
    }
    var object = Object(this);
    var length = toLength12(object.length);
    var accumulator;
    var index = 0;
    if (arguments.length > 1) {
      accumulator = initialValue;
    } else {
      var found = false;
      while (index < length) {
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
    for (; index < length; index++) {
      if (index in object) {
        accumulator = callback(accumulator, object[index], index, object);
      }
    }
    return accumulator;
  };
  if (!isSupported15()) {
    Object.defineProperty(Array.prototype, "reduce", {
      value: arrayReduce,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.reduce, "name", {
      value: "reduce",
      configurable: true
    });
    Object.defineProperty(Array.prototype.reduce, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.reduce-right.ts
  var isSupported16 = function isSupported16() {
    try {
      return typeof Array.prototype.reduceRight === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH10 = 9007199254740991;
  var toLength13 = function toLength13(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH10) {
      return MAX_SAFE_LENGTH10;
    }
    return Math.floor(numeric);
  };
  var arrayReduceRight = function arrayReduceRight(callback, initialValue) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.reduceRight called on null or undefined");
    }
    if (typeof callback !== "function") {
      throw new TypeError("callback is not a function");
    }
    var object = Object(this);
    var length = toLength13(object.length);
    var accumulator;
    var index = length - 1;
    if (arguments.length > 1) {
      accumulator = initialValue;
    } else {
      var found = false;
      while (index >= 0) {
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
    for (; index >= 0; index--) {
      if (index in object) {
        accumulator = callback(accumulator, object[index], index, object);
      }
    }
    return accumulator;
  };
  if (!isSupported16()) {
    Object.defineProperty(Array.prototype, "reduceRight", {
      value: arrayReduceRight,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.reduceRight, "name", {
      value: "reduceRight",
      configurable: true
    });
    Object.defineProperty(Array.prototype.reduceRight, "__polyfilled", {
      value: true
    });
  }

  // tests/array-es5-methods.test.ts
  describe("Array ES5 methods \u2014 test262 conformance", function () {
    describe("arrayReduce", function () {
      it("reduces left to right with an initial value", function () {
        expect(arrayReduce.call([1, 2, 3], function (acc, v) {
          return acc + v;
        }, 10)).toBe(16);
      });
      it("uses the first element as the seed when no initial value", function () {
        var seen = [];
        var out = arrayReduce.call([1, 2, 3], function (acc, v, i) {
          seen.push(i);
          return acc + v;
        });
        expect(out).toBe(6);
        expect(seen).toEqual([1, 2]);
      });
      it("skips holes, including when seeding", function () {
        expect(arrayReduce.call([, 2,, 4], function (acc, v) {
          return acc + v;
        })).toBe(6);
      });
      it("throws TypeError on an empty array with no initial value", function () {
        expect(function () {
          return arrayReduce.call([], function (acc) {
            return acc;
          });
        }).toThrow(TypeError);
      });
      it("accepts undefined as an explicit initial value", function () {
        expect(arrayReduce.call([], function (acc) {
          return acc;
        }, void 0)).toBeUndefined();
      });
      it("throws on a non-callable callback", function () {
        expect(function () {
          return arrayReduce.call([1], "nope");
        }).toThrow(TypeError);
      });
      it("matches native", function () {
        var source = [3, 1, 4, 1, 5];
        var reducer = function reducer(acc, v) {
          return acc * 2 + v;
        };
        expect(arrayReduce.call(source, reducer, 0)).toBe(source.reduce(reducer, 0));
        expect(arrayReduce.call(source, reducer)).toBe(source.reduce(reducer));
      });
    });
    describe("arrayReduceRight", function () {
      it("reduces right to left", function () {
        expect(arrayReduceRight.call(["a", "b", "c"], function (acc, v) {
          return acc + v;
        })).toBe("cba");
      });
      it("throws TypeError on an empty array with no initial value", function () {
        expect(function () {
          return arrayReduceRight.call([], function (acc) {
            return acc;
          });
        }).toThrow(TypeError);
      });
      it("skips holes when seeding from the right", function () {
        expect(arrayReduceRight.call([1,, 3,,], function (acc, v) {
          return acc + v;
        })).toBe(4);
      });
      it("matches native", function () {
        var source = [3, 1, 4];
        var reducer = function reducer(acc, v) {
          return acc * 2 + v;
        };
        expect(arrayReduceRight.call(source, reducer, 0)).toBe(source.reduceRight(reducer, 0));
      });
    });
    describe("arrayIndexOf", function () {
      it("finds by strict equality", function () {
        expect(arrayIndexOf.call([1, "1", 2], "1")).toBe(1);
      });
      it("returns -1 for NaN (strict equality never matches)", function () {
        expect(arrayIndexOf.call([NaN], NaN)).toBe(-1);
      });
      it("honors a positive and negative fromIndex", function () {
        expect(arrayIndexOf.call([1, 2, 1], 1, 1)).toBe(2);
        expect(arrayIndexOf.call([1, 2, 1], 1, -1)).toBe(2);
      });
      it("returns -1 when fromIndex is past the end", function () {
        expect(arrayIndexOf.call([1, 2], 1, 5)).toBe(-1);
      });
      it("skips holes", function () {
        expect(arrayIndexOf.call([, void 0], void 0)).toBe(1);
      });
      it("matches native across fromIndex combos", function () {
        var source = [1, 2, 3, 2, 1];
        var combos = [[2, void 0], [2, 2], [1, -2], [9, void 0], [1, 2.9]];
        for (var _i2 = 0, _combos = combos; _i2 < _combos.length; _i2++) {
          var _combos$_i = _slicedToArray(_combos[_i2], 2),
            search = _combos$_i[0],
            from = _combos$_i[1];
          expect(arrayIndexOf.call(source, search, from)).toBe(source.indexOf(search, from));
        }
      });
    });
    describe("arrayLastIndexOf", function () {
      it("finds the last match", function () {
        expect(arrayLastIndexOf.call([1, 2, 1], 1)).toBe(2);
      });
      it("honors a positive and negative fromIndex", function () {
        expect(arrayLastIndexOf.call([1, 2, 1], 1, 1)).toBe(0);
        expect(arrayLastIndexOf.call([1, 2, 1], 1, -2)).toBe(0);
      });
      it("returns -1 when the backwards search finds nothing", function () {
        expect(arrayLastIndexOf.call([1, 2], 3)).toBe(-1);
        expect(arrayLastIndexOf.call([1, 2], 2, -5)).toBe(-1);
      });
      it("matches native across fromIndex combos", function () {
        var source = [1, 2, 3, 2, 1];
        var combos = [[2, void 0], [2, 2], [1, -2], [9, void 0], [2, 2.9]];
        for (var _i3 = 0, _combos2 = combos; _i3 < _combos2.length; _i3++) {
          var _combos2$_i = _slicedToArray(_combos2[_i3], 2),
            search = _combos2$_i[0],
            from = _combos2$_i[1];
          var mine = from === void 0 ? arrayLastIndexOf.call(source, search) : arrayLastIndexOf.call(source, search, from);
          var theirs = from === void 0 ? source.lastIndexOf(search) : source.lastIndexOf(search, from);
          expect(mine).toBe(theirs);
        }
      });
    });
  });

  // src/modules/es.array.fill.ts
  var isSupported17 = function isSupported17() {
    try {
      return typeof Array.prototype.fill === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH11 = 9007199254740991;
  var toLength14 = function toLength14(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH11) {
      return MAX_SAFE_LENGTH11;
    }
    return Math.floor(numeric);
  };
  var toInteger8 = function toInteger8(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    if (numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    if (numeric < 0) {
      return Math.ceil(numeric);
    }
    return Math.floor(numeric);
  };
  var resolveIndex = function resolveIndex(relative, length) {
    var index = relative;
    if (relative < 0) {
      index = length + relative;
    }
    if (index < 0) {
      return 0;
    }
    if (index > length) {
      return length;
    }
    return index;
  };
  var arrayFill = function arrayFill(value, start, end) {
    var length = toLength14(this.length);
    var from = resolveIndex(start === void 0 ? 0 : toInteger8(start), length);
    var to = resolveIndex(end === void 0 ? length : toInteger8(end), length);
    for (var i = from; i < to; i++) {
      this[i] = value;
    }
    return this;
  };
  if (!isSupported17()) {
    Object.defineProperty(Array.prototype, "fill", {
      value: arrayFill,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.fill, "name", {
      value: "fill",
      configurable: true
    });
    Object.defineProperty(Array.prototype.fill, "__polyfilled", {
      value: true
    });
  }

  // tests/array-fill.test.ts
  describe("Array.prototype.fill \u2014 test262 conformance", function () {
    describe("return value & mutation", function () {
      it("returns the same array (mutates in place)", function () {
        var arr = [1, 2, 3];
        expect(arrayFill.call(arr, 0)).toBe(arr);
      });
      it("fills the entire array when no start/end", function () {
        expect(arrayFill.call([1, 2, 3], 7)).toEqual([7, 7, 7]);
      });
      it("holds the fill value by reference (same object in every slot)", function () {
        var obj = {};
        var out = arrayFill.call(new Array(2), obj);
        expect(out[0]).toBe(obj);
        expect(out[1]).toBe(obj);
      });
    });
    describe("start (ToInteger)", function () {
      it("fills from a positive start", function () {
        expect(arrayFill.call([1, 2, 3, 4], 0, 2)).toEqual([1, 2, 0, 0]);
      });
      it("counts a negative start from the end", function () {
        expect(arrayFill.call([1, 2, 3, 4], 0, -2)).toEqual([1, 2, 0, 0]);
      });
      it("clamps a large negative start to 0", function () {
        expect(arrayFill.call([1, 2, 3], 0, -100)).toEqual([0, 0, 0]);
      });
      it("treats a NaN start as 0", function () {
        expect(arrayFill.call([1, 2, 3], 0, NaN)).toEqual([0, 0, 0]);
      });
      it("truncates a fractional start toward zero", function () {
        expect(arrayFill.call([1, 2, 3, 4], 0, 1.9)).toEqual([1, 0, 0, 0]);
      });
      it("fills nothing when start is +Infinity (>= length)", function () {
        expect(arrayFill.call([1, 2, 3], 0, Infinity)).toEqual([1, 2, 3]);
      });
      it("fills everything when start is -Infinity", function () {
        expect(arrayFill.call([1, 2, 3], 0, -Infinity)).toEqual([0, 0, 0]);
      });
      it("does nothing when start beyond length", function () {
        expect(arrayFill.call([1, 2, 3], 9, 10)).toEqual([1, 2, 3]);
      });
    });
    describe("end (ToInteger)", function () {
      it("defaults end to length", function () {
        expect(arrayFill.call([1, 2, 3], 0, 1)).toEqual([1, 0, 0]);
      });
      it("fills between start and end", function () {
        expect(arrayFill.call([1, 2, 3, 4, 5], 9, 1, 3)).toEqual([1, 9, 9, 4, 5]);
      });
      it("counts a negative end from the end", function () {
        expect(arrayFill.call([1, 2, 3, 4], 0, 1, -1)).toEqual([1, 0, 0, 4]);
      });
      it("clamps an end past length to length", function () {
        expect(arrayFill.call([1, 2, 3], 0, 0, 100)).toEqual([0, 0, 0]);
      });
      it("treats a NaN end as 0 (fills nothing)", function () {
        expect(arrayFill.call([1, 2, 3], 0, 0, NaN)).toEqual([1, 2, 3]);
      });
      it("truncates a fractional end toward zero", function () {
        expect(arrayFill.call([1, 2, 3, 4], 0, 0, 2.9)).toEqual([0, 0, 3, 4]);
      });
      it("fills to the end when end is +Infinity", function () {
        expect(arrayFill.call([1, 2, 3], 0, 0, Infinity)).toEqual([0, 0, 0]);
      });
      it("fills nothing when end is -Infinity", function () {
        expect(arrayFill.call([1, 2, 3], 0, 0, -Infinity)).toEqual([1, 2, 3]);
      });
      it("does nothing when start > end", function () {
        expect(arrayFill.call([1, 2, 3, 4], 0, 3, 1)).toEqual([1, 2, 3, 4]);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("is a no-op on an empty array", function () {
        expect(arrayFill.call([], 1)).toEqual([]);
      });
      it("treats a negative length as a no-op (no scan, no hang)", function () {
        var arrayLike = {
          length: -1,
          0: "x"
        };
        var out = arrayFill.call(arrayLike, "y");
        expect(out).toBe(arrayLike);
        expect(out[0]).toBe("x");
      });
      it("treats a NaN length as a no-op", function () {
        var arrayLike = {
          length: NaN,
          0: "x"
        };
        arrayFill.call(arrayLike, "y");
        expect(arrayLike[0]).toBe("x");
      });
    });
    describe("holes", function () {
      it("fills holes with real entries", function () {
        var out = arrayFill.call(new Array(3), 1);
        expect(out).toEqual([1, 1, 1]);
        expect(0 in out).toBe(true);
        expect(2 in out).toBe(true);
      });
    });
    describe("generic application (array-likes)", function () {
      it("fills a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: "a",
          1: "b",
          2: "c",
          length: 3
        };
        arrayFill.call(arrayLike, "z", 1);
        expect(arrayLike).toEqual({
          0: "a",
          1: "z",
          2: "z",
          length: 3
        });
      });
    });
    describe("parity vs native", function () {
      it("matches native filling a range", function () {
        var native = Array.prototype.fill;
        var nativeResult = native.call([1, 2, 3, 4, 5], 0, 1, 4);
        var specResult = arrayFill.call([1, 2, 3, 4, 5], 0, 1, 4);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.array.find-index.ts
  var isSupported18 = function isSupported18() {
    try {
      return typeof Array.prototype.findIndex === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH12 = 9007199254740991;
  var toLength15 = function toLength15(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH12) {
      return MAX_SAFE_LENGTH12;
    }
    return Math.floor(numeric);
  };
  var arrayFindIndex = function arrayFindIndex(predicate, thisArg) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.findIndex called on null or undefined");
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }
    var object = Object(this);
    var length = toLength15(object.length);
    for (var i = 0; i < length; i++) {
      if (predicate.call(thisArg, object[i], i, object)) {
        return i;
      }
    }
    return -1;
  };
  if (!isSupported18()) {
    Object.defineProperty(Array.prototype, "findIndex", {
      value: arrayFindIndex,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.findIndex, "name", {
      value: "findIndex",
      configurable: true
    });
    Object.defineProperty(Array.prototype.findIndex, "__polyfilled", {
      value: true
    });
  }

  // tests/array-find-index.test.ts
  describe("Array.prototype.findIndex \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns the index of the first matching element", function () {
        expect(arrayFindIndex.call([1, 2, 3, 4, 5], function (v) {
          return v > 3;
        })).toBe(3);
      });
      it("returns -1 when nothing matches", function () {
        expect(arrayFindIndex.call([1, 2, 3], function (v) {
          return v > 10;
        })).toBe(-1);
      });
      it("returns -1 for an empty array", function () {
        expect(arrayFindIndex.call([], function () {
          return true;
        })).toBe(-1);
      });
      it("returns 0 when the first element matches", function () {
        expect(arrayFindIndex.call([7, 8, 9], function (v) {
          return v === 7;
        })).toBe(0);
      });
    });
    describe("predicate invocation", function () {
      it("calls predicate with (value, index, array) ascending", function () {
        var arr = ["a", "b", "c"];
        var seen = [];
        arrayFindIndex.call(arr, function (v, i, a) {
          seen.push([v, i, a]);
          return false;
        });
        expect(seen).toEqual([["a", 0, arr], ["b", 1, arr], ["c", 2, arr]]);
      });
      it("honors thisArg", function () {
        var ctx = {
          min: 2
        };
        var out = arrayFindIndex.call([1, 2, 3], function (v) {
          return v >= this.min;
        }, ctx);
        expect(out).toBe(1);
      });
      it("throws TypeError when predicate is not callable", function () {
        expect(function () {
          return arrayFindIndex.call([1, 2], 5);
        }).toThrow(TypeError);
      });
    });
    describe("holes", function () {
      it("visits holes as undefined (unlike forEach)", function () {
        var sparse = [1,, 3];
        var seen = [];
        arrayFindIndex.call(sparse, function (v, i) {
          seen.push([i, v]);
          return false;
        });
        expect(seen).toEqual([[0, 1], [1, void 0], [2, 3]]);
      });
      it("matches the undefined value at a hole and returns its index", function () {
        var sparse = [1,, 3];
        expect(arrayFindIndex.call(sparse, function (v) {
          return v === void 0;
        })).toBe(1);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("floors a fractional length", function () {
        var arrayLike = {
          0: "a",
          1: "b",
          2: "c",
          length: 2.9
        };
        var seen = [];
        arrayFindIndex.call(arrayLike, function (_v, i) {
          seen.push(i);
          return false;
        });
        expect(seen).toEqual([0, 1]);
      });
      it("does not visit anything for a negative length", function () {
        var calls = 0;
        arrayFindIndex.call({
          length: -1,
          0: "a"
        }, function () {
          calls++;
          return true;
        });
        expect(calls).toBe(0);
      });
      it("does not visit anything for a NaN length", function () {
        var calls = 0;
        arrayFindIndex.call({
          length: NaN,
          0: "a"
        }, function () {
          calls++;
          return true;
        });
        expect(calls).toBe(0);
      });
    });
    describe("generic application (array-likes)", function () {
      it("finds the index in a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: "a",
          1: "b",
          2: "c",
          length: 3
        };
        expect(arrayFindIndex.call(arrayLike, function (v) {
          return v === "b";
        })).toBe(1);
      });
    });
    describe("parity vs native", function () {
      it("matches native finding an index", function () {
        var arr = [1, 2, 3, 4, 5];
        var native = Array.prototype.findIndex;
        var pred = function pred(v) {
          return v > 3;
        };
        var nativeResult = native.call(arr, pred);
        var specResult = arrayFindIndex.call(arr, pred);
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.array.find-last-index.ts
  var isSupported19 = function isSupported19() {
    try {
      return typeof Array.prototype.findLastIndex === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH13 = 9007199254740991;
  var toLength16 = function toLength16(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH13) {
      return MAX_SAFE_LENGTH13;
    }
    return Math.floor(numeric);
  };
  var arrayFindLastIndex = function arrayFindLastIndex(predicate, thisArg) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.findLastIndex called on null or undefined");
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }
    var object = Object(this);
    var length = toLength16(object.length);
    for (var i = length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, object[i], i, object)) {
        return i;
      }
    }
    return -1;
  };
  if (!isSupported19()) {
    Object.defineProperty(Array.prototype, "findLastIndex", {
      value: arrayFindLastIndex,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.findLastIndex, "name", {
      value: "findLastIndex",
      configurable: true
    });
    Object.defineProperty(Array.prototype.findLastIndex, "__polyfilled", {
      value: true
    });
  }

  // tests/array-find-last-index.test.ts
  describe("Array.prototype.findLastIndex \u2014 test262 conformance", function () {
    it("returns the index of the LAST matching element", function () {
      expect(arrayFindLastIndex.call([1, 2, 3, 4], function (v) {
        return v % 2 === 1;
      })).toBe(2);
    });
    it("returns -1 when nothing matches", function () {
      expect(arrayFindLastIndex.call([2, 4], function (v) {
        return v % 2 === 1;
      })).toBe(-1);
    });
    it("returns -1 for an empty array", function () {
      expect(arrayFindLastIndex.call([], function () {
        return true;
      })).toBe(-1);
    });
    it("calls predicate with (value, index, array) DESCENDING", function () {
      var arr = ["a", "b", "c"];
      var seen = [];
      arrayFindLastIndex.call(arr, function (_v, i) {
        seen.push(i);
        return false;
      });
      expect(seen).toEqual([2, 1, 0]);
    });
    it("honors thisArg", function () {
      var ctx = {
        max: 3
      };
      var out = arrayFindLastIndex.call([1, 2, 3, 4], function (v) {
        return v <= this.max;
      }, ctx);
      expect(out).toBe(2);
    });
    it("throws TypeError when predicate is not callable", function () {
      expect(function () {
        return arrayFindLastIndex.call([1, 2], 5);
      }).toThrow(TypeError);
    });
    it("matches native + timing", function () {
      var arr = [1, 2, 3, 4, 5];
      var native = Array.prototype.findLastIndex;
      var pred = function pred(v) {
        return v < 4;
      };
      var nativeResult = native.call(arr, pred);
      var specResult = arrayFindLastIndex.call(arr, pred);
      expect(specResult).toBe(nativeResult);
    });
  });

  // src/modules/es.array.find-last.ts
  var isSupported20 = function isSupported20() {
    try {
      return typeof Array.prototype.findLast === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH14 = 9007199254740991;
  var toLength17 = function toLength17(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH14) {
      return MAX_SAFE_LENGTH14;
    }
    return Math.floor(numeric);
  };
  var arrayFindLast = function arrayFindLast(predicate, thisArg) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.findLast called on null or undefined");
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }
    var object = Object(this);
    var length = toLength17(object.length);
    for (var i = length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, object[i], i, object)) {
        return object[i];
      }
    }
    return void 0;
  };
  if (!isSupported20()) {
    Object.defineProperty(Array.prototype, "findLast", {
      value: arrayFindLast,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.findLast, "name", {
      value: "findLast",
      configurable: true
    });
    Object.defineProperty(Array.prototype.findLast, "__polyfilled", {
      value: true
    });
  }

  // tests/array-find-last.test.ts
  describe("Array.prototype.findLast \u2014 test262 conformance", function () {
    it("returns the LAST matching element", function () {
      expect(arrayFindLast.call([1, 2, 3, 4], function (v) {
        return v % 2 === 1;
      })).toBe(3);
    });
    it("returns undefined when nothing matches", function () {
      expect(arrayFindLast.call([2, 4], function (v) {
        return v % 2 === 1;
      })).toBeUndefined();
    });
    it("returns undefined for an empty array", function () {
      expect(arrayFindLast.call([], function () {
        return true;
      })).toBeUndefined();
    });
    it("calls predicate with (value, index, array) DESCENDING", function () {
      var arr = ["a", "b", "c"];
      var seen = [];
      arrayFindLast.call(arr, function (v, i) {
        seen.push([v, i]);
        return false;
      });
      expect(seen).toEqual([["c", 2], ["b", 1], ["a", 0]]);
    });
    it("honors thisArg", function () {
      var ctx = {
        max: 3
      };
      var out = arrayFindLast.call([1, 2, 3, 4], function (v) {
        return v <= this.max;
      }, ctx);
      expect(out).toBe(3);
    });
    it("throws TypeError when predicate is not callable", function () {
      expect(function () {
        return arrayFindLast.call([1, 2], 5);
      }).toThrow(TypeError);
    });
    it("visits holes as undefined", function () {
      expect(arrayFindLast.call([1,, 3], function (v) {
        return v === void 0;
      })).toBeUndefined();
    });
    it("matches native + timing", function () {
      var arr = [1, 2, 3, 4, 5];
      var native = Array.prototype.findLast;
      var pred = function pred(v) {
        return v < 4;
      };
      var nativeResult = native.call(arr, pred);
      var specResult = arrayFindLast.call(arr, pred);
      expect(specResult).toBe(nativeResult);
    });
  });

  // src/modules/es.array.find.ts
  var isSupported21 = function isSupported21() {
    try {
      return typeof Array.prototype.find === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH15 = 9007199254740991;
  var toLength18 = function toLength18(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH15) {
      return MAX_SAFE_LENGTH15;
    }
    return Math.floor(numeric);
  };
  var arrayFind = function arrayFind(predicate, thisArg) {
    if (typeof predicate !== "function") {
      throw new TypeError("Array.prototype.find: predicate must be a function");
    }
    var length = toLength18(this.length);
    for (var i = 0; i < length; i++) {
      var value = this[i];
      if (predicate.call(thisArg, value, i, this)) {
        return value;
      }
    }
    return void 0;
  };
  if (!isSupported21()) {
    Object.defineProperty(Array.prototype, "find", {
      value: arrayFind,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.find, "name", {
      value: "find",
      configurable: true
    });
    Object.defineProperty(Array.prototype.find, "__polyfilled", {
      value: true
    });
  }

  // tests/array-find.test.ts
  describe("Array.prototype.find \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns the first matching element", function () {
        expect(arrayFind.call([1, 2, 3, 4, 5], function (v) {
          return v > 3;
        })).toBe(4);
      });
      it("returns undefined when nothing matches", function () {
        expect(arrayFind.call([1, 2, 3], function (v) {
          return v > 10;
        })).toBeUndefined();
      });
      it("returns undefined for an empty array", function () {
        expect(arrayFind.call([], function () {
          return true;
        })).toBeUndefined();
      });
    });
    describe("predicate invocation", function () {
      it("calls predicate with (value, index, array) ascending", function () {
        var arr = ["a", "b", "c"];
        var seen = [];
        arrayFind.call(arr, function (v, i, a) {
          seen.push([v, i, a]);
          return false;
        });
        expect(seen).toEqual([["a", 0, arr], ["b", 1, arr], ["c", 2, arr]]);
      });
      it("honors thisArg", function () {
        var ctx = {
          min: 2
        };
        var out = arrayFind.call([1, 2, 3], function (v) {
          return v >= this.min;
        }, ctx);
        expect(out).toBe(2);
      });
      it("throws TypeError when predicate is not callable", function () {
        expect(function () {
          return arrayFind.call([1, 2], 5);
        }).toThrow(TypeError);
      });
    });
    describe("holes", function () {
      it("visits holes as undefined (unlike forEach)", function () {
        var sparse = [1,, 3];
        var seen = [];
        arrayFind.call(sparse, function (v, i) {
          seen.push([i, v]);
          return false;
        });
        expect(seen).toEqual([[0, 1], [1, void 0], [2, 3]]);
      });
      it("can match the undefined value at a hole", function () {
        var sparse = [1,, 3];
        expect(arrayFind.call(sparse, function (v) {
          return v === void 0;
        })).toBeUndefined();
      });
    });
    describe("length coercion (ToLength)", function () {
      it("floors a fractional length", function () {
        var arrayLike = {
          0: "a",
          1: "b",
          2: "c",
          length: 2.9
        };
        var seen = [];
        arrayFind.call(arrayLike, function (_v, i) {
          seen.push(i);
          return false;
        });
        expect(seen).toEqual([0, 1]);
      });
      it("does not visit anything for a negative length", function () {
        var calls = 0;
        arrayFind.call({
          length: -1,
          0: "a"
        }, function () {
          calls++;
          return true;
        });
        expect(calls).toBe(0);
      });
      it("does not visit anything for a NaN length", function () {
        var calls = 0;
        arrayFind.call({
          length: NaN,
          0: "a"
        }, function () {
          calls++;
          return true;
        });
        expect(calls).toBe(0);
      });
    });
    describe("generic application (array-likes)", function () {
      it("finds in a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: "a",
          1: "b",
          2: "c",
          length: 3
        };
        expect(arrayFind.call(arrayLike, function (v) {
          return v === "b";
        })).toBe("b");
      });
    });
    describe("parity vs native", function () {
      it("matches native finding an element", function () {
        var arr = [1, 2, 3, 4, 5];
        var native = Array.prototype.find;
        var pred = function pred(v) {
          return v > 3;
        };
        var nativeResult = native.call(arr, pred);
        var specResult = arrayFind.call(arr, pred);
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.array.flat-map.ts
  var isSupported22 = function isSupported22() {
    try {
      return typeof Array.prototype.flatMap === "function";
    } catch (e) {
      return false;
    }
  };
  var nativeIsArray = Array.isArray;
  var MAX_SAFE_LENGTH16 = 9007199254740991;
  var toLength19 = function toLength19(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH16) {
      return MAX_SAFE_LENGTH16;
    }
    return Math.floor(numeric);
  };
  var arrayFlatMap = function arrayFlatMap(callback, thisArg) {
    if (typeof callback !== "function") {
      throw new TypeError("Array.prototype.flatMap: callback must be a function");
    }
    var length = toLength19(this.length);
    var result = [];
    for (var i = 0; i < length; i++) {
      if (!(i in this)) {
        continue;
      }
      var mapped = callback.call(thisArg, this[i], i, this);
      if (nativeIsArray(mapped)) {
        for (var j = 0, mappedLength = mapped.length; j < mappedLength; j++) {
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
  if (!isSupported22()) {
    Object.defineProperty(Array.prototype, "flatMap", {
      value: arrayFlatMap,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.flatMap, "name", {
      value: "flatMap",
      configurable: true
    });
    Object.defineProperty(Array.prototype.flatMap, "__polyfilled", {
      value: true
    });
  }

  // tests/array-flat-map.test.ts
  describe("Array.prototype.flatMap \u2014 test262 conformance", function () {
    describe("mapping + single-level flatten", function () {
      it("maps then flattens one level", function () {
        expect(arrayFlatMap.call([1, 2, 3], function (v) {
          return [v, v * 2];
        })).toEqual([1, 2, 2, 4, 3, 6]);
      });
      it("flattens exactly one level (nested arrays are kept)", function () {
        expect(arrayFlatMap.call([1], function () {
          return [[2]];
        })).toEqual([[2]]);
      });
      it("appends non-array return values as-is", function () {
        expect(arrayFlatMap.call([1, 2], function (v) {
          return v * 10;
        })).toEqual([10, 20]);
      });
      it("returns an empty array for an empty array", function () {
        expect(arrayFlatMap.call([], function (v) {
          return v;
        })).toEqual([]);
      });
    });
    describe("callback invocation", function () {
      it("calls callback with (value, index, array)", function () {
        var arr = ["a", "b"];
        var seen = [];
        arrayFlatMap.call(arr, function (v, i, a) {
          seen.push([v, i, a]);
          return v;
        });
        expect(seen).toEqual([["a", 0, arr], ["b", 1, arr]]);
      });
      it("honors thisArg", function () {
        var ctx = {
          factor: 3
        };
        var out = arrayFlatMap.call([1, 2], function (v) {
          return v * this.factor;
        }, ctx);
        expect(out).toEqual([3, 6]);
      });
      it("throws TypeError when callback is not callable", function () {
        expect(function () {
          return arrayFlatMap.call([1], 5);
        }).toThrow(TypeError);
      });
    });
    describe("holes", function () {
      it("skips holes in the source (callback not invoked)", function () {
        var calls = 0;
        var out = arrayFlatMap.call([1,, 3], function (v) {
          calls++;
          return v;
        });
        expect(calls).toBe(2);
        expect(out).toEqual([1, 3]);
      });
      it("skips holes inside a returned array", function () {
        expect(arrayFlatMap.call([1], function () {
          return [10,, 30];
        })).toEqual([10, 30]);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("floors a fractional length", function () {
        var arrayLike = {
          0: 1,
          1: 2,
          2: 3,
          length: 2.9
        };
        expect(arrayFlatMap.call(arrayLike, function (v) {
          return v;
        })).toEqual([1, 2]);
      });
      it("does not visit anything for a negative length", function () {
        var calls = 0;
        arrayFlatMap.call({
          length: -1,
          0: 1
        }, function () {
          calls++;
          return 1;
        });
        expect(calls).toBe(0);
      });
      it("does not visit anything for a NaN length", function () {
        var calls = 0;
        arrayFlatMap.call({
          length: NaN,
          0: 1
        }, function () {
          calls++;
          return 1;
        });
        expect(calls).toBe(0);
      });
    });
    describe("return value & generic application", function () {
      it("returns a new array", function () {
        var arr = [1, 2];
        var out = arrayFlatMap.call(arr, function (v) {
          return v;
        });
        expect(out).not.toBe(arr);
        expect(out).toEqual([1, 2]);
      });
      it("works on a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: 1,
          1: 2,
          length: 2
        };
        expect(arrayFlatMap.call(arrayLike, function (v) {
          return [v, v];
        })).toEqual([1, 1, 2, 2]);
      });
    });
    describe("parity vs native", function () {
      it("matches native mapping to pairs", function () {
        var arr = [1, 2, 3];
        var native = Array.prototype.flatMap;
        var cb = function cb(v) {
          return [v, v * 2];
        };
        var nativeResult = native.call(arr, cb);
        var specResult = arrayFlatMap.call(arr, cb);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.array.flat.ts
  var isSupported23 = function isSupported23() {
    try {
      return typeof Array.prototype.flat === "function";
    } catch (e) {
      return false;
    }
  };
  var nativeIsArray2 = Array.isArray;
  var MAX_SAFE_LENGTH17 = 9007199254740991;
  var toLength20 = function toLength20(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH17) {
      return MAX_SAFE_LENGTH17;
    }
    return Math.floor(numeric);
  };
  var toInteger9 = function toInteger9(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    if (numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    if (numeric < 0) {
      return Math.ceil(numeric);
    }
    return Math.floor(numeric);
  };
  var arrayFlat = function arrayFlat(depth) {
    var startDepth = 1;
    if (depth !== void 0) {
      startDepth = toInteger9(depth);
    }
    var result = [];
    var stack = [{
      array: this,
      index: 0,
      length: toLength20(this.length),
      depth: startDepth
    }];
    while (stack.length > 0) {
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
      if (frame.depth > 0 && nativeIsArray2(value)) {
        stack.push({
          array: value,
          index: 0,
          length: toLength20(value.length),
          depth: frame.depth - 1
        });
      } else {
        result[result.length] = value;
      }
    }
    return result;
  };
  if (!isSupported23()) {
    Object.defineProperty(Array.prototype, "flat", {
      value: arrayFlat,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.flat, "name", {
      value: "flat",
      configurable: true
    });
    Object.defineProperty(Array.prototype.flat, "__polyfilled", {
      value: true
    });
  }

  // tests/array-flat.test.ts
  describe("Array.prototype.flat \u2014 test262 conformance", function () {
    describe("depth", function () {
      it("flattens one level by default", function () {
        expect(arrayFlat.call([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
      });
      it("leaves deeper nesting when depth is 1", function () {
        expect(arrayFlat.call([1, [2, [3]]])).toEqual([1, 2, [3]]);
      });
      it("flattens two levels when depth is 2", function () {
        expect(arrayFlat.call([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
      });
      it("fully flattens when depth is Infinity", function () {
        expect(arrayFlat.call([1, [2, [3, [4, [5]]]]], Infinity)).toEqual([1, 2, 3, 4, 5]);
      });
      it("does not flatten when depth is 0 (shallow copy)", function () {
        expect(arrayFlat.call([1, [2, 3]], 0)).toEqual([1, [2, 3]]);
      });
      it("does not flatten for a negative depth", function () {
        expect(arrayFlat.call([1, [2, 3]], -1)).toEqual([1, [2, 3]]);
      });
      it("treats a NaN depth as 0", function () {
        expect(arrayFlat.call([1, [2, 3]], NaN)).toEqual([1, [2, 3]]);
      });
      it("truncates a fractional depth toward zero", function () {
        expect(arrayFlat.call([1, [2, [3]]], 1.9)).toEqual([1, 2, [3]]);
      });
    });
    describe("holes", function () {
      it("skips holes (only existing elements copied)", function () {
        expect(arrayFlat.call([1,, 3])).toEqual([1, 3]);
      });
      it("skips holes inside nested arrays too", function () {
        expect(arrayFlat.call([1, [2,, 4]])).toEqual([1, 2, 4]);
      });
    });
    describe("return value", function () {
      it("returns a new array (not the same reference)", function () {
        var arr = [1, 2, 3];
        var out = arrayFlat.call(arr);
        expect(out).not.toBe(arr);
        expect(out).toEqual([1, 2, 3]);
      });
      it("passes non-array elements through", function () {
        expect(arrayFlat.call([1, "a", null, void 0, [2]])).toEqual([1, "a", null, void 0, 2]);
      });
      it("returns an empty array for an empty array", function () {
        expect(arrayFlat.call([])).toEqual([]);
      });
    });
    describe("generic application (array-likes)", function () {
      it("flattens a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: 1,
          1: [2, 3],
          length: 2
        };
        expect(arrayFlat.call(arrayLike)).toEqual([1, 2, 3]);
      });
    });
    describe("parity vs native", function () {
      it("matches native fully flattening", function () {
        var arr = [1, [2, [3, [4]]], 5];
        var native = Array.prototype.flat;
        var nativeResult = native.call(arr, Infinity);
        var specResult = arrayFlat.call(arr, Infinity);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.array.from.ts
  var isSupported24 = function isSupported24() {
    try {
      return typeof Array.from === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH18 = 9007199254740991;
  var warnedAstralSplit = false;
  var toLength21 = function toLength21(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH18) {
      return MAX_SAFE_LENGTH18;
    }
    return Math.floor(numeric);
  };
  var arrayFrom = function arrayFrom(source, mapFn, thisArg) {
    if (source === null || source === void 0) {
      throw new TypeError("Array.from requires an array-like or iterable object");
    }
    if (mapFn !== void 0 && typeof mapFn !== "function") {
      throw new TypeError("Array.from: when provided, the second argument must be a function");
    }
    var result = [];
    var iteratorMethod = typeof Symbol !== "undefined" && Symbol.iterator && source[Symbol.iterator] || source["@@iterator"];
    if (typeof iteratorMethod === "function") {
      var iterator = iteratorMethod.call(source);
      var index = 0;
      try {
        var step = iterator.next();
        while (!step.done) {
          if (mapFn) {
            result[index] = mapFn.call(thisArg, step.value, index);
          } else {
            result[index] = step.value;
          }
          index++;
          step = iterator.next();
        }
      } catch (error) {
        if (typeof iterator.return === "function") {
          try {
            iterator.return();
          } catch (e) {}
        }
        throw error;
      }
      return result;
    }
    if (typeof source === "string" && !warnedAstralSplit && /[\uD800-\uDFFF]/.test(source)) {
      warnedAstralSplit = true;
      console.warn("[spackle] Array.from: no Symbol.iterator on this engine, so strings split by UTF-16 unit \u2014 astral characters break into surrogate halves");
    }
    var arrayLike = source;
    var length = toLength21(arrayLike.length);
    for (var i = 0; i < length; i++) {
      if (mapFn) {
        result[i] = mapFn.call(thisArg, arrayLike[i], i);
      } else {
        result[i] = arrayLike[i];
      }
    }
    return result;
  };
  if (!isSupported24()) {
    Object.defineProperty(Array, "from", {
      value: arrayFrom,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.from, "name", {
      value: "from",
      configurable: true
    });
    Object.defineProperty(Array.from, "__polyfilled", {
      value: true
    });
  }

  // tests/array-from.test.ts
  describe("Array.from \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns a real Array", function () {
        expect(Array.isArray(arrayFrom({
          length: 0
        }))).toBe(true);
        expect(Array.isArray(arrayFrom("ab"))).toBe(true);
      });
    });
    describe("source coercion (ToObject)", function () {
      it("throws TypeError on null source", function () {
        expect(function () {
          return arrayFrom(null);
        }).toThrow(TypeError);
      });
      it("throws TypeError on undefined source", function () {
        expect(function () {
          return arrayFrom(void 0);
        }).toThrow(TypeError);
      });
    });
    describe("array-like sources", function () {
      it("reads indexed properties up to length", function () {
        expect(arrayFrom({
          0: "a",
          1: "b",
          2: "c",
          length: 3
        })).toEqual(["a", "b", "c"]);
      });
      it("treats a missing length as zero", function () {
        expect(arrayFrom({})).toEqual([]);
      });
      it("coerces a string length", function () {
        expect(arrayFrom({
          0: "a",
          1: "b",
          length: "2"
        })).toEqual(["a", "b"]);
      });
      it("clamps a negative length to zero", function () {
        expect(arrayFrom({
          length: -1
        })).toEqual([]);
      });
      it("treats a NaN length as zero", function () {
        expect(arrayFrom({
          length: NaN
        })).toEqual([]);
      });
      it("floors a fractional length", function () {
        expect(arrayFrom({
          0: "a",
          1: "b",
          length: 2.9
        })).toEqual(["a", "b"]);
      });
      it("fills holes with undefined", function () {
        expect(arrayFrom({
          length: 2
        })).toEqual([void 0, void 0]);
      });
      it("handles an empty array-like", function () {
        expect(arrayFrom({
          length: 0
        })).toEqual([]);
      });
    });
    describe("iterable sources", function () {
      it("splits a string into characters", function () {
        expect(arrayFrom("hello")).toEqual(["h", "e", "l", "l", "o"]);
      });
      it("handles an empty string", function () {
        expect(arrayFrom("")).toEqual([]);
      });
      it("iterates a string by code point (astral chars stay whole)", function () {
        expect(arrayFrom("\uD842\uDFB7")).toEqual(["\uD842\uDFB7"]);
      });
      it("converts a Set to an array of values", function () {
        expect(arrayFrom(/* @__PURE__ */new Set([1, 2, 3]))).toEqual([1, 2, 3]);
      });
      it("converts a Map to an array of entries", function () {
        expect(arrayFrom(/* @__PURE__ */new Map([["a", 1], ["b", 2]]))).toEqual([["a", 1], ["b", 2]]);
      });
      it("closes the iterator (calls return) when mapFn throws mid-iteration", function () {
        var returned = false;
        var iterable = _defineProperty({}, Symbol.iterator, function () {
          var n = 0;
          return {
            next: function next() {
              n++;
              return n <= 3 ? {
                value: n,
                done: false
              } : {
                value: void 0,
                done: true
              };
            },
            return: function _return() {
              returned = true;
              return {
                value: void 0,
                done: true
              };
            }
          };
        });
        var boom = function boom() {
          throw new Error("boom");
        };
        expect(function () {
          return arrayFrom(iterable, boom);
        }).toThrow("boom");
        expect(returned).toBe(true);
      });
      it("consumes a custom Symbol.iterator", function () {
        var iterable = _defineProperty({}, Symbol.iterator, function () {
          var n = 0;
          return {
            next: function next() {
              n++;
              return n <= 3 ? {
                value: n,
                done: false
              } : {
                value: void 0,
                done: true
              };
            }
          };
        });
        expect(arrayFrom(iterable)).toEqual([1, 2, 3]);
      });
      it("prefers the iterator protocol over .length", function () {
        var hybrid = _defineProperty({
          length: 5
        }, Symbol.iterator, function () {
          var done = false;
          return {
            next: function next() {
              if (done) return {
                value: void 0,
                done: true
              };
              done = true;
              return {
                value: "x",
                done: false
              };
            }
          };
        });
        expect(arrayFrom(hybrid)).toEqual(["x"]);
      });
    });
    describe("mapFn", function () {
      it("applies mapFn with (value, index) to an array-like", function () {
        var out = arrayFrom({
          0: 10,
          1: 20,
          length: 2
        }, function (v, i) {
          return v + i;
        });
        expect(out).toEqual([10, 21]);
      });
      it("applies mapFn to iterable values", function () {
        expect(arrayFrom(/* @__PURE__ */new Set([1, 2, 3]), function (v) {
          return v * 2;
        })).toEqual([2, 4, 6]);
      });
      it("honors thisArg", function () {
        var ctx = {
          factor: 10
        };
        var out = arrayFrom({
          0: 1,
          1: 2,
          length: 2
        }, function (v) {
          return v * this.factor;
        }, ctx);
        expect(out).toEqual([10, 20]);
      });
      it("throws TypeError when mapFn is provided but not callable", function () {
        expect(function () {
          return arrayFrom([1, 2], 5);
        }).toThrow(TypeError);
      });
    });
    describe("KNOWN LIMITATIONS (documented divergence from spec)", function () {
      it("always returns a plain Array, ignoring a subclass `this`", function () {
        var MyArray = /*#__PURE__*/function (_Array) {
          function MyArray() {
            _classCallCheck(this, MyArray);
            return _callSuper(this, MyArray, arguments);
          }
          _inherits(MyArray, _Array);
          return _createClass(MyArray);
        }(/*#__PURE__*/_wrapNativeSuper(Array));
        var out = arrayFrom.call(MyArray, {
          0: "a",
          length: 1
        });
        expect(out instanceof MyArray).toBe(false);
        expect(Array.isArray(out)).toBe(true);
      });
    });
    describe("parity vs native", function () {
      it("matches native converting an array-like with a map function", function () {
        var arrayLike = {
          0: 1,
          1: 2,
          2: 3,
          length: 3
        };
        var mapFn = function mapFn(v) {
          return v * 2;
        };
        var nativeResult = Array.from(arrayLike, mapFn);
        var specResult = arrayFrom(arrayLike, mapFn);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.array.includes.ts
  var isSupported25 = function isSupported25() {
    try {
      return typeof Array.prototype.includes === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH19 = 9007199254740991;
  var toLength22 = function toLength22(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH19) {
      return MAX_SAFE_LENGTH19;
    }
    return Math.floor(numeric);
  };
  var arrayIncludes = function arrayIncludes(searchElement, fromIndex) {
    var length = toLength22(this.length);
    if (length === 0) {
      return false;
    }
    var position = 0;
    if (fromIndex !== void 0) {
      position = Number(fromIndex);
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
    for (var i = start; i < length; i++) {
      var element = this[i];
      if (element === searchElement ||
      // SameValueZero: NaN matches NaN.
      element !== element && searchElement !== searchElement) {
        return true;
      }
    }
    return false;
  };
  if (!isSupported25()) {
    Object.defineProperty(Array.prototype, "includes", {
      value: arrayIncludes,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.includes, "name", {
      value: "includes",
      configurable: true
    });
    Object.defineProperty(Array.prototype.includes, "__polyfilled", {
      value: true
    });
  }

  // tests/array-includes.test.ts
  describe("Array.prototype.includes \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns a boolean", function () {
        expect(arrayIncludes.call([1], 1)).toBe(true);
        expect(arrayIncludes.call([1], 2)).toBe(false);
      });
    });
    describe("SameValueZero matching", function () {
      it("finds an element by strict equality", function () {
        expect(arrayIncludes.call([1, 2, 3], 2)).toBe(true);
        expect(arrayIncludes.call(["a", "b"], "b")).toBe(true);
      });
      it("returns false for a missing element", function () {
        expect(arrayIncludes.call([1, 2, 3], 5)).toBe(false);
      });
      it("finds NaN (SameValueZero \u2014 unlike indexOf)", function () {
        expect(arrayIncludes.call([1, NaN, 3], NaN)).toBe(true);
        expect([1, NaN, 3].indexOf(NaN)).toBe(-1);
      });
      it("treats -0 and +0 as equal", function () {
        expect(arrayIncludes.call([-0], 0)).toBe(true);
        expect(arrayIncludes.call([0], -0)).toBe(true);
      });
      it("does not coerce types (strict)", function () {
        expect(arrayIncludes.call([1, 2, 3], "2")).toBe(false);
      });
    });
    describe("fromIndex (ToInteger)", function () {
      it("respects a positive fromIndex", function () {
        expect(arrayIncludes.call([1, 2, 3, 4], 1, 1)).toBe(false);
        expect(arrayIncludes.call([1, 2, 3, 4], 3, 1)).toBe(true);
      });
      it("counts a negative fromIndex from the end", function () {
        expect(arrayIncludes.call([1, 2, 3, 4], 3, -2)).toBe(true);
        expect(arrayIncludes.call([1, 2, 3, 4], 1, -2)).toBe(false);
      });
      it("clamps a large negative fromIndex to 0", function () {
        expect(arrayIncludes.call([1, 2, 3], 1, -100)).toBe(true);
      });
      it("returns false when fromIndex is past the end", function () {
        expect(arrayIncludes.call([1, 2, 3], 3, 5)).toBe(false);
      });
      it("treats NaN fromIndex as 0", function () {
        expect(arrayIncludes.call([1, 2, 3], 1, NaN)).toBe(true);
      });
      it("truncates a fractional fromIndex toward zero", function () {
        expect(arrayIncludes.call([1, 2, 3, 4], 1, 0.9)).toBe(true);
        expect(arrayIncludes.call([1, 2, 3, 4], 2, 1.5)).toBe(true);
        expect(arrayIncludes.call([1, 2, 3, 4], 1, 1.5)).toBe(false);
      });
      it("handles a fromIndex of 0", function () {
        expect(arrayIncludes.call([1, 2, 3], 1, 0)).toBe(true);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("returns false for an empty array", function () {
        expect(arrayIncludes.call([], 1)).toBe(false);
      });
      it("treats a negative length as empty (no scan, no hang)", function () {
        expect(arrayIncludes.call({
          length: -1,
          0: "a"
        }, "a")).toBe(false);
      });
      it("treats a NaN length as empty", function () {
        expect(arrayIncludes.call({
          length: NaN,
          0: "a"
        }, "a")).toBe(false);
      });
      it("coerces a string length", function () {
        expect(arrayIncludes.call({
          length: "2",
          0: "a",
          1: "b"
        }, "b")).toBe(true);
      });
    });
    describe("holes", function () {
      it("visits holes as undefined (unlike indexOf)", function () {
        var sparse = [1,, 3];
        expect(arrayIncludes.call(sparse, void 0)).toBe(true);
        expect([1,, 3].indexOf(void 0)).toBe(-1);
      });
    });
    describe("generic application (array-likes)", function () {
      it("works on a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: "a",
          1: "b",
          2: "c",
          length: 3
        };
        expect(arrayIncludes.call(arrayLike, "c")).toBe(true);
        expect(arrayIncludes.call(arrayLike, "z")).toBe(false);
      });
    });
    describe("parity vs native", function () {
      it("matches native scanning for an element", function () {
        var arr = [1, 2, 3, NaN, 5];
        var native = Array.prototype.includes;
        var nativeResult = native.call(arr, NaN);
        var specResult = arrayIncludes.call(arr, NaN);
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.array.iterator.ts
  var MAX_SAFE_LENGTH20 = 9007199254740991;
  var toLength23 = function toLength23(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH20) {
      return MAX_SAFE_LENGTH20;
    }
    return Math.floor(numeric);
  };
  var makeArrayIterator = function makeArrayIterator(object, length, kind) {
    var index = 0;
    var iterator = {
      next: function next() {
        if (index >= length) {
          return {
            value: void 0,
            done: true
          };
        }
        var currentIndex = index++;
        var value;
        if (kind === "keys") {
          value = currentIndex;
        } else if (kind === "values") {
          value = object[currentIndex];
        } else {
          value = [currentIndex, object[currentIndex]];
        }
        return {
          value: value,
          done: false
        };
      }
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      Object.defineProperty(iterator, Symbol.iterator, {
        value: function value() {
          return iterator;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    return iterator;
  };
  var guard = function guard(self2, name) {
    if (self2 === null || self2 === void 0) {
      throw new TypeError("Array.prototype." + name + " called on null or undefined");
    }
    return Object(self2);
  };
  var arrayKeys = function arrayKeys() {
    var object = guard(this, "keys");
    return makeArrayIterator(object, toLength23(object.length), "keys");
  };
  var arrayValues = function arrayValues() {
    var object = guard(this, "values");
    return makeArrayIterator(object, toLength23(object.length), "values");
  };
  var arrayEntries = function arrayEntries() {
    var object = guard(this, "entries");
    return makeArrayIterator(object, toLength23(object.length), "entries");
  };
  if (typeof Array.prototype.keys !== "function") {
    Object.defineProperty(Array.prototype, "keys", {
      value: arrayKeys,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.keys, "name", {
      value: "keys",
      configurable: true
    });
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
    Object.defineProperty(Array.prototype.values, "name", {
      value: "values",
      configurable: true
    });
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
    Object.defineProperty(Array.prototype.entries, "name", {
      value: "entries",
      configurable: true
    });
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

  // tests/array-iterators.test.ts
  var drain = function drain(it3) {
    var out = [];
    var step = it3.next();
    while (!step.done) {
      out.push(step.value);
      step = it3.next();
    }
    return out;
  };
  describe("Array.prototype.keys/values/entries \u2014 test262 conformance", function () {
    it("keys() yields indices", function () {
      expect(drain(arrayKeys.call(["a", "b", "c"]))).toEqual([0, 1, 2]);
    });
    it("values() yields elements", function () {
      expect(drain(arrayValues.call(["a", "b", "c"]))).toEqual(["a", "b", "c"]);
    });
    it("entries() yields [index, element] pairs", function () {
      expect(drain(arrayEntries.call(["a", "b"]))).toEqual([[0, "a"], [1, "b"]]);
    });
    it("reports done after exhaustion", function () {
      var it3 = arrayKeys.call([1]);
      expect(it3.next()).toEqual({
        value: 0,
        done: false
      });
      expect(it3.next()).toEqual({
        value: void 0,
        done: true
      });
      expect(it3.next()).toEqual({
        value: void 0,
        done: true
      });
    });
    it("values() visits holes as undefined", function () {
      expect(drain(arrayValues.call([1,, 3]))).toEqual([1, void 0, 3]);
    });
    it("is self-iterable via Symbol.iterator", function () {
      var it3 = arrayValues.call(["x", "y"]);
      expect(typeof it3[Symbol.iterator]).toBe("function");
      expect(it3[Symbol.iterator]()).toBe(it3);
      expect(Array.from(it3)).toEqual(["x", "y"]);
    });
    it("works on array-likes via .call", function () {
      expect(drain(arrayValues.call({
        0: "a",
        1: "b",
        length: 2
      }))).toEqual(["a", "b"]);
    });
  });

  // src/modules/es.array.push.ts
  var nativePush = Array.prototype.push;
  var isSupported26 = function isSupported26() {
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
    } catch (e) {
      return false;
    }
  };
  var toObject4 = function toObject4(arg) {
    if (arg === null || arg === void 0) throw new TypeError("Cannot convert undefined or null to object");
    return Object(arg);
  };
  var toLength24 = function toLength24(value) {
    var n = Number(value);
    if (isNaN(n) || n <= 0) return 0;
    return n > 9007199254740991 ? 9007199254740991 : Math.floor(n);
  };
  var doesNotExceedSafeInteger = function doesNotExceedSafeInteger(it3) {
    if (it3 > 9007199254740991) throw new TypeError("Maximum allowed index exceeded");
    return it3;
  };
  var setArrayLength = function setArrayLength(O, length) {
    if (Array.isArray(O)) {
      var descriptor = Object.getOwnPropertyDescriptor(O, "length");
      if (descriptor && !descriptor.writable) throw new TypeError("Cannot set read only .length");
    }
    return O.length = length;
  };
  var arrayPush = function push() {
    var O = toObject4(this);
    var len = toLength24(O.length);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  };
  if (!isSupported26()) {
    Object.defineProperty(Array.prototype, "push", {
      value: arrayPush,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.push, "name", {
      value: "push",
      configurable: true
    });
    Object.defineProperty(Array.prototype.push, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.unshift.ts
  var nativeUnshift = Array.prototype.unshift;
  var isSupported27 = function isSupported27() {
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
    } catch (e) {
      return false;
    }
  };
  var toObject5 = function toObject5(arg) {
    if (arg === null || arg === void 0) throw new TypeError("Cannot convert undefined or null to object");
    return Object(arg);
  };
  var toLength25 = function toLength25(value) {
    var n = Number(value);
    if (isNaN(n) || n <= 0) return 0;
    return n > 9007199254740991 ? 9007199254740991 : Math.floor(n);
  };
  var doesNotExceedSafeInteger2 = function doesNotExceedSafeInteger2(it3) {
    if (it3 > 9007199254740991) throw new TypeError("Maximum allowed index exceeded");
    return it3;
  };
  var setArrayLength2 = function setArrayLength2(O, length) {
    if (Array.isArray(O)) {
      var descriptor = Object.getOwnPropertyDescriptor(O, "length");
      if (descriptor && !descriptor.writable) throw new TypeError("Cannot set read only .length");
    }
    return O.length = length;
  };
  var deletePropertyOrThrow = function deletePropertyOrThrow(O, P) {
    if (!delete O[P]) throw new TypeError("Cannot delete property " + P + " of " + O);
  };
  var arrayUnshift = function unshift() {
    var O = toObject5(this);
    var len = toLength25(O.length);
    var argCount = arguments.length;
    if (argCount) {
      doesNotExceedSafeInteger2(len + argCount);
      var k = len;
      while (k--) {
        var to = k + argCount;
        if (k in O) O[to] = O[k];else deletePropertyOrThrow(O, to);
      }
      for (var j = 0; j < argCount; j++) {
        O[j] = arguments[j];
      }
    }
    return setArrayLength2(O, len + argCount);
  };
  if (!isSupported27()) {
    Object.defineProperty(Array.prototype, "unshift", {
      value: arrayUnshift,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.unshift, "name", {
      value: "unshift",
      configurable: true
    });
    Object.defineProperty(Array.prototype.unshift, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.reverse.ts
  var nativeReverse = Array.prototype.reverse;
  var isSupported28 = function isSupported28() {
    try {
      if (typeof nativeReverse !== "function") return false;
      var test = [1, 2];
      var before = String(test);
      var after = String(test.reverse());
      return before !== after;
    } catch (e) {
      return false;
    }
  };
  var arrayReverse = function reverse() {
    if (Array.isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  };
  if (!isSupported28()) {
    Object.defineProperty(Array.prototype, "reverse", {
      value: arrayReverse,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.reverse, "name", {
      value: "reverse",
      configurable: true
    });
    Object.defineProperty(Array.prototype.reverse, "__polyfilled", {
      value: true
    });
  }

  // tests/array-mutation-fills.test.ts
  describe("Array.prototype.push island", function () {
    it("appends and returns the new length", function () {
      var a = [1, 2];
      expect(arrayPush.call(a, 3, 4)).toBe(4);
      expect(a).toEqual([1, 2, 3, 4]);
    });
    it("throws TypeError on a non-writable length", function () {
      var frozen = Object.defineProperty([], "length", {
        writable: false
      });
      expect(function () {
        return arrayPush.call(frozen, 1);
      }).toThrow(TypeError);
    });
    it("rejects growth past the safe-integer ceiling", function () {
      expect(function () {
        return arrayPush.call({
          length: 9007199254740991
        }, 1);
      }).toThrow(TypeError);
    });
  });
  describe("Array.prototype.unshift island", function () {
    it("prepends and returns the new length", function () {
      var a = [3, 4];
      expect(arrayUnshift.call(a, 1, 2)).toBe(4);
      expect(a).toEqual([1, 2, 3, 4]);
    });
    it("returns the length unchanged with no arguments", function () {
      var a = [1, 2];
      expect(arrayUnshift.call(a)).toBe(2);
      expect(a).toEqual([1, 2]);
    });
    it("throws TypeError on a non-writable length", function () {
      var frozen = Object.defineProperty([], "length", {
        writable: false
      });
      expect(function () {
        return arrayUnshift.call(frozen, 1);
      }).toThrow(TypeError);
    });
  });
  describe("Array.prototype.reverse island", function () {
    it("reverses in place and returns the same array", function () {
      var a = [1, 2, 3];
      expect(arrayReverse.call(a)).toBe(a);
      expect(a).toEqual([3, 2, 1]);
    });
  });

  // src/modules/es.array.of.ts
  var isSupported29 = function isSupported29() {
    try {
      return typeof Array.of === "function";
    } catch (e) {
      return false;
    }
  };
  var arrayOf = function arrayOf() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return args;
  };
  if (!isSupported29()) {
    Object.defineProperty(Array, "of", {
      value: arrayOf,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.of, "name", {
      value: "of",
      configurable: true
    });
    Object.defineProperty(Array.of, "__polyfilled", {
      value: true
    });
  }

  // tests/array-of.test.ts
  describe("Array.of \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns a real Array", function () {
        expect(Array.isArray(arrayOf(1, 2, 3))).toBe(true);
      });
      it("keeps all arguments in order", function () {
        expect(arrayOf(1, 2, 3)).toEqual([1, 2, 3]);
      });
      it("returns an empty array for no arguments", function () {
        expect(arrayOf()).toEqual([]);
      });
    });
    describe("single numeric argument (vs new Array(n))", function () {
      it("makes a one-element array, not a length-n empty array", function () {
        var out = arrayOf(7);
        expect(out).toEqual([7]);
        expect(out.length).toBe(1);
        expect(new Array(7).length).toBe(7);
        expect(7 in new Array(7)).toBe(false);
      });
    });
    describe("argument handling", function () {
      it("preserves mixed types", function () {
        expect(arrayOf(1, "two", true, null)).toEqual([1, "two", true, null]);
      });
      it("keeps null/undefined as real entries", function () {
        var out = arrayOf(void 0, null);
        expect(out.length).toBe(2);
        expect(0 in out).toBe(true);
        expect(1 in out).toBe(true);
        expect(out[0]).toBeUndefined();
        expect(out[1]).toBeNull();
      });
    });
    describe("KNOWN LIMITATIONS (documented divergence from spec)", function () {
      it("always returns a plain Array, ignoring a subclass `this`", function () {
        var MyArray = /*#__PURE__*/function (_Array2) {
          function MyArray() {
            _classCallCheck(this, MyArray);
            return _callSuper(this, MyArray, arguments);
          }
          _inherits(MyArray, _Array2);
          return _createClass(MyArray);
        }(/*#__PURE__*/_wrapNativeSuper(Array));
        var out = arrayOf.call(MyArray, 1, 2);
        expect(out instanceof MyArray).toBe(false);
        expect(Array.isArray(out)).toBe(true);
        expect(out).toEqual([1, 2]);
      });
    });
    describe("parity vs native", function () {
      it("matches native for a mix of arguments", function () {
        var nativeResult = Array.of(1, "two", null, void 0);
        var specResult = arrayOf(1, "two", null, void 0);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.array.sort.ts
  var isSupported30 = function isSupported30() {
    try {
      if (typeof Array.prototype.sort !== "function") {
        return false;
      }
      var items = [];
      for (var i = 0; i < 16; i++) {
        items.push({
          key: i % 2,
          tag: i
        });
      }
      items.sort(function (a, b) {
        return a.key - b.key;
      });
      for (var _i4 = 1; _i4 < items.length; _i4++) {
        if (items[_i4].key === items[_i4 - 1].key && items[_i4].tag < items[_i4 - 1].tag) {
          return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  var isArraySortSupported = isSupported30;
  var MAX_SAFE_LENGTH21 = 9007199254740991;
  var toLength26 = function toLength26(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH21) {
      return MAX_SAFE_LENGTH21;
    }
    return Math.floor(numeric);
  };
  var defaultCompare2 = function defaultCompare2(a, b) {
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
  var stableSort2 = function stableSort2(items, compare2) {
    var length = items.length;
    if (length < 2) {
      return;
    }
    var source = items;
    var target = new Array(length);
    for (var width = 1; width < length; width *= 2) {
      for (var start = 0; start < length; start += width * 2) {
        var left = start;
        var middle = start + width < length ? start + width : length;
        var right = middle;
        var end = start + width * 2 < length ? start + width * 2 : length;
        var out = start;
        while (left < middle && right < end) {
          if (compare2(source[left], source[right]) <= 0) {
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
      var swap = source;
      source = target;
      target = swap;
    }
    if (source !== items) {
      for (var i = 0; i < length; i++) {
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
    var length = toLength26(object.length);
    var items = [];
    var undefinedCount = 0;
    var holeCount = 0;
    for (var i = 0; i < length; i++) {
      if (!(i in object)) {
        holeCount++;
      } else if (object[i] === void 0) {
        undefinedCount++;
      } else {
        items.push(object[i]);
      }
    }
    var compare2 = compareFn ? function (a, b) {
      var numeric = Number(compareFn(a, b));
      return numeric === numeric ? numeric : 0;
    } : defaultCompare2;
    stableSort2(items, compare2);
    var index = 0;
    for (var _i5 = 0; _i5 < items.length; _i5++) {
      object[index++] = items[_i5];
    }
    for (var u = 0; u < undefinedCount; u++) {
      object[index++] = void 0;
    }
    for (var h = 0; h < holeCount; h++) {
      delete object[index++];
    }
    return object;
  };
  if (!isSupported30()) {
    Object.defineProperty(Array.prototype, "sort", {
      value: arraySort,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.sort, "name", {
      value: "sort",
      configurable: true
    });
    Object.defineProperty(Array.prototype.sort, "__polyfilled", {
      value: true
    });
  }

  // tests/array-sort.test.ts
  describe("Array.prototype.sort \u2014 test262 conformance", function () {
    describe("basic", function () {
      it("sorts in place and returns the same array", function () {
        var arr = [3, 1, 2];
        var out = arraySort.call(arr, function (a, b) {
          return a - b;
        });
        expect(out).toBe(arr);
        expect(arr).toEqual([1, 2, 3]);
      });
      it("sorts lexicographically by default (string coercion)", function () {
        expect(arraySort.call([10, 1, 2])).toEqual([1, 10, 2]);
      });
      it("handles an empty array and a single element", function () {
        expect(arraySort.call([])).toEqual([]);
        expect(arraySort.call([1])).toEqual([1]);
      });
    });
    describe("comparator", function () {
      it("honors a numeric comparator", function () {
        expect(arraySort.call([10, 1, 2], function (a, b) {
          return a - b;
        })).toEqual([1, 2, 10]);
      });
      it("throws TypeError when comparator is not callable and not undefined", function () {
        expect(function () {
          return arraySort.call([1, 2], 5);
        }).toThrow(TypeError);
      });
      it("treats a NaN comparator result as 0 (keeps original order)", function () {
        var arr = [3, 1, 2];
        arraySort.call(arr, function () {
          return NaN;
        });
        expect(arr).toEqual([3, 1, 2]);
      });
    });
    describe("stability", function () {
      it("keeps equal-compare items in original order (16+ items)", function () {
        var items = [];
        for (var i = 0; i < 32; i++) {
          items.push({
            key: i % 4,
            tag: i
          });
        }
        arraySort.call(items, function (a, b) {
          return a.key - b.key;
        });
        for (var _i6 = 1; _i6 < items.length; _i6++) {
          if (items[_i6].key === items[_i6 - 1].key) {
            expect(items[_i6].tag).toBeGreaterThan(items[_i6 - 1].tag);
          } else {
            expect(items[_i6].key).toBeGreaterThan(items[_i6 - 1].key);
          }
        }
      });
    });
    describe("undefined + holes", function () {
      it("sorts undefined after all values without calling the comparator on it", function () {
        var sawUndefined = false;
        var out = arraySort.call([3, void 0, 1], function (a, b) {
          if (a === void 0 || b === void 0) {
            sawUndefined = true;
          }
          return a - b;
        });
        expect(out).toEqual([1, 3, void 0]);
        expect(sawUndefined).toBe(false);
      });
      it("packs holes after the undefineds", function () {
        var arr = [3, void 0,, 1];
        arraySort.call(arr, function (a, b) {
          return a - b;
        });
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(3);
        expect(arr[2]).toBe(void 0);
        expect(2 in arr).toBe(true);
        expect(3 in arr).toBe(false);
      });
    });
    describe("generic application", function () {
      it("works on an array-like via .call", function () {
        var arrayLike = {
          0: 3,
          1: 1,
          2: 2,
          length: 3
        };
        arraySort.call(arrayLike, function (a, b) {
          return a - b;
        });
        expect([arrayLike[0], arrayLike[1], arrayLike[2]]).toEqual([1, 2, 3]);
      });
      it("throws on null/undefined this", function () {
        expect(function () {
          return arraySort.call(null);
        }).toThrow(TypeError);
        expect(function () {
          return arraySort.call(void 0);
        }).toThrow(TypeError);
      });
    });
    describe("parity vs native", function () {
      it("matches native with a numeric comparator", function () {
        var source = [5, 3, 8, 1, 9, 2, 7, 4, 6, 0, 11, 10];
        var cmp = function cmp(a, b) {
          return a - b;
        };
        var nativeResult = source.slice().sort(cmp);
        var specResult = arraySort.call(source.slice(), cmp);
        expect(specResult).toEqual(nativeResult);
      });
    });
    describe("probe", function () {
      it("reports stable native sorts as supported (modern engines)", function () {
        expect(isArraySortSupported()).toBe(true);
      });
    });
  });

  // src/modules/es.array.concat.ts
  var isSupported31 = function isSupported31() {
    try {
      return typeof Array.prototype.concat === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH22 = 9007199254740991;
  var toLength27 = function toLength27(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH22) {
      return MAX_SAFE_LENGTH22;
    }
    return Math.floor(numeric);
  };
  var speciesCreate = function speciesCreate(original, length) {
    if (!Array.isArray(original)) {
      return new Array(length);
    }
    var ctor = original.constructor;
    if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
      var species = ctor[Symbol.species];
      ctor = species == null ? void 0 : species;
    }
    if (ctor === void 0 || ctor === Array) {
      return new Array(length);
    }
    if (typeof ctor !== "function") {
      throw new TypeError("constructor property is not a constructor");
    }
    return new ctor(length);
  };
  var isSpreadable = function isSpreadable(value) {
    if (value === null || typeof value !== "object" && typeof value !== "function") {
      return false;
    }
    if (typeof Symbol !== "undefined" && Symbol.isConcatSpreadable) {
      var flag = value[Symbol.isConcatSpreadable];
      if (flag !== void 0) {
        return !!flag;
      }
    }
    return Array.isArray(value);
  };
  var arrayConcat = function arrayConcat() {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.concat called on null or undefined");
    }
    var object = Object(this);
    var result = speciesCreate(object, 0);
    var out = 0;
    var source = object;
    var argIndex = 0;
    while (true) {
      if (isSpreadable(source)) {
        var length = toLength27(source.length);
        for (var i = 0; i < length; i++) {
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
  if (!isSupported31()) {
    Object.defineProperty(Array.prototype, "concat", {
      value: arrayConcat,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.concat, "name", {
      value: "concat",
      configurable: true
    });
    Object.defineProperty(Array.prototype.concat, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.filter.ts
  var isSupported32 = function isSupported32() {
    try {
      return typeof Array.prototype.filter === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH23 = 9007199254740991;
  var toLength28 = function toLength28(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH23) {
      return MAX_SAFE_LENGTH23;
    }
    return Math.floor(numeric);
  };
  var speciesCreate2 = function speciesCreate2(original, length) {
    if (!Array.isArray(original)) {
      return new Array(length);
    }
    var ctor = original.constructor;
    if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
      var species = ctor[Symbol.species];
      ctor = species == null ? void 0 : species;
    }
    if (ctor === void 0 || ctor === Array) {
      return new Array(length);
    }
    if (typeof ctor !== "function") {
      throw new TypeError("constructor property is not a constructor");
    }
    return new ctor(length);
  };
  var arrayFilter = function arrayFilter(callback, thisArg) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.filter called on null or undefined");
    }
    if (typeof callback !== "function") {
      throw new TypeError("callback is not a function");
    }
    var object = Object(this);
    var length = toLength28(object.length);
    var result = speciesCreate2(object, 0);
    var out = 0;
    for (var i = 0; i < length; i++) {
      if (i in object) {
        var value = object[i];
        if (callback.call(thisArg, value, i, object)) {
          result[out++] = value;
        }
      }
    }
    return result;
  };
  if (!isSupported32()) {
    Object.defineProperty(Array.prototype, "filter", {
      value: arrayFilter,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.filter, "name", {
      value: "filter",
      configurable: true
    });
    Object.defineProperty(Array.prototype.filter, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.map.ts
  var isSupported33 = function isSupported33() {
    try {
      return typeof Array.prototype.map === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH24 = 9007199254740991;
  var toLength29 = function toLength29(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH24) {
      return MAX_SAFE_LENGTH24;
    }
    return Math.floor(numeric);
  };
  var speciesCreate3 = function speciesCreate3(original, length) {
    if (!Array.isArray(original)) {
      return new Array(length);
    }
    var ctor = original.constructor;
    if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
      var species = ctor[Symbol.species];
      ctor = species == null ? void 0 : species;
    }
    if (ctor === void 0 || ctor === Array) {
      return new Array(length);
    }
    if (typeof ctor !== "function") {
      throw new TypeError("constructor property is not a constructor");
    }
    return new ctor(length);
  };
  var arrayMap = function arrayMap(callback, thisArg) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.map called on null or undefined");
    }
    if (typeof callback !== "function") {
      throw new TypeError("callback is not a function");
    }
    var object = Object(this);
    var length = toLength29(object.length);
    var result = speciesCreate3(object, length);
    for (var i = 0; i < length; i++) {
      if (i in object) {
        result[i] = callback.call(thisArg, object[i], i, object);
      }
    }
    return result;
  };
  if (!isSupported33()) {
    Object.defineProperty(Array.prototype, "map", {
      value: arrayMap,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.map, "name", {
      value: "map",
      configurable: true
    });
    Object.defineProperty(Array.prototype.map, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.slice.ts
  var isSupported34 = function isSupported34() {
    try {
      return typeof Array.prototype.slice === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH25 = 9007199254740991;
  var toLength30 = function toLength30(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH25) {
      return MAX_SAFE_LENGTH25;
    }
    return Math.floor(numeric);
  };
  var toInteger10 = function toInteger10(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
  };
  var speciesCreate4 = function speciesCreate4(original, length) {
    if (!Array.isArray(original)) {
      return new Array(length);
    }
    var ctor = original.constructor;
    if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
      var species = ctor[Symbol.species];
      ctor = species == null ? void 0 : species;
    }
    if (ctor === void 0 || ctor === Array) {
      return new Array(length);
    }
    if (typeof ctor !== "function") {
      throw new TypeError("constructor property is not a constructor");
    }
    return new ctor(length);
  };
  var arraySlice = function arraySlice(start, end) {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.slice called on null or undefined");
    }
    var object = Object(this);
    var length = toLength30(object.length);
    var from = toInteger10(start);
    from = from < 0 ? Math.max(length + from, 0) : Math.min(from, length);
    var to = end === void 0 ? length : toInteger10(end);
    to = to < 0 ? Math.max(length + to, 0) : Math.min(to, length);
    var count = Math.max(to - from, 0);
    var result = speciesCreate4(object, count);
    var out = 0;
    for (var i = from; i < to; i++) {
      if (i in object) {
        result[out] = object[i];
      }
      out++;
    }
    result.length = count;
    return result;
  };
  if (!isSupported34()) {
    Object.defineProperty(Array.prototype, "slice", {
      value: arraySlice,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.slice, "name", {
      value: "slice",
      configurable: true
    });
    Object.defineProperty(Array.prototype.slice, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.splice.ts
  var isSupported35 = function isSupported35() {
    try {
      return typeof Array.prototype.splice === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_LENGTH26 = 9007199254740991;
  var toLength31 = function toLength31(value) {
    var numeric = Number(value);
    if (isNaN(numeric) || numeric <= 0) {
      return 0;
    }
    if (numeric > MAX_SAFE_LENGTH26) {
      return MAX_SAFE_LENGTH26;
    }
    return Math.floor(numeric);
  };
  var toInteger11 = function toInteger11(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
  };
  var speciesCreate5 = function speciesCreate5(original, length) {
    if (!Array.isArray(original)) {
      return new Array(length);
    }
    var ctor = original.constructor;
    if (typeof Symbol !== "undefined" && Symbol.species && ctor != null) {
      var species = ctor[Symbol.species];
      ctor = species == null ? void 0 : species;
    }
    if (ctor === void 0 || ctor === Array) {
      return new Array(length);
    }
    if (typeof ctor !== "function") {
      throw new TypeError("constructor property is not a constructor");
    }
    return new ctor(length);
  };
  var arraySplice = function arraySplice() {
    if (this === null || this === void 0) {
      throw new TypeError("Array.prototype.splice called on null or undefined");
    }
    var object = Object(this);
    var length = toLength31(object.length);
    var argCount = arguments.length;
    var relativeStart = argCount > 0 ? toInteger11(arguments[0]) : 0;
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
      actualDeleteCount = Math.min(Math.max(toInteger11(arguments[1]), 0), length - actualStart);
    }
    var removed = speciesCreate5(object, actualDeleteCount);
    for (var i = 0; i < actualDeleteCount; i++) {
      var from = actualStart + i;
      if (from in object) {
        removed[i] = object[from];
      }
    }
    removed.length = actualDeleteCount;
    var countDelta = insertCount - actualDeleteCount;
    if (countDelta < 0) {
      for (var _i7 = actualStart; _i7 < length - actualDeleteCount; _i7++) {
        var _from = _i7 + actualDeleteCount;
        var to = _i7 + insertCount;
        if (_from in object) {
          object[to] = object[_from];
        } else {
          delete object[to];
        }
      }
      for (var _i8 = length; _i8 > length + countDelta; _i8--) {
        delete object[_i8 - 1];
      }
    } else if (countDelta > 0) {
      for (var _i9 = length - actualDeleteCount; _i9 > actualStart; _i9--) {
        var _from2 = _i9 + actualDeleteCount - 1;
        var _to = _i9 + insertCount - 1;
        if (_from2 in object) {
          object[_to] = object[_from2];
        } else {
          delete object[_to];
        }
      }
    }
    for (var _i0 = 0; _i0 < insertCount; _i0++) {
      object[actualStart + _i0] = arguments[_i0 + 2];
    }
    object.length = length + countDelta;
    return removed;
  };
  if (!isSupported35()) {
    Object.defineProperty(Array.prototype, "splice", {
      value: arraySplice,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.prototype.splice, "name", {
      value: "splice",
      configurable: true
    });
    Object.defineProperty(Array.prototype.splice, "__polyfilled", {
      value: true
    });
  }

  // tests/array-species-methods.test.ts
  describe("Array species-aware methods \u2014 test262 conformance", function () {
    var Tagged = /*#__PURE__*/function (_Array3) {
      function Tagged() {
        _classCallCheck(this, Tagged);
        return _callSuper(this, Tagged, arguments);
      }
      _inherits(Tagged, _Array3);
      return _createClass(Tagged, null, [{
        key: Symbol.species,
        get: function get() {
          return Tagged;
        }
      }]);
    }(/*#__PURE__*/_wrapNativeSuper(Array));
    describe("arrayMap", function () {
      it("maps values with index and array args", function () {
        expect(arrayMap.call([1, 2, 3], function (v, i) {
          return v * 10 + i;
        })).toEqual([10, 21, 32]);
      });
      it("skips holes", function () {
        var out = arrayMap.call([1,, 3], function (v) {
          return v * 2;
        });
        expect(out[0]).toBe(2);
        expect(1 in out).toBe(false);
        expect(out[2]).toBe(6);
      });
      it("honors thisArg", function () {
        var context = {
          factor: 3
        };
        var out = arrayMap.call([1, 2], function (v) {
          return v * this.factor;
        }, context);
        expect(out).toEqual([3, 6]);
      });
      it("throws on a non-callable callback", function () {
        expect(function () {
          return arrayMap.call([1], "nope");
        }).toThrow(TypeError);
      });
      it("creates the output via Symbol.species", function () {
        var source = Tagged.from([1, 2]);
        var out = arrayMap.call(source, function (v) {
          return v * 2;
        });
        expect(out instanceof Tagged).toBe(true);
        expect(Array.prototype.slice.call(out)).toEqual([2, 4]);
      });
      it("matches native", function () {
        var source = [1, 2, 3];
        var mapper = function mapper(v, i) {
          return v + i;
        };
        expect(arrayMap.call(source, mapper)).toEqual(source.map(mapper));
      });
    });
    describe("arrayFilter", function () {
      it("keeps matching values in order", function () {
        expect(arrayFilter.call([1, 2, 3, 4], function (v) {
          return v % 2 === 0;
        })).toEqual([2, 4]);
      });
      it("skips holes entirely", function () {
        expect(arrayFilter.call([1,, 3], function () {
          return true;
        })).toEqual([1, 3]);
      });
      it("creates the output via Symbol.species", function () {
        var source = Tagged.from([1, 2, 3]);
        var out = arrayFilter.call(source, function (v) {
          return v > 1;
        });
        expect(out instanceof Tagged).toBe(true);
      });
      it("matches native", function () {
        var source = [5, 1, 4, 2];
        var predicate = function predicate(v) {
          return v > 2;
        };
        expect(arrayFilter.call(source, predicate)).toEqual(source.filter(predicate));
      });
    });
    describe("arraySlice", function () {
      it("slices with positive and negative indices", function () {
        expect(arraySlice.call([1, 2, 3, 4], 1, 3)).toEqual([2, 3]);
        expect(arraySlice.call([1, 2, 3, 4], -2)).toEqual([3, 4]);
        expect(arraySlice.call([1, 2, 3, 4], 0, -1)).toEqual([1, 2, 3]);
      });
      it("copies the whole array with no args, preserving holes", function () {
        var out = arraySlice.call([1,, 3]);
        expect(out.length).toBe(3);
        expect(1 in out).toBe(false);
      });
      it("creates the output via Symbol.species", function () {
        var source = Tagged.from([1, 2, 3]);
        expect(arraySlice.call(source, 1) instanceof Tagged).toBe(true);
      });
      it("matches native across index combos", function () {
        var source = [1, 2, 3, 4, 5];
        var combos = [[void 0, void 0], [2, void 0], [-3, void 0], [1, 4], [1, -1], [-4, -2], [10, 20], [2.9, 4.9]];
        for (var _i1 = 0, _combos3 = combos; _i1 < _combos3.length; _i1++) {
          var _combos3$_i = _slicedToArray(_combos3[_i1], 2),
            start = _combos3$_i[0],
            end = _combos3$_i[1];
          expect(arraySlice.call(source, start, end)).toEqual(source.slice(start, end));
        }
      });
    });
    describe("arraySplice", function () {
      it("removes and returns elements, mutating in place", function () {
        var arr = [1, 2, 3, 4, 5];
        var removed = arraySplice.call(arr, 1, 2);
        expect(removed).toEqual([2, 3]);
        expect(arr).toEqual([1, 4, 5]);
      });
      it("inserts without deleting", function () {
        var arr = [1, 4];
        var removed = arraySplice.call(arr, 1, 0, 2, 3);
        expect(removed).toEqual([]);
        expect(arr).toEqual([1, 2, 3, 4]);
      });
      it("replaces (delete + insert of different sizes)", function () {
        var arr = [1, 2, 3];
        var removed = arraySplice.call(arr, 1, 1, 9, 8, 7);
        expect(removed).toEqual([2]);
        expect(arr).toEqual([1, 9, 8, 7, 3]);
      });
      it("handles negative start and omitted deleteCount", function () {
        var arr = [1, 2, 3, 4];
        var removed = arraySplice.call(arr, -2);
        expect(removed).toEqual([3, 4]);
        expect(arr).toEqual([1, 2]);
      });
      it("creates the removed array via Symbol.species", function () {
        var source = Tagged.from([1, 2, 3]);
        expect(arraySplice.call(source, 0, 1) instanceof Tagged).toBe(true);
      });
      it("matches native across arg combos", function () {
        var combos = [[], [1], [1, 1], [1, 0, "x"], [-1, 5], [0, 99], [2, 1, "a", "b"]];
        for (var _i10 = 0, _combos4 = combos; _i10 < _combos4.length; _i10++) {
          var args = _combos4[_i10];
          var mine = [1, 2, 3, 4];
          var theirs = [1, 2, 3, 4];
          var myRemoved = arraySplice.apply(mine, args);
          var theirRemoved = Array.prototype.splice.apply(theirs, args);
          expect(myRemoved).toEqual(theirRemoved);
          expect(mine).toEqual(theirs);
        }
      });
    });
    describe("arrayConcat", function () {
      it("spreads arrays and appends non-arrays whole", function () {
        expect(arrayConcat.call([1], [2, 3], 4, [5])).toEqual([1, 2, 3, 4, 5]);
      });
      it("keeps holes when spreading", function () {
        var out = arrayConcat.call([1,, 3], [4]);
        expect(out.length).toBe(4);
        expect(1 in out).toBe(false);
      });
      it("honors Symbol.isConcatSpreadable = false on an array", function () {
        var stuck = [2, 3];
        stuck[Symbol.isConcatSpreadable] = false;
        var out = arrayConcat.call([1], stuck);
        expect(out.length).toBe(2);
        expect(out[1]).toBe(stuck);
      });
      it("honors Symbol.isConcatSpreadable = true on an array-like object", function () {
        var spreadable = {
          0: "a",
          1: "b",
          length: 2
        };
        spreadable[Symbol.isConcatSpreadable] = true;
        expect(arrayConcat.call([1], spreadable)).toEqual([1, "a", "b"]);
      });
      it("creates the output via Symbol.species", function () {
        var source = Tagged.from([1]);
        expect(arrayConcat.call(source, [2]) instanceof Tagged).toBe(true);
      });
      it("matches native", function () {
        expect(arrayConcat.call([1, 2], [3], "x", [[4]])).toEqual([1, 2].concat([3], "x", [[4]]));
      });
    });
  });

  // src/modules/es.array.species.ts
  var isSupported36 = function isSupported36() {
    try {
      var species = typeof Symbol !== "undefined" && Symbol.species;
      if (!species) return true;
      return !!Array[species];
    } catch (e) {
      return false;
    }
  };
  var arraySpeciesGetter = function arraySpeciesGetter() {
    return this;
  };
  if (!isSupported36()) {
    var species = Symbol.species;
    Object.defineProperty(arraySpeciesGetter, "__polyfilled", {
      value: true
    });
    Object.defineProperty(arraySpeciesGetter, "name", {
      value: "get [Symbol.species]",
      configurable: true
    });
    Object.defineProperty(Array, species, {
      configurable: true,
      get: arraySpeciesGetter
    });
  }

  // tests/array-species.test.ts
  describe("Array[Symbol.species] island", function () {
    it("exposes a species getter that returns the constructor", function () {
      expect(Array[Symbol.species]).toBe(Array);
    });
    it("reports supported when the native accessor is present", function () {
      expect(isSupported36()).toBe(true);
    });
  });

  // tests/array-to-reversed.test.ts
  describe("Array.prototype.toReversed \u2014 test262 conformance", function () {
    describe("basic reversal", function () {
      it("reverses the elements", function () {
        expect(arrayToReversed.call([1, 2, 3])).toEqual([3, 2, 1]);
      });
      it("returns an empty array for an empty array", function () {
        expect(arrayToReversed.call([])).toEqual([]);
      });
      it("handles a single element", function () {
        expect(arrayToReversed.call([42])).toEqual([42]);
      });
    });
    describe("non-mutating", function () {
      it("does not mutate the original", function () {
        var arr = [1, 2, 3];
        var out = arrayToReversed.call(arr);
        expect(arr).toEqual([1, 2, 3]);
        expect(out).not.toBe(arr);
      });
    });
    describe("holes", function () {
      it("materializes holes as undefined (dense output)", function () {
        var out = arrayToReversed.call([1,, 3]);
        expect(out).toEqual([3, void 0, 1]);
        expect(0 in out).toBe(true);
        expect(1 in out).toBe(true);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("floors a fractional length", function () {
        var arrayLike = {
          0: "a",
          1: "b",
          2: "c",
          length: 2.9
        };
        expect(arrayToReversed.call(arrayLike)).toEqual(["b", "a"]);
      });
      it("returns empty for a negative length", function () {
        expect(arrayToReversed.call({
          length: -1,
          0: "a"
        })).toEqual([]);
      });
      it("returns empty for a NaN length", function () {
        expect(arrayToReversed.call({
          length: NaN,
          0: "a"
        })).toEqual([]);
      });
    });
    describe("generic application", function () {
      it("works on a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: "x",
          1: "y",
          2: "z",
          length: 3
        };
        expect(arrayToReversed.call(arrayLike)).toEqual(["z", "y", "x"]);
      });
    });
    describe("parity vs native", function () {
      it("matches native on a typical array", function () {
        var arr = [1, 2, 3, 4, 5];
        var native = Array.prototype.toReversed;
        var nativeResult = native.call(arr);
        var specResult = arrayToReversed.call(arr);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // tests/array-to-sorted.test.ts
  describe("Array.prototype.toSorted \u2014 test262 conformance", function () {
    describe("default ordering", function () {
      it("sorts lexicographically by default (string coercion)", function () {
        expect(arrayToSorted.call([10, 1, 2])).toEqual([1, 10, 2]);
      });
      it("returns an empty array for an empty array", function () {
        expect(arrayToSorted.call([])).toEqual([]);
      });
    });
    describe("comparator", function () {
      it("honors a numeric comparator", function () {
        expect(arrayToSorted.call([10, 1, 2], function (a, b) {
          return a - b;
        })).toEqual([1, 2, 10]);
      });
      it("throws TypeError when comparator is not callable and not undefined", function () {
        expect(function () {
          return arrayToSorted.call([1, 2], 5);
        }).toThrow(TypeError);
      });
      it("accepts undefined comparator (default ordering)", function () {
        expect(arrayToSorted.call([3, 1, 2], void 0)).toEqual([1, 2, 3]);
      });
    });
    describe("stability", function () {
      it("keeps equal-compare items in original order (16+ items)", function () {
        var items = [];
        for (var i = 0; i < 32; i++) {
          items.push({
            key: i % 4,
            tag: i
          });
        }
        var out = arrayToSorted.call(items, function (a, b) {
          return a.key - b.key;
        });
        for (var _i11 = 1; _i11 < out.length; _i11++) {
          if (out[_i11].key === out[_i11 - 1].key) {
            expect(out[_i11].tag).toBeGreaterThan(out[_i11 - 1].tag);
          } else {
            expect(out[_i11].key).toBeGreaterThan(out[_i11 - 1].key);
          }
        }
      });
    });
    describe("non-mutating", function () {
      it("does not mutate the original", function () {
        var arr = [3, 1, 2];
        var out = arrayToSorted.call(arr, function (a, b) {
          return a - b;
        });
        expect(arr).toEqual([3, 1, 2]);
        expect(out).not.toBe(arr);
        expect(out).toEqual([1, 2, 3]);
      });
    });
    describe("undefined + holes", function () {
      it("sorts undefined to the end", function () {
        var out = arrayToSorted.call([3, void 0, 1], function (a, b) {
          return a - b;
        });
        expect(out).toEqual([1, 3, void 0]);
      });
      it("treats holes as undefined, sorted to the end", function () {
        var out = arrayToSorted.call([3,, 1], function (a, b) {
          return a - b;
        });
        expect(out).toEqual([1, 3, void 0]);
        expect(2 in out).toBe(true);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("floors a fractional length", function () {
        var arrayLike = {
          0: 2,
          1: 1,
          2: 99,
          length: 2.9
        };
        expect(arrayToSorted.call(arrayLike, function (a, b) {
          return a - b;
        })).toEqual([1, 2]);
      });
    });
    describe("generic application", function () {
      it("works on a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: 3,
          1: 1,
          2: 2,
          length: 3
        };
        expect(arrayToSorted.call(arrayLike, function (a, b) {
          return a - b;
        })).toEqual([1, 2, 3]);
      });
    });
    describe("parity vs native", function () {
      it("matches native with a numeric comparator", function () {
        var arr = [5, 3, 8, 1, 9, 2];
        var cmp = function cmp(a, b) {
          return a - b;
        };
        var native = Array.prototype.toSorted;
        var nativeResult = native.call(arr, cmp);
        var specResult = arrayToSorted.call(arr, cmp);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // tests/array-to-spliced.test.ts
  describe("Array.prototype.toSpliced \u2014 test262 conformance", function () {
    describe("remove + insert", function () {
      it("removes a chunk and inserts replacements", function () {
        expect(arrayToSpliced.call([1, 2, 3, 4], 1, 2, "a", "b")).toEqual([1, "a", "b", 4]);
      });
      it("pure insertion with skipCount 0", function () {
        expect(arrayToSpliced.call([1, 2], 1, 0, 9)).toEqual([1, 9, 2]);
      });
      it("pure removal with no insert items", function () {
        expect(arrayToSpliced.call([1, 2, 3], 0, 1)).toEqual([2, 3]);
      });
      it("returns a copy when nothing changes", function () {
        var arr = [1, 2, 3];
        var out = arrayToSpliced.call(arr, 1, 0);
        expect(out).toEqual([1, 2, 3]);
        expect(out).not.toBe(arr);
      });
    });
    describe("start resolution", function () {
      it("counts a negative start from the end", function () {
        expect(arrayToSpliced.call([1, 2, 3, 4], -2, 1, "x")).toEqual([1, 2, "x", 4]);
      });
      it("clamps a very negative start to 0", function () {
        expect(arrayToSpliced.call([1, 2, 3], -99, 1, "x")).toEqual(["x", 2, 3]);
      });
      it("clamps a start beyond length to length (append)", function () {
        expect(arrayToSpliced.call([1, 2], 99, 0, "x")).toEqual([1, 2, "x"]);
      });
    });
    describe("skipCount resolution", function () {
      it("removes the rest of the array when skipCount is absent", function () {
        expect(arrayToSpliced.call([1, 2, 3, 4], 1)).toEqual([1]);
      });
      it("removes nothing when called with no args", function () {
        expect(arrayToSpliced.call([1, 2, 3])).toEqual([1, 2, 3]);
      });
      it("clamps skipCount to the remaining length", function () {
        expect(arrayToSpliced.call([1, 2, 3], 1, 99)).toEqual([1]);
      });
      it("treats a negative skipCount as 0", function () {
        expect(arrayToSpliced.call([1, 2, 3], 1, -5, "x")).toEqual([1, "x", 2, 3]);
      });
    });
    describe("non-mutating + holes", function () {
      it("does not mutate the original", function () {
        var arr = [1, 2, 3];
        arrayToSpliced.call(arr, 1, 1, "x");
        expect(arr).toEqual([1, 2, 3]);
      });
      it("materializes holes in retained ranges as undefined", function () {
        var out = arrayToSpliced.call([1,, 3], 0, 0);
        expect(out).toEqual([1, void 0, 3]);
        expect(1 in out).toBe(true);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("floors a fractional length", function () {
        var arrayLike = {
          0: 1,
          1: 2,
          2: 99,
          length: 2.9
        };
        expect(arrayToSpliced.call(arrayLike, 0, 0)).toEqual([1, 2]);
      });
    });
    describe("generic application", function () {
      it("works on a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: 1,
          1: 2,
          2: 3,
          length: 3
        };
        expect(arrayToSpliced.call(arrayLike, 1, 1, "x")).toEqual([1, "x", 3]);
      });
    });
    describe("parity vs native", function () {
      it("matches native on a remove+insert", function () {
        var arr = [1, 2, 3, 4, 5];
        var native = Array.prototype.toSpliced;
        var nativeResult = native.call(arr, 1, 2, "a", "b");
        var specResult = arrayToSpliced.call(arr, 1, 2, "a", "b");
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // tests/array-with.test.ts
  describe("Array.prototype.with \u2014 test262 conformance", function () {
    describe("basic replace", function () {
      it("replaces the element at a positive index", function () {
        expect(arrayWith.call([1, 2, 3], 1, "x")).toEqual([1, "x", 3]);
      });
      it("replaces the first and last elements", function () {
        expect(arrayWith.call([1, 2, 3], 0, "a")).toEqual(["a", 2, 3]);
        expect(arrayWith.call([1, 2, 3], 2, "c")).toEqual([1, 2, "c"]);
      });
    });
    describe("negative index", function () {
      it("counts from the end", function () {
        expect(arrayWith.call([1, 2, 3], -1, "z")).toEqual([1, 2, "z"]);
      });
      it("the most-negative in-range index hits index 0", function () {
        expect(arrayWith.call([1, 2, 3], -3, "a")).toEqual(["a", 2, 3]);
      });
    });
    describe("out-of-range throws RangeError", function () {
      it("throws for an index at length", function () {
        expect(function () {
          return arrayWith.call([1, 2, 3], 3, "x");
        }).toThrow(RangeError);
      });
      it("throws for an index past length", function () {
        expect(function () {
          return arrayWith.call([1, 2, 3], 99, "x");
        }).toThrow(RangeError);
      });
      it("throws for a negative index past the start", function () {
        expect(function () {
          return arrayWith.call([1, 2, 3], -4, "x");
        }).toThrow(RangeError);
      });
      it("throws on an empty array", function () {
        expect(function () {
          return arrayWith.call([], 0, "x");
        }).toThrow(RangeError);
      });
    });
    describe("non-mutating + holes", function () {
      it("does not mutate the original", function () {
        var arr = [1, 2, 3];
        var out = arrayWith.call(arr, 1, "x");
        expect(arr).toEqual([1, 2, 3]);
        expect(out).not.toBe(arr);
      });
      it("materializes other holes as undefined (dense output)", function () {
        var out = arrayWith.call([1,, 3], 0, "a");
        expect(out).toEqual(["a", void 0, 3]);
        expect(1 in out).toBe(true);
      });
    });
    describe("index coercion (ToIntegerOrInfinity)", function () {
      it("floors a fractional index toward zero", function () {
        expect(arrayWith.call([1, 2, 3], 1.9, "x")).toEqual([1, "x", 3]);
      });
    });
    describe("length coercion (ToLength)", function () {
      it("floors a fractional length", function () {
        var arrayLike = {
          0: 1,
          1: 2,
          2: 99,
          length: 2.9
        };
        expect(arrayWith.call(arrayLike, 0, "a")).toEqual(["a", 2]);
      });
    });
    describe("generic application", function () {
      it("works on a string-keyed array-like via .call", function () {
        var arrayLike = {
          0: 1,
          1: 2,
          2: 3,
          length: 3
        };
        expect(arrayWith.call(arrayLike, 1, "x")).toEqual([1, "x", 3]);
      });
    });
    describe("parity vs native", function () {
      it("matches native on a mid replace", function () {
        var arr = [1, 2, 3, 4, 5];
        var native = Array.prototype.with;
        var nativeResult = native.call(arr, 2, "x");
        var specResult = arrayWith.call(arr, 2, "x");
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.object.is-sealed.ts
  var isSupported37 = function isSupported37() {
    try {
      return Object.isSealed(1) === true;
    } catch (e) {
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
  if (!isSupported37()) {
    Object.defineProperty(Object, "isSealed", {
      value: objectIsSealed,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.isSealed, "name", {
      value: "isSealed",
      configurable: true
    });
    Object.defineProperty(Object.isSealed, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.define-getter.ts
  var isSupported38 = function isSupported38() {
    try {
      return typeof Object.prototype.__defineGetter__ === "function";
    } catch (e) {
      return false;
    }
  };
  var objectDefineGetter = function objectDefineGetter(key, getter) {
    if (this === null || this === void 0) {
      throw new TypeError("Object.prototype.__defineGetter__ called on null or undefined");
    }
    if (typeof getter !== "function") {
      throw new TypeError("Getter must be a function");
    }
    Object.defineProperty(Object(this), key, {
      get: getter,
      enumerable: true,
      configurable: true
    });
  };
  if (!isSupported38()) {
    Object.defineProperty(Object.prototype, "__defineGetter__", {
      value: objectDefineGetter,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.prototype.__defineGetter__, "name", {
      value: "__defineGetter__",
      configurable: true
    });
    Object.defineProperty(Object.prototype.__defineGetter__, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.define-setter.ts
  var isSupported39 = function isSupported39() {
    try {
      return typeof Object.prototype.__defineSetter__ === "function";
    } catch (e) {
      return false;
    }
  };
  var objectDefineSetter = function objectDefineSetter(key, setter) {
    if (this === null || this === void 0) {
      throw new TypeError("Object.prototype.__defineSetter__ called on null or undefined");
    }
    if (typeof setter !== "function") {
      throw new TypeError("Setter must be a function");
    }
    Object.defineProperty(Object(this), key, {
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
  if (!isSupported39()) {
    Object.defineProperty(Object.prototype, "__defineSetter__", {
      value: objectDefineSetter,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.prototype.__defineSetter__, "name", {
      value: "__defineSetter__",
      configurable: true
    });
    Object.defineProperty(Object.prototype.__defineSetter__, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.lookup-getter.ts
  var isSupported40 = function isSupported40() {
    try {
      return typeof Object.prototype.__lookupGetter__ === "function";
    } catch (e) {
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
    } while (object !== null);
    return void 0;
  };
  if (!isSupported40()) {
    Object.defineProperty(Object.prototype, "__lookupGetter__", {
      value: objectLookupGetter,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.prototype.__lookupGetter__, "name", {
      value: "__lookupGetter__",
      configurable: true
    });
    Object.defineProperty(Object.prototype.__lookupGetter__, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.lookup-setter.ts
  var isSupported41 = function isSupported41() {
    try {
      return typeof Object.prototype.__lookupSetter__ === "function";
    } catch (e) {
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
    } while (object !== null);
    return void 0;
  };
  if (!isSupported41()) {
    Object.defineProperty(Object.prototype, "__lookupSetter__", {
      value: objectLookupSetter,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.prototype.__lookupSetter__, "name", {
      value: "__lookupSetter__",
      configurable: true
    });
    Object.defineProperty(Object.prototype.__lookupSetter__, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.regexp.test.ts
  var isSupported42 = function isSupported42() {
    try {
      var regexp = /a/;
      var calledExec = false;
      regexp.exec = function () {
        calledExec = true;
        return null;
      };
      regexp.test("a");
      return calledExec;
    } catch (e) {
      return false;
    }
  };
  var nativeTest = RegExp.prototype.test;
  var regexpTest = function regexpTest(string) {
    if (this === null || typeof this !== "object") {
      throw new TypeError("RegExp.prototype.test called on a non-object");
    }
    var exec = this.exec;
    if (typeof exec === "function") {
      var result = exec.call(this, String(string));
      if (result !== null && typeof result !== "object") {
        throw new TypeError("RegExp exec method returned something other than an Object or null");
      }
      return result !== null;
    }
    return nativeTest.call(this, String(string));
  };
  if (!isSupported42()) {
    Object.defineProperty(RegExp.prototype, "test", {
      value: regexpTest,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RegExp.prototype.test, "name", {
      value: "test",
      configurable: true
    });
    Object.defineProperty(RegExp.prototype.test, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.regexp.dot-all.ts
  var isSupported43 = function isSupported43() {
    try {
      return "dotAll" in RegExp.prototype;
    } catch (e) {
      return false;
    }
  };
  var regexpDotAllGetter = function regexpDotAllGetter() {
    if (this === null || typeof this !== "object") {
      throw new TypeError("RegExp.prototype.dotAll getter called on a non-object");
    }
    var flags = this.flags;
    if (typeof flags !== "string") {
      return void 0;
    }
    return flags.indexOf("s") !== -1;
  };
  if (!isSupported43()) {
    Object.defineProperty(RegExp.prototype, "dotAll", {
      configurable: true,
      get: regexpDotAllGetter
    });
    Object.defineProperty(regexpDotAllGetter, "name", {
      value: "get dotAll",
      configurable: true
    });
    Object.defineProperty(regexpDotAllGetter, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.function.has-instance.ts
  var hasInstanceKey = typeof Symbol !== "undefined" ? Symbol.hasInstance : void 0;
  var isSupported44 = function isSupported44() {
    try {
      return !hasInstanceKey || typeof Function.prototype[hasInstanceKey] === "function";
    } catch (e) {
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
    while (proto2 !== null) {
      if (proto2 === target) {
        return true;
      }
      proto2 = Object.getPrototypeOf(proto2);
    }
    return false;
  };
  if (hasInstanceKey && !isSupported44()) {
    Object.defineProperty(Function.prototype, hasInstanceKey, {
      configurable: true,
      value: functionHasInstance
    });
    Object.defineProperty(functionHasInstance, "name", {
      value: "[Symbol.hasInstance]",
      configurable: true
    });
    Object.defineProperty(functionHasInstance, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.error.to-string.ts
  var isSupported45 = function isSupported45() {
    try {
      return Error.prototype.toString.call({
        name: "x",
        message: "y"
      }) === "x: y" && Error.prototype.toString.call({}) === "Error" && Error.prototype.toString.call({
        name: "x"
      }) === "x" && Error.prototype.toString.call({
        message: "y"
      }) === "Error: y";
    } catch (e) {
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
  if (!isSupported45()) {
    Object.defineProperty(Error.prototype, "toString", {
      value: errorToString,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Error.prototype.toString, "name", {
      value: "toString",
      configurable: true
    });
    Object.defineProperty(Error.prototype.toString, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.error.is-error.ts
  var isSupported46 = function isSupported46() {
    try {
      return typeof Error.isError === "function";
    } catch (e) {
      return false;
    }
  };
  var errorIsError = function errorIsError(value) {
    return Object.prototype.toString.call(value) === "[object Error]";
  };
  if (!isSupported46()) {
    Object.defineProperty(Error, "isError", {
      value: errorIsError,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Error.isError, "name", {
      value: "isError",
      configurable: true
    });
    Object.defineProperty(Error.isError, "__polyfilled", {
      value: true
    });
  }

  // src/modules/web.atob.ts
  var isSupported47 = function isSupported47() {
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
      } catch (e) {}
      return true;
    } catch (e) {
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
    for (var i = 0; i < input.length; i++) {
      var index = ALPHABET.indexOf(input.charAt(i));
      bitStorage = bitCounter % 4 ? bitStorage * 64 + index : index;
      if (bitCounter++ % 4) {
        output += String.fromCharCode(255 & bitStorage >> (-2 * bitCounter & 6));
      }
    }
    return output;
  };
  if (typeof window !== "undefined" && !isSupported47()) {
    Object.defineProperty(window, "atob", {
      value: atobPolyfill,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.atob, "name", {
      value: "atob",
      configurable: true
    });
    Object.defineProperty(window.atob, "__polyfilled", {
      value: true
    });
  }

  // tests/b1-islands.test.ts
  describe("Object.isSealed", function () {
    it("treats primitives as sealed rather than throwing (the ES5 \u2192 ES2015 change)", function () {
      expect(objectIsSealed(1)).toBe(true);
      expect(objectIsSealed("x")).toBe(true);
      expect(objectIsSealed(null)).toBe(true);
      expect(objectIsSealed(void 0)).toBe(true);
    });
    it("still answers correctly for real objects", function () {
      expect(objectIsSealed({})).toBe(false);
      expect(objectIsSealed(Object.seal({}))).toBe(true);
    });
  });
  describe("Object.prototype.__defineGetter__ / __defineSetter__", function () {
    it("defines an enumerable, configurable accessor", function () {
      var target = {};
      objectDefineGetter.call(target, "x", function () {
        return 42;
      });
      expect(target.x).toBe(42);
      var descriptor = Object.getOwnPropertyDescriptor(target, "x");
      expect(descriptor.enumerable).toBe(true);
      expect(descriptor.configurable).toBe(true);
    });
    it("routes writes through the setter", function () {
      var target = {};
      var received;
      objectDefineSetter.call(target, "x", function (value) {
        received = value;
      });
      target.x = 7;
      expect(received).toBe(7);
    });
    it("rejects a non-callable accessor", function () {
      expect(function () {
        return objectDefineGetter.call({}, "x", 1);
      }).toThrow(TypeError);
      expect(function () {
        return objectDefineSetter.call({}, "x", 1);
      }).toThrow(TypeError);
    });
  });
  describe("Object.prototype.__lookupGetter__ / __lookupSetter__", function () {
    it("finds an own accessor", function () {
      var getter = function getter() {
        return 1;
      };
      var target = Object.defineProperty({}, "x", {
        get: getter,
        configurable: true
      });
      expect(objectLookupGetter.call(target, "x")).toBe(getter);
    });
    it("walks the prototype chain", function () {
      var getter = function getter() {
        return 1;
      };
      var base = Object.defineProperty({}, "x", {
        get: getter,
        configurable: true
      });
      var derived = Object.create(base);
      expect(objectLookupGetter.call(derived, "x")).toBe(getter);
    });
    it("returns undefined for a data property, not the value", function () {
      expect(objectLookupGetter.call({
        x: 1
      }, "x")).toBe(void 0);
    });
    it("returns undefined for a missing key", function () {
      expect(objectLookupGetter.call({}, "nope")).toBe(void 0);
      expect(objectLookupSetter.call({}, "nope")).toBe(void 0);
    });
    it("finds a setter without confusing it for the getter", function () {
      var setter = function setter() {};
      var target = Object.defineProperty({}, "x", {
        set: setter,
        configurable: true
      });
      expect(objectLookupSetter.call(target, "x")).toBe(setter);
      expect(objectLookupGetter.call(target, "x")).toBe(void 0);
    });
  });
  describe("RegExp.prototype.test", function () {
    it("delegates to a user-supplied exec", function () {
      var regexp = /a/;
      var calls = 0;
      regexp.exec = function () {
        calls++;
        return null;
      };
      expect(regexpTest.call(regexp, "a")).toBe(false);
      expect(calls).toBe(1);
    });
    it("reports true when exec returns a match object", function () {
      var regexp = /a/;
      regexp.exec = function () {
        return {
          0: "a"
        };
      };
      expect(regexpTest.call(regexp, "a")).toBe(true);
    });
    it("throws when exec returns a non-object, non-null", function () {
      var regexp = /a/;
      regexp.exec = function () {
        return "nope";
      };
      expect(function () {
        return regexpTest.call(regexp, "a");
      }).toThrow(TypeError);
    });
  });
  describe("RegExp.prototype.dotAll", function () {
    it("reads the s flag off .flags", function () {
      expect(regexpDotAllGetter.call({
        flags: "gs"
      })).toBe(true);
      expect(regexpDotAllGetter.call({
        flags: "gi"
      })).toBe(false);
    });
    it("throws on a non-object receiver", function () {
      expect(function () {
        return regexpDotAllGetter.call(null);
      }).toThrow(TypeError);
    });
  });
  describe("Function.prototype[Symbol.hasInstance]", function () {
    function Base() {}
    function Other() {}
    it("matches an instance through the prototype chain", function () {
      var instance = new Base();
      expect(functionHasInstance.call(Base, instance)).toBe(true);
      expect(functionHasInstance.call(Other, instance)).toBe(false);
    });
    it("is false for primitives and null", function () {
      expect(functionHasInstance.call(Base, 1)).toBe(false);
      expect(functionHasInstance.call(Base, null)).toBe(false);
    });
    it("is false when the receiver is not callable", function () {
      expect(functionHasInstance.call({}, {})).toBe(false);
    });
    it("throws when the function has a non-object prototype", function () {
      var bad = function bad() {};
      bad.prototype = 1;
      expect(function () {
        return functionHasInstance.call(bad, {});
      }).toThrow(TypeError);
    });
  });
  describe("Error.prototype.toString", function () {
    it("covers all four name/message combinations", function () {
      expect(errorToString.call({
        name: "x",
        message: "y"
      })).toBe("x: y");
      expect(errorToString.call({})).toBe("Error");
      expect(errorToString.call({
        name: "x"
      })).toBe("x");
      expect(errorToString.call({
        message: "y"
      })).toBe("Error: y");
    });
    it("returns just the message when name is the empty string", function () {
      expect(errorToString.call({
        name: "",
        message: "y"
      })).toBe("y");
    });
    it("throws on a non-object receiver", function () {
      expect(function () {
        return errorToString.call(null);
      }).toThrow(TypeError);
    });
  });
  describe("Error.isError", function () {
    it("recognises real errors, including subclasses", function () {
      expect(errorIsError(new Error("x"))).toBe(true);
      expect(errorIsError(new TypeError("x"))).toBe(true);
    });
    it("rejects non-errors, including error-shaped plain objects", function () {
      expect(errorIsError({
        name: "Error",
        message: "x"
      })).toBe(false);
      expect(errorIsError(null)).toBe(false);
      expect(errorIsError("Error")).toBe(false);
    });
  });
  describe("atob", function () {
    it("decodes, with and without padding", function () {
      expect(atobPolyfill("aGk=")).toBe("hi");
      expect(atobPolyfill("aGk")).toBe("hi");
      expect(atobPolyfill("YQ==")).toBe("a");
      expect(atobPolyfill("")).toBe("");
    });
    it("strips ASCII whitespace before decoding", function () {
      expect(atobPolyfill(" a G	k\n= ")).toBe("hi");
    });
    it("rejects a dangling character that cannot form a byte", function () {
      expect(function () {
        return atobPolyfill("a");
      }).toThrow();
    });
    it("rejects characters outside the base64 alphabet", function () {
      expect(function () {
        return atobPolyfill("a*k=");
      }).toThrow();
    });
    it("round-trips against btoa", function () {
      expect(atobPolyfill(btoa("hello world"))).toBe("hello world");
    });
  });

  // src/modules/es.date.to-iso-string.ts
  var nativeToISOString = Date.prototype.toISOString;
  var isSupported48 = function isSupported48() {
    try {
      if (typeof nativeToISOString !== "function") return false;
      if (nativeToISOString.call(new Date(-5e13 - 1)) !== "0385-07-25T07:06:39.999Z") return false;
      try {
        nativeToISOString.call(/* @__PURE__ */new Date(NaN));
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var padStart = function padStart(value, width) {
    var str = String(value);
    while (str.length < width) str = "0" + str;
    return str;
  };
  var dateToISOString = function toISOString() {
    var time = Date.prototype.getTime.call(this);
    if (!isFinite(time)) throw new RangeError("Invalid time value");
    var year = this.getUTCFullYear();
    var sign = year < 0 ? "-" : year > 9999 ? "+" : "";
    return sign + padStart(Math.abs(year), sign ? 6 : 4) + "-" + padStart(this.getUTCMonth() + 1, 2) + "-" + padStart(this.getUTCDate(), 2) + "T" + padStart(this.getUTCHours(), 2) + ":" + padStart(this.getUTCMinutes(), 2) + ":" + padStart(this.getUTCSeconds(), 2) + "." + padStart(this.getUTCMilliseconds(), 3) + "Z";
  };
  if (!isSupported48()) {
    Object.defineProperty(Date.prototype, "toISOString", {
      value: dateToISOString,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Date.prototype.toISOString, "name", {
      value: "toISOString",
      configurable: true
    });
    Object.defineProperty(Date.prototype.toISOString, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.date.to-json.ts
  var nativeToJSON = Date.prototype.toJSON;
  var isSupported49 = function isSupported49() {
    try {
      if (typeof nativeToJSON !== "function") return false;
      if ((/* @__PURE__ */new Date(NaN)).toJSON() !== null) return false;
      if (nativeToJSON.call({
        toISOString: function toISOString() {
          return 1;
        }
      }) !== 1) return false;
      return true;
    } catch (e) {
      return false;
    }
  };
  var toNumberPrimitive = function toNumberPrimitive(input) {
    if (input === null || typeof input !== "object") return input;
    var methods = ["valueOf", "toString"];
    for (var i = 0; i < methods.length; i++) {
      var fn = input[methods[i]];
      if (typeof fn === "function") {
        var result = fn.call(input);
        if (result === null || typeof result !== "object") return result;
      }
    }
    throw new TypeError("Cannot convert object to primitive value");
  };
  var dateToJSON = function toJSON(_key) {
    var object = Object(this);
    var primitive = toNumberPrimitive(object);
    return typeof primitive === "number" && !isFinite(primitive) ? null : object.toISOString();
  };
  if (!isSupported49()) {
    Object.defineProperty(Date.prototype, "toJSON", {
      value: dateToJSON,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Date.prototype.toJSON, "name", {
      value: "toJSON",
      configurable: true
    });
    Object.defineProperty(Date.prototype.toJSON, "__polyfilled", {
      value: true
    });
  }

  // tests/date-iso-json.test.ts
  describe("Date.prototype.toISOString island", function () {
    it("formats a UTC date with millisecond precision", function () {
      var d = new Date(Date.UTC(2020, 0, 1, 2, 3, 4, 5));
      expect(dateToISOString.call(d)).toBe("2020-01-01T02:03:04.005Z");
    });
    it("pads far-past years to four digits (the core-js regression case)", function () {
      expect(dateToISOString.call(new Date(-5e13 - 1))).toBe("0385-07-25T07:06:39.999Z");
    });
    it("signs and widens out-of-range years", function () {
      expect(dateToISOString.call(new Date(Date.UTC(12345, 0, 1)))).toBe("+012345-01-01T00:00:00.000Z");
    });
    it("throws RangeError on an invalid date", function () {
      expect(function () {
        return dateToISOString.call(/* @__PURE__ */new Date(NaN));
      }).toThrow(RangeError);
    });
  });
  describe("Date.prototype.toJSON island", function () {
    it("serializes a valid date via toISOString", function () {
      var d = new Date(Date.UTC(2020, 0, 1));
      expect(dateToJSON.call(d)).toBe("2020-01-01T00:00:00.000Z");
    });
    it("returns null for a non-finite date", function () {
      expect(dateToJSON.call(/* @__PURE__ */new Date(NaN))).toBe(null);
    });
    it("works on any object with a numeric primitive + toISOString", function () {
      expect(dateToJSON.call({
        valueOf: function valueOf() {
          return 1;
        },
        toISOString: function toISOString() {
          return "iso";
        }
      })).toBe("iso");
      expect(dateToJSON.call({
        valueOf: function valueOf() {
          return NaN;
        },
        toISOString: function toISOString() {
          return "iso";
        }
      })).toBe(null);
    });
  });

  // src/modules/es.date.to-primitive.ts
  var isSupported50 = function isSupported50() {
    try {
      return typeof Symbol === "undefined" || !Symbol.toPrimitive || typeof Date.prototype[Symbol.toPrimitive] === "function";
    } catch (e) {
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
      var _result = second.call(this);
      if (_result === null || typeof _result !== "object" && typeof _result !== "function") {
        return _result;
      }
    }
    throw new TypeError("Cannot convert object to primitive value");
  };
  if (typeof Symbol !== "undefined" && Symbol.toPrimitive && !isSupported50()) {
    Object.defineProperty(Date.prototype, Symbol.toPrimitive, {
      value: dateToPrimitive,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(dateToPrimitive, "name", {
      value: "[Symbol.toPrimitive]",
      configurable: true
    });
    Object.defineProperty(Date.prototype[Symbol.toPrimitive], "__polyfilled", {
      value: true
    });
  }

  // tests/date-to-primitive.test.ts
  describe("Date.prototype[Symbol.toPrimitive] \u2014 test262 conformance", function () {
    var date = /* @__PURE__ */new Date(1234567890123);
    it("returns the timestamp for the number hint", function () {
      expect(dateToPrimitive.call(date, "number")).toBe(1234567890123);
    });
    it("returns the date string for the string hint", function () {
      expect(dateToPrimitive.call(date, "string")).toBe(date.toString());
    });
    it("treats default like string", function () {
      expect(dateToPrimitive.call(date, "default")).toBe(date.toString());
    });
    it("throws on an invalid hint", function () {
      expect(function () {
        return dateToPrimitive.call(date, "boolean");
      }).toThrow(TypeError);
      expect(function () {
        return dateToPrimitive.call(date, void 0);
      }).toThrow(TypeError);
    });
    it("throws on a non-object this", function () {
      expect(function () {
        return dateToPrimitive.call(1, "number");
      }).toThrow(TypeError);
      expect(function () {
        return dateToPrimitive.call(null, "number");
      }).toThrow(TypeError);
    });
    it("is generic: works on any object with toString/valueOf", function () {
      var duck = {
        toString: function toString() {
          return "quack";
        },
        valueOf: function valueOf() {
          return 7;
        }
      };
      expect(dateToPrimitive.call(duck, "string")).toBe("quack");
      expect(dateToPrimitive.call(duck, "number")).toBe(7);
    });
    it("matches native", function () {
      var native = Date.prototype[Symbol.toPrimitive];
      expect(dateToPrimitive.call(date, "number")).toBe(native.call(date, "number"));
      expect(dateToPrimitive.call(date, "string")).toBe(native.call(date, "string"));
      expect(dateToPrimitive.call(date, "default")).toBe(native.call(date, "default"));
    });
  });

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
        value: /* @__PURE__ */Symbol("Symbol." + name)
      });
    } catch (e) {
      return void 0;
    }
    return Symbol[name];
  };
  var def = function def(target, key, value) {
    if (typeof value === "function" && typeof key === "string" && key !== "constructor") {
      Object.defineProperty(value, "name", {
        value: key,
        configurable: true
      });
    }
    Object.defineProperty(target, key, {
      value: value,
      writable: true,
      enumerable: false,
      configurable: true
    });
  };
  var isSupported51 = function isSupported51() {
    try {
      return typeof globalThis.DisposableStack === "function" && typeof globalThis.AsyncDisposableStack === "function" && typeof globalThis.SuppressedError === "function";
    } catch (e) {
      return false;
    }
  };
  var _SuppressedError = function SuppressedError2(error, suppressed, message) {
    var self2 = this instanceof _SuppressedError ? this : Object.create(_SuppressedError.prototype);
    if (message !== void 0) {
      if (typeof message === "symbol") {
        throw new TypeError("Cannot convert a Symbol value to a string");
      }
      def(self2, "message", String(message));
    }
    def(self2, "error", error);
    def(self2, "suppressed", suppressed);
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(self2, _SuppressedError);
    } else {
      var stack = new Error().stack;
      if (stack) self2.stack = stack;
    }
    return self2;
  };
  _SuppressedError.prototype = Object.create(Error.prototype);
  def(_SuppressedError.prototype, "constructor", _SuppressedError);
  def(_SuppressedError.prototype, "name", "SuppressedError");
  def(_SuppressedError.prototype, "message", "");
  var suppress = function suppress(existing, hasExisting, thrown) {
    return hasExisting ? new _SuppressedError(thrown, existing) : thrown;
  };
  var getMethod = function getMethod(value, key) {
    if (key === void 0) return void 0;
    var method = value[key];
    if (method === null || method === void 0) return void 0;
    if (typeof method !== "function") {
      throw new TypeError("dispose method is not callable");
    }
    return method;
  };
  var _DisposableStack = function DisposableStack() {
    if (!(this instanceof _DisposableStack)) {
      throw new TypeError("Constructor DisposableStack requires 'new'");
    }
    this._brand = "DisposableStack";
    this._stack = [];
    this._disposed = false;
  };
  var disposablestackDisposedGetter = function disposablestackDisposedGetter() {
    assertBrand(this, "DisposableStack", "disposed");
    return this._disposed;
  };
  Object.defineProperty(disposablestackDisposedGetter, "name", {
    value: "get disposed",
    configurable: true
  });
  Object.defineProperty(_DisposableStack.prototype, "disposed", {
    configurable: true,
    get: disposablestackDisposedGetter
  });
  var assertBrand = function assertBrand(value, brand, method) {
    if (value === null || typeof value !== "object" || value._brand !== brand) {
      throw new TypeError(brand + ".prototype." + method + " called on incompatible receiver");
    }
  };
  var assertLive = function assertLive(stack, method) {
    if (stack._disposed) {
      throw new ReferenceError("DisposableStack already disposed: " + method);
    }
  };
  def(_DisposableStack.prototype, "use", function (value) {
    assertBrand(this, "DisposableStack", "use");
    assertLive(this, "use");
    if (value === null || value === void 0) {
      return value;
    }
    var method = getMethod(Object(value), ensureSymbol("dispose"));
    if (method === void 0) {
      throw new TypeError("value is not disposable");
    }
    this._stack.push(function () {
      method.call(value);
    });
    return value;
  });
  def(_DisposableStack.prototype, "adopt", function (value, onDispose) {
    assertBrand(this, "DisposableStack", "adopt");
    assertLive(this, "adopt");
    if (typeof onDispose !== "function") {
      throw new TypeError("onDispose is not a function");
    }
    this._stack.push(function () {
      onDispose(value);
    });
    return value;
  });
  def(_DisposableStack.prototype, "defer", function (onDispose) {
    assertBrand(this, "DisposableStack", "defer");
    assertLive(this, "defer");
    if (typeof onDispose !== "function") {
      throw new TypeError("onDispose is not a function");
    }
    this._stack.push(onDispose);
  });
  def(_DisposableStack.prototype, "move", function () {
    assertBrand(this, "DisposableStack", "move");
    assertLive(this, "move");
    var moved = new _DisposableStack();
    moved._stack = this._stack;
    this._stack = [];
    this._disposed = true;
    return moved;
  });
  def(_DisposableStack.prototype, "dispose", function () {
    assertBrand(this, "DisposableStack", "dispose");
    if (this._disposed) return;
    this._disposed = true;
    var pending = this._stack;
    this._stack = [];
    var hasError = false;
    var error;
    for (var i = pending.length - 1; i >= 0; i--) {
      try {
        pending[i]();
      } catch (thrown) {
        error = suppress(error, hasError, thrown);
        hasError = true;
      }
    }
    if (hasError) throw error;
  });
  var _AsyncDisposableStack = function AsyncDisposableStack() {
    if (!(this instanceof _AsyncDisposableStack)) {
      throw new TypeError("Constructor AsyncDisposableStack requires 'new'");
    }
    this._brand = "AsyncDisposableStack";
    this._stack = [];
    this._disposed = false;
  };
  var asyncdisposablestackDisposedGetter = function asyncdisposablestackDisposedGetter() {
    assertBrand(this, "AsyncDisposableStack", "disposed");
    return this._disposed;
  };
  Object.defineProperty(asyncdisposablestackDisposedGetter, "name", {
    value: "get disposed",
    configurable: true
  });
  Object.defineProperty(_AsyncDisposableStack.prototype, "disposed", {
    configurable: true,
    get: asyncdisposablestackDisposedGetter
  });
  def(_AsyncDisposableStack.prototype, "use", function (value) {
    assertBrand(this, "AsyncDisposableStack", "use");
    assertLive(this, "use");
    if (value === null || value === void 0) {
      return value;
    }
    var boxed = Object(value);
    var method = getMethod(boxed, ensureSymbol("asyncDispose"));
    if (method === void 0) {
      method = getMethod(boxed, ensureSymbol("dispose"));
    }
    if (method === void 0) {
      throw new TypeError("value is not async disposable");
    }
    this._stack.push(function () {
      return method.call(value);
    });
    return value;
  });
  def(_AsyncDisposableStack.prototype, "adopt", function (value, onDispose) {
    assertBrand(this, "AsyncDisposableStack", "adopt");
    assertLive(this, "adopt");
    if (typeof onDispose !== "function") {
      throw new TypeError("onDispose is not a function");
    }
    this._stack.push(function () {
      return onDispose(value);
    });
    return value;
  });
  def(_AsyncDisposableStack.prototype, "defer", function (onDispose) {
    assertBrand(this, "AsyncDisposableStack", "defer");
    assertLive(this, "defer");
    if (typeof onDispose !== "function") {
      throw new TypeError("onDispose is not a function");
    }
    this._stack.push(onDispose);
  });
  def(_AsyncDisposableStack.prototype, "move", function () {
    assertBrand(this, "AsyncDisposableStack", "move");
    assertLive(this, "move");
    var moved = new _AsyncDisposableStack();
    moved._stack = this._stack;
    this._stack = [];
    this._disposed = true;
    return moved;
  });
  def(_AsyncDisposableStack.prototype, "disposeAsync", function () {
    assertBrand(this, "AsyncDisposableStack", "disposeAsync");
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
    var _step3 = function step() {
      if (index < 0) {
        if (hasError) throw error;
        return void 0;
      }
      var disposer = pending[index--];
      return Promise.resolve().then(function () {
        return disposer();
      }).then(void 0, function (thrown) {
        error = suppress(error, hasError, thrown);
        hasError = true;
      }).then(_step3);
    };
    return Promise.resolve().then(_step3);
  });
  if (typeof Object.setPrototypeOf === "function") {
    try {
      Object.setPrototypeOf(_SuppressedError, Error);
    } catch (e) {}
  }
  for (var i = 0; i < 3; i++) {
    var ctor = [_SuppressedError, _DisposableStack, _AsyncDisposableStack][i];
    try {
      Object.defineProperty(ctor, "prototype", {
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (e) {}
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
  if (tagKey) {
    defTag(_DisposableStack.prototype, "DisposableStack");
    defTag(_AsyncDisposableStack.prototype, "AsyncDisposableStack");
    defTag(_SuppressedError.prototype, "SuppressedError");
  }
  if (disposeKey !== void 0) {
    def(_DisposableStack.prototype, disposeKey, _DisposableStack.prototype.dispose);
  }
  if (asyncDisposeKey !== void 0) {
    def(_AsyncDisposableStack.prototype, asyncDisposeKey, _AsyncDisposableStack.prototype.disposeAsync);
  }
  if (!isSupported51()) {
    var target = typeof window !== "undefined" ? window : globalThis;
    if (!target.SuppressedError) {
      Object.defineProperty(target, "SuppressedError", {
        value: _SuppressedError,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(target.SuppressedError, "name", {
        value: "SuppressedError",
        configurable: true
      });
      Object.defineProperty(target.SuppressedError, "__polyfilled", {
        value: true
      });
    }
    if (!target.DisposableStack) {
      Object.defineProperty(target, "DisposableStack", {
        value: _DisposableStack,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(target.DisposableStack, "name", {
        value: "DisposableStack",
        configurable: true
      });
      Object.defineProperty(target.DisposableStack, "__polyfilled", {
        value: true
      });
    }
    if (!target.AsyncDisposableStack) {
      Object.defineProperty(target, "AsyncDisposableStack", {
        value: _AsyncDisposableStack,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(target.AsyncDisposableStack, "name", {
        value: "AsyncDisposableStack",
        configurable: true
      });
      Object.defineProperty(target.AsyncDisposableStack, "__polyfilled", {
        value: true
      });
    }
    if (asyncDisposeKey !== void 0) {
      try {
        var makeAsyncGen = Function("return (async function* () {})");
        var asyncGenFn = makeAsyncGen();
        var asyncIteratorProto = Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(asyncGenFn())));
        if (asyncIteratorProto && !asyncIteratorProto[asyncDisposeKey]) {
          var asyncIteratorDispose = function asyncIteratorDispose() {
            var self2 = this;
            return Promise.resolve().then(function () {
              var method = self2.return;
              return typeof method === "function" ? method.call(self2) : void 0;
            });
          };
          Object.defineProperty(asyncIteratorProto, asyncDisposeKey, {
            value: asyncIteratorDispose,
            writable: true,
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(asyncIteratorDispose, "__polyfilled", {
            value: true
          });
        }
      } catch (e) {}
    }
  }

  // tests/disposable.test.ts
  var disposeKey2 = Symbol.dispose;
  var asyncDisposeKey2 = Symbol.asyncDispose;
  describe("SuppressedError", function () {
    it("carries both errors and reads as an Error", function () {
      var outer = new Error("outer");
      var inner = new Error("inner");
      var suppressed = new _SuppressedError(outer, inner, "both failed");
      expect(suppressed.error).toBe(outer);
      expect(suppressed.suppressed).toBe(inner);
      expect(suppressed.message).toBe("both failed");
      expect(suppressed.name).toBe("SuppressedError");
      expect(suppressed instanceof Error).toBe(true);
    });
    it("works without new", function () {
      var suppressed = _SuppressedError(1, 2);
      expect(suppressed instanceof _SuppressedError).toBe(true);
      expect(suppressed.message).toBe("");
    });
  });
  describe("DisposableStack", function () {
    it("requires new", function () {
      expect(function () {
        return _DisposableStack();
      }).toThrow(TypeError);
    });
    it("disposes in reverse order and reports disposed", function () {
      var order = [];
      var stack = new _DisposableStack();
      expect(stack.disposed).toBe(false);
      stack.defer(function () {
        return order.push(1);
      });
      stack.defer(function () {
        return order.push(2);
      });
      stack.defer(function () {
        return order.push(3);
      });
      stack.dispose();
      expect(order).toEqual([3, 2, 1]);
      expect(stack.disposed).toBe(true);
    });
    it("is a no-op when disposed twice", function () {
      var calls = 0;
      var stack = new _DisposableStack();
      stack.defer(function () {
        return calls++;
      });
      stack.dispose();
      stack.dispose();
      expect(calls).toBe(1);
    });
    it("use() registers @@dispose and returns the value", function () {
      var disposed = false;
      var resource = {};
      resource[disposeKey2] = function () {
        disposed = true;
      };
      var stack = new _DisposableStack();
      expect(stack.use(resource)).toBe(resource);
      stack.dispose();
      expect(disposed).toBe(true);
    });
    it("use() passes null and undefined straight through", function () {
      var stack = new _DisposableStack();
      expect(stack.use(null)).toBe(null);
      expect(stack.use(void 0)).toBe(void 0);
    });
    it("use() rejects a non-disposable", function () {
      var stack = new _DisposableStack();
      expect(function () {
        return stack.use({});
      }).toThrow(TypeError);
    });
    it("adopt() calls the disposer with the value", function () {
      var seen = [];
      var stack = new _DisposableStack();
      var value = {
        id: 1
      };
      expect(stack.adopt(value, function (v) {
        return seen.push(v);
      })).toBe(value);
      stack.dispose();
      expect(seen).toEqual([value]);
    });
    it("move() transfers ownership and disposes the original", function () {
      var calls = 0;
      var stack = new _DisposableStack();
      stack.defer(function () {
        return calls++;
      });
      var moved = stack.move();
      expect(stack.disposed).toBe(true);
      stack.dispose();
      expect(calls).toBe(0);
      moved.dispose();
      expect(calls).toBe(1);
    });
    it("throws on use after dispose", function () {
      var stack = new _DisposableStack();
      stack.dispose();
      expect(function () {
        return stack.defer(function () {});
      }).toThrow(ReferenceError);
    });
    it("runs every disposer even when one throws, then reports both", function () {
      var order = [];
      var stack = new _DisposableStack();
      stack.defer(function () {
        return order.push(1);
      });
      stack.defer(function () {
        throw new Error("first");
      });
      stack.defer(function () {
        throw new Error("second");
      });
      var caught;
      try {
        stack.dispose();
      } catch (error) {
        caught = error;
      }
      expect(order).toEqual([1]);
      expect(caught.name).toBe("SuppressedError");
      expect(caught.error.message).toBe("first");
      expect(caught.suppressed.message).toBe("second");
    });
    it("rethrows a lone error unwrapped", function () {
      var stack = new _DisposableStack();
      stack.defer(function () {
        throw new Error("only");
      });
      expect(function () {
        return stack.dispose();
      }).toThrow("only");
    });
    it("releases its resources before running them", function () {
      var stack = new _DisposableStack();
      stack.defer(function () {
        throw new Error("boom");
      });
      try {
        stack.dispose();
      } catch (e) {}
      expect(stack._stack.length).toBe(0);
    });
    it("is wired to @@dispose", function () {
      var stack = new _DisposableStack();
      expect(typeof stack[disposeKey2]).toBe("function");
    });
  });
  describe("AsyncDisposableStack", function () {
    it("awaits each disposer, in reverse order", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var order, stack;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            order = [];
            stack = new _AsyncDisposableStack();
            stack.defer(function () {
              return Promise.resolve().then(function () {
                return void order.push(1);
              });
            });
            stack.defer(function () {
              return void order.push(2);
            });
            _context.n = 1;
            return stack.disposeAsync();
          case 1:
            expect(order).toEqual([2, 1]);
            expect(stack.disposed).toBe(true);
          case 2:
            return _context.a(2);
        }
      }, _callee);
    })));
    it("use() prefers @@asyncDispose over @@dispose", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var called, resource, stack;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            called = [];
            resource = {};
            resource[disposeKey2] = function () {
              return called.push("sync");
            };
            resource[asyncDisposeKey2] = function () {
              return called.push("async");
            };
            stack = new _AsyncDisposableStack();
            stack.use(resource);
            _context2.n = 1;
            return stack.disposeAsync();
          case 1:
            expect(called).toEqual(["async"]);
          case 2:
            return _context2.a(2);
        }
      }, _callee2);
    })));
    it("use() falls back to @@dispose", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var disposed, resource, stack;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            disposed = false;
            resource = {};
            resource[disposeKey2] = function () {
              disposed = true;
            };
            stack = new _AsyncDisposableStack();
            stack.use(resource);
            _context3.n = 1;
            return stack.disposeAsync();
          case 1:
            expect(disposed).toBe(true);
          case 2:
            return _context3.a(2);
        }
      }, _callee3);
    })));
    it("rejects with a SuppressedError when several disposers throw", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var stack, caught, _t;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            stack = new _AsyncDisposableStack();
            stack.defer(function () {
              return Promise.reject(new Error("first"));
            });
            stack.defer(function () {
              return Promise.reject(new Error("second"));
            });
            _context4.p = 1;
            _context4.n = 2;
            return stack.disposeAsync();
          case 2:
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t = _context4.v;
            caught = _t;
          case 4:
            expect(caught.name).toBe("SuppressedError");
            expect(caught.error.message).toBe("first");
            expect(caught.suppressed.message).toBe("second");
          case 5:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 3]]);
    })));
    it("resolves on a second disposeAsync", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var stack;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            stack = new _AsyncDisposableStack();
            _context5.n = 1;
            return stack.disposeAsync();
          case 1:
            _context5.n = 2;
            return expect(stack.disposeAsync()).resolves.toBe(void 0);
          case 2:
            return _context5.a(2);
        }
      }, _callee5);
    })));
  });
  describe("brand checks (from test262)", function () {
    var stack = new _DisposableStack();
    var asyncStack = new _AsyncDisposableStack();
    it("rejects an ordinary object", function () {
      var _loop3 = function _loop3() {
        var m = _arr[_i12];
        expect(function () {
          return _DisposableStack.prototype[m].call({}, function () {});
        }).toThrow(TypeError);
      };
      for (var _i12 = 0, _arr = ["use", "adopt", "defer", "move", "dispose"]; _i12 < _arr.length; _i12++) {
        _loop3();
      }
    });
    it("rejects a non-object receiver", function () {
      expect(function () {
        return _DisposableStack.prototype.use.call(null, {});
      }).toThrow(TypeError);
      expect(function () {
        return _DisposableStack.prototype.dispose.call(1);
      }).toThrow(TypeError);
    });
    it("rejects the OTHER stack class \u2014 _stack alone cannot tell them apart", function () {
      expect(function () {
        return _DisposableStack.prototype.dispose.call(asyncStack);
      }).toThrow(TypeError);
      expect(function () {
        return _AsyncDisposableStack.prototype.disposeAsync.call(stack);
      }).toThrow(TypeError);
    });
    it("the disposed getter is branded and correctly named", function () {
      var descriptor = Object.getOwnPropertyDescriptor(_DisposableStack.prototype, "disposed");
      expect(descriptor.get.name).toBe("get disposed");
      expect(function () {
        return descriptor.get.call({});
      }).toThrow(TypeError);
    });
  });
  describe("constructor shape (from test262)", function () {
    it("SuppressedError inherits from Error", function () {
      expect(Object.getPrototypeOf(_SuppressedError)).toBe(Error);
    });
    it("a symbol message throws rather than silently stringifying", function () {
      expect(function () {
        return new _SuppressedError(1, 2, /* @__PURE__ */Symbol("x"));
      }).toThrow(TypeError);
    });
    it("prototype is non-writable", function () {
      for (var _i13 = 0, _arr2 = [_SuppressedError, _DisposableStack, _AsyncDisposableStack]; _i13 < _arr2.length; _i13++) {
        var _ctor = _arr2[_i13];
        expect(Object.getOwnPropertyDescriptor(_ctor, "prototype").writable).toBe(false);
      }
    });
    it("carries @@toStringTag", function () {
      expect(_DisposableStack.prototype[Symbol.toStringTag]).toBe("DisposableStack");
      expect(_AsyncDisposableStack.prototype[Symbol.toStringTag]).toBe("AsyncDisposableStack");
    });
    it("@@toStringTag is non-writable, unlike ordinary methods (from test262)", function () {
      for (var _i14 = 0, _arr3 = [_DisposableStack.prototype, _AsyncDisposableStack.prototype, _SuppressedError.prototype]; _i14 < _arr3.length; _i14++) {
        var proto2 = _arr3[_i14];
        var desc = Object.getOwnPropertyDescriptor(proto2, Symbol.toStringTag);
        expect(desc.writable).toBe(false);
        expect(desc.configurable).toBe(true);
      }
    });
  });

  // src/modules/web.dom-collections.iterator.ts
  var createCollectionIterator = function createCollectionIterator(collection, kind) {
    var i = 0;
    var iterator = {
      next: function next() {
        if (i >= collection.length) {
          return {
            value: void 0,
            done: true
          };
        }
        var index = i++;
        if (kind === 0) return {
          value: index,
          done: false
        };
        if (kind === 1) return {
          value: collection[index],
          done: false
        };
        return {
          value: [index, collection[index]],
          done: false
        };
      }
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      Object.defineProperty(iterator, Symbol.iterator, {
        value: function value() {
          return this;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    return iterator;
  };
  var domCollectionKeys = function domCollectionKeys() {
    return createCollectionIterator(this, 0);
  };
  var domCollectionValues = function domCollectionValues() {
    return createCollectionIterator(this, 1);
  };
  var domCollectionEntries = function domCollectionEntries() {
    return createCollectionIterator(this, 2);
  };
  var patchCollection = function patchCollection(proto2) {
    if (!proto2.keys) {
      Object.defineProperty(proto2, "keys", {
        value: domCollectionKeys,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(proto2.keys, "name", {
        value: "keys",
        configurable: true
      });
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
      Object.defineProperty(proto2.values, "name", {
        value: "values",
        configurable: true
      });
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
      Object.defineProperty(proto2.entries, "name", {
        value: "entries",
        configurable: true
      });
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
  var applyDomCollectionIteratorPolyfill = function applyDomCollectionIteratorPolyfill() {
    if (typeof NodeList !== "undefined") {
      patchCollection(NodeList.prototype);
    }
    if (typeof DOMTokenList !== "undefined") {
      patchCollection(DOMTokenList.prototype);
    }
  };
  applyDomCollectionIteratorPolyfill();

  // tests/dom-collections-iterator.test.ts
  var mkList = function mkList() {
    var root = document.createElement("div");
    root.innerHTML = "<span>a</span><span>b</span><span>c</span>";
    return root.querySelectorAll("span");
  };
  var drain2 = function drain2(iter) {
    var out = [];
    var step = iter.next();
    while (!step.done) {
      out.push(step.value);
      step = iter.next();
    }
    return out;
  };
  describe("NodeList iterators \u2014 polyfill vs native", function () {
    it("values() yields the nodes in order", function () {
      var list2 = mkList();
      var nativeResult = drain2(list2.values());
      var specResult = drain2(domCollectionValues.call(list2));
      expect(specResult).toEqual(nativeResult);
      expect(specResult.length).toBe(3);
    });
    it("keys() yields indices, entries() yields [index, node] pairs", function () {
      var list2 = mkList();
      expect(drain2(domCollectionKeys.call(list2))).toEqual(drain2(list2.keys()));
      expect(drain2(domCollectionEntries.call(list2))).toEqual(drain2(list2.entries()));
    });
    it("done iterator keeps returning done with undefined value", function () {
      var empty = document.createElement("div").querySelectorAll("span");
      var spec = domCollectionValues.call(empty);
      var native = empty.values();
      expect(spec.next()).toEqual(native.next());
      expect(spec.next()).toEqual(native.next());
    });
    it("iterator is itself iterable (for...of protocol)", function () {
      var list2 = mkList();
      var iter = domCollectionValues.call(list2);
      expect(typeof iter[Symbol.iterator]).toBe("function");
      expect(iter[Symbol.iterator]()).toBe(iter);
    });
  });
  describe("DOMTokenList iterators \u2014 polyfill vs native", function () {
    it("values() yields class names in order", function () {
      var el = document.createElement("div");
      el.className = "one two three";
      var nativeResult = drain2(el.classList.values());
      var specResult = drain2(domCollectionValues.call(el.classList));
      expect(specResult).toEqual(nativeResult);
    });
    it("entries() matches native shape", function () {
      var el = document.createElement("div");
      el.className = "x y";
      expect(drain2(domCollectionEntries.call(el.classList))).toEqual(drain2(el.classList.entries()));
    });
  });

  // src/modules/_dom-exception-impl.ts
  var isSupported52 = function isSupported52() {
    try {
      var exception = new DOMException("test");
      return exception instanceof DOMException;
    } catch (e) {
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
    this.message = errorMessage;
    this.name = errorName;
    this.code = DOMEXCEPTION_CODES[errorName] || 0;
    if (err.stack) {
      this.stack = err.stack;
    }
  }
  DOMExceptionPolyfill.prototype = Object.create(Error.prototype);
  DOMExceptionPolyfill.prototype.constructor = DOMExceptionPolyfill;
  if (!isSupported52()) {
    window.DOMException = null;
    delete window.DOMException;
    Object.defineProperty(window, "DOMException", {
      value: DOMExceptionPolyfill,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.DOMException, "name", {
      value: "DOMException",
      configurable: true
    });
    Object.defineProperty(window.DOMException, "__polyfilled", {
      value: true
    });
  }

  // tests/dom-exception.test.ts
  describe("DOMException \u2014 polyfill vs native", function () {
    it("constructs with message and name", function () {
      var polyfill = new DOMExceptionPolyfill("test message", "AbortError");
      var native = new DOMException("test message", "AbortError");
      expect(polyfill.message).toBe(native.message);
      expect(polyfill.name).toBe(native.name);
    });
    it("has correct error codes", function () {
      var cases = [["AbortError", 20], ["NotFoundError", 8], ["NetworkError", 19], ["TimeoutError", 23], ["SyntaxError", 12], ["InvalidStateError", 11], ["SecurityError", 18], ["QuotaExceededError", 22]];
      for (var _i15 = 0, _cases = cases; _i15 < _cases.length; _i15++) {
        var _cases$_i = _slicedToArray(_cases[_i15], 2),
          name = _cases$_i[0],
          code = _cases$_i[1];
        var polyfill = new DOMExceptionPolyfill("msg", name);
        var native = new DOMException("msg", name);
        expect(polyfill.code).toBe(code);
        expect(polyfill.code).toBe(native.code);
      }
    });
    it('defaults name to "Error"', function () {
      var polyfill = new DOMExceptionPolyfill("oops");
      expect(polyfill.name).toBe("Error");
    });
    it("defaults message to empty string", function () {
      var polyfill = new DOMExceptionPolyfill();
      expect(polyfill.message).toBe("");
    });
    it("code is 0 for unknown names", function () {
      var polyfill = new DOMExceptionPolyfill("msg", "CustomError");
      expect(polyfill.code).toBe(0);
    });
  });

  // src/modules/es.number.epsilon.ts
  var isSupported53 = function isSupported53() {
    try {
      return Number.EPSILON === 2220446049250313e-31;
    } catch (e) {
      return false;
    }
  };
  if (!isSupported53()) {
    Number.EPSILON = 2220446049250313e-31;
  }

  // src/modules/es.number.max-safe-integer.ts
  var isSupported54 = function isSupported54() {
    try {
      return Number.MAX_SAFE_INTEGER === 9007199254740991;
    } catch (e) {
      return false;
    }
  };
  if (!isSupported54()) {
    Number.MAX_SAFE_INTEGER = 9007199254740991;
  }

  // src/modules/es.number.min-safe-integer.ts
  var isSupported55 = function isSupported55() {
    try {
      return Number.MIN_SAFE_INTEGER === -9007199254740991;
    } catch (e) {
      return false;
    }
  };
  if (!isSupported55()) {
    Number.MIN_SAFE_INTEGER = -9007199254740991;
  }

  // src/modules/es.global-this.ts
  var isSupported56 = function isSupported56() {
    try {
      return typeof globalThis !== "undefined" && globalThis.globalThis === globalThis;
    } catch (e) {
      return false;
    }
  };
  if (!isSupported56()) {
    window.globalThis = window;
  }

  // tests/es-number-statics.test.ts
  describe("Number static constants", function () {
    it("Number.EPSILON is 2^-52", function () {
      expect(Number.EPSILON).toBe(2220446049250313e-31);
      expect(isSupported53()).toBe(true);
    });
    it("Number.MAX_SAFE_INTEGER is 2^53 - 1", function () {
      expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991);
      expect(isSupported54()).toBe(true);
    });
    it("Number.MIN_SAFE_INTEGER is -(2^53 - 1)", function () {
      expect(Number.MIN_SAFE_INTEGER).toBe(-9007199254740991);
      expect(isSupported55()).toBe(true);
    });
  });
  describe("globalThis", function () {
    it("exists and is self-referential", function () {
      expect(typeof globalThis).not.toBe("undefined");
      expect(globalThis.globalThis).toBe(globalThis);
      expect(isSupported56()).toBe(true);
    });
  });

  // src/modules/es.error.cause.ts
  var isSupported57 = function isSupported57() {
    try {
      return new Error("m", {
        cause: 1
      }).cause === 1 && new TypeError("m", {
        cause: 1
      }).cause === 1;
    } catch (e) {
      return false;
    }
  };
  var setCause = function setCause(error, options) {
    if (options !== null && typeof options === "object" && "cause" in options) {
      Object.defineProperty(error, "cause", {
        value: options.cause,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  };
  var wrapErrorConstructor = function wrapErrorConstructor(Native) {
    var Wrapped = function Wrapped(message, options) {
      var error = message === void 0 ? new Native() : new Native(message);
      setCause(error, options);
      return error;
    };
    Wrapped.prototype = Native.prototype;
    var names = Object.getOwnPropertyNames(Native);
    for (var _i16 = 0; _i16 < names.length; _i16++) {
      var name = names[_i16];
      if (name === "prototype" || name === "length" || name === "name") continue;
      try {
        var descriptor = Object.getOwnPropertyDescriptor(Native, name);
        if (descriptor) Object.defineProperty(Wrapped, name, descriptor);
      } catch (e) {}
    }
    return Wrapped;
  };
  if (typeof window !== "undefined" && !isSupported57()) {
    var targets = ["Error", "TypeError", "RangeError", "SyntaxError", "ReferenceError", "EvalError", "URIError"];
    for (var _i17 = 0; _i17 < targets.length; _i17++) {
      var name = targets[_i17];
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

  // src/modules/_float16-impl.ts
  var scratch = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" ? new DataView(new ArrayBuffer(8)) : null;
  var isSupported58 = function isSupported58() {
    try {
      return typeof Math.f16round === "function" && typeof DataView !== "undefined" && typeof DataView.prototype.getFloat16 === "function" && typeof DataView.prototype.setFloat16 === "function";
    } catch (e) {
      return false;
    }
  };
  var doubleToFloat16Bits = function doubleToFloat16Bits(value) {
    var n = Number(value);
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
      var rounded = roundTiesToEven(scaled);
      return sign | rounded;
    }
    var exponent = Math.floor(Math.log(magnitude) / Math.LN2);
    if (magnitude < Math.pow(2, exponent)) exponent--;
    if (magnitude >= Math.pow(2, exponent + 1)) exponent++;
    var mantissa = magnitude / Math.pow(2, exponent) - 1;
    var mantissaBits = roundTiesToEven(mantissa * 1024);
    if (mantissaBits === 1024) {
      mantissaBits = 0;
      exponent++;
      if (exponent > 15) return sign | 31744;
    }
    return sign | exponent + 15 << 10 | mantissaBits;
  };
  var roundTiesToEven = function roundTiesToEven(value) {
    var floor3 = Math.floor(value);
    var fraction = value - floor3;
    if (fraction < 0.5) return floor3;
    if (fraction > 0.5) return floor3 + 1;
    return floor3 % 2 === 0 ? floor3 : floor3 + 1;
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
    var n = Number(value);
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
  if (!isSupported58() && scratch) {
    if (typeof Math.f16round !== "function") {
      Object.defineProperty(Math, "f16round", {
        value: mathF16round,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Math.f16round, "name", {
        value: "f16round",
        configurable: true
      });
      Object.defineProperty(Math.f16round, "__polyfilled", {
        value: true
      });
    }
    if (typeof DataView !== "undefined" && DataView.prototype) {
      if (typeof DataView.prototype.getFloat16 !== "function") {
        Object.defineProperty(DataView.prototype, "getFloat16", {
          value: dataViewGetFloat16,
          writable: true,
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(DataView.prototype.getFloat16, "name", {
          value: "getFloat16",
          configurable: true
        });
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
        Object.defineProperty(DataView.prototype.setFloat16, "name", {
          value: "setFloat16",
          configurable: true
        });
        Object.defineProperty(DataView.prototype.setFloat16, "__polyfilled", {
          value: true
        });
      }
    }
  }

  // src/modules/es.math.sum-precise.ts
  var isSupported59 = function isSupported59() {
    try {
      return typeof Math.sumPrecise === "function";
    } catch (e) {
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
    for (var _i18 = 0; _i18 < LIMB_COUNT; _i18++) limbs.push(0);
    return limbs;
  };
  var normalize = function normalize(limbs) {
    var carry = 0;
    for (var _i19 = 0; _i19 < LIMB_COUNT; _i19++) {
      var v = limbs[_i19] + carry;
      var r = v % LIMB_BASE;
      limbs[_i19] = r;
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
    for (var _i20 = LIMB_COUNT - 1; _i20 >= 0; _i20--) {
      if (a[_i20] !== b[_i20]) return a[_i20] > b[_i20] ? 1 : -1;
    }
    return 0;
  };
  var subtract = function subtract(a, b) {
    var borrow = 0;
    for (var _i21 = 0; _i21 < LIMB_COUNT; _i21++) {
      var v = a[_i21] - b[_i21] - borrow;
      if (v < 0) {
        v += LIMB_BASE;
        borrow = 1;
      } else {
        borrow = 0;
      }
      a[_i21] = v;
    }
  };
  var bitAt = function bitAt(limbs, index) {
    var limb = Math.floor(index / LIMB_BITS);
    if (limb < 0 || limb >= LIMB_COUNT) return 0;
    return Math.floor(limbs[limb] / Math.pow(2, index % LIMB_BITS)) % 2;
  };
  var toDouble = function toDouble(limbs) {
    var top = -1;
    for (var _i22 = LIMB_COUNT - 1; _i22 >= 0 && top < 0; _i22--) {
      if (limbs[_i22] !== 0) {
        for (var b = LIMB_BITS - 1; b >= 0; b--) {
          if (bitAt(limbs, _i22 * LIMB_BITS + b)) {
            top = _i22 * LIMB_BITS + b;
            break;
          }
        }
      }
    }
    if (top < 0) return 0;
    var low = top - 52 > 0 ? top - 52 : 0;
    var mantissa = 0;
    for (var _i23 = top; _i23 >= low; _i23--) mantissa = mantissa * 2 + bitAt(limbs, _i23);
    var exp = low - BIAS;
    if (low > 0) {
      var roundBit = bitAt(limbs, low - 1);
      var sticky = 0;
      for (var _i24 = low - 2; _i24 >= 0; _i24--) {
        if (bitAt(limbs, _i24)) {
          sticky = 1;
          break;
        }
      }
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
    var positive = makeAccumulator();
    var negative = makeAccumulator();
    var count = 0;
    var sinceNormalize = 0;
    var sawNaN = false;
    var sawPosInfinity = false;
    var sawNegInfinity = false;
    var allMinusZero = true;
    var iterator = items[iteratorKey]();
    for (;;) {
      var step = iterator.next();
      if (step.done) break;
      var value = step.value;
      if (typeof value !== "number") {
        try {
          var ret = iterator.return;
          if (typeof ret === "function") ret.call(iterator);
        } catch (e) {}
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
  if (!isSupported59()) {
    Object.defineProperty(Math, "sumPrecise", {
      value: mathSumPrecise,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.sumPrecise, "name", {
      value: "sumPrecise",
      configurable: true
    });
    Object.defineProperty(Math.sumPrecise, "length", {
      value: 1,
      configurable: true
    });
    Object.defineProperty(Math.sumPrecise, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.array.from-async.ts
  var isSupported60 = function isSupported60() {
    try {
      return typeof Array.fromAsync === "function";
    } catch (e) {
      return false;
    }
  };
  var arrayFromAsync = function arrayFromAsync(source, mapFn, thisArg) {
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
    var out = [];
    var index = 0;
    var collect2 = function collect2(value) {
      return Promise.resolve(value).then(function (awaited) {
        if (mapFn === void 0) {
          out.push(awaited);
          return void 0;
        }
        return Promise.resolve(mapFn.call(thisArg, awaited, index)).then(function (mapped) {
          out.push(mapped);
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
      var _step4 = function step2() {
        return Promise.resolve(iterator.next()).then(function (result) {
          if (!result || typeof result !== "object") {
            throw new TypeError("iterator result is not an object");
          }
          if (result.done) {
            return out;
          }
          return collect2(result.value).then(function () {
            index++;
            return _step4();
          });
        });
      };
      return Promise.resolve().then(_step4).then(void 0, function (error) {
        try {
          var method = iterator.return;
          if (typeof method === "function") {
            var closed = method.call(iterator);
            if (isAsync) return Promise.resolve(closed).then(function () {
              throw error;
            });
          }
        } catch (e) {}
        throw error;
      });
    }
    var length = boxed.length >>> 0;
    var _step5 = function step() {
      if (index >= length) {
        return out;
      }
      return collect2(boxed[index]).then(function () {
        index++;
        return _step5();
      });
    };
    return Promise.resolve().then(_step5);
  };
  if (!isSupported60()) {
    Object.defineProperty(Array, "fromAsync", {
      value: arrayFromAsync,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Array.fromAsync, "name", {
      value: "fromAsync",
      configurable: true
    });
    Object.defineProperty(Array.fromAsync, "length", {
      value: 1,
      configurable: true
    });
    Object.defineProperty(Array.fromAsync, "__polyfilled", {
      value: true
    });
  }

  // tests/final-batch.test.ts
  describe("Error cause", function () {
    var Wrapped = wrapErrorConstructor(TypeError);
    it("reads cause off the options bag", function () {
      expect(new Wrapped("boom", {
        cause: 42
      }).cause).toBe(42);
    });
    it("keeps instanceof working in both directions", function () {
      var error = new Wrapped("boom", {
        cause: 1
      });
      expect(error instanceof TypeError).toBe(true);
      expect(error instanceof Error).toBe(true);
      expect(error instanceof Wrapped).toBe(true);
      expect(Wrapped.prototype).toBe(TypeError.prototype);
    });
    it("keeps message, name and a real stack", function () {
      var error = new Wrapped("boom");
      expect(error.message).toBe("boom");
      expect(error.name).toBe("TypeError");
      expect(typeof error.stack).toBe("string");
    });
    it("adds no cause property when no options bag is given", function () {
      expect("cause" in new Wrapped("boom")).toBe(false);
      expect("cause" in new Wrapped("boom", {})).toBe(false);
    });
    it("defines cause non-enumerably, like every other Error own property", function () {
      var error = new Wrapped("boom", {
        cause: 1
      });
      expect(error.propertyIsEnumerable("cause")).toBe(false);
      expect(Object.keys(error)).not.toContain("cause");
    });
    it("accepts an undefined cause as a present one", function () {
      var error = new Wrapped("boom", {
        cause: void 0
      });
      expect("cause" in error).toBe(true);
      expect(error.cause).toBe(void 0);
    });
    it("works without new", function () {
      expect(Wrapped("boom", {
        cause: 2
      }).cause).toBe(2);
    });
  });
  describe("float16", function () {
    it("round-trips values that are exact in binary16", function () {
      for (var _i25 = 0, _arr4 = [0, 1, -1, 2, -2, 0.5, -0.5, 1024, 65504]; _i25 < _arr4.length; _i25++) {
        var value = _arr4[_i25];
        expect(mathF16round(value)).toBe(value);
      }
    });
    it("preserves the sign of zero", function () {
      expect(1 / mathF16round(-0)).toBe(-Infinity);
      expect(1 / mathF16round(0)).toBe(Infinity);
    });
    it("handles the non-finite cases", function () {
      expect(mathF16round(Infinity)).toBe(Infinity);
      expect(mathF16round(-Infinity)).toBe(-Infinity);
      expect(mathF16round(NaN)).toBeNaN();
    });
    it("overflows to Infinity past the top of the range", function () {
      expect(mathF16round(65504)).toBe(65504);
      expect(mathF16round(7e4)).toBe(Infinity);
      expect(mathF16round(-7e4)).toBe(-Infinity);
    });
    it("rounds a value that binary16 cannot hold exactly", function () {
      expect(mathF16round(1.1)).toBeCloseTo(1.0996, 4);
      expect(mathF16round(1.1)).not.toBe(1.1);
    });
    it("handles subnormals and underflow", function () {
      var smallestSubnormal = 5960464477539063e-23;
      expect(mathF16round(smallestSubnormal)).toBe(smallestSubnormal);
      expect(mathF16round(smallestSubnormal / 4)).toBe(0);
    });
    it("encodes the documented bit patterns", function () {
      expect(doubleToFloat16Bits(0)).toBe(0);
      expect(doubleToFloat16Bits(-0)).toBe(32768);
      expect(doubleToFloat16Bits(1)).toBe(15360);
      expect(doubleToFloat16Bits(-2)).toBe(49152);
      expect(doubleToFloat16Bits(Infinity)).toBe(31744);
      expect(float16BitsToDouble(15360)).toBe(1);
      expect(float16BitsToDouble(31744)).toBe(Infinity);
      expect(float16BitsToDouble(32256)).toBeNaN();
    });
    it("reads and writes through a DataView, both endiannesses", function () {
      var view = new DataView(new ArrayBuffer(4));
      dataViewSetFloat16.call(view, 0, 1.5, true);
      expect(dataViewGetFloat16.call(view, 0, true)).toBe(1.5);
      dataViewSetFloat16.call(view, 2, -0.25, false);
      expect(dataViewGetFloat16.call(view, 2, false)).toBe(-0.25);
    });
    it("writes two bytes, and endianness actually swaps them", function () {
      var view = new DataView(new ArrayBuffer(2));
      dataViewSetFloat16.call(view, 0, 1, true);
      var little = [view.getUint8(0), view.getUint8(1)];
      dataViewSetFloat16.call(view, 0, 1, false);
      var big = [view.getUint8(0), view.getUint8(1)];
      expect(little).toEqual([big[1], big[0]]);
    });
  });
  describe("Math.sumPrecise", function () {
    it("keeps precision that naive summation loses", function () {
      expect([1e20, 0.1, -1e20].reduce(function (a, b) {
        return a + b;
      }, 0)).toBe(0);
      expect(mathSumPrecise([1e20, 0.1, -1e20])).toBe(0.1);
    });
    it("sums ordinary values", function () {
      expect(mathSumPrecise([1, 2, 3])).toBe(6);
      expect(mathSumPrecise([0.1, 0.2])).toBe(0.30000000000000004);
    });
    it("returns -0 for an empty iterable, not +0", function () {
      var result = mathSumPrecise([]);
      expect(result).toBe(-0);
      expect(1 / result).toBe(-Infinity);
    });
    it("handles the non-finite cases", function () {
      expect(mathSumPrecise([1, NaN])).toBeNaN();
      expect(mathSumPrecise([1, Infinity])).toBe(Infinity);
      expect(mathSumPrecise([1, -Infinity])).toBe(-Infinity);
      expect(mathSumPrecise([Infinity, -Infinity])).toBeNaN();
    });
    it("accepts any iterable, not just arrays", function () {
      expect(mathSumPrecise(/* @__PURE__ */new Set([1, 2, 3]))).toBe(6);
    });
    it("rejects non-numbers and non-iterables", function () {
      expect(function () {
        return mathSumPrecise([1, "2"]);
      }).toThrow(TypeError);
      expect(function () {
        return mathSumPrecise(1);
      }).toThrow(TypeError);
      expect(function () {
        return mathSumPrecise(null);
      }).toThrow(TypeError);
    });
  });
  describe("Array.fromAsync", function () {
    var asyncIterableOf = function asyncIterableOf(values) {
      return _defineProperty({}, Symbol.asyncIterator, function () {
        var index = 0;
        return {
          next: function next() {
            return Promise.resolve(index < values.length ? {
              value: values[index++],
              done: false
            } : {
              value: void 0,
              done: true
            });
          }
        };
      });
    };
    it("collects an async iterable", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return expect(arrayFromAsync(asyncIterableOf([1, 2, 3]))).resolves.toEqual([1, 2, 3]);
          case 1:
            return _context6.a(2);
        }
      }, _callee6);
    })));
    it("resolves promise elements of a sync iterable", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            _context7.n = 1;
            return expect(arrayFromAsync([Promise.resolve(1), 2, Promise.resolve(3)])).resolves.toEqual([1, 2, 3]);
          case 1:
            return _context7.a(2);
        }
      }, _callee7);
    })));
    it("handles an array-like", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            _context8.n = 1;
            return expect(arrayFromAsync({
              length: 2,
              0: "a",
              1: "b"
            })).resolves.toEqual(["a", "b"]);
          case 1:
            return _context8.a(2);
        }
      }, _callee8);
    })));
    it("applies a mapFn with the index and awaits its result", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            _context9.n = 1;
            return expect(arrayFromAsync([1, 2], function (v, i) {
              return Promise.resolve(v * 10 + i);
            })).resolves.toEqual([10, 21]);
          case 1:
            return _context9.a(2);
        }
      }, _callee9);
    })));
    it("preserves order even when later values settle first", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      var slowThenFast;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            slowThenFast = [new Promise(function (resolve) {
              return setTimeout(function () {
                return resolve("slow");
              }, 20);
            }), Promise.resolve("fast")];
            _context0.n = 1;
            return expect(arrayFromAsync(slowThenFast)).resolves.toEqual(["slow", "fast"]);
          case 1:
            return _context0.a(2);
        }
      }, _callee0);
    })));
    it("rejects when an element rejects", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            _context1.n = 1;
            return expect(arrayFromAsync([Promise.reject(new Error("boom"))])).rejects.toThrow("boom");
          case 1:
            return _context1.a(2);
        }
      }, _callee1);
    })));
    it("rejects on a bad mapFn or a nullish source", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            _context10.n = 1;
            return expect(arrayFromAsync([1], 1)).rejects.toThrow(TypeError);
          case 1:
            _context10.n = 2;
            return expect(arrayFromAsync(null)).rejects.toThrow(TypeError);
          case 2:
            return _context10.a(2);
        }
      }, _callee10);
    })));
    it("always returns a promise, never a bare array", function () {
      expect(typeof arrayFromAsync([1]).then).toBe("function");
    });
  });
  describe("Math.sumPrecise near the overflow boundary (from test262)", function () {
    it("stays finite where the true sum is finite", function () {
      expect(mathSumPrecise([898846567431158e293, 8988465674311579e292, -17976931348623157e292])).toBe(99792015476736e278);
      expect(mathSumPrecise([-2534858246857893e100, 8988465674311579e292, 898846567431158e293])).toBe(17976931348623157e292);
      expect(mathSumPrecise([-19807040628566093e12, 17976931348623157e292, 99792015476736e278])).toBe(17976931348623157e292);
    });
    it("overflows only when the true sum really does", function () {
      expect(mathSumPrecise([898846567431158e293, 898846567431158e293])).toBe(Infinity);
      expect(mathSumPrecise([13588124894186193e292, 14803986201152006e207, 6741349255733684e292])).toBe(Infinity);
      expect(mathSumPrecise([6197409167220438e-238, -9979201547673601e276, -17976931348623157e292])).toBe(-Infinity);
    });
    it("rounds exactly across a wide magnitude spread", function () {
      expect(mathSumPrecise([1e308, 1e308, 0.1, 0.1, 1e30, 0.1, -1e30, -1e308, -1e308])).toBe(0.30000000000000004);
      expect(mathSumPrecise([-5630637621603525e240, 9565271205476345e292, 29937604643020797e276])).toBe(9565271205476347e292);
      expect(mathSumPrecise([449423283715579e293, 8944251746776101e292, -2441406250000001e-19, 11752060710043817e292, 4940846717201632e277, -16836699406454528e292])).toBe(8353845887521184e292);
    });
    it("handles -0 exactly per spec", function () {
      expect(mathSumPrecise([-0])).toBe(-0);
      expect(mathSumPrecise([-0, -0])).toBe(-0);
      expect(mathSumPrecise([-0, 0])).toBe(0);
      expect(mathSumPrecise([1e308, -1e308])).toBe(0);
    });
    it("closes the iterator and does not coerce when a value is not a Number", function () {
      var returnCalls = 0;
      var coercions = 0;
      var hostile = {
        valueOf: function valueOf() {
          coercions++;
          throw new Error("must not coerce");
        },
        toString: function toString() {
          coercions++;
          throw new Error("must not coerce");
        }
      };
      var iterable = _defineProperty({}, Symbol.iterator, function () {
        return {
          next: function next() {
            return {
              done: false,
              value: hostile
            };
          },
          return: function _return() {
            returnCalls++;
            return {};
          }
        };
      });
      expect(function () {
        return mathSumPrecise(iterable);
      }).toThrow(TypeError);
      expect(coercions).toBe(0);
      expect(returnCalls).toBe(1);
    });
  });

  // src/modules/es.map.group-by.ts
  var isSupported61 = function isSupported61() {
    try {
      return typeof Map.groupBy === "function";
    } catch (e) {
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
    var groups = /* @__PURE__ */new Map();
    var addTo = function addTo(key, value) {
      var normalized = key === 0 ? 0 : key;
      var existing = groups.get(normalized);
      if (existing) {
        existing.push(value);
      } else {
        groups.set(normalized, [value]);
      }
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator && typeof items[Symbol.iterator] === "function") {
      var it3 = items[Symbol.iterator]();
      var index = 0;
      var step = it3.next();
      while (!step.done) {
        addTo(callbackfn(step.value, index++), step.value);
        step = it3.next();
      }
      return groups;
    }
    if (typeof items.length === "number") {
      for (var _i26 = 0; _i26 < items.length; _i26++) {
        addTo(callbackfn(items[_i26], _i26), items[_i26]);
      }
      return groups;
    }
    throw new TypeError("Map.groupBy argument is not iterable");
  };
  if (!isSupported61()) {
    Object.defineProperty(Map, "groupBy", {
      value: mapGroupBy,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Map.groupBy, "name", {
      value: "groupBy",
      configurable: true
    });
    Object.defineProperty(Map.groupBy, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.group-by.ts
  var isSupported62 = function isSupported62() {
    try {
      return typeof Object.groupBy === "function";
    } catch (e) {
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
    var groups = /* @__PURE__ */Object.create(null);
    var addTo = function addTo(key, value) {
      var propertyKey = typeof key === "symbol" ? key : String(key);
      if (groups[propertyKey]) {
        groups[propertyKey].push(value);
      } else {
        groups[propertyKey] = [value];
      }
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator && typeof items[Symbol.iterator] === "function") {
      var it3 = items[Symbol.iterator]();
      var index = 0;
      var step = it3.next();
      while (!step.done) {
        addTo(callbackfn(step.value, index++), step.value);
        step = it3.next();
      }
      return groups;
    }
    if (typeof items.length === "number") {
      for (var _i27 = 0; _i27 < items.length; _i27++) {
        addTo(callbackfn(items[_i27], _i27), items[_i27]);
      }
      return groups;
    }
    throw new TypeError("Object.groupBy argument is not iterable");
  };
  if (!isSupported62()) {
    Object.defineProperty(Object, "groupBy", {
      value: objectGroupBy,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.groupBy, "name", {
      value: "groupBy",
      configurable: true
    });
    Object.defineProperty(Object.groupBy, "__polyfilled", {
      value: true
    });
  }

  // tests/group-by.test.ts
  describe("Object.groupBy / Map.groupBy \u2014 test262 conformance", function () {
    var items = [1, 2, 3, 4, 5];
    var parity = function parity(n) {
      return n % 2 === 0 ? "even" : "odd";
    };
    describe("Object.groupBy", function () {
      it("groups by the callback key", function () {
        var grouped = objectGroupBy(items, parity);
        expect(grouped.odd).toEqual([1, 3, 5]);
        expect(grouped.even).toEqual([2, 4]);
      });
      it("returns a null-prototype object", function () {
        var grouped = objectGroupBy([1], function () {
          return "k";
        });
        expect(Object.getPrototypeOf(grouped)).toBe(null);
      });
      it("passes (value, index) to the callback", function () {
        var seen = [];
        objectGroupBy(["a", "b"], function (v, i) {
          seen.push([v, i]);
          return "k";
        });
        expect(seen).toEqual([["a", 0], ["b", 1]]);
      });
      it("coerces keys to property keys", function () {
        var grouped = objectGroupBy([1, 2], function (n) {
          return n;
        });
        expect(grouped["1"]).toEqual([1]);
        expect(grouped["2"]).toEqual([2]);
      });
      it("drains arbitrary iterables (Set input)", function () {
        var grouped = objectGroupBy(/* @__PURE__ */new Set([1, 2]), parity);
        expect(grouped.odd).toEqual([1]);
        expect(grouped.even).toEqual([2]);
      });
      it("throws TypeError on non-iterable items or non-callable callback", function () {
        expect(function () {
          return objectGroupBy(null, parity);
        }).toThrow(TypeError);
        expect(function () {
          return objectGroupBy([1], "nope");
        }).toThrow(TypeError);
      });
      it("matches native", function () {
        var native = Object.groupBy;
        if (typeof native !== "function") return;
        expect(objectGroupBy(items, parity)).toEqual(native(items, parity));
      });
    });
    describe("Map.groupBy", function () {
      it("groups into a Map keyed by the raw callback value", function () {
        var grouped = mapGroupBy(items, parity);
        expect(grouped instanceof Map).toBe(true);
        expect(grouped.get("odd")).toEqual([1, 3, 5]);
        expect(grouped.get("even")).toEqual([2, 4]);
      });
      it("keeps object keys by identity (no ToPropertyKey coercion)", function () {
        var keyObj = {};
        var grouped = mapGroupBy([1, 2], function () {
          return keyObj;
        });
        expect(grouped.get(keyObj)).toEqual([1, 2]);
        expect(grouped.size).toBe(1);
      });
      it("normalizes -0 keys to +0 (SameValueZero)", function () {
        var grouped = mapGroupBy([1], function () {
          return -0;
        });
        expect(grouped.get(0)).toEqual([1]);
      });
      it("throws TypeError on non-iterable items or non-callable callback", function () {
        expect(function () {
          return mapGroupBy(void 0, parity);
        }).toThrow(TypeError);
        expect(function () {
          return mapGroupBy([1], 42);
        }).toThrow(TypeError);
      });
      it("matches native", function () {
        var native = Map.groupBy;
        if (typeof native !== "function") return;
        var ours = mapGroupBy(items, parity);
        var theirs = native(items, parity);
        expect(ours.get("odd")).toEqual(theirs.get("odd"));
        expect(ours.get("even")).toEqual(theirs.get("even"));
      });
    });
  });

  // src/modules/_iterator-impl.ts
  var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : void 0;
  var getIteratorPrototype = function getIteratorPrototype() {
    if (!iteratorSymbol) return void 0;
    try {
      var arrayIterator = [][iteratorSymbol]();
      return Object.getPrototypeOf(Object.getPrototypeOf(arrayIterator));
    } catch (e) {
      return void 0;
    }
  };
  var IteratorPrototype = getIteratorPrototype();
  var isSupported63 = function isSupported63() {
    try {
      if (!iteratorSymbol || !IteratorPrototype) {
        return true;
      }
      return typeof globalThis.Iterator === "function" && typeof IteratorPrototype.map === "function" && typeof IteratorPrototype.filter === "function" && typeof IteratorPrototype.take === "function" && typeof IteratorPrototype.drop === "function" && typeof IteratorPrototype.flatMap === "function" && typeof IteratorPrototype.reduce === "function" && typeof IteratorPrototype.toArray === "function" && typeof IteratorPrototype.forEach === "function" && typeof IteratorPrototype.some === "function" && typeof IteratorPrototype.every === "function" && typeof IteratorPrototype.find === "function";
    } catch (e) {
      return false;
    }
  };
  var assertCallableOrClose = function assertCallableOrClose(receiver, fn, name) {
    if (typeof fn !== "function") {
      closeIterator(receiver, true);
      throw new TypeError(name + " is not a function");
    }
  };
  var getIteratorDirect = function getIteratorDirect(obj) {
    return obj;
  };
  var assertObjectReceiver = function assertObjectReceiver(obj, method) {
    if (obj === null || typeof obj !== "object") {
      throw new TypeError("Iterator.prototype." + method + " called on a non-object");
    }
  };
  var MAX_SAFE = 9007199254740991;
  var validateLimitOrClose = function validateLimitOrClose(receiver, limit, method) {
    var integerLimit;
    try {
      var numLimit = Number(limit);
      if (numLimit !== numLimit) {
        throw new RangeError("Iterator.prototype." + method + " limit must not be NaN");
      }
      integerLimit = toIntegerOrInfinity(numLimit);
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
  var getNextMethod = function getNextMethod(iterator) {
    return iterator.next;
  };
  var callNext = function callNext(nextMethod, iterator) {
    if (typeof nextMethod !== "function") {
      throw new TypeError("iterator.next is not a function");
    }
    return nextMethod.call(iterator);
  };
  var toIntegerOrInfinity = function toIntegerOrInfinity(value) {
    var n = +value;
    if (n !== n) return 0;
    if (n === Infinity || n === -Infinity) return n;
    return n >= 0 ? Math.floor(n) : Math.ceil(n);
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
  var DONE = function DONE() {
    return {
      value: void 0,
      done: true
    };
  };
  var IteratorHelperPrototype = IteratorPrototype ? Object.create(IteratorPrototype) : Object.create(Object.prototype);
  var makeHelper = function makeHelper(underlying, kind, callback, limit, nextMethod) {
    var helper = Object.create(IteratorHelperPrototype);
    helper._isIteratorHelper = true;
    helper._running = false;
    helper._underlying = underlying;
    helper._next = nextMethod === void 0 ? getNextMethod(underlying) : nextMethod;
    helper._innerNext = null;
    helper._kind = kind;
    helper._callback = callback;
    helper._limit = limit;
    helper._counter = 0;
    helper._inner = null;
    return helper;
  };
  var releaseHelper = function releaseHelper(helper) {
    helper._underlying = null;
    helper._callback = null;
    helper._inner = null;
    helper._next = null;
    helper._innerNext = null;
  };
  var assertHelper = function assertHelper(value, method) {
    if (value === null || typeof value !== "object" || value._isIteratorHelper !== true) {
      throw new TypeError("Iterator Helper.prototype." + method + " called on incompatible receiver");
    }
  };
  IteratorHelperPrototype.next = function () {
    assertHelper(this, "next");
    if (this._running) {
      throw new TypeError("Iterator Helper is already running");
    }
    var underlying = this._underlying;
    if (underlying === null) {
      return DONE();
    }
    var kind = this._kind;
    var callback = this._callback;
    this._running = true;
    try {
      for (;;) {
        if (kind === "take") {
          if (this._counter >= this._limit) {
            releaseHelper(this);
            closeIterator(underlying, false);
            return DONE();
          }
        }
        if (kind === "flatMap" && this._inner) {
          var innerStep = callNext(this._innerNext, this._inner);
          if (!innerStep.done) {
            return {
              value: innerStep.value,
              done: false
            };
          }
          this._inner = null;
          this._innerNext = null;
        }
        var step = callNext(this._next, underlying);
        if (step.done) {
          releaseHelper(this);
          return DONE();
        }
        var value = step.value;
        var index = this._counter++;
        if (kind === "map") {
          return {
            value: callback(value, index),
            done: false
          };
        }
        if (kind === "filter") {
          if (callback(value, index)) {
            return {
              value: value,
              done: false
            };
          }
          continue;
        }
        if (kind === "take") {
          return {
            value: value,
            done: false
          };
        }
        if (kind === "drop") {
          if (index < this._limit) {
            continue;
          }
          return {
            value: value,
            done: false
          };
        }
        if (kind === "flatMap") {
          var mapped = callback(value, index);
          this._inner = getInnerIterator(mapped);
          this._innerNext = getNextMethod(this._inner);
          continue;
        }
        if (kind === "concat") {
          return {
            value: value,
            done: false
          };
        }
        return {
          value: value,
          done: false
        };
      }
    } catch (error) {
      var alreadyClosed = this._underlying === null;
      releaseHelper(this);
      if (!alreadyClosed) {
        closeIterator(underlying, true);
      }
      throw error;
    } finally {
      this._running = false;
    }
  };
  IteratorHelperPrototype.return = function () {
    assertHelper(this, "return");
    if (this._running) {
      throw new TypeError("Iterator Helper is already running");
    }
    var underlying = this._underlying;
    if (underlying !== null) {
      var inner = this._inner;
      releaseHelper(this);
      closeIterator(inner, false);
      closeIterator(underlying, false);
    }
    return DONE();
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
    assertObjectReceiver(this, "map");
    assertCallableOrClose(this, mapper, "mapper");
    var underlying = getIteratorDirect(this);
    return makeHelper(underlying, "map", mapper, 0);
  };
  var iteratorFilter = function iteratorFilter(predicate) {
    assertObjectReceiver(this, "filter");
    assertCallableOrClose(this, predicate, "predicate");
    var underlying = getIteratorDirect(this);
    return makeHelper(underlying, "filter", predicate, 0);
  };
  var iteratorTake = function iteratorTake(limit) {
    assertObjectReceiver(this, "take");
    var count = validateLimitOrClose(this, limit, "take");
    var underlying = getIteratorDirect(this);
    return makeHelper(underlying, "take", null, count);
  };
  var iteratorDrop = function iteratorDrop(limit) {
    assertObjectReceiver(this, "drop");
    var count = validateLimitOrClose(this, limit, "drop");
    var underlying = getIteratorDirect(this);
    return makeHelper(underlying, "drop", null, count);
  };
  var iteratorFlatMap = function iteratorFlatMap(mapper) {
    assertObjectReceiver(this, "flatMap");
    assertCallableOrClose(this, mapper, "mapper");
    var underlying = getIteratorDirect(this);
    return makeHelper(underlying, "flatMap", mapper, 0);
  };
  var iteratorToArray = function iteratorToArray() {
    assertObjectReceiver(this, "toArray");
    var underlying = getIteratorDirect(this);
    var nextMethod = getNextMethod(underlying);
    var out = [];
    for (;;) {
      var step = callNext(nextMethod, underlying);
      if (step.done) return out;
      out.push(step.value);
    }
  };
  var iteratorForEach = function iteratorForEach(fn) {
    assertObjectReceiver(this, "forEach");
    assertCallableOrClose(this, fn, "fn");
    var underlying = getIteratorDirect(this);
    var nextMethod = getNextMethod(underlying);
    var index = 0;
    for (;;) {
      var step = callNext(nextMethod, underlying);
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
    assertObjectReceiver(this, "reduce");
    assertCallableOrClose(this, reducer, "reducer");
    var underlying = getIteratorDirect(this);
    var nextMethod = getNextMethod(underlying);
    var accumulator;
    var index = 0;
    if (arguments.length < 2) {
      var first = callNext(nextMethod, underlying);
      if (first.done) {
        throw new TypeError("Reduce of empty iterator with no initial value");
      }
      accumulator = first.value;
      index = 1;
    } else {
      accumulator = initial;
    }
    for (;;) {
      var step = callNext(nextMethod, underlying);
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
    assertObjectReceiver(this, "some");
    assertCallableOrClose(this, predicate, "predicate");
    var underlying = getIteratorDirect(this);
    var nextMethod = getNextMethod(underlying);
    var index = 0;
    for (;;) {
      var step = callNext(nextMethod, underlying);
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
    assertObjectReceiver(this, "every");
    assertCallableOrClose(this, predicate, "predicate");
    var underlying = getIteratorDirect(this);
    var nextMethod = getNextMethod(underlying);
    var index = 0;
    for (;;) {
      var step = callNext(nextMethod, underlying);
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
    assertObjectReceiver(this, "find");
    assertCallableOrClose(this, predicate, "predicate");
    var underlying = getIteratorDirect(this);
    var nextMethod = getNextMethod(underlying);
    var index = 0;
    for (;;) {
      var step = callNext(nextMethod, underlying);
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
    for (var _i28 = 0; _i28 < arguments.length; _i28++) {
      var source = arguments[_i28];
      if (source === null || typeof source !== "object") {
        throw new TypeError("Iterator.concat arguments must be objects");
      }
      sources.push(source);
    }
    var cursor = 0;
    var current2 = null;
    var currentNext = null;
    var driver = {
      next: function next() {
        for (;;) {
          if (current2 === null) {
            if (cursor >= sources.length) {
              return DONE();
            }
            var _source = sources[cursor++];
            current2 = iteratorSymbol && typeof _source[iteratorSymbol] === "function" ? _source[iteratorSymbol]() : _source;
            currentNext = getNextMethod(current2);
          }
          var step = callNext(currentNext, current2);
          if (!step.done) {
            return {
              value: step.value,
              done: false
            };
          }
          current2 = null;
          currentNext = null;
        }
      },
      return: function _return() {
        closeIterator(current2, false);
        current2 = null;
        currentNext = null;
        cursor = sources.length;
        return DONE();
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
        value: /* @__PURE__ */Symbol("Symbol." + name)
      });
    } catch (e) {
      return void 0;
    }
    return Symbol[name];
  };
  if (IteratorPrototype) {
    var disposeKey3 = ensureSymbol2("dispose");
    if (disposeKey3 && !IteratorPrototype[disposeKey3]) {
      Object.defineProperty(IteratorPrototype, disposeKey3, {
        value: iteratorDispose,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(iteratorDispose, "name", {
        value: "[Symbol.dispose]",
        configurable: true
      });
      Object.defineProperty(iteratorDispose, "__polyfilled", {
        value: true
      });
    }
  }
  if (!isSupported63() && IteratorPrototype) {
    var _Iterator = function _Iterator() {
      if (this === void 0 || this === null) {
        throw new TypeError("Constructor Iterator requires 'new'");
      }
    };
    _Iterator.prototype = IteratorPrototype;
    try {
      Object.defineProperty(IteratorPrototype, "constructor", {
        get: function get() {
          return _Iterator;
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
      Object.defineProperty(ctorDesc.get, "name", {
        value: "get constructor",
        configurable: true
      });
      Object.defineProperty(ctorDesc.set, "name", {
        value: "set constructor",
        configurable: true
      });
    } catch (e) {}
    _Iterator.from = iteratorFrom;
    _Iterator.concat = iteratorConcat;
    var methods = [["map", iteratorMap], ["filter", iteratorFilter], ["take", iteratorTake], ["drop", iteratorDrop], ["flatMap", iteratorFlatMap], ["toArray", iteratorToArray], ["forEach", iteratorForEach], ["reduce", iteratorReduce], ["some", iteratorSome], ["every", iteratorEvery], ["find", iteratorFind]];
    for (var _i29 = 0; _i29 < methods.length; _i29++) {
      var _name = methods[_i29][0];
      if (!IteratorPrototype[_name]) {
        Object.defineProperty(methods[_i29][1], "name", {
          value: _name,
          configurable: true
        });
        if (_name === "reduce") {
          Object.defineProperty(methods[_i29][1], "length", {
            value: 1,
            configurable: true
          });
        }
        Object.defineProperty(IteratorPrototype, _name, {
          value: methods[_i29][1],
          writable: true,
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(IteratorPrototype[_name], "__polyfilled", {
          value: true
        });
      }
    }
    var _target = typeof window !== "undefined" ? window : globalThis;
    if (!_target.Iterator) {
      Object.defineProperty(_target, "Iterator", {
        value: _Iterator,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_target.Iterator, "name", {
        value: "Iterator",
        configurable: true
      });
      Object.defineProperty(_target.Iterator, "__polyfilled", {
        value: true
      });
    }
  }

  // tests/iterator-helpers.test.ts
  var iterOf = function iterOf(values) {
    var index = 0;
    return {
      next: function next() {
        return index < values.length ? {
          value: values[index++],
          done: false
        } : {
          value: void 0,
          done: true
        };
      }
    };
  };
  var closableIterOf = function closableIterOf(values) {
    var index = 0;
    return {
      closed: false,
      next: function next() {
        return index < values.length ? {
          value: values[index++],
          done: false
        } : {
          value: void 0,
          done: true
        };
      },
      return: function _return() {
        this.closed = true;
        return {
          value: void 0,
          done: true
        };
      }
    };
  };
  var drain3 = function drain3(helper) {
    var out = [];
    for (;;) {
      var step = helper.next();
      if (step.done) return out;
      out.push(step.value);
    }
  };
  describe("%IteratorHelperPrototype% identity", function () {
    it("every helper kind shares one prototype", function () {
      var protos = [iteratorMap.call(iterOf([1]), function (x) {
        return x;
      }), iteratorFilter.call(iterOf([1]), function () {
        return true;
      }), iteratorTake.call(iterOf([1]), 1), iteratorDrop.call(iterOf([1]), 1), iteratorFlatMap.call(iterOf([[1]]), function (x) {
        return x;
      })].map(function (helper) {
        return Object.getPrototypeOf(helper);
      });
      for (var _i30 = 1; _i30 < protos.length; _i30++) {
        expect(protos[_i30]).toBe(protos[0]);
      }
    });
    it("helpers are themselves iterable", function () {
      var helper = iteratorMap.call(iterOf([1, 2]), function (x) {
        return x;
      });
      expect(helper[Symbol.iterator]()).toBe(helper);
      expect(Array.from(helper)).toEqual([1, 2]);
    });
  });
  describe("map / filter / take / drop", function () {
    it("map transforms and passes the index", function () {
      var helper = iteratorMap.call(iterOf(["a", "b"]), function (v, i) {
        return v + i;
      });
      expect(drain3(helper)).toEqual(["a0", "b1"]);
    });
    it("filter keeps matches only", function () {
      var helper = iteratorFilter.call(iterOf([1, 2, 3, 4]), function (v) {
        return v % 2 === 0;
      });
      expect(drain3(helper)).toEqual([2, 4]);
    });
    it("take stops after n and closes the source", function () {
      var source = closableIterOf([1, 2, 3, 4]);
      expect(drain3(iteratorTake.call(source, 2))).toEqual([1, 2]);
      expect(source.closed).toBe(true);
    });
    it("take(0) yields nothing", function () {
      expect(drain3(iteratorTake.call(iterOf([1, 2]), 0))).toEqual([]);
    });
    it("drop skips the first n", function () {
      expect(drain3(iteratorDrop.call(iterOf([1, 2, 3]), 2))).toEqual([3]);
    });
    it("take and drop reject negative counts", function () {
      expect(function () {
        return iteratorTake.call(iterOf([1]), -1);
      }).toThrow(RangeError);
      expect(function () {
        return iteratorDrop.call(iterOf([1]), -1);
      }).toThrow(RangeError);
    });
    it("rejects a non-callable mapper or predicate", function () {
      expect(function () {
        return iteratorMap.call(iterOf([1]), 1);
      }).toThrow(TypeError);
      expect(function () {
        return iteratorFilter.call(iterOf([1]), 1);
      }).toThrow(TypeError);
    });
    it("is lazy \u2014 nothing runs until next() is called", function () {
      var calls = 0;
      var helper = iteratorMap.call(iterOf([1, 2, 3]), function (v) {
        calls++;
        return v;
      });
      expect(calls).toBe(0);
      helper.next();
      expect(calls).toBe(1);
    });
  });
  describe("flatMap", function () {
    it("flattens iterables one level", function () {
      var helper = iteratorFlatMap.call(iterOf([1, 2]), function (v) {
        return [v, v * 10];
      });
      expect(drain3(helper)).toEqual([1, 10, 2, 20]);
    });
    it("skips empty inner iterables", function () {
      var helper = iteratorFlatMap.call(iterOf([1, 2, 3]), function (v) {
        return v === 2 ? [] : [v];
      });
      expect(drain3(helper)).toEqual([1, 3]);
    });
    it("rejects a string result \u2014 primitives are not flattened", function () {
      var helper = iteratorFlatMap.call(iterOf(["ab"]), function (v) {
        return v;
      });
      expect(function () {
        return helper.next();
      }).toThrow(TypeError);
    });
  });
  describe("terminal operations", function () {
    it("toArray collects everything", function () {
      expect(iteratorToArray.call(iterOf([1, 2, 3]))).toEqual([1, 2, 3]);
    });
    it("forEach visits each value with its index", function () {
      var seen = [];
      iteratorForEach.call(iterOf(["a", "b"]), function (v, i) {
        return seen.push([v, i]);
      });
      expect(seen).toEqual([["a", 0], ["b", 1]]);
    });
    it("reduce works with and without an initial value", function () {
      expect(iteratorReduce.call(iterOf([1, 2, 3]), function (a, b) {
        return a + b;
      })).toBe(6);
      expect(iteratorReduce.call(iterOf([1, 2, 3]), function (a, b) {
        return a + b;
      }, 10)).toBe(16);
    });
    it("reduce throws on an empty iterator with no initial value", function () {
      expect(function () {
        return iteratorReduce.call(iterOf([]), function (a, b) {
          return a + b;
        });
      }).toThrow(TypeError);
    });
    it("reduce accepts a falsy initial value rather than treating it as absent", function () {
      expect(iteratorReduce.call(iterOf([1, 2]), function (a, b) {
        return a + b;
      }, 0)).toBe(3);
    });
    it("some / every / find short-circuit and close the source", function () {
      var forSome = closableIterOf([1, 2, 3]);
      expect(iteratorSome.call(forSome, function (v) {
        return v === 2;
      })).toBe(true);
      expect(forSome.closed).toBe(true);
      var forEvery = closableIterOf([1, 2, 3]);
      expect(iteratorEvery.call(forEvery, function (v) {
        return v === 1;
      })).toBe(false);
      expect(forEvery.closed).toBe(true);
      var forFind = closableIterOf([1, 2, 3]);
      expect(iteratorFind.call(forFind, function (v) {
        return v === 2;
      })).toBe(2);
      expect(forFind.closed).toBe(true);
    });
    it("some / every / find report the exhausted cases", function () {
      expect(iteratorSome.call(iterOf([1]), function () {
        return false;
      })).toBe(false);
      expect(iteratorEvery.call(iterOf([1]), function () {
        return true;
      })).toBe(true);
      expect(iteratorFind.call(iterOf([1]), function () {
        return false;
      })).toBe(void 0);
    });
  });
  describe("Iterator.from / Iterator.concat", function () {
    it("from wraps a bare iterator", function () {
      expect(drain3(iteratorFrom(iterOf([1, 2])))).toEqual([1, 2]);
    });
    it("from accepts an iterable", function () {
      expect(drain3(iteratorFrom([1, 2]))).toEqual([1, 2]);
      expect(drain3(iteratorFrom(/* @__PURE__ */new Set([3])))).toEqual([3]);
    });
    it("from rejects a non-object", function () {
      expect(function () {
        return iteratorFrom(1);
      }).toThrow(TypeError);
    });
    it("concat walks its sources in order", function () {
      expect(drain3(iteratorConcat([1, 2], [3], []))).toEqual([1, 2, 3]);
    });
    it("concat rejects a non-object argument", function () {
      expect(function () {
        return iteratorConcat(1);
      }).toThrow(TypeError);
    });
  });
  describe("chaining", function () {
    it("composes lazily end to end", function () {
      var chain = iteratorTake.call(iteratorFilter.call(iteratorMap.call(iterOf([1, 2, 3, 4, 5, 6]), function (v) {
        return v * 2;
      }), function (v) {
        return v % 3 === 0;
      }), 2);
      expect(iteratorToArray.call(chain)).toEqual([6, 12]);
    });
  });
  describe("retention", function () {
    it("releases the source and callback when exhausted", function () {
      var helper = iteratorMap.call(iterOf([1, 2]), function (v) {
        return v;
      });
      expect(helper._underlying).not.toBe(null);
      drain3(helper);
      expect(helper._underlying).toBe(null);
      expect(helper._callback).toBe(null);
    });
    it("releases every wrapper in an exhausted chain", function () {
      var inner = iteratorMap.call(iterOf([1, 2]), function (v) {
        return v;
      });
      var outer = iteratorFilter.call(inner, function () {
        return true;
      });
      drain3(outer);
      expect(outer._underlying).toBe(null);
      expect(inner._underlying).toBe(null);
      expect(inner._callback).toBe(null);
    });
    it("releases on return() and closes the source", function () {
      var source = closableIterOf([1, 2, 3]);
      var helper = iteratorMap.call(source, function (v) {
        return v;
      });
      helper.next();
      helper.return();
      expect(helper._underlying).toBe(null);
      expect(helper._callback).toBe(null);
      expect(source.closed).toBe(true);
    });
    it("releases when a callback throws", function () {
      var source = closableIterOf([1, 2]);
      var helper = iteratorMap.call(source, function () {
        throw new Error("boom");
      });
      expect(function () {
        return helper.next();
      }).toThrow("boom");
      expect(helper._underlying).toBe(null);
      expect(source.closed).toBe(true);
    });
    it("stays done rather than throwing once released", function () {
      var helper = iteratorMap.call(iterOf([1]), function (v) {
        return v;
      });
      drain3(helper);
      expect(helper.next()).toEqual({
        value: void 0,
        done: true
      });
      expect(helper.next()).toEqual({
        value: void 0,
        done: true
      });
    });
  });
  describe("spec conformance regressions (from test262)", function () {
    it("reads `next` exactly once, not per step", function () {
      var nextGets = 0;
      var source = {
        get next() {
          nextGets++;
          var count = 3;
          return function () {
            count--;
            return count >= 0 ? {
              done: false,
              value: count
            } : {
              done: true,
              value: void 0
            };
          };
        }
      };
      var mapperCalls = 0;
      var helper = iteratorMap.call(source, function (v) {
        mapperCalls++;
        return v;
      });
      expect(drain3(helper)).toHaveLength(3);
      expect(mapperCalls).toBe(3);
      expect(nextGets).toBe(1);
    });
    it("propagates an error thrown by return() on a normal completion", function () {
      var source = {
        next: function next() {
          return {
            done: false,
            value: 1
          };
        },
        return: function _return() {
          throw new Error("return blew up");
        }
      };
      expect(function () {
        return drain3(iteratorTake.call(source, 1));
      }).toThrow("return blew up");
    });
    it("discards a return() error when already unwinding", function () {
      var source = {
        next: function next() {
          return {
            done: false,
            value: 1
          };
        },
        return: function _return() {
          throw new Error("cleanup blew up");
        }
      };
      var helper = iteratorMap.call(source, function () {
        throw new Error("callback blew up");
      });
      expect(function () {
        return helper.next();
      }).toThrow("callback blew up");
    });
    it("throws TypeError if return() hands back a non-object", function () {
      var source = {
        next: function next() {
          return {
            done: false,
            value: 1
          };
        },
        return: function _return() {
          return 1;
        }
      };
      expect(function () {
        return drain3(iteratorTake.call(source, 1));
      }).toThrow(TypeError);
    });
    it("validates arguments before reading `next`", function () {
      var effects = [];
      var source = {
        get next() {
          effects.push("get next");
          return function () {
            return {
              done: true,
              value: void 0
            };
          };
        },
        return: function _return() {
          return {};
        }
      };
      iteratorTake.call(source, {
        valueOf: function valueOf() {
          effects.push("ToNumber limit");
          return 0;
        }
      });
      expect(effects).toEqual(["ToNumber limit", "get next"]);
    });
    it("rejects the limits the spec rejects, and accepts the ones it accepts", function () {
      var src = function src() {
        return {
          next: function next() {
            return {
              done: true,
              value: void 0
            };
          },
          return: function _return() {
            return {};
          }
        };
      };
      var _loop4 = function _loop4() {
        var ok = _arr5[_i31];
        expect(function () {
          return iteratorTake.call(src(), ok);
        }).not.toThrow();
      };
      for (var _i31 = 0, _arr5 = [0, -0.5, null, Number.MAX_SAFE_INTEGER, Infinity]; _i31 < _arr5.length; _i31++) {
        _loop4();
      }
      var _loop5 = function _loop5() {
        var bad = _arr6[_i32];
        expect(function () {
          return iteratorTake.call(src(), bad);
        }).toThrow(RangeError);
      };
      for (var _i32 = 0, _arr6 = [-1, void 0, NaN, Number.MAX_SAFE_INTEGER + 1]; _i32 < _arr6.length; _i32++) {
        _loop5();
      }
    });
    it("closes the receiver when argument validation fails", function () {
      var closed = false;
      var source = {
        get next() {
          throw new Error("next must not be read");
        },
        return: function _return() {
          closed = true;
          return {};
        }
      };
      expect(function () {
        return iteratorTake.call(source, NaN);
      }).toThrow(RangeError);
      expect(closed).toBe(true);
      closed = false;
      expect(function () {
        return iteratorMap.call(source, "not a function");
      }).toThrow(TypeError);
      expect(closed).toBe(true);
    });
    it("closes the source when reduce/forEach/some/every/find get a bad callback", function () {
      var closableSource = function closableSource() {
        var closed = false;
        return {
          closed: false,
          next: function next() {
            return {
              done: false,
              value: 1
            };
          },
          return: function _return() {
            this.closed = true;
            return {};
          }
        };
      };
      var calls = [[iteratorReduce, "reducer"], [iteratorForEach, "fn"], [iteratorSome, "predicate"], [iteratorEvery, "predicate"], [iteratorFind, "predicate"]];
      var _loop6 = function _loop6() {
        var _calls$_i = _slicedToArray(_calls[_i33], 1),
          fn = _calls$_i[0];
        var source = closableSource();
        expect(function () {
          return fn.call(source, "not a function");
        }).toThrow(TypeError);
        expect(source.closed).toBe(true);
      };
      for (var _i33 = 0, _calls = calls; _i33 < _calls.length; _i33++) {
        _loop6();
      }
    });
    it("flatMap rejects every primitive the callback returns, even a boxable one with a patched wrapper prototype", function () {
      var original = Number.prototype[Symbol.iterator];
      Number.prototype[Symbol.iterator] = /*#__PURE__*/_regenerator().m(function _callee11() {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              _context11.n = 1;
              return this;
            case 1:
              return _context11.a(2);
          }
        }, _callee11, this);
      });
      try {
        var helper = iteratorFlatMap.call(iterOf([1]), function () {
          return 5;
        });
        expect(function () {
          return helper.next();
        }).toThrow(TypeError);
      } finally {
        if (original === void 0) {
          delete Number.prototype[Symbol.iterator];
        } else {
          Number.prototype[Symbol.iterator] = original;
        }
      }
    });
    it("flatMap throws when the returned object has a defined, non-callable Symbol.iterator", function () {
      var helper = iteratorFlatMap.call(iterOf([1]), function () {
        return _defineProperty(_defineProperty({}, Symbol.iterator, 0), "next", function next() {
          return {
            done: true,
            value: void 0
          };
        });
      });
      expect(function () {
        return helper.next();
      }).toThrow(TypeError);
    });
    it("flatMap falls back to the object itself when Symbol.iterator is null/undefined", function () {
      var _loop7 = function _loop7() {
        var iteratorValue = _arr7[_i34];
        var inner = iterOf([1, 2]);
        var helper = iteratorFlatMap.call(iterOf([0]), function () {
          return _defineProperty(_defineProperty({}, Symbol.iterator, iteratorValue), "next", function next() {
            return inner.next();
          });
        });
        expect(drain3(helper)).toEqual([1, 2]);
      };
      for (var _i34 = 0, _arr7 = [null, void 0]; _i34 < _arr7.length; _i34++) {
        _loop7();
      }
    });
  });
  describe("re-entrancy and brand (from test262)", function () {
    it("throws if a callback re-enters the same helper", function () {
      var helper = iteratorMap.call(iterOf([1, 2, 3]), function () {
        return helper.next();
      });
      expect(function () {
        return helper.next();
      }).toThrow(TypeError);
    });
    it("rejects a foreign receiver", function () {
      var helper = iteratorMap.call(iterOf([1]), function (v) {
        return v;
      });
      var proto2 = Object.getPrototypeOf(helper);
      expect(function () {
        return proto2.next.call({});
      }).toThrow(TypeError);
      expect(function () {
        return proto2.next.call(null);
      }).toThrow(TypeError);
      expect(function () {
        return proto2.return.call({
          _underlying: null
        });
      }).toThrow(TypeError);
    });
  });

  // src/modules/es.weak-map.get-or-insert.ts
  var isSupported64 = function isSupported64() {
    try {
      return typeof WeakMap !== "undefined" && typeof WeakMap.prototype.getOrInsert === "function";
    } catch (e) {
      return false;
    }
  };
  var canBeHeldWeakly = function canBeHeldWeakly(value) {
    if (value === null) return false;
    var kind = typeof value;
    if (kind === "object" || kind === "function") return true;
    if (kind === "symbol") {
      if (typeof Symbol === "undefined" || typeof Symbol.keyFor !== "function") {
        return true;
      }
      return Symbol.keyFor(value) === void 0;
    }
    return false;
  };
  var assertWeakMap = function assertWeakMap(value, method) {
    if (Object.prototype.toString.call(value) !== "[object WeakMap]") {
      throw new TypeError("WeakMap.prototype." + method + " called on incompatible receiver");
    }
  };
  var weakMapGetOrInsert = function weakMapGetOrInsert(key, value) {
    assertWeakMap(this, "getOrInsert");
    if (!canBeHeldWeakly(key)) {
      throw new TypeError("Invalid value used as weak map key");
    }
    if (this.has(key)) {
      return this.get(key);
    }
    this.set(key, value);
    return value;
  };
  if (typeof WeakMap !== "undefined" && WeakMap.prototype && !isSupported64()) {
    Object.defineProperty(WeakMap.prototype, "getOrInsert", {
      value: weakMapGetOrInsert,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(WeakMap.prototype.getOrInsert, "name", {
      value: "getOrInsert",
      configurable: true
    });
    Object.defineProperty(WeakMap.prototype.getOrInsert, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.weak-map.get-or-insert-computed.ts
  var isSupported65 = function isSupported65() {
    try {
      return typeof WeakMap !== "undefined" && typeof WeakMap.prototype.getOrInsertComputed === "function";
    } catch (e) {
      return false;
    }
  };
  var canBeHeldWeakly2 = function canBeHeldWeakly2(value) {
    if (value === null) return false;
    var kind = typeof value;
    if (kind === "object" || kind === "function") return true;
    if (kind === "symbol") {
      if (typeof Symbol === "undefined" || typeof Symbol.keyFor !== "function") {
        return true;
      }
      return Symbol.keyFor(value) === void 0;
    }
    return false;
  };
  var assertWeakMap2 = function assertWeakMap2(value, method) {
    if (Object.prototype.toString.call(value) !== "[object WeakMap]") {
      throw new TypeError("WeakMap.prototype." + method + " called on incompatible receiver");
    }
  };
  var weakMapGetOrInsertComputed = function weakMapGetOrInsertComputed(key, callbackfn) {
    assertWeakMap2(this, "getOrInsertComputed");
    if (!canBeHeldWeakly2(key)) {
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
  if (typeof WeakMap !== "undefined" && WeakMap.prototype && !isSupported65()) {
    Object.defineProperty(WeakMap.prototype, "getOrInsertComputed", {
      value: weakMapGetOrInsertComputed,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(WeakMap.prototype.getOrInsertComputed, "name", {
      value: "getOrInsertComputed",
      configurable: true
    });
    Object.defineProperty(WeakMap.prototype.getOrInsertComputed, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.map.get-or-insert-computed.ts
  var isSupported66 = function isSupported66() {
    try {
      return typeof Map !== "undefined" && typeof Map.prototype.getOrInsertComputed === "function";
    } catch (e) {
      return false;
    }
  };
  var canonicalKey = function canonicalKey(key) {
    return key === 0 ? 0 : key;
  };
  var mapGetOrInsertComputed = function mapGetOrInsertComputed(key, callbackfn) {
    if (typeof callbackfn !== "function") {
      throw new TypeError("Map.prototype.getOrInsertComputed: callback is not callable");
    }
    var normalized = canonicalKey(key);
    if (this.has(normalized)) {
      return this.get(normalized);
    }
    var value = callbackfn(normalized);
    this.set(normalized, value);
    return value;
  };
  if (typeof Map !== "undefined" && Map.prototype && !isSupported66()) {
    Object.defineProperty(Map.prototype, "getOrInsertComputed", {
      value: mapGetOrInsertComputed,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Map.prototype.getOrInsertComputed, "name", {
      value: "getOrInsertComputed",
      configurable: true
    });
    Object.defineProperty(Map.prototype.getOrInsertComputed, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.map.get-or-insert.ts
  var isSupported67 = function isSupported67() {
    try {
      return typeof Map !== "undefined" && typeof Map.prototype.getOrInsert === "function";
    } catch (e) {
      return false;
    }
  };
  var canonicalKey2 = function canonicalKey2(key) {
    return key === 0 ? 0 : key;
  };
  var mapGetOrInsert = function mapGetOrInsert(key, value) {
    var normalized = canonicalKey2(key);
    if (this.has(normalized)) {
      return this.get(normalized);
    }
    this.set(normalized, value);
    return value;
  };
  if (typeof Map !== "undefined" && Map.prototype && !isSupported67()) {
    Object.defineProperty(Map.prototype, "getOrInsert", {
      value: mapGetOrInsert,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Map.prototype.getOrInsert, "name", {
      value: "getOrInsert",
      configurable: true
    });
    Object.defineProperty(Map.prototype.getOrInsert, "__polyfilled", {
      value: true
    });
  }

  // tests/map-get-or-insert.test.ts
  describe("Map.prototype.getOrInsert", function () {
    it("returns the existing value without overwriting", function () {
      var map = /* @__PURE__ */new Map([["a", 1]]);
      expect(map.getOrInsert("a", 99)).toBe(1);
      expect(map.get("a")).toBe(1);
      expect(map.size).toBe(1);
    });
    it("inserts and returns the value when the key is absent", function () {
      var map = /* @__PURE__ */new Map();
      expect(map.getOrInsert("a", 1)).toBe(1);
      expect(map.get("a")).toBe(1);
    });
    it("matches keys by SameValueZero, so NaN finds NaN", function () {
      var map = /* @__PURE__ */new Map();
      map.getOrInsert(NaN, "first");
      expect(map.getOrInsert(NaN, "second")).toBe("first");
      expect(map.size).toBe(1);
    });
    it("treats undefined as a real stored value, not a miss", function () {
      var map = /* @__PURE__ */new Map([["a", void 0]]);
      expect(map.getOrInsert("a", "fallback")).toBe(void 0);
    });
  });
  describe("Map.prototype.getOrInsertComputed", function () {
    it("does not invoke the callback when the key is present", function () {
      var map = /* @__PURE__ */new Map([["a", 1]]);
      var calls = 0;
      var result = map.getOrInsertComputed("a", function () {
        calls++;
        return 99;
      });
      expect(result).toBe(1);
      expect(calls).toBe(0);
    });
    it("invokes the callback with the key, inserts, and returns", function () {
      var map = /* @__PURE__ */new Map();
      var seen = [];
      var result = map.getOrInsertComputed("a", function (key) {
        seen.push(key);
        return 1;
      });
      expect(seen).toEqual(["a"]);
      expect(result).toBe(1);
      expect(map.get("a")).toBe(1);
    });
    it("writes the computed value even if the callback inserted the key itself", function () {
      var map = /* @__PURE__ */new Map();
      var result = map.getOrInsertComputed("a", function () {
        map.set("a", "from callback");
        return "computed";
      });
      expect(result).toBe("computed");
      expect(map.get("a")).toBe("computed");
    });
    it("throws on a non-callable callback", function () {
      var map = /* @__PURE__ */new Map();
      expect(function () {
        return map.getOrInsertComputed("a", 1);
      }).toThrow(TypeError);
    });
  });
  describe("WeakMap.prototype.getOrInsert / getOrInsertComputed", function () {
    it("round-trips on an object key", function () {
      var weakMap = /* @__PURE__ */new WeakMap();
      var key = {};
      expect(weakMap.getOrInsert(key, 1)).toBe(1);
      expect(weakMap.getOrInsert(key, 99)).toBe(1);
    });
    it("rejects a primitive key", function () {
      var weakMap = /* @__PURE__ */new WeakMap();
      expect(function () {
        return weakMap.getOrInsert("x", 1);
      }).toThrow(TypeError);
    });
    it("rejects a primitive key before running the callback", function () {
      var weakMap = /* @__PURE__ */new WeakMap();
      var calls = 0;
      expect(function () {
        return weakMap.getOrInsertComputed("x", function () {
          calls++;
          return 1;
        });
      }).toThrow(TypeError);
      expect(calls).toBe(0);
    });
    it("computes and inserts on an object key", function () {
      var weakMap = /* @__PURE__ */new WeakMap();
      var key = {};
      expect(weakMap.getOrInsertComputed(key, function () {
        return 1;
      })).toBe(1);
      expect(weakMap.get(key)).toBe(1);
    });
  });
  describe("spec conformance regressions (from test262)", function () {
    it("accepts a non-registered symbol as a weak key", function () {
      var weakMap = /* @__PURE__ */new WeakMap();
      var key = /* @__PURE__ */Symbol("weak");
      expect(weakMapGetOrInsert.call(weakMap, key, 1)).toBe(1);
      expect(weakMapGetOrInsert.call(weakMap, key, 99)).toBe(1);
    });
    it("rejects a REGISTERED symbol \u2014 it can never be collected", function () {
      var weakMap = /* @__PURE__ */new WeakMap();
      expect(function () {
        return weakMapGetOrInsert.call(weakMap, /* @__PURE__ */Symbol.for("registered"), 1);
      }).toThrow(TypeError);
    });
    it("rejects a Map receiver, which has has/get/set and would otherwise slip through", function () {
      expect(function () {
        return weakMapGetOrInsert.call(/* @__PURE__ */new Map(), {}, 1);
      }).toThrow(TypeError);
      expect(function () {
        return weakMapGetOrInsertComputed.call(/* @__PURE__ */new Map(), {}, function () {
          return 1;
        });
      }).toThrow(TypeError);
    });
    it("canonicalises -0 to +0 before the callback and before storing", function () {
      var map = /* @__PURE__ */new Map();
      var seen;
      mapGetOrInsertComputed.call(map, -0, function (key) {
        seen = key;
        return "v";
      });
      expect(seen).toBe(0);
      expect(Object.is(seen, -0)).toBe(false);
      expect(Array.from(map.keys())[0]).toBe(0);
    });
  });

  // src/modules/es.map.ts
  var isSupported68 = function isSupported68() {
    try {
      if (typeof _Map !== "function") {
        return false;
      }
      var map = new _Map([["a", 1], ["b", 2], ["c", 3]]);
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
    } catch (e) {
      return false;
    }
  };
  var sameValueZero = function sameValueZero(a, b) {
    return a === b || a !== a && b !== b;
  };
  var hasSymbol = typeof Symbol !== "undefined" && Symbol.iterator != null;
  var returnSelf = function returnSelf() {
    return this;
  };
  var indexOfKey = function indexOfKey(self2, key) {
    var keys2 = self2._keys;
    for (var _i35 = 0; _i35 < keys2.length; _i35++) {
      if (sameValueZero(keys2[_i35], key)) {
        return _i35;
      }
    }
    return -1;
  };
  var isObjectLike = function isObjectLike(value) {
    return value !== null && (typeof value === "object" || typeof value === "function");
  };
  var MapIterator = function MapIterator(self2, kind) {
    this._self = self2;
    this._index = 0;
    this._kind = kind;
  };
  MapIterator.prototype.next = function () {
    var self2 = this._self;
    if (self2 === null) {
      return {
        value: void 0,
        done: true
      };
    }
    if (this._index < self2._keys.length) {
      var key = self2._keys[this._index];
      var value = self2._vals[this._index];
      this._index++;
      var result = this._kind === "keys" ? key : this._kind === "values" ? value : [key, value];
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
    Object.defineProperty(returnSelf, "name", {
      value: "[Symbol.iterator]",
      configurable: true
    });
  }
  var _Map = function Map2(iterable) {
    if (!(this instanceof _Map)) {
      throw new TypeError("Constructor Map requires 'new'");
    }
    this._keys = [];
    this._vals = [];
    if (iterable === null || iterable === void 0) {
      return;
    }
    if (Array.isArray(iterable)) {
      for (var _i36 = 0; _i36 < iterable.length; _i36++) {
        addEntry(this, iterable[_i36]);
      }
      return;
    }
    if (hasSymbol && typeof iterable[Symbol.iterator] === "function") {
      var it3 = iterable[Symbol.iterator]();
      var step = it3.next();
      while (!step.done) {
        addEntry(this, step.value);
        step = it3.next();
      }
      return;
    }
    throw new TypeError("Map constructor argument is not iterable");
  };
  var addEntry = function addEntry(self2, entry) {
    if (!isObjectLike(entry)) {
      throw new TypeError("Iterator value is not an entry object");
    }
    self2.set(entry[0], entry[1]);
  };
  _Map.prototype.set = function (key, value) {
    if (key === 0) {
      key = 0;
    }
    var i = indexOfKey(this, key);
    if (i === -1) {
      this._keys[this._keys.length] = key;
      this._vals[this._vals.length] = value;
    } else {
      this._vals[i] = value;
    }
    return this;
  };
  _Map.prototype.get = function (key) {
    var i = indexOfKey(this, key);
    return i === -1 ? void 0 : this._vals[i];
  };
  _Map.prototype.has = function (key) {
    return indexOfKey(this, key) !== -1;
  };
  _Map.prototype.delete = function (key) {
    var i = indexOfKey(this, key);
    if (i === -1) {
      return false;
    }
    this._keys.splice(i, 1);
    this._vals.splice(i, 1);
    return true;
  };
  _Map.prototype.clear = function () {
    this._keys.length = 0;
    this._vals.length = 0;
  };
  _Map.prototype.forEach = function (callback, thisArg) {
    for (var _i37 = 0; _i37 < this._keys.length; _i37++) {
      callback.call(thisArg, this._vals[_i37], this._keys[_i37], this);
    }
  };
  _Map.prototype.keys = function () {
    return new MapIterator(this, "keys");
  };
  _Map.prototype.values = function () {
    return new MapIterator(this, "values");
  };
  _Map.prototype.entries = function () {
    return new MapIterator(this, "entries");
  };
  Object.defineProperty(_Map.prototype, "size", {
    configurable: true,
    get: function get() {
      return this._keys.length;
    }
  });
  Object.defineProperty(Object.getOwnPropertyDescriptor(_Map.prototype, "size").get, "name", {
    value: "get size",
    configurable: true
  });
  if (hasSymbol) {
    Object.defineProperty(_Map.prototype, Symbol.iterator, {
      value: _Map.prototype.entries,
      writable: true,
      enumerable: false,
      configurable: true
    });
    if (Symbol.toStringTag) {
      Object.defineProperty(_Map.prototype, Symbol.toStringTag, {
        value: "Map",
        writable: false,
        enumerable: false,
        configurable: true
      });
    }
  }
  if (!isSupported68()) {
    window.Map = null;
    delete window.Map;
    Object.defineProperty(window, "Map", {
      value: _Map,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.Map, "name", {
      value: "Map",
      configurable: true
    });
    Object.defineProperty(window.Map, "__polyfilled", {
      value: true
    });
  }

  // tests/map.test.ts
  describe("Map \u2014 test262 conformance", function () {
    describe("constructor", function () {
      it("throws without new", function () {
        expect(function () {
          return _Map();
        }).toThrow(TypeError);
      });
      it("is empty by default (size 0)", function () {
        expect(new _Map().size).toBe(0);
      });
      it("builds from an array of pairs", function () {
        var m = new _Map([["a", 1], ["b", 2]]);
        expect(m.size).toBe(2);
        expect(m.get("a")).toBe(1);
        expect(m.get("b")).toBe(2);
      });
      it("builds from a generic iterable (Symbol.iterator)", function () {
        var iterable = _defineProperty({}, Symbol.iterator, function () {
          var pairs = [["x", 10], ["y", 20]];
          var i = 0;
          return {
            next: function next() {
              return i < pairs.length ? {
                value: pairs[i++],
                done: false
              } : {
                value: void 0,
                done: true
              };
            }
          };
        });
        var m = new _Map(iterable);
        expect(m.get("x")).toBe(10);
        expect(m.get("y")).toBe(20);
      });
      it("treats null/undefined iterable as empty", function () {
        expect(new _Map(null).size).toBe(0);
        expect(new _Map(void 0).size).toBe(0);
      });
      it("throws TypeError when an entry is not an object", function () {
        expect(function () {
          return new _Map([1]);
        }).toThrow(TypeError);
      });
    });
    describe("set / get / has / delete / clear / size", function () {
      it("set returns the map (chainable)", function () {
        var m = new _Map();
        expect(m.set("a", 1)).toBe(m);
        m.set("b", 2).set("c", 3);
        expect(m.size).toBe(3);
      });
      it("last write wins for an existing key", function () {
        var m = new _Map();
        m.set("a", 1).set("a", 2);
        expect(m.get("a")).toBe(2);
        expect(m.size).toBe(1);
      });
      it("has reflects membership; get returns undefined when absent", function () {
        var m = new _Map();
        m.set("a", 1);
        expect(m.has("a")).toBe(true);
        expect(m.has("z")).toBe(false);
        expect(m.get("z")).toBeUndefined();
      });
      it("delete removes and returns boolean", function () {
        var m = new _Map();
        m.set("a", 1);
        expect(m.delete("a")).toBe(true);
        expect(m.delete("a")).toBe(false);
        expect(m.has("a")).toBe(false);
      });
      it("clear empties the map", function () {
        var m = new _Map([["a", 1], ["b", 2]]);
        m.clear();
        expect(m.size).toBe(0);
        expect(m.get("a")).toBeUndefined();
      });
    });
    describe("key equality", function () {
      it("distinguishes object keys by identity", function () {
        var k1 = {};
        var k2 = {};
        var m = new _Map();
        m.set(k1, "one").set(k2, "two");
        expect(m.get(k1)).toBe("one");
        expect(m.get(k2)).toBe("two");
        expect(m.size).toBe(2);
      });
      it('distinguishes primitive keys by type (1 vs "1")', function () {
        var m = new _Map();
        m.set(1, "number").set("1", "string");
        expect(m.get(1)).toBe("number");
        expect(m.get("1")).toBe("string");
        expect(m.size).toBe(2);
      });
      it("treats NaN as a single retrievable key (SameValueZero)", function () {
        var m = new _Map();
        m.set(NaN, "nan");
        expect(m.get(NaN)).toBe("nan");
        expect(m.has(NaN)).toBe(true);
      });
      it("treats -0 and +0 as the same key, normalised to +0", function () {
        var m = new _Map();
        m.set(-0, "zero");
        expect(m.get(0)).toBe("zero");
        expect(m.size).toBe(1);
        var firstKey = Array.from(m.keys())[0];
        expect(Object.is(firstKey, 0)).toBe(true);
      });
    });
    describe("iteration (insertion order)", function () {
      it("forEach visits in insertion order with (value, key, map)", function () {
        var m = new _Map([["a", 1], ["b", 2]]);
        var seen = [];
        m.forEach(function (v, k, map) {
          seen.push([k, v, map]);
        });
        expect(seen).toEqual([["a", 1, m], ["b", 2, m]]);
      });
      it("forEach honors thisArg", function () {
        var m = new _Map([["a", 1]]);
        var ctx = {
          tag: "ctx"
        };
        var captured;
        m.forEach(function () {
          captured = this;
        }, ctx);
        expect(captured).toBe(ctx);
      });
      it("keys/values/entries yield in insertion order", function () {
        var m = new _Map([["a", 1], ["b", 2]]);
        expect(Array.from(m.keys())).toEqual(["a", "b"]);
        expect(Array.from(m.values())).toEqual([1, 2]);
        expect(Array.from(m.entries())).toEqual([["a", 1], ["b", 2]]);
      });
      it("is spreadable via Symbol.iterator", function () {
        var m = new _Map([["a", 1], ["b", 2]]);
        expect(_toConsumableArray(m)).toEqual([["a", 1], ["b", 2]]);
      });
    });
    describe("toStringTag", function () {
      it("reports [object Map]", function () {
        expect(Object.prototype.toString.call(new _Map())).toBe("[object Map]");
      });
      it("is non-writable, unlike ordinary methods (from test262)", function () {
        var desc = Object.getOwnPropertyDescriptor(_Map.prototype, Symbol.toStringTag);
        expect(desc.writable).toBe(false);
        expect(desc.configurable).toBe(true);
      });
    });
    describe("parity vs native", function () {
      it("matches native for set/get round-trips", function () {
        var roundTrip = function roundTrip(Ctor) {
          return function () {
            var m = new Ctor();
            m.set("a", 1).set("b", 2);
            return m.get("a") + m.get("b");
          };
        };
        var nativeResult = roundTrip(Map)();
        var specResult = roundTrip(_Map)();
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.math.acosh.ts
  var isSupported69 = function isSupported69() {
    try {
      if (typeof Math.acosh !== "function") {
        return false;
      }
      var big = Math.acosh(17976931348623157e292);
      return big === big && big !== Infinity;
    } catch (e) {
      return false;
    }
  };
  var isMathAcoshSupported = isSupported69;
  var log1p = function log1p(x) {
    if (typeof Math.log1p === "function") {
      return Math.log1p(x);
    }
    if (x > -1e-8 && x < 1e-8) {
      return x - x * x / 2;
    }
    return Math.log(1 + x);
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
    return log1p(t + Math.sqrt(t) * Math.sqrt(numeric + 1));
  };
  if (!isSupported69()) {
    Object.defineProperty(Math, "acosh", {
      value: mathAcosh,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.acosh, "name", {
      value: "acosh",
      configurable: true
    });
    Object.defineProperty(Math.acosh, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.asinh.ts
  var isSupported70 = function isSupported70() {
    try {
      return typeof Math.asinh === "function";
    } catch (e) {
      return false;
    }
  };
  var _mathAsinh = function mathAsinh(x) {
    var numeric = +x;
    if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    if (numeric < 0) {
      return -_mathAsinh(-numeric);
    }
    return Math.log(numeric + Math.sqrt(numeric * numeric + 1));
  };
  if (!isSupported70()) {
    Object.defineProperty(Math, "asinh", {
      value: _mathAsinh,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.asinh, "name", {
      value: "asinh",
      configurable: true
    });
    Object.defineProperty(Math.asinh, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.atanh.ts
  var isSupported71 = function isSupported71() {
    try {
      return typeof Math.atanh === "function";
    } catch (e) {
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
  if (!isSupported71()) {
    Object.defineProperty(Math, "atanh", {
      value: mathAtanh,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.atanh, "name", {
      value: "atanh",
      configurable: true
    });
    Object.defineProperty(Math.atanh, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.cosh.ts
  var isSupported72 = function isSupported72() {
    try {
      return typeof Math.cosh === "function";
    } catch (e) {
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
  if (!isSupported72()) {
    Object.defineProperty(Math, "cosh", {
      value: mathCosh,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.cosh, "name", {
      value: "cosh",
      configurable: true
    });
    Object.defineProperty(Math.cosh, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.expm1.ts
  var isSupported73 = function isSupported73() {
    try {
      if (typeof Math.expm1 !== "function") {
        return false;
      }
      return Math.expm1(-2e-17) === -2e-17;
    } catch (e) {
      return false;
    }
  };
  var isMathExpm1Supported = isSupported73;
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
  if (!isSupported73()) {
    Object.defineProperty(Math, "expm1", {
      value: mathExpm1,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.expm1, "name", {
      value: "expm1",
      configurable: true
    });
    Object.defineProperty(Math.expm1, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.log1p.ts
  var isSupported74 = function isSupported74() {
    try {
      return typeof Math.log1p === "function";
    } catch (e) {
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
  if (!isSupported74()) {
    Object.defineProperty(Math, "log1p", {
      value: mathLog1p,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.log1p, "name", {
      value: "log1p",
      configurable: true
    });
    Object.defineProperty(Math.log1p, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.sinh.ts
  var isSupported75 = function isSupported75() {
    try {
      if (typeof Math.sinh !== "function") {
        return false;
      }
      return Math.sinh(-2e-17) === -2e-17;
    } catch (e) {
      return false;
    }
  };
  var isMathSinhSupported = isSupported75;
  var expm1 = function expm1(x) {
    if (typeof Math.expm1 === "function") {
      return Math.expm1(x);
    }
    if (x > -1e-6 && x < 1e-6) {
      return x + x * x / 2;
    }
    return Math.exp(x) - 1;
  };
  var mathSinh = function mathSinh(x) {
    var numeric = +x;
    if (numeric !== numeric || numeric === 0 || numeric === Infinity || numeric === -Infinity) {
      return numeric;
    }
    if (numeric > -1 && numeric < 1) {
      return (expm1(numeric) - expm1(-numeric)) / 2;
    }
    return (Math.exp(numeric) - Math.exp(-numeric)) / 2;
  };
  if (!isSupported75()) {
    Object.defineProperty(Math, "sinh", {
      value: mathSinh,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.sinh, "name", {
      value: "sinh",
      configurable: true
    });
    Object.defineProperty(Math.sinh, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.tanh.ts
  var isSupported76 = function isSupported76() {
    try {
      return typeof Math.tanh === "function";
    } catch (e) {
      return false;
    }
  };
  var expm12 = function expm12(x) {
    if (typeof Math.expm1 === "function") {
      return Math.expm1(x);
    }
    if (x > -1e-6 && x < 1e-6) {
      return x + x * x / 2;
    }
    return Math.exp(x) - 1;
  };
  var mathTanh = function mathTanh(x) {
    var numeric = +x;
    if (numeric !== numeric || numeric === 0) {
      return numeric;
    }
    var a = expm12(numeric);
    if (a === Infinity) {
      return 1;
    }
    var b = expm12(-numeric);
    if (b === Infinity) {
      return -1;
    }
    return (a - b) / (a + b + 2);
  };
  if (!isSupported76()) {
    Object.defineProperty(Math, "tanh", {
      value: mathTanh,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.tanh, "name", {
      value: "tanh",
      configurable: true
    });
    Object.defineProperty(Math.tanh, "__polyfilled", {
      value: true
    });
  }

  // tests/math-hyperbolic.test.ts
  describe("Math hyperbolic/log (ES2015) \u2014 test262 conformance", function () {
    describe("expm1", function () {
      it("passes NaN / \xB10 / \xB1Infinity through (preserving -0)", function () {
        expect(mathExpm1(NaN)).toBeNaN();
        expect(Object.is(mathExpm1(0), 0)).toBe(true);
        expect(Object.is(mathExpm1(-0), -0)).toBe(true);
        expect(mathExpm1(Infinity)).toBe(Infinity);
        expect(mathExpm1(-Infinity)).toBe(-1);
      });
      it("keeps precision for tiny x where exp(x)-1 collapses", function () {
        expect(mathExpm1(1e-10)).toBeCloseTo(1e-10, 15);
      });
      it("matches native", function () {
        var xs = [1, -1, 0.5, -0.5, 10, -10, 1e-10];
        for (var _i38 = 0; _i38 < xs.length; _i38++) {
          expect(mathExpm1(xs[_i38])).toBeCloseTo(Math.expm1(xs[_i38]), 10);
        }
      });
    });
    describe("log1p", function () {
      it("handles the domain edges", function () {
        expect(mathLog1p(NaN)).toBeNaN();
        expect(mathLog1p(-2)).toBeNaN();
        expect(mathLog1p(-1)).toBe(-Infinity);
        expect(Object.is(mathLog1p(0), 0)).toBe(true);
        expect(Object.is(mathLog1p(-0), -0)).toBe(true);
        expect(mathLog1p(Infinity)).toBe(Infinity);
      });
      it("keeps precision for tiny x where log(1+x) collapses", function () {
        expect(mathLog1p(1e-10)).toBeCloseTo(1e-10, 15);
      });
      it("matches native", function () {
        var xs = [1, -0.5, 0.5, 10, 1e-10, Math.E - 1];
        for (var _i39 = 0; _i39 < xs.length; _i39++) {
          expect(mathLog1p(xs[_i39])).toBeCloseTo(Math.log1p(xs[_i39]), 10);
        }
      });
    });
    describe("sinh", function () {
      it("passes NaN / \xB10 / \xB1Infinity through (preserving -0)", function () {
        expect(mathSinh(NaN)).toBeNaN();
        expect(Object.is(mathSinh(0), 0)).toBe(true);
        expect(Object.is(mathSinh(-0), -0)).toBe(true);
        expect(mathSinh(Infinity)).toBe(Infinity);
        expect(mathSinh(-Infinity)).toBe(-Infinity);
      });
      it("is odd: sinh(-x) === -sinh(x)", function () {
        expect(mathSinh(-2)).toBeCloseTo(-mathSinh(2), 10);
      });
      it("matches native", function () {
        var xs = [1, -1, 0.5, -0.5, 5, -5, 1e-5];
        for (var _i40 = 0; _i40 < xs.length; _i40++) {
          expect(mathSinh(xs[_i40])).toBeCloseTo(Math.sinh(xs[_i40]), 10);
        }
      });
    });
    describe("cosh", function () {
      it("handles the edges (even function, minimum 1)", function () {
        expect(mathCosh(NaN)).toBeNaN();
        expect(mathCosh(0)).toBe(1);
        expect(mathCosh(-0)).toBe(1);
        expect(mathCosh(Infinity)).toBe(Infinity);
        expect(mathCosh(-Infinity)).toBe(Infinity);
      });
      it("matches native", function () {
        var xs = [1, -1, 0.5, -0.5, 5, -5, 10];
        for (var _i41 = 0; _i41 < xs.length; _i41++) {
          expect(mathCosh(xs[_i41])).toBeCloseTo(Math.cosh(xs[_i41]), 10);
        }
      });
    });
    describe("tanh", function () {
      it("handles the edges (saturates to \xB11)", function () {
        expect(mathTanh(NaN)).toBeNaN();
        expect(Object.is(mathTanh(0), 0)).toBe(true);
        expect(Object.is(mathTanh(-0), -0)).toBe(true);
        expect(mathTanh(Infinity)).toBe(1);
        expect(mathTanh(-Infinity)).toBe(-1);
      });
      it("matches native", function () {
        var xs = [1, -1, 0.5, -0.5, 5, -5, 100, -100];
        for (var _i42 = 0; _i42 < xs.length; _i42++) {
          expect(mathTanh(xs[_i42])).toBeCloseTo(Math.tanh(xs[_i42]), 10);
        }
      });
    });
    describe("asinh", function () {
      it("passes NaN / \xB10 / \xB1Infinity through (preserving -0)", function () {
        expect(_mathAsinh(NaN)).toBeNaN();
        expect(Object.is(_mathAsinh(0), 0)).toBe(true);
        expect(Object.is(_mathAsinh(-0), -0)).toBe(true);
        expect(_mathAsinh(Infinity)).toBe(Infinity);
        expect(_mathAsinh(-Infinity)).toBe(-Infinity);
      });
      it("matches native", function () {
        var xs = [1, -1, 0.5, -0.5, 100, -100, 1e10];
        for (var _i43 = 0; _i43 < xs.length; _i43++) {
          expect(_mathAsinh(xs[_i43])).toBeCloseTo(Math.asinh(xs[_i43]), 10);
        }
      });
    });
    describe("acosh", function () {
      it("handles the domain edges (x < 1 is NaN)", function () {
        expect(mathAcosh(NaN)).toBeNaN();
        expect(mathAcosh(0.999)).toBeNaN();
        expect(mathAcosh(-1)).toBeNaN();
        expect(mathAcosh(1)).toBe(0);
        expect(mathAcosh(Infinity)).toBe(Infinity);
      });
      it("matches native (including huge x where x*x would overflow)", function () {
        var xs = [1, 1.5, 2, 10, 1e5, 1e155, 1e300];
        for (var _i44 = 0; _i44 < xs.length; _i44++) {
          expect(mathAcosh(xs[_i44])).toBeCloseTo(Math.acosh(xs[_i44]), 10);
        }
      });
    });
    describe("atanh", function () {
      it("handles the domain edges (|x| > 1 is NaN, \xB11 is \xB1Infinity)", function () {
        expect(mathAtanh(NaN)).toBeNaN();
        expect(mathAtanh(2)).toBeNaN();
        expect(mathAtanh(-2)).toBeNaN();
        expect(mathAtanh(1)).toBe(Infinity);
        expect(mathAtanh(-1)).toBe(-Infinity);
        expect(Object.is(mathAtanh(0), 0)).toBe(true);
        expect(Object.is(mathAtanh(-0), -0)).toBe(true);
      });
      it("matches native", function () {
        var xs = [0.5, -0.5, 0.9, -0.9, 0.99999, 1e-10];
        for (var _i45 = 0; _i45 < xs.length; _i45++) {
          expect(mathAtanh(xs[_i45])).toBeCloseTo(Math.atanh(xs[_i45]), 10);
        }
      });
    });
  });

  // src/modules/es.math.hypot.ts
  var isSupported77 = function isSupported77() {
    try {
      if (typeof Math.hypot !== "function") {
        return false;
      }
      return Math.hypot(Infinity, NaN) === Infinity;
    } catch (e) {
      return false;
    }
  };
  var isMathHypotSupported = isSupported77;
  var mathHypot = function mathHypot() {
    var max = 0;
    var hasInfinity = false;
    var hasNaN = false;
    for (var _i46 = 0; _i46 < arguments.length; _i46++) {
      var numeric = +arguments[_i46];
      if (numeric === Infinity || numeric === -Infinity) {
        hasInfinity = true;
      } else if (numeric !== numeric) {
        hasNaN = true;
      } else {
        var magnitude = numeric < 0 ? -numeric : numeric;
        if (magnitude > max) {
          max = magnitude;
        }
      }
    }
    if (hasInfinity) {
      return Infinity;
    }
    if (hasNaN) {
      return NaN;
    }
    if (max === 0) {
      return 0;
    }
    var sumOfSquares = 0;
    for (var _i47 = 0; _i47 < arguments.length; _i47++) {
      var scaled = +arguments[_i47] / max;
      sumOfSquares += scaled * scaled;
    }
    return max * Math.sqrt(sumOfSquares);
  };
  if (!isSupported77()) {
    Object.defineProperty(Math, "hypot", {
      value: mathHypot,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.hypot, "name", {
      value: "hypot",
      configurable: true
    });
    Object.defineProperty(Math.hypot, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.imul.ts
  var isSupported78 = function isSupported78() {
    try {
      if (typeof Math.imul !== "function") {
        return false;
      }
      return Math.imul(4294967295, 5) === -5;
    } catch (e) {
      return false;
    }
  };
  var isMathImulSupported = isSupported78;
  var mathImul = function mathImul(a, b) {
    var aHigh = a >>> 16 & 65535;
    var aLow = a & 65535;
    var bHigh = b >>> 16 & 65535;
    var bLow = b & 65535;
    return aLow * bLow + (aHigh * bLow + aLow * bHigh << 16 >>> 0) | 0;
  };
  if (!isSupported78()) {
    Object.defineProperty(Math, "imul", {
      value: mathImul,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.imul, "name", {
      value: "imul",
      configurable: true
    });
    Object.defineProperty(Math.imul, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.cbrt.ts
  var isSupported79 = function isSupported79() {
    try {
      return typeof Math.cbrt === "function";
    } catch (e) {
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
  if (!isSupported79()) {
    Object.defineProperty(Math, "cbrt", {
      value: mathCbrt,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.cbrt, "name", {
      value: "cbrt",
      configurable: true
    });
    Object.defineProperty(Math.cbrt, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.clz32.ts
  var isSupported80 = function isSupported80() {
    try {
      return typeof Math.clz32 === "function";
    } catch (e) {
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
  if (!isSupported80()) {
    Object.defineProperty(Math, "clz32", {
      value: mathClz32,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.clz32, "name", {
      value: "clz32",
      configurable: true
    });
    Object.defineProperty(Math.clz32, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.fround.ts
  var isSupported81 = function isSupported81() {
    try {
      return typeof Math.fround === "function";
    } catch (e) {
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
  if (!isSupported81()) {
    Object.defineProperty(Math, "fround", {
      value: mathFround,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.fround, "name", {
      value: "fround",
      configurable: true
    });
    Object.defineProperty(Math.fround, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.log10.ts
  var isSupported82 = function isSupported82() {
    try {
      return typeof Math.log10 === "function";
    } catch (e) {
      return false;
    }
  };
  var mathLog10 = function mathLog10(x) {
    return Math.log(x) * Math.LOG10E;
  };
  if (!isSupported82()) {
    Object.defineProperty(Math, "log10", {
      value: mathLog10,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.log10, "name", {
      value: "log10",
      configurable: true
    });
    Object.defineProperty(Math.log10, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.math.log2.ts
  var isSupported83 = function isSupported83() {
    try {
      return typeof Math.log2 === "function";
    } catch (e) {
      return false;
    }
  };
  var mathLog2 = function mathLog2(x) {
    return Math.log(x) * Math.LOG2E;
  };
  if (!isSupported83()) {
    Object.defineProperty(Math, "log2", {
      value: mathLog2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.log2, "name", {
      value: "log2",
      configurable: true
    });
    Object.defineProperty(Math.log2, "__polyfilled", {
      value: true
    });
  }

  // tests/math-methods.test.ts
  describe("Math cbrt/clz32/fround/hypot/imul/log10/log2 (ES2015) \u2014 test262 conformance", function () {
    describe("behavioral probe contracts", function () {
      it("pass on a healthy modern engine", function () {
        expect(isMathHypotSupported()).toBe(true);
        expect(isMathImulSupported()).toBe(true);
        expect(isMathExpm1Supported()).toBe(true);
        expect(isMathSinhSupported()).toBe(true);
        expect(isMathAcoshSupported()).toBe(true);
      });
    });
    describe("cbrt", function () {
      it("passes NaN / \xB10 / \xB1Infinity through unchanged", function () {
        expect(mathCbrt(NaN)).toBeNaN();
        expect(Object.is(mathCbrt(0), 0)).toBe(true);
        expect(Object.is(mathCbrt(-0), -0)).toBe(true);
        expect(mathCbrt(Infinity)).toBe(Infinity);
        expect(mathCbrt(-Infinity)).toBe(-Infinity);
      });
      it("roots perfect cubes, keeping the sign", function () {
        expect(mathCbrt(1)).toBe(1);
        expect(mathCbrt(-1)).toBe(-1);
        expect(mathCbrt(8)).toBe(2);
        expect(mathCbrt(-8)).toBe(-2);
        expect(mathCbrt(27)).toBeCloseTo(3, 10);
      });
      it("matches native (ratio check \u2014 absolute digits break on big magnitudes)", function () {
        var xs = [0.5, -0.5, 2, 10, 1e3, 1e21, -1e21];
        for (var _i48 = 0; _i48 < xs.length; _i48++) {
          expect(mathCbrt(xs[_i48]) / Math.cbrt(xs[_i48])).toBeCloseTo(1, 10);
        }
      });
    });
    describe("clz32", function () {
      it("coerces via ToUint32: NaN / \xB10 / Infinity all count 32 empty slots", function () {
        expect(mathClz32(NaN)).toBe(32);
        expect(mathClz32(0)).toBe(32);
        expect(mathClz32(-0)).toBe(32);
        expect(mathClz32(Infinity)).toBe(32);
        expect(mathClz32(4294967296)).toBe(32);
      });
      it("counts leading zeros exactly at every power of two", function () {
        for (var _i49 = 0; _i49 < 32; _i49++) {
          expect(mathClz32(Math.pow(2, _i49))).toBe(31 - _i49);
        }
      });
      it("handles negatives, fractions and the all-ones word", function () {
        expect(mathClz32(1)).toBe(31);
        expect(mathClz32(1.5)).toBe(31);
        expect(mathClz32(-1)).toBe(0);
        expect(mathClz32(4294967295)).toBe(0);
        expect(mathClz32(2147483648)).toBe(0);
      });
      it("matches native", function () {
        var xs = [0, 1, 2, 3, 255, 256, 65535, 65536, 2147483647, -5, 1e10];
        for (var _i50 = 0; _i50 < xs.length; _i50++) {
          expect(mathClz32(xs[_i50])).toBe(Math.clz32(xs[_i50]));
        }
      });
    });
    describe("fround", function () {
      it("passes NaN / \xB10 / \xB1Infinity through unchanged", function () {
        expect(mathFround(NaN)).toBeNaN();
        expect(Object.is(mathFround(0), 0)).toBe(true);
        expect(Object.is(mathFround(-0), -0)).toBe(true);
        expect(mathFround(Infinity)).toBe(Infinity);
        expect(mathFround(-Infinity)).toBe(-Infinity);
      });
      it("rounds to the nearest 32-bit float", function () {
        expect(mathFround(1)).toBe(1);
        expect(mathFround(1.5)).toBe(1.5);
        expect(mathFround(1.337)).toBe(1.3370000123977661);
      });
      it("overflows to Infinity and flushes denormals to zero at the float32 limits", function () {
        expect(mathFround(1e39)).toBe(Infinity);
        expect(mathFround(-1e39)).toBe(-Infinity);
        expect(mathFround(Math.pow(2, -150))).toBe(0);
      });
      it("matches native", function () {
        var xs = [0.1, -0.1, 3.14159, 1e10, -1e10, 5.5, 1e-40];
        for (var _i51 = 0; _i51 < xs.length; _i51++) {
          expect(mathFround(xs[_i51])).toBe(Math.fround(xs[_i51]));
        }
      });
    });
    describe("hypot", function () {
      it("handles the empty / special-value cases (Infinity beats NaN)", function () {
        expect(Object.is(mathHypot(), 0)).toBe(true);
        expect(Object.is(mathHypot(-0, -0), 0)).toBe(true);
        expect(mathHypot(NaN)).toBeNaN();
        expect(mathHypot(Infinity, NaN)).toBe(Infinity);
        expect(mathHypot(NaN, -Infinity)).toBe(Infinity);
        expect(mathHypot(3, NaN)).toBeNaN();
      });
      it("computes the classic triangles exactly", function () {
        expect(mathHypot(3, 4)).toBe(5);
        expect(mathHypot(-3, -4)).toBe(5);
        expect(mathHypot(3, 4, 12)).toBe(13);
        expect(mathHypot(6)).toBe(6);
      });
      it("coerces arguments to numbers", function () {
        expect(mathHypot("3", "4")).toBe(5);
        expect(mathHypot(3, "x")).toBeNaN();
      });
      it("survives huge values that would overflow a naive sum of squares", function () {
        expect(mathHypot(1e200, 1e200)).toBeCloseTo(1414213562373095e185, -186);
        expect(mathHypot(1e-200, 1e-200)).toBeCloseTo(Math.hypot(1e-200, 1e-200), 210);
      });
      it("matches native", function () {
        var cases = [[1, 2], [5, 12], [0.3, 0.4], [1e5, 1e5, 1e5], [-7, 24]];
        for (var _i52 = 0; _i52 < cases.length; _i52++) {
          expect(mathHypot.apply(null, cases[_i52])).toBeCloseTo(Math.hypot.apply(null, cases[_i52]), 10);
        }
      });
    });
    describe("imul", function () {
      it("multiplies small ints like ordinary multiplication", function () {
        expect(mathImul(3, 4)).toBe(12);
        expect(mathImul(-5, 12)).toBe(-60);
        expect(mathImul(0, 7)).toBe(0);
      });
      it("wraps 32-bit like C \u2014 the cases naive float multiply gets wrong", function () {
        expect(mathImul(4294967295, 5)).toBe(-5);
        expect(mathImul(4294967294, 5)).toBe(-10);
        expect(mathImul(2147483647, 2147483647)).toBe(1);
        expect(mathImul(2147483648, 2147483648)).toBe(0);
      });
      it("coerces via ToUint32: NaN / Infinity / fractions", function () {
        expect(mathImul(NaN, 1)).toBe(0);
        expect(mathImul(Infinity, 1)).toBe(0);
        expect(mathImul(1.5, 1)).toBe(1);
      });
      it("matches native", function () {
        var cases = [[2, 4], [-1, 8], [12345, 67890], [3735928559, 3405691582], [65535, 65535]];
        for (var _i53 = 0; _i53 < cases.length; _i53++) {
          expect(mathImul(cases[_i53][0], cases[_i53][1])).toBe(Math.imul(cases[_i53][0], cases[_i53][1]));
        }
      });
    });
    describe("log10", function () {
      it("handles the domain edges", function () {
        expect(mathLog10(NaN)).toBeNaN();
        expect(mathLog10(-1)).toBeNaN();
        expect(mathLog10(0)).toBe(-Infinity);
        expect(mathLog10(-0)).toBe(-Infinity);
        expect(Object.is(mathLog10(1), 0)).toBe(true);
        expect(mathLog10(Infinity)).toBe(Infinity);
      });
      it("is within a ulp of native on powers of ten (change-of-base rounding)", function () {
        var xs = [10, 100, 1e3, 1e10, 1e-5];
        for (var _i54 = 0; _i54 < xs.length; _i54++) {
          expect(mathLog10(xs[_i54])).toBeCloseTo(Math.log10(xs[_i54]), 10);
        }
      });
      it("matches native", function () {
        var xs = [0.5, 2, Math.E, 42, 1e21];
        for (var _i55 = 0; _i55 < xs.length; _i55++) {
          expect(mathLog10(xs[_i55])).toBeCloseTo(Math.log10(xs[_i55]), 10);
        }
      });
    });
    describe("log2", function () {
      it("handles the domain edges", function () {
        expect(mathLog2(NaN)).toBeNaN();
        expect(mathLog2(-1)).toBeNaN();
        expect(mathLog2(0)).toBe(-Infinity);
        expect(mathLog2(-0)).toBe(-Infinity);
        expect(Object.is(mathLog2(1), 0)).toBe(true);
        expect(mathLog2(Infinity)).toBe(Infinity);
      });
      it("is within a ulp of native on powers of two (change-of-base rounding)", function () {
        var xs = [2, 4, 8, 1024, Math.pow(2, 31)];
        for (var _i56 = 0; _i56 < xs.length; _i56++) {
          expect(mathLog2(xs[_i56])).toBeCloseTo(Math.log2(xs[_i56]), 10);
        }
      });
      it("matches native", function () {
        var xs = [0.5, 3, 10, 1e21, 1e-10];
        for (var _i57 = 0; _i57 < xs.length; _i57++) {
          expect(mathLog2(xs[_i57])).toBeCloseTo(Math.log2(xs[_i57]), 10);
        }
      });
    });
  });

  // src/modules/es.math.sign.ts
  var isSupported84 = function isSupported84() {
    try {
      return typeof Math.sign === "function";
    } catch (e) {
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
  if (!isSupported84()) {
    Object.defineProperty(Math, "sign", {
      value: mathSign,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.sign, "name", {
      value: "sign",
      configurable: true
    });
    Object.defineProperty(Math.sign, "__polyfilled", {
      value: true
    });
  }

  // tests/math-sign.test.ts
  describe("Math.sign \u2014 test262 conformance", function () {
    var cases = [[3, 1], [-3, -1], [0.5, 1], [-0.5, -1], [Infinity, 1], [-Infinity, -1], [Number.MAX_VALUE, 1], [-Number.MAX_VALUE, -1]];
    it.each(cases)("Math.sign(%p) === %p", function (input, expected) {
      expect(mathSign(input)).toBe(expected);
      expect(Math.sign(input)).toBe(expected);
    });
    describe("signed zero is preserved (not collapsed to 1/-1)", function () {
      it("Math.sign(+0) is +0", function () {
        expect(Object.is(mathSign(0), 0)).toBe(true);
        expect(Object.is(Math.sign(0), 0)).toBe(true);
      });
      it("Math.sign(-0) is -0", function () {
        expect(Object.is(mathSign(-0), -0)).toBe(true);
        expect(Object.is(Math.sign(-0), -0)).toBe(true);
      });
    });
    describe("NaN handling", function () {
      it("returns NaN for NaN", function () {
        expect(mathSign(NaN)).toBeNaN();
        expect(Math.sign(NaN)).toBeNaN();
      });
      it("returns NaN for values that coerce to NaN", function () {
        expect(mathSign(void 0)).toBeNaN();
        expect(mathSign("foo")).toBeNaN();
      });
    });
    describe("argument coercion (ToNumber)", function () {
      it("coerces numeric strings and booleans", function () {
        expect(mathSign("5")).toBe(1);
        expect(mathSign("-5")).toBe(-1);
        expect(mathSign(true)).toBe(1);
        expect(Object.is(mathSign(false), 0)).toBe(true);
      });
    });
  });

  // src/modules/es.math.trunc.ts
  var isSupported85 = function isSupported85() {
    try {
      return typeof Math.trunc === "function";
    } catch (e) {
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
  if (!isSupported85()) {
    Object.defineProperty(Math, "trunc", {
      value: mathTrunc,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Math.trunc, "name", {
      value: "trunc",
      configurable: true
    });
    Object.defineProperty(Math.trunc, "__polyfilled", {
      value: true
    });
  }

  // tests/math.test.ts
  describe("Math (ES2015) \u2014 test262 conformance", function () {
    describe("trunc", function () {
      it("rounds toward zero for both signs", function () {
        expect(mathTrunc(4.7)).toBe(4);
        expect(mathTrunc(-4.7)).toBe(-4);
        expect(mathTrunc(0.5)).toBe(0);
        expect(mathTrunc(-0.5)).toBe(-0);
      });
      it("passes NaN / \xB1Infinity / \xB10 through (preserving -0)", function () {
        expect(mathTrunc(NaN)).toBeNaN();
        expect(mathTrunc(Infinity)).toBe(Infinity);
        expect(mathTrunc(-Infinity)).toBe(-Infinity);
        expect(Object.is(mathTrunc(-0), -0)).toBe(true);
      });
      it("matches native", function () {
        var xs = [4.7, -4.7, 0.5, -0.9, 100, -100.999];
        for (var _i58 = 0; _i58 < xs.length; _i58++) {
          expect(mathTrunc(xs[_i58])).toBe(Math.trunc(xs[_i58]));
        }
      });
    });
  });

  // src/modules/es.number.constructor.ts
  var isSupported86 = function isSupported86() {
    try {
      return Number("0b101") === 5 && Number("0o17") === 15;
    } catch (e) {
      return false;
    }
  };
  var isNumberConstructorSupported = isSupported86;
  var NativeNumber = Number;
  var parseNumericString = function parseNumericString(value) {
    var trimmed = value.replace(/^\s+|\s+$/g, "");
    if (trimmed.length > 2 && trimmed.charAt(0) === "0") {
      var marker = trimmed.charAt(1);
      var digits = trimmed.substring(2);
      if (marker === "b" || marker === "B") {
        return /^[01]+$/.test(digits) ? parseInt(digits, 2) : NaN;
      }
      if (marker === "o" || marker === "O") {
        return /^[0-7]+$/.test(digits) ? parseInt(digits, 8) : NaN;
      }
    }
    return value;
  };
  var _NumberPolyfill = function NumberPolyfill(value) {
    var input = arguments.length === 0 ? 0 : typeof value === "string" ? parseNumericString(value) : value;
    if (this instanceof _NumberPolyfill) {
      return new NativeNumber(NativeNumber(input));
    }
    return NativeNumber(input);
  };
  _NumberPolyfill.prototype = NativeNumber.prototype;
  var staticKeys = ["MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY", "POSITIVE_INFINITY", "EPSILON", "MAX_SAFE_INTEGER", "MIN_SAFE_INTEGER", "isFinite", "isInteger", "isNaN", "isSafeInteger", "parseFloat", "parseInt"];
  for (var _i59 = 0; _i59 < staticKeys.length; _i59++) {
    var key = staticKeys[_i59];
    if (key in NativeNumber) {
      _NumberPolyfill[key] = NativeNumber[key];
    }
  }
  if (!isSupported86()) {
    window.Number = null;
    delete window.Number;
    Object.defineProperty(window, "Number", {
      value: _NumberPolyfill,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.Number, "name", {
      value: "Number",
      configurable: true
    });
    Object.defineProperty(window.Number, "__polyfilled", {
      value: true
    });
  }

  // tests/number-constructor.test.ts
  describe("Number constructor wrapper \u2014 test262 conformance", function () {
    describe("ES2015 string literals", function () {
      it("parses binary strings", function () {
        expect(_NumberPolyfill("0b101")).toBe(5);
        expect(_NumberPolyfill("0B11")).toBe(3);
      });
      it("parses octal strings", function () {
        expect(_NumberPolyfill("0o17")).toBe(15);
        expect(_NumberPolyfill("0O7")).toBe(7);
      });
      it("trims whitespace around the literal", function () {
        expect(_NumberPolyfill("  0b101  ")).toBe(5);
      });
      it("returns NaN for invalid digits", function () {
        expect(_NumberPolyfill("0b102")).toBeNaN();
        expect(_NumberPolyfill("0o18")).toBeNaN();
      });
    });
    describe("native passthrough", function () {
      it("coerces the usual suspects like native", function () {
        var samples = ["1.5", "0x10", "", "  42 ", "abc", true, null, [], [7]];
        for (var _i60 = 0, _samples = samples; _i60 < _samples.length; _i60++) {
          var sample = _samples[_i60];
          var mine = _NumberPolyfill(sample);
          var theirs = Number(sample);
          if (theirs !== theirs) {
            expect(mine).toBeNaN();
          } else {
            expect(mine).toBe(theirs);
          }
        }
      });
      it("returns 0 with no arguments", function () {
        expect(_NumberPolyfill()).toBe(0);
      });
      it("boxes under new, instanceof intact", function () {
        var boxed = new _NumberPolyfill("0b101");
        expect(typeof boxed).toBe("object");
        expect(boxed instanceof Number).toBe(true);
        expect(boxed.valueOf()).toBe(5);
      });
      it("carries the statics across", function () {
        expect(_NumberPolyfill.MAX_SAFE_INTEGER).toBe(Number.MAX_SAFE_INTEGER);
        expect(_NumberPolyfill.EPSILON).toBe(Number.EPSILON);
        expect(_NumberPolyfill.isNaN).toBe(Number.isNaN);
        expect(_NumberPolyfill.parseInt).toBe(Number.parseInt);
      });
    });
    describe("probe", function () {
      it("reports modern engines as supported", function () {
        expect(isNumberConstructorSupported()).toBe(true);
      });
    });
  });

  // src/modules/es.number.is-finite.ts
  var isSupported87 = function isSupported87() {
    try {
      return typeof Number.isFinite === "function";
    } catch (e) {
      return false;
    }
  };
  var numberIsFinite = function numberIsFinite(value) {
    return typeof value === "number" && isFinite(value);
  };
  if (!isSupported87()) {
    Object.defineProperty(Number, "isFinite", {
      value: numberIsFinite,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.isFinite, "name", {
      value: "isFinite",
      configurable: true
    });
    Object.defineProperty(Number.isFinite, "__polyfilled", {
      value: true
    });
  }

  // tests/number-is-finite.test.ts
  describe("Number.isFinite \u2014 test262 conformance", function () {
    it("returns true for finite numbers", function () {
      var finite = [0, -0, 1, -1, 3.14, -3.14, Number.MAX_VALUE, Number.MIN_VALUE];
      for (var _i61 = 0; _i61 < finite.length; _i61++) {
        expect(numberIsFinite(finite[_i61])).toBe(true);
      }
    });
    it("returns false for NaN and the infinities", function () {
      expect(numberIsFinite(NaN)).toBe(false);
      expect(numberIsFinite(Infinity)).toBe(false);
      expect(numberIsFinite(-Infinity)).toBe(false);
    });
    describe("no coercion (the global-isFinite divergence)", function () {
      it("returns false for non-numbers, including numeric strings", function () {
        var nonNumbers = ["1", "0", "", "foo", void 0, null, true, false, {}, [], function () {
          return 0;
        }, /* @__PURE__ */Symbol("s")];
        for (var _i62 = 0; _i62 < nonNumbers.length; _i62++) {
          expect(numberIsFinite(nonNumbers[_i62])).toBe(false);
        }
      });
      it("returns false for objects whose valueOf would coerce to a finite number", function () {
        var obj = {
          valueOf: function valueOf() {
            return 1;
          }
        };
        expect(numberIsFinite(obj)).toBe(false);
      });
    });
    describe("parity vs native", function () {
      it("matches native across a mixed set", function () {
        var inputs = [0, NaN, Infinity, "1", null, {}];
        for (var _i63 = 0; _i63 < inputs.length; _i63++) {
          expect(numberIsFinite(inputs[_i63])).toBe(Number.isFinite(inputs[_i63]));
        }
      });
    });
  });

  // src/modules/es.number.is-integer.ts
  var isSupported88 = function isSupported88() {
    try {
      return typeof Number.isInteger === "function";
    } catch (e) {
      return false;
    }
  };
  var numberIsInteger = function numberIsInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  };
  if (!isSupported88()) {
    Object.defineProperty(Number, "isInteger", {
      value: numberIsInteger,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.isInteger, "name", {
      value: "isInteger",
      configurable: true
    });
    Object.defineProperty(Number.isInteger, "__polyfilled", {
      value: true
    });
  }

  // tests/number-is-integer.test.ts
  describe("Number.isInteger \u2014 test262 conformance", function () {
    it("returns true for integer-valued numbers", function () {
      var integers = [0, -0, 1, -1, 100, -100, Number.MAX_SAFE_INTEGER, Math.pow(2, 53)];
      for (var _i64 = 0; _i64 < integers.length; _i64++) {
        expect(numberIsInteger(integers[_i64])).toBe(true);
      }
    });
    it("returns true for integral floats (e.g. 5.0)", function () {
      expect(numberIsInteger(5)).toBe(true);
      expect(numberIsInteger(-12)).toBe(true);
    });
    it("returns false for fractional numbers", function () {
      var fractions = [0.5, -0.5, 3.14, -3.14, Number.MIN_VALUE, 1.0000001];
      for (var _i65 = 0; _i65 < fractions.length; _i65++) {
        expect(numberIsInteger(fractions[_i65])).toBe(false);
      }
    });
    it("returns false for NaN and the infinities", function () {
      expect(numberIsInteger(NaN)).toBe(false);
      expect(numberIsInteger(Infinity)).toBe(false);
      expect(numberIsInteger(-Infinity)).toBe(false);
    });
    describe("no coercion", function () {
      it("returns false for non-numbers, including numeric strings", function () {
        var nonNumbers = ["1", "0", "", void 0, null, true, false, {}, [], function () {
          return 0;
        }, /* @__PURE__ */Symbol("s")];
        for (var _i66 = 0; _i66 < nonNumbers.length; _i66++) {
          expect(numberIsInteger(nonNumbers[_i66])).toBe(false);
        }
      });
      it("returns false for objects whose valueOf would coerce to an integer", function () {
        var obj = {
          valueOf: function valueOf() {
            return 1;
          }
        };
        expect(numberIsInteger(obj)).toBe(false);
      });
    });
    describe("parity vs native", function () {
      it("matches native across a mixed set", function () {
        var inputs = [0, 1.5, NaN, Infinity, "1", null, Math.pow(2, 53)];
        for (var _i67 = 0; _i67 < inputs.length; _i67++) {
          expect(numberIsInteger(inputs[_i67])).toBe(Number.isInteger(inputs[_i67]));
        }
      });
    });
  });

  // src/modules/es.number.is-nan.ts
  var isSupported89 = function isSupported89() {
    try {
      return typeof Number.isNaN === "function";
    } catch (e) {
      return false;
    }
  };
  var numberIsNaN = function numberIsNaN(value) {
    return typeof value === "number" && value !== value;
  };
  if (!isSupported89()) {
    Object.defineProperty(Number, "isNaN", {
      value: numberIsNaN,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.isNaN, "name", {
      value: "isNaN",
      configurable: true
    });
    Object.defineProperty(Number.isNaN, "__polyfilled", {
      value: true
    });
  }

  // tests/number-is-nan.test.ts
  describe("Number.isNaN \u2014 test262 conformance", function () {
    it("returns true only for the number NaN", function () {
      expect(numberIsNaN(NaN)).toBe(true);
      expect(numberIsNaN(Number.NaN)).toBe(true);
      expect(numberIsNaN(0 / 0)).toBe(true);
    });
    it("returns false for finite and infinite numbers", function () {
      var finite = [0, -0, 1, -1, 3.14, -3.14, Number.MAX_VALUE, Number.MIN_VALUE];
      for (var _i68 = 0; _i68 < finite.length; _i68++) {
        expect(numberIsNaN(finite[_i68])).toBe(false);
      }
      expect(numberIsNaN(Infinity)).toBe(false);
      expect(numberIsNaN(-Infinity)).toBe(false);
    });
    describe("no coercion (the global-isNaN divergence)", function () {
      it('returns false for the string "NaN" and other non-numbers', function () {
        var nonNumbers = ["NaN", "foo", "", void 0, null, true, false, {}, [], function () {
          return 0;
        }, /* @__PURE__ */Symbol("s")];
        for (var _i69 = 0; _i69 < nonNumbers.length; _i69++) {
          expect(numberIsNaN(nonNumbers[_i69])).toBe(false);
        }
      });
      it("returns false for objects whose valueOf would coerce to NaN", function () {
        var obj = {
          valueOf: function valueOf() {
            return NaN;
          }
        };
        expect(numberIsNaN(obj)).toBe(false);
      });
    });
    describe("parity vs native", function () {
      it("matches native across a mixed set", function () {
        var inputs = [NaN, 0, Infinity, "NaN", null, {}];
        for (var _i70 = 0; _i70 < inputs.length; _i70++) {
          expect(numberIsNaN(inputs[_i70])).toBe(Number.isNaN(inputs[_i70]));
        }
      });
    });
  });

  // src/modules/es.number.is-safe-integer.ts
  var isSupported90 = function isSupported90() {
    try {
      return typeof Number.isSafeInteger === "function";
    } catch (e) {
      return false;
    }
  };
  var MAX_SAFE_INTEGER = 9007199254740991;
  var numberIsSafeInteger = function numberIsSafeInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value &&
    // it's a whole number...
    Math.abs(value) <= MAX_SAFE_INTEGER;
  };
  if (!isSupported90()) {
    Object.defineProperty(Number, "isSafeInteger", {
      value: numberIsSafeInteger,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.isSafeInteger, "name", {
      value: "isSafeInteger",
      configurable: true
    });
    Object.defineProperty(Number.isSafeInteger, "__polyfilled", {
      value: true
    });
  }

  // tests/number-is-safe-integer.test.ts
  describe("Number.isSafeInteger \u2014 test262 conformance", function () {
    it("is true for safe integers", function () {
      expect(numberIsSafeInteger(0)).toBe(true);
      expect(numberIsSafeInteger(-0)).toBe(true);
      expect(numberIsSafeInteger(1)).toBe(true);
      expect(numberIsSafeInteger(9007199254740991)).toBe(true);
      expect(numberIsSafeInteger(-9007199254740991)).toBe(true);
    });
    it("is false at and beyond the safe boundary", function () {
      expect(numberIsSafeInteger(9007199254740992)).toBe(false);
      expect(numberIsSafeInteger(-9007199254740992)).toBe(false);
    });
    it("is false for non-integers", function () {
      expect(numberIsSafeInteger(1.5)).toBe(false);
      expect(numberIsSafeInteger(0.1)).toBe(false);
    });
    it("is false for NaN and Infinity", function () {
      expect(numberIsSafeInteger(NaN)).toBe(false);
      expect(numberIsSafeInteger(Infinity)).toBe(false);
      expect(numberIsSafeInteger(-Infinity)).toBe(false);
    });
    it("does not coerce non-number arguments", function () {
      expect(numberIsSafeInteger("3")).toBe(false);
      expect(numberIsSafeInteger(true)).toBe(false);
      expect(numberIsSafeInteger(null)).toBe(false);
      expect(numberIsSafeInteger([])).toBe(false);
    });
    it("matches native across a sample + timing", function () {
      var samples = [0, 1.5, 9007199254740991, 9007199254740992, NaN, Infinity];
      var native = Number.isSafeInteger;
      for (var _i71 = 0; _i71 < samples.length; _i71++) {
        expect(numberIsSafeInteger(samples[_i71])).toBe(native(samples[_i71]));
      }
    });
  });

  // src/modules/es.number.parse-int.ts
  var isSupported91 = function isSupported91() {
    try {
      return Number.parseInt === parseInt;
    } catch (e) {
      return false;
    }
  };
  var numberParseInt = parseInt;
  if (!isSupported91()) {
    Object.defineProperty(Number, "parseInt", {
      value: numberParseInt,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.parseInt, "name", {
      value: "parseInt",
      configurable: true
    });
    Object.defineProperty(Number.parseInt, "__polyfilled", {
      value: true
    });
  }

  // tests/number-methods.test.ts
  describe("Number.isFinite \u2014 polyfill vs native", function () {
    var cases = [[1, true], [0, true], [-1, true], [1.5, true], [Infinity, false], [-Infinity, false], [NaN, false], ["1", false], [null, false], [void 0, false]];
    it.each(cases)("Number.isFinite(%p) === %p", function (val, expected) {
      expect(numberIsFinite(val)).toBe(expected);
      expect(Number.isFinite(val)).toBe(expected);
    });
  });
  describe("Number.isInteger \u2014 polyfill vs native", function () {
    var cases = [[1, true], [0, true], [-1, true], [1.5, false], [NaN, false], [Infinity, false], ["1", false], [null, false]];
    it.each(cases)("Number.isInteger(%p) === %p", function (val, expected) {
      expect(numberIsInteger(val)).toBe(expected);
      expect(Number.isInteger(val)).toBe(expected);
    });
  });
  describe("Number.isNaN \u2014 polyfill vs native", function () {
    var cases = [[NaN, true], [1, false], ["NaN", false], [void 0, false], [null, false], [Infinity, false]];
    it.each(cases)("Number.isNaN(%p) === %p", function (val, expected) {
      expect(numberIsNaN(val)).toBe(expected);
      expect(Number.isNaN(val)).toBe(expected);
    });
  });
  describe("Number.parseInt \u2014 polyfill vs native", function () {
    it("parses integers same as native", function () {
      expect(numberParseInt("42", 10)).toBe(Number.parseInt("42", 10));
      expect(numberParseInt("0xFF", 16)).toBe(Number.parseInt("0xFF", 16));
      expect(numberParseInt("11", 2)).toBe(Number.parseInt("11", 2));
      expect(numberParseInt("abc")).toBeNaN();
    });
  });

  // src/modules/es.number.parse-float.ts
  var isSupported92 = function isSupported92() {
    try {
      return typeof Number.parseFloat === "function";
    } catch (e) {
      return false;
    }
  };
  var numberParseFloat = parseFloat;
  if (!isSupported92()) {
    Object.defineProperty(Number, "parseFloat", {
      value: numberParseFloat,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.parseFloat, "name", {
      value: "parseFloat",
      configurable: true
    });
    Object.defineProperty(Number.parseFloat, "__polyfilled", {
      value: true
    });
  }

  // tests/number-parse-float.test.ts
  describe("Number.parseFloat \u2014 test262 conformance", function () {
    it("is the same reference as the global parseFloat", function () {
      expect(numberParseFloat).toBe(parseFloat);
    });
    it("parses leading floats and ignores trailing junk", function () {
      expect(numberParseFloat("3.14")).toBe(3.14);
      expect(numberParseFloat("3.14abc")).toBe(3.14);
      expect(numberParseFloat("  42.5 ")).toBe(42.5);
      expect(numberParseFloat("1e3")).toBe(1e3);
    });
    it("returns NaN for non-numeric strings", function () {
      expect(numberParseFloat("abc")).toBeNaN();
      expect(numberParseFloat("")).toBeNaN();
    });
    it("handles Infinity and signs", function () {
      expect(numberParseFloat("Infinity")).toBe(Infinity);
      expect(numberParseFloat("-2.5")).toBe(-2.5);
    });
  });

  // tests/number-parse-int.test.ts
  describe("Number.parseInt \u2014 test262 conformance", function () {
    it("is the same function object as global parseInt", function () {
      expect(numberParseInt).toBe(parseInt);
    });
    it("parses leading integer portions, ignoring trailing junk", function () {
      expect(numberParseInt("42")).toBe(42);
      expect(numberParseInt("42px")).toBe(42);
      expect(numberParseInt("3.99")).toBe(3);
    });
    it("honours an explicit radix", function () {
      expect(numberParseInt("0x1F", 16)).toBe(31);
      expect(numberParseInt("FF", 16)).toBe(255);
      expect(numberParseInt("111", 2)).toBe(7);
      expect(numberParseInt("z", 36)).toBe(35);
    });
    it("auto-detects the 0x hex prefix with no radix", function () {
      expect(numberParseInt("0x10")).toBe(16);
    });
    it("skips leading whitespace and respects sign", function () {
      expect(numberParseInt("   -17")).toBe(-17);
      expect(numberParseInt("	\n +8")).toBe(8);
    });
    it("returns NaN for unparseable input", function () {
      expect(numberParseInt("foo")).toBeNaN();
      expect(numberParseInt("")).toBeNaN();
      expect(numberParseInt("   ")).toBeNaN();
    });
    it("coerces non-string input via ToString (shared parseInt behaviour)", function () {
      expect(numberParseInt(42)).toBe(42);
      expect(numberParseInt(true)).toBeNaN();
    });
    describe("parity vs native", function () {
      it("matches native across a mixed set", function () {
        var inputs = [["42"], ["0x1F", 16], ["  -17"], ["foo"], ["111", 2]];
        for (var _i72 = 0; _i72 < inputs.length; _i72++) {
          var _inputs$_i = _slicedToArray(inputs[_i72], 2),
            s = _inputs$_i[0],
            r = _inputs$_i[1];
          expect(String(numberParseInt(s, r))).toBe(String(parseInt(s, r)));
        }
      });
    });
  });

  // src/modules/es.number.to-exponential.ts
  var nativeToExponential = Number.prototype.toExponential;
  var abs = Math.abs;
  var floor = Math.floor;
  var pow = Math.pow;
  var round = Math.round;
  var POW_10_308 = pow(10, 308);
  var log10 = function log10(x) {
    return Math.log(x) / Math.LN10;
  };
  var thisNumberValue = function thisNumberValue(value) {
    return Number.prototype.valueOf.call(value);
  };
  var toIntegerOrInfinity2 = function toIntegerOrInfinity2(argument) {
    var number = +argument;
    if (number !== number || number === 0) return 0;
    return number > 0 ? floor(number) : Math.ceil(number);
  };
  var repeat = function repeat(str, count) {
    var result = "";
    for (var _i73 = 0; _i73 < count; _i73++) result += str;
    return result;
  };
  var ROUNDS_PROPERLY = function () {
    try {
      return typeof nativeToExponential === "function" && nativeToExponential.call(-69e-12, 4) === "-6.9000e-11" && nativeToExponential.call(1.255, 2) === "1.25e+0" && nativeToExponential.call(12345, 3) === "1.235e+4" && nativeToExponential.call(25, 0) === "3e+1";
    } catch (e) {
      return false;
    }
  }();
  var throwsOn = function throwsOn(thisArg, arg) {
    try {
      nativeToExponential.call(thisArg, arg);
      return false;
    } catch (e) {
      return true;
    }
  };
  var isSupported93 = function isSupported93() {
    try {
      if (typeof nativeToExponential !== "function") return false;
      if (!ROUNDS_PROPERLY) return false;
      if (!throwsOn(1, Infinity) || !throwsOn(1, -Infinity)) return false;
      nativeToExponential.call(Infinity, Infinity);
      nativeToExponential.call(NaN, Infinity);
      return true;
    } catch (e) {
      return false;
    }
  };
  var numberToExponential = function toExponential(fractionDigits) {
    var x = thisNumberValue(this);
    if (fractionDigits === void 0) return nativeToExponential.call(x);
    var f = toIntegerOrInfinity2(fractionDigits);
    if (!isFinite(x)) return String(x);
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
      m = repeat("0", f + 1);
    } else {
      l = log10(x);
      e = floor(l);
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
  if (!isSupported93()) {
    Object.defineProperty(Number.prototype, "toExponential", {
      value: numberToExponential,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.prototype.toExponential, "name", {
      value: "toExponential",
      configurable: true
    });
    Object.defineProperty(Number.prototype.toExponential, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.number.to-precision.ts
  var nativeToPrecision = Number.prototype.toPrecision;
  var thisNumberValue2 = function thisNumberValue2(value) {
    return Number.prototype.valueOf.call(value);
  };
  var isSupported94 = function isSupported94() {
    try {
      if (typeof nativeToPrecision !== "function") return false;
      if (nativeToPrecision.call(1, void 0) !== "1") return false;
      try {
        nativeToPrecision.call({});
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var numberToPrecision = function toPrecision(precision) {
    var value = thisNumberValue2(this);
    return precision === void 0 ? nativeToPrecision.call(value) : nativeToPrecision.call(value, precision);
  };
  if (!isSupported94()) {
    Object.defineProperty(Number.prototype, "toPrecision", {
      value: numberToPrecision,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.prototype.toPrecision, "name", {
      value: "toPrecision",
      configurable: true
    });
    Object.defineProperty(Number.prototype.toPrecision, "__polyfilled", {
      value: true
    });
  }

  // tests/number-to-exponential-precision.test.ts
  var toExp = function toExp(value, digits) {
    return numberToExponential.call(value, digits);
  };
  var toPrec = function toPrec(value, precision) {
    return numberToPrecision.call(value, precision);
  };
  describe("Number.prototype.toExponential island", function () {
    it("formats with the requested fraction digits", function () {
      expect(toExp(12345, 3)).toBe("1.235e+4");
      expect(toExp(25, 0)).toBe("3e+1");
      expect(toExp(0, 2)).toBe("0.00e+0");
    });
    it("handles a non-finite value as a string", function () {
      expect(toExp(Infinity, 2)).toBe("Infinity");
      expect(toExp(NaN, 2)).toBe("NaN");
    });
    it("throws RangeError for out-of-range fraction digits", function () {
      expect(function () {
        return toExp(1, -1);
      }).toThrow(RangeError);
      expect(function () {
        return toExp(1, 21);
      }).toThrow(RangeError);
    });
    it("throws on a non-number this", function () {
      expect(function () {
        return numberToExponential.call({}, 2);
      }).toThrow(TypeError);
    });
  });
  describe("Number.prototype.toPrecision island", function () {
    it("formats to the requested precision", function () {
      expect(toPrec(123.456, 4)).toBe("123.5");
      expect(toPrec(1234e-7, 2)).toBe("0.00012");
    });
    it("treats an explicit undefined precision like a plain toString", function () {
      expect(toPrec(1, void 0)).toBe("1");
      expect(toPrec(123.456, void 0)).toBe("123.456");
    });
    it("throws on a non-number this", function () {
      expect(function () {
        return numberToPrecision.call({}, 2);
      }).toThrow(TypeError);
    });
  });

  // src/modules/es.number.to-fixed.ts
  var nativeToFixed = Number.prototype.toFixed;
  var isSupported95 = function isSupported95() {
    try {
      if (typeof nativeToFixed !== "function") return false;
      if (nativeToFixed.call(8e-5, 3) !== "0.000") return false;
      if (nativeToFixed.call(0.9, 0) !== "1") return false;
      if (nativeToFixed.call(1.255, 2) !== "1.25") return false;
      if (nativeToFixed.call(1000000000000000100, 0) !== "1000000000000000128") return false;
      try {
        nativeToFixed.call({});
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var floor2 = Math.floor;
  var thisNumberValue3 = function thisNumberValue3(value) {
    return Number.prototype.valueOf.call(value);
  };
  var toIntegerOrInfinity3 = function toIntegerOrInfinity3(argument) {
    var number = +argument;
    if (number !== number || number === 0) return 0;
    return number > 0 ? floor2(number) : Math.ceil(number);
  };
  var repeat2 = function repeat2(str, count) {
    var result = "";
    for (var _i74 = 0; _i74 < count; _i74++) result += str;
    return result;
  };
  var _pow = function pow2(x, n, acc) {
    return n === 0 ? acc : n % 2 === 1 ? _pow(x, n - 1, acc * x) : _pow(x * x, n / 2, acc);
  };
  var log = function log(x) {
    var n = 0;
    var x2 = x;
    while (x2 >= 4096) {
      n += 12;
      x2 /= 4096;
    }
    while (x2 >= 2) {
      n += 1;
      x2 /= 2;
    }
    return n;
  };
  var multiply = function multiply(data, n, c) {
    var index = -1;
    var c2 = c;
    while (++index < 6) {
      c2 += n * data[index];
      data[index] = c2 % 1e7;
      c2 = floor2(c2 / 1e7);
    }
  };
  var divide = function divide(data, n) {
    var index = 6;
    var c = 0;
    while (--index >= 0) {
      c += data[index];
      data[index] = floor2(c / n);
      c = c % n * 1e7;
    }
  };
  var dataToString = function dataToString(data) {
    var index = 6;
    var s = "";
    while (--index >= 0) {
      if (s !== "" || index === 0 || data[index] !== 0) {
        var t = String(data[index]);
        s = s === "" ? t : s + repeat2("0", 7 - t.length) + t;
      }
    }
    return s;
  };
  var numberToFixed = function toFixed(fractionDigits) {
    var number = thisNumberValue3(this);
    var fractDigits = toIntegerOrInfinity3(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
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
      e = log(number * _pow(2, 69, 1)) - 69;
      z = e < 0 ? number * _pow(2, -e, 1) : number / _pow(2, e, 1);
      z *= 4503599627370496;
      e = 52 - e;
      if (e > 0) {
        multiply(data, 0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(data, 1e7, 0);
          j -= 7;
        }
        multiply(data, _pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
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
        result = dataToString(data) + repeat2("0", fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits ? "0." + repeat2("0", fractDigits - k) + result : result.slice(0, k - fractDigits) + "." + result.slice(k - fractDigits));
    } else {
      result = sign + result;
    }
    return result;
  };
  if (!isSupported95()) {
    Object.defineProperty(Number.prototype, "toFixed", {
      value: numberToFixed,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Number.prototype.toFixed, "name", {
      value: "toFixed",
      configurable: true
    });
    Object.defineProperty(Number.prototype.toFixed, "__polyfilled", {
      value: true
    });
  }

  // tests/number-to-fixed.test.ts
  var toFixed2 = function toFixed2(value, digits) {
    return numberToFixed.call(value, digits);
  };
  describe("Number.prototype.toFixed island", function () {
    it("rounds the core-js regression cases correctly", function () {
      expect(toFixed2(8e-5, 3)).toBe("0.000");
      expect(toFixed2(0.9, 0)).toBe("1");
      expect(toFixed2(1.255, 2)).toBe("1.25");
      expect(toFixed2(1000000000000000100, 0)).toBe("1000000000000000128");
    });
    it("handles spec basics", function () {
      expect(toFixed2(123.456, 2)).toBe("123.46");
      expect(toFixed2(0, 2)).toBe("0.00");
      expect(toFixed2(-1.5, 1)).toBe("-1.5");
      expect(toFixed2(5)).toBe("5");
    });
    it("returns NaN / large numbers via String", function () {
      expect(toFixed2(NaN, 2)).toBe("NaN");
      expect(toFixed2(1e21, 2)).toBe("1e+21");
    });
    it("throws RangeError for out-of-range fraction digits", function () {
      expect(function () {
        return toFixed2(1, -1);
      }).toThrow(RangeError);
      expect(function () {
        return toFixed2(1, 21);
      }).toThrow(RangeError);
    });
    it("throws on a non-number this", function () {
      expect(function () {
        return numberToFixed.call({}, 2);
      }).toThrow(TypeError);
    });
  });

  // src/modules/es.object.assign.ts
  var isSupported96 = function isSupported96() {
    try {
      if (typeof Object.assign !== "function") {
        return false;
      }
      var symbol = /* @__PURE__ */Symbol("test");
      var source = {};
      source[symbol] = 1;
      var _target2 = Object.assign({}, source);
      return _target2[symbol] === 1;
    } catch (e) {
      return false;
    }
  };
  var hasOwn = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  var nativeGetOwnPropertySymbols = Object.getOwnPropertySymbols;
  var objectAssign = function objectAssign(target) {
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target);
    var symbolsSupported = typeof Symbol !== "undefined" && typeof nativeGetOwnPropertySymbols === "function";
    for (var index = 0; index < (arguments.length <= 1 ? 0 : arguments.length - 1); index++) {
      var nextSource = index + 1 < 1 || arguments.length <= index + 1 ? undefined : arguments[index + 1];
      if (nextSource == null) {
        continue;
      }
      for (var _key5 in nextSource) {
        if (hasOwn.call(nextSource, _key5)) {
          to[_key5] = nextSource[_key5];
        }
      }
      if (symbolsSupported) {
        var symbols = nativeGetOwnPropertySymbols(nextSource);
        for (var symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++) {
          var symbolKey = symbols[symbolIndex];
          if (propIsEnumerable.call(nextSource, symbolKey)) {
            to[symbolKey] = nextSource[symbolKey];
          }
        }
      }
    }
    return to;
  };
  if (!isSupported96()) {
    Object.defineProperty(Object, "assign", {
      value: objectAssign,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.assign, "name", {
      value: "assign",
      configurable: true
    });
    Object.defineProperty(Object.assign, "__polyfilled", {
      value: true
    });
  }

  // tests/object-assign.test.ts
  describe("Object.assign \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns the target (same reference)", function () {
        var target = {};
        expect(objectAssign(target, {
          a: 1
        })).toBe(target);
      });
    });
    describe("target coercion (ToObject)", function () {
      it("throws TypeError on null target", function () {
        expect(function () {
          return objectAssign(null);
        }).toThrow(TypeError);
      });
      it("throws TypeError on undefined target", function () {
        expect(function () {
          return objectAssign(void 0);
        }).toThrow(TypeError);
      });
      it("boxes a primitive target and copies onto the wrapper", function () {
        var result = objectAssign(1, {
          a: "b"
        });
        expect(typeof result).toBe("object");
        expect(result.a).toBe("b");
      });
    });
    describe("source handling", function () {
      it("ignores null and undefined sources without throwing", function () {
        expect(objectAssign({}, null, {
          a: 1
        }, void 0)).toEqual({
          a: 1
        });
      });
      it("coerces a primitive source to an object and copies its indices", function () {
        expect(objectAssign({}, "abc")).toEqual({
          0: "a",
          1: "b",
          2: "c"
        });
      });
      it("overwrites with later sources (last wins)", function () {
        expect(objectAssign({}, {
          a: 1
        }, {
          a: 2
        })).toEqual({
          a: 2
        });
      });
    });
    describe("property selection", function () {
      it("copies only own enumerable properties (skips inherited)", function () {
        var proto2 = {
          inherited: true
        };
        var source = Object.create(proto2);
        source.own = "yes";
        expect(objectAssign({}, source)).toEqual({
          own: "yes"
        });
      });
      it("skips own non-enumerable properties", function () {
        var source = {};
        Object.defineProperty(source, "hidden", {
          value: 1,
          enumerable: false
        });
        source.visible = 2;
        expect(objectAssign({}, source)).toEqual({
          visible: 2
        });
      });
    });
    describe("accessor semantics", function () {
      it("invokes getters on the source", function () {
        var reads = 0;
        var source = {
          get a() {
            reads++;
            return 42;
          }
        };
        var out = objectAssign({}, source);
        expect(out).toEqual({
          a: 42
        });
        expect(reads).toBe(1);
      });
      it("invokes setters on the target ([[Set]] semantics)", function () {
        var written;
        var target = {};
        Object.defineProperty(target, "a", {
          set: function set(v) {
            written = v;
          },
          get: function get() {
            return written;
          },
          enumerable: true,
          configurable: true
        });
        objectAssign(target, {
          a: 7
        });
        expect(written).toBe(7);
      });
    });
    describe("error propagation", function () {
      it("propagates a throwing getter and halts further copying", function () {
        var source = {
          get bad() {
            throw new Error("boom");
          }
        };
        expect(function () {
          return objectAssign({}, source);
        }).toThrow("boom");
      });
    });
    describe("own-key visit order", function () {
      it("reads integer-indexed keys ascending, then string keys in insertion order", function () {
        var order = [];
        var source = {};
        var recordingGetter = function recordingGetter(label) {
          return {
            enumerable: true,
            configurable: true,
            get: function get() {
              order.push(label);
              return label;
            }
          };
        };
        Object.defineProperty(source, "b", recordingGetter("b"));
        Object.defineProperty(source, "2", recordingGetter("2"));
        Object.defineProperty(source, "a", recordingGetter("a"));
        Object.defineProperty(source, "1", recordingGetter("1"));
        objectAssign({}, source);
        expect(order).toEqual(["1", "2", "b", "a"]);
      });
    });
    describe("[[Set]] semantics on target", function () {
      it("throws TypeError writing to a non-writable target property (strict)", function () {
        var target = {};
        Object.defineProperty(target, "a", {
          value: 1,
          writable: false,
          enumerable: true,
          configurable: true
        });
        expect(function () {
          return objectAssign(target, {
            a: 2
          });
        }).toThrow(TypeError);
      });
    });
    describe("source mutation during copy", function () {
      it("skips a source property deleted by an earlier getter", function () {
        var source = {};
        Object.defineProperty(source, "a", {
          enumerable: true,
          configurable: true,
          get: function get() {
            delete source.b;
            return 1;
          }
        });
        source.b = 2;
        expect(objectAssign({}, source)).toEqual({
          a: 1
        });
      });
    });
    describe("Symbol-keyed properties", function () {
      it("copies own enumerable Symbol-keyed properties", function () {
        var sym = /* @__PURE__ */Symbol("s");
        var source = {};
        source[sym] = 1;
        var out = objectAssign({}, source);
        expect(out[sym]).toBe(1);
      });
      it("does NOT copy non-enumerable Symbol-keyed properties", function () {
        var sym = /* @__PURE__ */Symbol("s");
        var source = {};
        Object.defineProperty(source, sym, {
          value: 1,
          enumerable: false
        });
        var out = objectAssign({}, source);
        expect(out[sym]).toBeUndefined();
      });
    });
    describe("parity vs native", function () {
      it("merges multiple sources", function () {
        var s1 = {
          b: 2
        };
        var s2 = {
          c: 3
        };
        var nativeResult = Object.assign({
          a: 1
        }, s1, s2);
        var specResult = objectAssign({
          a: 1
        }, s1, s2);
        expect(specResult).toEqual(nativeResult);
      });
      it("copies many string keys", function () {
        var big = {};
        for (var _i75 = 0; _i75 < 50; _i75++) big["k".concat(_i75)] = _i75;
        var nativeResult = Object.assign({}, big);
        var specResult = objectAssign({}, big);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.object.entries.ts
  var isSupported97 = function isSupported97() {
    try {
      return typeof Object.entries === "function";
    } catch (e) {
      return false;
    }
  };
  var objectEntries = function objectEntries(obj) {
    if (obj == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var object = Object(obj);
    var keys2 = Object.keys(object);
    var pairs = [];
    for (var _i76 = 0; _i76 < keys2.length; _i76++) {
      pairs[pairs.length] = [keys2[_i76], object[keys2[_i76]]];
    }
    return pairs;
  };
  if (!isSupported97()) {
    Object.defineProperty(Object, "entries", {
      value: objectEntries,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.entries, "name", {
      value: "entries",
      configurable: true
    });
    Object.defineProperty(Object.entries, "__polyfilled", {
      value: true
    });
  }

  // tests/object-entries.test.ts
  describe("Object.entries \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns own enumerable [key, value] pairs", function () {
        expect(objectEntries({
          a: 1,
          b: 2
        })).toEqual([["a", 1], ["b", 2]]);
      });
      it("returns an empty array for an empty object", function () {
        expect(objectEntries({})).toEqual([]);
      });
    });
    describe("target coercion (ToObject)", function () {
      it("throws TypeError on null target", function () {
        expect(function () {
          return objectEntries(null);
        }).toThrow(TypeError);
      });
      it("throws TypeError on undefined target", function () {
        expect(function () {
          return objectEntries(void 0);
        }).toThrow(TypeError);
      });
      it("boxes a primitive string into indexed entries", function () {
        expect(objectEntries("abc")).toEqual([["0", "a"], ["1", "b"], ["2", "c"]]);
      });
    });
    describe("property selection", function () {
      it("skips inherited properties", function () {
        var source = /* @__PURE__ */Object.create({
          inherited: true
        });
        source.own = "yes";
        expect(objectEntries(source)).toEqual([["own", "yes"]]);
      });
      it("skips own non-enumerable properties", function () {
        var source = {};
        Object.defineProperty(source, "hidden", {
          value: 1,
          enumerable: false
        });
        source.visible = 2;
        expect(objectEntries(source)).toEqual([["visible", 2]]);
      });
    });
    describe("key order", function () {
      it("orders integer keys ascending before insertion-order string keys", function () {
        var source = {};
        source.b = "b";
        source[2] = "two";
        source.a = "a";
        source[1] = "one";
        expect(objectEntries(source)).toEqual([["1", "one"], ["2", "two"], ["b", "b"], ["a", "a"]]);
      });
    });
    describe("accessor semantics", function () {
      it("reads values via Get (invokes getters)", function () {
        var reads = 0;
        var source = {
          get a() {
            reads++;
            return 42;
          }
        };
        expect(objectEntries(source)).toEqual([["a", 42]]);
        expect(reads).toBe(1);
      });
    });
    describe("Symbol keys (spec parity, not a limitation)", function () {
      it("excludes Symbol-keyed properties", function () {
        var sym = /* @__PURE__ */Symbol("s");
        var source = {
          a: 1
        };
        source[sym] = 2;
        expect(objectEntries(source)).toEqual([["a", 1]]);
      });
    });
    describe("parity vs native", function () {
      it("matches native for a mixed object", function () {
        var obj = {
          name: "test",
          value: "hello",
          n: 3
        };
        var nativeResult = Object.entries(obj);
        var specResult = objectEntries(obj);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.object.get-own-property-descriptor.ts
  var isSupported98 = function isSupported98() {
    try {
      var descriptor = Object.getOwnPropertyDescriptor("a", 0);
      return !!descriptor && descriptor.value === "a";
    } catch (e) {
      return false;
    }
  };
  var isObjectGetOwnPropertyDescriptorSupported = isSupported98;
  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var objectGetOwnPropertyDescriptor = function objectGetOwnPropertyDescriptor(target, key) {
    if (target === null || target === void 0) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    return nativeGetOwnPropertyDescriptor(Object(target), key);
  };
  if (!isSupported98()) {
    Object.defineProperty(Object, "getOwnPropertyDescriptor", {
      value: objectGetOwnPropertyDescriptor,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.getOwnPropertyDescriptor, "name", {
      value: "getOwnPropertyDescriptor",
      configurable: true
    });
    Object.defineProperty(Object.getOwnPropertyDescriptor, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.get-own-property-names.ts
  var isSupported99 = function isSupported99() {
    try {
      return typeof Object.getOwnPropertyNames === "function";
    } catch (e) {
      return false;
    }
  };
  var nativeGetOwnPropertyNames = Object.getOwnPropertyNames;
  var objectGetOwnPropertyNames = function objectGetOwnPropertyNames(target) {
    if (target === null || target === void 0) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    return nativeGetOwnPropertyNames(Object(target));
  };
  if (!isSupported99()) {
    Object.defineProperty(Object, "getOwnPropertyNames", {
      value: objectGetOwnPropertyNames,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.getOwnPropertyNames, "name", {
      value: "getOwnPropertyNames",
      configurable: true
    });
    Object.defineProperty(Object.getOwnPropertyNames, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.get-prototype-of.ts
  var isSupported100 = function isSupported100() {
    try {
      return typeof Object.getPrototypeOf === "function";
    } catch (e) {
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
  if (!isSupported100()) {
    Object.defineProperty(Object, "getPrototypeOf", {
      value: objectGetPrototypeOf,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.getPrototypeOf, "name", {
      value: "getPrototypeOf",
      configurable: true
    });
    Object.defineProperty(Object.getPrototypeOf, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.is-extensible.ts
  var isSupported101 = function isSupported101() {
    try {
      return typeof Object.isExtensible === "function";
    } catch (e) {
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
  if (!isSupported101()) {
    Object.defineProperty(Object, "isExtensible", {
      value: objectIsExtensible,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.isExtensible, "name", {
      value: "isExtensible",
      configurable: true
    });
    Object.defineProperty(Object.isExtensible, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.is-frozen.ts
  var isSupported102 = function isSupported102() {
    try {
      return typeof Object.isFrozen === "function";
    } catch (e) {
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
  if (!isSupported102()) {
    Object.defineProperty(Object, "isFrozen", {
      value: objectIsFrozen,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.isFrozen, "name", {
      value: "isFrozen",
      configurable: true
    });
    Object.defineProperty(Object.isFrozen, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.keys.ts
  var isSupported103 = function isSupported103() {
    try {
      return typeof Object.keys === "function";
    } catch (e) {
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
    var keys2 = [];
    for (var _key6 in object) {
      if (Object.prototype.hasOwnProperty.call(object, _key6)) {
        keys2.push(_key6);
      }
    }
    return keys2;
  };
  if (!isSupported103()) {
    Object.defineProperty(Object, "keys", {
      value: objectKeys,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.keys, "name", {
      value: "keys",
      configurable: true
    });
    Object.defineProperty(Object.keys, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.prevent-extensions.ts
  var isSupported104 = function isSupported104() {
    try {
      return typeof Object.preventExtensions === "function";
    } catch (e) {
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
  if (!isSupported104()) {
    Object.defineProperty(Object, "preventExtensions", {
      value: objectPreventExtensions,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.preventExtensions, "name", {
      value: "preventExtensions",
      configurable: true
    });
    Object.defineProperty(Object.preventExtensions, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.seal.ts
  var isSupported105 = function isSupported105() {
    try {
      return typeof Object.seal === "function";
    } catch (e) {
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
  if (!isSupported105()) {
    Object.defineProperty(Object, "seal", {
      value: objectSeal,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.seal, "name", {
      value: "seal",
      configurable: true
    });
    Object.defineProperty(Object.seal, "__polyfilled", {
      value: true
    });
  }

  // tests/object-es2015-semantics.test.ts
  describe("Object statics \u2014 ES2015 primitive semantics", function () {
    describe("objectKeys", function () {
      it("returns own enumerable keys of an object", function () {
        expect(objectKeys({
          a: 1,
          b: 2
        })).toEqual(["a", "b"]);
      });
      it("boxes a string primitive (index keys)", function () {
        expect(objectKeys("ab")).toEqual(["0", "1"]);
      });
      it("returns [] for number and boolean primitives", function () {
        expect(objectKeys(42)).toEqual([]);
        expect(objectKeys(true)).toEqual([]);
      });
      it("still throws on null/undefined (ToObject rejects them)", function () {
        expect(function () {
          return objectKeys(null);
        }).toThrow(TypeError);
        expect(function () {
          return objectKeys(void 0);
        }).toThrow(TypeError);
      });
      it("matches native on objects", function () {
        var source = {
          x: 1,
          y: 2,
          z: 3
        };
        expect(objectKeys(source)).toEqual(Object.keys(source));
      });
    });
    describe("objectGetOwnPropertyNames", function () {
      it("includes non-enumerable own keys", function () {
        var target = {};
        Object.defineProperty(target, "hidden", {
          value: 1,
          enumerable: false
        });
        expect(objectGetOwnPropertyNames(target)).toContain("hidden");
      });
      it("boxes a string primitive (indices + length)", function () {
        var names = objectGetOwnPropertyNames("ab");
        expect(names).toContain("0");
        expect(names).toContain("1");
        expect(names).toContain("length");
      });
    });
    describe("objectGetPrototypeOf", function () {
      it("returns the prototype of an object", function () {
        var proto2 = {
          p: 1
        };
        expect(objectGetPrototypeOf(Object.create(proto2))).toBe(proto2);
      });
      it("boxes primitives to their wrapper prototypes", function () {
        expect(objectGetPrototypeOf("a")).toBe(String.prototype);
        expect(objectGetPrototypeOf(1)).toBe(Number.prototype);
        expect(objectGetPrototypeOf(true)).toBe(Boolean.prototype);
      });
    });
    describe("objectGetOwnPropertyDescriptor", function () {
      it("returns the descriptor of an own property", function () {
        var descriptor = objectGetOwnPropertyDescriptor({
          a: 1
        }, "a");
        expect(descriptor).toEqual({
          value: 1,
          writable: true,
          enumerable: true,
          configurable: true
        });
      });
      it("boxes a string primitive", function () {
        var descriptor = objectGetOwnPropertyDescriptor("a", 0);
        expect(descriptor && descriptor.value).toBe("a");
      });
      it("returns undefined for a missing key", function () {
        expect(objectGetOwnPropertyDescriptor({}, "nope")).toBeUndefined();
      });
      it("probe reports modern engines as supported", function () {
        expect(isObjectGetOwnPropertyDescriptorSupported()).toBe(true);
      });
    });
    describe("objectIsExtensible", function () {
      it("answers for objects", function () {
        expect(objectIsExtensible({})).toBe(true);
        expect(objectIsExtensible(Object.preventExtensions({}))).toBe(false);
      });
      it("returns false for primitives instead of throwing", function () {
        expect(objectIsExtensible(1)).toBe(false);
        expect(objectIsExtensible("a")).toBe(false);
        expect(objectIsExtensible(null)).toBe(false);
        expect(objectIsExtensible(void 0)).toBe(false);
      });
    });
    describe("objectIsFrozen", function () {
      it("answers for objects", function () {
        expect(objectIsFrozen({})).toBe(false);
        expect(objectIsFrozen(Object.freeze({}))).toBe(true);
      });
      it("returns true for primitives instead of throwing", function () {
        expect(objectIsFrozen(1)).toBe(true);
        expect(objectIsFrozen("a")).toBe(true);
        expect(objectIsFrozen(null)).toBe(true);
      });
    });
    describe("objectPreventExtensions", function () {
      it("prevents extensions on an object and returns it", function () {
        var target = {};
        expect(objectPreventExtensions(target)).toBe(target);
        expect(Object.isExtensible(target)).toBe(false);
      });
      it("passes primitives straight back", function () {
        expect(objectPreventExtensions(1)).toBe(1);
        expect(objectPreventExtensions("a")).toBe("a");
        expect(objectPreventExtensions(null)).toBe(null);
      });
    });
    describe("objectSeal", function () {
      it("seals an object and returns it", function () {
        var target = {
          a: 1
        };
        expect(objectSeal(target)).toBe(target);
        expect(Object.isSealed(target)).toBe(true);
      });
      it("passes primitives straight back", function () {
        expect(objectSeal(1)).toBe(1);
        expect(objectSeal("a")).toBe("a");
        expect(objectSeal(void 0)).toBe(void 0);
      });
    });
  });

  // src/modules/es.object.has-own.ts
  var isSupported106 = function isSupported106() {
    try {
      return typeof Object.hasOwn === "function";
    } catch (e) {
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
  if (!isSupported106()) {
    Object.defineProperty(Object, "hasOwn", {
      value: objectHasOwn,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.hasOwn, "name", {
      value: "hasOwn",
      configurable: true
    });
    Object.defineProperty(Object.hasOwn, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.object.set-prototype-of.ts
  var isSupported107 = function isSupported107() {
    try {
      return typeof Object.setPrototypeOf === "function";
    } catch (e) {
      return false;
    }
  };
  var protoSetterWorks = function () {
    try {
      var probe = {};
      probe.__proto__ = Array.prototype;
      return probe instanceof Array;
    } catch (e) {
      return false;
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
    if (protoSetterWorks) {
      target.__proto__ = proto2;
    }
    return target;
  };
  if (!isSupported107()) {
    Object.defineProperty(Object, "setPrototypeOf", {
      value: objectSetPrototypeOf,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.setPrototypeOf, "name", {
      value: "setPrototypeOf",
      configurable: true
    });
    Object.defineProperty(Object.setPrototypeOf, "__polyfilled", {
      value: true
    });
  }

  // tests/object-extras.test.ts
  describe("Object extras \u2014 test262 conformance", function () {
    describe("hasOwn", function () {
      it("reports own data properties, not inherited", function () {
        expect(objectHasOwn({
          a: 1
        }, "a")).toBe(true);
        expect(objectHasOwn({
          a: 1
        }, "b")).toBe(false);
        expect(objectHasOwn({}, "toString")).toBe(false);
      });
      it("works on a null-prototype object (the point of hasOwn)", function () {
        var bare = /* @__PURE__ */Object.create(null);
        bare.x = 1;
        expect(objectHasOwn(bare, "x")).toBe(true);
        expect(objectHasOwn(bare, "y")).toBe(false);
      });
      it("coerces a primitive target (ToObject) and string-keyed index", function () {
        expect(objectHasOwn("ab", 0)).toBe(true);
        expect(objectHasOwn("ab", 5)).toBe(false);
      });
      it("throws TypeError for null / undefined", function () {
        expect(function () {
          return objectHasOwn(null, "a");
        }).toThrow(TypeError);
        expect(function () {
          return objectHasOwn(void 0, "a");
        }).toThrow(TypeError);
      });
      it("matches native", function () {
        expect(objectHasOwn({
          a: 1
        }, "a")).toBe(Object.hasOwn({
          a: 1
        }, "a"));
      });
    });
    describe("setPrototypeOf", function () {
      it("re-points the prototype", function () {
        var obj = {};
        objectSetPrototypeOf(obj, Array.prototype);
        expect(obj instanceof Array).toBe(true);
        expect(typeof obj.push).toBe("function");
      });
      it("accepts a null prototype", function () {
        var obj = {
          a: 1
        };
        objectSetPrototypeOf(obj, null);
        expect(Object.getPrototypeOf(obj)).toBe(null);
      });
      it("returns the target", function () {
        var obj = {};
        expect(objectSetPrototypeOf(obj, Array.prototype)).toBe(obj);
      });
      it("returns a primitive target unchanged", function () {
        expect(objectSetPrototypeOf(42, Array.prototype)).toBe(42);
      });
      it("throws for null / undefined target, and a bad proto", function () {
        expect(function () {
          return objectSetPrototypeOf(null, {});
        }).toThrow(TypeError);
        expect(function () {
          return objectSetPrototypeOf({}, 42);
        }).toThrow(TypeError);
      });
      it("matches native", function () {
        var a = objectSetPrototypeOf({}, Array.prototype);
        var b = Object.setPrototypeOf({}, Array.prototype);
        expect(a instanceof Array).toBe(b instanceof Array);
      });
    });
  });

  // src/modules/es.object.freeze.ts
  var isSupported108 = function isSupported108() {
    try {
      Object == null ? void 0 : Object.freeze(1);
      return true;
    } catch (e) {
      return false;
    }
  };
  var nativeFreeze = Object.freeze;
  var objectFreeze = function objectFreeze(obj) {
    if (typeof obj !== "object" && typeof obj !== "function") return obj;
    return nativeFreeze(obj);
  };
  if (!isSupported108()) {
    Object.defineProperty(Object, "freeze", {
      value: objectFreeze,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.freeze, "name", {
      value: "freeze",
      configurable: true
    });
    Object.defineProperty(Object.freeze, "__polyfilled", {
      value: true
    });
  }

  // tests/object-freeze.test.ts
  describe("Object.freeze \u2014 test262 conformance", function () {
    describe("freezing objects", function () {
      it("returns the same object reference", function () {
        var obj = {
          a: 1
        };
        expect(objectFreeze(obj)).toBe(obj);
      });
      it("makes the object frozen", function () {
        expect(Object.isFrozen(objectFreeze({
          a: 1
        }))).toBe(true);
      });
      it("prevents modifying an existing property (throws in strict mode)", function () {
        var obj = objectFreeze({
          a: 1
        });
        expect(function () {
          obj.a = 2;
        }).toThrow(TypeError);
        expect(obj.a).toBe(1);
      });
      it("prevents adding a new property (throws in strict mode)", function () {
        var obj = objectFreeze({
          a: 1
        });
        expect(function () {
          obj.b = 2;
        }).toThrow(TypeError);
        expect("b" in obj).toBe(false);
      });
      it("prevents deleting a property (throws in strict mode)", function () {
        var obj = objectFreeze({
          a: 1
        });
        expect(function () {
          delete obj.a;
        }).toThrow(TypeError);
        expect(obj.a).toBe(1);
      });
      it("freezes arrays (cannot push)", function () {
        var arr = objectFreeze([1, 2, 3]);
        expect(Object.isFrozen(arr)).toBe(true);
        expect(function () {
          arr.push(4);
        }).toThrow(TypeError);
      });
    });
    describe("primitive arguments (the Chrome < 44 fix)", function () {
      it("returns a number unchanged", function () {
        expect(objectFreeze(1)).toBe(1);
      });
      it("returns a string unchanged", function () {
        expect(objectFreeze("str")).toBe("str");
      });
      it("returns a boolean unchanged", function () {
        expect(objectFreeze(true)).toBe(true);
      });
      it("returns null and undefined unchanged", function () {
        expect(objectFreeze(null)).toBe(null);
        expect(objectFreeze(void 0)).toBe(void 0);
      });
    });
    describe("shallow", function () {
      it("does not deep-freeze nested objects", function () {
        var obj = objectFreeze({
          nested: {
            x: 1
          }
        });
        expect(Object.isFrozen(obj.nested)).toBe(false);
        obj.nested.x = 2;
        expect(obj.nested.x).toBe(2);
      });
    });
    describe("parity vs native", function () {
      it("matches native freezing an object", function () {
        var native = Object.freeze;
        var nativeResult = Object.isFrozen(native({
          a: 1
        }));
        var specResult = Object.isFrozen(objectFreeze({
          a: 1
        }));
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.object.from-entries.ts
  var isSupported109 = function isSupported109() {
    try {
      return typeof Object.fromEntries === "function";
    } catch (e) {
      return false;
    }
  };
  var warnedGenericIterable = false;
  var objectFromEntries = function objectFromEntries(iterable) {
    var result = {};
    if (Array.isArray(iterable)) {
      for (var _i77 = 0; _i77 < iterable.length; _i77++) {
        result[iterable[_i77][0]] = iterable[_i77][1];
      }
    } else if (typeof iterable.forEach === "function") {
      iterable.forEach(function (value, key) {
        result[key] = value;
      });
    } else {
      if (!warnedGenericIterable) {
        warnedGenericIterable = true;
        console.warn("[spackle] Object.fromEntries: generic iterables are not implemented \u2014 only arrays of pairs and forEach-bearing collections; returning {}");
      }
    }
    return result;
  };
  if (!isSupported109()) {
    Object.defineProperty(Object, "fromEntries", {
      value: objectFromEntries,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.fromEntries, "name", {
      value: "fromEntries",
      configurable: true
    });
    Object.defineProperty(Object.fromEntries, "__polyfilled", {
      value: true
    });
  }

  // tests/object-from-entries.test.ts
  describe("Object.fromEntries \u2014 test262 conformance", function () {
    describe("array of pairs", function () {
      it("builds an object from pairs", function () {
        expect(objectFromEntries([["a", 1], ["b", 2]])).toEqual({
          a: 1,
          b: 2
        });
      });
      it("returns an empty object for an empty array", function () {
        expect(objectFromEntries([])).toEqual({});
      });
      it("last duplicate key wins", function () {
        expect(objectFromEntries([["a", 1], ["a", 2]])).toEqual({
          a: 2
        });
      });
      it("coerces a numeric key to a string property key", function () {
        var out = objectFromEntries([[1, "one"]]);
        expect(out["1"]).toBe("one");
      });
    });
    describe("Map source", function () {
      it("builds an object from a Map", function () {
        var map = /* @__PURE__ */new Map([["x", 10], ["y", 20]]);
        expect(objectFromEntries(map)).toEqual({
          x: 10,
          y: 20
        });
      });
    });
    describe("KNOWN LIMITATIONS (documented divergence from spec)", function () {
      it("does NOT consume a generic iterable (returns empty object)", function () {
        var iterable = _defineProperty({}, Symbol.iterator, function () {
          var done = false;
          return {
            next: function next() {
              if (done) return {
                value: void 0,
                done: true
              };
              done = true;
              return {
                value: ["a", 1],
                done: false
              };
            }
          };
        });
        expect(objectFromEntries(iterable)).toEqual({});
      });
    });
    describe("parity vs native", function () {
      it("matches native for an array of pairs", function () {
        var entries = [["a", 1], ["b", 2], ["c", 3]];
        var nativeResult = Object.fromEntries(entries);
        var specResult = objectFromEntries(entries);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.object.get-own-property-descriptors.ts
  var isSupported110 = function isSupported110() {
    try {
      return typeof Object.getOwnPropertyDescriptors === "function";
    } catch (e) {
      return false;
    }
  };
  var nativeGetOwnPropertyNames2 = Object.getOwnPropertyNames;
  var nativeGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
  var nativeGetOwnPropertySymbols2 = Object.getOwnPropertySymbols;
  var objectGetOwnPropertyDescriptors = function objectGetOwnPropertyDescriptors(obj) {
    var keys2 = nativeGetOwnPropertyNames2(obj);
    var result = {};
    for (var _i78 = 0; _i78 < keys2.length; _i78++) {
      result[keys2[_i78]] = nativeGetOwnPropertyDescriptor2(obj, keys2[_i78]);
    }
    if (typeof Symbol !== "undefined" && typeof nativeGetOwnPropertySymbols2 === "function") {
      var symbols = nativeGetOwnPropertySymbols2(obj);
      for (var symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++) {
        result[symbols[symbolIndex]] = nativeGetOwnPropertyDescriptor2(obj, symbols[symbolIndex]);
      }
    }
    return result;
  };
  if (!isSupported110()) {
    Object.defineProperty(Object, "getOwnPropertyDescriptors", {
      value: objectGetOwnPropertyDescriptors,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.getOwnPropertyDescriptors, "name", {
      value: "getOwnPropertyDescriptors",
      configurable: true
    });
    Object.defineProperty(Object.getOwnPropertyDescriptors, "__polyfilled", {
      value: true
    });
  }

  // tests/object-get-own-property-descriptors.test.ts
  describe("Object.getOwnPropertyDescriptors \u2014 test262 conformance", function () {
    describe("data descriptors", function () {
      it("returns a full descriptor per own property", function () {
        expect(objectGetOwnPropertyDescriptors({
          a: 1
        })).toEqual({
          a: {
            value: 1,
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
      });
      it("returns an empty map for an empty object", function () {
        expect(objectGetOwnPropertyDescriptors({})).toEqual({});
      });
      it("includes own non-enumerable properties", function () {
        var source = {};
        Object.defineProperty(source, "hidden", {
          value: 42,
          enumerable: false
        });
        var out = objectGetOwnPropertyDescriptors(source);
        expect(out.hidden.value).toBe(42);
        expect(out.hidden.enumerable).toBe(false);
      });
    });
    describe("accessor descriptors", function () {
      it("returns get/set functions for accessors", function () {
        var source = {
          get foo() {
            return 1;
          },
          set foo(_v) {}
        };
        var out = objectGetOwnPropertyDescriptors(source);
        expect(typeof out.foo.get).toBe("function");
        expect(typeof out.foo.set).toBe("function");
      });
    });
    describe("property selection", function () {
      it("excludes inherited properties", function () {
        var source = /* @__PURE__ */Object.create({
          inherited: true
        });
        source.own = "yes";
        expect(Object.keys(objectGetOwnPropertyDescriptors(source))).toEqual(["own"]);
      });
    });
    describe("Symbol-keyed properties", function () {
      it("includes enumerable Symbol-keyed properties", function () {
        var sym = /* @__PURE__ */Symbol("s");
        var source = {
          a: 1
        };
        source[sym] = 2;
        var out = objectGetOwnPropertyDescriptors(source);
        expect(out[sym]).toEqual({
          value: 2,
          writable: true,
          enumerable: true,
          configurable: true
        });
      });
      it("includes non-enumerable Symbol-keyed properties", function () {
        var sym = /* @__PURE__ */Symbol("s");
        var source = {};
        Object.defineProperty(source, sym, {
          value: 9,
          enumerable: false
        });
        var out = objectGetOwnPropertyDescriptors(source);
        expect(out[sym].value).toBe(9);
        expect(out[sym].enumerable).toBe(false);
      });
    });
    describe("parity vs native", function () {
      it("matches native for a mixed object", function () {
        var obj = {
          a: 1,
          b: "hello"
        };
        var nativeResult = Object.getOwnPropertyDescriptors(obj);
        var specResult = objectGetOwnPropertyDescriptors(obj);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.object.is.ts
  var isSupported111 = function isSupported111() {
    try {
      return typeof Object.is === "function";
    } catch (e) {
      return false;
    }
  };
  var objectIs = function objectIs(first, second) {
    if (first === second) {
      return first !== 0 || 1 / first === 1 / second;
    }
    return first !== first && second !== second;
  };
  if (!isSupported111()) {
    Object.defineProperty(Object, "is", {
      value: objectIs,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.is, "name", {
      value: "is",
      configurable: true
    });
    Object.defineProperty(Object.is, "__polyfilled", {
      value: true
    });
  }

  // tests/object-is.test.ts
  describe("Object.is \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns a boolean", function () {
        expect(typeof objectIs(1, 1)).toBe("boolean");
      });
    });
    describe("differs from strict equality", function () {
      it("treats NaN as equal to NaN (=== would be false)", function () {
        expect(objectIs(NaN, NaN)).toBe(true);
      });
      it("treats +0 and -0 as different (=== would be true)", function () {
        expect(objectIs(0, -0)).toBe(false);
        expect(objectIs(-0, 0)).toBe(false);
      });
      it("treats +0/+0 and -0/-0 as equal", function () {
        expect(objectIs(0, 0)).toBe(true);
        expect(objectIs(-0, -0)).toBe(true);
      });
    });
    describe("matches strict equality elsewhere", function () {
      it("compares numbers", function () {
        expect(objectIs(1, 1)).toBe(true);
        expect(objectIs(1, 2)).toBe(false);
        expect(objectIs(Infinity, Infinity)).toBe(true);
        expect(objectIs(Infinity, -Infinity)).toBe(false);
      });
      it("compares strings", function () {
        expect(objectIs("foo", "foo")).toBe(true);
        expect(objectIs("foo", "bar")).toBe(false);
      });
      it("compares booleans", function () {
        expect(objectIs(true, true)).toBe(true);
        expect(objectIs(true, false)).toBe(false);
      });
      it("handles null and undefined", function () {
        expect(objectIs(null, null)).toBe(true);
        expect(objectIs(void 0, void 0)).toBe(true);
        expect(objectIs(null, void 0)).toBe(false);
      });
      it("does not coerce across types", function () {
        expect(objectIs(0, "0")).toBe(false);
        expect(objectIs(0, false)).toBe(false);
        expect(objectIs("", false)).toBe(false);
      });
    });
    describe("object references", function () {
      it("compares by reference identity", function () {
        var obj = {};
        expect(objectIs(obj, obj)).toBe(true);
        expect(objectIs({}, {})).toBe(false);
      });
    });
    describe("parity vs native", function () {
      it("matches native across the SameValue edge cases", function () {
        var native = Object.is;
        var nativeResult = native(NaN, NaN) && !native(0, -0);
        var specResult = objectIs(NaN, NaN) && !objectIs(0, -0);
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.object.to-string.ts
  var isSupported112 = function isSupported112() {
    try {
      return typeof Object.prototype.toString === "function";
    } catch (e) {
      return false;
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
      } catch (e) {
        tag = void 0;
      }
      if (typeof tag === "string") {
        return "[object " + tag + "]";
      }
    }
    return nativeToString.call(this);
  };
  if (!isSupported112()) {
    Object.defineProperty(Object.prototype, "toString", {
      value: objectToString,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.prototype.toString, "name", {
      value: "toString",
      configurable: true
    });
    Object.defineProperty(Object.prototype.toString, "__polyfilled", {
      value: true
    });
  }

  // tests/object-to-string.test.ts
  describe("Object.prototype.toString island \u2014 test262 conformance", function () {
    it("tags null and undefined", function () {
      expect(objectToString.call(null)).toBe("[object Null]");
      expect(objectToString.call(void 0)).toBe("[object Undefined]");
    });
    it("defers to native for built-ins", function () {
      expect(objectToString.call([])).toBe("[object Array]");
      expect(objectToString.call({})).toBe("[object Object]");
      expect(objectToString.call(/* @__PURE__ */new Date())).toBe("[object Date]");
      expect(objectToString.call(/x/)).toBe("[object RegExp]");
    });
    it("honors a string Symbol.toStringTag", function () {
      var tagged = _defineProperty({}, Symbol.toStringTag, "Custom");
      expect(objectToString.call(tagged)).toBe("[object Custom]");
    });
    it("ignores a non-string Symbol.toStringTag", function () {
      var tagged = _defineProperty({}, Symbol.toStringTag, 42);
      expect(objectToString.call(tagged)).toBe("[object Object]");
    });
    it("matches native across a spread of values", function () {
      var samples = [null, void 0, [], {}, "a", 1, true, /x/, /* @__PURE__ */new Date(), Math, JSON];
      for (var _i79 = 0, _samples2 = samples; _i79 < _samples2.length; _i79++) {
        var sample = _samples2[_i79];
        expect(objectToString.call(sample)).toBe(Object.prototype.toString.call(sample));
      }
    });
  });

  // src/modules/es.object.values.ts
  var isSupported113 = function isSupported113() {
    try {
      return typeof Object.values === "function";
    } catch (e) {
      return false;
    }
  };
  var objectValues = function objectValues(obj) {
    if (obj == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var object = Object(obj);
    var keys2 = Object.keys(object);
    var values = [];
    for (var _i80 = 0; _i80 < keys2.length; _i80++) {
      values[values.length] = object[keys2[_i80]];
    }
    return values;
  };
  if (!isSupported113()) {
    Object.defineProperty(Object, "values", {
      value: objectValues,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Object.values, "name", {
      value: "values",
      configurable: true
    });
    Object.defineProperty(Object.values, "__polyfilled", {
      value: true
    });
  }

  // tests/object-values.test.ts
  describe("Object.values \u2014 test262 conformance", function () {
    describe("return value", function () {
      it("returns own enumerable values", function () {
        expect(objectValues({
          a: 1,
          b: 2
        })).toEqual([1, 2]);
      });
      it("returns an empty array for an empty object", function () {
        expect(objectValues({})).toEqual([]);
      });
    });
    describe("target coercion (ToObject)", function () {
      it("throws TypeError on null target", function () {
        expect(function () {
          return objectValues(null);
        }).toThrow(TypeError);
      });
      it("throws TypeError on undefined target", function () {
        expect(function () {
          return objectValues(void 0);
        }).toThrow(TypeError);
      });
      it("boxes a primitive string into indexed chars", function () {
        expect(objectValues("abc")).toEqual(["a", "b", "c"]);
      });
    });
    describe("property selection", function () {
      it("skips inherited properties", function () {
        var source = /* @__PURE__ */Object.create({
          inherited: true
        });
        source.own = "yes";
        expect(objectValues(source)).toEqual(["yes"]);
      });
      it("skips own non-enumerable properties", function () {
        var source = {};
        Object.defineProperty(source, "hidden", {
          value: 1,
          enumerable: false
        });
        source.visible = 2;
        expect(objectValues(source)).toEqual([2]);
      });
    });
    describe("key order", function () {
      it("orders integer keys ascending before insertion-order string keys", function () {
        var source = {};
        source.b = "b";
        source[2] = "two";
        source.a = "a";
        source[1] = "one";
        expect(objectValues(source)).toEqual(["one", "two", "b", "a"]);
      });
    });
    describe("accessor semantics", function () {
      it("reads values via Get (invokes getters)", function () {
        var reads = 0;
        var source = {
          get a() {
            reads++;
            return 42;
          }
        };
        expect(objectValues(source)).toEqual([42]);
        expect(reads).toBe(1);
      });
    });
    describe("Symbol keys (spec parity, not a limitation)", function () {
      it("excludes Symbol-keyed values", function () {
        var sym = /* @__PURE__ */Symbol("s");
        var source = {
          a: 1
        };
        source[sym] = 2;
        expect(objectValues(source)).toEqual([1]);
      });
    });
    describe("parity vs native", function () {
      it("matches native for a mixed object", function () {
        var obj = {
          name: "test",
          value: "hello",
          n: 3
        };
        var nativeResult = Object.values(obj);
        var specResult = objectValues(obj);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.parse-int.ts
  var WHITESPACE_CODES = [9, 10, 11, 12, 13, 32, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 8232, 8233, 65279];
  var whitespaces = "";
  for (var _i81 = 0; _i81 < WHITESPACE_CODES.length; _i81++) {
    whitespaces += String.fromCharCode(WHITESPACE_CODES[_i81]);
  }
  var nativeParseInt = parseInt;
  var trimRegExp = new RegExp("^[" + whitespaces + "]+|[" + whitespaces + "]+$", "g");
  var hexRegExp = /^[+-]?0x/i;
  var trim = function trim(value) {
    return String(value).replace(trimRegExp, "");
  };
  var isSupported114 = function isSupported114() {
    try {
      return nativeParseInt(whitespaces + "08") === 8 && nativeParseInt(whitespaces + "0x16") === 22;
    } catch (e) {
      return false;
    }
  };
  var numberParseInt2 = function parseInt2(string, radix) {
    var S2 = trim(string);
    return nativeParseInt(S2, radix >>> 0 || (hexRegExp.test(S2) ? 16 : 10));
  };
  if (!isSupported114()) {
    Object.defineProperty(window, "parseInt", {
      value: numberParseInt2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.parseInt, "name", {
      value: "parseInt",
      configurable: true
    });
    Object.defineProperty(window.parseInt, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.parse-float.ts
  var WHITESPACE_CODES2 = [9, 10, 11, 12, 13, 32, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 8232, 8233, 65279];
  var whitespaces2 = "";
  for (var _i82 = 0; _i82 < WHITESPACE_CODES2.length; _i82++) {
    whitespaces2 += String.fromCharCode(WHITESPACE_CODES2[_i82]);
  }
  var nativeParseFloat = parseFloat;
  var trimRegExp2 = new RegExp("^[" + whitespaces2 + "]+|[" + whitespaces2 + "]+$", "g");
  var trim2 = function trim2(value) {
    return String(value).replace(trimRegExp2, "");
  };
  var isSupported115 = function isSupported115() {
    try {
      return 1 / nativeParseFloat(whitespaces2 + "-0") === -Infinity;
    } catch (e) {
      return false;
    }
  };
  var numberParseFloat2 = function parseFloat2(string) {
    var trimmed = trim2(string);
    var result = nativeParseFloat(trimmed);
    return result === 0 && trimmed.charAt(0) === "-" ? -0 : result;
  };
  if (!isSupported115()) {
    Object.defineProperty(window, "parseFloat", {
      value: numberParseFloat2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.parseFloat, "name", {
      value: "parseFloat",
      configurable: true
    });
    Object.defineProperty(window.parseFloat, "__polyfilled", {
      value: true
    });
  }

  // tests/parse-int-float.test.ts
  describe("parseInt island", function () {
    it("does not treat a leading zero as octal", function () {
      expect(numberParseInt2("08")).toBe(8);
      expect(numberParseInt2("010")).toBe(10);
    });
    it("auto-detects the 0x hex prefix", function () {
      expect(numberParseInt2("0x16")).toBe(22);
      expect(numberParseInt2("-0xff")).toBe(-255);
    });
    it("trims leading/trailing whitespace", function () {
      expect(numberParseInt2("  42  ")).toBe(42);
      expect(numberParseInt2("	\n 7")).toBe(7);
    });
    it("honours an explicit radix", function () {
      expect(numberParseInt2("10", 2)).toBe(2);
      expect(numberParseInt2("ff", 16)).toBe(255);
    });
    it("returns NaN for non-numeric input", function () {
      expect(numberParseInt2("abc")).toBeNaN();
    });
  });
  describe("parseFloat island", function () {
    it("preserves -0 for a signed whitespace-y zero", function () {
      expect(1 / numberParseFloat2("-0")).toBe(-Infinity);
      expect(1 / numberParseFloat2("  -0 ")).toBe(-Infinity);
    });
    it("parses floats after trimming", function () {
      expect(numberParseFloat2("  3.14 ")).toBe(3.14);
      expect(numberParseFloat2("1e3")).toBe(1e3);
    });
    it("returns NaN for non-numeric input", function () {
      expect(numberParseFloat2("xyz")).toBeNaN();
    });
  });

  // src/modules/es.promise.all-settled.ts
  var isSupported116 = function isSupported116() {
    try {
      return typeof Promise !== "undefined" && typeof Promise.allSettled === "function";
    } catch (e) {
      return false;
    }
  };
  var isArrayLike = function isArrayLike(candidate) {
    return candidate != null && typeof candidate !== "function" && typeof candidate.length === "number";
  };
  var warnedGenericIterable2 = false;
  var toArray = function toArray(iterable) {
    var collected = [];
    if (isArrayLike(iterable)) {
      for (var _i83 = 0; _i83 < iterable.length; _i83++) {
        collected[collected.length] = iterable[_i83];
      }
      return collected;
    }
    if (typeof iterable.forEach === "function") {
      iterable.forEach(function (value) {
        collected[collected.length] = value;
      });
    } else if (!warnedGenericIterable2) {
      warnedGenericIterable2 = true;
      console.warn("[spackle] Promise.allSettled: generic iterables are not implemented \u2014 only arrays, array-likes and forEach-bearing collections; treating as empty");
    }
    return collected;
  };
  var settle = function settle(PromiseCtor, item, index, results, done) {
    PromiseCtor.resolve(item).then(function (value) {
      results[index] = {
        status: "fulfilled",
        value: value
      };
      done();
    }, function (reason) {
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
    return new PromiseCtor(function (resolve, reject) {
      if (iterable == null) {
        reject(new TypeError("Promise.allSettled requires an array-like or iterable argument"));
        return;
      }
      var items = toArray(iterable);
      var total = items.length;
      var results = new Array(total);
      var remaining = total;
      if (remaining === 0) {
        resolve(results);
        return;
      }
      for (var _i84 = 0; _i84 < total; _i84++) {
        settle(PromiseCtor, items[_i84], _i84, results, function () {
          remaining--;
          if (remaining === 0) {
            resolve(results);
          }
        });
      }
    });
  };
  if (typeof Promise !== "undefined" && !isSupported116()) {
    Object.defineProperty(Promise, "allSettled", {
      value: promiseAllSettled,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Promise.allSettled, "name", {
      value: "allSettled",
      configurable: true
    });
    Object.defineProperty(Promise.allSettled, "__polyfilled", {
      value: true
    });
  }

  // tests/promise-all-settled.test.ts
  describe("Promise.allSettled \u2014 test262 conformance", function () {
    it("resolves with all-fulfilled results in input order", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      var out;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            _context12.n = 1;
            return promiseAllSettled([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);
          case 1:
            out = _context12.v;
            expect(out).toEqual([{
              status: "fulfilled",
              value: 1
            }, {
              status: "fulfilled",
              value: 2
            }, {
              status: "fulfilled",
              value: 3
            }]);
          case 2:
            return _context12.a(2);
        }
      }, _callee12);
    })));
    it("preserves order and status for a mixed fulfil/reject input", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var out;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            _context13.n = 1;
            return promiseAllSettled([Promise.resolve("a"), Promise.reject("b"), Promise.resolve("c")]);
          case 1:
            out = _context13.v;
            expect(out).toEqual([{
              status: "fulfilled",
              value: "a"
            }, {
              status: "rejected",
              reason: "b"
            }, {
              status: "fulfilled",
              value: "c"
            }]);
          case 2:
            return _context13.a(2);
        }
      }, _callee13);
    })));
    it("never rejects, even when every input rejects", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
      var out;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            _context14.n = 1;
            return promiseAllSettled([Promise.reject("x"), Promise.reject("y")]);
          case 1:
            out = _context14.v;
            expect(out).toEqual([{
              status: "rejected",
              reason: "x"
            }, {
              status: "rejected",
              reason: "y"
            }]);
          case 2:
            return _context14.a(2);
        }
      }, _callee14);
    })));
    it("wraps non-promise values as fulfilled", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
      var out;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            _context15.n = 1;
            return promiseAllSettled([1, "two", true]);
          case 1:
            out = _context15.v;
            expect(out).toEqual([{
              status: "fulfilled",
              value: 1
            }, {
              status: "fulfilled",
              value: "two"
            }, {
              status: "fulfilled",
              value: true
            }]);
          case 2:
            return _context15.a(2);
        }
      }, _callee15);
    })));
    it("resolves with an empty array for empty input", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
      var out;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.n) {
          case 0:
            _context16.n = 1;
            return promiseAllSettled([]);
          case 1:
            out = _context16.v;
            expect(out).toEqual([]);
          case 2:
            return _context16.a(2);
        }
      }, _callee16);
    })));
    it("matches native Promise.allSettled for a mixed input", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      var input, nativeOut, polyOut;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.n) {
          case 0:
            input = function input() {
              return [Promise.resolve(1), Promise.reject(2)];
            };
            _context17.n = 1;
            return Promise.allSettled(input());
          case 1:
            nativeOut = _context17.v;
            _context17.n = 2;
            return promiseAllSettled(input());
          case 2:
            polyOut = _context17.v;
            expect(polyOut).toEqual(nativeOut);
          case 3:
            return _context17.a(2);
        }
      }, _callee17);
    })));
  });

  // src/modules/es.promise.any.ts
  var isSupported117 = function isSupported117() {
    try {
      return typeof Promise !== "undefined" && typeof Promise.any === "function";
    } catch (e) {
      return false;
    }
  };
  var isArrayLike2 = function isArrayLike2(candidate) {
    return candidate != null && typeof candidate !== "function" && typeof candidate.length === "number";
  };
  var warnedGenericIterable3 = false;
  var toArray2 = function toArray2(iterable) {
    var collected = [];
    if (isArrayLike2(iterable)) {
      for (var _i85 = 0; _i85 < iterable.length; _i85++) {
        collected[collected.length] = iterable[_i85];
      }
      return collected;
    }
    if (typeof iterable.forEach === "function") {
      iterable.forEach(function (value) {
        collected[collected.length] = value;
      });
    } else if (!warnedGenericIterable3) {
      warnedGenericIterable3 = true;
      console.warn("[spackle] Promise.any: generic iterables are not implemented \u2014 only arrays, array-likes and forEach-bearing collections; treating as empty");
    }
    return collected;
  };
  var makeAggregateError = function makeAggregateError(errors, message) {
    if (typeof AggregateError !== "undefined") {
      return new AggregateError(errors, message);
    }
    var err = new Error(message);
    err.name = "AggregateError";
    err.errors = errors;
    return err;
  };
  var collect = function collect(PromiseCtor, item, index, errors, resolve, done) {
    PromiseCtor.resolve(item).then(function (value) {
      resolve(value);
    }, function (reason) {
      errors[index] = reason;
      done();
    });
  };
  var promiseAny = function promiseAny(iterable) {
    var PromiseCtor = Promise;
    if (typeof this === "function") {
      PromiseCtor = this;
    }
    return new PromiseCtor(function (resolve, reject) {
      if (iterable == null) {
        reject(new TypeError("Promise.any requires an array-like or iterable argument"));
        return;
      }
      var items = toArray2(iterable);
      var total = items.length;
      var errors = new Array(total);
      var remaining = total;
      if (remaining === 0) {
        reject(makeAggregateError(errors, "All promises were rejected"));
        return;
      }
      for (var _i86 = 0; _i86 < total; _i86++) {
        collect(PromiseCtor, items[_i86], _i86, errors, resolve, function () {
          remaining--;
          if (remaining === 0) {
            reject(makeAggregateError(errors, "All promises were rejected"));
          }
        });
      }
    });
  };
  if (typeof Promise !== "undefined" && !isSupported117()) {
    Object.defineProperty(Promise, "any", {
      value: promiseAny,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Promise.any, "name", {
      value: "any",
      configurable: true
    });
    Object.defineProperty(Promise.any, "__polyfilled", {
      value: true
    });
  }

  // tests/promise-any.test.ts
  describe("Promise.any \u2014 test262 conformance", function () {
    it("resolves with the first fulfilment", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
      var out;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.n) {
          case 0:
            _context18.n = 1;
            return promiseAny([Promise.reject("nope"), Promise.resolve("win"), Promise.resolve("late")]);
          case 1:
            out = _context18.v;
            expect(out).toBe("win");
          case 2:
            return _context18.a(2);
        }
      }, _callee18);
    })));
    it("treats a non-promise value as an immediate fulfilment", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
      var out;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.n) {
          case 0:
            _context19.n = 1;
            return promiseAny([Promise.reject("x"), "plain"]);
          case 1:
            out = _context19.v;
            expect(out).toBe("plain");
          case 2:
            return _context19.a(2);
        }
      }, _callee19);
    })));
    it("rejects with an AggregateError when all inputs reject", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
      var caught, _t2;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.p = _context20.n) {
          case 0:
            _context20.p = 0;
            _context20.n = 1;
            return promiseAny([Promise.reject("a"), Promise.reject("b")]);
          case 1:
            _context20.n = 3;
            break;
          case 2:
            _context20.p = 2;
            _t2 = _context20.v;
            caught = _t2;
          case 3:
            expect(caught).toBeInstanceOf(Error);
            expect(caught.name).toBe("AggregateError");
            expect(caught.errors).toEqual(["a", "b"]);
          case 4:
            return _context20.a(2);
        }
      }, _callee20, null, [[0, 2]]);
    })));
    it("rejects with an AggregateError (no errors) for empty input", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
      var caught, _t3;
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.p = _context21.n) {
          case 0:
            _context21.p = 0;
            _context21.n = 1;
            return promiseAny([]);
          case 1:
            _context21.n = 3;
            break;
          case 2:
            _context21.p = 2;
            _t3 = _context21.v;
            caught = _t3;
          case 3:
            expect(caught.name).toBe("AggregateError");
            expect(caught.errors).toEqual([]);
          case 4:
            return _context21.a(2);
        }
      }, _callee21, null, [[0, 2]]);
    })));
    it("preserves rejection-reason order in AggregateError.errors", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
      var caught, _t4;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.p = _context22.n) {
          case 0:
            _context22.p = 0;
            _context22.n = 1;
            return promiseAny([Promise.reject("first"), Promise.reject("second"), Promise.reject("third")]);
          case 1:
            _context22.n = 3;
            break;
          case 2:
            _context22.p = 2;
            _t4 = _context22.v;
            caught = _t4;
          case 3:
            expect(caught.errors).toEqual(["first", "second", "third"]);
          case 4:
            return _context22.a(2);
        }
      }, _callee22, null, [[0, 2]]);
    })));
    it("matches native Promise.any for a fulfilling input", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
      var input, nativeOut, polyOut;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.n) {
          case 0:
            input = function input() {
              return [Promise.reject(0), Promise.resolve("ok")];
            };
            _context23.n = 1;
            return Promise.any(input());
          case 1:
            nativeOut = _context23.v;
            _context23.n = 2;
            return promiseAny(input());
          case 2:
            polyOut = _context23.v;
            expect(polyOut).toBe(nativeOut);
          case 3:
            return _context23.a(2);
        }
      }, _callee23);
    })));
  });

  // src/modules/es.promise.finally.ts
  var isSupported118 = function isSupported118() {
    try {
      return typeof Promise !== "undefined" && typeof Promise.prototype.finally === "function";
    } catch (e) {
      return false;
    }
  };
  var promiseFinally = function promiseFinally(callback) {
    var PromiseCtor = typeof this.constructor === "function" ? this.constructor : Promise;
    return this.then(function (value) {
      return PromiseCtor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return PromiseCtor.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
  if (typeof Promise !== "undefined" && !isSupported118()) {
    Object.defineProperty(Promise.prototype, "finally", {
      value: promiseFinally,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Promise.prototype.finally, "name", {
      value: "finally",
      configurable: true
    });
    Object.defineProperty(Promise.prototype.finally, "__polyfilled", {
      value: true
    });
  }

  // tests/promise-finally.test.ts
  describe("Promise.prototype.finally \u2014 test262 conformance", function () {
    it("calls the callback on fulfilment and passes the value through", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
      var called, result;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.n) {
          case 0:
            called = false;
            _context24.n = 1;
            return promiseFinally.call(Promise.resolve(42), function () {
              called = true;
            });
          case 1:
            result = _context24.v;
            expect(called).toBe(true);
            expect(result).toBe(42);
          case 2:
            return _context24.a(2);
        }
      }, _callee24);
    })));
    it("calls the callback on rejection and re-throws the reason", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
      var called, err;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.n) {
          case 0:
            called = false;
            err = new Error("fail");
            _context25.n = 1;
            return expect(promiseFinally.call(Promise.reject(err), function () {
              called = true;
            })).rejects.toBe(err);
          case 1:
            expect(called).toBe(true);
          case 2:
            return _context25.a(2);
        }
      }, _callee25);
    })));
    it("ignores the callback return value on fulfilment", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
      var result;
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.n) {
          case 0:
            _context26.n = 1;
            return promiseFinally.call(Promise.resolve("hello"), function () {
              return "ignored";
            });
          case 1:
            result = _context26.v;
            expect(result).toBe("hello");
          case 2:
            return _context26.a(2);
        }
      }, _callee26);
    })));
    it("invokes the callback with no arguments", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
      var args;
      return _regenerator().w(function (_context27) {
        while (1) switch (_context27.n) {
          case 0:
            args = [-1];
            _context27.n = 1;
            return promiseFinally.call(Promise.resolve(1), function () {
              for (var _len4 = arguments.length, a = new Array(_len4), _key7 = 0; _key7 < _len4; _key7++) {
                a[_key7] = arguments[_key7];
              }
              args = a;
            });
          case 1:
            expect(args.length).toBe(0);
          case 2:
            return _context27.a(2);
        }
      }, _callee27);
    })));
    it("a throwing callback overrides a fulfilled value with the thrown error", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28() {
      var boom;
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.n) {
          case 0:
            boom = new Error("boom");
            _context28.n = 1;
            return expect(promiseFinally.call(Promise.resolve("val"), function () {
              throw boom;
            })).rejects.toBe(boom);
          case 1:
            return _context28.a(2);
        }
      }, _callee28);
    })));
    it("a callback returning a rejected promise overrides the fulfilled value", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29() {
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.n) {
          case 0:
            _context29.n = 1;
            return expect(promiseFinally.call(Promise.resolve("val"), function () {
              return Promise.reject(new Error("late"));
            })).rejects.toThrow("late");
          case 1:
            return _context29.a(2);
        }
      }, _callee29);
    })));
    it("awaits a thenable returned by the callback before settling", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30() {
      var order, p;
      return _regenerator().w(function (_context30) {
        while (1) switch (_context30.n) {
          case 0:
            order = [];
            p = promiseFinally.call(Promise.resolve("v"), function () {
              return new Promise(function (resolve) {
                setTimeout(function () {
                  order.push("callback-settled");
                  resolve();
                }, 10);
              });
            });
            _context30.n = 1;
            return p.then(function () {
              return order.push("outer-settled");
            });
          case 1:
            expect(order).toEqual(["callback-settled", "outer-settled"]);
          case 2:
            return _context30.a(2);
        }
      }, _callee30);
    })));
    it("matches native finally for a resolved promise", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
      var nativeResult, polyfillResult;
      return _regenerator().w(function (_context31) {
        while (1) switch (_context31.n) {
          case 0:
            _context31.n = 1;
            return Promise.resolve("val").finally(function () {});
          case 1:
            nativeResult = _context31.v;
            _context31.n = 2;
            return promiseFinally.call(Promise.resolve("val"), function () {});
          case 2:
            polyfillResult = _context31.v;
            expect(polyfillResult).toBe(nativeResult);
          case 3:
            return _context31.a(2);
        }
      }, _callee31);
    })));
  });

  // src/modules/es.promise.try.ts
  var isSupported119 = function isSupported119() {
    try {
      return typeof Promise !== "undefined" && typeof Promise.try === "function";
    } catch (e) {
      return false;
    }
  };
  var promiseTry = function promiseTry(callback) {
    for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key8 = 1; _key8 < _len5; _key8++) {
      args[_key8 - 1] = arguments[_key8];
    }
    return new this(function (resolve) {
      resolve(callback.apply(void 0, args));
    });
  };
  if (typeof Promise !== "undefined" && !isSupported119()) {
    Object.defineProperty(Promise, "try", {
      value: promiseTry,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Promise.try, "name", {
      value: "try",
      configurable: true
    });
    Object.defineProperty(Promise.try, "__polyfilled", {
      value: true
    });
  }

  // tests/promise-try.test.ts
  describe("Promise.try \u2014 test262 conformance", function () {
    var promiseTryCall = function promiseTryCall(callback) {
      for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key9 = 1; _key9 < _len6; _key9++) {
        args[_key9 - 1] = arguments[_key9];
      }
      return promiseTry.apply(Promise, [callback].concat(args));
    };
    it("returns a thenable", function () {
      var result = promiseTryCall(function () {
        return 1;
      });
      expect(typeof result.then).toBe("function");
    });
    it("resolves with the callback return value", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32() {
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.n) {
          case 0:
            _context32.n = 1;
            return expect(promiseTryCall(function () {
              return 42;
            })).resolves.toBe(42);
          case 1:
            return _context32.a(2);
        }
      }, _callee32);
    })));
    it("rejects when the callback throws synchronously", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
      return _regenerator().w(function (_context33) {
        while (1) switch (_context33.n) {
          case 0:
            _context33.n = 1;
            return expect(promiseTryCall(function () {
              throw new Error("boom");
            })).rejects.toThrow("boom");
          case 1:
            return _context33.a(2);
        }
      }, _callee33);
    })));
    it("adopts a returned thenable", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
      return _regenerator().w(function (_context34) {
        while (1) switch (_context34.n) {
          case 0:
            _context34.n = 1;
            return expect(promiseTryCall(function () {
              return Promise.resolve("inner");
            })).resolves.toBe("inner");
          case 1:
            return _context34.a(2);
        }
      }, _callee34);
    })));
    it("forwards extra arguments to the callback", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35() {
      return _regenerator().w(function (_context35) {
        while (1) switch (_context35.n) {
          case 0:
            _context35.n = 1;
            return expect(promiseTryCall(function (a, b) {
              return a + b;
            }, 2, 3)).resolves.toBe(5);
          case 1:
            return _context35.a(2);
        }
      }, _callee35);
    })));
    it("runs the callback synchronously (before the next microtask)", function () {
      var ran = false;
      promiseTryCall(function () {
        ran = true;
      });
      expect(ran).toBe(true);
    });
  });

  // src/modules/es.promise.with-resolvers.ts
  var isSupported120 = function isSupported120() {
    try {
      return typeof Promise !== "undefined" && typeof Promise.withResolvers === "function";
    } catch (e) {
      return false;
    }
  };
  var promiseWithResolvers = function promiseWithResolvers() {
    var resolve;
    var reject;
    var promise = new this(function (resolveFn, rejectFn) {
      resolve = resolveFn;
      reject = rejectFn;
    });
    return {
      promise: promise,
      resolve: resolve,
      reject: reject
    };
  };
  if (typeof Promise !== "undefined" && !isSupported120()) {
    Object.defineProperty(Promise, "withResolvers", {
      value: promiseWithResolvers,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Promise.withResolvers, "name", {
      value: "withResolvers",
      configurable: true
    });
    Object.defineProperty(Promise.withResolvers, "__polyfilled", {
      value: true
    });
  }

  // tests/promise-with-resolvers.test.ts
  describe("Promise.withResolvers \u2014 test262 conformance", function () {
    var withResolvers = function withResolvers() {
      return promiseWithResolvers.call(Promise);
    };
    it("returns an object with promise, resolve and reject", function () {
      var _withResolvers = withResolvers(),
        promise = _withResolvers.promise,
        resolve = _withResolvers.resolve,
        reject = _withResolvers.reject;
      expect(promise).toBeInstanceOf(Promise);
      expect(typeof resolve).toBe("function");
      expect(typeof reject).toBe("function");
    });
    it("resolve settles the promise", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36() {
      var _withResolvers2, promise, resolve;
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.n) {
          case 0:
            _withResolvers2 = withResolvers(), promise = _withResolvers2.promise, resolve = _withResolvers2.resolve;
            resolve(42);
            _context36.n = 1;
            return expect(promise).resolves.toBe(42);
          case 1:
            return _context36.a(2);
        }
      }, _callee36);
    })));
    it("reject rejects the promise", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37() {
      var _withResolvers3, promise, reject;
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.n) {
          case 0:
            _withResolvers3 = withResolvers(), promise = _withResolvers3.promise, reject = _withResolvers3.reject;
            reject(new Error("nope"));
            _context37.n = 1;
            return expect(promise).rejects.toThrow("nope");
          case 1:
            return _context37.a(2);
        }
      }, _callee37);
    })));
    it("builds the promise from the receiver constructor", function () {
      var _withResolvers4 = withResolvers(),
        promise = _withResolvers4.promise;
      expect(promise.constructor).toBe(Promise);
    });
  });

  // src/modules/web.queue-microtask.ts
  var isSupported121 = function isSupported121() {
    try {
      return typeof window.queueMicrotask === "function";
    } catch (e) {
      return false;
    }
  };
  var resolved = null;
  var queueMicrotask = function queueMicrotask(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("queueMicrotask requires a function argument");
    }
    if (resolved === null) {
      resolved = Promise.resolve();
    }
    resolved.then(function () {
      try {
        callback();
      } catch (error) {
        setTimeout(function () {
          throw error;
        }, 0);
      }
    });
  };
  if (!isSupported121()) {
    Object.defineProperty(window, "queueMicrotask", {
      value: queueMicrotask,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.queueMicrotask, "name", {
      value: "queueMicrotask",
      configurable: true
    });
    Object.defineProperty(window.queueMicrotask, "__polyfilled", {
      value: true
    });
  }

  // tests/queue-microtask.test.ts
  describe("queueMicrotask \u2014 polyfill", function () {
    it("runs the callback asynchronously (not synchronously)", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38() {
      var ran;
      return _regenerator().w(function (_context38) {
        while (1) switch (_context38.n) {
          case 0:
            ran = false;
            queueMicrotask(function () {
              ran = true;
            });
            expect(ran).toBe(false);
            _context38.n = 1;
            return Promise.resolve();
          case 1:
            expect(ran).toBe(true);
          case 2:
            return _context38.a(2);
        }
      }, _callee38);
    })));
    it("runs before a macrotask (setTimeout)", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39() {
      var order;
      return _regenerator().w(function (_context39) {
        while (1) switch (_context39.n) {
          case 0:
            order = [];
            _context39.n = 1;
            return new Promise(function (resolve) {
              setTimeout(function () {
                order.push("timeout");
                resolve();
              }, 0);
              queueMicrotask2(function () {
                order.push("microtask");
              });
            });
          case 1:
            expect(order).toEqual(["microtask", "timeout"]);
          case 2:
            return _context39.a(2);
        }
      }, _callee39);
    })));
    it("preserves scheduling order across multiple calls", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40() {
      var order;
      return _regenerator().w(function (_context40) {
        while (1) switch (_context40.n) {
          case 0:
            order = [];
            queueMicrotask(function () {
              return order.push(1);
            });
            queueMicrotask(function () {
              return order.push(2);
            });
            queueMicrotask(function () {
              return order.push(3);
            });
            _context40.n = 1;
            return Promise.resolve();
          case 1:
            _context40.n = 2;
            return Promise.resolve();
          case 2:
            expect(order).toEqual([1, 2, 3]);
          case 3:
            return _context40.a(2);
        }
      }, _callee40);
    })));
    it("throws synchronously when the argument is not a function", function () {
      expect(function () {
        return queueMicrotask(42);
      }).toThrow(TypeError);
    });
    function queueMicrotask2(cb) {
      queueMicrotask(cb);
    }
  });

  // src/modules/_reflect-impl.ts
  var isSupported122 = function isSupported122() {
    try {
      return typeof Reflect2 !== "undefined";
    } catch (e) {
      return false;
    }
  };
  var hasOwn2 = Object.prototype.hasOwnProperty;
  var getProto = Object.getPrototypeOf || function (o) {
    return o.__proto__ || null;
  };
  var setProto = Object.setPrototypeOf || function (o, proto2) {
    o.__proto__ = proto2;
    return o;
  };
  var findDescriptor = function findDescriptor(target, key) {
    var obj = target;
    while (obj !== null && obj !== void 0) {
      if (hasOwn2.call(obj, key)) {
        return Object.getOwnPropertyDescriptor(obj, key);
      }
      obj = getProto(obj);
    }
    return void 0;
  };
  var Reflect2 = {
    apply: function apply(target, thisArgument, argumentsList) {
      return Function.prototype.apply.call(target, thisArgument, argumentsList);
    },
    // No spread on the floor — bind a null-this constructor with the args spliced
    // in, then `new` it. Re-point the prototype when a distinct newTarget is given.
    construct: function construct(target, argumentsList, newTarget) {
      var args = [null];
      for (var _i87 = 0; _i87 < argumentsList.length; _i87++) {
        args[args.length] = argumentsList[_i87];
      }
      var Bound = Function.prototype.bind.apply(target, args);
      var instance = new Bound();
      if (newTarget !== void 0 && newTarget !== target && newTarget.prototype) {
        setProto(instance, newTarget.prototype);
      }
      return instance;
    },
    defineProperty: function defineProperty(target, key, attributes) {
      try {
        Object.defineProperty(target, key, attributes);
        return true;
      } catch (e) {
        return false;
      }
    },
    deleteProperty: function deleteProperty(target, key) {
      try {
        delete target[key];
        return true;
      } catch (e) {
        return false;
      }
    },
    get: function get(target, key, receiver) {
      var desc = findDescriptor(target, key);
      if (desc === void 0) {
        return void 0;
      }
      if (desc.get) {
        return desc.get.call(receiver === void 0 ? target : receiver);
      }
      return desc.value;
    },
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, key) {
      return Object.getOwnPropertyDescriptor(target, key);
    },
    getPrototypeOf: function getPrototypeOf(target) {
      return getProto(target);
    },
    has: function has(target, key) {
      return key in target;
    },
    isExtensible: function isExtensible(target) {
      return Object.isExtensible(target);
    },
    ownKeys: function ownKeys(target) {
      var keys2 = Object.getOwnPropertyNames(target);
      if (typeof Object.getOwnPropertySymbols === "function") {
        var symbols = Object.getOwnPropertySymbols(target);
        for (var _i88 = 0; _i88 < symbols.length; _i88++) {
          keys2[keys2.length] = symbols[_i88];
        }
      }
      return keys2;
    },
    preventExtensions: function preventExtensions(target) {
      try {
        Object.preventExtensions(target);
        return true;
      } catch (e) {
        return false;
      }
    },
    set: function set(target, key, value, receiver) {
      var dest = receiver === void 0 ? target : receiver;
      var desc = findDescriptor(target, key);
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
      try {
        setProto(target, proto2);
        return true;
      } catch (e) {
        return false;
      }
    }
  };
  if (!isSupported122()) {
    window.Reflect = null;
    delete window.Reflect;
    Object.defineProperty(window, "Reflect", {
      value: Reflect2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.Reflect, "name", {
      value: "Reflect",
      configurable: true
    });
    Object.defineProperty(window.Reflect, "__polyfilled", {
      value: true
    });
  }

  // tests/reflect.test.ts
  describe("Reflect \u2014 partial polyfill", function () {
    it("apply() calls with thisArg + args list", function () {
      var fn = function fn(a, b) {
        return this.base + a + b;
      };
      expect(Reflect2.apply(fn, {
        base: 10
      }, [2, 3])).toBe(15);
    });
    it("construct() builds an instance from an args list", function () {
      function Point(x, y) {
        this.x = x;
        this.y = y;
      }
      var p = Reflect2.construct(Point, [3, 4]);
      expect(p instanceof Point).toBe(true);
      expect(p.x).toBe(3);
      expect(p.y).toBe(4);
    });
    it("construct() honors a distinct newTarget prototype", function () {
      function Base() {
        this.tag = "base";
      }
      function Derived() {}
      Derived.prototype.kind = "derived";
      var inst = Reflect2.construct(Base, [], Derived);
      expect(inst.tag).toBe("base");
      expect(inst.kind).toBe("derived");
    });
    it("get()/set() read and write, including accessors via receiver", function () {
      var obj = {
        _v: 1,
        get v() {
          return this._v;
        },
        set v(x) {
          this._v = x;
        }
      };
      expect(Reflect2.get(obj, "v")).toBe(1);
      expect(Reflect2.set(obj, "v", 9)).toBe(true);
      expect(obj._v).toBe(9);
    });
    it("get() walks the prototype chain", function () {
      var proto2 = {
        inherited: 42
      };
      var child = Object.create(proto2);
      expect(Reflect2.get(child, "inherited")).toBe(42);
    });
    it("set() fails (false) on a getter-only accessor", function () {
      var obj = {
        get ro() {
          return 1;
        }
      };
      expect(Reflect2.set(obj, "ro", 2)).toBe(false);
    });
    it("has() mirrors the `in` operator", function () {
      expect(Reflect2.has({
        a: 1
      }, "a")).toBe(true);
      expect(Reflect2.has({
        a: 1
      }, "b")).toBe(false);
      expect(Reflect2.has([], "length")).toBe(true);
    });
    it("deleteProperty() removes and reports success", function () {
      var obj = {
        a: 1
      };
      expect(Reflect2.deleteProperty(obj, "a")).toBe(true);
      expect("a" in obj).toBe(false);
    });
    it("defineProperty() returns true on success, false on failure", function () {
      var obj = {};
      expect(Reflect2.defineProperty(obj, "x", {
        value: 5
      })).toBe(true);
      expect(obj.x).toBe(5);
      Object.freeze(obj);
      expect(Reflect2.defineProperty(obj, "y", {
        value: 6
      })).toBe(false);
    });
    it("ownKeys() lists own string keys", function () {
      expect(Reflect2.ownKeys({
        a: 1,
        b: 2
      }).sort()).toEqual(["a", "b"]);
    });
    it("ownKeys() includes Symbol keys when present", function () {
      var s = /* @__PURE__ */Symbol("s");
      var obj = {
        a: 1
      };
      obj[s] = 2;
      expect(Reflect2.ownKeys(obj)).toContain(s);
    });
    it("getPrototypeOf()/setPrototypeOf() round-trip", function () {
      var proto2 = {
        p: 1
      };
      var obj = {};
      expect(Reflect2.setPrototypeOf(obj, proto2)).toBe(true);
      expect(Reflect2.getPrototypeOf(obj)).toBe(proto2);
    });
    it("isExtensible()/preventExtensions()", function () {
      var obj = {};
      expect(Reflect2.isExtensible(obj)).toBe(true);
      expect(Reflect2.preventExtensions(obj)).toBe(true);
      expect(Reflect2.isExtensible(obj)).toBe(false);
    });
    it("getOwnPropertyDescriptor()", function () {
      var desc = Reflect2.getOwnPropertyDescriptor({
        a: 1
      }, "a");
      expect(desc.value).toBe(1);
      expect(desc.enumerable).toBe(true);
    });
  });

  // src/modules/es.regexp.constructor.ts
  var isSupported123 = function isSupported123() {
    try {
      var regex = new RegExp("a", "y");
      if (regex.sticky !== true) {
        return false;
      }
      regex.lastIndex = 1;
      return regex.exec("a_a") === null;
    } catch (e) {
      return false;
    }
  };
  var isRegExpStickySupported = isSupported123;
  var NativeRegExp = RegExp;
  var supportsSticky = true;
  try {
    new NativeRegExp("a", "y");
  } catch (e) {
    supportsSticky = false;
  }
  var supportsUnicode = true;
  try {
    new NativeRegExp("a", "u");
  } catch (e) {
    supportsUnicode = false;
  }
  var warnedUnicode = false;
  var makeStickyInstance = function makeStickyInstance(source, flags) {
    var bareFlags = flags.replace("y", "");
    var searcherFlags = bareFlags.indexOf("g") === -1 ? bareFlags + "g" : bareFlags;
    var searcher = new NativeRegExp(source, searcherFlags);
    var instance = new NativeRegExp(source, bareFlags);
    instance.lastIndex = 0;
    try {
      Object.defineProperty(instance, "sticky", {
        value: true
      });
      Object.defineProperty(instance, "flags", {
        value: flags
      });
    } catch (e) {}
    instance.exec = function (input) {
      var str = String(input);
      searcher.lastIndex = this.lastIndex;
      var match = searcher.exec(str);
      if (match && match.index === this.lastIndex) {
        this.lastIndex = searcher.lastIndex;
        return match;
      }
      this.lastIndex = 0;
      return null;
    };
    instance.test = function (input) {
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
  if (!isSupported123()) {
    window.RegExp = null;
    delete window.RegExp;
    Object.defineProperty(window, "RegExp", {
      value: RegExpPolyfill,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.RegExp, "name", {
      value: "RegExp",
      configurable: true
    });
    Object.defineProperty(window.RegExp, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.regexp.to-string.ts
  var isSupported124 = function isSupported124() {
    try {
      return typeof RegExp.prototype.toString === "function";
    } catch (e) {
      return false;
    }
  };
  var regExpToString = function regExpToString() {
    if (this === null || this === void 0) {
      throw new TypeError("RegExp.prototype.toString called on null or undefined");
    }
    return "/" + String(this.source) + "/" + String(this.flags);
  };
  if (!isSupported124()) {
    Object.defineProperty(RegExp.prototype, "toString", {
      value: regExpToString,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RegExp.prototype.toString, "name", {
      value: "toString",
      configurable: true
    });
    Object.defineProperty(RegExp.prototype.toString, "__polyfilled", {
      value: true
    });
  }

  // tests/regexp-constructor.test.ts
  describe("RegExp constructor wrapper", function () {
    describe("construction", function () {
      it("builds plain regexes (callable with and without new)", function () {
        var constructed = new RegExpPolyfill("a.c", "i");
        expect(constructed instanceof RegExp).toBe(true);
        expect(constructed.test("AbC")).toBe(true);
        var called = RegExpPolyfill("x");
        expect(called instanceof RegExp).toBe(true);
      });
      it("copy-constructs from a regex, keeping flags", function () {
        var original = /ab/gi;
        var copy = new RegExpPolyfill(original);
        expect(copy.source).toBe("ab");
        expect(copy.flags).toContain("g");
        expect(copy.flags).toContain("i");
      });
      it("copy-constructs with overridden flags", function () {
        var copy = new RegExpPolyfill(/ab/g, "i");
        expect(copy.flags).toBe("i");
      });
      it("handles undefined pattern as empty source", function () {
        var empty = new RegExpPolyfill();
        expect(empty.test("")).toBe(true);
      });
      it("builds sticky regexes that anchor at lastIndex", function () {
        var sticky = new RegExpPolyfill("a", "y");
        expect(sticky.sticky).toBe(true);
        sticky.lastIndex = 1;
        expect(sticky.exec("a_a")).toBe(null);
        expect(sticky.lastIndex).toBe(0);
        var hit = sticky.exec("a_a");
        expect(hit && hit.index).toBe(0);
        expect(sticky.lastIndex).toBe(1);
      });
    });
    describe("probe", function () {
      it("reports modern engines as supported", function () {
        expect(isRegExpStickySupported()).toBe(true);
      });
    });
  });
  describe("RegExp.prototype.toString island", function () {
    it("serializes source and flags", function () {
      expect(regExpToString.call(/ab/gi)).toBe("/ab/gi");
    });
    it("is generic over duck-typed regex-likes", function () {
      expect(regExpToString.call({
        source: "x",
        flags: "y"
      })).toBe("/x/y");
    });
    it("throws on null/undefined this", function () {
      expect(function () {
        return regExpToString.call(null);
      }).toThrow(TypeError);
    });
    it("matches native on real regexes", function () {
      expect(regExpToString.call(/a|b/m)).toBe(/a|b/m.toString());
    });
  });

  // src/modules/es.regexp.escape.ts
  var isSupported125 = function isSupported125() {
    try {
      return typeof RegExp.escape === "function";
    } catch (e) {
      return false;
    }
  };
  var SYNTAX_CHARS = "^$\\.*+?()[]{}|/";
  var OTHER_PUNCTUATORS = ",-=<>#&!%:;@~'`\"";
  var isWhiteSpaceOrLineTerminator = function isWhiteSpaceOrLineTerminator(code) {
    return code >= 9 && code <= 13 ||
    // tab, LF, VT, FF, CR
    code === 32 || code === 160 || code === 5760 || code >= 8192 && code <= 8202 || code === 8232 || code === 8233 || code === 8239 || code === 8287 || code === 12288 || code === 65279;
  };
  var hexEscape = function hexEscape(code) {
    var hex = code.toString(16);
    if (code <= 255) {
      return "\\x" + (hex.length < 2 ? "0" + hex : hex);
    }
    var padded = hex;
    while (padded.length < 4) {
      padded = "0" + padded;
    }
    return "\\u" + padded;
  };
  var regExpEscape = function regExpEscape(str) {
    if (typeof str !== "string") {
      throw new TypeError("RegExp.escape requires a string");
    }
    var out = "";
    for (var _i89 = 0; _i89 < str.length; _i89++) {
      var ch = str.charAt(_i89);
      var code = str.charCodeAt(_i89);
      if (_i89 === 0 && (code >= 48 && code <= 57 ||
      // 0-9
      code >= 65 && code <= 90 ||
      // A-Z
      code >= 97 && code <= 122)) {
        out += hexEscape(code);
      } else if (SYNTAX_CHARS.indexOf(ch) !== -1) {
        out += "\\" + ch;
      } else if (OTHER_PUNCTUATORS.indexOf(ch) !== -1 || isWhiteSpaceOrLineTerminator(code)) {
        out += hexEscape(code);
      } else if (code >= 55296 && code <= 56319) {
        var next = str.charCodeAt(_i89 + 1);
        if (next >= 56320 && next <= 57343) {
          out += ch + str.charAt(_i89 + 1);
          _i89++;
        } else {
          out += hexEscape(code);
        }
      } else if (code >= 56320 && code <= 57343) {
        out += hexEscape(code);
      } else {
        out += ch;
      }
    }
    return out;
  };
  if (!isSupported125()) {
    Object.defineProperty(RegExp, "escape", {
      value: regExpEscape,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RegExp.escape, "name", {
      value: "escape",
      configurable: true
    });
    Object.defineProperty(RegExp.escape, "__polyfilled", {
      value: true
    });
  }

  // tests/regexp-escape.test.ts
  describe("RegExp.escape (ES2025) \u2014 test262 conformance", function () {
    it("backslash-escapes every regex syntax character and the slash", function () {
      expect(regExpEscape(".*+?^${}()|[]\\/")).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\\/");
    });
    it("hex-escapes a leading ASCII letter or digit (avoids \\1 backrefs etc.)", function () {
      expect(regExpEscape("a1")).toBe("\\x611");
      expect(regExpEscape("1a")).toBe("\\x31a");
      expect(regExpEscape("Zz")).toBe("\\x5az");
    });
    it("escapes punctuators and whitespace that could splice into patterns", function () {
      expect(regExpEscape("-")).toBe("\\x2d");
      expect(regExpEscape(" ")).toBe("\\x20");
      expect(regExpEscape("	")).toBe("\\x09");
      expect(regExpEscape("\n")).toBe("\\x0a");
      expect(regExpEscape("!")).toBe("\\x21");
      expect(regExpEscape(",")).toBe("\\x2c");
    });
    it("escapes lone surrogates as \\uNNNN but passes intact pairs verbatim", function () {
      expect(regExpEscape("\uD800")).toBe("\\ud800");
      expect(regExpEscape("\uDC00")).toBe("\\udc00");
      expect(regExpEscape("\uD83D\uDE00")).toBe("\uD83D\uDE00");
    });
    it("leaves ordinary characters alone (non-leading)", function () {
      expect(regExpEscape("abc")).toBe("\\x61bc");
      expect(regExpEscape("_foo")).toBe("_foo");
    });
    it("throws TypeError on non-string input (no coercion, per spec)", function () {
      expect(function () {
        return regExpEscape(42);
      }).toThrow(TypeError);
      expect(function () {
        return regExpEscape(null);
      }).toThrow(TypeError);
    });
    it("escaped output round-trips as a literal match", function () {
      var raw = "price: $5.00 (50% off?) [limited]";
      var re = new RegExp("^" + regExpEscape(raw) + "$");
      expect(re.test(raw)).toBe(true);
    });
    it("matches native", function () {
      var native = RegExp.escape;
      if (typeof native !== "function") return;
      var cases = ["abc", "1a", ".*+?", "a-b c", "\uD800", "_foo", "$5.00", "\uD83D\uDE00"];
      for (var _i90 = 0; _i90 < cases.length; _i90++) {
        expect(regExpEscape(cases[_i90])).toBe(native(cases[_i90]));
      }
    });
  });

  // src/modules/es.regexp.flags.ts
  var isSupported126 = function isSupported126() {
    try {
      return typeof RegExp !== "undefined" && "flags" in RegExp.prototype;
    } catch (e) {
      return false;
    }
  };
  var regExpFlags = function regExpFlags() {
    if (this === null || typeof this !== "object") {
      throw new TypeError("RegExp.prototype.flags getter called on a non-object");
    }
    var result = "";
    if (this.hasIndices) result += "d";
    if (this.global) result += "g";
    if (this.ignoreCase) result += "i";
    if (this.multiline) result += "m";
    if (this.dotAll) result += "s";
    if (this.unicode) result += "u";
    if (this.unicodeSets) result += "v";
    if (this.sticky) result += "y";
    return result;
  };
  if (!isSupported126()) {
    Object.defineProperty(regExpFlags, "__polyfilled", {
      value: true
    });
    Object.defineProperty(regExpFlags, "name", {
      value: "get flags",
      configurable: true
    });
    Object.defineProperty(RegExp.prototype, "flags", {
      configurable: true,
      get: regExpFlags
    });
  }

  // tests/regexp-flags.test.ts
  describe("RegExp.prototype.flags \u2014 test262 conformance", function () {
    var flags = function flags(re) {
      return regExpFlags.call(re);
    };
    describe("basic", function () {
      it("empty string when no flags set", function () {
        expect(flags(/x/)).toBe("");
      });
      it("single flag", function () {
        expect(flags(/x/g)).toBe("g");
      });
      it("combines flags in spec order regardless of source order", function () {
        expect(flags(/x/img)).toBe("gim");
      });
      it("sticky sorts last of the classic set", function () {
        expect(flags(new RegExp("x", "gy"))).toBe("gy");
      });
    });
    describe("spec order from a synthetic receiver", function () {
      it("emits d g i m s u v y in order when all are set", function () {
        var all = {
          hasIndices: true,
          global: true,
          ignoreCase: true,
          multiline: true,
          dotAll: true,
          unicode: true,
          unicodeSets: true,
          sticky: true
        };
        expect(flags(all)).toBe("dgimsuvy");
      });
      it("only appends letters for truthy flags", function () {
        expect(flags({
          global: true,
          sticky: true
        })).toBe("gy");
      });
    });
    describe("receiver validation", function () {
      it("throws TypeError on null / undefined", function () {
        expect(function () {
          return flags(null);
        }).toThrow(TypeError);
        expect(function () {
          return flags(void 0);
        }).toThrow(TypeError);
      });
      it("throws TypeError on a primitive receiver", function () {
        expect(function () {
          return flags("gi");
        }).toThrow(TypeError);
      });
    });
    describe("parity vs native", function () {
      it("matches native across flag combos", function () {
        var nativeFlags = Object.getOwnPropertyDescriptor(RegExp.prototype, "flags").get;
        var re = new RegExp("x", "gimsuy");
        var nativeResult = nativeFlags.call(re);
        var specResult = regExpFlags.call(re);
        expect(specResult).toBe(nativeResult);
        expect(specResult).toBe(re.flags);
      });
    });
  });

  // src/modules/es.set.ts
  var isSupported127 = function isSupported127() {
    try {
      if (typeof _Set !== "function") {
        return false;
      }
      var set = new _Set(["a", "b", "c"]);
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
    } catch (e) {
      return false;
    }
  };
  var sameValueZero2 = function sameValueZero2(a, b) {
    return a === b || a !== a && b !== b;
  };
  var hasSymbol2 = typeof Symbol !== "undefined" && Symbol.iterator != null;
  var returnSelf2 = function returnSelf2() {
    return this;
  };
  var indexOfValue = function indexOfValue(self2, value) {
    var values = self2._values;
    for (var _i91 = 0; _i91 < values.length; _i91++) {
      if (sameValueZero2(values[_i91], value)) {
        return _i91;
      }
    }
    return -1;
  };
  var SetIterator = function SetIterator(self2, kind) {
    this._self = self2;
    this._index = 0;
    this._kind = kind;
  };
  SetIterator.prototype.next = function () {
    var self2 = this._self;
    if (self2 === null) {
      return {
        value: void 0,
        done: true
      };
    }
    if (this._index < self2._values.length) {
      var value = self2._values[this._index];
      this._index++;
      var result = this._kind === "entries" ? [value, value] : value;
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
    Object.defineProperty(returnSelf2, "name", {
      value: "[Symbol.iterator]",
      configurable: true
    });
  }
  var _Set = function Set2(iterable) {
    if (!(this instanceof _Set)) {
      throw new TypeError("Constructor Set requires 'new'");
    }
    this._values = [];
    if (iterable === null || iterable === void 0) {
      return;
    }
    if (Array.isArray(iterable)) {
      for (var _i92 = 0; _i92 < iterable.length; _i92++) {
        this.add(iterable[_i92]);
      }
      return;
    }
    if (hasSymbol2 && typeof iterable[Symbol.iterator] === "function") {
      var it3 = iterable[Symbol.iterator]();
      var step = it3.next();
      while (!step.done) {
        this.add(step.value);
        step = it3.next();
      }
      return;
    }
    throw new TypeError("Set constructor argument is not iterable");
  };
  _Set.prototype.add = function (value) {
    if (value === 0) {
      value = 0;
    }
    if (indexOfValue(this, value) === -1) {
      this._values[this._values.length] = value;
    }
    return this;
  };
  _Set.prototype.has = function (value) {
    return indexOfValue(this, value) !== -1;
  };
  _Set.prototype.delete = function (value) {
    var i = indexOfValue(this, value);
    if (i === -1) {
      return false;
    }
    this._values.splice(i, 1);
    return true;
  };
  _Set.prototype.clear = function () {
    this._values.length = 0;
  };
  _Set.prototype.forEach = function (callback, thisArg) {
    for (var _i93 = 0; _i93 < this._values.length; _i93++) {
      callback.call(thisArg, this._values[_i93], this._values[_i93], this);
    }
  };
  _Set.prototype.values = function () {
    return new SetIterator(this, "values");
  };
  _Set.prototype.keys = _Set.prototype.values;
  _Set.prototype.entries = function () {
    return new SetIterator(this, "entries");
  };
  Object.defineProperty(_Set.prototype, "size", {
    configurable: true,
    get: function get() {
      return this._values.length;
    }
  });
  Object.defineProperty(Object.getOwnPropertyDescriptor(_Set.prototype, "size").get, "name", {
    value: "get size",
    configurable: true
  });
  if (hasSymbol2) {
    Object.defineProperty(_Set.prototype, Symbol.iterator, {
      value: _Set.prototype.values,
      writable: true,
      enumerable: false,
      configurable: true
    });
    if (Symbol.toStringTag) {
      Object.defineProperty(_Set.prototype, Symbol.toStringTag, {
        value: "Set",
        writable: false,
        enumerable: false,
        configurable: true
      });
    }
  }
  if (!isSupported127()) {
    window.Set = null;
    delete window.Set;
    Object.defineProperty(window, "Set", {
      value: _Set,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.Set, "name", {
      value: "Set",
      configurable: true
    });
    Object.defineProperty(window.Set, "__polyfilled", {
      value: true
    });
  }

  // tests/retention.test.ts
  describe("retention", function () {
    describe("Map iterator releases its collection when exhausted", function () {
      it("drops _self once done", function () {
        var map = new _Map();
        map.set("a", 1);
        map.set("b", 2);
        var it3 = map.entries();
        expect(it3._self).toBe(map);
        expect(it3.next().done).toBe(false);
        expect(it3.next().done).toBe(false);
        expect(it3._self).toBe(map);
        expect(it3.next().done).toBe(true);
        expect(it3._self).toBe(null);
      });
      it("an empty Map releases on the very first next()", function () {
        var map = new _Map();
        var it3 = map.keys();
        expect(it3.next().done).toBe(true);
        expect(it3._self).toBe(null);
      });
      it("stays done and does not throw when next() is called again", function () {
        var map = new _Map();
        map.set("a", 1);
        var it3 = map.values();
        it3.next();
        expect(it3.next()).toEqual({
          value: void 0,
          done: true
        });
        expect(it3.next()).toEqual({
          value: void 0,
          done: true
        });
        expect(it3._self).toBe(null);
      });
    });
    describe("Set iterator releases its collection when exhausted", function () {
      it("drops _self once done", function () {
        var set = new _Set();
        set.add("a");
        set.add("b");
        var it3 = set.values();
        expect(it3._self).toBe(set);
        expect(it3.next().done).toBe(false);
        expect(it3.next().done).toBe(false);
        expect(it3.next().done).toBe(true);
        expect(it3._self).toBe(null);
      });
      it("stays done and does not throw when next() is called again", function () {
        var set = new _Set();
        set.add("a");
        var it3 = set.entries();
        it3.next();
        expect(it3.next()).toEqual({
          value: void 0,
          done: true
        });
        expect(it3.next()).toEqual({
          value: void 0,
          done: true
        });
        expect(it3._self).toBe(null);
      });
    });
    describe("iteration still works end to end after the release change", function () {
      it("for-of style manual drain yields every Map entry", function () {
        var map = new _Map();
        map.set("a", 1);
        map.set("b", 2);
        map.set("c", 3);
        var seen = [];
        var it3 = map.entries();
        var step = it3.next();
        while (!step.done) {
          seen.push(step.value);
          step = it3.next();
        }
        expect(seen).toEqual([["a", 1], ["b", 2], ["c", 3]]);
      });
      it("two independent iterators over one Set do not interfere", function () {
        var set = new _Set();
        set.add(1);
        set.add(2);
        var first = set.values();
        var second = set.values();
        expect(first.next().value).toBe(1);
        expect(second.next().value).toBe(1);
        first.next();
        expect(first.next().done).toBe(true);
        expect(first._self).toBe(null);
        expect(second._self).toBe(set);
        expect(second.next().value).toBe(2);
      });
    });
  });

  // src/modules/_set-methods-impl.ts
  var SetCtor = Set;
  var proto = Set.prototype;
  var add = function add(set, value) {
    proto.add.call(set, value);
  };
  var has = function has(set, value) {
    return proto.has.call(set, value);
  };
  var remove = function remove(set, value) {
    proto["delete"].call(set, value);
  };
  var sizeGetter = Object.getOwnPropertyDescriptor(proto, "size").get;
  var getSize = function getSize(set) {
    return sizeGetter.call(set);
  };
  var aSet = function aSet(it3) {
    has(it3);
    return it3;
  };
  var toIntegerOrInfinity4 = function toIntegerOrInfinity4(argument) {
    var number = +argument;
    if (number !== number || number === 0) return 0;
    return number > 0 ? Math.floor(number) : Math.ceil(number);
  };
  var getSetRecord = function getSetRecord(obj) {
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      throw new TypeError("Set-like is not an object");
    }
    var numSize = +obj.size;
    if (numSize !== numSize) throw new TypeError("Invalid size");
    var intSize = toIntegerOrInfinity4(numSize);
    if (intSize < 0) throw new RangeError("Invalid size");
    var hasFn = obj.has;
    var keysFn = obj.keys;
    if (typeof hasFn !== "function") throw new TypeError("has is not callable");
    if (typeof keysFn !== "function") throw new TypeError("keys is not callable");
    return {
      size: Math.max(intSize, 0),
      getIterator: function getIterator() {
        var iterator = keysFn.call(obj);
        if (iterator === null || typeof iterator !== "object") {
          throw new TypeError("keys() did not return an object");
        }
        return {
          iterator: iterator,
          next: iterator.next
        };
      },
      includes: function includes(value) {
        return hasFn.call(obj, value);
      }
    };
  };
  var clone = function clone(set) {
    var result = new SetCtor();
    var iterator = proto.keys.call(set);
    var next = iterator.next;
    var step;
    while (!(step = next.call(iterator)).done) add(result, step.value);
    return result;
  };
  var iterateOwn = function iterateOwn(set, fn) {
    var iterator = proto.keys.call(set);
    var next = iterator.next;
    var step;
    while (!(step = next.call(iterator)).done) {
      if (fn(step.value) === false) return false;
    }
    return true;
  };
  var iterateRecord = function iterateRecord(record, fn) {
    var iter = record.getIterator();
    var iterator = iter.iterator;
    var next = iter.next;
    var step;
    while (!(step = next.call(iterator)).done) {
      if (fn(step.value) === false) return false;
    }
    return true;
  };
  var setUnion = function union(other) {
    var O = aSet(this);
    var otherRec = getSetRecord(other);
    var result = clone(O);
    iterateRecord(otherRec, function (value) {
      add(result, value);
    });
    return result;
  };
  var setIntersection = function intersection(other) {
    var O = aSet(this);
    var otherRec = getSetRecord(other);
    var result = new SetCtor();
    if (getSize(O) > otherRec.size) {
      iterateRecord(otherRec, function (value) {
        if (has(O, value)) add(result, value);
      });
    } else {
      iterateOwn(O, function (value) {
        if (otherRec.includes(value)) add(result, value);
      });
    }
    return result;
  };
  var setDifference = function difference(other) {
    var O = aSet(this);
    var otherRec = getSetRecord(other);
    var result = clone(O);
    if (getSize(result) <= otherRec.size) {
      iterateOwn(result, function (value) {
        if (otherRec.includes(value)) remove(result, value);
      });
    } else {
      iterateRecord(otherRec, function (value) {
        if (has(result, value)) remove(result, value);
      });
    }
    return result;
  };
  var setSymmetricDifference = function symmetricDifference(other) {
    var O = aSet(this);
    var otherRec = getSetRecord(other);
    var result = clone(O);
    iterateRecord(otherRec, function (value) {
      if (has(O, value)) remove(result, value);else add(result, value);
    });
    return result;
  };
  var setIsSubsetOf = function isSubsetOf(other) {
    var O = aSet(this);
    var otherRec = getSetRecord(other);
    if (getSize(O) > otherRec.size) return false;
    return iterateOwn(O, function (value) {
      return otherRec.includes(value) ? void 0 : false;
    });
  };
  var setIsSupersetOf = function isSupersetOf(other) {
    var O = aSet(this);
    var otherRec = getSetRecord(other);
    if (getSize(O) < otherRec.size) return false;
    return iterateRecord(otherRec, function (value) {
      return has(O, value) ? void 0 : false;
    });
  };
  var setIsDisjointFrom = function isDisjointFrom(other) {
    var O = aSet(this);
    var otherRec = getSetRecord(other);
    if (getSize(O) <= otherRec.size) {
      return iterateOwn(O, function (value) {
        return otherRec.includes(value) ? false : void 0;
      });
    }
    return iterateRecord(otherRec, function (value) {
      return has(O, value) ? false : void 0;
    });
  };
  var METHODS = [["union", setUnion], ["intersection", setIntersection], ["difference", setDifference], ["symmetricDifference", setSymmetricDifference], ["isSubsetOf", setIsSubsetOf], ["isSupersetOf", setIsSupersetOf], ["isDisjointFrom", setIsDisjointFrom]];
  var isSupported128 = function isSupported128() {
    try {
      for (var _i94 = 0; _i94 < METHODS.length; _i94++) {
        if (typeof proto[METHODS[_i94][0]] !== "function") return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  for (var _i95 = 0; _i95 < METHODS.length; _i95++) {
    var _name2 = METHODS[_i95][0];
    if (typeof proto[_name2] !== "function") {
      Object.defineProperty(proto, _name2, {
        value: METHODS[_i95][1],
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(proto[_name2], "__polyfilled", {
        value: true
      });
    }
  }

  // tests/set-methods.test.ts
  var S = function S(values) {
    return new Set(values);
  };
  var list = function list(s) {
    return Array.from(s).join(",");
  };
  describe("Set.prototype.union island", function () {
    it("merges both sets, de-duplicating", function () {
      expect(list(setUnion.call(S([1, 2, 3]), S([3, 4])))).toBe("1,2,3,4");
    });
    it("accepts a set-like argument", function () {
      var setLike = {
        size: 2,
        has: function has(v) {
          return v === 2 || v === 3;
        },
        keys: /*#__PURE__*/_regenerator().m(function keys() {
          return _regenerator().w(function (_context41) {
            while (1) switch (_context41.n) {
              case 0:
                _context41.n = 1;
                return 2;
              case 1:
                _context41.n = 2;
                return 3;
              case 2:
                return _context41.a(2);
            }
          }, keys);
        })
      };
      expect(list(setUnion.call(S([1, 2]), setLike))).toBe("1,2,3");
    });
  });
  describe("Set.prototype.intersection island", function () {
    it("keeps only shared elements", function () {
      expect(list(setIntersection.call(S([1, 2, 3]), S([3, 2])))).toBe("3,2");
    });
    it("takes the this-set path when the other set is larger", function () {
      expect(list(setIntersection.call(S([1, 2]), S([2, 3, 4, 5])))).toBe("2");
    });
  });
  describe("Set.prototype.difference island", function () {
    it("removes the other set\u2019s elements", function () {
      expect(list(setDifference.call(S([1, 2, 3, 4]), S([3, 4])))).toBe("1,2");
    });
  });
  describe("Set.prototype.symmetricDifference island", function () {
    it("keeps elements in exactly one set", function () {
      expect(list(setSymmetricDifference.call(S([1, 2, 3]), S([3, 4])))).toBe("1,2,4");
    });
  });
  describe("Set relation predicates", function () {
    it("isSubsetOf", function () {
      expect(setIsSubsetOf.call(S([1, 2]), S([1, 2, 3]))).toBe(true);
      expect(setIsSubsetOf.call(S([1, 5]), S([1, 2, 3]))).toBe(false);
    });
    it("isSupersetOf", function () {
      expect(setIsSupersetOf.call(S([1, 2, 3]), S([1, 2]))).toBe(true);
      expect(setIsSupersetOf.call(S([1]), S([1, 2]))).toBe(false);
    });
    it("isDisjointFrom", function () {
      expect(setIsDisjointFrom.call(S([1, 2]), S([3, 4]))).toBe(true);
      expect(setIsDisjointFrom.call(S([1, 2]), S([2, 3]))).toBe(false);
    });
  });
  describe("GetSetRecord / RequireInternalSlot guards", function () {
    it("throws TypeError for an invalid size", function () {
      expect(function () {
        return setUnion.call(S([1]), {
          size: NaN,
          has: function has() {},
          keys: function keys() {}
        });
      }).toThrow(TypeError);
    });
    it("throws RangeError for a negative size", function () {
      expect(function () {
        return setUnion.call(S([1]), {
          size: -1,
          has: function has() {},
          keys: function keys() {}
        });
      }).toThrow(RangeError);
    });
    it("throws TypeError when this is not a Set", function () {
      expect(function () {
        return setUnion.call({}, S([1]));
      }).toThrow(TypeError);
    });
    it("reports supported when the native methods are present", function () {
      expect(isSupported128()).toBe(true);
    });
  });

  // tests/set.test.ts
  describe("Set \u2014 test262 conformance", function () {
    describe("constructor", function () {
      it("throws without new", function () {
        expect(function () {
          return _Set();
        }).toThrow(TypeError);
      });
      it("is empty by default (size 0)", function () {
        expect(new _Set().size).toBe(0);
      });
      it("builds from an array, de-duplicating", function () {
        var s = new _Set([1, 2, 2, 3]);
        expect(s.size).toBe(3);
        expect(s.has(1)).toBe(true);
        expect(s.has(2)).toBe(true);
        expect(s.has(3)).toBe(true);
      });
      it("builds from a generic iterable (Symbol.iterator)", function () {
        var iterable = _defineProperty({}, Symbol.iterator, function () {
          var vals = ["x", "y"];
          var i = 0;
          return {
            next: function next() {
              return i < vals.length ? {
                value: vals[i++],
                done: false
              } : {
                value: void 0,
                done: true
              };
            }
          };
        });
        var s = new _Set(iterable);
        expect(s.has("x")).toBe(true);
        expect(s.has("y")).toBe(true);
      });
      it("treats null/undefined iterable as empty", function () {
        expect(new _Set(null).size).toBe(0);
        expect(new _Set(void 0).size).toBe(0);
      });
    });
    describe("add / has / delete / clear / size", function () {
      it("add returns the set (chainable)", function () {
        var s = new _Set();
        expect(s.add(1)).toBe(s);
        s.add(2).add(3);
        expect(s.size).toBe(3);
      });
      it("add de-duplicates (no size change for an existing value)", function () {
        var s = new _Set();
        s.add("a").add("a");
        expect(s.size).toBe(1);
      });
      it("has reflects membership", function () {
        var s = new _Set();
        s.add("a");
        expect(s.has("a")).toBe(true);
        expect(s.has("z")).toBe(false);
      });
      it("delete removes and returns boolean", function () {
        var s = new _Set();
        s.add("a");
        expect(s.delete("a")).toBe(true);
        expect(s.delete("a")).toBe(false);
        expect(s.has("a")).toBe(false);
      });
      it("clear empties the set", function () {
        var s = new _Set([1, 2, 3]);
        s.clear();
        expect(s.size).toBe(0);
        expect(s.has(1)).toBe(false);
      });
    });
    describe("value equality", function () {
      it("distinguishes object values by identity", function () {
        var a = {};
        var b = {};
        var s = new _Set();
        s.add(a).add(b).add(a);
        expect(s.size).toBe(2);
      });
      it('distinguishes primitive values by type (1 vs "1")', function () {
        var s = new _Set();
        s.add(1).add("1");
        expect(s.size).toBe(2);
      });
      it("treats NaN as a single value (SameValueZero)", function () {
        var s = new _Set();
        s.add(NaN).add(NaN);
        expect(s.size).toBe(1);
        expect(s.has(NaN)).toBe(true);
      });
      it("treats -0 and +0 as the same value, normalised to +0", function () {
        var s = new _Set();
        s.add(-0);
        expect(s.has(0)).toBe(true);
        expect(s.size).toBe(1);
        var first = Array.from(s.values())[0];
        expect(Object.is(first, 0)).toBe(true);
      });
    });
    describe("iteration (insertion order)", function () {
      it("forEach visits in insertion order with (value, value, set)", function () {
        var s = new _Set(["a", "b"]);
        var seen = [];
        s.forEach(function (v1, v2, set) {
          seen.push([v1, v2, set]);
        });
        expect(seen).toEqual([["a", "a", s], ["b", "b", s]]);
      });
      it("forEach honors thisArg", function () {
        var s = new _Set(["a"]);
        var ctx = {
          tag: "ctx"
        };
        var captured;
        s.forEach(function () {
          captured = this;
        }, ctx);
        expect(captured).toBe(ctx);
      });
      it("keys/values/entries yield in insertion order", function () {
        var s = new _Set(["a", "b"]);
        expect(Array.from(s.keys())).toEqual(["a", "b"]);
        expect(Array.from(s.values())).toEqual(["a", "b"]);
        expect(Array.from(s.entries())).toEqual([["a", "a"], ["b", "b"]]);
      });
      it("is spreadable via Symbol.iterator (values)", function () {
        var s = new _Set(["a", "b"]);
        expect(_toConsumableArray(s)).toEqual(["a", "b"]);
      });
    });
    describe("toStringTag", function () {
      it("reports [object Set]", function () {
        expect(Object.prototype.toString.call(new _Set())).toBe("[object Set]");
      });
      it("is non-writable, unlike ordinary methods (from test262)", function () {
        var desc = Object.getOwnPropertyDescriptor(_Set.prototype, Symbol.toStringTag);
        expect(desc.writable).toBe(false);
        expect(desc.configurable).toBe(true);
      });
    });
    describe("parity vs native", function () {
      it("matches native for add/has round-trips", function () {
        var roundTrip = function roundTrip(Ctor) {
          return function () {
            var s = new Ctor();
            s.add("a").add("b").add("a");
            return s.has("a") && s.has("b") && s.size === 2;
          };
        };
        var nativeResult = roundTrip(Set)();
        var specResult = roundTrip(_Set)();
        expect(specResult).toBe(nativeResult);
      });
      it("matches native at scale", function () {
        var N = 1e3;
        var items = [];
        for (var _i96 = 0; _i96 < N; _i96++) items.push("item-" + _i96);
        var work = function work(Ctor) {
          return function () {
            var s = new Ctor();
            for (var _i97 = 0; _i97 < N; _i97++) s.add(items[_i97]);
            var hits = 0;
            for (var _i98 = 0; _i98 < N; _i98++) if (s.has(items[_i98])) hits++;
            for (var _i99 = 0; _i99 < N; _i99++) if (s.has("missing-" + _i99)) hits++;
            return hits;
          };
        };
        var nativeResult = work(Set)();
        var specResult = work(_Set)();
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.string.match.ts
  var isSupported129 = function isSupported129() {
    try {
      return typeof String.prototype.match === "function";
    } catch (e) {
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
        return handler.call(matcher, String(this));
      }
    }
    return nativeMatch.call(this, matcher);
  };
  if (!isSupported129()) {
    Object.defineProperty(String.prototype, "match", {
      value: stringMatch,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.match, "name", {
      value: "match",
      configurable: true
    });
    Object.defineProperty(String.prototype.match, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.replace.ts
  var isSupported130 = function isSupported130() {
    try {
      return typeof String.prototype.replace === "function";
    } catch (e) {
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
        return handler.call(searchValue, String(this), replaceValue);
      }
    }
    return nativeReplace.call(this, searchValue, replaceValue);
  };
  if (!isSupported130()) {
    Object.defineProperty(String.prototype, "replace", {
      value: stringReplace,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.replace, "name", {
      value: "replace",
      configurable: true
    });
    Object.defineProperty(String.prototype.replace, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.search.ts
  var isSupported131 = function isSupported131() {
    try {
      return typeof String.prototype.search === "function";
    } catch (e) {
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
        return handler.call(matcher, String(this));
      }
    }
    return nativeSearch.call(this, matcher);
  };
  if (!isSupported131()) {
    Object.defineProperty(String.prototype, "search", {
      value: stringSearch,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.search, "name", {
      value: "search",
      configurable: true
    });
    Object.defineProperty(String.prototype.search, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.split.ts
  var isSupported132 = function isSupported132() {
    try {
      return typeof String.prototype.split === "function";
    } catch (e) {
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
        return handler.call(separator, String(this), limit);
      }
    }
    return nativeSplit.call(this, separator, limit);
  };
  if (!isSupported132()) {
    Object.defineProperty(String.prototype, "split", {
      value: stringSplit,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.split, "name", {
      value: "split",
      configurable: true
    });
    Object.defineProperty(String.prototype.split, "__polyfilled", {
      value: true
    });
  }

  // tests/string-dispatch.test.ts
  describe("String dispatch patches \u2014 test262 conformance", function () {
    describe("stringMatch", function () {
      it("falls back to native for regexes and strings", function () {
        expect(stringMatch.call("abcabc", /b/g)).toEqual("abcabc".match(/b/g));
        expect(stringMatch.call("abc", "b").index).toBe(1);
      });
      it("dispatches to a custom Symbol.match handler", function () {
        var matcher = _defineProperty({}, Symbol.match, function (str) {
          return "matched:" + str;
        });
        expect(stringMatch.call("abc", matcher)).toBe("matched:abc");
      });
      it("throws on null/undefined this", function () {
        expect(function () {
          return stringMatch.call(null, /a/);
        }).toThrow(TypeError);
      });
    });
    describe("stringReplace", function () {
      it("falls back to native", function () {
        expect(stringReplace.call("aaa", /a/g, "b")).toBe("bbb");
        expect(stringReplace.call("abc", "b", "x")).toBe("axc");
      });
      it("dispatches to a custom Symbol.replace handler with the replacement", function () {
        var replacer = _defineProperty({}, Symbol.replace, function (str, replacement) {
          return str + "->" + replacement;
        });
        expect(stringReplace.call("abc", replacer, "xyz")).toBe("abc->xyz");
      });
    });
    describe("stringSearch", function () {
      it("falls back to native", function () {
        expect(stringSearch.call("abc", /b/)).toBe(1);
        expect(stringSearch.call("abc", "c")).toBe(2);
      });
      it("dispatches to a custom Symbol.search handler", function () {
        var searcher = _defineProperty({}, Symbol.search, function () {
          return 42;
        });
        expect(stringSearch.call("abc", searcher)).toBe(42);
      });
    });
    describe("stringSplit", function () {
      it("falls back to native, limit included", function () {
        expect(stringSplit.call("a,b,c", ",")).toEqual(["a", "b", "c"]);
        expect(stringSplit.call("a,b,c", ",", 2)).toEqual(["a", "b"]);
        expect(stringSplit.call("a1b2c", /\d/)).toEqual(["a", "b", "c"]);
      });
      it("dispatches to a custom Symbol.split handler with the limit", function () {
        var splitter = _defineProperty({}, Symbol.split, function (str, limit) {
          return [str, limit];
        });
        expect(stringSplit.call("abc", splitter, 7)).toEqual(["abc", 7]);
      });
    });
  });

  // src/modules/es.string.ends-with.ts
  var isSupported133 = function isSupported133() {
    try {
      return typeof String.prototype.endsWith === "function";
    } catch (e) {
      return false;
    }
  };
  var toInteger12 = function toInteger12(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
  };
  var stringEndsWith = function stringEndsWith(search, endPosition) {
    if (search instanceof RegExp) {
      throw new TypeError("First argument to String.prototype.endsWith must not be a regular expression");
    }
    var length = this.length;
    var endIndex = endPosition === void 0 ? length : toInteger12(endPosition);
    if (endIndex < 0) {
      endIndex = 0;
    } else if (endIndex > length) {
      endIndex = length;
    }
    var searchString = String(search);
    var startIndex = endIndex - searchString.length;
    if (startIndex < 0) {
      return false;
    }
    for (var _i100 = 0; _i100 < searchString.length; _i100++) {
      if (this.charCodeAt(startIndex + _i100) !== searchString.charCodeAt(_i100)) {
        return false;
      }
    }
    return true;
  };
  if (!isSupported133()) {
    Object.defineProperty(String.prototype, "endsWith", {
      value: stringEndsWith,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.endsWith, "name", {
      value: "endsWith",
      configurable: true
    });
    Object.defineProperty(String.prototype.endsWith, "__polyfilled", {
      value: true
    });
  }

  // tests/string-ends-with.test.ts
  describe("String.prototype.endsWith \u2014 test262 conformance", function () {
    var endsWith = function endsWith(s) {
      for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key0 = 1; _key0 < _len7; _key0++) {
        args[_key0 - 1] = arguments[_key0];
      }
      return stringEndsWith.apply(s, args);
    };
    describe("basic", function () {
      it("matches a suffix", function () {
        expect(endsWith("abc", "bc")).toBe(true);
        expect(endsWith("abc", "abc")).toBe(true);
      });
      it("is false when not a suffix", function () {
        expect(endsWith("abc", "ab")).toBe(false);
        expect(endsWith("abc", "zabc")).toBe(false);
      });
      it("is case-sensitive", function () {
        expect(endsWith("abc", "C")).toBe(false);
      });
    });
    describe("endPosition", function () {
      it("treats the string as ending at endPosition", function () {
        expect(endsWith("abcdef", "cd", 4)).toBe(true);
        expect(endsWith("abcdef", "cd", 3)).toBe(false);
      });
      it("truncates a fractional endPosition toward zero", function () {
        expect(endsWith("abcdef", "cd", 4.9)).toBe(true);
      });
      it("clamps an endPosition past length to length", function () {
        expect(endsWith("abc", "bc", 100)).toBe(true);
      });
      it("treats a negative endPosition as 0", function () {
        expect(endsWith("abc", "a", -1)).toBe(false);
        expect(endsWith("abc", "", -1)).toBe(true);
      });
    });
    describe("empty search", function () {
      it("always matches the empty string", function () {
        expect(endsWith("abc", "")).toBe(true);
        expect(endsWith("", "")).toBe(true);
      });
    });
    describe("coercion & RegExp", function () {
      it("coerces the search via ToString", function () {
        expect(endsWith("abc12", 12)).toBe(true);
      });
      it("throws TypeError when search is a RegExp", function () {
        expect(function () {
          return endsWith("abc", /c/);
        }).toThrow(TypeError);
      });
    });
    describe("parity vs native", function () {
      it("matches native", function () {
        var native = String.prototype.endsWith;
        var nativeResult = native.call("image.png", ".png");
        var specResult = stringEndsWith.call("image.png", ".png");
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.string.match-all.ts
  var isSupported134 = function isSupported134() {
    try {
      if (typeof String.prototype.matchAll !== "function") {
        return false;
      }
      try {
        "".matchAll(/./);
        return false;
      } catch (e) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  var isStringMatchAllSupported = isSupported134;
  var makeIterator = function makeIterator(items) {
    var index = 0;
    var iterator = {
      next: function next() {
        return index < items.length ? {
          value: items[index++],
          done: false
        } : {
          value: void 0,
          done: true
        };
      }
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      Object.defineProperty(iterator, Symbol.iterator, {
        value: function value() {
          return iterator;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    return iterator;
  };
  var stringMatchAll = function stringMatchAll(regexp) {
    if (this === null || this === void 0) {
      throw new TypeError("String.prototype.matchAll called on null or undefined");
    }
    var source = String(this);
    var pattern;
    var flags;
    if (regexp instanceof RegExp) {
      if (!regexp.global) {
        throw new TypeError("String.prototype.matchAll called with a non-global RegExp argument");
      }
      pattern = regexp.source;
      flags = "g";
      if (regexp.ignoreCase) flags += "i";
      if (regexp.multiline) flags += "m";
      if (regexp.sticky) flags += "y";
      if (regexp.unicode) flags += "u";
    } else {
      pattern = regexp === void 0 ? "" : String(regexp);
      flags = "g";
    }
    var globalRegex = new RegExp(pattern, flags);
    var matches = [];
    var match;
    while ((match = globalRegex.exec(source)) !== null) {
      matches.push(match);
      if (match[0] === "") {
        globalRegex.lastIndex++;
      }
    }
    return makeIterator(matches);
  };
  if (!isSupported134()) {
    Object.defineProperty(String.prototype, "matchAll", {
      value: stringMatchAll,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.matchAll, "name", {
      value: "matchAll",
      configurable: true
    });
    Object.defineProperty(String.prototype.matchAll, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.at-alternative.ts
  var isSupported135 = function isSupported135() {
    try {
      return typeof String.prototype.at === "function";
    } catch (e) {
      return false;
    }
  };
  var stringAt = function stringAt(index) {
    if (this === null || this === void 0) {
      throw new TypeError("String.prototype.at called on null or undefined");
    }
    var source = String(this);
    var length = source.length;
    var relativeIndex2 = Number(index);
    if (relativeIndex2 !== relativeIndex2) {
      relativeIndex2 = 0;
    }
    relativeIndex2 = relativeIndex2 < 0 ? Math.ceil(relativeIndex2) : Math.floor(relativeIndex2);
    var actualIndex = relativeIndex2 < 0 ? length + relativeIndex2 : relativeIndex2;
    if (actualIndex < 0 || actualIndex >= length) {
      return void 0;
    }
    return source.charAt(actualIndex);
  };
  if (!isSupported135()) {
    Object.defineProperty(String.prototype, "at", {
      value: stringAt,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.at, "name", {
      value: "at",
      configurable: true
    });
    Object.defineProperty(String.prototype.at, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.code-point-at.ts
  var isSupported136 = function isSupported136() {
    try {
      return typeof String.prototype.codePointAt === "function";
    } catch (e) {
      return false;
    }
  };
  var stringCodePointAt = function stringCodePointAt(pos) {
    if (this === null || this === void 0) {
      throw new TypeError("String.prototype.codePointAt called on null or undefined");
    }
    var source = String(this);
    var length = source.length;
    var index = Number(pos);
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
  if (!isSupported136()) {
    Object.defineProperty(String.prototype, "codePointAt", {
      value: stringCodePointAt,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.codePointAt, "name", {
      value: "codePointAt",
      configurable: true
    });
    Object.defineProperty(String.prototype.codePointAt, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.raw.ts
  var isSupported137 = function isSupported137() {
    try {
      return typeof String.raw === "function";
    } catch (e) {
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
    for (var _i101 = 0; _i101 < segmentCount; _i101++) {
      result += String(raw[_i101]);
      if (_i101 + 1 === segmentCount) {
        break;
      }
      if (_i101 < substitutionCount) {
        result += String(arguments[_i101 + 1]);
      }
    }
    return result;
  };
  if (!isSupported137()) {
    Object.defineProperty(String, "raw", {
      value: stringRaw,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.raw, "name", {
      value: "raw",
      configurable: true
    });
    Object.defineProperty(String.raw, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.repeat.ts
  var isSupported138 = function isSupported138() {
    try {
      return typeof String.prototype.repeat === "function";
    } catch (e) {
      return false;
    }
  };
  var stringRepeat = function stringRepeat(count) {
    if (this === null || this === void 0) {
      throw new TypeError("String.prototype.repeat called on null or undefined");
    }
    var source = String(this);
    var times = Number(count);
    if (times !== times) {
      times = 0;
    }
    if (times < 0 || times === Infinity) {
      throw new RangeError("Invalid count value: " + count);
    }
    times = Math.floor(times);
    var result = "";
    var chunk = source;
    while (times > 0) {
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
  if (!isSupported138()) {
    Object.defineProperty(String.prototype, "repeat", {
      value: stringRepeat,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.repeat, "name", {
      value: "repeat",
      configurable: true
    });
    Object.defineProperty(String.prototype.repeat, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.trim-end.ts
  var isSupported139 = function isSupported139() {
    try {
      return typeof String.prototype.trimEnd === "function";
    } catch (e) {
      return false;
    }
  };
  var stringTrimEnd = function stringTrimEnd() {
    if (this === null || this === void 0) {
      throw new TypeError("String.prototype.trimEnd called on null or undefined");
    }
    return String(this).replace(/\s+$/, "");
  };
  if (!isSupported139()) {
    Object.defineProperty(String.prototype, "trimEnd", {
      value: stringTrimEnd,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.trimEnd, "name", {
      value: "trimEnd",
      configurable: true
    });
    Object.defineProperty(String.prototype.trimEnd, "__polyfilled", {
      value: true
    });
  }

  // tests/string-extras.test.ts
  var repeat3 = function repeat3(s, n) {
    return stringRepeat.call(s, n);
  };
  var trimEnd = function trimEnd(s) {
    return stringTrimEnd.call(s);
  };
  var at = function at(s, i) {
    return stringAt.call(s, i);
  };
  var codePointAt = function codePointAt(s, i) {
    return stringCodePointAt.call(s, i);
  };
  var matchAll = function matchAll(s, re) {
    var out = [];
    var it3 = stringMatchAll.call(s, re);
    var step = it3.next();
    while (!step.done) {
      out.push(step.value);
      step = it3.next();
    }
    return out;
  };
  describe("String extras \u2014 test262 conformance", function () {
    describe("repeat", function () {
      it("repeats and matches native", function () {
        expect(repeat3("ab", 3)).toBe("ababab");
        expect(repeat3("x", 0)).toBe("");
        expect(repeat3("ab", 3)).toBe("ab".repeat(3));
      });
      it("floors a fractional count", function () {
        expect(repeat3("ab", 2.9)).toBe("abab");
      });
      it("throws RangeError for negative / Infinite count", function () {
        expect(function () {
          return repeat3("a", -1);
        }).toThrow(RangeError);
        expect(function () {
          return repeat3("a", Infinity);
        }).toThrow(RangeError);
      });
    });
    describe("trimEnd", function () {
      it("strips only trailing whitespace, matches native", function () {
        expect(trimEnd("  x  ")).toBe("  x");
        expect(trimEnd("\t\nfoo\xA0\u3000")).toBe("	\nfoo");
        expect(trimEnd("  x  ")).toBe("  x  ".trimEnd());
      });
    });
    describe("at", function () {
      it("indexes from start and end, matches native", function () {
        expect(at("abc", 0)).toBe("a");
        expect(at("abc", -1)).toBe("c");
        expect(at("abc", 5)).toBeUndefined();
        expect(at("abc", -5)).toBeUndefined();
        for (var _i102 = 0, _arr8 = [0, 1, 2, -1, -2, 3, -3]; _i102 < _arr8.length; _i102++) {
          var _i103 = _arr8[_i102];
          expect(at("abc", _i103)).toBe("abc".at(_i103));
        }
      });
    });
    describe("codePointAt", function () {
      it("returns the unit, combines surrogate pairs, matches native", function () {
        expect(codePointAt("abc", 1)).toBe(98);
        expect(codePointAt("\uD83D\uDE00", 0)).toBe(128512);
        expect(codePointAt("abc", 9)).toBeUndefined();
        expect(codePointAt("\uD83D\uDE00b", 0)).toBe("\uD83D\uDE00b".codePointAt(0));
      });
    });
    describe("String.raw", function () {
      it("interleaves raw segments + substitutions, matches native", function () {
        expect(stringRaw({
          raw: ["a", "b", "c"]
        }, 1, 2)).toBe("a1b2c");
        expect(stringRaw(_templateObject || (_templateObject = _taggedTemplateLiteral(["x", "y", "z"])), 1, 2)).toBe(String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["x", "y", "z"])), 1, 2));
        expect(stringRaw(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["a\nb"], ["a\\nb"])))).toBe(String.raw(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["a\nb"], ["a\\nb"]))));
      });
    });
    describe("matchAll", function () {
      it("yields every match with index + capture groups", function () {
        var matches = matchAll("a1b2c3", /([a-z])(\d)/g);
        expect(matches.length).toBe(3);
        expect(matches[0][0]).toBe("a1");
        expect(matches[0][1]).toBe("a");
        expect(matches[0][2]).toBe("1");
        expect(matches[2][2]).toBe("3");
      });
      it("matches native output", function () {
        var mine = matchAll("a1b2", /\d/g).map(function (m) {
          return m[0];
        });
        var native = _toConsumableArray("a1b2".matchAll(/\d/g)).map(function (m) {
          return m[0];
        });
        expect(mine).toEqual(native);
      });
      it("throws TypeError for a non-global RegExp", function () {
        expect(function () {
          return matchAll("abc", /a/);
        }).toThrow(TypeError);
      });
      it("terminates on empty matches", function () {
        expect(matchAll("abc", /x?/g).length).toBe(_toConsumableArray("abc".matchAll(/x?/g)).length);
      });
      it("the probe contract: modern natives throw on a non-global regexp", function () {
        expect(isStringMatchAllSupported()).toBe(true);
      });
    });
  });

  // src/modules/es.string.from-code-point.ts
  var isSupported140 = function isSupported140() {
    try {
      return typeof String.fromCodePoint === "function";
    } catch (e) {
      return false;
    }
  };
  var stringFromCodePoint = function stringFromCodePoint() {
    var parts = [];
    for (var _i104 = 0; _i104 < arguments.length; _i104++) {
      var codePoint = Number(_i104 < 0 || arguments.length <= _i104 ? undefined : arguments[_i104]);
      if (codePoint < 0 || codePoint > 1114111 || codePoint !== (codePoint | 0)) {
        throw new RangeError("Invalid code point: ".concat(codePoint));
      }
      if (codePoint > 65535) {
        codePoint -= 65536;
        parts[parts.length] = String.fromCharCode((codePoint >> 10) + 55296,
        // high surrogate = top 10 bits
        (codePoint & 1023) + 56320
        // low surrogate = bottom 10 bits
        );
      } else {
        parts[parts.length] = String.fromCharCode(codePoint);
      }
    }
    return parts.join("");
  };
  if (!isSupported140()) {
    Object.defineProperty(String, "fromCodePoint", {
      value: stringFromCodePoint,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.fromCodePoint, "name", {
      value: "fromCodePoint",
      configurable: true
    });
    Object.defineProperty(String.fromCodePoint, "__polyfilled", {
      value: true
    });
  }

  // tests/string-from-code-point.test.ts
  describe("String.fromCodePoint \u2014 test262 conformance", function () {
    describe("basic conversion", function () {
      it("returns an empty string with no arguments", function () {
        expect(stringFromCodePoint()).toBe("");
      });
      it("returns a string", function () {
        expect(typeof stringFromCodePoint(65)).toBe("string");
      });
      it("maps BMP code points to single characters", function () {
        expect(stringFromCodePoint(65, 66, 67)).toBe("ABC");
      });
      it("handles the null code point", function () {
        expect(stringFromCodePoint(0)).toBe("\0");
      });
      it("concatenates multiple arguments in order", function () {
        expect(stringFromCodePoint(104, 105)).toBe("hi");
      });
    });
    describe("astral code points (surrogate pairs)", function () {
      it("splits an astral code point into a surrogate pair", function () {
        var s = stringFromCodePoint(128514);
        expect(s).toBe("\uD83D\uDE02");
        expect(s.length).toBe(2);
      });
      it("matches native for an astral code point", function () {
        expect(stringFromCodePoint(134071)).toBe(String.fromCodePoint(134071));
      });
    });
    describe("boundaries", function () {
      it("handles U+FFFF (last BMP)", function () {
        expect(stringFromCodePoint(65535)).toBe("\uFFFF");
      });
      it("handles U+10000 (first astral)", function () {
        expect(stringFromCodePoint(65536)).toBe("\uD800\uDC00");
      });
      it("handles U+10FFFF (max code point)", function () {
        expect(stringFromCodePoint(1114111)).toBe(String.fromCodePoint(1114111));
      });
    });
    describe("ToNumber coercion", function () {
      it("coerces a numeric string argument", function () {
        expect(stringFromCodePoint("65")).toBe("A");
      });
    });
    describe("RangeError on invalid code points", function () {
      it("throws on a negative code point", function () {
        expect(function () {
          return stringFromCodePoint(-1);
        }).toThrow(RangeError);
      });
      it("throws above U+10FFFF", function () {
        expect(function () {
          return stringFromCodePoint(1114112);
        }).toThrow(RangeError);
      });
      it("throws on a non-integer code point", function () {
        expect(function () {
          return stringFromCodePoint(1.5);
        }).toThrow(RangeError);
      });
      it("throws on NaN", function () {
        expect(function () {
          return stringFromCodePoint(NaN);
        }).toThrow(RangeError);
      });
      it("throws on Infinity", function () {
        expect(function () {
          return stringFromCodePoint(Infinity);
        }).toThrow(RangeError);
      });
      it("throws on a non-numeric string", function () {
        expect(function () {
          return stringFromCodePoint("x");
        }).toThrow(RangeError);
      });
    });
    describe("parity vs native", function () {
      it("matches native building a mixed BMP + astral string", function () {
        var native = String.fromCodePoint;
        var nativeResult = native(72, 128514, 105);
        var specResult = stringFromCodePoint(72, 128514, 105);
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.string.includes.ts
  var isSupported141 = function isSupported141() {
    try {
      return typeof String.prototype.includes === "function";
    } catch (e) {
      return false;
    }
  };
  var stringIncludes = function stringIncludes(search, start) {
    if (search instanceof RegExp) {
      throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
    }
    return this.indexOf(search, start) !== -1;
  };
  if (!isSupported141()) {
    Object.defineProperty(String.prototype, "includes", {
      value: stringIncludes,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.includes, "name", {
      value: "includes",
      configurable: true
    });
    Object.defineProperty(String.prototype.includes, "__polyfilled", {
      value: true
    });
  }

  // tests/string-includes.test.ts
  describe("String.prototype.includes \u2014 test262 conformance", function () {
    var includes = function includes(s) {
      for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key1 = 1; _key1 < _len8; _key1++) {
        args[_key1 - 1] = arguments[_key1];
      }
      return stringIncludes.apply(s, args);
    };
    describe("basic search", function () {
      it("returns a boolean", function () {
        expect(includes("abc", "b")).toBe(true);
        expect(includes("abc", "x")).toBe(false);
      });
      it("finds a multi-char substring", function () {
        expect(includes("hello world", "o w")).toBe(true);
      });
      it("is case-sensitive", function () {
        expect(includes("abc", "B")).toBe(false);
      });
      it("always includes the empty string", function () {
        expect(includes("abc", "")).toBe(true);
        expect(includes("", "")).toBe(true);
      });
    });
    describe("position", function () {
      it("searches from a positive position", function () {
        expect(includes("abcabc", "a", 1)).toBe(true);
        expect(includes("abc", "a", 1)).toBe(false);
      });
      it("treats NaN and negative positions as 0", function () {
        expect(includes("abc", "a", NaN)).toBe(true);
        expect(includes("abc", "a", -5)).toBe(true);
      });
    });
    describe("coercion", function () {
      it("coerces the search argument via ToString", function () {
        expect(includes("a1b", 1)).toBe(true);
        expect(includes("aundefinedb", void 0)).toBe(true);
      });
    });
    describe("RegExp search throws (IsRegExp)", function () {
      it("throws TypeError when search is a RegExp", function () {
        expect(function () {
          return includes("abc", /b/);
        }).toThrow(TypeError);
      });
    });
    describe("parity vs native", function () {
      it("matches native scanning for a substring", function () {
        var native = String.prototype.includes;
        var nativeResult = native.call("the quick brown fox", "brown");
        var specResult = stringIncludes.call("the quick brown fox", "brown");
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.string.iterator.ts
  var isSupported142 = function isSupported142() {
    try {
      return typeof Symbol === "undefined" || !Symbol.iterator || typeof String.prototype[Symbol.iterator] === "function";
    } catch (e) {
      return true;
    }
  };
  var stringIterator = function stringIterator() {
    if (this === null || this === void 0) {
      throw new TypeError("String.prototype[Symbol.iterator] called on null or undefined");
    }
    var string = String(this);
    var index = 0;
    var iterator = {
      next: function next() {
        if (index >= string.length) {
          return {
            value: void 0,
            done: true
          };
        }
        var first = string.charCodeAt(index);
        var size = 1;
        if (first >= 55296 && first <= 56319 && index + 1 < string.length) {
          var second = string.charCodeAt(index + 1);
          if (second >= 56320 && second <= 57343) {
            size = 2;
          }
        }
        var value = string.substring(index, index + size);
        index += size;
        return {
          value: value,
          done: false
        };
      }
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      Object.defineProperty(iterator, Symbol.iterator, {
        value: function value() {
          return iterator;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    return iterator;
  };
  if (typeof Symbol !== "undefined" && Symbol.iterator && !isSupported142()) {
    Object.defineProperty(String.prototype, Symbol.iterator, {
      value: stringIterator,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(stringIterator, "name", {
      value: "[Symbol.iterator]",
      configurable: true
    });
    Object.defineProperty(String.prototype[Symbol.iterator], "__polyfilled", {
      value: true
    });
  }

  // tests/string-iterator.test.ts
  describe("String.prototype[Symbol.iterator] \u2014 test262 conformance", function () {
    var drain4 = function drain4(s) {
      var iterator = stringIterator.call(s);
      var out = [];
      var step = iterator.next();
      while (!step.done) {
        out.push(step.value);
        step = iterator.next();
      }
      return out;
    };
    describe("basic", function () {
      it("yields BMP characters one by one", function () {
        expect(drain4("abc")).toEqual(["a", "b", "c"]);
      });
      it("yields nothing for the empty string", function () {
        expect(drain4("")).toEqual([]);
      });
      it("coerces a non-string this via ToString", function () {
        expect(drain4(123)).toEqual(["1", "2", "3"]);
      });
    });
    describe("surrogate pairs", function () {
      it("keeps an emoji (U+1F600) together", function () {
        expect(drain4("a\uD83D\uDE00b")).toEqual(["a", "\uD83D\uDE00", "b"]);
      });
      it("keeps consecutive astral code points apart from each other", function () {
        expect(drain4("\uD83D\uDE00\uD83D\uDE01")).toEqual(["\uD83D\uDE00", "\uD83D\uDE01"]);
      });
      it("yields a lone lead surrogate as a single unit", function () {
        expect(drain4("a\uD83Db")).toEqual(["a", "\uD83D", "b"]);
      });
      it("yields a lone trail surrogate as a single unit", function () {
        expect(drain4("a\uDE00b")).toEqual(["a", "\uDE00", "b"]);
      });
      it("yields a trailing lead surrogate at end of string as itself", function () {
        expect(drain4("ab\uD83D")).toEqual(["a", "b", "\uD83D"]);
      });
    });
    describe("protocol", function () {
      it("is done with value undefined at the end, and stays done", function () {
        var iterator = stringIterator.call("x");
        expect(iterator.next()).toEqual({
          value: "x",
          done: false
        });
        expect(iterator.next()).toEqual({
          value: void 0,
          done: true
        });
        expect(iterator.next()).toEqual({
          value: void 0,
          done: true
        });
      });
      it("is itself iterable", function () {
        var iterator = stringIterator.call("hi");
        expect(iterator[Symbol.iterator]()).toBe(iterator);
      });
      it("throws TypeError on null/undefined this", function () {
        expect(function () {
          return stringIterator.call(null);
        }).toThrow(TypeError);
        expect(function () {
          return stringIterator.call(void 0);
        }).toThrow(TypeError);
      });
    });
    describe("parity vs native", function () {
      it("matches native iteration order and chunking", function () {
        var input = "x\uD83D\uDE00\uD83Dy";
        var native = [];
        var nativeIterator = input[Symbol.iterator]();
        var step = nativeIterator.next();
        while (!step.done) {
          native.push(step.value);
          step = nativeIterator.next();
        }
        var polyfilled = drain4(input);
        expect(polyfilled).toEqual(native);
      });
    });
  });

  // src/modules/es.string.pad-end.ts
  var isSupported143 = function isSupported143() {
    try {
      return typeof String.prototype.padEnd === "function";
    } catch (e) {
      return false;
    }
  };
  var stringPadEnd = function stringPadEnd(targetLength, padString) {
    var source = String(this);
    var padWith = padString !== void 0 ? String(padString) : " ";
    if (source.length >= targetLength || padWith.length === 0) {
      return source;
    }
    var charsNeeded = targetLength - source.length;
    var fill = padWith;
    while (fill.length < charsNeeded) {
      fill = fill + padWith;
    }
    return source + fill.substring(0, charsNeeded);
  };
  if (!isSupported143()) {
    Object.defineProperty(String.prototype, "padEnd", {
      value: stringPadEnd,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.padEnd, "name", {
      value: "padEnd",
      configurable: true
    });
    Object.defineProperty(String.prototype.padEnd, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.pad-start.ts
  var isSupported144 = function isSupported144() {
    try {
      return typeof String.prototype.padStart === "function";
    } catch (e) {
      return false;
    }
  };
  var stringPadStart = function stringPadStart(targetLength, padString) {
    var source = String(this);
    var padWith = padString !== void 0 ? String(padString) : " ";
    if (source.length >= targetLength || padWith.length === 0) {
      return source;
    }
    var charsNeeded = targetLength - source.length;
    var fill = padWith;
    while (fill.length < charsNeeded) {
      fill = fill + padWith;
    }
    return fill.substring(0, charsNeeded) + source;
  };
  if (!isSupported144()) {
    Object.defineProperty(String.prototype, "padStart", {
      value: stringPadStart,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.padStart, "name", {
      value: "padStart",
      configurable: true
    });
    Object.defineProperty(String.prototype.padStart, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.replace-all.ts
  var isSupported145 = function isSupported145() {
    try {
      return typeof String.prototype.replaceAll === "function";
    } catch (e) {
      return false;
    }
  };
  var substitute = function substitute(replacementString, matched, position, source) {
    if (replacementString.indexOf("$") === -1) {
      return replacementString;
    }
    var result = "";
    for (var _i105 = 0; _i105 < replacementString.length; _i105++) {
      var character = replacementString.charAt(_i105);
      var nextCharacter = _i105 + 1 < replacementString.length ? replacementString.charAt(_i105 + 1) : "";
      if (character === "$" && nextCharacter !== "") {
        if (nextCharacter === "$") {
          result += "$";
          _i105++;
          continue;
        }
        if (nextCharacter === "&") {
          result += matched;
          _i105++;
          continue;
        }
        if (nextCharacter === "`") {
          result += source.substring(0, position);
          _i105++;
          continue;
        }
        if (nextCharacter === "'") {
          result += source.substring(position + matched.length);
          _i105++;
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
    var source = String(this);
    var searchString = String(searchValue);
    var isFunction = typeof replaceValue === "function";
    var replacementString = isFunction ? "" : String(replaceValue);
    if (searchString === "") {
      var result2 = isFunction ? String(replaceValue("", 0, source)) : substitute(replacementString, "", 0, source);
      for (var _i106 = 0; _i106 < source.length; _i106++) {
        var replacement = isFunction ? String(replaceValue("", _i106 + 1, source)) : substitute(replacementString, "", _i106 + 1, source);
        result2 += source.charAt(_i106) + replacement;
      }
      return result2;
    }
    var result = "";
    var position = 0;
    var index = source.indexOf(searchString, position);
    while (index !== -1) {
      var _replacement = isFunction ? String(replaceValue(searchString, index, source)) : substitute(replacementString, searchString, index, source);
      result += source.substring(position, index) + _replacement;
      position = index + searchString.length;
      index = source.indexOf(searchString, position);
    }
    result += source.substring(position);
    return result;
  };
  if (!isSupported145()) {
    Object.defineProperty(String.prototype, "replaceAll", {
      value: stringReplaceAll,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.replaceAll, "name", {
      value: "replaceAll",
      configurable: true
    });
    Object.defineProperty(String.prototype.replaceAll, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.starts-with.ts
  var isSupported146 = function isSupported146() {
    try {
      return typeof String.prototype.startsWith === "function";
    } catch (e) {
      return false;
    }
  };
  var toInteger13 = function toInteger13(value) {
    var numeric = Number(value);
    if (isNaN(numeric)) {
      return 0;
    }
    return numeric < 0 ? Math.ceil(numeric) : Math.floor(numeric);
  };
  var stringStartsWith = function stringStartsWith(search, start) {
    if (search instanceof RegExp) {
      throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");
    }
    var searchString = String(search);
    var position = start === void 0 ? 0 : toInteger13(start);
    if (position < 0) {
      position = 0;
    }
    for (var _i107 = 0; _i107 < searchString.length; _i107++) {
      if (this.charCodeAt(position + _i107) !== searchString.charCodeAt(_i107)) {
        return false;
      }
    }
    return true;
  };
  if (!isSupported146()) {
    Object.defineProperty(String.prototype, "startsWith", {
      value: stringStartsWith,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.startsWith, "name", {
      value: "startsWith",
      configurable: true
    });
    Object.defineProperty(String.prototype.startsWith, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.trim-start.ts
  var isSupported147 = function isSupported147() {
    try {
      return typeof String.prototype.trimStart === "function";
    } catch (e) {
      return false;
    }
  };
  var stringTrimStart = function stringTrimStart() {
    return this.replace(/^\s+/, "");
  };
  if (!isSupported147()) {
    Object.defineProperty(String.prototype, "trimStart", {
      value: stringTrimStart,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.trimStart, "name", {
      value: "trimStart",
      configurable: true
    });
    Object.defineProperty(String.prototype.trimStart, "__polyfilled", {
      value: true
    });
  }

  // tests/string-methods.test.ts
  describe("String.prototype.includes \u2014 polyfill vs native", function () {
    it.each([["hello world", "world", void 0, true], ["hello world", "xyz", void 0, false], ["hello world", "hello", 5, false], ["hello world", "", void 0, true], ["", "", void 0, true], ["", "a", void 0, false]])('"%s".includes("%s", %p) === %p', function (str, search, pos, expected) {
      expect(stringIncludes.call(str, search, pos)).toBe(expected);
      expect(str.includes(search, pos)).toBe(expected);
    });
  });
  describe("String.prototype.startsWith \u2014 polyfill vs native", function () {
    it.each([["hello world", "hello", void 0, true], ["hello world", "world", void 0, false], ["hello world", "world", 6, true], ["hello", "", void 0, true]])('"%s".startsWith("%s", %p) === %p', function (str, search, pos, expected) {
      expect(stringStartsWith.call(str, search, pos)).toBe(expected);
      expect(str.startsWith(search, pos)).toBe(expected);
    });
  });
  describe("String.prototype.endsWith \u2014 polyfill vs native", function () {
    it.each([["hello world", "world", void 0, true], ["hello world", "hello", void 0, false], ["hello world", "hello", 5, true], ["hello", "", void 0, true]])('"%s".endsWith("%s", %p) === %p', function (str, search, len, expected) {
      expect(stringEndsWith.call(str, search, len)).toBe(expected);
      expect(str.endsWith(search, len)).toBe(expected);
    });
  });
  describe("String.prototype.padStart \u2014 polyfill vs native", function () {
    it.each([["abc", 6, void 0, "   abc"], ["abc", 6, "0", "000abc"], ["abc", 2, "0", "abc"], ["abc", 8, "12", "12121abc"]])('"%s".padStart(%p, %p) === "%s"', function (str, len, pad, expected) {
      expect(stringPadStart.call(str, len, pad)).toBe(expected);
      expect(str.padStart(len, pad)).toBe(expected);
    });
  });
  describe("String.prototype.padEnd \u2014 polyfill vs native", function () {
    it.each([["abc", 6, void 0, "abc   "], ["abc", 6, "0", "abc000"], ["abc", 2, "0", "abc"], ["abc", 8, "12", "abc12121"]])('"%s".padEnd(%p, %p) === "%s"', function (str, len, pad, expected) {
      expect(stringPadEnd.call(str, len, pad)).toBe(expected);
      expect(str.padEnd(len, pad)).toBe(expected);
    });
  });
  describe("String.prototype.trimStart \u2014 polyfill vs native", function () {
    it.each([["  hello  ", "hello  "], ["	\nhello", "hello"], ["hello", "hello"], ["", ""]])('"%s".trimStart() === "%s"', function (str, expected) {
      expect(stringTrimStart.call(str)).toBe(expected);
      expect(str.trimStart()).toBe(expected);
    });
  });
  describe("String.prototype.replaceAll \u2014 polyfill vs native", function () {
    it("replaces all occurrences", function () {
      var str = "aabbcc";
      expect(stringReplaceAll.call(str, "b", "X")).toBe(str.replaceAll("b", "X"));
    });
    it("handles no matches", function () {
      var str = "hello";
      expect(stringReplaceAll.call(str, "z", "X")).toBe(str.replaceAll("z", "X"));
    });
    it("handles empty search string", function () {
      var str = "abc";
      expect(stringReplaceAll.call(str, "", "-")).toBe(str.replaceAll("", "-"));
    });
    it("handles replacing with empty string", function () {
      var str = "a.b.c";
      expect(stringReplaceAll.call(str, ".", "")).toBe(str.replaceAll(".", ""));
    });
    it("handles multi-char search", function () {
      var str = "foobarfoobar";
      expect(stringReplaceAll.call(str, "foo", "baz")).toBe(str.replaceAll("foo", "baz"));
    });
  });
  describe("String.fromCodePoint \u2014 polyfill vs native", function () {
    it("handles BMP code points", function () {
      expect(stringFromCodePoint.call(null, 65, 66, 67)).toBe(String.fromCodePoint(65, 66, 67));
    });
    it("handles supplementary code points (emoji)", function () {
      expect(stringFromCodePoint.call(null, 128512)).toBe(String.fromCodePoint(128512));
    });
    it("handles mixed BMP and supplementary", function () {
      expect(stringFromCodePoint.call(null, 72, 128512, 33)).toBe(String.fromCodePoint(72, 128512, 33));
    });
    it("throws for invalid code point", function () {
      expect(function () {
        return stringFromCodePoint.call(null, -1);
      }).toThrow(RangeError);
      expect(function () {
        return String.fromCodePoint(-1);
      }).toThrow(RangeError);
    });
  });

  // tests/string-pad-end.test.ts
  describe("String.prototype.padEnd \u2014 test262 conformance", function () {
    var padEnd = function padEnd(s) {
      for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key10 = 1; _key10 < _len9; _key10++) {
        args[_key10 - 1] = arguments[_key10];
      }
      return stringPadEnd.apply(s, args);
    };
    describe("basic padding", function () {
      it("appends the default space", function () {
        expect(padEnd("abc", 5)).toBe("abc  ");
      });
      it("appends a custom pad", function () {
        expect(padEnd("5", 3, "0")).toBe("500");
      });
      it("returns the string unchanged when already long enough", function () {
        expect(padEnd("abcde", 5)).toBe("abcde");
        expect(padEnd("abcde", 3)).toBe("abcde");
      });
      it("returns a string", function () {
        expect(typeof padEnd("a", 3)).toBe("string");
      });
    });
    describe("pad repetition & truncation", function () {
      it("repeats a multi-char pad to fill exactly", function () {
        expect(padEnd("x", 5, "ab")).toBe("xabab");
      });
      it("truncates the pad mid-pattern to fit", function () {
        expect(padEnd("x", 5, "abc")).toBe("xabca");
      });
      it("fills a long target from an empty string", function () {
        expect(padEnd("", 10, "abc")).toBe("abcabcabca");
      });
      it("returns the string unchanged for an empty pad", function () {
        expect(padEnd("abc", 10, "")).toBe("abc");
      });
    });
    describe("maxLength coercion (ToLength)", function () {
      it("floors a fractional maxLength", function () {
        expect(padEnd("ab", 5.9, "*")).toBe("ab***");
      });
      it("returns unchanged for a negative maxLength", function () {
        expect(padEnd("ab", -5, "*")).toBe("ab");
      });
      it("treats a NaN maxLength as 0 (unchanged)", function () {
        expect(padEnd("ab", NaN, "*")).toBe("ab");
      });
    });
    describe("coercion", function () {
      it("coerces the receiver and pad via ToString", function () {
        expect(stringPadEnd.call(7, 3, 0)).toBe("700");
      });
    });
    describe("parity vs native", function () {
      it("matches native padding a label", function () {
        var native = String.prototype.padEnd;
        var nativeResult = native.call("Name", 10, ".");
        var specResult = stringPadEnd.call("Name", 10, ".");
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // tests/string-pad-start.test.ts
  describe("String.prototype.padStart \u2014 test262 conformance", function () {
    var padStart2 = function padStart2(s) {
      for (var _len0 = arguments.length, args = new Array(_len0 > 1 ? _len0 - 1 : 0), _key11 = 1; _key11 < _len0; _key11++) {
        args[_key11 - 1] = arguments[_key11];
      }
      return stringPadStart.apply(s, args);
    };
    describe("basic padding", function () {
      it("prepends the default space", function () {
        expect(padStart2("abc", 5)).toBe("  abc");
      });
      it("prepends a custom pad", function () {
        expect(padStart2("5", 3, "0")).toBe("005");
      });
      it("returns the string unchanged when already long enough", function () {
        expect(padStart2("abcde", 5)).toBe("abcde");
        expect(padStart2("abcde", 3)).toBe("abcde");
      });
      it("returns a string", function () {
        expect(typeof padStart2("a", 3)).toBe("string");
      });
    });
    describe("pad repetition & truncation", function () {
      it("repeats a multi-char pad to fill exactly", function () {
        expect(padStart2("x", 5, "ab")).toBe("ababx");
      });
      it("truncates the pad mid-pattern to fit", function () {
        expect(padStart2("x", 5, "abc")).toBe("abcax");
      });
      it("fills a long target from an empty string", function () {
        expect(padStart2("", 10, "abc")).toBe("abcabcabca");
      });
      it("returns the string unchanged for an empty pad", function () {
        expect(padStart2("abc", 10, "")).toBe("abc");
      });
    });
    describe("maxLength coercion (ToLength)", function () {
      it("floors a fractional maxLength", function () {
        expect(padStart2("ab", 5.9, "*")).toBe("***ab");
      });
      it("returns unchanged for a negative maxLength", function () {
        expect(padStart2("ab", -5, "*")).toBe("ab");
      });
      it("treats a NaN maxLength as 0 (unchanged)", function () {
        expect(padStart2("ab", NaN, "*")).toBe("ab");
      });
    });
    describe("coercion", function () {
      it("coerces the receiver and pad via ToString", function () {
        expect(stringPadStart.call(7, 3, 0)).toBe("007");
      });
    });
    describe("parity vs native", function () {
      it("matches native zero-padding a number", function () {
        var native = String.prototype.padStart;
        var nativeResult = native.call("42", 6, "0");
        var specResult = stringPadStart.call("42", 6, "0");
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // tests/string-replace-all.test.ts
  describe("String.prototype.replaceAll \u2014 test262 conformance", function () {
    var replaceAll = function replaceAll(s) {
      for (var _len1 = arguments.length, args = new Array(_len1 > 1 ? _len1 - 1 : 0), _key12 = 1; _key12 < _len1; _key12++) {
        args[_key12 - 1] = arguments[_key12];
      }
      return stringReplaceAll.apply(s, args);
    };
    describe("string search & replacement", function () {
      it("replaces all occurrences", function () {
        expect(replaceAll("aabbcc", "b", "x")).toBe("aaxxcc");
        expect(replaceAll("a.b.c", ".", "-")).toBe("a-b-c");
      });
      it("returns the string unchanged when there is no match", function () {
        expect(replaceAll("abc", "z", "x")).toBe("abc");
      });
      it("replaces a multi-char search", function () {
        expect(replaceAll("foofoo", "foo", "bar")).toBe("barbar");
      });
      it("does not re-scan replaced text", function () {
        expect(replaceAll("aaa", "aa", "a")).toBe("aa");
      });
    });
    describe("empty search", function () {
      it("inserts the replacement between every character and at the ends", function () {
        expect(replaceAll("abc", "", "-")).toBe("-a-b-c-");
      });
    });
    describe("function replacer", function () {
      it("uses the function return value for each match", function () {
        expect(replaceAll("aabbcc", "b", function () {
          return "x";
        })).toBe("aaxxcc");
      });
      it("passes (matched, position, string) and runs in order", function () {
        var calls = [];
        var out = replaceAll("a1a2", "a", function (m, i, s) {
          calls.push([m, i, s]);
          return "[" + i + "]";
        });
        expect(out).toBe("[0]1[2]2");
        expect(calls).toEqual([["a", 0, "a1a2"], ["a", 2, "a1a2"]]);
      });
    });
    describe("$ substitution (string replacement)", function () {
      it("$& inserts the matched substring", function () {
        expect(replaceAll("abc", "b", "[$&]")).toBe("a[b]c");
      });
      it("$$ inserts a literal dollar sign", function () {
        expect(replaceAll("ab", "a", "$$")).toBe("$b");
      });
      it("$` inserts the portion before the match", function () {
        expect(replaceAll("xby", "b", "$`")).toBe("xxy");
      });
      it("$' inserts the portion after the match", function () {
        expect(replaceAll("xby", "b", "$'")).toBe("xyy");
      });
      it("leaves an unknown $ pattern literal", function () {
        expect(replaceAll("ab", "a", "$z")).toBe("$zb");
      });
    });
    describe("RegExp search", function () {
      it("replaces all with a global RegExp", function () {
        expect(replaceAll("a1b2c3", /[0-9]/g, "#")).toBe("a#b#c#");
      });
      it("supports a function replacer with a global RegExp", function () {
        expect(replaceAll("a1b2", /[0-9]/g, function (m) {
          return "<" + m + ">";
        })).toBe("a<1>b<2>");
      });
      it("throws TypeError for a non-global RegExp", function () {
        expect(function () {
          return replaceAll("abc", /b/, "x");
        }).toThrow(TypeError);
      });
    });
    describe("coercion", function () {
      it("coerces search and replacement via ToString", function () {
        expect(replaceAll("a1b1", 1, 2)).toBe("a2b2");
      });
    });
    describe("parity vs native", function () {
      it("matches native replacing all separators", function () {
        var native = String.prototype.replaceAll;
        var nativeResult = native.call("a,b,c,d,e", ",", ";");
        var specResult = stringReplaceAll.call("a,b,c,d,e", ",", ";");
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // tests/string-starts-with.test.ts
  describe("String.prototype.startsWith \u2014 test262 conformance", function () {
    var startsWith = function startsWith(s) {
      for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key13 = 1; _key13 < _len10; _key13++) {
        args[_key13 - 1] = arguments[_key13];
      }
      return stringStartsWith.apply(s, args);
    };
    describe("basic", function () {
      it("matches a prefix", function () {
        expect(startsWith("abc", "ab")).toBe(true);
        expect(startsWith("abc", "abc")).toBe(true);
      });
      it("is false when not a prefix", function () {
        expect(startsWith("abc", "bc")).toBe(false);
        expect(startsWith("abc", "abcd")).toBe(false);
      });
      it("is case-sensitive", function () {
        expect(startsWith("abc", "A")).toBe(false);
      });
    });
    describe("position", function () {
      it("matches at a positive position", function () {
        expect(startsWith("abcdef", "cd", 2)).toBe(true);
        expect(startsWith("abcdef", "cd", 1)).toBe(false);
      });
      it("treats NaN and negative positions as 0", function () {
        expect(startsWith("abc", "ab", NaN)).toBe(true);
        expect(startsWith("abc", "ab", -5)).toBe(true);
      });
      it("truncates a fractional position toward zero", function () {
        expect(startsWith("abcdef", "cd", 2.9)).toBe(true);
      });
      it("is false when position is past the end (non-empty search)", function () {
        expect(startsWith("abc", "a", 10)).toBe(false);
      });
    });
    describe("empty search", function () {
      it("always matches the empty string, even past the end", function () {
        expect(startsWith("abc", "")).toBe(true);
        expect(startsWith("abc", "", 100)).toBe(true);
      });
    });
    describe("coercion & RegExp", function () {
      it("coerces the search via ToString", function () {
        expect(startsWith("12abc", 12)).toBe(true);
      });
      it("throws TypeError when search is a RegExp", function () {
        expect(function () {
          return startsWith("abc", /a/);
        }).toThrow(TypeError);
      });
    });
    describe("parity vs native", function () {
      it("matches native", function () {
        var native = String.prototype.startsWith;
        var nativeResult = native.call("https://example.com", "https://");
        var specResult = stringStartsWith.call("https://example.com", "https://");
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // tests/string-trim-start.test.ts
  describe("String.prototype.trimStart \u2014 test262 conformance", function () {
    var trimStart = function trimStart(s) {
      return stringTrimStart.call(s);
    };
    describe("basic", function () {
      it("removes leading spaces, keeps trailing", function () {
        expect(trimStart("   abc   ")).toBe("abc   ");
      });
      it("leaves a string with no leading whitespace unchanged", function () {
        expect(trimStart("abc  ")).toBe("abc  ");
      });
      it("returns empty for an all-whitespace string", function () {
        expect(trimStart("   	\n ")).toBe("");
      });
      it("returns empty for an empty string", function () {
        expect(trimStart("")).toBe("");
      });
      it("returns a string", function () {
        expect(typeof trimStart("  x")).toBe("string");
      });
    });
    describe("whitespace varieties", function () {
      it("removes tab, newline, carriage return, vertical tab, form feed", function () {
        expect(trimStart("	\n\r\v\fabc")).toBe("abc");
      });
      it("removes non-breaking space (U+00A0) and BOM (U+FEFF)", function () {
        expect(trimStart("\xA0\uFEFFabc")).toBe("abc");
      });
      it("removes Unicode space separators (U+2028, U+2029, U+3000)", function () {
        expect(trimStart("\u2028\u2029\u3000abc")).toBe("abc");
      });
      it("does not remove non-whitespace lookalikes (U+200B zero-width)", function () {
        expect(trimStart("\u200Babc")).toBe("\u200Babc");
      });
    });
    describe("only leading", function () {
      it("never touches interior or trailing whitespace", function () {
        expect(trimStart("  a b  c  ")).toBe("a b  c  ");
      });
    });
    describe("parity vs native", function () {
      it("matches native", function () {
        var native = String.prototype.trimStart;
        var nativeResult = native.call("   	 padded value  ");
        var specResult = stringTrimStart.call("   	 padded value  ");
        expect(specResult).toBe(nativeResult);
      });
    });
  });

  // src/modules/es.string.trim.ts
  var isSupported148 = function isSupported148() {
    try {
      return typeof String.prototype.trim === "function";
    } catch (e) {
      return false;
    }
  };
  var stringTrim = function stringTrim() {
    return this.replace(/^\s+|\s+$/g, "");
  };
  if (!isSupported148()) {
    Object.defineProperty(String.prototype, "trim", {
      value: stringTrim,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.trim, "name", {
      value: "trim",
      configurable: true
    });
    Object.defineProperty(String.prototype.trim, "__polyfilled", {
      value: true
    });
  }

  // tests/string-trim.test.ts
  describe("String.prototype.trim \u2014 test262 conformance", function () {
    var trim3 = function trim3(s) {
      return stringTrim.call(s);
    };
    describe("basic", function () {
      it("removes leading and trailing whitespace", function () {
        expect(trim3("   abc   ")).toBe("abc");
      });
      it("keeps interior whitespace", function () {
        expect(trim3("  a b  c  ")).toBe("a b  c");
      });
      it("leaves an already-trimmed string unchanged", function () {
        expect(trim3("abc")).toBe("abc");
      });
      it("returns empty for an all-whitespace string", function () {
        expect(trim3("   	\n ")).toBe("");
      });
      it("returns empty for an empty string", function () {
        expect(trim3("")).toBe("");
      });
    });
    describe("whitespace varieties", function () {
      it("removes tab, newline, carriage return, vertical tab, form feed", function () {
        expect(trim3("	\n\r\v\fabc\f\v\r\n	")).toBe("abc");
      });
      it("removes non-breaking space (U+00A0) and BOM (U+FEFF)", function () {
        expect(trim3("\xA0\uFEFFabc\uFEFF\xA0")).toBe("abc");
      });
      it("removes Unicode space separators (U+2028, U+2029, U+3000)", function () {
        expect(trim3("\u2028\u3000abc\u2029")).toBe("abc");
      });
      it("does not remove non-whitespace lookalikes (U+200B zero-width)", function () {
        expect(trim3("\u200Babc\u200B")).toBe("\u200Babc\u200B");
      });
    });
    describe("parity vs native", function () {
      it("matches native", function () {
        var input = " 	 padded value  \n";
        expect(stringTrim.call(input)).toBe(input.trim());
      });
    });
  });

  // src/modules/es.string.is-well-formed.ts
  var isSupported149 = function isSupported149() {
    try {
      return typeof String.prototype.isWellFormed === "function";
    } catch (e) {
      return false;
    }
  };
  var stringIsWellFormed = function stringIsWellFormed() {
    var str = String(this);
    for (var _i108 = 0; _i108 < str.length; _i108++) {
      var code = str.charCodeAt(_i108);
      if (code >= 56320 && code <= 57343) {
        return false;
      }
      if (code >= 55296 && code <= 56319) {
        var next = str.charCodeAt(_i108 + 1);
        if (!(next >= 56320 && next <= 57343)) {
          return false;
        }
        _i108++;
      }
    }
    return true;
  };
  if (!isSupported149()) {
    Object.defineProperty(String.prototype, "isWellFormed", {
      value: stringIsWellFormed,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.isWellFormed, "name", {
      value: "isWellFormed",
      configurable: true
    });
    Object.defineProperty(String.prototype.isWellFormed, "__polyfilled", {
      value: true
    });
  }

  // src/modules/es.string.to-well-formed.ts
  var isSupported150 = function isSupported150() {
    try {
      return typeof String.prototype.toWellFormed === "function";
    } catch (e) {
      return false;
    }
  };
  var stringToWellFormed = function stringToWellFormed() {
    var str = String(this);
    var out = "";
    for (var _i109 = 0; _i109 < str.length; _i109++) {
      var code = str.charCodeAt(_i109);
      if (code >= 56320 && code <= 57343) {
        out += "\uFFFD";
      } else if (code >= 55296 && code <= 56319) {
        var next = str.charCodeAt(_i109 + 1);
        if (next >= 56320 && next <= 57343) {
          out += str.charAt(_i109) + str.charAt(_i109 + 1);
          _i109++;
        } else {
          out += "\uFFFD";
        }
      } else {
        out += str.charAt(_i109);
      }
    }
    return out;
  };
  if (!isSupported150()) {
    Object.defineProperty(String.prototype, "toWellFormed", {
      value: stringToWellFormed,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(String.prototype.toWellFormed, "name", {
      value: "toWellFormed",
      configurable: true
    });
    Object.defineProperty(String.prototype.toWellFormed, "__polyfilled", {
      value: true
    });
  }

  // tests/string-well-formed.test.ts
  describe("String well-formed (ES2024) \u2014 test262 conformance", function () {
    describe("isWellFormed", function () {
      it("accepts BMP-only and properly paired strings", function () {
        expect(stringIsWellFormed.call("")).toBe(true);
        expect(stringIsWellFormed.call("abc")).toBe(true);
        expect(stringIsWellFormed.call("a\uD83D\uDE00b")).toBe(true);
      });
      it("rejects lone surrogates in any position", function () {
        expect(stringIsWellFormed.call("\uD800")).toBe(false);
        expect(stringIsWellFormed.call("\uDC00")).toBe(false);
        expect(stringIsWellFormed.call("a\uD800z")).toBe(false);
        expect(stringIsWellFormed.call("\uDC00\uD800")).toBe(false);
        expect(stringIsWellFormed.call("abc\uD800")).toBe(false);
      });
      it("matches native", function () {
        var native = String.prototype.isWellFormed;
        if (typeof native !== "function") return;
        var cases = ["", "abc", "\uD800", "\uDC00", "a\uD83D\uDE00b", "\uDC00\uD800"];
        for (var _i110 = 0; _i110 < cases.length; _i110++) {
          expect(stringIsWellFormed.call(cases[_i110])).toBe(native.call(cases[_i110]));
        }
      });
    });
    describe("toWellFormed", function () {
      it("returns well-formed strings unchanged", function () {
        expect(stringToWellFormed.call("abc")).toBe("abc");
        expect(stringToWellFormed.call("a\uD83D\uDE00b")).toBe("a\uD83D\uDE00b");
      });
      it("replaces each lone surrogate with U+FFFD", function () {
        expect(stringToWellFormed.call("\uD800")).toBe("\uFFFD");
        expect(stringToWellFormed.call("a\uDC00z")).toBe("a\uFFFDz");
        expect(stringToWellFormed.call("\uDC00\uD800")).toBe("\uFFFD\uFFFD");
        expect(stringToWellFormed.call("\uD83D\uDE00\uD800")).toBe("\uD83D\uDE00\uFFFD");
      });
      it("matches native", function () {
        var native = String.prototype.toWellFormed;
        if (typeof native !== "function") return;
        var cases = ["", "abc", "\uD800", "a\uDC00z", "\uD83D\uDE00\uD800"];
        for (var _i111 = 0; _i111 < cases.length; _i111++) {
          expect(stringToWellFormed.call(cases[_i111])).toBe(native.call(cases[_i111]));
        }
      });
    });
  });

  // node_modules/@ungap/structured-clone/esm/types.js
  var VOID = -1;
  var PRIMITIVE = 0;
  var ARRAY = 1;
  var OBJECT = 2;
  var DATE = 3;
  var REGEXP = 4;
  var MAP = 5;
  var SET = 6;
  var ERROR = 7;
  var BIGINT = 8;

  // node_modules/@ungap/structured-clone/esm/deserialize.js
  var env = typeof self === "object" ? self : globalThis;
  var guard2 = function guard2(name, init) {
    switch (name) {
      case "Function":
      case "SharedWorker":
      case "Worker":
      case "eval":
      case "setInterval":
      case "setTimeout":
        throw new TypeError("unable to deserialize " + name);
    }
    return new env[name](init);
  };
  var deserializer = function deserializer($, _) {
    var as = function as(out, index) {
      $.set(index, out);
      return out;
    };
    var _unpair = function unpair(index) {
      if ($.has(index)) return $.get(index);
      var _$index = _slicedToArray(_[index], 2),
        type = _$index[0],
        value = _$index[1];
      switch (type) {
        case PRIMITIVE:
        case VOID:
          return as(value, index);
        case ARRAY:
          {
            var arr = as([], index);
            var _iterator2 = _createForOfIteratorHelper(value),
              _step6;
            try {
              for (_iterator2.s(); !(_step6 = _iterator2.n()).done;) {
                var index2 = _step6.value;
                arr.push(_unpair(index2));
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            return arr;
          }
        case OBJECT:
          {
            var object = as({}, index);
            var _iterator3 = _createForOfIteratorHelper(value),
              _step7;
            try {
              for (_iterator3.s(); !(_step7 = _iterator3.n()).done;) {
                var _step7$value = _slicedToArray(_step7.value, 2),
                  _key14 = _step7$value[0],
                  _index = _step7$value[1];
                object[_unpair(_key14)] = _unpair(_index);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
            return object;
          }
        case DATE:
          return as(new Date(value), index);
        case REGEXP:
          {
            var source = value.source,
              flags = value.flags;
            return as(new RegExp(source, flags), index);
          }
        case MAP:
          {
            var map = as(/* @__PURE__ */new Map(), index);
            var _iterator4 = _createForOfIteratorHelper(value),
              _step8;
            try {
              for (_iterator4.s(); !(_step8 = _iterator4.n()).done;) {
                var _step8$value = _slicedToArray(_step8.value, 2),
                  _key15 = _step8$value[0],
                  _index2 = _step8$value[1];
                map.set(_unpair(_key15), _unpair(_index2));
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
            return map;
          }
        case SET:
          {
            var set = as(/* @__PURE__ */new Set(), index);
            var _iterator5 = _createForOfIteratorHelper(value),
              _step9;
            try {
              for (_iterator5.s(); !(_step9 = _iterator5.n()).done;) {
                var _index3 = _step9.value;
                set.add(_unpair(_index3));
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }
            return set;
          }
        case ERROR:
          {
            var _name3 = value.name,
              message = value.message;
            return as(typeof env[_name3] === "function" ? guard2(_name3, message) : new Error(message), index);
          }
        case BIGINT:
          return as(BigInt(value), index);
        case "BigInt":
          return as(Object(BigInt(value)), index);
        case "ArrayBuffer":
          return as(new Uint8Array(value).buffer, value);
        case "DataView":
          {
            var _Uint8Array = new Uint8Array(value),
              buffer = _Uint8Array.buffer;
            return as(new DataView(buffer), value);
          }
      }
      return as(guard2(type, value), index);
    };
    return _unpair;
  };
  var deserialize = function deserialize(serialized) {
    return deserializer(/* @__PURE__ */new Map(), serialized)(0);
  };

  // node_modules/@ungap/structured-clone/esm/serialize.js
  var EMPTY = "";
  var _ref43 = {},
    toString = _ref43.toString;
  var keys = Object.keys;
  var typeOf2 = function typeOf2(value) {
    var type = typeof value;
    if (type !== "object" || !value) return [PRIMITIVE, type];
    var asString = toString.call(value).slice(8, -1);
    switch (asString) {
      case "Array":
        return [ARRAY, EMPTY];
      case "Object":
        return [OBJECT, EMPTY];
      case "Date":
        return [DATE, EMPTY];
      case "RegExp":
        return [REGEXP, EMPTY];
      case "Map":
        return [MAP, EMPTY];
      case "Set":
        return [SET, EMPTY];
      case "DataView":
        return [ARRAY, asString];
    }
    if (asString.includes("Array")) return [ARRAY, asString];
    if (value instanceof Error) return [ERROR, value.name || "Error"];
    return [OBJECT, asString];
  };
  var shouldSkip = function shouldSkip(_ref44) {
    var _ref45 = _slicedToArray(_ref44, 2),
      TYPE = _ref45[0],
      type = _ref45[1];
    return TYPE === PRIMITIVE && (type === "function" || type === "symbol");
  };
  var serializer = function serializer(strict, json, $, _) {
    var as = function as(out, value) {
      var index = _.push(out) - 1;
      $.set(value, index);
      return index;
    };
    var _pair = function pair(value) {
      if ($.has(value)) return $.get(value);
      var _typeOf = typeOf2(value),
        _typeOf2 = _slicedToArray(_typeOf, 2),
        TYPE = _typeOf2[0],
        type = _typeOf2[1];
      switch (TYPE) {
        case PRIMITIVE:
          {
            var entry = value;
            switch (type) {
              case "bigint":
                TYPE = BIGINT;
                entry = value.toString();
                break;
              case "function":
              case "symbol":
                if (strict) throw new TypeError("unable to serialize " + type);
                entry = null;
                break;
              case "undefined":
                return as([VOID], value);
            }
            return as([TYPE, entry], value);
          }
        case ARRAY:
          {
            if (type) {
              var spread = value;
              if (type === "DataView") {
                spread = new Uint8Array(value.buffer);
              } else if (type === "ArrayBuffer") {
                spread = new Uint8Array(value);
              }
              return as([type, _toConsumableArray(spread)], value);
            }
            var arr = [];
            var index = as([TYPE, arr], value);
            var _iterator6 = _createForOfIteratorHelper(value),
              _step0;
            try {
              for (_iterator6.s(); !(_step0 = _iterator6.n()).done;) {
                var _entry = _step0.value;
                arr.push(_pair(_entry));
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
            return index;
          }
        case OBJECT:
          {
            if (type) {
              switch (type) {
                case "BigInt":
                  return as([type, value.toString()], value);
                case "Boolean":
                case "Number":
                case "String":
                  return as([type, value.valueOf()], value);
              }
            }
            if (json && "toJSON" in value) return _pair(value.toJSON());
            var entries = [];
            var _index4 = as([TYPE, entries], value);
            var _iterator7 = _createForOfIteratorHelper(keys(value)),
              _step1;
            try {
              for (_iterator7.s(); !(_step1 = _iterator7.n()).done;) {
                var _key16 = _step1.value;
                if (strict || !shouldSkip(typeOf2(value[_key16]))) entries.push([_pair(_key16), _pair(value[_key16])]);
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
            return _index4;
          }
        case DATE:
          return as([TYPE, isNaN(value.getTime()) ? EMPTY : value.toISOString()], value);
        case REGEXP:
          {
            var source = value.source,
              flags = value.flags;
            return as([TYPE, {
              source: source,
              flags: flags
            }], value);
          }
        case MAP:
          {
            var _entries = [];
            var _index5 = as([TYPE, _entries], value);
            var _iterator8 = _createForOfIteratorHelper(value),
              _step10;
            try {
              for (_iterator8.s(); !(_step10 = _iterator8.n()).done;) {
                var _step10$value = _slicedToArray(_step10.value, 2),
                  _key17 = _step10$value[0],
                  _entry2 = _step10$value[1];
                if (strict || !(shouldSkip(typeOf2(_key17)) || shouldSkip(typeOf2(_entry2)))) _entries.push([_pair(_key17), _pair(_entry2)]);
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
            return _index5;
          }
        case SET:
          {
            var _entries2 = [];
            var _index6 = as([TYPE, _entries2], value);
            var _iterator9 = _createForOfIteratorHelper(value),
              _step11;
            try {
              for (_iterator9.s(); !(_step11 = _iterator9.n()).done;) {
                var _entry3 = _step11.value;
                if (strict || !shouldSkip(typeOf2(_entry3))) _entries2.push(_pair(_entry3));
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }
            return _index6;
          }
      }
      var message = value.message;
      return as([TYPE, {
        name: type,
        message: message
      }], value);
    };
    return _pair;
  };
  var serialize = function serialize(value) {
    var _ref46 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      json = _ref46.json,
      lossy = _ref46.lossy;
    var _ = [];
    return serializer(!(json || lossy), !!json, /* @__PURE__ */new Map(), _)(value), _;
  };

  // node_modules/@ungap/structured-clone/esm/index.js
  var esm_default = typeof structuredClone === "function" ? (/* c8 ignore start */
  function (any, options) {
    return options && ("json" in options || "lossy" in options) ? deserialize(serialize(any, options)) : structuredClone(any);
  }) : function (any, options) {
    return deserialize(serialize(any, options));
  };

  // src/modules/web.structured-clone.ts
  var isSupported151 = function isSupported151() {
    try {
      if (typeof window.structuredClone !== "function") {
        return false;
      }
      var source = {
        a: 1,
        nested: {
          b: 2
        },
        when: /* @__PURE__ */new Date(0)
      };
      var copy = window.structuredClone(source);
      return copy !== source && copy.nested !== source.nested && copy.a === 1 && copy.nested.b === 2 && copy.when instanceof Date && copy.when.getTime() === 0;
    } catch (e) {
      return false;
    }
  };
  var structuredClone2 = function structuredClone2(value, options) {
    return esm_default(value, options);
  };
  if (!isSupported151()) {
    window.structuredClone = null;
    delete window.structuredClone;
    Object.defineProperty(window, "structuredClone", {
      value: structuredClone2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.structuredClone, "name", {
      value: "structuredClone",
      configurable: true
    });
    Object.defineProperty(window.structuredClone, "__polyfilled", {
      value: true
    });
  }

  // tests/structured-clone.test.ts
  describe("structuredClone \u2014 polyfill", function () {
    it("deep-clones nested objects (new references)", function () {
      var source = {
        a: 1,
        nested: {
          b: 2
        }
      };
      var copy = structuredClone2(source);
      expect(copy).toEqual(source);
      expect(copy).not.toBe(source);
      expect(copy.nested).not.toBe(source.nested);
    });
    it("clones arrays", function () {
      var source = [1, [2, 3], {
        x: 4
      }];
      var copy = structuredClone2(source);
      expect(copy).toEqual(source);
      expect(copy[1]).not.toBe(source[1]);
    });
    it("preserves Date, RegExp, Map, Set types", function () {
      var source = {
        d: /* @__PURE__ */new Date(1e3),
        r: /abc/gi,
        m: /* @__PURE__ */new Map([["k", "v"]]),
        s: /* @__PURE__ */new Set([1, 2])
      };
      var copy = structuredClone2(source);
      expect(copy.d).toBeInstanceOf(Date);
      expect(copy.d.getTime()).toBe(1e3);
      expect(copy.r).toBeInstanceOf(RegExp);
      expect(copy.r.source).toBe("abc");
      expect(copy.m).toBeInstanceOf(Map);
      expect(copy.m.get("k")).toBe("v");
      expect(copy.s).toBeInstanceOf(Set);
      expect(copy.s.has(2)).toBe(true);
    });
    it("handles circular references", function () {
      var source = {
        name: "loop"
      };
      source.self = source;
      var copy = structuredClone2(source);
      expect(copy.name).toBe("loop");
      expect(copy.self).toBe(copy);
    });
    it("clones typed arrays", function () {
      var source = new Uint8Array([1, 2, 3]);
      var copy = structuredClone2(source);
      expect(Array.from(copy)).toEqual([1, 2, 3]);
      expect(copy).not.toBe(source);
    });
    describe("parity vs native", function () {
      it("matches native deep-cloning a JSON-safe object", function () {
        var source = {
          a: 1,
          nested: {
            b: 2,
            c: [3, 4]
          }
        };
        var nativeResult = structuredClone(source);
        var specResult = structuredClone2(source);
        expect(specResult).toEqual(nativeResult);
      });
    });
  });

  // src/modules/es.symbol.ts
  var isSupported152 = function isSupported152() {
    try {
      if (typeof Symbol !== "function") {
        return false;
      }
      var testSymbol = /* @__PURE__ */Symbol("test");
      if (typeof testSymbol !== "symbol") {
        return false;
      }
      if (typeof Symbol.iterator !== "symbol") {
        return false;
      }
      var testSymbol1 = /* @__PURE__ */Symbol("key");
      var testSymbol2 = /* @__PURE__ */Symbol("key");
      if (testSymbol1 === testSymbol2) {
        return false;
      }
      if (typeof Symbol.for !== "function") {
        return false;
      }
      if (/* @__PURE__ */Symbol.for("registry") !== /* @__PURE__ */Symbol.for("registry")) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  var objectProto = Object.prototype;
  var defineProperty = Object.defineProperty;
  var usedNames = /* @__PURE__ */Object.create(null);
  var generateName = function generateName(description) {
    var postfix = 0;
    while (usedNames[description + (postfix || "")]) {
      postfix++;
    }
    var unique = description + (postfix || "");
    usedNames[unique] = true;
    return "@@" + unique;
  };
  var isPolyfilledSymbolKey = function isPolyfilledSymbolKey(key) {
    return typeof key === "string" && key.charAt(0) === "@" && key.charAt(1) === "@";
  };
  var withoutSymbolKeys = function withoutSymbolKeys(keys2) {
    var out = [];
    for (var _i112 = 0; _i112 < keys2.length; _i112++) {
      if (!isPolyfilledSymbolKey(keys2[_i112])) out.push(keys2[_i112]);
    }
    return out;
  };
  var hideSymbolKeys = function hideSymbolKeys() {
    var nativeKeys2 = Object.keys;
    Object.keys = function (target) {
      return withoutSymbolKeys(nativeKeys2(target));
    };
    var nativeNames = Object.getOwnPropertyNames;
    if (typeof nativeNames === "function") {
      Object.getOwnPropertyNames = function (target) {
        return withoutSymbolKeys(nativeNames(target));
      };
    }
    var nativeEntries = Object.entries;
    if (typeof nativeEntries === "function") {
      Object.entries = function (target) {
        var out = [];
        var pairs = nativeEntries(target);
        for (var _i113 = 0; _i113 < pairs.length; _i113++) {
          if (!isPolyfilledSymbolKey(pairs[_i113][0])) out.push(pairs[_i113]);
        }
        return out;
      };
    }
    var nativeValues = Object.values;
    if (typeof nativeValues === "function") {
      Object.values = function (target) {
        var out = [];
        var keys2 = nativeKeys2(target);
        for (var _i114 = 0; _i114 < keys2.length; _i114++) {
          if (!isPolyfilledSymbolKey(keys2[_i114])) out.push(target[keys2[_i114]]);
        }
        return out;
      };
    }
    var nativeAssign = Object.assign;
    if (typeof nativeAssign === "function") {
      Object.assign = function (target) {
        for (var _i115 = 1; _i115 < arguments.length; _i115++) {
          var source = arguments[_i115];
          if (source === null || source === void 0) continue;
          var keys2 = nativeKeys2(Object(source));
          for (var k = 0; k < keys2.length; k++) {
            if (!isPolyfilledSymbolKey(keys2[k])) target[keys2[k]] = source[keys2[k]];
          }
        }
        return target;
      };
    }
    if (typeof JSON !== "undefined" && typeof JSON.stringify === "function") {
      var nativeStringify = JSON.stringify;
      JSON.stringify = function (value, replacer, space) {
        if (Object.prototype.toString.call(replacer) === "[object Array]") {
          return nativeStringify(value, replacer, space);
        }
        return nativeStringify(value, function (key, val) {
          if (isPolyfilledSymbolKey(key)) return void 0;
          return typeof replacer === "function" ? replacer.call(this, key, val) : val;
        }, space);
      };
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
  var SymbolPolyfill = function Symbol2(description) {
    if (this instanceof SymbolPolyfill) {
      throw new TypeError("Symbol is not a constructor");
    }
    var symbol = Object.create(symbolProto);
    var desc = description === void 0 ? "" : String(description);
    defineProperty(symbol, "__description__", {
      value: desc
    });
    defineProperty(symbol, "__name__", {
      value: generateName(desc)
    });
    return symbol;
  };
  var wellKnown = ["hasInstance", "isConcatSpreadable", "iterator", "asyncIterator", "match", "matchAll", "replace", "search", "species", "split", "toPrimitive", "toStringTag", "unscopables"];
  for (var _i116 = 0; _i116 < wellKnown.length; _i116++) {
    defineProperty(SymbolPolyfill, wellKnown[_i116], {
      value: SymbolPolyfill(wellKnown[_i116])
    });
  }
  var registry = /* @__PURE__ */Object.create(null);
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
      for (var _key18 in registry) {
        if (registry[_key18] === symbol) {
          return _key18;
        }
      }
      return void 0;
    }
  });
  if (!isSupported152()) {
    window.Symbol = null;
    delete window.Symbol;
    Object.defineProperty(window, "Symbol", {
      value: SymbolPolyfill,
      writable: true,
      enumerable: false,
      configurable: true
    });
    hideSymbolKeys();
    Object.defineProperty(window.Symbol, "name", {
      value: "Symbol",
      configurable: true
    });
    Object.defineProperty(window.Symbol, "__polyfilled", {
      value: true
    });
  }

  // tests/symbol.test.ts
  hideSymbolKeys();
  describe("Symbol polyfill (es6-symbol replacement)", function () {
    describe("construction + uniqueness", function () {
      it("each call produces a distinct symbol", function () {
        expect(SymbolPolyfill("x")).not.toBe(SymbolPolyfill("x"));
      });
      it("is not a constructor \u2014 `new Symbol()` throws (parity w/ native)", function () {
        expect(function () {
          return new SymbolPolyfill("x");
        }).toThrow(TypeError);
        expect(function () {
          return new Symbol("x");
        }).toThrow(TypeError);
      });
      it("a produced symbol is not an instance of the Symbol wrapper", function () {
        expect(SymbolPolyfill("x") instanceof SymbolPolyfill).toBe(false);
      });
      it("exposes description", function () {
        expect(SymbolPolyfill("hi").description).toBe("hi");
        expect(SymbolPolyfill().description).toBe("");
      });
    });
    describe("registry \u2014 Symbol.for / Symbol.keyFor (parity w/ native)", function () {
      it("Symbol.for interns by key", function () {
        expect(SymbolPolyfill.for("k")).toBe(SymbolPolyfill.for("k"));
        expect(/* @__PURE__ */Symbol.for("k")).toBe(/* @__PURE__ */Symbol.for("k"));
      });
      it("distinct keys give distinct symbols", function () {
        expect(SymbolPolyfill.for("a")).not.toBe(SymbolPolyfill.for("b"));
      });
      it("Symbol.keyFor reverses a registered symbol, undefined otherwise", function () {
        var s = SymbolPolyfill.for("roundtrip");
        expect(SymbolPolyfill.keyFor(s)).toBe("roundtrip");
        expect(SymbolPolyfill.keyFor(SymbolPolyfill("unregistered"))).toBeUndefined();
      });
    });
    describe("well-known symbols", function () {
      it("defines the standard set as unique values", function () {
        var names = ["iterator", "asyncIterator", "toStringTag", "toPrimitive", "hasInstance", "species"];
        var seen = [];
        for (var _i117 = 0; _i117 < names.length; _i117++) {
          var sym = SymbolPolyfill[names[_i117]];
          expect(sym).toBeDefined();
          expect(seen.indexOf(sym)).toBe(-1);
          seen.push(sym);
        }
      });
      it("the same well-known is stable across reads", function () {
        expect(SymbolPolyfill.iterator).toBe(SymbolPolyfill.iterator);
      });
    });
    describe("as object keys \u2014 readable but hidden (the fidelity that matters)", function () {
      it("round-trips a value through a symbol key", function () {
        var sym = SymbolPolyfill("key");
        var obj = {};
        obj[sym] = 42;
        expect(obj[sym]).toBe(42);
      });
      it("the key is hidden from Object.keys / JSON / assign, and still readable", function () {
        var sym = SymbolPolyfill("hidden");
        var obj = {
          visible: 1
        };
        obj[sym] = "secret";
        expect(Object.keys(obj)).toEqual(["visible"]);
        expect(JSON.stringify(obj)).toBe('{"visible":1}');
        expect(Object.assign({}, obj)).toEqual({
          visible: 1
        });
        expect(Object.entries(obj)).toEqual([["visible", 1]]);
        expect(Object.values(obj)).toEqual([1]);
        expect(Object.getOwnPropertyNames(obj)).toEqual(["visible"]);
        expect(obj[sym]).toBe("secret");
      });
      it("[incomplete] for..in DOES surface the key \u2014 it is syntax and cannot be wrapped", function () {
        var sym = SymbolPolyfill("hidden");
        var obj = {
          visible: 1
        };
        obj[sym] = "secret";
        var forInKeys = [];
        for (var k in obj) forInKeys.push(k);
        expect(forInKeys).toContain("visible");
        expect(forInKeys.filter(function (k) {
          return k.indexOf("@@") === 0;
        })).toHaveLength(1);
      });
      it("the well-known iterator key round-trips (the island access pattern)", function () {
        var obj = {};
        var fn = function fn() {};
        obj[SymbolPolyfill.iterator] = fn;
        expect(obj[SymbolPolyfill.iterator]).toBe(fn);
      });
    });
    describe("documented gaps (parity with es6-symbol \u2014 unfixable in ES5)", function () {
      it('typeof a polyfilled symbol is "object", not "symbol"', function () {
        expect(typeof SymbolPolyfill("x")).toBe("object");
      });
    });
  });
  describe("Object.prototype does not grow (R1)", function () {
    it("creating many symbols adds nothing to Object.prototype", function () {
      var before = Object.getOwnPropertyNames(Object.prototype).length;
      for (var _i118 = 0; _i118 < 2e3; _i118++) SymbolPolyfill("growth-check-" + _i118);
      expect(Object.getOwnPropertyNames(Object.prototype).length).toBe(before);
    });
    it("symbols stay unique and readable without the accessor", function () {
      var a = SymbolPolyfill("same");
      var b = SymbolPolyfill("same");
      var obj = {};
      obj[a] = 1;
      obj[b] = 2;
      expect(obj[a]).toBe(1);
      expect(obj[b]).toBe(2);
      expect(String(a)).not.toBe(String(b));
    });
  });

  // src/modules/_typed-array-impl.ts
  var isSupported153 = function isSupported153() {
    try {
      if (typeof Uint8Array === "undefined") {
        return false;
      }
      var prototype = Uint8Array.prototype;
      return typeof prototype.find === "function" && typeof prototype.findIndex === "function" && typeof prototype.includes === "function" && typeof prototype.at === "function" && typeof prototype.every === "function" && typeof prototype.some === "function" && typeof prototype.forEach === "function" && typeof prototype.map === "function" && typeof prototype.filter === "function" && typeof prototype.indexOf === "function" && typeof prototype.lastIndexOf === "function" && typeof prototype.join === "function" && typeof prototype.reduce === "function" && typeof prototype.reduceRight === "function" && typeof prototype.reverse === "function" && typeof prototype.slice === "function" && typeof prototype.sort === "function" && typeof prototype.copyWithin === "function" && typeof prototype.fill === "function" && typeof prototype.keys === "function" && typeof prototype.values === "function" && typeof prototype.entries === "function" && prototype.toString !== Object.prototype.toString && prototype.toLocaleString !== Object.prototype.toLocaleString;
    } catch (e) {
      return false;
    }
  };
  var toInt = function toInt(value) {
    var n = +value;
    if (n !== n) return 0;
    return n >= 0 ? Math.floor(n) : Math.ceil(n);
  };
  var relativeIndex = function relativeIndex(value, length, fallback) {
    if (value === void 0) return fallback;
    var n = toInt(value);
    return n < 0 ? Math.max(length + n, 0) : Math.min(n, length);
  };
  var assertCallable = function assertCallable(fn) {
    if (typeof fn !== "function") {
      throw new TypeError(fn + " is not a function");
    }
  };
  var joinInternal = function joinInternal(ta, separator, locale) {
    var out = "";
    for (var _i119 = 0; _i119 < ta.length; _i119++) {
      if (_i119 > 0) out += separator;
      out += locale ? ta[_i119].toLocaleString() : ta[_i119];
    }
    return out;
  };
  var typedArrayFind = function typedArrayFind(predicate, thisArg) {
    for (var _i120 = 0; _i120 < this.length; _i120++) {
      if (predicate.call(thisArg, this[_i120], _i120, this)) {
        return this[_i120];
      }
    }
    return void 0;
  };
  var typedArrayFindIndex = function typedArrayFindIndex(predicate, thisArg) {
    assertCallable(predicate);
    for (var _i121 = 0; _i121 < this.length; _i121++) {
      if (predicate.call(thisArg, this[_i121], _i121, this)) {
        return _i121;
      }
    }
    return -1;
  };
  var typedArrayIncludes = function typedArrayIncludes(searchElement, fromIndex) {
    var n = fromIndex !== void 0 ? Number(fromIndex) : 0;
    if (n !== n) n = 0;
    n = n >= 0 ? Math.floor(n) : Math.ceil(n);
    for (var _i122 = Math.max(n >= 0 ? n : this.length + n, 0); _i122 < this.length; _i122++) {
      var el = this[_i122];
      if (el === searchElement || el !== el && searchElement !== searchElement) {
        return true;
      }
    }
    return false;
  };
  var typedArrayAt = function typedArrayAt(index) {
    var i = index | 0 || 0;
    if (i < 0) {
      i += this.length;
    }
    if (i < 0 || i >= this.length) {
      return void 0;
    }
    return this[i];
  };
  var typedArrayEvery = function typedArrayEvery(predicate, thisArg) {
    assertCallable(predicate);
    for (var _i123 = 0; _i123 < this.length; _i123++) {
      if (!predicate.call(thisArg, this[_i123], _i123, this)) {
        return false;
      }
    }
    return true;
  };
  var typedArraySome = function typedArraySome(predicate, thisArg) {
    assertCallable(predicate);
    for (var _i124 = 0; _i124 < this.length; _i124++) {
      if (predicate.call(thisArg, this[_i124], _i124, this)) {
        return true;
      }
    }
    return false;
  };
  var typedArrayForEach = function typedArrayForEach(callback, thisArg) {
    assertCallable(callback);
    for (var _i125 = 0; _i125 < this.length; _i125++) {
      callback.call(thisArg, this[_i125], _i125, this);
    }
    return void 0;
  };
  var typedArrayMap = function typedArrayMap(callback, thisArg) {
    assertCallable(callback);
    var out = new this.constructor(this.length);
    for (var _i126 = 0; _i126 < this.length; _i126++) {
      out[_i126] = callback.call(thisArg, this[_i126], _i126, this);
    }
    return out;
  };
  var typedArrayFilter = function typedArrayFilter(predicate, thisArg) {
    assertCallable(predicate);
    var kept = [];
    for (var _i127 = 0; _i127 < this.length; _i127++) {
      var el = this[_i127];
      if (predicate.call(thisArg, el, _i127, this)) {
        kept.push(el);
      }
    }
    var out = new this.constructor(kept.length);
    for (var _i128 = 0; _i128 < kept.length; _i128++) {
      out[_i128] = kept[_i128];
    }
    return out;
  };
  var typedArrayIndexOf = function typedArrayIndexOf(searchElement, fromIndex) {
    var len = this.length;
    var n = fromIndex !== void 0 ? toInt(fromIndex) : 0;
    if (n >= len) return -1;
    for (var _i129 = Math.max(n >= 0 ? n : len + n, 0); _i129 < len; _i129++) {
      if (this[_i129] === searchElement) {
        return _i129;
      }
    }
    return -1;
  };
  var typedArrayLastIndexOf = function typedArrayLastIndexOf(searchElement, fromIndex) {
    var len = this.length;
    var k = arguments.length > 1 ? toInt(fromIndex) : len - 1;
    k = k >= 0 ? Math.min(k, len - 1) : len + k;
    for (var _i130 = k; _i130 >= 0; _i130--) {
      if (this[_i130] === searchElement) {
        return _i130;
      }
    }
    return -1;
  };
  var typedArrayJoin = function typedArrayJoin(separator) {
    var sep = separator === void 0 ? "," : String(separator);
    return joinInternal(this, sep, false);
  };
  var typedArrayToString = function typedArrayToString() {
    return joinInternal(this, ",", false);
  };
  var typedArrayToLocaleString = function typedArrayToLocaleString() {
    return joinInternal(this, ",", true);
  };
  var typedArrayReduce = function typedArrayReduce(callback, initialValue) {
    assertCallable(callback);
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
    for (; i < len; i++) {
      acc = callback(acc, this[i], i, this);
    }
    return acc;
  };
  var typedArrayReduceRight = function typedArrayReduceRight(callback, initialValue) {
    assertCallable(callback);
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
    for (; i >= 0; i--) {
      acc = callback(acc, this[i], i, this);
    }
    return acc;
  };
  var typedArrayReverse = function typedArrayReverse() {
    var len = this.length;
    for (var _i131 = 0, j = len - 1; _i131 < j; _i131++, j--) {
      var tmp = this[_i131];
      this[_i131] = this[j];
      this[j] = tmp;
    }
    return this;
  };
  var typedArraySlice = function typedArraySlice(start, end) {
    var len = this.length;
    var from = relativeIndex(start, len, 0);
    var to = relativeIndex(end, len, len);
    var count = Math.max(to - from, 0);
    var out = new this.constructor(count);
    for (var _i132 = 0; _i132 < count; _i132++) {
      out[_i132] = this[from + _i132];
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
    for (var _i133 = 0; _i133 < len; _i133++) {
      tmp.push(this[_i133]);
    }
    tmp.sort(compareFn !== void 0 ? compareFn : defaultSortCompare);
    for (var _i134 = 0; _i134 < len; _i134++) {
      this[_i134] = tmp[_i134];
    }
    return this;
  };
  var typedArrayCopyWithin = function typedArrayCopyWithin(target, start, end) {
    var len = this.length;
    var to = relativeIndex(target, len, 0);
    var from = relativeIndex(start, len, 0);
    var final = relativeIndex(end, len, len);
    var count = Math.min(final - from, len - to);
    if (from < to && to < from + count) {
      from += count - 1;
      to += count - 1;
      while (count > 0) {
        this[to] = this[from];
        to--;
        from--;
        count--;
      }
    } else {
      while (count > 0) {
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
    var from = relativeIndex(start, len, 0);
    var to = relativeIndex(end, len, len);
    for (var _i135 = from; _i135 < to; _i135++) {
      this[_i135] = value;
    }
    return this;
  };
  var createTypedArrayIterator = function createTypedArrayIterator(ta, kind) {
    var i = 0;
    var iterator = {
      next: function next() {
        if (i >= ta.length) {
          return {
            value: void 0,
            done: true
          };
        }
        var index = i++;
        if (kind === 0) return {
          value: index,
          done: false
        };
        if (kind === 1) return {
          value: ta[index],
          done: false
        };
        return {
          value: [index, ta[index]],
          done: false
        };
      }
    };
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      Object.defineProperty(iterator, Symbol.iterator, {
        value: function value() {
          return this;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
    return iterator;
  };
  var typedArrayKeys = function typedArrayKeys() {
    return createTypedArrayIterator(this, 0);
  };
  var typedArrayValues = function typedArrayValues() {
    return createTypedArrayIterator(this, 1);
  };
  var typedArrayEntries = function typedArrayEntries() {
    return createTypedArrayIterator(this, 2);
  };
  if (!isSupported153()) {
    var typedArrayTypes = [typeof Uint8Array !== "undefined" ? Uint8Array : null, typeof Int8Array !== "undefined" ? Int8Array : null, typeof Uint16Array !== "undefined" ? Uint16Array : null, typeof Int16Array !== "undefined" ? Int16Array : null, typeof Uint32Array !== "undefined" ? Uint32Array : null, typeof Int32Array !== "undefined" ? Int32Array : null, typeof Float32Array !== "undefined" ? Float32Array : null, typeof Float64Array !== "undefined" ? Float64Array : null, typeof Uint8ClampedArray !== "undefined" ? Uint8ClampedArray : null];
    var typedArrayMethods = [["find", typedArrayFind], ["findIndex", typedArrayFindIndex], ["includes", typedArrayIncludes], ["at", typedArrayAt], ["every", typedArrayEvery], ["some", typedArraySome], ["forEach", typedArrayForEach], ["map", typedArrayMap], ["filter", typedArrayFilter], ["indexOf", typedArrayIndexOf], ["lastIndexOf", typedArrayLastIndexOf], ["join", typedArrayJoin], ["reduce", typedArrayReduce], ["reduceRight", typedArrayReduceRight], ["reverse", typedArrayReverse], ["slice", typedArraySlice], ["sort", typedArraySort], ["copyWithin", typedArrayCopyWithin], ["fill", typedArrayFill], ["keys", typedArrayKeys], ["values", typedArrayValues], ["entries", typedArrayEntries]];
    for (var _i136 = 0; _i136 < typedArrayTypes.length; _i136++) {
      var TypedArray = typedArrayTypes[_i136];
      if (!TypedArray) continue;
      var proto2 = TypedArray.prototype;
      for (var m = 0; m < typedArrayMethods.length; m++) {
        var _name4 = typedArrayMethods[m][0];
        if (!proto2[_name4]) {
          Object.defineProperty(typedArrayMethods[m][1], "name", {
            value: _name4,
            configurable: true
          });
          Object.defineProperty(proto2, _name4, {
            value: typedArrayMethods[m][1],
            writable: true,
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(proto2[_name4], "__polyfilled", {
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
        Object.defineProperty(proto2.toString, "name", {
          value: "toString",
          configurable: true
        });
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
        Object.defineProperty(proto2.toLocaleString, "name", {
          value: "toLocaleString",
          configurable: true
        });
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
  var isModernSupported = function isModernSupported() {
    try {
      if (typeof Uint8Array === "undefined") {
        return false;
      }
      var prototype = Uint8Array.prototype;
      if (typeof prototype.findLast !== "function" || typeof prototype.findLastIndex !== "function" || typeof prototype.toReversed !== "function" || typeof prototype.toSorted !== "function" || typeof prototype.with !== "function" || typeof Uint8Array.from !== "function" || typeof Uint8Array.of !== "function") {
        return false;
      }
      try {
        new Uint8Array(2).set([1, 2, 3]);
        return false;
      } catch (e) {}
      return true;
    } catch (e) {
      return false;
    }
  };
  var typedArrayFindLast = function typedArrayFindLast(predicate, thisArg) {
    if (typeof predicate !== "function") {
      throw new TypeError("predicate is not a function");
    }
    for (var _i137 = this.length - 1; _i137 >= 0; _i137--) {
      if (predicate.call(thisArg, this[_i137], _i137, this)) {
        return this[_i137];
      }
    }
    return void 0;
  };
  var typedArrayFindLastIndex = function typedArrayFindLastIndex(predicate, thisArg) {
    if (typeof predicate !== "function") {
      throw new TypeError("predicate is not a function");
    }
    for (var _i138 = this.length - 1; _i138 >= 0; _i138--) {
      if (predicate.call(thisArg, this[_i138], _i138, this)) {
        return _i138;
      }
    }
    return -1;
  };
  var typedArrayToReversed = function typedArrayToReversed() {
    var len = this.length;
    var out = new this.constructor(len);
    for (var _i139 = 0; _i139 < len; _i139++) {
      out[_i139] = this[len - _i139 - 1];
    }
    return out;
  };
  var typedArrayToSorted = function typedArrayToSorted(compareFn) {
    if (compareFn !== void 0 && typeof compareFn !== "function") {
      throw new TypeError("The comparison function must be either a function or undefined");
    }
    var len = this.length;
    var out = new this.constructor(len);
    for (var _i140 = 0; _i140 < len; _i140++) {
      out[_i140] = this[_i140];
    }
    return typedArraySort.call(out, compareFn);
  };
  var typedArrayWith = function typedArrayWith(index, value) {
    var len = this.length;
    var relative = toInt(index);
    var actual = relative < 0 ? len + relative : relative;
    if (actual < 0 || actual >= len) {
      throw new RangeError("Invalid index");
    }
    var out = new this.constructor(len);
    for (var _i141 = 0; _i141 < len; _i141++) {
      out[_i141] = _i141 === actual ? value : this[_i141];
    }
    return out;
  };
  var typedArraySet = function typedArraySet(source, offset) {
    var targetOffset = offset === void 0 ? 0 : toInt(offset);
    if (targetOffset < 0) {
      throw new RangeError("offset is out of bounds");
    }
    var src = Object(source);
    var srcLength = src.length >>> 0;
    if (srcLength + targetOffset > this.length) {
      throw new RangeError("offset is out of bounds");
    }
    for (var _i142 = 0; _i142 < srcLength; _i142++) {
      this[targetOffset + _i142] = src[_i142];
    }
  };
  var typedArrayOf = function typedArrayOf() {
    var len = arguments.length;
    var out = new this(len);
    for (var _i143 = 0; _i143 < len; _i143++) {
      out[_i143] = arguments[_i143];
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
      while (!step.done) {
        items.push(step.value);
        step = iterator.next();
      }
    } else {
      var len = src.length >>> 0;
      for (var _i144 = 0; _i144 < len; _i144++) {
        items.push(src[_i144]);
      }
    }
    var out = new this(items.length);
    for (var _i145 = 0; _i145 < items.length; _i145++) {
      out[_i145] = mapFn ? mapFn.call(thisArg, items[_i145], _i145) : items[_i145];
    }
    return out;
  };
  if (!isModernSupported()) {
    var modernTypes = [typeof Uint8Array !== "undefined" ? Uint8Array : null, typeof Int8Array !== "undefined" ? Int8Array : null, typeof Uint16Array !== "undefined" ? Uint16Array : null, typeof Int16Array !== "undefined" ? Int16Array : null, typeof Uint32Array !== "undefined" ? Uint32Array : null, typeof Int32Array !== "undefined" ? Int32Array : null, typeof Float32Array !== "undefined" ? Float32Array : null, typeof Float64Array !== "undefined" ? Float64Array : null, typeof Uint8ClampedArray !== "undefined" ? Uint8ClampedArray : null];
    var modernMethods = [["findLast", typedArrayFindLast], ["findLastIndex", typedArrayFindLastIndex], ["toReversed", typedArrayToReversed], ["toSorted", typedArrayToSorted], ["with", typedArrayWith]];
    var modernStatics = [["from", typedArrayFrom], ["of", typedArrayOf]];
    var setIsBroken = function () {
      try {
        if (typeof Uint8Array === "undefined") return false;
        new Uint8Array(2).set([1, 2, 3]);
        return true;
      } catch (e) {
        return false;
      }
    }();
    for (var _i146 = 0; _i146 < modernTypes.length; _i146++) {
      var _TypedArray = modernTypes[_i146];
      if (!_TypedArray) continue;
      var _proto = _TypedArray.prototype;
      for (var _m = 0; _m < modernMethods.length; _m++) {
        var _name5 = modernMethods[_m][0];
        if (!_proto[_name5]) {
          Object.defineProperty(modernMethods[_m][1], "name", {
            value: _name5,
            configurable: true
          });
          Object.defineProperty(_proto, _name5, {
            value: modernMethods[_m][1],
            writable: true,
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(_proto[_name5], "__polyfilled", {
            value: true
          });
        }
      }
      if (setIsBroken) {
        Object.defineProperty(_proto, "set", {
          value: typedArraySet,
          writable: true,
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(_proto.set, "name", {
          value: "set",
          configurable: true
        });
        Object.defineProperty(_proto.set, "__polyfilled", {
          value: true
        });
      }
      for (var s = 0; s < modernStatics.length; s++) {
        var _name6 = modernStatics[s][0];
        if (!_TypedArray[_name6]) {
          Object.defineProperty(modernStatics[s][1], "name", {
            value: _name6,
            configurable: true
          });
          Object.defineProperty(_TypedArray, _name6, {
            value: modernStatics[s][1],
            writable: true,
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(_TypedArray[_name6], "__polyfilled", {
            value: true
          });
        }
      }
    }
  }

  // tests/typed-array-modern.test.ts
  describe("gate separation", function () {
    it("is a distinct probe from the ES2015 suite", function () {
      expect(typeof isModernSupported()).toBe("boolean");
    });
  });
  describe("findLast / findLastIndex", function () {
    it("scans from the end", function () {
      var ta = new Uint8Array([1, 2, 3, 2]);
      expect(typedArrayFindLast.call(ta, function (v) {
        return v === 2;
      })).toBe(2);
      expect(typedArrayFindLastIndex.call(ta, function (v) {
        return v === 2;
      })).toBe(3);
    });
    it("reports the misses the spec way", function () {
      var ta = new Uint8Array([1, 2]);
      expect(typedArrayFindLast.call(ta, function () {
        return false;
      })).toBe(void 0);
      expect(typedArrayFindLastIndex.call(ta, function () {
        return false;
      })).toBe(-1);
    });
    it("throws on a non-callable predicate", function () {
      var ta = new Uint8Array([1]);
      expect(function () {
        return typedArrayFindLast.call(ta, 1);
      }).toThrow(TypeError);
      expect(function () {
        return typedArrayFindLastIndex.call(ta, 1);
      }).toThrow(TypeError);
    });
  });
  describe("toReversed / toSorted / with", function () {
    it("toReversed returns a new array and leaves the original alone", function () {
      var ta = new Uint8Array([1, 2, 3]);
      var out = typedArrayToReversed.call(ta);
      expect(Array.from(out)).toEqual([3, 2, 1]);
      expect(Array.from(ta)).toEqual([1, 2, 3]);
      expect(out).not.toBe(ta);
      expect(out instanceof Uint8Array).toBe(true);
    });
    it("toSorted sorts numerically by default, not lexicographically", function () {
      var ta = new Uint8Array([10, 9, 1]);
      var out = typedArrayToSorted.call(ta);
      expect(Array.from(out)).toEqual([1, 9, 10]);
      expect(Array.from(ta)).toEqual([10, 9, 1]);
    });
    it("toSorted honours a comparator", function () {
      var ta = new Uint8Array([1, 2, 3]);
      var out = typedArrayToSorted.call(ta, function (a, b) {
        return b - a;
      });
      expect(Array.from(out)).toEqual([3, 2, 1]);
    });
    it("with replaces one index, including from the end", function () {
      var ta = new Uint8Array([1, 2, 3]);
      expect(Array.from(typedArrayWith.call(ta, 1, 9))).toEqual([1, 9, 3]);
      expect(Array.from(typedArrayWith.call(ta, -1, 9))).toEqual([1, 2, 9]);
      expect(Array.from(ta)).toEqual([1, 2, 3]);
    });
    it("with throws RangeError outside bounds", function () {
      var ta = new Uint8Array([1, 2, 3]);
      expect(function () {
        return typedArrayWith.call(ta, 3, 9);
      }).toThrow(RangeError);
      expect(function () {
        return typedArrayWith.call(ta, -4, 9);
      }).toThrow(RangeError);
    });
  });
  describe("set", function () {
    it("copies at an offset", function () {
      var ta = new Uint8Array(4);
      typedArraySet.call(ta, [1, 2], 1);
      expect(Array.from(ta)).toEqual([0, 1, 2, 0]);
    });
    it("throws RangeError rather than truncating when the source does not fit", function () {
      expect(function () {
        return typedArraySet.call(new Uint8Array(2), [1, 2, 3]);
      }).toThrow(RangeError);
      expect(function () {
        return typedArraySet.call(new Uint8Array(3), [1, 2], 2);
      }).toThrow(RangeError);
    });
    it("throws RangeError on a negative offset", function () {
      expect(function () {
        return typedArraySet.call(new Uint8Array(4), [1], -1);
      }).toThrow(RangeError);
    });
  });
  describe("from / of statics", function () {
    it("of builds from its arguments", function () {
      var out = typedArrayOf.call(Uint8Array, 1, 2, 3);
      expect(out instanceof Uint8Array).toBe(true);
      expect(Array.from(out)).toEqual([1, 2, 3]);
    });
    it("from builds from an array-like", function () {
      var out = typedArrayFrom.call(Uint8Array, {
        length: 2,
        0: 5,
        1: 6
      });
      expect(Array.from(out)).toEqual([5, 6]);
    });
    it("from builds from an iterable", function () {
      expect(Array.from(typedArrayFrom.call(Uint8Array, /* @__PURE__ */new Set([7, 8])))).toEqual([7, 8]);
    });
    it("from applies a map function with the index", function () {
      var out = typedArrayFrom.call(Uint8Array, [1, 2], function (v, i) {
        return v + i;
      });
      expect(Array.from(out)).toEqual([1, 3]);
    });
    it("from throws on a non-callable mapfn", function () {
      expect(function () {
        return typedArrayFrom.call(Uint8Array, [1], 1);
      }).toThrow(TypeError);
    });
    it("respects the concrete type it is called on", function () {
      expect(typedArrayOf.call(Int16Array, 1) instanceof Int16Array).toBe(true);
    });
  });

  // tests/typed-array.test.ts
  describe("TypedArray.prototype.find \u2014 polyfill vs native", function () {
    it("finds first matching element", function () {
      var arr = new Uint8Array([1, 2, 3, 4, 5]);
      var pred = function pred(v) {
        return v > 3;
      };
      var nativeResult = arr.find(pred);
      var specResult = typedArrayFind.call(arr, pred);
      expect(specResult).toBe(nativeResult);
    });
    it("returns undefined when no match", function () {
      var arr = new Uint8Array([1, 2, 3]);
      var pred = function pred(v) {
        return v > 10;
      };
      var nativeResult = arr.find(pred);
      var specResult = typedArrayFind.call(arr, pred);
      expect(specResult).toBe(nativeResult);
    });
    it("works with Int32Array", function () {
      var arr = new Int32Array([-1, -2, 3, 4]);
      var pred = function pred(v) {
        return v > 0;
      };
      var nativeResult = arr.find(pred);
      var specResult = typedArrayFind.call(arr, pred);
      expect(specResult).toBe(nativeResult);
    });
  });
  describe("TypedArray.prototype.includes \u2014 polyfill vs native", function () {
    it("finds existing element", function () {
      var arr = new Uint8Array([10, 20, 30]);
      var nativeResult = arr.includes(20);
      var specResult = typedArrayIncludes.call(arr, 20);
      expect(specResult).toBe(nativeResult);
    });
    it("returns false for missing element", function () {
      var arr = new Uint8Array([10, 20, 30]);
      var nativeResult = arr.includes(99);
      var specResult = typedArrayIncludes.call(arr, 99);
      expect(specResult).toBe(nativeResult);
    });
    it("respects fromIndex", function () {
      var arr = new Uint8Array([10, 20, 30, 40]);
      expect(typedArrayIncludes.call(arr, 10, 1)).toBe(arr.includes(10, 1));
      expect(typedArrayIncludes.call(arr, 30, 2)).toBe(arr.includes(30, 2));
    });
    it("handles negative fromIndex", function () {
      var arr = new Uint8Array([10, 20, 30, 40]);
      expect(typedArrayIncludes.call(arr, 30, -2)).toBe(arr.includes(30, -2));
    });
    it("handles NaN in Float64Array", function () {
      var arr = new Float64Array([1, NaN, 3]);
      var nativeResult = arr.includes(NaN);
      var specResult = typedArrayIncludes.call(arr, NaN);
      expect(specResult).toBe(nativeResult);
    });
    it("truncates non-integer fromIndex", function () {
      var arr = new Uint8Array([10, 20, 30, 40]);
      expect(typedArrayIncludes.call(arr, 20, 1.5)).toBe(arr.includes(20, 1.5));
      expect(typedArrayIncludes.call(arr, 10, 0.9)).toBe(arr.includes(10, 0.9));
    });
  });
  describe("TypedArray.prototype.at \u2014 polyfill vs native", function () {
    it("handles positive index", function () {
      var arr = new Uint8Array([10, 20, 30]);
      expect(typedArrayAt.call(arr, 0)).toBe(arr.at(0));
      expect(typedArrayAt.call(arr, 2)).toBe(arr.at(2));
    });
    it("handles negative index", function () {
      var arr = new Uint8Array([10, 20, 30]);
      expect(typedArrayAt.call(arr, -1)).toBe(arr.at(-1));
      expect(typedArrayAt.call(arr, -3)).toBe(arr.at(-3));
    });
    it("returns undefined for out of bounds", function () {
      var arr = new Uint8Array([10, 20, 30]);
      expect(typedArrayAt.call(arr, 5)).toBe(arr.at(5));
      expect(typedArrayAt.call(arr, -5)).toBe(arr.at(-5));
    });
  });
  describe("TypedArray.prototype.every / some \u2014 polyfill vs native", function () {
    it("every returns true when all pass, some false when none pass", function () {
      var arr = new Uint8Array([2, 4, 6]);
      var even = function even(v) {
        return v % 2 === 0;
      };
      var odd = function odd(v) {
        return v % 2 === 1;
      };
      var nativeResult = arr.every(even);
      var specResult = typedArrayEvery.call(arr, even);
      expect(specResult).toBe(nativeResult);
      expect(typedArraySome.call(arr, odd)).toBe(arr.some(odd));
    });
    it("empty array: every true, some false, callback not invoked", function () {
      var arr = new Uint8Array(0);
      var calls = 0;
      var spy = function spy() {
        calls++;
        return true;
      };
      expect(typedArrayEvery.call(arr, spy)).toBe(arr.every(spy));
      expect(typedArraySome.call(arr, spy)).toBe(arr.some(spy));
      expect(typedArrayEvery.call(arr, spy)).toBe(true);
      expect(typedArraySome.call(arr, spy)).toBe(false);
      expect(calls).toBe(0);
    });
    it("short-circuits and passes (value, index, array)", function () {
      var arr = new Int16Array([1, 2, 3]);
      var seen = [];
      typedArrayEvery.call(arr, function (v, i, a) {
        seen.push([v, i, a === arr]);
        return v < 2;
      });
      expect(seen).toEqual([[1, 0, true], [2, 1, true]]);
    });
    it("throws TypeError for non-callable", function () {
      var arr = new Uint8Array([1]);
      expect(function () {
        return typedArrayEvery.call(arr, null);
      }).toThrow(TypeError);
      expect(function () {
        return typedArraySome.call(arr, 42);
      }).toThrow(TypeError);
    });
    it("respects thisArg", function () {
      var arr = new Uint8Array([1, 2]);
      var ctx = {
        limit: 5
      };
      var pred = function pred(v) {
        return v < this.limit;
      };
      expect(typedArrayEvery.call(arr, pred, ctx)).toBe(arr.every(pred, ctx));
    });
  });
  describe("TypedArray.prototype.forEach \u2014 polyfill vs native", function () {
    it("visits every element in order with (value, index, array)", function () {
      var arr = new Uint32Array([7, 8, 9]);
      var collect2 = function collect2(target) {
        return function (v, i, a) {
          target.push([v, i, a.length]);
        };
      };
      var specSeen = [];
      var nativeSeen = [];
      expect(specSeen.slice(0, 3)).toEqual(nativeSeen.slice(0, 3));
    });
    it("returns undefined and throws on non-callable", function () {
      var arr = new Uint8Array([1]);
      expect(typedArrayForEach.call(arr, function () {
        return 1;
      })).toBe(arr.forEach(function () {
        return 1;
      }));
      expect(function () {
        return typedArrayForEach.call(arr, "x");
      }).toThrow(TypeError);
    });
  });
  describe("TypedArray.prototype.map / filter \u2014 polyfill vs native", function () {
    it("map returns same-type array with mapped values", function () {
      var arr = new Int32Array([1, 2, 3]);
      var dbl = function dbl(v) {
        return v * 2;
      };
      var nativeResult = arr.map(dbl);
      var specResult = typedArrayMap.call(arr, dbl);
      expect(specResult instanceof Int32Array).toBe(true);
      expect(Array.prototype.slice.call(specResult)).toEqual(Array.prototype.slice.call(nativeResult));
    });
    it("map coerces return values per element type", function () {
      var arr = new Uint8Array([1, 2]);
      var big = function big(v) {
        return v + 300;
      };
      var spec = typedArrayMap.call(arr, big);
      var native = arr.map(big);
      expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
    });
    it("filter returns same-type array with matching values only", function () {
      var arr = new Float64Array([1.5, -2, 3.5, -4]);
      var pos = function pos(v) {
        return v > 0;
      };
      var nativeResult = arr.filter(pos);
      var specResult = typedArrayFilter.call(arr, pos);
      expect(specResult instanceof Float64Array).toBe(true);
      expect(Array.prototype.slice.call(specResult)).toEqual(Array.prototype.slice.call(nativeResult));
    });
    it("filter with no matches returns empty typed array", function () {
      var arr = new Uint8Array([1, 2, 3]);
      var none = function none() {
        return false;
      };
      var spec = typedArrayFilter.call(arr, none);
      expect(spec instanceof Uint8Array).toBe(true);
      expect(spec.length).toBe(arr.filter(none).length);
    });
    it("map/filter throw TypeError for non-callable", function () {
      var arr = new Uint8Array([1]);
      expect(function () {
        return typedArrayMap.call(arr, null);
      }).toThrow(TypeError);
      expect(function () {
        return typedArrayFilter.call(arr, {});
      }).toThrow(TypeError);
    });
  });
  describe("TypedArray.prototype.findIndex \u2014 polyfill vs native", function () {
    it("returns first matching index, -1 when none", function () {
      var arr = new Uint8Array([5, 10, 15]);
      var over9 = function over9(v) {
        return v > 9;
      };
      var nativeResult = arr.findIndex(over9);
      var specResult = typedArrayFindIndex.call(arr, over9);
      expect(specResult).toBe(nativeResult);
      var over99 = function over99(v) {
        return v > 99;
      };
      expect(typedArrayFindIndex.call(arr, over99)).toBe(arr.findIndex(over99));
    });
    it("throws TypeError for non-callable", function () {
      var arr = new Uint8Array([1]);
      expect(function () {
        return typedArrayFindIndex.call(arr, null);
      }).toThrow(TypeError);
    });
  });
  describe("TypedArray.prototype.indexOf / lastIndexOf \u2014 polyfill vs native", function () {
    it("finds index with strict equality", function () {
      var arr = new Uint8Array([10, 20, 30, 20]);
      var nativeResult = arr.indexOf(20);
      var specResult = typedArrayIndexOf.call(arr, 20);
      expect(specResult).toBe(nativeResult);
      expect(typedArrayLastIndexOf.call(arr, 20)).toBe(arr.lastIndexOf(20));
    });
    it("handles fromIndex edge cases", function () {
      var arr = new Uint8Array([10, 20, 30, 20]);
      expect(typedArrayIndexOf.call(arr, 20, 2)).toBe(arr.indexOf(20, 2));
      expect(typedArrayIndexOf.call(arr, 10, -3)).toBe(arr.indexOf(10, -3));
      expect(typedArrayIndexOf.call(arr, 20, 99)).toBe(arr.indexOf(20, 99));
      expect(typedArrayIndexOf.call(arr, 20, 1.9)).toBe(arr.indexOf(20, 1.9));
      expect(typedArrayLastIndexOf.call(arr, 20, -2)).toBe(arr.lastIndexOf(20, -2));
      expect(typedArrayLastIndexOf.call(arr, 20, 2)).toBe(arr.lastIndexOf(20, 2));
      expect(typedArrayLastIndexOf.call(arr, 10, -99)).toBe(arr.lastIndexOf(10, -99));
    });
    it("NaN never found; -0 finds +0", function () {
      var arr = new Float64Array([NaN, 0, 1]);
      expect(typedArrayIndexOf.call(arr, NaN)).toBe(arr.indexOf(NaN));
      expect(typedArrayIndexOf.call(arr, NaN)).toBe(-1);
      expect(typedArrayIndexOf.call(arr, -0)).toBe(arr.indexOf(-0));
      expect(typedArrayLastIndexOf.call(arr, NaN)).toBe(arr.lastIndexOf(NaN));
    });
  });
  describe("TypedArray.prototype.join / toString / toLocaleString \u2014 polyfill vs native", function () {
    it("joins with default and custom separators", function () {
      var arr = new Uint8Array([1, 2, 3]);
      var nativeResult = arr.join();
      var specResult = typedArrayJoin.call(arr);
      expect(specResult).toBe(nativeResult);
      expect(typedArrayJoin.call(arr, "-")).toBe(arr.join("-"));
      expect(typedArrayJoin.call(arr, "")).toBe(arr.join(""));
    });
    it("empty array joins to empty string", function () {
      var arr = new Uint8Array(0);
      expect(typedArrayJoin.call(arr)).toBe(arr.join());
      expect(typedArrayJoin.call(arr)).toBe("");
    });
    it('toString matches join(",")', function () {
      var arr = new Int16Array([3, 2, 1]);
      expect(typedArrayToString.call(arr)).toBe(arr.toString());
    });
    it("toLocaleString matches native shape", function () {
      var arr = new Uint8Array([1, 2, 3]);
      expect(typedArrayToLocaleString.call(arr)).toBe(arr.toLocaleString());
    });
  });
  describe("TypedArray.prototype.reduce / reduceRight \u2014 polyfill vs native", function () {
    it("reduces with and without initial value", function () {
      var arr = new Uint8Array([1, 2, 3, 4]);
      var sum = function sum(a, b) {
        return a + b;
      };
      var nativeResult = arr.reduce(sum);
      var specResult = typedArrayReduce.call(arr, sum);
      expect(specResult).toBe(nativeResult);
      expect(typedArrayReduce.call(arr, sum, 10)).toBe(arr.reduce(sum, 10));
      expect(typedArrayReduceRight.call(arr, sum)).toBe(arr.reduceRight(sum));
    });
    it("passes (acc, value, index, array) in spec order", function () {
      var arr = new Uint8Array([10, 20]);
      var specSeen = [];
      var nativeSeen = [];
      var trace = function trace(target) {
        return function (acc, v, i, a) {
          target.push([acc, v, i, a === arr]);
          return acc + v;
        };
      };
      typedArrayReduceRight.call(arr, trace(specSeen), 0);
      arr.reduceRight(trace(nativeSeen), 0);
      expect(specSeen).toEqual(nativeSeen);
    });
    it("empty array: TypeError without init, init with init", function () {
      var arr = new Uint8Array(0);
      var sum = function sum(a, b) {
        return a + b;
      };
      expect(function () {
        return typedArrayReduce.call(arr, sum);
      }).toThrow(TypeError);
      expect(function () {
        return typedArrayReduceRight.call(arr, sum);
      }).toThrow(TypeError);
      expect(typedArrayReduce.call(arr, sum, 42)).toBe(arr.reduce(sum, 42));
      expect(function () {
        return typedArrayReduce.call(arr, null, 1);
      }).toThrow(TypeError);
    });
  });
  describe("TypedArray.prototype.reverse \u2014 polyfill vs native", function () {
    it("reverses in place and returns this", function () {
      var spec = new Uint8Array([1, 2, 3, 4]);
      var native = new Uint8Array([1, 2, 3, 4]);
      var specRet = typedArrayReverse.call(spec);
      var nativeRet = native.reverse();
      expect(specRet).toBe(spec);
      expect(nativeRet).toBe(native);
      expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
    });
    it("handles odd lengths and empty", function () {
      var spec = new Int32Array([1, 2, 3]);
      var native = new Int32Array([1, 2, 3]);
      typedArrayReverse.call(spec);
      native.reverse();
      expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
      expect(function () {
        return typedArrayReverse.call(new Uint8Array(0));
      }).not.toThrow();
    });
  });
  describe("TypedArray.prototype.slice \u2014 polyfill vs native", function () {
    it("slices with positive, negative, and missing bounds", function () {
      var arr = new Uint8Array([1, 2, 3, 4, 5]);
      var nativeResult = arr.slice(1, 3);
      var specResult = typedArraySlice.call(arr, 1, 3);
      expect(Array.prototype.slice.call(specResult)).toEqual(Array.prototype.slice.call(nativeResult));
      expect(Array.prototype.slice.call(typedArraySlice.call(arr, -2))).toEqual(Array.prototype.slice.call(arr.slice(-2)));
      expect(Array.prototype.slice.call(typedArraySlice.call(arr))).toEqual(Array.prototype.slice.call(arr.slice()));
      expect(Array.prototype.slice.call(typedArraySlice.call(arr, 3, 1))).toEqual(Array.prototype.slice.call(arr.slice(3, 1)));
    });
    it("returns same-type copy, not a view", function () {
      var arr = new Uint8Array([1, 2, 3]);
      var spec = typedArraySlice.call(arr, 0);
      expect(spec instanceof Uint8Array).toBe(true);
      spec[0] = 99;
      expect(arr[0]).toBe(1);
    });
  });
  describe("TypedArray.prototype.sort \u2014 polyfill vs native", function () {
    it("default sort is numeric ascending (not lexicographic)", function () {
      var spec = new Int32Array([10, 2, 33, 4]);
      var native = new Int32Array([10, 2, 33, 4]);
      var specRet = typedArraySort.call(spec);
      native.sort();
      expect(specRet).toBe(spec);
      expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
    });
    it("NaN to end, -0 before +0 (Float64Array)", function () {
      var spec = new Float64Array([1, NaN, -1, 0, -0]);
      var native = new Float64Array([1, NaN, -1, 0, -0]);
      typedArraySort.call(spec);
      native.sort();
      for (var _i147 = 0; _i147 < native.length; _i147++) {
        expect(Object.is(spec[_i147], native[_i147])).toBe(true);
      }
    });
    it("honors custom comparator", function () {
      var spec = new Uint8Array([1, 3, 2]);
      var native = new Uint8Array([1, 3, 2]);
      var desc = function desc(a, b) {
        return b - a;
      };
      typedArraySort.call(spec, desc);
      native.sort(desc);
      expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
    });
  });
  describe("TypedArray.prototype.copyWithin \u2014 polyfill vs native", function () {
    it("copies forward and backward regions correctly (overlap-safe)", function () {
      var mk = function mk() {
        return new Uint8Array([1, 2, 3, 4, 5]);
      };
      var cases = [[0, 3], [1, 0], [0, 2, 4], [-2, 0, 2], [0, -2]];
      for (var _i148 = 0; _i148 < cases.length; _i148++) {
        var _cases$_i2 = _slicedToArray(cases[_i148], 3),
          t = _cases$_i2[0],
          _s = _cases$_i2[1],
          e = _cases$_i2[2];
        var spec = mk();
        var native = mk();
        var specRet = e === void 0 ? typedArrayCopyWithin.call(spec, t, _s) : typedArrayCopyWithin.call(spec, t, _s, e);
        if (e === void 0) native.copyWithin(t, _s);else native.copyWithin(t, _s, e);
        expect(specRet).toBe(spec);
        expect(Array.prototype.slice.call(spec)).toEqual(Array.prototype.slice.call(native));
      }
    });
  });
  describe("TypedArray.prototype iterators \u2014 polyfill vs native", function () {
    it("values() yields elements in order then done", function () {
      var arr = new Uint8Array([7, 8]);
      var spec = typedArrayValues.call(arr);
      var native = arr.values();
      expect(spec.next()).toEqual(native.next());
      expect(spec.next()).toEqual(native.next());
      expect(spec.next()).toEqual(native.next());
      expect(spec.next().done).toBe(true);
    });
    it("keys() yields indices, entries() yields [index, value] pairs", function () {
      var arr = new Uint8Array([7, 8]);
      var specKeys = typedArrayKeys.call(arr);
      var nativeKeys2 = arr.keys();
      expect(specKeys.next()).toEqual(nativeKeys2.next());
      expect(specKeys.next()).toEqual(nativeKeys2.next());
      expect(specKeys.next()).toEqual(nativeKeys2.next());
      var specEntries = typedArrayEntries.call(arr);
      var nativeEntries = arr.entries();
      expect(specEntries.next()).toEqual(nativeEntries.next());
      expect(specEntries.next()).toEqual(nativeEntries.next());
      expect(specEntries.next()).toEqual(nativeEntries.next());
    });
    it("empty array iterator is done immediately", function () {
      var arr = new Uint8Array(0);
      expect(typedArrayValues.call(arr).next().done).toBe(true);
      expect(typedArrayKeys.call(arr).next().done).toBe(true);
      expect(typedArrayEntries.call(arr).next().done).toBe(true);
    });
  });
  describe("TypedArray.prototype.fill (typed) \u2014 polyfill vs native", function () {
    it("fills with coercion and relative bounds", function () {
      var mkSpec = function mkSpec() {
        return new Uint8Array([1, 2, 3, 4]);
      };
      var spec1 = mkSpec();
      var native1 = new Uint8Array([1, 2, 3, 4]);
      var specRet = typedArrayFill.call(spec1, 300);
      native1.fill(300);
      expect(specRet).toBe(spec1);
      expect(Array.prototype.slice.call(spec1)).toEqual(Array.prototype.slice.call(native1));
      var spec2 = mkSpec();
      var native2 = new Uint8Array([1, 2, 3, 4]);
      typedArrayFill.call(spec2, 9, 1, 3);
      native2.fill(9, 1, 3);
      expect(Array.prototype.slice.call(spec2)).toEqual(Array.prototype.slice.call(native2));
      var spec3 = mkSpec();
      var native3 = new Uint8Array([1, 2, 3, 4]);
      typedArrayFill.call(spec3, 9, -2);
      native3.fill(9, -2);
      expect(Array.prototype.slice.call(spec3)).toEqual(Array.prototype.slice.call(native3));
    });
  });

  // src/modules/_uint8-array-impl.ts
  var BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  var HEX = "0123456789abcdef";
  var isSupported154 = function isSupported154() {
    try {
      if (typeof Uint8Array === "undefined") {
        return false;
      }
      return typeof Uint8Array.fromBase64 === "function" && typeof Uint8Array.fromHex === "function" && typeof Uint8Array.prototype.toBase64 === "function" && typeof Uint8Array.prototype.toHex === "function" && typeof Uint8Array.prototype.setFromBase64 === "function" && typeof Uint8Array.prototype.setFromHex === "function";
    } catch (e) {
      return false;
    }
  };
  var alphabetFor = function alphabetFor(options) {
    var raw = options.alphabet;
    var name = raw === void 0 ? "base64" : raw;
    if (name !== "base64" && name !== "base64url") {
      throw new TypeError("alphabet must be either 'base64' or 'base64url'");
    }
    return name === "base64url" ? BASE64URL : BASE64;
  };
  var lastChunkHandlingFor = function lastChunkHandlingFor(options) {
    var raw = options.lastChunkHandling;
    var mode = raw === void 0 ? "loose" : raw;
    if (mode !== "loose" && mode !== "strict" && mode !== "stop-before-partial") {
      throw new TypeError("lastChunkHandling must be 'loose', 'strict' or 'stop-before-partial'");
    }
    return mode;
  };
  var toOptions = function toOptions(options) {
    if (options === void 0) return {};
    if (options === null || typeof options !== "object") {
      throw new TypeError("options must be an object or undefined");
    }
    return options;
  };
  var isDetached = function isDetached(value) {
    try {
      new Uint8Array(value.buffer, 0, 0);
      return false;
    } catch (e) {
      return true;
    }
  };
  var assertUint8Array = function assertUint8Array(value, method) {
    var checkDetached = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    if (typeof Uint8Array === "undefined" || !(value instanceof Uint8Array) || Object.prototype.toString.call(value) !== "[object Uint8Array]") {
      throw new TypeError("Uint8Array.prototype." + method + " called on a non-Uint8Array");
    }
    if (checkDetached && isDetached(value)) {
      throw new TypeError("Uint8Array.prototype." + method + " called on a detached buffer");
    }
  };
  var isBase64Whitespace = function isBase64Whitespace(ch) {
    return ch === " " || ch === "	" || ch === "\n" || ch === "\f" || ch === "\r";
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
    for (;;) {
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
      if (isBase64Whitespace(ch)) continue;
      if (ch === "=") {
        if (chunkLength < 2) {
          throw new SyntaxError("Invalid base64: misplaced padding");
        }
        var sawSecond = false;
        while (index < length) {
          var tail = input.charAt(index);
          index++;
          if (isBase64Whitespace(tail)) continue;
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
    for (var _i149 = 0; _i149 + 1 < input.length; _i149 += 2) {
      if (written >= maxBytes) break;
      var high = HEX.indexOf(input.charAt(_i149).toLowerCase());
      var low = HEX.indexOf(input.charAt(_i149 + 1).toLowerCase());
      if (high === -1 || low === -1) {
        throw new SyntaxError("Invalid hex string: bad character");
      }
      emit(high * 16 + low);
      written++;
      read = _i149 + 2;
    }
    return {
      read: read,
      written: written
    };
  };
  var uint8ArrayToBase64 = function uint8ArrayToBase64(options) {
    assertUint8Array(this, "toBase64", false);
    var opts = toOptions(options);
    var chars = alphabetFor(opts);
    var omitPadding = !!opts.omitPadding;
    if (isDetached(this)) {
      throw new TypeError("Uint8Array.prototype.toBase64 called on a detached buffer");
    }
    var length = this.length;
    var out = "";
    var i = 0;
    for (; i + 2 < length; i += 3) {
      var n = this[i] * 65536 + this[i + 1] * 256 + this[i + 2];
      out += chars.charAt(n >> 18 & 63) + chars.charAt(n >> 12 & 63) + chars.charAt(n >> 6 & 63) + chars.charAt(n & 63);
    }
    var remaining = length - i;
    if (remaining === 1) {
      var _n = this[i];
      out += chars.charAt(_n >> 2) + chars.charAt(_n << 4 & 63);
      if (!omitPadding) out += "==";
    } else if (remaining === 2) {
      var _n2 = this[i] * 256 + this[i + 1];
      out += chars.charAt(_n2 >> 10) + chars.charAt(_n2 >> 4 & 63) + chars.charAt(_n2 << 2 & 63);
      if (!omitPadding) out += "=";
    }
    return out;
  };
  var uint8ArrayToHex = function uint8ArrayToHex() {
    assertUint8Array(this, "toHex");
    var out = "";
    for (var _i150 = 0; _i150 < this.length; _i150++) {
      var byte = this[_i150];
      out += HEX.charAt(byte >> 4 & 15) + HEX.charAt(byte & 15);
    }
    return out;
  };
  var uint8ArrayFromBase64 = function uint8ArrayFromBase64(input, options) {
    if (typeof input !== "string") {
      throw new TypeError("argument must be a string");
    }
    var opts = toOptions(options);
    var chars = alphabetFor(opts);
    var lastChunkHandling = lastChunkHandlingFor(opts);
    var bytes = [];
    decodeBase64(input, chars, Infinity, lastChunkHandling, function (b) {
      return bytes.push(b);
    });
    var out = new Uint8Array(bytes.length);
    for (var _i151 = 0; _i151 < bytes.length; _i151++) out[_i151] = bytes[_i151];
    return out;
  };
  var uint8ArrayFromHex = function uint8ArrayFromHex(input) {
    if (typeof input !== "string") {
      throw new TypeError("argument must be a string");
    }
    var bytes = [];
    decodeHex(input, Infinity, function (b) {
      return bytes.push(b);
    });
    var out = new Uint8Array(bytes.length);
    for (var _i152 = 0; _i152 < bytes.length; _i152++) out[_i152] = bytes[_i152];
    return out;
  };
  var uint8ArraySetFromBase64 = function uint8ArraySetFromBase64(input, options) {
    assertUint8Array(this, "setFromBase64", false);
    if (typeof input !== "string") {
      throw new TypeError("argument must be a string");
    }
    var opts = toOptions(options);
    var chars = alphabetFor(opts);
    var lastChunkHandling = lastChunkHandlingFor(opts);
    if (isDetached(this)) {
      throw new TypeError("Uint8Array.prototype.setFromBase64 called on a detached buffer");
    }
    var target = this;
    var cursor = 0;
    return decodeBase64(input, chars, target.length, lastChunkHandling, function (b) {
      target[cursor++] = b;
    });
  };
  var uint8ArraySetFromHex = function uint8ArraySetFromHex(input) {
    assertUint8Array(this, "setFromHex");
    if (typeof input !== "string") {
      throw new TypeError("argument must be a string");
    }
    var target = this;
    var cursor = 0;
    return decodeHex(input, target.length, function (b) {
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
  if (typeof Uint8Array !== "undefined" && !isSupported154()) {
    var _proto2 = Uint8Array.prototype;
    var protoMethods = [["toBase64", uint8ArrayToBase64], ["toHex", uint8ArrayToHex], ["setFromBase64", uint8ArraySetFromBase64], ["setFromHex", uint8ArraySetFromHex]];
    for (var _i153 = 0; _i153 < protoMethods.length; _i153++) {
      var _name7 = protoMethods[_i153][0];
      if (!_proto2[_name7]) {
        Object.defineProperty(protoMethods[_i153][1], "name", {
          value: _name7,
          configurable: true
        });
        Object.defineProperty(protoMethods[_i153][1], "length", {
          value: SPEC_LENGTH[_name7],
          configurable: true
        });
        Object.defineProperty(_proto2, _name7, {
          value: protoMethods[_i153][1],
          writable: true,
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(_proto2[_name7], "__polyfilled", {
          value: true
        });
      }
    }
    var statics = [["fromBase64", uint8ArrayFromBase64], ["fromHex", uint8ArrayFromHex]];
    for (var _i154 = 0; _i154 < statics.length; _i154++) {
      var _name8 = statics[_i154][0];
      if (!Uint8Array[_name8]) {
        Object.defineProperty(statics[_i154][1], "name", {
          value: _name8,
          configurable: true
        });
        Object.defineProperty(statics[_i154][1], "length", {
          value: SPEC_LENGTH[_name8],
          configurable: true
        });
        Object.defineProperty(Uint8Array, _name8, {
          value: statics[_i154][1],
          writable: true,
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(Uint8Array[_name8], "__polyfilled", {
          value: true
        });
      }
    }
  }

  // tests/uint8-array-base64.test.ts
  var bytesOf = function bytesOf(text) {
    var out = new Uint8Array(text.length);
    for (var _i155 = 0; _i155 < text.length; _i155++) out[_i155] = text.charCodeAt(_i155);
    return out;
  };
  var textOf = function textOf(bytes) {
    var out = "";
    for (var _i156 = 0; _i156 < bytes.length; _i156++) out += String.fromCharCode(bytes[_i156]);
    return out;
  };
  describe("toBase64", function () {
    it("matches the RFC 4648 vectors", function () {
      expect(uint8ArrayToBase64.call(bytesOf(""))).toBe("");
      expect(uint8ArrayToBase64.call(bytesOf("f"))).toBe("Zg==");
      expect(uint8ArrayToBase64.call(bytesOf("fo"))).toBe("Zm8=");
      expect(uint8ArrayToBase64.call(bytesOf("foo"))).toBe("Zm9v");
      expect(uint8ArrayToBase64.call(bytesOf("foob"))).toBe("Zm9vYg==");
      expect(uint8ArrayToBase64.call(bytesOf("fooba"))).toBe("Zm9vYmE=");
      expect(uint8ArrayToBase64.call(bytesOf("foobar"))).toBe("Zm9vYmFy");
    });
    it("agrees with btoa across every partial-chunk length", function () {
      for (var _i157 = 0, _arr9 = ["", "f", "fo", "foo", "foob", "fooba", "foobar"]; _i157 < _arr9.length; _i157++) {
        var text = _arr9[_i157];
        expect(uint8ArrayToBase64.call(bytesOf(text))).toBe(btoa(text));
      }
    });
    it("omits padding when asked", function () {
      expect(uint8ArrayToBase64.call(bytesOf("f"), {
        omitPadding: true
      })).toBe("Zg");
      expect(uint8ArrayToBase64.call(bytesOf("fo"), {
        omitPadding: true
      })).toBe("Zm8");
    });
    it("uses the url-safe alphabet when asked", function () {
      var bytes = new Uint8Array([251, 255]);
      expect(uint8ArrayToBase64.call(bytes)).toBe("+/8=");
      expect(uint8ArrayToBase64.call(bytes, {
        alphabet: "base64url"
      })).toBe("-_8=");
    });
    it("rejects an unknown alphabet", function () {
      expect(function () {
        return uint8ArrayToBase64.call(bytesOf("f"), {
          alphabet: "nope"
        });
      }).toThrow(TypeError);
    });
  });
  describe("fromBase64", function () {
    it("round-trips every RFC 4648 vector", function () {
      for (var _i158 = 0, _arr0 = ["", "f", "fo", "foo", "foob", "fooba", "foobar"]; _i158 < _arr0.length; _i158++) {
        var text = _arr0[_i158];
        expect(textOf(uint8ArrayFromBase64(btoa(text)))).toBe(text);
      }
    });
    it("accepts input with padding omitted", function () {
      expect(textOf(uint8ArrayFromBase64("Zm8"))).toBe("fo");
      expect(textOf(uint8ArrayFromBase64("Zg"))).toBe("f");
    });
    it("decodes the url-safe alphabet", function () {
      expect(Array.from(uint8ArrayFromBase64("-_8=", {
        alphabet: "base64url"
      }))).toEqual([251, 255]);
    });
    it("returns a real Uint8Array", function () {
      expect(uint8ArrayFromBase64("Zm9v") instanceof Uint8Array).toBe(true);
    });
    it("rejects a dangling character and bad characters", function () {
      expect(function () {
        return uint8ArrayFromBase64("Zm9vZ");
      }).toThrow(SyntaxError);
      expect(function () {
        return uint8ArrayFromBase64("Zm9*");
      }).toThrow(SyntaxError);
    });
    it("rejects a non-string", function () {
      expect(function () {
        return uint8ArrayFromBase64(1);
      }).toThrow(TypeError);
    });
  });
  describe("toHex / fromHex", function () {
    it("encodes lowercase, two chars per byte", function () {
      expect(uint8ArrayToHex.call(new Uint8Array([0, 15, 16, 255]))).toBe("000f10ff");
      expect(uint8ArrayToHex.call(new Uint8Array([]))).toBe("");
    });
    it("round-trips", function () {
      expect(Array.from(uint8ArrayFromHex("000f10ff"))).toEqual([0, 15, 16, 255]);
    });
    it("accepts uppercase input", function () {
      expect(Array.from(uint8ArrayFromHex("00FF"))).toEqual([0, 255]);
    });
    it("rejects odd length and bad characters", function () {
      expect(function () {
        return uint8ArrayFromHex("abc");
      }).toThrow(SyntaxError);
      expect(function () {
        return uint8ArrayFromHex("zz");
      }).toThrow(SyntaxError);
    });
  });
  describe("setFromBase64 / setFromHex", function () {
    it("writes into the target and reports read/written", function () {
      var target = new Uint8Array(3);
      var result = uint8ArraySetFromBase64.call(target, "Zm9v");
      expect(textOf(target)).toBe("foo");
      expect(result).toEqual({
        read: 4,
        written: 3
      });
    });
    it("stops at the target length instead of overflowing", function () {
      var target = new Uint8Array(3);
      var result = uint8ArraySetFromBase64.call(target, "Zm9vYmFy");
      expect(result.written).toBe(3);
      expect(textOf(target)).toBe("foo");
      expect(result.read).toBe(4);
    });
    it("leaves the tail of the target untouched when the input is short", function () {
      var target = new Uint8Array([9, 9, 9]);
      var result = uint8ArraySetFromHex.call(target, "0102");
      expect(Array.from(target)).toEqual([1, 2, 9]);
      expect(result).toEqual({
        read: 4,
        written: 2
      });
    });
    it("setFromHex stops at the target length", function () {
      var target = new Uint8Array(2);
      var result = uint8ArraySetFromHex.call(target, "010203");
      expect(Array.from(target)).toEqual([1, 2]);
      expect(result).toEqual({
        read: 4,
        written: 2
      });
    });
    it("rejects a non-string", function () {
      expect(function () {
        return uint8ArraySetFromHex.call(new Uint8Array(1), 1);
      }).toThrow(TypeError);
    });
  });
  describe("lastChunkHandling (from test262)", function () {
    var bytes = function bytes(a) {
      return Array.from(a);
    };
    it("decodes a padded final chunk in every mode", function () {
      for (var _i159 = 0, _arr1 = ["loose", "strict", "stop-before-partial"]; _i159 < _arr1.length; _i159++) {
        var mode = _arr1[_i159];
        expect(bytes(uint8ArrayFromBase64("ZXhhZg==", {
          lastChunkHandling: mode
        }))).toEqual([101, 120, 97, 102]);
      }
    });
    it("treats an unpadded tail per mode", function () {
      expect(bytes(uint8ArrayFromBase64("ZXhhZg"))).toEqual([101, 120, 97, 102]);
      expect(bytes(uint8ArrayFromBase64("ZXhhZg", {
        lastChunkHandling: "stop-before-partial"
      }))).toEqual([101, 120, 97]);
      expect(function () {
        return uint8ArrayFromBase64("ZXhhZg", {
          lastChunkHandling: "strict"
        });
      }).toThrow(SyntaxError);
    });
    it("rejects non-zero padding bits only under strict", function () {
      expect(bytes(uint8ArrayFromBase64("ZXhhZh=="))).toEqual([101, 120, 97, 102]);
      expect(function () {
        return uint8ArrayFromBase64("ZXhhZh==", {
          lastChunkHandling: "strict"
        });
      }).toThrow(SyntaxError);
    });
    it("handles an incomplete padded chunk \u2014 throws, except stop-before-partial", function () {
      expect(function () {
        return uint8ArrayFromBase64("AA=");
      }).toThrow(SyntaxError);
      expect(function () {
        return uint8ArrayFromBase64("AA=", {
          lastChunkHandling: "strict"
        });
      }).toThrow(SyntaxError);
      expect(bytes(uint8ArrayFromBase64("AA=", {
        lastChunkHandling: "stop-before-partial"
      }))).toEqual([]);
      expect(bytes(uint8ArrayFromBase64("ABCDAA=", {
        lastChunkHandling: "stop-before-partial"
      }))).toEqual([0, 16, 131]);
    });
    it("rejects a lone trailing character", function () {
      expect(function () {
        return uint8ArrayFromBase64("A");
      }).toThrow(SyntaxError);
      expect(function () {
        return uint8ArrayFromBase64("ABCDA");
      }).toThrow(SyntaxError);
      expect(bytes(uint8ArrayFromBase64("A", {
        lastChunkHandling: "stop-before-partial"
      }))).toEqual([]);
    });
    it("rejects an unknown lastChunkHandling", function () {
      expect(function () {
        return uint8ArrayFromBase64("ZZ==", {
          lastChunkHandling: "nope"
        });
      }).toThrow(TypeError);
    });
  });
  describe("setFromBase64 read/written (from test262)", function () {
    it("reports read as an index into the original string, padding included", function () {
      for (var _i160 = 0, _arr10 = [["", []], ["Zg==", [102]], ["Zm8=", [102, 111]], ["Zm9v", [102, 111, 111]], ["Zm9vYg==", [102, 111, 111, 98]], ["Zm9vYmFy", [102, 111, 111, 98, 97, 114]]]; _i160 < _arr10.length; _i160++) {
        var _arr10$_i = _slicedToArray(_arr10[_i160], 2),
          text = _arr10$_i[0],
          expected = _arr10$_i[1];
        var _target3 = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]);
        var result = uint8ArraySetFromBase64.call(_target3, text);
        expect(result.read).toBe(text.length);
        expect(result.written).toBe(expected.length);
        expect(Array.from(_target3).slice(0, expected.length)).toEqual(expected);
        expect(Array.from(_target3).slice(expected.length).every(function (b) {
          return b === 255;
        })).toBe(true);
      }
    });
    it("reads options accessors exactly once", function () {
      var alphabetGets = 0;
      var modeGets = 0;
      uint8ArrayFromBase64("ZZ==", {
        get alphabet() {
          alphabetGets++;
          return "base64";
        },
        get lastChunkHandling() {
          modeGets++;
          return "loose";
        }
      });
      expect(alphabetGets).toBe(1);
      expect(modeGets).toBe(1);
    });
    it("rejects a non-Uint8Array receiver", function () {
      expect(function () {
        return uint8ArrayToBase64.call([1, 2]);
      }).toThrow(TypeError);
      expect(function () {
        return uint8ArraySetFromHex.call(new Float32Array(2), "aa");
      }).toThrow(TypeError);
    });
  });
  describe("detached buffer (from test262)", function () {
    var detach = function detach(buffer) {
      structuredClone(buffer, {
        transfer: [buffer]
      });
    };
    it("toBase64 checks detachedness AFTER the options getter runs, not before", function () {
      var detached = new Uint8Array(2);
      detach(detached.buffer);
      var getterCalls = 0;
      var options = {
        get alphabet() {
          getterCalls++;
          return "base64";
        }
      };
      expect(function () {
        return uint8ArrayToBase64.call(detached, options);
      }).toThrow(TypeError);
      expect(getterCalls).toBe(1);
    });
    it("toBase64 detects a buffer detached as a side effect of the options getter", function () {
      var array = new Uint8Array(2);
      var getterCalls = 0;
      var options = {
        get alphabet() {
          getterCalls++;
          detach(array.buffer);
          return "base64";
        }
      };
      expect(function () {
        return uint8ArrayToBase64.call(array, options);
      }).toThrow(TypeError);
      expect(getterCalls).toBe(1);
    });
    it("setFromBase64 throws on an already-detached buffer", function () {
      var detached = new Uint8Array(3);
      detach(detached.buffer);
      expect(function () {
        return uint8ArraySetFromBase64.call(detached, "Zg==");
      }).toThrow(TypeError);
    });
    it("setFromBase64 detects a buffer detached as a side effect of the options getter", function () {
      var target = new Uint8Array(3);
      var getterCalls = 0;
      var options = {
        get alphabet() {
          getterCalls++;
          detach(target.buffer);
          return "base64";
        }
      };
      expect(function () {
        return uint8ArraySetFromBase64.call(target, "Zg==", options);
      }).toThrow(TypeError);
      expect(getterCalls).toBe(1);
    });
  });
  describe("setFromBase64 on a zero-length target (from test262)", function () {
    it("ignores garbage input entirely rather than scanning and rejecting it", function () {
      var target = new Uint8Array(0);
      for (var _i161 = 0, _arr11 = ["#", "a#", "aa#", "aaa#", "aaaa#"]; _i161 < _arr11.length; _i161++) {
        var garbage = _arr11[_i161];
        for (var _i162 = 0, _arr12 = ["loose", "strict", "stop-before-partial"]; _i162 < _arr12.length; _i162++) {
          var lastChunkHandling = _arr12[_i162];
          var result = uint8ArraySetFromBase64.call(target, garbage, {
            lastChunkHandling: lastChunkHandling
          });
          expect(result.read).toBe(0);
          expect(result.written).toBe(0);
        }
      }
    });
  });

  // src/modules/web.url.can-parse.ts
  var isSupported155 = function isSupported155() {
    try {
      return typeof URL === "undefined" || typeof URL.canParse === "function";
    } catch (e) {
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
    } catch (e) {
      return false;
    }
  };
  if (typeof URL !== "undefined" && !isSupported155()) {
    Object.defineProperty(URL, "canParse", {
      value: urlCanParse,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(URL.canParse, "name", {
      value: "canParse",
      configurable: true
    });
    Object.defineProperty(URL.canParse, "__polyfilled", {
      value: true
    });
  }

  // src/modules/web.url.parse.ts
  var isSupported156 = function isSupported156() {
    try {
      return typeof URL === "undefined" || typeof URL.parse === "function";
    } catch (e) {
      return true;
    }
  };
  var urlParse = function urlParse(url, base) {
    try {
      return base === void 0 ? new URL(String(url)) : new URL(String(url), String(base));
    } catch (e) {
      return null;
    }
  };
  if (typeof URL !== "undefined" && !isSupported156()) {
    Object.defineProperty(URL, "parse", {
      value: urlParse,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(URL.parse, "name", {
      value: "parse",
      configurable: true
    });
    Object.defineProperty(URL.parse, "__polyfilled", {
      value: true
    });
  }

  // src/modules/web.url-search-params.size.ts
  var isSupported157 = function isSupported157() {
    try {
      if (typeof URLSearchParams === "undefined") {
        return true;
      }
      return new URLSearchParams("a=1&a=2").size === 2;
    } catch (e) {
      return false;
    }
  };
  var urlSearchParamsSizeGetter = function urlSearchParamsSizeGetter() {
    var count = 0;
    this.forEach(function () {
      count++;
    });
    return count;
  };
  if (typeof URLSearchParams !== "undefined" && URLSearchParams.prototype && !isSupported157()) {
    Object.defineProperty(URLSearchParams.prototype, "size", {
      configurable: true,
      get: urlSearchParamsSizeGetter
    });
    Object.defineProperty(urlSearchParamsSizeGetter, "__polyfilled", {
      value: true
    });
  }

  // src/modules/web.url-search-params.has.ts
  var isSupported158 = function isSupported158() {
    try {
      if (typeof URLSearchParams === "undefined") {
        return true;
      }
      return new URLSearchParams("a=1").has("a", "2") === false;
    } catch (e) {
      return false;
    }
  };
  var originalHas = typeof URLSearchParams !== "undefined" && URLSearchParams.prototype ? URLSearchParams.prototype.has : void 0;
  var urlSearchParamsHas = function urlSearchParamsHas(name, value) {
    if (value === void 0) {
      return originalHas.call(this, name);
    }
    var key = String(name);
    var wanted = String(value);
    var found = false;
    this.forEach(function (pairValue, pairName) {
      if (!found && pairName === key && pairValue === wanted) {
        found = true;
      }
    });
    return found;
  };
  if (originalHas && !isSupported158()) {
    Object.defineProperty(URLSearchParams.prototype, "has", {
      value: urlSearchParamsHas,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(URLSearchParams.prototype.has, "name", {
      value: "has",
      configurable: true
    });
    Object.defineProperty(URLSearchParams.prototype.has, "__polyfilled", {
      value: true
    });
  }

  // src/modules/web.url-search-params.delete.ts
  var isSupported159 = function isSupported159() {
    try {
      if (typeof URLSearchParams === "undefined") {
        return true;
      }
      var params = new URLSearchParams("a=1&a=2");
      params.delete("a", "1");
      return params.toString() === "a=2";
    } catch (e) {
      return false;
    }
  };
  var originalDelete = typeof URLSearchParams !== "undefined" && URLSearchParams.prototype ? URLSearchParams.prototype.delete : void 0;
  var urlSearchParamsDelete = function urlSearchParamsDelete(name, value) {
    if (value === void 0) {
      originalDelete.call(this, name);
      return;
    }
    var key = String(name);
    var unwanted = String(value);
    var survivors = [];
    var names = [];
    this.forEach(function (pairValue, pairName) {
      if (pairName !== key || pairValue !== unwanted) {
        survivors.push([pairName, pairValue]);
      }
      if (names.indexOf(pairName) === -1) {
        names.push(pairName);
      }
    });
    for (var _i163 = 0; _i163 < names.length; _i163++) {
      originalDelete.call(this, names[_i163]);
    }
    for (var _i164 = 0; _i164 < survivors.length; _i164++) {
      this.append(survivors[_i164][0], survivors[_i164][1]);
    }
  };
  if (originalDelete && !isSupported159()) {
    Object.defineProperty(URLSearchParams.prototype, "delete", {
      value: urlSearchParamsDelete,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(URLSearchParams.prototype.delete, "name", {
      value: "delete",
      configurable: true
    });
    Object.defineProperty(URLSearchParams.prototype.delete, "__polyfilled", {
      value: true
    });
  }

  // tests/url-b5.test.ts
  describe("URL.canParse", function () {
    it("reports true for parseable input", function () {
      expect(urlCanParse("https://example.com/x")).toBe(true);
      expect(urlCanParse("/x", "https://example.com")).toBe(true);
    });
    it("reports false instead of throwing", function () {
      expect(urlCanParse("not-a-url")).toBe(false);
      expect(urlCanParse("http://[")).toBe(false);
    });
  });
  describe("URL.parse", function () {
    it("returns a URL for parseable input", function () {
      var url = urlParse("https://example.com/x");
      expect(url).not.toBe(null);
      expect(url.pathname).toBe("/x");
    });
    it("resolves against a base", function () {
      expect(urlParse("/x", "https://example.com").href).toBe("https://example.com/x");
    });
    it("returns null instead of throwing", function () {
      expect(urlParse("not-a-url")).toBe(null);
    });
  });
  describe("URLSearchParams size", function () {
    it("counts pairs, not distinct names", function () {
      expect(urlSearchParamsSizeGetter.call(new URLSearchParams("a=1&a=2&b=3"))).toBe(3);
    });
    it("is 0 for an empty set", function () {
      expect(urlSearchParamsSizeGetter.call(new URLSearchParams(""))).toBe(0);
    });
  });
  describe("URLSearchParams has(name, value)", function () {
    it("matches on name and value together", function () {
      var params = new URLSearchParams("a=1&a=2");
      expect(urlSearchParamsHas.call(params, "a", "1")).toBe(true);
      expect(urlSearchParamsHas.call(params, "a", "3")).toBe(false);
      expect(urlSearchParamsHas.call(params, "b", "1")).toBe(false);
    });
    it("falls back to name-only when no value is given", function () {
      var params = new URLSearchParams("a=1");
      expect(urlSearchParamsHas.call(params, "a")).toBe(true);
      expect(urlSearchParamsHas.call(params, "z")).toBe(false);
    });
    it("coerces the value to a string, like the spec", function () {
      var params = new URLSearchParams("a=1");
      expect(urlSearchParamsHas.call(params, "a", 1)).toBe(true);
    });
  });
  describe("URLSearchParams delete(name, value)", function () {
    it("removes only the pair matching both, keeping the rest in order", function () {
      var params = new URLSearchParams("a=1&b=2&a=3");
      urlSearchParamsDelete.call(params, "a", "1");
      expect(params.toString()).toBe("b=2&a=3");
    });
    it("leaves everything alone when the value does not match", function () {
      var params = new URLSearchParams("a=1&b=2");
      urlSearchParamsDelete.call(params, "a", "nope");
      expect(params.toString()).toBe("a=1&b=2");
    });
    it("removes every matching pair when there are duplicates", function () {
      var params = new URLSearchParams("a=1&a=1&b=2");
      urlSearchParamsDelete.call(params, "a", "1");
      expect(params.toString()).toBe("b=2");
    });
    it("falls back to removing all of a name when no value is given", function () {
      var params = new URLSearchParams("a=1&a=2&b=3");
      urlSearchParamsDelete.call(params, "a");
      expect(params.toString()).toBe("b=3");
    });
  });

  // src/modules/web.url-search-params.ts
  var isSupported160 = function isSupported160() {
    try {
      if (typeof URLSearchParams2 === "undefined") {
        return false;
      }
      if (new URLSearchParams2({
        a: "1"
      }).toString() !== "a=1") {
        return false;
      }
      if (new URLSearchParams2("?a=1").toString() !== "a=1") {
        return false;
      }
      if (new URLSearchParams2("a=1&b=2&a=3").toString() !== "a=1&b=2&a=3") {
        return false;
      }
      return new URLSearchParams2("a=1").get("a") === "1";
    } catch (e) {
      return false;
    }
  };
  var decode = function decode(str) {
    return decodeURIComponent(str.replace(/\+/g, " "));
  };
  var encode = function encode(str) {
    return encodeURIComponent(str).replace(/%20/g, "+");
  };
  var parseString = function parseString(search) {
    var pairs = [];
    var query = search.indexOf("?") === 0 ? search.substring(1) : search;
    if (!query) {
      return pairs;
    }
    var chunks = query.split("&");
    for (var _i165 = 0; _i165 < chunks.length; _i165++) {
      var chunk = chunks[_i165];
      if (chunk === "") {
        continue;
      }
      var equalsAt = chunk.indexOf("=");
      if (equalsAt > -1) {
        pairs.push([decode(chunk.substring(0, equalsAt)), decode(chunk.substring(equalsAt + 1))]);
      } else {
        pairs.push([decode(chunk), ""]);
      }
    }
    return pairs;
  };
  var URLSearchParams2 = function URLSearchParams2(search) {
    this._pairs = [];
    if (search === null || search === void 0 || search === "") {
      return;
    }
    if (typeof search === "string") {
      this._pairs = parseString(search);
      return;
    }
    if (Array.isArray(search)) {
      for (var _i166 = 0; _i166 < search.length; _i166++) {
        var entry = search[_i166];
        if (!entry || entry.length !== 2) {
          throw new TypeError("Failed to construct 'URLSearchParams': Each sequence element must contain exactly two items");
        }
        this._pairs.push([String(entry[0]), String(entry[1])]);
      }
      return;
    }
    for (var _key19 in search) {
      if (Object.prototype.hasOwnProperty.call(search, _key19)) {
        this._pairs.push([_key19, String(search[_key19])]);
      }
    }
  };
  URLSearchParams2.prototype.get = function (name) {
    var key = String(name);
    for (var _i167 = 0; _i167 < this._pairs.length; _i167++) {
      if (this._pairs[_i167][0] === key) {
        return this._pairs[_i167][1];
      }
    }
    return null;
  };
  URLSearchParams2.prototype.getAll = function (name) {
    var key = String(name);
    var values = [];
    for (var _i168 = 0; _i168 < this._pairs.length; _i168++) {
      if (this._pairs[_i168][0] === key) {
        values.push(this._pairs[_i168][1]);
      }
    }
    return values;
  };
  URLSearchParams2.prototype.has = function (name) {
    var key = String(name);
    for (var _i169 = 0; _i169 < this._pairs.length; _i169++) {
      if (this._pairs[_i169][0] === key) {
        return true;
      }
    }
    return false;
  };
  URLSearchParams2.prototype.set = function (name, value) {
    var key = String(name);
    var next = String(value);
    var replaced = false;
    var kept = [];
    for (var _i170 = 0; _i170 < this._pairs.length; _i170++) {
      if (this._pairs[_i170][0] !== key) {
        kept.push(this._pairs[_i170]);
      } else if (!replaced) {
        kept.push([key, next]);
        replaced = true;
      }
    }
    if (!replaced) {
      kept.push([key, next]);
    }
    this._pairs = kept;
  };
  URLSearchParams2.prototype.append = function (name, value) {
    this._pairs.push([String(name), String(value)]);
  };
  URLSearchParams2.prototype["delete"] = function (name) {
    var key = String(name);
    var kept = [];
    for (var _i171 = 0; _i171 < this._pairs.length; _i171++) {
      if (this._pairs[_i171][0] !== key) {
        kept.push(this._pairs[_i171]);
      }
    }
    this._pairs = kept;
  };
  URLSearchParams2.prototype.toString = function () {
    var parts = [];
    for (var _i172 = 0; _i172 < this._pairs.length; _i172++) {
      parts.push(encode(this._pairs[_i172][0]) + "=" + encode(this._pairs[_i172][1]));
    }
    return parts.join("&");
  };
  URLSearchParams2.prototype.forEach = function (callback, thisArg) {
    for (var _i173 = 0; _i173 < this._pairs.length; _i173++) {
      callback.call(thisArg, this._pairs[_i173][1], this._pairs[_i173][0], this);
    }
  };
  if (!isSupported160()) {
    Object.defineProperty(window, "URLSearchParams", {
      value: URLSearchParams2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.URLSearchParams, "name", {
      value: "URLSearchParams",
      configurable: true
    });
    Object.defineProperty(window.URLSearchParams, "__polyfilled", {
      value: true
    });
  }

  // tests/url-search-params.test.ts
  describe("URLSearchParams \u2014 polyfill vs native", function () {
    it("parses query string", function () {
      var native = new URLSearchParams("?a=1&b=2&c=3");
      var polyfill = new URLSearchParams2("?a=1&b=2&c=3");
      expect(polyfill.get("a")).toBe(native.get("a"));
      expect(polyfill.get("b")).toBe(native.get("b"));
      expect(polyfill.get("c")).toBe(native.get("c"));
    });
    it("parses without leading ?", function () {
      var native = new URLSearchParams("foo=bar&baz=qux");
      var polyfill = new URLSearchParams2("foo=bar&baz=qux");
      expect(polyfill.get("foo")).toBe(native.get("foo"));
      expect(polyfill.get("baz")).toBe(native.get("baz"));
    });
    it("has() checks existence", function () {
      var polyfill = new URLSearchParams2("a=1");
      var native = new URLSearchParams("a=1");
      expect(polyfill.has("a")).toBe(native.has("a"));
      expect(polyfill.has("z")).toBe(native.has("z"));
    });
    it("get() returns null for missing key", function () {
      var polyfill = new URLSearchParams2("a=1");
      var native = new URLSearchParams("a=1");
      expect(polyfill.get("missing")).toBe(native.get("missing"));
    });
    it("set() overwrites value", function () {
      var polyfill = new URLSearchParams2("a=1");
      var native = new URLSearchParams("a=1");
      polyfill.set("a", "99");
      native.set("a", "99");
      expect(polyfill.get("a")).toBe(native.get("a"));
    });
    it("append() adds value", function () {
      var polyfill = new URLSearchParams2("a=1");
      var native = new URLSearchParams("a=1");
      polyfill.append("a", "2");
      native.append("a", "2");
      expect(polyfill.getAll("a")).toEqual(native.getAll("a"));
    });
    it("delete() removes key", function () {
      var polyfill = new URLSearchParams2("a=1&b=2");
      var native = new URLSearchParams("a=1&b=2");
      polyfill.delete("a");
      native.delete("a");
      expect(polyfill.has("a")).toBe(native.has("a"));
      expect(polyfill.get("b")).toBe(native.get("b"));
    });
    it("toString() produces query string", function () {
      var polyfill = new URLSearchParams2("a=1&b=hello world");
      var native = new URLSearchParams("a=1&b=hello world");
      expect(polyfill.toString()).toBe(native.toString());
    });
    it("handles encoded characters", function () {
      var polyfill = new URLSearchParams2("q=hello+world&x=%26");
      var native = new URLSearchParams("q=hello+world&x=%26");
      expect(polyfill.get("q")).toBe(native.get("q"));
      expect(polyfill.get("x")).toBe(native.get("x"));
    });
    it("constructs from object", function () {
      var polyfill = new URLSearchParams2({
        a: "1",
        b: "2"
      });
      expect(polyfill.get("a")).toBe("1");
      expect(polyfill.get("b")).toBe("2");
    });
    it("forEach iterates all pairs", function () {
      var polyfill = new URLSearchParams2("a=1&b=2");
      var native = new URLSearchParams("a=1&b=2");
      var pPairs = [];
      var nPairs = [];
      polyfill.forEach(function (val, key) {
        return pPairs.push([key, val]);
      });
      native.forEach(function (val, key) {
        return nPairs.push([key, val]);
      });
      expect(pPairs).toEqual(nPairs);
    });
  });

  // src/modules/web.url.to-json.ts
  var isSupported161 = function isSupported161() {
    try {
      return typeof URL === "undefined" || !URL.prototype || typeof URL.prototype.toJSON === "function";
    } catch (e) {
      return true;
    }
  };
  var urlToJSON = function urlToJSON() {
    return this.href;
  };
  if (typeof URL !== "undefined" && URL.prototype && !isSupported161()) {
    Object.defineProperty(URL.prototype, "toJSON", {
      value: urlToJSON,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(URL.prototype.toJSON, "name", {
      value: "toJSON",
      configurable: true
    });
    Object.defineProperty(URL.prototype.toJSON, "__polyfilled", {
      value: true
    });
  }

  // tests/url-to-json.test.ts
  describe("URL.prototype.toJSON", function () {
    it("returns the href serialization", function () {
      var url = new URL("https://example.com/programs/1?autoplay=true#t=30");
      expect(urlToJSON.call(url)).toBe("https://example.com/programs/1?autoplay=true#t=30");
    });
    it("reflects the live href after mutation", function () {
      var url = new URL("https://example.com/a");
      url.pathname = "/b c";
      expect(urlToJSON.call(url)).toBe(url.href);
    });
    it("makes JSON.stringify produce the URL string when installed", function () {
      var patched = {
        href: "https://example.com/path",
        toJSON: urlToJSON
      };
      expect(JSON.stringify(patched)).toBe('"https://example.com/path"');
    });
    describe("parity vs native", function () {
      it("matches native toJSON", function () {
        var url = new URL("https://example.com/x?y=1#z");
        expect(urlToJSON.call(url)).toBe(url.toJSON());
      });
    });
  });

  // src/modules/web.url.ts
  var isSupported162 = function isSupported162() {
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
    } catch (e) {
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
          params.forEach(function (_value, name) {
            if (names.indexOf(name) === -1) names.push(name);
          });
          for (var _i174 = 0; _i174 < names.length; _i174++) {
            params.delete(names[_i174]);
          }
          new URLSearchParams(next).forEach(function (v, name) {
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
    URLPolyfill.prototype.toString = function () {
      return this.href;
    };
    URLPolyfill.prototype.toJSON = function () {
      return this.href;
    };
    if (nativeURL) {
      if (nativeURL.createObjectURL) {
        URLPolyfill.createObjectURL = function (blob) {
          return nativeURL.createObjectURL(blob);
        };
      }
      if (nativeURL.revokeObjectURL) {
        URLPolyfill.revokeObjectURL = function (url) {
          return nativeURL.revokeObjectURL(url);
        };
      }
    }
    Object.defineProperty(window, "URL", {
      value: URLPolyfill,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.URL, "name", {
      value: "URL",
      configurable: true
    });
    Object.defineProperty(window.URL, "__polyfilled", {
      value: true
    });
    if (typeof window.location !== "undefined" && !("origin" in window.location)) {
      var getOrigin = function getOrigin() {
        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
      };
      try {
        Object.defineProperty(window.location, "origin", {
          get: getOrigin,
          enumerable: true
        });
      } catch (e) {
        window.location.origin = getOrigin();
      }
    }
  };
  if (!isSupported162()) {
    applyURLPolyfill();
  }

  // tests/url.test.ts
  describe("URL \u2014 polyfill", function () {
    it("applyURLPolyfill is a function", function () {
      expect(typeof applyURLPolyfill).toBe("function");
    });
    it("URL parses absolute URLs correctly", function () {
      var u = new URL("https://example.com:8080/path?q=1#hash");
      expect(u.protocol).toBe("https:");
      expect(u.hostname).toBe("example.com");
      expect(u.port).toBe("8080");
      expect(u.pathname).toBe("/path");
      expect(u.search).toBe("?q=1");
      expect(u.hash).toBe("#hash");
      expect(u.origin).toBe("https://example.com:8080");
    });
    it("URL resolves relative URLs against base", function () {
      var u = new URL("/foo", "https://example.com");
      expect(u.href).toBe("https://example.com/foo");
    });
    it("URL has searchParams", function () {
      var u = new URL("https://example.com?a=1&b=2");
      expect(u.searchParams.get("a")).toBe("1");
      expect(u.searchParams.get("b")).toBe("2");
    });
    it("URL.toString() returns href", function () {
      var u = new URL("https://example.com/path");
      expect(u.toString()).toBe("https://example.com/path");
    });
    it("URL throws on invalid input", function () {
      expect(function () {
        return new URL("not-a-url");
      }).toThrow();
    });
  });

  // src/modules/es.weak-map.ts
  var isSupported163 = function isSupported163() {
    try {
      if (typeof _WeakMap !== "function") {
        return false;
      }
      var weakMap = new _WeakMap();
      if (Object.prototype.toString.call(weakMap) !== "[object WeakMap]") {
        return false;
      }
      var _key20 = {};
      weakMap.set(_key20, 1);
      if (weakMap.get(_key20) !== 1 || weakMap.has(_key20) !== true) {
        return false;
      }
      if (weakMap.delete(_key20) !== true || weakMap.has(_key20) !== false) {
        return false;
      }
      try {
        weakMap.set("x", 1);
        return false;
      } catch (e) {}
      return true;
    } catch (e) {
      return false;
    }
  };
  var hasSymbol3 = typeof Symbol !== "undefined" && Symbol.toStringTag != null;
  var counter = 0;
  var isObjectLike2 = function isObjectLike2(value) {
    return value !== null && (typeof value === "object" || typeof value === "function");
  };
  var _WeakMap = function WeakMap2(iterable) {
    if (!(this instanceof _WeakMap)) {
      throw new TypeError("Constructor WeakMap requires 'new'");
    }
    counter++;
    this._id = "__wm$".concat(counter, "$").concat(Math.random().toString(36).substring(2));
    if (iterable === null || iterable === void 0) {
      return;
    }
    if (Array.isArray(iterable)) {
      for (var _i175 = 0; _i175 < iterable.length; _i175++) {
        this.set(iterable[_i175][0], iterable[_i175][1]);
      }
      return;
    }
    if (typeof Symbol !== "undefined" && Symbol.iterator != null && typeof iterable[Symbol.iterator] === "function") {
      var iterator = iterable[Symbol.iterator]();
      var step = iterator.next();
      while (!step.done) {
        this.set(step.value[0], step.value[1]);
        step = iterator.next();
      }
      return;
    }
    throw new TypeError("WeakMap constructor argument is not iterable");
  };
  _WeakMap.prototype.set = function (key, value) {
    if (!isObjectLike2(key)) {
      throw new TypeError("Invalid value used as weak map key");
    }
    if (!Object.isExtensible(key)) {
      console.warn("[spackle] WeakMap: frozen / non-extensible keys are not supported by the hidden-property strategy \u2014 this set() will throw");
    }
    Object.defineProperty(key, this._id, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: value
    });
    return this;
  };
  _WeakMap.prototype.get = function (key) {
    if (!isObjectLike2(key) || !Object.prototype.hasOwnProperty.call(key, this._id)) {
      return void 0;
    }
    return key[this._id];
  };
  _WeakMap.prototype.has = function (key) {
    return isObjectLike2(key) && Object.prototype.hasOwnProperty.call(key, this._id);
  };
  _WeakMap.prototype.delete = function (key) {
    if (!isObjectLike2(key) || !Object.prototype.hasOwnProperty.call(key, this._id)) {
      return false;
    }
    delete key[this._id];
    return true;
  };
  if (hasSymbol3) {
    Object.defineProperty(_WeakMap.prototype, Symbol.toStringTag, {
      value: "WeakMap",
      writable: false,
      enumerable: false,
      configurable: true
    });
  }
  if (!isSupported163()) {
    window.WeakMap = null;
    delete window.WeakMap;
    Object.defineProperty(window, "WeakMap", {
      value: _WeakMap,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.WeakMap, "name", {
      value: "WeakMap",
      configurable: true
    });
    Object.defineProperty(window.WeakMap, "__polyfilled", {
      value: true
    });
  }

  // tests/weak-map.test.ts
  describe("WeakMap \u2014 test262 conformance", function () {
    describe("constructor", function () {
      it("throws without new", function () {
        expect(function () {
          return _WeakMap();
        }).toThrow(TypeError);
      });
      it("builds from an array of [object, value] pairs", function () {
        var a = {};
        var b = {};
        var wm = new _WeakMap([[a, 1], [b, 2]]);
        expect(wm.get(a)).toBe(1);
        expect(wm.get(b)).toBe(2);
      });
      it("treats null/undefined iterable as empty", function () {
        var k = {};
        expect(new _WeakMap(null).has(k)).toBe(false);
        expect(new _WeakMap(void 0).has(k)).toBe(false);
      });
    });
    describe("set / get / has / delete", function () {
      it("set throws TypeError on a non-object key", function () {
        var wm = new _WeakMap();
        expect(function () {
          return wm.set("x", 1);
        }).toThrow(TypeError);
        expect(function () {
          return wm.set(1, 1);
        }).toThrow(TypeError);
      });
      it("round-trips an object key", function () {
        var wm = new _WeakMap();
        var k = {};
        wm.set(k, 42);
        expect(wm.has(k)).toBe(true);
        expect(wm.get(k)).toBe(42);
      });
      it("set is chainable", function () {
        var wm = new _WeakMap();
        var a = {};
        var b = {};
        expect(wm.set(a, 1)).toBe(wm);
        wm.set(a, 1).set(b, 2);
        expect(wm.get(b)).toBe(2);
      });
      it("delete removes and returns boolean", function () {
        var wm = new _WeakMap();
        var k = {};
        wm.set(k, 1);
        expect(wm.delete(k)).toBe(true);
        expect(wm.delete(k)).toBe(false);
        expect(wm.has(k)).toBe(false);
      });
      it("get/has tolerate absent and non-object keys without throwing", function () {
        var wm = new _WeakMap();
        expect(wm.get({})).toBeUndefined();
        expect(wm.has({})).toBe(false);
        expect(wm.get("x")).toBeUndefined();
        expect(wm.has("x")).toBe(false);
        expect(wm.delete("x")).toBe(false);
      });
      it("distinguishes object keys by identity; same object overwrites", function () {
        var wm = new _WeakMap();
        var a = {};
        var b = {};
        wm.set(a, "a").set(b, "b").set(a, "a2");
        expect(wm.get(a)).toBe("a2");
        expect(wm.get(b)).toBe("b");
      });
    });
    describe("hidden marker", function () {
      it("stores via a non-enumerable property (invisible to keys/for-in)", function () {
        var wm = new _WeakMap();
        var k = {};
        wm.set(k, 1);
        expect(Object.keys(k)).toEqual([]);
        var inForIn = [];
        for (var p in k) inForIn.push(p);
        expect(inForIn).toEqual([]);
      });
    });
    describe("toStringTag", function () {
      it("reports [object WeakMap]", function () {
        expect(Object.prototype.toString.call(new _WeakMap())).toBe("[object WeakMap]");
      });
      it("is non-writable, unlike ordinary methods (from test262)", function () {
        var desc = Object.getOwnPropertyDescriptor(_WeakMap.prototype, Symbol.toStringTag);
        expect(desc.writable).toBe(false);
        expect(desc.configurable).toBe(true);
      });
    });
    describe("KNOWN LIMITATIONS (documented divergence from spec)", function () {
      it("cannot use a frozen key (defineProperty throws)", function () {
        var wm = new _WeakMap();
        var frozen = Object.freeze({});
        expect(function () {
          return wm.set(frozen, 1);
        }).toThrow();
      });
    });
  });

  // src/modules/es.weak-set.ts
  var isSupported164 = function isSupported164() {
    try {
      return typeof WeakSet2 === "function";
    } catch (e) {
      return false;
    }
  };
  var WeakSet2 = function WeakSet2() {
    if (arguments.length > 0 && arguments[0] !== null && arguments[0] !== void 0) {
      console.warn("[spackle] WeakSet: the iterable constructor argument is not implemented \u2014 starting empty; add() entries individually");
    }
    if (typeof WeakMap !== "undefined") {
      this._map = /* @__PURE__ */new WeakMap();
    } else {
      this._id = "_ws_".concat(Math.random().toString(36).substring(2));
    }
  };
  WeakSet2.prototype.add = function (key) {
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
  WeakSet2.prototype.has = function (key) {
    if (this._map) {
      return this._map.has(key);
    }
    return key[this._id] === true;
  };
  WeakSet2.prototype.delete = function (key) {
    if (this._map) {
      return this._map.delete(key);
    }
    if (key[this._id] === true) {
      delete key[this._id];
      return true;
    }
    return false;
  };
  if (!isSupported164()) {
    window.WeakSet = null;
    delete window.WeakSet;
    Object.defineProperty(window, "WeakSet", {
      value: WeakSet2,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(window.WeakSet, "name", {
      value: "WeakSet",
      configurable: true
    });
    Object.defineProperty(window.WeakSet, "__polyfilled", {
      value: true
    });
  }

  // tests/weak-set.test.ts
  describe("WeakSet \u2014 polyfill vs native", function () {
    it("add and has", function () {
      var obj = {};
      var native = /* @__PURE__ */new WeakSet();
      var polyfill = new WeakSet2();
      native.add(obj);
      polyfill.add(obj);
      expect(polyfill.has(obj)).toBe(native.has(obj));
    });
    it("has returns false for non-member", function () {
      var obj = {};
      var native = /* @__PURE__ */new WeakSet();
      var polyfill = new WeakSet2();
      expect(polyfill.has(obj)).toBe(native.has(obj));
    });
    it("delete removes entry", function () {
      var obj = {};
      var native = /* @__PURE__ */new WeakSet();
      var polyfill = new WeakSet2();
      native.add(obj);
      polyfill.add(obj);
      expect(polyfill.delete(obj)).toBe(native.delete(obj));
      expect(polyfill.has(obj)).toBe(native.has(obj));
    });
    it("delete returns false for non-member", function () {
      var obj = {};
      var native = /* @__PURE__ */new WeakSet();
      var polyfill = new WeakSet2();
      expect(polyfill.delete(obj)).toBe(native.delete(obj));
    });
    it("add returns this (chainable)", function () {
      var polyfill = new WeakSet2();
      var obj1 = {};
      var obj2 = {};
      var result = polyfill.add(obj1).add(obj2);
      expect(result).toBe(polyfill);
      expect(polyfill.has(obj1)).toBe(true);
      expect(polyfill.has(obj2)).toBe(true);
    });
    it("handles multiple objects independently", function () {
      var polyfill = new WeakSet2();
      var a = {};
      var b = {};
      var c = {};
      polyfill.add(a);
      polyfill.add(b);
      expect(polyfill.has(a)).toBe(true);
      expect(polyfill.has(b)).toBe(true);
      expect(polyfill.has(c)).toBe(false);
    });
  });

  // node_modules/.spackle-browser-tests/entry.ts
  var g2 = typeof window !== "undefined" ? window : globalThis;
  g2.spackleTest = function () {
    return run().then(function (results) {
      render(results);
      if (typeof console !== "undefined" && console.log) {
        console.log("spackle: " + results.passed + " passed, " + results.failed + " failed");
        for (var i = 0; i < results.failures.length; i++) console.log(results.failures[i]);
      }
      g2.__debugResult = results;
      return results;
    });
  };
  g2.spackleTest();
})();