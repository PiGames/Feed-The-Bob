(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _UIConstants = require('../constants/UIConstants');

var _AudioManager = require('../utils/AudioManager');

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

var _StorageManager = require('../utils/StorageManager');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var GameUI = function () {
  function GameUI(state, Bob, NutritionManager) {
    _classCallCheck(this, GameUI);

    this.state = state;
    this.game = state.game;

    this.Bob = Bob;
    this.NutritionManager = NutritionManager;
    this.NutritionUI = NutritionManager.UI;

    this.stateStatus = 'playing';

    this.score = 0;
    this.timePassed = 0;
    this.runOnce = false;
    this.gamePaused = false;

    this.scoreValue = 3;

    this.timeAdvance = new Phaser.Signal();

    this.initScore();
    this.initHealthBar();
    this.initPauseScreen();
    this.initGameoverScreen();

    if (_StorageManager.PPTStorage.get('PPT-tutorial') !== true) {
      this.startTutorial();
    }
  }

  _createClass(GameUI, [{
    key: 'initScore',
    value: function initScore() {
      this.textScore = new _Text2.default(this.game, (0, _ScaleManager.$)(30), this.game.world.height - (0, _ScaleManager.$)(20), _i18n2.default.text('game_score') + ': ' + this.score, (0, _ScaleManager.$)(_UIConstants.SCORE_FONT), [0, 1]);

      this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.handlePointsAddition, this);
    }
  }, {
    key: 'initHealthBar',
    value: function initHealthBar() {
      this.healthBarText = new _Text2.default(this.game, (0, _ScaleManager.$)(30), this.game.world.height - (0, _ScaleManager.$)(100), _i18n2.default.text('game_health') + ': ', (0, _ScaleManager.$)(_UIConstants.SCORE_FONT), [0, 1]);

      this.healthBar = this.game.add.tileSprite(this.healthBarText.x + this.healthBarText.width, this.game.world.height - (0, _ScaleManager.$)(120), (0, _ScaleManager.$)(300), (0, _ScaleManager.$)(50), (0, _ScaleManager.$)('heart'));
      this.healthBar.anchor.setTo(0, 1);
      this.healthBar.scale.setTo(1.25);
    }
  }, {
    key: 'initPauseScreen',
    value: function initPauseScreen() {
      this.buttonPause = this.game.add.button(this.game.world.width - _UIConstants.MENU_BUTTON_OFFSET, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-pause'), this.managePause, this, 1, 0, 2);
      this.buttonPause.anchor.set(1, 0);
      this.buttonPause.input.priorityID = 0;

      this.buttonPause.y = -this.buttonPause.height - _UIConstants.MENU_BUTTON_OFFSET;
      this.game.add.tween(this.buttonPause).to({ y: _UIConstants.MENU_BUTTON_OFFSET }, 1000, Phaser.Easing.Exponential.Out, true);

      this.screenPausedGroup = this.game.add.group();
      this.screenPausedBg = this.game.add.sprite(0, 0, (0, _ScaleManager.$)('overlay'));
      this.screenPausedBg.scale.setTo(2);
      this.screenPausedBg.inputEnabled = true;
      this.screenPausedBg.input.priorityID = 1;

      this.screenPausedText = new _Text2.default(this.game, 'center', 'center', _i18n2.default.text('game_paused'), (0, _ScaleManager.$)(_UIConstants.PAUSE_TITLE_FONT));

      this.buttonAudio = this.game.add.button(this.game.world.width - _UIConstants.MENU_BUTTON_OFFSET, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-audio'), this.clickAudio, this, 1, 0, 2);
      this.buttonAudio.anchor.set(1, 0);
      this.buttonAudio.setFrames((0, _AudioManager.getAudioOffset)() + 1, (0, _AudioManager.getAudioOffset)() + 0, (0, _AudioManager.getAudioOffset)() + 2);
      this.buttonAudio.input.priorityID = 1;

      this.screenPausedBack = this.game.add.button(_UIConstants.MENU_BUTTON_OFFSET, this.game.world.height - _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-mainmenu'), this.stateBack, this, 1, 0, 2);
      this.screenPausedBack.anchor.set(0, 1);
      this.screenPausedBack.input.priorityID = 1;

      this.screenPausedContinue = this.game.add.button(this.game.world.width - _UIConstants.MENU_BUTTON_OFFSET, this.game.world.height - _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-continue'), this.managePause, this, 1, 0, 2);
      this.screenPausedContinue.anchor.set(1, 1);
      this.screenPausedContinue.scale.set(0.5);
      this.screenPausedContinue.input.priorityID = 1;

      this.screenPausedGroup.add(this.screenPausedBg);
      this.screenPausedGroup.add(this.screenPausedText);
      this.screenPausedGroup.add(this.buttonAudio);
      this.screenPausedGroup.add(this.screenPausedBack);
      this.screenPausedGroup.add(this.screenPausedContinue);
      this.screenPausedGroup.alpha = 0;
      this.screenPausedGroup.visible = false;
    }
  }, {
    key: 'initGameoverScreen',
    value: function initGameoverScreen() {
      this.screenGameoverGroup = this.game.add.group();

      this.screenGameoverBg = this.game.add.sprite(0, 0, (0, _ScaleManager.$)('overlay'));
      this.screenGameoverBg.scale.setTo(2);
      this.screenGameoverBg.inputEnabled = true;
      this.screenGameoverBg.input.priorityID = 2;

      this.screenGameoverText = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(100), _i18n2.default.text('game_over'), (0, _ScaleManager.$)(_UIConstants.GAMEOVER_TITLE_FONT));

      this.screenGameoverBack = this.game.add.button((0, _ScaleManager.$)(150), this.game.world.height - (0, _ScaleManager.$)(100), (0, _ScaleManager.$)('button-mainmenu'), this.stateBack, this, 1, 0, 2);
      this.screenGameoverBack.anchor.set(0, 1);
      this.screenGameoverBack.input.priorityID = 2;

      this.screenGameoverRestart = this.game.add.button(this.game.world.width - (0, _ScaleManager.$)(150), this.game.world.height - (0, _ScaleManager.$)(100), (0, _ScaleManager.$)('button-restart'), this.stateRestart, this, 1, 0, 2);
      this.screenGameoverRestart.anchor.set(1, 1);
      this.screenGameoverRestart.input.priorityID = 2;

      this.screenGameoverScore = new _Text2.default(this.game, 'center', 'center', _i18n2.default.text('game_score') + ': ' + this.score, (0, _ScaleManager.$)(_UIConstants.GAMEOVER_SCORE_FONT));

      this.screenGameoverGroup.add(this.screenGameoverBg);
      this.screenGameoverGroup.add(this.screenGameoverText);
      this.screenGameoverGroup.add(this.screenGameoverBack);
      this.screenGameoverGroup.add(this.screenGameoverRestart);
      this.screenGameoverGroup.add(this.screenGameoverScore);
      this.screenGameoverGroup.alpha = 0;
      this.screenGameoverGroup.visible = false;
    }
  }, {
    key: 'updateUI',
    value: function updateUI() {
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
        case 'tutorial':
          {
            if (!this.runOnce) {
              this.stateTutorial();
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
    key: 'onScoreValueChange',
    value: function onScoreValueChange(scoreValue) {
      this.scoreValue = scoreValue;
    }
  }, {
    key: 'updateHealthBarValue',
    value: function updateHealthBarValue(health) {
      var _this = this;

      if (health > 0) {
        this.NutritionUI.flash(function () {
          _this.healthBar.width = (0, _ScaleManager.$)(_UIConstants.HEALTHBAR_WIDTH) * (health / 100);
        });
      }
    }
  }, {
    key: 'difficultyChange',
    value: function difficultyChange() {
      var _this2 = this;

      var text = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(100), _i18n2.default.text('game_level_up'), (0, _ScaleManager.$)(_UIConstants.LEVEL_CHANGE_FONT));
      text.alpha = 0;
      var done = false;
      var textTween = this.game.add.tween(text);
      textTween.to({ alpha: 1 }, 200, Phaser.Easing.Linear.InOut, true);
      textTween.onComplete.add(function () {
        if (!done) {
          _this2.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
            textTween.to({ alpha: 0 }, 200, Phaser.Easing.Linear.InOut, true);
          });
        }
        done = true;
      }, this);
    }
  }, {
    key: 'handlePointsAddition',
    value: function handlePointsAddition() {
      this.timePassed++;
      this.score += this.scoreValue;
      this.textScore.setText(_i18n2.default.text('game_score') + ': ' + this.score);
      this.state.foodSpawner.tryDifficultyLevelUp(this.timePassed);
      this.timeAdvance.dispatch();
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
        this.state.stopMovingFood.call(this.state);
      } else {
        this.stateStatus = 'playing';
        this.runOnce = false;
        this.state.restoreFoodMovement.call(this.state);
      }
    }
  }, {
    key: 'startTutorial',
    value: function startTutorial() {
      this.gamePaused = !this.gamePaused;
      this.state.stopMovingFood.call(this.state);
      this.stateStatus = 'tutorial';
      this.runOnce = false;

      this.tutorialStep = 0;
      this.drawOverlay();
    }
  }, {
    key: 'furtherTutorial',
    value: function furtherTutorial() {
      this.tutorialStep += 1;
      this.runOnce = false;
    }
  }, {
    key: 'drawOverlay',
    value: function drawOverlay() {
      this.tutorialOverlay = this.game.add.group();

      this.graphics = this.game.add.graphics(0, 0);
      this.graphics.beginFill(0x000000, 0.5);
      this.graphics.lineTo(this.game.world.width, 0);
      this.graphics.lineTo(this.game.world.width, this.game.world.height);
      this.graphics.lineTo(0, this.game.world.height);
      this.graphics.endFill();
      this.graphics.inputEnabled = true;
      this.graphics.input.priorityID = 10;

      this.tutorialText = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(200), '', (0, _ScaleManager.$)(_UIConstants.TUTORIAL_FONT));

      this.continueTutorial = this.game.add.button(this.game.world.width - _UIConstants.MENU_BUTTON_OFFSET, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-continue'), this.furtherTutorial, this, 1, 0, 2);
      this.continueTutorial.anchor.set(1, 0);
      this.continueTutorial.scale.set(0.5);

      this.continueTutorial.y = -this.continueTutorial.height - _UIConstants.MENU_BUTTON_OFFSET;
      this.game.add.tween(this.continueTutorial).to({ y: _UIConstants.MENU_BUTTON_OFFSET }, 1000, Phaser.Easing.Exponential.Out, true);

      this.continueTutorial.input.priorityID = 11;

      this.tutorialOverlay.add(this.graphics);
      this.tutorialOverlay.add(this.continueTutorial);
    }
  }, {
    key: 'stateTutorial',
    value: function stateTutorial() {
      switch (this.tutorialStep) {
        case 0:
          {
            this.tutorialText.setText(_i18n2.default.text('tutorial_step_' + this.tutorialStep));

            this.game.world.bringToTop(this.tutorialOverlay);
            this.game.world.bringToTop(this.Bob);
            this.game.world.bringToTop(this.tutorialText);

            break;
          }
        case 1:
          {
            this.tutorialText.setText(_i18n2.default.text('tutorial_step_' + this.tutorialStep));

            this.game.world.bringToTop(this.tutorialOverlay);
            this.game.world.bringToTop(this.NutritionUI.NutritionBarsGroup);
            this.game.world.bringToTop(this.tutorialText);

            break;
          }
        case 2:
          {
            this.tutorialText.setText(_i18n2.default.text('tutorial_step_' + this.tutorialStep));

            this.game.world.bringToTop(this.tutorialOverlay);
            this.game.world.bringToTop(this.NutritionUI.NutritionBarsGroup);
            this.game.world.bringToTop(this.tutorialText);

            this.NutritionManager.nutrition.carbohydrates = 200;
            this.NutritionManager.nutrition.fats = 30;
            this.NutritionUI.updateUI();

            break;
          }
        case 3:
          {
            this.tutorialText.setText(_i18n2.default.text('tutorial_step_' + this.tutorialStep));

            this.game.world.bringToTop(this.tutorialOverlay);
            this.game.world.bringToTop(this.textScore);
            this.game.world.bringToTop(this.healthBar);
            this.game.world.bringToTop(this.healthBar);
            this.game.world.bringToTop(this.healthBarText);
            this.game.world.bringToTop(this.tutorialText);
            break;
          }
        case 4:
          {
            this.tutorialText.setText(_i18n2.default.text('tutorial_step_' + this.tutorialStep));

            this.game.world.bringToTop(this.tutorialOverlay);
            this.game.world.bringToTop(this.tutorialText);
            break;
          }
        case 5:
          {
            this.tutorialText.setText(_i18n2.default.text('tutorial_step_' + this.tutorialStep));

            this.game.world.bringToTop(this.tutorialOverlay);
            this.game.world.bringToTop(this.tutorialText);
            break;
          }
        case 6:
          {
            _StorageManager.PPTStorage.set('PPT-tutorial', true);
            this.stateRestart();
            break;
          }
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
    key: 'stateBack',
    value: function stateBack() {
      (0, _AudioManager.playAudio)('click');
      this.screenGameoverGroup.visible = false;
      this.gamePaused = false;
      this.runOnce = false;
      this.stateStatus = 'playing';
      this.game.time.events.resume();
      this.state.state.start('MainMenu');
    }
  }, {
    key: 'stateGameover',
    value: function stateGameover(msg) {
      this.state.stopMovingFood.call(this.state);
      this.game.world.bringToTop(this.screenGameoverGroup);
      this.screenGameoverScore.setText(_i18n2.default.text('game_score') + ': ' + this.score);
      this.gameoverScoreTween(msg);

      this.screenGameoverGroup.visible = true;
      var tween = this.game.add.tween(this.screenGameoverGroup);
      tween.to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);

      _StorageManager.PPTStorage.setHighscore('PPT-highscore', this.score);
    }
  }, {
    key: 'stateRestart',
    value: function stateRestart() {
      (0, _AudioManager.playAudio)('click');
      this.screenGameoverGroup.visible = false;
      this.gamePaused = false;
      this.runOnce = false;
      this.stateStatus = 'playing';
      this.state.restoreFoodMovement.call(this.state);
      this.state.state.restart(true);
    }
  }, {
    key: 'gameoverScoreTween',
    value: function gameoverScoreTween() {
      var deathmsg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      this.screenGameoverScore.setText('');

      this.screenGameoverScore.setText(_i18n2.default.text('game_over_text', this.score, deathmsg));
    }
  }, {
    key: 'clickAudio',
    value: function clickAudio() {
      (0, _AudioManager.playAudio)('click');
      (0, _AudioManager.manageAudio)('switch', this);
    }
  }]);

  return GameUI;
}();

exports.default = GameUI;

},{"../constants/UIConstants":9,"../utils/AudioManager":30,"../utils/ScaleManager":34,"../utils/StorageManager":35,"../utils/i18n":36,"./Text":3}],2:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _NutritionUtils = require('../utils/NutritionUtils');

var _NutritionConstants = require('../constants/NutritionConstants');

var _WeightBreakpoints = require('../constants/WeightBreakpoints');

var _UIConstants = require('../constants/UIConstants');

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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

    this.NutritionBarsGroup = this.game.add.group();

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
      var capitalise = function capitalise(text) {
        return text.substring(0, 1).toUpperCase() + text.substring(1);
      };

      this.drawBar(this.nutrition.carbohydrates, _NutritionConstants.GOOD_AMOUNT_OF_CARBOHYDRATES, 2, capitalise(_i18n2.default.text('carbohydrates_name')));
      this.drawBar(this.nutrition.fats, _NutritionConstants.GOOD_AMOUNT_OF_FATS, 1, capitalise(_i18n2.default.text('fats_name')));
      this.drawBar(this.nutrition.proteins, _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS, 0, capitalise(_i18n2.default.text('proteins_name')));
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

      var height = (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_HEIGHT);
      var offset = i * ((0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_OFFSET) + height);

      var textX = this.game.width - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_X_FROM_LEFT) - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_TEXT_OFFSET_X) - (0, _ScaleManager.$)(10, 0.5);
      var textY = this.game.height - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM) - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_TEXT_OFFSET_Y) - offset;
      var nutritionAdded = new _Text2.default(this.game, textX, textY, '+' + val, (0, _ScaleManager.$)(_UIConstants.NUTRITION_NUTRITION_ADDED_FONT), [1, 1]);
      this.game.add.tween(nutritionAdded).to({ alpha: 0, y: textY - (0, _ScaleManager.$)(100) }, (0, _ScaleManager.$)(1000), Phaser.Easing.Linear.None, true);
    }
  }, {
    key: 'updateBar',
    value: function updateBar(value, goodAmount, i) {
      var width = (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_WIDTH);
      var height = (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_HEIGHT);
      var offset = i * ((0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_OFFSET) + height);
      var doubleOfGoodAmount = goodAmount * 2;

      var status = this.NutritionBars[i];
      var bobStatus = (0, _NutritionUtils.getStatus)(value, goodAmount);

      if (bobStatus <= _WeightBreakpoints.SUPER_THIN_BREAKPOINT || bobStatus >= _WeightBreakpoints.SUPER_FAT_BREAKPOINT) {
        status.frame = 2;
      } else if (bobStatus <= _WeightBreakpoints.THIN_BREAKPOINT || bobStatus >= _WeightBreakpoints.FAT_BREAKPOINT) {
        status.frame = 1;
      } else {
        status.frame = 0;
      }

      var NutritionBarValue = Math.min(Math.max(value / doubleOfGoodAmount, 0), 1);

      var mask = this.NutritionMasks[i];
      mask.clear();
      mask.beginFill(0x000000);
      mask.drawRect(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT - width + width * (1 - NutritionBarValue), this.game.height - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM) - offset - height, width * NutritionBarValue, height);
      mask.endFill();

      var statusText = this.NutritionTexts[i];
      statusText.setText(parseInt(Math.max(value, 0)) + ' / ' + goodAmount);
    }
  }, {
    key: 'drawBar',
    value: function drawBar(value, goodAmount, i, text) {
      var width = (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_WIDTH);
      var height = (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_HEIGHT);
      var offset = i * ((0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_OFFSET) + height);
      var doubleOfGoodAmount = goodAmount * 2;

      var NutritionBarValue = Math.min(Math.max(value / doubleOfGoodAmount, 0), 1);

      var background = this.game.add.sprite(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT, this.game.height - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM) - offset, (0, _ScaleManager.$)('nutrition-bar-background'));
      background.anchor.setTo(1, 1);

      var indicators = this.game.add.group();

      var backgroundNeutralX = background.x - background.width + _UIConstants.NUTRITION_BAR_BORDER_WIDTH;
      var backgroundNeutralY = background.y - background.height + _UIConstants.NUTRITION_BAR_BORDER_WIDTH;

      var superThinIndicator = this.game.add.sprite(background.width / 2 / _WeightBreakpoints.THINNESS_LEVELS.length * (_WeightBreakpoints.THINNESS_LEVELS.length - _WeightBreakpoints.SUPER_THIN_BREAKPOINT) + background.width / 2 + backgroundNeutralX, backgroundNeutralY, (0, _ScaleManager.$)('nutrition-bar-indicator'));
      superThinIndicator.anchor.setTo(0.5, 0);

      var thinIndicator = this.game.add.sprite(background.width / 2 / _WeightBreakpoints.THINNESS_LEVELS.length * (_WeightBreakpoints.THINNESS_LEVELS.length - _WeightBreakpoints.THIN_BREAKPOINT) + background.width / 2 + backgroundNeutralX, backgroundNeutralY, (0, _ScaleManager.$)('nutrition-bar-indicator'));
      thinIndicator.anchor.setTo(0.5, 0);

      var superFatIndicator = this.game.add.sprite(background.width / 2 / _WeightBreakpoints.FATNESS_LEVELS.length * (_WeightBreakpoints.THINNESS_LEVELS.length + _WeightBreakpoints.FATNESS_LEVELS.length - _WeightBreakpoints.SUPER_FAT_BREAKPOINT) + backgroundNeutralX, backgroundNeutralY, (0, _ScaleManager.$)('nutrition-bar-indicator'));
      superFatIndicator.anchor.setTo(0.5, 0);

      var fatIndicator = this.game.add.sprite(background.width / 2 / _WeightBreakpoints.FATNESS_LEVELS.length * (_WeightBreakpoints.THINNESS_LEVELS.length + _WeightBreakpoints.FATNESS_LEVELS.length - _WeightBreakpoints.FAT_BREAKPOINT) + backgroundNeutralX, backgroundNeutralY, (0, _ScaleManager.$)('nutrition-bar-indicator'));
      fatIndicator.anchor.setTo(0.5, 0);

      indicators.add(superThinIndicator);
      indicators.add(thinIndicator);
      indicators.add(superFatIndicator);
      indicators.add(fatIndicator);

      var mask = this.game.add.graphics(0, 0);
      mask.beginFill(0x000000);
      mask.drawRect(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT - width + width * (1 - NutritionBarValue), this.game.height - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM) - offset - height, width * NutritionBarValue, height);
      mask.endFill();

      this.NutritionMasks[i] = mask;

      var status = this.game.add.sprite(this.game.width - _UIConstants.NUTRITION_BAR_X_FROM_LEFT, this.game.height - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM) - offset, (0, _ScaleManager.$)('nutrition-bar'), 0);
      status.anchor.setTo(1, 1);
      status.mask = mask;

      this.NutritionBars[i] = status;

      var descText = new _Text2.default(this.game, this.game.width - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_X_FROM_LEFT) + (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_TEXT_OFFSET_X) - width - (0, _ScaleManager.$)(10, 0.5), this.game.height - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM) - offset - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_TEXT_OFFSET_Y) + (0, _ScaleManager.$)(3, 0.5), text, (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_INFO_FONT), [0, 1]);

      var statusText = new _Text2.default(this.game, this.game.width - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_X_FROM_LEFT) - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_TEXT_OFFSET_X) - (0, _ScaleManager.$)(10, 0.5), this.game.height - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_Y_FROM_BOTTOM) - offset - (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_TEXT_OFFSET_Y) + (0, _ScaleManager.$)(3, 0.5), Math.max(parseInt(value), 0) + ' / ' + goodAmount, (0, _ScaleManager.$)(_UIConstants.NUTRITION_BAR_INFO_FONT), [1, 1]);

      this.NutritionTexts[i] = statusText;

      this.NutritionBarsGroup.add(background);
      this.NutritionBarsGroup.add(indicators);
      this.NutritionBarsGroup.add(mask);
      this.NutritionBarsGroup.add(status);
      this.NutritionBarsGroup.add(statusText);
      this.NutritionBarsGroup.add(descText);
    }
  }, {
    key: 'flash',
    value: function flash(callback) {
      var flashLength = 100;
      var status = 0;
      this.NutritionBars.forEach(function (sprite) {
        status = Math.max(sprite.frame, status);
      });

      var flash = this.game.add.graphics(0, 0);
      if (status === 2) {
        this.game.camera.shake(0.002, 200);
        flash.beginFill(0xc50000, 0.8);
      } else if (status === 1) {
        this.game.camera.shake(0.001, 200);
        flash.beginFill(0xf1d137, 0.75);
      }

      flash.drawRect(0, 0, this.game.world.width, this.game.world.height);
      flash.alpha = 0;
      var done = false;
      var flashTween = this.game.add.tween(flash);
      flashTween.to({ alpha: 1 }, flashLength / 2, Phaser.Easing.Linear.In, true);
      flashTween.onComplete.add(function () {
        if (!done) {
          callback();
          flashTween.to({ alpha: 0 }, flashLength / 2, Phaser.Easing.Linear.Out, true);
          done = true;
        }
      }, this);
    }
  }]);

  return NutritionUI;
}();

