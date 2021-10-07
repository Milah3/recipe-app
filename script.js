getMealsBySearch('cake');
// getRandomMeal();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const respData = await resp.json();
  randomMeal = respData.meals[0];
  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

  const respData = await resp.json();
  console.log(respData);
  addMeal(idMeal, false);
}

async function getMealsBySearch(term) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  const resData = await res.json();
  const meals = resData.meals;
  const mealsEl = document.getElementById("meals");

  meals.forEach((meal) => {
    addMeal(meal, false);
  });
}

function addMeal(mealData, random = false) {
  const mealsEl = document.getElementById("meals");
  /*
      Alternate way of adding meal div
               const meal = document.createElement('div');
               meal.classList.add('meal')
               meal.innerHTML = `... insert child elements here...`
   */

  mealsEl.innerHTML += ` 
   <div class="meal">
   <div class="meal-header"> 
   ${random ? `<span class="random"> Random Recipe </span>` : ""}
       <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
   </div>
   <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
       <button class="fav-btn" id="${mealData.idMeal}" onclick="toggleHeart(${mealData.idMeal})">
           <i class="fas fa-heart"></i>
       </button>
   </div> 
</div>`;

}

function toggleHeart() {
    const btn = document.getElementById(`${mealData.idMeal}`);
    btn.addEventListener('click', () => {
        // if ()
        btn.style.color == 'purple' ? btn.style.color = 'grey': btn.style.color = 'purple';
    })
}

// if (i < 5) {
//   const mealEl = document.createElement('div');
//   mealEl.classList.add('meal');
//   mealEl.innerHTML = `<div class="meal-header">
//   <span class="random"> ${meal.strMeal} </span>
//   <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
//   </div>
//   <div class="meal-body">
//       <h4>${meal.strMeal}</h4>
//       <button class="fav-btn">
//           <i class="fas fa-heart" ></i>
//       </button>
//   </div>`;

//   mealsEl.appendChild(mealEl)

// }
