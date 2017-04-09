(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MIN_FOOD_VELOCITY = exports.MIN_FOOD_VELOCITY = 60;
var MAX_FOOD_VELOCITY = exports.MAX_FOOD_VELOCITY = 100;

var FOOD_SPAWN_INTERVAL = exports.FOOD_SPAWN_INTERVAL = 0.75 * Phaser.Timer.SECOND;
var FOOD_SPAWN_BOUNDS_WIDTH = exports.FOOD_SPAWN_BOUNDS_WIDTH = 500;
var FOOD_SPAWN_BOUNDS_HEIGHT = exports.FOOD_SPAWN_BOUNDS_HEIGHT = 300;

var FOOD_WIDTH = exports.FOOD_WIDTH = 100;
var FOOD_HEIGHT = exports.FOOD_HEIGHT = 75;

var FOOD_DATA = exports.FOOD_DATA = [{ 'key': 'apple', 'nutritionFacts': { 'carbos': 12, 'fats': 0, 'proteins': 0 } }, { 'key': 'chicken', 'nutritionFacts': { 'carbos': 2, 'fats': 10, 'proteins': 18 } }, { 'key': 'hamburger', 'nutritionFacts': { 'carbos': 30, 'fats': 13, 'proteins': 16 } }, { 'key': 'banana', 'nutritionFacts': { 'carbos': 30, 'fats': 1, 'proteins': 0 } }];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GOOD_AMOUNT_OF_CARBS = exports.GOOD_AMOUNT_OF_CARBS = 270;
var GOOD_AMOUNT_OF_FATS = exports.GOOD_AMOUNT_OF_FATS = 70;
var GOOD_AMOUNT_OF_PROTEINS = exports.GOOD_AMOUNT_OF_PROTEINS = 50;

},{}],3:[function(require,module,exports){
'use strict';

var _states = require('./states');

var _states2 = _interopRequireDefault(_states);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var game = new Phaser.Game(960, 640, Phaser.AUTO);
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

},{"./states":15}],4:[function(require,module,exports){
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

    _this.frame = 1;

    _this.handleDeath = handleDeath;

    _this.NutritionManager = NutritionManager;

    _this.anchor.setTo(0.5, 1);
    _this.scale.setTo(0.25);

    _this.game.world.add(_this);
    return _this;
  }

  _createClass(Bob, [{
    key: 'hadleWeightChange',
    value: function hadleWeightChange() {
      var nutrition = this.NutritionManager.nutrition;

      var arr = [this.getStatus(nutrition.carbos, _NutritionConstants.GOOD_AMOUNT_OF_CARBS), this.getStatus(nutrition.fats, _NutritionConstants.GOOD_AMOUNT_OF_FATS), this.getStatus(nutrition.proteins, _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS)];

      var outOfOrder = 0;
      var isThin = false;
      var isFat = false;
      var isDead = false;
      var isSuperFat = false;

      arr.forEach(function (v) {
        if (v === -1) {
          isThin = true;
        } else if (v === 1) {
          isFat = true;
        } else if (v === 2) {
          isFat = true;
          isSuperFat = true;
        }

        if (v === -2) {
          isDead = true;
        }

        outOfOrder += v !== 0;
      });

      if (isDead) {
        this.handleDeath('');
      }

      // this.frame = 2;
      if (outOfOrder === 0) {
        this.frame = 1;
      } else if (outOfOrder === 1) {
        if (isThin) {
          this.frame = 0;
        }

        if (isFat) {
          this.frame = 2;
        }

        if (isSuperFat) {
          this.frame = 3;
        }
      } else {
        if (isThin) {
          this.frame = 0;
        }

        if (isFat) {
          this.frame = 2;
        }

        if (isSuperFat) {
          this.frame = 3;
        }
      }
    }
  }, {
    key: 'getStatus',
    value: function getStatus(value, goodAmount) {
      if (value <= 0 || value >= goodAmount * 2) {
        return -2;
      }

      if (value <= goodAmount * 2 * 0.17) {
        return -1;
      }

      if (value >= goodAmount * 2 * 0.83) {
        return 2;
      }

      if (value >= goodAmount * 2 * 0.66) {
        return 1;
      }

      return 0;
    }
  }]);

  return Bob;
}(Phaser.Sprite);

