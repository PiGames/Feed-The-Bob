(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TIME_TO_REACH_MEDIUM_LEVEL = exports.TIME_TO_REACH_MEDIUM_LEVEL = 5;
var TIME_TO_REACH_HARD_LEVEL = exports.TIME_TO_REACH_HARD_LEVEL = 10;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MIN_FOOD_VELOCITY = exports.MIN_FOOD_VELOCITY = 120;
var MAX_FOOD_VELOCITY = exports.MAX_FOOD_VELOCITY = 200;

var FOOD_SPAWN_INTERVAL = exports.FOOD_SPAWN_INTERVAL = Phaser.Timer.SECOND;
var FOOD_SPAWN_BOUNDS_WIDTH = exports.FOOD_SPAWN_BOUNDS_WIDTH = 500;
var FOOD_SPAWN_BOUNDS_HEIGHT = exports.FOOD_SPAWN_BOUNDS_HEIGHT = 300;

var FOOD_WIDTH = exports.FOOD_WIDTH = 100;
var FOOD_HEIGHT = exports.FOOD_HEIGHT = 75;

var FOOD_DATA = exports.FOOD_DATA = [{ 'key': 'apple', 'nutritionFacts': { 'carbohydrates': 12, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 }, { 'key': 'banana', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 1, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 }, { 'key': 'chicken', 'nutritionFacts': { 'carbohydrates': 2, 'fats': 10, 'proteins': 18 }, 'complexityLevel': 2, 'probability': 1 }, { 'key': 'hamburger', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 13, 'proteins': 16 }, 'complexityLevel': 3, 'probability': 1 }];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GOOD_AMOUNT_OF_CARBOHYDRATES = exports.GOOD_AMOUNT_OF_CARBOHYDRATES = 270;
var GOOD_AMOUNT_OF_FATS = exports.GOOD_AMOUNT_OF_FATS = 70;
var GOOD_AMOUNT_OF_PROTEINS = exports.GOOD_AMOUNT_OF_PROTEINS = 50;

var AMOUNT_REDUCED_INTERVAL = exports.AMOUNT_REDUCED_INTERVAL = Phaser.Timer.SECOND * 1;
var AMOUNT_REDUCED_PERCENT = exports.AMOUNT_REDUCED_PERCENT = 0.03;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NUTRITION_BAR_WIDTH = exports.NUTRITION_BAR_WIDTH = 680;
var NUTRITION_BAR_HEIGHT = exports.NUTRITION_BAR_HEIGHT = 56;
var NUTRITION_BAR_OFFSET = exports.NUTRITION_BAR_OFFSET = 24;
var NUTRITION_BAR_TEXT_OFFSET_X = exports.NUTRITION_BAR_TEXT_OFFSET_X = 24;
var NUTRITION_BAR_TEXT_OFFSET_Y = exports.NUTRITION_BAR_TEXT_OFFSET_Y = 4;
var NUTRITION_BAR_X_FROM_LEFT = exports.NUTRITION_BAR_X_FROM_LEFT = 24;
var NUTRITION_BAR_Y_FROM_BOTTOM = exports.NUTRITION_BAR_Y_FROM_BOTTOM = 24;
var NUTRITION_BAR_TEXT_SHADOW_SIZE = exports.NUTRITION_BAR_TEXT_SHADOW_SIZE = 10;
var NUTRITION_BAR_TEXT_SHADOW_COLOR = exports.NUTRITION_BAR_TEXT_SHADOW_COLOR = 'rgba(0, 0, 0, 0.5)';

var NUTRITION_BAR_INFO_FONT = exports.NUTRITION_BAR_INFO_FONT = { font: '32px Gloria Hallelujah', fill: '#fff' };
var NUTRITION_NUTRITION_ADDED_FONT = exports.NUTRITION_NUTRITION_ADDED_FONT = { font: '40px Gloria Hallelujah', fill: '#fff', stroke: '#000', strokeThickness: 6 };

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SUPER_THIN_BREAKPOINT = exports.SUPER_THIN_BREAKPOINT = 0.17;
var THIN_BREAKPOINT = exports.THIN_BREAKPOINT = 0.34;
var FAT_BREAKPOINT = exports.FAT_BREAKPOINT = 0.66;
var SUPER_FAT_BREAKPOINT = exports.SUPER_FAT_BREAKPOINT = 0.83;

},{}],6:[function(require,module,exports){
'use strict';

var _states = require('./states');

var _states2 = _interopRequireDefault(_states);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var game = new Phaser.Game(1920, 1280, Phaser.AUTO);
var states = {
  'Boot': _states2.default.Boot,
  'Preloader': _states2.default.Preloader,
  'MainMenu': _states2.default.MainMenu,
  'Wiki': _states2.default.Wiki,
  'Story': _states2.default.Story,
  'Game': _states2.default.Game
};
for (var stateName in states) {
  game.state.add(stateName, states[stateName]);
}
game.state.start('Boot');

},{"./states":18}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _NutritionConstants = require('../constants/NutritionConstants');

var _WeightBreakpoints = require('../constants/WeightBreakpoints');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Bob = function (_Phaser$Sprite) {
  _inherits(Bob, _Phaser$Sprite);

  function Bob(game, x, y, imageKey, NutritionManager, handleDeath) {
    _classCallCheck(this, Bob);

    var _this = _possibleConstructorReturn(this, (Bob.__proto__ || Object.getPrototypeOf(Bob)).call(this, game, x, y, imageKey));

    _this.handleDeath = handleDeath;

    _this.NutritionManager = NutritionManager;

    _this.anchor.setTo(0.5, 1);
    _this.scale.setTo(0.5);

    _this.game.world.add(_this);
    return _this;
  }

  _createClass(Bob, [{
    key: 'hadleWeightChange',
    value: function hadleWeightChange() {
      var nutrition = this.NutritionManager.nutrition;

      var nutritionStatuses = [this.getStatus(nutrition.carbohydrates, _NutritionConstants.GOOD_AMOUNT_OF_CARBOHYDRATES), this.getStatus(nutrition.fats, _NutritionConstants.GOOD_AMOUNT_OF_FATS), this.getStatus(nutrition.proteins, _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS)];

      var isDeadFromThinness = false;
      var isSuperThin = false;
      var isThin = false;
      var isFat = false;
      var isSuperFat = false;
      var isDeadFromFat = false;

      nutritionStatuses.forEach(function (v) {
        switch (v) {
          case -3:
            isDeadFromThinness = true;
            isSuperThin = true;
            break;
          case -2:
            isSuperThin = true;
            break;
          case -1:
            isThin = true;
            break;
          case 1:
            isFat = true;
            break;
          case 2:
            isSuperFat = true;
            break;
          case 3:
            isDeadFromFat = true;
            isSuperFat = true;
            break;
        }
      });

      if (isSuperThin || isThin || isFat || isSuperFat) {
        if (isThin) {
          this.frame = 1;
        }

        if (isSuperThin) {
          this.frame = 0;
        }

        if (isFat) {
          this.frame = 3;
        }

        if (isSuperFat) {
          this.frame = 4;
        }
      } else {
        this.frame = 2;
      }

      if (isDeadFromFat) {
        this.handleDeath('You have died from fat');
      }

      if (isDeadFromThinness) {
        this.handleDeath('You have died from thinness');
      }
    }
  }, {
    key: 'getStatus',
    value: function getStatus(value, goodAmount) {
      var doubleOfGoodAmount = goodAmount * 2;

      if (value >= doubleOfGoodAmount) {
        // Bob died from fatness
        return 3;
      }

      if (value <= 0) {
        // Bob died from thinness
        return -3;
      }

      if (value <= doubleOfGoodAmount * _WeightBreakpoints.SUPER_THIN_BREAKPOINT) {
        // Bob is super thin
        return -2;
      }

      if (value <= doubleOfGoodAmount * _WeightBreakpoints.THIN_BREAKPOINT) {
        // Bob is thin
        return -1;
      }

      if (value >= doubleOfGoodAmount * _WeightBreakpoints.SUPER_FAT_BREAKPOINT) {
        // Bob is super fat
        return 2;
      }

      if (value >= doubleOfGoodAmount * _WeightBreakpoints.FAT_BREAKPOINT) {
        // Bob is fat
        return 1;
      }

      // Bob is normal
      return 0;
    }
  }]);

  return Bob;
}(Phaser.Sprite);

exports.default = Bob;

},{"../constants/NutritionConstants":3,"../constants/WeightBreakpoints":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _FoodConstants = require('../constants/FoodConstants');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Food = function (_Phaser$Sprite) {
  _inherits(Food, _Phaser$Sprite);

  function Food(game, x, y, key, data, NutritionManager, onDestroy) {
    _classCallCheck(this, Food);

    var _this = _possibleConstructorReturn(this, (Food.__proto__ || Object.getPrototypeOf(Food)).call(this, game, x, y, key));

    _this.onDestroy = onDestroy;
    _this.data = data;
    _this.NutritionManager = NutritionManager;
    _this.scale.setTo(0.75);
    _this.game.physics.enable(_this);

    var directionX = x > _this.game.world.centerX ? -1 : 1;
    var directionY = y > _this.game.world.centerY ? -1 : 1;

    _this.velocityX = directionX * (Math.floor(Math.random() * (_FoodConstants.MAX_FOOD_VELOCITY - _FoodConstants.MIN_FOOD_VELOCITY)) + _FoodConstants.MIN_FOOD_VELOCITY);
    _this.body.velocity.x = _this.velocityX;

    _this.velocityY = directionY * (Math.floor(Math.random() * (_FoodConstants.MAX_FOOD_VELOCITY - _FoodConstants.MIN_FOOD_VELOCITY)) + _FoodConstants.MIN_FOOD_VELOCITY);
    _this.body.velocity.y = _this.velocityY;

    _this.inputEnabled = true;
    _this.events.onInputDown.add(_this.handleClick, _this);

    _this.events.onInputOver.add(function () {
      game.canvas.style.cursor = 'pointer';
    });

    _this.events.onInputOut.add(function () {
      game.canvas.style.cursor = 'default';
    });
    _this.hasEnteredScreen = false;
    _this.checkWorldBounds = true;
    _this.events.onEnterBounds.add(function () {
      _this.hasEnteredScreen = true;
    });
    _this.events.onOutOfBounds.add(function () {
      if (_this.hasEnteredScreen) {
        _this.onDestroy(_this);
      }
    });

    _this.game.world.add(_this);
    return _this;
  }

  _createClass(Food, [{
    key: 'handleClick',
    value: function handleClick() {
      var _this2 = this;

      var tween = this.game.add.tween(this);
      tween.to({ x: this.game.world.centerX - 40, y: this.game.world.height - 680 }, 500, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(function () {
        _this2.NutritionManager.updateStats(_this2.data);
        _this2.onDestroy(_this2);
      });
    }
  }]);

  return Food;
}(Phaser.Sprite);

exports.default = Food;

},{"../constants/FoodConstants":2}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _Food = require('./Food');

var _Food2 = _interopRequireDefault(_Food);

var _MathUtils = require('../utils/MathUtils.js');

var _FoodConstants = require('../constants/FoodConstants');

var _DifficultyLevelIntervals = require('../constants/DifficultyLevelIntervals.js');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var FoodSpawner = function (_Phaser$Group) {
  _inherits(FoodSpawner, _Phaser$Group);

  function FoodSpawner(game, NutritionManager) {
    var enableDifficultyLevelGrowth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, FoodSpawner);

    var _this = _possibleConstructorReturn(this, (FoodSpawner.__proto__ || Object.getPrototypeOf(FoodSpawner)).call(this, game));

    _this.NutritionManager = NutritionManager;
    _this.enableDifficultyLevelGrowth = enableDifficultyLevelGrowth;

    _this.timer = _this.game.time.events.loop(_FoodConstants.FOOD_SPAWN_INTERVAL, _this.spawnFood, _this);

    if (_this.enableDifficultyLevelGrowth) {
      _this.sortedFoodData = _FoodConstants.FOOD_DATA.sort(function (food1, food2) {
        return food1.complexityLevel > food2.complexityLevel;
      });
      _this.easyLevelLastIndex = _FoodConstants.FOOD_DATA.length - 1 - _this.sortedFoodData.reverse().findIndex(function (food) {
        return food.complexityLevel === 1;
      });
      _this.mediumLevelLastIndex = _FoodConstants.FOOD_DATA.length - 1 - _this.sortedFoodData.findIndex(function (food) {
        return food.complexityLevel === 2;
      });
      _this.hardLevelLastIndex = _FoodConstants.FOOD_DATA.length - 1;

      _this.sortedFoodData.reverse();

      _this.currentDifficultyLevelLastIndex = _this.easyLevelLastIndex;
    }
    return _this;
  }

  _createClass(FoodSpawner, [{
    key: 'create',
    value: function create() {
      this.spawnFood();
    }
  }, {
    key: 'spawnFood',
    value: function spawnFood() {
      var sides = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
      var spawnSide = sides[Math.floor(Math.random() * 4)];
      var x = void 0;
      var y = void 0;
      if (spawnSide === 'NORTH' || spawnSide === 'SOUTH') {
        x = _FoodConstants.FOOD_SPAWN_BOUNDS_WIDTH / 2 + Math.random() * _FoodConstants.FOOD_SPAWN_BOUNDS_WIDTH;
        y = spawnSide === 'NORTH' ? -_FoodConstants.FOOD_HEIGHT : this.game.world.height + _FoodConstants.FOOD_HEIGHT;
      } else {
        x = spawnSide === 'WEST' ? -_FoodConstants.FOOD_WIDTH : this.game.world.width + _FoodConstants.FOOD_WIDTH;
        y = _FoodConstants.FOOD_SPAWN_BOUNDS_HEIGHT / 2 + Math.random() * _FoodConstants.FOOD_SPAWN_BOUNDS_HEIGHT;
      }
      var foodType = void 0;
      if (!this.enableDifficultyLevelGrowth) {
        foodType = (0, _MathUtils.getRandomWithWeight)(_FoodConstants.FOOD_DATA, _FoodConstants.FOOD_DATA.length);
      } else {
        this.tryDifficultyLevelUp();
        foodType = (0, _MathUtils.getRandomWithWeight)(this.sortedFoodData, this.currentDifficultyLevelLastIndex + 1);
      }
      var newFood = new _Food2.default(this.game, x, y, foodType.key, foodType.nutritionFacts, this.NutritionManager, this.removeChild.bind(this));
      this.children.push(newFood);
    }
  }, {
    key: 'update',
    value: function update() {
      Phaser.Group.prototype.update.call(this);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      var index = this.children.indexOf(child);
      this.children[index].destroy();
      this.children.splice(index, 1);
    }
    // this method should be called from a callback that counts points

  }, {
    key: 'tryDifficultyLevelUp',
    value: function tryDifficultyLevelUp(score) {
      if (score >= _DifficultyLevelIntervals.TIME_TO_REACH_MEDIUM_LEVEL && this.currentDifficultyLevelLastIndex !== this.mediumLevelLastIndex && this.currentDifficultyLevelLastIndex !== this.hardLevelLastIndex) {
        this.currentDifficultyLevelLastIndex = this.mediumLevelLastIndex;
      } else if (score >= _DifficultyLevelIntervals.TIME_TO_REACH_HARD_LEVEL && this.currentDifficultyLevelLastIndex !== this.hardLevelLastIndex) {
        this.currentDifficultyLevelLastIndex = this.hardLevelLastIndex;
      }
    }
  }]);

  return FoodSpawner;
}(Phaser.Group);

