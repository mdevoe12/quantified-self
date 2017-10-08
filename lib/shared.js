const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'

function foodRows(food) {
  let foodId = food.id
  $("#foods-header").after(
    `<tr class='food-row' data-id=${foodId}>
        <td name='name' contenteditable='true'> ${food.name} </td>
        <td name='calories' contenteditable='true'> ${food.calories} </td>
        <td>
          <img class="delete-icon" src="https://raw.githubusercontent.com/mdevoe12/quantified-self/master/images/minus-icon.png"/>
        </td>
      </tr> `
  );
  iconListener(foodId);
  focusListener(foodId);
};

function getMeals() {
  $.ajax({
    method: 'GET',
    url: api + '/api/v1/meals',
    success: function (data) {
      populateMeals(data)
    }
  })
}

function iconListener(foodId) {
  $(`[data-id=${foodId}] .delete-icon`).on('click', deleteRow)
}

function focusListener(foodId) {
  $(`[data-id=${foodId}]`).focusout(function(event) {
    let id = $(this).data().id
    let text = event.target.value
    $(event.target).parent().html(text)
    let toPass = {food: {}}

    $(this).children('[name]').each(function(index) {
      toPass.food[$(this).attr('name')] = $.trim($(this).text());
    })

    $.ajax({
      method: 'PATCH',
      url: api + `/api/v1/foods/${id}`,
      data: toPass,
      success: function(data) {
        console.log(`${data.name} successfully updated!`);
      }
    })
  });
};

function deleteRow() {
    let foodId = $(this).parent().parent().data().id
    deleteMeals(foodId);
};

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

function deleteMeals(foodId) {
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
};

function findMealsWithFood(foodId, meals) {
  return meals.filter(function(meal) {
    return meal.foods.some(function(food) {
      return food.id === foodId;
    })
  })
}

function deleteFood(id) {
  $.ajax({
    method: 'DELETE',
    url: api + `/api/v1/foods/${id}`,
    success: function() {
      $(`[data-id=${id}]`).remove();
    }
  })
}

module.exports = {foodRows, getMeals, iconListener, focusListener, deleteRow}
