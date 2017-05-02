import { BOB_OFFSET_Y, BOB_SCALE } from './BobConstants';

export const MIN_FOOD_VELOCITY = 190;
export const MAX_FOOD_VELOCITY = 230;

export const MEDIUM_LEVEL_VELOCITY_OFFSET = 30;
export const HARD_LEVEL_VELOCITY_OFFSET = 60;

export const FOOD_SCALE = 1;

export const FOOD_TWEEN_SPEED = 500;
export const FOOD_TWEEN_SCALE = 0.75;
export const FOOD_TWEEN_X = 0;
export const FOOD_TWEEN_Y = 560 * BOB_SCALE + BOB_OFFSET_Y;

export const FOOD_SPAWN_INTERVAL = 1.2 * Phaser.Timer.SECOND;
export const MEDIUM_LEVEL_FOOD_SPAWN_DELAY_OFFSET = 0.2 * Phaser.Timer.SECOND;
export const HARD_LEVEL_FOOD_SPAWN_DELAY_OFFSET = 0.4 * Phaser.Timer.SECOND;
export const FOOD_SPAWN_BOUNDS_WIDTH = 500;
export const FOOD_SPAWN_BOUNDS_HEIGHT = 300;

export const FOOD_WIDTH = 100;
export const FOOD_HEIGHT = 75;

export const ADDITIONAL_FOOD_SPAWN_INTERVAL = 5 * FOOD_SPAWN_INTERVAL;

export const FOOD_DATA = Object.freeze( [
  // Complexity lv. 1
  { 'key': 0, 'name': 'Apple', 'nutritionFacts': { 'carbohydrates': 18, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 2, 'quantity': '1 big apple' },
  { 'key': 4, 'name': 'Butter', 'nutritionFacts': { 'carbohydrates': 0, 'fats': 20, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1, 'quantity': '2 spoons' },
  { 'key': 7, 'name': 'Strawberry jam', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 0, 'proteins': 0 }, 'complexityLevel': 1, 'probability': 1.5, 'quantity': '3 spoons' },
  { 'key': 2, 'name': 'Chicken', 'nutritionFacts': { 'carbohydrates': 0, 'fats': 3, 'proteins': 15 }, 'complexityLevel': 1, 'probability': 1, 'quantity': '50 grams' },

  // Complexity lv. 2
  { 'key': 5, 'name': 'Donut', 'nutritionFacts': { 'carbohydrates': 25, 'fats': 12, 'proteins': 2 }, 'complexityLevel': 2, 'probability': 1, 'quantity': '1 donut' },
  { 'key': 1, 'name': 'Banana', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 2, 'proteins': 0 }, 'complexityLevel': 2, 'probability': 1.5, 'quantity': '1 banana' },
  { 'key': 9, 'name': 'Eggs', 'nutritionFacts': { 'carbohydrates': 1, 'fats': 16, 'proteins': 15 }, 'complexityLevel': 2, 'probability': 1, 'quantity': '2 eggs' },

  // Complexity lv. 3
  { 'key': 3, 'name': 'Hamburger', 'nutritionFacts': { 'carbohydrates': 30, 'fats': 13, 'proteins': 16 }, 'complexityLevel': 3, 'probability': 1, 'quantity': '1 hamburger' },
  { 'key': 8, 'name': 'Peanut butter', 'nutritionFacts': { 'carbohydrates': 6, 'fats': 16, 'proteins': 8 }, 'complexityLevel': 3, 'probability': 1, 'quantity': '2 spoons' },
  { 'key': 6, 'name': 'Milk', 'nutritionFacts': { 'carbohydrates': 12, 'fats': 8, 'proteins': 8 }, 'complexityLevel': 3, 'probability': 1, 'quantity': '1 cup' },
] );
