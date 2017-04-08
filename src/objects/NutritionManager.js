export default class NutritionManager {
  constructor() {
    this.nutrition = {
      proteins: 1000,
      fats: 1000,
      carbo: 1000,
    };
  }

  reduceNutrition() {
    this.nutrition.proteins--;
    this.nutrition.fats--;
    this.nutrition.carbo--;

    console.log( this.nutrition );
  }
}
