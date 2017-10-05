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
      data.forEach(foodRows);
    }
  })
}

function foodRows(food) {
  $("#foods-header").after(
    `<tr>
        <td> ${food.name} </td>
        <td> ${food.calories} </td>
        <td>
          <img class="delete-icon" src="https://raw.githubusercontent.com/mdevoe12/quantified-self/master/images/minus-icon.png"/>
        </td>
      </tr> `
  );
};

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