exports.default = Bob;

},{"../constants/NutritionConstants":2}],5:[function(require,module,exports){
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

  function Food(game, x, y, key, data, NutritionManager) {
    _classCallCheck(this, Food);

    var _this = _possibleConstructorReturn(this, (Food.__proto__ || Object.getPrototypeOf(Food)).call(this, game, x, y, key));

    _this.data = data;
    _this.NutritionManager = NutritionManager;
    _this.scale.setTo(0.5);
    _this.game.physics.enable(_this);

    var directionX = x > _this.game.world.centerX ? -1 : 1;
    var directionY = y > _this.game.world.centerY ? -1 : 1;

    _this.velocityX = directionX * (Math.floor(Math.random() * _FoodConstants.MAX_FOOD_VELOCITY - _FoodConstants.MIN_FOOD_VELOCITY) + _FoodConstants.MIN_FOOD_VELOCITY);
    _this.body.velocity.x = _this.velocityX;

    _this.velocityY = directionY * (Math.floor(Math.random() * _FoodConstants.MAX_FOOD_VELOCITY - _FoodConstants.MIN_FOOD_VELOCITY) + _FoodConstants.MIN_FOOD_VELOCITY);
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
        console.log('destroy');
        _this.destroy();
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
      tween.to({ x: this.game.world.centerX - 20, y: this.game.world.height - 370 }, 500, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(function () {
        _this2.NutritionManager.updateStats(_this2.data);
        _this2.destroy();
      });
    }
  }]);

  return Food;
}(Phaser.Sprite);

exports.default = Food;

},{"../constants/FoodConstants":1}],6:[function(require,module,exports){
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

var _Food = require('./Food');

var _Food2 = _interopRequireDefault(_Food);

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
    _classCallCheck(this, FoodSpawner);

    var _this = _possibleConstructorReturn(this, (FoodSpawner.__proto__ || Object.getPrototypeOf(FoodSpawner)).call(this, game));

    _this.NutritionManager = NutritionManager;
    _this.spawnFood();
    _this.timer = _this.game.time.events.loop(_FoodConstants.FOOD_SPAWN_INTERVAL, _this.spawnFood, _this);
    return _this;
  }

  _createClass(FoodSpawner, [{
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
      var foodType = _FoodConstants.FOOD_DATA[Math.floor(Math.random() * _FoodConstants.FOOD_DATA.length)];
      console.log(foodType);
      var newFood = new _Food2.default(this.game, x, y, foodType.key, foodType.nutritionFacts, this.NutritionManager);
      this.children.push(newFood);
    }
  }]);

  return FoodSpawner;
}(Phaser.Group);

exports.default = FoodSpawner;

},{"../constants/FoodConstants":1,"./Food":5}],7:[function(require,module,exports){
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
      carbos: _NutritionConstants.GOOD_AMOUNT_OF_CARBS,
      fats: _NutritionConstants.GOOD_AMOUNT_OF_FATS,
      proteins: _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS
    };

    this.fatOMeter = 3;

    this.UI = new _NutritionUI2.default(game, this);

    game.time.events.loop(Phaser.Timer.SECOND * 1, this.reduceNutrition, this);
  }

  _createClass(NutritionManager, [{
    key: 'reduceNutrition',
    value: function reduceNutrition() {
      var percentAmount = 0.03;
      this.nutrition.carbos -= _NutritionConstants.GOOD_AMOUNT_OF_CARBS * percentAmount;
      this.nutrition.fats -= _NutritionConstants.GOOD_AMOUNT_OF_FATS * percentAmount;
      this.nutrition.proteins -= _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS * percentAmount;

      this.nutrition.carbos = Math.round(this.nutrition.carbos * 10) / 10;
      this.nutrition.fats = Math.round(this.nutrition.fats * 10) / 10;
      this.nutrition.proteins = Math.round(this.nutrition.proteins * 10) / 10;

      this.fatOMeter = this.nutrition.carbos / _NutritionConstants.GOOD_AMOUNT_OF_CARBS + this.nutrition.fats / _NutritionConstants.GOOD_AMOUNT_OF_FATS + this.nutrition.proteins / _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS;

      this.UI.updateUI();
    }
  }, {
    key: 'updateStats',
    value: function updateStats(data) {
      this.nutrition.carbos += data.carbos;
      this.nutrition.fats += data.fats;
      this.nutrition.proteins += data.proteins;

      this.UI.updateUI();
    }
  }]);

  return NutritionManager;
}();

