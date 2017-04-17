import { playAudio, manageAudio, getStatusAudio } from '../utils/AudioManager';
import { PPTStorage, setStorage } from '../utils/StorageManager';
import Text from '../UI/Text';

import { MENU_HIGHSCORE_FONT } from '../constants/UIConstants';

export default class MainMenu extends Phaser.State {
  create() {
    this.add.sprite( 0, 0, 'background' );
    const title = this.add.sprite( this.world.width * 0.5, ( this.world.height - 100 ) * 0.5, 'title' );
    title.anchor.set( 0.5 );

    setStorage( this.game.plugins.add( Phaser.Plugin.Storage ) );

    PPTStorage.initUnset( 'EPT-highscore', 0 );
    const highscore = PPTStorage.get( 'EPT-highscore' ) || 0;

    const buttonEnclave = this.add.button( 20, 20, 'logo-pigames', this.clickPiGames, this );
    const buttonStart = this.add.button( this.world.width - 20, this.world.height - 20, 'button-start', this.clickStart, this, 1, 0, 2 );
    buttonStart.anchor.set( 1 );

    this.buttonAudio = this.add.button( this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );

    const buttonWiki = this.add.button( 20, this.world.height - 20, 'button-wiki', this.clickAchievements, this, 1, 0, 2 );
    buttonWiki.anchor.set( 0, 1 );

    const highscoreText = new Text( this.game, 'center', this.world.height - 50, 'Highscore: ' + highscore, MENU_HIGHSCORE_FONT, [ null, 1 ] );
    highscoreText.padding.set( 0, 15 );

    manageAudio( 'init', this );

    if ( getStatusAudio() !== true ) {
      // Turn the music off at the start:
      manageAudio( 'off', this );
    }

    buttonStart.x = this.world.width + buttonStart.width + 20;
    this.add.tween( buttonStart ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );
    this.buttonAudio.y = -this.buttonAudio.height - 20;
    this.add.tween( this.buttonAudio ).to( { y: 20 }, 500, Phaser.Easing.Exponential.Out, true );
    buttonEnclave.x = -buttonEnclave.width - 20;
    this.add.tween( buttonEnclave ).to( { x: 20 }, 500, Phaser.Easing.Exponential.Out, true );
    buttonWiki.y = this.world.height + buttonWiki.height + 20;
    this.add.tween( buttonWiki ).to( { y: this.world.height - 20 }, 500, Phaser.Easing.Exponential.Out, true );

    this.camera.flash( 0x000000, 500, false );
  }
  clickAudio() {
    playAudio( 'click' );
    manageAudio( 'switch', this );
  }
  clickPiGames() {
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
