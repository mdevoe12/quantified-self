const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'

$(document).ready( function() {
  getFoods();
  setFoodListener();
});

function setFoodListener() {
  $('#food-form').on('submit', function(event) {
    event.preventDefault();
    let name = $('[name=food-name]').val();
    let calories = $('[name=calories]').val();

    $.ajax({
      method: 'POST',
      url: api + '/api/v1/foods',
      data: {food: {name: name, calories: calories}},
      success: function(data) {
        alert('Added food!');
      }
    })
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
  $("#foods").append(
    `<tr>
        <td> ${food.name} </td>
        <td> ${food.calories} </td>
        <td>
          <img class="delete-icon" src="/assets/minus-icon.png"/>
        </td>
      </tr> `
  );
};
