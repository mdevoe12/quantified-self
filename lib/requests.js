const $ = require('jQuery')
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
  meals.forEach(function(meal, index) {
     $.ajax({
      method: 'DELETE',
      url: api + `/api/v1/meals/${meal.id}/foods/${foodId}`,
      success: function() {
        if (index === (meals.length - 1)) {
          deleteFood(foodId);
        }
      }
    });
  })
};

function deleteFood(id) {
  $.ajax({
    method: 'DELETE',
    url: api + `/api/v1/foods/${id}`,
    success: function() {
      $(`[data-id=${id}]`).remove();
    }
  })
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
