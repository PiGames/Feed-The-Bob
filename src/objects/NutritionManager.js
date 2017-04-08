import NutritionUI from './NutritionUI';

import { GOOD_AMOUNT_OF_CARBS, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';

export default class NutritionManager {
  constructor( game ) {
    this.nutrition = {
      carbos: GOOD_AMOUNT_OF_CARBS,
      fats: GOOD_AMOUNT_OF_FATS,
      proteins: GOOD_AMOUNT_OF_PROTEINS,
    };

    this.fatOMeter = 3;

    this.UI = new NutritionUI( game, this );

    game.time.events.loop( Phaser.Timer.SECOND * 2, this.reduceNutrition, this );
  }

  reduceNutrition() {
    this.nutrition.proteins--;
    this.nutrition.fats--;
    this.nutrition.carbos--;

    this.fatOMeter = (
      this.nutrition.carbos / GOOD_AMOUNT_OF_CARBS +
      this.nutrition.fats / GOOD_AMOUNT_OF_FATS +
      this.nutrition.proteins / GOOD_AMOUNT_OF_PROTEINS
    );

    this.UI.updateUI();
  }
}
