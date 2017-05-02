import { FOOD_DATA } from '../constants/FoodConstants';
import { getFoodWithParticularMacros } from '../utils/NutritionUtils';

let data;
let easyLevelLastIndex;
let mediumLevelLastIndex;
let hardLevelLastIndex;

export function initFoodDataManager() {
  data = JSON.parse( JSON.stringify( FOOD_DATA ) )
  .sort( ( food1, food2 ) => food1.complexityLevel > food2.complexityLevel );

  easyLevelLastIndex = data.length - 1 - data.reverse().findIndex( ( food ) => food.complexityLevel === 1 );
  mediumLevelLastIndex = data.length - 1 - data.findIndex( ( food ) => food.complexityLevel === 2 );
  hardLevelLastIndex = data.length - 1;

  data.reverse();
}

export const getFoodData = () => data;
export const getEasyLevelLastIndex = () => easyLevelLastIndex;
export const getMediumLevelLastIndex = () => mediumLevelLastIndex;
export const getHardLevelLastIndex = () => hardLevelLastIndex;

export function makeKeySpawnMoreFrequently( macroKey, multiplier ) {
  const keyMacros = getFoodWithParticularMacros( data, macroKey );

  keyMacros.forEach( ( keyFood ) => {
    keyFood.probability = FOOD_DATA.find( ( food ) => food.key === keyFood.key ).probability * multiplier;
  } );

  data = data.map( ( food ) => {
    const indexOfFoodInKeyMacros = keyMacros.findIndex( ( keyFood ) => keyFood.key === food.key );

    if ( indexOfFoodInKeyMacros === -1 ) {
      return food;
    }

    return keyMacros[ indexOfFoodInKeyMacros ];
  } );
}

export function resetFoodSpawnProbability() {
  data.forEach( ( food ) => {
    food.probability = FOOD_DATA.find( ( originalFood ) => originalFood.key === food.key ).probability;
  } );
}
