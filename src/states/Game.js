/* global texta_close, texta_win */

import { $ } from '../utils/ScaleManager';
import GameUI from '../UI/GameUI';

import FoodSpawner from '../objects/FoodSpawner';
import Bob from '../objects/Bob';
import NutritionManager from '../objects/NutritionManager';
import HealthHandler from '../objects/HealthHandler';
import { initFoodDataManager } from '../objects/FoodDataManager';

import * as Clock from '../utils/ClockUtils';

import { BOB_OFFSET_Y } from '../constants/BobConstants';

export default class Game extends Phaser.State {
  create() {
    initFoodDataManager();

    this.game.add.sprite( 0, 0, $( 'background' ) );
    this.foodSpawner = new FoodSpawner( this.game, true );
    this.foodContainer = this.foodSpawner.children;

    this.NutritionManager = new NutritionManager( this.game );
    this.bob = new Bob( this.game, this.world.width / 2, this.world.height - $( BOB_OFFSET_Y ), $( 'bob' ), this.NutritionManager );
    this.gameUI = new GameUI( this, this.bob, this.NutritionManager );

    this.foodSpawner.updateStatsSignal.add( ( ...args ) => this.NutritionManager.updateStats( ...args ) );
    this.foodSpawner.onDifficultyLevelUp.add( ( ...args ) => this.NutritionManager.growDifficulty( ...args ) );
    this.foodSpawner.onDifficultyLevelUp.add( ( ...args ) => this.gameUI.difficultyChange( ...args ) );

    this.bob.onScoreValueChange.add( ( ...args ) => this.gameUI.onScoreValueChange( ...args ) );
    this.bob.onScoreValueChange.add( ( ...args ) => this.onScoreValueChange( ...args ) );

    const healthHandler = new HealthHandler();
    this.bob.onWeightChange.add( ( ...args ) => healthHandler.setShouldBobBeHarmed( ...args ) );
    this.gameUI.timeAdvance.add( () => healthHandler.doHarmToBob() );
    healthHandler.onHealthUpdate.add( ( ...args ) => this.gameUI.updateHealthBarValue( ...args ) );
    healthHandler.onHealthUpdate.add( ( ...args ) => this.checkForDeath( ...args ) );

    Clock.initClock( this );

    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    this.game.physics.startSystem( Phaser.Physics.ARCADE );

    this.game.onResume.add( () => {
      if ( this.gameUI.stateStatus === 'paused' || this.gameUI.stateStatus === 'gameover' || this.gameUI.stateStatus === 'tutorial' ) {
        this.game.time.events.pause();
      }
    } );

    // don't bother it's just a hot fix, or not...
    this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt = true;

    this.gameUI.onScoreUpdate.add( this.onScoreValueChange, this );
  }

  checkForDeath( health ) {
    if ( health <= 0 ) {
      // API LOSE CALL
      texta_close();
      // this.gameUI.stateGameover( i18n.text( 'game_deathtype_dangerous_nutrition_style' ) );
      // this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt = false;
    }
  }

  update() {
    Clock.updateClock( this );
    this.gameUI.updateUI();
    this.bob.handleWeightChange();
  }

  stopMovingFood() {
    this.foodContainer.forEach( food => {
      food.body.velocity.x = 0;
      food.body.velocity.y = 0;
    } );
    this.game.time.events.pause();
  }

  restoreFoodMovement() {
    this.foodContainer.forEach( food => {
      food.body.velocity.x = food.velocityX;
      food.body.velocity.y = food.velocityY;
    } );
    this.game.time.events.resume();
  }
  onScoreValueChange( score ) {
    console.log( 'change' );
    if ( score > 30 ) {
      alert( 'win' );
      this.stopMovingFood();
      // API WIN CALL
      texta_win();
    }
  }
}
