export default class Fatty extends Phaser.Sprite {
  constructor( game, x, y, imageKey ) {
    super( game, x, y, imageKey );

    this.anchor.setTo( 0.5, 1 );
    this.scale.setTo( 0.5 );

    this.game.world.add( this );
  }
}
