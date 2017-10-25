const $ = require('jQuery')
const foodFunctions = require('./foods.js')
const diaryFunctions = require('./diary.js')
const shared = require('./shared');

$(document).ready( function() {
  if (document.URL.includes('foods')) {
    foodFunctions.getFoods();
  } else {
    $.when(
      foodFunctions.getFoods(),
      diaryFunctions.getMeals())
    .done(function() {
      diaryFunctions.changeFoods()
    })
  }
  foodFunctions.setFoodListener();
  diaryFunctions.addFoodListener();
  shared.setListeners();
  foodFunctions.filterFoods();
});
