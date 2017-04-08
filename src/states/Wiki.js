import { playAudio } from '../utils/AudioManager';

export default class Wiki extends Phaser.State {
  create() {
    var fontAchievements = { font: '32px Arial', fill: '#000' };
    this.add.text( 100, 75, 'Achievements screen', fontAchievements );

    const buttonBack = this.add.button( this.world.width - 20, this.game.world.height - 20, 'button-back', this.clickBack, this, 1, 0, 2 );
    buttonBack.anchor.set( 1, 1 );
    buttonBack.x = this.world.width + buttonBack.width + 20;
    this.add.tween( buttonBack ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );
  }
  clickBack() {
    playAudio( 'click' );
    this.game.state.start( 'MainMenu' );
  }
}
