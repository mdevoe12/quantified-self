const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'

$(document).on('ready', getFoods());

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
          <img class="delete-icon" src="https://tinyurl.com/ydalo4bs"/>
        </td>
      </tr> `
  );
};

module.exports = getFoods;
