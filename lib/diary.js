const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'

$(document).ready( function () {

});


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
    debugger
  })
}

module.exports = {getMeals}
