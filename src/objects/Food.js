import { MIN_FOOD_VELOCITY, MAX_FOOD_VELOCITY, FOOD_TWEEN_SPEED, FOOD_TWEEN_X, FOOD_TWEEN_Y, FOOD_SCALE, FOOD_TWEEN_SCALE } from '../constants/FoodConstants';

export default class Food extends Phaser.Sprite {
  constructor( game, x, y, key, data, updateStatsSignal, onDestroy ) {
    super( game, x, y, 'products', key );
    this.onDestroy = onDestroy;
    this.data = data;
    this.updateStatsSignal = updateStatsSignal;
    this.scale.setTo( FOOD_SCALE );
    this.anchor.setTo( 0.5, 0.5 );
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
    const tweenScale = this.game.add.tween( this.scale );
    const tweenSpin = this.game.add.tween( this );
    tween.to( { x: this.game.world.centerX - FOOD_TWEEN_X, y: this.game.world.height - FOOD_TWEEN_Y }, FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true );
    tweenScale.to( { x: FOOD_TWEEN_SCALE, y: FOOD_TWEEN_SCALE }, FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true );
    tweenSpin.to( { angle: 360 }, FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true );

    tween.onComplete.add( () => {
      this.updateStatsSignal.dispatch( this.data );
      this.onDestroy( this );
    } );
  }
}
