import { ADDITIONAL_FOOD_SPAWN_INTERVAL } from '../constants/FoodConstants';

export default class AdditionalFoodSpawner {
  constructor( game, hasMacrosSpawnedData ) {
    this.hasMacrosSpawnedData = hasMacrosSpawnedData;

    this.checkIfShouldSpawnTimer = game.time.events.loop( ADDITIONAL_FOOD_SPAWN_INTERVAL, this.checkIfShouldSpawn, this );

    this.onSpawnNeed = new Phaser.Signal();
  }
  checkIfShouldSpawn() {
    for ( const macroKey in this.hasMacrosSpawnedData ) {
      if ( this.hasMacrosSpawnedData[ macroKey ] === false ) {
        this.onSpawnNeed.dispatch( macroKey );
      }
      this.hasMacrosSpawnedData[ macroKey ] = false;
    }
  }
}
