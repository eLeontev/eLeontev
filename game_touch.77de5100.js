// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/model/game.model.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var direction;

(function (direction) {
  direction[direction["clockwise"] = -1] = "clockwise";
  direction[direction["\u0441\u0421lockwise"] = 1] = "\u0441\u0421lockwise";
})(direction = exports.direction || (exports.direction = {}));
},{}],"src/helpers/radiant-transformer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.getRadians = function (degrees) {
  return Math.PI / 180 * degrees;
};
},{}],"src/game/constants.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startAnglePosition = 179;
exports.minimumEnemyOffset = 20;
exports.maxEnemiesCount = 10;
exports.maxDelayToAddEnemyInTicks = 360;
exports.maxDelayInactionsInTicks = 180;
exports.changeDirectionTriesMessage = 'direction counter:';
exports.countOfEnemiesMessage = 'count of enemies:';
exports.loaderWidth = 200;
exports.loaderHeight = 15;
exports.verticalLoaderOffset = 7;
exports.loaderMinColor = '00ff00';
exports.loaderMaxColor = 'ff0000';
exports.countOfChangeDirectionTriesMessageCoordintate = {
  x: 10,
  y: 85
};
exports.countOfEnemiesMessagePositionCoordinate = {
  x: 10,
  y: 40
};
},{}],"src/game/renderer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var constants_1 = require("./constants");

var CanvasRenderer =
/** @class */
function () {
  function CanvasRenderer(canvasCtx, radius, innerRadius, canvasSize, getRadians, canvasMiddlePoint) {
    this.canvasCtx = canvasCtx;
    this.radius = radius;
    this.innerRadius = innerRadius;
    this.canvasSize = canvasSize;
    this.defaultStartAngle = 0;
    this.defaultLineWidth = 1;
    this.pointerLineWidth = 4;
    this.defaultLineJoin = 'round';
    this.defaultStrokeStyleColor = 'black';
    this.cleanUpBackgroundColor = 'white';
    this.enemyStrokeStyleColor = 'red';
    this.pointerStyleColor = 'blue';
    this.defaultTextColor = 'black';
    this.defaultEndAngle = getRadians(360);
    var x = canvasMiddlePoint.x,
        y = canvasMiddlePoint.y;
    this.middleXCoordinate = x;
    this.middleYCoordinate = y;
    this.initCanvas();
  }

  CanvasRenderer.prototype.drowStaticGameField = function () {
    var _this = this;

    [this.innerRadius, this.radius].forEach(function (radius) {
      return _this.drowStrokedCircle(radius);
    });
  };

  CanvasRenderer.prototype.drowEnemy = function (radius, x, y, strokeStyleColor) {
    if (strokeStyleColor === void 0) {
      strokeStyleColor = this.enemyStrokeStyleColor;
    }

    this.drowStrokedCircle(radius, x, y, strokeStyleColor);
  };

  CanvasRenderer.prototype.canvasCleanUp = function () {
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle = this.cleanUpBackgroundColor;
    this.canvasCtx.fillRect(0, 0, this.canvasSize, this.canvasSize);
  };

  CanvasRenderer.prototype.drowEnemies = function (enemies) {
    var _this = this;

    enemies.forEach(function (_a) {
      var xPosition = _a.xPosition,
          yPosition = _a.yPosition,
          enemyRadius = _a.enemyRadius;
      return _this.drowEnemy(enemyRadius, xPosition, yPosition);
    });
  };

  CanvasRenderer.prototype.drowPointer = function (xPosition, yPosition) {
    this.canvasCtx.beginPath();
    this.setPathView(this.pointerStyleColor, this.pointerLineWidth, this.defaultLineJoin);
    this.canvasCtx.moveTo(this.middleXCoordinate, this.middleYCoordinate);
    this.canvasCtx.lineTo(xPosition, yPosition);
    this.canvasCtx.stroke();
  };

  CanvasRenderer.prototype.drowText = function (messageWithCounter, _a, specificTextColor) {
    var x = _a.x,
        y = _a.y;
    this.canvasCtx.font = '25px Arial';
    this.canvasCtx.fillStyle = specificTextColor || this.defaultTextColor;
    this.canvasCtx.fillText(messageWithCounter, x, y);
  };

  CanvasRenderer.prototype.drowLoader = function (_a, _b) {
    var x = _a.x,
        y = _a.y;
    var width = _b.width,
        color = _b.color;
    var yWithOffset = y + constants_1.verticalLoaderOffset;
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle = color;
    this.canvasCtx.fillRect(x, yWithOffset, width, constants_1.loaderHeight);
    this.canvasCtx.beginPath();
    this.canvasCtx.strokeStyle = this.defaultStrokeStyleColor;
    this.canvasCtx.strokeRect(x, yWithOffset, constants_1.loaderWidth, constants_1.loaderHeight);
  };

  CanvasRenderer.prototype.drowStrokedCircle = function (radius, x, y, strokeStyleColor, lineWidth, startAngle, endAngle, lineJoin) {
    if (x === void 0) {
      x = this.middleXCoordinate;
    }

    if (y === void 0) {
      y = this.middleYCoordinate;
    }

    if (strokeStyleColor === void 0) {
      strokeStyleColor = this.defaultStrokeStyleColor;
    }

    if (lineWidth === void 0) {
      lineWidth = this.defaultLineWidth;
    }

    if (startAngle === void 0) {
      startAngle = this.defaultStartAngle;
    }

    if (endAngle === void 0) {
      endAngle = this.defaultEndAngle;
    }

    if (lineJoin === void 0) {
      lineJoin = this.defaultLineJoin;
    }

    this.canvasCtx.beginPath();
    this.setPathView(strokeStyleColor, lineWidth, lineJoin);
    this.canvasCtx.arc(x, y, radius, startAngle, endAngle);
    this.canvasCtx.stroke();
  };

  CanvasRenderer.prototype.initCanvas = function () {
    this.canvasCtx.canvas.width = this.canvasSize;
    this.canvasCtx.canvas.height = this.canvasSize;
    this.canvasCtx.canvas.style.backgroundColor = this.cleanUpBackgroundColor;
  };

  CanvasRenderer.prototype.setPathView = function (strokeStyleColor, lineWidth, lineJoin) {
    this.canvasCtx.strokeStyle = strokeStyleColor;
    this.canvasCtx.lineWidth = lineWidth;
    this.canvasCtx.lineJoin = lineJoin;
  };

  return CanvasRenderer;
}();

