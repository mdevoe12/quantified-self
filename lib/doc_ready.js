const $ = require('jQuery')
const foodFunctions = require('./foods.js')
const diaryFunctions = require('./diary.js')
const foodsURL = "http://localhost:8080/foods.html"

$(document).ready( function() {
  if (document.URL == foodsURL) {
    foodFunctions.getFoods();
  } else {
    diaryFunctions.getMeals();
  }
  foodFunctions.setFoodListener();
  foodFunctions.filterFoods();
});
