import PPT from './states';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/CanvasConstants';

const game = new Phaser.Game( CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.AUTO );
const states = {
  'Boot': PPT.Boot,
  'Preloader': PPT.Preloader,
  'Game': PPT.Game,
  'Credits': PPT.Credits,
};
for ( const stateName in states ) {
  game.state.add( stateName, states[ stateName ] );
}
game.state.start( 'Boot' );