exports.default = NutritionUI;

},{"../constants/NutritionConstants":8,"../constants/UIConstants":9,"../constants/WeightBreakpoints":10,"../utils/NutritionUtils":33,"../utils/ScaleManager":34,"../utils/i18n":36,"./Text":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var Text = function (_Phaser$Text) {
  _inherits(Text, _Phaser$Text);

  function Text(game) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var text = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var anchor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [0, 0];

    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, game, x, y, text, style));

    var newAnchor = anchor;

    if (x === 'center') {
      _this.x = game.world.centerX;
      newAnchor[0] = newAnchor[0] || 0.5;
    }

    if (y === 'center') {
      _this.y = game.world.centerY;
      newAnchor[1] = newAnchor[1] || 0.5;
    }

    if (style.shadow) {
      var shadow = style.shadow.match(/rgba\(.+\)|[^ ]+/g);
      _this.setShadow.apply(_this, shadow);
    }

    _this.anchor.setTo(newAnchor[0], newAnchor[1]);
    game.add.existing(_this);
    return _this;
  }

  return Text;
}(Phaser.Text);

exports.default = Text;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BOB_OFFSET_Y = exports.BOB_OFFSET_Y = 10;
var BOB_SCALE = exports.BOB_SCALE = 0.75;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CANVAS_WIDTH = exports.CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT = exports.CANVAS_HEIGHT = 1280;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TIME_TO_REACH_MEDIUM_LEVEL = exports.TIME_TO_REACH_MEDIUM_LEVEL = 30;
var TIME_TO_REACH_HARD_LEVEL = exports.TIME_TO_REACH_HARD_LEVEL = 60;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOOD_DATA = exports.FOOD_HIT_AREA_DIAMETER = exports.ADDITIONAL_FOOD_SPAWN_INTERVAL = exports.FOOD_HEIGHT = exports.FOOD_WIDTH = exports.FOOD_SPAWN_BOUNDS_HEIGHT_MARGIN = exports.FOOD_SPAWN_BOUNDS_WIDTH_MARGIN = exports.HARD_LEVEL_FOOD_SPAWN_DELAY_OFFSET = exports.MEDIUM_LEVEL_FOOD_SPAWN_DELAY_OFFSET = exports.FOOD_SPAWN_INTERVAL = exports.FOOD_TWEEN_Y = exports.FOOD_TWEEN_X = exports.FOOD_TWEEN_SCALE = exports.FOOD_TWEEN_SPEED = exports.FOOD_SCALE = exports.HARD_LEVEL_VELOCITY_OFFSET = exports.MEDIUM_LEVEL_VELOCITY_OFFSET = exports.MAX_FOOD_VELOCITY = exports.MIN_FOOD_VELOCITY = undefined;

var _BobConstants = require('./BobConstants');

var MIN_FOOD_VELOCITY = exports.MIN_FOOD_VELOCITY = 190;
var MAX_FOOD_VELOCITY = exports.MAX_FOOD_VELOCITY = 230;

var MEDIUM_LEVEL_VELOCITY_OFFSET = exports.MEDIUM_LEVEL_VELOCITY_OFFSET = 60;
var HARD_LEVEL_VELOCITY_OFFSET = exports.HARD_LEVEL_VELOCITY_OFFSET = 120;

var FOOD_SCALE = exports.FOOD_SCALE = 1;

var FOOD_TWEEN_SPEED = exports.FOOD_TWEEN_SPEED = 500;
var FOOD_TWEEN_SCALE = exports.FOOD_TWEEN_SCALE = 0.75;
var FOOD_TWEEN_X = exports.FOOD_TWEEN_X = 0;
var FOOD_TWEEN_Y = exports.FOOD_TWEEN_Y = 560 * _BobConstants.BOB_SCALE + _BobConstants.BOB_OFFSET_Y;

var FOOD_SPAWN_INTERVAL = exports.FOOD_SPAWN_INTERVAL = 1.2 * Phaser.Timer.SECOND;
var MEDIUM_LEVEL_FOOD_SPAWN_DELAY_OFFSET = exports.MEDIUM_LEVEL_FOOD_SPAWN_DELAY_OFFSET = 0.2 * Phaser.Timer.SECOND;
var HARD_LEVEL_FOOD_SPAWN_DELAY_OFFSET = exports.HARD_LEVEL_FOOD_SPAWN_DELAY_OFFSET = 0.6 * Phaser.Timer.SECOND;
var FOOD_SPAWN_BOUNDS_WIDTH_MARGIN = exports.FOOD_SPAWN_BOUNDS_WIDTH_MARGIN = 200;
var FOOD_SPAWN_BOUNDS_HEIGHT_MARGIN = exports.FOOD_SPAWN_BOUNDS_HEIGHT_MARGIN = 100;

