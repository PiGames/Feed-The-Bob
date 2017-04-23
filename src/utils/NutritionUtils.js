import { THINNESS_LEVELS, FATNESS_LEVELS } from '../constants/WeightBreakpoints';

export function getStatus( value, goodAmount ) {
  for ( let i = 0; i < FATNESS_LEVELS.length; i++ ) {
    if ( value > goodAmount * FATNESS_LEVELS[ i ] ) {
      return FATNESS_LEVELS.length - i + 8;
    }
  }

  for ( let i = 0; i < THINNESS_LEVELS.length; i++ ) {
    if ( value < goodAmount * THINNESS_LEVELS[ i ] ) {
      return i;
    }
  }

  return 8;
}
