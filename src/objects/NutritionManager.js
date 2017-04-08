import NutritionUI from './NutritionUI';

export default class NutritionManager {
  constructor( game ) {
    this.nutrition = {
      proteins: 1000,
      fats: 1000,
      carbo: 1000,
    };

    this.ui = new NutritionUI( game );

    game.time.events.loop( Phaser.Timer.SECOND * 2, this.reduceNutrition, this );
  }

  reduceNutrition() {
    this.nutrition.proteins--;
    this.nutrition.fats--;
    this.nutrition.carbo--;

    console.log( this.nutrition );
  }
}
