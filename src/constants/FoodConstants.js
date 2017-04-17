export const MIN_FOOD_VELOCITY = 120;
export const MAX_FOOD_VELOCITY = 200;

export const FOOD_SPAWN_INTERVAL = Phaser.Timer.SECOND;
export const FOOD_SPAWN_BOUNDS_WIDTH = 500;
export const FOOD_SPAWN_BOUNDS_HEIGHT = 300;

export const FOOD_WIDTH = 100;
export const FOOD_HEIGHT = 75;

export const FOOD_DATA = [
  // Complexity lv. 1
  { 'key': 0, 'name': 'apple', 'nutritionFacts': { 'carbohydrates': 12, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 1, 'name': 'banana', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 1, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 4, 'name': 'butter', 'nutritionFacts': { 'carbohydrates': 0, 'fats': 20, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 5, 'name': 'donut', 'nutritionFacts': { 'carbohydrates': 51, 'fats': 25, 'proteins': 5 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 6, 'name': 'milk', 'nutritionFacts': { 'carbohydrates': 9, 'fats': 6, 'proteins': 6 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 7, 'name': 'strawberry jam', 'nutritionFacts': { 'carbohydrates': 10, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 8, 'name': 'peanut butter', 'nutritionFacts': { 'carbohydrates': 7, 'fats': 26, 'proteins': 10 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 9, 'name': 'eggs', 'nutritionFacts': { 'carbohydrates': 2, 'fats': 31, 'proteins': 30 }, 'complexityLevel': 1, 'probability': 1 },

  // Complexity lv. 2
  { 'key': 2, 'name': 'chicken', 'nutritionFacts': { 'carbohydrates': 2, 'fats': 10, 'proteins': 18 }, 'complexityLevel': 2, 'probability': 1 },

  // Complexity lv. 3
  { 'key': 3, 'name': 'hamburger', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 13, 'proteins': 16 }, 'complexityLevel': 3, 'probability': 1 },
];
