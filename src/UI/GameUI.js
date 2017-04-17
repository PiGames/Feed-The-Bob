import { NUTRITION_BAR_INFO_FONT, SCORE_FONT, SCORE_TEMPLATE, GAMEOVER_TITLE_FONT, GAMEOVER_SCORE_FONT } from '../constants/UIConstants';
import { playAudio, manageAudio, getAudioOffset } from '../utils/AudioManager';

import { PPTStorage } from '../utils/StorageManager';

export default class GameUI {
  constructor( state ) {
    this.state = state;
    this.game = state.game;

    this.score = 0;
    this.runOnce = false;
    this.gamePaused = false;

    this.initScore();
    this.initPauseScreen();
    this.initGameoverScreen();
  }

  initScore() {
    this.textScore = this.game.add.text( 30, this.game.world.height - 20, SCORE_TEMPLATE( this.score ), SCORE_FONT );
    this.textScore.anchor.set( 0, 1 );
    this.textScore.setShadow( 0, 0, 'rgba(0 ,0, 0, 0.5)', 10 );

    this.game.time.events.loop( Phaser.Timer.SECOND * 1, this.handlePointsAddition, this );
  }

  initPauseScreen() {
    this.buttonPause = this.game.add.button( this.game.world.width - 20, 20, 'button-pause', this.managePause, this, 1, 0, 2 );
    this.buttonPause.anchor.set( 1, 0 );

    this.buttonPause.y = -this.buttonPause.height - 20;
    this.game.add.tween( this.buttonPause ).to( { y: 20 }, 1000, Phaser.Easing.Exponential.Out, true );

    this.screenPausedGroup = this.game.add.group();
    this.screenPausedBg = this.game.add.sprite( 0, 0, 'overlay' );
    this.screenPausedBg.scale.setTo( 2 );

    this.screenPausedText = this.game.add.text( this.game.world.width * 0.5, 100, 'Paused', NUTRITION_BAR_INFO_FONT );
    this.screenPausedText.anchor.set( 0.5, 0 );

    this.buttonAudio = this.game.add.button( this.game.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );
    this.buttonAudio.setFrames( getAudioOffset() + 1, getAudioOffset() + 0, getAudioOffset() + 2 );

    this.screenPausedBack = this.game.add.button( 150, this.game.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2 );
    this.screenPausedBack.anchor.set( 0, 1 );

    this.screenPausedContinue = this.game.add.button( this.game.world.width - 150, this.game.world.height - 100, 'button-continue', this.managePause, this, 1, 0, 2 );
    this.screenPausedContinue.anchor.set( 1, 1 );

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
    this.screenGameoverBg = this.game.add.sprite( 0, 0, 'overlay' );
    this.screenGameoverBg.scale.setTo( 2 );
    this.screenGameoverText = this.game.add.text( this.game.world.centerX, 100, 'Game over', GAMEOVER_TITLE_FONT );
    this.screenGameoverText.anchor.set( 0.5, 0 );
    this.screenGameoverBack = this.game.add.button( 150, this.game.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2 );
    this.screenGameoverBack.anchor.set( 0, 1 );
    this.screenGameoverRestart = this.game.add.button( this.game.world.width - 150, this.game.world.height - 100, 'button-restart', this.stateRestart, this, 1, 0, 2 );
    this.screenGameoverRestart.anchor.set( 1, 1 );
    this.screenGameoverScore = this.game.add.text( this.game.world.centerX, this.game.world.centerY, 'Score: ' + this.score, GAMEOVER_SCORE_FONT );
    this.screenGameoverScore.anchor.set( 0.5, 0.5 );
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

  handlePointsAddition() {
    this.score++;
    this.textScore.setText( SCORE_TEMPLATE( this.score ) );
    this.state.foodSpawner.tryDifficultyLevelUp.call( this.state, this.score );
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

    PPTStorage.setHighscore( 'EPT-highscore', this.score );
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