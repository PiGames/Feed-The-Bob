import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';
import { SUPER_THIN_BREAKPOINT, THIN_BREAKPOINT, FAT_BREAKPOINT, SUPER_FAT_BREAKPOINT } from '../constants/WeightBreakpoints';
import { NUTRITION_BAR_WIDTH, NUTRITION_BAR_HEIGHT, NUTRITION_BAR_OFFSET, NUTRITION_BAR_X_FROM_LEFT, NUTRITION_BAR_Y_FROM_BOTTOM, NUTRITION_BAR_COLOR_OK, NUTRITION_BAR_COLOR_WARN, NUTRITION_BAR_COLOR_DANGER, NUTRITION_BAR_ALPHA, NUTRITION_BAR_TEXT_OFFSET, NUTRITION_BAR_COLOR_BORDER, NUTRITION_BAR_INFO_FONT } from '../constants/UIConstants';

export default class NutritionUI {
  constructor( game, NutritionManager ) {
    this.game = game;

    this.nutrition = NutritionManager.nutrition;

    this.NutritionBars = [ game.add.graphics( 0, 0 ), game.add.graphics( 0, 0 ), game.add.graphics( 0, 0 ) ];
    this.healtTexts = [];

    this.NutritionBars.forEach( ( v ) => {
      v.anchor.setTo( 1, 1 );
    } );

    this.updateUI();
  }

  updateUI() {
    this.drawAllBars();
  }

  drawAllBars() {
    this.drawBar( this.nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES, 2, 'C:' );
    this.drawBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1, 'F:' );
    this.drawBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0, 'P:' );
  }

  drawBar( value, goodAmount, i, text ) {
    const width = NUTRITION_BAR_WIDTH;
    const height = NUTRITION_BAR_HEIGHT;
    const offset = i * NUTRITION_BAR_OFFSET;
    const doubleOfGoodAmount = goodAmount * 2;

    this.NutritionBars[ i ].clear();

    if (
      value <= doubleOfGoodAmount * SUPER_THIN_BREAKPOINT ||
      value >= doubleOfGoodAmount * SUPER_FAT_BREAKPOINT
    ) {
      this.NutritionBars[ i ].beginFill( NUTRITION_BAR_COLOR_DANGER, NUTRITION_BAR_ALPHA );
    } else if (
      value <= doubleOfGoodAmount * THIN_BREAKPOINT ||
      value >= doubleOfGoodAmount * FAT_BREAKPOINT
    ) {
      this.NutritionBars[ i ].beginFill( NUTRITION_BAR_COLOR_WARN, NUTRITION_BAR_ALPHA );
    } else {
      this.NutritionBars[ i ].beginFill( NUTRITION_BAR_COLOR_OK, NUTRITION_BAR_ALPHA );
    }

    const NutritionBarValue = Math.min( Math.max( ( value / doubleOfGoodAmount ), 0 ), 1 );

    this.game.add.text( this.game.width - ( width + NUTRITION_BAR_X_FROM_LEFT ) - NUTRITION_BAR_TEXT_OFFSET, this.game.height - ( height + NUTRITION_BAR_Y_FROM_BOTTOM ) - offset, text, NUTRITION_BAR_INFO_FONT );
    this.NutritionBars[ i ].drawRect( this.game.width - ( width + NUTRITION_BAR_X_FROM_LEFT ), this.game.height - ( height + NUTRITION_BAR_Y_FROM_BOTTOM ) - offset, width * NutritionBarValue, height );
    this.NutritionBars[ i ].endFill();
    this.NutritionBars[ i ].lineStyle( 2, NUTRITION_BAR_COLOR_BORDER, 1 );
    this.NutritionBars[ i ].drawRect( this.game.width - ( width + NUTRITION_BAR_X_FROM_LEFT ), this.game.height - ( height + NUTRITION_BAR_Y_FROM_BOTTOM ) - offset, width, height );
    this.NutritionBars[ i ].lineStyle( 0 );
  }
}
