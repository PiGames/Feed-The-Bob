import { FOOD_SPAWN_INTERVAL, FOOD_SPAWN_BOUNDS_WIDTH, FOOD_SPAWN_BOUNDS_HEIGHT, FOOD_WIDTH, FOOD_HEIGHT, FOOD_DATA } from '../constants/FoodConstants';
import Food from './Food';

export default class FoodSpawner extends Phaser.Group {
  constructor( game, NutritionManager ) {
    super( game );
    this.NutritionManager = NutritionManager;
    this.spawnFood();
    this.timer = this.game.time.events.loop( FOOD_SPAWN_INTERVAL, this.spawnFood, this );
  }
  spawnFood() {
    const sides = [ 'NORTH', 'EAST', 'SOUTH', 'WEST' ];
    const spawnSide = sides[ Math.floor( Math.random() * 4 ) ];
    let x;
    let y;
    if ( spawnSide === 'NORTH' || spawnSide === 'SOUTH' ) {
      x = FOOD_SPAWN_BOUNDS_WIDTH / 2 + Math.random() * FOOD_SPAWN_BOUNDS_WIDTH;
      y = spawnSide === 'NORTH' ? -FOOD_HEIGHT : this.game.world.height + FOOD_HEIGHT;
    } else {
      x = spawnSide === 'WEST' ? -FOOD_WIDTH : this.game.world.width + FOOD_WIDTH;
      y = FOOD_SPAWN_BOUNDS_HEIGHT / 2 + Math.random() * FOOD_SPAWN_BOUNDS_HEIGHT;
    }
    const foodType = FOOD_DATA[ Math.floor( Math.random() * FOOD_DATA.length ) ];
    const newFood = new Food( this.game, x, y, foodType.key, foodType.nutritionFacts, this.NutritionManager, this.removeChild.bind( this ) );
    this.children.push( newFood );
  }
  update() {
    Phaser.Group.prototype.update.call( this );
  }
  removeChild( child ) {
    const index = this.children.indexOf( child );
    this.children[ index ].destroy();
    this.children.splice( index, 1 );
  }
}
