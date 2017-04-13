import { playAudio, manageAudio } from '../utils/AudioManager';
import { getStorage, setStorage } from '../utils/StorageManager';

export default class MainMenu extends Phaser.State {
  create() {
    this.add.sprite( 0, 0, 'background' );
    const title = this.add.sprite( this.world.width * 0.5, ( this.world.height - 100 ) * 0.5, 'title' );
    title.anchor.set( 0.5 );

    setStorage( this.game.plugins.add( Phaser.Plugin.Storage ) );

    getStorage().initUnset( 'EPT-highscore', 0 );
    const highscore = getStorage().get( 'EPT-highscore' ) || 0;

    const buttonEnclave = this.add.button( 20, 20, 'logo-pigames', this.clickEnclave, this );
    const buttonStart = this.add.button( this.world.width - 20, this.world.height - 20, 'button-start', this.clickStart, this, 1, 0, 2 );
    buttonStart.anchor.set( 1 );

    this.buttonAudio = this.add.button( this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );

    const buttonAchievements = this.add.button( 20, this.world.height - 20, 'button-wiki', this.clickAchievements, this, 1, 0, 2 );
    buttonAchievements.anchor.set( 0, 1 );

    const fontHighscore = { font: '32px Arial', fill: '#000' };
    const textHighscore = this.add.text( this.world.width * 0.5, this.world.height - 50, 'Highscore: ' + highscore, fontHighscore );
    textHighscore.anchor.set( 0.5, 1 );

    manageAudio( 'init', this );
		// Turn the music off at the start:
    manageAudio( 'off', this );

    buttonStart.x = this.world.width + buttonStart.width + 20;
    this.add.tween( buttonStart ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );
    this.buttonAudio.y = -this.buttonAudio.height - 20;
    this.add.tween( this.buttonAudio ).to( { y: 20 }, 500, Phaser.Easing.Exponential.Out, true );
    buttonEnclave.x = -buttonEnclave.width - 20;
    this.add.tween( buttonEnclave ).to( { x: 20 }, 500, Phaser.Easing.Exponential.Out, true );
    buttonAchievements.y = this.world.height + buttonAchievements.height + 20;
    this.add.tween( buttonAchievements ).to( { y: this.world.height - 20 }, 500, Phaser.Easing.Exponential.Out, true );

    this.camera.flash( 0x000000, 500, false );
  }
  clickAudio() {
    playAudio( 'click' );
    manageAudio( 'switch', this );
  }
  clickEnclave() {
    playAudio( 'click' );
    window.top.location.href = 'http://pigam.es/';
  }
  clickStart() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.time.events.add( 200, () => {
      // this.game.state.start( 'Story' );
      this.game.state.start( 'Game' );
    } );
  }
  clickAchievements() {
    playAudio( 'click' );
    this.game.state.start( 'Wiki' );
  }
}
