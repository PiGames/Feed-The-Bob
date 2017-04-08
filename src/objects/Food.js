import { MIN_FRUIT_VELOCITY, MAX_FRUIT_VELOCITY } from '../constants/FoodConstants';

export default class Food extends Phaser.Sprite {
  constructor( game, x, y, key ) {
    super( game, x, y, key );
    this.scale.setTo( 0.1 );
    this.game.physics.enable( this );

    const directionX = x > this.game.world.centerX ? -1 : 1;
    const directionY = y > this.game.world.centerY ? -1 : 1;

    this.body.velocity.x = directionX * ( Math.floor(
      Math.random() * MAX_FRUIT_VELOCITY - MIN_FRUIT_VELOCITY ) + MIN_FRUIT_VELOCITY );
    console.log( directionX );
    this.body.velocity.y = directionY * ( Math.floor(
      Math.random() * MAX_FRUIT_VELOCITY - MIN_FRUIT_VELOCITY ) + MIN_FRUIT_VELOCITY );

    this.game.world.add( this );
  }
}