var FOOD_WIDTH = exports.FOOD_WIDTH = 100;
var FOOD_HEIGHT = exports.FOOD_HEIGHT = 75;

var ADDITIONAL_FOOD_SPAWN_INTERVAL = exports.ADDITIONAL_FOOD_SPAWN_INTERVAL = 5 * FOOD_SPAWN_INTERVAL;

var FOOD_HIT_AREA_DIAMETER = exports.FOOD_HIT_AREA_DIAMETER = 250;

var FOOD_DATA = exports.FOOD_DATA = Object.freeze([
// Complexity lv. 1
{ 'key': 0, 'name': 'products_apple', 'nutritionFacts': { 'carbohydrates': 18, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 2, 'quantity': ['products_quantity_big_apple', 1] }, { 'key': 4, 'name': 'products_butter', 'nutritionFacts': { 'carbohydrates': 0, 'fats': 20, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1, 'quantity': ['products_quantity_spoon', 2] }, { 'key': 7, 'name': 'products_strawberry_jam', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1.5, 'quantity': ['products_quantity_spoon', 3] }, { 'key': 2, 'name': 'products_chicken', 'nutritionFacts': { 'carbohydrates': 0, 'fats': 3, 'proteins': 15 }, 'complexityLevel': 1, 'probability': 1, 'quantity': ['products_quantity_gram', 50] },

// Complexity lv. 2
{ 'key': 5, 'name': 'products_donut', 'nutritionFacts': { 'carbohydrates': 25, 'fats': 12, 'proteins': 2 }, 'complexityLevel': 2, 'probability': 1, 'quantity': ['products_quantity_donut', 1] }, { 'key': 1, 'name': 'products_banana', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 2, 'proteins': 0 }, 'complexityLevel': 2, 'probability': 1.5, 'quantity': ['products_quantity_banana', 1] }, { 'key': 9, 'name': 'products_eggs', 'nutritionFacts': { 'carbohydrates': 1, 'fats': 16, 'proteins': 15 }, 'complexityLevel': 2, 'probability': 1, 'quantity': ['products_quantity_egg', 2] },

// Complexity lv. 3
{ 'key': 3, 'name': 'products_hamburger', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 13, 'proteins': 16 }, 'complexityLevel': 3, 'probability': 1, 'quantity': ['products_quantity_hamburger', 1] }, { 'key': 8, 'name': 'products_peanut_butter', 'nutritionFacts': { 'carbohydrates': 6, 'fats': 16, 'proteins': 8 }, 'complexityLevel': 3, 'probability': 1, 'quantity': ['products_quantity_spoon', 2] }, { 'key': 6, 'name': 'products_milk', 'nutritionFacts': { 'carbohydrates': 12, 'fats': 8, 'proteins': 8 }, 'complexityLevel': 3, 'probability': 1, 'quantity': ['products_quantity_cup', 1] }]);

},{"./BobConstants":4}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GOOD_AMOUNT_OF_CARBOHYDRATES = exports.GOOD_AMOUNT_OF_CARBOHYDRATES = 270;
var GOOD_AMOUNT_OF_FATS = exports.GOOD_AMOUNT_OF_FATS = 70;
var GOOD_AMOUNT_OF_PROTEINS = exports.GOOD_AMOUNT_OF_PROTEINS = 50;

var AMOUNT_REDUCED_INTERVAL = exports.AMOUNT_REDUCED_INTERVAL = Phaser.Timer.SECOND;
var AMOUNT_REDUCED_PERCENT = exports.AMOUNT_REDUCED_PERCENT = 0.03;

var MEDIUM_LEVEL_DELAY_OFFSET = exports.MEDIUM_LEVEL_DELAY_OFFSET = 0.2 * Phaser.Timer.SECOND;
var HARD_LEVEL_DELAY_OFFSET = exports.HARD_LEVEL_DELAY_OFFSET = 0.4 * Phaser.Timer.SECOND;

},{}],9:[function(require,module,exports){
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
var NUTRITION_BAR_BORDER_WIDTH = exports.NUTRITION_BAR_BORDER_WIDTH = 2;

var HEALTHBAR_WIDTH = exports.HEALTHBAR_WIDTH = 300;

var NUTRITION_BAR_INFO_FONT = exports.NUTRITION_BAR_INFO_FONT = { font: 'Bromine', fontSize: 32, fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var NUTRITION_NUTRITION_ADDED_FONT = exports.NUTRITION_NUTRITION_ADDED_FONT = { font: 'Bromine', fontSize: 40, fill: '#fff', stroke: '#000', strokeThickness: 6, shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var SCORE_FONT = exports.SCORE_FONT = { font: 'Bromine', fontSize: 64, fill: '#fff', stroke: '#000', strokeThickness: 6, shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var PAUSE_TITLE_FONT = exports.PAUSE_TITLE_FONT = { font: 'Bromine', fontSize: 112, fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 30' };

var GAMEOVER_TITLE_FONT = exports.GAMEOVER_TITLE_FONT = { font: 'Bromine', fontSize: 112, fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var GAMEOVER_SCORE_FONT = exports.GAMEOVER_SCORE_FONT = { font: 'Bromine', fontSize: 64, fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var MENU_HIGHSCORE_FONT = exports.MENU_HIGHSCORE_FONT = { font: 'Bromine', fontSize: 56, fill: '#fff', stroke: '#000', strokeThickness: 3, align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var TITLE_OFFSET_Y = exports.TITLE_OFFSET_Y = 100;
var MENU_BUTTON_OFFSET = exports.MENU_BUTTON_OFFSET = 20;

var WIKI_TITLE_FONT = exports.WIKI_TITLE_FONT = { font: 'Bromine', fontSize: 96, fill: '#000', align: 'center' };
var WIKI_FONT = exports.WIKI_FONT = { font: 'Bromine', fontSize: 56, fill: '#000', align: 'center' };

var CREDITS_TITLE_FONT = exports.CREDITS_TITLE_FONT = { font: 'Bromine', fontSize: 104, fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10', stroke: '#000', strokeThickness: 3 };
var CREDITS_FONT = exports.CREDITS_FONT = { font: 'Bromine', fontSize: 56, fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10', stroke: '#000', strokeThickness: 3 };
var CREDITS_FONT_SMALL = exports.CREDITS_FONT_SMALL = { font: 'Bromine', fontSize: 36, fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10', stroke: '#000', strokeThickness: 3 };

var TUTORIAL_FONT = exports.TUTORIAL_FONT = { font: 'Bromine', fontSize: 56, fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10', stroke: '#000', strokeThickness: 3 };

var LEVEL_CHANGE_FONT = exports.LEVEL_CHANGE_FONT = { font: 'Bromine', fontSize: 80, fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10', stroke: '#000', strokeThickness: 3 };

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SUPER_THIN_BREAKPOINT = exports.SUPER_THIN_BREAKPOINT = 4;
var THIN_BREAKPOINT = exports.THIN_BREAKPOINT = 6;
var FAT_BREAKPOINT = exports.FAT_BREAKPOINT = 10;
var SUPER_FAT_BREAKPOINT = exports.SUPER_FAT_BREAKPOINT = 12;

var THINNESS_LEVELS = exports.THINNESS_LEVELS = [];
var d = 0;
for (var i = 0; i < 8; i++) {
  THINNESS_LEVELS.push(d++ / 8);
}

var FATNESS_LEVELS = exports.FATNESS_LEVELS = [];
d = 7;
for (var _i = 0; _i < 6; _i++) {
  FATNESS_LEVELS.push(d++ / 6);
}
FATNESS_LEVELS.reverse();

},{}],11:[function(require,module,exports){
'use strict';

var _states = require('./states');

var _states2 = _interopRequireDefault(_states);

var _CanvasConstants = require('./constants/CanvasConstants');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var game = new Phaser.Game(_CanvasConstants.CANVAS_WIDTH, _CanvasConstants.CANVAS_HEIGHT, Phaser.AUTO);
var states = {
  'Boot': _states2.default.Boot,
  'Preloader': _states2.default.Preloader,
  'MainMenu': _states2.default.MainMenu,
  'Wiki': _states2.default.Wiki,
  'Game': _states2.default.Game,
  'Credits': _states2.default.Credits
};
for (var stateName in states) {
  game.state.add(stateName, states[stateName]);
}
game.state.start('Boot');

},{"./constants/CanvasConstants":5,"./states":29}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var de_de = {
  quote_types: {
    opening: '„',
    closing: '”'
  },
  main_menu_highscore: {
    text: 'Bestes Ergebnis'
  },
  carbohydrates_name: {
    text: 'Kohlenhydrate'
  },
  fats_name: {
    text: 'Fette'
  },
  proteins_name: {
    text: 'Proteine'
  },
  wiki_quantity: {
    text: 'Menge'
  },

  products_apple: {
    text: 'Apfel'
  },
  products_butter: {
    text: 'Butter'
  },
  products_strawberry_jam: {
    text: 'Erdbeermarmelade'
  },
  products_chicken: {
    text: 'Chicken'
  },
  products_donut: {
    text: 'Donut'
  },
  products_banana: {
    text: 'Banane'
  },
  products_eggs: {
    text: 'Eier'
  },
  products_hamburger: {
    text: 'Hamburger'
  },
  products_peanut_butter: {
    text: 'Nuss-Nugat-Creme'
  },
  products_milk: {
    text: 'Milch'
  },
  products_quantity_big_apple: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' ein gro\xDFer Apfel';
      } else if (quantity < 5) {
        return quantity + ' gro\xDFe Apfel';
      } else {
        return quantity + ' gro\xDFe Apfel';
      }
    }
  },
  products_quantity_spoon: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' L\xF6ffel';
      } else if (quantity < 5) {
        return quantity + ' L\xF6ffel';
      } else {
        return quantity + ' L\xF6ffel';
      }
    }
  },
  products_quantity_gram: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' Gramm';
      } else if (quantity < 5) {
        return quantity + ' Gramm';
      } else {
        return quantity + ' Gramm';
      }
    }
  },
  products_quantity_donut: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' Donat';
      } else if (quantity < 5) {
        return quantity + ' Donats';
      } else {
        return quantity + ' Donats';
      }
    }
  },
  products_quantity_banana: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' Banane';
      } else if (quantity < 5) {
        return quantity + ' Bananen';
      } else {
        return quantity + ' Bananen';
      }
    }
  },
  products_quantity_egg: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' Ei';
      } else if (quantity < 5) {
        return quantity + ' Eier';
      } else {
        return quantity + ' Eier';
      }
    }
  },
  products_quantity_hamburger: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' Hamburger';
      } else if (quantity < 5) {
        return quantity + ' Hamburger';
      } else {
        return quantity + ' Hamburger';
      }
    }
  },
  products_quantity_cup: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' Glas';
      } else if (quantity < 5) {
        return quantity + ' Gl\xE4ser';
      } else {
        return quantity + ' Gl\xE4ser';
      }
    }
  },

  tutorial_step_0: {
    text: 'Das ist Bob.\nHelf ihm dabei sein Körpergewicht zu halten. '
  },
  tutorial_step_1: {
    text: 'Das sind die Nährstoffanzeiger von Bob.\nWenn der Hintergrund der Anzeige grün ist,\ndann ist Bob gesund und du bekommst Punkte'
  },
  tutorial_step_2: {
    text: 'Die Anzeige wird gelb,\nwenn Bob zu wenige oder zu viele Nährstoffe bekommt.\nWenn du dann nicht handelst, verliert Bob leben und die\nAnzeige kann auf rot wechseln!'
  },
  tutorial_step_3: {
    text: 'Bob hat einen Lebensgürtel.\nEr verliert Energie, wenn du auf gelde und\nrote Makroelemente-Felder kommst.'
  },
  tutorial_step_4: {
    text: 'Jedes Essen hat bestimmte Eingeschafte,\ndie in der "Encyklopädie" im Hauptmenü zu fonden sind.\nWenn du die Eigenschaften des Essens kennst,\nweißt du wie du Bob füttern musst.'
  },
  tutorial_step_5: {
    text: 'Das war das Tutorial, jetzt kannst du endlich anfangen zu spielen!'
  },

  game_health: {
    text: 'Leben'
  },
  game_score: {
    text: 'Ergebnis'
  },
  game_paused: {
    text: 'Pause'
  },
  game_level_up: {
    text: 'Es geht dir jedes mal besser!,\ndas Spiel wird schwieriger!'
  },
  game_over: {
    text: 'Game Over'
  },
  game_over_text: {
    text: function text(args) {
      var secondNumberSuffix = function secondNumberSuffix(time) {
        return time > 1 ? 'e' : '';
      };

      return 'Du hast ' + Math.floor(args[0]) + 'eereicht punkt' + secondNumberSuffix(args[0]) + '\nund Du bist wegen: ' + args[1] + 'gestorben.';
    }
  },
  game_deathtype_dangerous_nutrition_style: {
    text: 'Gefährlicher Ernährungstil'
  },

  credits_title: {
    text: 'Autoren'
  },
  credits_code: {
    text: 'Code'
  },
  credits_graphics: {
    text: 'Grafik'
  },
  credits_sound: {
    text: 'Sound'
  },
  credits_translators: {
    text: 'Übersetzung'
  },
  credits_lang_de: {
    text: 'Deutsch'
  },

  credits_by: {
    text: 'von'
  }
};

