const shared = require('./shared.js')
const $ = require('jQuery')
const api = 'http://morning-beach-24613.herokuapp.com'

let meals
let goalCalories = 2000

const goalKey = {
  Breakfast: 400,
  Lunch: 600,
  Dinner: 800,
  Snack: 200
}


class Meal {
  constructor(meal) {
    this.name = meal.name
    this.foods = meal.foods
    this.goalCalories = goalKey[this.name]
    this.id = meal.id
  }
  mealCalories() {
    return this.foods.reduce(function(totalCals, food) {
      return totalCals + food.calories
    }, 0)
  }

  createTable() {
    this.foods.forEach((food) => {
      $(`#${this.name.toLowerCase()} #foods-header`).after(
        `<tr class='food-row' data-id=${food.id}>
            <td name='name'> ${food.name} </td>
            <td name='calories'> ${food.calories} </td>
            <td>
              <img class="delete-icon" src="https://raw.githubusercontent.com/mdevoe12/quantified-self/master/images/minus-icon.png"/>
            </td>
          </tr> `)
          mealIconListener(food.id, this);
      })
        $(`#${this.name.toLowerCase()} tr`).last().after(
          `<tr class=meal-${this.name}>
            <td> Total Calories </td>
            <td id="meal-calories"> ${this.mealCalories()} </td>
           </tr>
           <tr class=remaining-${this.name}>
            <td> Remaining Calories </td>
            <td id="remaining-calories"> ${this.goalCalories - this.mealCalories()} </td>
           </tr>`
        )
    }
}

function consumedCalories() {
  return meals.reduce(function(totalCals, meal) {
    return totalCals + meal.mealCalories()
  }, 0)
}

function createMeals(data) {
  return data.map(function(meal) {
    return new Meal(meal)
  })
}

function getMeals() {
  $.ajax({
    method: 'GET',
    url: api + '/api/v1/meals',
    success: function (data) {
      meals = createMeals(data)
      populateMeals(meals)
      if ($('[type=checkbox]').length < 1) {
        changeFoods();
      }
    }
  })
}

function changeFoods() {
  $('#foods [data-id] td').removeAttr('contenteditable')
  $('#foods img').remove()
  $('#foods [data-id]').prepend('<input type="checkbox"></input>')
}

function populateMeals(meals) {
  meals.forEach(function (meal) {
    meal.createTable()
  })
  populateTotals()
}

function populateTotals() {
  $('#totals').append(
    `<tr>
      <td> Goal Calories </td>
      <td> ${goalCalories} </td>
     </tr>
     <tr>
       <td> Calories Consumed </td>
       <td> ${consumedCalories()} </td>
     </tr>
     <tr>
      <td> Remaining Calories </td>
      <td> ${goalCalories - consumedCalories()} </td>
     </tr>`
  )
}

function mealIconListener(foodId, meal) {
  $(`#${meal.name.toLowerCase()} [data-id=${foodId}] .delete-icon`).on('click', function(event) {
    let $target = $(event.target)
    $.ajax({
      method: 'DELETE',
      url: api + `/api/v1/meals/${meal.id}/foods/${foodId}`,
      success: function() {
        $target.parent().parent().remove();
        updatePage();
      }
    })
  })
}

function addFoodListener() {
  $('[data-mealid]').on('click', function(event) {
    event.preventDefault()
    let mealId = $(this).data().mealid
    addFoodsToMeal(mealId)
  })
}

function returnAddFoodCalls(mealId) {
  return $(':checked').map(function(index) {
    let foodId = $(this).parent().data().id
    return $.ajax({
      method: 'POST',
      url: api + `/api/v1/meals/${mealId}/foods/${foodId}`
    })
  })
}

function addFoodsToMeal(mealId) {
  $.when(...returnAddFoodCalls(mealId))
  .done(updatePage())
}

function updatePage() {
  $('.meal-table').children().children('#foods-header').siblings().remove()
  $('#totals').children().remove()
  getMeals();
  $(':checked').prop('checked', false)
}
module.exports = {getMeals, mealIconListener, addFoodListener, changeFoods}
