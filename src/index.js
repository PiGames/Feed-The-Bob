import EPT from './states';

const game = new Phaser.Game( 960, 640, Phaser.AUTO );
const states = {
  'Boot': EPT.Boot,
  'Preloader': EPT.Preloader,
  'MainMenu': EPT.MainMenu,
  'Wiki': EPT.Wiki,
  'Story': EPT.Story,
  'Game': EPT.Game,
};
for ( const stateName in states ) {
  game.state.add( stateName, states[ stateName ] );
}
game.state.start( 'Boot' );