exports.default = de_de;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var en_gb = {
  quote_types: {
    opening: '’',
    closing: '’'
  },
  main_menu_highscore: {
    text: 'Highscore'
  },
  carbohydrates_name: {
    text: 'carbohydrates'
  },
  fats_name: {
    text: 'fats'
  },
  proteins_name: {
    text: 'proteins'
  },
  wiki_quantity: {
    text: 'quantity'
  },

  products_apple: {
    text: 'apple'
  },
  products_butter: {
    text: 'butter'
  },
  products_strawberry_jam: {
    text: 'strawberry jam'
  },
  products_chicken: {
    text: 'chicken'
  },
  products_donut: {
    text: 'donut'
  },
  products_banana: {
    text: 'banana'
  },
  products_eggs: {
    text: 'eggs'
  },
  products_hamburger: {
    text: 'hamburger'
  },
  products_peanut_butter: {
    text: 'peanut butter'
  },
  products_milk: {
    text: 'milk'
  },
  products_quantity_big_apple: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' big apple';
      } else {
        return quantity + ' big apples';
      }
    }
  },
  products_quantity_spoon: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' spoon';
      } else {
        return quantity + ' spoons';
      }
    }
  },
  products_quantity_gram: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' gram';
      } else {
        return quantity + ' grams';
      }
    }
  },
  products_quantity_donut: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' donut';
      } else {
        return quantity + ' donuts';
      }
    }
  },
  products_quantity_banana: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' banana';
      } else {
        return quantity + ' bananas';
      }
    }
  },
  products_quantity_egg: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' egg';
      } else {
        return quantity + ' eggs';
      }
    }
  },
  products_quantity_hamburger: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' hamburger';
      } else {
        return quantity + ' hamburgers';
      }
    }
  },
  products_quantity_cup: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' cup';
      } else {
        return quantity + ' cups';
      }
    }
  },

  tutorial_step_0: {
    text: 'This is Bob.\nYour job is to help him\nmaintain his current weight.'
  },
  tutorial_step_1: {
    text: 'These are Bob’s current macroelements indicators.\nBy keeping them green you keep Bob healthy and score points.'
  },
  tutorial_step_2: {
    text: 'Bob’s macroelements indicators will turn\nyellow and eventually red if you overfeed\nhim with a certain type of macroelement\nor if you dont’t feed him with it.'
  },
  tutorial_step_3: {
    text: 'Bob has his own health bar,\nits value drops when you enter yellow\nor red zone on macroelement indicator.'
  },
  tutorial_step_4: {
    text: 'Every food has its own nutrition\ninfo in Wiki section availible from the menu.\nKnowing what macroelements food consists of,\nyou can be sure that you will feed Bob properly.'
  },
  tutorial_step_5: {
    text: 'This is the end of tutorial. You can now enjoy the game!'
  },

  game_health: {
    text: 'Health'
  },
  game_score: {
    text: 'Score'
  },
  game_paused: {
    text: 'Paused'
  },
  game_level_up: {
    text: 'You are getting better!\nSo game is gonna become harder!'
  },
  game_over: {
    text: 'Game over'
  },

  game_over_text: {
    text: function text(args) {
      // args[ 0 ] => score
      // args[ 1 ] => deathtype

      var secondNumberSuffix = function secondNumberSuffix(time) {
        return time === 1 ? '' : 's';
      };

      return 'You have scored ' + Math.floor(args[0]) + ' point' + secondNumberSuffix(args[0]) + '\nand died from ' + args[1];
    }
  },
  game_deathtype_dangerous_nutrition_style: {
    text: 'dangerous nutrition style'
  },

  credits_title: {
    text: 'Credits'
  },
  credits_code: {
    text: 'Coding'
  },
  credits_graphics: {
    text: 'Graphics'
  },
  credits_sound: {
    text: 'Sounds'
  },
  credits_translators: {
    text: 'Translators'
  },
  credits_lang_de: {
    text: 'German'
  },
  credits_by: {
    text: 'by'
  }
};

exports.default = en_gb;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _en_gb = require('./en_gb.js');

var _en_gb2 = _interopRequireDefault(_en_gb);

var _pl_pl = require('./pl_pl.js');

var _pl_pl2 = _interopRequireDefault(_pl_pl);

var _de_de = require('./de_de.js');

var _de_de2 = _interopRequireDefault(_de_de);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var langFile = {
  en_gb: _en_gb2.default,
  pl_pl: _pl_pl2.default,
  de_de: _de_de2.default
};

exports.default = langFile;

},{"./de_de.js":12,"./en_gb.js":13,"./pl_pl.js":15}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pl_pl = {
  quote_types: {
    opening: '„',
    closing: '”'
  },
  main_menu_highscore: {
    text: 'Najwyższy wynik'
  },
  carbohydrates_name: {
    text: 'węglowodany'
  },
  fats_name: {
    text: 'tłuszcze'
  },
  proteins_name: {
    text: 'białko'
  },
  wiki_quantity: {
    text: 'ilość'
  },

  products_apple: {
    text: 'jabłko'
  },
  products_butter: {
    text: 'masło'
  },
  products_strawberry_jam: {
    text: 'dżem truskawkowy'
  },
  products_chicken: {
    text: 'kurczak'
  },
  products_donut: {
    text: 'donut'
  },
  products_banana: {
    text: 'banan'
  },
  products_eggs: {
    text: 'jajka'
  },
  products_hamburger: {
    text: 'hamburger'
  },
  products_peanut_butter: {
    text: 'masło orzechowe'
  },
  products_milk: {
    text: 'mleko'
  },
  products_quantity_big_apple: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' du\u017Ce jab\u0142ko';
      } else if (quantity < 5) {
        return quantity + ' du\u017Ce jab\u0142ka';
      } else {
        return quantity + ' du\u017Cych jab\u0142ek';
      }
    }
  },
  products_quantity_spoon: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' \u0142y\u017Cka';
      } else if (quantity < 5) {
        return quantity + ' \u0142y\u017Cki';
      } else {
        return quantity + ' \u0142y\u017Cek';
      }
    }
  },
  products_quantity_gram: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' gram';
      } else if (quantity < 5) {
        return quantity + ' gramy';
      } else {
        return quantity + ' gram\xF3w';
      }
    }
  },
  products_quantity_donut: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' donut';
      } else if (quantity < 5) {
        return quantity + ' donuty';
      } else {
        return quantity + ' donut\xF3w';
      }
    }
  },
  products_quantity_banana: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' banan';
      } else if (quantity < 5) {
        return quantity + ' banany';
      } else {
        return quantity + ' banan\xF3w';
      }
    }
  },
  products_quantity_egg: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' jajko';
      } else if (quantity < 5) {
        return quantity + ' jajka';
      } else {
        return quantity + ' jajek';
      }
    }
  },
  products_quantity_hamburger: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' hamburger';
      } else if (quantity < 5) {
        return quantity + ' hamburgery';
      } else {
        return quantity + ' hamburger\xF3w';
      }
    }
  },
  products_quantity_cup: {
    text: function text(args) {
      var quantity = args[0];
      if (quantity === 1) {
        return quantity + ' szklanka';
      } else if (quantity < 5) {
        return quantity + ' szklanki';
      } else {
        return quantity + ' szklanek';
      }
    }
  },

  tutorial_step_0: {
    text: 'To jest Bob.\nTwoim zadaniem jest pomóc mu\nutrzymać jego obecną wagę.'
  },
  tutorial_step_1: {
    text: 'To są wskaźniki stanu makroelementów Boba.\nPoprzez utrzymywanie ich na zielonym tle Bob jest zdrowy,\na ty dostajesz punkty.'
  },
  tutorial_step_2: {
    text: 'Wskaźnik makroelementów zmieni kolor na żółty,\na w końcu na czerwony jeśli przekramisz Boba\nmakroelementami lub gdy go nie będziesz nimi karmił.'
  },
  tutorial_step_3: {
    text: 'Bob ma swój własny pasek życia.\nJego wartość spada gdy wkroczysz na żółte\n lub czerowne pole na wskaźniku makroelementów.'
  },
  tutorial_step_4: {
    text: 'Każde jedzenie ma swoje właściwości\nopisane w sekcji „Encyklopedia” w menu głównym.\nZnając jakie makroelementy dane jedzenie posiada\nmożesz być pewien, że nakarmisz Boba poprawnie.'
  },
  tutorial_step_5: {
    text: 'To koniec samouczka.\nMożesz teraz cieszyć się grą!'
  },

  game_health: {
    text: 'Życie'
  },
  game_score: {
    text: 'Wynik'
  },
  game_paused: {
    text: 'Pauza'
  },
  game_level_up: {
    text: 'Idzie ci coraz lepiej!\nWięc gra staje się trudniejsza!'
  },
  game_over: {
    text: 'Koniec gry'
  },
  game_over_text: {
    text: function text(args) {
      // args[ 0 ] => wynik
      // args[ 1 ] => sposób śmierci

      var secondNumberSuffix = function secondNumberSuffix(time) {
        var char = +String(time).charAt(String(time).length - 1);

        if (char === 0 || char >= 5 || time >= 11 && time <= 21) {
          return 'ów';
        } else if (char !== 1) {
          return 'y';
        }

        return '';
      };

      return 'Zdoby\u0142e\u015B ' + Math.floor(args[0]) + ' punkt' + secondNumberSuffix(args[0]) + '\ni umar\u0142e\u015B od ' + args[1];
    }
  },

  game_deathtype_dangerous_nutrition_style: {
    text: 'niebezpiecznego stylu żywienia'
  },

  credits_title: {
    text: 'Autorzy'
  },
  credits_code: {
    text: 'Kod'
  },
  credits_graphics: {
    text: 'Grafika'
  },
  credits_sound: {
    text: 'Dźwięki'
  },
  credits_translators: {
    text: 'Tłumaczenie'
  },
  credits_lang_de: {
    text: 'niemiecki'
  },
  credits_by: {
    text: 'przez'
  }
};

exports.default = pl_pl;

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

var _FoodConstants = require('../constants/FoodConstants');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var AdditionalFoodSpawner = function () {
  function AdditionalFoodSpawner(game, hasMacrosSpawnedData) {
    _classCallCheck(this, AdditionalFoodSpawner);

    this.hasMacrosSpawnedData = hasMacrosSpawnedData;

    this.checkIfShouldSpawnTimer = game.time.events.loop(_FoodConstants.ADDITIONAL_FOOD_SPAWN_INTERVAL, this.checkIfShouldSpawn, this);

    this.onSpawnNeed = new Phaser.Signal();
  }

  _createClass(AdditionalFoodSpawner, [{
    key: 'checkIfShouldSpawn',
    value: function checkIfShouldSpawn() {
      for (var macroKey in this.hasMacrosSpawnedData) {
        if (this.hasMacrosSpawnedData[macroKey] === false) {
          this.onSpawnNeed.dispatch(macroKey);
        }
        this.hasMacrosSpawnedData[macroKey] = false;
      }
    }
  }]);

  return AdditionalFoodSpawner;
}();

exports.default = AdditionalFoodSpawner;

},{"../constants/FoodConstants":7}],17:[function(require,module,exports){
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

var _BobConstants = require('../constants/BobConstants');

var _NutritionUtils = require('../utils/NutritionUtils');

var _WeightBreakpoints = require('../constants/WeightBreakpoints');

var _FoodDataManager = require('../objects/FoodDataManager');

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

  function Bob(game, x, y, imageKey, NutritionManager) {
    _classCallCheck(this, Bob);

    var _this = _possibleConstructorReturn(this, (Bob.__proto__ || Object.getPrototypeOf(Bob)).call(this, game, x, y, imageKey));

    _this.NutritionManager = NutritionManager;

    _this.anchor.setTo(0.5, 1);
    _this.scale.setTo(_BobConstants.BOB_SCALE);

    _this.game.world.add(_this);

    _this.scoreValue = 0;

    _this.onScoreValueChange = new Phaser.Signal();

    _this.onWeightChange = new Phaser.Signal();
    return _this;
  }

  _createClass(Bob, [{
    key: 'handleWeightChange',
    value: function handleWeightChange() {
      var nutrition = this.NutritionManager.nutrition;

      var nutritionStatuses = [(0, _NutritionUtils.getStatus)(nutrition.carbohydrates, _NutritionConstants.GOOD_AMOUNT_OF_CARBOHYDRATES), (0, _NutritionUtils.getStatus)(nutrition.fats, _NutritionConstants.GOOD_AMOUNT_OF_FATS), (0, _NutritionUtils.getStatus)(nutrition.proteins, _NutritionConstants.GOOD_AMOUNT_OF_PROTEINS)];

      var scoreValue = 0;

      var makeProbabilityHigher = [{ name: 'carbohydrates', makeHigher: false, makeSuperHigher: false }, { name: 'fats', makeHigher: false, makeSuperHigher: false }, { name: 'proteins', makeHigher: false, makeSuperHigher: false }];

      (0, _FoodDataManager.resetFoodSpawnProbability)();

      var isSuperThin = false;
      var isThin = false;
      var isFat = false;
      var isSuperFat = false;

      nutritionStatuses.forEach(function (v, index) {
        if (v <= _WeightBreakpoints.THIN_BREAKPOINT) {
          isThin = true;
          makeProbabilityHigher[index].makeHigher = true;
        }

        if (v <= _WeightBreakpoints.SUPER_THIN_BREAKPOINT) {
          isSuperThin = true;
          makeProbabilityHigher[index].makeSuperHigher = true;
        }

        if (v >= _WeightBreakpoints.FAT_BREAKPOINT) {
          isFat = true;
        }

        if (v >= _WeightBreakpoints.SUPER_FAT_BREAKPOINT) {
          isSuperFat = true;
        }
      });

      makeProbabilityHigher.forEach(function (macro) {
        if (macro.makeHigher === true) {
          (0, _FoodDataManager.makeKeySpawnMoreFrequently)(macro.name, 3);
        } else if (macro.makeSuperHigher === true) {
          (0, _FoodDataManager.makeKeySpawnMoreFrequently)(macro.name, 5);
        }
      });

      this.onWeightChange.dispatch(isThin || isFat, isSuperThin || isSuperFat);

      if (!isSuperThin && !isThin && !isFat && !isSuperFat) {
        scoreValue++;
      }

      var status = 8;
      if (isFat) {
        status = Math.max.apply(null, nutritionStatuses);
      } else if (isThin) {
        nutritionStatuses.forEach(function (v) {
          if (v < 8) {
            status = Math.min(status, v);
          }
        });
      }

      this.frame = status;

      if (this.scoreValue !== scoreValue) {
        this.scoreValue = scoreValue;
        this.onScoreValueChange.dispatch(scoreValue);
      }
    }
  }]);

  return Bob;
}(Phaser.Sprite);

exports.default = Bob;

},{"../constants/BobConstants":4,"../constants/NutritionConstants":8,"../constants/WeightBreakpoints":10,"../objects/FoodDataManager":19,"../utils/NutritionUtils":33}],18:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _FoodConstants = require('../constants/FoodConstants');

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

