import { MIN_FOOD_VELOCITY, MAX_FOOD_VELOCITY } from '../constants/FoodConstants';

export default class Food extends Phaser.Sprite {
  constructor( game, x, y, key, data, NutritionManager, onDestroy ) {
    super( game, x, y, 'products', key );
    this.onDestroy = onDestroy;
    this.data = data;
    this.NutritionManager = NutritionManager;
    this.scale.setTo( 0.75 );
    this.game.physics.enable( this );

    const directionX = x > this.game.world.centerX ? -1 : 1;
    const directionY = y > this.game.world.centerY ? -1 : 1;

    this.velocityX = directionX * ( Math.floor(
      Math.random() * ( MAX_FOOD_VELOCITY - MIN_FOOD_VELOCITY ) ) + MIN_FOOD_VELOCITY );
    this.body.velocity.x = this.velocityX;

    this.velocityY = directionY * ( Math.floor(
      Math.random() * ( MAX_FOOD_VELOCITY - MIN_FOOD_VELOCITY ) ) + MIN_FOOD_VELOCITY );
    this.body.velocity.y = this.velocityY;

    this.inputEnabled = true;
    this.events.onInputDown.add( this.handleClick, this );

    this.events.onInputOver.add( () => {
      game.canvas.style.cursor = 'pointer';
    } );

    this.events.onInputOut.add( () => {
      game.canvas.style.cursor = 'default';
    } );
    this.hasEnteredScreen = false;
    this.checkWorldBounds = true;
    this.events.onEnterBounds.add( () => {
      this.hasEnteredScreen = true;
    } );
    this.events.onOutOfBounds.add( () => {
      if ( this.hasEnteredScreen ) {
        this.onDestroy( this );
      }
    } );


    this.game.world.add( this );
  }

  handleClick() {
    const tween = this.game.add.tween( this );
    tween.to( { x: this.game.world.centerX - 40, y: this.game.world.height - 680 }, 500, Phaser.Easing.Linear.None, true );
    tween.onComplete.add( () => {
      this.NutritionManager.updateStats( this.data );
      this.onDestroy( this );
    } );
  }
}
