const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'

$(document).ready( function() {
  getFoods();
  setFoodListener();
});

function setFoodListener() {
  $('#food-form').on('submit', function(event) {
    event.preventDefault();
    let name = $('[name=food-name]');
    let calories = $('[name=calorie-amount]');
    validateInputs(name, calories);
    postFood(name, calories);
  });
};

function getFoods () {
  $.ajax({
    method: 'GET',
    url: api + '/api/v1/foods',
    success: function(data) {
      // debugger
      data = data.sort(function(a, b) {
        return a.id - b.id
      })
      data.forEach(foodRows);
    }
  })
}

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


function postFood(name, calories) {
  $.ajax({
    method: 'POST',
    url: api + '/api/v1/foods',
    data: {food: {name: $.trim(name.val()), calories: $.trim(calories.val())}},
    success: function(data) {
      foodRows(data);
      $('.error-message').remove()
      name.val("")
      calories.val("")
    }
  })
}

function validateInputs(name, calories) {
  let args = Array.from(arguments);
  args.forEach(function(element) {
    let message = element.attr('name').replace('-', ' ')
    if ($.trim(element.val()) === '') {
      element.after(`<p class="error-message">Please enter a ${message}</p>`)
    }
  })
}
