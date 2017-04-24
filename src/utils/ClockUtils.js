import { $ } from './ScaleManager';

export function initClock( state ) {
  const now = new Date();
  state.Clock = {};
  state.Clock.minuteDial = state.game.add.sprite( $( 847 ), $( 243 ), $( 'minute-dial' ) );
  state.Clock.minuteDial.anchor.setTo( 0.5, 1 );
  state.Clock.minuteDial.angle = ( now.getMinutes() / 60 ) * 360;

  state.Clock.hourDial = state.game.add.sprite( $( 847 ), $( 243 ), $( 'hour-dial' ) );
  state.Clock.hourDial.anchor.setTo( 0.5, 1 );
  state.Clock.hourDial.angle = ( ( now.getHours() % 12 ) / 12 ) * 360 + ( now.getMinutes() / 60 ) * 30;
}

export function updateClock( state ) {
  const now = new Date();
  state.Clock.minuteDial.angle = ( now.getMinutes() / 60 ) * 360;

  state.Clock.hourDial.angle = ( ( now.getHours() % 12 ) / 12 ) * 360 + ( now.getMinutes() / 60 ) * 30;
}
