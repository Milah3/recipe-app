async function getRandomMeal() {
   const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

   const respData = await resp.json();
   randomMeal = respData.meals[0];
   // console.log(randomMeal);
   addMeal(randomMeal, true);
}

async function getMealById(id) {
   const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
   const respData = await resp.json();

   console.log(respData);

   addMeal(idMeal, false)
}

getMealsBySearch('Chicken');

async function getMealsBySearch(term) {
   const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);

   const meals = await res.json();

   // console.log(meals);
   console.log(Array.from(meals).forEach(meal => console.log(meal.strMeal) ))

   // const output = '';
   // const mealsEl = document.getElementById('meals');

   // const mealsArray = [meals];

   // meals.forEach(meal => {
   //    const mealEl = document.createElement('div');
   //    mealEl.classList.add('meal');
   //    mealEl.innerHTML = `<div class="meal-header"> 
   //    <span class="random"> Random Recipe </span>
   //    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
   //    </div>
   //    <div class="meal-body">
   //        <h4>${meal.strMeal}</h4>
   //        <button class="fav-btn">
   //            <i class="fas fa-heart"></i>
   //        </button>
   //    </div> `
   //    mealsEl.appendChild(mealEl)
   // });
   // mealsEl.innerHTML += output;



}

function addMeal(mealData, random = false) {
   const mealsEl = document.getElementById('meals');
   /*
      Alternate way of adding meal div
               const meal = document.createElement('div');
               meal.classList.add('meal')
               meal.innerHTML = `... insert child elements here...`
   */

   mealsEl.innerHTML = ` 
   <div class="meal">
   <div class="meal-header"> 
   ${random ? `<span class="random"> Random Recipe </span>` : '' }
       <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
   </div>
   <div class="meal-body">
       <h4>${mealData.strMeal}</h4>
       <button class="fav-btn">
           <i class="fas fa-heart"></i>
       </button>
   </div> 
</div>`

   }







/* <div class="meal">
<div class="meal-header">
    <span class="random"> Random Recipe </span>
    <img src="https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg" alt="">
</div>
<div class="meal-body">
    <h4>Veggie-t-ables</h4>
    <button class="fav-btn">
        <i class="fas fa-heart"></i>
    </button>
    
</div> 
</div> */