var Food = function (_Phaser$Sprite) {
  _inherits(Food, _Phaser$Sprite);

  function Food(game, x, y, key, data, updateStatsSignal, onDestroy) {
    _classCallCheck(this, Food);

    var _this = _possibleConstructorReturn(this, (Food.__proto__ || Object.getPrototypeOf(Food)).call(this, game, x, y, (0, _ScaleManager.$)(_i18n2.default.image('products')), key));

    _this.onDestroy = onDestroy;
    _this.data = data;
    _this.updateStatsSignal = updateStatsSignal;
    _this.scale.setTo(_FoodConstants.FOOD_SCALE);
    _this.anchor.setTo(0.5, 0.5);

    _this.hitArea = new Phaser.Circle().setTo(0, 0, _FoodConstants.FOOD_HIT_AREA_DIAMETER);

    _this.game.physics.enable(_this);

    _this.directionX = x > _this.game.world.centerX ? -1 : 1;
    _this.directionY = y > _this.game.world.centerY ? -1 : 1;

    _this.velocityX = _this.directionX * _this.game.rnd.integerInRange((0, _ScaleManager.$)(_FoodConstants.MIN_FOOD_VELOCITY), (0, _ScaleManager.$)(_FoodConstants.MAX_FOOD_VELOCITY));

    _this.body.velocity.x = _this.velocityX;

    _this.velocityY = _this.directionY * _this.game.rnd.integerInRange(Math.max((0, _ScaleManager.$)(_FoodConstants.MIN_FOOD_VELOCITY), Math.abs(_this.velocityX) - 10), Math.min(Math.abs(_this.velocityX) + 10, (0, _ScaleManager.$)(_FoodConstants.MAX_FOOD_VELOCITY)));

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

    _this.events.onOutOfBounds.add(function () {
      if (_this.hasEnteredScreen) {
        _this.onDestroy(_this, false);
      }
    });

    _this.game.world.add(_this);
    return _this;
  }

  _createClass(Food, [{
    key: 'update',
    value: function update() {
      if (!this.hasEnteredScreen && this.game.world.bounds.intersects(this._bounds)) {
        this.hasEnteredScreen = true;
      }
    }
  }, {
    key: 'speedUp',
    value: function speedUp(speedOffset) {
      this.body.velocity.x += speedOffset * this.directionX;
      this.body.velocity.y += speedOffset * this.directionY;
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      var _this2 = this;

      var tween = this.game.add.tween(this);
      var tweenScale = this.game.add.tween(this.scale);
      var tweenSpin = this.game.add.tween(this);
      tween.to({ x: this.game.world.centerX - (0, _ScaleManager.$)(_FoodConstants.FOOD_TWEEN_X), y: this.game.world.height - (0, _ScaleManager.$)(_FoodConstants.FOOD_TWEEN_Y) }, _FoodConstants.FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true);
      tweenScale.to({ x: (0, _ScaleManager.$)(_FoodConstants.FOOD_TWEEN_SCALE), y: (0, _ScaleManager.$)(_FoodConstants.FOOD_TWEEN_SCALE) }, _FoodConstants.FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true);
      tweenSpin.to({ angle: 360 }, _FoodConstants.FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true);

      tween.onComplete.add(function () {
        _this2.updateStatsSignal.dispatch(_this2.data);
        _this2.onDestroy(_this2, true);
      });
    }
  }]);

  return Food;
}(Phaser.Sprite);

exports.default = Food;

},{"../constants/FoodConstants":7,"../utils/ScaleManager":34,"../utils/i18n":36}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHardLevelLastIndex = exports.getMediumLevelLastIndex = exports.getEasyLevelLastIndex = exports.getFoodData = undefined;
exports.initFoodDataManager = initFoodDataManager;
exports.makeKeySpawnMoreFrequently = makeKeySpawnMoreFrequently;
exports.resetFoodSpawnProbability = resetFoodSpawnProbability;

var _FoodConstants = require('../constants/FoodConstants');

var _NutritionUtils = require('../utils/NutritionUtils');

var data = void 0;
var easyLevelLastIndex = void 0;
var mediumLevelLastIndex = void 0;
var hardLevelLastIndex = void 0;

function initFoodDataManager() {
  data = JSON.parse(JSON.stringify(_FoodConstants.FOOD_DATA)).sort(function (food1, food2) {
    return food1.complexityLevel > food2.complexityLevel;
  });

  easyLevelLastIndex = data.length - 1 - data.reverse().findIndex(function (food) {
    return food.complexityLevel === 1;
  });
  mediumLevelLastIndex = data.length - 1 - data.findIndex(function (food) {
    return food.complexityLevel === 2;
  });
  hardLevelLastIndex = data.length - 1;

  data.reverse();
}

var getFoodData = exports.getFoodData = function getFoodData() {
  return data;
};
var getEasyLevelLastIndex = exports.getEasyLevelLastIndex = function getEasyLevelLastIndex() {
  return easyLevelLastIndex;
};
var getMediumLevelLastIndex = exports.getMediumLevelLastIndex = function getMediumLevelLastIndex() {
  return mediumLevelLastIndex;
};
var getHardLevelLastIndex = exports.getHardLevelLastIndex = function getHardLevelLastIndex() {
  return hardLevelLastIndex;
};

function makeKeySpawnMoreFrequently(macroKey, multiplier) {
  var keyMacros = (0, _NutritionUtils.getFoodWithParticularMacros)(data, macroKey);

  keyMacros.forEach(function (keyFood) {
    keyFood.probability = _FoodConstants.FOOD_DATA.find(function (food) {
      return food.key === keyFood.key;
    }).probability * multiplier;
  });

  data = data.map(function (food) {
    var indexOfFoodInKeyMacros = keyMacros.findIndex(function (keyFood) {
      return keyFood.key === food.key;
    });

    if (indexOfFoodInKeyMacros === -1) {
      return food;
    }

    return keyMacros[indexOfFoodInKeyMacros];
  });
}

function resetFoodSpawnProbability() {
  data.forEach(function (food) {
    food.probability = _FoodConstants.FOOD_DATA.find(function (originalFood) {
      return originalFood.key === food.key;
    }).probability;
  });
}

},{"../constants/FoodConstants":7,"../utils/NutritionUtils":33}],20:[function(require,module,exports){
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

var _FoodDataManager = require('./FoodDataManager');

var _MathUtils = require('../utils/MathUtils.js');

var _FoodConstants = require('../constants/FoodConstants');

var _DifficultyLevelIntervals = require('../constants/DifficultyLevelIntervals.js');

var _AudioManager = require('../utils/AudioManager.js');

var _AdditionalFoodSpawner = require('./AdditionalFoodSpawner');

var _AdditionalFoodSpawner2 = _interopRequireDefault(_AdditionalFoodSpawner);

var _NutritionUtils = require('../utils/NutritionUtils');

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

  function FoodSpawner(game) {
    _classCallCheck(this, FoodSpawner);

    var _this = _possibleConstructorReturn(this, (FoodSpawner.__proto__ || Object.getPrototypeOf(FoodSpawner)).call(this, game));

    _this.timer = _this.game.time.events.loop(_FoodConstants.FOOD_SPAWN_INTERVAL, _this.spawnFood, _this);

    _this.updateStatsSignal = new Phaser.Signal();

    _this.currentDifficultyLevel = 'EASY';
    _this.currentDifficultyLevelLastIndex = (0, _FoodDataManager.getEasyLevelLastIndex)();

    _this.biteSound = _this.game.add.sound('audio-bite', 0.5);
    _this.biteSound.allowMultiple = true;

    _this.hasMacrosSpawnedData = {
      carbohydrates: false,
      fats: false,
      proteins: false
    };

    var additionalFoodSpawner = new _AdditionalFoodSpawner2.default(game, _this.hasMacrosSpawnedData);
    additionalFoodSpawner.onSpawnNeed.add(_this.spawnFoodWithParticularMacro, _this);

    _this.onDifficultyLevelUp = new Phaser.Signal();
    return _this;
  }

  _createClass(FoodSpawner, [{
    key: 'create',
    value: function create() {
      this.spawnFood();
    }
  }, {
    key: 'spawnFood',
    value: function spawnFood(foodType) {
      if (foodType == null) {
        foodType = (0, _MathUtils.getRandomWithWeight)((0, _FoodDataManager.getFoodData)(), this.currentDifficultyLevelLastIndex + 1);
        this.hasMacrosSpawnedData[(0, _NutritionUtils.getDominatingMacro)(foodType)] = true;
      }

      if (this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt === false) {
        // I really don't know how to handle this differently, I'll ask on Slack or smth...
        return;
      }
      var sides = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
      var spawnSide = sides[Math.floor(Math.random() * 4)];
      var x = void 0;
      var y = void 0;
      var spawnWidth = this.game.world.width - _FoodConstants.FOOD_SPAWN_BOUNDS_WIDTH_MARGIN;
      var spawnHeight = this.game.world.height - _FoodConstants.FOOD_SPAWN_BOUNDS_HEIGHT_MARGIN;
      if (spawnSide === 'NORTH' || spawnSide === 'SOUTH') {
        x = spawnWidth / 2 + Math.random() * spawnWidth;
        y = spawnSide === 'NORTH' ? -_FoodConstants.FOOD_HEIGHT : this.game.world.height + _FoodConstants.FOOD_HEIGHT;
      } else {
        x = spawnSide === 'WEST' ? -_FoodConstants.FOOD_WIDTH : this.game.world.width + _FoodConstants.FOOD_WIDTH;
        y = spawnHeight / 2 + Math.random() * spawnHeight;
      }

      this.tryDifficultyLevelUp();

      var newFood = new _Food2.default(this.game, x, y, foodType.key, foodType.nutritionFacts, this.updateStatsSignal, this.onFoodConsumption.bind(this));

      if (this.currentDifficultyLevel === 'MEDIUM') {
        newFood.speedUp(_FoodConstants.MEDIUM_LEVEL_VELOCITY_OFFSET);
      } else if (this.currentDifficultyLevel === 'HARD') {
        newFood.speedUp(_FoodConstants.HARD_LEVEL_VELOCITY_OFFSET);
      }

      this.children.push(newFood);
    }
  }, {
    key: 'update',
    value: function update() {
      Phaser.Group.prototype.update.call(this);
    }
  }, {
    key: 'onFoodConsumption',
    value: function onFoodConsumption(food, wasEaten) {
      if ((0, _AudioManager.getStatusAudio)() === true && wasEaten) {
        this.biteSound.play();
      }
      this.removeChild(food);
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
      if (score >= _DifficultyLevelIntervals.TIME_TO_REACH_MEDIUM_LEVEL && this.currentDifficultyLevelLastIndex !== (0, _FoodDataManager.getMediumLevelLastIndex)() && this.currentDifficultyLevelLastIndex !== (0, _FoodDataManager.getHardLevelLastIndex)()) {
        this.currentDifficultyLevelLastIndex = (0, _FoodDataManager.getMediumLevelLastIndex)();
        this.currentDifficultyLevel = 'MEDIUM';
        this.timer.delay = _FoodConstants.FOOD_SPAWN_INTERVAL - _FoodConstants.MEDIUM_LEVEL_FOOD_SPAWN_DELAY_OFFSET;
        this.onDifficultyLevelUp.dispatch(this.currentDifficultyLevel);
      } else if (score >= _DifficultyLevelIntervals.TIME_TO_REACH_HARD_LEVEL && this.currentDifficultyLevelLastIndex !== (0, _FoodDataManager.getHardLevelLastIndex)()) {
        this.currentDifficultyLevelLastIndex = (0, _FoodDataManager.getHardLevelLastIndex)();
        this.currentDifficultyLevel = 'HARD';
        this.timer.delay = _FoodConstants.FOOD_SPAWN_INTERVAL - _FoodConstants.HARD_LEVEL_FOOD_SPAWN_DELAY_OFFSET;
        this.onDifficultyLevelUp.dispatch(this.currentDifficultyLevel);
      }
    }
  }, {
    key: 'spawnFoodWithParticularMacro',
    value: function spawnFoodWithParticularMacro(macroKey) {
      var foodDataFilteredByComplexity = (0, _FoodDataManager.getFoodData)().slice(0, this.currentDifficultyLevelLastIndex + 1);
      var foodData = (0, _NutritionUtils.getFoodWithParticularMacros)(foodDataFilteredByComplexity, macroKey);
      var foodType = (0, _MathUtils.getRandomWithWeight)(foodData);

      this.spawnFood(foodType);
    }
  }]);

  return FoodSpawner;
}(Phaser.Group);

exports.default = FoodSpawner;

},{"../constants/DifficultyLevelIntervals.js":6,"../constants/FoodConstants":7,"../utils/AudioManager.js":30,"../utils/MathUtils.js":32,"../utils/NutritionUtils":33,"./AdditionalFoodSpawner":16,"./Food":18,"./FoodDataManager":19}],21:[function(require,module,exports){
"use strict";

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

var DAMAGE_VALUE_PER_TICK = 7.25;
var CAN_BE_HARMED_REFRESH_INTERVAL = 2000;

var HealthHandler = function () {
  function HealthHandler() {
    _classCallCheck(this, HealthHandler);

    this.health = 100;
    this.shouldBobBeHarmed = false;
    this.punishementMultiplier = 1;
    this.canBeHarmed = true;

    this.onHealthUpdate = new Phaser.Signal();
  }

  _createClass(HealthHandler, [{
    key: "setShouldBobBeHarmed",
    value: function setShouldBobBeHarmed(shouldHeBeHarmed, shouldDoubleThePunishement) {
      this.shouldBobBeHarmed = shouldHeBeHarmed;
      this.punishementMultiplier = shouldDoubleThePunishement ? 2 : 1;
    }
  }, {
    key: "doHarmToBob",
    value: function doHarmToBob() {
      var _this = this;

      if (this.shouldBobBeHarmed === false || this.canBeHarmed === false) {
        return;
      }
      this.health -= DAMAGE_VALUE_PER_TICK * this.punishementMultiplier;
      this.canBeHarmed = false;
      window.setTimeout(function () {
        return _this.canBeHarmed = true;
      }, CAN_BE_HARMED_REFRESH_INTERVAL);
      this.onHealthUpdate.dispatch(this.health);
    }
  }]);

  return HealthHandler;
}();

exports.default = HealthHandler;

},{}],22:[function(require,module,exports){
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

var _NutritionUI = require('../UI/NutritionUI');

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

    this.updateTimer = game.time.events.loop(_NutritionConstants.AMOUNT_REDUCED_INTERVAL, this.reduceNutrition, this);
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
  }, {
    key: 'growDifficulty',
    value: function growDifficulty(level) {
      if (level === 'MEDIUM') {
        this.speedUp(_NutritionConstants.MEDIUM_LEVEL_DELAY_OFFSET);
      } else if (level === 'HARD') {
        this.speedUp(_NutritionConstants.HARD_LEVEL_DELAY_OFFSET);
      }
    }
  }, {
    key: 'speedUp',
    value: function speedUp(delayOffset) {
      this.updateTimer.delay = _NutritionConstants.AMOUNT_REDUCED_INTERVAL - delayOffset;
    }
  }]);

  return NutritionManager;
}();

