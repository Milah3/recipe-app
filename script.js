if (performance.navigation.TYPE_RELOAD == performance.navigation.type) {
  localStorage.clear();
  console.log('Page reloaded, storage cleared()');
}

getMealsBySearch("cake");

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
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();
  const meal = respData.meals;
  // addMeal(idMeal, false);
  // addMeal(id, false);
  return meal;
}

async function getMealsBySearch(term) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
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

function toggleHeart(id) {
  const btn = document.getElementById(id);

  ((btn.style.color == "" | btn.style.color == 'grey')
    ? () => {
        btn.style.color = "purple"
        addMealToLS(id);
        appendToFav(id);
        console.log('appended to fav');
    } 
    : () => {
      removeMealFromLS(id);
      btn.style.color = "grey";

    })();
  }

function addMealToLS(mealId) {
  const mealIds = getMealsFromLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
    // console.log('mealId', mealId, 'added to LS meals', localStorage.mealIds);

}

function getMealsFromLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds == null ? [] : mealIds;
}

function removeMealFromLS(mealId) {
  let mealIds = getMealsFromLS();
  
  mealIds = mealIds.filter((id) => id !== mealId)
  
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds)
  );

  // console.log('mealId', mealId, 'removed from LS meals', localStorage.mealIds);

}

async function appendToFav(id) {
    // Get meal data
    const mealData = getMealById(id).then(x => {
        meal = x[0];
        // Create element for new favorite meal
        const meal_doc = document.createElement('li');
        const meal_img = document.createElement('img');
        const meal_spn = document.createElement('span');
        
          meal_spn.innerText = meal.strMeal;
          meal_img.src = meal.strMealThumb;

        // meal_doc.appendChild(meal_img, meal_spn);
        meal_doc.appendChild(meal_img);
        meal_doc.appendChild(meal_spn);
      
        let fav_class = document.querySelector('.fav-meals');

        fav_class.appendChild(meal_doc);
    });

}

// Code for listing fewer meals
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
//           <i class="fas fa-heart"> </i>
//       </button>
//   </div>`;

//   mealsEl.appendChild(mealEl)

// }
