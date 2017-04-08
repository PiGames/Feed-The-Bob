import { playAudio } from '../utils/AudioManager';

export default class Story extends Phaser.State {
  create() {
    this.add.text( 100, 75, 'Story screen', { font: '32px Arial', fill: '#000' } );
    const buttonContinue = this.add.button( this.world.width - 20, this.game.world.height - 20, 'button-continue', this.clickContinue, this, 1, 0, 2 );

    buttonContinue.anchor.set( 1, 1 );
    buttonContinue.x = this.world.width + buttonContinue.width + 20;

    this.add.tween( buttonContinue ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );

    this.camera.flash( 0x000000, 500, false );
  }
  clickContinue() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.camera.onFadeComplete.add( () => {
      this.game.state.start( 'Game' );
    }, this );
  }
}