exports.default = FoodSpawner;

},{"../constants/DifficultyLevelIntervals.js":1,"../constants/FoodConstants":2,"../utils/MathUtils.js":20,"./Food":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _NutritionUI = require('./NutritionUI');

var _NutritionUI2 = _interopRequireDefault(_NutritionUI);

var _NutritionConstants = require('../constants/NutritionConstants');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var NutritionManager = function () {
  function NutritionManager(game) {
    _classCallCheck(this, NutritionManager);

    this.nutrition = {
      carbohydrates: _NutritionConstants.GOOD_AMOUNT_OF_CARBOHYDRATES,
      fats: _NutritionConstants.GOOD_AMOUNT_OF_FATS,
      proteins: _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS
    };

    this.UI = new _NutritionUI2.default(game, this);

    game.time.events.loop(_NutritionConstants.AMOUNT_REDUCED_INTERVAL, this.reduceNutrition, this);
  }

  _createClass(NutritionManager, [{
    key: 'reduceNutrition',
    value: function reduceNutrition() {
      this.nutrition.carbohydrates -= _NutritionConstants.GOOD_AMOUNT_OF_CARBOHYDRATES * _NutritionConstants.AMOUNT_REDUCED_PERCENT;
      this.nutrition.fats -= _NutritionConstants.GOOD_AMOUNT_OF_FATS * _NutritionConstants.AMOUNT_REDUCED_PERCENT;
      this.nutrition.proteins -= _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS * _NutritionConstants.AMOUNT_REDUCED_PERCENT;

      this.nutrition.carbohydrates = Math.round(this.nutrition.carbohydrates * 10) / 10;
      this.nutrition.fats = Math.round(this.nutrition.fats * 10) / 10;
      this.nutrition.proteins = Math.round(this.nutrition.proteins * 10) / 10;

      this.UI.updateUI();
    }
  }, {
    key: 'updateStats',
    value: function updateStats(data) {
      this.nutrition.carbohydrates += data.carbohydrates;
      this.nutrition.fats += data.fats;
      this.nutrition.proteins += data.proteins;

      this.UI.updateUI(data);
    }
  }]);

  return NutritionManager;
}();

exports.default = NutritionManager;

},{"../constants/NutritionConstants":3,"./NutritionUI":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _NutritionConstants = require('../constants/NutritionConstants');

var _WeightBreakpoints = require('../constants/WeightBreakpoints');

var _UIConstants = require('../constants/UIConstants');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var NutritionUI = function () {
  function NutritionUI(game, NutritionManager) {
    _classCallCheck(this, NutritionUI);

    this.game = game;

    this.nutrition = NutritionManager.nutrition;

    this.NutritionBars = [];
    this.NutritionMasks = [];
    this.NutritionTexts = [];

    this.drawAllBars();
  }

  _createClass(NutritionUI, [{
    key: 'updateUI',
    value: function updateUI(updatedValues) {
      this.updateBar(this.nutrition.carbohydrates, _NutritionConstants.GOOD_AMOUNT_OF_CARBOHYDRATES, 2);
      this.updateBar(this.nutrition.fats, _NutritionConstants.GOOD_AMOUNT_OF_FATS, 1);
      this.updateBar(this.nutrition.proteins, _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS, 0);

      if (updatedValues) {
        for (var key in updatedValues) {
          var value = updatedValues[key];
          if (value !== 0) {
            this.displayAddition(key, value);
          }
        }
      }
    }
  }, {
    key: 'drawAllBars',
    value: function drawAllBars() {
      this.drawBar(this.nutrition.carbohydrates, _NutritionConstants.GOOD_AMOUNT_OF_CARBOHYDRATES, 2, 'Carbohydrates');
      this.drawBar(this.nutrition.fats, _NutritionConstants.GOOD_AMOUNT_OF_FATS, 1, 'Fats');
      this.drawBar(this.nutrition.proteins, _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS, 0, 'Proteins');
    }
  }, {
    key: 'displayAddition',
    value: function displayAddition(key, val) {
      var i = 0;

      switch (key) {
        case 'carbohydrates':
          i = 2;
          break;
        case 'fats':
          i = 1;
          break;
        case 'proteins':
          i = 0;
          break;
        // no default
      }

      var height = _UIConstants.NUTRITION_BAR_HEIGHT;
      var offset = i * (_UIConstants.NUTRITION_BAR_OFFSET + height);

      var textX = this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT - _UIConstants.NUTRITION_BAR_TEXT_OFFSET_X;
      var textY = this.game.height - _UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM - _UIConstants.NUTRITION_BAR_TEXT_OFFSET_Y - offset;
      var nutritionAdded = this.game.add.text(textX, textY, '+' + val, _UIConstants.NUTRITION_NUTRITION_ADDED_FONT);
      nutritionAdded.anchor.setTo(1, 1);
      this.game.add.tween(nutritionAdded).to({ alpha: 0, y: textY - 100 }, 1000, Phaser.Easing.Linear.None, true);
    }
  }, {
    key: 'updateBar',
    value: function updateBar(value, goodAmount, i) {
      var width = _UIConstants.NUTRITION_BAR_WIDTH;
      var height = _UIConstants.NUTRITION_BAR_HEIGHT;
      var offset = i * (_UIConstants.NUTRITION_BAR_OFFSET + height);
      var doubleOfGoodAmount = goodAmount * 2;

      var status = this.NutritionBars[i];

      if (value <= doubleOfGoodAmount * _WeightBreakpoints.SUPER_THIN_BREAKPOINT || value >= doubleOfGoodAmount * _WeightBreakpoints.SUPER_FAT_BREAKPOINT) {
        status.frame = 2;
      } else if (value <= doubleOfGoodAmount * _WeightBreakpoints.THIN_BREAKPOINT || value >= doubleOfGoodAmount * _WeightBreakpoints.FAT_BREAKPOINT) {
        status.frame = 1;
      } else {
        status.frame = 0;
      }

      var NutritionBarValue = Math.min(Math.max(value / doubleOfGoodAmount, 0), 1);

      var mask = this.NutritionMasks[i];
      mask.clear();
      mask.beginFill(0x000000);
      mask.drawRect(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT - width + width * (1 - NutritionBarValue), this.game.height - _UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM - offset - height, width * NutritionBarValue, height);
      mask.endFill();

      var statusText = this.NutritionTexts[i];
      statusText.setText(parseInt(value) + ' / ' + goodAmount);
    }
  }, {
    key: 'drawBar',
    value: function drawBar(value, goodAmount, i, text) {
      var width = _UIConstants.NUTRITION_BAR_WIDTH;
      var height = _UIConstants.NUTRITION_BAR_HEIGHT;
      var offset = i * (_UIConstants.NUTRITION_BAR_OFFSET + height);
      var doubleOfGoodAmount = goodAmount * 2;

      var NutritionBarValue = Math.min(Math.max(value / doubleOfGoodAmount, 0), 1);

      var background = this.game.add.sprite(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT, this.game.height - _UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM - offset, 'nutrition-bar-background');
      background.anchor.setTo(1, 1);

      var mask = this.game.add.graphics(0, 0);
      mask.beginFill(0x000000);
      mask.drawRect(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT - width + width * (1 - NutritionBarValue), this.game.height - _UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM - offset - height, width * NutritionBarValue, height);
      mask.endFill();

      this.NutritionMasks[i] = mask;

      var status = this.game.add.sprite(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT, this.game.height - _UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM - offset, 'nutrition-bar', 0);
      status.anchor.setTo(1, 1);
      status.mask = mask;

      this.NutritionBars[i] = status;

      var descText = this.game.add.text(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT + _UIConstants.NUTRITION_BAR_TEXT_OFFSET_X - width, this.game.height - _UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM - offset - _UIConstants.NUTRITION_BAR_TEXT_OFFSET_Y, text, _UIConstants.NUTRITION_BAR_INFO_FONT);
      descText.anchor.setTo(0, 1);
      descText.setShadow(0, 0, _UIConstants.NUTRITION_BAR_TEXT_SHADOW_COLOR, _UIConstants.NUTRITION_BAR_TEXT_SHADOW_SIZE);

      var statusText = this.game.add.text(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT - _UIConstants.NUTRITION_BAR_TEXT_OFFSET_X, this.game.height - _UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM - _UIConstants.NUTRITION_BAR_TEXT_OFFSET_Y - offset, parseInt(value) + ' / ' + goodAmount, _UIConstants.NUTRITION_BAR_INFO_FONT);
      statusText.anchor.setTo(1, 1);
      statusText.setShadow(0, 0, _UIConstants.NUTRITION_BAR_TEXT_SHADOW_COLOR, _UIConstants.NUTRITION_BAR_TEXT_SHADOW_SIZE);

      this.NutritionTexts[i] = statusText;
    }
  }]);

  return NutritionUI;
}();

exports.default = NutritionUI;

},{"../constants/NutritionConstants":3,"../constants/UIConstants":4,"../constants/WeightBreakpoints":5}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Boot = function (_Phaser$State) {
  _inherits(Boot, _Phaser$State);

  function Boot() {
    _classCallCheck(this, Boot);

    return _possibleConstructorReturn(this, (Boot.__proto__ || Object.getPrototypeOf(Boot)).apply(this, arguments));
  }

  _createClass(Boot, [{
    key: 'preload',
    value: function preload() {
      this.game.stage.backgroundColor = '#2196F3';
      this.game.load.image('loading-background', 'img/loading-background.png');
      this.game.load.image('loading-progress', 'img/loading-progress.png');
    }
  }, {
    key: 'create',
    value: function create() {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
      this.game.state.start('Preloader');
    }
  }]);

  return Boot;
}(Phaser.State);

