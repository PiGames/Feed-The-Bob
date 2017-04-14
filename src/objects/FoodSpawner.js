import { FOOD_SPAWN_INTERVAL, FOOD_SPAWN_BOUNDS_WIDTH, FOOD_SPAWN_BOUNDS_HEIGHT, FOOD_WIDTH, FOOD_HEIGHT, FOOD_DATA } from '../constants/FoodConstants';
import Food from './Food';
import { TIME_TO_REACH_HARD_LEVEL, TIME_TO_REACH_MEDIUM_LEVEL } from '../constants/DifficultyLevelIntervals.js';

export default class FoodSpawner extends Phaser.Group {
  constructor( game, NutritionManager, enableDifficultyLevelGrowth = false ) {
    super( game );
    this.NutritionManager = NutritionManager;
    this.enableDifficultyLevelGrowth = enableDifficultyLevelGrowth;

    this.timer = this.game.time.events.loop( FOOD_SPAWN_INTERVAL, this.spawnFood, this );

    if ( this.enableDifficultyLevelGrowth ) {
      this.sortedFoodData = FOOD_DATA.sort( ( food1, food2 ) => food1.complexityLevel > food2.complexityLevel );
      this.easyLevelLastIndex = FOOD_DATA.length - 1 - this.sortedFoodData.reverse().findIndex( ( food ) => food.complexityLevel === 1 );
      this.mediumLevelLastIndex = FOOD_DATA.length - 1 - this.sortedFoodData.findIndex( ( food ) => food.complexityLevel === 2 );
      this.hardLevelLastIndex = FOOD_DATA.length - 1;

      this.sortedFoodData.reverse();

      this.currentDifficultyLevelLastIndex = this.easyLevelLastIndex;
    }
  }
  create() {
    this.spawnFood();
  }
  spawnFood() {
    const sides = [ 'NORTH', 'EAST', 'SOUTH', 'WEST' ];
    const spawnSide = sides[ Math.floor( Math.random() * 4 ) ];
    let x;
    let y;
    if ( spawnSide === 'NORTH' || spawnSide === 'SOUTH' ) {
      x = FOOD_SPAWN_BOUNDS_WIDTH / 2 + Math.random() * FOOD_SPAWN_BOUNDS_WIDTH;
      y = spawnSide === 'NORTH' ? -FOOD_HEIGHT : this.game.world.height + FOOD_HEIGHT;
    } else {
      x = spawnSide === 'WEST' ? -FOOD_WIDTH : this.game.world.width + FOOD_WIDTH;
      y = FOOD_SPAWN_BOUNDS_HEIGHT / 2 + Math.random() * FOOD_SPAWN_BOUNDS_HEIGHT;
    }
    let foodType;
    if ( !this.enableDifficultyLevelGrowth ) {
      foodType = FOOD_DATA[ Math.floor( Math.random() * FOOD_DATA.length ) ];
    } else {
      this.tryDifficultyLevelUp();
      foodType = this.sortedFoodData[ Math.floor( Math.random() * ( this.currentDifficultyLevelLastIndex + 1 ) ) ];
    }
    const newFood = new Food( this.game, x, y, foodType.key, foodType.nutritionFacts, this.NutritionManager, this.removeChild.bind( this ) );
    this.children.push( newFood );
  }
  update() {
    Phaser.Group.prototype.update.call( this );
  }
  removeChild( child ) {
    const index = this.children.indexOf( child );
    this.children[ index ].destroy();
    this.children.splice( index, 1 );
  }
  // this method should be called from a callback that counts points
  tryDifficultyLevelUp( score ) {
    if ( score >= TIME_TO_REACH_MEDIUM_LEVEL && this.currentDifficultyLevelLastIndex !== this.mediumLevelLastIndex && this.currentDifficultyLevelLastIndex !== this.hardLevelLastIndex ) {
      this.currentDifficultyLevelLastIndex = this.mediumLevelLastIndex;
    } else if ( score >= TIME_TO_REACH_HARD_LEVEL && this.currentDifficultyLevelLastIndex !== this.hardLevelLastIndex ) {
      this.currentDifficultyLevelLastIndex = this.hardLevelLastIndex;
    }
  }
}
