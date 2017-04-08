import { MIN_FRUIT_VELOCITY, MAX_FRUIT_VELOCITY } from '../constants/FoodConstants';

export default class Food extends Phaser.Sprite {
  constructor( game, key, isHealthy ) {
    super( game, 50, 50, key );
    this.scale.setTo( 0.1 );
    this.game.physics.enable( this );

    this.body.velocity.x = Math.floor(
      Math.random() * MAX_FRUIT_VELOCITY - MIN_FRUIT_VELOCITY ) + MIN_FRUIT_VELOCITY;
    this.body.velocity.y = Math.floor(
      Math.random() * MAX_FRUIT_VELOCITY - MIN_FRUIT_VELOCITY ) + MIN_FRUIT_VELOCITY;

    this.game.world.add( this );
  }
}
