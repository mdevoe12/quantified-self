const shared = require('./shared.js')
const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'

function getMeals() {
  $.ajax({
    method: 'GET',
    url: api + '/api/v1/meals',
    success: function (data) {
      populateMeals(data)
    }
  })
}

function populateMeals(data) {
  data.forEach(function (meal) {
    meal.foods.forEach(function(food) {
      $(`#${meal.name.toLowerCase()} #foods-header`).after(
        `<tr class='food-row' data-id=${food.id}>
            <td name='name' contenteditable='true'> ${food.name} </td>
            <td name='calories' contenteditable='true'> ${food.calories} </td>
            <td>
              <img class="delete-icon" src="https://raw.githubusercontent.com/mdevoe12/quantified-self/master/images/minus-icon.png"/>
            </td>
          </tr> `)
          shared.focusListener(food.id);
          mealIconListener(food.id, meal);
        }
      )
  })
}

function mealIconListener(foodId, meal) {
  $(`#${meal.name.toLowerCase()} [data-id=${foodId}] .delete-icon`).on('click', function(event) {
    let $target = $(event.target)
    $.ajax({
      method: 'DELETE',
      url: api + `/api/v1/meals/${meal.id}/foods/${foodId}`,
      success: function() {
        $target.parent().parent().remove();
      }
    })
  })
}

module.exports = {getMeals}