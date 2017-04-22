import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';
import { SUPER_THIN_BREAKPOINT, THIN_BREAKPOINT, FAT_BREAKPOINT, SUPER_FAT_BREAKPOINT } from '../constants/WeightBreakpoints';
import { BOB_SCALE } from '../constants/BobConstants';

import { makeKeySpawnMoreFrequently, resetFoodSpawnProbability } from '../objects/FoodDataManager';

export default class Bob extends Phaser.Sprite {
  constructor( game, x, y, imageKey, NutritionManager, handleDeath ) {
    super( game, x, y, imageKey );

    this.handleDeath = handleDeath;

    this.NutritionManager = NutritionManager;

    this.anchor.setTo( 0.5, 1 );
    this.scale.setTo( BOB_SCALE );

    this.game.world.add( this );

    this.scoreValue = 3;

    this.onScoreValueChange = new Phaser.Signal();

    this.onWeightChange = new Phaser.Signal();
  }

  handleWeightChange() {
    const nutrition = this.NutritionManager.nutrition;

    const nutritionStatuses = [ this.getStatus( nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES ), this.getStatus( nutrition.fats, GOOD_AMOUNT_OF_FATS ), this.getStatus( nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS ) ];

    let isSuperThin = false;
    let isThin = false;
    let isFat = false;
    let isSuperFat = false;

    let scoreValue = 0;

    const makeProbabilityHigher = [ { name: 'carbohydrates', makeHigher: false, makeSuperHigher: false },
     { name: 'fats', makeHigher: false, makeSuperHigher: false },
      { name: 'proteins', makeHigher: false, makeSuperHigher: false } ];
    nutritionStatuses.forEach( ( v, index ) => {
      switch ( v ) {
      case -3:
        isSuperThin = true;
        break;
      case -2:
        isSuperThin = true;
        makeProbabilityHigher[ index ].makeSuperHigher = true;
        break;
      case -1:
        isThin = true;
        makeProbabilityHigher[ index ].makeHigher = true;
        break;
      case 1:
        isFat = true;
        break;
      case 2:
        isSuperFat = true;
        break;
      case 3:
        isSuperFat = true;
        break;
      default:
        scoreValue += 1;
      }
    } );

    resetFoodSpawnProbability();

    makeProbabilityHigher.forEach( ( macro ) => {
      if ( macro.makeHigher === true ) {
        makeKeySpawnMoreFrequently( macro.name, 3 );
      } else if ( macro.makeSuperHigher === true ) {
        makeKeySpawnMoreFrequently( macro.name, 5 );
      }
    } );


    this.onWeightChange.dispatch( isFat || isThin || isSuperFat || isSuperThin, isSuperFat || isSuperThin );

    if ( this.scoreValue !== scoreValue ) {
      this.scoreValue = scoreValue;
      this.onScoreValueChange.dispatch( scoreValue );
    }

    if ( isSuperThin || isThin || isFat || isSuperFat ) {
      if ( isThin ) {
        this.frame = 6;
      }

      if ( isSuperThin ) {
        this.frame = 0;
      }

      if ( isFat ) {
        this.frame = 12;
      }

      if ( isSuperFat ) {
        this.frame = 14;
      }
    } else {
      this.frame = 8;
    }
  }

  getStatus( value, goodAmount ) {
    const doubleOfGoodAmount = goodAmount * 2;

    if ( value >= doubleOfGoodAmount ) {
      // Bob died from fatness
      return 3;
    }

    if ( value <= 0 ) {
      // Bob died from thinness
      return -3;
    }

    if ( value <= doubleOfGoodAmount * SUPER_THIN_BREAKPOINT ) {
      // Bob is super thin
      return -2;
    }

    if ( value <= doubleOfGoodAmount * THIN_BREAKPOINT ) {
      // Bob is thin
      return -1;
    }

    if ( value >= doubleOfGoodAmount * SUPER_FAT_BREAKPOINT ) {
      // Bob is super fat
      return 2;
    }

    if ( value >= doubleOfGoodAmount * FAT_BREAKPOINT ) {
      // Bob is fat
      return 1;
    }

    // Bob is normal
    return 0;
  }
}
