const fav_div = document.querySelector(".fav-container");
const fav_class = document.querySelector(".fav-meals");
const mealPopup = document.querySelector("#meal-container-popup");
const mealInfoEl = document.querySelector("#meal-info");

function __init() {
	if (performance.navigation.TYPE_RELOAD == performance.navigation.type) {
		localStorage.clear();
		console.log("Page reloaded, storage cleared()");
	}
	fav_div.style.display = "none";

	getMealsBySearch("cake").then(x => {
		x.forEach(y => {
			addMeal(y, false);
		});
	});

	searchMeals();
	// showMealInfo(52900);
}

mealPopup.style.display = "none";
__init();

function refreshRandom() {
	const x = document.querySelector("#meals");

	getRandomMeal();
}

async function searchMeals() {
	const searchBtn = document.getElementById("search_btn");
	const searchInput = document.getElementById("search_input");

	let mealsContainer = document.querySelector("#meals");
	let subText = document.querySelector("#browse_text");

	searchBtn.addEventListener("click", async event => {
		const value = searchInput.value;

		let mealsData = await getMealsBySearch(value);

		// subText.innerHTML = "Yellow Mellow";
		mealsContainer.innerHTML = ""; //clear previous meals
		// fav_class.innerHTML = "";
		localStorage.clear();

		if (mealsData) {
			subText.innerHTML = `Showing results for '${value}'`;
			mealsData.forEach(meal => {
				addMeal(meal, false);
			}); //populate with new meals from search
		} else {
			subText.innerText = `No results found for '${value}'`;
			mealsContainer.innerHTML = " "; //clear previous meals
			document.querySelector(".randomBtn").style.display = "block";
		}
	});

	searchInput.addEventListener("keypress", event => {
		if (event.key === "Enter") {
			event.preventDefault();
			searchBtn.click();
		}
	});
}

async function getRandomMeal() {
	const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

	const respData = await resp.json();
	randomMeal = respData.meals[0];
	addMeal(randomMeal, true);
}

async function getMealById(id) {
	const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

	const respData = await resp.json();
	const meal = respData.meals;
	// addMeal(idMeal, false);
	// addMeal(id, false);
	return meal;
}

async function getMealsBySearch(term) {
	const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
	const resData = await res.json();
	const meals = resData.meals;
	return meals;
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
   ${random ? `<span id="random"> Random Recipe </span>` : ""}
       <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" onclick="showMealInfo(${mealData.idMeal})">
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

	if (btn.style.color == "" || btn.style.color == "grey") {
		btn.style.color = "purple";
		addMealToLS(id);
		displayMealInFavs(id);
	} else {
		btn.style.color = "grey";
		removeMealFromLS(id);
		removeFromFavDiv(id);
	}

	// If there's no favorite meal, remove fav-meal div
	if (getMealsFromLS().length < 1) {
		fav_div.style.display = "none";
	} else {
		fav_div.style.display = "grid";
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

	mealIds = mealIds.filter(id => id !== mealId);

	localStorage.setItem("mealIds", JSON.stringify(mealIds));

	// console.log('mealId', mealId, 'removed from LS meals', localStorage.mealIds);
}

function displayMealInFavs(mealId) {
	// Get meal data
	const mealData = getMealById(mealId).then(x => {
		meal = x[0];

		// Create element for new favorite meal
		const meal_doc = document.createElement("li");
		const meal_img = document.createElement("img");
		const meal_spn = document.createElement("span");
		const del_btn = document.createElement("button");

		meal_doc.id = `fav_${mealId}`;
		del_btn.classList = "del_btn fas fa-close";

		meal_spn.innerText = meal.strMeal;
		meal_img.src = meal.strMealThumb;
		// del_btn.innerText = "X";

		meal_img.addEventListener("click", () => {
			e.preventDefault();
			showMealInfo(mealId);
		});

		del_btn.addEventListener("click", () => {
			toggleHeart(mealId);
		});

		// del_btn.style.display = "none";

		// meal_doc.appendChild(meal_img, meal_spn);
		meal_doc.appendChild(del_btn);
		meal_doc.appendChild(meal_img);
		meal_doc.appendChild(meal_spn);

		fav_class.appendChild(meal_doc);
	});
}

function removeFromFavDiv(id) {
	let elToBeRemoved = document.getElementById(`fav_${id}`);
	elToBeRemoved?.remove();

	// console.log("Element: ", elToBeRemoved, " has been removed from Favorites");
}

async function showMealInfo(mealId) {
	mealData = await getMealById(mealId);
	mealData = mealData[0];
	mealPopup.style.display = "flex"; // show popup

	mealInfoEl.innerHTML = ` <button id="close-popup"><i class="fas fa-close"></i></button>
	<h1>${mealData.strMeal}</h1>
	<div class="tuple">
	<img class="popup-img" src="${mealData.strMealThumb}">
	<ul id="recipes_list">
		<h2>Ingredients:</h2>
	
	</ul>
	</div>
	<p>${mealData.strInstructions}</p>`;

	const popupCloseBtn = document.querySelector("#close-popup");
	let ingredientsEl = document.querySelector("#recipes_list");

	// filter mealData for ingredients only
	const mealArr = Object.entries(mealData);
	const ingredients = mealArr.filter(ingredient => {
		return ingredient[0].match("strIngredient") && ingredient[1] !== "" ? ingredient[1] : null;
	});

	// console.log(ingredients);

	ingredients.forEach(ingredient => {
		let li = document.createElement("li");
		li.innerText = ingredient[1];
		ingredientsEl.appendChild(li);
	});

	popupCloseBtn.addEventListener("click", e => {
		e.preventDefault();
		// console.log("e", e.key);
		mealPopup.style.display = "none";
	});
}

// mealPopup.innerHTML = `
// <button id="close-popup"><i class="fas fa-close"></i></button>
// <h1>Meal title</h1>
// <img src="">
// <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio aspernatur voluptatem totam
// 	recusandae natus. Tempora totam amet consectetur aliquam pariatur.</p>
// <ul>
// 	<li>ing 1 / measure</li>
// 	<li>ing 2 / measure</li>
// 	<li>ing 3 / measure</li>
// </ul>
// `;

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