exports.CanvasRenderer = CanvasRenderer;
},{"./constants":"src/game/constants.ts"}],"src/game/state.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var constants_1 = require("./constants");

exports.state = {
  enemies: [],
  tickCounter: 0,
  countOfTicksWithoutEnemyDestory: 0,
  changeDirectionCounter: 5,
  angle: constants_1.startAnglePosition
};
},{"./constants":"src/game/constants.ts"}],"node_modules/lodash.uniqueid/index.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;

},{}],"src/helpers/randomizer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.randomIntegerInRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};
},{}],"src/game/calculation/enemy.calculation.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lodash_uniqueid_1 = __importDefault(require("lodash.uniqueid"));

var constants_1 = require("../constants");

var radiant_transformer_1 = require("../../helpers/radiant-transformer");

var randomizer_1 = require("../../helpers/randomizer");

exports.createEnemy = function (angle, innerRadius, radius, middlePointCoordinate) {
  var minEnemyPosition = Math.abs(angle % 360) + constants_1.minimumEnemyOffset;
  var maxEnemyPosition = minEnemyPosition + 360 - constants_1.minimumEnemyOffset;
  var middlePointAngle = randomizer_1.randomIntegerInRange(constants_1.minimumEnemyOffset, maxEnemyPosition) % 360;
  var distanceFromMiddlePoint = randomizer_1.randomIntegerInRange(innerRadius, radius * 0.9);
  var enemyRadius = randomizer_1.randomIntegerInRange(innerRadius * 0.1, innerRadius * 0.4);
  var x = middlePointCoordinate.x,
      y = middlePointCoordinate.y;
  var angleRad = radiant_transformer_1.getRadians(middlePointAngle);
  var xPosition = distanceFromMiddlePoint * Math.sin(angleRad) + x;
  var yPosition = distanceFromMiddlePoint * Math.cos(angleRad) + y;
  var angleOffset = Math.atan(enemyRadius / distanceFromMiddlePoint) * 180 / Math.PI;
  var min = middlePointAngle - angleOffset;
  var max = middlePointAngle + angleOffset;
  return {
    xPosition: xPosition,
    yPosition: yPosition,
    enemyRadius: enemyRadius,
    middlePointAngle: middlePointAngle,
    enemyAngleRange: [min, max],
    enemyId: lodash_uniqueid_1.default('enemy-id=')
  };
};
},{"lodash.uniqueid":"node_modules/lodash.uniqueid/index.js","../constants":"src/game/constants.ts","../../helpers/radiant-transformer":"src/helpers/radiant-transformer.ts","../../helpers/randomizer":"src/helpers/randomizer.ts"}],"src/game/calculation/rest-range.calculation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var constants_1 = require("../constants");

