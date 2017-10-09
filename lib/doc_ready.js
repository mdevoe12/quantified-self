const $ = require('jQuery')
const foodFunctions = require('./foods.js')
const diaryFunctions = require('./diary.js')

$(document).ready( function() {
  if (document.URL.includes("foods")) {
    foodFunctions.getFoods();
  } else {
    diaryFunctions.getMeals();
  }
  foodFunctions.setFoodListener();
  foodFunctions.filterFoods();
});
