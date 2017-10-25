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
      let $unsorted = $('#foods #foods-header').siblings()
      $('#foods #foods-header').on('click', '#sortable', function(event) {
      	let $header = $(event.target)
        let $foods = $(event.delegateTarget).siblings()
        let $sorted;
      	if ($header.is('.asc')) {
      		  $header.attr('class', 'desc')
            $sorted = $foods.sort(function(a, b) {
            	return parseInt($(a).children('td:eq(2)').text()) - parseInt($(b).children('td:eq(2)').text());
            })
            $foods.remove()
            $sorted.each(function(index) {
              $('#foods #foods-header').after($(this))
            })
          } else if ($header.is('.desc')){
      		  $header.attr('class', '')
            $sorted = $foods.sort(function(a, b) {
            	return parseInt($(a).data().id) - parseInt($(b).data().id);
            })
            $foods.remove()
            $sorted.each(function(index) {
              $('#foods #foods-header').after($(this))
            })
          } else {
      		  $header.attr('class', 'asc')
            $sorted = $foods.sort(function(a, b) {
            	return parseInt($(b).children('td:eq(2)').text()) - parseInt($(a).children('td:eq(2)').text());
            })
            $foods.remove()
            $sorted.each(function(index) {
              $('#foods #foods-header').after($(this))
            })
          }
      })
    })
  }
  foodFunctions.setFoodListener();
  diaryFunctions.addFoodListener();
  shared.setListeners();
  foodFunctions.filterFoods();
});
