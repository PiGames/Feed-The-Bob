import { $ } from '../utils/ScaleManager';
import i18n from '../utils/i18n';
import { getStatus } from '../utils/NutritionUtils';

import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';
import { SUPER_THIN_BREAKPOINT, THIN_BREAKPOINT, FAT_BREAKPOINT, SUPER_FAT_BREAKPOINT, THINNESS_LEVELS, FATNESS_LEVELS } from '../constants/WeightBreakpoints';
import { NUTRITION_BAR_WIDTH, NUTRITION_BAR_HEIGHT, NUTRITION_BAR_OFFSET, NUTRITION_BAR_X_FROM_LEFT, NUTRITION_BAR_Y_FROM_BOTTOM, NUTRITION_BAR_TEXT_OFFSET_X, NUTRITION_BAR_TEXT_OFFSET_Y, NUTRITION_BAR_INFO_FONT, NUTRITION_NUTRITION_ADDED_FONT, NUTRITION_BAR_BORDER_WIDTH } from '../constants/UIConstants';
import Text from './Text';

export default class NutritionUI {
  constructor( game, NutritionManager ) {
    this.game = game;

    this.nutrition = NutritionManager.nutrition;

    this.NutritionBars = [];
    this.NutritionMasks = [];
    this.NutritionTexts = [];

    this.NutritionBarsGroup = this.game.add.group();

    this.drawAllBars();
  }