exports.default = NutritionManager;

},{"../UI/NutritionUI":2,"../constants/NutritionConstants":8}],23:[function(require,module,exports){
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
      this.game.stage.backgroundColor = '#dba74b';
      this.game.load.image('loadingbg', 'img/loadingbg.png');
      this.game.load.image('loadingbg-50', 'img50/loadingbg.png');
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

},{}],24:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _UIConstants = require('../constants/UIConstants');

var _AudioManager = require('../utils/AudioManager');

var _Text = require('../UI/Text');

var _Text2 = _interopRequireDefault(_Text);

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

var Wiki = function (_Phaser$State) {
  _inherits(Wiki, _Phaser$State);

  function Wiki() {
    _classCallCheck(this, Wiki);

    return _possibleConstructorReturn(this, (Wiki.__proto__ || Object.getPrototypeOf(Wiki)).apply(this, arguments));
  }

  _createClass(Wiki, [{
    key: 'create',
    value: function create() {
      this.add.sprite(0, 0, 'loadingbg');
      this.camera.resetFX();
      this.camera.flash(0x000000, 500, false);

      var buttonBack = this.add.button(this.world.width - _UIConstants.MENU_BUTTON_OFFSET, this.game.world.height - _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-mainmenu'), this.clickBack, this, 1, 0, 2);
      buttonBack.anchor.set(1, 1);
      buttonBack.x = this.world.width + buttonBack.width + _UIConstants.MENU_BUTTON_OFFSET;
      this.add.tween(buttonBack).to({ x: this.world.width - _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);

      var textGroup = this.game.add.group();

      var creditsTitle = new _Text2.default(this.game, 'center', 0, _i18n2.default.text('credits_title') + ':', (0, _ScaleManager.$)(_UIConstants.CREDITS_TITLE_FONT));
      var creditsCodingTitle = new _Text2.default(this.game, 'center', 0, _i18n2.default.text('credits_code'), (0, _ScaleManager.$)(_UIConstants.CREDITS_FONT_SMALL));
      var creditsCoding = new _Text2.default(this.game, 'center', 0, _i18n2.default.quotes('Bartek „bibixx” Legięć\nKacper Pietrzak'), (0, _ScaleManager.$)(_UIConstants.CREDITS_FONT));
      var creditsGraphicsTitle = new _Text2.default(this.game, 'center', 0, _i18n2.default.text('credits_graphics'), (0, _ScaleManager.$)(_UIConstants.CREDITS_FONT_SMALL));
      var creditsGraphics = new _Text2.default(this.game, 'center', 0, _i18n2.default.quotes('Magda „Enna” Nowak'), (0, _ScaleManager.$)(_UIConstants.CREDITS_FONT));
      var creditsTextTranslate = new _Text2.default(this.game, 'center', 0, _i18n2.default.quotes('\n' + _i18n2.default.text('credits_translators') + '\nKrystian Kwiatkowski (' + _i18n2.default.text('credits_lang_de') + ')'), (0, _ScaleManager.$)(_UIConstants.CREDITS_FONT_SMALL));
      var creditsTextSound = new _Text2.default(this.game, 'center', 0, _i18n2.default.quotes('\n' + _i18n2.default.text('credits_sound') + '\n\u201EFarty McSty\u201D\n' + _i18n2.default.text('credits_by') + ' Eric Matyas (www.soundimage.org)\n\n\u201EClick2 Sound\u201D\n' + _i18n2.default.text('credits_by') + ' Sebastian (www.soundbible.com)'), (0, _ScaleManager.$)(_UIConstants.CREDITS_FONT_SMALL));

      textGroup.add(creditsTitle);
      textGroup.add(creditsCodingTitle);
      textGroup.add(creditsCoding);
      textGroup.add(creditsGraphicsTitle);
      textGroup.add(creditsGraphics);
      textGroup.add(creditsTextTranslate);
      textGroup.add(creditsTextSound);

      var prevText = null;
      textGroup.forEach(function (text) {
        if (prevText) {
          text.y = prevText.y + prevText.height;
        }

        prevText = text;
      });

      textGroup.position.x = 0;
      textGroup.position.y = this.game.height / 2 - textGroup.height / 2;
    }
  }, {
    key: 'clickBack',
    value: function clickBack() {
      var _this2 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.time.events.add(200, function () {
        _this2.game.state.start('MainMenu');
      });
    }
  }]);

  return Wiki;
}(Phaser.State);

exports.default = Wiki;

},{"../UI/Text":3,"../constants/UIConstants":9,"../utils/AudioManager":30,"../utils/ScaleManager":34,"../utils/i18n":36}],25:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _GameUI = require('../UI/GameUI');

var _GameUI2 = _interopRequireDefault(_GameUI);

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _FoodSpawner = require('../objects/FoodSpawner');

var _FoodSpawner2 = _interopRequireDefault(_FoodSpawner);

var _Bob = require('../objects/Bob');

var _Bob2 = _interopRequireDefault(_Bob);

var _NutritionManager3 = require('../objects/NutritionManager');

var _NutritionManager4 = _interopRequireDefault(_NutritionManager3);

var _HealthHandler = require('../objects/HealthHandler');

var _HealthHandler2 = _interopRequireDefault(_HealthHandler);

var _FoodDataManager = require('../objects/FoodDataManager');

var _ClockUtils = require('../utils/ClockUtils');

var Clock = _interopRequireWildcard(_ClockUtils);

var _BobConstants = require('../constants/BobConstants');

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

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

      (0, _FoodDataManager.initFoodDataManager)();

      this.game.add.sprite(0, 0, (0, _ScaleManager.$)('background'));
      this.foodSpawner = new _FoodSpawner2.default(this.game, true);
      this.foodContainer = this.foodSpawner.children;

      this.NutritionManager = new _NutritionManager4.default(this.game);
      this.bob = new _Bob2.default(this.game, this.world.width / 2, this.world.height - (0, _ScaleManager.$)(_BobConstants.BOB_OFFSET_Y), (0, _ScaleManager.$)('bob'), this.NutritionManager);
      this.gameUI = new _GameUI2.default(this, this.bob, this.NutritionManager);

      this.foodSpawner.updateStatsSignal.add(function () {
        var _NutritionManager;

        return (_NutritionManager = _this2.NutritionManager).updateStats.apply(_NutritionManager, arguments);
      });
      this.foodSpawner.onDifficultyLevelUp.add(function () {
        var _NutritionManager2;

        return (_NutritionManager2 = _this2.NutritionManager).growDifficulty.apply(_NutritionManager2, arguments);
      });
      this.foodSpawner.onDifficultyLevelUp.add(function () {
        var _gameUI;

        return (_gameUI = _this2.gameUI).difficultyChange.apply(_gameUI, arguments);
      });

      this.bob.onScoreValueChange.add(function () {
        var _gameUI2;

        return (_gameUI2 = _this2.gameUI).onScoreValueChange.apply(_gameUI2, arguments);
      });

      var healthHandler = new _HealthHandler2.default();
      this.bob.onWeightChange.add(function () {
        return healthHandler.setShouldBobBeHarmed.apply(healthHandler, arguments);
      });
      this.gameUI.timeAdvance.add(function () {
        return healthHandler.doHarmToBob();
      });
      healthHandler.onHealthUpdate.add(function () {
        var _gameUI3;

        return (_gameUI3 = _this2.gameUI).updateHealthBarValue.apply(_gameUI3, arguments);
      });
      healthHandler.onHealthUpdate.add(function () {
        return _this2.checkForDeath.apply(_this2, arguments);
      });

      Clock.initClock(this);

      this.camera.resetFX();
      this.camera.flash(0x000000, 500, false);

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.onResume.add(function () {
        if (_this2.gameUI.stateStatus === 'paused' || _this2.gameUI.stateStatus === 'gameover' || _this2.gameUI.stateStatus === 'tutorial') {
          _this2.game.time.events.pause();
        }
      });

      // don't bother it's just a hot fix, or not...
      this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt = true;
    }
  }, {
    key: 'checkForDeath',
    value: function checkForDeath(health) {
      if (health <= 0) {
        this.gameUI.stateGameover(_i18n2.default.text('game_deathtype_dangerous_nutrition_style'));
        this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt = false;
      }
    }
  }, {
    key: 'update',
    value: function update() {
      Clock.updateClock(this);
      this.gameUI.updateUI();
      this.bob.handleWeightChange();
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

},{"../UI/GameUI":1,"../constants/BobConstants":4,"../objects/Bob":17,"../objects/FoodDataManager":19,"../objects/FoodSpawner":20,"../objects/HealthHandler":21,"../objects/NutritionManager":22,"../utils/ClockUtils":31,"../utils/ScaleManager":34,"../utils/i18n":36}],26:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _AudioManager = require('../utils/AudioManager');

var _StorageManager = require('../utils/StorageManager');

var _Text = require('../UI/Text');

var _Text2 = _interopRequireDefault(_Text);

var _ClockUtils = require('../utils/ClockUtils');

var Clock = _interopRequireWildcard(_ClockUtils);

var _UIConstants = require('../constants/UIConstants');

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

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

