import { GOOD_AMOUNT_OF_CARBS, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';

export default class Bob extends Phaser.Sprite {
  constructor( game, x, y, imageKey, NutritionManager, handleDeath ) {
    super( game, x, y, imageKey );

    this.frame = 1;

    this.handleDeath = handleDeath;

    this.NutritionManager = NutritionManager;

    this.anchor.setTo( 0.5, 1 );
    this.scale.setTo( 0.25 );

    this.game.world.add( this );
  }

  hadleWeightChange() {
    const nutrition = this.NutritionManager.nutrition;

    const arr = [ this.getStatus( nutrition.carbos, GOOD_AMOUNT_OF_CARBS ), this.getStatus( nutrition.fats, GOOD_AMOUNT_OF_FATS ), this.getStatus( nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS ) ];

    let outOfOrder = 0;
    let isThin = false;
    let isFat = false;
    let isDead = false;
    let isSuperFat = false;

    arr.forEach( ( v ) => {
      if ( v === -1 ) {
        isThin = true;
      } else if ( v === 1 ) {
        isFat = true;
      } else if ( v === 2 ) {
        isFat = true;
        isSuperFat = true;
      }

      if ( v === -2 ) {
        isDead = true;
      }

      outOfOrder += ( v !== 0 );
    } );

    if ( isDead ) {
      this.handleDeath();
    }

    // this.frame = 2;
    if ( outOfOrder === 0 ) {
      this.frame = 1;
    } else if ( outOfOrder === 1 ) {
      if ( isThin ) {
        this.frame = 0;
      }

      if ( isFat ) {
        this.frame = 2;
      }

      if ( isSuperFat ) {
        this.frame = 3;
      }
    } else {
      if ( isThin ) {
        this.frame = 0;
      }

      if ( isFat ) {
        this.frame = 2;
      }

      if ( isSuperFat ) {
        this.frame = 3;
      }
    }
  }

  getStatus( value, goodAmount ) {
    if ( value <= 0 || value >= ( goodAmount * 2 ) ) {
      return -2;
    }

    if ( value <= ( goodAmount * 2 ) * 0.17 ) {
      return -1;
    }

    if ( value >= ( goodAmount * 2 ) * 0.83 ) {
      return 2;
    }

    if ( value >= ( goodAmount * 2 ) * 0.66 ) {
      return 1;
    }


    return 0;
  }
}