var transformHexToDec = function transformHexToDec(hex) {
  return parseInt(hex, 16);
};

var transformDecToHex = function transformDecToHex(dec) {
  return dec.toString(16);
};

var colorHexFormat = function colorHexFormat(hex) {
  return "#" + hex.padStart(6, '0');
};

var getPositionInPercents = function getPositionInPercents(position, maxPosition) {
  return position / maxPosition;
};

var getValueBasedOnPercentsInRange = function getValueBasedOnPercentsInRange(percentage, min, max) {
  return percentage * (max - min) + min;
};

var _a = [transformHexToDec(constants_1.loaderMinColor), transformHexToDec(constants_1.loaderMaxColor)],
    min = _a[0],
    max = _a[1];

exports.getLoaderDataBasedOnCurrentLoaderCounterPosition = function (_a) {
  var position = _a.position,
      maxPosition = _a.maxPosition;
  var percentagesPosition = getPositionInPercents(position, maxPosition);
  var decColorPosition = getValueBasedOnPercentsInRange(percentagesPosition, min, max);
  return {
    width: percentagesPosition * constants_1.loaderWidth,
    color: colorHexFormat(transformDecToHex(decColorPosition))
  };
};
},{"../constants":"src/game/constants.ts"}],"src/game/index.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var game_model_1 = require("../model/game.model");

var radiant_transformer_1 = require("../helpers/radiant-transformer");

var renderer_1 = require("./renderer");

var state_1 = require("./state");

var enemy_calculation_1 = require("./calculation/enemy.calculation");

var constants_1 = require("./constants");

var rest_range_calculation_1 = require("./calculation/rest-range.calculation");

var clockwise = game_model_1.direction.clockwise,
    сСlockwise = game_model_1.direction.сСlockwise;
var domRectList = document.body.getClientRects();
var _a = domRectList[0],
    width = _a.width,
    height = _a.height;
var canvasSize = width > height ? height : width;
var canvasMiddlePosition = canvasSize / 2;
var radius = canvasMiddlePosition * 0.9;
var innerRadius = radius / 3;
var canvasMiddlePoint = {
  x: canvasMiddlePosition,
  y: canvasMiddlePosition
};
var x = canvasMiddlePoint.x,
    y = canvasMiddlePoint.y;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasRenderer = new renderer_1.CanvasRenderer(ctx, radius, innerRadius, canvasSize, radiant_transformer_1.getRadians, canvasMiddlePoint);
var pointerDirection = clockwise;

var setDocumentListener = function setDocumentListener(listener) {
  document.addEventListener('click', listener);
  document.addEventListener('keydown', listener);
};

var drowPointer = function drowPointer(angle) {
  var angleRad = radiant_transformer_1.getRadians(angle);
  var xPosition = radius * Math.sin(angleRad) + x;
  var yPosition = radius * Math.cos(angleRad) + y;
  canvasRenderer.drowPointer(xPosition, yPosition);
};