var MainMenu = function (_Phaser$State) {
  _inherits(MainMenu, _Phaser$State);

  function MainMenu() {
    _classCallCheck(this, MainMenu);

    return _possibleConstructorReturn(this, (MainMenu.__proto__ || Object.getPrototypeOf(MainMenu)).apply(this, arguments));
  }

  _createClass(MainMenu, [{
    key: 'create',
    value: function create() {
      this.game.add.sprite(0, 0, (0, _ScaleManager.$)('background'));
      Clock.initClock(this);

      var title = this.add.sprite(this.world.width * 0.5, (this.world.height - (0, _ScaleManager.$)(_UIConstants.TITLE_OFFSET_Y)) * 0.5, (0, _ScaleManager.$)('title'));
      title.anchor.set(0.5);

      _StorageManager.PPTStorage.initUnset('PPT-highscore', 0);
      var highscore = _StorageManager.PPTStorage.get('PPT-highscore') || 0;

      var buttonPigames = this.add.button(_UIConstants.MENU_BUTTON_OFFSET, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('logo-pigames'), this.clickPiGames, this);
      var buttonStart = this.add.button(this.world.width - _UIConstants.MENU_BUTTON_OFFSET, this.world.height - _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-start'), this.clickStart, this, 1, 0, 2);
      buttonStart.anchor.set(1);

      var buttonWiki = this.add.button(_UIConstants.MENU_BUTTON_OFFSET, this.world.height - _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-wiki'), this.clickWiki, this, 1, 0, 2);
      buttonWiki.anchor.set(0, 1);

      var highscoreText = new _Text2.default(this.game, 'center', this.world.height - (0, _ScaleManager.$)(50), _i18n2.default.text('main_menu_highscore') + ': ' + highscore, (0, _ScaleManager.$)(_UIConstants.MENU_HIGHSCORE_FONT), [null, 1]);
      highscoreText.padding.set(0, 15);

      this.initOptions();
      this.initLang();

      (0, _AudioManager.manageAudio)('init', this);

      if ((0, _AudioManager.getStatusAudio)() !== true) {
        (0, _AudioManager.manageAudio)('off', this);
      }

      buttonStart.x = this.world.width + buttonStart.width + _UIConstants.MENU_BUTTON_OFFSET;
      this.add.tween(buttonStart).to({ x: this.world.width - _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);
      this.buttonOptions.y = -this.buttonOptions.height - _UIConstants.MENU_BUTTON_OFFSET;
      this.add.tween(this.buttonOptions).to({ y: _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);
      this.buttonLangs.y = -this.buttonOptions.height - _UIConstants.MENU_BUTTON_OFFSET;
      this.add.tween(this.buttonLangs).to({ y: _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);
      buttonPigames.x = -buttonPigames.width - _UIConstants.MENU_BUTTON_OFFSET;
      this.add.tween(buttonPigames).to({ x: _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);
      buttonWiki.y = this.world.height + buttonWiki.height + _UIConstants.MENU_BUTTON_OFFSET;
      this.add.tween(buttonWiki).to({ y: this.world.height - _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);

      this.camera.flash(0x000000, 500, false);
    }
  }, {
    key: 'initOptions',
    value: function initOptions() {
      this.optionsUI = [];

      this.optionsExpanded = false;
      this.buttonOptions = this.add.button(this.world.width - _UIConstants.MENU_BUTTON_OFFSET, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-options'), this.clickOptions, this, 1, 0, 2);
      this.buttonOptions.x -= this.buttonOptions.width + _UIConstants.MENU_BUTTON_OFFSET;
      this.buttonOptions.anchor.set(1, 0);

      this.buttonAudio = this.add.button(this.buttonOptions.x, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-audio'), this.clickAudio, this, 1, 0, 2);
      this.buttonAudio.anchor.set(1, 0);
      this.buttonAudio.visible = false;
      this.optionsUI.push(this.buttonAudio);

      this.buttonCredits = this.add.button(this.buttonOptions.x, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)(_i18n2.default.image('button-credits')), this.clickCredits, this, 1, 0, 2);
      this.buttonCredits.anchor.set(1, 0);
      this.buttonCredits.visible = false;
      this.optionsUI.push(this.buttonCredits);

      this.buttonHelp = this.add.button(this.buttonOptions.x, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-help'), this.clickHelp, this, 1, 0, 2);
      this.buttonHelp.anchor.set(1, 0);
      this.buttonHelp.visible = false;
      this.optionsUI.push(this.buttonHelp);

      this.buttonQuality = this.add.button(this.buttonOptions.x, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-quality'), this.clickQuality, this, 1, 0, 2);
      this.buttonQuality.anchor.set(1, 0);
      this.buttonQuality.visible = false;
      this.optionsUI.push(this.buttonQuality);

      this.game.world.bringToTop(this.buttonOptions);
    }
  }, {
    key: 'clickOptions',
    value: function clickOptions() {
      (0, _AudioManager.playAudio)('click');
      this.contractLang();
      if (this.optionsExpanded) {
        this.contractOptions();
      } else {
        this.expandOptions();
      }
    }
  }, {
    key: 'expandOptions',
    value: function expandOptions() {
      var _this2 = this;

      this.optionsExpanded = true;
      var prevX = 0;

      this.optionsUI.forEach(function (button, i) {
        button.visible = true;
        _this2.add.tween(button.position).to({ x: _this2.world.width - button.width - prevX - (0, _ScaleManager.$)(_UIConstants.MENU_BUTTON_OFFSET) * (i + 1) - _UIConstants.MENU_BUTTON_OFFSET * 2 - _this2.buttonOptions.width }, 500, Phaser.Easing.Exponential.Out, true);
        prevX += button.width;
      });
    }
  }, {
    key: 'contractOptions',
    value: function contractOptions() {
      var _this3 = this;

      this.optionsExpanded = false;

      this.optionsUI.forEach(function (button) {
        var tween = _this3.add.tween(button.position).to({ x: _this3.buttonOptions.x }, 500, Phaser.Easing.Exponential.Out, true);

        tween.onComplete.add(function () {
          if (!_this3.optionsExpanded) {
            button.visible = false;
          }
        });
      });
    }
  }, {
    key: 'initLang',
    value: function initLang() {
      var _this4 = this;

      this.langUI = [];
      var currentLang = _i18n2.default.get();
      var langs = ['en_gb', 'pl_pl', 'de_de'];

      this.langsExpanded = false;
      this.buttonLangs = this.add.button(this.world.width - _UIConstants.MENU_BUTTON_OFFSET, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-lang-' + currentLang), this.clickLangOpen, this, 1, 0, 2);
      this.buttonLangs.anchor.set(1, 0);

      langs.forEach(function (lang) {
        if (lang !== currentLang) {
          var button = _this4.add.button(_this4.world.width - _UIConstants.MENU_BUTTON_OFFSET, _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-lang-' + lang), function () {
            return _this4.clickLang(lang);
          }, _this4, 1, 0, 2);
          button.anchor.set(1, 0);
          button.visible = false;
          _this4.langUI.push(button);
        }
      });

      this.game.world.bringToTop(this.buttonLangs);
    }
  }, {
    key: 'clickLangOpen',
    value: function clickLangOpen() {
      (0, _AudioManager.playAudio)('click');
      this.contractOptions();
      if (this.langsExpanded) {
        this.contractLang();
      } else {
        this.expandLang();
      }
    }
  }, {
    key: 'expandLang',
    value: function expandLang() {
      var _this5 = this;

      this.langsExpanded = true;
      var prevY = 0;

      this.langUI.forEach(function (button, i) {
        button.visible = true;
        _this5.add.tween(button.position).to({ y: button.height + prevY + (0, _ScaleManager.$)(_UIConstants.MENU_BUTTON_OFFSET) * (i + 1) + _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);
        prevY += button.width;
      });
    }
  }, {
    key: 'contractLang',
    value: function contractLang() {
      var _this6 = this;

      this.langsExpanded = false;

      this.langUI.forEach(function (button) {
        var tween = _this6.add.tween(button.position).to({ y: _this6.buttonLangs.y }, 500, Phaser.Easing.Exponential.Out, true);

        tween.onComplete.add(function () {
          if (!_this6.langsExpanded) {
            button.visible = false;
          }
        });
      });
    }
  }, {
    key: 'clickAudio',
    value: function clickAudio() {
      (0, _AudioManager.playAudio)('click');
      (0, _AudioManager.manageAudio)('switch', this);
    }
  }, {
    key: 'clickPiGames',
    value: function clickPiGames() {
      (0, _AudioManager.playAudio)('click');
      window.top.location.href = 'http://pigam.es/';
    }
  }, {
    key: 'clickQuality',
    value: function clickQuality() {
      (0, _AudioManager.playAudio)('click');
      if (_ScaleManager.scaleFactor === 1) {
        _ScaleManager.$set.call(this, 0.5);
        _StorageManager.PPTStorage.set('PPT-quality', 0.5);
      } else {
        _ScaleManager.$set.call(this, 1);
        _StorageManager.PPTStorage.set('PPT-quality', 1);
      }
    }
  }, {
    key: 'clickLang',
    value: function clickLang() {
      var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en_en';

      (0, _AudioManager.playAudio)('click');
      _i18n2.default.set(lang);
      _StorageManager.PPTStorage.set('PPT-lang', lang);
      this.game.state.start(this.state.current);
    }
  }, {
    key: 'clickStart',
    value: function clickStart() {
      var _this7 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.time.events.add(200, function () {
        _this7.game.state.start('Game');
      });
    }
  }, {
    key: 'clickHelp',
    value: function clickHelp() {
      var _this8 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      _StorageManager.PPTStorage.set('PPT-tutorial', false);
      this.time.events.add(200, function () {
        _this8.game.state.start('Game');
      });
    }
  }, {
    key: 'clickWiki',
    value: function clickWiki() {
      var _this9 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.camera.onFadeComplete.add(function () {
        _this9.game.state.start('Wiki');
      }, this);
    }
  }, {
    key: 'clickCredits',
    value: function clickCredits() {
      var _this10 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.camera.onFadeComplete.add(function () {
        _this10.game.state.start('Credits');
      }, this);
    }
  }, {
    key: 'update',
    value: function update() {
      Clock.updateClock(this);
    }
  }]);

  return MainMenu;
}(Phaser.State);

exports.default = MainMenu;

},{"../UI/Text":3,"../constants/UIConstants":9,"../utils/AudioManager":30,"../utils/ClockUtils":31,"../utils/ScaleManager":34,"../utils/StorageManager":35,"../utils/i18n":36}],27:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _StorageManager = require('../utils/StorageManager');

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

var resources = {
  'image': [['background', 'img/background.png'], ['title', 'img/title.png'], ['logo-pigames', 'img/logo-pigames.png'], ['overlay', 'img/ui/overlay.png'], ['sheet', 'img/ui/sheet.png'], ['minute-dial', 'img/assets/minute-dial.png'], ['hour-dial', 'img/assets/hour-dial.png'], ['nutrition-bar-background', 'img/ui/nutrition-bar-background.png'], ['nutrition-bar-indicator', 'img/ui/nutrition-bar-indicator.png'], ['heart', 'img/assets/heart.png']],
  'spritesheet': [['button-start', 'img/ui/button-start.png', 320, 320], ['button-continue', 'img/ui/button-start.png', 320, 320], ['button-mainmenu', 'img/ui/button-mainmenu.png', 160, 160], ['button-restart', 'img/ui/button-tryagain.png', 160, 160], ['button-options', 'img/ui/button-options.png', 160, 160], ['button-credits-en_gb', 'img/ui/button-credits-en_gb.png', 160, 160], ['button-credits-pl_pl', 'img/ui/button-credits-pl_pl.png', 160, 160], ['button-credits-de_de', 'img/ui/button-credits-pl_pl.png', 160, 160], ['button-help', 'img/ui/button-help.png', 160, 160], ['button-wiki', 'img/ui/button-wiki.png', 160, 160], ['button-pause', 'img/ui/button-pause.png', 160, 160], ['button-audio', 'img/ui/button-sound.png', 160, 160], ['button-back', 'img/ui/button-back.png', 160, 170], ['button-next', 'img/ui/button-next.png', 160, 170], ['button-lang-en_gb', 'img/ui/button-lang-en_gb.png', 160, 160], ['button-lang-pl_pl', 'img/ui/button-lang-pl_pl.png', 160, 160], ['button-lang-de_de', 'img/ui/button-lang-de_de.png', 160, 160], ['bob', 'img/assets/bob.png', 458, 989], ['nutrition-bar', 'img/ui/nutrition-bar.png', 680, 56], ['products-en_gb', 'img/assets/products-en_gb.png', 200, 150], ['products-pl_pl', 'img/assets/products-pl_pl.png', 200, 150], ['products-de_de', 'img/assets/products-de_de.png', 200, 150], ['button-quality', 'img/ui/button-quality.png', 160, 160]],
  'audio': [['audio-click', ['sfx/click.mp3', 'sfx/click.ogg']], ['audio-theme', ['sfx/farty-mcsty.m4a', 'sfx/farty-mcsty.mp3', 'sfx/farty-mcsty.ogg']], ['audio-bite', ['sfx/bite.mp3', 'sfx/bite.ogg']]]
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
      this.add.sprite(0, 0, 'loadingbg');
      this.add.sprite((this.world.width - 580) * 0.5, (this.world.height + 150) * 0.5, 'loading-background');
      var preloadProgress = this.add.sprite((this.world.width - 540) * 0.5, (this.world.height + 170) * 0.5, 'loading-progress');
      this.load.setPreloadSprite(preloadProgress);

      this._preloadResources();
    }
  }, {
    key: '_preloadResources',
    value: function _preloadResources() {
      var _this2 = this;

      this.span = document.createElement('span');
      this.span.innerHTML = 'Zażółć';
      this.span.setAttribute('style', 'position: absolute; font-family: Arial,  monospace; font-size: 300px; top: -99999px; left: -99999px; opacity: 0;');
      document.body.appendChild(this.span);
      this.initialFontSize = this.span.clientHeight;
      this.span.style.fontFamily = '"Bromine"';

      var _loop = function _loop(method) {
        resources[method].forEach(function (args) {
          var loader = _this2.load[method];
          if (method === 'image' || method === 'spritesheet') {
            var args50 = args.concat();
            args50[0] += '-50';
            args50[1] = args50[1].replace('img/', 'img50/');
            args50[2] /= 2;
            args50[3] /= 2;

            loader && loader.apply(_this2.load, args50);
          }

          loader && loader.apply(_this2.load, args);
        }, _this2);
      };

      for (var method in resources) {
        _loop(method);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.initialFontSize !== this.span.clientHeight) {
        (0, _StorageManager.setStorage)(this.game.plugins.add(Phaser.Plugin.Storage));

        if (_StorageManager.PPTStorage.get('PPT-quality') === 0.5) {
          _ScaleManager.$set.call(this, 0.5);
        }

        for (var x = 0; x < navigator.languages.length; x++) {
          var lang = navigator.languages[x];
          if (lang.toLowerCase().indexOf('en') >= 0) {
            _i18n2.default.set('en_gb');
            break;
          }

          if (lang.toLowerCase().indexOf('pl') >= 0) {
            _i18n2.default.set('pl_pl');
            break;
          }

          if (lang.toLowerCase().indexOf('de') >= 0) {
            _i18n2.default.set('de_de');
            break;
          }
        }

        if (_StorageManager.PPTStorage.get('PPT-lang')) {
          _i18n2.default.set(_StorageManager.PPTStorage.get('PPT-lang'));
        }

        document.body.removeChild(this.span);
        this.state.start('MainMenu');
        // this.state.start( 'Game' );
      }
    }
  }]);

  return Preloader;
}(Phaser.State);

exports.default = Preloader;

},{"../utils/ScaleManager":34,"../utils/StorageManager":35,"../utils/i18n":36}],28:[function(require,module,exports){
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

var _ScaleManager = require('../utils/ScaleManager');

var _i18n = require('../utils/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _AudioManager = require('../utils/AudioManager');

var _FoodConstants = require('../constants/FoodConstants');

var _UIConstants = require('../constants/UIConstants');

var _Text = require('../UI/Text');

var _Text2 = _interopRequireDefault(_Text);

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

var Wiki = function (_Phaser$State) {
  _inherits(Wiki, _Phaser$State);

  function Wiki() {
    _classCallCheck(this, Wiki);

    return _possibleConstructorReturn(this, (Wiki.__proto__ || Object.getPrototypeOf(Wiki)).apply(this, arguments));
  }

  _createClass(Wiki, [{
    key: 'create',
    value: function create() {
      this.add.sprite(0, 0, (0, _ScaleManager.$)('loadingbg'));
      this.camera.flash(0x000000, 500, false);

      this.ui = this.add.group();

      var buttonBack = this.add.button(this.world.width - _UIConstants.MENU_BUTTON_OFFSET, this.game.world.height - _UIConstants.MENU_BUTTON_OFFSET, (0, _ScaleManager.$)('button-mainmenu'), this.clickBack, this, 1, 0, 2);
      buttonBack.anchor.set(1, 1);
      buttonBack.x = this.world.width + buttonBack.width + _UIConstants.MENU_BUTTON_OFFSET;
      this.add.tween(buttonBack).to({ x: this.world.width - _UIConstants.MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true);

      this.buttonNext = this.add.button(0, this.world.height / 2, (0, _ScaleManager.$)('button-next'), this.goToNextWikiPage, this, 1, 0, 2);
      this.buttonNext.x = this.world.width - 64;
      this.buttonNext.anchor.setTo(1, 0.5);

      this.buttonPrev = this.add.button(64, this.world.height / 2, (0, _ScaleManager.$)('button-back'), this.goToPrevWikiPage, this, 1, 0, 2);
      this.buttonPrev.anchor.setTo(0, 0.5);

      this.ui.add(buttonBack);
      this.ui.add(this.buttonNext);
      this.ui.add(this.buttonPrev);

      this.pages = [];
      var prevPage = this.add.group();
      this.fillGroupWithFoodData(prevPage, _FoodConstants.FOOD_DATA.length - 1);
      this.pages.push(prevPage);

      prevPage.position.y = this.world.height / 2 - prevPage.height / 2;
      prevPage.position.x -= this.world.width;

      var currentPage = this.add.group();
      this.fillGroupWithFoodData(currentPage, 0);
      this.pages.push(currentPage);

      currentPage.position.y = this.world.height / 2 - currentPage.height / 2;

      var nextPage = this.add.group();
      this.fillGroupWithFoodData(nextPage, 1);
      this.pages.push(nextPage);

      nextPage.position.y = this.world.height / 2 - nextPage.height / 2;
      nextPage.position.x += this.world.width;
    }
  }, {
    key: 'fillGroupWithFoodData',
    value: function fillGroupWithFoodData(group, index) {
      group.index = index;
      group.removeAll(true);

      var sheet = this.add.sprite(this.game.width / 2, 0, (0, _ScaleManager.$)('sheet'));
      sheet.anchor.setTo(0.5, 0);

      var capitalise = function capitalise(text) {
        return text.substring(0, 1).toUpperCase() + text.substring(1);
      };

      var title = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(220), '' + capitalise(_i18n2.default.text(_FoodConstants.FOOD_DATA[index].name)), (0, _ScaleManager.$)(_UIConstants.WIKI_TITLE_FONT), [null, 1]);

      var sprite = this.add.sprite(this.game.width / 2, (0, _ScaleManager.$)(380), (0, _ScaleManager.$)(_i18n2.default.image('products')), _FoodConstants.FOOD_DATA[index].key);
      sprite.scale.setTo(1.5);
      sprite.anchor.setTo(0.5);

      var iQuantity = function iQuantity(args) {
        return _i18n2.default.text(args[0], args[1]);
      };

      var carbohydrates = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(600), capitalise(_i18n2.default.text('carbohydrates_name')) + ': ' + _FoodConstants.FOOD_DATA[index].nutritionFacts.carbohydrates + 'g', (0, _ScaleManager.$)(_UIConstants.WIKI_FONT), [null, 1]);
      var fats = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(714), capitalise(_i18n2.default.text('fats_name')) + ': ' + _FoodConstants.FOOD_DATA[index].nutritionFacts.fats + 'g', (0, _ScaleManager.$)(_UIConstants.WIKI_FONT), [null, 1]);
      var proteins = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(828), capitalise(_i18n2.default.text('proteins_name')) + ': ' + _FoodConstants.FOOD_DATA[index].nutritionFacts.proteins + 'g', (0, _ScaleManager.$)(_UIConstants.WIKI_FONT), [null, 1]);
      var quantity = new _Text2.default(this.game, 'center', (0, _ScaleManager.$)(943), capitalise(_i18n2.default.text('wiki_quantity')) + ': ' + iQuantity(_FoodConstants.FOOD_DATA[index].quantity), (0, _ScaleManager.$)(_UIConstants.WIKI_FONT), [null, 1]);

      group.add(sheet);
      group.add(title);
      group.add(sprite);
      group.add(carbohydrates);
      group.add(fats);
      group.add(proteins);
      group.add(quantity);
    }
  }, {
    key: 'goToPrevWikiPage',
    value: function goToPrevWikiPage() {
      var _this2 = this;

      this.add.tween(this.pages[1].position).to({ x: this.world.width }, 250, Phaser.Easing.Linear.In, true);
      var tweenIn = this.add.tween(this.pages[0].position).to({ x: 0 }, 250, Phaser.Easing.Linear.Out, true);
      this.game.world.bringToTop(this.ui);

      this.buttonPrev.inputEnabled = false;

      tweenIn.onComplete.add(function () {
        _this2.buttonPrev.inputEnabled = true;
        _this2.pages[0].position.x = 0;

        var currentIndex = _this2.pages[0].index - 1;

        if (currentIndex < 0) {
          currentIndex = _FoodConstants.FOOD_DATA.length - 1;
          _this2.currentPageIndex = _FoodConstants.FOOD_DATA.length - 1;
        }

        var prevPage = _this2.add.group();
        _this2.fillGroupWithFoodData(prevPage, currentIndex);
        prevPage.position.y = _this2.world.height / 2 - prevPage.height / 2;
        prevPage.position.x = _this2.world.width * -1;

        _this2.pages.pop();
        _this2.pages.unshift(prevPage);
      });
    }
  }, {
    key: 'goToNextWikiPage',
    value: function goToNextWikiPage() {
      var _this3 = this;

      this.add.tween(this.pages[1].position).to({ x: this.world.width * -1 }, 250, Phaser.Easing.Linear.In, true);
      var tweenIn = this.add.tween(this.pages[2].position).to({ x: 0 }, 250, Phaser.Easing.Linear.Out, true);
      this.game.world.bringToTop(this.ui);
      this.buttonNext.inputEnabled = false;

      tweenIn.onComplete.add(function () {
        _this3.buttonNext.inputEnabled = true;
        _this3.pages[2].position.x = 0;

        var currentIndex = _this3.pages[2].index + 1;

        if (currentIndex >= _FoodConstants.FOOD_DATA.length) {
          currentIndex = 0;
          _this3.currentPageIndex = 0;
        }

        var nextPage = _this3.add.group();
        _this3.fillGroupWithFoodData(nextPage, currentIndex);
        nextPage.position.y = _this3.world.height / 2 - nextPage.height / 2;
        nextPage.position.x = _this3.world.width;

        _this3.pages.shift();
        _this3.pages.push(nextPage);
      });
    }
  }, {
    key: 'clickBack',
    value: function clickBack() {
      var _this4 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.camera.onFadeComplete.add(function () {
        _this4.game.state.start('MainMenu');
      }, this);
    }
  }]);

  return Wiki;
}(Phaser.State);

exports.default = Wiki;

},{"../UI/Text":3,"../constants/FoodConstants":7,"../constants/UIConstants":9,"../utils/AudioManager":30,"../utils/ScaleManager":34,"../utils/i18n":36}],29:[function(require,module,exports){
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

var _Credits = require('./Credits');

var _Credits2 = _interopRequireDefault(_Credits);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
  Wiki: _Wiki2.default, Boot: _Boot2.default, Game: _Game2.default, MainMenu: _MainMenu2.default, Preloader: _Preloader2.default, Credits: _Credits2.default
};

},{"./Boot":23,"./Credits":24,"./Game":25,"./MainMenu":26,"./Preloader":27,"./Wiki":28}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAudioOffset = undefined;
exports.manageAudio = manageAudio;
exports.playAudio = playAudio;
exports.getStatusAudio = getStatusAudio;

var _StorageManager = require('./StorageManager');

var _audioStatus = void 0;
var _sound = void 0;
var _soundMusic = void 0;
var _audioOffset = void 0;

function manageAudio(mode, game) {
  switch (mode) {
    case 'init':
      {
        _StorageManager.PPTStorage.initUnset('PPT-audio', true);
        _audioStatus = _StorageManager.PPTStorage.get('PPT-audio');
        // PPT._soundClick = game.add.audio('audio-click');
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
  _StorageManager.PPTStorage.set('PPT-audio', _audioStatus);
  game.buttonAudio.setFrames(_audioOffset + 1, _audioOffset + 0, _audioOffset + 2);
}
function playAudio(sound) {
  if (_audioStatus) {
    if (_sound && _sound[sound]) {
      _sound[sound].play();
    }
  }
}

function getStatusAudio() {
  return _audioStatus;
}

var getAudioOffset = exports.getAudioOffset = function getAudioOffset() {
  return _audioOffset;
};

},{"./StorageManager":35}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initClock = initClock;
exports.updateClock = updateClock;

var _ScaleManager = require('./ScaleManager');

function initClock(state) {
  var now = new Date();
  state.Clock = {};
  state.Clock.minuteDial = state.game.add.sprite((0, _ScaleManager.$)(847), (0, _ScaleManager.$)(243), (0, _ScaleManager.$)('minute-dial'));
  state.Clock.minuteDial.anchor.setTo(0.5, 1);
  state.Clock.minuteDial.angle = now.getMinutes() / 60 * 360;

  state.Clock.hourDial = state.game.add.sprite((0, _ScaleManager.$)(847), (0, _ScaleManager.$)(243), (0, _ScaleManager.$)('hour-dial'));
  state.Clock.hourDial.anchor.setTo(0.5, 1);
  state.Clock.hourDial.angle = now.getHours() % 12 / 12 * 360 + now.getMinutes() / 60 * 30;
}

function updateClock(state) {
  var now = new Date();
  state.Clock.minuteDial.angle = now.getMinutes() / 60 * 360;

  state.Clock.hourDial.angle = now.getHours() % 12 / 12 * 360 + now.getMinutes() / 60 * 30;
}

},{"./ScaleManager":34}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatus = getStatus;
exports.getFoodWithParticularMacros = getFoodWithParticularMacros;
exports.getDominatingMacroValue = getDominatingMacroValue;
exports.getDominatingMacro = getDominatingMacro;

var _WeightBreakpoints = require('../constants/WeightBreakpoints');

function getStatus(value, goodAmount) {
  for (var i = 0; i < _WeightBreakpoints.FATNESS_LEVELS.length; i++) {
    if (value > goodAmount * _WeightBreakpoints.FATNESS_LEVELS[i]) {
      return _WeightBreakpoints.FATNESS_LEVELS.length - i + 8;
    }
  }

  for (var _i = 0; _i < _WeightBreakpoints.THINNESS_LEVELS.length; _i++) {
    if (value < goodAmount * _WeightBreakpoints.THINNESS_LEVELS[_i]) {
      return _i;
    }
  }

  return 8;
}

function getFoodWithParticularMacros(foodData, macroKey) {
  return foodData.filter(function (food) {
    return getDominatingMacroValue(food) === food.nutritionFacts[macroKey];
  });
}

function getDominatingMacroValue(food) {
  var macros = food.nutritionFacts;
  return Math.max(macros.carbohydrates, macros.fats, macros.proteins);
}

function getDominatingMacro(food) {
  var dominatingValue = getDominatingMacroValue(food);
  var macros = food.nutritionFacts;
  for (var macroKey in food.nutritionFacts) {
    if (macros[macroKey] === dominatingValue) {
      return macroKey;
    }
  }
}

},{"../constants/WeightBreakpoints":10}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scaleFactor = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

