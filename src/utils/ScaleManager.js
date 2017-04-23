import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/CanvasConstants';

export let scaleFactor = 1;

/**
  This magic function handles scaling of game assets.

  // Using on numbers
  @param {number} value
  @returns {number} - value multiplied by scaleFactor

  // Using on sprite keys
  @param {string} value
  @returns {string} - value with added suffix for sprite naming

  // Using with onScale
  @param {string|number} value
  @param {number} onScale
  @returns {string=''|number=0} - returns value only if onScale equlas scaleFactor

  // Using with text styles
  @param {object} value
  @returns {object} - multiplies fontSize by scaleFactor
 */

export function $( value, onScale ) {
  const typeofVal = typeof value;

  if ( typeofVal === 'string' ) {
    if ( onScale ) {
      if ( onScale === scaleFactor ) {
        return value;
      }

      return '';
    }

    if ( scaleFactor !== 1 ) {
      return `${value}-${scaleFactor * 100}`;
    }

    return `${value}`;
  } else if ( typeofVal === 'number' ) {
    if ( onScale ) {
      if ( onScale === scaleFactor ) {
        return value;
      }

      return 0;
    }

    return value * scaleFactor;
  } else if ( typeofVal === 'object' && value.fontSize ) {
    const styles = Object.assign( {}, value );
    styles.fontSize = $( styles.fontSize );

    return styles;
  }
}

export function $set( newScaleFactor ) {
  scaleFactor = newScaleFactor;

  this.game.scale.setGameSize( $( CANVAS_WIDTH ), $( CANVAS_HEIGHT ) );
  this.game.state.start( this.state.current );
}
