import { MIN_FOOD_VELOCITY, MAX_FOOD_VELOCITY } from '../constants/FoodConstants';

export default class Food extends Phaser.Sprite {
  constructor( game, x, y, key ) {
    super( game, x, y, key );
    this.scale.setTo( 0.1 );
    this.game.physics.enable( this );

    const directionX = x > this.game.world.centerX ? -1 : 1;
    const directionY = y > this.game.world.centerY ? -1 : 1;

    this.body.velocity.x = directionX * ( Math.floor(
      Math.random() * MAX_FOOD_VELOCITY - MIN_FOOD_VELOCITY ) + MIN_FOOD_VELOCITY );
    this.body.velocity.y = directionY * ( Math.floor(
      Math.random() * MAX_FOOD_VELOCITY - MIN_FOOD_VELOCITY ) + MIN_FOOD_VELOCITY );

    this.inputEnabled = true;
    this.events.onInputDown.add( this.handleClick, this );

    this.events.onInputOver.add( () => {
      game.canvas.style.cursor = 'pointer';
    }, this );

    this.events.onInputOut.add( () => {
      game.canvas.style.cursor = 'default';
    }, this );


    this.game.world.add( this );
  }

  handleClick() {
    const tween = this.game.add.tween( this );
    tween.to( { x: this.game.world.centerX - 50, y: this.game.world.height - 250 }, 2400, Phaser.Easing.Cubic.InOut, true );
    tween.onComplete.add( () => {
      this.destroy();
    } );
  }
}
