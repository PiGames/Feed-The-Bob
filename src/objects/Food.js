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

    this.game.world.add( this );
  }
}
