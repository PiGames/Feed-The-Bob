import GameUI from '../UI/GameUI';

import FoodSpawner from '../objects/FoodSpawner';
import Bob from '../objects/Bob';

import NutritionManager from '../objects/NutritionManager';

export default class Game extends Phaser.State {
  create() {
    this.score = 0;
    this.gamePaused = false;
    this.runOnce = false;

    this.gameUI = new GameUI( this );

    this.NutritionManager = new NutritionManager( this.game );
    this.bob = new Bob( this.game, this.world.width / 2, this.world.height - 32, 'bob', this.NutritionManager, this.gameUI.stateGameover.bind( this.gameUI ) );

    this.foodSpawner = new FoodSpawner( this.game, this.NutritionManager, true );
    this.foodContainer = this.foodSpawner.children;

    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    this.game.physics.startSystem( Phaser.Physics.ARCADE );

    this.game.onResume.add( () => {
      if ( this.stateStatus !== 'playing' ) {
        this.game.time.events.pause();
      }
    } );
  }

  update() {
    this.gameUI.updateUI();
    this.bob.hadleWeightChange();
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
