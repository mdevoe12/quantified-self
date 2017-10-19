const $ = require('jQuery')
const shared = require('./shared');
const api = 'https://lit-caverns-20261.herokuapp.com'


function getMealsForItemDelete(foodId) {
  $.ajax({
   method: 'GET',
   url: api + '/api/v1/meals',
   success: function(data) {
     meals = findMealsWithFood(foodId, data);
     if (meals.length) {
       deleteFoodMeals(meals, foodId);
     } else {
       deleteFood(foodId);
     }
   }
  })
}

function findMealsWithFood(foodId, meals) {
  return meals.filter(function(meal) {
    return meal.foods.some(function(food) {
      return food.id === foodId;
    })
  })
}

function deleteFoodMeals(meals, foodId) {
  $.when(...deleteFoodMealCalls(meals, foodId))
  .done(deleteFood(foodId))
};

function deleteFoodMealCalls(meals, foodId) {
  return meals.map(function(meal, index) {
     return $.ajax({
      method: 'DELETE',
      url: api + `/api/v1/meals/${meal.id}/foods/${foodId}`
    });
  })
}

function deleteFood(id) {
  $.ajax({
    method: 'DELETE',
    url: api + `/api/v1/foods/${id}`
  }).done(() => $(`[data-id=${id}]`).remove())
    .catch(showError)
}

function showError() {
  $('body').prepend('<div class="error-flash">Please Try Again</div>')
  setTimeout(function() {
    $('.error-flash').remove();
  }, 3000)
}

function updateFood(id, toPass) {
  $.ajax({
    method: 'PATCH',
    url: api + `/api/v1/foods/${id}`,
    data: toPass,
    success: function(data) {
      console.log(`${data.name} successfully updated!`);
    }
  })
}

module.exports = {getMealsForItemDelete, api, updateFood}
