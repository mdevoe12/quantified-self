const shared = require('./shared.js')
const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'
// debugger
// $(document).ready( function () {
//
// });


// function getMeals() {
//   $.ajax({
//     method: 'GET',
//     url: api + '/api/v1/meals',
//     success: function (data) {
//       populateMeals(data)
//     }
//   })
// }

function populateMeals(data) {
  data.forEach(function (meal) {
    // debugger
    // meal.foods.forEach(foodFunctions.foodRows);
    shared.foodRows(meal.foods[0]);
  })
}

// module.exports = {getMeals}
