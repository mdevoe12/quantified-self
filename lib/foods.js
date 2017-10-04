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
            `<tr> <td> ${food.name} </td> <td> ${food.calories} </td> <td> <img src="https://cdn.pixabay.com/photo/2016/06/01/17/04/minus-1429374_960_720.png"/> </td> </tr> `
          )
        })
      }
    })
  }

  getFoods()


// })

module.exports = getFoods
