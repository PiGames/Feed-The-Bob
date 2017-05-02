import Food from './Food';
import { getFoodData, getEasyLevelLastIndex, getMediumLevelLastIndex, getHardLevelLastIndex } from './FoodDataManager';
import { getRandomWithWeight } from '../utils/MathUtils.js';
import { FOOD_SPAWN_INTERVAL, FOOD_SPAWN_BOUNDS_WIDTH, FOOD_SPAWN_BOUNDS_HEIGHT, FOOD_WIDTH, FOOD_HEIGHT } from '../constants/FoodConstants';
import { TIME_TO_REACH_HARD_LEVEL, TIME_TO_REACH_MEDIUM_LEVEL } from '../constants/DifficultyLevelIntervals.js';
import { getStatusAudio } from '../utils/AudioManager.js';
import AdditionalFoodSpawner from './AdditionalFoodSpawner';
import { getDominatingMacro } from '../utils/NutritionUtils';

export default class FoodSpawner extends Phaser.Group {
  constructor( game ) {
    super( game );

    this.timer = this.game.time.events.loop( FOOD_SPAWN_INTERVAL, this.spawnFood, this );

    this.updateStatsSignal = new Phaser.Signal();

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
  }
  create() {
    this.spawnFood();
  }
  spawnFood() {
    if ( this.game.veryBadGlobalFlagToMakeAHotFixSorryButIHaveToUseIt === false ) {
      // I really don't know how to handle this differently, I'll ask on Slack or smth...
      return;
    }
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
    this.tryDifficultyLevelUp();

    const foodType = getRandomWithWeight( getFoodData(), this.currentDifficultyLevelLastIndex + 1 );

    console.log( getDominatingMacro( foodType ) );

    this.hasMacrosSpawnedData[ getDominatingMacro( foodType ) ] = true;

    const newFood = new Food( this.game, x, y, foodType.key, foodType.nutritionFacts, this.updateStatsSignal, this.onFoodConsumption.bind( this ) );
    this.children.push( newFood );
  }
  update() {
    Phaser.Group.prototype.update.call( this );
  }
  onFoodConsumption( food ) {
    if ( getStatusAudio() === true ) {
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
    } else if ( score >= TIME_TO_REACH_HARD_LEVEL &&
      this.currentDifficultyLevelLastIndex !== getHardLevelLastIndex() ) {
      this.currentDifficultyLevelLastIndex = getHardLevelLastIndex();
    }
  }
  spawnFoodWithParticularMacro( macroKey ) {
    console.log( `Spawn food with ${macroKey} now.` );
  }
}
