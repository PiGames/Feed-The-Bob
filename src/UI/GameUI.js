import { $ } from '../utils/ScaleManager';
import i18n from '../utils/i18n';
import { SCORE_FONT, GAMEOVER_TITLE_FONT, GAMEOVER_SCORE_FONT, PAUSE_TITLE_FONT, MENU_BUTTON_OFFSET, LEVEL_CHANGE_FONT, HEALTHBAR_WIDTH } from '../constants/UIConstants';
import { WIN_SCORE } from '../constants/DemoConstants';
import { playAudio, manageAudio, getAudioOffset } from '../utils/AudioManager';
import Text from './Text';

import { PPTStorage } from '../utils/StorageManager';

export default class GameUI {
  constructor( state, Bob, NutritionManager ) {
    this.state = state;
    this.game = state.game;

    this.Bob = Bob;
    this.NutritionManager = NutritionManager;
    this.NutritionUI = NutritionManager.UI;

    this.stateStatus = 'playing';

    this.score = 0;
    this.timePassed = 0;
    this.runOnce = false;
    this.gamePaused = false;

    this.scoreValue = 3;

    this.timeAdvance = new Phaser.Signal();

    this.initScore();
    this.initHealthBar();
    this.initPauseScreen();
    this.initWinScreen();
    this.initGameoverScreen();

    // if ( PPTStorage.get( 'PPT-tutorial' ) !== true ) {
    //   this.startTutorial();
    // }

    this.onScoreUpdate = new Phaser.Signal();
  }

  initScore() {
    this.textScore = new Text( this.game, $( 30 ), this.game.world.height - $( 20 ), `${i18n.text( 'game_score' )}: ${this.score}`, $( SCORE_FONT ), [ 0, 1 ] );

    this.game.time.events.loop( Phaser.Timer.SECOND * 1, this.handlePointsAddition, this );
  }

  initHealthBar() {
    this.healthBarText = new Text( this.game, $( 30 ), this.game.world.height - $( 100 ), `${i18n.text( 'game_health' )}: `, $( SCORE_FONT ), [ 0, 1 ] );

    this.healthBar = this.game.add.tileSprite( this.healthBarText.x + this.healthBarText.width, this.game.world.height - $( 120 ), $( HEALTHBAR_WIDTH ), $( 50 ), $( 'heart' ) );
    this.healthBar.anchor.setTo( 0, 1 );
    this.healthBar.scale.setTo( 1.25 );
  }

  initPauseScreen() {
    this.buttonPause = this.game.add.button( this.game.world.width - MENU_BUTTON_OFFSET, MENU_BUTTON_OFFSET, $( 'button-pause' ), this.managePause, this, 1, 0, 2 );
    this.buttonPause.anchor.set( 1, 0 );
    this.buttonPause.input.priorityID = 0;

    this.buttonPause.y = -this.buttonPause.height - MENU_BUTTON_OFFSET;
    this.game.add.tween( this.buttonPause ).to( { y: MENU_BUTTON_OFFSET }, 1000, Phaser.Easing.Exponential.Out, true );

    this.screenPausedGroup = this.game.add.group();
    this.screenPausedBg = this.game.add.sprite( 0, 0, $( 'overlay' ) );
    this.screenPausedBg.scale.setTo( 2 );
    this.screenPausedBg.inputEnabled = true;
    this.screenPausedBg.input.priorityID = 1;

    const buttonPigames = this.game.add.sprite( MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'logo-pigames' ), this );
    buttonPigames.anchor.set( 0, 1 );

    this.screenPausedText = new Text( this.game, 'center', 'center', i18n.text( 'game_paused' ), $( PAUSE_TITLE_FONT ) );

    this.buttonAudio = this.game.add.button( this.game.world.width - MENU_BUTTON_OFFSET, MENU_BUTTON_OFFSET, $( 'button-audio' ), this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );
    this.buttonAudio.setFrames( getAudioOffset() + 1, getAudioOffset() + 0, getAudioOffset() + 2 );
    this.buttonAudio.input.priorityID = 1;

