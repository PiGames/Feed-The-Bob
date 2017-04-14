export const MIN_FOOD_VELOCITY = 120;
export const MAX_FOOD_VELOCITY = 200;

export const FOOD_SPAWN_INTERVAL = Phaser.Timer.SECOND;
export const FOOD_SPAWN_BOUNDS_WIDTH = 500;
export const FOOD_SPAWN_BOUNDS_HEIGHT = 300;

export const FOOD_WIDTH = 100;
export const FOOD_HEIGHT = 75;

export const FOOD_DATA = [
  { 'key': 'apple', 'nutritionFacts': { 'carbohydrates': 12, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 'banana', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 1, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1 },
  { 'key': 'chicken', 'nutritionFacts': { 'carbohydrates': 2, 'fats': 10, 'proteins': 18 }, 'complexityLevel': 2, 'probability': 1 },
  { 'key': 'hamburger', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 13, 'proteins': 16 }, 'complexityLevel': 3, 'probability': 1 },
];
