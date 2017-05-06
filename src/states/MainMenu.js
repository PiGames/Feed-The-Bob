import { $, $set, scaleFactor } from '../utils/ScaleManager';
import i18n from '../utils/i18n';
import { playAudio, manageAudio, getStatusAudio } from '../utils/AudioManager';
import { PPTStorage } from '../utils/StorageManager';
import Text from '../UI/Text';


import * as Clock from '../utils/ClockUtils';

import { MENU_HIGHSCORE_FONT, TITLE_OFFSET_Y, MENU_BUTTON_OFFSET } from '../constants/UIConstants';

export default class MainMenu extends Phaser.State {
  create() {
    this.game.add.sprite( 0, 0, $( 'background' ) );
    Clock.initClock( this );

    const title = this.add.sprite( this.world.width * 0.5, ( this.world.height - $( TITLE_OFFSET_Y ) ) * 0.5, $( 'title' ) );
    title.anchor.set( 0.5 );

    PPTStorage.initUnset( 'PPT-highscore', 0 );
    const highscore = PPTStorage.get( 'PPT-highscore' ) || 0;

    const buttonPigames = this.add.button( MENU_BUTTON_OFFSET, MENU_BUTTON_OFFSET, $( 'logo-pigames' ), this.clickPiGames, this );
    const buttonStart = this.add.button( this.world.width - MENU_BUTTON_OFFSET, this.world.height - MENU_BUTTON_OFFSET, $( 'button-start' ), this.clickStart, this, 1, 0, 2 );
    buttonStart.anchor.set( 1 );

    const buttonWiki = this.add.button( MENU_BUTTON_OFFSET, this.world.height - MENU_BUTTON_OFFSET, $( 'button-wiki' ), this.clickWiki, this, 1, 0, 2 );
    buttonWiki.anchor.set( 0, 1 );

    const highscoreText = new Text( this.game, 'center', this.world.height - $( 50 ), i18n.text( 'main_menu_highscore' ) + ': ' + highscore, $( MENU_HIGHSCORE_FONT ), [ null, 1 ] );
    highscoreText.padding.set( 0, 15 );

    this.initOptions();
    this.initLang();

    manageAudio( 'init', this );

    if ( getStatusAudio() !== true ) {
      manageAudio( 'off', this );
    }

    buttonStart.x = this.world.width + buttonStart.width + MENU_BUTTON_OFFSET;
    this.add.tween( buttonStart ).to( { x: this.world.width - MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );
    this.buttonOptions.y = -this.buttonOptions.height - MENU_BUTTON_OFFSET;
    this.add.tween( this.buttonOptions ).to( { y: MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );
    this.buttonLangs.y = -this.buttonOptions.height - MENU_BUTTON_OFFSET;
    this.add.tween( this.buttonLangs ).to( { y: MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );
    buttonPigames.x = -buttonPigames.width - MENU_BUTTON_OFFSET;
    this.add.tween( buttonPigames ).to( { x: MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );
    buttonWiki.y = this.world.height + buttonWiki.height + MENU_BUTTON_OFFSET;
    this.add.tween( buttonWiki ).to( { y: this.world.height - MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );

    this.camera.flash( 0x000000, 500, false );
  }

  initOptions() {
    this.optionsUI = [];

    this.optionsExpanded = false;
    this.buttonOptions = this.add.button( this.world.width - MENU_BUTTON_OFFSET, MENU_BUTTON_OFFSET, $( 'button-options' ), this.clickOptions, this, 1, 0, 2 );
    this.buttonOptions.x -= this.buttonOptions.width + MENU_BUTTON_OFFSET;
    this.buttonOptions.anchor.set( 1, 0 );

    this.buttonAudio = this.add.button( this.buttonOptions.x, MENU_BUTTON_OFFSET, $( 'button-audio' ), this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );
    this.buttonAudio.visible = false;
    this.optionsUI.push( this.buttonAudio );

    this.buttonCredits = this.add.button( this.buttonOptions.x, MENU_BUTTON_OFFSET, $( 'button-credits' ), this.clickCredits, this, 1, 0, 2 );
    this.buttonCredits.anchor.set( 1, 0 );
    this.buttonCredits.visible = false;
    this.optionsUI.push( this.buttonCredits );

    this.buttonHelp = this.add.button( this.buttonOptions.x, MENU_BUTTON_OFFSET, $( 'button-help' ), this.clickHelp, this, 1, 0, 2 );
    this.buttonHelp.anchor.set( 1, 0 );
    this.buttonHelp.visible = false;
    this.optionsUI.push( this.buttonHelp );

    this.buttonQuality = this.add.button( this.buttonOptions.x, MENU_BUTTON_OFFSET, $( 'button-quality' ), this.clickQuality, this, 1, 0, 2 );
    this.buttonQuality.anchor.set( 1, 0 );
    this.buttonQuality.visible = false;
    this.optionsUI.push( this.buttonQuality );

    this.game.world.bringToTop( this.buttonOptions );
  }

  clickOptions() {
    playAudio( 'click' );
    this.contractLang();
    if ( this.optionsExpanded ) {
      this.contractOptions();
    } else {
      this.expandOptions();
    }
  }

  expandOptions() {
    this.optionsExpanded = true;
    let prevX = 0;

    this.optionsUI.forEach( ( button, i ) => {
      button.visible = true;
      this.add.tween( button.position ).to( { x: this.world.width - button.width - prevX - ( $( MENU_BUTTON_OFFSET ) * ( i + 1 ) ) - MENU_BUTTON_OFFSET * 2 - this.buttonOptions.width }, 500, Phaser.Easing.Exponential.Out, true );
      prevX += button.width;
    } );
  }

  contractOptions() {
    this.optionsExpanded = false;

    this.optionsUI.forEach( ( button ) => {
      const tween = this.add.tween( button.position ).to( { x: this.buttonOptions.x }, 500, Phaser.Easing.Exponential.Out, true );

      tween.onComplete.add( () => {
        if ( !this.optionsExpanded ) {
          button.visible = false;
        }
      } );
    } );
  }

  initLang() {
    this.langUI = [];
    const currentLang = i18n.get();
    // const langs = [ 'en_gb', 'pl_pl', 'de_de' ];
    const langs = [ 'en_gb', 'pl_pl' ];

    this.langsExpanded = false;
    this.buttonLangs = this.add.button( this.world.width - MENU_BUTTON_OFFSET, MENU_BUTTON_OFFSET, $( `button-lang-${currentLang}` ), this.clickLangOpen, this, 1, 0, 2 );
    this.buttonLangs.anchor.set( 1, 0 );

    langs.forEach( ( lang ) => {
      if ( lang !== currentLang ) {
        const button = this.add.button( this.world.width - MENU_BUTTON_OFFSET, MENU_BUTTON_OFFSET, $( `button-lang-${lang}` ), () => this.clickLang( lang ), this, 1, 0, 2 );
        button.anchor.set( 1, 0 );
        button.visible = false;
        this.langUI.push( button );
      }
    } );

    this.game.world.bringToTop( this.buttonLangs );
  }

  clickLangOpen() {
    playAudio( 'click' );
    this.contractOptions();
    if ( this.langsExpanded ) {
      this.contractLang();
    } else {
      this.expandLang();
    }
  }

  expandLang() {
    this.langsExpanded = true;
    let prevY = 0;

    this.langUI.forEach( ( button, i ) => {
      button.visible = true;
      this.add.tween( button.position ).to( { y: button.height + prevY + ( $( MENU_BUTTON_OFFSET ) * ( i + 1 ) ) + MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );
      prevY += button.width;
    } );
  }

  contractLang() {
    this.langsExpanded = false;

    this.langUI.forEach( ( button ) => {
      const tween = this.add.tween( button.position ).to( { y: this.buttonLangs.y }, 500, Phaser.Easing.Exponential.Out, true );

      tween.onComplete.add( () => {
        if ( !this.langsExpanded ) {
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

  clickQuality() {
    playAudio( 'click' );
    if ( scaleFactor === 1 ) {
      $set.call( this, 0.5 );
      PPTStorage.set( 'PPT-quality', 0.5 );
    } else {
      $set.call( this, 1 );
      PPTStorage.set( 'PPT-quality', 1 );
    }
  }

  clickLang( lang = 'en_en' ) {
    playAudio( 'click' );
    i18n.set( lang );
    PPTStorage.set( 'PPT-lang', lang );
    this.game.state.start( this.state.current );
  }

  clickStart() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.time.events.add( 200, () => {
      this.game.state.start( 'Game' );
    } );
  }

  clickHelp() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    PPTStorage.set( 'PPT-tutorial', false );
    this.time.events.add( 200, () => {
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

  update() {
    Clock.updateClock( this );
  }
}
