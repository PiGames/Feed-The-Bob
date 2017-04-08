import { playAudio, manageAudio, getAudioOffset } from '../utils/AudioManager';
import { getStorage } from '../utils/StorageManager';

import Food from '../objects/Food';
import Fatty from '../objects/Fatty';

import NutritionManager from '../objects/NutritionManager';

export default class Game extends Phaser.State {
  create() {
    this._score = 0;
    this._time = 10;
    this.gamePaused = false;
    this.runOnce = false;

    this.fatty = new Fatty( this.game, this.world.width / 2, this.world.height, 'fatty' );

    this.initUI();

    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    this.NutritionManager = new NutritionManager( this.game );

    //display food
    new Food( this.game, 'fruit', true );
  }
  initUI() {
    this.buttonPause = this.add.button( this.world.width - 20, 20, 'button-pause', this.managePause, this, 1, 0, 2 );
    this.buttonPause.anchor.set( 1, 0 );

    const fontScore = { font: '32px Arial', fill: '#000' };
    const fontScoreWhite = { font: '32px Arial', fill: '#FFF' };
    this.textScore = this.add.text( 30, this.world.height - 20, 'Score: ' + this._score, fontScore );
    this.textScore.anchor.set( 0, 1 );

    this.buttonPause.y = -this.buttonPause.height - 20;
    this.add.tween( this.buttonPause ).to( { y: 20 }, 1000, Phaser.Easing.Exponential.Out, true );

    const fontTitle = { font: '48px Arial', fill: '#000', stroke: '#FFF', strokeThickness: 10 };

    this.screenPausedGroup = this.add.group();
    this.screenPausedBg = this.add.sprite( 0, 0, 'overlay' );
    this.screenPausedText = this.add.text( this.world.width * 0.5, 100, 'Paused', fontTitle );
    this.screenPausedText.anchor.set( 0.5, 0 );
    this.buttonAudio = this.add.button( this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );
    this.screenPausedBack = this.add.button( 150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2 );
    this.screenPausedBack.anchor.set( 0, 1 );
    this.screenPausedContinue = this.add.button( this.world.width - 150, this.world.height - 100, 'button-continue', this.managePause, this, 1, 0, 2 );
    this.screenPausedContinue.anchor.set( 1, 1 );
    this.screenPausedGroup.add( this.screenPausedBg );
    this.screenPausedGroup.add( this.screenPausedText );
    this.screenPausedGroup.add( this.buttonAudio );
    this.screenPausedGroup.add( this.screenPausedBack );
    this.screenPausedGroup.add( this.screenPausedContinue );
    this.screenPausedGroup.visible = false;

    this.buttonAudio.setFrames( getAudioOffset() + 1, getAudioOffset() + 0, getAudioOffset() + 2 );

    this.screenGameoverGroup = this.add.group();
    this.screenGameoverBg = this.add.sprite( 0, 0, 'overlay' );
    this.screenGameoverText = this.add.text( this.world.width * 0.5, 100, 'Game over', fontTitle );
    this.screenGameoverText.anchor.set( 0.5, 0 );
    this.screenGameoverBack = this.add.button( 150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2 );
    this.screenGameoverBack.anchor.set( 0, 1 );
    this.screenGameoverRestart = this.add.button( this.world.width - 150, this.world.height - 100, 'button-restart', this.stateRestart, this, 1, 0, 2 );
    this.screenGameoverRestart.anchor.set( 1, 1 );
    this.screenGameoverScore = this.add.text( this.world.width * 0.5, 300, 'Score: ' + this._score, fontScoreWhite );
    this.screenGameoverScore.anchor.set( 0.5, 0.5 );
    this.screenGameoverGroup.add( this.screenGameoverBg );
    this.screenGameoverGroup.add( this.screenGameoverText );
    this.screenGameoverGroup.add( this.screenGameoverBack );
    this.screenGameoverGroup.add( this.screenGameoverRestart );
    this.screenGameoverGroup.add( this.screenGameoverScore );
    this.screenGameoverGroup.visible = false;
  }
  update() {
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
      this.statePlaying();
    }
    }
  }
  managePause() {
    this.gamePaused = !this.gamePaused;
    playAudio( 'click' );
    if ( this.gamePaused ) {
      this.stateStatus = 'paused';
    }		else {
      this.stateStatus = 'playing';
      this.runOnce = false;
    }
  }
  statePlaying() {
    this.screenPausedGroup.visible = false;
  }
  statePaused() {
    this.screenPausedGroup.visible = true;
  }
  stateGameover() {
    this.screenGameoverGroup.visible = true;
		// this.screenGameoverScore.setText('Score: '+this._score);
    this.gameoverScoreTween();
    getStorage().setHighscore( 'EPT-highscore', this._score );
  }
  addPoints() {
    this._score += 10;
    this.textScore.setText( 'Score: ' + this._score );
    const randX = this.rnd.integerInRange( 200, this.world.width - 200 );
    const randY = this.rnd.integerInRange( 200, this.world.height - 200 );
    const pointsAdded = this.add.text( randX, randY, '+10',
		{ font: '48px Arial', fill: '#000', stroke: '#FFF', strokeThickness: 10 } );

    pointsAdded.anchor.set( 0.5, 0.5 );
    this.add.tween( pointsAdded ).to( { alpha: 0, y: randY - 50 }, 1000, Phaser.Easing.Linear.None, true );

    this.camera.shake( 0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true );
  }
  gameoverScoreTween() {
    this.screenGameoverScore.setText( 'Score: 0' );
    if ( this._score ) {
      this.tweenedPoints = 0;
      const pointsTween = this.add.tween( this );
      pointsTween.to( { tweenedPoints: this._score }, 1000, Phaser.Easing.Linear.None, true, 500 );
      pointsTween.onUpdateCallback( () => {
        this.screenGameoverScore.setText( 'Score: ' + Math.floor( this.tweenedPoints ) );
      }, this );
      pointsTween.onComplete.addOnce( () => {
        this.screenGameoverScore.setText( 'Score: ' + this._score );
        this.spawnEmitter( this.screenGameoverScore, 'particle', 20, 300 );
      }, this );
      pointsTween.start();
    }
  }
  spawnEmitter( item, particle, number, lifespan, frequency, offsetX, offsetY, gravity ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    lifespan = lifespan || 2000;
    frequency = frequency || 0;
    const emitter = this.game.add.emitter( item.x + offsetX, item.y + offsetY, number );
    emitter.maxParticles = number;
    emitter.makeParticles( particle );
    emitter.setXSpeed( -500, 500 );
    emitter.setYSpeed( -700, 300 );
    emitter.setScale( 4, 1, 4, 1, 500, Phaser.Easing.Linear.None );
    emitter.gravity = gravity || 250;
    emitter.start( false, lifespan, frequency, number );
  }
  clickAudio() {
    playAudio( 'click' );
    manageAudio( 'switch', this );
  }
  stateRestart() {
    playAudio( 'click' );
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.stateStatus = 'playing';
    this.state.restart( true );
  }
  stateBack() {
    playAudio( 'click' );
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.stateStatus = 'playing';
		// this.state.restart(true);
    this.state.start( 'MainMenu' );
  }
}
