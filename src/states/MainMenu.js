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

    PPTStorage.initUnset( 'PPT-highscore', 0 );
    const highscore = PPTStorage.get( 'PPT-highscore' ) || 0;

    const buttonEnclave = this.add.button( 20, 20, 'logo-pigames', this.clickPiGames, this );
    const buttonStart = this.add.button( this.world.width - 20, this.world.height - 20, 'button-start', this.clickStart, this, 1, 0, 2 );
    buttonStart.anchor.set( 1 );

    const buttonWiki = this.add.button( 20, this.world.height - 20, 'button-wiki', this.clickWiki, this, 1, 0, 2 );
    buttonWiki.anchor.set( 0, 1 );

    const highscoreText = new Text( this.game, 'center', this.world.height - 50, 'Highscore: ' + highscore, MENU_HIGHSCORE_FONT, [ null, 1 ] );
    highscoreText.padding.set( 0, 15 );

    this.initOptions();

    manageAudio( 'init', this );

    if ( getStatusAudio() !== true ) {
      manageAudio( 'off', this );
    }

    buttonStart.x = this.world.width + buttonStart.width + 20;
    this.add.tween( buttonStart ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );
    this.buttonOptions.y = -this.buttonOptions.height - 20;
    this.add.tween( this.buttonOptions ).to( { y: 20 }, 500, Phaser.Easing.Exponential.Out, true );
    buttonEnclave.x = -buttonEnclave.width - 20;
    this.add.tween( buttonEnclave ).to( { x: 20 }, 500, Phaser.Easing.Exponential.Out, true );
    buttonWiki.y = this.world.height + buttonWiki.height + 20;
    this.add.tween( buttonWiki ).to( { y: this.world.height - 20 }, 500, Phaser.Easing.Exponential.Out, true );

    this.camera.flash( 0x000000, 500, false );
  }

  initOptions() {
    this.ui = [];

    this.buttonAudio = this.add.button( this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );
    this.buttonAudio.visible = false;
    this.ui.push( this.buttonAudio );

    this.buttonCredits = this.add.button( this.world.width - 20, 20, 'button-credits', this.clickCredits, this, 1, 0, 2 );
    this.buttonCredits.anchor.set( 1, 0 );
    this.buttonCredits.visible = false;
    this.ui.push( this.buttonCredits );

    this.optionsExpanded = false;
    this.buttonOptions = this.add.button( this.world.width - 20, 20, 'button-options', this.clickOptions, this, 1, 0, 2 );
    this.buttonOptions.anchor.set( 1, 0 );
  }

  clickOptions() {
    if ( this.optionsExpanded ) {
      this.contractOptions();
    } else {
      this.expandOptions();
    }
  }

  expandOptions() {
    this.optionsExpanded = true;
    let prevX = 0;

    this.ui.forEach( ( button, i ) => {
      button.visible = true;
      this.add.tween( button.position ).to( { x: this.world.width - button.width - prevX - ( 20 * ( i + 2 ) ) }, 500, Phaser.Easing.Exponential.Out, true );
      prevX += button.width;
    } );
  }

  contractOptions() {
    this.optionsExpanded = false;

    this.ui.forEach( ( button ) => {
      const tween = this.add.tween( button.position ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );

      tween.onComplete.add( () => {
        if ( !this.optionsExpanded ) {
          button.visible = false;
        }
      } );
    } );
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

  clickWiki() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.camera.onFadeComplete.add( () => {
      this.game.state.start( 'Wiki' );
    }, this );
  }

  clickCredits() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.camera.onFadeComplete.add( () => {
      this.game.state.start( 'Credits' );
    }, this );
  }
}