exports.default = NutritionManager;

},{"../constants/NutritionConstants":2,"./NutritionUI":8}],8:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var NutritionUI = function () {
  function NutritionUI(game, NutritionManager) {
    _classCallCheck(this, NutritionUI);

    this.NutritionManager = NutritionManager;

    this.nutrition = this.NutritionManager.nutrition;
    this.fatOMeter = this.NutritionManager.fatOMeter;

    this.healthbars = [game.add.graphics(0, 0), game.add.graphics(0, 0), game.add.graphics(0, 0)];
    this.healtTexts = [];

    this.healthbars.forEach(function (v) {
      v.anchor.setTo(1, 1);
    });

    this.game = game;

    // Text templates
    // this.carboTextTemplate = text => `Carbohydrates: ${text}g`;
    // this.fatsTextTemplate = text => `Fats: ${text}g`;
    // this.proteinsTextTemplate = text => `Proteins: ${text}g`;
    // this.fatOMeterTextTemplate = text => `Fat-o-meter: ${Math.floor( text / 3 * 100 ) / 100}`;
    //
    // this.carboText = game.add.text( 30, 30, this.carboTextTemplate( this.nutrition.carbos ), fontScore );
    // this.carboText.anchor.set( 0 );
    //
    // this.fatsText = game.add.text( 30, ( 30 + fontSize + 8 ), this.fatsTextTemplate( this.nutrition.fats ), fontScore );
    // this.fatsText.anchor.set( 0 );
    //
    // this.proteinsText = game.add.text( 30, ( 30 + ( fontSize + 8 ) * 2 ), this.proteinsTextTemplate( this.nutrition.proteins ), fontScore );
    // this.proteinsText.anchor.set( 0 );
    //
    // this.fatOMeterText = game.add.text( 30, ( 30 + ( fontSize + 8 ) * 3 ), this.fatOMeterTextTemplate( this.fatOMeter ), fontScore );
    // this.fatOMeterText.anchor.set( 0 );

    this.drawAllBars();
  }

  _createClass(NutritionUI, [{
    key: 'updateUI',
    value: function updateUI() {
      // this.carboText.setText( this.carboTextTemplate( this.nutrition.carbos ) );
      // this.fatsText.setText( this.fatsTextTemplate( this.nutrition.fats ) );
      // this.proteinsText.setText( this.proteinsTextTemplate( this.nutrition.proteins ) );
      // this.fatOMeterText.setText( this.fatOMeterTextTemplate( this.NutritionManager.fatOMeter ) );

      this.drawAllBars();
    }
  }, {
    key: 'drawAllBars',
    value: function drawAllBars() {
      this.drawBar(this.nutrition.carbos, _NutritionConstants.GOOD_AMOUNT_OF_CARBS, 2, 'C:');
      this.drawBar(this.nutrition.fats, _NutritionConstants.GOOD_AMOUNT_OF_FATS, 1, 'F:');
      this.drawBar(this.nutrition.proteins, _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS, 0, 'P:');
    }
  }, {
    key: 'drawBar',
    value: function drawBar(value, goodAmount, i, text) {
      var width = 300;
      var height = 16;
      var offset = i * 30;

      this.healthbars[i].clear();

      if (value <= goodAmount * 2 * 0.17 || value >= goodAmount * 2 * 0.83) {
        this.healthbars[i].beginFill(0xFF0000, 0.85);
      } else if (value <= goodAmount * 2 * 0.34 || value >= goodAmount * 2 * 0.66) {
        this.healthbars[i].beginFill(0xFFFF00, 0.85);
      } else {
        this.healthbars[i].beginFill(0x00FF00, 0.85);
      }

      var fontSize = 14;
      var fontScore = { font: fontSize + 'px Arial', fill: '#000' };

      this.game.add.text(this.game.width - (width + 24) - 24, this.game.height - (height + 24) - offset, text, fontScore);

      this.healthbars[i].drawRect(this.game.width - (width + 24), this.game.height - (height + 24) - offset, width * Math.max(value / (goodAmount * 2), 0), height);
      this.healthbars[i].endFill();
      this.healthbars[i].lineStyle(2, 0x000000, 1);
      this.healthbars[i].drawRect(this.game.width - (width + 24), this.game.height - (height + 24) - offset, width, height);
      this.healthbars[i].lineStyle(0);
    }
  }]);

  return NutritionUI;
}();

