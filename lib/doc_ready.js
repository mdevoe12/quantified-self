const $ = require('jQuery')
const foodFunctions = require('./foods.js')
const diaryFunctions = require('./diary.js')
const shared = require('./shared');

$(document).ready( function() {
  if (document.URL.includes('foods')) {
    foodFunctions.getFoods();
  } else {
    foodFunctions.getFoods();
    diaryFunctions.getMeals();
  }
  foodFunctions.setFoodListener();
  shared.setListeners();
  foodFunctions.filterFoods();
});
