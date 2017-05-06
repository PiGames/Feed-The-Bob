import Food from './Food';
import { getFoodData, getEasyLevelLastIndex, getMediumLevelLastIndex, getHardLevelLastIndex } from './FoodDataManager';
import { getRandomWithWeight } from '../utils/MathUtils.js';
import { FOOD_SPAWN_INTERVAL, FOOD_SPAWN_BOUNDS_WIDTH_MARGIN, FOOD_SPAWN_BOUNDS_HEIGHT_MARGIN, FOOD_WIDTH, FOOD_HEIGHT, MEDIUM_LEVEL_VELOCITY_OFFSET, HARD_LEVEL_VELOCITY_OFFSET, MEDIUM_LEVEL_FOOD_SPAWN_DELAY_OFFSET, HARD_LEVEL_FOOD_SPAWN_DELAY_OFFSET } from '../constants/FoodConstants';
import { TIME_TO_REACH_HARD_LEVEL, TIME_TO_REACH_MEDIUM_LEVEL } from '../constants/DifficultyLevelIntervals.js';
import { getStatusAudio } from '../utils/AudioManager.js';
import AdditionalFoodSpawner from './AdditionalFoodSpawner';
import { getDominatingMacro, getFoodWithParticularMacros } from '../utils/NutritionUtils';

export default class FoodSpawner extends Phaser.Group {
  constructor( game ) {
    super( game );

    this.timer = this.game.time.events.loop( FOOD_SPAWN_INTERVAL, this.spawnFood, this );

    this.updateStatsSignal = new Phaser.Signal();

    this.currentDifficultyLevel = 'EASY';
    this.currentDifficultyLevelLastIndex = getEasyLevelLastIndex();

    this.biteSound = this.game.add.sound( 'audio-bite', 0.5 );
    this.biteSound.allowMultiple = true;

    this.hasMacrosSpawnedData = {
      carbohydrates: false,
      fats: false,
      proteins: false,
    };

    const additionalFoodSpawner = new AdditionalFoodSpawner( game, this.hasMacrosSpawnedData );
    additionalFoodSpawner.onSpawnNeed.add( this.spawnFoodWithParticularMacro, this );

    this.onDifficultyLevelUp = new Phaser.Signal();
  }
  create() {
    this.spawnFood();
  }
  spawnFood( foodType ) {
    if ( foodType == null ) {
      foodType = getRandomWithWeight( getFoodData(), this.currentDifficultyLevelLastIndex + 1 );
      this.hasMacrosSpawnedData[ getDominatingMacro( foodType ) ] = true;
    }

    if ( this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt === false ) {
      // I really don't know how to handle this differently, I'll ask on Slack or smth...
      return;
    }
    const sides = [ 'NORTH', 'EAST', 'SOUTH', 'WEST' ];
    const spawnSide = sides[ Math.floor( Math.random() * 4 ) ];
    let x;
    let y;
    const spawnWidth = this.game.world.width - FOOD_SPAWN_BOUNDS_WIDTH_MARGIN;
    const spawnHeight = this.game.world.height - FOOD_SPAWN_BOUNDS_HEIGHT_MARGIN;
    if ( spawnSide === 'NORTH' || spawnSide === 'SOUTH' ) {
      x = spawnWidth / 2 + Math.random() * spawnWidth;
      y = spawnSide === 'NORTH' ? -FOOD_HEIGHT : this.game.world.height + FOOD_HEIGHT;
    } else {
      x = spawnSide === 'WEST' ? -FOOD_WIDTH : this.game.world.width + FOOD_WIDTH;
      y = spawnHeight / 2 + Math.random() * spawnHeight;
    }

    this.tryDifficultyLevelUp();

    const newFood = new Food( this.game, x, y, foodType.key, foodType.nutritionFacts, this.updateStatsSignal, this.onFoodConsumption.bind( this ) );

    if ( this.currentDifficultyLevel === 'MEDIUM' ) {
      newFood.speedUp( MEDIUM_LEVEL_VELOCITY_OFFSET );
    } else if ( this.currentDifficultyLevel === 'HARD' ) {
      newFood.speedUp( HARD_LEVEL_VELOCITY_OFFSET );
    }

    this.children.push( newFood );
  }
  update() {
    Phaser.Group.prototype.update.call( this );
  }
  onFoodConsumption( food, wasEaten ) {
    if ( getStatusAudio() === true && wasEaten ) {
      this.biteSound.play();
    }
    this.removeChild( food );
  }
  removeChild( child ) {
    const index = this.children.indexOf( child );
    this.children[ index ].destroy();
    this.children.splice( index, 1 );
  }
  // this method should be called from a callback that counts points
  tryDifficultyLevelUp( score ) {
    if ( score >= TIME_TO_REACH_MEDIUM_LEVEL &&
       this.currentDifficultyLevelLastIndex !== getMediumLevelLastIndex() &&
       this.currentDifficultyLevelLastIndex !== getHardLevelLastIndex() ) {
      this.currentDifficultyLevelLastIndex = getMediumLevelLastIndex();
      this.currentDifficultyLevel = 'MEDIUM';
      this.timer.delay = FOOD_SPAWN_INTERVAL - MEDIUM_LEVEL_FOOD_SPAWN_DELAY_OFFSET;
      this.onDifficultyLevelUp.dispatch( this.currentDifficultyLevel );
    } else if ( score >= TIME_TO_REACH_HARD_LEVEL &&
      this.currentDifficultyLevelLastIndex !== getHardLevelLastIndex() ) {
      this.currentDifficultyLevelLastIndex = getHardLevelLastIndex();
      this.currentDifficultyLevel = 'HARD';
      this.timer.delay = FOOD_SPAWN_INTERVAL - HARD_LEVEL_FOOD_SPAWN_DELAY_OFFSET;
      this.onDifficultyLevelUp.dispatch( this.currentDifficultyLevel );
    }
  }
  spawnFoodWithParticularMacro( macroKey ) {
    const foodDataFilteredByComplexity = getFoodData().slice( 0, this.currentDifficultyLevelLastIndex + 1 );
    const foodData = getFoodWithParticularMacros( foodDataFilteredByComplexity, macroKey );
    const foodType = getRandomWithWeight( foodData );

    this.spawnFood( foodType );
  }
}
