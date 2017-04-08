import { FOOD_SPAWN_INTERVAL } from '../constants/FoodConstants';
import Food from './Food';

export default class FoodSpawner extends Phaser.Group {
  constructor( game ) {
    super( game );

    this.game.time.events.loop( FOOD_SPAWN_INTERVAL, this.spawnFood, this );
  }
  spawnFood() {
    const newFood = new Food( this.game, 10, 10, 'fruit' );
    this.children.push( newFood );
  }
}
