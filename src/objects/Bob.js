import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';
import { SUPER_THIN_BREAKPOINT, THIN_BREAKPOINT, FAT_BREAKPOINT, SUPER_FAT_BREAKPOINT } from '../constants/WeightBreakpoints';

export default class Bob extends Phaser.Sprite {
  constructor( game, x, y, imageKey, NutritionManager, handleDeath ) {
    super( game, x, y, imageKey );

    this.handleDeath = handleDeath;

    this.NutritionManager = NutritionManager;

    this.anchor.setTo( 0.5, 1 );
    this.scale.setTo( 0.5 );

    this.game.world.add( this );

    this.scoreValue = 3;

    this.onScoreValueChange = new Phaser.Signal();

    this.onWeightChange = new Phaser.Signal();
  }

  handleWeightChange() {
    const nutrition = this.NutritionManager.nutrition;

    const nutritionStatuses = [ this.getStatus( nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES ), this.getStatus( nutrition.fats, GOOD_AMOUNT_OF_FATS ), this.getStatus( nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS ) ];

    let isDeadFromThinness = false;
    let isSuperThin = false;
    let isThin = false;
    let isFat = false;
    let isSuperFat = false;
    let isDeadFromFat = false;

    let scoreValue = 0;

    nutritionStatuses.forEach( ( v ) => {
      switch ( v ) {
      case -3:
        isDeadFromThinness = true;
        isSuperThin = true;
        break;
      case -2:
        isSuperThin = true;
        break;
      case -1:
        isThin = true;
        break;
      case 1:
        isFat = true;
        break;
      case 2:
        isSuperFat = true;
        break;
      case 3:
        isDeadFromFat = true;
        isSuperFat = true;
        break;
      default:
        scoreValue += 1;
      }
    } );
    this.onWeightChange.dispatch( isSuperFat || isSuperThin );

    if ( this.scoreValue !== scoreValue ) {
      this.scoreValue = scoreValue;
      this.onScoreValueChange.dispatch( scoreValue );
    }

    if ( isSuperThin || isThin || isFat || isSuperFat ) {
      if ( isThin ) {
        this.frame = 1;
      }

      if ( isSuperThin ) {
        this.frame = 0;
      }

      if ( isFat ) {
        this.frame = 3;
      }

      if ( isSuperFat ) {
        this.frame = 4;
      }
    } else {
      this.frame = 2;
    }

    if ( isDeadFromFat ) {
      this.handleDeath( 'fat' );
    }

    if ( isDeadFromThinness ) {
      this.handleDeath( 'thinness' );
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