var getUpdatedAngle = function getUpdatedAngle(updatedAngle, direction) {
  return direction === clockwise ? updatedAngle <= 0 ? 360 : updatedAngle : updatedAngle >= 360 ? 0 : updatedAngle;
};

var performPointerItaration = function performPointerItaration() {
  var angle = state_1.state.angle;
  drowPointer(state_1.state.angle);
  state_1.state.angle = getUpdatedAngle(angle + pointerDirection, pointerDirection);
};

var hasNoEnemies = function hasNoEnemies(_a) {
  var enemies = _a.enemies;
  return !enemies.length;
};

var hasLessEnemiesToMax = function hasLessEnemiesToMax(_a) {
  var enemies = _a.enemies;
  return enemies.length < constants_1.maxEnemiesCount;
};

var isDirectionCounterEmpty = function isDirectionCounterEmpty(_a) {
  var changeDirectionCounter = _a.changeDirectionCounter;
  return !changeDirectionCounter;
};

var addNewEnemy = function addNewEnemy(enemy) {
  return state_1.state.enemies = __spreadArrays(state_1.state.enemies, [enemy]);
};

var addNewEnemyWithPassedValidator = function addNewEnemyWithPassedValidator(shouldAddNewEnemyValidator, state, angle) {
  if (shouldAddNewEnemyValidator(state)) {
    addNewEnemy(enemy_calculation_1.createEnemy(angle, innerRadius, radius, canvasMiddlePoint));
  }
};

var updateEnemies = function updateEnemies(angle) {
  addNewEnemyWithPassedValidator(hasNoEnemies, state_1.state, angle);
  canvasRenderer.drowEnemies(state_1.state.enemies);
};

var addEnemy = function addEnemy(angle) {
  addNewEnemyWithPassedValidator(hasLessEnemiesToMax, state_1.state, angle);
};

var drowCounterMessageWithLoader = function drowCounterMessageWithLoader(staticPrefixMessage, dynamicValue, useSpecificColor, textPositionCoordintate, loaderPosition) {
  var messageWithCounter = staticPrefixMessage + " " + dynamicValue;
  var specificTextColor = useSpecificColor ? 'red' : null;
  canvasRenderer.drowText(messageWithCounter, textPositionCoordintate, specificTextColor);
  canvasRenderer.drowLoader(textPositionCoordintate, rest_range_calculation_1.getLoaderDataBasedOnCurrentLoaderCounterPosition(loaderPosition));
};

var drowTextMessagesWithLoader = function drowTextMessagesWithLoader(state) {
  drowCounterMessageWithLoader(constants_1.changeDirectionTriesMessage, state.changeDirectionCounter, isDirectionCounterEmpty(state), constants_1.countOfChangeDirectionTriesMessageCoordintate, {
    position: state.countOfTicksWithoutEnemyDestory,
    maxPosition: constants_1.maxDelayInactionsInTicks
  });
  drowCounterMessageWithLoader(constants_1.countOfEnemiesMessage, state.enemies.length, !hasLessEnemiesToMax(state), constants_1.countOfEnemiesMessagePositionCoordinate, {
    position: state.tickCounter,
    maxPosition: constants_1.maxDelayToAddEnemyInTicks
  });
};

var validateEnemyCounts = function validateEnemyCounts(angle) {
  state_1.state.tickCounter = state_1.state.tickCounter + 1;

  if (state_1.state.tickCounter >= constants_1.maxDelayToAddEnemyInTicks) {
    state_1.state.tickCounter = 0;
    addEnemy(angle);
  }
};

var validateTicksWithoutDestroy = function validateTicksWithoutDestroy() {
  state_1.state.countOfTicksWithoutEnemyDestory = state_1.state.countOfTicksWithoutEnemyDestory + 1;
};

var cleanUpTicksWithoutEnemyDestroy = function cleanUpTicksWithoutEnemyDestroy(isEnemyInRange) {
  if (isEnemyInRange) {
    state_1.state.countOfTicksWithoutEnemyDestory = 0;
  }
};

