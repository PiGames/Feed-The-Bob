import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';
import { SUPER_THIN_BREAKPOINT, THIN_BREAKPOINT, FAT_BREAKPOINT, SUPER_FAT_BREAKPOINT } from '../constants/WeightBreakpoints';
import { NUTRITION_BAR_WIDTH, NUTRITION_BAR_HEIGHT, NUTRITION_BAR_OFFSET, NUTRITION_BAR_X_FROM_LEFT, NUTRITION_BAR_Y_FROM_BOTTOM, NUTRITION_BAR_TEXT_OFFSET_X, NUTRITION_BAR_TEXT_OFFSET_Y, NUTRITION_BAR_INFO_FONT, NUTRITION_BAR_TEXT_SHADOW_SIZE, NUTRITION_BAR_TEXT_SHADOW_COLOR } from '../constants/UIConstants';

export default class NutritionUI {
  constructor( game, NutritionManager ) {
    this.game = game;

    this.nutrition = NutritionManager.nutrition;

    this.NutritionBars = [];
    this.NutritionMasks = [];
    this.NutritionTexts = [];

    this.drawAllBars();
  }

  updateUI() {
    this.updateBar( this.nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES, 2 );
    this.updateBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1 );
    this.updateBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0 );
  }

  drawAllBars() {
    this.drawBar( this.nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES, 2, 'Carbohydrates' );
    this.drawBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1, 'Fats' );
    this.drawBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0, 'Proteins' );
  }

  updateBar( value, goodAmount, i ) {
    const width = NUTRITION_BAR_WIDTH;
    const height = NUTRITION_BAR_HEIGHT;
    const offset = i * ( NUTRITION_BAR_OFFSET + height );
    const doubleOfGoodAmount = goodAmount * 2;

    const status = this.NutritionBars[ i ];

    if (
      value <= doubleOfGoodAmount * SUPER_THIN_BREAKPOINT ||
      value >= doubleOfGoodAmount * SUPER_FAT_BREAKPOINT
    ) {
      status.frame = 2;
    } else if (
      value <= doubleOfGoodAmount * THIN_BREAKPOINT ||
      value >= doubleOfGoodAmount * FAT_BREAKPOINT
    ) {
      status.frame = 1;
    } else {
      status.frame = 0;
    }

    const NutritionBarValue = Math.min( Math.max( ( value / doubleOfGoodAmount ), 0 ), 1 );

    const mask = this.NutritionMasks[ i ];
    mask.clear();
    mask.beginFill( 0x000000 );
    mask.drawRect( this.game.width - NUTRITION_BAR_X_FROM_LEFT - width + ( width * ( 1 - NutritionBarValue ) ), this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset - height, width * NutritionBarValue, height );
    mask.endFill();

    const statusText = this.NutritionTexts[ i ];
    statusText.setText( `${parseInt( value )} / ${goodAmount}` );
  }

  drawBar( value, goodAmount, i, text ) {
    const width = NUTRITION_BAR_WIDTH;
    const height = NUTRITION_BAR_HEIGHT;
    const offset = i * ( NUTRITION_BAR_OFFSET + height );
    const doubleOfGoodAmount = goodAmount * 2;

    const NutritionBarValue = Math.min( Math.max( ( value / doubleOfGoodAmount ), 0 ), 1 );

    const background = this.game.add.sprite( this.game.width - NUTRITION_BAR_X_FROM_LEFT, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset, 'nutrition-bar-background' );
    background.anchor.setTo( 1, 1 );

    const mask = this.game.add.graphics( 0, 0 );
    mask.beginFill( 0x000000 );
    mask.drawRect( this.game.width - NUTRITION_BAR_X_FROM_LEFT - width + ( width * ( 1 - NutritionBarValue ) ), this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset - height, width * NutritionBarValue, height );
    mask.endFill();

    this.NutritionMasks[ i ] = mask;

    const status = this.game.add.sprite( this.game.width - NUTRITION_BAR_X_FROM_LEFT, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset, 'nutrition-bar', 0 );
    status.anchor.setTo( 1, 1 );
    status.mask = mask;

    this.NutritionBars[ i ] = status;

    const descText = this.game.add.text( this.game.width - NUTRITION_BAR_X_FROM_LEFT + NUTRITION_BAR_TEXT_OFFSET_X - width, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset - NUTRITION_BAR_TEXT_OFFSET_Y, text, NUTRITION_BAR_INFO_FONT );
    descText.anchor.setTo( 0, 1 );
    descText.setShadow( 0, 0, NUTRITION_BAR_TEXT_SHADOW_COLOR, NUTRITION_BAR_TEXT_SHADOW_SIZE );

    const statusText = this.game.add.text( this.game.width - NUTRITION_BAR_X_FROM_LEFT - NUTRITION_BAR_TEXT_OFFSET_X, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - NUTRITION_BAR_TEXT_OFFSET_Y - offset, `${parseInt( value )} / ${goodAmount}`, NUTRITION_BAR_INFO_FONT );
    statusText.anchor.setTo( 1, 1 );
    statusText.setShadow( 0, 0, NUTRITION_BAR_TEXT_SHADOW_COLOR, NUTRITION_BAR_TEXT_SHADOW_SIZE );

    this.NutritionTexts[ i ] = statusText;
  }
}