    this.screenPausedContinue = this.game.add.button( this.game.world.width - MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'button-continue' ), this.managePause, this, 1, 0, 2 );
    this.screenPausedContinue.anchor.set( 1, 1 );
    this.screenPausedContinue.scale.set( 0.5 );
    this.screenPausedContinue.input.priorityID = 1;

    this.screenPausedGroup.add( this.screenPausedBg );
    this.screenPausedGroup.add( this.screenPausedText );
    this.screenPausedGroup.add( this.buttonAudio );
    this.screenPausedGroup.add( this.screenPausedContinue );
    this.screenPausedGroup.add( buttonPigames );
    this.screenPausedGroup.alpha = 0;
    this.screenPausedGroup.visible = false;
  }

  initGameoverScreen() {
    this.screenGameoverGroup = this.game.add.group();

    this.screenGameoverBg = this.game.add.sprite( 0, 0, $( 'overlay' ) );
    this.screenGameoverBg.scale.setTo( 2 );
    this.screenGameoverBg.inputEnabled = true;
    this.screenGameoverBg.input.priorityID = 2;

    const buttonPigames = this.game.add.sprite( MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'logo-pigames' ), this );
    buttonPigames.anchor.set( 0, 1 );

    this.screenGameoverText = new Text( this.game, 'center', $( 100 ), i18n.text( 'game_over' ), $( GAMEOVER_TITLE_FONT ) );

    this.screenGameoverBack = this.game.add.button( this.game.world.width / 2, this.game.world.height - $( 100 ), $( 'button-mainmenu' ), this.stateBack, this, 1, 0, 2 );
    this.screenGameoverBack.anchor.set( 0.5, 1 );
    this.screenGameoverBack.input.priorityID = 2;

    this.screenGameoverScore = new Text( this.game, 'center', 'center', `${i18n.text( 'game_score' )}: ` + this.score, $( GAMEOVER_SCORE_FONT ) );

    this.screenGameoverGroup.add( this.screenGameoverBg );
    this.screenGameoverGroup.add( this.screenGameoverText );
    this.screenGameoverGroup.add( this.screenGameoverBack );
    this.screenGameoverGroup.add( this.screenGameoverScore );
    this.screenGameoverGroup.add( buttonPigames );
    this.screenGameoverGroup.alpha = 0;
    this.screenGameoverGroup.visible = false;
  }

  initWinScreen() {
    this.screenWinGroup = this.game.add.group();

    this.screenWinBg = this.game.add.sprite( 0, 0, $( 'overlay' ) );
    this.screenWinBg.scale.setTo( 2 );
    this.screenWinBg.inputEnabled = true;
    this.screenWinBg.input.priorityID = 2;

    const buttonPigames = this.game.add.sprite( MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'logo-pigames' ), this );
    buttonPigames.anchor.set( 0, 1 );

    this.screenWinText = new Text( this.game, 'center', $( 100 ), 'You have won!', $( GAMEOVER_TITLE_FONT ) );

    this.screenWinBack = this.game.add.button( this.game.world.width / 2, this.game.world.height - $( 100 ), $( 'button-mainmenu' ), this.stateWinBack, this, 1, 0, 2 );
    this.screenWinBack.anchor.set( 0.5, 1 );
    this.screenWinBack.input.priorityID = 2;

    this.screenWinScore = new Text( this.game, 'center', 'center', `${i18n.text( 'game_score' )}: ` + this.score, $( GAMEOVER_SCORE_FONT ) );

    this.screenWinGroup.add( this.screenWinBg );
    this.screenWinGroup.add( this.screenWinText );
    this.screenWinGroup.add( this.screenWinBack );
    this.screenWinGroup.add( this.screenWinScore );
    this.screenWinGroup.add( buttonPigames );
    this.screenWinGroup.alpha = 0;
    this.screenWinGroup.visible = false;
  }

  updateUI() {
    switch ( this.stateStatus ) {
    case 'paused': {
      if ( !this.runOnce ) {
        this.statePaused();
        this.runOnce = true;
      }
      break;
    }
    case 'gameover': {
      if ( !this.runOnce ) {
        this.stateGameover();
        this.runOnce = true;
      }
      break;
    }
    case 'win': {
      if ( !this.runOnce ) {
        this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt = false;
        this.stateWin();
        this.runOnce = true;
      }
      break;
    }
    case 'playing': {
      if ( !this.runOnce ) {
        this.statePlaying();
        this.runOnce = true;
      }
    }
    }
  }

  onScoreValueChange( scoreValue ) {
    this.scoreValue = scoreValue;
  }

  updateHealthBarValue( health ) {
    if ( health > 0 ) {
      this.NutritionUI.flash( () => {
        this.healthBar.width = $( HEALTHBAR_WIDTH ) * ( health / 100 );
      } );
    }
  }

  difficultyChange() {
    const text = new Text( this.game, 'center', $( 100 ), i18n.text( 'game_level_up' ), $( LEVEL_CHANGE_FONT ) );
    text.alpha = 0;
    let done = false;
    const textTween = this.game.add.tween( text );
    textTween.to( { alpha: 1 }, 200, Phaser.Easing.Linear.InOut, true );
    textTween.onComplete.add( () => {
      if ( !done ) {
        this.game.time.events.add( Phaser.Timer.SECOND * 4, () => {
          textTween.to( { alpha: 0 }, 200, Phaser.Easing.Linear.InOut, true );
        } );
      }
      done = true;
    }, this );
  }

  handlePointsAddition() {
    this.timePassed++;
    this.score += this.scoreValue;
    this.textScore.setText( `${i18n.text( 'game_score' )}: ${this.score}` );
    this.state.foodSpawner.tryDifficultyLevelUp( this.timePassed );
    this.timeAdvance.dispatch();
    this.onScoreUpdate.dispatch( this.score );

    if ( this.score >= WIN_SCORE ) {
      this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt = false;
      this.stateWin();
    }
  }

  managePause() {
    this.gamePaused = !this.gamePaused;
    playAudio( 'click' );
    if ( this.gamePaused ) {
      this.game.world.bringToTop( this.screenPausedGroup );
      this.stateStatus = 'paused';
      this.runOnce = false;
      this.state.stopMovingFood.call( this.state );
    } else {
      this.stateStatus = 'playing';
      this.runOnce = false;
      this.state.restoreFoodMovement.call( this.state );
    }
  }

  drawOverlay() {
    this.graphics = this.game.add.graphics( 0, 0 );
    this.graphics.beginFill( 0x000000, 0.5 );
    this.graphics.lineTo( this.game.world.width, 0 );
    this.graphics.lineTo( this.game.world.width, this.game.world.height );
    this.graphics.lineTo( 0, this.game.world.height );
    this.graphics.endFill();
    this.graphics.inputEnabled = true;
    this.graphics.input.priorityID = 10;
  }

  statePlaying() {
    const tween = this.game.add.tween( this.screenPausedGroup );
    tween.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true );
    tween.onComplete.add( () => {
      if ( this.screenPausedGroup.visible ) {
        this.screenPausedGroup.visible = false;
      }
    }, this );
  }

  statePaused() {
    this.screenPausedGroup.visible = true;
    const tween = this.game.add.tween( this.screenPausedGroup );
    tween.to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true );
  }

  stateBack() {
    playAudio( 'click' );
    texta_close();
  }

  stateWinBack() {
    playAudio( 'click' );
    texta_win();
  }

  stateGameover( msg ) {
    this.state.stopMovingFood.call( this.state );
    this.game.world.bringToTop( this.screenGameoverGroup );
    this.screenGameoverScore.setText( `${i18n.text( 'game_score' )}: ${this.score}` );
    this.gameoverScoreTween( msg );

    this.screenGameoverGroup.visible = true;
    const tween = this.game.add.tween( this.screenGameoverGroup );
    tween.to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true );

    PPTStorage.setHighscore( 'PPT-highscore', this.score );
  }

  stateWin() {
    this.state.stopMovingFood.call( this.state );
    this.game.world.bringToTop( this.screenWinGroup );
    this.screenWinScore.setText( `${i18n.text( 'game_score' )}: ${this.score}` );

    this.screenWinGroup.visible = true;
    const tween = this.game.add.tween( this.screenWinGroup );
    tween.to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true );

    PPTStorage.setHighscore( 'PPT-highscore', this.score );
  }

  stateRestart() {
    playAudio( 'click' );
    texta_close();
  }

  gameoverScoreTween( deathmsg = '' ) {
    this.screenGameoverScore.setText( '' );

    this.screenGameoverScore.setText( i18n.text( 'game_over_text', this.score, deathmsg ) );
  }

  clickAudio() {
    playAudio( 'click' );
    manageAudio( 'switch', this );
  }
}
