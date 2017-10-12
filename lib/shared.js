const $ = require('jQuery')
const api = 'https://lit-caverns-20261.herokuapp.com'
const requests = require('./requests')

function foodRows(food) {
  let foodName = food.name
  let foodId = food.id
  $("#foods-header").after(
    `<tr class='food-row' data-id=${foodId}>
        <td name='name' contenteditable='true'> ${food.name} </td>
        <td name='calories' contenteditable='true'> ${food.calories} </td>
        <td>
          <img class="delete-icon" src="https://raw.githubusercontent.com/mdevoe12/quantified-self/master/images/minus-icon.png"/>
        </td>
      </tr> `
  );
  iconListener(foodId);
  focusListener(foodId);
};

function iconListener(foodId) {
  $(`[data-id=${foodId}] .delete-icon`).on('click', deleteRow)
}

function focusListener(foodId) {
  $(`[data-id=${foodId}]`).focusout(function(event) {
    let id = $(this).data().id
    let text = event.target.value
    $(event.target).parent().html(text)
    let toPass = {food: {}}

    $(this).children('[name]').each(function(index) {
      toPass.food[$(this).attr('name')] = $.trim($(this).text());
    })
    requests.updateFood(id, toPass)
  });
};


function deleteRow() {
    let foodId = $(this).parent().parent().data().id
    requests.getMealsForItemDelete(foodId)
};

module.exports = {foodRows, iconListener, focusListener, deleteRow}
