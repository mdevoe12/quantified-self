const shared = require('./shared.js')
const $ = require('jQuery')
const api = 'http://morning-beach-24613.herokuapp.com'

function setFoodListener() {
  $('#food-form').on('submit', function(event) {
    event.preventDefault();
    let name = $('[name=food-name]');
    let calories = $('[name=calorie-amount]');
    validateInputs(name, calories);
    postFood(name, calories);
  });
};

function filterFoods() {
  $('#filter').keyup(function () {
    hideFoods($(this).val().toLowerCase())
  })
}

function hideFoods(string) {
  $('#foods [name=name]').each(function () {
    if ($(this).text().toLowerCase().includes(string)) {
      $(this).parent().show()
    } else {
      $(this).parent().hide()
    }
  })
}

function getFoods () {
  return $.ajax({
    method: 'GET',
    url: api + '/api/v1/foods',
    success: function(data) {
      data = shared.sortById(data)
      data.forEach(shared.foodRows)
    }
  })
}

function postFood(name, calories) {
  $.ajax({
    method: 'POST',
    url: api + '/api/v1/foods',
    data: {food: {name: $.trim(name.val()), calories: $.trim(calories.val())}},
    success: function(data) {
      shared.foodRows(data);
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

module.exports = {getFoods, setFoodListener, filterFoods}