exports.default = NutritionUI;

},{"../constants/NutritionConstants":2}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
      this.score = 0;
      this.gamePaused = false;
      this.runOnce = false;

      this.getStorage = _StorageManager.getStorage;

      this.scoreTemplate = function (time) {
        return 'Time: ' + time + 's';
      };

      this.NutritionManager = new _NutritionManager2.default(this.game);
      this.bob = new _Bob2.default(this.game, this.world.width / 2, this.world.height - 32, 'bob', this.NutritionManager, this.stateGameover.bind(this));

      this.foodSpawner = new _FoodSpawner2.default(this.game, this.NutritionManager);
      this.foodContainer = this.foodSpawner.children;
      this.initUI();

      this.camera.resetFX();
      this.camera.flash(0x000000, 500, false);

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }
  }, {
    key: 'initUI',
    value: function initUI() {
      this.buttonPause = this.add.button(this.world.width - 20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
      this.buttonPause.anchor.set(1, 0);

      var fontScore = { font: '32px Arial', fill: '#000' };
      var fontScoreWhite = { font: '32px Arial', fill: '#FFF' };
      this.textScore = this.add.text(30, this.world.height - 20, this.scoreTemplate(this.score), fontScore);
      this.textScore.anchor.set(0, 1);

      this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.handlePoints, this);

      this.buttonPause.y = -this.buttonPause.height - 20;
      this.add.tween(this.buttonPause).to({ y: 20 }, 1000, Phaser.Easing.Exponential.Out, true);

      var fontTitle = { font: '48px Arial', fill: '#000', stroke: '#FFF', strokeThickness: 10 };

      this.screenPausedGroup = this.add.group();
      this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
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
      this.screenPausedGroup.visible = false;

      this.buttonAudio.setFrames((0, _AudioManager.getAudioOffset)() + 1, (0, _AudioManager.getAudioOffset)() + 0, (0, _AudioManager.getAudioOffset)() + 2);

      this.screenGameoverGroup = this.add.group();
      this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
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
            this.statePlaying();
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
      this.screenPausedGroup.visible = false;
    }
  }, {
    key: 'statePaused',
    value: function statePaused() {
      this.screenPausedGroup.visible = true;
    }
  }, {
    key: 'stateGameover',
    value: function stateGameover(msg) {
      this.stopMovingFood();
      this.game.world.bringToTop(this.screenGameoverGroup);
      this.screenGameoverGroup.visible = true;
      // this.screenGameoverScore.setText( 'Score: ' + this.score );
      this.gameoverScoreTween(msg);

      this.getStorage().setHighscore('EPT-highscore', this.score);
    }
  }, {
    key: 'handlePoints',
    value: function handlePoints() {
      this.score++;
      this.textScore.setText(this.scoreTemplate(this.score));
    }
  }, {
    key: 'addPoints',
    value: function addPoints() {
      // const randX = this.rnd.integerInRange( 200, this.world.width - 200 );
      // const randY = this.rnd.integerInRange( 200, this.world.height - 200 );
      // const pointsAdded = this.add.text( randX, randY, '+10',
      // { font: '48px Arial', fill: '#000', stroke: '#FFF', strokeThickness: 10 } );
      //
      // pointsAdded.anchor.set( 0.5, 0.5 );
      // this.add.tween( pointsAdded ).to( { alpha: 0, y: randY - 50 }, 1000, Phaser.Easing.Linear.None, true );
      //
      // this.camera.shake( 0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true );
    }
  }, {
    key: 'gameoverScoreTween',
    value: function gameoverScoreTween() {
      var _this2 = this;

      var deathmsg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      this.screenGameoverScore.setText('');
      if (this.score) {
        this.tweenedPoints = this.score;
        var pointsTween = this.add.tween(this);
        pointsTween.to({ tweenedPoints: this.score }, 1000, Phaser.Easing.Linear.None, true, 500);
        pointsTween.onUpdateCallback(function () {
          _this2.screenGameoverScore.setText('Time survied on diet: ' + Math.floor(_this2.tweenedPoints) + '\n' + deathmsg);
        }, this);
        pointsTween.onComplete.addOnce(function () {
          _this2.screenGameoverScore.setText('Time survied on diet: ' + _this2.score);
          // this.spawnEmitter( this.screenGameoverScore, 'particle', 20, 300 );
        }, this);
        pointsTween.start();
      }
    }
  }, {
    key: 'spawnEmitter',
    value: function spawnEmitter(item, particle, number, lifespan, frequency, offsetX, offsetY, gravity) {
      offsetX = offsetX || 0;
      offsetY = offsetY || 0;
      lifespan = lifespan || 2000;
      frequency = frequency || 0;
      var emitter = this.game.add.emitter(item.x + offsetX, item.y + offsetY, number);
      emitter.maxParticles = number;
      emitter.makeParticles(particle);
      emitter.setXSpeed(-500, 500);
      emitter.setYSpeed(-700, 300);
      emitter.setScale(4, 1, 4, 1, 500, Phaser.Easing.Linear.None);
      emitter.gravity = gravity || 250;
      emitter.start(false, lifespan, frequency, number);
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
        if (food && food.body) {
          food.body.velocity.x = 0;
          food.body.velocity.y = 0;
        }
      });
      this.game.time.events.pause();
    }
  }, {
    key: 'restoreFoodMovement',
    value: function restoreFoodMovement() {
      this.foodContainer.forEach(function (food) {
        if (food && food.body) {
          food.body.velocity.x = food.velocityX;
          food.body.velocity.y = food.velocityY;
        }
      });
      this.game.time.events.resume();
    }
  }]);

  return Game;
}(Phaser.State);

