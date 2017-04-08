export default class NutritionUI {
  constructor( game, NutritionManager ) {
    this.NutritionManager = NutritionManager;
    const fontSize = 32;
    const fontScore = { font: `${fontSize}px Arial`, fill: '#000' };

    this.nutrition = this.NutritionManager.nutrition;
    this.fatOMeter = this.NutritionManager.fatOMeter;

    // Text templates
    this.carboTextTemplate = text => `Carbohydrates: ${text}g`;
    this.fatsTextTemplate = text => `Fats: ${text}g`;
    this.proteinsTextTemplate = text => `Proteins: ${text}g`;
    this.fatOMeterTextTemplate = text => `Fat-o-meter: ${Math.floor( text / 3 * 100 ) / 100}`;

    this.carboText = game.add.text( 30, 30, this.carboTextTemplate( this.nutrition.carbos ), fontScore );
    this.carboText.anchor.set( 0 );

    this.fatsText = game.add.text( 30, ( 30 + fontSize + 8 ), this.fatsTextTemplate( this.nutrition.fats ), fontScore );
    this.fatsText.anchor.set( 0 );

    this.proteinsText = game.add.text( 30, ( 30 + ( fontSize + 8 ) * 2 ), this.proteinsTextTemplate( this.nutrition.proteins ), fontScore );
    this.proteinsText.anchor.set( 0 );

    this.fatOMeterText = game.add.text( 30, ( 30 + ( fontSize + 8 ) * 3 ), this.fatOMeterTextTemplate( this.fatOMeter ), fontScore );
    this.fatOMeterText.anchor.set( 0 );
  }

  updateUI() {
    this.carboText.setText( this.carboTextTemplate( this.nutrition.carbos ) );
    this.fatsText.setText( this.fatsTextTemplate( this.nutrition.fats ) );
    this.proteinsText.setText( this.proteinsTextTemplate( this.nutrition.proteins ) );
    this.fatOMeterText.setText( this.fatOMeterTextTemplate( this.NutritionManager.fatOMeter ) );
  }
}
