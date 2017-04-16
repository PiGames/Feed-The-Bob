import { playAudio, manageAudio, getAudioOffset } from '../utils/AudioManager';
import { getStorage } from '../utils/StorageManager';

import FoodSpawner from '../objects/FoodSpawner';
import Bob from '../objects/Bob';

import NutritionManager from '../objects/NutritionManager';

export default class Game extends Phaser.State {
  create() {
    this.score = 0;
    this.gamePaused = false;
    this.runOnce = false;

    this.scoreTemplate = time => `Time: ${time}s`;

    this.NutritionManager = new NutritionManager( this.game );
    this.bob = new Bob( this.game, this.world.width / 2, this.world.height - 32, 'bob', this.NutritionManager, this.stateGameover.bind( this ) );

    this.foodSpawner = new FoodSpawner( this.game, this.NutritionManager, true );
    this.foodContainer = this.foodSpawner.children;
    this.initUI();

    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    this.game.physics.startSystem( Phaser.Physics.ARCADE );

    this.game.onResume.add( () => {
      if ( this.stateStatus !== 'playing' ) {
        this.game.time.events.pause();
      }
    } );
  }

  initUI() {
    this.buttonPause = this.add.button( this.world.width - 20, 20, 'button-pause', this.managePause, this, 1, 0, 2 );
    this.buttonPause.anchor.set( 1, 0 );

    const fontScore = { font: '64px Gloria Hallelujah', fill: '#fff' };
    const fontScoreWhite = { font: '64px Arial', fill: '#FFF', align: 'center' };
    this.textScore = this.add.text( 30, this.world.height - 20, this.scoreTemplate( this.score ), fontScore );
    this.textScore.anchor.set( 0, 1 );
    this.textScore.setShadow( 0, 0, 'rgba(0 ,0, 0, 0.5)', 10 );

    this.game.time.events.loop( Phaser.Timer.SECOND * 1, this.handlePoints, this );

    this.buttonPause.y = -this.buttonPause.height - 20;
    this.add.tween( this.buttonPause ).to( { y: 20 }, 1000, Phaser.Easing.Exponential.Out, true );

    const fontTitle = { font: '48px Arial', fill: '#000', stroke: '#FFF', strokeThickness: 10 };

    this.screenPausedGroup = this.add.group();
    this.screenPausedBg = this.add.sprite( 0, 0, 'overlay' );
    this.screenPausedBg.scale.setTo( 2 );
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
    this.screenPausedGroup.alpha = 0;
    this.screenPausedGroup.visible = false;

    this.buttonAudio.setFrames( getAudioOffset() + 1, getAudioOffset() + 0, getAudioOffset() + 2 );

    this.screenGameoverGroup = this.add.group();
    this.screenGameoverBg = this.add.sprite( 0, 0, 'overlay' );
    this.screenGameoverBg.scale.setTo( 2 );
    this.screenGameoverText = this.add.text( this.world.width * 0.5, 100, 'Game over', fontTitle );
    this.screenGameoverText.anchor.set( 0.5, 0 );
    this.screenGameoverBack = this.add.button( 150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2 );
    this.screenGameoverBack.anchor.set( 0, 1 );
    this.screenGameoverRestart = this.add.button( this.world.width - 150, this.world.height - 100, 'button-restart', this.stateRestart, this, 1, 0, 2 );
    this.screenGameoverRestart.anchor.set( 1, 1 );
    this.screenGameoverScore = this.add.text( this.world.width * 0.5, 300, 'Score: ' + this.score, fontScoreWhite );
    this.screenGameoverScore.anchor.set( 0.5, 0.5 );
    this.screenGameoverGroup.add( this.screenGameoverBg );
    this.screenGameoverGroup.add( this.screenGameoverText );
    this.screenGameoverGroup.add( this.screenGameoverBack );
    this.screenGameoverGroup.add( this.screenGameoverRestart );
    this.screenGameoverGroup.add( this.screenGameoverScore );
    this.screenGameoverGroup.alpha = 0;
    this.screenGameoverGroup.visible = false;
  }
  update() {
    this.bob.hadleWeightChange();

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
  managePause() {
    this.gamePaused = !this.gamePaused;
    playAudio( 'click' );
    if ( this.gamePaused ) {
      this.game.world.bringToTop( this.screenPausedGroup );
      this.stateStatus = 'paused';
      this.runOnce = false;
      this.stopMovingFood();
    } else {
      this.stateStatus = 'playing';
      this.runOnce = false;
      this.restoreFoodMovement();
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
  stateGameover( msg ) {
    this.stopMovingFood();
    this.game.world.bringToTop( this.screenGameoverGroup );
    this.screenGameoverScore.setText( 'Score: ' + this.score );
    this.gameoverScoreTween( msg );

    this.screenGameoverGroup.visible = true;
    const tween = this.game.add.tween( this.screenGameoverGroup );
    tween.to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true );

    getStorage().setHighscore( 'EPT-highscore', this.score );
  }

  handlePoints() {
    this.score++;
    this.foodSpawner.tryDifficultyLevelUp( this.score );
    this.textScore.setText( this.scoreTemplate( this.score ) );
  }

  gameoverScoreTween( deathmsg = '' ) {
    this.screenGameoverScore.setText( '' );
    if ( this.score ) {
      this.tweenedPoints = this.score;
      const pointsTween = this.add.tween( this );
      pointsTween.to( { tweenedPoints: this.score }, 1000, Phaser.Easing.Linear.None, true, 500 );
      pointsTween.onUpdateCallback( () => {
        this.screenGameoverScore.setText( 'Time survied on diet: ' + Math.floor( this.tweenedPoints ) + '\n' + deathmsg );
      }, this );
      pointsTween.onComplete.addOnce( () => {
        this.screenGameoverScore.setText( 'Time survied on diet: ' + this.score );
      }, this );
      pointsTween.start();
    }
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
    this.restoreFoodMovement();
    this.state.restart( true );
  }
  stateBack() {
    playAudio( 'click' );
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.stateStatus = 'playing';
    this.game.time.events.resume();
    this.state.start( 'MainMenu' );
  }
  stopMovingFood() {
    this.foodContainer.forEach( food => {
      food.body.velocity.x = 0;
      food.body.velocity.y = 0;
    } );
    this.game.time.events.pause();
  }
  restoreFoodMovement() {
    this.foodContainer.forEach( food => {
      food.body.velocity.x = food.velocityX;
      food.body.velocity.y = food.velocityY;
    } );
    this.game.time.events.resume();
  }
}
