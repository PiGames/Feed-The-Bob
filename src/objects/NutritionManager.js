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

    game.time.events.loop( Phaser.Timer.SECOND * 1, this.reduceNutrition, this );
  }

  reduceNutrition() {
    const percentAmount = 0.03;
    this.nutrition.carbos -= ( GOOD_AMOUNT_OF_CARBS * percentAmount );
    this.nutrition.fats -= ( GOOD_AMOUNT_OF_FATS * percentAmount );
    this.nutrition.proteins -= ( GOOD_AMOUNT_OF_PROTEINS * percentAmount );

    this.nutrition.carbos = Math.round( this.nutrition.carbos * 10 ) / 10;
    this.nutrition.fats = Math.round( this.nutrition.fats * 10 ) / 10;
    this.nutrition.proteins = Math.round( this.nutrition.proteins * 10 ) / 10;

    this.fatOMeter = (
      this.nutrition.carbos / GOOD_AMOUNT_OF_CARBS +
      this.nutrition.fats / GOOD_AMOUNT_OF_FATS +
      this.nutrition.proteins / GOOD_AMOUNT_OF_PROTEINS
    );

    this.UI.updateUI();
  }
}