var updateChangeDirectionCounter = function updateChangeDirectionCounter(diff) {
  state_1.state.changeDirectionCounter = state_1.state.changeDirectionCounter + diff;

  if (state_1.state.changeDirectionCounter < 0) {
    state_1.state.changeDirectionCounter = 0;
  }
};

var reduceChangeDirectionCounterOnLongPending = function reduceChangeDirectionCounterOnLongPending() {
  if (state_1.state.countOfTicksWithoutEnemyDestory > constants_1.maxDelayInactionsInTicks) {
    cleanUpTicksWithoutEnemyDestroy(true);
    updateChangeDirectionCounter(-1);
  }
};

var startGame = function startGame() {
  setInterval(function () {
    canvasRenderer.canvasCleanUp();
    canvasRenderer.drowStaticGameField();
    performPointerItaration();
    validateEnemyCounts(state_1.state.angle);
    validateTicksWithoutDestroy();
    reduceChangeDirectionCounterOnLongPending();
    updateEnemies(state_1.state.angle);
    drowTextMessagesWithLoader(state_1.state);
  }, 10);
};

var validateChangeDirectionCounter = function validateChangeDirectionCounter(isEnemyInRange) {
  var changeDirectionCounter = state_1.state.changeDirectionCounter;
  var shouldNotReduceCounter = !isEnemyInRange && changeDirectionCounter === 0;

  if (shouldNotReduceCounter) {
    return;
  }

  var diff = isEnemyInRange ? 1 : -1;
  updateChangeDirectionCounter(diff);
};

var getUpdatedEnemyStatus = function getUpdatedEnemyStatus() {
  if (!state_1.state.enemies.length) {
    return false;
  }

  var angle = state_1.state.angle;
  var enemiesInRange = state_1.state.enemies.filter(function (_a) {
    var _b = _a.enemyAngleRange,
        min = _b[0],
        max = _b[1];
    var validatedAngle = angle === 360 ? 0 : angle;
    var isEnemyInRange = validatedAngle > min && validatedAngle < max;
    return isEnemyInRange;
  }).map(function (_a) {
    var enemyId = _a.enemyId;
    return enemyId;
  });
  var isEnemyInRange = false;

  if (enemiesInRange.length) {
    state_1.state.enemies = state_1.state.enemies.filter(function (enemy) {
      return !enemiesInRange.some(function (enemyId) {
        return enemyId === enemy.enemyId;
      });
    });
    isEnemyInRange = true;
  }

  return isEnemyInRange;
};

var changePointerDirection = function changePointerDirection() {
  var isEnemyInRange = getUpdatedEnemyStatus();
  var changeDirectionCounter = state_1.state.changeDirectionCounter;

  if (changeDirectionCounter || isEnemyInRange) {
    pointerDirection = pointerDirection === clockwise ? сСlockwise : clockwise;
  }

  cleanUpTicksWithoutEnemyDestroy(isEnemyInRange);
  validateChangeDirectionCounter(isEnemyInRange);
};

var isGameStarted = false;

var addListenerToStartGame = function addListenerToStartGame(listener) {
  var button = document.getElementById('button');

  if (!button) {
    return;
  }

  button.addEventListener('keydown', function (event) {
    return event.preventDefault();
  });
  button.addEventListener('click', function () {
    if (!isGameStarted) {
      isGameStarted = true;
      listener();
      document.body.focus();
    }
  });
};

setDocumentListener(changePointerDirection);
addListenerToStartGame(startGame);
},{"../model/game.model":"src/model/game.model.ts","../helpers/radiant-transformer":"src/helpers/radiant-transformer.ts","./renderer":"src/game/renderer.ts","./state":"src/game/state.ts","./calculation/enemy.calculation":"src/game/calculation/enemy.calculation.ts","./constants":"src/game/constants.ts","./calculation/rest-range.calculation":"src/game/calculation/rest-range.calculation.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./src/game/");
},{"./src/game/":"src/game/index.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61422" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/game_touch.77de5100.js.map