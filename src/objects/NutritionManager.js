import NutritionUI from '../UI/NutritionUI';

import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS, AMOUNT_REDUCED_INTERVAL, AMOUNT_REDUCED_PERCENT, MEDIUM_LEVEL_DELAY_OFFSET, HARD_LEVEL_DELAY_OFFSET } from '../constants/NutritionConstants';

export default class NutritionManager {
  constructor( game ) {
    this.nutrition = {
      carbohydrates: GOOD_AMOUNT_OF_CARBOHYDRATES,
      fats: GOOD_AMOUNT_OF_FATS,
      proteins: GOOD_AMOUNT_OF_PROTEINS,
    };

    this.UI = new NutritionUI( game, this );

    this.updateTimer = game.time.events.loop( AMOUNT_REDUCED_INTERVAL, this.reduceNutrition, this );
  }

  reduceNutrition() {
    this.nutrition.carbohydrates -= ( GOOD_AMOUNT_OF_CARBOHYDRATES * AMOUNT_REDUCED_PERCENT );
    this.nutrition.fats -= ( GOOD_AMOUNT_OF_FATS * AMOUNT_REDUCED_PERCENT );
    this.nutrition.proteins -= ( GOOD_AMOUNT_OF_PROTEINS * AMOUNT_REDUCED_PERCENT );

    this.nutrition.carbohydrates = Math.round( this.nutrition.carbohydrates * 10 ) / 10;
    this.nutrition.fats = Math.round( this.nutrition.fats * 10 ) / 10;
    this.nutrition.proteins = Math.round( this.nutrition.proteins * 10 ) / 10;

    this.UI.updateUI();
  }

  updateStats( data ) {
    this.nutrition.carbohydrates += data.carbohydrates;
    this.nutrition.fats += data.fats;
    this.nutrition.proteins += data.proteins;

    this.UI.updateUI( data );
  }

  growDifficulty( level ) {
    if ( level === 'MEDIUM' ) {
      this.speedUp( MEDIUM_LEVEL_DELAY_OFFSET );
    } else if ( level === 'HARD' ) {
      this.speedUp( HARD_LEVEL_DELAY_OFFSET );
    }
  }

  speedUp( delayOffset ) {
    this.updateTimer.delay = AMOUNT_REDUCED_INTERVAL - delayOffset;
  }
}
