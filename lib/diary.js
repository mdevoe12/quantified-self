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
    this.foods = shared.sortById(meal.foods)
    this.goalCalories = goalKey[this.name]
    this.id = meal.id
    this.styleClass = styleClass(this.goalCalories, this.mealCalories() )
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
            <td id="remaining-calories" class=${this.styleClass}> ${this.goalCalories - this.mealCalories()} </td>
           </tr>`
        )
    }
}

function styleClass(goalCals, mealCals) {
  if (goalCals - mealCals < 0) {
    return "remaining-calories-negative"
  } else {
    return "remaining-calories-positive"
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
  return $.ajax({
    method: 'GET',
    url: api + '/api/v1/meals',
    success: function (data) {
      meals = createMeals(data)
      populateMeals(meals)
    }
  })
}

function changeFoods() {
  $('#foods [data-id] td').removeAttr('contenteditable')
  $('#foods #icon-td').remove()
  $('#foods [data-id]').prepend('<td><input type="checkbox"></input></td>')
}

function populateMeals(meals) {
  meals.forEach(function (meal) {
    meal.createTable()
  })
  populateTotals()
}

function populateTotals() {
  let tdClass = styleClass(goalCalories, consumedCalories())
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
      <td class=${tdClass}> ${goalCalories - consumedCalories()} </td>
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
    let foodId = $(this).parent().parent().data().id
    return $.ajax({
      method: 'POST',
      url: api + `/api/v1/meals/${mealId}/foods/${foodId}`
    })
  })
}

function addFoodsToMeal(mealId) {
  $.when(...returnAddFoodCalls(mealId))
  .then(function() {
    updatePage()
  })
}

function updatePage() {
  $('.meal-table').children().children('#foods-header').siblings().remove()
  $('#totals').children().remove()
  getMeals();
  $(':checked').prop('checked', false)
}
module.exports = {getMeals, mealIconListener, addFoodListener, changeFoods}
