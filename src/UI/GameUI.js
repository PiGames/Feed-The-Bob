import { $ } from '../utils/scaleManager';
import { SCORE_FONT, SCORE_TEMPLATE, GAMEOVER_TITLE_FONT, GAMEOVER_SCORE_FONT, PAUSE_TITLE_FONT, MENU_BUTTON_OFFSET } from '../constants/UIConstants';
import { playAudio, manageAudio, getAudioOffset } from '../utils/AudioManager';
import Text from './Text';

import { PPTStorage } from '../utils/StorageManager';

export default class GameUI {
  constructor( state, Bob ) {
    this.state = state;
    this.game = state.game;

    this.Bob = Bob;

    this.stateStatus = 'playing';

    this.score = 0;
    this.timePassed = 0;
    this.runOnce = false;
    this.gamePaused = false;

    this.scoreValue = 3;

    this.timeAdvance = new Phaser.Signal();

    this.game.add.sprite( 0, 0, $( 'background' ) );
    this.initScore();
    this.initHealthBar();
    this.initPauseScreen();
    this.initGameoverScreen();
  }

  initScore() {
    this.textScore = new Text( this.game, $( 30 ), this.game.world.height - $( 20 ), SCORE_TEMPLATE( this.score ), $( SCORE_FONT ), [ 0, 1 ] );

    this.game.time.events.loop( Phaser.Timer.SECOND * 1, this.handlePointsAddition, this );
  }

  initHealthBar() {
    const text = new Text( this.game, $( 30 ), this.game.world.height - $( 100 ), 'Health: ', $( SCORE_FONT ), [ 0, 1 ] );

    this.healthBar = this.game.add.tileSprite( text.x + text.width, this.game.world.height - $( 120 ), $( 180 ), $( 50 ), $( 'heart' ) );
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

    this.screenPausedText = new Text( this.game, 'center', 'center', 'Paused', $( PAUSE_TITLE_FONT ) );

    this.buttonAudio = this.game.add.button( this.game.world.width - MENU_BUTTON_OFFSET, MENU_BUTTON_OFFSET, $( 'button-audio' ), this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );
    this.buttonAudio.setFrames( getAudioOffset() + 1, getAudioOffset() + 0, getAudioOffset() + 2 );
    this.buttonAudio.input.priorityID = 1;

    this.screenPausedBack = this.game.add.button( MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'button-mainmenu' ), this.stateBack, this, 1, 0, 2 );
    this.screenPausedBack.anchor.set( 0, 1 );
    this.screenPausedBack.input.priorityID = 1;

    this.screenPausedContinue = this.game.add.button( this.game.world.width - MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'button-continue' ), this.managePause, this, 1, 0, 2 );
    this.screenPausedContinue.anchor.set( 1, 1 );
    this.screenPausedContinue.input.priorityID = 1;

    this.screenPausedGroup.add( this.screenPausedBg );
    this.screenPausedGroup.add( this.screenPausedText );
    this.screenPausedGroup.add( this.buttonAudio );
    this.screenPausedGroup.add( this.screenPausedBack );
    this.screenPausedGroup.add( this.screenPausedContinue );
    this.screenPausedGroup.alpha = 0;
    this.screenPausedGroup.visible = false;
  }

  initGameoverScreen() {
    this.screenGameoverGroup = this.game.add.group();

    this.screenGameoverBg = this.game.add.sprite( 0, 0, $( 'overlay' ) );
    this.screenGameoverBg.scale.setTo( 2 );
    this.screenGameoverBg.inputEnabled = true;
    this.screenGameoverBg.input.priorityID = 2;

    this.screenGameoverText = new Text( this.game, 'center', $( 100 ), 'Game over', $( GAMEOVER_TITLE_FONT ) );

    this.screenGameoverBack = this.game.add.button( $( 150 ), this.game.world.height - $( 100 ), $( 'button-mainmenu' ), this.stateBack, this, 1, 0, 2 );
    this.screenGameoverBack.anchor.set( 0, 1 );
    this.screenGameoverBack.input.priorityID = 2;

    this.screenGameoverRestart = this.game.add.button( this.game.world.width - $( 150 ), this.game.world.height - $( 100 ), $( 'button-restart' ), this.stateRestart, this, 1, 0, 2 );
    this.screenGameoverRestart.anchor.set( 1, 1 );
    this.screenGameoverRestart.input.priorityID = 2;

    this.screenGameoverScore = new Text( this.game, 'center', 'center', 'Score: ' + this.score, $( GAMEOVER_SCORE_FONT ) );

    this.screenGameoverGroup.add( this.screenGameoverBg );
    this.screenGameoverGroup.add( this.screenGameoverText );
    this.screenGameoverGroup.add( this.screenGameoverBack );
    this.screenGameoverGroup.add( this.screenGameoverRestart );
    this.screenGameoverGroup.add( this.screenGameoverScore );
    this.screenGameoverGroup.alpha = 0;
    this.screenGameoverGroup.visible = false;
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
    this.healthBar.width = $( 180 ) * ( health / 100 );
  }

  handlePointsAddition() {
    this.timePassed++;
    this.score += this.scoreValue;
    this.textScore.setText( SCORE_TEMPLATE( this.score ) );
    this.state.foodSpawner.tryDifficultyLevelUp( this.timePassed );
    this.timeAdvance.dispatch();
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
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.stateStatus = 'playing';
    this.game.time.events.resume();
    this.state.state.start( 'MainMenu' );
  }

  stateGameover( msg ) {
    this.state.stopMovingFood.call( this.state );
    this.game.world.bringToTop( this.screenGameoverGroup );
    this.screenGameoverScore.setText( 'Score: ' + this.score );
    this.gameoverScoreTween( msg );

    this.screenGameoverGroup.visible = true;
    const tween = this.game.add.tween( this.screenGameoverGroup );
    tween.to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true );

    PPTStorage.setHighscore( 'PPT-highscore', this.score );
  }

  stateRestart() {
    playAudio( 'click' );
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.stateStatus = 'playing';
    this.state.restoreFoodMovement.call( this.state );
    this.state.state.restart( true );
  }

  gameoverScoreTween( deathmsg = '' ) {
    this.screenGameoverScore.setText( '' );
    if ( this.score ) {
      const secondNumberSuffix = time => ( time === 1 ) ? '' : 's';

      this.screenGameoverScore.setText( `You have survived for ${Math.floor( this.score )} second${secondNumberSuffix( this.score )}\nand died from ${deathmsg}` );
    }
  }

  clickAudio() {
    playAudio( 'click' );
    manageAudio( 'switch', this );
  }
}
