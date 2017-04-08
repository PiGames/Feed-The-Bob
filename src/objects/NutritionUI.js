import { GOOD_AMOUNT_OF_CARBS, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';

export default class NutritionUI {
  constructor( game, NutritionManager ) {
    this.NutritionManager = NutritionManager;
    const fontSize = 32;
    const fontScore = { font: `${fontSize}px Arial`, fill: '#000' };

    this.nutrition = this.NutritionManager.nutrition;
    this.fatOMeter = this.NutritionManager.fatOMeter;

    this.healthbars = [ game.add.graphics( 0, 0 ), game.add.graphics( 0, 0 ), game.add.graphics( 0, 0 ) ];
    this.healtTexts = [];

    this.healthbars.forEach( ( v ) => {
      v.anchor.setTo( 1, 1 );
    } );

    this.game = game;

    // Text templates
    // this.carboTextTemplate = text => `Carbohydrates: ${text}g`;
    // this.fatsTextTemplate = text => `Fats: ${text}g`;
    // this.proteinsTextTemplate = text => `Proteins: ${text}g`;
    // this.fatOMeterTextTemplate = text => `Fat-o-meter: ${Math.floor( text / 3 * 100 ) / 100}`;
    //
    // this.carboText = game.add.text( 30, 30, this.carboTextTemplate( this.nutrition.carbos ), fontScore );
    // this.carboText.anchor.set( 0 );
    //
    // this.fatsText = game.add.text( 30, ( 30 + fontSize + 8 ), this.fatsTextTemplate( this.nutrition.fats ), fontScore );
    // this.fatsText.anchor.set( 0 );
    //
    // this.proteinsText = game.add.text( 30, ( 30 + ( fontSize + 8 ) * 2 ), this.proteinsTextTemplate( this.nutrition.proteins ), fontScore );
    // this.proteinsText.anchor.set( 0 );
    //
    // this.fatOMeterText = game.add.text( 30, ( 30 + ( fontSize + 8 ) * 3 ), this.fatOMeterTextTemplate( this.fatOMeter ), fontScore );
    // this.fatOMeterText.anchor.set( 0 );

    this.drawAllBars();
  }

  updateUI() {
    // this.carboText.setText( this.carboTextTemplate( this.nutrition.carbos ) );
    // this.fatsText.setText( this.fatsTextTemplate( this.nutrition.fats ) );
    // this.proteinsText.setText( this.proteinsTextTemplate( this.nutrition.proteins ) );
    // this.fatOMeterText.setText( this.fatOMeterTextTemplate( this.NutritionManager.fatOMeter ) );

    this.drawAllBars();
  }

  drawAllBars() {
    this.drawBar( this.nutrition.carbos, GOOD_AMOUNT_OF_CARBS, 2, 'C:' );
    this.drawBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1, 'F:' );
    this.drawBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0, 'P:' );
  }

  drawBar( value, goodAmount, i, text ) {
    const width = 300;
    const height = 16;
    const offset = i * 30;

    this.healthbars[ i ].clear();

    if ( value <= ( goodAmount * 2 ) * 0.17 || value >= ( goodAmount * 2 ) * 0.83 ) {
      this.healthbars[ i ].beginFill( 0xFF0000, 0.85 );
    } else if ( value <= ( goodAmount * 2 ) * 0.34 || value >= ( goodAmount * 2 ) * 0.66 ) {
      this.healthbars[ i ].beginFill( 0xFFFF00, 0.85 );
    } else {
      this.healthbars[ i ].beginFill( 0x00FF00, 0.85 );
    }

    const fontSize = 14;
    const fontScore = { font: `${fontSize}px Arial`, fill: '#000' };

    this.game.add.text( this.game.width - ( width + 24 ) - 24, this.game.height - ( height + 24 ) - offset, text, fontScore );

    this.healthbars[ i ].drawRect( this.game.width - ( width + 24 ), this.game.height - ( height + 24 ) - offset, width * Math.max( ( value / ( goodAmount * 2 ) ), 0 ), height );
    this.healthbars[ i ].endFill();
    this.healthbars[ i ].lineStyle( 2, 0x000000, 1 );
    this.healthbars[ i ].drawRect( this.game.width - ( width + 24 ), this.game.height - ( height + 24 ) - offset, width, height );
    this.healthbars[ i ].lineStyle( 0 );
  }
}
