let fav_div = document.querySelector('.fav-container');
let fav_class = document.querySelector('.fav-meals');



function main() {
  
  if (performance.navigation.TYPE_RELOAD == performance.navigation.type) {
    localStorage.clear();
    console.log('Page reloaded, storage cleared()');
    fav_div.style.display ='none';
  }
  
  getMealsBySearch("b");
    
  // getRandomMeal();
  
}  

main();

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
   <div class="meal-container">
   ${random ? `<span class="random"> Random Recipe </span>` : ""}
       <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
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
        appendToFav(id);
    } 
    : () => {
      btn.style.color = "grey";
      removeFromFav(id);
    })();

    // If there's no favorite meal, remove fav-meal div
    if (getMealsFromLS().length < 1) {
      fav_div.style.display = 'none';
    } else {
      fav_div.style.display = 'inherit';
    }
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

function appendToFav(id) {

  // find all ids from ls storage
  addMealToLS(id);
  ids = getMealsFromLS();
  PopulateFavs(ids);

}

function PopulateFavs(Ids) {
  // let fav_class = document.querySelector('.fav-meals');
    
  // if (ids.length == 5) {
  //   btn = document.createElement("button");
  //   btn.type = 'submit';
  //   btn.innerHTML = 'More'
  //   fav_class.appendChild(btn);
  // }



    Ids.forEach( (id) => {
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
      
        if (!fav_class.innerHTML.includes(meal_doc.innerHTML)) {
          fav_class.appendChild(meal_doc);
        }
        
        else if (fav_class.innerHTML.includes(meal_doc.innerHTML)) {
          // window.alert('Meal already in favorites');
          console.log('Included');
        }
      })
    })
  }

    

function removeFromFav(id) {  
  // document.querySelector('.fav-container').innerHTML = '';
// document.querySelector('.fav-meals').innerHTML = `<ul class="fav-meals">
//   <li><img src="https://www.themealdb.com/images/ingredients/Lime.png" alt="Picture of a Lime">
//       <span> Lime </span></li>
//   <li><img src="https://www.themealdb.com/images/media/meals/1529443236.jpg" alt=""><span> Chicken </span></li>
//   <li><img src="https://www.themealdb.com/images/media/meals/1529443236.jpg" alt=""><span> Chicken </span></li>
//   <li><img src="https://www.themealdb.com/images/media/meals/uttuxy1511382180.jpg" alt=""><span> Pudding</span></li>
// </ul>`;


  // document.querySelector('.fav-container').style.display = 'none';
  // numFavs--;

    removeMealFromLS(id);

    ids = getMealsFromLS()
    PopulateFavs(ids);
  // }

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
