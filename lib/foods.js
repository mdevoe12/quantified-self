// $(document).on("ready", function() {
const $ = require('jQuery')

  const api = 'https://lit-caverns-20261.herokuapp.com'

  function getFoods () {
    $.ajax({
      method: 'GET',
      url: api + '/api/v1/foods',
      success: function(data) {
        data.forEach(function (food) {
          $("#foods").append(
            `<tr> <td> ${food.name} </td> <td> ${food.calories} </td> </tr>`
          )
        })
      }
    })
  }

  getFoods()


// })

module.exports = getFoods