exports.$ = $;
exports.$set = $set;

var _CanvasConstants = require('../constants/CanvasConstants');

var scaleFactor = exports.scaleFactor = 1;

/**
  This magic function handles scaling of game assets.

  // Using on numbers
  @param {number} value
  @returns {number} - value multiplied by scaleFactor

  // Using on sprite keys
  @param {string} value
  @returns {string} - value with added suffix for sprite naming

  // Using with onScale
  @param {string|number} value
  @param {number} onScale
  @returns {string=''|number=0} - returns value only if onScale equlas scaleFactor

  // Using with text styles
  @param {object} value
  @returns {object} - multiplies fontSize by scaleFactor
 */

function $(value, onScale) {
  var typeofVal = typeof value === 'undefined' ? 'undefined' : _typeof(value);

  if (typeofVal === 'string') {
    if (onScale) {
      if (onScale === scaleFactor) {
        return value;
      }

      return '';
    }

    if (scaleFactor !== 1) {
      return value + '-' + scaleFactor * 100;
    }

    return '' + value;
  } else if (typeofVal === 'number') {
    if (onScale) {
      if (onScale === scaleFactor) {
        return value;
      }

      return 0;
    }

    return value * scaleFactor;
  } else if (typeofVal === 'object' && value.fontSize) {
    var styles = Object.assign({}, value);
    styles.fontSize = $(styles.fontSize);

    return styles;
  }
}

function $set(newScaleFactor) {
  exports.scaleFactor = scaleFactor = newScaleFactor;

  this.game.scale.setGameSize($(_CanvasConstants.CANVAS_WIDTH), $(_CanvasConstants.CANVAS_HEIGHT));
  this.game.state.start(this.state.current);
}

},{"../constants/CanvasConstants":5}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStorage = setStorage;
var PPTStorage = exports.PPTStorage = void 0;

function setStorage(storage) {
  exports.PPTStorage = PPTStorage = storage;
}

},{}],36:[function(require,module,exports){
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

var _locales = require('../locales/');

var _locales2 = _interopRequireDefault(_locales);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var CURRENT_LANG = 'en_gb';

var i18n = function () {
  function i18n() {
    _classCallCheck(this, i18n);
  }

  _createClass(i18n, [{
    key: 'text',
    value: function text(id) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length > 0) {
        return _locales2.default[CURRENT_LANG][id].text(args) || '';
      }
      return _locales2.default[CURRENT_LANG][id].text || '';
    }
  }, {
    key: 'quotes',
    value: function quotes(text) {
      var quoteTypes = {
        opening: '”',
        closing: '”'
      };

      if (_locales2.default[CURRENT_LANG] && _locales2.default[CURRENT_LANG]['quote_types']) {
        quoteTypes = _locales2.default[CURRENT_LANG]['quote_types'];
      }

      return text.replace(/„/g, quoteTypes.opening).replace(/”/g, quoteTypes.closing);
    }
  }, {
    key: 'set',
    value: function set(lang) {
      if (_locales2.default[lang]) {
        CURRENT_LANG = lang;
      }
    }
  }, {
    key: 'get',
    value: function get() {
      return CURRENT_LANG;
    }
  }, {
    key: 'image',
    value: function image(name) {
      return name + '-' + CURRENT_LANG;
    }
  }]);

  return i18n;
}();

exports.default = new i18n();

},{"../locales/":14}]},{},[11])
//# sourceMappingURL=game.js.map
