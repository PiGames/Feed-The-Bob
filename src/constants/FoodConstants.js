export const MIN_FOOD_VELOCITY = 120;
export const MAX_FOOD_VELOCITY = 200;

export const FOOD_SPAWN_INTERVAL = Phaser.Timer.SECOND;
export const FOOD_SPAWN_BOUNDS_WIDTH = 500;
export const FOOD_SPAWN_BOUNDS_HEIGHT = 300;

export const FOOD_WIDTH = 100;
export const FOOD_HEIGHT = 75;

export const FOOD_DATA = [
  // Complexity lv. 1
  { 'key': 0, 'name': 'apple', 'nutritionFacts': { 'carbohydrates': 12, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 2, 'quantity': 'one apple' },
  { 'key': 4, 'name': 'butter', 'nutritionFacts': { 'carbohydrates': 0, 'fats': 20, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1, 'quantity': 'two spoons' },
  { 'key': 7, 'name': 'strawberry jam', 'nutritionFacts': { 'carbohydrates': 20, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1, 'quantity': 'two spoons' },
  { 'key': 2, 'name': 'chicken', 'nutritionFacts': { 'carbohydrates': 0, 'fats': 3, 'proteins': 15 }, 'complexityLevel': 1, 'probability': 1, 'quantity': '50 grams' },

  // Complexity lv. 2
  { 'key': 5, 'name': 'donut', 'nutritionFacts': { 'carbohydrates': 25, 'fats': 12, 'proteins': 2 }, 'complexityLevel': 2, 'probability': 1, 'quantity': 'one donut' },
  { 'key': 1, 'name': 'banana', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 2, 'proteins': 0 }, 'complexityLevel': 2, 'probability': 1.5, 'quantity': 'one banana' },
  { 'key': 9, 'name': 'eggs', 'nutritionFacts': { 'carbohydrates': 1, 'fats': 16, 'proteins': 15 }, 'complexityLevel': 2, 'probability': 1, 'quantity': 'two eggs' },

  // Complexity lv. 3
  { 'key': 3, 'name': 'hamburger', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 13, 'proteins': 16 }, 'complexityLevel': 3, 'probability': 1, 'quantity': 'one hamburger' },
  { 'key': 8, 'name': 'peanut butter', 'nutritionFacts': { 'carbohydrates': 6, 'fats': 16, 'proteins': 8 }, 'complexityLevel': 3, 'probability': 1, 'quantity': '2 spoons' },
  { 'key': 6, 'name': 'milk', 'nutritionFacts': { 'carbohydrates': 12, 'fats': 8, 'proteins': 8 }, 'complexityLevel': 3, 'probability': 1, 'quantity': 'one cup' },
];
