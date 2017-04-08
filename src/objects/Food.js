export default class Food extends Phaser.Sprite {
  constructor( game, key, isHealthy ) {
    super( game, 50, 50, key );
    this.scale.setTo( 0.1 );
    this.game.world.add( this );
  }
}
