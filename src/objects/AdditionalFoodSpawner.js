import { ADDITIONAL_FOOD_SPAWN_INTERVAL } from '../constants/FoodConstants';

export default class AdditionalFoodSpawner {
  constructor( game, hasMacrosSpawnedData ) {
    this.hasMacrosSpawnedData = hasMacrosSpawnedData;
    console.log( ADDITIONAL_FOOD_SPAWN_INTERVAL );
    this.checkIfShouldSpawnTimer = game.time.events.loop( ADDITIONAL_FOOD_SPAWN_INTERVAL, this.checkIfShouldSpawn, this );

    this.onSpawnNeed = new Phaser.Signal();
  }
  checkIfShouldSpawn() {
    for ( const macroKey in this.hasMacrosSpawnedData ) {
      console.log( `should spawn ${macroKey} ?` );
      if ( this.hasMacrosSpawnedData[ macroKey ] === false ) {
        this.onSpawnNeed.dispatch( macroKey );
        console.log( 'yep' );
      } else {
        console.log( 'nope' );
      }
      this.hasMacrosSpawnedData[ macroKey ] = false;
    }
  }
}
