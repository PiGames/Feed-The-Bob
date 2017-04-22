import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/CanvasConstants';

export let scaleFactor = 1;

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
