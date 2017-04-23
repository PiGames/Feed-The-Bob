import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';
import { BOB_SCALE } from '../constants/BobConstants';

import { getStatus } from '../utils/NutritionUtils';

import { SUPER_THIN_BREAKPOINT, THIN_BREAKPOINT, FAT_BREAKPOINT, SUPER_FAT_BREAKPOINT } from '../constants/WeightBreakpoints';

import { makeKeySpawnMoreFrequently, resetFoodSpawnProbability } from '../objects/FoodDataManager';

export default class Bob extends Phaser.Sprite {
  constructor( game, x, y, imageKey, NutritionManager ) {
    super( game, x, y, imageKey );

    this.NutritionManager = NutritionManager;

    this.anchor.setTo( 0.5, 1 );
    this.scale.setTo( BOB_SCALE );

    this.game.world.add( this );

    this.scoreValue = 0;

    this.onScoreValueChange = new Phaser.Signal();

    this.onWeightChange = new Phaser.Signal();
  }

  handleWeightChange() {
    const nutrition = this.NutritionManager.nutrition;

    const nutritionStatuses = [ getStatus( nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES ), getStatus( nutrition.fats, GOOD_AMOUNT_OF_FATS ), getStatus( nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS ) ];

    let scoreValue = 0;

    const makeProbabilityHigher = [ { name: 'carbohydrates', makeHigher: false, makeSuperHigher: false },
     { name: 'fats', makeHigher: false, makeSuperHigher: false },
      { name: 'proteins', makeHigher: false, makeSuperHigher: false } ];

    resetFoodSpawnProbability();

    makeProbabilityHigher.forEach( ( macro ) => {
      if ( macro.makeHigher === true ) {
        makeKeySpawnMoreFrequently( macro.name, 3 );
      } else if ( macro.makeSuperHigher === true ) {
        makeKeySpawnMoreFrequently( macro.name, 5 );
      }
    } );


    const status = Math.max.apply( null, nutritionStatuses );
    this.onWeightChange.dispatch( status <= THIN_BREAKPOINT || status >= FAT_BREAKPOINT, status <= SUPER_THIN_BREAKPOINT || status >= SUPER_FAT_BREAKPOINT );

    if ( status > 6 && status < 10 ) {
      scoreValue++;
    }

    this.frame = status;

    if ( this.scoreValue !== scoreValue ) {
      this.scoreValue = scoreValue;
      this.onScoreValueChange.dispatch( scoreValue );
    }
  }
}
