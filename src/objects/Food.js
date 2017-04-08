export default class Food extends Phaser.State {
  constructor( game, key, isHealthy ) {
    super( game, 50, 50, key );

    this.game.world.add( this );
  }
}