  updateUI( updatedValues ) {
    this.updateBar( this.nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES, 2 );
    this.updateBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1 );
    this.updateBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0 );

    if ( updatedValues ) {
      for ( let key in updatedValues ) {
        const value = updatedValues[ key ];
        if ( value !== 0 ) {
          this.displayAddition( key, value );
        }
      }
    }
  }

  drawAllBars() {
    const capitalise = ( text ) => {
      return text.substring( 0, 1 ).toUpperCase() + text.substring( 1 );
    };

    this.drawBar( this.nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES, 2, capitalise( i18n.text( 'carbohydrates_name' ) ) );
    this.drawBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1, capitalise( i18n.text( 'fats_name' ) ) );
    this.drawBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0, capitalise( i18n.text( 'proteins_name' ) ) );
  }

  displayAddition( key, val ) {
    let i = 0;

    switch ( key ) {
    case 'carbohydrates':
      i = 2;
      break;
    case 'fats':
      i = 1;
      break;
    case 'proteins':
      i = 0;
      break;
    // no default
    }

    const height = $( NUTRITION_BAR_HEIGHT );
    const offset = i * ( $( NUTRITION_BAR_OFFSET ) + height );

    const textX = this.game.width - $( NUTRITION_BAR_X_FROM_LEFT ) - $( NUTRITION_BAR_TEXT_OFFSET_X ) - $( 10, 0.5 );
    const textY = this.game.height - $( NUTRITION_BAR_Y_FROM_BOTTOM ) - $( NUTRITION_BAR_TEXT_OFFSET_Y ) - offset;
    const nutritionAdded = new Text( this.game, textX, textY, `+${val}`, $( NUTRITION_NUTRITION_ADDED_FONT ), [ 1, 1 ] );
    this.game.add.tween( nutritionAdded ).to( { alpha: 0, y: textY - $( 100 ) }, $( 1000 ), Phaser.Easing.Linear.None, true );
  }

  updateBar( value, goodAmount, i ) {
    const width = $( NUTRITION_BAR_WIDTH );
    const height = $( NUTRITION_BAR_HEIGHT );
    const offset = i * ( $( NUTRITION_BAR_OFFSET ) + height );
    const doubleOfGoodAmount = goodAmount * 2;

    const status = this.NutritionBars[ i ];
    const bobStatus = getStatus( value, goodAmount );

    if ( bobStatus <= SUPER_THIN_BREAKPOINT || bobStatus >= SUPER_FAT_BREAKPOINT ) {
      status.frame = 2;
    } else if ( bobStatus <= THIN_BREAKPOINT || bobStatus >= FAT_BREAKPOINT ) {
      status.frame = 1;
    } else {
      status.frame = 0;
    }

    const NutritionBarValue = Math.min( Math.max( ( value / doubleOfGoodAmount ), 0 ), 1 );

    const mask = this.NutritionMasks[ i ];
    mask.clear();
    mask.beginFill( 0x000000 );
    mask.drawRect( this.game.width - NUTRITION_BAR_X_FROM_LEFT - width + ( width * ( 1 - NutritionBarValue ) ), this.game.height - $( NUTRITION_BAR_Y_FROM_BOTTOM ) - offset - height, width * NutritionBarValue, height );
    mask.endFill();

    const statusText = this.NutritionTexts[ i ];
    statusText.setText( `${parseInt( Math.max( value, 0 ) )} / ${goodAmount}` );
  }

  drawBar( value, goodAmount, i, text ) {
    const width = $( NUTRITION_BAR_WIDTH );
    const height = $( NUTRITION_BAR_HEIGHT );
    const offset = i * ( $( NUTRITION_BAR_OFFSET ) + height );
    const doubleOfGoodAmount = goodAmount * 2;

    const NutritionBarValue = Math.min( Math.max( ( value / doubleOfGoodAmount ), 0 ), 1 );

    const background = this.game.add.sprite( this.game.width - NUTRITION_BAR_X_FROM_LEFT, this.game.height - $( NUTRITION_BAR_Y_FROM_BOTTOM ) - offset, $( 'nutrition-bar-background' ) );
    background.anchor.setTo( 1, 1 );

    const indicators = this.game.add.group();

    const backgroundNeutralX = background.x - background.width + NUTRITION_BAR_BORDER_WIDTH;
    const backgroundNeutralY = background.y - background.height + NUTRITION_BAR_BORDER_WIDTH;

    const superThinIndicator = this.game.add.sprite( background.width / 2 / ( THINNESS_LEVELS.length ) * ( THINNESS_LEVELS.length - SUPER_THIN_BREAKPOINT ) + ( background.width / 2 ) + backgroundNeutralX, backgroundNeutralY, $( 'nutrition-bar-indicator' ) );
    superThinIndicator.anchor.setTo( 0.5, 0 );

    const thinIndicator = this.game.add.sprite( background.width / 2 / ( THINNESS_LEVELS.length ) * ( THINNESS_LEVELS.length - THIN_BREAKPOINT ) + ( background.width / 2 ) + backgroundNeutralX, backgroundNeutralY, $( 'nutrition-bar-indicator' ) );
    thinIndicator.anchor.setTo( 0.5, 0 );

    const superFatIndicator = this.game.add.sprite( background.width / 2 / ( FATNESS_LEVELS.length ) * ( ( THINNESS_LEVELS.length + FATNESS_LEVELS.length ) - SUPER_FAT_BREAKPOINT ) + backgroundNeutralX, backgroundNeutralY, $( 'nutrition-bar-indicator' ) );
    superFatIndicator.anchor.setTo( 0.5, 0 );

    const fatIndicator = this.game.add.sprite( background.width / 2 / ( FATNESS_LEVELS.length ) * ( ( THINNESS_LEVELS.length + FATNESS_LEVELS.length ) - FAT_BREAKPOINT ) + backgroundNeutralX, backgroundNeutralY, $( 'nutrition-bar-indicator' ) );
    fatIndicator.anchor.setTo( 0.5, 0 );

    indicators.add( superThinIndicator );
    indicators.add( thinIndicator );
    indicators.add( superFatIndicator );
    indicators.add( fatIndicator );

    const mask = this.game.add.graphics( 0, 0 );
    mask.beginFill( 0x000000 );
    mask.drawRect( this.game.width - NUTRITION_BAR_X_FROM_LEFT - width + ( width * ( 1 - NutritionBarValue ) ), this.game.height - $( NUTRITION_BAR_Y_FROM_BOTTOM ) - offset - height, width * NutritionBarValue, height );
    mask.endFill();

    this.NutritionMasks[ i ] = mask;

    const status = this.game.add.sprite( this.game.width - NUTRITION_BAR_X_FROM_LEFT, this.game.height - $( NUTRITION_BAR_Y_FROM_BOTTOM ) - offset, $( 'nutrition-bar' ), 0 );
    status.anchor.setTo( 1, 1 );
    status.mask = mask;

    this.NutritionBars[ i ] = status;

    const descText = new Text( this.game, this.game.width - $( NUTRITION_BAR_X_FROM_LEFT ) + $( NUTRITION_BAR_TEXT_OFFSET_X ) - width - $( 10, 0.5 ), this.game.height - $( NUTRITION_BAR_Y_FROM_BOTTOM ) - offset - $( NUTRITION_BAR_TEXT_OFFSET_Y ) + $( 3, 0.5 ), text, $( NUTRITION_BAR_INFO_FONT ), [ 0, 1 ] );

    const statusText = new Text( this.game, this.game.width - $( NUTRITION_BAR_X_FROM_LEFT ) - $( NUTRITION_BAR_TEXT_OFFSET_X ) - $( 10, 0.5 ), this.game.height - $( NUTRITION_BAR_Y_FROM_BOTTOM ) - offset - $( NUTRITION_BAR_TEXT_OFFSET_Y ) + $( 3, 0.5 ), `${Math.max( parseInt( value ), 0 )} / ${goodAmount}`, $( NUTRITION_BAR_INFO_FONT ), [ 1, 1 ] );

    this.NutritionTexts[ i ] = statusText;

    this.NutritionBarsGroup.add( background );
    this.NutritionBarsGroup.add( indicators );
    this.NutritionBarsGroup.add( mask );
    this.NutritionBarsGroup.add( status );
    this.NutritionBarsGroup.add( statusText );
    this.NutritionBarsGroup.add( descText );
  }

  flash( callback ) {
    const flashLength = 100;
    let status = 0;
    this.NutritionBars.forEach( ( sprite ) => {
      status = Math.max( sprite.frame, status );
    } );

    const flash = this.game.add.graphics( 0, 0 );
    if ( status === 2 ) {
      this.game.camera.shake( 0.002, 200 );
      flash.beginFill( 0xc50000, 0.8 );
    } else if ( status === 1 ) {
      this.game.camera.shake( 0.001, 200 );
      flash.beginFill( 0xf1d137, 0.75 );
    }

    flash.drawRect( 0, 0, this.game.world.width, this.game.world.height );
    flash.alpha = 0;
    let done = false;
    const flashTween = this.game.add.tween( flash );
    flashTween.to( { alpha: 1 }, flashLength / 2, Phaser.Easing.Linear.In, true );
    flashTween.onComplete.add( () => {
      if ( !done ) {
        callback();
        flashTween.to( { alpha: 0 }, flashLength / 2, Phaser.Easing.Linear.Out, true );
        done = true;
      }
    }, this );
  }
}
