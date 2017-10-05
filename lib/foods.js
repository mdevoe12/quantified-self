const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'

$(document).ready( function() {
  getFoods();
  setFoodListener();
});

function setFoodListener() {
  $('#food-form').on('submit', function(event) {
    event.preventDefault();
    let name = $.trim($('[name=food-name]').val());
    let calories = $.trim($('[name=calories]').val());
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
  $("#foods").prepend(
    `<tr>
        <td> ${food.name} </td>
        <td> ${food.calories} </td>
        <td>
          <img class="delete-icon" src="/assets/minus-icon.png"/>
        </td>
      </tr> `
  );
};

function postFood(name, calories) {
  $.ajax({
    method: 'POST',
    url: api + '/api/v1/foods',
    data: {food: {name: name, calories: calories}},
    success: function(data) {
      alert('Added food!')
      foodRows(data);
    }
  })
}

function validateInputs(name, calories) {
  if (name  == '') {
    alert('Text-field is empty.');
    return false;
  }
}