exports.default = Game;

},{"../objects/Bob":4,"../objects/FoodSpawner":6,"../objects/NutritionManager":7,"../utils/AudioManager":16,"../utils/StorageManager":17}],11:[function(require,module,exports){
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

      var buttonAchievements = this.add.button(20, this.world.height - 20, 'button-achievements', this.clickAchievements, this, 1, 0, 2);
      buttonAchievements.anchor.set(0, 1);

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
      buttonAchievements.y = this.world.height + buttonAchievements.height + 20;
      this.add.tween(buttonAchievements).to({ y: this.world.height - 20 }, 500, Phaser.Easing.Exponential.Out, true);

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

},{"../utils/AudioManager":16,"../utils/StorageManager":17}],12:[function(require,module,exports){
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
  'image': [['background', 'img/background.png'], ['title', 'img/title.png'], ['logo-pigames', 'img/logo-pigames.png'], ['clickme', 'img/clickme.png'], ['overlay', 'img/overlay.png'], ['button-beer', 'img/button-beer.png'], ['particle', 'img/particle.png'], ['apple', 'img/assets/apple.png'], ['chicken', 'img/assets/chicken.png'], ['banana', 'img/assets/banana.png'], ['hamburger', 'img/assets/hamburger.png']],
  'spritesheet': [['button-start', 'img/button-start.png', 180, 180], ['button-continue', 'img/button-continue.png', 180, 180], ['button-mainmenu', 'img/button-mainmenu.png', 180, 180], ['button-restart', 'img/button-tryagain.png', 180, 180], ['button-achievements', 'img/button-achievements.png', 110, 110], ['button-pause', 'img/button-pause.png', 80, 80], ['button-audio', 'img/button-sound.png', 80, 80], ['button-back', 'img/button-back.png', 70, 70], ['bob', 'img/assets/bob.png', 460, 1370]],
  'audio': [['audio-click', ['sfx/audio-button.m4a', 'sfx/audio-button.mp3', 'sfx/audio-button.ogg']], ['audio-theme', ['sfx/music-bitsnbites-liver.m4a', 'sfx/music-bitsnbites-liver.mp3', 'sfx/music-bitsnbites-liver.ogg']]]
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

},{"../utils/AudioManager":16}],14:[function(require,module,exports){
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

var Wiki = function (_Phaser$State) {
  _inherits(Wiki, _Phaser$State);

  function Wiki() {
    _classCallCheck(this, Wiki);

    return _possibleConstructorReturn(this, (Wiki.__proto__ || Object.getPrototypeOf(Wiki)).apply(this, arguments));
  }

  _createClass(Wiki, [{
    key: 'create',
    value: function create() {
      var fontAchievements = { font: '32px Arial', fill: '#000' };
      this.add.text(100, 75, 'Achievements screen', fontAchievements);

      var buttonBack = this.add.button(this.world.width - 20, this.game.world.height - 20, 'button-back', this.clickBack, this, 1, 0, 2);
      buttonBack.anchor.set(1, 1);
      buttonBack.x = this.world.width + buttonBack.width + 20;
      this.add.tween(buttonBack).to({ x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true);
    }
  }, {
    key: 'clickBack',
    value: function clickBack() {
      (0, _AudioManager.playAudio)('click');
      this.game.state.start('MainMenu');
    }
  }]);

  return Wiki;
}(Phaser.State);

exports.default = Wiki;

},{"../utils/AudioManager":16}],15:[function(require,module,exports){
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

},{"./Boot":9,"./Game":10,"./MainMenu":11,"./Preloader":12,"./Story":13,"./Wiki":14}],16:[function(require,module,exports){
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

},{"./StorageManager":17}],17:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=game.js.map
