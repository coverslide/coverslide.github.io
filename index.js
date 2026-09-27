(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/performance-now/lib/performance-now.js
  var require_performance_now = __commonJS({
    "node_modules/performance-now/lib/performance-now.js"(exports, module) {
      (function() {
        var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;
        if (typeof performance !== "undefined" && performance !== null && performance.now) {
          module.exports = function() {
            return performance.now();
          };
        } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
          module.exports = function() {
            return (getNanoSeconds() - nodeLoadTime) / 1e6;
          };
          hrtime = process.hrtime;
          getNanoSeconds = function() {
            var hr;
            hr = hrtime();
            return hr[0] * 1e9 + hr[1];
          };
          moduleLoadTime = getNanoSeconds();
          upTime = process.uptime() * 1e9;
          nodeLoadTime = moduleLoadTime - upTime;
        } else if (Date.now) {
          module.exports = function() {
            return Date.now() - loadTime;
          };
          loadTime = Date.now();
        } else {
          module.exports = function() {
            return (/* @__PURE__ */ new Date()).getTime() - loadTime;
          };
          loadTime = (/* @__PURE__ */ new Date()).getTime();
        }
      }).call(exports);
    }
  });

  // node_modules/raf/index.js
  var require_raf = __commonJS({
    "node_modules/raf/index.js"(exports, module) {
      var now = require_performance_now();
      var root = typeof window === "undefined" ? global : window;
      var vendors = ["moz", "webkit"];
      var suffix = "AnimationFrame";
      var raf2 = root["request" + suffix];
      var caf = root["cancel" + suffix] || root["cancelRequest" + suffix];
      for (i = 0; !raf2 && i < vendors.length; i++) {
        raf2 = root[vendors[i] + "Request" + suffix];
        caf = root[vendors[i] + "Cancel" + suffix] || root[vendors[i] + "CancelRequest" + suffix];
      }
      var i;
      if (!raf2 || !caf) {
        last = 0, id = 0, queue = [], frameDuration = 1e3 / 60;
        raf2 = function(callback) {
          if (queue.length === 0) {
            var _now = now(), next = Math.max(0, frameDuration - (_now - last));
            last = next + _now;
            setTimeout(function() {
              var cp = queue.slice(0);
              queue.length = 0;
              for (var i2 = 0; i2 < cp.length; i2++) {
                if (!cp[i2].cancelled) {
                  try {
                    cp[i2].callback(last);
                  } catch (e) {
                    setTimeout(function() {
                      throw e;
                    }, 0);
                  }
                }
              }
            }, Math.round(next));
          }
          queue.push({
            handle: ++id,
            callback,
            cancelled: false
          });
          return id;
        };
        caf = function(handle) {
          for (var i2 = 0; i2 < queue.length; i2++) {
            if (queue[i2].handle === handle) {
              queue[i2].cancelled = true;
            }
          }
        };
      }
      var last;
      var id;
      var queue;
      var frameDuration;
      module.exports = function(fn) {
        return raf2.call(root, fn);
      };
      module.exports.cancel = function() {
        caf.apply(root, arguments);
      };
      module.exports.polyfill = function(object) {
        if (!object) {
          object = root;
        }
        object.requestAnimationFrame = raf2;
        object.cancelAnimationFrame = caf;
      };
    }
  });

  // src/App.js
  var import_raf = __toESM(require_raf());
  var ALPHA_VALUE = 0.2;
  var SPRING_TIGHTNESS = 0.1;
  var MAX_SHIFT = 4;
  var SHIFT_DURATION = 2e3;
  var HISTORY_LENGTH = 5e3;
  var App = class {
    constructor(window2) {
      // just a silly canvas draw, want to do something more fun with this
      __publicField(this, "lastTicks", 0);
      __publicField(this, "history", []);
      __publicField(this, "point", { x: 0, y: 0, dx: 0, dy: 0, ddx: 0, ddy: 0 });
      __publicField(this, "cursor", { x: 0, y: 0 });
      __publicField(this, "hue", this.randomHue());
      __publicField(this, "hueShift", this.randomShift());
      __publicField(this, "shiftLife", SHIFT_DURATION);
      __publicField(this, "render", (ticks) => {
        const { canvas, hue, hueShift, cursor, point } = this;
        const delta = ticks - this.lastTicks;
        this.lastTicks = ticks;
        (0, import_raf.default)(this.render);
        var distx = cursor.x - point.x - point.dx;
        var disty = cursor.y - point.y - point.dy;
        point.ddx = distx * SPRING_TIGHTNESS;
        point.ddy = disty * SPRING_TIGHTNESS;
        point.dx += point.ddx;
        point.dy += point.ddy;
        point.x += point.dx;
        point.y += point.dy;
        if (Math.abs(point.dx) < 1 && Math.abs(point.dy) < 1) {
          return;
        }
        this.drawLine(hue, point);
        this.history.push({ hue, point: __spreadValues({}, point) });
        this.history = this.history.slice(-HISTORY_LENGTH);
        this.hue = this.shiftHue(hue, hueShift);
        this.shiftLife -= delta;
        if (this.shiftLife <= 0) {
          this.shiftLife = SHIFT_DURATION;
          this.hueShift = this.randomShift();
        }
      });
      this.window = window2;
      this.bg = document.getElementById("bg");
      this.aspect = window2.innerHeight / window2.innerWidth;
      const canvas = this.canvas = document.createElement("canvas");
      canvas.width = window2.innerWidth;
      canvas.height = window2.innerHeight;
      this.bg.appendChild(this.canvas);
      this.lastTicks = 0;
      const { cursor, point } = this;
      cursor.x = canvas.width / 2;
      cursor.y = canvas.height / 2;
      point.x = cursor.x;
      point.y = cursor.y;
      this.bindListeners();
    }
    bindListeners() {
      const { canvas, cursor, window: window2 } = this;
      window2.addEventListener("mousemove", (event) => {
        cursor.x = event.pageX;
        cursor.y = event.pageY;
      });
      window2.addEventListener("touchmove", (event) => {
        const touch = event.touches[0];
        cursor.x = touch.pageX;
        cursor.y = touch.pageY;
      });
      window2.addEventListener("resize", () => {
        canvas.width = window2.innerWidth;
        canvas.height = window2.innerHeight;
        this.drawHistory();
      });
    }
    start() {
      this.render(0);
    }
    drawHistory() {
      this.history.forEach(({ hue, point }) => {
        this.drawLine(hue, point);
      });
    }
    drawLine(hue, point) {
      const { canvas } = this;
      const context = canvas.getContext("2d");
      context.strokeStyle = `hsla(${hue}, 100%, 50%, ${ALPHA_VALUE})`;
      context.lineWidth = Math.max(1, Math.abs(point.dx + point.dy) / 2);
      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(point.x - point.dx, point.y - point.dy);
      context.stroke();
    }
    randomHue() {
      return Math.round(Math.random() * 360);
    }
    randomShift() {
      return Math.random() * (MAX_SHIFT * 2) - MAX_SHIFT;
    }
    shiftHue(hue, shift) {
      return hue + shift;
    }
  };

  // src/index.js
  var app = new App(window);
  app.start();
})();
