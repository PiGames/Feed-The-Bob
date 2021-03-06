import { $ } from '../utils/ScaleManager';
import i18n from '../utils/i18n';
import { MIN_FOOD_VELOCITY, MAX_FOOD_VELOCITY, FOOD_TWEEN_SPEED, FOOD_TWEEN_X, FOOD_TWEEN_Y, FOOD_SCALE, FOOD_TWEEN_SCALE, FOOD_HIT_AREA_DIAMETER } from '../constants/FoodConstants';

export default class Food extends Phaser.Sprite {
  constructor( game, x, y, key, data, updateStatsSignal, onDestroy ) {
    super( game, x, y, $( i18n.image( 'products' ) ), key );
    this.onDestroy = onDestroy;
    this.data = data;
    this.updateStatsSignal = updateStatsSignal;
    this.scale.setTo( FOOD_SCALE );
    this.anchor.setTo( 0.5, 0.5 );

    this.hitArea = ( new Phaser.Circle() ).setTo( 0, 0, FOOD_HIT_AREA_DIAMETER );

    this.game.physics.enable( this );

    this.directionX = x > this.game.world.centerX ? -1 : 1;
    this.directionY = y > this.game.world.centerY ? -1 : 1;

    this.velocityX = this.directionX * this.game.rnd.integerInRange( $( MIN_FOOD_VELOCITY ), $( MAX_FOOD_VELOCITY ) );

    this.body.velocity.x = this.velocityX;

    this.velocityY = this.directionY * this.game.rnd.integerInRange(
      Math.max( $( MIN_FOOD_VELOCITY ), Math.abs( this.velocityX ) - 10 ),
      Math.min( Math.abs( this.velocityX ) + 10, $( MAX_FOOD_VELOCITY ) ) );

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

    this.events.onOutOfBounds.add( () => {
      if ( this.hasEnteredScreen ) {
        this.onDestroy( this, false );
      }
    } );

    this.game.world.add( this );
  }
  update() {
    if ( !this.hasEnteredScreen && this.game.world.bounds.intersects( this._bounds ) ) {
      this.hasEnteredScreen = true;
    }
  }
  speedUp( speedOffset ) {
    this.body.velocity.x += speedOffset * this.directionX;
    this.body.velocity.y += speedOffset * this.directionY;
  }
  handleClick() {
    const tween = this.game.add.tween( this );
    const tweenScale = this.game.add.tween( this.scale );
    const tweenSpin = this.game.add.tween( this );
    tween.to( { x: this.game.world.centerX - $( FOOD_TWEEN_X ), y: this.game.world.height - $( FOOD_TWEEN_Y ) }, FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true );
    tweenScale.to( { x: $( FOOD_TWEEN_SCALE ), y: $( FOOD_TWEEN_SCALE ) }, FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true );
    tweenSpin.to( { angle: 360 }, FOOD_TWEEN_SPEED, Phaser.Easing.Linear.None, true );

    tween.onComplete.add( () => {
      this.updateStatsSignal.dispatch( this.data );
      this.onDestroy( this, true );
    } );
  }
}
