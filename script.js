const search = document.querySelector('#search'),
	submit = document.querySelector('#submit'),
	random = document.querySelector('#random'),
	mealsEl = document.querySelector('#meals'),
	resultHeading = document.querySelector('#result-heading'),
	modal = document.querySelector('#modal'),
	modalBtn = document.querySelector('#modal-btn'),
	modalText = document.querySelector('#modal-text'),
	single_mealEl = document.querySelector('#single-meal');





function showModal(display, text) {
	modal.style.display = `${display}`;
	modalText.innerHTML = `${text}`;
	modalBtn.addEventListener('click', function () {
		modal.style.display = 'none';
	})
}




//seacrh meal and fetch from API
function searchMeal(e) {
	e.preventDefault();

	//clear single meal
	single_mealEl.innerHTML = '';

	//term
	const term = search.value;
	console.log(term)


	//check for empty
	if (term.trim()) {
		fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				resultHeading.innerHTML = `<h2 class='mt-4'>Hasil pencarian dari '${term}' : </h2>`;
				if (data.meals === null) {
					resultHeading.innerHTML = ``;
					showModal('block', `Pencarian untuk ${term} kosong, coba lagi !`);
				} else {
					mealsEl.innerHTML = data.meals.map(meal =>
						`<div class="meal rounded">
						<img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="rounded"/>

						<div class="meal-info rounded" data-mealID="${meal.idMeal}">
							<h3>${meal.strMeal}</h3>
						</div>
					</div>`
					)
						.join('');
				}
			});
		//clear search text
		search.value = '';

	} else {
		// alert('tolong masukkan kata kunci');
		showModal('block', `Tolong Masukkan Kata Kunci`);
	}

}

//fetch meal by ID function
function getMealById(mealID) {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
		.then(res => res.json())
		.then(data => {
			const meal = data.meals[0];
			addMealtoDOM(meal);
		})
}

//fetch random meal
function getRandomMeal() {
	//clear meals and heading
	mealsEl.innerHTML = '';
	resultHeading.innerHTML = '';

	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
		.then(res => res.json())
		.then(data => {
			const meal = data.meals[0];
			addMealtoDOM(meal);
		})
}


//add meal to DOM
function addMealtoDOM(meal) {
	const ingredients = [];
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
		} else {
			break;
		}
	}


	single_mealEl.innerHTML = `
	<div class="single-meal">
		<h1>${meal.strMeal}</h1>
		<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
		<div class"single-meal-info">
			${meal.strCategory ? `<h3>${meal.strCategory}</h3>` : ''}
			${meal.strArea ? `<p class="mb-3">${meal.strArea}</p>` : ''}
		</div>
		<div class="main">
			<p>${meal.strInstructions}</p>
			<h3>Ingredients :</h3>
			<ul>
				${ingredients.map(ing => `<li>${ing}</li>`).join('')}
			</ul>
		</div>
	</div>
	`;
}

//event listener
submit.addEventListener('submit', searchMeal);

random.addEventListener('click', getRandomMeal);


mealsEl.addEventListener('click', e => {
	const mealInfo = e.path.find(item => {
		if (item.classList) {
			return item.classList.contains('meal-info');
		} else {
			return false;
		}
	});
	if (mealInfo) {
		const mealID = mealInfo.getAttribute('data-mealid');
		getMealById(mealID)
	}

});