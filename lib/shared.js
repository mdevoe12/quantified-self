const $ = require('jQuery')
const api = 'http://morning-beach-24613.herokuapp.com'
const requests = require('./requests')

function foodRows(food) {
  let foodName = food.name
  let foodId = food.id
  $("#foods-header").after(
    `<tr class='food-row' data-id=${foodId}>
        <td name='name' contenteditable='true'> ${food.name} </td>
        <td name='calories' contenteditable='true'> ${food.calories} </td>
        <td id='icon-td'>
          <img class="delete-icon" src="https://raw.githubusercontent.com/mdevoe12/quantified-self/master/images/minus-icon.png"/>
        </td>
      </tr> `
  );
};

function iconListener() {
  $('#foods').on('click', '.delete-icon', deleteRow)
}

function focusListener() {
  $('#foods').on('focusout', `[data-id] td`, function(event) {
    let id = $(event.target).parent().data().id
    let text = $(event.target).text()
    let toPass = {food: {}}

    $(event.target).parent().children('[name]').each(function(index) {
      toPass.food[$(this).attr('name')] = $.trim($(this).text());
    })
    requests.updateFood(id, toPass)
  });
};


function deleteRow() {
    let foodId = $(this).parent().parent().data().id
    requests.getMealsForItemDelete(foodId)
};

function setListeners() {
  iconListener();
  focusListener();
}

function sortById(data) {
  return data.sort(function(a, b) {
    return a.id - b.id
  })
}

module.exports = {foodRows, deleteRow, setListeners, sortById}
