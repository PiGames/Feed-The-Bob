import GameUI from '../UI/GameUI';

import FoodSpawner from '../objects/FoodSpawner';
import Bob from '../objects/Bob';

import NutritionManager from '../objects/NutritionManager';
import HealthHandler from '../objects/HealthHandler';

import { BOB_OFFSET_Y } from '../constants/BobConstants';

export default class Game extends Phaser.State {
  create() {
    this.gameUI = new GameUI( this );

    this.NutritionManager = new NutritionManager( this.game );
    this.bob = new Bob( this.game, this.world.width / 2, this.world.height - BOB_OFFSET_Y, 'bob', this.NutritionManager, this.gameUI.stateGameover.bind( this.gameUI ) );
    this.bob.onScoreValueChange.add( ( ...args ) => this.gameUI.onScoreValueChange( ...args ) );

    const healthHandler = new HealthHandler();
    this.bob.onWeightChange.add( ( ...args ) => healthHandler.setShouldBobBeHarmed( ...args ) );
    this.gameUI.timeAdvance.add( () => healthHandler.doHarmToBob() );
    healthHandler.onHealthUpdate.add( ( ...args ) => this.gameUI.updateHealthBarValue( ...args ) );
    healthHandler.onHealthUpdate.add( ( ...args ) => this.checkForDeath( ...args ) );

    this.foodSpawner = new FoodSpawner( this.game, this.NutritionManager, true );
    this.foodContainer = this.foodSpawner.children;

    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    this.game.physics.startSystem( Phaser.Physics.ARCADE );

    this.game.onResume.add( () => {
      if ( this.gameUI.stateStatus !== 'playing' ) {
        this.game.time.events.pause();
      }
    } );
  }

  checkForDeath( health ) {
    if ( health <= 0 ) {
      this.gameUI.stateGameover( 'dangerous nutriotion style' );
      this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt = false;
    }
  }

  update() {
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
}
