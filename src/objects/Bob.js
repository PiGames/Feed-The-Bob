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


    let isSuperThin = false;
    let isThin = false;
    let isFat = false;
    let isSuperFat = false;

    nutritionStatuses.forEach( ( v ) => {
      if ( v <= THIN_BREAKPOINT ) {
        isThin = true;
      }

      if ( v <= SUPER_THIN_BREAKPOINT ) {
        isSuperThin = true;
      }

      if ( v >= FAT_BREAKPOINT ) {
        isFat = true;
      }

      if ( v >= SUPER_FAT_BREAKPOINT ) {
        isSuperFat = true;
      }
    } );


    this.onWeightChange.dispatch( isThin || isFat, isSuperThin || isSuperFat );

    if ( !isSuperThin && !isThin && !isFat && !isSuperFat ) {
      scoreValue++;
    }

    let status = 8;
    if ( isFat ) {
      status = Math.max.apply( null, nutritionStatuses );
    } else if ( isThin ) {
      nutritionStatuses.forEach( ( v ) => {
        if ( v < 8 ) {
          status = Math.min( status, v );
        }
      } );
    }

    this.frame = status;

    if ( this.scoreValue !== scoreValue ) {
      this.scoreValue = scoreValue;
      this.onScoreValueChange.dispatch( scoreValue );
    }
  }
}