exports.default = Boot;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _AudioManager = require('../utils/AudioManager');

var _StorageManager = require('../utils/StorageManager');

var _FoodSpawner = require('../objects/FoodSpawner');

var _FoodSpawner2 = _interopRequireDefault(_FoodSpawner);

var _Bob = require('../objects/Bob');

var _Bob2 = _interopRequireDefault(_Bob);

var _NutritionManager = require('../objects/NutritionManager');

var _NutritionManager2 = _interopRequireDefault(_NutritionManager);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Game = function (_Phaser$State) {
  _inherits(Game, _Phaser$State);

  function Game() {
    _classCallCheck(this, Game);

    return _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).apply(this, arguments));
  }

  _createClass(Game, [{
    key: 'create',
    value: function create() {
      var _this2 = this;

      this.score = 0;
      this.gamePaused = false;
      this.runOnce = false;

      this.scoreTemplate = function (time) {
        return 'Time: ' + time + 's';
      };

      this.NutritionManager = new _NutritionManager2.default(this.game);
      this.bob = new _Bob2.default(this.game, this.world.width / 2, this.world.height - 32, 'bob', this.NutritionManager, this.stateGameover.bind(this));

      this.foodSpawner = new _FoodSpawner2.default(this.game, this.NutritionManager, true);
      this.foodContainer = this.foodSpawner.children;
      this.initUI();

      this.camera.resetFX();
      this.camera.flash(0x000000, 500, false);

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.onResume.add(function () {
        if (_this2.stateStatus !== 'playing') {
          _this2.game.time.events.pause();
        }
      });
    }
  }, {
    key: 'initUI',
    value: function initUI() {
      this.buttonPause = this.add.button(this.world.width - 20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
      this.buttonPause.anchor.set(1, 0);

      var fontScore = { font: '64px Gloria Hallelujah', fill: '#fff' };
      var fontScoreWhite = { font: '64px Arial', fill: '#FFF', align: 'center' };
      this.textScore = this.add.text(30, this.world.height - 20, this.scoreTemplate(this.score), fontScore);
      this.textScore.anchor.set(0, 1);
      this.textScore.setShadow(0, 0, 'rgba(0 ,0, 0, 0.5)', 10);

      this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.handlePoints, this);

      this.buttonPause.y = -this.buttonPause.height - 20;
      this.add.tween(this.buttonPause).to({ y: 20 }, 1000, Phaser.Easing.Exponential.Out, true);

      var fontTitle = { font: '48px Arial', fill: '#000', stroke: '#FFF', strokeThickness: 10 };

      this.screenPausedGroup = this.add.group();
      this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
      this.screenPausedBg.scale.setTo(2);
      this.screenPausedText = this.add.text(this.world.width * 0.5, 100, 'Paused', fontTitle);
      this.screenPausedText.anchor.set(0.5, 0);
      this.buttonAudio = this.add.button(this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
      this.buttonAudio.anchor.set(1, 0);
      this.screenPausedBack = this.add.button(150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
      this.screenPausedBack.anchor.set(0, 1);
      this.screenPausedContinue = this.add.button(this.world.width - 150, this.world.height - 100, 'button-continue', this.managePause, this, 1, 0, 2);
      this.screenPausedContinue.anchor.set(1, 1);
      this.screenPausedGroup.add(this.screenPausedBg);
      this.screenPausedGroup.add(this.screenPausedText);
      this.screenPausedGroup.add(this.buttonAudio);
      this.screenPausedGroup.add(this.screenPausedBack);
      this.screenPausedGroup.add(this.screenPausedContinue);
      this.screenPausedGroup.alpha = 0;
      this.screenPausedGroup.visible = false;

      this.buttonAudio.setFrames((0, _AudioManager.getAudioOffset)() + 1, (0, _AudioManager.getAudioOffset)() + 0, (0, _AudioManager.getAudioOffset)() + 2);

      this.screenGameoverGroup = this.add.group();
      this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
      this.screenGameoverBg.scale.setTo(2);
      this.screenGameoverText = this.add.text(this.world.width * 0.5, 100, 'Game over', fontTitle);
      this.screenGameoverText.anchor.set(0.5, 0);
      this.screenGameoverBack = this.add.button(150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
      this.screenGameoverBack.anchor.set(0, 1);
      this.screenGameoverRestart = this.add.button(this.world.width - 150, this.world.height - 100, 'button-restart', this.stateRestart, this, 1, 0, 2);
      this.screenGameoverRestart.anchor.set(1, 1);
      this.screenGameoverScore = this.add.text(this.world.width * 0.5, 300, 'Score: ' + this.score, fontScoreWhite);
      this.screenGameoverScore.anchor.set(0.5, 0.5);
      this.screenGameoverGroup.add(this.screenGameoverBg);
      this.screenGameoverGroup.add(this.screenGameoverText);
      this.screenGameoverGroup.add(this.screenGameoverBack);
      this.screenGameoverGroup.add(this.screenGameoverRestart);
      this.screenGameoverGroup.add(this.screenGameoverScore);
      this.screenGameoverGroup.alpha = 0;
      this.screenGameoverGroup.visible = false;
    }
  }, {
    key: 'update',
    value: function update() {
      this.bob.hadleWeightChange();

      switch (this.stateStatus) {
        case 'paused':
          {
            if (!this.runOnce) {
              this.statePaused();
              this.runOnce = true;
            }
            break;
          }
        case 'gameover':
          {
            if (!this.runOnce) {
              this.stateGameover();
              this.runOnce = true;
            }
            break;
          }
        case 'playing':
          {
            if (!this.runOnce) {
              this.statePlaying();
              this.runOnce = true;
            }
          }
      }
    }
  }, {
    key: 'managePause',
    value: function managePause() {
      this.gamePaused = !this.gamePaused;
      (0, _AudioManager.playAudio)('click');
      if (this.gamePaused) {
        this.game.world.bringToTop(this.screenPausedGroup);
        this.stateStatus = 'paused';
        this.runOnce = false;
        this.stopMovingFood();
      } else {
        this.stateStatus = 'playing';
        this.runOnce = false;
        this.restoreFoodMovement();
      }
    }
  }, {
    key: 'statePlaying',
    value: function statePlaying() {
      var _this3 = this;

      var tween = this.game.add.tween(this.screenPausedGroup);
      tween.to({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(function () {
        if (_this3.screenPausedGroup.visible) {
          _this3.screenPausedGroup.visible = false;
        }
      }, this);
    }
  }, {
    key: 'statePaused',
    value: function statePaused() {
      this.screenPausedGroup.visible = true;
      var tween = this.game.add.tween(this.screenPausedGroup);
      tween.to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);
    }
  }, {
    key: 'stateGameover',
    value: function stateGameover(msg) {
      this.stopMovingFood();
      this.game.world.bringToTop(this.screenGameoverGroup);
      this.screenGameoverScore.setText('Score: ' + this.score);
      this.gameoverScoreTween(msg);

      this.screenGameoverGroup.visible = true;
      var tween = this.game.add.tween(this.screenGameoverGroup);
      tween.to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);

      (0, _StorageManager.getStorage)().setHighscore('EPT-highscore', this.score);
    }
  }, {
    key: 'handlePoints',
    value: function handlePoints() {
      this.score++;
      this.foodSpawner.tryDifficultyLevelUp(this.score);
      this.textScore.setText(this.scoreTemplate(this.score));
    }
  }, {
    key: 'gameoverScoreTween',
    value: function gameoverScoreTween() {
      var _this4 = this;

      var deathmsg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      this.screenGameoverScore.setText('');
      if (this.score) {
        this.tweenedPoints = this.score;
        var pointsTween = this.add.tween(this);
        pointsTween.to({ tweenedPoints: this.score }, 1000, Phaser.Easing.Linear.None, true, 500);
        pointsTween.onUpdateCallback(function () {
          _this4.screenGameoverScore.setText('Time survied on diet: ' + Math.floor(_this4.tweenedPoints) + '\n' + deathmsg);
        }, this);
        pointsTween.onComplete.addOnce(function () {
          _this4.screenGameoverScore.setText('Time survied on diet: ' + _this4.score);
        }, this);
        pointsTween.start();
      }
    }
  }, {
    key: 'clickAudio',
    value: function clickAudio() {
      (0, _AudioManager.playAudio)('click');
      (0, _AudioManager.manageAudio)('switch', this);
    }
  }, {
    key: 'stateRestart',
    value: function stateRestart() {
      (0, _AudioManager.playAudio)('click');
      this.screenGameoverGroup.visible = false;
      this.gamePaused = false;
      this.runOnce = false;
      this.stateStatus = 'playing';
      this.restoreFoodMovement();
      this.state.restart(true);
    }
  }, {
    key: 'stateBack',
    value: function stateBack() {
      (0, _AudioManager.playAudio)('click');
      this.screenGameoverGroup.visible = false;
      this.gamePaused = false;
      this.runOnce = false;
      this.stateStatus = 'playing';
      this.game.time.events.resume();
      this.state.start('MainMenu');
    }
  }, {
    key: 'stopMovingFood',
    value: function stopMovingFood() {
      this.foodContainer.forEach(function (food) {
        food.body.velocity.x = 0;
        food.body.velocity.y = 0;
      });
      this.game.time.events.pause();
    }
  }, {
    key: 'restoreFoodMovement',
    value: function restoreFoodMovement() {
      this.foodContainer.forEach(function (food) {
        food.body.velocity.x = food.velocityX;
        food.body.velocity.y = food.velocityY;
      });
      this.game.time.events.resume();
    }
  }]);

  return Game;
}(Phaser.State);

exports.default = Game;

},{"../objects/Bob":7,"../objects/FoodSpawner":9,"../objects/NutritionManager":10,"../utils/AudioManager":19,"../utils/StorageManager":21}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _AudioManager = require('../utils/AudioManager');

var _StorageManager = require('../utils/StorageManager');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var MainMenu = function (_Phaser$State) {
  _inherits(MainMenu, _Phaser$State);

  function MainMenu() {
    _classCallCheck(this, MainMenu);

    return _possibleConstructorReturn(this, (MainMenu.__proto__ || Object.getPrototypeOf(MainMenu)).apply(this, arguments));
  }

  _createClass(MainMenu, [{
    key: 'create',
    value: function create() {
      this.add.sprite(0, 0, 'background');
      var title = this.add.sprite(this.world.width * 0.5, (this.world.height - 100) * 0.5, 'title');
      title.anchor.set(0.5);

      (0, _StorageManager.setStorage)(this.game.plugins.add(Phaser.Plugin.Storage));

      (0, _StorageManager.getStorage)().initUnset('EPT-highscore', 0);
      var highscore = (0, _StorageManager.getStorage)().get('EPT-highscore') || 0;

      var buttonEnclave = this.add.button(20, 20, 'logo-pigames', this.clickEnclave, this);
      var buttonStart = this.add.button(this.world.width - 20, this.world.height - 20, 'button-start', this.clickStart, this, 1, 0, 2);
      buttonStart.anchor.set(1);

      this.buttonAudio = this.add.button(this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
      this.buttonAudio.anchor.set(1, 0);

      var buttonWiki = this.add.button(20, this.world.height - 20, 'button-wiki', this.clickAchievements, this, 1, 0, 2);
      buttonWiki.anchor.set(0, 1);

      var fontHighscore = { font: '32px Arial', fill: '#000' };
      var textHighscore = this.add.text(this.world.width * 0.5, this.world.height - 50, 'Highscore: ' + highscore, fontHighscore);
      textHighscore.anchor.set(0.5, 1);

      (0, _AudioManager.manageAudio)('init', this);
      // Turn the music off at the start:
      (0, _AudioManager.manageAudio)('off', this);

      buttonStart.x = this.world.width + buttonStart.width + 20;
      this.add.tween(buttonStart).to({ x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true);
      this.buttonAudio.y = -this.buttonAudio.height - 20;
      this.add.tween(this.buttonAudio).to({ y: 20 }, 500, Phaser.Easing.Exponential.Out, true);
      buttonEnclave.x = -buttonEnclave.width - 20;
      this.add.tween(buttonEnclave).to({ x: 20 }, 500, Phaser.Easing.Exponential.Out, true);
      buttonWiki.y = this.world.height + buttonWiki.height + 20;
      this.add.tween(buttonWiki).to({ y: this.world.height - 20 }, 500, Phaser.Easing.Exponential.Out, true);

      this.camera.flash(0x000000, 500, false);
    }
  }, {
    key: 'clickAudio',
    value: function clickAudio() {
      (0, _AudioManager.playAudio)('click');
      (0, _AudioManager.manageAudio)('switch', this);
    }
  }, {
    key: 'clickEnclave',
    value: function clickEnclave() {
      (0, _AudioManager.playAudio)('click');
      window.top.location.href = 'http://pigam.es/';
    }
  }, {
    key: 'clickStart',
    value: function clickStart() {
      var _this2 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.time.events.add(200, function () {
        // this.game.state.start( 'Story' );
        _this2.game.state.start('Game');
      });
    }
  }, {
    key: 'clickAchievements',
    value: function clickAchievements() {
      (0, _AudioManager.playAudio)('click');
      this.game.state.start('Wiki');
    }
  }]);

  return MainMenu;
}(Phaser.State);

exports.default = MainMenu;

},{"../utils/AudioManager":19,"../utils/StorageManager":21}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var resources = {
  'image': [['background', 'img/background.png'], ['title', 'img/title.png'], ['logo-pigames', 'img/logo-pigames.png'], ['overlay', 'img/ui/overlay.png'], ['nutrition-bar-background', 'img/ui/nutrition-bar-background.png'], ['apple', 'img/assets/apple.png'], ['chicken', 'img/assets/chicken.png'], ['banana', 'img/assets/banana.png'], ['hamburger', 'img/assets/hamburger.png']],
  'spritesheet': [['button-start', 'img/ui/button-start.png', 160, 160], ['button-continue', 'img/ui/button-start.png', 160, 160], ['button-mainmenu', 'img/ui/button-mainmenu.png', 160, 160], ['button-restart', 'img/ui/button-tryagain.png', 160, 160], ['button-wiki', 'img/ui/button-wiki.png', 160, 160], ['button-pause', 'img/ui/button-pause.png', 160, 160], ['button-audio', 'img/ui/button-sound.png', 160, 160], ['button-back', 'img/button-back.png', 70, 70], ['button-next', 'img/button-next.png', 70, 70], ['bob', 'img/assets/bob.png', 460, 1370], ['nutrition-bar', 'img/ui/nutrition-bar.png', 680, 56]],
  'audio': [['audio-click', ['sfx/audio-button.m4a', 'sfx/audio-button.mp3', 'sfx/audio-button.ogg']], ['audio-theme', ['sfx/music-bitsnbites-liver.m4a', 'sfx/music-bitsnbites-liver.mp3', 'sfx/music-bitsnbites-liver.ogg']]]
};

window.WebFontConfig = {
  google: {
    families: ['Gloria Hallelujah']
  }
};

var Preloader = function (_Phaser$State) {
  _inherits(Preloader, _Phaser$State);

  function Preloader() {
    _classCallCheck(this, Preloader);

    return _possibleConstructorReturn(this, (Preloader.__proto__ || Object.getPrototypeOf(Preloader)).apply(this, arguments));
  }

  _createClass(Preloader, [{
    key: 'preload',
    value: function preload() {
      this.add.sprite((this.world.width - 580) * 0.5, (this.world.height + 150) * 0.5, 'loading-background');
      var preloadProgress = this.add.sprite((this.world.width - 540) * 0.5, (this.world.height + 170) * 0.5, 'loading-progress');
      this.load.setPreloadSprite(preloadProgress);

      this._preloadResources();
    }
  }, {
    key: '_preloadResources',
    value: function _preloadResources() {
      var _this2 = this;

      var _loop = function _loop(method) {
        resources[method].forEach(function (args) {
          var loader = _this2.load[method];
          loader && loader.apply(_this2.load, args);
        }, _this2);
      };

      for (var method in resources) {
        _loop(method);
      }

      this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    }
  }, {
    key: 'create',
    value: function create() {
      this.state.start('MainMenu');
      // this.state.start( 'Game' );
    }
  }]);

  return Preloader;
}(Phaser.State);

exports.default = Preloader;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _AudioManager = require('../utils/AudioManager');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Story = function (_Phaser$State) {
  _inherits(Story, _Phaser$State);

  function Story() {
    _classCallCheck(this, Story);

    return _possibleConstructorReturn(this, (Story.__proto__ || Object.getPrototypeOf(Story)).apply(this, arguments));
  }

  _createClass(Story, [{
    key: 'create',
    value: function create() {
      this.add.text(100, 75, 'Story screen', { font: '32px Arial', fill: '#000' });
      var buttonContinue = this.add.button(this.world.width - 20, this.game.world.height - 20, 'button-continue', this.clickContinue, this, 1, 0, 2);

      buttonContinue.anchor.set(1, 1);
      buttonContinue.x = this.world.width + buttonContinue.width + 20;

      this.add.tween(buttonContinue).to({ x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true);

      this.camera.flash(0x000000, 500, false);
    }
  }, {
    key: 'clickContinue',
    value: function clickContinue() {
      var _this2 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.camera.onFadeComplete.add(function () {
        _this2.game.state.start('Game');
      }, this);
    }
  }]);

  return Story;
}(Phaser.State);

exports.default = Story;

},{"../utils/AudioManager":19}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _AudioManager = require('../utils/AudioManager');

var _FoodConstants = require('../constants/FoodConstants');

var _UserInterfaceUtils = require('../utils/UserInterfaceUtils');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Wiki = function (_Phaser$State) {
  _inherits(Wiki, _Phaser$State);

  function Wiki() {
    _classCallCheck(this, Wiki);

    return _possibleConstructorReturn(this, (Wiki.__proto__ || Object.getPrototypeOf(Wiki)).apply(this, arguments));
  }

  _createClass(Wiki, [{
    key: 'create',
    value: function create() {
      var fontWiki = { font: '40px Arial', fill: '#000' };
      this.add.text(20, 20, 'Wiki', fontWiki);

      var buttonBack = this.add.button(this.world.width - 20, this.game.world.height - 20, 'button-back', this.clickBack, this, 1, 0, 2);
      buttonBack.anchor.set(1, 1);
      buttonBack.x = this.world.width + buttonBack.width + 20;
      this.add.tween(buttonBack).to({ x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true);

      this.currentWikiPageIndex = 0;

      this.currentPage = this.add.group();
      this.fillGroupWithFoodData(this.currentPage, 0);

      this.nextPage = this.add.group();
      this.fillGroupWithFoodData(this.nextPage, 1);

      this.nextPage.position.x += this.world.width;

      var buttonPrevious = this.add.button(0, 0, 'button-back', this.goToPreviousWikiPage, this, 1, 0, 2);
      buttonPrevious.x = -buttonPrevious.width;
      this.add.tween(buttonPrevious).to({ x: 75 }, 500, Phaser.Easing.Exponential.Out, true);
      (0, _UserInterfaceUtils.centerObjectInHeight)(buttonPrevious, this.world);

      var buttonNext = this.add.button(0, 0, 'button-next', this.goToNextWikiPage, this, 1, 0, 2);
      buttonNext.x = this.world.width;
      this.add.tween(buttonNext).to({ x: this.world.width - buttonNext.width - 75 }, 500, Phaser.Easing.Exponential.Out, true);
      (0, _UserInterfaceUtils.centerObjectInHeight)(buttonNext, this.world);
    }
  }, {
    key: 'clickBack',
    value: function clickBack() {
      (0, _AudioManager.playAudio)('click');
      this.game.state.start('MainMenu');
    }
  }, {
    key: 'makeFirstLetterCapital',
    value: function makeFirstLetterCapital(string) {
      return '' + string.charAt(0).toUpperCase() + string.substring(1);
    }
  }, {
    key: 'goToPreviousWikiPage',
    value: function goToPreviousWikiPage() {
      var _this2 = this;

      if (this.tweenIn != null) {
        return;
      }
      this.currentWikiPageIndex = this.currentWikiPageIndex === 0 ? _FoodConstants.FOOD_DATA.length - 1 : this.currentWikiPageIndex - 1;

      this.nextPage.position.x -= this.world.width * 2;
      this.fillGroupWithFoodData(this.nextPage, this.currentWikiPageIndex);

      this.add.tween(this.currentPage.position).to({ x: this.currentPage.position.x + this.world.width }, 500, Phaser.Easing.Linear.None, true);
      this.tweenIn = this.add.tween(this.nextPage.position).to({ x: this.nextPage.position.x + this.world.width }, 500, Phaser.Easing.Linear.None, true);

      this.tweenIn.onComplete.add(function () {
        var tmpPage = _this2.currentPage;
        _this2.currentPage = _this2.nextPage;
        _this2.nextPage = tmpPage;

        _this2.tweenIn = null;
      });
    }
  }, {
    key: 'goToNextWikiPage',
    value: function goToNextWikiPage() {
      var _this3 = this;

      if (this.tweenIn != null) {
        return;
      }
      this.currentWikiPageIndex = this.currentWikiPageIndex + 1 === _FoodConstants.FOOD_DATA.length ? 0 : this.currentWikiPageIndex + 1;

      this.add.tween(this.currentPage.position).to({ x: this.currentPage.position.x - this.world.width }, 500, Phaser.Easing.Linear.None, true);
      this.tweenIn = this.add.tween(this.nextPage.position).to({ x: this.nextPage.position.x - this.world.width }, 500, Phaser.Easing.Linear.None, true);

      this.tweenIn.onComplete.add(function () {
        var tmpPage = _this3.currentPage;

        _this3.currentPage = _this3.nextPage;
        var nextIndex = _this3.currentWikiPageIndex + 1 === _FoodConstants.FOOD_DATA.length ? 0 : _this3.currentWikiPageIndex + 1;
        _this3.fillGroupWithFoodData(tmpPage, nextIndex);
        tmpPage.position.x += _this3.world.width * 2;

        _this3.nextPage = tmpPage;

        _this3.tweenIn = null;
      });
    }
  }, {
    key: 'fillGroupWithFoodData',
    value: function fillGroupWithFoodData(group, index) {
      group.removeAll(true);
      var fontTitle = { font: '35px Arial', fill: '#fff' };

      var title = this.add.text(0, 75, this.makeFirstLetterCapital(_FoodConstants.FOOD_DATA[index].key), fontTitle);
      (0, _UserInterfaceUtils.centerObjectInWidth)(title, this.world);
      var sprite = this.add.sprite(0, 150, _FoodConstants.FOOD_DATA[index].key);
      (0, _UserInterfaceUtils.centerObjectInWidth)(sprite, this.world);
      var fontNutritionFacts = { font: '25px Arial', fill: '#000' };
      var carbohydrates = this.add.text(0, 325, 'Carbohydrates: ' + _FoodConstants.FOOD_DATA[index].nutritionFacts.carbohydrates + 'g', fontNutritionFacts);
      (0, _UserInterfaceUtils.centerObjectInWidth)(carbohydrates, this.world);
      var fats = this.add.text(0, 375, 'Fats: ' + _FoodConstants.FOOD_DATA[index].nutritionFacts.fats + 'g', fontNutritionFacts);
      (0, _UserInterfaceUtils.centerObjectInWidth)(fats, this.world);
      var proteins = this.add.text(0, 425, 'Proteins: ' + _FoodConstants.FOOD_DATA[index].nutritionFacts.proteins + 'g', fontNutritionFacts);
      (0, _UserInterfaceUtils.centerObjectInWidth)(proteins, this.world);

      group.add(title);
      group.add(sprite);
      group.add(carbohydrates);
      group.add(fats);
      group.add(proteins);
    }
  }]);

  return Wiki;
}(Phaser.State);

exports.default = Wiki;

},{"../constants/FoodConstants":2,"../utils/AudioManager":19,"../utils/UserInterfaceUtils":22}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Wiki = require('./Wiki');

var _Wiki2 = _interopRequireDefault(_Wiki);

var _Boot = require('./Boot');

var _Boot2 = _interopRequireDefault(_Boot);

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

var _MainMenu = require('./MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

var _Preloader = require('./Preloader');

var _Preloader2 = _interopRequireDefault(_Preloader);

var _Story = require('./Story');

var _Story2 = _interopRequireDefault(_Story);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
  Wiki: _Wiki2.default, Boot: _Boot2.default, Game: _Game2.default, MainMenu: _MainMenu2.default, Preloader: _Preloader2.default, Story: _Story2.default
};

},{"./Boot":12,"./Game":13,"./MainMenu":14,"./Preloader":15,"./Story":16,"./Wiki":17}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAudioOffset = undefined;
exports.manageAudio = manageAudio;
exports.playAudio = playAudio;

var _StorageManager = require('./StorageManager');

var _audioStatus = void 0;
var _sound = void 0;
var _soundMusic = void 0;
var _audioOffset = void 0;

function manageAudio(mode, game) {
  switch (mode) {
    case 'init':
      {
        (0, _StorageManager.getStorage)().initUnset('EPT-audio', true);
        _audioStatus = (0, _StorageManager.getStorage)().get('EPT-audio');
        // EPT._soundClick = game.add.audio('audio-click');
        _sound = [];
        _sound['click'] = game.add.audio('audio-click');
        if (!_soundMusic) {
          _soundMusic = game.add.audio('audio-theme', 1, true);
          _soundMusic.volume = 0.5;
        }
        break;
      }
    case 'on':
      {
        _audioStatus = true;
        break;
      }
    case 'off':
      {
        _audioStatus = false;
        break;
      }
    case 'switch':
      {
        _audioStatus = !_audioStatus;
        break;
      }
  }
  if (_audioStatus) {
    _audioOffset = 0;
    if (_soundMusic) {
      if (!_soundMusic.isPlaying) {
        _soundMusic.play('', 0, 1, true);
      }
    }
  } else {
    _audioOffset = 4;
    if (_soundMusic) {
      _soundMusic.stop();
    }
  }
  (0, _StorageManager.getStorage)().set('EPT-audio', _audioStatus);
  game.buttonAudio.setFrames(_audioOffset + 1, _audioOffset + 0, _audioOffset + 2);
}
function playAudio(sound) {
  if (_audioStatus) {
    if (_sound && _sound[sound]) {
      _sound[sound].play();
    }
  }
}

var getAudioOffset = exports.getAudioOffset = function getAudioOffset() {
  return _audioOffset;
};

},{"./StorageManager":21}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getRandomWithWeight = exports.getRandomWithWeight = function getRandomWithWeight(array) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : array.length;

  var probs = array.slice(0, length).map(function (v) {
    return v.probability;
  });
  var probsSum = probs.reduce(function (a, b) {
    return a + b;
  });
  probs = probs.map(function (v) {
    return v * (1 / probsSum);
  });

  var random = Math.random();
  var sum = 0;
  for (var i = 0; i < length; i++) {
    sum += probs[i];
    if (random <= sum) {
      return array[i];
    }
  }
};

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStorage = setStorage;
var EPTStorage = void 0;

function setStorage(storage) {
  EPTStorage = storage;
}

var getStorage = exports.getStorage = function getStorage() {
  return EPTStorage;
};

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.centerObjectInWidth = centerObjectInWidth;
exports.centerObjectInHeight = centerObjectInHeight;
function centerObjectInWidth(object, world) {
  object.position.x = world.width / 2 - object.width / 2;
}

function centerObjectInHeight(object, world) {
  object.position.y = world.height / 2 - object.height / 2;
}

},{}]},{},[6])
//# sourceMappingURL=game.js.map
