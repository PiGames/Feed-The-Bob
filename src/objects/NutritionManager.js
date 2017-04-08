import NutritionUI from './NutritionUI';

export default class NutritionManager {
  constructor( game ) {
    this.nutrition = {
      carbos: 1000,
      fats: 1000,
      proteins: 1000,
    };

    this.UI = new NutritionUI( game, this );

    game.time.events.loop( Phaser.Timer.SECOND * 2, this.reduceNutrition, this );
  }

  reduceNutrition() {
    this.nutrition.proteins--;
    this.nutrition.fats--;
    this.nutrition.carbos--;

    this.UI.updateUI();
  }
}
